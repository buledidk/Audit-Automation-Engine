/**
 * Tour step definitions for the AuditEngine demo walkthrough.
 * Each step targets a CSS selector or uses a virtual overlay.
 */

export const TOUR_STEPS = [
  {
    id: "welcome",
    title: "Welcome to AuditEngine",
    body: "You're looking at a live statutory audit engagement for Meridian Construction Ltd — a medium-sized FRS 102 entity with £8.2m revenue. Every working paper, risk assessment, and test result you'll see is ISA (UK) compliant.",
    target: null, // centred overlay, no element highlight
    route: null,
    stats: [
      { label: "ISA Standards", value: "37" },
      { label: "Working Papers", value: "97" },
      { label: "AI Agents", value: "23" },
      { label: "Industries", value: "8" },
    ],
  },
  {
    id: "engagement-setup",
    title: "Engagement Setup",
    body: "Every audit starts here. Entity details, reporting framework, materiality calculation, and team assignment — all pre-configured. Materiality is £125,000 based on 2.5% of total assets, with performance materiality at 75%.",
    target: "[data-tour='engagement-config']",
    fallbackTarget: ".engagement-header",
    route: null,
    highlight: "config",
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment — ISA 315",
    body: "The risk engine identifies 14 audit risks for this construction engagement. Two are SIGNIFICANT (revenue recognition and WIP valuation), four ELEVATED, and eight NORMAL. Each risk links directly to the audit procedure that addresses it.",
    target: "[data-tour='risk-matrix']",
    fallbackTarget: ".risk-dashboard",
    route: null,
    highlight: "risks",
  },
  {
    id: "working-papers",
    title: "The Full Audit File",
    body: "97 working papers organised across six phases: Planning (A1-A10), Risk Assessment (B1-B3), Lead Schedules (C1-C8), Substantive Testing (D1-D16), Completion (E1-E6), and Reporting (F1-F2). Every paper references its ISA standard.",
    target: "[data-tour='audit-file']",
    fallbackTarget: ".audit-file-grid",
    route: null,
    highlight: "file",
  },
  {
    id: "ai-agents",
    title: "AI Agents at Work",
    body: "Watch our planning agent analyse this engagement. It reads the entity profile, identifies construction-specific risks per ISA 315, and populates the planning memo — referencing specific ISA paragraphs and FRS 102 sections. Every AI action is logged to an immutable audit trail.",
    target: "[data-tour='agent-panel']",
    fallbackTarget: ".agent-showcase",
    route: null,
    highlight: "agents",
    showAgentDemo: true,
  },
  {
    id: "substantive-testing",
    title: "Substantive Testing — ISA 500",
    body: "Revenue testing (D1): stage of completion recalculated for 5 contracts exceeding performance materiality. All agree to QS certificates within 2%. Cut-off testing satisfactory. Each test records sample size, result, exceptions, preparer, and reviewer.",
    target: "[data-tour='test-results']",
    fallbackTarget: ".wp-test-grid",
    route: null,
    highlight: "testing",
  },
  {
    id: "sign-off",
    title: "Review & Sign-off Workflow",
    body: "Three-stage sign-off chain: Prepare (S. Patel ACA) → Review (J. Whitfield FCA) → Approve (Partner). Every sign-off is timestamped and immutable. Partners can see review status across all 97 working papers at a glance.",
    target: "[data-tour='signoff-panel']",
    fallbackTarget: ".signoff-status",
    route: null,
    highlight: "signoff",
  },
  {
    id: "export",
    title: "Export — Professional Documents",
    body: "One click generates a complete audit memo in Word, a full workbook in Excel, or a signed report in PDF. These aren't templates — they're populated with the actual engagement data, ISA references, and test conclusions.",
    target: "[data-tour='export-buttons']",
    fallbackTarget: ".export-panel",
    route: null,
    highlight: "export",
    showExportDemo: true,
  },
  {
    id: "completion",
    title: "Completion — ISA 700",
    body: "Going concern: no material uncertainty. Subsequent events: no adjusting events. One adjusted difference (£12k unrecorded liability). Management letter: 3 points raised. Conclusion: unmodified opinion recommended.",
    target: "[data-tour='completion-summary']",
    fallbackTarget: ".completion-checklist",
    route: null,
    highlight: "completion",
  },
  {
    id: "summary",
    title: "Built for UK Statutory Audit",
    body: "AuditEngine covers the complete audit lifecycle — from engagement acceptance to signed report. 37 ISA standards, 35 FRS 102 sections, 62 Companies Act references, 8 industry profiles. Built by auditors, powered by AI, designed for the FRC inspection era.",
    target: null, // centred overlay
    route: null,
    stats: [
      { label: "ISA Standards", value: "37" },
      { label: "FRS 102 Sections", value: "35" },
      { label: "CA 2006 Refs", value: "62" },
      { label: "Tests Passing", value: "305" },
    ],
    isFinal: true,
  },
];

export const TOUR_CONFIG = {
  autoAdvanceMs: 8000,
  animationMs: 300,
  spotlightPadding: 12,
  tooltipMaxWidth: 420,
};
