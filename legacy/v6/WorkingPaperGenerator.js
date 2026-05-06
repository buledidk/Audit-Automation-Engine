// ═══════════════════════════════════════════════════════════════════════════
// AuditEngine — Unified Working Paper Generator Service
// Consolidates v6 SPA working paper generation into v10 AURA platform
// Generates ISA (UK)-compliant working papers for 8 industries
// ═══════════════════════════════════════════════════════════════════════════

import IndustryData, {
  getIndustry,
  getIndustryRisks,
  getIndustryProcedures,
  getIndustryMateriality,
  getIndustryLabels,
  INDUSTRY_KEYS,
} from '../data/IndustryWorkingPapers.js';

import {
  FRAMEWORKS,
  ENTITY_SIZES,
  AUDIT_PHASES,
  WORKING_PAPERS,
  getWorkingPapersByPhase,
  getSignificantRiskPapers,
  getDefaultFramework,
} from '../data/AuditFrameworks.js';

/**
 * WorkingPaperGenerator — Generates complete audit working papers
 * for any combination of industry, framework, and entity size.
 *
 * Usage:
 *   const generator = new WorkingPaperGenerator({
 *     industry: 'construction',
 *     framework: 'frs102',
 *     entitySize: 'medium',
 *     engagement: { name: 'ABC Ltd', fye: '31/12/2025', partner: 'J Smith' }
 *   });
 *   const papers = generator.generateAll();
 */
export default class WorkingPaperGenerator {
  constructor({ industry, framework, entitySize, engagement }) {
    this.industryKey = industry;
    this.industry = getIndustry(industry);
    this.framework = FRAMEWORKS[framework] || getDefaultFramework(entitySize);
    this.frameworkKey = framework;
    this.entitySize = ENTITY_SIZES[entitySize];
    this.entitySizeKey = entitySize;
    this.engagement = engagement || {};

    if (!this.industry) {
      throw new Error(`Unknown industry: ${industry}. Valid keys: ${INDUSTRY_KEYS.join(', ')}`);
    }
  }

  /**
   * Generate all working papers for the configured engagement.
   * Returns a map of WP ID -> generated content.
   */
  generateAll() {
    const results = {};
    for (const wp of WORKING_PAPERS) {
      results[wp.id] = this.generate(wp.id);
    }
    return results;
  }

  /**
   * Generate a single working paper by ID.
   */
  generate(wpId) {
    const wp = WORKING_PAPERS.find(w => w.id === wpId);
    if (!wp) return null;

    const base = {
      ref: wp.ref,
      title: wp.title,
      phase: AUDIT_PHASES[wp.phase],
      industry: this.industry.label,
      framework: this.framework?.label || this.frameworkKey,
      engagement: this.engagement,
      generatedAt: new Date().toISOString(),
    };

    switch (wpId) {
      case 'a1': return { ...base, ...this._generateAcceptance() };
      case 'a3': return { ...base, ...this._generateUnderstanding() };
      case 'a5': return { ...base, ...this._generateMateriality() };
      case 'a6': return { ...base, ...this._generateFraud() };
      case 'a7': return { ...base, ...this._generateSignificantRisks() };
      case 'a8': return { ...base, ...this._generateStrategy() };
      case 'b1': return { ...base, ...this._generateRiskSummary() };
      case 'c1': return { ...base, ...this._generateLeadSchedule('rev') };
      case 'c2': return { ...base, ...this._generateLeadSchedule('rec') };
      case 'c3': return { ...base, ...this._generateLeadSchedule('cash') };
      case 'c4': return { ...base, ...this._generateLeadSchedule('pay') };
      case 'd1': return { ...base, ...this._generateTesting('revenue') };
      case 'd3': return { ...base, ...this._generateTesting('inventory') };
      case 'd6': return { ...base, ...this._generateJournalTesting() };
      case 'e3': return { ...base, ...this._generateGoingConcern() };
      case 'e6': return { ...base, ...this._generateDisclosures() };
      case 'f1': return { ...base, ...this._generateManagementLetter() };
      case 'f2': return { ...base, ...this._generateAuditReport() };
      default:   return base;
    }
  }

  // ─── A1: Acceptance & Ethics ────────────────────────────────────────
  _generateAcceptance() {
    return {
      acceptanceCriteria: this.industry.acceptance || [],
      isaReferences: ['ISA 210.6', 'ISA 210.10', 'ISA 220.12', 'ISQM 1.32', 'FRC Ethical Standard 2024'],
    };
  }

  // ─── A3: Entity Understanding ───────────────────────────────────────
  _generateUnderstanding() {
    return {
      understanding: this.industry.understanding || [],
      sectors: this.industry.sectors || [],
      isaReferences: ['ISA 315.12-14', 'ISA 315.19-26'],
    };
  }

  // ─── A5: Materiality ───────────────────────────────────────────────
  _generateMateriality() {
    const mat = getIndustryMateriality(this.industryKey);
    return {
      benchmark: mat?.b || 'Revenue',
      percentage: mat?.p || '1-2%',
      rationale: mat?.r || '',
      alternatives: mat?.alts || [],
      isaReferences: ['ISA 320.10', 'ISA 320.A3-A7', 'ISA 450.A1'],
    };
  }

