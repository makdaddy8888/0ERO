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
        question:
          "Are you using cents-per-km (max 5,000 km) or logbook for work-related car use?",
        detail: `Cents/km estimate: $${centsClaim.toFixed(2)} (88c/km) vs logbook: $${ctx.carLogbookExpensesAud.toFixed(2)}`,
        relatedCategory: "D1",
      },
    ];

    if (ctx.carKmClaimed > rates.carCentsPerKmMaxKm) {
      flags.push({
        id: "car-km-cap",
        module: "car-comparison",
        severity: "warning",
        question: `Cents-per-km method is capped at ${rates.carCentsPerKmMaxKm} km — do you need logbook instead?`,
      });
    }
    return flags;
  },
};
