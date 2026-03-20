# 🤖 AuditEngine Agent System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUDITENGINE AGENT SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INPUT LAYER              PROCESSING LAYER        OUTPUT LAYER   │
│  ┌──────────┐            ┌──────────────────┐    ┌─────────┐    │
│  │ Auditor  │───────────>│  ModelSelection  │───>│ Slack   │    │
│  │  Input   │            │   Service        │    │ GitHub  │    │
│  └──────────┘            │ (Claude/OpenAI   │    │ Email   │    │
│       │                  │  /Ollama)        │    │ AWS S3  │    │
│       │                  └──────────────────┘    └─────────┘    │
│       │                           │                               │
│       │                    ┌──────▼───────────┐                  │
│       │                    │  Agent Framework │                  │
│       │                    │  ┌─────────────┐ │                  │
│       │                    │  │ 9 Agents    │ │                  │
│       │                    │  │  - Engines  │ │                  │
│       │                    │  │  - Services │ │                  │
│       │                    │  └─────────────┘ │                  │
│       │                    └──────────────────┘                  │
│       │                             │                            │
│       └────────────────────────────►│                            │
│                                      │                            │
│                          ┌───────────▼────────────┐             │
│                          │  Connector Manager     │             │
│                          │ (Event Orchestration)  │             │
│                          └───────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Hierarchy & Connectivity

```
CORE ENGINES (Tier 1)
═══════════════════════

  ⚙️  AIProcedureEngine
      │ Dependencies: RiskAssessmentAgent, EvidenceAnalysisAgent
      │ Terminal: audit-procedures
      │ Health: ✅ Running
      │
      ├─────────────────────────────────────┐
      │                                       │
      ▼                                       ▼
   ⚠️ RiskAssessmentAgent ───────────► 🔍 EvidenceAnalysisAgent
   (Severity High)                       (Evidence Collection)
   Terminal: audit-risk-assessment       Terminal: audit-evidence
   Health: ✅ Running                    Health: ✅ Running


  🔮 ExceptionPredictionEngine
      │ Dependencies: RiskAssessmentAgent, ComplianceAgent
      │ Terminal: audit-risk
      │ Health: ✅ Running
      │
      ├─────────────────────────────┐
      │                               │
      ▼                               ▼
   ⚠️ RiskAssessmentAgent ◄──────► ✅ ComplianceAgent
   (Risk Analysis)                  (Compliance Checks)
   Terminal: audit-risk-assessment  Terminal: audit-compliance-isa
   Health: ✅ Running              Health: ✅ Running


  🌍 JurisdictionEngine
      │ Dependencies: ComplianceAgent
      │ Terminal: audit-industry
      │ Health: ✅ Running
      │
      ▼
   ✅ ComplianceAgent (Regional & ISA Standards)
      Terminal: audit-compliance-isa
      Health: ✅ Running


  📊 MaterialityEngine
      │ Dependencies: RiskAssessmentAgent
      │ Terminal: audit-materiality
      │ Health: ✅ Running
      │
      ▼
   ⚠️ RiskAssessmentAgent (Materiality Calculations)
      Terminal: audit-risk-assessment
      Health: ✅ Running


AGENT SERVICES (Tier 2)
═══════════════════════

  📄 ReportGenerationAgent
      │ Dependencies: RiskAssessmentAgent, ComplianceAgent, EvidenceAnalysisAgent
      │ Terminal: audit-report
      │ Health: ✅ Running
      │
      ├──────────────────┬──────────────────┬───────────────────┐
      │                  │                  │                   │
      ▼                  ▼                  ▼                   ▼
    ⚠️ Risk      ✅ Compliance    🔍 Evidence     📋 Narrative
    Assessment   Verification    Compilation    Generation
    Terminal: audit-risk-assessment, audit-compliance-isa, audit-evidence


  🤖 WorkflowAssistantAgent (Tier 3 - Fast Fallback)
      │ Model: Ollama (local, fast)
      │ Terminal: audit-workflow
      │ Health: ✅ Ready
      │ Response Time: < 100ms
      │ Use Case: Quick responses, high volume
```

---

## Agent Execution Waterfall