  // ─── A6: Fraud Assessment ──────────────────────────────────────────
  _generateFraud() {
    return {
      fraudRisks: this.industry.fraud || [],
      isaReferences: ['ISA 240.25-27', 'ISA 240.31-33', 'ISA 240.A25-A30'],
      note: 'Revenue recognition presumed significant risk per ISA 240.26 — NOT rebutted.',
    };
  }

  // ─── A7: Significant Risks ────────────────────────────────────────
  _generateSignificantRisks() {
    const risks = getIndustryRisks(this.industryKey);
    return {
      significantRisks: risks?.significantRisks || [],
      isaReferences: ['ISA 315.28', 'ISA 330.15', 'ISA 330.18'],
    };
  }

  // ─── A8: Strategy ─────────────────────────────────────────────────
  _generateStrategy() {
    const risks = getIndustryRisks(this.industryKey);
    const procs = getIndustryProcedures(this.industryKey);
    return {
      risks: risks?.risks || [],
      procedures: procs?.procedures || [],
      kpis: this.industry.kpis || [],
      isaReferences: ['ISA 300.7-12', 'ISA 330.5-6'],
    };
  }

  // ─── B1: Risk Summary ─────────────────────────────────────────────
  _generateRiskSummary() {
    const risks = getIndustryRisks(this.industryKey);
    return {
      significantRisks: risks?.significantRisks || [],
      detailedRisks: risks?.risks || [],
      fraudRisks: risks?.fraudRisks || [],
      isaReferences: ['ISA 315.25-28', 'ISA 330.5-6', 'ISA 330.18'],
    };
  }

  // ─── C1-C4: Lead Schedules ────────────────────────────────────────
  _generateLeadSchedule(type) {
    const leads = this.industry.leads || {};
    return {
      lineItems: leads[type] || [],
      isaReferences: ['ISA 330.6', 'ISA 505.7'],
    };
  }

  // ─── D1/D3: Testing Programmes ────────────────────────────────────
  _generateTesting(area) {
    const procs = getIndustryProcedures(this.industryKey);
    const tests = procs?.tests || {};
    const testData = tests[area] || null;
    return {
      testingProgramme: testData,
      isaReferences: testData?.isa ? [testData.isa] : ['ISA 330.18'],
    };
  }

  // ─── D6: Journal & Override Testing ───────────────────────────────
  _generateJournalTesting() {
    return {
      isaRequirements: [
        'ISA 240.32(a): Test appropriateness of journal entries and other adjustments',
        'ISA 240.32(b): Review accounting estimates for bias',
        'ISA 240.32(c): Evaluate business rationale for unusual transactions',
        'ISA 240.A59: Unpredictable audit procedures',
      ],
      riskCriteria: [
        'Manual journals to revenue, WIP, or provisions near period end',
        'Journals posted outside normal working hours',
        'Journals by management (bypassing normal posting controls)',
        'Round amount journals to key estimates',
        'Journals with unusual account combinations',
        'Post-closing journals with significant P&L impact',
      ],
      isaReferences: ['ISA 240.31-33 (irrebuttable)', 'ISA 330.18'],
    };
  }

  // ─── E3: Going Concern ────────────────────────────────────────────
  _generateGoingConcern() {
    return {
      indicators: this.industry.gc || [],
      isaReferences: ['ISA 570.10', 'ISA 570.16-17', 'FRS 102.3.8-3.9'],
    };
  }

  // ─── E6: Disclosures Checklist ────────────────────────────────────
  _generateDisclosures() {
    const disc = this.industry.disc || {};
    return {
      frs102: disc.frs102 || [],
      ifrs: disc.ifrs || [],
      frs102_1a: disc.frs102_1a || [],
      isaReferences: ['ISA 700.13', 'ISA 720.12-15'],
    };
  }

  // ─── F1: Management Letter (ISA 265) ──────────────────────────────
  _generateManagementLetter() {
    return {
      managementLetterPoints: this.industry.ml || [],
      isaReferences: ['ISA 265.9-11', 'ISA 265.A1-A7'],
    };
  }

  // ─── F2: Audit Report (ISA 700) ───────────────────────────────────
  _generateAuditReport() {
    return {
      framework: this.framework?.label || 'FRS 102',
      reportType: 'ISA 700 — Unmodified Opinion',
      sections: [
        'Opinion (ISA 700.21-23)',
        'Basis for Opinion (ISA 700.25-28)',
        'Going Concern (ISA 570.22)',
        'Other Information (ISA 720.22)',
        'Responsibilities of Directors (ISA 700.33-36)',
        'Auditor Responsibilities (ISA 700.37-40)',
        'Companies Act 2006 Opinions and Matters (s.495-496)',
      ],
      isaReferences: ['ISA 700.10-49', 'ISA 705', 'ISA 706', 'ISA 720'],
    };
  }
}

// ─── Convenience exports ────────────────────────────────────────────

export {
  IndustryData,
  getIndustry,
  getIndustryRisks,
  getIndustryProcedures,
  getIndustryMateriality,
  getIndustryLabels,
  INDUSTRY_KEYS,
  FRAMEWORKS,
  ENTITY_SIZES,
  AUDIT_PHASES,
  WORKING_PAPERS,
  getWorkingPapersByPhase,
  getSignificantRiskPapers,
  getDefaultFramework,
};
