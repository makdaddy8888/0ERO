import registry from "./registry.json";
import type { InstitutionCategory, InstitutionRegistry, Institution } from "./types";

export type { Institution, InstitutionCategory, InstitutionRegistry };

const data = registry as InstitutionRegistry;

export function getRegistry(): InstitutionRegistry {
  return data;
}

export function getCategories(): InstitutionCategory[] {
  return data.categories;
}

export function getAllInstitutions(): Institution[] {
  return data.categories.flatMap((c) => c.institutions);
}

export function getInstitutionById(id: string): Institution | undefined {
  return getAllInstitutions().find((i) => i.id === id);
}

export function getCategoryIdForInstitution(institutionId: string): string | undefined {
  return data.categories.find((c) =>
    c.institutions.some((i) => i.id === institutionId),
  )?.id;
}

export function getInstitutionsByCategory(categoryId: string): Institution[] {
  return data.categories.find((c) => c.id === categoryId)?.institutions ?? [];
}

export function getImportReadyInstitutions(): Institution[] {
  return getAllInstitutions().filter((i) => i.importReady);
}

export function countInstitutions(): { total: number; importReady: number } {
  const all = getAllInstitutions();
  return {
    total: all.length,
    importReady: all.filter((i) => i.importReady).length,
  };
}
