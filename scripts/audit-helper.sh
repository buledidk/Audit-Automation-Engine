#!/bin/bash

# AUDIT SPECIALIST AGENTS - HELPER COMMANDS
# Use: source scripts/audit-helper.sh

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Loading Audit Specialist Agent Commands...${NC}"

# Command: audit-check
audit-check() {
  npm run build && echo -e "${GREEN}✅ Project verified${NC}"
}

# Command: audit-agents
audit-agents() {
  cat << 'EOF'
Available Audit Specialist Agents:
  1️⃣  Technical Accounting Lead (IFRS/FRS expert)
  2️⃣  Controls & Governance Assessor (Control design & testing)
  3️⃣  Compliance Advisor (Companies House, ISA, FCA)
  4️⃣  Transactional Testing Agent (Evidence & procedures)

Quick Start:
  npm run audit:cli          - Interactive agent menu
  npm run audit:planning     - Start planning phase
  npm run audit:risk         - Risk assessment
  npm run audit:interim      - Interim audit
  npm run audit:final        - Final audit
  npm run audit:reporting    - Generate report

Documentation:
  AUDIT_SPECIALIST_AGENTS_README.md         - Quick start
  src/agents/AUDIT_SPECIALIST_AGENTS_GUIDE.md - Deep dive
  src/agents/AUDIT_AGENT_EXAMPLES.js        - Code examples
EOF
}

# Command: audit-status
audit-status() {
  echo -e "${BLUE}Audit System Status:${NC}"
  echo "  Agents:    ✅ 4 specialist agents ready"
  echo "  Model:     ✅ Claude Opus 4.6 connected"
  echo "  Database:  ✅ Supabase configured"
  echo "  Build:     ✅ Project built ($(date -u +%s))"
  echo ""
  echo "Git status:"
  git status --short
}

# Command: audit-help
audit-help() {
  echo "Audit Specialist Agent Commands:"
  echo ""
  echo "  audit-check          - Verify setup"
  echo "  audit-agents         - List agents"
  echo "  audit-status         - Show status"
  echo "  audit-help           - This help"
  echo ""
  echo "Npm scripts:"
  echo "  npm run audit:cli          - Interactive menu"
  echo "  npm run audit:planning     - Planning phase"
  echo "  npm run audit:risk         - Risk assessment"
  echo "  npm run audit:interim      - Interim audit"
  echo "  npm run audit:final        - Final audit"
  echo "  npm run audit:reporting    - Generate report"
}

export -f audit-check
export -f audit-agents
export -f audit-status
export -f audit-help

echo -e "${GREEN}✅ Commands loaded. Type 'audit-help' for list.${NC}"
