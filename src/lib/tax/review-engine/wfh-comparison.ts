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
        title: "Pick one WFH calculation method",
        explanation: `The ATO lets you claim working-from-home costs either by the fixed rate (${rates.wfhFixedRatePerHourAud * 100}c per hour for FY ${ctx.financialYear}) or by actual running expenses (electricity, internet, etc.). You can't mix both methods on the same expense.`,
        nextStep: `Compare the fixed-rate estimate ($${fixed.toFixed(2)} from ${ctx.wfhTotalHours} hours) against your actual expenses ($${ctx.wfhActualExpensesAud.toFixed(2)}) and choose whichever is higher — but only if you have the records to support it.`,
        detail: `Fixed rate: $${fixed.toFixed(2)} · Actual: $${ctx.wfhActualExpensesAud.toFixed(2)}`,
        relatedCategory: "W",
      },
    ];

    if (ctx.wfhActualExpensesAud > 0 && fixed > ctx.wfhActualExpensesAud) {
      flags.push({
        id: "wfh-fixed-higher",
        module: "wfh-comparison",
        severity: "warning",
        title: "Fixed-rate WFH claim beats your actual expenses",
        explanation: `The fixed-rate method ($${fixed.toFixed(2)}) is higher than your logged actual expenses ($${ctx.wfhActualExpensesAud.toFixed(2)}). That's fine — many people use fixed rate for simplicity — but you must use fixed rate for all WFH hours and not also claim those same costs as actual expenses.`,
        nextStep:
          "If you choose fixed rate, discard separate claims for electricity/internet for the same hours. Keep a diary of WFH hours in case the ATO asks.",
        relatedCategory: "W",
      });
    }
    return flags;
  },
};
