#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo ""
echo "  0ERO — local install (your data stays on this Mac)"
echo ""
command -v node >/dev/null || { echo "Install Node.js from https://nodejs.org"; exit 1; }
npm install --no-fund --no-audit
[[ -f .env ]] || cp .env.example .env
mkdir -p data/receipts data/exports
echo ""
echo "  Done! Run: npm run dev"
echo "  Open:    http://127.0.0.1:3000"
echo ""
