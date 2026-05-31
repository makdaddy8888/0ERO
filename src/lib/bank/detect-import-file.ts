/** Detect PDF by filename or magic bytes (%PDF). */
export function isPdfFile(fileName: string, headText?: string): boolean {
  if (fileName.toLowerCase().endsWith(".pdf")) return true;
  return headText?.trimStart().startsWith("%PDF") ?? false;
}

export type WrongFileKind = "excel" | "binary";

const MESSAGES: Record<WrongFileKind, string> = {
  excel:
    "This looks like an Excel file. Export CSV or a text-based PDF from your bank instead.",
  binary:
    "This file doesn't look like plain-text CSV or PDF. Try CSV or PDF from internet banking.",
};

/**
 * Detect unsupported non-CSV imports (Excel, binary). PDFs are handled separately.
 */
export function detectWrongImportFile(
  fileName: string,
  text: string,
): { kind: WrongFileKind; message: string } | null {
  const lower = fileName.toLowerCase();
  const head = text.slice(0, 512).trimStart();

  if (isPdfFile(fileName, head)) return null;

  const isXlsx =
    lower.endsWith(".xlsx") ||
    lower.endsWith(".xlsm") ||
    (head.startsWith("PK") && head.includes("[Content_Types].xml"));
  const isXls =
    lower.endsWith(".xls") || head.startsWith("\xD0\xCF\x11\xE0");

  if (isXlsx || isXls) {
    return { kind: "excel", message: MESSAGES.excel };
  }

  if (text.includes("\0")) {
    return { kind: "binary", message: MESSAGES.binary };
  }

  return null;
}
