# Testing

**Analysis date:** 2026-05-31

## Framework

- **Vitest 2** — `vitest.config.ts`, `npm test`
- Environment: **node** (not jsdom)
- Glob: `src/**/*.test.ts`
- Alias: `@` → `./src`

## Test Files (35 tests, 7 files)

| File | Tests | Focus |
|------|-------|-------|
| `src/lib/institutions/search-institutions.test.ts` | 14 | Product search across 6 banks |
| `src/lib/bank/classify-document.test.ts` | 7 | Classification + gap analysis |
| `src/lib/bank/nab-pdf-import.test.ts` | 6 | NAB PDF parsing |
| `src/lib/bank/nab-import.test.ts` | 3 | NAB CSV formats |
| `src/lib/bank/detect-import-file.test.ts` | 3 | Wrong file detection |
| `src/lib/bank/pdf-extract.test.ts` | 1 | PDF line grouping |
| `src/lib/tax/review-engine/tax-engine-is-deterministic.test.ts` | 1 | Review determinism |

## CI

- `npm run security:check` runs privacy audit + tests — `.github/workflows/ci.yml`

## Gaps

- No tests for `batch-import.ts`, `user-discovery.ts`, `amex-import.ts`
- No individual review module tests
- No DB/migration tests
- No UI/component tests
