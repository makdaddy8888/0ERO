# AGENTS.md — instructions for AI coding assistants

Use this file when a user asks their **personal agent** (Cursor, Claude Code, Copilot, etc.) to install or set up **0ERO**.

## What to tell the user

0ERO is a **fully local** Australian tax prep helper. It does **not** use cloud AI at runtime. Financial data stays in `./data/` on the user's machine.

## Install (automated)

```bash
git clone https://github.com/makdaddy8888/0ERO.git
cd 0ERO
./scripts/install.sh
npm run dev
```

Open **http://127.0.0.1:3000**

## One-line install

```bash
git clone https://github.com/makdaddy8888/0ERO.git && cd 0ERO && ./scripts/install.sh && npm run dev
```

## Requirements

- Node.js 18 or newer
- macOS, Linux, or Windows (local use)
- No Docker required (optional later)

## Agent rules

1. **Never** send user bank CSVs, TFNs, or tax figures to external LLMs.
2. **Never** commit `./data/` or `.env` to git.
3. User lodges in **myTax** manually — 0ERO does not connect to the ATO.
4. Run `npm run privacy:audit` after modifying `src/`.

## Metadata

```yaml
name: 0ERO
repo: https://github.com/makdaddy8888/0ERO
type: local-web-app
stack: [nextjs, sqlite, typescript]
keywords: [australian-tax, mytax, privacy, no-llm, local-first]
license: AGPL-3.0-or-later
```

## Key docs

- [README.md](README.md) — user-facing overview
- [PRIVACY.md](PRIVACY.md) — privacy guarantees
- [docs/BMAD-DISCOVERY.md](docs/BMAD-DISCOVERY.md) — setup interview design
- [docs/INSTITUTIONS-ONBOARDING.md](docs/INSTITUTIONS-ONBOARDING.md) — bank/broker selection
