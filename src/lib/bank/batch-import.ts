"use client";

import { classifyDocument } from "./classify-document";
import { detectWrongImportFile } from "./detect-import-file";
import { analyseAccountGaps } from "@/lib/discovery/account-gaps";
import type { UserDiscoveryProfile } from "@/lib/discovery/user-discovery";
import type {
  BatchImportResult,
  DiscoveredAccount,
  ProcessedFile,
} from "./import-types";
import { parseAmexCsv } from "./amex-import";
import { parseNabCsv } from "./nab-import";
import { parseNabPdfLines, parseNabStatementFilename } from "./nab-pdf-import";
import { extractPdfLinesFromFile } from "./pdf-extract";
import type { ParsedTransaction } from "./types";

const SKIP_NAMES = /^\.(ds_store|gitkeep)|^thumbs\.db$/i;
const SUPPORTED_EXT = /\.(csv|pdf)$/i;

export async function processImportFolder(
  files: File[],
  profile: UserDiscoveryProfile | null = null,
): Promise<BatchImportResult> {
  const eligible = files
    .filter((f) => SUPPORTED_EXT.test(f.name) && !SKIP_NAMES.test(f.name))
    .sort((a, b) =>
      (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name),
    );

  const processed: ProcessedFile[] = [];
  for (const file of eligible) {
    processed.push(await processOneFile(file));
  }

  const accounts = mergeDiscoveredAccounts(processed);
  const gaps = analyseAccountGaps(accounts, processed, profile);

  const parsedFiles = processed.filter((f) => f.parseStatus === "ok").length;
  const failedFiles = processed.filter((f) => f.parseStatus === "failed").length;
  const skippedFiles = processed.filter((f) => f.parseStatus === "skipped").length;

  return {
    files: processed,
    accounts,
    gaps,
    summary: {
      totalFiles: processed.length,
      parsedFiles,
      failedFiles,
      skippedFiles,
      totalTransactions: processed.reduce((n, f) => n + f.transactionCount, 0),
    },
  };
}

function classifyFileEarly(fileName: string, fileKind: "csv" | "pdf") {
  return classifyDocument({
    fileName,
    textSample: "",
    isPdf: fileKind === "pdf",
  });
}

async function processOneFile(file: File): Promise<ProcessedFile> {
  const relativePath = file.webkitRelativePath || file.name;
  const id = hashId(relativePath);
  const fileKind = file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "csv";

  const base: ProcessedFile = {
    id,
    fileName: file.name,
    relativePath,
    fileKind,
    classification: classifyFileEarly(file.name, fileKind),
    parseStatus: "failed",
    parseFormat: null,
    transactionCount: 0,
    transactions: [],
    dateRange: null,
    error: null,
  };

  try {
    if (fileKind === "pdf") {
      return await processPdfFile(file, base);
    }
    return await processCsvFile(file, base);
  } catch (err) {
    return {
      ...base,
      error:
        err instanceof Error
          ? err.message
          : "Could not read file.",
    };
  }
}

async function processPdfFile(file: File, base: ProcessedFile): Promise<ProcessedFile> {
  const lines = await extractPdfLinesFromFile(file);
  const textSample = lines.join("\n").slice(0, 4000);

  if (textSample.trim().length < 20) {
    return {
      ...base,
      classification: classifyDocument({
        fileName: file.name,
        textSample,
        isPdf: true,
      }),
      parseStatus: "failed",
      error: "PDF has no readable text (may be scanned). Try CSV export instead.",
    };
  }

  const classification = classifyDocument({
    fileName: file.name,
    textSample,
    isPdf: true,
  });

  if (classification.institutionId === "amex") {
    return {
      ...base,
      classification,
      parseStatus: "skipped",
      error: "Amex PDF not supported yet — export CSV from Amex online.",
    };
  }

  const statementMeta = parseNabStatementFilename(file.name);
  const result = parseNabPdfLines(lines, {
    statementDate: statementMeta?.statementDate ?? null,
  });
  if (result.transactions.length === 0) {
    const preview = lines
      .filter((l) => l.length > 4)
      .slice(0, 4)
      .join(" | ");
    return {
      ...base,
      classification,
      parseStatus: "failed",
      error: preview
        ? `Read PDF (${lines.length} lines) but found no transaction rows. Sample: ${preview.slice(0, 200)}… Try CSV export from your bank if this keeps failing.`
        : "Read the PDF but couldn't find transaction rows. Try CSV export from internet banking.",
    };
  }

  return finalize(base, classification, result.transactions, result.format);
}

