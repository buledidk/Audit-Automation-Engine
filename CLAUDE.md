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
- src/AuditEngine.jsx — Main monolith (all 6 audit phases)
- src/services/ — 9 AI agents coordinated via aiAgentOrchestrator
- src/components/ — UI components (MaterialityCalculator, CommentPanel, etc.)
- src/data/ — Audit frameworks, procedures, dropdown libraries
- src/lib/supabaseClient.js — Database client with graceful degradation
- database/schema.sql — Production PostgreSQL schema (18 tables)
- server/ — Express backend

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
