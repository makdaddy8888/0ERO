import type { ReviewContext, ReviewFlag, ReviewModule } from "./types";

export const categoryChecksModule: ReviewModule = {
  id: "category-checks",
  run(ctx: ReviewContext): ReviewFlag[] {
    const flags: ReviewFlag[] = [];

    if (ctx.selfEducationAud > 0) {
      flags.push({
        id: "self-edu-nexus",
        module: "category-checks",
        severity: "action",
        question:
          "Self-education expenses require a sufficient connection to current employment — is the course eligible?",
        detail: `$${ctx.selfEducationAud.toFixed(2)} tagged`,
        relatedCategory: "D4",
      });
    }

    if (ctx.donationsAud > 0) {
      flags.push({
        id: "donations-dgr",
        module: "category-checks",
        severity: "action",
        question: "Donations must be to DGR-endorsed entities with receipts — verified?",
        detail: `$${ctx.donationsAud.toFixed(2)} tagged`,
        relatedCategory: "D9",
      });
    }

    if (ctx.toolsAud > 300) {
      flags.push({
        id: "tools-depreciation",
        module: "category-checks",
        severity: "warning",
        question:
          "Tools over $300 may need depreciation rather than immediate deduction — how are you treating them?",
        relatedCategory: "D5",
      });
    }

    if (ctx.phoneInternetAud > 0) {
      flags.push({
        id: "phone-apportion",
        module: "category-checks",
        severity: "info",
        question:
          "Phone/internet claims usually require a work-use percentage — what apportionment did you apply?",
        detail: `$${ctx.phoneInternetAud.toFixed(2)} tagged`,
        relatedCategory: "D5",
      });
    }

    return flags;
  },
};
