export interface ParsedTransaction {
  postedAt: string;
  description: string;
  amountCents: number;
  balanceCents?: number;
  externalId?: string;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  format: string;
  headers: string[];
}
