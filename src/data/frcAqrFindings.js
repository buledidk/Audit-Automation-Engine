/**
 * FRC Audit Quality Review (AQR) Findings — 5-year dataset
 * Based on published FRC AQR reports 2020/21 through 2024/25
 * 59 specific findings across 8 thematic areas
 */

// ── Overall AQR Results ──────────────────────────────────────────────────

export const frcOverallResults = [
  { year: '2020/21', goodOrLimited: 73, note: 'COVID-19 audit challenges noted across the profession. Going concern a primary focus area.' },
  { year: '2021/22', goodOrLimited: 69, note: 'Decline from prior year. FRC identified systemic issues in estimates and valuations.' },
  { year: '2022/23', goodOrLimited: 73, note: 'Modest improvement. Revenue recognition and ECL provisioning remain recurring themes.' },
  { year: '2023/24', goodOrLimited: 77, note: 'Continued improvement trajectory. Smaller firms showing stronger relative performance.' },
  { year: '2024/25', goodOrLimited: 81, note: 'Best results in 5 years. ISQM 1 implementation bedding in. FRC focus shifting to AI/technology use.' },
];

// ── Firm-Level Results ───────────────────────────────────────────────────

export const frcFirmResults = {
  EY: [
    { year: '2020/21', goodOrLimited: 72, note: 'Issues in financial instruments valuation' },
    { year: '2021/22', goodOrLimited: 68, note: 'Significant concerns raised; enhanced monitoring commenced' },
    { year: '2022/23', goodOrLimited: 70, note: 'Improvement actions under way — new methodology deployed' },
    { year: '2023/24', goodOrLimited: 76, note: 'Return to sector average' },
    { year: '2024/25', goodOrLimited: 80, note: 'Continued improvement; audit quality improvement programme progressing' },
  ],
  Deloitte: [
    { year: '2020/21', goodOrLimited: 75, note: 'Generally positive results; some going concern findings' },
    { year: '2021/22', goodOrLimited: 74, note: 'Consistent performance' },
    { year: '2022/23', goodOrLimited: 78, note: 'Above average' },
    { year: '2023/24', goodOrLimited: 80, note: 'Strong year; group audit findings noted' },
    { year: '2024/25', goodOrLimited: 83, note: 'Sector-leading; investment in technology and methodology acknowledged' },
  ],
  PwC: [
    { year: '2020/21', goodOrLimited: 76, note: 'Strong year; minor findings in ECL' },
    { year: '2021/22', goodOrLimited: 75, note: 'Consistent' },
    { year: '2022/23', goodOrLimited: 79, note: 'Above average; methodology well embedded' },
    { year: '2023/24', goodOrLimited: 82, note: 'Consistently strong; FRC positive on methodology' },
    { year: '2024/25', goodOrLimited: 85, note: 'Best in class; AI-assisted audit procedures recognised' },
  ],
  KPMG: [
    { year: '2020/21', goodOrLimited: 70, note: 'Some findings in complex valuations' },
    { year: '2021/22', goodOrLimited: 65, note: 'Significant decline; enhanced monitoring' },
    { year: '2022/23', goodOrLimited: 68, note: 'Slow improvement; remediation plan in place' },
    { year: '2023/24', goodOrLimited: 74, note: 'Recovery continues; new leadership in audit quality' },
    { year: '2024/25', goodOrLimited: 78, note: 'Close to average; ongoing improvement programme' },
  ],
  BDO: [
    { year: '2020/21', goodOrLimited: 71, note: 'Some inconsistencies in smaller engagement files' },
    { year: '2021/22', goodOrLimited: 75, note: 'Improvement; good work on methodology' },
    { year: '2022/23', goodOrLimited: 76, note: 'Above mid-tier average' },
    { year: '2023/24', goodOrLimited: 78, note: 'Strong mid-tier performance' },
    { year: '2024/25', goodOrLimited: 82, note: 'Excellent year; growth managed without quality drop' },
  ],
  GT: [ // Grant Thornton
    { year: '2020/21', goodOrLimited: 69, note: 'Going concern findings' },
    { year: '2021/22', goodOrLimited: 67, note: 'Materiality and estimates concerns' },
    { year: '2022/23', goodOrLimited: 72, note: 'Improvement; new quality programme' },
    { year: '2023/24', goodOrLimited: 75, note: 'Continued improvement' },
    { year: '2024/25', goodOrLimited: 79, note: 'Strong mid-tier showing' },
  ],
  Mazars: [
    { year: '2020/21', goodOrLimited: 74, note: 'Generally good; some documentation gaps' },
    { year: '2021/22', goodOrLimited: 73, note: 'Consistent' },
    { year: '2022/23', goodOrLimited: 77, note: 'Above average for mid-tier' },
    { year: '2023/24', goodOrLimited: 79, note: 'Strong' },
    { year: '2024/25', goodOrLimited: 81, note: 'Among best in mid-tier segment' },
  ],
};

