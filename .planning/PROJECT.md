# 0ERO

## What This Is

0ERO is a local-first, open-source Australian personal tax prep helper. It runs on your machine only (`127.0.0.1`), processes bank exports and documents without cloud calls, and produces a deterministic tax review checklist before you lodge in myTax.

## Core Value

Users can confidently prepare their FY return from local data — with no personal information leaving their machine.

## Requirements

### Validated

- ✓ Local-first Next.js app (127.0.0.1 only) — v0.1
- ✓ Deterministic tax review engine (9 modules) — v0.1
- ✓ NAB + Amex CSV parsers — v0.1
- ✓ Privacy audit script — v0.1
- ✓ Institution/product setup with type-ahead search — v0.2 partial
- ✓ Folder import with classification + gap analysis — v0.2 partial

### Active

- [ ] BMAD-inspired discovery wizard (8 phases, question banks)
- [ ] SQLite persistence for discovery profile + institutions
- [ ] Completeness gate — block `/import` until setup complete
- [ ] Wire import results → SQLite ledger
- [ ] Migrate localStorage profile → SQLite (one-time)

### Out of Scope

- Cloud sync or LLM features — privacy model forbids
- Direct myTax API integration — user lodges manually
- Multi-user SaaS deployment — local single-household tool

## Context

Brownfield codebase mapped 2026-05-31. v0.1 shipped review engine and parsers. v0.2 work started on branch `cursor/dependency-ci-and-roadmap` with setup UI and product catalogs (~140 products across 6 banks). GSD installed on `cursor/gsd-v0.2-discovery` to plan and execute remaining v0.2 scope.

Key gaps: SQLite schema exists but unused; discovery in localStorage; `isDiscoveryComplete()` not wired; review uses empty context.

See: `.planning/codebase/CONCERNS.md`, `docs/BMAD-DISCOVERY.md`, `docs/ROADMAP.md`.

## Constraints

- **Privacy**: No external API calls at runtime — enforced by `scripts/privacy-audit.sh`
- **Tech**: Next.js 15, TypeScript, SQLite/Drizzle, Vitest
- **Local bind**: 127.0.0.1 only in dev/prod scripts
- **Determinism**: Tax review must be reproducible (existing test)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GSD for v0.2 planning | Structured brownfield workflow after map-codebase | — Pending |
| localStorage for discovery (interim) | Fast client-side setup before SQLite wired | ⚠️ Revisit in Phase 1 |
| Product catalogs as JSON | Static, searchable, no API | ✓ Good |

---
*Last updated: 2026-05-31 after map-codebase + GSD init*
