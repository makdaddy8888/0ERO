import { describe, expect, it } from "vitest";
import { processImportFolder } from "./batch-import";
import type { UserDiscoveryProfile } from "@/lib/discovery/user-discovery";

const SAMPLE_NAB_CSV = `Date,Amount,Account Balance,Narrative
01/07/2025,-45.50,1234.56,WOOLWORTHS 1234
02/07/2025,3200.00,4434.56,SALARY ACME PTY LTD`;

function csvFile(name: string, content: string): File {
  const file = new File([content], name, { type: "text/csv" });
  Object.defineProperty(file, "webkitRelativePath", {
    value: `tax-docs/${name}`,
    configurable: true,
  });
  return file;
}

const profile: UserDiscoveryProfile = {
  confirmedInstitutionIds: ["nab"],
  confirmedProductIds: [],
  financialYear: "2025-26",
  updatedAt: "2026-05-31T00:00:00.000Z",
};

describe("processImportFolder", () => {
  it("parses NAB CSV files from a folder selection", async () => {
    const result = await processImportFolder([csvFile("nab-everyday.csv", SAMPLE_NAB_CSV)], profile);

    expect(result.summary.totalFiles).toBe(1);
    expect(result.summary.parsedFiles).toBe(1);
    expect(result.files[0]?.parseStatus).toBe("ok");
    expect(result.summary.totalTransactions).toBe(2);
  });

  it("ignores unsupported file types", async () => {
    const txt = new File(["notes"], "readme.txt", { type: "text/plain" });
    Object.defineProperty(txt, "webkitRelativePath", {
      value: "tax-docs/readme.txt",
      configurable: true,
    });

    const result = await processImportFolder([txt], profile);
    expect(result.summary.totalFiles).toBe(0);
  });
});
