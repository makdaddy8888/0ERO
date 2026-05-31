import rates from "../rates/fy2025-26.json";
import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const wfhComparisonModule: ReviewModule = {
  id: "wfh-comparison",
  run(ctx: ReviewContext): ReviewFlag[] {
    if (ctx.wfhTotalHours <= 0 && ctx.wfhActualExpensesAud <= 0) return [];

    const fixed = ctx.wfhTotalHours * rates.wfhFixedRatePerHourAud;
    const flags: ReviewFlag[] = [
      {
        id: "wfh-method",
        module: "wfh-comparison",
        severity: "info",
        question:
          "Which WFH method are you using — fixed rate (67c/hr FY25-26) or actual running expenses?",
        detail: `Fixed estimate: $${fixed.toFixed(2)} vs actual logged: $${ctx.wfhActualExpensesAud.toFixed(2)}`,
        relatedCategory: "W",
      },
    ];

    if (ctx.wfhActualExpensesAud > 0 && fixed > ctx.wfhActualExpensesAud) {
      flags.push({
        id: "wfh-fixed-higher",
        module: "wfh-comparison",
        severity: "warning",
        question:
          "Fixed-rate WFH amount exceeds your actual expenses — confirm you are not mixing methods on the same expenses.",
      });
    }
    return flags;
  },
};
