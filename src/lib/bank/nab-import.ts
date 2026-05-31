import type { ParsedTransaction, ParseResult } from "./types";
import {
  findColumnIndex,
  normalizeDate,
  normalizeHeader,
  parseAudToCents,
  splitCsvLine,
} from "./csv-utils";

export type { ParsedTransaction, ParseResult };

/**
 * Parse NAB internet banking CSV exports.
 * Supports common column layouts:
 * - Date, Amount, Account Balance, Narrative
 * - Date, Amount, Balance, Description
 * - Date, Narrative, Debit Amount, Credit Amount, Balance
 */
export function parseNabCsv(text: string): ParseResult {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return { transactions: [], format: "empty", headers: [] };
  }

  const headers = splitCsvLine(lines[0]);
  const map = detectNabColumns(headers);

  if (map.date < 0 || map.description < 0) {
    return { transactions: [], format: "unknown", headers };
  }

  const rows: ParsedTransaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 2) continue;

    const postedAt = normalizeDate(cols[map.date] ?? "");
    if (!postedAt) continue;

    const description = (cols[map.description] ?? "").replace(/^"|"$/g, "").trim();
    const amountCents = resolveAmountCents(cols, map);
    const balanceCents =
      map.balance >= 0 ? parseAudToCents(cols[map.balance] ?? "") : undefined;

    const externalId = `nab-${hashRow(postedAt, amountCents, description)}`;

    rows.push({
      postedAt,
      description,
      amountCents,
      balanceCents,
      externalId,
    });
  }

  return {
    transactions: rows,
    format: map.format,
    headers: headers.map((h) => h.replace(/^"|"$/g, "")),
  };
}

interface NabColumnMap {
  date: number;
  description: number;
  amount: number;
  debit: number;
  credit: number;
  balance: number;
  format: string;
}

function detectNabColumns(headers: string[]): NabColumnMap {
  const date = findColumnIndex(headers, "date", "transaction date", "posted date");
  const narrative = findColumnIndex(
    headers,
    "narrative",
    "description",
    "details",
    "transaction description",
    "memo",
  );
  const amount = findColumnIndex(headers, "amount", "transaction amount");
  const debit = findExactColumnIndex(
    headers,
    "debit amount",
    "debit",
    "withdrawal",
    "withdrawals",
  );
  const credit = findExactColumnIndex(
    headers,
    "credit amount",
    "credit",
    "deposit",
    "deposits",
  );
  const balance = findColumnIndex(
    headers,
    "account balance",
    "balance",
    "running balance",
  );

  if (debit >= 0 && credit >= 0 && debit !== credit) {
    return {
      date,
      description: narrative >= 0 ? narrative : findColumnIndex(headers, "narrative"),
      amount: -1,
      debit,
      credit,
      balance,
      format: "nab-debit-credit",
    };
  }

  return {
    date,
    description: narrative,
    amount,
    debit: -1,
    credit: -1,
    balance,
    format: "nab-amount",
  };
}

function resolveAmountCents(cols: string[], map: NabColumnMap): number {
  if (map.debit >= 0 && map.credit >= 0) {
    const debit = parseAudToCents(cols[map.debit] ?? "");
    const credit = parseAudToCents(cols[map.credit] ?? "");
    if (debit !== 0) return -Math.abs(debit);
    if (credit !== 0) return Math.abs(credit);
    return 0;
  }

  if (map.amount >= 0) {
    return parseAudToCents(cols[map.amount] ?? "");
  }

  return 0;
}

function findExactColumnIndex(headers: string[], ...names: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const name of names) {
    const idx = normalized.indexOf(name);
    if (idx >= 0) return idx;
  }
  return -1;
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

/** @deprecated use parseNabCsv — returns transactions only */
export function parseNabCsvLegacy(text: string): ParsedTransaction[] {
  return parseNabCsv(text).transactions;
}
