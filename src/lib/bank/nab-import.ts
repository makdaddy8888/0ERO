export interface ParsedTransaction {
  postedAt: string;
  description: string;
  amountCents: number;
  balanceCents?: number;
  externalId?: string;
}

/** Generic NAB-style CSV: Date, Amount, Account Balance, Description */
export function parseNabCsv(text: string): ParsedTransaction[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const hasBalance = header.includes("balance");

  const rows: ParsedTransaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = splitCsvLine(line);
    if (cols.length < 3) continue;

    const postedAt = normalizeDate(cols[0]);
    const amountCents = parseAudToCents(cols[1]);
    let description: string;
    let balanceCents: number | undefined;

    if (hasBalance && cols.length >= 4) {
      balanceCents = parseAudToCents(cols[2]);
      description = cols.slice(3).join(", ");
    } else {
      description = cols.slice(2).join(", ");
    }

    rows.push({
      postedAt,
      description: description.trim(),
      amountCents,
      balanceCents,
      externalId: `nab-${i}-${postedAt}`,
    });
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseAudToCents(raw: string): number {
  const cleaned = raw.replace(/[$,\s"]/g, "");
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

function normalizeDate(raw: string): string {
  const t = raw.trim();
  const dmy = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return t;
}
