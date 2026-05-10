# CLAUDE.md — AuditEngine v10.0.0 AURA

## Project Overview

AuditEngine is a UK statutory audit automation platform. React 19 + Vite 8 frontend, Express 5 backend, Supabase PostgreSQL for cloud persistence, Claude API for AI-powered audit intelligence (server-side `/api/ai` proxy — see `src/services/aiProxyClient.js`). Deployed to Vercel at auditengine.agency (multi-region CDG/LHR/SFO). 773 tests, 14 AI agents, ISA (UK) 200-810 coverage.

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router 7, JSX (not TypeScript)
- **Backend:** Express 5, Socket.io 4.8
- **Database:** Supabase PostgreSQL (offline-first, localStorage primary)
- **AI:** Anthropic Claude Sonnet 4.6 (primary), Claude Opus 4.6 (agents), Haiku 4.5 (fast), OpenAI GPT-4 (fallback), Ollama (local)
- **Export:** docx, exceljs, xlsx, pdfkit, pdfmake
- **Testing:** Vitest 4 with jsdom, Testing Library
- **Deploy:** Vercel (auditengine.agency), Docker, GitHub Actions

## Architecture

### Dual Agent Orchestration

Two layers that do different things:

1. **AgentOrchestrator** (`src/agents/AgentOrchestrator.js`) — Task queue + step execution for audit workflow agents. Entry point: `runAgent(agentName, engagementState, options)`. Consumes agent definitions from `src/agents/definitions/`.

2. **AgentFramework** (`src/agents/AgentFramework.js`) — Lower-level Claude API integration. Extends EventEmitter. Handles agent registration, compliance tracking (GDPR), multi-model selection via `modelSelectionService`, token/latency metrics. Used by specialized agents.

### Agent Categories

| Category | Agents | Location |
|---|---|---|
| Definition agents (5) | planning, riskAssessment, testing, completion, review | `src/agents/definitions/` registered in `definitions/index.js` |
| Specialized agents (6) | Supervisor, CodeAnalyst, Security, Documentation, Compliance, Testing | `src/agents/SpecializedAgents.js` via `AgentRegistry` |
| Audit specialists (4) | TechnicalAccountingLead, ControlsAndGovernanceAssessor, ComplianceAdvisor, TransactionalTestingAgent | `src/agents/AuditSpecializedAgents.js` via `AuditSpecialistRegistry` |
| Infrastructure (3) | Monitoring, Recovery, QualityAssessment | `src/agents/agentMonitoringService.js`, `agentRecoveryService.js`, `agentQualityAssessmentService.js` |

### How to Add a New Agent

1. Create definition in `src/agents/definitions/yourAgent.js` (export object with name, description, icon, wpScope, steps array)
2. Register in `src/agents/definitions/index.js` — add to `AGENT_DEFINITIONS`
3. Add model mapping in `src/agents/agents.config.js` under `agentModels`
4. Export from `src/agents/index.js`

### Storage Pattern (Write-Through Cache)

`src/StorageEngine.js` — localStorage is truth for the active session. Supabase is async cloud sync.

- Writes hit localStorage instantly via `safeSet()`, then fire-and-forget upsert to Supabase after 1500ms debounce
- 15 persisted state keys: cfg, cellData, signOffs, wpNotes, customItems, tbData, tbMappings, uploads, archived, reviewStatus, integrations, signOffLog, reviewNotes, documentLinks, changeLog
- Storage prefix: `ae_` for all keys
- `isSupabaseConfigured()` can be false — always handle gracefully
- Never block UI on Supabase response

### Route Structure

`src/router.jsx` uses `createBrowserRouter`. All pages lazy-loaded via `React.lazy()` wrapped in `LazyWrap` (Suspense + ErrorBoundary). Pages: Dashboard, Engagement, Settings, Materiality, FullAuditFile. Sub-views: OverviewTab, ProcedureList/Detail, EvidenceList, FindingList/Detail. Feature panels: RealTimeAuditDashboard, CollaborationPanel, IntegrationHub, ReviewDashboard, RiskDashboard.

## Key Files