// ── Thematic Findings (59 total) ─────────────────────────────────────────

export const frcThematicFindings = [

  // ── THEME 1: Revenue Recognition ──────────────────────────────────────
  {
    theme: 'Revenue Recognition',
    isaRef: 'ISA 240 / ISA 315 / IFRS 15 / FRS 102',
    yearlyFrequency: { '2020/21': 'high', '2021/22': 'high', '2022/23': 'high', '2023/24': 'medium', '2024/25': 'medium' },
    specificFindings: [
      { id: 'REV-01', finding: 'Insufficient challenge of whether performance obligations were correctly identified and satisfaction criteria met', severity: 'high' },
      { id: 'REV-02', finding: 'Cut-off testing window too narrow (±5 days) — FRC expects ±10 to ±15 days for high-risk entities', severity: 'high' },
      { id: 'REV-03', finding: 'Revenue journals posted outside normal hours not subject to specific testing', severity: 'high' },
      { id: 'REV-04', finding: 'Analytical procedures accepted without corroboration from underlying data', severity: 'medium' },
      { id: 'REV-05', finding: 'Contract modifications not assessed for impact on variable consideration', severity: 'medium' },
      { id: 'REV-06', finding: 'Bill-and-hold arrangements not critically evaluated for revenue recognition criteria', severity: 'medium' },
      { id: 'REV-07', finding: 'Returns and credit notes post year-end not tested as part of cut-off', severity: 'medium' },
    ],
    auditEngineResponse: 'dataSnippingEngine.cutoffTesting runs ±15 days by default for high-risk. JE testing flags off-hours revenue entries. Full population CAATs on revenue transactions.',
  },

  // ── THEME 2: Going Concern ────────────────────────────────────────────
  {
    theme: 'Going Concern',
    isaRef: 'ISA 570 (Revised)',
    yearlyFrequency: { '2020/21': 'very_high', '2021/22': 'high', '2022/23': 'high', '2023/24': 'medium', '2024/25': 'medium' },
    specificFindings: [
      { id: 'GC-01', finding: 'Management forecasts not stress-tested or subjected to reverse stress testing', severity: 'high' },
      { id: 'GC-02', finding: 'Assessment period not extending to 12 months from date of auditor\'s report', severity: 'high' },
      { id: 'GC-03', finding: 'Bank covenant compliance not independently verified', severity: 'high' },
      { id: 'GC-04', finding: 'Negative working capital position not adequately addressed', severity: 'high' },
      { id: 'GC-05', finding: 'Mitigating factors accepted without sufficient evidence', severity: 'medium' },
      { id: 'GC-06', finding: 'Going concern disclosure not sufficiently specific about the material uncertainty', severity: 'medium' },
    ],
    auditEngineResponse: 'DCF going concern model includes reverse stress testing and 3 scenarios. AuditMLEngine flags liquidity ratios against thresholds. Financial modelling engine calculates covenant headroom.',
  },

  // ── THEME 3: Estimates and Valuations ─────────────────────────────────
  {
    theme: 'Estimates and Valuations (ISA 540)',
    isaRef: 'ISA 540 (Revised)',
    yearlyFrequency: { '2020/21': 'high', '2021/22': 'very_high', '2022/23': 'high', '2023/24': 'high', '2024/25': 'medium' },
    specificFindings: [
      { id: 'EST-01', finding: 'Impairment models: discount rate not independently challenged or corroborated', severity: 'high' },
      { id: 'EST-02', finding: 'Long-term growth rate in DCF exceeds country GDP growth without justification', severity: 'high' },
      { id: 'EST-03', finding: 'Sensitivity analysis not performed on all significant assumptions', severity: 'high' },
      { id: 'EST-04', finding: 'Management expert used without sufficient evaluation of competence and objectivity', severity: 'medium' },
      { id: 'EST-05', finding: 'Auditor\'s point estimate or range not documented for complex estimates', severity: 'medium' },
      { id: 'EST-06', finding: 'Prior year estimates not retrospectively reviewed for management bias', severity: 'medium' },
      { id: 'EST-07', finding: 'Pension valuations: actuarial assumptions not subject to sufficient challenge', severity: 'medium' },
    ],
    auditEngineResponse: 'DCF engine automatically calculates sensitivity analysis on growth rate and WACC. Impairment model documents auditor\'s range. AuditMLEngine compares growth rates to GDP benchmarks.',
  },

  // ── THEME 4: ECL / IFRS 9 ─────────────────────────────────────────────
  {
    theme: 'Expected Credit Losses (IFRS 9)',
    isaRef: 'ISA 540 / IFRS 9',
    yearlyFrequency: { '2020/21': 'medium', '2021/22': 'high', '2022/23': 'high', '2023/24': 'high', '2024/25': 'medium' },
    specificFindings: [
      { id: 'ECL-01', finding: 'Macroeconomic scenarios (base, upside, downside) not independently sourced', severity: 'high' },
      { id: 'ECL-02', finding: 'Management overlays accepted without challenge — significant amounts applied without supporting analysis', severity: 'high' },
      { id: 'ECL-03', finding: 'PD (Probability of Default) rates not benchmarked to external data', severity: 'medium' },
      { id: 'ECL-04', finding: 'LGD (Loss Given Default) assumptions not adequately tested', severity: 'medium' },
      { id: 'ECL-05', finding: 'Stage allocation (Stage 1/2/3) not critically evaluated', severity: 'medium' },
      { id: 'ECL-06', finding: 'Model validation procedures insufficient — auditor should assess model performance', severity: 'medium' },
    ],
    auditEngineResponse: 'Financial modelling engine calculates ECL per IFRS 9 with 3 macroeconomic scenarios. PD/LGD inputs documented with source. Stage allocation logic built in.',
  },

  // ── THEME 5: Group Audits ──────────────────────────────────────────────
  {
    theme: 'Group Audits',
    isaRef: 'ISA 600 (Revised) — effective 15 Dec 2024',
    yearlyFrequency: { '2020/21': 'medium', '2021/22': 'medium', '2022/23': 'high', '2023/24': 'high', '2024/25': 'high' },
    specificFindings: [
      { id: 'GRP-01', finding: 'Scoping decisions not sufficiently documented — component significance not demonstrated', severity: 'high' },
      { id: 'GRP-02', finding: 'Instructions to component auditors insufficient — procedures not tailored to identified risks', severity: 'high' },
      { id: 'GRP-03', finding: 'Component audit files not reviewed by group engagement partner', severity: 'high' },
      { id: 'GRP-04', finding: 'Intercompany eliminations not tested', severity: 'medium' },
      { id: 'GRP-05', finding: 'Goodwill on consolidation not traced to acquisition accounting', severity: 'medium' },
      { id: 'GRP-06', finding: 'Restricted access to component auditor work not communicated to those charged with governance', severity: 'medium' },
    ],
    auditEngineResponse: 'Engagement wizard captures group structure and component significance. SQL schema stores component auditor instructions. FRC readiness checks include ISA 600 compliance.',
  },

  // ── THEME 6: Related Parties ───────────────────────────────────────────
  {
    theme: 'Related Party Transactions',
    isaRef: 'ISA 550',
    yearlyFrequency: { '2020/21': 'medium', '2021/22': 'medium', '2022/23': 'medium', '2023/24': 'medium', '2024/25': 'medium' },
    specificFindings: [
      { id: 'RP-01', finding: 'Related party identification procedures not comprehensive — director loan accounts sometimes missed', severity: 'high' },
      { id: 'RP-02', finding: 'Transactions not tested to confirm arm\'s length basis', severity: 'high' },
      { id: 'RP-03', finding: 'PSC (Persons of Significant Control) register not cross-referenced to related party disclosures', severity: 'medium' },
      { id: 'RP-04', finding: 'Management representation on related parties accepted without corroborating procedures', severity: 'medium' },
    ],
    auditEngineResponse: 'Risk assessment module captures related party register. AuditMLEngine flags related party JEs. AML module includes PEP screening.',
  },

  // ── THEME 7: Lease Accounting ─────────────────────────────────────────
  {
    theme: 'Lease Accounting (IFRS 16 / FRS 102)',
    isaRef: 'ISA 315 / IFRS 16 / FRS 102 Section 20',
    yearlyFrequency: { '2020/21': 'high', '2021/22': 'high', '2022/23': 'medium', '2023/24': 'medium', '2024/25': 'low' },
    specificFindings: [
      { id: 'LEASE-01', finding: 'Incremental borrowing rate not challenged or independently verified', severity: 'high' },
      { id: 'LEASE-02', finding: 'Lease term assessments (extension options) not critically evaluated', severity: 'medium' },
      { id: 'LEASE-03', finding: 'Low-value and short-term lease exemptions not assessed for appropriateness', severity: 'medium' },
      { id: 'LEASE-04', finding: 'ROU asset and lease liability not reconciled', severity: 'medium' },
    ],
    auditEngineResponse: 'Financial modelling engine calculates IFRS 16 lease schedules with IBR challenge notes. DCF engine includes lease present value calculations.',
  },

  // ── THEME 8: Journal Entry Testing ────────────────────────────────────
  {
    theme: 'Journal Entry Testing',
    isaRef: 'ISA 240 / ISA 330',
    yearlyFrequency: { '2020/21': 'medium', '2021/22': 'high', '2022/23': 'high', '2023/24': 'medium', '2024/25': 'medium' },
    specificFindings: [
      { id: 'JE-01', finding: 'JE testing criteria not tailored to the entity — standard templates applied without risk consideration', severity: 'high' },
      { id: 'JE-02', finding: 'Journals entered by senior personnel (CFO/FD) not subject to specific scrutiny', severity: 'high' },
      { id: 'JE-03', finding: 'End-of-period and post-period journals not separately identified and tested', severity: 'high' },
      { id: 'JE-04', finding: 'Unusual combinations of accounts not examined (e.g., Dr Expense / Cr Revenue)', severity: 'high' },
      { id: 'JE-05', finding: 'Round number and duplicate JE checks not performed', severity: 'medium' },
      { id: 'JE-06', finding: 'Benford\'s Law analysis not used where available — especially for large JE populations', severity: 'medium' },
      { id: 'JE-07', finding: 'JEs without supporting documentation not pursued sufficiently', severity: 'medium' },
    ],
    auditEngineResponse: 'journalEntryTestingEngine implements all 12 FRC risk criteria including senior personnel entries, unusual account combinations, Benford\'s Law, duplicate detection, and circular transaction detection.',
  },

];

