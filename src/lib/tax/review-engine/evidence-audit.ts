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
        question: `Work-related expenses above $${rates.evidenceThresholdAud} generally need written evidence — is documentation complete?`,
        detail: `Items flagged: $${ctx.unsubstantiatedItemsAud.toFixed(2)}`,
      },
    ];
  },
};
