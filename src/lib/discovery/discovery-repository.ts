/** Server-only — import from Server Actions or Server Components only. */

import { eq } from "drizzle-orm";
import { deriveRegistryInstitutionIds } from "@/lib/institutions/products";
import { getDb, schema } from "@/lib/db";
import {
  getDefaultFinancialYear,
  isDiscoveryComplete as isProfileComplete,
  type UserDiscoveryProfile,
} from "@/lib/discovery/user-discovery";

const { userInstitutions, householdProfile } = schema;

export async function loadDiscoveryProfile(
  fy?: string,
): Promise<UserDiscoveryProfile | null> {
  const financialYear = fy ?? getDefaultFinancialYear();
  const db = getDb();

  const rows = await db
    .select()
    .from(userInstitutions)
    .where(eq(userInstitutions.financialYear, financialYear));

  if (rows.length === 0) return null;

  const productIds = rows
    .filter((r) => r.kind === "product")
    .map((r) => r.entityId)
    .sort();
  const customProductLabels = rows
    .filter((r) => r.kind === "custom")
    .map((r) => r.entityId)
    .sort();
  const directInstitutionIds = rows
    .filter((r) => r.kind === "institution")
    .map((r) => r.entityId)
    .sort();

  const household = await db
    .select({ setupConfirmedAt: householdProfile.setupConfirmedAt })
    .from(householdProfile)
    .where(eq(householdProfile.financialYear, financialYear))
    .limit(1);

  const updatedAt =
    household[0]?.setupConfirmedAt ??
    rows.reduce(
      (latest, row) => (row.createdAt > latest ? row.createdAt : latest),
      rows[0]!.createdAt,
    );

  return {
    confirmedInstitutionIds: deriveRegistryInstitutionIds(
      productIds,
      directInstitutionIds,
    ),
    confirmedProductIds: productIds,
    confirmedCustomProductLabels: customProductLabels,
    confirmedDirectInstitutionIds: directInstitutionIds,
    financialYear,
    updatedAt,
  };
}

export async function saveDiscoveryProfile(
  profile: UserDiscoveryProfile,
): Promise<void> {
  const db = getDb();
  const now = profile.updatedAt || new Date().toISOString();
  const productIds = [...(profile.confirmedProductIds ?? [])].sort();
  const customProductLabels = [...(profile.confirmedCustomProductLabels ?? [])].sort();
  const directInstitutionIds = [
    ...(profile.confirmedDirectInstitutionIds ??
      (profile.confirmedProductIds?.length
        ? []
        : profile.confirmedInstitutionIds)),
  ].sort();

  await db
    .delete(userInstitutions)
    .where(eq(userInstitutions.financialYear, profile.financialYear));

  const rows = [
    ...productIds.map((entityId) => ({
      financialYear: profile.financialYear,
      kind: "product" as const,
      entityId,
      createdAt: now,
    })),
    ...customProductLabels.map((entityId) => ({
      financialYear: profile.financialYear,
      kind: "custom" as const,
      entityId,
      createdAt: now,
    })),
    ...directInstitutionIds.map((entityId) => ({
      financialYear: profile.financialYear,
      kind: "institution" as const,
      entityId,
      createdAt: now,
    })),
  ];

  if (rows.length > 0) {
    await db.insert(userInstitutions).values(rows);
  }

  await db
    .insert(householdProfile)
    .values({
      financialYear: profile.financialYear,
      setupConfirmedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: householdProfile.financialYear,
      set: {
        setupConfirmedAt: now,
        updatedAt: now,
      },
    });
}

export async function isDiscoveryComplete(fy?: string): Promise<boolean> {
  const profile = await loadDiscoveryProfile(fy);
  return isProfileComplete(profile);
}
