import {
  clearDiscoveryProfile,
  loadDiscoveryProfile,
  type UserDiscoveryProfile,
} from "@/lib/discovery/user-discovery";

type SaveProfileAction = (
  profile: UserDiscoveryProfile,
) => Promise<{ ok: true }>;

/** One-time migration from localStorage to SQLite on first Setup visit. */
export async function migrateLocalStorageIfNeeded(
  saveAction: SaveProfileAction,
): Promise<UserDiscoveryProfile | null> {
  if (typeof window === "undefined") return null;

  const legacy = loadDiscoveryProfile();
  if (!legacy) return null;

  await saveAction(legacy);
  clearDiscoveryProfile();
  return legacy;
}
