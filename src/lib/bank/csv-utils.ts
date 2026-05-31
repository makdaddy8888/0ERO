export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

export function parseAudToCents(raw: string): number {
  const cleaned = raw.replace(/[$,\s"]/g, "");
  if (!cleaned || cleaned === "-") return 0;
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

/** Normalise DD/MM/YYYY or YYYY-MM-DD to ISO date */
export function normalizeDate(raw: string): string {
  const t = raw.trim().replace(/^"|"$/g, "");
  const dmy = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];
  return t;
}

export function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/^"|"$/g, "");
}

export function findColumnIndex(headers: string[], ...names: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const name of names) {
    const idx = normalized.findIndex(
      (h) => h === name || h.includes(name) || name.includes(h),
    );
    if (idx >= 0) return idx;
  }
  return -1;
}
