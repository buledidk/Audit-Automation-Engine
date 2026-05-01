// Framework, size, and engagement type constants — extracted from AuditEngine_AURA.jsx

export const FW = {
  frs102:{l:"FRS 102 (UK GAAP)",d:"Full FRS 102 — medium/large private",c:"#1565C0"},
  frs102_1a:{l:"FRS 102 Section 1A",d:"Small companies — reduced disclosures",c:"#2196F3"},
  frs105:{l:"FRS 105 (Micro-entities)",d:"Micro-entity — minimal disclosures",c:"#42A5F5"},
  ifrs:{l:"IFRS",d:"International — listed/PIE entities",c:"#D32F2F"},
  charities_sorp:{l:"Charities SORP (FRS 102)",d:"Charity-specific requirements",c:"#7B1FA2"}
};

export const SZ = {
  micro:{l:"Micro Entity",to:"≤ £1m",as:"≤ £500k",em:"≤ 10",fw:"frs105"},
  small:{l:"Small Company",to:"≤ £15m",as:"≤ £7.5m",em:"≤ 50",fw:"frs102_1a"},
  medium:{l:"Medium Company",to:"≤ £54m",as:"≤ £27m",em:"≤ 250",fw:"frs102"},
  large:{l:"Large Private",to:"> £54m",as:"> £27m",em:"> 250",fw:"frs102"},
  listed:{l:"Listed / PIE",to:"Any",as:"Any",em:"Any",fw:"ifrs"}
};

export const ET = [
  {k:"statutory",l:"Statutory Audit"},
  {k:"non_statutory",l:"Non-Statutory Audit"},
  {k:"group",l:"Group Audit (ISA 600)"},
  {k:"pie",l:"PIE Statutory Audit"},
  {k:"listed_pie",l:"Listed PIE Audit"}
];
