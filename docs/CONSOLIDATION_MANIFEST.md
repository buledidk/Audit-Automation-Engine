# AuditEngine — Consolidation Manifest

**Generated:** 2026-04-19
**Canonical repo:** `buledidk/Audit-Engine` (public, v10 AURA)
**Retired repo:** `buledidk/Auditengine` (private, v6 SPA — kept read-only for audit trail)
**Branch:** `claude/setup-audit-engine-jHZUk`

## Why

Two repos carried the "AuditEngine" name. `Audit-Engine` is the live React 19 + Vite 8 platform (v10). `Auditengine` was a 3-file private prototype (v6 single-page HTML). The two were drifting; this commit folds v6 into v10 as a frozen `legacy/v6/` snapshot so there is one codebase, one deploy target, and one place to add new work.

## v6 files now in v10

Folder: [`legacy/v6/`](../legacy/v6/)

| Path | SHA-256 | Lines | Size | Superseded by |
|---|---|---|---|---|
| `legacy/v6/index.html` | `dd5c2d59…dec3` | 724 | 128,146 B | `index.html` + `src/AuditEngine_AURA.jsx` |
| `legacy/v6/AuditFrameworks.js` | `78b22d71…bcc2` | 112 | 5,515 B | `src/data/AuditFrameworks.js` |
| `legacy/v6/WorkingPaperGenerator.js` | `c42a3860…a716` | 280 | 11,137 B | `src/services/WorkingPaperGenerator.js` |

Files are copied, not symlinked. They are not part of the Vite build graph (`vite.config.js` has not changed). If removed, nothing breaks.

## Root markdown artifacts (the "attached artifacts")

The 23 `.md` files already at the root of `Audit-Engine` are the authoritative project-knowledge artifacts. One-line purpose:

| File | Purpose |
|---|---|
| `AUDITENGINE_README.md` | Main README — features, stack, setup |
| `CLAUDE.md` | Project metadata for Claude Code sessions |
| `DEPLOYMENT_RUNBOOK.md` | GitHub ↔ Vercel ↔ Supabase single source of truth |
| `MASTER_IMPLEMENTATION_CHECKLIST.md` | Phase-by-phase setup checklist |
| `IMPLEMENTATION_CHECKLIST.md` | Implementation tracking |
| `IMPLEMENTATION_COMPLETE.md` | Status report |
| `FINAL_SYSTEM_REPORT.md` | Final verification report |
| `FINAL_VERIFICATION_CHECKLIST.md` | QA verification checklist |
| `COMPREHENSIVE_EXECUTION_REPORT.md` | Detailed execution summary |
| `NEXT_STEPS_ROADMAP.md` | Remaining integration steps |
| `QUICK_ACTION_SUMMARY.md` | Quick action items |
| `PROGRESS_EXECUTION_REPORT_2026-03-27.md` | Progress as of 2026-03-27 |
| `CONSOLIDATION_SUMMARY.md` | March 2026 documentation reorganization |
| `TERMINAL_COMMANDS.md` | Copy-paste command reference |
| `PHASE_6_COMPREHENSIVE_IMPLEMENTATION.md` | Phase 6 details |
| `PHASE_8_IMPLEMENTATION_STATUS.md` | Phase 8 & 8.5 completion |
| `ACCURACY_ENGINE_IMPLEMENTATION_SUMMARY.md` | 15 accuracy enhancement modules |
| `ACCURACY_ENHANCEMENT_QUICKSTART.md` | Quick setup guide |
| `ACCURACY_ENHANCEMENT_QUICKSTART 2.md` | Alternate quickstart (duplicate-ish) |
| `AUDIT_AUTOMATION_INTEGRATION_GUIDE.md` | Integration procedures |

## v10 source-module index (reference for Project-knowledge upload)

From `src/` — these are the modules the claude.ai Project knowledge pane should contain:

| Module | Purpose |
|---|---|
| `main.jsx` | Vite entry; mounts `AuditEngine_AURA` |
| `AuditEngine_AURA.jsx` | v10 main shell (supersedes `App.jsx`) |
| `AuditEngine_Portal.jsx` | 4-phase onboarding wizard |
| `App.jsx` | v9.1 legacy shell (kept for reference) |
| `AuditMethodology.js` | Pre-populated working paper content (2,555 lines) |
| `StandardsLibrary.js` | ISA (UK) 200–720 + ISQM 1/2 (2,030 lines) |
| `IFRSEncyclopaedia.js` | IAS 1–41 + IFRS 1–18 |
| `FRSEncyclopaedia.js` | FRS 100–105 |
| `RegulatoryData.js` | 25 UK regulators (FCA, FRC, ICAEW, …) (3,098 lines) |
| `AuditResearch.js` | Academic + FRC thematic reviews |
| `CrossReferenceIndex.js` | ISA ↔ FRS ↔ FSLI cross-refs |
| `FinancialModels.js` | 18 calculators (DCF, ECL, leases, Black-Scholes) |
| `ChartOfAccounts.js` | Industry-specific COA templates |
| `DataExtractor.js` | TB / trial balance parser |
| `ExcelGenerator.js` | ExcelJS-based export |
| `WordGenerator.js` | docx-based export |
| `StorageEngine.js` | localStorage + Supabase write-through cache |
| `ReconciliationEngine.js` | Lead ↔ testing ↔ FS reconciliation |
| `IntegrationsEngine.js` | Live Anthropic API wiring |

Root config for the upload: `package.json`, `vite.config.js`, `index.html`, `vercel.json`.

Server (if the Project needs backend context): everything under `server/` that is not a test file.

## Wiring — unchanged

This commit is **additive only**. The following are untouched and must stay the source of truth:

- `vercel.json` — multi-region CDG/LHR/SFO + SPA rewrite + `github.enabled: true`
- `database/supabase-schema.sql` — 5 tables, RLS, 6 indexes
- `src/supabaseClient.js` — graceful `null` fallback when env vars absent
- `.env.example` — documents all expected env var names
- `.github/workflows/{deploy,test,security}.yml` — CI/CD pipelines

For the full wiring walkthrough, see [`DEPLOYMENT_RUNBOOK.md`](../DEPLOYMENT_RUNBOOK.md).

## What this commit does NOT do

- No changes under `src/`
- No changes to `package.json`, `vercel.json`, `vite.config.js`, `database/supabase-schema.sql`
- No secret rotation, no env var changes
- No redeploy, no Supabase SQL re-run
- Does not remove any root `.md` file
- Does not delete or archive `buledidk/Auditengine`. That repo now carries a pointer README on the same branch name.
