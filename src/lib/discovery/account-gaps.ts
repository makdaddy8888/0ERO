import { getCategoryIdForInstitution, getInstitutionById } from "@/lib/institutions";
import type { AccountGapQuestion, DiscoveredAccount, ProcessedFile } from "@/lib/bank/import-types";
import {
  hasConfirmedAccounts,
  type UserDiscoveryProfile,
} from "@/lib/discovery/user-discovery";

/** FY 2025-26 bounds for coverage checks */
const FY_START = "2025-07-01";
const FY_END = "2026-06-30";

const CATEGORY_LABELS: Record<string, string> = {
  bank: "everyday banking",
  credit_card: "credit card",
  broker: "share broker",
  wealth: "wealth platform",
  home_loan: "home loan",
  super: "superannuation",
  phi: "private health insurer",
  payroll: "payroll / income",
};

/**
 * Compare imported files against the user's confirmed institutions (from Setup).
 * Does not assume any institution until the user selects it.
 */
export function analyseAccountGaps(
  accounts: DiscoveredAccount[],
  files: ProcessedFile[],
  profile: UserDiscoveryProfile | null,
): AccountGapQuestion[] {
  const gaps: AccountGapQuestion[] = [];

  if (!profile || !hasConfirmedAccounts(profile)) {
    gaps.push({
      id: "setup-incomplete",
      severity: "action",
      title: "Confirm your institutions first",
      explanation:
        "0ERO doesn't know which banks, cards, or brokers you use until you tell it. Gap checks are based on your Setup selections — not guesses.",
      nextStep: "Open Setup, tick every institution that applies to you, then re-import your folder.",
    });
  } else {
    gaps.push(...gapsForConfirmedInstitutions(accounts, files, profile));
    gaps.push(...gapsForDateCoverage(accounts));
  }

  if (accounts.length === 0 && files.length > 0) {
    gaps.push({
      id: "no-accounts",
      severity: "action",
      title: "No accounts could be read from this folder",
      explanation:
        "None of the files parsed successfully. The folder may contain scanned PDFs, unsupported formats, or exports from institutions without an import preset yet.",
      nextStep:
        "Try CSV or text-based PDF exports from your bank. Include the institution name and account type in filenames (e.g. mybank-everyday.csv, mybank-credit-card.pdf).",
    });
  }

  const failed = files.filter((f) => f.parseStatus === "failed");
  if (failed.length > 0) {
    gaps.push({
      id: "failed-files",
      severity: "action",
      title: `${failed.length} file${failed.length === 1 ? "" : "s"} couldn't be parsed`,
      explanation: `Failed: ${failed.map((f) => f.fileName).join(", ")}. These won't appear in your ledger until fixed.`,
      nextStep:
        "Re-export as CSV from internet banking, or use text-based PDFs. Scanned paper statements won't work.",
    });
  }

  const lowConfidence = files.filter((f) => f.classification.confidence === "low");
  if (lowConfidence.length > 0) {
    gaps.push({
      id: "low-confidence",
      severity: "info",
      title: "Some files were hard to classify",
      explanation: `${lowConfidence.length} file(s) had unclear account types.`,
      nextStep:
        "Rename files to include your bank or broker name and account type, then re-import.",
    });
  }

  return gaps;
}

function gapsForConfirmedInstitutions(
  accounts: DiscoveredAccount[],
  files: ProcessedFile[],
  profile: UserDiscoveryProfile,
): AccountGapQuestion[] {
  const gaps: AccountGapQuestion[] = [];

  for (const instId of profile.confirmedInstitutionIds) {
    const inst = getInstitutionById(instId);
    if (!inst) continue;

    if (institutionWasFound(instId, accounts, files)) continue;

    const categoryId = getCategoryIdForInstitution(instId);
    const categoryHint = categoryId ? CATEGORY_LABELS[categoryId] ?? null : null;

    gaps.push({
      id: `missing-${instId}`,
      severity: "info",
      title: `No files found for ${inst.label}`,
      explanation: `You confirmed ${inst.label} in Setup, but nothing in this folder was classified as that institution.`,
      nextStep: categoryHint
        ? `Add ${categoryHint} exports from ${inst.label}. Put the institution name in the filename so 0ERO can classify them.`
        : `Add exports from ${inst.label} and include its name in the filename.`,
    });
  }

  return gaps;
}

