import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const investmentsCgtModule: ReviewModule = {
  id: "investments-cgt",
  run(ctx: ReviewContext): ReviewFlag[] {
    if (ctx.cgtNetGainAud === 0) {
      return [
        {
          id: "cgt-none",
          module: "investments-cgt",
          severity: "info",
          question:
            "No CGT net gain recorded — confirm you have no disposals or losses to carry forward.",
          relatedCategory: "T",
        },
      ];
    }

    return [
      {
        id: "cgt-reconcile",
        module: "investments-cgt",
        severity: "action",
        question:
          "CGT disposals recorded — do proceeds and cost base match contract notes and broker statements?",
        detail: `Net gain/loss (AUD): $${ctx.cgtNetGainAud.toFixed(2)}`,
        relatedCategory: "T",
      },
    ];
  },
};
