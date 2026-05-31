# Contributing to 0ERO

Thank you for improving local-first Australian tax prep tooling.

## Forks welcome

You may fork this project under the **AGPL-3.0-or-later** license. If you run a modified version for others (including over a network), AGPL requires you to provide corresponding source to users.

## Share-alike

Please keep derivative works under AGPL-compatible terms and preserve copyright notices.

## Pull requests

We **strongly encourage** opening pull requests back to the upstream repository:

https://github.com/makdaddy8888/0ERO

Before submitting:

1. Run `npm run privacy:audit`, `npm test`, and `npm run build`.
2. Keep the app **offline at runtime** — no LLM or cloud API calls from `src/`.
3. Do not commit personal data, real bank exports, or `.env` files.

## Code style

- TypeScript strict mode
- Deterministic tax review logic only (no ML inference)
- Match existing module layout under `src/lib/tax/review-engine/`

## Questions

Open an issue on GitHub for design discussion before large refactors.
