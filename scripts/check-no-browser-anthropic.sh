#!/usr/bin/env bash
# Sprint 1 S1-00 CI gate.
# Fails the build if any browser-bundled file ships the Anthropic API key.
#
# Forbidden tokens outside legacy/ and node_modules/ and dist/:
#   - dangerouslyAllowBrowser     (the Anthropic SDK opt-out for browser exposure)
#   - VITE_CLAUDE_API_KEY         (Vite would bake this into the client bundle)
#   - REACT_APP_ANTHROPIC_API_KEY (legacy CRA env var; doesn't even resolve in Vite)

set -e
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Patterns target actual code paths, not documentation that mentions the token.
# - dangerouslyAllowBrowser is only valid in SDK calls; matches as a bare token.
# - VITE_CLAUDE_API_KEY / REACT_APP_ANTHROPIC_API_KEY only matter when read via
#   process.env or import.meta.env — bare token mentions in comments are fine.
PATTERNS=(
  "dangerouslyAllowBrowser"
  "process\\.env\\.VITE_CLAUDE_API_KEY"
  "import\\.meta\\.env\\?\\?\\.VITE_CLAUDE_API_KEY"
  "import\\.meta\\.env\\?\\.VITE_CLAUDE_API_KEY"
  "import\\.meta\\.env\\.VITE_CLAUDE_API_KEY"
  "process\\.env\\.REACT_APP_ANTHROPIC_API_KEY"
  "import\\.meta\\.env\\.REACT_APP_ANTHROPIC_API_KEY"
)

# Limit scope to live source + server tree. Skip legacy/, node_modules/, dist/, docs/, .claude/worktrees/.
SCAN_PATHS=(
  "src"
  "server"
)

EXIT=0
HITS_FILE="$(mktemp)"
trap 'rm -f "$HITS_FILE"' EXIT

for pattern in "${PATTERNS[@]}"; do
  # -R recursive, -I skip binary, -E extended regex
  if grep -RIEln \
      --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' --include='*.mjs' \
      --exclude-dir='node_modules' \
      --exclude-dir='dist' \
      "$pattern" "${SCAN_PATHS[@]}" >> "$HITS_FILE" 2>/dev/null; then
    EXIT=1
  fi
done

if [[ "$EXIT" -ne 0 ]]; then
  echo "❌ S1-00 CI gate failed: forbidden Anthropic-in-browser pattern detected." >&2
  echo "" >&2
  echo "Files containing one of: dangerouslyAllowBrowser, VITE_CLAUDE_API_KEY, REACT_APP_ANTHROPIC_API_KEY" >&2
  echo "" >&2
  sort -u "$HITS_FILE" >&2
  echo "" >&2
  echo "Fix: route browser AI through src/services/aiProxyClient.js (which calls /api/ai)." >&2
  echo "Reference: docs/security/AI-CLIENT-IMPORT-MAP.md" >&2
  exit 1
fi

echo "✓ S1-00 CI gate passed: no Anthropic SDK browser-exposure patterns found in src/ or server/."
