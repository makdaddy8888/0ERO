# Dependency security & automatic updates

0ERO cannot promise **zero bugs** — no software can. What we **can** do is keep dependencies **current**, scan for **known vulnerabilities**, and run **automated tests** before updates land.

## What runs automatically (on GitHub)

| Tool | What it does | When |
|------|--------------|------|
| **Dependabot** | Opens PRs to bump outdated npm packages | Weekly + on advisories |
| **GitHub Actions CI** | `npm test`, `npm run privacy:audit`, `npm run build` | Every PR & push to `main` |
| **npm audit** | Checks known CVEs in dependency tree | Every CI run |
| **CodeQL** *(optional)* | Static security analysis | On PR (if enabled) |

## Local commands (run anytime)

```bash
npm audit              # list known vulnerabilities
npm audit fix          # apply safe automatic fixes
npm outdated           # see what can be updated
npm run privacy:audit  # ensure no AI SDKs / external fetch crept in
npm test
npm run build
```

## Update policy

| Severity | Action |
|----------|--------|
| **Critical / high** | Dependabot PR → merge after CI passes ASAP |
| **Moderate** | Review within 2 weeks |
| **Low** | Batch with next release |
| **Major version bumps** | Manual review — may need code changes |

## Privacy rules still apply after updates

Every dependency PR must pass:

1. `npm run privacy:audit` — no banned AI SDKs  
2. `npm test` — review engine stays deterministic  
3. `npm run build` — app still builds  

**Do not** add packages that phone home at runtime (analytics, cloud AI, error reporters).

## Dependabot configuration

See [`.github/dependabot.yml`](../.github/dependabot.yml):

- Weekly npm updates (grouped minor/patch)
- GitHub Actions updates
- Labels: `dependencies`, `security`

## What automatic updates cannot fix

- Unknown zero-day bugs (not in CVE databases yet)
- Logic bugs in 0ERO’s own tax rules
- ATO rate changes — update `src/lib/tax/rates/` manually each financial year
- Your local `./data/` — back up yourself

## Maintainer checklist (each release)

- [ ] All Dependabot PRs merged or dismissed with reason  
- [ ] `npm audit` shows no critical/high  
- [ ] `npm run privacy:audit` passes  
- [ ] README roadmap updated  
- [ ] FY rate JSON current for active year  

## Reporting a security issue

**Do not** open a public issue for exploitable vulnerabilities. Email the maintainer or use GitHub **Private vulnerability reporting** (enable in repo Settings → Security).

For general bugs, use the [Bug report issue template](https://github.com/makdaddy8888/0ERO/issues/new?template=bug_report.md).
