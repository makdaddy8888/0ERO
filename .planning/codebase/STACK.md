# Technology Stack

**Analysis date:** 2026-05-31

## Languages

- **TypeScript** — all app code in `src/**/*.ts`, `src/**/*.tsx`; strict mode in `tsconfig.json`
- **JSON** — static catalogs (`src/lib/institutions/registry.json`, `src/lib/institutions/products/*.json`, `src/lib/tax/rates/fy2025-26.json`)

## Runtime

- **Node.js 18+** — `AGENTS.md`
- **Next.js 15** App Router — `package.json`, routes under `src/app/`
- Dev/prod bind **127.0.0.1 only** — `package.json` scripts `dev`, `start`, `dev:clean`

## Package Manager

- **npm** — `package-lock.json`, `scripts/install.sh`

## Frameworks

| Layer | Package | Config |
|-------|---------|--------|
| Web | Next.js 15 | `next.config.ts` |
| UI | React 19 | `package.json` |
| Styling | Tailwind CSS 3 | `tailwind.config.ts`, `src/app/globals.css` |
| ORM | Drizzle | `drizzle.config.ts`, `src/lib/db/schema.ts` |
| DB driver | better-sqlite3 | `src/lib/db/index.ts` |
| PDF | pdfjs-dist | `src/lib/bank/pdf-extract.ts`, `public/pdf.worker.min.mjs` |
| Tests | Vitest 2 | `vitest.config.ts` |

## Key Dependencies

- `better-sqlite3`, `drizzle-orm`, `drizzle-kit` — local SQLite ledger (schema ready, UI not wired)
- `pdfjs-dist` — client-side PDF text extraction
- **No LLM / AI SDKs** — enforced by `scripts/privacy-audit.sh`

## Configuration

- Env: `.env.example` → `.env` (`DATABASE_PATH`, `HOST`, `PORT`)
- Path alias: `@/*` → `./src/*` in `tsconfig.json` and `vitest.config.ts`
- Local data gitignored: `data/`, `*.db`, `.env` in `.gitignore`
- Bootstrap: `scripts/install.sh` (npm install, copy PDF worker, create `data/` dirs)

## Platform

- macOS-focused local dev; Docker stub commented in `docker-compose.yml`
