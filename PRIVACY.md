# Privacy

0ERO is designed for **fully local** use.

## Guarantees (design intent)

| Topic | Policy |
|-------|--------|
| Network | Dev/prod scripts bind to **127.0.0.1** only |
| LLM / cloud AI | **Not used** at runtime |
| External APIs | **Not called** from application logic in `src/` |
| Personal data | **No** bundled user profiles — generic schema/templates only |
| Database | SQLite file at `./data/ledger.db` on your disk |

## Audit

Run `npm run privacy:audit` to scan for banned AI SDKs and external `fetch()` usage in `src/`.

## Your responsibility

Imported CSVs and ledger entries you add are **your** data. Back up or delete `./data/` as you see fit. Do not commit real exports to git.
