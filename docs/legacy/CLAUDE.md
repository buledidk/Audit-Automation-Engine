# CLAUDE.md — AuditEngine Project Configuration

## Project Overview
AuditEngine is a professional audit automation platform built with React + Vite. It covers the complete ISA audit lifecycle: Planning, Risk Assessment, Interim, Final Audit, Completion, and Reporting.

## Tech Stack
- Frontend: React 18 + Vite (deployed on Vercel)
- Database: Supabase (PostgreSQL) — project: mbvjtondgunckgzrmyhq
- AI: Claude API via @anthropic-ai/sdk
- Export: docx + xlsx libraries
- CI/CD: GitHub Actions (Node 20.x, @v4 actions)

## Architecture

### Core Application
- src/AuditEngine.jsx — Main monolith (all 6 audit phases)
- src/services/ — 9+ AI agents coordinated via aiAgentOrchestrator
- src/components/ — UI components (MaterialityCalculator, CommentPanel, etc.)
- src/lib/supabaseClient.js — Database client with graceful degradation
- database/schema.sql — Production PostgreSQL schema (18 tables)
- server/ — Express backend

### Comprehensive Audit Framework (NEW)
- **src/frameworks/** — ISA and regional standards definitions
  - isa-standards/ISA_Framework.js — ISA 200-599 standards alignment
  - regional-standards/Regional_Standards.js — UK, EU, US, Pakistan requirements
  - AuditFrameworkIndex.js — Central framework registry with orchestration
- **src/audit-stages/** — Detailed phase documentation (6 phases)
  - planning/ — Phase 1: Planning (ISA 200, 210, 220, 320, 330)
  - risk-assessment/ — Phase 2: Risk Assessment (ISA 315, 330, 402)
  - interim/ — Phase 3: Interim Audit (ISA 330, 500, 501, 505, 510)
  - final-audit/ — Phase 4: Final Audit (ISA 500, 501, 560, 570, 580, 600)
  - completion/ — Phase 5: Completion (ISA 560, 570, 580, 620, 700)
  - reporting/ — Phase 6: Reporting (ISA 700, 705, 706, 710, 720)
- **src/requirements/** — Audit requirements and expectations
  - AuditRequirementsFramework.js — Cross-phasing requirements
  - compliance/ — Compliance checklists
  - expectations/ — Role-based expectations
  - controls/ — Control design requirements
- **docs/AUDIT_FRAMEWORK/** — Comprehensive documentation
  - AUDIT_FRAMEWORK_COMPLETE_GUIDE.md — Full framework guide
  - QUICK_REFERENCE.md — Phase checklists and quick lookup
- src/data/ — Audit procedures, dropdown libraries

## Environment Variables (Vercel)
- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — Supabase connection
- VITE_CLAUDE_API_KEY — AI features
- POSTGRES_* — Direct database access (auto-synced via Vercel-Supabase integration)

## Deployment Pipeline
GitHub (buledidk/Audit-Engine) -> Vercel (auditengine) -> auditengine.vercel.app
Supabase: AuditEngine project under Indus Nexus Limited org (PRO plan)

## Rules for Claude Code
1. ALWAYS work on main branch — do NOT create new branches
2. NEVER create branches named claude/* — they break CI and create noise
3. Test changes pass npm run lint before committing
4. CI uses Node 20.x only — do not add Node 18.x
5. Keep vercel.json clean — no @secret references
6. The .env.example shows required env vars — never hardcode secrets
7. supabaseClient.js has graceful degradation — app works offline

## Current Status (March 2026)
- Production: LIVE at auditengine.vercel.app
- Database: 18 tables deployed in Supabase with RLS enabled
- All 19 env vars configured in Vercel
- CI: 6/6 green on main
- Separate project: Indus-Nexus-Limited (parked, do not merge)
