---
name: auditengine-saas-architecture
description: "Use when working on AuditEngine SaaS platform architecture, build decisions, deployment, or compliance. Stack: React 19 / Vite 8 (frontend) + Express 5 (backend) + Supabase PostgreSQL (offline-first DB) + Anthropic Claude API (Sonnet 4.6 primary, Opus 4.6 agents, Haiku 4.5 fast) + Vercel (auditengine.agency, multi-region CDG/LHR/SFO). Regulatory: ISA (UK) 200-810, FCA, FRS 100-105, Companies Act 2006, FRC Ethical Standard 2024, GDPR, AML. Launch blockers: ICO registration, DPIA, client DPAs, immutable evidence archive (7-yr), ICAEW Technology Accreditation. Trigger on 'AuditEngine backend', 'UK audit SaaS stack', 'multi-tenant SaaS', 'Supabase audit', 'ISA 230 retention', 'Vercel deploy AuditEngine', 'ICAEW accreditation', 'DPIA audit SaaS', 'Claude API in audit', 'audit trail schema', 'StorageEngine', 'auditengine.agency'."
---

# AuditEngine SaaS Architecture — v10.0.0 AURA

Source of truth: `~/audit-engine/CLAUDE.md`

## Current stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite 8 + React Router 7 (JSX, not TypeScript) | Fast dev, SPA performance, code-splitting via manualChunks |
| UI libs | ExcelJS, docx, xlsx, PapaParse, pdfkit, pdfmake | In-browser + server-side export |
| AI | Claude Sonnet 4.6 (primary), Opus 4.6 (agents), Haiku 4.5 (fast), GPT-4 (fallback), Ollama (local) | Multi-model selection via `modelSelectionService` |
| Backend | Express 5 + Socket.io 4.8 (Node 20.x) | `server/app.js` + 4 route modules |
| Database | Supabase PostgreSQL | Offline-first: localStorage primary, Supabase is async cloud sync via `StorageEngine.js` |
| Auth | Supabase Auth (JWT-backed, RLS enforces tenant isolation) | |
| Storage | Supabase Storage (current). Immutable evidence archive TBC — S3 Object Lock COMPLIANCE mode or equivalent needed for 7-year retention | ISA 230 audit-file assembly rule |
| Frontend + API host | Vercel | `auditengine.agency`, multi-region CDG/LHR/SFO, auto-deploy on main |
| Domain | `auditengine.agency` (live) | |

## Architecture highlights

### Dual agent orchestration

1. **AgentOrchestrator** (`src/agents/AgentOrchestrator.js`) — Task queue + step execution. Entry point: `runAgent(agentName, engagementState, options)`. Consumes 13 agent definitions from `src/agents/definitions/`.

2. **AgentFramework** (`src/agents/AgentFramework.js`) — Lower-level Claude API integration. Extends EventEmitter. Handles agent registration, GDPR compliance tracking, multi-model selection, token/latency metrics.

3. **HeadAgent** (`src/agents/HeadAgent.js`) — Master orchestrator for 18 agents, health monitoring every 30s, workload balancing, auto-recovery.

### Write-through cache (StorageEngine)

`src/StorageEngine.js` — localStorage is truth for the active session. Supabase is async cloud sync.

- Writes hit localStorage instantly via `safeSet()`, then fire-and-forget upsert to Supabase after 1500ms debounce
- 15 persisted state keys prefixed `ae_`: cfg, cellData, signOffs, wpNotes, customItems, tbData, tbMappings, uploads, archived, reviewStatus, integrations, signOffLog, reviewNotes, documentLinks, changeLog
- `isSupabaseConfigured()` can be false — always handle gracefully
- Never block UI on Supabase response

## Regulatory / legal prerequisites (launch blockers)

- [ ] GDPR: UK adequacy decision valid until 27 Dec 2031 — DPAs with Supabase, Vercel, Anthropic, GitHub, Stripe
- [ ] ICO registration as data controller
- [ ] DPIA — required for high-risk processing (AI-assisted audit = high risk)
- [ ] Breach notification process — 72-hour window
- [ ] Client DPAs — template before first paid engagement
- [ ] ISA 230 audit-trail table — append-only, hash-chained, immutable
- [ ] Immutable evidence archive — 7-year COMPLIANCE mode (provider TBC)
- [ ] ISQM 1 — firm-level quality management for Anthropic (self)
- [ ] ICAEW Technology Accreditation application (post-beta feedback)