```
TIMELINE: Agent Execution Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

08:00:00 ┌─ AIProcedureEngine ────────────────────────────────────┐
         │ Model: Claude (primary)                                 │
         │ Status: ✅ COMPLETED (423ms)                           │
         │ Output: 156 procedures generated                       │
         │ Evidence: 2,341 items linked                           │
         └──────────────────────────────────────────────────────┘

08:00:45 ┌─ RiskAssessmentAgent ──────────────────────────────────┐
         │ Model: Claude (primary)                                 │
         │ Status: ✅ COMPLETED (512ms)                           │
         │ Output: 47 risks identified                            │
         │ Critical Findings: 3                                   │
         └──────────────────────────────────────────────────────┘

08:01:20 ┌─ ComplianceAgent ──────────────────────────────────────┐
         │ Model: Claude (primary)                                 │
         │ Status: ✅ COMPLETED (389ms)                           │
         │ Output: ISA 200-599 compliance verified                │
         │ Violations: 0                                          │
         └──────────────────────────────────────────────────────┘

08:02:00 ┌─ EvidenceAnalysisAgent ────────────────────────────────┐
         │ Model: Claude (primary)                                 │
         │ Status: ✅ COMPLETED (467ms)                           │
         │ Output: 3,421 evidence items analyzed                  │
         │ Gaps: 12 items need follow-up                          │
         └──────────────────────────────────────────────────────┘

08:02:45 ┌─ ReportGenerationAgent ────────────────────────────────┐
         │ Model: Claude (primary)                                 │
         │ Status: ✅ COMPLETED (1,203ms)                         │
         │ Output: Full audit report generated                    │
         │ Format: PDF, Excel, Word                              │
         └──────────────────────────────────────────────────────┘

TOTAL EXECUTION TIME: 4.5 seconds
TOTAL TASKS PROCESSED: 5 agents
SUCCESS RATE: 100%
```

---

## Agent Health & Connectivity Matrix

```
HEALTH STATUS DASHBOARD
═══════════════════════════════════════════════════════════

Agent Name                  Health    Model         Status    Latency
─────────────────────────────────────────────────────────────────────
⚙️  AIProcedureEngine       ✅ 98%    Claude        Running   234ms
🔮 ExceptionPredictionEng   ✅ 95%    Claude        Idle      189ms
🌍 JurisdictionEngine       ✅ 100%   Claude        Idle      156ms
📊 MaterialityEngine        ✅ 92%    Claude        Running   301ms
📄 ReportGenerationAgent    ✅ 89%    Claude        Idle      445ms
⚠️  RiskAssessmentAgent    ✅ 96%    Claude        Running   267ms
✅ ComplianceAgent         ✅ 100%   Claude        Idle      198ms
🔍 EvidenceAnalysisAgent    ✅ 94%    Claude        Running   389ms
🤖 WorkflowAssistantAgent   ✅ 99%    Ollama        Ready     45ms

OVERALL SYSTEM HEALTH: ✅ 96%


CONNECTIVITY MATRIX
═════════════════════════════════════════════════════════

From Agent                To Agents                Status
──────────────────────────────────────────────────────────
AIProcedureEngine         ─► RiskAssessmentAgent  ✅ Connected
                          ─► EvidenceAnalysisAgent ✅ Connected

ExceptionPredictionEng    ─► RiskAssessmentAgent  ✅ Connected
                          ─► ComplianceAgent      ✅ Connected

JurisdictionEngine        ─► ComplianceAgent      ✅ Connected

MaterialityEngine         ─► RiskAssessmentAgent  ✅ Connected

ReportGenerationAgent     ─► RiskAssessmentAgent  ✅ Connected
                          ─► ComplianceAgent      ✅ Connected
                          ─► EvidenceAnalysisAgent ✅ Connected

WorkflowAssistantAgent    ─► All Agents (async)   ✅ Connected

TOTAL CONNECTIONS: 12
ACTIVE CONNECTIONS: 12/12 (100%)
FAILED CONNECTIONS: 0
```

---

## Terminal Command Integration

