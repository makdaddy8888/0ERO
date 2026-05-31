import type {
  AccountCategory,
  ClassificationConfidence,
  DocumentClassification,
} from "./import-types";

interface ClassifyInput {
  fileName: string;
  textSample: string;
  csvHeaders?: string[];
  isPdf: boolean;
}

const INSTITUTIONS: { id: string; label: string; patterns: RegExp[] }[] = [
  { id: "nab", label: "NAB", patterns: [/\bnab\b/i, /national australia bank/i] },
  { id: "amex", label: "American Express", patterns: [/\bamex\b/i, /american express/i] },
  { id: "cba", label: "CommBank", patterns: [/\bcommbank\b/i, /commonwealth bank/i, /\bcba\b/i] },
  { id: "westpac", label: "Westpac", patterns: [/westpac/i] },
  { id: "anz", label: "ANZ", patterns: [/\banz\b/i] },
  { id: "commsec", label: "CommSec", patterns: [/commsec/i, /comm sec/i] },
  { id: "stake", label: "Stake", patterns: [/\bstake\b/i] },
  { id: "ing", label: "ING", patterns: [/\bing\b/i] },
  { id: "bt", label: "BT Financial", patterns: [/\bbt\b/i, /bt financial/i, /panorama/i] },
  { id: "macquarie", label: "Macquarie", patterns: [/macquarie/i] },
];

const CATEGORY_PATTERNS: { category: AccountCategory; patterns: RegExp[] }[] = [
  {
    category: "credit_card",
    patterns: [
      /credit\s*card/i,
      /\bcc\b/i,
      /card\s*account/i,
      /cardholder/i,
      /visa\s*card/i,
      /mastercard/i,
      /card\s*number/i,
      /card\s*ending/i,
    ],
  },
  {
    category: "savings",
    patterns: [/savings\s*account/i, /\bsaver\b/i, /netbank\s*saver/i, /goal\s*saver/i],
  },
  {
    category: "everyday",
    patterns: [
      /transaction\s*account/i,
      /everyday\s*account/i,
      /cheque\s*account/i,
      /offset\s*account/i,
      /complete\s*access/i,
    ],
  },
  {
    category: "home_loan",
    patterns: [/home\s*loan/i, /mortgage/i, /housing\s*loan/i, /loan\s*account/i],
  },
  {
    category: "broker",
    patterns: [
      /commsec/i,
      /contract\s*note/i,
      /trade\s*confirmation/i,
      /share\s*trade/i,
      /portfolio\s*statement/i,
      /brokerage/i,
      /\bstake\b/i,
      /chess\s*holding/i,
    ],
  },
  {
    category: "wealth",
    patterns: [/wrap\s*account/i, /investment\s*platform/i, /managed\s*portfolio/i],
  },
  {
    category: "super",
    patterns: [/superannuation/i, /\bsuper\b/i, /member\s*statement/i],
  },
  {
    category: "phi",
    patterns: [/private\s*health/i, /\bphi\b/i, /health\s*insurance/i, /medibank/i, /\bbupa\b/i],
  },
  {
    category: "payroll",
    patterns: [/payment\s*summary/i, /payg/i, /income\s*statement/i, /payslip/i],
  },
];

/** Deterministic document classification from filename + content sample. */
export function classifyDocument(input: ClassifyInput): DocumentClassification {
  const haystack = `${input.fileName}\n${input.textSample}`.toLowerCase();
  const headers = (input.csvHeaders ?? []).join(" ").toLowerCase();
  const signals: string[] = [];

  const nabFilename = input.fileName.match(/^(\d{4})-\d{8}-statement\.pdf$/i);
  if (nabFilename) {
    signals.push(`NAB statement filename (••••${nabFilename[1]})`);
  }

  let institution = detectInstitution(haystack, input.fileName);
  if (institution.signal) signals.push(institution.signal);

  if (nabFilename && !institution.id) {
    institution = { id: "nab", label: "NAB", signal: "Institution: NAB (statement filename)" };
  }

  let category = detectCategory(haystack, headers, input.fileName, signals);
  let confidence: ClassificationConfidence = "medium";

  if (nabFilename) {
    category = "credit_card";
    signals.push("Account type hint: credit card (NAB statement export)");
    confidence = "high";
  }

  if (institution.id === "commsec" || institution.id === "stake") {
    category = "broker";
    signals.push("Broker institution detected");
    confidence = "high";
  }

  if (institution.id === "amex") {
    category = "credit_card";
    signals.push("Amex files are treated as credit card");
    confidence = "high";
  }

  if (input.csvHeaders?.length) {
    const headerCategory = classifyFromCsvHeaders(input.csvHeaders);
    if (headerCategory) {
      category = headerCategory.category;
      signals.push(headerCategory.signal);
      confidence = "high";
    }
  }

  if (category === "unknown" && institution.id) {
    category = inferDefaultCategory(institution.id);
    signals.push(`Default category for ${institution.label}`);
    confidence = "low";
  }

  if (signals.length >= 2 && confidence !== "high") confidence = "medium";
  if (signals.length === 0) confidence = "low";

  const accountLabel = buildAccountLabel(
    institution.label,
    category,
    haystack,
    input.fileName,
  );

  return {
    institutionId: institution.id,
    institutionLabel: institution.label,
    accountCategory: category,
    accountLabel,
    confidence,
    signals,
  };
}

