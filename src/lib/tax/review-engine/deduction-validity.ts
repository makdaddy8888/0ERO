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
        question: "No tagged deductions for this financial year — is that correct?",
      });
    }
    if (ctx.taggedDeductionsAud > 50000) {
      flags.push({
        id: "ded-high",
        module: "deduction-validity",
        severity: "warning",
        question:
          "Tagged deductions exceed $50,000 — have you excluded private and capital costs?",
        detail: `Total tagged: $${ctx.taggedDeductionsAud.toFixed(2)}`,
      });
    }
    return flags;
  },
};
