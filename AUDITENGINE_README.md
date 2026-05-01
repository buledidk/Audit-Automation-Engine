# 🏛️ AuditEngine — Professional Audit Automation Platform

**AuditEngine** is an integrated, end-to-end audit automation platform designed for professional audit firms and enterprises. It automates the complete ISA (International Standards on Auditing) audit lifecycle across 6 phases with AI-powered agents, compliance frameworks, and comprehensive reporting.

---

## 📋 Core Features

✅ **6-Phase Audit Lifecycle**
- Phase 1: Planning (ISA 200, 210, 220, 320, 330)
- Phase 2: Risk Assessment (ISA 315, 330, 402)
- Phase 3: Interim Audit (ISA 330, 500, 501, 505, 510)
- Phase 4: Final Audit (ISA 500, 501, 560, 570, 580, 600)
- Phase 5: Completion (ISA 560, 570, 580, 620, 700)
- Phase 6: Reporting (ISA 700, 705, 706, 710, 720)

✅ **AI-Powered Automation**
- 9+ Specialized Audit Agents (Planning, Risk Assessment, Materiality, Evidence, etc.)
- Claude API Integration for intelligent procedures and analysis
- Automated audit procedures library (700+ procedures)
- Smart risk engine with ML-powered predictions

✅ **Compliance & Standards**
- ISA 200-599 standards alignment
- Regional standards: UK, EU, US, Pakistan
- Multi-jurisdiction audit requirements
- Automated compliance checklist generation

✅ **Advanced Reporting**
- Export to DOCX, XLSX, PDF
- Customizable audit reports
- Audit working papers (AWP)
- Materiality calculations and management

---

## 🏗️ Architecture & Directory Structure

```
AuditEngine/
├── src/
│   ├── AuditEngine.jsx              # Main application monolith
│   │
│   ├── agents/                       # AI Agent System
│   │   ├── aiAgentOrchestrator.js   # Coordinates all agents
│   │   ├── planning-agent.js
│   │   ├── risk-assessment-agent.js
│   │   ├── evidence-agent.js
│   │   ├── materiality-agent.js
│   │   └── ...8+ specialized agents
│   │
│   ├── audit-stages/                 # 6-Phase Audit Framework (CONSOLIDATED)
│   │   ├── planning/                # Phase 1
│   │   ├── risk-assessment/         # Phase 2
│   │   ├── interim/                 # Phase 3
│   │   ├── final-audit/             # Phase 4
│   │   ├── completion/              # Phase 5
│   │   └── reporting/               # Phase 6
│   │
│   ├── frameworks/                   # Standards & Compliance
│   │   ├── isa-standards/           # ISA 200-599 definitions
│   │   ├── regional-standards/      # UK, EU, US, Pakistan
│   │   └── AuditFrameworkIndex.js   # Central registry
│   │
│   ├── requirements/                 # Audit Requirements
│   │   ├── AuditRequirementsFramework.js
│   │   ├── compliance/              # Compliance checklists
│   │   ├── expectations/            # Role-based expectations
│   │   └── controls/                # Control frameworks
│   │
│   ├── services/                     # Business Logic
│   │   ├── auditService.js
│   │   ├── reportingService.js
│   │   ├── materiality-calculator.js
│   │   └── ...core services
│   │
│   ├── components/                   # React UI Components
│   │   ├── MaterialityCalculator.jsx
│   │   ├── CommentPanel.jsx
│   │   ├── AuditWorksheet.jsx
│   │   └── ...UI components
│   │
│   ├── risk-library/                 # Risk & Procedure Database
│   │   ├── audit-procedures/        # 700+ procedures
│   │   ├── risk-patterns/
│   │   └── ...procedure libraries
│   │
│   ├── data/                         # Audit Data & Dropdowns
│   │   ├── audit-procedures.json
│   │   ├── materiality-factors.json
│   │   └── ...lookup tables
│   │
│   ├── connectors/                   # Integration Adapters
│   │   └── ...external integrations
│   │
│   ├── hooks/                        # React Hooks
│   ├── context/                      # State Management
│   ├── lib/                          # Utilities & Clients
│   ├── db/                           # Database Layer
│   ├── models/                       # Data Models
│   ├── middleware/                   # Express Middleware
│   ├── templates/                    # Document Templates
│   ├── design/                       # Design System
│   ├── api/                          # API Routes
│   ├── config/                       # Configuration
│   ├── workers/                      # Background Jobs
│   └── store/                        # State Store
│
├── server/                            # Express Backend
├── database/                          # Supabase Schema
│   └── schema.sql                    # PostgreSQL (18 tables)
│
├── docs/                              # CONSOLIDATED DOCUMENTATION (NEW)
│   ├── quick-start/                 # Getting started guides
│   ├── architecture/                # System architecture & design
│   ├── frameworks/                  # Audit frameworks & standards
│   ├── audit-procedures/            # Audit procedures reference
│   ├── deployment/                  # Deployment guides
│   ├── guides/                      # Implementation guides
│   ├── api-reference/               # API documentation
│   ├── legacy/                      # Historical documentation
│   └── AUDIT_FRAMEWORK/             # Comprehensive audit guide
│
├── CLAUDE.md                          # Project configuration
├── AUDITENGINE_README.md             # THIS FILE
├── package.json                       # Dependencies
├── vite.config.js                    # Vite configuration
├── vercel.json                       # Vercel deployment
└── ...project config files
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite (hot reload, fast builds) |
| **Backend** | Express.js (Node.js) |
| **Database** | Supabase (PostgreSQL, RLS enabled) |
| **AI** | Claude API via @anthropic-ai/sdk |
| **Export** | docx, xlsx, pdfkit |
| **Deployment** | Vercel + Supabase |
| **Testing** | Vitest + Testing Library |
| **Linting** | ESLint |

---

## ⚙️ Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local
# Update VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CLAUDE_API_KEY

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# AI Agent CLI
npm run agents plan              # Generate audit plan
npm run agents review            # Code review
npm run agents security          # Security audit
npm run agents compliance        # Compliance check
npm run agents docs             # Generate documentation
npm run agents report            # Generate reports
```

