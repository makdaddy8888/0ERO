import { describe, expect, it } from "vitest";
import { countProductsByInstitution, getProductsForInstitution } from "./products";
import { searchSetupOptions } from "./search-institutions";

describe("product catalogs", () => {
  it("loads all major bank product catalogs", () => {
    const counts = countProductsByInstitution();
    expect(counts.nab).toBeGreaterThan(30);
    expect(counts.cba).toBeGreaterThan(15);
    expect(counts.commsec).toBeGreaterThan(5);
    expect(counts.westpac).toBeGreaterThan(15);
    expect(counts.anz).toBeGreaterThan(15);
    expect(counts["st-george"]).toBeGreaterThan(10);
  });
});

describe("searchSetupOptions — NAB", () => {
  it("finds NAB iSaver", () => {
    const hits = searchSetupOptions("isaver");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "nab-isaver")).toBe(true);
  });
});

describe("searchSetupOptions — CommBank", () => {
  it("finds Smart Access", () => {
    const hits = searchSetupOptions("smart access");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "cba-smart-access")).toBe(
      true,
    );
  });

  it("finds Neo card", () => {
    const hits = searchSetupOptions("commbank neo");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "cba-neo-card")).toBe(true);
  });
});

describe("searchSetupOptions — CommSec", () => {
  it("finds CDIA", () => {
    const hits = searchSetupOptions("cdia");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "commsec-cdia")).toBe(true);
  });

  it("finds Pocket", () => {
    const hits = searchSetupOptions("commsec pocket");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "commsec-pocket")).toBe(true);
  });
});

describe("searchSetupOptions — Westpac", () => {
  it("finds Westpac Choice", () => {
    const hits = searchSetupOptions("westpac choice");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "westpac-choice")).toBe(true);
  });

  it("finds Altitude Black", () => {
    const hits = searchSetupOptions("altitude black");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "westpac-altitude-black")).toBe(
      true,
    );
  });
});

describe("searchSetupOptions — ANZ", () => {
  it("finds Access Advantage", () => {
    const hits = searchSetupOptions("access advantage");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "anz-access-advantage")).toBe(
      true,
    );
  });

  it("finds Simplicity PLUS", () => {
    const hits = searchSetupOptions("simplicity plus");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "anz-simplicity-plus")).toBe(
      true,
    );
  });
});

describe("searchSetupOptions — St.George", () => {
  it("finds Complete Freedom", () => {
    const hits = searchSetupOptions("complete freedom");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "stg-complete-freedom")).toBe(
      true,
    );
  });

  it("finds Vertigo card", () => {
    const hits = searchSetupOptions("st george vertigo");
    expect(hits.some((h) => h.kind === "product" && h.product.id === "stg-vertigo")).toBe(true);
  });
});

describe("searchSetupOptions — institutions", () => {
  it("still finds registry institutions", () => {
    const hits = searchSetupOptions("commsec");
    expect(
      hits.some(
        (h) =>
          (h.kind === "product" && h.product.institutionId === "commsec") ||
          (h.kind === "institution" && h.institution.id === "commsec"),
      ),
    ).toBe(true);
  });

  it("returns products for institution query", () => {
    expect(getProductsForInstitution("cba").length).toBeGreaterThan(15);
  });
});
