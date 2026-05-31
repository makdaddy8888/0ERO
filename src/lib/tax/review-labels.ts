export const MODULE_LABELS: Record<string, string> = {
  "deduction-validity": "Work-related deductions",
  "employer-allowances": "Employer allowances",
  "wfh-comparison": "Working from home",
  "car-comparison": "Car & travel",
  "category-checks": "Deduction categories",
  "phi-medicare-spouse": "Private health & Medicare",
  offsets: "Tax offsets",
  "investments-cgt": "Shares & capital gains",
  "evidence-audit": "Receipts & evidence",
};

export const SEVERITY_LABELS: Record<string, { label: string; description: string }> = {
  action: {
    label: "Action needed",
    description: "Confirm or fix before you lodge",
  },
  warning: {
    label: "Worth a second look",
    description: "May affect your deduction or create an ATO query",
  },
  info: {
    label: "Heads up",
    description: "Nothing wrong — just something to confirm",
  },
};

export const MYTAX_CATEGORY_HINTS: Record<string, string> = {
  W: "myTax — Working from home expenses",
  D1: "myTax — Car expenses (D1)",
  D4: "myTax — Self-education (D4)",
  D5: "myTax — Other work expenses (D5)",
  D9: "myTax — Gifts and donations (D9)",
  T: "myTax — Net capital gain (item T)",
  H: "myTax — Private health insurance & MLS",
  IT3: "myTax — Employer allowances (IT3)",
};
