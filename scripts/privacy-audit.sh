#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0

echo "== 0ERO privacy audit =="

# Ban common AI / LLM SDKs in package.json dependencies
BANNED_PKGS='openai|@anthropic-ai|anthropic|@google/generative-ai|langchain|@langchain|cohere-ai|replicate|ai-sdk|@ai-sdk'
if grep -E "\"($BANNED_PKGS)\"" package.json 2>/dev/null; then
  echo "FAIL: AI/LLM package detected in package.json"
  FAIL=1
fi

# Ban fetch to external URLs in src/ (allow localhost comments only via pattern)
if grep -RIn --include='*.ts' --include='*.tsx' \
  -E 'fetch\s*\(\s*[`'"'"'"]https?://(?!127\.0\.0\.1|localhost)' src/ 2>/dev/null; then
  echo "FAIL: External fetch() call found in src/"
  FAIL=1
fi

# Ban process.env usage for cloud API keys (common patterns)
if grep -RIn --include='*.ts' --include='*.tsx' \
  -E 'process\.env\.(OPENAI|ANTHROPIC|AZURE_OPENAI|GOOGLE_AI|COHERE|REPLICATE)' src/ 2>/dev/null; then
  echo "FAIL: Cloud AI env var reference in src/"
  FAIL=1
fi

if [ "$FAIL" -eq 0 ]; then
  echo "PASS: No AI SDKs or external runtime fetches detected."
  exit 0
else
  exit 1
fi