async function processCsvFile(file: File, base: ProcessedFile): Promise<ProcessedFile> {
  const text = await file.text();
  const wrong = detectWrongImportFile(file.name, text);
  if (wrong) {
    return {
      ...base,
      classification: classifyDocument({
        fileName: file.name,
        textSample: text.slice(0, 4000),
        isPdf: false,
      }),
      parseStatus: "skipped",
      error: wrong.message,
    };
  }

  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0]?.split(",") ?? [];
  const classification = classifyDocument({
    fileName: file.name,
    textSample: text.slice(0, 4000),
    csvHeaders: headers,
    isPdf: false,
  });

  let transactions: ParsedTransaction[] = [];
  let format: string | null = null;

  if (
    classification.institutionId === "amex" ||
    classification.accountCategory === "credit_card"
  ) {
    transactions = parseAmexCsv(text);
    format = transactions.length ? "amex-csv" : null;
  } else {
    const nab = parseNabCsv(text);
    transactions = nab.transactions;
    format = nab.format !== "unknown" && nab.format !== "empty" ? nab.format : null;
  }

  if (!transactions.length) {
    return {
      ...base,
      classification,
      parseStatus: "failed",
      error: "Could not parse CSV — check export format.",
    };
  }

  return finalize(base, classification, transactions, format ?? "csv");
}

function finalize(
  base: ProcessedFile,
  classification: ProcessedFile["classification"],
  transactions: ParsedTransaction[],
  format: string,
): ProcessedFile {
  return {
    ...base,
    classification,
    parseStatus: "ok",
    parseFormat: format,
    transactionCount: transactions.length,
    transactions,
    dateRange: dateRangeFromTransactions(transactions),
    error: null,
  };
}

function dateRangeFromTransactions(
  txs: ParsedTransaction[],
): { from: string; to: string } | null {
  const dates = txs.map((t) => t.postedAt).filter(Boolean).sort();
  if (!dates.length) return null;
  return { from: dates[0], to: dates[dates.length - 1] };
}

function mergeDiscoveredAccounts(files: ProcessedFile[]): DiscoveredAccount[] {
  const map = new Map<string, DiscoveredAccount>();

  for (const file of files) {
    if (file.parseStatus !== "ok") continue;

    const { classification } = file;
    const key = [
      classification.institutionId ?? "unknown",
      classification.accountCategory,
      classification.accountLabel,
    ].join("|");

    const existing = map.get(key);
    if (existing) {
      existing.fileCount += 1;
      existing.transactionCount += file.transactionCount;
      existing.dateRange = mergeDateRanges(existing.dateRange, file.dateRange);
    } else {
      map.set(key, {
        key,
        institutionId: classification.institutionId,
        institutionLabel: classification.institutionLabel,
        accountCategory: classification.accountCategory,
        accountLabel: classification.accountLabel,
        fileCount: 1,
        transactionCount: file.transactionCount,
        dateRange: file.dateRange,
      });
    }
  }

  return [...map.values()].sort((a, b) =>
    a.institutionLabel.localeCompare(b.institutionLabel),
  );
}

function mergeDateRanges(
  a: { from: string; to: string } | null,
  b: { from: string; to: string } | null,
): { from: string; to: string } | null {
  if (!a) return b;
  if (!b) return a;
  return {
    from: a.from < b.from ? a.from : b.from,
    to: a.to > b.to ? a.to : b.to,
  };
}

function hashId(path: string): string {
  let h = 0;
  for (let i = 0; i < path.length; i++) {
    h = (h << 5) - h + path.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}
