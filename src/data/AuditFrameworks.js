// ═══════════════════════════════════════════════════════════════════════════
// AuditEngine — Audit Frameworks, Entity Sizes & Working Paper Definitions
// Consolidated from AuditEngine v6 SPA into v10 AURA platform
// ISA (UK) · FRS 102 · Companies Act 2006 · FRC Ethical Standard 2019
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Financial Reporting Frameworks supported by AuditEngine.
 * Maps framework key to label, full name, and theme color.
 */
export const FRAMEWORKS = {
  frs105:        { label: "FRS 105",          full: "Micro-Entity",          color: "#3B82F6" },
  frs102_1a:     { label: "FRS 102 s1A",      full: "Small Company",         color: "#2563EB" },
  frs102:        { label: "FRS 102",           full: "Full UK GAAP",          color: "#1E40AF" },
  ifrs:          { label: "IFRS",              full: "International",         color: "#DC2626" },
  charities_sorp:{ label: "Charities SORP",    full: "SORP (FRS 102)",        color: "#059669" },
};

/**
 * Entity size thresholds per Companies Act 2006.
 * Used for materiality guidance, exemption checks, and framework selection.
 */
export const ENTITY_SIZES = {
  micro:  { label: "Micro Entity",   turnover: "≤£632k",  totalAssets: "≤£316k",  employees: "≤10",  defaultFramework: "frs105" },
  small:  { label: "Small",          turnover: "≤£10.2m", totalAssets: "≤£5.1m",  employees: "≤50",  defaultFramework: "frs102_1a" },
  medium: { label: "Medium",         turnover: "≤£36m",   totalAssets: "≤£18m",   employees: "≤250", defaultFramework: "frs102" },
  large:  { label: "Large Private",  turnover: ">£36m",   totalAssets: ">£18m",   employees: ">250", defaultFramework: "frs102" },
  listed: { label: "Listed/PIE",     turnover: "Any",     totalAssets: "Any",     employees: "Any",  defaultFramework: "ifrs" },
};

/**
 * Audit phases and their theme colors.
 * Maps to the 6-phase audit lifecycle in AuditEngine.
 */
export const AUDIT_PHASES = {
  ov: { label: "Overview",        color: "#C4972A" },
  pl: { label: "A — Planning",    color: "#2563EB" },
  ri: { label: "B — Risk",        color: "#DC2626" },
  le: { label: "C — Leads",       color: "#7C3AED" },
  te: { label: "D — Testing",     color: "#B91C1C" },
  co: { label: "E — Completion",  color: "#059669" },
  re: { label: "F — Reporting",   color: "#1F2937" },
  tr: { label: "Reference",       color: "#6B7280" },
};

/**
 * Standard working paper definitions for statutory audit engagements.
 * Each WP has a unique ID, ISA-referenced reference code, title, phase, and
 * whether it maps to a significant risk area.
 */
export const WORKING_PAPERS = [
  // Overview
  { id: "dash", ref: "⬡",  title: "Dashboard",              phase: "ov" },
  { id: "reg",  ref: "REG", title: "Regulatory Framework",   phase: "ov" },

  // A — Planning
  { id: "a1", ref: "A1", title: "Acceptance & Ethics",       phase: "pl" },
  { id: "a3", ref: "A3", title: "Entity Understanding",      phase: "pl" },
  { id: "a5", ref: "A5", title: "Materiality",               phase: "pl" },
  { id: "a6", ref: "A6", title: "Fraud Assessment",          phase: "pl" },
  { id: "a7", ref: "A7", title: "Significant Risks",         phase: "pl" },
  { id: "a8", ref: "A8", title: "Strategy",                  phase: "pl" },

  // B — Risk Assessment
  { id: "b1", ref: "B1", title: "Risk Summary",              phase: "ri" },
  { id: "b3", ref: "B3", title: "Assertion Matrix",          phase: "ri" },

  // C — Lead Schedules
  { id: "c1", ref: "C1", title: "Revenue Lead",              phase: "le" },
  { id: "c2", ref: "C2", title: "Receivables Lead",          phase: "le" },
  { id: "c3", ref: "C3", title: "Cash Lead",                 phase: "le" },
  { id: "c4", ref: "C4", title: "Payables Lead",             phase: "le" },

  // D — Testing (significant risk areas flagged)
  { id: "d1", ref: "D1", title: "Revenue Testing",           phase: "te", significantRisk: true },
  { id: "d3", ref: "D3", title: "Inventory/WIP Testing",     phase: "te", significantRisk: true },
  { id: "d6", ref: "D6", title: "Journals & Override",       phase: "te", significantRisk: true },

  // E — Completion
  { id: "e3", ref: "E3", title: "Going Concern",             phase: "co" },
  { id: "e6", ref: "E6", title: "Disclosures",               phase: "co" },

  // F — Reporting
  { id: "f1", ref: "F1", title: "ISA 265 Mgmt Letter",      phase: "re" },
  { id: "f2", ref: "F2", title: "ISA 700 Report",            phase: "re" },

  // Reference
  { id: "z",  ref: "Z",  title: "Audit Trail",               phase: "tr" },
];

/**
 * Get working papers filtered by phase.
 */
export function getWorkingPapersByPhase(phaseKey) {
  return WORKING_PAPERS.filter(wp => wp.phase === phaseKey);
}

/**
 * Get all significant risk working papers.
 */
export function getSignificantRiskPapers() {
  return WORKING_PAPERS.filter(wp => wp.significantRisk);
}

/**
 * Determine the appropriate framework for an entity based on its size category.
 */
export function getDefaultFramework(sizeKey) {
  const size = ENTITY_SIZES[sizeKey];
  if (!size) return null;
  return FRAMEWORKS[size.defaultFramework] || null;
}
