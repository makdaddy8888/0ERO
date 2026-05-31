import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const deductionValidityModule: ReviewModule = {
  id: "deduction-validity",
  run(ctx: ReviewContext): ReviewFlag[] {
    const flags: ReviewFlag[] = [];
    if (ctx.taggedDeductionsAud <= 0) {
      flags.push({
        id: "ded-none",
        module: "deduction-validity",
        severity: "info",
        title: "No work deductions in your ledger yet",
        explanation: `For FY ${ctx.financialYear}, 0ERO adds up expenses you've tagged as work-related (WFH, car, phone, tools, self-education, etc.). Your ledger is still empty — that's expected if you haven't imported bank CSVs or tagged anything yet.`,
        nextStep:
          "Complete Setup, import your bank exports, then tag deductible purchases. Re-run this review. If you have nothing to claim, leave work-related deductions blank in myTax.",
      });
    }
    if (ctx.taggedDeductionsAud > 50000) {
      flags.push({
        id: "ded-high",
        module: "deduction-validity",
        severity: "warning",
        title: "Your tagged deductions are unusually high",
        explanation: `You've tagged $${ctx.taggedDeductionsAud.toFixed(2)} in work-related deductions. Large totals attract ATO attention — private spending, capital items, and expenses already reimbursed by your employer must be excluded.`,
        nextStep:
          "Walk through each tagged category and remove anything personal, one-off capital purchases, or already covered by an allowance. Keep receipts for anything over the evidence threshold.",
        detail: `Total tagged: $${ctx.taggedDeductionsAud.toFixed(2)}`,
      });
    }
    return flags;
  },
};
