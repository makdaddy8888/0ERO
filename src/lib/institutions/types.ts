export interface Institution {
  id: string;
  label: string;
  importPreset: string | null;
  importReady: boolean;
  reviewHints?: string[];
}

export interface InstitutionCategory {
  id: string;
  label: string;
  institutions: Institution[];
}

export interface InstitutionRegistry {
  version: number;
  categories: InstitutionCategory[];
}
