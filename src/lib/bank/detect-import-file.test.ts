import { describe, expect, it } from "vitest";
import { detectWrongImportFile, isPdfFile } from "./detect-import-file";

describe("detectWrongImportFile", () => {
  it("detects PDF without treating as wrong file", () => {
    expect(isPdfFile("statement.pdf")).toBe(true);
    expect(detectWrongImportFile("statement.pdf", "%PDF-1.5")).toBeNull();
  });

  it("allows real CSV through", () => {
    const csv = "Date,Amount,Narrative\n01/07/2025,-10.00,Shop";
    expect(detectWrongImportFile("transactions.csv", csv)).toBeNull();
  });

  it("detects Excel by extension", () => {
    const result = detectWrongImportFile("export.xlsx", "PK\x03\x04");
    expect(result?.kind).toBe("excel");
  });
});
