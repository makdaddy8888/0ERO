import rates from "../rates/fy2025-26.json";
import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const evidenceAuditModule: ReviewModule = {
  id: "evidence-audit",
  run(ctx: ReviewContext): ReviewFlag[] {
    if (ctx.unsubstantiatedItemsAud <= rates.evidenceThresholdAud) return [];

    return [
      {
        id: "evidence-300",
        module: "evidence-audit",
        severity: "warning",
        title: "Some expenses may lack written evidence",
        explanation: `The ATO generally expects written evidence (receipt or invoice) for work expenses over $${rates.evidenceThresholdAud}. You have $${ctx.unsubstantiatedItemsAud.toFixed(2)} tagged without matching documentation in 0ERO.`,
        nextStep:
          "Find receipts or bank statements for each flagged item. For expenses under $300 you may be able to use the exception for multiple small items — but only if each single item is under $300.",
        detail: `$${ctx.unsubstantiatedItemsAud.toFixed(2)} without receipts on file`,
      },
    ];
  },
};