function institutionWasFound(
  instId: string,
  accounts: DiscoveredAccount[],
  files: ProcessedFile[] = [],
): boolean {
  const categoryId = getCategoryIdForInstitution(instId);
  const baseId = instId.replace(/-cc$/, "");

  if (accounts.some((a) => accountMatchesInstitution(instId, categoryId, baseId, a))) {
    return true;
  }

  return files.some((f) =>
    fileMatchesInstitution(instId, categoryId, baseId, f),
  );
}

function accountMatchesInstitution(
  instId: string,
  categoryId: string | null | undefined,
  baseId: string,
  account: DiscoveredAccount,
): boolean {
  if (account.institutionId === instId) return true;

  if (categoryId === "credit_card") {
    return (
      account.accountCategory === "credit_card" &&
      (account.institutionId === instId || account.institutionId === baseId)
    );
  }

  if (categoryId === "bank") {
    return (
      account.institutionId === instId &&
      (account.accountCategory === "everyday" || account.accountCategory === "savings")
    );
  }

  if (categoryId === "broker") {
    return account.institutionId === instId && account.accountCategory === "broker";
  }

  if (categoryId === "wealth") {
    return account.institutionId === instId && account.accountCategory === "wealth";
  }

  if (categoryId === "home_loan") {
    return account.institutionId === instId && account.accountCategory === "home_loan";
  }

  return account.institutionId === instId;
}

function fileMatchesInstitution(
  instId: string,
  categoryId: string | null | undefined,
  baseId: string,
  file: ProcessedFile,
): boolean {
  const { classification } = file;
  const fileInstId = classification.institutionId;

  if (!fileInstId) return false;

  if (categoryId === "credit_card") {
    return (
      classification.accountCategory === "credit_card" &&
      (fileInstId === instId || fileInstId === baseId)
    );
  }

  if (categoryId === "bank") {
    return (
      fileInstId === instId &&
      (classification.accountCategory === "everyday" ||
        classification.accountCategory === "savings")
    );
  }

  if (categoryId === "broker") {
    return fileInstId === instId && classification.accountCategory === "broker";
  }

  if (categoryId === "wealth") {
    return fileInstId === instId && classification.accountCategory === "wealth";
  }

  if (categoryId === "home_loan") {
    return fileInstId === instId && classification.accountCategory === "home_loan";
  }

  return fileInstId === instId;
}

function gapsForDateCoverage(accounts: DiscoveredAccount[]): AccountGapQuestion[] {
  const gaps: AccountGapQuestion[] = [];

  for (const account of accounts) {
    if (!account.dateRange) continue;
    if (account.dateRange.from > FY_START) {
      gaps.push({
        id: `coverage-start-${account.key}`,
        severity: "action",
        title: `${account.accountLabel} — missing early FY data`,
        explanation: `Transactions start ${account.dateRange.from}, but FY 2025-26 begins 1 Jul 2025.`,
        nextStep: `Import ${account.accountLabel} files covering July 2025 onward.`,
      });
    }
    if (account.dateRange.to < FY_END) {
      gaps.push({
        id: `coverage-end-${account.key}`,
        severity: "info",
        title: `${account.accountLabel} — data may not cover full year`,
        explanation: `Latest transaction is ${account.dateRange.to}. Re-import when the year closes if needed.`,
        nextStep: "Add more recent exports before lodging if the financial year has ended.",
      });
    }
  }

  return gaps;
}
