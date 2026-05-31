# Integrations

**Analysis date:** 2026-05-31

## External APIs

**None at runtime.** 0ERO is local-first with no cloud calls during use.

- Enforced: `scripts/privacy-audit.sh`, `PRIVACY.md`, `AGENTS.md`
- No `src/app/api/**` routes

## Database

- **SQLite file** — `./data/ledger.db` via `src/lib/db/index.ts`
- Schema: `src/lib/db/schema.ts` (accounts, transactions, tax_tags, cgt_disposals, wfh_hours_log, household_profile, employer_allowances)
- **Status:** `getDb()` not yet called from UI/import paths

## Browser Storage

- **localStorage** — discovery profile key `0ero-discovery-profile` in `src/lib/discovery/user-discovery.ts`
- **File API** — folder import in `src/app/import/folder-import-form.tsx` (no upload)

## Import Pipeline (local)

| Source | Handler |
|--------|---------|
| NAB CSV | `src/lib/bank/nab-import.ts` |
| NAB PDF | `src/lib/bank/nab-pdf-import.ts`, `src/lib/bank/pdf-extract.ts` |
| Amex CSV | `src/lib/bank/amex-import.ts` |
| Classification | `src/lib/bank/classify-document.ts` |
| Batch orchestration | `src/lib/bank/batch-import.ts` |

## Static Bundled Data

- AU institutions: `src/lib/institutions/registry.json`
- Product catalogs: `src/lib/institutions/products/*.json`
- FY rates: `src/lib/tax/rates/fy2025-26.json`
- ATO categories: `src/lib/tax/ato-categories.ts`

## ATO / myTax

- **No API integration** — user lodges manually in myTax
- Review engine provides checklist copy only: `src/lib/tax/review-engine/`

## Third-Party Services

None required for operation.
