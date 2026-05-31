import { carComparisonModule } from "./car-comparison";
import { categoryChecksModule } from "./category-checks";
import { deductionValidityModule } from "./deduction-validity";
import { employerAllowancesModule } from "./employer-allowances";
import { evidenceAuditModule } from "./evidence-audit";
import { investmentsCgtModule } from "./investments-cgt";
import { offsetsModule } from "./offsets";
import { phiMedicareSpouseModule } from "./phi-medicare-spouse";
import type { ReviewContext, ReviewFlag } from "./types";
import { wfhComparisonModule } from "./wfh-comparison";

const MODULES = [
  deductionValidityModule,
  employerAllowancesModule,
  wfhComparisonModule,
  carComparisonModule,
  categoryChecksModule,
  phiMedicareSpouseModule,
  offsetsModule,
  investmentsCgtModule,
  evidenceAuditModule,
] as const;

export function runFullReview(ctx: ReviewContext): ReviewFlag[] {
  const flags: ReviewFlag[] = [];
  for (const mod of MODULES) {
    flags.push(...mod.run(ctx));
  }
  return flags.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
}

function severityRank(s: ReviewFlag["severity"]): number {
  switch (s) {
    case "action":
      return 0;
    case "warning":
      return 1;
    default:
      return 2;
  }
}

export * from "./types";
export {
  deductionValidityModule,
  employerAllowancesModule,
  wfhComparisonModule,
  carComparisonModule,
  categoryChecksModule,
  phiMedicareSpouseModule,
  offsetsModule,
  investmentsCgtModule,
  evidenceAuditModule,
};
