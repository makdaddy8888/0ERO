import type { ParsedTransaction } from "./types";

export type AccountCategory =
  | "everyday"
  | "savings"
  | "credit_card"
  | "broker"
  | "home_loan"
  | "wealth"
  | "super"
  | "phi"
  | "payroll"
  | "unknown";

export type ClassificationConfidence = "high" | "medium" | "low";

export type ParseStatus = "ok" | "partial" | "failed" | "skipped";

export interface DocumentClassification {
  institutionId: string | null;
  institutionLabel: string;
  accountCategory: AccountCategory;
  accountLabel: string;
  confidence: ClassificationConfidence;
  /** Why we chose this classification */
  signals: string[];
}

export interface ProcessedFile {
  id: string;
  fileName: string;
  relativePath: string;
  fileKind: "csv" | "pdf" | "other";
  classification: DocumentClassification;
  parseStatus: ParseStatus;
  parseFormat: string | null;
  transactionCount: number;
  transactions: ParsedTransaction[];
  dateRange: { from: string; to: string } | null;
  error: string | null;
}

export interface DiscoveredAccount {
  key: string;
  institutionId: string | null;
  institutionLabel: string;
  accountCategory: AccountCategory;
  accountLabel: string;
  fileCount: number;
  transactionCount: number;
  dateRange: { from: string; to: string } | null;
}

export interface AccountGapQuestion {
  id: string;
  severity: "action" | "info";
  title: string;
  explanation: string;
  nextStep: string;
}

export interface BatchImportResult {
  files: ProcessedFile[];
  accounts: DiscoveredAccount[];
  gaps: AccountGapQuestion[];
  summary: {
    totalFiles: number;
    parsedFiles: number;
    failedFiles: number;
    skippedFiles: number;
    totalTransactions: number;
  };
}
