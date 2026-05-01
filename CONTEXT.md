# AuditEngine — Claude Code Session Context

Last updated: April 2025
Operator: DK Buledi (Darya Khan Buledi) — Manager, Chartered Certified Accountant (ACCA), UK ILR
Session rule: Read this file first. Do not ask DK to re-explain the project. Everything you need is here.

## 1. Who is DK

DK is a solo builder and experienced audit professional with nine-plus years across BDO UK, PwC UK, Deloitte Qatar, and PwC Pakistan. He is:

A Manager at Christiansons Chartered Certified Accountants, London (day job, separate from this project)

Building AuditEngine as a personal SaaS venture under the DK Empire operating philosophy

Building Indus Nexus Limited as a parallel trading venture (Pakistan to UK trade corridors)

Based in London E16, Gateway Tower

DK's professional expertise is the intellectual engine behind AuditEngine: statutory audit, IFRS, FRS 102, ISA (UK), SOX/ICFR, financial controls, group reporting, banking and capital markets assurance.

Communication style: Direct, no filler, ruthless accuracy, professional UK English. No hyphens. No em dashes. No AI-sounding phrasing.

## 2. What AuditEngine Is

AuditEngine is a web-based statutory audit portal built for UK-registered audit firms. It is not a toy. It is an inspection-grade, ISA-compliant audit file automation platform designed to replace manual Excel-and-Word audit workflows.

Live domain: auditengine.agency
GitHub: buledidk (confirm exact repo name in working directory)
Status: Active development, production infrastructure in place

### What it does

Automates ISA-compliant audit workpaper generation using Claude API (Sonnet 4 model)

Covers planning, risk assessment, materiality (ISA 300, 315, 320), going concern (ISA 570), journal entry testing (ISA 240), evidence and sampling (ISA 500, 530)

Generates structured audit documentation for FRS 102 and IFRS entities

Supports group audit workflows under ISA 600 (revised)

Enforces entity name discipline: all demo outputs use "Demo Client Limited" (primary) and "ABC Company" (secondary). Christiansons, EIM Learning UK Ltd, and Huge UK Ltd must never appear in any audit tool output.

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth and storage | Supabase |
| File storage | AWS S3 Object Lock (ISA 230 compliant, 60-day immutable archive) |
| Hosting | Vercel (frontend) + Railway (backend) |
| AI engine | Anthropic Claude API (claude-sonnet-4-20250514) |
| Payments | Stripe |
| Version control | GitHub |

All accounts are on paid/pro tiers. Everything is live and connected.

## 4. Active Modules

These modules are either built or in active development:

Planning and audit strategy (ISA 300)

Risk assessment and business understanding (ISA 315 revised)

Materiality calculator (ISA 320 and 450) — OM, PM, CTT, specific materiality

Going concern assessment (ISA 570 revised)

Journal entry testing (ISA 240 paragraph 32)

Audit evidence and sampling (ISA 500 and 530)

Group audit coordination (ISA 600 revised)

Controls assessment (SOX 404, ITGC, application controls)

Audit report drafting (ISA 700, 705, 706)

## 5. Claude API Integration

Model: claude-sonnet-4-20250514
Max tokens per call: 1000 (standard), extend where workpaper output requires it
Pattern: Structured prompt with ISA reference, client context, and JSON-formatted output
System prompt discipline: Each module carries its own domain-specific system prompt aligned to the relevant ISA standard

API key stored in environment variable: ANTHROPIC_API_KEY

Do not hardcode keys. Do not log keys. Reference via process.env.ANTHROPIC_API_KEY only.

## 6. Connected MCP Connectors (Active in Claude.ai)

These connectors are live on DK's Claude.ai account and automatically available in Claude Code sessions when signed in:

### Priority connectors for AuditEngine builds

| Connector | Purpose in AuditEngine context |
|---|---|
| Vercel | Deploy frontend, check build logs, manage environment variables |
| GitHub (via Atlassian/custom) | Commit, PR, branch management |
| Google Drive | Store and retrieve audit templates, proposal documents, SKILL.md files |
| Notion | Architecture decisions log, module specs, research notes |
| Slack | Build notifications, error alerts, team updates |
| Stripe | Check billing, subscription tiers, webhook status |
| Gmail | Client communication, platform notifications |
| Google Calendar | Scheduling build sessions and client meetings |

