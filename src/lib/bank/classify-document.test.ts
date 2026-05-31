import { describe, expect, it } from "vitest";
import { classifyDocument } from "./classify-document";
import { analyseAccountGaps } from "@/lib/discovery/account-gaps";
import type { DiscoveredAccount, ProcessedFile } from "./import-types";
import type { UserDiscoveryProfile } from "@/lib/discovery/user-discovery";

describe("classifyDocument", () => {
  it("classifies NAB everyday CSV by headers", () => {
    const result = classifyDocument({
      fileName: "export.csv",
      textSample: "",
      csvHeaders: ["Date", "Amount", "Account Balance", "Narrative"],
      isPdf: false,
    });
    expect(result.accountCategory).toBe("everyday");
    expect(result.confidence).toBe("high");
  });

  it("classifies NAB credit card from statement filename pattern", () => {
    // Fictional last-4 digits — not a real account number
    const result = classifyDocument({
      fileName: "1234-20251202-statement.pdf",
      textSample: "National Australia Bank credit card statement",
      isPdf: true,
    });
    expect(result.institutionId).toBe("nab");
    expect(result.accountCategory).toBe("credit_card");
    expect(result.accountLabel).toContain("1234");
    expect(result.confidence).toBe("high");
  });

  it("classifies NAB credit card from filename alone", () => {
    const result = classifyDocument({
      fileName: "8255-20251202-statement.pdf",
      textSample: "",
      isPdf: true,
    });
    expect(result.institutionId).toBe("nab");
    expect(result.accountCategory).toBe("credit_card");
    expect(result.accountLabel).toBe("NAB Credit card ••••8255");
    expect(result.confidence).toBe("high");
  });

  it("classifies Amex from filename", () => {
    const result = classifyDocument({
      fileName: "amex-activity.csv",
      textSample: "",
      isPdf: false,
    });
    expect(result.institutionId).toBe("amex");
    expect(result.accountCategory).toBe("credit_card");
  });

  it("classifies a major broker from PDF text", () => {
    const result = classifyDocument({
      fileName: "statement.pdf",
      textSample: "CommSec Portfolio Statement Contract note CHESS",
      isPdf: true,
    });
    expect(result.institutionId).toBe("commsec");
    expect(result.accountCategory).toBe("broker");
  });
});

describe("analyseAccountGaps", () => {
  /** Fictional setup profile — not a real user's institution list. */
  const fictionalProfile: UserDiscoveryProfile = {
    confirmedInstitutionIds: ["cba", "cba-cc", "selfwealth"],
    financialYear: "2025-26",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("prompts setup when no profile institutions are confirmed", () => {
    const gaps = analyseAccountGaps([], [], null);
    expect(gaps.some((g) => g.id === "setup-incomplete")).toBe(true);
  });

  it("asks about confirmed institutions missing from import", () => {
    const accounts: DiscoveredAccount[] = [
      {
        key: "cba|everyday",
        institutionId: "cba",
        institutionLabel: "CommBank",
        accountCategory: "everyday",
        accountLabel: "CommBank Everyday",
        fileCount: 1,
        transactionCount: 50,
        dateRange: { from: "2025-07-01", to: "2025-12-31" },
      },
    ];
    const gaps = analyseAccountGaps(accounts, [], fictionalProfile);
    expect(gaps.some((g) => g.id === "missing-cba-cc")).toBe(true);
    expect(gaps.some((g) => g.id === "missing-selfwealth")).toBe(true);
    expect(gaps.some((g) => g.id === "broker-missing")).toBe(false);
  });

  it("does not flag missing credit card when classified files are present", () => {
    const nabProfile: UserDiscoveryProfile = {
      confirmedInstitutionIds: ["nab", "nab-cc"],
      financialYear: "2025-26",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const files: ProcessedFile[] = [
      {
        id: "1",
        fileName: "8255-20251202-statement.pdf",
        relativePath: "8255-20251202-statement.pdf",
        fileKind: "pdf",
        classification: {
          institutionId: "nab",
          institutionLabel: "NAB",
          accountCategory: "credit_card",
          accountLabel: "NAB Credit card ••••8255",
          confidence: "high",
          signals: [],
        },
        parseStatus: "failed",
        parseFormat: null,
        transactionCount: 0,
        transactions: [],
        dateRange: null,
        error: "No transaction rows",
      },
    ];
    const gaps = analyseAccountGaps([], files, nabProfile);
    expect(gaps.some((g) => g.id === "missing-nab-cc")).toBe(false);
    expect(gaps.some((g) => g.id === "failed-files")).toBe(true);
  });

  it("flags failed files", () => {
    const files: ProcessedFile[] = [
      {
        id: "1",
        fileName: "bad.pdf",
        relativePath: "bad.pdf",
        fileKind: "pdf",
        classification: {
          institutionId: "cba",
          institutionLabel: "CommBank",
          accountCategory: "everyday",
          accountLabel: "CommBank Everyday",
          confidence: "low",
          signals: [],
        },
        parseStatus: "failed",
        parseFormat: null,
        transactionCount: 0,
        transactions: [],
        dateRange: null,
        error: "No text",
      },
    ];
    const gaps = analyseAccountGaps([], files, fictionalProfile);
    expect(gaps.some((g) => g.id === "failed-files")).toBe(true);
  });
});
