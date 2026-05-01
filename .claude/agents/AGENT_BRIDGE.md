# Agent Bridge — .claude/ agents ↔ src/ definitions

Maps each Claude Code agent (used in Claude Code sessions) to its corresponding
source code agent (used by the in-app AgentOrchestrator and AgentFramework).

## Mapping Table

| Claude Code Agent | src/ Definition | src/ File | Orchestrator Type |
|-------------------|----------------|-----------|-------------------|
| audit-planner | planningAgent | `src/agents/definitions/planningAgent.js` | — (via AgentOrchestrator) |
| audit-risk-assessor | riskAssessmentAgent | `src/agents/definitions/riskAssessmentAgent.js` | `ASSESS_RISK` |
| audit-materiality-calculator | MaterialityEngine | `src/services/materialityEngine.js` | `CALCULATE_MATERIALITY` |
| audit-framework-advisor | — (no src equivalent) | — | — |
| audit-procedure-designer | AIProcedureEngine + SubstantiveProceduresAgent | `src/services/aiProcedureEngine.js`, `src/services/substantiveProceduresAgent.js` | `SUGGEST_PROCEDURES`, `GENERATE_SUBSTANTIVE_PROGRAMME` |
| audit-sampling-specialist | TransactionalTestingAgent | `src/agents/AuditSpecializedAgents.js` | — (via AuditSpecialistRegistry) |
| audit-going-concern-assessor | solvencyGoingConcernAgent | `src/agents/definitions/solvencyGoingConcernAgent.js` | — (via AgentOrchestrator) |
| audit-journal-entry-tester | testingAgent (JE subset) | `src/agents/definitions/testingAgent.js` | — (via AgentOrchestrator) |
| audit-analytics-specialist | — (partial in planning/completion) | `src/agents/definitions/planningAgent.js` (planning analytics), `src/agents/definitions/completionAgent.js` (final review) | — |
| audit-documentation-specialist | — (no src equivalent) | — | — |
| audit-file-review-manager | reviewAgent | `src/agents/definitions/reviewAgent.js` | — (via AgentOrchestrator) |

## Specialist Agents (src-only, no .claude/ pair)

| src/ Agent | File | Purpose |
|-----------|------|---------|
| TechnicalAccountingLead | `src/agents/AuditSpecializedAgents.js` | IFRS/FRS technical guidance |
| ControlsAndGovernanceAssessor | `src/agents/AuditSpecializedAgents.js` | COSO/ISA 330 controls testing |
| ComplianceAdvisor | `src/agents/AuditSpecializedAgents.js` | Regulatory compliance (CA06, FCA) |
| TransactionalTestingAgent | `src/agents/AuditSpecializedAgents.js` | Assertion-level testing |

## Analytical Agents (src-only, no .claude/ pair)

| Agent | File | Focus |
|-------|------|-------|
| capitalGearingAgent | `src/agents/definitions/capitalGearingAgent.js` | Debt/equity ratios |
| investorRatiosAgent | `src/agents/definitions/investorRatiosAgent.js` | EPS, P/E, dividend yield |
| bankLenderRatiosAgent | `src/agents/definitions/bankLenderRatiosAgent.js` | Interest cover, DSCR |
| marketCompetitiveAgent | `src/agents/definitions/marketCompetitiveAgent.js` | Market position analysis |
| fraudRiskAgent | `src/agents/definitions/fraudRiskAgent.js` | ISA 240 fraud indicators |
| regressionPredictiveAgent | `src/agents/definitions/regressionPredictiveAgent.js` | Statistical modelling |
| estimationValuationAgent | `src/agents/definitions/estimationValuationAgent.js` | ISA 540 estimates |

## How to use

**From Claude Code session:** Skills trigger agents by name (e.g., `audit-planner`).
The agent reads codebase data files (`StandardsLibrary.js`, `RegulatoryData.js`, etc.)
and produces ISA-compliant outputs as structured markdown.

**From the app UI:** AgentPanel calls `orchestrator.runAgent(agentName, state, options)`
which executes the definition agents through the step-based AgentOrchestrator.
Results appear as cell suggestions that can be accepted/rejected.

**From the backend API:** POST to `/api/orchestrator/request` with a valid `type`
routes through `aiAgentOrchestrator.js` to the appropriate engine or agent.

