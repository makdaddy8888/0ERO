import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const employerAllowancesModule: ReviewModule = {
  id: "employer-allowances",
  run(ctx: ReviewContext): ReviewFlag[] {
    if (ctx.employerAllowancesAud <= 0) return [];
    return [
      {
        id: "allowance-double",
        module: "employer-allowances",
        severity: "action",
        title: "Employer allowances may overlap with your deductions",
        explanation: `Your PAYG summary shows $${ctx.employerAllowancesAud.toFixed(2)} in employer allowances (e.g. car, WFH, phone). Allowances are usually taxable income — you can only deduct the actual work cost on top, not the full allowance amount twice.`,
        nextStep:
          "In myTax IT3, declare the allowance as income. Then claim only the work-related portion of expenses that the allowance was meant to cover, reduced by what you already received.",
        detail: `Allowances on record: $${ctx.employerAllowancesAud.toFixed(2)}`,
        relatedCategory: "IT3",
      },
    ];
  },
};