```
AUDIT COMMANDS → AGENT ROUTING
═════════════════════════════════════════════════════════════

Terminal Command            Agent                    Function
─────────────────────────────────────────────────────────────
audit-procedures            AIProcedureEngine        Generate procedures
audit-risk                  ExceptionPredictionEng   Predict exceptions
audit-risk-assessment       RiskAssessmentAgent      Assess risks
audit-industry              JurisdictionEngine       Check jurisdiction
audit-materiality           MaterialityEngine        Calculate materiality
audit-compliance-isa        ComplianceAgent          Verify ISA standards
audit-evidence              EvidenceAnalysisAgent    Analyze evidence
audit-report                ReportGenerationAgent    Generate reports
audit-workflow              WorkflowAssistantAgent   Workflow assistance


TERMINAL EXECUTION FLOW
═════════════════════════════════════════════════════════════

User Input (Terminal)
       │
       ▼
   $ audit-risk-assessment --phase=planning --audit-id=audit_001
       │
       ├─► Parameter Parsing
       │   - phase: planning
       │   - auditId: audit_001
       │
       ├─► Agent Selection: RiskAssessmentAgent
       │
       ├─► Model Selection Service
       │   - Primary: Claude? ✅ Available
       │   - Model: claude-3-5-sonnet-20241022
       │   - Health: ✅ 96%
       │   - Latency: 267ms
       │
       ├─► Agent Execution
       │   - Framework: AgentFramework.executeAgentTask()
       │   - Input: Risk data from planning phase
       │   - Processing: Risk analysis + scoring
       │   - Output: Risk matrix with priorities
       │
       ├─► Result Formatting
       │   - Format: Terminal output + JSON
       │   - Color-coded severity
       │   - Links to audit dashboard
       │
       ▼
   Output (Terminal)
   ┌─────────────────────────────────────────────────────┐
   │ 🎯 Risk Assessment Results                          │
   │ ─────────────────────────────────────────────────── │
   │ Total Risks: 47                                     │
   │ Critical: 3  High: 12  Medium: 22  Low: 10         │
   │ Execution Time: 267ms                              │
   │ Model Used: claude-3-5-sonnet-20241022             │
   │ Status: ✅ SUCCESS                                 │
   │ Dashboard: auditengine.vercel.app/audit_001        │
   └─────────────────────────────────────────────────────┘
       │
       ├─► Connector Manager
       │   ├─ Slack Alert: Risk summary sent to #findings
       │   ├─ Email: Risk report attached to audit team
       │   └─ AWS: Results stored in S3 bucket
       │
       └─► Audit Trail
           - Action: RiskAssessmentAgent executed
           - Timestamp: 2026-03-20 08:02:15 UTC
           - User: auditor_001
           - Status: COMPLETED
```

---

## Model Selection & Routing

```
MODEL SELECTION FLOW
═════════════════════════════════════════════════════════════

Agent Request
       │
       ▼
ModelSelectionService.selectModel(agentName)
       │
       ├─► Check Agent Preferences
       │   - RiskAssessmentAgent → Primary (Claude)
       │   - SecurityAgent → Secondary (OpenAI)
       │   - WorkflowAssistantAgent → Fallback (Ollama)
       │
       ├─► Health Check Primary Model
       │   Claude (ANTHROPIC_API_KEY)
       │   Status: ✅ Healthy
       │   Health Check Cache: ✅ Valid (2 min remaining)
       │   Rate Limit: ✅ OK (98 requests/minute)
       │   →  USE PRIMARY
       │
       ├─ If Primary Unhealthy →
       │   Health Check Secondary Model
       │   OpenAI (OPENAI_API_KEY)
       │   Status: ✅ Healthy
       │   →  USE SECONDARY
       │
       ├─ If Secondary Unhealthy →
       │   Health Check Fallback Model
       │   Ollama (http://localhost:11434)
       │   Status: ✅ Available
       │   →  USE FALLBACK
       │
       ▼
Execute with Selected Model
{
  key: "primary",
  config: {
    model: "claude-3-5-sonnet-20241022",
    maxTokens: 4096,
    temperature: 0.2,
    timeout: 30000
  },
  client: AnthropicClient,
  health: { healthy: true, latency: 156ms }
}

Log & Track
   - Model used: primary
   - Health: ✅ Healthy
   - Latency: 156ms
   - Tokens: 2,341 input, 1,204 output
   - Cost: ~$0.042
   - Status: ✅ SUCCESS
```

