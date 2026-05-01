#!/bin/bash

##############################################################################
# AuditEngine Alias & Command Definitions
# Add to ~/.bashrc or ~/.zshrc to enable audit commands
##############################################################################

# Color definitions
readonly AUDIT_BLUE='\033[0;34m'
readonly AUDIT_GREEN='\033[0;32m'
readonly AUDIT_YELLOW='\033[1;33m'
readonly AUDIT_RED='\033[0;31m'
readonly AUDIT_NC='\033[0m' # No Color

# Project root
AUDIT_PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${AUDIT_PROJECT_ROOT}" 2>/dev/null || true

##############################################################################
# 1. AUDIT WORKFLOW COMMANDS
##############################################################################

# Start new audit engagement
alias audit-new='npm run audit:new -- '

# Show current engagement overview
alias audit-status='npm run audit:status'

# Open audit engagement dashboard
alias audit-dashboard='npm run audit:dashboard'

# List all active engagements
alias audit-list='npm run audit:list'

# Show phase progress for current engagement
audit-phases() {
  echo -e "${AUDIT_BLUE}📊 Current Audit Phases Status${AUDIT_NC}"
  npm run audit:phases -- "$@"
}

##############################################################################
# 2. RISK & PROCEDURES COMMANDS
##############################################################################

# Analyze risk for current engagement
audit-risk() {
  echo -e "${AUDIT_YELLOW}⚠️  Risk Assessment${AUDIT_NC}"
  npm run audit:risk -- "$@"
}

# Generate procedures from risk assessment
audit-procedures() {
  echo -e "${AUDIT_BLUE}📋 Auto-Generate Procedures${AUDIT_NC}"
  npm run audit:procedures -- "$@"
}

# Show ISA standards for current phase
audit-isa() {
  local phase="${1:-planning}"
  echo -e "${AUDIT_BLUE}📖 ISA Standards for ${phase}${AUDIT_NC}"
  npm run audit:isa -- "${phase}"
}

##############################################################################
# 3. WORKING PAPERS COMMANDS
##############################################################################

# List all working papers
alias audit-wp-list='npm run audit:wp-list'

# Create new working paper
audit-wp-create() {
  echo -e "${AUDIT_GREEN}📝 Create Working Paper${AUDIT_NC}"
  npm run audit:wp-create -- "$@"
}

# Pre-populate working paper from entity data
audit-wp-prepop() {
  echo -e "${AUDIT_GREEN}🔄 Pre-populate Working Paper${AUDIT_NC}"
  npm run audit:wp-prepop -- "$@"
}

# Export working papers to DOCX/XLSX
audit-wp-export() {
  echo -e "${AUDIT_GREEN}📊 Export Working Papers${AUDIT_NC}"
  npm run audit:wp-export -- "$@"
}

##############################################################################
# 4. CONTROLS & TESTING COMMANDS
##############################################################################

# Show control library
audit-controls() {
  echo -e "${AUDIT_BLUE}🔒 Control Library${AUDIT_NC}"
  npm run audit:controls -- "$@"
}

# Design control test procedures
audit-test-design() {
  echo -e "${AUDIT_YELLOW}🎯 Design Control Tests${AUDIT_NC}"
  npm run audit:test-design -- "$@"
}

# Record control test results
audit-test-result() {
  echo -e "${AUDIT_GREEN}✓ Record Test Result${AUDIT_NC}"
  npm run audit:test-result -- "$@"
}

# Control testing progress
audit-test-progress() {
  echo -e "${AUDIT_BLUE}📊 Control Testing Progress${AUDIT_NC}"
  npm run audit:test-progress -- "$@"
}

##############################################################################
# 5. ENTITY UNDERSTANDING COMMANDS
##############################################################################

# Complete entity understanding assessment
audit-entity() {
  echo -e "${AUDIT_BLUE}🏢 Entity Understanding${AUDIT_NC}"
  npm run audit:entity -- "$@"
}

# Analyze industry risks
audit-industry() {
  local industry="${1}"
  echo -e "${AUDIT_YELLOW}🏭 Industry Risk Analysis: ${industry}${AUDIT_NC}"
  npm run audit:industry -- "${industry}"
}

# Fraud risk assessment
audit-fraud() {
  echo -e "${AUDIT_RED}⚠️  Fraud Risk Assessment${AUDIT_NC}"
  npm run audit:fraud -- "$@"
}

# Going concern assessment
audit-going-concern() {
  echo -e "${AUDIT_YELLOW}⚠️  Going Concern Assessment${AUDIT_NC}"
  npm run audit:going-concern -- "$@"
}

##############################################################################
# 6. QUALITY CONTROL COMMANDS
##############################################################################

# Show quality control checkpoints
audit-qc-status() {
  echo -e "${AUDIT_BLUE}✅ Quality Control Status${AUDIT_NC}"
  npm run audit:qc-status -- "$@"
}

