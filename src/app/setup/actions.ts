"use server";

import {
  loadDiscoveryProfile,
  saveDiscoveryProfile,
} from "@/lib/discovery/discovery-repository";
import type { UserDiscoveryProfile } from "@/lib/discovery/user-discovery";

function validateProfile(profile: UserDiscoveryProfile): void {
  if (!profile.financialYear?.trim()) {
    throw new Error("Financial year is required.");
  }
  if (!Array.isArray(profile.confirmedInstitutionIds)) {
    throw new Error("confirmedInstitutionIds must be an array.");
  }
}

export async function getSetupProfileAction(): Promise<UserDiscoveryProfile | null> {
  try {
    return await loadDiscoveryProfile();
  } catch (error) {
    console.error("[0ERO setup load]", error);
    throw new Error(
      "Could not load setup from database. Run: npm run dev:clean",
    );
  }
}

export async function saveSetupProfileAction(
  profile: UserDiscoveryProfile,
): Promise<{ ok: true }> {
  validateProfile(profile);
  try {
    await saveDiscoveryProfile(profile);
  } catch (error) {
    console.error("[0ERO setup save]", error);
    throw new Error(
      "Could not save setup to database. Run: npm run dev:clean",
    );
  }
  return { ok: true };
}