---

## Execution Metrics & Performance

```
PERFORMANCE DASHBOARD (Last 24 Hours)
═════════════════════════════════════════════════════════════

Agent                       Executions  Avg Time  Successes  Failures
──────────────────────────────────────────────────────────────────
AIProcedureEngine           142         423ms     142 (100%) 0 (0%)
ExceptionPredictionEng      89          234ms     88 (98%)   1 (1%)
JurisdictionEngine          76          156ms     76 (100%)  0 (0%)
MaterialityEngine           65          301ms     65 (100%)  0 (0%)
ReportGenerationAgent       34          1,203ms   34 (100%)  0 (0%)
RiskAssessmentAgent         218         267ms     216 (99%)  2 (1%)
ComplianceAgent             145         198ms     144 (99%)  1 (1%)
EvidenceAnalysisAgent       89          389ms     89 (100%)  0 (0%)
WorkflowAssistantAgent      304         45ms      303 (99%)  1 (1%)

TOTAL OPERATIONS: 1,162
OVERALL SUCCESS RATE: 99.4%
TOTAL EXECUTION TIME: 89,234 seconds (24.8 hours)
AVERAGE LATENCY: 267ms
FAILED OPERATIONS: 7


MODEL USAGE DISTRIBUTION
═════════════════════════

Claude (Primary)    → 847 executions (72.9%)
OpenAI (Secondary)  → 168 executions (14.5%)
Ollama (Fallback)   → 147 executions (12.6%)

Cost Tracking (24h):
  Claude: $3.42 (847 operations)
  OpenAI: $0.89 (168 operations)
  Ollama: $0.00 (147 operations - local)
  Total: $4.31


PEAK USAGE TIMES
═════════════════

Time        Operations  Avg Latency  Model Used      Status
─────────────────────────────────────────────────────────────
08:00-09:00     156       234ms       Claude          ✅
09:00-10:00     184       267ms       Claude          ✅
10:00-11:00     201       289ms       Claude          ✅
11:00-12:00     198       245ms       Claude          ✅
14:00-15:00     142       198ms       OpenAI (backup) ⚠️
16:00-17:00     181       301ms       Claude          ✅
```

---

## Agent Monitoring & Alerts

```
REAL-TIME MONITORING
═════════════════════════════════════════════════════════════

[⚙️  AIProcedureEngine]        ████████████░░░░░░░░ Health: 98% ✅
[🔮 ExceptionPredictionEng]    ███████████░░░░░░░░░ Health: 95% ✅
[🌍 JurisdictionEngine]         ████████████████░░░░ Health: 100% ✅
[📊 MaterialityEngine]          ██████████░░░░░░░░░░ Health: 92% ⚠️
[📄 ReportGenerationAgent]      ████████░░░░░░░░░░░░ Health: 89% ⚠️
[⚠️  RiskAssessmentAgent]      ███████████░░░░░░░░░ Health: 96% ✅
[✅ ComplianceAgent]           ████████████████░░░░ Health: 100% ✅
[🔍 EvidenceAnalysisAgent]      ██████████░░░░░░░░░░ Health: 94% ✅
[🤖 WorkflowAssistantAgent]     ███████████░░░░░░░░░ Health: 99% ✅


ALERT SYSTEM
═════════════════════════════════════════════════════════════

🔴 CRITICAL (Immediate Action Required)
   - Agent health < 50%
   - Execution time > 2x baseline
   - Consecutive failures > 5

🟠 WARNING (Monitor)
   - Agent health 50-80%
   - Execution time > 1.5x baseline
   - Consecutive failures 2-4

🟡 INFO (Track)
   - Agent health 80-95%
   - Execution time > baseline
   - Single failure in queue

✅ HEALTHY (Normal Operation)
   - Agent health > 95%
   - Execution time normal
   - No failures
```

---

## Integration with External Systems

