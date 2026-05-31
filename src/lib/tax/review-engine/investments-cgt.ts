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
          title: "No capital gains events recorded",
          explanation: `Capital gains tax (CGT) applies when you sell or dispose of investments — shares, ETFs, managed funds, or property. 0ERO doesn't have any disposal records or a net capital gain figure for FY ${ctx.financialYear} yet.`,
          nextStep:
            "If you sold investments this year, import contract notes from your share broker and record each disposal with purchase date, cost base, and sale proceeds. If you didn't sell anything, you can answer 'No' to capital gains in myTax — but double-check you didn't rebuy the same ticker after a sale (that still counts as a disposal).",
          relatedCategory: "T",
        },
      ];
    }

    return [
      {
        id: "cgt-reconcile",
        module: "investments-cgt",
        severity: "action",
        title: "Capital gains need reconciling with broker records",
        explanation: `You've recorded a net capital gain or loss of $${ctx.cgtNetGainAud.toFixed(2)} for this year. The ATO receives broker data — your myTax figure must match contract notes for every disposal, including brokerage and any name/ticker corrections.`,
        nextStep:
          "Open each contract note, confirm cost base (including brokerage on buy and sell), and check whether the 50% CGT discount applies (asset held >12 months). Enter the net amount at myTax item T.",
        detail: `Net gain/loss: $${ctx.cgtNetGainAud.toFixed(2)}`,
        relatedCategory: "T",
      },
    ];
  },
};
