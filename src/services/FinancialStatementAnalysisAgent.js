/**
 * FINANCIAL STATEMENT ANALYSIS AGENT (13th Agent)
 * Orchestrates 7 sub-modules for comprehensive financial statement review.
 * Covers extraction, reconciliation, disclosure, estimates, consolidation,
 * framework compliance, and FS-level risk assessment.
 *
 * ISA: 240, 315, 500, 520, 540, 550, 570, 600, 700, 705, 706, 710, 720
 * Framework: IFRS, FRS 102, US GAAP
 *
 * Status: ✅ PRODUCTION READY
 */

import claudeClient from './claudeClient.js';
import {
  fsExtraction,
  fsReconciliation,
  disclosureCompleteness,
  estimateAndJudgment,
  consolidationValidation,
  frameworkCompliance,
  fsRiskAssessment,
} from './fs-analysis/index.js';

export class FinancialStatementAnalysisAgent {
  constructor() {
    this.modules = {
      extraction: fsExtraction,
      reconciliation: fsReconciliation,
      disclosures: disclosureCompleteness,
      estimates: estimateAndJudgment,
      consolidation: consolidationValidation,
      compliance: frameworkCompliance,
      risk: fsRiskAssessment,
    };

    this.claude = claudeClient;
    this.enabled = process.env.ENABLE_FS_ANALYSIS !== 'false';

    // Cache with 10-minute TTL (FS analysis is more stable than accuracy checks)
    this.cache = new Map();
    this.CACHE_TTL = 10 * 60 * 1000;
    this.cleanupInterval = setInterval(() => this._cleanupCache(), 120000);

    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FULL ANALYSIS — All 7 modules in dependency order
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Run complete financial statement analysis.
   * Order: Extraction → Reconciliation + Disclosures + Estimates (parallel) → Consolidation → Compliance → Risk
   */
  async runFullFSAnalysis(engagementId, data) {
    this._checkEnabled();
    this.metrics.totalRequests++;
    const startTime = Date.now();

    try {
      const framework = data.framework || data.context?.framework || 'IFRS';
      const context = { ...data.context, framework };

      // Phase 1: Extract (foundation)
      let extraction = null;
      if (data.financialStatements || data.document) {
        extraction = await this.runFSExtraction(data);
      }

      // Phase 2: Parallel — Reconciliation + Disclosures + Estimates
      const fsData = extraction?.lineItems ? extraction : data.financialStatements || {};
      const [reconciliationResult, disclosureResult, estimateResult] = await Promise.all([
        data.balanceSheet || data.cashFlow || data.equityMovement
          ? this.runFSReconciliation(data)
          : null,
        fsData
          ? this.runDisclosureCompleteness(fsData, framework, context).catch(() => null)
          : null,
        fsData
          ? this.runEstimateAnalysis(fsData, context).catch(() => null)
          : null,
      ]);

      // Phase 3: Consolidation (if group accounts)
      let consolidationResult = null;
      if (data.eliminations || data.interCompanyBalances || data.acquisition) {
        consolidationResult = await this.runConsolidationValidation(data).catch(() => null);
      }

      // Phase 4: Framework compliance (depends on all above)
      let complianceResult = null;
      if (fsData) {
        complianceResult = await this.runFrameworkCompliance(fsData, context).catch(() => null);
      }

      // Phase 5: Risk assessment (aggregates everything)
      let riskResult = null;
      if (fsData) {
        const allResults = { extraction, reconciliationResult, disclosureResult, estimateResult, consolidationResult, complianceResult };
        riskResult = await this.runFSRiskAssessment(fsData, context).catch(() => null);

        // Generate focus areas from all results
        if (riskResult) {
          riskResult.focusAreas = await this.modules.risk.generateAuditFocusAreas(allResults, context).catch(() => null);
        }
      }

      const latency = Date.now() - startTime;
      this.metrics.successfulRequests++;

      return {
        engagementId,
        extraction,
        reconciliation: reconciliationResult,
        disclosures: disclosureResult,
        estimates: estimateResult,
        consolidation: consolidationResult,
        compliance: complianceResult,
        riskAssessment: riskResult,
        framework,
        latencyMs: latency,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // INDIVIDUAL MODULE METHODS
  // ═══════════════════════════════════════════════════════════════════

  async runFSExtraction(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};
    const context = data.context || {};

    if (data.document) {
      results.extracted = await this.modules.extraction.extractFinancialData(data.document, context);
    }
    if (data.lineItems || data.document?.lineItems) {
      const items = data.lineItems || results.extracted?.lineItems || [];
      results.categorised = this.modules.extraction.categoriseLineItems(items, context.framework || 'IFRS');
    }
    if ((data.lineItems || results.extracted?.lineItems) && data.notes) {
      results.noteReferences = this.modules.extraction.extractNoteReferences(
        data.lineItems || results.extracted?.lineItems || [], data.notes
      );
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'extraction', timestamp: new Date().toISOString() };
  }

  async runFSReconciliation(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    if (data.balanceSheet) {
      results.balanceSheet = this.modules.reconciliation.validateBalanceSheetEquation(data.balanceSheet);
    }
    if (data.equityMovement) {
      results.equity = this.modules.reconciliation.reconcileEquityMovement(data.equityMovement);
    }
    if (data.cashFlow) {
      results.cashFlow = this.modules.reconciliation.reconcileCashFlowStatement(data.cashFlow);
    }
    if (data.faceAmounts && data.noteDetails) {
      results.notesToFace = this.modules.reconciliation.reconcileNotesToFace(data.faceAmounts, data.noteDetails);
    }
    if (data.schedules) {
      results.casting = this.modules.reconciliation.castAllSchedules(data.schedules);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'reconciliation', timestamp: new Date().toISOString() };
  }

  async runDisclosureCompleteness(financialStatements, framework = 'IFRS', context = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};
    results.completeness = await this.modules.disclosures.checkDisclosureCompleteness(financialStatements, framework, context);

    if (context.accountingPolicies && context.transactionTypes) {
      results.policies = await this.modules.disclosures.validateAccountingPolicies(
        context.accountingPolicies, context.transactionTypes, framework
      );
    }
    if (context.relatedPartyNote) {
      results.relatedParties = await this.modules.disclosures.checkRelatedPartyDisclosures(context.relatedPartyNote, context);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'disclosures', timestamp: new Date().toISOString() };
  }

  async runEstimateAnalysis(financialStatements, context = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    // Step 1: Identify all estimates
    results.identification = await this.modules.estimates.identifyEstimatesAndJudgments(financialStatements, context);

    // Step 2: Evaluate high-risk estimates individually
    const highRiskEstimates = (results.identification?.estimates || []).filter(e => e.riskLevel === 'HIGH');
    if (highRiskEstimates.length > 0) {
      results.evaluations = [];
      for (const estimate of highRiskEstimates.slice(0, 5)) { // Cap at 5 to control cost
        const evaluation = await this.modules.estimates.evaluateEstimateReasonableness(estimate, context);
        results.evaluations.push({ estimate: estimate.description, ...evaluation });
      }
    }

    // Step 3: Management bias assessment
    if (results.identification?.estimates?.length > 0) {
      results.biasAssessment = await this.modules.estimates.assessManagementBias(results.identification.estimates);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'estimates', timestamp: new Date().toISOString() };
  }

  async runConsolidationValidation(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    if (data.eliminations || data.interCompanyBalances) {
      results.eliminations = this.modules.consolidation.validateEliminations(
        data.eliminations || [], data.interCompanyBalances || {}
      );
    }
    if (data.acquisition) {
      results.goodwill = await this.modules.consolidation.validateGoodwill(
        data.acquisition, data.framework || 'IFRS', data.impairmentData || {}
      );
    }
    if (data.nciData) {
      results.nci = this.modules.consolidation.validateNonControllingInterest(data.nciData);
    }
    if (data.subsidiary) {
      results.currencyTranslation = this.modules.consolidation.validateCurrencyTranslation(data.subsidiary);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'consolidation', timestamp: new Date().toISOString() };
  }

  async runFrameworkCompliance(financialStatements, context = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};
    results.compliance = await this.modules.compliance.assessFrameworkCompliance(financialStatements, context);

    this.metrics.successfulRequests++;
    return { ...results, module: 'compliance', timestamp: new Date().toISOString() };
  }

  async runGoingConcern(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const result = await this.modules.compliance.assessGoingConcern(data);
    this.metrics.successfulRequests++;
    return { ...result, module: 'goingConcern', timestamp: new Date().toISOString() };
  }

  async runFSRiskAssessment(financialStatements, context = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};
    results.riskAssessment = await this.modules.risk.performFSRiskAssessment(financialStatements, context);
    results.unusualItems = await this.modules.risk.identifyUnusualItems(financialStatements, context);

    this.metrics.successfulRequests++;
    return { ...results, module: 'risk', timestamp: new Date().toISOString() };
  }