---

## 📦 Key Components

### 1. **AI Agent Orchestrator** (`src/services/aiAgentOrchestrator.js`)
Coordinates 9+ specialized agents:
- **Planning Agent**: Audit planning & ISA alignment
- **Risk Assessment Agent**: Inherent/control risk evaluation
- **Materiality Agent**: Materiality calculations
- **Evidence Agent**: Audit evidence collection
- **Compliance Agent**: Regulatory compliance checks
- **Reporting Agent**: Audit report generation
- ...and more

### 2. **Audit Framework** (`src/frameworks/`)
- **ISA Standards**: Full 200-599 standards mapped to audit phases
- **Regional Standards**: UK, EU, US, Pakistan specific requirements
- **Compliance Tracking**: Automated compliance checklist generation

### 3. **6-Phase Audit Engine** (`src/audit-stages/`)
Each phase has detailed procedures, requirements, and automation:
- Planning & Risk Assessment setup
- Interim & Final audit execution
- Completion & Reporting workflows

### 4. **Risk Library** (`src/risk-library/`)
- 700+ audit procedures indexed by phase, risk, and industry
- Materiality factors and benchmarks
- Industry-specific risk patterns

### 5. **Document Export** (`src/services/reportingService.js`)
- DOCX generation (audit reports, working papers)
- XLSX generation (schedules, calculations)
- PDF export support

---

## 🗄️ Database Schema

**Supabase PostgreSQL** (mbvjtondgunckgzrmyhq) with 18 tables:
- `audits` — Audit records
- `audit_phases` — Phase tracking
- `procedures` — Audit procedures
- `evidence` — Audit evidence
- `risks` — Risk assessments
- `controls` — Control testing
- `findings` — Audit findings
- `materiality` — Materiality calculations
- `exports` — Document exports
- ...and more (RLS enabled)

---

## 🔐 Environment Variables

**Required** (configure in Vercel):

```bash
# Supabase
VITE_SUPABASE_URL=https://mbvjtondgunckgzrmyhq.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here

# Claude API
VITE_CLAUDE_API_KEY=sk-ant-...

# Vercel Database
POSTGRES_PRISMA_URL=...
DATABASE_URL=...
```

See `.env.example` for all 19 variables.

---

## 📊 Consolidated Features

### Integrations Included
✅ Claude AI for intelligent procedures
✅ Supabase PostgreSQL for data persistence
✅ AWS S3 for document storage (optional)
✅ Email notifications (Nodemailer)
✅ Real-time updates (Socket.io)
✅ Webhook support for external systems

### Audit Capabilities
✅ Risk assessment (inherent & control)
✅ Materiality calculations
✅ Audit evidence management
✅ Finding tracking & resolution
✅ Compliance checklists
✅ Working papers generation
✅ Multi-user collaboration
✅ Audit trail & versioning

---

## 📚 Documentation

**Quick Start**: `docs/quick-start/` — Get running in 5 minutes
**Architecture**: `docs/architecture/` — System design & patterns
**Frameworks**: `docs/frameworks/` — ISA standards & compliance
**Audit Procedures**: `docs/audit-procedures/` — Procedure reference
**Deployment**: `docs/deployment/` — Production setup
**Guides**: `docs/guides/` — Implementation how-tos
**API Reference**: `docs/api-reference/` — API endpoints

---

## 🚢 Deployment

**Live**: https://auditengine.vercel.app
**Repository**: github.com/buledidk/Audit-Automation-Engine
**Database**: Supabase PRO (Indus Nexus Limited org)
**CI/CD**: GitHub Actions (Node 20.x)

### Deploying Changes

```bash
# Push to main branch
git push origin main

# Vercel automatically deploys (see workflow status)
# Monitor at vercel.com/auditengine
```

---

## 📋 Project Status

| Component | Status | Version |
|-----------|--------|---------|
| Core Platform | ✅ Production | 7.0.0 |
| 6-Phase Framework | ✅ Complete | 7.0.0 |
| AI Agents | ✅ Active | 9+ agents |
| Database Schema | ✅ Deployed | 18 tables |
| CI/CD Pipeline | ✅ Green | 6/6 checks |
| Compliance | ✅ ISA 200-599 | Multi-regional |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm run lint && npm run build`
3. Commit with clear message: `git commit -m "Add my feature"`
4. Push and create PR: `git push origin feature/my-feature`

---

## 📞 Support & Help

- **Documentation**: See `/docs` directory
- **Quick Reference**: `CLAUDE.md` (project config)
- **CLI Help**: `npm run agents -- --help`
- **Issues**: GitHub Issues in repository

---

## 📄 License

Proprietary — Built for Indus Nexus Limited & audit professionals.

---

**Last Updated**: March 2026
**Maintained By**: AuditEngine Team
**Version**: 7.0.0 (Consolidated)
