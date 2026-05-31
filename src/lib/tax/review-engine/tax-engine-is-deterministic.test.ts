import { describe, expect, it } from "vitest";
import { runFullReview, type ReviewContext } from "./index";

const sampleContext: ReviewContext = {
  financialYear: "2025-26",
  taggedDeductionsAud: 1200,
  wfhTotalHours: 100,
  wfhActualExpensesAud: 50,
  carKmClaimed: 6000,
  carLogbookExpensesAud: 2000,
  hasPrivateHealth: false,
  spouseTaxableIncomeAud: 45000,
  cgtNetGainAud: 1500,
  employerAllowancesAud: 500,
  selfEducationAud: 800,
  donationsAud: 100,
  toolsAud: 450,
  phoneInternetAud: 240,
  unsubstantiatedItemsAud: 900,
};

describe("tax review engine", () => {
  it("is deterministic for the same input", () => {
    const a = runFullReview(sampleContext);
    const b = runFullReview(sampleContext);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });
});
