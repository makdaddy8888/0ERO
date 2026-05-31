# Structure

**Analysis date:** 2026-05-31

## Directory Layout

```
0ERO/
├── .cursor/                 GSD commands + workflows (Cursor)
├── .planning/               GSD project state + codebase map
├── src/
│   ├── app/                 Next.js routes + UI
│   │   ├── setup/           Institution/product onboarding
│   │   ├── import/          Folder import UI
│   │   ├── review/          Tax review UI
│   │   ├── institutions/    Registry browser
│   │   └── dashboard/       Ledger placeholder
│   └── lib/
│       ├── bank/            Import parsers + batch
│       ├── discovery/       Profile + gaps
│       ├── institutions/    Registry + products
│       ├── tax/             Review engine + rates
│       └── db/              SQLite schema
├── docs/                    BMAD discovery, roadmap, generalization
├── scripts/                 install.sh, privacy-audit.sh
└── public/                  pdf.worker.min.mjs
```

## Where to Add Code

| Task | Location |
|------|----------|
| New page | `src/app/{route}/page.tsx` |
| Bank CSV parser | `src/lib/bank/{bank}-import.ts`, wire in `batch-import.ts` |
| Product catalog | `src/lib/institutions/products/{bank}.json` |
| Tax check module | `src/lib/tax/review-engine/{name}.ts`, register in `index.ts` |
| Discovery questions | `src/lib/discovery/questions/` (planned) |
| Persist to ledger | `src/lib/db/schema.ts` + `getDb()` |

## Tests

Co-located `*.test.ts` under `src/lib/` — see `TESTING.md`.
