import { describe, expect, it } from "vitest";
import {
  isDuplicateCustomLabel,
  normalizeCustomProductLabel,
} from "./custom-products";

describe("custom products", () => {
  it("normalizes whitespace", () => {
    expect(normalizeCustomProductLabel("  My   offset  ")).toBe("My offset");
  });

  it("rejects empty labels", () => {
    expect(normalizeCustomProductLabel("   ")).toBeNull();
  });

  it("detects duplicate labels case-insensitively", () => {
    expect(isDuplicateCustomLabel("NAB Offset", ["nab offset"])).toBe(true);
  });
});
