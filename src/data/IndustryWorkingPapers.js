/**
 * IndustryWorkingPapers — adapter layer exposing industry data
 * from the master industries.js in the shape expected by tests and WP generator.
 */
import { I } from './index.js';

export const INDUSTRY_KEYS = Object.keys(I);
export const INDUSTRY_COUNT = INDUSTRY_KEYS.length;

/** Get full industry object by key, normalised for WP consumption */
export function getIndustry(key) {
  if (!key || !I[key]) return null;
  const ind = I[key];
  return {
    key,
    label: ind.l,
    icon: ind.ic,
    color: ind.ac,
    sectors: ind.s || [],
    risks: ind.r || [],
    procs: ind.p || [],
    kpis: ind.k || [],
    disc: ind.d || [],
    controls: ind.ct || [],
    gc: ind.gc || [],
    legislation: ind.lw || [],
    fsliMap: ind.f || {},
    // WP-specific fields expected by tests
    acceptance: (ind.r || []).filter(r => r.lv === 'SIGNIFICANT' || r.lv === 'ELEVATED').map(r => r.t),
    understanding: ind.s ? ind.s.slice(0, 5).map(s => `Understanding ${s} sector`) : [],
    fraud: (ind.r || []).filter(r => r.isa && r.isa.includes('240')).map(r => r.t).concat([
      'Management override of controls',
      'Revenue manipulation risk',
      'Fraudulent financial reporting',
    ]),
    sigRisks: [
      // ISA 240.31-33 irrebuttable significant risk (required for ALL industries)
      { id: 'ISA240', risk: 'Management override of controls', resp: 'Test journal entries, review estimates, evaluate business rationale of unusual transactions', isa: 'ISA 240.31-33' },
      // ISA 240.26 presumed revenue recognition risk (all except rebutted industries)
      ...(!['financial_services', 'professional_services', 'charities'].includes(key)
        ? [{ id: 'ISA240R', risk: 'Revenue recognition — presumed significant risk', resp: 'Extended substantive testing of revenue transactions and cut-off', isa: 'ISA 240.26' }]
        : []),
      // Industry-specific significant risks
      ...(ind.r || []).filter(r => r.lv === 'SIGNIFICANT').map(r => ({ id: r.id, risk: r.t, resp: r.rs, isa: r.isa })),
    ],
    leads: ind.f || {},
    ml: [
      { label: 'Materiality benchmark', value: key === 'financial_services' ? 'Total Assets' : key === 'charities' ? 'Total Income' : 'Revenue', isa: 'ISA 320' },
      { label: 'Risk multiplier', value: 'medium', isa: 'ISA 320.A13' },
      { label: 'PM factor', value: '0.75', isa: 'ISA 320.A14' },
    ],
  };
}

/** Get industry risks structured for risk assessment */
export function getIndustryRisks(key) {
  const ind = getIndustry(key);
  if (!ind) return null;
  return {
    significantRisks: ind.sigRisks,
    risks: ind.risks,
    fraudRisks: ind.fraud,
  };
}

/** Get industry procedures */
export function getIndustryProcedures(key) {
  const ind = getIndustry(key);
  if (!ind) return null;
  return ind.procs;
}

/** Get industry materiality benchmarks for WP generator (returns {b, p, r, alts}) */
export function getIndustryMateriality(key) {
  if (!key || !I[key]) return null;
  const benchmark = key === 'financial_services' ? 'Total Assets' : key === 'charities' ? 'Total Income' : 'Revenue';
  return {
    b: benchmark,
    p: '1-2%',
    r: `${benchmark} selected as primary benchmark per ISA 320.A3-A7.`,
    alts: [
      { benchmark: 'Profit Before Tax', percentage: '5-10%', isa: 'ISA 320.A4' },
      { benchmark: 'Total Assets', percentage: '1-2%', isa: 'ISA 320.A5' },
      { benchmark: 'Equity', percentage: '2-5%', isa: 'ISA 320.A6' },
    ],
  };
}

/** Get industry labels for dropdown display */
export function getIndustryLabels() {
  return INDUSTRY_KEYS.map(k => ({
    key: k,
    label: I[k].l,
    icon: I[k].ic,
    color: I[k].ac,
  }));
}