# Submit for quality control review
audit-qc-submit() {
  echo -e "${AUDIT_YELLOW}📋 Submit for QC Review${AUDIT_NC}"
  npm run audit:qc-submit -- "$@"
}

# Show QC reviewers & pending items
audit-qc-pending() {
  echo -e "${AUDIT_BLUE}⏳ Pending QC Reviews${AUDIT_NC}"
  npm run audit:qc-pending
}

# Partner approval for phase completion
audit-qc-approve() {
  echo -e "${AUDIT_GREEN}✓ Approve Phase${AUDIT_NC}"
  npm run audit:qc-approve -- "$@"
}

##############################################################################
# 7. DOCUMENTATION & REPORTING COMMANDS
##############################################################################

# Generate risk assessment memo
audit-memo-risk() {
  echo -e "${AUDIT_GREEN}📝 Generate Risk Memo${AUDIT_NC}"
  npm run audit:memo-risk -- "$@"
}

# Generate audit committee letter
audit-letter-committee() {
  echo -e "${AUDIT_GREEN}📝 Generate Audit Committee Letter${AUDIT_NC}"
  npm run audit:letter-committee -- "$@"
}

# Generate management letter
audit-letter-management() {
  echo -e "${AUDIT_GREEN}📝 Generate Management Letter${AUDIT_NC}"
  npm run audit:letter-management -- "$@"
}

# Generate final audit report
audit-report() {
  echo -e "${AUDIT_GREEN}📄 Generate Audit Report${AUDIT_NC}"
  npm run audit:report -- "$@"
}

# Generate KAM (Key Audit Matters)
audit-kam() {
  echo -e "${AUDIT_GREEN}📝 Generate KAM${AUDIT_NC}"
  npm run audit:kam -- "$@"
}

##############################################################################
# 8. COMPLIANCE & FRAMEWORK COMMANDS
##############################################################################

# Check ISA compliance for engagement
audit-compliance-isa() {
  echo -e "${AUDIT_BLUE}📋 ISA Compliance Check${AUDIT_NC}"
  npm run audit:compliance-isa -- "$@"
}

# Check regional compliance (UK, EU, US, Pakistan)
audit-compliance-regional() {
  local region="${1:-UK}"
  echo -e "${AUDIT_BLUE}🌍 Regional Compliance Check: ${region}${AUDIT_NC}"
  npm run audit:compliance-regional -- "${region}"
}

# Compliance checklist
audit-checklist() {
  echo -e "${AUDIT_BLUE}✅ Compliance Checklist${AUDIT_NC}"
  npm run audit:checklist -- "$@"
}

##############################################################################
# 9. COLLABORATION & TRACKING COMMANDS
##############################################################################

# Show team members & assignments
audit-team() {
  echo -e "${AUDIT_BLUE}👥 Team Members${AUDIT_NC}"
  npm run audit:team -- "$@"
}

# Add comment/note to engagement
audit-comment() {
  echo -e "${AUDIT_YELLOW}💬 Add Comment${AUDIT_NC}"
  npm run audit:comment -- "$@"
}

# Show activity log
audit-activity() {
  echo -e "${AUDIT_BLUE}📊 Activity Log${AUDIT_NC}"
  npm run audit:activity -- "$@"
}

# Real-time collaboration sync
audit-sync() {
  echo -e "${AUDIT_GREEN}🔄 Sync Engagement Data${AUDIT_NC}"
  npm run audit:sync
}

##############################################################################
# 10. DEVELOPMENT & TESTING COMMANDS
##############################################################################

# Start development server
alias audit-dev='npm run dev'

# Run audit-specific tests
audit-test() {
  echo -e "${AUDIT_BLUE}🧪 Run Audit Tests${AUDIT_NC}"
  npm run test -- "$@"
}

# Lint audit code
alias audit-lint='npm run lint'

# Format audit code
alias audit-format='npm run format'

# Type check (if applicable)
alias audit-types='npm run types'

##############################################################################
# 11. EXPORT & DELIVERY COMMANDS
##############################################################################

# Export to Word (DOCX)
audit-export-word() {
  echo -e "${AUDIT_GREEN}📄 Export to Word${AUDIT_NC}"
  npm run audit:export-word -- "$@"
}

# Export to Excel (XLSX)
audit-export-excel() {
  echo -e "${AUDIT_GREEN}📊 Export to Excel${AUDIT_NC}"
  npm run audit:export-excel -- "$@"
}

# Export to PDF
audit-export-pdf() {
  echo -e "${AUDIT_GREEN}📄 Export to PDF${AUDIT_NC}"
  npm run audit:export-pdf -- "$@"
}

# Generate delivery package
audit-delivery() {
  echo -e "${AUDIT_GREEN}📦 Create Delivery Package${AUDIT_NC}"
  npm run audit:delivery -- "$@"
}

##############################################################################
# 12. DATABASE & DATA COMMANDS
##############################################################################

