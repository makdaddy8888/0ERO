import rates from "../rates/fy2025-26.json";
import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const carComparisonModule: ReviewModule = {
  id: "car-comparison",
  run(ctx: ReviewContext): ReviewFlag[] {
    if (ctx.carKmClaimed <= 0 && ctx.carLogbookExpensesAud <= 0) return [];

    const cappedKm = Math.min(ctx.carKmClaimed, rates.carCentsPerKmMaxKm);
    const centsClaim = cappedKm * rates.carCentsPerKm;

    const flags: ReviewFlag[] = [
      {
        id: "car-method",
        module: "car-comparison",
        severity: "info",
        title: "Choose cents-per-km or logbook for car expenses",
        explanation: `Work-related car costs can be claimed using the cents-per-km shortcut (${rates.carCentsPerKm * 100}c/km, max ${rates.carCentsPerKmMaxKm.toLocaleString()} km) or a 12-week logbook for actual costs. You pick one method per car for the year — you can't switch mid-year or use both.`,
        nextStep: `Your cents/km estimate is $${centsClaim.toFixed(2)} (${cappedKm} km) vs logbook expenses of $${ctx.carLogbookExpensesAud.toFixed(2)}. Choose the method that gives the better result and that you can substantiate.`,
        detail: `Cents/km: $${centsClaim.toFixed(2)} · Logbook: $${ctx.carLogbookExpensesAud.toFixed(2)}`,
        relatedCategory: "D1",
      },
    ];

    if (ctx.carKmClaimed > rates.carCentsPerKmMaxKm) {
      flags.push({
        id: "car-km-cap",
        module: "car-comparison",
        severity: "warning",
        title: "You exceeded the cents-per-km kilometre cap",
        explanation: `You logged ${ctx.carKmClaimed.toLocaleString()} km but the cents-per-km method only covers up to ${rates.carCentsPerKmMaxKm.toLocaleString()} km per car per year. Extra kilometres can't be claimed under this shortcut.`,
        nextStep:
          "Either cap your claim at 5,000 km under cents-per-km, or switch to a logbook method if you drove more work km and have fuel/repair records.",
        relatedCategory: "D1",
      });
    }
    return flags;
  },
};