## Architecture & Meta Agents (added 21 Apr 2026)

| Claude Code Agent | Skill | Purpose |
|-------------------|-------|---------|
| audit-architect | auditengine-saas-architecture | Platform stack, deployment, compliance, 8 hard rules |
| audit-methodology-librarian | auditengine-methodology-library | Pre-populated ISA content, zero-placeholder principle |
| audit-industry-profiler | auditengine-industry-profiles | 8-industry risk library, FSLI maps |
| audit-wp-architect | auditengine-working-paper-architecture | 47-WP audit file tree, CaseWare-style refs |
| audit-workpaper-engine | audit-workpaper-engine | Master content generation across all ISA areas |

## FSLI / Assertion Risk Area Agents (added 22 Apr 2026)

12 skills covering every significant risk area across BS and P&L, for both FS and non-FS entities.

| Claude Code Agent | Skill | FSLI | Primary assertions |
|-------------------|-------|------|-------------------|
| audit-revenue-specialist | audit-revenue-recognition | Revenue (P&L) | Occurrence, accuracy, cut-off |
| audit-cash-specialist | audit-cash-bank-confirmations | Cash & bank (BS) | Existence, completeness |
| audit-receivables-specialist | audit-receivables-credit-losses | Receivables (BS) | Existence, valuation (ECL) |
| audit-inventory-specialist | audit-inventory-cost-of-sales | Inventory / COGS (BS/P&L) | Existence, valuation (NRV) |
| audit-investments-specialist | audit-investments-securities | Investments (BS) | Existence, valuation, classification |
| audit-fixed-assets-specialist | audit-ppe-intangibles-impairment | PPE / intangibles (BS) | Existence, valuation (impairment) |
| audit-estimates-specialist | audit-estimates-fair-value | Cross-cutting | Valuation, accuracy |
| audit-payables-specialist | audit-payables-accruals-provisions | Payables / provisions (BS) | Completeness, cut-off |
| audit-borrowings-specialist | audit-borrowings-covenants | Borrowings (BS) | Completeness, classification |
| audit-tax-specialist | audit-tax-current-deferred | Tax (BS/P&L) | Accuracy, valuation (DTA) |
| audit-payroll-specialist | audit-payroll-employee-benefits | Payroll / benefits (P&L/BS) | Occurrence, accuracy |
| audit-related-parties-specialist | audit-related-parties-disclosure | Cross-cutting | Completeness, disclosure |

## Financial Reporting Lifecycle Agents (added 22 Apr 2026)

15 skills covering the full reporting lifecycle from COA through to regulatory returns.

| Claude Code Agent | Skill | Stage |
|-------------------|-------|-------|
| finance-coa-specialist | finance-chart-of-accounts-gl | Foundation |
| finance-policy-specialist | finance-accounting-policies | Foundation |
| finance-month-end-specialist | finance-month-end-close | Period close |
| finance-year-end-specialist | finance-year-end-close | Period close |
| finance-reconciliation-specialist | finance-balance-sheet-reconciliation | Controls |
| finance-frs102-specialist | finance-statutory-accounts-frs102 | Statements |
| finance-ifrs-specialist | finance-ifrs-financial-statements | Statements |
| finance-disclosures-specialist | finance-notes-disclosures | Statements |
| finance-directors-report-specialist | finance-directors-strategic-report | Statements |
| finance-consolidation-specialist | finance-group-consolidation | Group |
| finance-intercompany-specialist | finance-intercompany | Group |
| finance-lease-specialist | finance-lease-accounting | Technical |
| finance-instruments-specialist | finance-financial-instruments-accounting | Technical |
| finance-tax-specialist | finance-tax-computation-reporting | Tax |
| finance-regulatory-specialist | finance-regulatory-returns | Regulatory |

## Gaps to fill

Two .claude/ agents have no src/ equivalent:
1. **audit-framework-advisor** — FRS/IFRS framework selection. The data exists in
   `FRSEncyclopaedia.js` and `IFRSEncyclopaedia.js` but no agent definition consumes it.
2. **audit-documentation-specialist** — ISA 230 working paper formatting. The
   `auditDocumentationService.js` service exists but has no agent wrapper.