# Backup engagement data
audit-backup() {
  echo -e "${AUDIT_GREEN}💾 Backup Engagement Data${AUDIT_NC}"
  npm run audit:backup -- "$@"
}

# Sync with Supabase
alias audit-db-sync='npm run audit:db-sync'

# Database statistics
alias audit-db-stats='npm run audit:db-stats'

##############################################################################
# 13. UTILITY & HELP COMMANDS
##############################################################################

# Show all audit commands
audit-help() {
  cat << 'HELP_TEXT'

╔════════════════════════════════════════════════════════════════════════════╗
║                     AuditEngine Terminal Commands                          ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 WORKFLOW COMMANDS
  audit-new [name]              Create new audit engagement
  audit-status                  Show current status
  audit-dashboard               Open dashboard
  audit-list                    List all engagements
  audit-phases                  Show phase progress

⚠️  RISK COMMANDS
  audit-risk [options]          Analyze risks
  audit-procedures              Generate procedures
  audit-isa [phase]             Show ISA standards
  audit-industry [name]         Industry risk analysis
  audit-fraud                   Fraud risk assessment
  audit-going-concern           Going concern assessment

📋 WORKING PAPERS
  audit-wp-list                 List all WPs
  audit-wp-create [name]        Create new WP
  audit-wp-prepop [wp]          Pre-populate WP
  audit-wp-export [format]      Export WPs (docx/xlsx)

🔒 CONTROLS & TESTING
  audit-controls [cycle]        Show control library
  audit-test-design [control]   Design control tests
  audit-test-result [test]      Record test result
  audit-test-progress           Show testing progress

🏢 ENTITY UNDERSTANDING
  audit-entity [options]        Entity assessment
  audit-fraud                   Fraud risk assessment
  audit-going-concern           Going concern assessment

✅ QUALITY CONTROL
  audit-qc-status               QC checkpoint status
  audit-qc-submit [phase]       Submit for review
  audit-qc-pending              Show pending reviews
  audit-qc-approve [phase]      Approve phase

📝 DOCUMENTATION
  audit-memo-risk               Generate risk memo
  audit-letter-committee        Generate committee letter
  audit-letter-management       Generate management letter
  audit-report                  Generate audit report
  audit-kam                     Generate KAM

🌍 COMPLIANCE
  audit-compliance-isa          Check ISA compliance
  audit-compliance-regional     Check regional compliance
  audit-checklist               Show compliance checklist

👥 COLLABORATION
  audit-team                    Show team members
  audit-comment [msg]           Add comment
  audit-activity                Show activity log
  audit-sync                    Sync data

💻 DEVELOPMENT
  audit-dev                     Start dev server
  audit-test                    Run tests
  audit-lint                    Lint code
  audit-format                  Format code

📦 EXPORT & DELIVERY
  audit-export-word [file]      Export to Word
  audit-export-excel [file]     Export to Excel
  audit-export-pdf [file]       Export to PDF
  audit-delivery                Create delivery package

💾 DATABASE
  audit-backup                  Backup data
  audit-db-sync                 Sync with Supabase
  audit-db-stats                Database statistics

❓ HELP
  audit-help                    Show this help

════════════════════════════════════════════════════════════════════════════════

For more information:
  • Documentation: docs/AUDIT_FRAMEWORK/AUDIT_FRAMEWORK_COMPLETE_GUIDE.md
  • Quick Reference: docs/AUDIT_FRAMEWORK/QUICK_REFERENCE.md
  • ISA Framework: src/frameworks/isa-standards/ISA_Framework.js

════════════════════════════════════════════════════════════════════════════════

HELP_TEXT
}

# Quick reference
audit-quick-ref() {
  cat << 'QUICK_REF'

╔════════════════════════════════════════════════════════════════════════════╗
║                    AuditEngine Quick Reference                            ║
╚════════════════════════════════════════════════════════════════════════════╝

AUDIT WORKFLOW:
  1. audit-new "Client Name"         → Create engagement
  2. audit-entity                    → Understand entity
  3. audit-risk                      → Assess risks
  4. audit-procedures                → Generate procedures
  5. audit-wp-create                 → Create working papers
  6. audit-test-design               → Design tests
  7. audit-qc-submit                 → Submit for review
  8. audit-report                    → Generate report

QUICK CHECKS:
  audit-status                       → Overall status
  audit-phases                       → Phase progress
  audit-qc-pending                   → Pending approvals
  audit-activity                     → Recent activity

EXPORTS:
  audit-export-word                  → Export to Word
  audit-export-excel                 → Export to Excel
  audit-delivery                     → Create package

HELP & INFO:
  audit-help                         → All commands
  audit-isa planning                 → ISA for Planning phase
  audit-compliance-isa               → ISA compliance status

════════════════════════════════════════════════════════════════════════════════

QUICK_REF
}

# Show version
audit-version() {
  echo "AuditEngine v2026.1"
  echo "Last Updated: March 20, 2026"
  npm -v | sed 's/^/npm: /'
  node -v | sed 's/^/node: /'
}

