export type ReviewSeverity = "info" | "warning" | "action";

export interface ReviewFlag {
  id: string;
  module: string;
  severity: ReviewSeverity;
  /** Short human headline shown in the UI */
  title: string;
  /** What this check does and what we found in your data */
  explanation: string;
  /** Concrete next step before lodging in myTax */
  nextStep: string;
  /** Optional figures or myTax field reference */
  detail?: string;
  /** myTax schedule letter (e.g. D1, T, H) */
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
