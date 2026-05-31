/** User-entered account/product names not in the catalog. */

const CUSTOM_LABEL_MAX = 120;

export function normalizeCustomProductLabel(raw: string): string | null {
  const label = raw.trim().replace(/\s+/g, " ");
  if (!label || label.length > CUSTOM_LABEL_MAX) return null;
  return label;
}

export function customProductKey(label: string): string {
  return label.trim().toLowerCase();
}

export function isDuplicateCustomLabel(label: string, existing: Iterable<string>): boolean {
  const key = customProductKey(label);
  for (const item of existing) {
    if (customProductKey(item) === key) return true;
  }
  return false;
}
