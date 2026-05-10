# AI Client Import Map (Sprint 0 V-04)

**Date:** 2026-05-10
**Severity:** Critical — production Anthropic API key currently shipped to every browser session.
**Resolution path:** Sprint 1 S1-00 server-side proxy (this PR).

## Every Anthropic SDK instantiation in the live tree (corrected)

The first pass of this audit found 8 sites by grepping for top-level `import Anthropic from "@anthropic-ai/sdk"` lines. A deeper pass via the CI grep gate (`scripts/check-no-browser-anthropic.sh`) surfaced **22 sites**. The earlier number was an undercount caused by inline imports, named imports (`import { Anthropic }`), and direct `import.meta.env` references that didn't trip the original pattern.

### Direct SDK instantiations (require migration to AiProxyClient)

| File | Lines | `dangerouslyAllowBrowser` | API key source | Migrated in S1-00 |
|---|---|---|---|---|
| `src/services/claudeClient.js` | 154–155 | (no flag) | `ANTHROPIC_API_KEY` | **Phase 2 deferred** — uses batch API; needs proxy extension. `VITE_*` fallback removed in phase 1. |
| `src/agents/AgentFramework.js` | 25–27 | **`true`** | `ANTHROPIC_API_KEY` | ✓ |
| `src/agents/complianceAgent.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/agents/evidenceAnalysisAgent.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/agents/reportGenerationAgent.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/agents/riskAssessmentAgent.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/agents/workflowAssistantAgent.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/components/AuditAssistant.jsx` | 26–27 | **`true`** | `REACT_APP_ANTHROPIC_API_KEY` (broken under Vite — silent leak only on bundling) | ✓ |
| `src/components/SkepticismBot.jsx` | 23–24 | **`true`** | `REACT_APP_ANTHROPIC_API_KEY` (same) | ✓ |
| `src/services/aiAgentOrchestrator.js` | 367–369 | (inline) | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/aiExtractionService.js` | 11–13 | **`true`** | `ANTHROPIC_API_KEY` | ✓ |
| `src/services/aiProcedureEngine.js` | 16–17 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/controlsTestingAgent.js` | 39–41 | (no flag, but browser-context) | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/exceptionPredictionEngine.js` | 15–16 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/jurisdictionEngine.js` | 13–14 | **`true`** | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/modelSelectionService.js` | 73 | **`true`** | `ANTHROPIC_API_KEY` | ✓ |
| `src/services/smartProceduresEngine.js` | 30–32 | (no flag) | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |
| `src/services/substantiveProceduresAgent.js` | 38–40 | (no flag) | `ANTHROPIC_API_KEY \|\| VITE_CLAUDE_API_KEY` | ✓ |

### Reference-only (env var read but no SDK instantiation)

| File | Lines | What it did | Action in S1-00 |
|---|---|---|---|
| `src/lib/loadEnv.js` | 11, 25 | Bridged `VITE_CLAUDE_API_KEY` → `ANTHROPIC_API_KEY` for CLI/server contexts. | Bridge removed; warn message updated. |
| `src/services/investorAnalyticsEngine.js` | 16 | Stored `import.meta.env?.VITE_CLAUDE_API_KEY` on `this.apiKey` (never used). | Dead field + dead SDK import removed. |
| `.env.example` | 22 | Documented `VITE_CLAUDE_API_KEY=`. | Removed; example now ships only `ANTHROPIC_API_KEY` server-side. |

**Total**: 18 SDK instantiation sites + 3 reference-only sites + 1 env-example line = **22 unsafe surfaces**. **17 closed in phase 1**; 1 deferred to phase 2 (`claudeClient.js` — needs batch API on proxy first).

## Browser-context modules importing `@anthropic-ai/sdk`

8 files import the SDK directly (these are the entry points to migrate):

```
src/components/SkepticismBot.jsx
src/components/AuditAssistant.jsx
src/agents/AgentFramework.js
src/agents/evidenceAnalysisAgent.js
src/agents/riskAssessmentAgent.js
src/agents/reportGenerationAgent.js
src/agents/workflowAssistantAgent.js
src/services/claudeClient.js
```

Plus references that import via `claudeClient.js` (transitive — these become safe automatically once `claudeClient.js` is migrated):

```
src/services/smartProceduresEngine.js
src/services/aiAgentOrchestrator.js
src/services/FinancialStatementAnalysisAgent.js
src/services/investorAnalyticsEngine.js
src/services/heavyAutomationService.js
src/services/accuracy-enhancements/SamplingAccuracyModule.js
src/services/accuracy-enhancements/EstimateAccuracyModule.js
src/services/accuracy-enhancements/CrossAccountValidationModule.js
src/services/accuracy-enhancements/ReconciliationModule.js
src/services/fs-analysis/DisclosureCompletenessModule.js
src/services/fs-analysis/FrameworkComplianceModule.js
src/services/fs-analysis/ConsolidationValidationModule.js
src/services/fs-analysis/FSExtractionModule.js
src/services/fs-analysis/EstimateAndJudgmentModule.js
src/services/fs-analysis/FSRiskAssessmentModule.js
```

## Server route gap

`server/routes/` contains 4 files: `agentAssessment.js`, `dispatch.js`, `engagements.js`, `slack.js`. **No `/api/ai` route exists.** Sprint 1 S1-00 adds `src/api/ai.js`.

## Env-var hygiene gap

`.env.example` still ships both `VITE_CLAUDE_API_KEY` and `ANTHROPIC_API_KEY`. The `VITE_*` variant must be deleted in S1-00 because Vite interpolates `VITE_*` into the client bundle by design. The `REACT_APP_*` form in components is a legacy CRA convention that does not even resolve in Vite — its presence is also a bug.

## CI gate (added in S1-00)

`npm run check:no-browser-anthropic` greps for forbidden tokens and exits 1 if any are found outside `legacy/` or `node_modules/`:

```
dangerouslyAllowBrowser
VITE_CLAUDE_API_KEY
REACT_APP_ANTHROPIC_API_KEY
```

The `check:all` script is extended to call this.
