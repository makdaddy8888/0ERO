export type ReviewSeverity = "info" | "warning" | "action";

export interface ReviewFlag {
  id: string;
  module: string;
  severity: ReviewSeverity;
  question: string;
  detail?: string;
  relatedCategory?: string;
}

export interface ReviewContext {
  financialYear: string;
  /** Tagged deductible total in AUD (not cents) for quick checks */
  taggedDeductionsAud: number;
  wfhTotalHours: number;
  wfhActualExpensesAud: number;
  carKmClaimed: number;
  carLogbookExpensesAud: number;
  hasPrivateHealth?: boolean;
  spouseTaxableIncomeAud?: number;
  cgtNetGainAud: number;
  employerAllowancesAud: number;
  selfEducationAud: number;
  donationsAud: number;
  toolsAud: number;
  phoneInternetAud: number;
  unsubstantiatedItemsAud: number;
}

export interface ReviewModule {
  id: string;
  run(ctx: ReviewContext): ReviewFlag[];
}
