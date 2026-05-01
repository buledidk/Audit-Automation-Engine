// ═══ Shared Constants — extracted from AuditEngine_AURA.jsx ═══

export const FRAMEWORKS = {
  frs102: { l: "FRS 102 (UK GAAP)", d: "Full FRS 102 — medium/large private", c: "#1565C0" },
  frs102_1a: { l: "FRS 102 Section 1A", d: "Small companies — reduced disclosures", c: "#2196F3" },
  frs105: { l: "FRS 105 (Micro-entities)", d: "Micro-entity — minimal disclosures", c: "#42A5F5" },
  ifrs: { l: "IFRS", d: "International — listed/PIE entities", c: "#D32F2F" },
  charities_sorp: { l: "Charities SORP (FRS 102)", d: "Charity-specific requirements", c: "#7B1FA2" }
};

export const ENTITY_SIZES = {
  micro: { l: "Micro Entity", to: "≤ £1m", as: "≤ £500k", em: "≤ 10", fw: "frs105" },
  small: { l: "Small Company", to: "≤ £15m", as: "≤ £7.5m", em: "≤ 50", fw: "frs102_1a" },
  medium: { l: "Medium Company", to: "≤ £54m", as: "≤ £27m", em: "≤ 250", fw: "frs102" },
  large: { l: "Large Private", to: "> £54m", as: "> £27m", em: "> 250", fw: "frs102" },
  listed: { l: "Listed / PIE", to: "Any", as: "Any", em: "Any", fw: "ifrs" }
};

export const ENGAGEMENT_TYPES = [
  { k: "statutory", l: "Statutory Audit" },
  { k: "non_statutory", l: "Non-Statutory Audit" },
  { k: "group", l: "Group Audit (ISA 600)" },
  { k: "pie", l: "PIE Statutory Audit" },
  { k: "listed_pie", l: "Listed PIE Audit" }
];

export const DARK_COLORS = {
  bg: "#0B1120", sb: "#0D1428", card: "rgba(255,255,255,0.06)",
  brd: "rgba(255,255,255,0.12)", acc: "#F5A623", al: "#FFD54F",
  abg: "rgba(245,166,35,0.10)", tx: "#F0F0F0", dim: "#B0B8C8",
  fnt: "rgba(255,255,255,0.40)", grn: "#66BB6A", red: "#EF5350",
  org: "#FFA726", blu: "#42A5F5", pur: "#CE93D8", tl: "#26A69A",
  pln: "#1E88E5", rsk: "#E53935", ld: "#43A047", tst: "#FB8C00",
  cmp: "#8E24AA", rpt: "#5D4037", thBg: "rgba(255,255,255,0.08)", mdl: "#00695C"
};

export const LIGHT_COLORS = {
  bg: "#F5F5F5", sb: "#FFFFFF", card: "rgba(0,0,0,0.03)",
  brd: "rgba(0,0,0,0.10)", acc: "#D4870A", al: "#B8860B",
  abg: "rgba(212,135,10,0.08)", tx: "#1A1A1A", dim: "#555555",
  fnt: "rgba(0,0,0,0.40)", grn: "#388E3C", red: "#D32F2F",
  org: "#E65100", blu: "#1565C0", pur: "#7B1FA2", tl: "#00897B",
  pln: "#1565C0", rsk: "#C62828", ld: "#2E7D32", tst: "#E65100",
  cmp: "#6A1B9A", rpt: "#4E342E", thBg: "rgba(0,0,0,0.04)", mdl: "#00695C"
};

export const WP_TYPE_COLORS = {
  planning: "#1E88E5",
  risk: "#E53935",
  lead: "#43A047",
  testing: "#FB8C00",
  completion: "#8E24AA",
  reporting: "#5D4037",
  fs: "#00838F",
  regulatory: "#37474F",
  models: "#00695C",
  research: "#0097A7",
  integration: "#00BFA5",
  trail: "#F5A623"
};

export const DEFAULT_CFG = {
  industry: "", sector: "", framework: "", entitySize: "",
  entityName: "", fye: "", partner: "", manager: "", firmName: "",
  materiality: "", perfMateriality: "", trivial: "",
  engagementType: "", groupParent: "", groupComponents: "",
  groupCompMateriality: "", entityStructure: "", subsidiaries: "",
  parentName: "", configured: false
};