- `src/AuditEngine_AURA.jsx` — Main app shell (v10 entry point)
- `src/router.jsx` — Route definitions, LazyWrap pattern
- `src/AuditEngine.jsx` — Core audit engine (monolith, 1122 lines — do not add to this file)
- `src/RegulatoryData.js` — FCA handbook, ISQM, Ethical Standard (190KB)
- `src/StandardsLibrary.js` — 37 ISA (UK) standards (168KB)
- `src/AuditMethodology.js` — Risk trilogy, audit procedures (250KB)
- `src/FRSEncyclopaedia.js` — FRS 100-105, all 35 FRS 102 sections
- `src/CrossReferenceIndex.js` — Cross-references between standards (97KB)
- `src/StorageEngine.js` — localStorage + Supabase write-through cache
- `src/agents/AgentFramework.js` — Multi-agent orchestration core
- `src/agents/AgentOrchestrator.js` — Task queue + step execution
- `src/agents/agents.config.js` — Model mappings, compliance config
- `src/services/AuditAccuracyEnhancementEngine.js` — 15 accuracy engines
- `src/context/EngagementContext.jsx` — Engagement state provider (persisted keys, StorageEngine)
- `src/context/AuditContext.jsx` — Global audit state (useReducer, auth, Supabase)

## Coding Conventions

- **Components:** PascalCase, `.jsx` extension, functional only (no class components)
- **Services:** camelCase, `.js` extension
- **Imports:** Use `@/` alias for `src/` directory (configured in vite.config.js and vitest.config.js)
- **Formatting:** Prettier — singleQuote, trailingComma es5, printWidth 120, tabWidth 2
- **Error handling:** Wrap route-level components in `ErrorBoundary`. Console.warn for non-fatal Supabase sync failures. Never throw from cloud sync — it must not block the offline-first flow.
- **Lazy loading:** Use `LazyWrap` pattern from router.jsx for code-split routes
- **Large files:** Never import StandardsLibrary, RegulatoryData, AuditMethodology, CrossReferenceIndex, FRSEncyclopaedia directly in components — they are 97-250KB each. Access through services or dynamic imports. Vite code-splits them into separate chunks (see manualChunks in vite.config.js).

## Custom Hooks

