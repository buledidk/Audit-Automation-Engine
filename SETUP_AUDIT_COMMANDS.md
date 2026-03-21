# 🚀 AuditEngine Terminal Commands Setup Guide

**Version**: 2026.1
**Last Updated**: March 20, 2026
**Status**: ✅ Ready to Install

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Terminal Aliases Setup](#terminal-aliases-setup)
3. [Git Hooks Setup](#git-hooks-setup)
4. [NPM Scripts Configuration](#npm-scripts-configuration)
5. [Command Reference](#command-reference)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)

---

## 🚀 Quick Start

### One-Command Setup

```bash
cd /path/to/Audit-Automation-Engine
bash .setup-audit-commands.sh
```

This will:
1. ✅ Create `.audit-aliases.sh` with all audit commands
2. ✅ Optionally add to `~/.bashrc` and/or `~/.zshrc`
3. ✅ Configure git hooks
4. ✅ Display setup completion message

### Manual Reload After Setup

```bash
# For bash
source ~/.bashrc

# For zsh
source ~/.zshrc
```

### Verify Installation

```bash
audit-help
audit-version
```

---

## 💻 Terminal Aliases Setup

### What Gets Installed

The setup script creates `.audit-aliases.sh` which includes:

- **13 command categories** (90+ commands total)
- **Color-coded output** for easy reading
- **Built-in help system**
- **Shell integration** (bash, zsh, sh)

### Manual Installation

If automatic setup doesn't work:

```bash
# 1. Source the aliases in your shell config
echo 'source /path/to/Audit-Automation-Engine/.audit-aliases.sh' >> ~/.bashrc

# 2. Reload your shell
source ~/.bashrc

# 3. Verify
audit-help
```

### Available Command Categories

| Category | Commands | Example |
|----------|----------|---------|
| **Workflow** | 5 | `audit-new`, `audit-status` |
| **Risk** | 5 | `audit-risk`, `audit-isa` |
| **Working Papers** | 4 | `audit-wp-create`, `audit-wp-export` |
| **Controls** | 4 | `audit-controls`, `audit-test-design` |
| **Entity** | 4 | `audit-entity`, `audit-fraud` |
| **QC** | 4 | `audit-qc-status`, `audit-qc-approve` |
| **Docs** | 5 | `audit-report`, `audit-memo-risk` |
| **Compliance** | 3 | `audit-compliance-isa`, `audit-checklist` |
| **Collaboration** | 4 | `audit-team`, `audit-sync` |
| **Development** | 4 | `audit-dev`, `audit-test` |
| **Export** | 4 | `audit-export-word`, `audit-delivery` |
| **Database** | 3 | `audit-backup`, `audit-db-sync` |
| **Help** | 3 | `audit-help`, `audit-quick-ref` |

---

## 🔗 Git Hooks Setup

### What Gets Installed

Git hooks automatically run checks before commits and pushes:

```
.githooks/
├── pre-commit          # Runs before every commit
├── commit-msg          # Validates commit message
├── pre-push            # Runs before pushing
└── post-merge          # Updates after merging
```

### Enable Git Hooks

```bash
# Configure git to use .githooks directory
git config core.hooksPath .githooks

# Verify hooks are enabled
git config core.hooksPath
# Output: .githooks
```

### Pre-Commit Hook Features

The `pre-commit` hook checks:

1. **Code Style** - ESLint validation
2. **Framework Files** - Audit framework changes tracked
3. **ISA Compliance** - ISA standards verified
4. **Tests** - Jest tests pass
5. **Debug Statements** - console.log/debugger removed
6. **File Sizes** - Large files flagged
7. **Commit Readiness** - All checks passed

### Hook Behavior

```bash
# If checks pass:
✅ Pre-commit checks complete!

# If checks fail:
❌ ESLint check failed. Fix errors before committing.
   Tip: Run 'npm run lint -- --fix' to auto-fix issues
```

### Bypass Hooks (if needed)

```bash
# Skip pre-commit hook
git commit --no-verify

# Not recommended - only for emergency fixes!
```

---

## 📝 NPM Scripts Configuration

### Add to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "format": "prettier --write src",
    "test": "jest",

    "audit:new": "node scripts/audit-new.js",
    "audit:status": "node scripts/audit-status.js",
    "audit:dashboard": "vite --open",
    "audit:list": "node scripts/audit-list.js",
    "audit:phases": "node scripts/audit-phases.js",

    "audit:risk": "node scripts/audit-risk.js",
    "audit:procedures": "node scripts/audit-procedures.js",
    "audit:isa": "node scripts/audit-isa.js",
    "audit:industry": "node scripts/audit-industry.js",
    "audit:fraud": "node scripts/audit-fraud.js",
    "audit:going-concern": "node scripts/audit-going-concern.js",

    "audit:wp-list": "node scripts/audit-wp-list.js",
    "audit:wp-create": "node scripts/audit-wp-create.js",
    "audit:wp-prepop": "node scripts/audit-wp-prepop.js",
    "audit:wp-export": "node scripts/audit-wp-export.js",

    "audit:controls": "node scripts/audit-controls.js",
    "audit:test-design": "node scripts/audit-test-design.js",
    "audit:test-result": "node scripts/audit-test-result.js",
    "audit:test-progress": "node scripts/audit-test-progress.js",

    "audit:entity": "node scripts/audit-entity.js",

    "audit:qc-status": "node scripts/audit-qc-status.js",
    "audit:qc-submit": "node scripts/audit-qc-submit.js",
    "audit:qc-pending": "node scripts/audit-qc-pending.js",
    "audit:qc-approve": "node scripts/audit-qc-approve.js",

    "audit:memo-risk": "node scripts/audit-memo-risk.js",
    "audit:letter-committee": "node scripts/audit-letter-committee.js",
    "audit:letter-management": "node scripts/audit-letter-management.js",
    "audit:report": "node scripts/audit-report.js",
    "audit:kam": "node scripts/audit-kam.js",

    "audit:compliance-isa": "node scripts/audit-compliance-isa.js",
    "audit:compliance-regional": "node scripts/audit-compliance-regional.js",
    "audit:checklist": "node scripts/audit-checklist.js",

    "audit:team": "node scripts/audit-team.js",
    "audit:comment": "node scripts/audit-comment.js",
    "audit:activity": "node scripts/audit-activity.js",
    "audit:sync": "node scripts/audit-sync.js",

    "audit:export-word": "node scripts/audit-export-word.js",
    "audit:export-excel": "node scripts/audit-export-excel.js",
    "audit:export-pdf": "node scripts/audit-export-pdf.js",
    "audit:delivery": "node scripts/audit-delivery.js",

    "audit:backup": "node scripts/audit-backup.js",
    "audit:db-sync": "node scripts/audit-db-sync.js",
    "audit:db-stats": "node scripts/audit-db-stats.js"
  }
}
```

---

## 📖 Command Reference

### 1. WORKFLOW COMMANDS

```bash
# Create new engagement
audit-new "Client Name 2026"

# Show current engagement status
audit-status

# Open dashboard
audit-dashboard

# List all engagements
audit-list

# Show phase progress
audit-phases
```

### 2. RISK COMMANDS

```bash
# Analyze risks for engagement
audit-risk

# Auto-generate procedures from risks
audit-procedures

# Show ISA standards for phase
audit-isa planning              # Show ISA for Planning phase
audit-isa risk-assessment       # Show ISA for Risk Assessment

# Industry risk analysis
audit-industry manufacturing    # Show manufacturing risks

# Fraud risk assessment
audit-fraud

# Going concern assessment
audit-going-concern
```

### 3. WORKING PAPERS

```bash
# List all working papers
audit-wp-list

# Create new working paper
audit-wp-create Revenue         # Create Revenue WP
audit-wp-create Receivables

# Pre-populate from entity data
audit-wp-prepop Revenue         # Auto-fill Revenue WP

# Export working papers
audit-wp-export docx            # Export to Word
audit-wp-export xlsx            # Export to Excel
audit-wp-export all             # Export all formats
```

### 4. CONTROLS & TESTING

```bash
# Show control library
audit-controls                  # All controls
audit-controls revenue          # Revenue cycle only
audit-controls expenditure      # Expenditure cycle

# Design control tests
audit-test-design RC-001        # Design test for RC-001

# Record test results
audit-test-result RC-001        # Record results

# Show testing progress
audit-test-progress
```

### 5. ENTITY UNDERSTANDING

```bash
# Complete entity understanding
audit-entity

# Fraud risk assessment
audit-fraud

# Going concern assessment
audit-going-concern
```

### 6. QUALITY CONTROL

```bash
# Show QC checkpoint status
audit-qc-status

# Submit for QC review
audit-qc-submit planning        # Submit Planning phase

# Show pending QC reviews
audit-qc-pending

# Approve phase
audit-qc-approve planning       # Approve Planning phase
```

### 7. DOCUMENTATION

```bash
# Generate risk assessment memo
audit-memo-risk

# Generate audit committee letter
audit-letter-committee

# Generate management letter
audit-letter-management

# Generate final audit report
audit-report

# Generate Key Audit Matters
audit-kam
```

### 8. COMPLIANCE

```bash
# Check ISA compliance
audit-compliance-isa

# Check regional compliance
audit-compliance-regional uk    # Check UK requirements
audit-compliance-regional eu    # Check EU requirements

# Show compliance checklist
audit-checklist
```

### 9. COLLABORATION

```bash
# Show team members
audit-team

# Add comment
audit-comment "Issue with inventory count"

# Show activity log
audit-activity

# Sync data
audit-sync
```

### 10. DEVELOPMENT

```bash
# Start development server
audit-dev

# Run tests
audit-test

# Lint code
audit-lint

# Format code
audit-format
```

### 11. EXPORT & DELIVERY

```bash
# Export to Word
audit-export-word

# Export to Excel
audit-export-excel

# Export to PDF
audit-export-pdf

# Create delivery package
audit-delivery
```

### 12. DATABASE

```bash
# Backup data
audit-backup

# Sync with Supabase
audit-db-sync

# Show database statistics
audit-db-stats
```

### 13. HELP

```bash
# Show all commands
audit-help

# Show quick reference
audit-quick-ref

# Show version
audit-version
```

---

## 🔧 Troubleshooting

### Issue: Commands Not Found

**Problem**: `audit-help: command not found`

**Solution**:
```bash
# Check if aliases file was created
ls -la .audit-aliases.sh

# Manually source it
source /path/to/Audit-Automation-Engine/.audit-aliases.sh

# Verify
audit-help
```

### Issue: Git Hooks Not Running

**Problem**: Pre-commit checks don't run before commit

**Solution**:
```bash
# Check if hooks path is configured
git config core.hooksPath

# If empty, configure it
git config core.hooksPath .githooks

# Verify
ls -la .githooks/
```

### Issue: Commands Not in PATH

**Problem**: Some commands don't work even after setup

**Solution**:
```bash
# Verify npm is in PATH
which npm

# Verify npm scripts are configured
npm run | grep audit:

# If not showing, ensure package.json has scripts
cat package.json | grep "audit:"
```

### Issue: Permission Denied on Hooks

**Problem**: `permission denied` when running git commit

**Solution**:
```bash
# Make hooks executable
chmod +x .githooks/*

# Verify
ls -la .githooks/
# Should show: -rwxr-xr-x (executable)
```

---

## 🎯 Advanced Configuration

### Custom Aliases

Create `~/.audit-custom-aliases.sh`:

```bash
#!/bin/bash

# Add custom audit commands
audit-my-custom() {
  echo "Running custom command..."
  npm run my-custom-script
}

# Add shortcuts
alias adash='audit-dashboard'
alias awp='audit-wp-list'
alias aqc='audit-qc-status'
```

Then source it:
```bash
echo 'source ~/.audit-custom-aliases.sh' >> ~/.bashrc
```

### Custom Git Hooks

Edit `.githooks/pre-commit` to add:

```bash
# Your custom checks here
echo "🔍 Running custom checks..."

# Example: Check for specific patterns
if grep -r "FIXME" src/ 2>/dev/null | grep -q .; then
  echo "⚠️  Found FIXME comments. Address before committing."
fi
```

### Environment Variables

Create `.audit.env`:

```bash
# Project settings
AUDIT_PROJECT_ROOT=/path/to/Audit-Automation-Engine
AUDIT_ENV=development
AUDIT_DEBUG=false

# Default client name
AUDIT_DEFAULT_CLIENT="My Organization"

# Default materiality percentage
AUDIT_DEFAULT_MATERIALITY=5
```

Then source in `.audit-aliases.sh`:
```bash
if [ -f .audit.env ]; then
  source .audit.env
fi
```

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# ✅ Check aliases installed
[ -f .audit-aliases.sh ] && echo "✅ Aliases file exists"

# ✅ Check git hooks configured
git config core.hooksPath | grep -q ".githooks" && echo "✅ Git hooks configured"

# ✅ Check hooks are executable
[ -x .githooks/pre-commit ] && echo "✅ Pre-commit hook is executable"

# ✅ Test a command
audit-help > /dev/null 2>&1 && echo "✅ Audit commands working"

# ✅ Check npm scripts
npm run | grep -q "audit:" && echo "✅ NPM audit scripts configured"
```

---

## 🚀 Getting Started

### Day 1: Setup

```bash
# 1. Run setup
bash .setup-audit-commands.sh

# 2. Reload shell
source ~/.bashrc

# 3. Verify
audit-help
```

### Day 2: First Engagement

```bash
# 1. Create engagement
audit-new "Acme Corp 2026"

# 2. Understand entity
audit-entity

# 3. Assess risks
audit-risk

# 4. Generate procedures
audit-procedures

# 5. Create working papers
audit-wp-create Revenue
audit-wp-prepop Revenue

# 6. Check compliance
audit-compliance-isa
```

### Day 3: Quality Control

```bash
# 1. Check QC status
audit-qc-status

# 2. Review phase
audit-qc-pending

# 3. Approve phase
audit-qc-approve planning

# 4. Generate report
audit-report
```

---

## 📞 Support

- **Documentation**: `docs/AUDIT_FRAMEWORK/`
- **Quick Reference**: `docs/AUDIT_FRAMEWORK/QUICK_REFERENCE.md`
- **Framework**: `src/frameworks/AuditFrameworkIndex.js`

---

## 📝 Notes

- All commands are **non-destructive** (no permanent changes without confirmation)
- Commands work **offline** (with local data)
- Changes **sync to Supabase** when connected
- All actions are **logged** (audit trail per ISA 230)

---

**Setup Status**: ✅ Ready to Use
**Version**: 2026.1
**Last Updated**: March 20, 2026

🚀 **Ready to audit smarter, faster, and better together!**
