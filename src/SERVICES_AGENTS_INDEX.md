# 🔧 AuditEngine Services & Agents Index

Comprehensive map of all services, agents, and integrations in AuditEngine.

---

## 📍 Directory Structure

```
src/
├── agents/                     # AI Agents & Agent Management
├── services/                   # Core Business Services
├── connectors/                 # Integration Connectors
├── frameworks/                 # Audit Frameworks & Standards
├── audit-stages/               # 6-Phase Audit Implementation
├── requirements/               # Audit Requirements
├── components/                 # React UI Components
├── risk-library/               # Risk & Procedures Database
├── data/                       # Static Data & Lookups
└── ...other utilities
```

---

## 🤖 AI Agents (`src/agents/`)

The agent system provides specialized AI capabilities for audit automation.

### Core Agent Infrastructure
- **aiAgentOrchestrator.js** — Master orchestrator coordinating all agents
- **agents.config.js** — Centralized configuration (multi-model support)
- **AgentFramework.js** — Framework for agent development
- **SpecializedAgents.js** — Specialized agent implementations
- **AgentIntegration.js** — Integration layer for agent services

### Agent Services (Moved from services/)
- **agentMonitoringService.js** — Agent health monitoring & metrics
- **agentOrchestrationService.js** — Agent workflow orchestration
- **agentQualityAssessmentService.js** — Quality assurance for agent outputs
- **agentRecoveryService.js** — Error handling & recovery
- **complianceAgent.js** — Compliance & standards validation
- **evidenceAnalysisAgent.js** — Evidence assessment & analysis
- **reportGenerationAgent.js** — Automated report generation
- **riskAssessmentAgent.js** — Risk analysis & assessment
- **workflowAssistantAgent.js** — Workflow assistance & guidance

### Agent CLI & Tools
- **cli-tool.js** — Command-line interface for agents
- **AgentCLI.js** — CLI implementation
- **index.js** — Agent module exports

---

## 🔨 Core Business Services (`src/services/`)

### Audit Core Services
- **aiAgentOrchestrator.js** — Coordinates AI agents with audit workflow
- **auditPlatformService.js** — Main audit platform operations
- **auditProceduresService.js** — Audit procedure management
- **auditDashboardService.js** — Dashboard data & visualization
- **auditTrailService.js** — Audit trail & versioning

### AI & Intelligence Services
- **aiProcedureEngine.js** — AI-powered procedure generation
- **auditIntelligenceFramework.js** — Intelligence analysis & insights
- **auditRiskAssessmentEngine.js** — Risk assessment automation
- **auditSmartFeaturesService.js** — Smart feature enablement
- **exceptionPredictionEngine.js** — ML-based exception prediction
- **financialRatioCalculationEngine.js** — Financial calculations
- **smartRiskEngineV2.js** — Advanced risk pattern detection
- **modelSelectionService.js** — AI model selection strategy

### Document & Export Services
- **auditExcelExportService.js** — Excel/XLSX export
- **auditWordExportService.js** — Word/DOCX export
- **pdfGenerationService.js** — PDF generation
- **documentManagementService.js** — Document lifecycle management
- **documentTokenizationService.js** — Document parsing & tokenization

### Pre-Population & Automation
- **auditPrePopulationEngine.js** — Pre-populate audit fields
- **autoPopulationEngine.js** — Auto-population logic
- **aiExtractionService.js** — AI-based data extraction

### Specialized Services
- **materialityEngine.js** — Materiality calculations & management
- **varianceAnalysisEngine.js** — Variance analysis
- **jurisdictionEngine.js** — Multi-jurisdiction support
- **fsliNarrativeService.js** — FSLI narrative generation
- **frameworkReportingEngine.js** — Framework-based reporting

### System Services
- **apiClient.js** — API client for external calls
- **connectorManager.js** — Connector management
- **encryptionService.js** — Data encryption & security
- **offlineSyncService.js** — Offline capabilities & sync
- **systemMetricsService.js** — System performance metrics
- **realtimeKPIService.js** — Real-time KPI tracking
- **selfHealingService.js** — Auto-recovery mechanisms

### Integration Services
- **crmClientService.js** — CRM integration
- **integrationsService.js** — Master integrations management
- **masterIntegrationService.js** — Central integration hub
- **documentationGenerationService.js** — Auto-documentation
- **subscriptionService.js** — Subscription management

---

## 🔌 Integrations (`src/connectors/`)

External system integrations and data connectors.

### Current Integrations
- **supabaseConnector.js** — Supabase/PostgreSQL
- **claudeApiConnector.js** — Claude AI API
- **awsConnector.js** — AWS services (S3, CloudWatch)
- **slackConnector.js** — Slack notifications
- **teamsConnector.js** — Microsoft Teams integration
- **salesforceConnector.js** — Salesforce CRM
- **emailConnector.js** — Email (Nodemailer)
- **webhookConnector.js** — Webhook support
- **externalApiConnector.js** — Generic API connector

---

## 📚 Frameworks & Standards (`src/frameworks/`)

Audit standards and compliance frameworks.

