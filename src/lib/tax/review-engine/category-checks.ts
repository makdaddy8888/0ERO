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
        title: "Self-education must connect to your current job",
        explanation: `You've tagged $${ctx.selfEducationAud.toFixed(2)} in self-education. The ATO only allows courses that maintain or improve skills for your current role — not ones that qualify you for a new career.`,
        nextStep:
          "Check the course outcome against your job description. If it's a career change, remove the claim. Keep enrolment confirmation and payment receipts.",
        detail: `$${ctx.selfEducationAud.toFixed(2)} tagged`,
        relatedCategory: "D4",
      });
    }

    if (ctx.donationsAud > 0) {
      flags.push({
        id: "donations-dgr",
        module: "category-checks",
        severity: "action",
        title: "Donations need DGR status and receipts",
        explanation: `You've tagged $${ctx.donationsAud.toFixed(2)} in donations. Only gifts to deductible gift recipients (DGRs) count — crowdfunding, GoFundMe, and most political donations don't qualify.`,
        nextStep:
          "Verify each recipient has DGR endorsement on the ATO register. Keep bank statements or official receipts showing the amount and date.",
        detail: `$${ctx.donationsAud.toFixed(2)} tagged`,
        relatedCategory: "D9",
      });
    }

    if (ctx.toolsAud > 300) {
      flags.push({
        id: "tools-depreciation",
        module: "category-checks",
        severity: "warning",
        title: "Expensive tools may need depreciation",
        explanation: `Items over $300 are usually treated as depreciating assets — you claim the cost over several years rather than all at once. Cheaper tools can often be written off immediately if they're work-related.`,
        nextStep:
          "Check whether each item is under or over $300 and whether you used it wholly for work. Enter depreciation in myTax or use the instant asset write-off rules if eligible.",
        detail: `$${ctx.toolsAud.toFixed(2)} in tools tagged`,
        relatedCategory: "D5",
      });
    }

    if (ctx.phoneInternetAud > 0) {
      flags.push({
        id: "phone-apportion",
        module: "category-checks",
        severity: "info",
        title: "Phone and internet need a work-use percentage",
        explanation: `You've tagged $${ctx.phoneInternetAud.toFixed(2)} for phone/internet. Unless the plan is 100% for work, you need a reasonable work-use percentage — a diary for a representative month is the usual evidence.`,
        nextStep:
          "Calculate work calls/data as a % of total use. Don't claim the whole bill unless it's a dedicated work line paid by you.",
        detail: `$${ctx.phoneInternetAud.toFixed(2)} tagged`,
        relatedCategory: "D5",
      });
    }

    return flags;
  },
};