11 hooks in `src/hooks/`:
- `useEngagement.js` — Supabase/local engagement loading + debounce saving
- `useAuditHelpers.jsx` — Sign-off, cell data, change tracking
- `useAgents.js` — React interface to AgentOrchestrator
- `useAgentProgress.js` — Real-time agent step tracking
- `useAgentMetrics.js` — Monitoring dashboard (2s refresh)
- `useExportHandlers.jsx` — Document export (Excel, Word, PDF)
- `useDocumentGeneration.js` — Auto-generation on phase completion
- `useOfflineMode.js` — Offline sync queue
- `useIntegrations.js` — External connection status + activity logging
- `useApi.js` — Generic API wrapper (loading/error/data states)
- `useKeyboardShortcuts.jsx` — Keyboard command binding

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npx vitest run` — Run all tests (773/773 must pass)
- `npm run lint` — ESLint v9 flat config
- `npm run agents` — CLI agent orchestration tool
- `npm run agents:plan` / `agents:review` / `agents:security` / `agents:compliance` / `agents:docs` / `agents:test` / `agents:report` — Individual agent commands
- `npm run deploy:db` / `deploy:db:seed` / `deploy:db:admin` — Database deployment

## Testing Patterns

- **Structure:** `src/__tests__/unit/` (5 files), `src/__tests__/integration/` (5 files), `src/__tests__/agents/` (1 file), `src/__tests__/security/` (1 file)
- **Setup:** `src/__tests__/setup.js` provides jsdom, @testing-library/jest-dom matchers, window.matchMedia mock
- **Coverage gates:** lines 80%, functions 80%, branches 75%, statements 80% (vitest.config.js)
- **Test count:** 773 tests must all pass before pushing
- **Mocking:** Use `vi.fn()` and `vi.mock()`. Mock Supabase client, Anthropic SDK, and localStorage
- **What to test:** Every new service needs unit tests. Agent definitions need integration tests verifying step outputs. Components need render tests minimum. Security-sensitive code needs dedicated security tests.

## Database

- **Schema files:** `database/001_deploy_schema.sql` (schema), `002_seed_reference_data.sql` (seeds), `003_rls_policies.sql` (RLS), `supabase-schema.sql` (current), `schema-legacy.sql` (backup)
- **Core tables:** engagements, engagement_data, documents, document_links, audit_trail
- **RLS strategy:** Server uses `service_role` key via `server/supabaseServer.js` (bypasses RLS). Frontend uses `anon` key via `src/supabaseClient.js` (respects RLS). Reference tables are read-only for authenticated users.
- **Offline-first rule:** localStorage is primary. Supabase is cloud sync. Never block UI on Supabase response. Always handle `isSupabaseConfigured() === false`.

## Environment Variables

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase connection (browser-safe; RLS-protected)
- `ANTHROPIC_API_KEY` — Anthropic API, **server-side only**. Never use the `VITE_` prefix because Vite bakes `VITE_*` vars into the client bundle. Browser code calls AI via the `/api/ai` server proxy (see `src/services/aiProxyClient.js`). Sprint 1 S1-00 (May 2026) eliminated the previous browser-bundled fallback.
- `VITE_APP_ENV`, `VITE_APP_VERSION` — App config
- `.env.local`, `.env.production`, `.env.vercel` — gitignored, contain live secrets

## ISA / Regulatory Conventions

- ISA (UK) standards live in `src/StandardsLibrary.js` as `ISA_UK_STANDARDS` export. Always reference by ISA number (e.g. ISA 315, ISA 500) not internal IDs.
- Cross-references between standards in `src/CrossReferenceIndex.js`.
- FCA/ISQM/Ethical Standard in `src/RegulatoryData.js`. FRS 100-105 in `src/FRSEncyclopaedia.js`. Broader compliance in `src/ComplianceFrameworks.js`.
- Working paper IDs: planning WPs are a1-a10, substantive WPs follow chart-of-accounts mapping, completion WPs defined in data files. Do not change WP ID conventions — they are referenced across agents, components, and exports.
- When modifying regulatory content: cite the source standard and effective date. UK ISA standards differ from international ISA — always use the "(UK)" suffix. Include Companies Act 2006 section references where applicable.

## Architecture Rules

- Work on `develop` branch for daily development. Merge to `main` only for production releases.
- Node 20.x required
- Pushes to `main` auto-deploy to Vercel — only merge develop→main when ready to ship
- Keep vercel.json clean (SPA rewrite, multi-region CDG/LHR/SFO)
- Tests must stay at 773/773 before pushing
- Build must produce 0 errors

## Common Pitfalls

- **Large data files:** StandardsLibrary (168KB), RegulatoryData (190KB), AuditMethodology (250KB), CrossReferenceIndex (97KB) — never import directly in components. Use dynamic imports or service layers. Vite code-splits them via manualChunks.
- **AuditEngine.jsx monolith:** 1122 lines. Do not add to this file — extract new functionality into services or components.
- **ESLint:** `eslint.config.js` (v9 flat config) is authoritative.
- **Type checking:** `npm run type-check` is a no-op ("Project uses JavaScript/JSX"). Do not rely on it.
- **deploy.yml branches:** Workflow triggers on `claude/**` branches. Production deploys from main only.
- **Env files:** `.env.local`, `.env.production`, `.env.vercel` contain live secrets. Never commit, never read via Claude Code.

## Deploy Checklist

1. All 773 tests pass (`npx vitest run`)
2. Build succeeds with 0 errors (`npm run build`)
3. Lint is clean (`npm run lint`)
4. CI gate passes (`npm run check:no-browser-anthropic`) — no Anthropic SDK browser-exposure patterns
5. Vercel env vars set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY — note: NOT `VITE_CLAUDE_API_KEY`)
5. vercel.json regions configured (cdg, lhr, sfo)
6. `npm audit` — no critical vulnerabilities
7. RLS policies deployed (`database/003_rls_policies.sql`)

## Regulatory Coverage

- ISA (UK) 200-810 (37 standards) + ISQM 1 & 2
- FCA: PRIN, SYSC, CASS, MIFIDPRU, Consumer Duty (PS22/9)
- FRS 100-105 with 2026 amendments
- Compliance: AML, GDPR, Bribery Act, Modern Slavery, Sanctions
- Companies Act 2006 (62 references)
- FRC Ethical Standard 2024
