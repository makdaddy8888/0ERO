import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const offsetsModule: ReviewModule = {
  id: "offsets",
  run(ctx: ReviewContext): ReviewFlag[] {
    const flags: ReviewFlag[] = [];

    if (ctx.hasPrivateHealth === true) {
      flags.push({
        id: "offset-phi",
        module: "offsets",
        severity: "info",
        title: "Private health details needed for the tax offset",
        explanation:
          "If you paid for eligible private hospital cover, you may receive a private health insurance tax offset (rebate). myTax pre-fills some policies, but you should confirm insurer name, membership number, and premium paid.",
        nextStep:
          "Have your annual statement from your insurer ready. Enter or confirm the policy in myTax section H before lodging.",
        relatedCategory: "H",
      });
    }

    if (ctx.donationsAud >= 2) {
      flags.push({
        id: "offset-gifts",
        module: "offsets",
        severity: "info",
        title: "Check donation totals against other offsets",
        explanation:
          "Gift deductions reduce taxable income but don't always stack with other offsets the way you'd expect. Make sure your donation total in myTax matches your receipts and doesn't double-count with employer giving programs.",
        nextStep:
          "Reconcile tagged donations with myTax D9 before lodging. Keep DGR receipts for five years.",
        detail: `$${ctx.donationsAud.toFixed(2)} in donations tagged`,
      });
    }

    return flags;
  },
};
