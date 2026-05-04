# AuditEngine v10 AURA — Launch Tracker

> **Single source of truth** for commercial readiness. All programme agents read this file.
> Updated: 2026-04-23. Next review: 2026-04-30.

---

## Programme Status Summary

| Workstream | Owner Agent | Status | Completion |
|---|---|---|---|
| 1. Legal & Compliance | `launch-legal-compliance` | NOT STARTED | 0% |
| 2. Infrastructure | `launch-infrastructure` | NOT STARTED | 0% |
| 3. Billing & Monetisation | `launch-billing` | NOT STARTED | 0% |
| 4. Demo Showcase Module | `launch-demo-showcase` | NOT STARTED | 0% |
| 5. F500 Skill Pack | manual | SCOPED | 20% |

---

## Workstream 1: Legal & Compliance

**Agent:** `launch-legal-compliance`
**Goal:** All regulatory/legal prerequisites for accepting a paying client.
**Caveat:** Every document is DRAFT FOR PROFESSIONAL LEGAL REVIEW — not final.

- [ ] **1.1 DPIA** — Data Protection Impact Assessment (AI-assisted audit = high-risk processing under UK GDPR Art 35)
  - [ ] Draft DPIA document (processing activities, necessity, risks, mitigations)
  - [ ] Map data flows: client data → AuditEngine → Claude API → Supabase → exports
  - [ ] Risk assessment matrix (likelihood × severity)
  - [ ] DPO consultation record (or justification for not appointing DPO)
  - Status: NOT STARTED

- [ ] **1.2 ICO Registration** — Register as data controller with Information Commissioner's Office
  - [ ] Prepare registration details (purposes, data subjects, categories)
  - [ ] DK to submit via ico.org.uk (HUMAN ACTION REQUIRED)
  - Status: NOT STARTED

- [ ] **1.3 Client DPA Template** — Data Processing Agreement for audit clients
  - [ ] Draft standard-form DPA (GDPR Art 28 compliant)
  - [ ] Schedule: sub-processors list (Anthropic, Supabase, Vercel)
  - [ ] Schedule: technical & organisational measures (TOMs)
  - [ ] Schedule: data subject categories and retention periods
  - Status: NOT STARTED

- [ ] **1.4 Processor DPAs** — Agreements with each sub-processor
  - [ ] Anthropic — review their DPA terms, execute (HUMAN ACTION)
  - [ ] Supabase — review their DPA terms, execute (HUMAN ACTION)
  - [ ] Vercel — review their DPA terms, execute (HUMAN ACTION)
  - [ ] GitHub — review their DPA terms, execute (HUMAN ACTION)
  - [ ] Stripe — review their DPA terms, execute (HUMAN ACTION)
  - Status: NOT STARTED

- [ ] **1.5 Breach Notification Process** — 72-hour ICO reporting window
  - [ ] Draft breach response runbook (detection → assessment → notification → remediation)
  - [ ] Template: ICO notification form
  - [ ] Template: client notification letter
  - [ ] Roles and escalation contacts
  - Status: NOT STARTED

- [ ] **1.6 ISQM 1 Quality Management** — Firm-level quality management system
  - [ ] Draft ISQM 1 framework document (governance, resources, information, monitoring)
  - [ ] Quality objectives and risks
  - [ ] Monitoring and remediation process
  - [ ] Annual evaluation template
  - Status: NOT STARTED

- [ ] **1.7 ICAEW Technology Accreditation** — Post-beta application
  - [ ] Research accreditation criteria and application process
  - [ ] Prepare application pack
  - [ ] DK to submit (HUMAN ACTION)
  - Status: DEFERRED (post-beta)

---

## Workstream 2: Infrastructure

**Agent:** `launch-infrastructure`
**Goal:** Production-grade evidence storage and retention.

- [ ] **2.1 Seven-Year Immutable Archive** — ISA 230 audit documentation retention
  - [ ] Research and compare: AWS S3 Object Lock (EU-West-2) vs Cloudflare R2 Object Lock vs Supabase Storage WORM-emulation
  - [ ] Write decision memo (cost, compliance, implementation complexity, WORM guarantee)
  - [ ] DK to choose provider (DECISION REQUIRED)
  - [ ] Implement archive service (write path from audit_trail + exports → immutable store)
  - [ ] Retention policy enforcement (7-year minimum, auto-lock)
  - [ ] Disaster recovery and backup verification
  - Status: NOT STARTED

