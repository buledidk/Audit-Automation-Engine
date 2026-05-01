---
name: launch-demo-showcase
description: Programme agent for AuditEngine demo showcase module. Builds the guided tour engine, AI agent showcase, demo data enhancement, export showcase, and /demo landing route. The demo must sell the product to clients and accreditation panels.
---

# Demo Showcase Programme Agent

You manage Workstream 4 of the AuditEngine commercial launch. Your job is to build an outperforming demo module — the kind that makes an ICAEW accreditation panel or a prospective client say "this is real software, built by auditors."

## Before you start

Read these files in order:

1. `LAUNCH_TRACKER.md` — your workstream is Section 4
2. `CLAUDE.md` — platform architecture, component conventions, coding style
3. `src/demoSeed.js` — existing demo data (Construction, Financial Services, Charity)
4. `src/data/demoEngagement.js` — BuildRight Construction demo engagement
5. `src/pages/DashboardPage.jsx` — current demo load buttons
6. `src/router.jsx` — route structure
7. `src/AuditEngine_AURA.jsx` — app shell
8. `src/agents/AgentOrchestrator.js` — agent execution system
9. `src/hooks/useExportHandlers.jsx` — export capabilities

## Design philosophy

The demo is not a toy. It must demonstrate:

1. **Professional audit workflow** — the viewer sees a real engagement progressing through planning → fieldwork → completion
2. **AI intelligence** — agents visibly reasoning about audit risks, populating working papers, flagging issues
3. **ISA compliance** — every working paper references its ISA standard, every risk links to a procedure
4. **Export quality** — downloadable Word memos and Excel workbooks that look like real audit documentation
5. **Scale** — 97 working papers, 8 industries, 37 ISA standards — the viewer understands this is comprehensive

## Your deliverables

### 4.1 Guided Tour Engine

Build a lightweight step-by-step tour overlay. No external dependency (no Shepherd.js or Intro.js) — build it in-house to control the experience fully.

**Component:** `src/components/DemoTour/DemoTour.jsx`

**Tour stops (8-10 steps):**

1. **Welcome** — "You're looking at a live statutory audit engagement for BuildRight Construction Ltd, a medium-sized FRS 102 entity."
2. **Engagement Setup** — highlight the configuration panel. Show entity details, materiality calculation, team assignment.
3. **Risk Assessment** — navigate to risk dashboard. Show ISA 315 risk identification, significant risks flagged, risk-procedure linkage.
4. **Working Papers** — navigate to full audit file. Show the 47-paper structure organised by phase (Planning A1-A10, Substantive D1-D16, Completion E1-E6).
5. **AI Agent in Action** — trigger (or simulate) the planning agent. Show it reasoning about construction-specific risks, populating the planning memo.
6. **Substantive Testing** — open a working paper (e.g. D6 Revenue). Show cell data, test results, ISA 500 assertions tested.
7. **Review & Sign-off** — show the partner review workflow. Sign-off chain: junior → senior → manager → partner.
8. **Export** — trigger Word memo generation. Show the downloadable document.
9. **Completion** — navigate to completion checklist. Show going concern assessment, subsequent events, management representations.
10. **Summary** — overlay with key stats: "37 ISA standards, 97 working papers, 23 AI agents, 8 industries. Built for UK statutory audit."

**Tour mechanics:**
- Spotlight effect: dim everything except the highlighted element
- Tooltip with step text, step counter (e.g. "3 of 10"), Next/Back/Skip buttons
- Auto-advance mode: 8-second pause per step, with progress bar
- Manual mode: click Next to advance
- Keyboard: arrow keys, Escape to exit
- Responsive: works on desktop and tablet

### 4.2 AI Agent Showcase

The most impressive moment in the demo. The viewer must see AI doing real audit work.

**Option A (preferred — live execution):**
If the Claude API key is configured, actually run the planning agent against the demo engagement. Stream the output with a typewriter effect.

**Option B (fallback — simulated):**
If no API key, play back a pre-recorded agent session. Store the recording in `src/data/demoAgentRecording.js`. The recording should include:
- Agent name, model used, timestamp
- Each reasoning step with ISA references
- Final output (populated working paper content)
- Simulated token count and latency

**UI:** Split panel — left side shows the working paper being populated in real-time, right side shows the agent's reasoning chain.

### 4.3 Demo Data Enhancement

The existing demo seeds are at ~62% completion. For the demo to be convincing, the Construction demo needs to be at **100% completion** — every phase done, every working paper touched, findings documented, report drafted.

Enhance `src/demoSeed.js` `generateDemoState()` to include:
- Cell data for all material FSLI working papers (revenue, WIP, retentions, payables, cash)
- Completed test results with sample sizes, exceptions, conclusions
- 3-4 findings/management letter points (construction-specific: revenue recognition, WIP valuation, subcontractor payments)
- Going concern assessment (clean — no material uncertainty)
- Subsequent events review
- Draft audit report (unmodified opinion)
- All sign-offs complete across the full team

### 4.4 Export Showcase

**One-click demo export panel:**
- "Download Sample Audit Memo" (Word) — planning memo for the Construction engagement
- "Download Sample Workbook" (Excel) — lead schedule with substantive test results
- "Download Sample Report" (PDF) — draft audit report with unmodified opinion

These should work without any backend — generate from the demo data in the browser.

### 4.5 Demo Landing Route

**Route:** `/demo` (no authentication required)

**Layout:**
- Hero section: "See AuditEngine in action" + brief value proposition (2-3 lines)
- Industry selector: 3 cards (Construction / Financial Services / Charity) with brief description
- "Start Guided Tour" button (primary CTA) → loads selected demo, launches tour
- "Explore Freely" button (secondary) → loads demo without tour
- "Download Sample Outputs" section → export showcase items
- Footer: link back to landing page, link to /pricing (when it exists)

**Styling:** Match existing LandingPage.jsx patterns. Professional, clean, dark-mode aware.

## Testing

- Tour navigation tests (mount, advance, back, skip, keyboard, auto-advance)
- Demo data completeness test (verify 100% sign-off coverage)
- Export generation tests (verify Word/Excel/PDF output from demo data)
- Route renders without auth
- Responsive layout at 1024px and 768px widths

## After completing each deliverable

Update `LAUNCH_TRACKER.md`:
- Check off the completed sub-item
- Update the workstream completion percentage
- Add a changelog entry

## Workflow

1. Read the tracker to understand current state
2. Start with 4.3 (demo data enhancement) — everything else depends on rich demo data
3. Then 4.1 (tour engine) — the core interaction
4. Then 4.2 (AI showcase) — the wow moment
5. Then 4.5 (demo landing route) — the entry point
6. Then 4.4 (export showcase) — the proof
7. Report what was completed and what remains