## Regulatory scope baked into codebase

- ISA (UK) 200-810 (37 standards) + ISQM 1 & 2
- FCA: PRIN, SYSC, CASS, MIFIDPRU, Consumer Duty (PS22/9)
- FRS 100-105 (2026 amendments), all 35 FRS 102 sections
- Companies Act 2006 (62 references)
- FRC Ethical Standard 2024
- Cross-cutting: AML, GDPR, Bribery Act, Modern Slavery, Sanctions

## Multi-tenant model

```
Organisation (firm)
  └─ User (partner / manager / senior / junior)
       └─ Engagement (one client x one year)
            └─ WorkingPaper (47 per engagement)
                 └─ TestingRow / SignOff / Note / Attachment
```

Row-level security on `engagement_id` via Supabase RLS policies. No tenant sees another tenant's data at the database layer.

Tables: `engagements`, `engagement_data`, `documents`, `document_links`, `audit_trail`. RLS on all tables. Server uses `service_role` key (bypasses RLS). Frontend uses `anon` key (respects RLS).

## Audit-trail table (ISA 230 immutable)

```sql
CREATE TABLE audit_trail (
  id            BIGSERIAL PRIMARY KEY,
  engagement_id UUID NOT NULL,
  user_id       UUID NOT NULL,
  wp_ref        TEXT,
  action        TEXT NOT NULL,   -- create|edit|signoff|export|ai_query
  payload       JSONB,
  prev_hash     TEXT,
  row_hash      TEXT NOT NULL,   -- sha256(prev_hash || payload || ts)
  occurred_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Only INSERT allowed; no UPDATE, no DELETE (enforce via RLS + immutable archive)
```

## AI prompt-caching pattern (cost)

Cache ISA standards + firm methodology + engagement context once per session. Only the user prompt and the WP context vary per call. Reduces repeated input tokens by up to 90%.

## Key source files

| File | Size | Content |
|---|---|---|
| `src/StandardsLibrary.js` | 168 KB | 37 ISA (UK) standards (authoritative) |
| `src/RegulatoryData.js` | 188 KB | FCA handbook + ISQM + Ethical Standard |
| `src/AuditMethodology.js` | 248 KB | Risk trilogy + procedures |
| `src/FRSEncyclopaedia.js` | 132 KB | FRS 100-105, all 35 FRS 102 sections |
| `src/IFRSEncyclopaedia.js` | 128 KB | IFRS standards |
| `src/ChartOfAccounts.js` | 148 KB | Full chart of accounts |
| `src/CrossReferenceIndex.js` | 96 KB | Cross-references between standards |
| `src/StorageEngine.js` | 12 KB | Write-through cache |
| `src/services/AuditAccuracyEnhancementEngine.js` | 24 KB | 15 accuracy engines |
| `src/agents/AgentFramework.js` | 12 KB | Multi-agent orchestration |

## 8 hard rules

1. Main-branch only. No `claude/*` branches in production.
2. 219/219 Vitest + 0 build errors before any push.
3. Every push to main auto-deploys to Vercel — never commit WIP.
4. `VITE_CLAUDE_API_KEY` server-side only. Never in browser bundle.
5. Every mutation writes `audit_trail` row, including AI queries.
6. `src/StandardsLibrary.js` is authoritative for ISA — never quote from model memory.
7. Offline-first. localStorage primary; Supabase is cloud sync only.
8. UK English + ISA (UK) terminology (partner / manager / senior / junior — NOT associate).

## Do
- Keep AI calls server-side (never expose API key to browser).
- Log every AI prompt + response to `audit_trail` with `action='ai_query'`.
- Use Claude's prompt caching for the ISA + methodology corpus.
- Set immutable evidence archive retention to 7 years (UK statutory audit file retention).
- Use `isSupabaseConfigured()` guard before any Supabase call.
- Large files (97-248 KB) must use dynamic imports, never direct component imports.

## Don't
- Don't mix personal data into AI prompts unless DPIA covers it.
- Don't skip the audit trail on any mutation — including AI queries.
- Don't deploy the frontend to a non-UK/EU CDN origin without DPA review.
- Don't rely on Anthropic for ISA content correctness — `StandardsLibrary.js` is authoritative.
- Don't add to `AuditEngine.jsx` (1122-line monolith) — extract to services/components.
- Don't block UI on Supabase response — offline-first is a hard requirement.
