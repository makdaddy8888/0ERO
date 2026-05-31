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
        question:
          "You recorded employer allowances — are you claiming deductions for the same expenses without reducing for the allowance?",
        detail: `Allowances total: $${ctx.employerAllowancesAud.toFixed(2)}`,
        relatedCategory: "IT3",
      },
    ];
  },
};