function detectInstitution(
  haystack: string,
  fileName: string,
): { id: string | null; label: string; signal?: string } {
  for (const inst of INSTITUTIONS) {
    for (const pattern of inst.patterns) {
      if (pattern.test(haystack) || pattern.test(fileName)) {
        return { id: inst.id, label: inst.label, signal: `Institution: ${inst.label}` };
      }
    }
  }
  if (/national australia bank|\bnab\b/i.test(haystack)) {
    return { id: "nab", label: "NAB", signal: "Institution: NAB (from PDF text)" };
  }
  return { id: null, label: "Unknown institution" };
}

function detectCategory(
  haystack: string,
  headers: string,
  fileName: string,
  signals: string[],
): AccountCategory {
  const combined = `${haystack} ${headers} ${fileName}`;

  for (const { category, patterns } of CATEGORY_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) {
        signals.push(`Account type hint: ${category.replace("_", " ")}`);
        return category;
      }
    }
  }

  return "unknown";
}

function classifyFromCsvHeaders(
  headers: string[],
): { category: AccountCategory; signal: string } | null {
  const joined = headers.join(" ").toLowerCase();

  const hasBalance = /balance|account balance|running balance/.test(joined);
  const hasNarrative = /narrative|description|details/.test(joined);
  const isAmexLike =
    headers.length >= 3 &&
    /date/i.test(headers[0]) &&
    /amount/i.test(headers[headers.length - 1]) &&
    !hasBalance;

  if (isAmexLike) {
    return { category: "credit_card", signal: "CSV layout matches credit card (no balance column)" };
  }

  if (hasBalance && hasNarrative) {
    return { category: "everyday", signal: "CSV has balance + narrative columns (transaction account)" };
  }

  return null;
}

function inferDefaultCategory(institutionId: string): AccountCategory {
  switch (institutionId) {
    case "amex":
      return "credit_card";
    case "commsec":
    case "stake":
      return "broker";
    case "bt":
      return "wealth";
    default:
      return "everyday";
  }
}

function buildAccountLabel(
  institutionLabel: string,
  category: AccountCategory,
  haystack: string,
  fileName: string,
): string {
  const categoryLabel = CATEGORY_LABELS[category] ?? "Account";
  const filenameLast4 = fileName.match(/^(\d{4})-\d{8}-statement\.pdf$/i)?.[1];
  const last4 = filenameLast4 ?? extractLast4(haystack + fileName);
  const suffix = last4 ? ` ••••${last4}` : "";
  return `${institutionLabel} ${categoryLabel}${suffix}`.trim();
}

const CATEGORY_LABELS: Record<AccountCategory, string> = {
  everyday: "Everyday",
  savings: "Savings",
  credit_card: "Credit card",
  broker: "Broker",
  home_loan: "Home loan",
  wealth: "Wealth",
  super: "Super",
  phi: "Private health",
  payroll: "Payroll",
  unknown: "Account",
};

function extractLast4(text: string): string | null {
  const ending = text.match(/(?:ending|card|account)[^\d]*(\d{4})/i);
  if (ending) return ending[1];
  const masked = text.match(/\*{2,}(\d{4})/);
  if (masked) return masked[1];
  return null;
}

export { CATEGORY_LABELS };
