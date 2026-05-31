import nabCatalog from "./nab.json";
import cbaCatalog from "./cba.json";
import commsecCatalog from "./commsec.json";
import westpacCatalog from "./westpac.json";
import anzCatalog from "./anz.json";
import stGeorgeCatalog from "./st-george.json";
import type { InstitutionProduct, InstitutionProductCatalog } from "./types";

export type { InstitutionProduct, InstitutionProductCatalog, ProductCategoryId } from "./types";

const catalogs: InstitutionProductCatalog[] = [
  nabCatalog,
  cbaCatalog,
  commsecCatalog,
  westpacCatalog,
  anzCatalog,
  stGeorgeCatalog,
] as InstitutionProductCatalog[];

const productById = new Map<string, InstitutionProduct>(
  catalogs.flatMap((c) => c.products.map((p) => [p.id, p] as const)),
);

export function getProductCatalogs(): InstitutionProductCatalog[] {
  return catalogs;
}

export function getAllProducts(): InstitutionProduct[] {
  return catalogs.flatMap((c) => c.products);
}

export function getProductsForInstitution(institutionId: string): InstitutionProduct[] {
  return getAllProducts().filter((p) => p.institutionId === institutionId);
}

export function getProductById(id: string): InstitutionProduct | undefined {
  return productById.get(id);
}

export function countProductsByInstitution(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const catalog of catalogs) {
    counts[catalog.institutionId] = catalog.products.length;
  }
  return counts;
}

/** Registry institution ids implied by selected products + direct institution picks. */
export function deriveRegistryInstitutionIds(
  productIds: string[],
  directInstitutionIds: string[],
): string[] {
  const ids = new Set(directInstitutionIds);
  for (const productId of productIds) {
    const product = getProductById(productId);
    if (product) ids.add(product.registryInstitutionId);
  }
  return [...ids].sort();
}
