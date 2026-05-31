/** Granular bank product — maps to a registry institution for import gap checks. */

export type ProductCategoryId =
  | "everyday"
  | "savings"
  | "credit_card"
  | "home_loan"
  | "personal_loan"
  | "business"
  | "broker"
  | "debit_card"
  | "term_deposit";

export interface InstitutionProduct {
  id: string;
  institutionId: string;
  institutionLabel: string;
  /** Registry institution id used by import / gap analysis (e.g. nab, nab-cc, nab-home-loan) */
  registryInstitutionId: string;
  label: string;
  categoryId: ProductCategoryId;
  categoryLabel: string;
  keywords?: string[];
  importReady?: boolean;
  /** false = discontinued but still searchable for existing customers */
  active?: boolean;
}

export interface InstitutionProductCatalog {
  version: number;
  institutionId: string;
  institutionLabel: string;
  sourceUrl?: string;
  lastReviewed: string;
  products: InstitutionProduct[];
}
