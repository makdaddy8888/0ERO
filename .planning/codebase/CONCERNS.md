# Concerns

**Analysis date:** 2026-05-31

## High Priority

1. **SQLite unused** — `src/lib/db/index.ts` never called; import/review use ephemeral data
2. **v0.2 incomplete** — no BMAD discovery wizard, completeness gate, or SQLite profile storage
3. **NAB-only PDF path** — `batch-import.ts` routes all non-Amex PDFs to `nab-pdf-import.ts`
4. **Non-Amex CSV fallback** — all non-Amex CSV uses `parseNabCsv`

## Medium Priority

5. **localStorage vs SQLite** — `user-discovery.ts` conflicts with docs promising `./data/` only
6. **Review stub context** — `defaultReviewContext()` zeros; not ledger-driven
7. **Test gaps** — batch import, discovery persistence, gate logic untested
8. **No Drizzle migrations** committed under `drizzle/`

## Low Priority

9. **Dashboard placeholder** — `src/app/dashboard/page.tsx`
10. **npm audit** non-blocking in CI — `.github/workflows/ci.yml`

## Privacy (Strengths)

- Localhost bind, privacy audit script, no LLM, client-side file processing
- `data/` gitignored

## v0.2 Target (GSD Phase 1)

Per `docs/BMAD-DISCOVERY.md` and `docs/ROADMAP.md`:

- Discovery question JSON + phase runner
- SQLite persistence for profile + institutions
- Gate `/import` until setup complete
- Wire import → ledger → review context
