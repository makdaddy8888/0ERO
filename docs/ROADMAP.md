# Roadmap & feature requests

Plan what comes next for **0ERO**. This is a living doc — priorities change with community input.

## How to request a feature

Pick one:

| Method | Best for |
|--------|----------|
| **[GitHub Issues → Feature request](https://github.com/makdaddy8888/0ERO/issues/new?template=feature_request.md)** | Detailed ideas, discussion, voting via 👍 |
| **[GitHub Discussions](https://github.com/makdaddy8888/0ERO/discussions)** *(enable in repo settings)* | Open-ended brainstorming |
| **Pull request** | You already built it (see [CONTRIBUTING.md](../CONTRIBUTING.md)) |

Please **no personal data** in issues (no TFNs, bank exports, real names).

---

## Shipped (v0.1)

- [x] Local-first Next.js app (`127.0.0.1` only)
- [x] Deterministic tax review engine (9 modules)
- [x] CGT calculator
- [x] NAB + Amex CSV parsers (generic)
- [x] Privacy audit script (`npm run privacy:audit`)
- [x] AGPL + CC BY-SA licensing
- [x] Agent-friendly README + AGENTS.md
- [x] Install script (`npm run setup`)

---

## In progress / planned

### v0.2 — Setup & discovery

- [ ] **Discovery wizard** — BMAD-inspired intake before import ([BMAD-DISCOVERY.md](./BMAD-DISCOVERY.md))
- [ ] **Institution picker** — confirm all AU banks, brokers, lenders ([INSTITUTIONS-ONBOARDING.md](./INSTITUTIONS-ONBOARDING.md))
- [ ] **Completeness gate** — block import until required questions answered
- [ ] Onboarding stores answers in local SQLite only

### v0.3 — Data entry

- [ ] Bank CSV import UI (filtered by your institutions)
- [ ] Generic column mapper for unknown CSV formats
- [ ] Transaction categorisation + split lines
- [ ] Receipt attachments (`./data/receipts/`)
- [ ] WFH hours log (weekly/monthly)
- [ ] Credit card payment vs purchase flow

### v0.4 — Reconcile & export

- [ ] Per-account reconciliation
- [ ] myTax export pack (CSV + PDF + receipts zip)
- [ ] Step-by-step lodge checklist in app
- [ ] Employer allowance entry from payslip

### v0.5 — Hardening

- [ ] Docker Compose (`network_mode: none` option)
- [ ] Automated dependency & security updates ([DEPENDENCY-SECURITY.md](./DEPENDENCY-SECURITY.md))
- [ ] Expanded institution CSV presets (CommBank, Westpac, ANZ, …)
- [ ] FY 2026–27 rate pack

---

## Community feature ideas (unprioritised)

Vote or comment on GitHub Issues with these labels.

| Idea | Notes |
|------|-------|
| Mobile-friendly receipt upload | Phone browser → local app |
| Export to accountant format | CSV template for tax agents |
| Optional encrypted backup | Zip `data/` with password |
| macOS `.app` wrapper | Double-click launch, no terminal |
| Homebrew formula | `brew install 0ero` |
| npm global CLI | `npx 0ero` / `npm i -g 0ero` |
| Spouse linked profiles | Two people, one household view |
| SMSF warning module | Flag when SMSF return may be needed |
| myDeductions category alignment | Export tags matching ATO app |

---

## How priorities are decided

1. **Security & privacy** fixes always first  
2. **Core tax prep flow** (discovery → import → review → export)  
3. Features with multiple 👍 on Issues  
4. Nice-to-have UX polish  

Maintainers merge PRs that match the roadmap and pass CI + `privacy:audit`.

---

## Version labels

| Label | Meaning |
|-------|---------|
| `v0.2` | Next minor release target |
| `help wanted` | Good for contributors |
| `good first issue` | Small, scoped tasks |
| `security` | Vulnerability or dependency fix |
