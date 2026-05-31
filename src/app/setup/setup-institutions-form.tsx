"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCategories,
  getInstitutionById,
} from "@/lib/institutions";
import { deriveRegistryInstitutionIds, getProductById } from "@/lib/institutions/products";
import { searchSetupOptions, type SetupSearchResult } from "@/lib/institutions/search-institutions";
import {
  getDefaultFinancialYear,
  loadDiscoveryProfile,
  saveDiscoveryProfile,
  type UserDiscoveryProfile,
} from "@/lib/discovery/user-discovery";

type SelectedItem =
  | { kind: "product"; id: string; label: string; subtitle: string; importReady?: boolean }
  | { kind: "institution"; id: string; label: string; subtitle: string; importReady?: boolean };

function hitLabel(hit: SetupSearchResult): string {
  return hit.kind === "product" ? hit.product.label : hit.institution.label;
}

function hitId(hit: SetupSearchResult): string {
  return hit.kind === "product" ? hit.product.id : hit.institution.id;
}

function isSelected(
  hit: SetupSearchResult,
  products: Set<string>,
  institutions: Set<string>,
): boolean {
  return hit.kind === "product" ? products.has(hit.product.id) : institutions.has(hit.institution.id);
}

export function SetupInstitutionsForm() {
  const categories = getCategories();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedInstitutions, setSelectedInstitutions] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => searchSetupOptions(query, 10), [query]);

  useEffect(() => {
    const profile = loadDiscoveryProfile();
    if (profile) {
      setSelectedProducts(new Set(profile.confirmedProductIds ?? []));
      setSelectedInstitutions(
        new Set(
          profile.confirmedDirectInstitutionIds ??
            (profile.confirmedProductIds?.length ? [] : profile.confirmedInstitutionIds),
        ),
      );
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  const markDirty = useCallback(() => setSaved(false), []);

  const addHit = useCallback(
    (hit: SetupSearchResult) => {
      if (hit.kind === "product") {
        setSelectedProducts((prev) => new Set(prev).add(hit.product.id));
      } else {
        setSelectedInstitutions((prev) => new Set(prev).add(hit.institution.id));
      }
      markDirty();
      setQuery("");
      setDropdownOpen(false);
      inputRef.current?.focus();
    },
    [markDirty],
  );

  const removeProduct = useCallback(
    (id: string) => {
      setSelectedProducts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      markDirty();
    },
    [markDirty],
  );

  const removeInstitution = useCallback(
    (id: string) => {
      setSelectedInstitutions((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      markDirty();
    },
    [markDirty],
  );

  const toggleInstitution = useCallback(
    (id: string) => {
      setSelectedInstitutions((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      markDirty();
    },
    [markDirty],
  );

  const selectedItems = useMemo((): SelectedItem[] => {
    const items: SelectedItem[] = [];

    for (const id of selectedProducts) {
      const product = getProductById(id);
      if (!product) continue;
      items.push({
        kind: "product",
        id,
        label: product.label,
        subtitle: product.categoryLabel,
        importReady: product.importReady,
      });
    }

    for (const id of selectedInstitutions) {
      const inst = getInstitutionById(id);
      if (!inst) continue;
      items.push({
        kind: "institution",
        id,
        label: inst.label,
        subtitle: "Institution",
        importReady: inst.importReady,
      });
    }

    return items.sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedProducts, selectedInstitutions]);

  const totalCount = selectedProducts.size + selectedInstitutions.size;

  const onSave = () => {
    const productIds = [...selectedProducts].sort();
    const directInstitutionIds = [...selectedInstitutions].sort();
    const institutionIds = deriveRegistryInstitutionIds(productIds, directInstitutionIds);

    const profile: UserDiscoveryProfile = {
      confirmedInstitutionIds: institutionIds,
      confirmedProductIds: productIds,
      confirmedDirectInstitutionIds: directInstitutionIds,
      financialYear: getDefaultFinancialYear(),
      updatedAt: new Date().toISOString(),
    };
    saveDiscoveryProfile(profile);
    setSaved(true);
  };

  const pickSuggestion = (index: number) => {
    const hit = suggestions[index];
    if (hit) addHit(hit);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDropdownOpen(true);
      setHighlightIndex((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (dropdownOpen && suggestions.length > 0) {
        pickSuggestion(highlightIndex);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  if (!loaded) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Type a product name — e.g. &ldquo;NAB iSaver&rdquo;, &ldquo;Low Rate Card&rdquo;, or
        &ldquo;home loan offset&rdquo;. Suggestions appear as you type. You can also browse and
        tick institutions below.
      </p>

      <section className="space-y-4">
        <div className="relative">
          <label htmlFor="institution-search" className="sr-only">
            Search banks and products
          </label>
          <input
            id="institution-search"
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder="Start typing… NAB iSaver, Smart Access, CDIA, Westpac Choice, ANZ Plus…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (query.trim()) setDropdownOpen(true);
            }}
            onBlur={() => {
              window.setTimeout(() => setDropdownOpen(false), 150);
            }}
            onKeyDown={onInputKeyDown}
            className="w-full rounded-xl border border-white/10 bg-ground-100 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-agent-500/50 focus:outline-none focus:ring-2 focus:ring-agent-500/30"
          />

          {dropdownOpen && query.trim() ? (
            <ul
              role="listbox"
              className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-ground-200 py-1 shadow-agent-lg"
            >
              {suggestions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-zinc-500">
                  No match for &ldquo;{query}&rdquo; — try fewer words or browse below.
                </li>
              ) : (
                suggestions.map((hit, index) => {
                  const already = isSelected(hit, selectedProducts, selectedInstitutions);
                  const isProduct = hit.kind === "product";
                  return (
                    <li key={`${hit.kind}-${hitId(hit)}`} role="option" aria-selected={index === highlightIndex}>
                      <button
                        type="button"
                        disabled={already}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addHit(hit)}
                        className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left text-sm transition sm:flex-row sm:items-center sm:gap-3 ${
                          index === highlightIndex
                            ? "bg-agent-600/20 text-zinc-100"
                            : "text-zinc-300 hover:bg-white/5"
                        } ${already ? "opacity-50" : ""}`}
                      >
                        <span className="font-medium">{hitLabel(hit)}</span>
                        <span className="text-xs text-zinc-500">
                          {isProduct ? hit.product.categoryLabel : hit.categoryLabel}
                          {isProduct ? ` · ${hit.product.institutionLabel}` : ""}
                        </span>
                        {already ? (
                          <span className="sm:ml-auto text-xs text-emerald-400">Added</span>
                        ) : isProduct && hit.product.importReady ? (
                          <span className="sm:ml-auto text-xs text-agent-300">import ready</span>
                        ) : !isProduct && hit.institution.importReady ? (
                          <span className="sm:ml-auto text-xs text-agent-300">import ready</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>

        <div className="rounded-2xl border border-agent-500/30 bg-agent-600/10 px-4 py-4">
          <h2 className="text-sm font-semibold text-agent-300">
            Your accounts
            {totalCount > 0 ? (
              <span className="ml-2 font-normal text-zinc-500">({totalCount})</span>
            ) : null}
          </h2>
          {selectedItems.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">
              Start typing — NAB products, cards, loans, and other institutions autocomplete as
              you go.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-agent-500/40 bg-ground-100 py-1 pl-3 pr-1.5 text-sm text-zinc-100">
                    <span>{item.label}</span>
                    <span className="text-xs text-zinc-500">{item.subtitle}</span>
                    <button
                      type="button"
                      onClick={() =>
                        item.kind === "product"
                          ? removeProduct(item.id)
                          : removeInstitution(item.id)
                      }
                      className="rounded-full p-0.5 text-zinc-400 transition hover:bg-white/10 hover:text-red-300"
                      aria-label={`Remove ${item.label}`}
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => setBrowseOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-ground-100 px-4 py-3 text-sm text-zinc-300 transition hover:border-agent-500/30"
        >
          <span>Browse all institutions</span>
          <span className="text-agent-pink-400">{browseOpen ? "Hide" : "Show"}</span>
        </button>

        {browseOpen ? (
          <div className="mt-4 space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {category.label}
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {category.institutions.map((inst) => {
                    const checked = selectedInstitutions.has(inst.id);
                    return (
                      <li key={inst.id}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                            checked
                              ? "border-agent-500/50 bg-agent-600/15 text-zinc-100"
                              : "border-white/10 bg-ground-100 text-zinc-400 hover:border-agent-500/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInstitution(inst.id)}
                            className="h-4 w-4 rounded border-white/20 bg-ground-200 text-agent-500 focus:ring-agent-500"
                          />
                          <span className="truncate">{inst.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
        <button type="button" onClick={onSave} className="agent-btn">
          Save selections
        </button>
        {saved ? (
          <span className="text-sm text-emerald-400">
            Saved locally — {totalCount} item{totalCount === 1 ? "" : "s"}
          </span>
        ) : null}
        {totalCount > 0 ? (
          <Link href="/import" className="text-sm text-agent-pink-400 hover:underline">
            Continue to import →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
