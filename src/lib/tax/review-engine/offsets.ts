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
        question:
          "Private health policy details (insurer, membership number) ready for myTax private health offset?",
        relatedCategory: "H",
      });
    }

    if (ctx.donationsAud >= 2) {
      flags.push({
        id: "offset-gifts",
        module: "offsets",
        severity: "info",
        question: "Gift deductions may interact with other offsets — totals reconciled?",
      });
    }

    return flags;
  },
};