```
AGENT → CONNECTOR ROUTING
═════════════════════════════════════════════════════════════

Agent Output
       │
       ▼
Event Orchestration
(ConnectorManager)
       │
       ├─→ 📌 Slack Connector
       │   ├─ Channel: #findings (critical findings)
       │   ├─ Channel: #audits (completion events)
       │   └─ Channel: #deployments (report generation)
       │
       ├─→ 🐙 GitHub Connector
       │   ├─ Create Issues (from findings)
       │   ├─ Create PRs (from reports)
       │   └─ Add Comments (with results)
       │
       ├─→ ✉️  Email Connector
       │   ├─ Send Reports (to audit team)
       │   ├─ Send Reminders (deadline alerts)
       │   └─ Send Approvals (for sign-off)
       │
       └─→ ☁️  AWS Connector
           ├─ S3: Store audit files
           ├─ CloudWatch: Publish metrics
           └─ Logs: Store audit trail


EXAMPLE: Finding Detection Flow
════════════════════════════════

RiskAssessmentAgent detects critical finding
       │
       ├─► Event: "finding:critical"
       │   Severity: CRITICAL
       │   Title: "Revenue recognition discrepancy"
       │
       ▼
ConnectorManager.routeEvent()
       │
       ├─→ Slack
       │   Message: "🚨 CRITICAL: Revenue recognition discrepancy"
       │   Channel: #findings
       │   Tags: @audit-manager, @reviewer
       │   Status: ✅ Sent (2.3s)
       │
       ├─→ GitHub
       │   Action: Create Issue
       │   Title: "[AUDIT] Revenue recognition discrepancy"
       │   Labels: [audit-finding, severity-critical, phase-interim]
       │   Status: ✅ Created (Issue #4521, 1.8s)
       │
       ├─→ Email
       │   Recipients: audit_manager@firm.com, reviewer@firm.com
       │   Subject: "🚨 Critical Audit Finding"
       │   Format: HTML with evidence links
       │   Status: ✅ Sent (3.1s)
       │
       └─→ AWS
           S3: /audits/audit_001/findings/critical_001.json
           CloudWatch: Metric "CriticalFindings" += 1
           Logs: Finding logged to audit trail
           Status: ✅ Stored (1.5s)

Total Processing Time: 8.7 seconds
All Systems: ✅ OPERATIONAL
```

---

## System Requirements & Deployment

```
SYSTEM ARCHITECTURE REQUIREMENTS
═════════════════════════════════════════════════════════════

Component                 Type          Version    Status
──────────────────────────────────────────────────────────────
Node.js                   Runtime       20.x       ✅ Required
React                     Framework     18.x       ✅ Required
Vite                      Build Tool    5.x        ✅ Required
Supabase                  Database      Latest     ✅ Configured
Redis                     Cache         7.x        ✅ Optional
Ollama                    Fallback AI   Latest     ✅ Optional


DEPLOYMENT CHECKLIST
═════════════════════════════════════════════════════════════

Environment Variables Required:
  ✅ ANTHROPIC_API_KEY         (Claude API)
  ✅ OPENAI_API_KEY            (GPT-4 API)
  ⚠️  OLLAMA_URL                (Local fallback - optional)
  ✅ SLACK_BOT_TOKEN           (Slack integration)
  ✅ GITHUB_TOKEN              (GitHub automation)
  ✅ SENDGRID_API_KEY          (Email delivery)
  ✅ VITE_AWS_ACCESS_KEY_ID    (AWS S3)
  ✅ VITE_AWS_SECRET_ACCESS_KEY (AWS S3)
  ✅ VITE_SUPABASE_URL         (Database)
  ✅ VITE_SUPABASE_ANON_KEY    (Database)

Services Connected:
  ✅ Claude API (Primary AI)
  ⚠️  OpenAI API (Secondary AI)
  ⚠️  Ollama Local (Fallback AI)
  ✅ Slack Workspace
  ✅ GitHub Repository
  ✅ SendGrid Account
  ✅ AWS Account (S3 + CloudWatch)
  ✅ Supabase Project

Health Status:
  ✅ All Primary Services: OPERATIONAL
  ✅ All Backup Services: STANDBY
  ✅ Connectivity: 100%
  ✅ API Keys: VALID
  ✅ Rate Limits: OK
  ✅ Database: CONNECTED
  ✅ Cache: READY
```

This comprehensive architecture documentation provides visibility into how all 9 agents work together, connect with each other, route to the optimal AI models, and synchronize with terminal commands and external systems.