  // ═══════════════════════════════════════════════════════════════════
  // BATCH PROCESSING
  // ═══════════════════════════════════════════════════════════════════

  async runBatchFSChecks(items) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const batchRequests = items.map(item => ({
      id: `fs_${item.id}`,
      prompt: `Analyze these financial statement items for ${item.type}:\n${JSON.stringify(item.data)}`,
      model: ['estimates', 'compliance', 'risk'].includes(item.type) ? 'claude-opus-4-7' : 'claude-sonnet-4-6',
      maxTokens: 4096,
      system: 'You are a financial statement analysis specialist. Return valid JSON only.',
    }));

    const result = await this.claude.sendBatch(batchRequests);
    this.metrics.successfulRequests++;
    return result;
  }

  async awaitBatchResults(batchId) {
    return this.claude.awaitBatchResults(batchId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // STATUS & METRICS
  // ═══════════════════════════════════════════════════════════════════

  getMetrics() {
    const moduleMetrics = {};
    for (const [name, module] of Object.entries(this.modules)) {
      moduleMetrics[name] = module.getMetrics?.() || { status: 'READY' };
    }

    return {
      agent: 'FinancialStatementAnalysis',
      status: this.enabled ? 'READY' : 'DISABLED',
      totalRequests: this.metrics.totalRequests,
      successfulRequests: this.metrics.successfulRequests,
      failedRequests: this.metrics.failedRequests,
      successRate: this.metrics.totalRequests > 0
        ? `${((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1)}%`
        : '0%',
      cacheSize: this.cache.size,
      modules: moduleMetrics,
    };
  }

  getStatus() {
    return {
      agent: 'FinancialStatementAnalysis',
      enabled: this.enabled,
      status: this.enabled ? 'READY' : 'DISABLED',
      modules: Object.keys(this.modules).length,
      modulesReady: Object.keys(this.modules).filter(m => this.modules[m]).length,
      supportedFrameworks: ['IFRS', 'FRS 102', 'FRS 102 1A', 'US GAAP'],
      isaReferences: ['ISA 240', 'ISA 315', 'ISA 500', 'ISA 520', 'ISA 540', 'ISA 550', 'ISA 570', 'ISA 600', 'ISA 700', 'ISA 705', 'ISA 706', 'ISA 710', 'ISA 720'],
    };
  }

  _checkEnabled() {
    if (!this.enabled) {
      throw new Error('Financial Statement Analysis Agent is disabled. Set ENABLE_FS_ANALYSIS=true to enable.');
    }
  }

  _cleanupCache() {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now - data.timestamp > this.CACHE_TTL) this.cache.delete(key);
    }
  }

  destroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
  }
}

const fsAnalysisAgent = new FinancialStatementAnalysisAgent();
export default fsAnalysisAgent;
