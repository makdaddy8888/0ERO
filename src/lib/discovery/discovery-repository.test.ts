import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("discovery repository", () => {
  let tmpDir: string;
  let prevDbPath: string | undefined;

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "0ero-discovery-"));
    prevDbPath = process.env.DATABASE_PATH;
    process.env.DATABASE_PATH = path.join(tmpDir, "test.db");

    // Reset module singletons between tests
    vi.resetModules();
  });

  afterEach(() => {
    if (prevDbPath === undefined) {
      delete process.env.DATABASE_PATH;
    } else {
      process.env.DATABASE_PATH = prevDbPath;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns null when no profile saved", async () => {
    const { loadDiscoveryProfile } = await import("./discovery-repository");
    await expect(loadDiscoveryProfile()).resolves.toBeNull();
  });

  it("saves and loads institution and product selections", async () => {
    const { loadDiscoveryProfile, saveDiscoveryProfile } = await import(
      "./discovery-repository"
    );

    await saveDiscoveryProfile({
      confirmedInstitutionIds: ["nab", "commsec"],
      confirmedProductIds: ["nab-isaver"],
      confirmedDirectInstitutionIds: ["commsec"],
      financialYear: "2025-26",
      updatedAt: "2026-05-31T00:00:00.000Z",
    });

    const loaded = await loadDiscoveryProfile();
    expect(loaded).not.toBeNull();
    expect(loaded!.confirmedProductIds).toEqual(["nab-isaver"]);
    expect(loaded!.confirmedDirectInstitutionIds).toEqual(["commsec"]);
    expect(loaded!.confirmedInstitutionIds.sort()).toEqual(["commsec", "nab"].sort());
  });

  it("saves and loads custom product labels", async () => {
    const { isDiscoveryComplete, loadDiscoveryProfile, saveDiscoveryProfile } =
      await import("./discovery-repository");

    await saveDiscoveryProfile({
      confirmedInstitutionIds: [],
      confirmedProductIds: [],
      confirmedCustomProductLabels: ["Teachers Mutual Bank Offset"],
      confirmedDirectInstitutionIds: [],
      financialYear: "2025-26",
      updatedAt: "2026-05-31T00:00:00.000Z",
    });

    const loaded = await loadDiscoveryProfile();
    expect(loaded?.confirmedCustomProductLabels).toEqual([
      "Teachers Mutual Bank Offset",
    ]);
    await expect(isDiscoveryComplete()).resolves.toBe(true);
  });
});
