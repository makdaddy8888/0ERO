import rates from "../rates/fy2025-26.json";
import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const phiMedicareSpouseModule: ReviewModule = {
  id: "phi-medicare-spouse",
  run(ctx: ReviewContext): ReviewFlag[] {
    const flags: ReviewFlag[] = [];

    if (ctx.hasPrivateHealth === false) {
      flags.push({
        id: "phi-none",
        module: "phi-medicare-spouse",
        severity: "info",
        question:
          "No private health cover recorded — could Medicare levy surcharge apply based on income?",
        relatedCategory: "H",
      });
    }

    if (ctx.spouseTaxableIncomeAud !== undefined) {
      flags.push({
        id: "spouse-income",
        module: "phi-medicare-spouse",
        severity: "info",
        question:
          "Spouse taxable income affects family MLS thresholds and some offsets — entered correctly in myTax?",
        detail: `Spouse income: $${ctx.spouseTaxableIncomeAud.toFixed(2)} (family MLS threshold reference $${rates.medicareLevySurchargeThresholds.family})`,
      });
    }

    return flags;
  },
};
