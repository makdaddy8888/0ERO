import { describe, expect, it } from "vitest";
import { groupItemsIntoLines } from "./pdf-extract";

describe("groupItemsIntoLines", () => {
  it("groups items on the same row by Y coordinate", () => {
    const lines = groupItemsIntoLines([
      { str: "02/07/2025", transform: [1, 0, 0, 1, 10, 100] },
      { str: "WOOLWORTHS", transform: [1, 0, 0, 1, 80, 100] },
      { str: "45.50", transform: [1, 0, 0, 1, 200, 100] },
      { str: "03/07/2025", transform: [1, 0, 0, 1, 10, 80] },
      { str: "SALARY", transform: [1, 0, 0, 1, 80, 80] },
    ]);

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("02/07/2025");
    expect(lines[0]).toContain("WOOLWORTHS");
  });
});
