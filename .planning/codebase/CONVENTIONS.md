# Conventions

**Analysis date:** 2026-05-31

## Naming

- **Files:** kebab-case (`nab-import.ts`, `review-flag-card.tsx`)
- **Functions:** camelCase verbs (`parseNabCsv`, `runFullReview`)
- **Types:** PascalCase (`ReviewFlag`, `UserDiscoveryProfile`)
- **Product IDs:** `{bank}-{slug}` (`nab-isaver`, `cba-smart-access`)
- **Money:** cents in bank layer (`amountCents`); AUD dollars in tax context (`*Aud` fields)
- **Dates:** ISO `YYYY-MM-DD`; FY string `2025-26`

## TypeScript

- Strict mode — `tsconfig.json`
- Import alias `@/` → `src/`
- Domain modules under `src/lib/` by feature
- Review modules implement `ReviewModule` interface
- Static JSON loaded with typed accessors

## UI

- Dark theme only — `src/app/globals.css`, `tailwind.config.ts`
- Custom classes: `agent-btn`, `agent-card`, `agent-heading`
- Server components default; `"use client"` for setup/import forms
- Tailwind utilities; severity maps as `Record<string, string>`

## Tests

- Co-located `*.test.ts` next to source
- Vitest node environment
- Fictional personas labeled in test comments
- No React/component tests yet

## Git / Docs

- No personal data in repo — `docs/GENERALIZATION.md`
- User data only in gitignored `./data/`