- [ ] **2.2 Domain Strategy**
  - [ ] Decide: retain `auditengine.co.uk` as redirect to `auditengine.agency`? (DECISION REQUIRED)
  - [ ] Configure DNS redirect if retained
  - Status: NOT STARTED

---

## Workstream 3: Billing & Monetisation

**Agent:** `launch-billing`
**Goal:** Accept payments, manage subscriptions, enforce plan limits.

- [ ] **3.1 Stripe Integration**
  - [ ] Design pricing tiers (solo practitioner / small firm / mid-tier / enterprise)
  - [ ] Implement Stripe Checkout (server-side, Express route)
  - [ ] Implement subscription management (upgrade / downgrade / cancel)
  - [ ] Implement webhook handler (payment success, failure, subscription changes)
  - [ ] Implement plan enforcement (engagement limits, user limits, AI query quotas)
  - [ ] Test with Stripe test mode end-to-end
  - Status: NOT STARTED

- [ ] **3.2 Pricing Page**
  - [ ] Design and build /pricing route
  - [ ] Feature comparison matrix
  - [ ] CTA → Stripe Checkout flow
  - Status: NOT STARTED

---

## Workstream 4: Demo Showcase Module

**Agent:** `launch-demo-showcase`
**Goal:** A self-running, guided demo that sells the product to clients and accreditation panels.

- [ ] **4.1 Guided Tour Engine**
  - [ ] Step-by-step walkthrough overlay (tooltip-driven, like Shepherd.js)
  - [ ] 8-10 tour stops: engagement setup → risk assessment → working papers → AI agents → testing → sign-off → export → completion
  - [ ] Auto-advance mode (timed) + manual mode (click-through)
  - Status: NOT STARTED

- [ ] **4.2 AI Agent Showcase**
  - [ ] Live (or simulated) agent execution panel showing agents reasoning over the demo engagement
  - [ ] Real-time streaming effect (typewriter) for agent outputs
  - [ ] Before/after: show what a manual working paper looks like vs AI-populated
  - Status: NOT STARTED

- [ ] **4.3 Demo Data Enhancement**
  - [ ] Upgrade existing 3 demo seeds to 100% engagement completion (currently ~62%)
  - [ ] Add completed test results, findings, management letter points, audit report draft
  - [ ] Add populated cell data across all material FSLI working papers
  - Status: NOT STARTED

- [ ] **4.4 Export Showcase**
  - [ ] One-click "Generate full audit file" from demo engagement
  - [ ] Pre-built downloadable samples: Word memo, Excel workbook, PDF report
  - Status: NOT STARTED

- [ ] **4.5 Demo Landing Route**
  - [ ] `/demo` route — standalone entry point (no auth required)
  - [ ] Hero section: "See AuditEngine in action"
  - [ ] Industry selector: Construction / Financial Services / Charity
  - [ ] "Start guided tour" button → launches tour engine on selected demo
  - Status: NOT STARTED

---

## Workstream 5: F500 Skill Pack

**Owner:** Manual (DK)
**Goal:** 4 Fortune-500 / SEC-filer audit skills installed in Claude.ai/Console.

- [x] Skills scoped (risk-assessment, controls-assessment, journal-entry-testing, group-audit)
- [x] Files written to ~/Documents/DK_F500_Skills/
- [ ] Fix critique item 1: group-audit "Three decisions" → "Two decisions"
- [ ] Fix critique item 2: risk-assessment paragraph reference ambiguity
- [ ] Fix critique item 3: controls-assessment SAS 145 / AS 2201 jurisdiction split
- [ ] Fix critique item 4: journal-entry-testing "LLM vouching" → "AI-assisted, auditor-in-the-loop"
- [ ] Install in Claude.ai Console project "DK-F500-Assurance-Master"
- [ ] Mirror to Claude.ai personal
- Status: SCOPED, 4 critique items open

---

## Human Actions Queue (DK only — no agent can do these)

| Action | Blocker for | Priority |
|---|---|---|
| Submit ICO registration at ico.org.uk | 1.2 | HIGH |
| Execute processor DPAs with Anthropic, Supabase, Vercel, GitHub, Stripe | 1.4 | HIGH |
| Choose 7-year archive provider (after reading decision memo) | 2.1 | HIGH |
| Decide on auditengine.co.uk domain | 2.2 | LOW |
| Submit ICAEW accreditation application | 1.7 | DEFERRED |
| Install F500 skills in Console | 5 | MEDIUM |

---

## Changelog

| Date | Change |
|---|---|
| 2026-04-23 | Tracker created. 5 workstreams defined. All at NOT STARTED except F500 (20%). |
