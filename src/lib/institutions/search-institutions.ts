import { getCategories } from "./index";
import type { Institution } from "./types";
import { getAllProducts, type InstitutionProduct } from "./products";

export interface InstitutionSearchHit {
  institution: Institution;
  categoryId: string;
  categoryLabel: string;
}

export interface InstitutionSearchResult extends InstitutionSearchHit {
  kind: "institution";
  score: number;
}

export interface ProductSearchResult {
  kind: "product";
  product: InstitutionProduct;
  score: number;
}

export type SetupSearchResult = InstitutionSearchResult | ProductSearchResult;

function scoreMatch(query: string, ...fields: string[]): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  let best = 0;
  for (const field of fields) {
    const f = field.toLowerCase();
    if (f === q) best = Math.max(best, 100);
    else if (f.startsWith(q)) best = Math.max(best, 85);
    else if (f.includes(q)) best = Math.max(best, 55);

    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every((w) => f.includes(w))) {
      best = Math.max(best, 60);
    }
  }
  return best;
}

/** Search institutions and granular products (NAB catalog first) for Setup type-ahead. */
export function searchSetupOptions(query: string, limit = 10): SetupSearchResult[] {
  const q = query.trim();
  if (q.length < 1) return [];

  const hits: SetupSearchResult[] = [];

  for (const product of getAllProducts()) {
    const score = scoreMatch(
      q,
      product.label,
      product.institutionLabel,
      product.categoryLabel,
      ...(product.keywords ?? []),
    );
    if (score > 0) {
      hits.push({ kind: "product", product, score: score + 5 });
    }
  }

  for (const category of getCategories()) {
    for (const institution of category.institutions) {
      const score = scoreMatch(q, institution.label, institution.id);
      if (score > 0) {
        hits.push({
          kind: "institution",
          institution,
          categoryId: category.id,
          categoryLabel: category.label,
          score,
        });
      }
    }
  }

  return hits
    .sort((a, b) => b.score - a.score || labelOf(a).localeCompare(labelOf(b)))
    .slice(0, limit);
}

function labelOf(hit: SetupSearchResult): string {
  return hit.kind === "product" ? hit.product.label : hit.institution.label;
}

/** @deprecated Use searchSetupOptions */
export function searchInstitutions(query: string, limit = 8): InstitutionSearchResult[] {
  return searchSetupOptions(query, limit).filter(
    (h): h is InstitutionSearchResult => h.kind === "institution",
  );
}

export function listAllInstitutionHits(): InstitutionSearchHit[] {
  return getCategories().flatMap((category) =>
    category.institutions.map((institution) => ({
      institution,
      categoryId: category.id,
      categoryLabel: category.label,
    })),
  );
}
