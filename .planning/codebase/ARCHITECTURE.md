# Architecture

**Analysis date:** 2026-05-31

## Pattern Overview

Local-first **Next.js 15 App Router monolith**. No API layer. Domain logic in pure TypeScript modules under `src/lib/`.

## Layers

```
Browser (127.0.0.1)
  └── src/app/          Presentation (pages, client forms)
  └── src/lib/
        ├── discovery/  Setup profile + gap analysis
        ├── institutions/  Registry + product catalogs
        ├── bank/       CSV/PDF import pipeline (client-side)
        ├── tax/        Deterministic review engine
        └── db/         SQLite/Drizzle (scaffolded)
```

## Data Flow

1. **Setup** — `/setup` → `saveDiscoveryProfile()` → localStorage (`src/lib/discovery/user-discovery.ts`)
2. **Import** — `/import` → `processImportFolder()` in browser → in-memory `BatchImportResult` (`src/lib/bank/batch-import.ts`)
3. **Gaps** — `analyseAccountGaps()` compares import vs confirmed institutions (`src/lib/discovery/account-gaps.ts`)
4. **Review** — `/review` → `defaultReviewContext()` + `runFullReview()` server-side (`src/lib/tax/review-engine/index.ts`)

**Gap:** Import and review are not connected through SQLite yet.

## Key Abstractions

| Abstraction | Location |
|-------------|----------|
| `ReviewModule` / `ReviewFlag` | `src/lib/tax/review-engine/types.ts` |
| `ProcessedFile` / `BatchImportResult` | `src/lib/bank/import-types.ts` |
| `InstitutionProduct` | `src/lib/institutions/products/types.ts` |
| `UserDiscoveryProfile` | `src/lib/discovery/user-discovery.ts` |
| `ParsedTransaction` | `src/lib/bank/types.ts` |

## Entry Points

| Route | File | Renders |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Hub |
| `/setup` | `src/app/setup/page.tsx` | Client onboarding |
| `/import` | `src/app/import/page.tsx` | Client folder import |
| `/review` | `src/app/review/page.tsx` | Server tax review |
| `/institutions` | `src/app/institutions/page.tsx` | Registry browser |
| `/dashboard` | `src/app/dashboard/page.tsx` | Placeholder |

## Cross-Cutting

- **Privacy:** localhost-only, no LLM, `npm run privacy:audit`
- **Determinism:** regex/heuristic classification; tax engine determinism test
- **FY:** hardcoded 2025-26 in gaps and rates JSON