### Add these to Claude Code terminal (one-time setup)

Run these commands once inside the AuditEngine repo:

```
claude mcp add --transport http vercel --scope project https://mcp.vercel.com
claude mcp add --transport http github --scope project https://mcp.github.com
claude mcp add --transport http slack --scope project https://mcp.slack.com/mcp
claude mcp add --transport http notion --scope project https://mcp.notion.com/mcp
claude mcp add --transport http google-drive --scope project https://drivemcp.googleapis.com/mcp/v1
claude mcp add --transport http stripe --scope project https://mcp.stripe.com
```

These become available project-scoped in .mcp.json at the repo root and auto-sync with your Claude.ai connectors.

## 7. Operating Model (Single Window Rule)

Claude Code terminal is the only build surface. Everything else is read-only verification.

| Surface | Permitted use |
|---|---|
| Claude Code terminal | All building, debugging, testing, deploying, committing |
| Claude.ai chat | Architecture decisions, strategy, writing tasks only |
| Claude Projects | Store CONTEXT.md, SKILL.md files, decision logs |
| Vercel dashboard | Verify deployments only — never initiate changes here |
| Supabase dashboard | Verify database state only |
| GitHub | Verify PRs and commit history only |

Never start a build conversation in Claude.ai chat. The moment you say "now build it", open the terminal.

## 8. Current Priorities

Stabilise the core ISA module pipeline end to end (prompt in, structured workpaper out)

Implement Stripe billing tiers (Starter, Professional, Firm)

Supabase Row Level Security policies for multi-tenant data isolation

AWS S3 Object Lock configuration for ISA 230 file retention

ICO registration and DPIA completion for UK GDPR compliance

ICAEW Technology Accreditation research for credibility positioning

## 9. What is Blocked or Unresolved

ICAEW accreditation pathway: research needed, not yet started

PII scrubbing layer for bank statement analysis tool: architecture defined, not built

ACCA Practising Certificate: application in progress (five-week plan exists)

AuditEngine pricing page copy: draft needed

## 10. Career and Brand Context

DK's career positioning is directly tied to AuditEngine as a live portfolio asset. The framing for all external profiles:

Architected and shipped AuditEngine — a multi-agent statutory audit platform built solo using React, Node.js, PostgreSQL, Supabase, Vercel, and the Anthropic Claude API. Covers ISA-compliant risk assessment, materiality, going concern, journal entry testing, and controls assessment. Built from zero to production as a working audit professional.

Malt profile positioning: AI-augmented audit and regulated reporting specialist. Tiered day rate structure (£850 to £2,200). 15-plus agent cluster architecture.

Tagline: Rooted in Sindh. Engineered in London.

Active job pipeline (as of early 2026): CLS SOX Manager, Deliveroo Finance Manager, Scotiabank Senior Audit Manager, HSBC Innovation Banking, Octopus Money Finance Manager.

## 11. Entities and Name Rules

| Context | Permitted entity names |
|---|---|
| All audit tool demos and outputs | Demo Client Limited (primary), ABC Company (secondary) |
| Business correspondence | Christiansons Chartered Certified Accountants |
| Trading venture | Indus Nexus Limited |
| SaaS platform | AuditEngine (domain: auditengine.agency) |

Never use: Christiansons, EIM Learning UK Ltd, or Huge UK Ltd in any audit tool output or demo workpaper.

## 12. How to Start Each Session

When DK opens a Claude Code session in the AuditEngine repo:

Read this file

Check git status for what changed since last session

Ask DK: "What are we building today?" — one question only

Do not re-ask for context already in this file

Propose the next concrete action, then execute on confirmation

## 13. Formatting Rules for All Outputs

UK English throughout

No hyphens as separators

No em dashes

No AI-sounding phrases ("certainly", "of course", "absolutely", "I'd be happy to")

No citation tokens or tool references in final output

Clean, factual, professional language

Email greetings start with "Hi"

Sign-offs use "DK Buledi" or "DK" depending on context

This file is the single source of truth for Claude Code sessions on the AuditEngine project. Update it whenever a major architectural decision is made or a module ships.
