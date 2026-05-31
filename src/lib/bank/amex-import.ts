import type { ParsedTransaction } from "./types";

/** Generic Amex CSV: Date, Description, Amount */
export function parseAmexCsv(text: string): ParsedTransaction[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const rows: ParsedTransaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 3) continue;

    const postedAt = parts[0].trim();
    const amountCents = parseAmexAmount(parts[parts.length - 1]);
    const description = parts.slice(1, parts.length - 1).join(",").replace(/^"|"$/g, "");

    rows.push({
      postedAt,
      description,
      amountCents,
      externalId: `amex-${i}-${postedAt}`,
    });
  }
  return rows;
}

function parseAmexAmount(raw: string): number {
  const cleaned = raw.replace(/[$,\s"]/g, "");
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) return 0;
  // Amex charges often positive in export — store as negative outflow when description suggests payment
  return Math.round(n * 100);
}
