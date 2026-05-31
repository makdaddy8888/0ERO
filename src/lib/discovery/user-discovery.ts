/** Local-only household discovery — never committed to git. */

export interface UserDiscoveryProfile {
  /** Registry institution ids for import gap analysis (includes product-derived ids) */
  confirmedInstitutionIds: string[];
  /** Granular product ids (e.g. nab-low-rate-card) from institution product catalogs */
  confirmedProductIds?: string[];
  /** Institution ids picked via browse checkboxes only (not derived from products) */
  confirmedDirectInstitutionIds?: string[];
  /** Free-text products the user typed (not in catalog) */
  confirmedCustomProductLabels?: string[];
  financialYear: string;
  updatedAt: string;
}

const STORAGE_KEY = "0ero-discovery-profile";

export function getDefaultFinancialYear(): string {
  return "2025-26";
}

/** @deprecated Use getSetupProfileAction — localStorage migration only */
export function loadDiscoveryProfile(): UserDiscoveryProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserDiscoveryProfile;
    if (!Array.isArray(parsed.confirmedInstitutionIds)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** @deprecated Use saveSetupProfileAction — localStorage migration only */
export function saveDiscoveryProfile(profile: UserDiscoveryProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** @deprecated Used only after successful SQLite migration */
export function clearDiscoveryProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isDiscoveryComplete(profile: UserDiscoveryProfile | null): boolean {
  return hasConfirmedAccounts(profile);
}

export function hasConfirmedAccounts(profile: UserDiscoveryProfile | null): boolean {
  if (profile == null) return false;
  const hasCatalogProducts = (profile.confirmedProductIds?.length ?? 0) > 0;
  const hasCustomProducts = (profile.confirmedCustomProductLabels?.length ?? 0) > 0;
  const hasInstitutions = profile.confirmedInstitutionIds.length > 0;
  return hasInstitutions || hasCatalogProducts || hasCustomProducts;
}
