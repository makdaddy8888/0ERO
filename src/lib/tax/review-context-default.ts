import type { ReviewContext } from "./review-engine/types";

/** Generic empty template context for demo UI — no personal data. */
export function defaultReviewContext(financialYear = "2025-26"): ReviewContext {
  return {
    financialYear,
    taggedDeductionsAud: 0,
    wfhTotalHours: 0,
    wfhActualExpensesAud: 0,
    carKmClaimed: 0,
    carLogbookExpensesAud: 0,
    cgtNetGainAud: 0,
    employerAllowancesAud: 0,
    selfEducationAud: 0,
    donationsAud: 0,
    toolsAud: 0,
    phoneInternetAud: 0,
    unsubstantiatedItemsAud: 0,
  };
}