// Industry-specific working paper templates — priority, scope, hours, and risk linkage per industry
// Bridges WPS (universal working papers) with I (industry data) for resource planning (ISA 300)
export const IWP = {
  construction: {
    label: "Construction & Infrastructure", icon: "🏗️",
    wps: [
      { ref: "D1", area: "Revenue", scope: "Stage-of-completion on contracts > PM; variation orders; retention income recognition", assertions: ["Accuracy", "Cut-off", "Occurrence"], standards: "ISA 540; FRS 102 s23", priority: "critical", estimatedHours: "8-12", keyRisks: ["R01", "R12"] },
      { ref: "D3", area: "Inventory / WIP", scope: "Cost-to-complete estimates; overhead absorption; contract profitability analysis", assertions: ["Valuation", "Existence"], standards: "ISA 540; FRS 102 s13", priority: "critical", estimatedHours: "8-12", keyRisks: ["R02"] },
      { ref: "D2", area: "Receivables", scope: "Retention balances; amounts due on contracts; debtor recoverability on long-term projects", assertions: ["Existence", "Valuation", "Rights"], standards: "ISA 505; FRS 102 s11", priority: "high", estimatedHours: "4-6", keyRisks: ["R03", "R11"] },
      { ref: "D4", area: "Payables", scope: "Subcontractor accruals; CIS deductions; contra arrangements; retention payable", assertions: ["Completeness", "Accuracy"], standards: "ISA 330; ITEPA 2003", priority: "high", estimatedHours: "4-6", keyRisks: ["R04", "R10"] },
      { ref: "D12", area: "Provisions", scope: "H&S claims; liquidated damages; defects liability; performance bond obligations", assertions: ["Completeness", "Valuation"], standards: "ISA 540; FRS 102 s21", priority: "high", estimatedHours: "4-8", keyRisks: ["R05", "R06", "R13"] },
      { ref: "D7", area: "Fixed Assets", scope: "Plant register accuracy; capitalisation boundary for plant & equipment; disposal testing", assertions: ["Existence", "Valuation"], standards: "ISA 540; FRS 102 s17", priority: "standard", estimatedHours: "3-5", keyRisks: ["R07", "R09"] },
      { ref: "D13", area: "Taxation", scope: "CIS deductions reconciliation; CT computation; capital allowances on plant", assertions: ["Accuracy"], standards: "ISA 540; ITEPA 2003", priority: "standard", estimatedHours: "2-4", keyRisks: ["R10"] },
      { ref: "D15", area: "Related Parties", scope: "Connected contracts; director interests in subcontractors; group recharges", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "2-3", keyRisks: [] }
    ]
  },
  manufacturing: {
    label: "Manufacturing", icon: "🏭",
    wps: [
      { ref: "D3", area: "Inventory / WIP", scope: "Stock count attendance; cost build-up; overhead absorption; NRV testing; obsolescence provisions", assertions: ["Existence", "Valuation"], standards: "ISA 501; FRS 102 s13", priority: "critical", estimatedHours: "10-16", keyRisks: ["R01", "R02"] },
      { ref: "D1", area: "Revenue", scope: "Cut-off on despatch ±10 days; bill-and-hold; consignment arrangements", assertions: ["Cut-off", "Occurrence"], standards: "ISA 240.26; FRS 102 s23", priority: "critical", estimatedHours: "6-10", keyRisks: ["R03"] },
      { ref: "D7", area: "Fixed Assets", scope: "Additions > PM; capitalisation boundary; useful life assessment; depreciation recalculation", assertions: ["Existence", "Valuation"], standards: "ISA 540; FRS 102 s17", priority: "high", estimatedHours: "4-8", keyRisks: ["R04"] },
      { ref: "D12", area: "Provisions", scope: "Environmental/decommissioning; warranty cost estimation; restructuring provisions", assertions: ["Completeness", "Valuation"], standards: "ISA 540; FRS 102 s21", priority: "high", estimatedHours: "4-6", keyRisks: ["R05", "R09"] },
      { ref: "D13", area: "Taxation", scope: "Capital allowances; R&D tax relief eligibility; transfer pricing documentation", assertions: ["Accuracy", "Existence"], standards: "ISA 540; CTA 2009", priority: "high", estimatedHours: "3-5", keyRisks: ["R06", "R11"] },
      { ref: "D15", area: "Related Parties", scope: "Intercompany pricing; group recharges; arm's length basis verification", assertions: ["Accuracy", "Completeness"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "2-4", keyRisks: ["R06", "R10"] },
      { ref: "D5", area: "Payroll", scope: "Payroll cost allocation across production lines; headcount reconciliation", assertions: ["Accuracy", "Completeness"], standards: "ISA 330", priority: "standard", estimatedHours: "2-3", keyRisks: ["R12"] },
      { ref: "D8", area: "Intangibles & Goodwill", scope: "R&D expenditure boundary — capital vs revenue; development cost amortisation", assertions: ["Valuation", "Classification"], standards: "FRS 102 s18/19", priority: "standard", estimatedHours: "2-4", keyRisks: ["R11"] }
    ]
  },
  technology: {
    label: "Technology & SaaS", icon: "💻",
    wps: [
      { ref: "D1", area: "Revenue", scope: "Multi-element arrangements (IFRS 15); SSP allocation; deferred revenue roll-forward; contract modifications", assertions: ["Accuracy", "Classification", "Cut-off"], standards: "IFRS 15; FRS 102 s23", priority: "critical", estimatedHours: "10-14", keyRisks: ["R01", "R03", "R11"] },
      { ref: "D7", area: "Fixed Assets / Intangibles", scope: "Development cost capitalisation (6 criteria per FRS 102 s18.8H); useful life; impairment indicators", assertions: ["Existence", "Valuation"], standards: "ISA 540; FRS 102 s18", priority: "critical", estimatedHours: "6-10", keyRisks: ["R02", "R06", "R08"] },
      { ref: "D10", area: "Share Capital & Reserves", scope: "Share-based payment expense recalculation; vesting conditions; option reserve movements", assertions: ["Accuracy", "Completeness"], standards: "FRS 102 s26; IFRS 2", priority: "high", estimatedHours: "4-8", keyRisks: ["R04"] },
      { ref: "D13", area: "Taxation", scope: "R&D tax credit methodology; qualifying expenditure; RDEC vs SME scheme", assertions: ["Accuracy", "Existence"], standards: "ISA 540; CTA 2009", priority: "high", estimatedHours: "4-6", keyRisks: ["R05"] },
      { ref: "D4", area: "Payables", scope: "Deferred revenue completeness; contract liabilities; accruals for annual contracts", assertions: ["Completeness", "Cut-off"], standards: "ISA 330; FRS 102 s23", priority: "high", estimatedHours: "3-5", keyRisks: ["R03", "R11"] },
      { ref: "D15", area: "Related Parties", scope: "Founder/director transactions; connected-party licensing; investor-related arrangements", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "2-4", keyRisks: [] },
      { ref: "D14", area: "Leases", scope: "Office and data-centre lease accounting; ROU asset and liability calculation", assertions: ["Accuracy", "Completeness"], standards: "IFRS 16; FRS 102 s20", priority: "standard", estimatedHours: "2-4", keyRisks: [] },
      { ref: "D5", area: "Payroll", scope: "Contractor vs employee classification (IR35); payroll cost allocation to dev projects", assertions: ["Classification", "Completeness"], standards: "ISA 250; ITEPA 2003", priority: "standard", estimatedHours: "2-3", keyRisks: ["R09"] }
    ]
  },
  financial_services: {
    label: "Financial Services", icon: "🏦",
    wps: [
      { ref: "D9", area: "Investments", scope: "Independent price verification; fair value hierarchy (Level 1-3); model validation for illiquid instruments", assertions: ["Valuation", "Existence"], standards: "ISA 540; IFRS 13; IFRS 9", priority: "critical", estimatedHours: "12-20", keyRisks: ["R01"] },
      { ref: "D11", area: "Loans & Borrowings", scope: "ECL model inputs; staging criteria (Stage 1/2/3); PD/LGD/EAD; back-testing; SICR assessment", assertions: ["Valuation", "Completeness"], standards: "ISA 540; IFRS 9", priority: "critical", estimatedHours: "10-16", keyRisks: ["R02"] },
      { ref: "D6", area: "Cash & Bank", scope: "Client money segregation (CASS 7); reconciliation procedures; trust status verification", assertions: ["Existence", "Rights"], standards: "ISA 505; CASS 7", priority: "critical", estimatedHours: "6-10", keyRisks: ["R05"] },
      { ref: "D1", area: "Revenue", scope: "Fee income recalculation against AUM/tariff; interest income on EIR basis; trading gains/losses", assertions: ["Accuracy", "Occurrence"], standards: "ISA 330; IFRS 15; IFRS 9", priority: "high", estimatedHours: "6-10", keyRisks: ["R03", "R11"] },
      { ref: "D12", area: "Provisions", scope: "ECL provisions; insurance claims (IBNR); conduct/redress liabilities; regulatory fines", assertions: ["Completeness", "Valuation"], standards: "ISA 540; IFRS 9; FRS 102 s21", priority: "high", estimatedHours: "6-8", keyRisks: ["R02", "R07", "R10"] },
      { ref: "D13", area: "Taxation", scope: "Bank levy; deferred tax on fair value movements; withholding tax on cross-border income", assertions: ["Accuracy"], standards: "ISA 540; CTA 2009", priority: "standard", estimatedHours: "3-5", keyRisks: [] },
      { ref: "D15", area: "Related Parties", scope: "Connected lending; personal account dealing; group transactions; FCA SYSC compliance", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; FCA SYSC", priority: "standard", estimatedHours: "3-5", keyRisks: [] },
      { ref: "B2", area: "Controls Assessment", scope: "IT general controls; trade settlement controls; AML/KYC screening; regulatory reporting controls", assertions: ["Operating effectiveness"], standards: "ISA 315.14; ISA 402", priority: "high", estimatedHours: "6-10", keyRisks: ["R06", "R08", "R09"] }
    ]
  },
  retail: {
    label: "Retail & Consumer", icon: "🛒",
    wps: [
      { ref: "D3", area: "Inventory / WIP", scope: "Stock count attendance; shrinkage provision; markdown provisions; goods-in-transit cut-off; NRV testing", assertions: ["Existence", "Valuation"], standards: "ISA 501; FRS 102 s13", priority: "critical", estimatedHours: "8-14", keyRisks: ["R01", "R10"] },
      { ref: "D1", area: "Revenue", scope: "Loyalty programme deferrals; gift card breakage income; returns provisions; concession vs principal", assertions: ["Accuracy", "Cut-off", "Classification"], standards: "IFRS 15; FRS 102 s23", priority: "critical", estimatedHours: "6-10", keyRisks: ["R02", "R06", "R08", "R11", "R12"] },
      { ref: "D14", area: "Leases", scope: "ROU asset and lease liability for store portfolio; rent-free periods; landlord incentive spreading; modifications", assertions: ["Accuracy", "Completeness"], standards: "IFRS 16; FRS 102 s20", priority: "high", estimatedHours: "6-10", keyRisks: ["R03", "R09"] },
      { ref: "D7", area: "Fixed Assets", scope: "Store fit-out additions; CGU-level impairment for underperforming stores; useful life assessment", assertions: ["Existence", "Valuation"], standards: "ISA 540; FRS 102 s27", priority: "high", estimatedHours: "4-6", keyRisks: ["R04"] },
      { ref: "D4", area: "Payables", scope: "Gift card liability; loyalty liability; returns provision; supplier rebates and accruals", assertions: ["Completeness", "Valuation"], standards: "ISA 330; IFRS 15", priority: "high", estimatedHours: "4-6", keyRisks: ["R02", "R11", "R12"] },
      { ref: "D13", area: "Taxation", scope: "VAT partial exemption calculation; mixed supplies treatment; capital allowances on fit-out", assertions: ["Accuracy"], standards: "ISA 540; VATA 1994", priority: "standard", estimatedHours: "2-4", keyRisks: ["R05"] },
      { ref: "D15", area: "Related Parties", scope: "Franchise/concession arrangements; group recharges; director-connected suppliers", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "2-3", keyRisks: ["R07"] },
      { ref: "D6", area: "Cash & Bank", scope: "Store float reconciliations; EPOS-to-bank reconciliation; cash handling controls", assertions: ["Existence", "Completeness"], standards: "ISA 505", priority: "standard", estimatedHours: "2-4", keyRisks: [] }
    ]
  },
  professional_services: {
    label: "Professional Services", icon: "⚖️",
    wps: [
      { ref: "D3", area: "WIP / Unbilled", scope: "Aged WIP recoverability; lock-up analysis; unbilled disbursements; write-off rates by partner/department", assertions: ["Valuation", "Existence"], standards: "ISA 540; FRS 102 s23", priority: "critical", estimatedHours: "6-10", keyRisks: ["R01", "R09"] },
      { ref: "D1", area: "Revenue", scope: "Time records to fee notes; fixed-fee revenue recognition; contingent fee arrangements; stage of completion", assertions: ["Occurrence", "Accuracy", "Cut-off"], standards: "ISA 330; FRS 102 s23", priority: "critical", estimatedHours: "6-10", keyRisks: ["R02", "R10"] },
      { ref: "D6", area: "Cash & Bank", scope: "Client account reconciliation; segregation verification; SRA/regulatory compliance on client money", assertions: ["Existence", "Rights"], standards: "ISA 505; SRA Rules", priority: "critical", estimatedHours: "4-8", keyRisks: ["R05"] },
      { ref: "D12", area: "Provisions", scope: "PI claims register review; dilapidations; TUPE provisions; holiday pay accrual", assertions: ["Completeness", "Valuation"], standards: "ISA 540; FRS 102 s21", priority: "high", estimatedHours: "4-6", keyRisks: ["R04", "R08", "R11", "R12"] },
      { ref: "D7", area: "Fixed Assets", scope: "Goodwill on lateral hires; impairment testing; leasehold improvements", assertions: ["Valuation"], standards: "ISA 540; FRS 102 s19", priority: "standard", estimatedHours: "2-4", keyRisks: ["R07"] },
      { ref: "D10", area: "Share Capital & Reserves", scope: "Partner capital movements; current account balances; drawings reconciliation", assertions: ["Completeness", "Accuracy"], standards: "ISA 550", priority: "high", estimatedHours: "3-5", keyRisks: ["R03", "R06"] },
      { ref: "D13", area: "Taxation", scope: "LLP/partnership tax allocations; individual member taxation; corporation tax for Ltd entities", assertions: ["Accuracy"], standards: "ISA 540; ITTOIA 2005", priority: "standard", estimatedHours: "2-4", keyRisks: [] },
      { ref: "D15", area: "Related Parties", scope: "Partner transactions; connected-party services; key management compensation disclosures", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "2-3", keyRisks: [] }
    ]
  },
  property: {
    label: "Property & Real Estate", icon: "🏢",
    wps: [
      { ref: "D7", area: "Fixed Assets / Investment Property", scope: "Valuer competence (ISA 620); yield/ERV challenge; Land Registry ownership; fair value vs cost model", assertions: ["Valuation", "Existence", "Rights"], standards: "ISA 540; ISA 620; FRS 102 s16", priority: "critical", estimatedHours: "10-16", keyRisks: ["R01", "R03"] },
      { ref: "D1", area: "Revenue", scope: "Development profit recognition; rental income cut-off; service charge income; management fees", assertions: ["Accuracy", "Cut-off", "Occurrence"], standards: "ISA 540; FRS 102 s23", priority: "critical", estimatedHours: "6-10", keyRisks: ["R02", "R11"] },
      { ref: "D14", area: "Leases", scope: "Lease incentive spreading; tenant inducements; rent-free period amortisation; ground rent reform impact", assertions: ["Accuracy", "Completeness"], standards: "FRS 102 s20", priority: "high", estimatedHours: "4-8", keyRisks: ["R06", "R10"] },
      { ref: "D12", area: "Provisions", scope: "S106/CIL obligations; dilapidations; building safety remediation; void cost provisions", assertions: ["Completeness", "Valuation"], standards: "ISA 540; FRS 102 s21", priority: "high", estimatedHours: "4-6", keyRisks: ["R05", "R07"] },
      { ref: "D11", area: "Loans & Borrowings", scope: "Development finance; investment loans; mezzanine debt; LTV covenant monitoring", assertions: ["Completeness", "Valuation"], standards: "FRS 102 s11", priority: "high", estimatedHours: "4-6", keyRisks: [] },
      { ref: "D13", area: "Taxation", scope: "SDLT on acquisitions; capital allowances; MDR and relief claims; deferred tax on revaluation", assertions: ["Accuracy", "Completeness"], standards: "ISA 540; FA 2003", priority: "standard", estimatedHours: "3-5", keyRisks: ["R08"] },
      { ref: "D15", area: "Related Parties", scope: "Property transactions with connected parties; JV accounting; equity method application", assertions: ["Completeness", "Valuation", "Disclosure"], standards: "ISA 550; FRS 102 s33", priority: "standard", estimatedHours: "3-5", keyRisks: ["R09", "R12"] },
      { ref: "D3", area: "Inventory / WIP", scope: "Development WIP; land bank valuation; cost allocation between land and build", assertions: ["Valuation", "Existence"], standards: "ISA 540; FRS 102 s13", priority: "high", estimatedHours: "4-8", keyRisks: ["R02", "R12"] }
    ]
  },
  charities: {
    label: "Charities & Not-for-Profit", icon: "🤝",
    wps: [
      { ref: "D1", area: "Income", scope: "Legacy recognition (entitlement, probability, measurement); donation income; grant conditions; Gift Aid reclaims", assertions: ["Occurrence", "Cut-off", "Completeness"], standards: "Charities SORP; ISA 330", priority: "critical", estimatedHours: "6-10", keyRisks: ["R01", "R08", "R10"] },
      { ref: "D10", area: "Fund Accounting", scope: "Restricted vs unrestricted designation; inter-fund transfers; endowment compliance; expenditure against restrictions", assertions: ["Classification", "Accuracy"], standards: "Charities SORP; ISA 330", priority: "critical", estimatedHours: "6-10", keyRisks: ["R02", "R11"] },
      { ref: "D15", area: "Governance / Related Parties", scope: "Trustee declarations of interest; trustee expense claims; connected-party transactions; trading subsidiary", assertions: ["Completeness", "Disclosure"], standards: "ISA 550; Charities Act 2011", priority: "high", estimatedHours: "4-6", keyRisks: ["R03", "R12"] },
      { ref: "D12", area: "Provisions / Grants Payable", scope: "Grant repayment conditions; safeguarding liabilities; redundancy provisions; onerous commitments", assertions: ["Completeness", "Valuation"], standards: "Charities SORP; FRS 102 s21", priority: "high", estimatedHours: "3-5", keyRisks: ["R06"] },
      { ref: "D1", area: "Expenditure", scope: "Allocation methodology across charitable activities; support cost apportionment; governance costs", assertions: ["Classification", "Accuracy"], standards: "Charities SORP; ISA 330", priority: "high", estimatedHours: "4-6", keyRisks: ["R05"] },
      { ref: "D13", area: "Taxation", scope: "Charity exemption verification; trading subsidiary CT and Gift Aid payment; irrecoverable VAT", assertions: ["Accuracy", "Existence"], standards: "CTA 2010 s478; ISA 540", priority: "standard", estimatedHours: "2-4", keyRisks: ["R12"] },
      { ref: "A7", area: "Going Concern", scope: "Funding pipeline assessment; reserves policy compliance; key funder dependency; regulatory compliance risk", assertions: ["Going concern"], standards: "ISA 570; Charities SORP", priority: "high", estimatedHours: "3-5", keyRisks: ["R04"] },
      { ref: "D7", area: "Fixed Assets", scope: "Heritage assets; freehold property valuation; donated assets recognition and measurement", assertions: ["Valuation", "Existence"], standards: "Charities SORP; FRS 102 s17", priority: "standard", estimatedHours: "2-4", keyRisks: ["R09"] }
    ]
  }
};

export default I;
