import { parseAudToCents, normalizeDate } from "./csv-utils";
import type { ParsedTransaction, ParseResult } from "./types";

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

/** Date at start of a transaction row */
const DATE_PREFIX =
  /^(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})\s+/;

/** Standalone date line (common in NAB PDF column splits) */
const DATE_ONLY =
  /^(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})$/;

const AMOUNT_ONLY =
  /^(-?\$?\s*[\d,]+\.\d{2})\s*(CR|DR)?\.?\s*$/i;

const SKIP_LINE =
  /^(date|transaction|details|debits|credits|balance|opening|closing|brought forward|carried forward|account number|bsb|page|continued|total|subtotal|national australia bank|\d+\s+of\s+\d+)$/i;

const SKIP_CONTAINS =
  /statement period|minimum payment|credit limit|available credit|closing balance|opening balance|payment due|interest rate|annual fee|nab\.com/i;

const CREDIT_HINT =
  /\b(direct credit|salary|deposit|refund|payment received|thank you|transfer from|interest paid)\b/i;

/**
 * Parse NAB account / credit card statement text extracted from a PDF.
 */
export function parseNabPdfLines(lines: string[]): ParseResult {
  const normalized = lines
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  let transactions = parseSingleLineRows(normalized);
  if (transactions.length === 0) {
    transactions = parseMultiLineRows(normalized);
  }
  if (transactions.length === 0) {
    transactions = parseInlineScan(normalized.join(" "));
  }

  if (transactions.length === 0) {
    return { transactions: [], format: "unknown", headers: [] };
  }

  return {
    transactions,
    format: "nab-pdf",
    headers: ["Date", "Description", "Amount", "Balance"],
  };
}

export function parseNabPdfText(text: string): ParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return parseNabPdfLines(lines);
}

function parseSingleLineRows(lines: string[]): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  for (const line of lines) {
    if (shouldSkipLine(line)) continue;
    const tx = parsePdfTransactionLine(line);
    if (tx) transactions.push(tx);
  }
  return transactions;
}

/** NAB PDFs often split date, merchant, and amount onto separate lines. */
function parseMultiLineRows(lines: string[]): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  let pendingDate: string | null = null;
  let pendingDesc: string[] = [];

  const flush = (amountLine: string) => {
    if (!pendingDate) return;
    const amountMatch = amountLine.match(AMOUNT_ONLY);
    if (!amountMatch) return;

    const description = pendingDesc.join(" ").trim();
    if (!description || shouldSkipLine(description)) {
      pendingDate = null;
      pendingDesc = [];
      return;
    }

    const amountCents = resolveAmount(parseAudToCents(amountMatch[1]), amountMatch[2], description);
    if (amountCents === 0) return;

    transactions.push(buildTx(pendingDate, description, amountCents));
    pendingDate = null;
    pendingDesc = [];
  };

  for (const line of lines) {
    if (shouldSkipLine(line)) continue;

    const dateOnly = line.match(DATE_ONLY);
    if (dateOnly) {
      const postedAt = parsePdfDate(dateOnly[1]);
      if (postedAt) {
        pendingDate = postedAt;
        pendingDesc = [];
      }
      continue;
    }

    if (AMOUNT_ONLY.test(line)) {
      flush(line);
      continue;
    }

    const inline = parsePdfTransactionLine(line);
    if (inline) {
      transactions.push(inline);
      pendingDate = null;
      pendingDesc = [];
      continue;
    }

    if (pendingDate) {
      pendingDesc.push(line);
    }
  }

  return transactions;
}

/** Last resort: find date + text + amount patterns in flattened PDF text. */
function parseInlineScan(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const pattern =
    /(\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+(.{3,80}?)\s+(\$?\s*[\d,]+\.\d{2})\s*(CR|DR)?/gi;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const postedAt = parsePdfDate(match[1]);
    if (!postedAt) continue;

    const description = match[2].trim();
    if (shouldSkipLine(description)) continue;

    const amountCents = resolveAmount(parseAudToCents(match[3]), match[4], description);
    if (amountCents === 0) continue;

    transactions.push(buildTx(postedAt, description, amountCents));
  }

  return dedupeTransactions(transactions);
}

