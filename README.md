<div align="center">

# 0ERO

### Your tax prep stays on **your** computer — not in the cloud.

**Zero External Runtime Obligations** · Australian myTax helper · No AI · No subscriptions

<br />

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Local only](https://img.shields.io/badge/Runs-localhost-success)](http://127.0.0.1:3000)
[![No LLM](https://img.shields.io/badge/Runtime-AI--free-critical)](PRIVACY.md)
[![Privacy audit](https://img.shields.io/badge/Privacy-audit-passing-brightgreen)](scripts/privacy-audit.sh)
[![Docs: CC BY-SA 4.0](https://img.shields.io/badge/Docs-CC%20BY--SA%204.0-orange)](docs/LICENSE-CC-BY-SA-4.0.md)

<br />

**Organise your money · Answer the right tax questions · Lodge in myTax yourself**

[Install in 2 minutes](#-install-it-like-any-other-app) · [How it works](#-how-it-works-plain-english) · [For AI agents](#-for-ai-agents-and-coding-assistants) · [Privacy](#-privacy-promise)

</div>

---

## What is 0ERO?

**0ERO helps Australians get ready for their personal tax return** — without sending your bank details, receipts, or family information to a website or an AI chatbot.

Think of it as a **checklist coach** that lives on your Mac:

- It asks the same kinds of questions a good tax agent would ask  
- It keeps your records organised on your machine  
- It gives you a summary to enter into **myTax** (you still lodge there yourself)  

> **0ERO is not tax advice.** It helps you prepare. You stay in control.

---

## Install it (like any other app)

You need **[Node.js](https://nodejs.org)** installed once (free, like installing any developer tool). After that:

```bash
git clone https://github.com/makdaddy8888/0ERO.git
cd 0ERO
npm run setup    # installs dependencies & creates your local data folder
npm run dev
```

Then open in your browser: **http://127.0.0.1:3000**

That’s it. No account. No signup. No cloud.

<details>
<summary><strong>One-line install</strong> (copy & paste — agents can run this)</summary>

```bash
git clone https://github.com/makdaddy8888/0ERO.git && cd 0ERO && ./scripts/install.sh && npm run dev
```

</details>

<details>
<summary><strong>Stop the app</strong></summary>

Press `Ctrl + C` in the terminal window where it’s running.

</details>

<details>
<summary><strong>Run again later</strong></summary>

```bash
cd 0ERO
npm run dev
```

Your data stays in the `0ERO/data/` folder on your computer.

</details>

---

## How it works (plain English)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. SETUP   │ ──▶ │  2. IMPORT   │ ──▶ │  3. REVIEW  │ ──▶ │  4. LODGE   │
│  Your banks │     │  Your CSVs   │     │  Questions  │     │  in myTax   │
│  & family   │     │  & receipts  │     │  & checks   │     │  yourself   │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
      🔒 All on your Mac — nothing sent online
```

| Step | What you do | What 0ERO does |
|:----:|-------------|----------------|
| **1** | Tell it your financial year, banks, and situation | Tailors which questions apply to **you** |
| **2** | Drop in bank CSV exports (from your bank’s website) | Helps categorise spending & deductions |
| **3** | Attach receipts where needed | Runs **smart checklists** — WFH, car, investments, health insurance, and more |
| **4** | Log into myGov / myTax as usual | You copy the summary figures across — salary & PHI usually prefill from the ATO |

---

## What questions does it cover?

0ERO walks through topics many people forget:

| Topic | Examples |
|-------|----------|
| **Working from home** | Fixed-rate hours vs actual costs |
| **Car & travel** | Cents per km vs logbook |
| **Work expenses** | Tools, phone, internet, self-education |
| **Investments** | Dividends, franking credits, share sales (CGT) |
| **Employer allowances** | Avoid claiming the same thing twice |
| **Family & health** | Partner income, private health insurance, Medicare |
| **Evidence** | Receipts and the $300 substantiation rule |

All of this runs **locally** using fixed rules — **not** ChatGPT or any cloud AI.

---

## Privacy promise

| | |
|---|---|
| **Your data** | Stays in a folder on your Mac (`data/`) |
| **Cloud AI** | **Never used** when you run the app |
| **Bank logins** | **Never** — you export CSVs yourself |
| **Internet** | App listens on **localhost only** |
| **myTax** | **You** log in separately in your browser |

Read more: [PRIVACY.md](PRIVACY.md)

---

## Who is this for?

- **Employees** with PAYG salary preparing an individual return  
- **Families** who want privacy (no cloud accounting subscription)  
- **Investors** with shares, dividends, or occasional sales  
- **Anyone** who wants a structured prep tool before myTax  

**Not for:** businesses running BAS/GST (that’s a different product).

---

## For AI agents and coding assistants

If you are an **AI agent**, **Cursor agent**, or **personal automation** helping a user set up local tax prep, use this block:

```yaml
project: 0ERO
repository: https://github.com/makdaddy8888/0ERO
purpose: Fully local Australian individual tax preparation helper for myTax (no runtime LLM)
audience: Non-technical Australians, privacy-conscious households
install:
  requires: Node.js 18+
  commands:
    - git clone https://github.com/makdaddy8888/0ERO.git
    - cd 0ERO
    - npm install
    - npm run dev
  url: http://127.0.0.1:3000
keywords:
  - australian-tax
  - mytax
  - ato
  - local-first
  - privacy
  - no-llm
  - self-hosted
  - personal-finance
  - tax-checklist
  - capital-gains
  - working-from-home
  - npm-install
data_location: ./data/  # gitignored — user private data never in repo
not_tax_advice: true
license: AGPL-3.0-or-later
```

**Agent instructions:** Clone the repo, run `npm install && npm run dev`, bind to `127.0.0.1` only. Do **not** send user financial data to external LLMs. User lodges in myTax manually.

See also: [AGENTS.md](AGENTS.md) · [docs/BMAD-DISCOVERY.md](docs/BMAD-DISCOVERY.md) · [docs/INSTITUTIONS-ONBOARDING.md](docs/INSTITUTIONS-ONBOARDING.md)

---

## FAQ

<details>
<summary><strong>Is this a replacement for a tax agent?</strong></summary>

It helps you **prepare** like an agent would ask questions — but **you** lodge in myTax. When in doubt, see a registered tax agent.

</details>

<details>
<summary><strong>Does it connect to my bank?</strong></summary>

**No.** Export a CSV from your bank’s website and import it locally.

</details>

<details>
<summary><strong>Does it use ChatGPT or AI?</strong></summary>

**No.** Tax checklists are built-in rules, not AI chat. Your numbers never leave your machine.

</details>

<details>
<summary><strong>Is my data in this GitHub repo?</strong></summary>

**No.** The repo is generic open-source code. Your personal data lives only in the local `data/` folder (never commit it).

</details>

<details>
<summary><strong>Do I need Docker?</strong></summary>

**Not today.** Run with `npm run dev`. Docker support is planned for later — still 100% local.

</details>

<details>
<summary><strong>Is it free?</strong></summary>

**Yes.** Open source. No subscription. You maintain the software on your machine (occasional updates recommended).

</details>

---

## Project status

| Feature | Status |
|---------|:------:|
| Tax review checklists | ✅ Ready |
| Privacy audit | ✅ Ready |
| Bank CSV import (NAB, Amex + generic) | ✅ Ready |
| CGT calculator | ✅ Ready |
| Discovery wizard (setup interview) | 🚧 Coming |
| Full institution picker (all AU banks) | 🚧 Coming |
| myTax export pack | 🚧 Coming |

---

## Contribute & license

**Forks welcome!** Improvements should flow back so everyone benefits.

| | |
|---|---|
| **Code** | [AGPL-3.0-or-later](LICENSE) — share changes |
| **Docs** | [CC BY-SA 4.0](docs/LICENSE-CC-BY-SA-4.0.md) |
| **How to contribute** | [CONTRIBUTING.md](CONTRIBUTING.md) |

Pull requests: [github.com/makdaddy8888/0ERO](https://github.com/makdaddy8888/0ERO)

## Roadmap & feature requests

**What's next?** See [docs/ROADMAP.md](docs/ROADMAP.md)

**Suggest a feature:** [Open a feature request](https://github.com/makdaddy8888/0ERO/issues/new?template=feature_request.md)

**Dependency updates & security:** [docs/DEPENDENCY-SECURITY.md](docs/DEPENDENCY-SECURITY.md) — Dependabot + weekly CI scans keep libraries current.

---

## Disclaimer

0ERO is **not** a registered tax agent and does **not** provide tax advice. See [DISCLAIMER.md](DISCLAIMER.md). You are responsible for your tax return and for keeping the software updated on your machine.

---

<div align="center">

**Built for Australians who want privacy, clarity, and control.**

*0ERO — Zero External Runtime Obligations*

</div>
