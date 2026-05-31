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
        title: "No private health cover — check Medicare levy surcharge",
        explanation:
          "Without eligible private hospital cover, you may owe the Medicare levy surcharge (MLS) if your income exceeds the threshold. MLS is on top of the standard Medicare levy — it's not the same as having no Medicare.",
        nextStep:
          "Compare your taxable income to the MLS thresholds in myTax. If you're over the limit and had no hospital cover for the full year, budget for the surcharge.",
        relatedCategory: "H",
      });
    }

    if (ctx.spouseTaxableIncomeAud !== undefined) {
      flags.push({
        id: "spouse-income",
        module: "phi-medicare-spouse",
        severity: "info",
        title: "Spouse income affects family MLS thresholds",
        explanation: `You've recorded spouse taxable income of $${ctx.spouseTaxableIncomeAud.toFixed(2)}. For MLS and some offsets, the ATO uses combined family income — the family threshold ($${rates.medicareLevySurchargeThresholds.family.toLocaleString()} for FY ${ctx.financialYear}) is higher than the single threshold.`,
        nextStep:
          "Enter spouse details accurately in myTax. If you're married or de facto, the family threshold applies even if you file separately.",
        detail: `Spouse income: $${ctx.spouseTaxableIncomeAud.toFixed(2)}`,
      });
    }

    return flags;
  },
};
