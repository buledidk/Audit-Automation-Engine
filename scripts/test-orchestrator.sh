#!/usr/bin/env bash
# test-orchestrator.sh — Validates the full orchestrator architecture post-refactor
set -uo pipefail

# ─── Colors ──────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

PASS=0
FAIL=0

pass() {
  printf "  ${GREEN}✓ PASS${RESET}  %s\n" "$1"
  PASS=$((PASS + 1))
}

fail() {
  printf "  ${RED}✗ FAIL${RESET}  %s\n" "$1"
  FAIL=$((FAIL + 1))
}

section() {
  printf "\n${BOLD}${CYAN}── %s ──${RESET}\n" "$1"
}

# ─── Resolve project root ───────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

printf "\n${BOLD}AuditEngine AURA — Orchestrator Architecture Validation${RESET}\n"
printf "Project root: %s\n" "$PROJECT_ROOT"

# ─── 1. Build check ─────────────────────────────────────────────
section "Build"

if npx vite build --mode development > /dev/null 2>&1; then
  pass "Vite build succeeds"
else
  fail "Vite build failed"
fi

# ─── 2. Orchestrator size ────────────────────────────────────────
section "Orchestrator"

ORCHESTRATOR="src/AuditEngine_AURA.jsx"
if [ -f "$ORCHESTRATOR" ]; then
  LINE_COUNT=$(wc -l < "$ORCHESTRATOR" | tr -d ' ')
  if [ "$LINE_COUNT" -le 250 ]; then
    pass "$ORCHESTRATOR is $LINE_COUNT lines (≤ 250)"
  else
    fail "$ORCHESTRATOR is $LINE_COUNT lines (> 250 limit)"
  fi
else
  fail "$ORCHESTRATOR not found"
fi

# ─── 3. Working Paper components ─────────────────────────────────
section "Working Paper Components (src/components/wp/)"

WP_COMPONENTS=(
  ChartOfAccountsWP.jsx
  CompletionWP.jsx
  DropZone.jsx
  EvidenceTracker.jsx
  FinancialModelsWP.jsx
  FinancialStatementsWP.jsx
  FSLILeadSchedule.jsx
  IntegrationsHub.jsx
  LeadScheduleWP.jsx
  PlanningWP.jsx
  RegulatoryWP.jsx
  ReportingWP.jsx
  ResearchHub.jsx
  RiskWP.jsx
  StandardsBrowser.jsx
  TestingWP.jsx
  WPBody.jsx
  WPHeader.jsx
)

WP_DIR="src/components/wp"
WP_FOUND=0
WP_TOTAL=${#WP_COMPONENTS[@]}

for file in "${WP_COMPONENTS[@]}"; do
  if [ -f "$WP_DIR/$file" ]; then
    WP_FOUND=$((WP_FOUND + 1))
  else
    fail "Missing $WP_DIR/$file"
  fi
done

if [ "$WP_FOUND" -eq "$WP_TOTAL" ]; then
  pass "All $WP_TOTAL WP components present"
else
  fail "Only $WP_FOUND/$WP_TOTAL WP components found"
fi

# ─── 4. Extracted components ─────────────────────────────────────
section "Extracted Components"

EXTRACTED_COMPONENTS=(
  src/components/AuditSidebar.jsx
  src/components/AuditModals.jsx
  src/components/AIPanel.jsx
  src/components/ErrorBoundary.jsx
  src/components/ReviewDashboard.jsx
)

for file in "${EXTRACTED_COMPONENTS[@]}"; do
  if [ -f "$file" ]; then
    pass "$(basename "$file")"
  else
    fail "Missing $file"
  fi
done

# ─── 5. Hooks ────────────────────────────────────────────────────
section "Hooks (src/hooks/)"

HOOKS=(
  src/hooks/useAuditHelpers.jsx
  src/hooks/useExportHandlers.jsx
  src/hooks/useKeyboardShortcuts.jsx
)

for file in "${HOOKS[@]}"; do
  if [ -f "$file" ]; then
    pass "$(basename "$file")"
  else
    fail "Missing $file"
  fi
done

# ─── 6. Context ─────────────────────────────────────────────────
section "Context"

if [ -f "src/context/EngagementContext.jsx" ]; then
  pass "EngagementContext.jsx"
else
  fail "Missing src/context/EngagementContext.jsx"
fi

# ─── 7. Data files ──────────────────────────────────────────────
section "Data Files (src/data/)"

DATA_FILES=(
  src/data/frameworks.js
  src/data/helpText.js
  src/data/index.js
  src/data/industries.js
  src/data/tests.js
  src/data/theme.js
  src/data/workingPapers.js
)

DATA_FOUND=0
DATA_TOTAL=${#DATA_FILES[@]}

for file in "${DATA_FILES[@]}"; do
  if [ -f "$file" ]; then
    DATA_FOUND=$((DATA_FOUND + 1))
  else
    fail "Missing $file"
  fi
done

if [ "$DATA_FOUND" -eq "$DATA_TOTAL" ]; then
  pass "All $DATA_TOTAL data files present"
else
  fail "Only $DATA_FOUND/$DATA_TOTAL data files found"
fi

# ─── 8. Services ────────────────────────────────────────────────
section "Services (src/services/)"

SERVICES=(
  src/services/aiProcedureEngine.js
  src/services/auditDashboardService.js
  src/services/documentManagementService.js
  src/services/exceptionPredictionEngine.js
  src/services/jurisdictionEngine.js
  src/services/materialityEngine.js
  src/services/subscriptionService.js
)

SVC_FOUND=0
SVC_TOTAL=${#SERVICES[@]}

for file in "${SERVICES[@]}"; do
  if [ -f "$file" ]; then
    SVC_FOUND=$((SVC_FOUND + 1))
  else
    fail "Missing $file"
  fi
done

if [ "$SVC_FOUND" -eq "$SVC_TOTAL" ]; then
  pass "All $SVC_TOTAL service files present"
else
  fail "Only $SVC_FOUND/$SVC_TOTAL services found"
fi

# ─── 9. Unit tests ──────────────────────────────────────────────
section "Unit Tests"

if npm run test 2>&1 | tail -5; then
  pass "Unit tests pass"
else
  fail "Unit tests failed"
fi

# ─── 10. Line count report ──────────────────────────────────────
section "Line Count Report"

count_lines() {
  local label="$1"
  shift
  local total=0
  for f in "$@"; do
    if [ -f "$f" ]; then
      lines=$(wc -l < "$f" | tr -d ' ')
      total=$((total + lines))
    fi
  done
  printf "  ${CYAN}%-30s${RESET} %5d lines\n" "$label" "$total"
}

count_lines "Orchestrator" src/AuditEngine_AURA.jsx
count_lines "WP Components" src/components/wp/*.jsx
count_lines "Extracted Components" src/components/AuditSidebar.jsx src/components/AuditModals.jsx src/components/AIPanel.jsx src/components/ErrorBoundary.jsx src/components/ReviewDashboard.jsx
count_lines "Hooks" src/hooks/*.jsx
count_lines "Context" src/context/EngagementContext.jsx
count_lines "Data" src/data/*.js
count_lines "Services" src/services/*.js

# ─── Summary ─────────────────────────────────────────────────────
printf "\n${BOLD}══ Summary ══${RESET}\n"
TOTAL=$((PASS + FAIL))
printf "  ${GREEN}%d passed${RESET}  ${RED}%d failed${RESET}  (${BOLD}%d total${RESET})\n\n" "$PASS" "$FAIL" "$TOTAL"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
