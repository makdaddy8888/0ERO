# Generalization plan — public repo vs private household data

## Principle

**0ERO on GitHub is a generic framework.** Your names, account numbers, bank exports, broker statements, TFNs, and family financial figures **never belong in git**. They live only in `./data/` on your machine (gitignored).

## Audit: what is NOT your family data (safe for public repo)

| Item | Status |
|------|--------|
| Names, TFNs, addresses | **Not present** |
| Account numbers (e.g. BT 90244104) | **Not present** |
| CommSec / Stake / broker holdings | **Not present** |
| Mar 2026 name-correction event | **Not present** |
| NAB mortgage balance / interest | **Not present** |
| Employer allowance dollar amounts | **Not present** |
| `defaultReviewContext()` | All **zeros** — generic empty template |
| ATO rates JSON | Public FY 2025–26 thresholds — generic |

## Audit: what LOOKS family-shaped (feature scope, not personal data)

These reflect our planning conversations but are **Australian tax scenarios**, not your household specifically:

| Feature | Why it feels specific | Generalization fix |
|---------|----------------------|-------------------|
| NAB + Amex CSV parsers only | Your banks | **Institution registry + onboarding confirm** — all AU banks/brokers as options; user selects |
| `phi-medicare-spouse` module | You have a spouse | Make **optional** via household profile: `maritalStatus: single \| partnered` |
| `employer-allowances` module | You receive WFH + car allowances | Enable only if `employerAllowancesAud > 0` (already) + onboarding toggle |
| WFH actual vs fixed | You own with dedicated room | Onboarding: rent/own, dedicated workspace — drives which questions appear |
| CGT module | You had CommSec sell+rebuy | Generic for any disposal; no broker name hardcoded |
| Test fixture `sampleContext` | Mirrors a composite profile (spouse $45k, allowances $500, CGT $1500) | Replace with **clearly fictional** `ExamplePersona` in test comments |
| Schema: spouse, WFH log, employer allowances | Supports your return types | Keep schema — fields are optional/nullable for any user |
| FY 2025–26 default | Current AU year | Configurable `financialYear` in settings |
| README mentions NAB/Amex | Your banks | **Institution-aware import** — user confirms providers at setup |

## Test fixture concern

`src/lib/tax/review-engine/tax-engine-is-deterministic.test.ts` uses:

```typescript
spouseTaxableIncomeAud: 45000,
employerAllowancesAud: 500,
cgtNetGainAud: 1500,
// ...
```

This is **fictional test data**, not your real figures — but it resembles your planning profile. **Replace with anonymized round numbers** and label `// fictional persona for unit tests only`.

## Required changes for full generalization (v0.2)

### 1. Household onboarding wizard (local only)

First-run UI writes to `./data/ledger.db` — **never committed**:

- Financial year
- Marital status (single / partnered) → enables spouse module
- Housing (rent / own, dedicated workspace?) → WFH actual-cost questions
- Employment (PAYG / other)
- Employer allowances? (yes/no)
- **Financial institutions (full confirm step)** — see [INSTITUTIONS-ONBOARDING.md](./INSTITUTIONS-ONBOARDING.md):
  - All major AU **banks**, **credit cards**, **brokers**, **wealth platforms**, **super funds**, **home loan lenders**, **PHI insurers**
  - User **checks every institution that applies**; nothing pre-selected
  - Confirm summary screen before saving locally
  - Drives import presets and which review prompts appear

### 2. Generic bank & institution import

- `src/lib/institutions/registry.json` — public list of all AU institutions
- `src/lib/bank/presets/` — one file per institution where CSV format is known
- **Generic column mapper** fallback for any confirmed institution without a preset
- Import UI shows **only user-confirmed** institutions (+ add more in Settings)

### 3. Optional review modules

```typescript
runFullReview(ctx, { enabledModules: ["wfh", "cgt", "spouse", ...] })
```

Skip spouse questions if `maritalStatus === "single"`. Broker/CGT prompts only if user confirmed a broker in onboarding.

### 4. Documentation

- README: "Example household" section with **clearly fictional** AU family
- PRIVACY.md: reinforce `./data/` is private
- `.github/ISSUE_TEMPLATE`: no personal data in issues

### 5. Remove GitHub username from feeling "personal"

- Keep `makdaddy8888/0ERO` as upstream URL (repo owner) — that's public GitHub identity, not family data

## What stays in YOUR private environment only

When you use 0ERO for real:

| Data | Where |
|------|--------|
| Bank CSV exports | Import into app → `./data/ledger.db` |
| Receipts | `./data/receipts/` |
| CommSec CGT cost base | CGT disposal entries in local DB |
| Spouse income | household_profile table locally |
| Mortgage interest | mortgage table locally |
| WFH hours log | wfh_hours_log locally |

**Never commit `data/` or `.env`.**

## Success criteria for generic public repo

1. Clone fresh → **discovery wizard** (BMAD-inspired, deterministic) → user confirms institutions and household profile
2. **Completeness gate** blocks import until required questions answered
3. No code path assumes any specific institution until user selects it
4. Tests use labeled fictional personas
5. README examples use "Alex Example" not real names
6. Privacy audit still passes — no runtime LLM

See also: [BMAD-DISCOVERY.md](./BMAD-DISCOVERY.md) — structured interrogation without cloud AI.