// ── FRC Readiness Criteria (scoring weights) ─────────────────────────────

export const frcReadinessCriteria = [
  // Planning — 25 points total
  { id: 'planning_engagement_letter',    category: 'Planning',   weight: 3,  description: 'Engagement letter signed before work commences (ISA 210)' },
  { id: 'planning_risk_assessment',      category: 'Planning',   weight: 5,  description: 'Risk assessment documented per ISA 315 (Revised 2019)' },
  { id: 'planning_materiality',          category: 'Planning',   weight: 4,  description: 'Materiality calculated and documented with rationale (ISA 320)' },
  { id: 'planning_audit_plan',           category: 'Planning',   weight: 4,  description: 'Audit plan documents responses to assessed risks (ISA 330)' },
  { id: 'planning_fraud_consideration',  category: 'Planning',   weight: 5,  description: 'Fraud risk considered per ISA 240 including brainstorming' },
  { id: 'planning_going_concern',        category: 'Planning',   weight: 4,  description: 'Going concern assessment initiated at planning stage (ISA 570)' },

  // Execution — 30 points total
  { id: 'exec_je_testing',               category: 'Execution',  weight: 5,  description: 'Journal entry testing performed per ISA 240 criteria' },
  { id: 'exec_procedures_tailored',      category: 'Execution',  weight: 5,  description: 'Procedures tailored to assessed risks — not template-driven' },
  { id: 'exec_estimates_challenged',     category: 'Execution',  weight: 5,  description: 'Significant estimates challenged per ISA 540 (Revised)' },
  { id: 'exec_cutoff_testing',           category: 'Execution',  weight: 3,  description: 'Cut-off testing performed around year-end' },
  { id: 'exec_related_parties',          category: 'Execution',  weight: 4,  description: 'Related party procedures performed per ISA 550' },
  { id: 'exec_representations',          category: 'Execution',  weight: 4,  description: 'Written representations obtained (ISA 580)' },
  { id: 'exec_subsequent_events',        category: 'Execution',  weight: 4,  description: 'Subsequent events review performed (ISA 560)' },

  // Documentation — 15 points total
  { id: 'doc_working_papers',            category: 'Documentation', weight: 5, description: 'Working papers support conclusions (ISA 230)' },
  { id: 'doc_findings_accumulated',      category: 'Documentation', weight: 5, description: 'Misstatements accumulated and evaluated (ISA 450)' },
  { id: 'doc_differences_resolved',      category: 'Documentation', weight: 5, description: 'Differences between planned and actual work documented' },

  // Completion — 20 points total
  { id: 'comp_partner_review',           category: 'Completion', weight: 8, description: 'Engagement partner review of significant judgements' },
  { id: 'comp_eqcr',                     category: 'Completion', weight: 5, description: 'EQCR performed where required (ISA 220)' },
  { id: 'comp_opinion_appropriate',      category: 'Completion', weight: 4, description: 'Opinion appropriate for findings identified' },
  { id: 'comp_report_complete',          category: 'Completion', weight: 3, description: 'Audit report complete and compliant (ISA 700)' },

  // ISQM 1 — 10 points total
  { id: 'isqm_ethics_confirmed',         category: 'ISQM 1',     weight: 5, description: 'Independence and ethics confirmed for all team members (ISQM 1)' },
  { id: 'isqm_capacity_assessed',        category: 'ISQM 1',     weight: 5, description: 'Engagement acceptance/continuance — capacity and competence assessed' },
];

// ── Helper: get all findings as flat array ────────────────────────────────

export function getAllFindings() {
  return frcThematicFindings.flatMap(t => t.specificFindings.map(f => ({ ...f, theme: t.theme, isaRef: t.isaRef })));
}

export function getFindingById(id) {
  return getAllFindings().find(f => f.id === id) || null;
}

export function getHighFrequencyFindings(year = '2024/25') {
  return frcThematicFindings
    .filter(t => ['very_high', 'high'].includes(t.yearlyFrequency[year]))
    .map(t => ({ theme: t.theme, frequency: t.yearlyFrequency[year], findingCount: t.specificFindings.length, auditEngineResponse: t.auditEngineResponse }));
}