### ISA Standards
- **isa-standards/ISA_Framework.js** — ISA 200-599 definitions
- **isa-standards/** — Individual ISA standards (200, 210, 220, etc.)

### Regional Standards
- **regional-standards/Regional_Standards.js** — Region-specific requirements
- **regional-standards/uk/** — UK audit requirements
- **regional-standards/eu/** — EU audit requirements
- **regional-standards/us/** — US audit requirements
- **regional-standards/pakistan/** — Pakistan audit requirements

### Framework Registry
- **AuditFrameworkIndex.js** — Central registry & orchestration

---

## 📋 Audit Stages (`src/audit-stages/`)

6-phase audit lifecycle implementation.

### Phases
1. **planning/** — Phase 1 planning procedures
2. **risk-assessment/** — Phase 2 risk assessment
3. **interim/** — Phase 3 interim audit
4. **final-audit/** — Phase 4 final audit
5. **completion/** — Phase 5 completion
6. **reporting/** — Phase 6 reporting

---

## ✅ Requirements (`src/requirements/`)

Audit requirements and compliance management.

- **AuditRequirementsFramework.js** — Main requirements framework
- **compliance/** — Compliance checklists by phase
- **expectations/** — Role-based expectations
- **controls/** — Control design requirements
- **standards/** — Standard requirements alignment

---

## 🎯 Risk Library (`src/risk-library/`)

Procedure database and risk patterns.

### Components
- **audit-procedures/** — 700+ audit procedures
- **risk-patterns/** — Industry risk patterns
- **materiality-factors/** — Materiality calculation factors
- **industry-specific/** — Industry-specific procedures
- **procedure-templates/** — Reusable procedure templates

---

## 🗂️ Data & Lookups (`src/data/`)

Static data, dropdown options, and lookup tables.

- **audit-procedures.json** — Procedure index
- **materiality-factors.json** — Materiality benchmarks
- **industries.json** — Industry classifications
- **risk-factors.json** — Risk factor definitions
- **audit-areas.json** — Audit area definitions
- **sampling-methods.json** — Sampling method options

---

## 🎨 UI Components (`src/components/`)

React components for the audit interface.

### Audit Components
- **MaterialityCalculator.jsx** — Materiality calculation UI
- **CommentPanel.jsx** — Audit comment management
- **AuditWorksheet.jsx** — Audit working papers
- **RiskAssessmentPanel.jsx** — Risk assessment UI
- **ProcedureSelector.jsx** — Procedure selection
- **EvidenceTracker.jsx** — Evidence collection UI
- **FindingsPanel.jsx** — Audit findings management
- **ReportBuilder.jsx** — Report generation UI

---

## 🏗️ Architecture Patterns

### Service Responsibilities

| Service Type | Responsibility | Example |
|--------------|---|---|
| **Agent** | AI-powered automation | `complianceAgent.js` |
| **Engine** | Business logic & algorithms | `materialityEngine.js` |
| **Service** | Operations & management | `auditPlatformService.js` |
| **Connector** | External integrations | `claudeApiConnector.js` |

### Data Flow

```
AuditEngine.jsx (Main App)
    ↓
    ├→ auditPlatformService.js (Business Logic)
    │   ↓
    │   ├→ aiAgentOrchestrator.js (Agents)
    │   │   ├→ complianceAgent.js
    │   │   ├→ riskAssessmentAgent.js
    │   │   └→ ...more agents
    │   │
    │   └→ Various Engines & Services
    │       ├→ materialityEngine.js
    │       ├→ smartRiskEngineV2.js
    │       └→ ...more services
    │
    └→ Connectors (External Systems)
        ├→ claudeApiConnector.js
        ├→ supabaseConnector.js
        └→ ...more integrations
```

---

## 🔄 Integration Flows

### Audit Procedure Execution
1. User selects audit procedure
2. **aiProcedureEngine.js** loads procedure definition
3. **aiAgentOrchestrator** coordinates relevant agents
4. Agents execute using **claudeApiConnector**
5. Results stored via **supabaseConnector**
6. UI updated via **auditDashboardService**

### Risk Assessment
1. User initiates risk assessment
2. **riskAssessmentAgent** analyzes risks
3. **smartRiskEngineV2** predicts exceptions
4. **materialityEngine** calculates relevance
5. Results exported via export services

### Report Generation
1. **reportGenerationAgent** collects findings
2. **frameworkReportingEngine** applies standards
3. Export services generate DOCX/XLSX
4. Files stored and made available

---

## 🚀 Quick Service Reference

### Most Used Services
- `aiAgentOrchestrator.js` — Main orchestration hub
- `auditPlatformService.js` — Primary business logic
- `materialityEngine.js` — Materiality calculations
- `aiProcedureEngine.js` — Procedure automation
- `auditExcelExportService.js` — Report export

### New Integration? Add:
1. New connector in `src/connectors/`
2. Integration service in `src/services/`
3. Register in `integrationsService.js`
4. Add UI component if needed in `src/components/`

---

## 📊 Statistics

| Category | Count |
|----------|-------|
| Agents | 9+ |
| Services | 40+ |
| Connectors | 9+ |
| Audit Procedures | 700+ |
| ISA Standards | 100+ |
| Audit Phases | 6 |
| React Components | 50+ |
| Database Tables | 18 |

---

## 📖 Documentation

See `/docs` for:
- **Quick Start**: Getting started guides
- **Architecture**: Detailed system design
- **Integration Guide**: How to add integrations
- **API Reference**: Service APIs
- **Frameworks**: ISA & regional standards

---

**Last Updated**: March 2026
**Version**: 7.0.0 (Consolidated)