function parsePdfTransactionLine(line: string): ParsedTransaction | null {
  const dateMatch = line.match(DATE_PREFIX);
  if (!dateMatch) return null;

  const postedAt = parsePdfDate(dateMatch[1]);
  if (!postedAt) return null;

  let rest = line.slice(dateMatch[0].length).trim();
  if (!rest || /opening balance|closing balance/i.test(rest)) return null;

  const { description, values, crdr } = extractTrailingAmounts(rest);
  if (values.length === 0 || !description) return null;

  let amountCents: number;
  let balanceCents: number | undefined;

  if (values.length >= 3) {
    const debit = values[values.length - 3];
    const credit = values[values.length - 2];
    balanceCents = values[values.length - 1];
    amountCents = debit > 0 ? -debit : credit;
  } else if (values.length === 2) {
    balanceCents = values[1];
    amountCents = resolveAmount(values[0], crdr, rest);
  } else {
    amountCents = resolveAmount(values[0], crdr, rest);
  }

  if (amountCents === 0) return null;

  return buildTx(postedAt, description, amountCents, balanceCents);
}

function buildTx(
  postedAt: string,
  description: string,
  amountCents: number,
  balanceCents?: number,
): ParsedTransaction {
  return {
    postedAt,
    description,
    amountCents,
    balanceCents,
    externalId: `nab-pdf-${hashRow(postedAt, amountCents, description)}`,
  };
}

function parsePdfDate(raw: string): string | null {
  const iso = normalizeDate(raw);
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;

  const text = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2,4})$/);
  if (text) {
    const month = MONTHS[text[2].toLowerCase()];
    if (!month) return null;
    const year = text[3].length === 2 ? `20${text[3]}` : text[3];
    return `${year}-${month}-${text[1].padStart(2, "0")}`;
  }

  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmy) {
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    return `${year}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }

  return null;
}

function extractTrailingAmounts(rest: string): {
  description: string;
  values: number[];
  crdr: string | undefined;
} {
  const values: number[] = [];
  let crdr: string | undefined;
  let description = rest;

  const amountPattern = /(-?\$?\s*[\d,]+\.\d{2})\s*(CR|DR)?\.?\s*$/i;
  while (amountPattern.test(description.trim())) {
    const match = description.trim().match(amountPattern);
    if (!match) break;
    values.unshift(parseAudToCents(match[1]));
    if (match[2] && !crdr) crdr = match[2].toUpperCase();
    description = description.trim().slice(0, match[0].length * -1).trim();
  }

  return { description, values, crdr };
}

function resolveAmount(
  cents: number,
  crdr: string | undefined,
  context: string,
): number {
  const abs = Math.abs(cents);
  if (crdr === "CR") return abs;
  if (crdr === "DR") return -abs;
  if (cents < 0) return cents;
  if (CREDIT_HINT.test(context)) return abs;
  return -abs;
}

function shouldSkipLine(line: string): boolean {
  if (AMOUNT_ONLY.test(line)) return false;
  if (DATE_ONLY.test(line)) return false;
  if (SKIP_LINE.test(line)) return true;
  if (SKIP_CONTAINS.test(line)) return true;
  return false;
}

function dedupeTransactions(txs: ParsedTransaction[]): ParsedTransaction[] {
  const seen = new Set<string>();
  return txs.filter((tx) => {
    const key = tx.externalId ?? `${tx.postedAt}|${tx.amountCents}|${tx.description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function hashRow(date: string, amountCents: number, description: string): string {
  const raw = `${date}|${amountCents}|${description}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (h << 5) - h + raw.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

/** Extract last-4 account/card digits from NAB statement filenames like 1234-20251202-statement.pdf */
export function parseNabStatementFilename(fileName: string): {
  last4: string;
  statementDate: string | null;
} | null {
  const match = fileName.match(/^(\d{4})-(\d{4})(\d{2})(\d{2})-statement\.pdf$/i);
  if (!match) return null;
  const [, last4, yyyy, mm, dd] = match;
  return {
    last4,
    statementDate: `${yyyy}-${mm}-${dd}`,
  };
}
