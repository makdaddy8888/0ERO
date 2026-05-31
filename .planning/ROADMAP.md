# Roadmap: 0ERO v0.2 — Setup & Discovery

## Overview

Complete the v0.2 milestone: move discovery from localStorage to SQLite, add the BMAD-inspired question wizard, gate import until setup is complete, and connect import data to the ledger so review uses real context.

Aligned with `docs/ROADMAP.md` v0.2 section and `docs/BMAD-DISCOVERY.md`.

## Domain Expertise

None (GSD domain skills not installed)

## Phases

- [ ] **Phase 1: Discovery persistence & gate** — SQLite profile, migrate localStorage, block `/import`
- [ ] **Phase 2: Question wizard** — JSON question banks, phase runner, BMAD 8-phase flow
- [ ] **Phase 3: Import → ledger** — Persist transactions, wire review context from DB
- [ ] **Phase 4: Hardening & tests** — Gate tests, migration tests, parser routing fixes

## Phase Details

### Phase 1: Discovery persistence & gate
**Goal**: Discovery profile and confirmed institutions live in SQLite; `/import` requires completed setup.
**Depends on**: Nothing (first GSD phase)
**Research**: Unlikely (schema exists in `src/lib/db/schema.ts`)
**Plans**: 3 plans

Plans:
- [ ] 01-01: Schema + migration + discovery repository (`discovery-repository.ts`)
- [ ] 01-02: Server Actions + localStorage migration + Setup form wired to SQLite
- [ ] 01-03: Import gate + pass server profile to folder import form

### Phase 2: Question wizard
**Goal**: BMAD-inspired multi-phase intake with JSON question banks for FY 2025-26.
**Depends on**: Phase 1
**Research**: Likely (question bank structure)
**Research topics**: `docs/BMAD-DISCOVERY.md` phase definitions, conditional question logic
**Plans**: TBD

Plans:
- [ ] 02-01: Question bank JSON under `src/lib/discovery/questions/fy2025-26/`
- [ ] 02-02: Phase runner UI component + progress persistence
- [ ] 02-03: Integrate wizard into `/setup` flow

### Phase 3: Import → ledger
**Goal**: Batch import writes to SQLite; review engine reads ledger + profile.
**Depends on**: Phase 1
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Plans:
- [ ] 03-01: Persist import transactions to `transactions` table
- [ ] 03-02: Build review context from ledger + discovery profile

### Phase 4: Hardening & tests
**Goal**: Test coverage for gate, migration, batch persist; fix non-Amex parser routing.
**Depends on**: Phases 1–3
**Research**: Unlikely
**Plans**: TBD

Plans:
- [ ] 04-01: Tests for discovery gate + SQLite migration
- [ ] 04-02: Fix CSV/PDF routing in `batch-import.ts` (institution-aware)

## Progress

**Execution Order:** 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Discovery persistence & gate | 0/3 | Planned | - |
| 2. Question wizard | 0/TBD | Not started | - |
| 3. Import → ledger | 0/TBD | Not started | - |
| 4. Hardening & tests | 0/TBD | Not started | - |
