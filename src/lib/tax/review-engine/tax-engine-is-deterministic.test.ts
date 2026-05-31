import { describe, expect, it } from "vitest";
import { runFullReview, type ReviewContext } from "./index";

/** Fictional unit-test persona only — not based on any real household. */
const fictionalPersona: ReviewContext = {
  financialYear: "2025-26",
  taggedDeductionsAud: 2000,
  wfhTotalHours: 120,
  wfhActualExpensesAud: 100,
  carKmClaimed: 3000,
  carLogbookExpensesAud: 1500,
  hasPrivateHealth: true,
  spouseTaxableIncomeAud: 30000,
  cgtNetGainAud: 2000,
  employerAllowancesAud: 1000,
  selfEducationAud: 500,
  donationsAud: 200,
  toolsAud: 300,
  phoneInternetAud: 360,
  unsubstantiatedItemsAud: 400,
};

describe("tax review engine", () => {
  it("is deterministic for the same input", () => {
    const a = runFullReview(fictionalPersona);
    const b = runFullReview(fictionalPersona);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });
});
