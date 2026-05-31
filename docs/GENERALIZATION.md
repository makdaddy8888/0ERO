# Generalization — public repo vs local user data

## Principle

**0ERO on GitHub is a generic framework.** Names, account numbers, bank exports, broker statements, TFNs, and household financial figures **never belong in git**. They live only in `./data/` on each user's machine (gitignored).

## What belongs in the public repo

| Item | Status |
|------|--------|
| AU institution registry (`registry.json`) | Generic list for all users |
| Document classifiers (filename / header patterns) | Generic detection, no pre-selected user |
| ATO rates JSON | Public FY thresholds |
| `defaultReviewContext()` | All zeros — blank template |
| Unit test fixtures | Clearly labelled fictional personas only |
| Setup / discovery UI | Empty until the user selects institutions |

## What must never be committed

| Item | Where it lives |
|------|----------------|
| Bank CSV / PDF exports | User import → `./data/ledger.db` |
| Receipts | `./data/receipts/` |
| Household profile (institutions, spouse income, etc.) | `./data/` (future SQLite) or browser localStorage |
| `.env` with local paths | Gitignored |

Run `npm run privacy:audit` before releases. Never commit `data/` or `.env`.

## Blank-project checklist (for contributors)

1. **No pre-filled discovery profile** — Setup starts with zero institutions selected.
2. **Gap analysis is profile-driven** — only asks about institutions the user confirmed in Setup.
3. **Review UI uses empty context** — `defaultReviewContext()` until real ledger data exists.
4. **Tests use fictional personas** — round numbers, fake last-4 digits (e.g. `1234`), comment `// fictional unit-test persona only`.
5. **User-facing copy is institution-neutral** — no "import your NAB CSV" defaults; point to Setup → Import.
6. **No sample customer files** in the repo (no bundled CSVs, PDFs, or SQLite DBs).

## v0.2 roadmap (generalization)

### 1. Household onboarding wizard (local only)

First-run UI writes to `./data/ledger.db`:

- Financial year
- Marital status → optional spouse module
- Housing → WFH actual-cost questions
- **Financial institutions** — user checks every provider that applies; nothing pre-selected

See [INSTITUTIONS-ONBOARDING.md](./INSTITUTIONS-ONBOARDING.md) and [BMAD-DISCOVERY.md](./BMAD-DISCOVERY.md).

### 2. Generic bank & institution import

- `src/lib/institutions/registry.json` — public AU institution list
- `src/lib/bank/presets/` — per-institution CSV parsers where format is known
- Generic column mapper fallback for institutions without a preset
- Import UI shows only user-confirmed institutions

### 3. Optional review modules

```typescript
runFullReview(ctx, { enabledModules: ["wfh", "cgt", "spouse", ...] })
```

Skip spouse questions when `maritalStatus === "single"`. Broker/CGT prompts only when user confirmed a broker in Setup.

## Success criteria

1. Fresh clone → Setup wizard → user confirms institutions and household profile
2. Completeness gate blocks tailored gap checks until Setup is done
3. No code path assumes a specific institution until the user selects it
4. Tests use labelled fictional personas
5. README examples use generic names (e.g. "Alex Example")
6. Privacy audit passes — no runtime LLM
