/**
 * Generic myTax-oriented field hints (not exhaustive).
 * Maps internal codes to human labels for review/export UX.
 */
export const ATO_CATEGORIES = {
  D1: { label: "Work-related car expenses", myTaxSection: "deductions" },
  D2: { label: "Travel expenses", myTaxSection: "deductions" },
  D3: { label: "Clothing, laundry and dry-cleaning", myTaxSection: "deductions" },
  D4: { label: "Self-education expenses", myTaxSection: "deductions" },
  D5: { label: "Other work-related expenses", myTaxSection: "deductions" },
  D9: { label: "Gifts or donations", myTaxSection: "deductions" },
  D10: { label: "Cost of managing tax affairs", myTaxSection: "deductions" },
  W: { label: "Working from home", myTaxSection: "deductions" },
  IT1: { label: "Total reportable fringe benefits", myTaxSection: "income" },
  IT2: { label: "Employer exempt income", myTaxSection: "income" },
  IT3: { label: "Other work-related income", myTaxSection: "income" },
  H: { label: "Private health insurance", myTaxSection: "offsets" },
  T: { label: "Capital gains", myTaxSection: "income" },
} as const;

export type AtoCategoryCode = keyof typeof ATO_CATEGORIES;

export function labelForCategory(code: string): string {
  const entry = ATO_CATEGORIES[code as AtoCategoryCode];
  return entry?.label ?? code;
}
