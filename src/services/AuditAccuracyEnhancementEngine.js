/**
 * AUDIT ACCURACY ENHANCEMENT ENGINE (12th Agent)
 * Orchestrates 7 sub-modules for comprehensive accuracy verification.
 * Maps to ISA 330/500/520/530/540.
 *
 * Sub-modules:
 *   Pure computation: MathematicalAccuracy, DataQuality, RealTimeMonitoring
 *   AI-enhanced:      CrossAccountValidation, EstimateAccuracy, Reconciliation, SamplingAccuracy
 *
 * Status: ✅ PRODUCTION READY
 */

import claudeClient from './claudeClient.js';
import {
  mathematicalAccuracy,
  dataQuality,
  crossAccountValidation,
  estimateAccuracy,
  reconciliation,
  samplingAccuracy,
  realTimeMonitoring,
} from './accuracy-enhancements/index.js';

export class AuditAccuracyEnhancementEngine {
  constructor() {
    this.modules = {
      mathematical: mathematicalAccuracy,
      dataQuality,
      crossAccount: crossAccountValidation,
      estimates: estimateAccuracy,
      reconciliation,
      sampling: samplingAccuracy,
      monitoring: realTimeMonitoring,
    };

    this.claude = claudeClient;
    this.enabled = process.env.ENABLE_ACCURACY_ENHANCEMENTS !== 'false';

    // Cache with 5-minute TTL
    this.cache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000;
    this.cleanupInterval = setInterval(() => this._cleanupCache(), 60000);

    // Metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      moduleMetrics: {},
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // HIGH-LEVEL ORCHESTRATION
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Run a full accuracy assessment — all 7 modules in parallel (computational)
   * then sequential (AI-enhanced) for comprehensive coverage.
   */
  async runFullAccuracyAssessment(engagementId, data) {
    this._checkEnabled();
    this.metrics.totalRequests++;
    const startTime = Date.now();

    try {
      // Initialize monitoring if not already active
      if (!this.modules.monitoring.monitors?.has(engagementId)) {
        this.modules.monitoring.initializeMonitor(engagementId);
      }

      // Phase 1: Pure computation (parallel — instant)
      const [mathematical, quality] = await Promise.all([
        data.trialBalance || data.scheduleData || data.lineItems
          ? this.runMathematicalAccuracy(data)
          : null,
        data.transactions || data.dataset
          ? this.runDataQualityAssessment(data)
          : null,
      ]);

      // Phase 2: AI-enhanced (parallel where possible)
      const [crossAccount, estimateResults, reconciliationResults, samplingResults] = await Promise.all([
        data.accounts ? this.runCrossAccountValidation(data) : null,
        data.estimates ? this.runEstimateAccuracy(data.estimates, data.context || {}) : null,
        data.sourceA && data.sourceB ? this.runReconciliation(data.sourceA, data.sourceB, data.matchRules) : null,
        data.sample && data.population ? this.runSamplingAccuracy(data.sample, data.population) : null,
      ]);

      // Record events in monitoring
      const results = { mathematical, quality, crossAccount, estimateResults, reconciliationResults, samplingResults };
      for (const [module, result] of Object.entries(results)) {
        if (result) {
          this.modules.monitoring.recordAccuracyEvent(engagementId, {
            type: 'assessment_complete',
            module,
            score: result.score ?? result.overallScore ?? result.accuracyPercent ?? 100,
          });
        }
      }

      const latency = Date.now() - startTime;
      this.metrics.successfulRequests++;

      return {
        engagementId,
        mathematical,
        dataQuality: quality,
        crossAccount,
        estimates: estimateResults,
        reconciliation: reconciliationResults,
        sampling: samplingResults,
        dashboard: this.modules.monitoring.getMonitoringDashboard(engagementId),
        latencyMs: latency,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  /**
   * Run mathematical accuracy checks (ISA 330).
   */
  async runMathematicalAccuracy(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    if (data.trialBalance) {
      results.trialBalance = this.modules.mathematical.validateTrialBalance(data.trialBalance);
    }
    if (data.scheduleData) {
      results.crossFoot = this.modules.mathematical.crossFootSchedule(data.scheduleData);
    }
    if (data.formulaData) {
      results.formulas = this.modules.mathematical.validateFormulas(data.formulaData);
    }
    if (data.lineItems) {
      results.totals = this.modules.mathematical.recalculateTotals(data.lineItems);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'mathematical', isaReference: 'ISA 330', timestamp: new Date().toISOString() };
  }

  /**
   * Run data quality assessment.
   */
  async runDataQualityAssessment(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};
    const dataset = data.transactions || data.dataset || [];

    if (dataset.length > 0) {
      results.duplicates = this.modules.dataQuality.detectDuplicates(dataset, data.keyFields);
      if (data.expectedSchema) {
        results.completeness = this.modules.dataQuality.assessCompleteness(dataset, data.expectedSchema);
      }
      if (data.rules) {
        results.consistency = this.modules.dataQuality.checkConsistency(dataset, data.rules);
      }
      results.overallScore = this.modules.dataQuality.calculateDataQualityScore(dataset, {
        expectedSchema: data.expectedSchema,
        rules: data.rules,
        keyFields: data.keyFields,
      });
    }

    if (data.values) {
      results.outliers = this.modules.dataQuality.detectOutliers(data.values, data.outlierMethod, data.outlierThreshold);
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'dataQuality', timestamp: new Date().toISOString() };
  }

  /**
   * Run cross-account validation (ISA 520).
   */
  async runCrossAccountValidation(data) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    if (data.accounts) {
      results.relationships = this.modules.crossAccount.validateInterAccountRelationships(data.accounts);
    }
    if (data.current && data.prior) {
      results.ratioConsistency = this.modules.crossAccount.verifyRatioConsistency(
        data.current, data.prior, data.materialityThreshold
      );
    }
    if (data.commonSizeData) {
      results.commonSize = this.modules.crossAccount.performCommonSizeAnalysis(data.commonSizeData, data.basis);
    }
    if (data.balanceSheet) {
      results.balanceSheetEquation = this.modules.crossAccount.validateBalanceSheetEquation(data.balanceSheet);
    }

    // AI interpretation for any detected anomalies
    const allAlerts = [
      ...(results.relationships?.alerts || []),
      ...(results.ratioConsistency?.deviations || []),
    ];
    if (allAlerts.length > 0) {
      results.aiInterpretation = await this.modules.crossAccount.interpretAnomalies(allAlerts, data.context || {});
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'crossAccount', isaReference: 'ISA 520', timestamp: new Date().toISOString() };
  }

  /**
   * Run estimate accuracy checks (ISA 540).
   */
  async runEstimateAccuracy(estimates, context = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = { estimates: [] };

    for (const estimate of (Array.isArray(estimates) ? estimates : [estimates])) {
      const estimateResult = {};

      if (estimate.formula && estimate.inputs) {
        estimateResult.reperformance = this.modules.estimates.reperformCalculation(estimate);
      }
      if (estimate.assumptions) {
        estimateResult.sensitivity = this.modules.estimates.sensitivityAnalysis(estimate, estimate.assumptions);
      }
      if (estimate.historicalEstimates) {
        estimateResult.uncertainty = this.modules.estimates.assessEstimationUncertainty(estimate.historicalEstimates);
      }
      if (estimate.value) {
        estimateResult.reasonableness = await this.modules.estimates.evaluateReasonableness(estimate, context);
      }

      results.estimates.push({ description: estimate.description, ...estimateResult });
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'estimates', isaReference: 'ISA 540', timestamp: new Date().toISOString() };
  }

  /**
   * Run reconciliation checks (ISA 500).
   */
  async runReconciliation(sourceA, sourceB, rules) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const matchResult = this.modules.reconciliation.automatedMatching(sourceA, sourceB, rules);
    const results = { matching: matchResult };

    // Analyze differences from unmatched items
    if (matchResult.unmatched.sourceA.length > 0 || matchResult.unmatched.sourceB.length > 0) {
      const diffs = [
        ...matchResult.unmatched.sourceA.map(item => ({ ...item, source: 'A', type: 'error' })),
        ...matchResult.unmatched.sourceB.map(item => ({ ...item, source: 'B', type: 'error' })),
      ];
      results.differenceAnalysis = this.modules.reconciliation.analyzeDifferences(diffs);

      // AI investigation for significant unmatched items
      const allUnmatched = [...matchResult.unmatched.sourceA, ...matchResult.unmatched.sourceB];
      if (allUnmatched.length > 0) {
        results.aiInvestigation = await this.modules.reconciliation.investigateUnmatched(allUnmatched, rules?.context || {});
      }
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'reconciliation', isaReference: 'ISA 500', timestamp: new Date().toISOString() };
  }

  /**
   * Run sampling accuracy checks (ISA 530).
   */
  async runSamplingAccuracy(sample, population, options = {}) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const results = {};

    if (options.characteristics) {
      results.representativeness = this.modules.sampling.assessRepresentativeness(sample, population, options.characteristics);
    }
    if (options.misstatements) {
      results.projection = this.modules.sampling.calculateProjectionAccuracy(
        { misstatements: options.misstatements, sampleBookValue: options.sampleBookValue },
        options.populationBookValue || population.length,
        options.confidence
      );
    }
    if (options.tolerableMisstatement) {
      results.sampleSize = this.modules.sampling.evaluateSampleSize(
        population.length, options.tolerableMisstatement, options.expectedMisstatement, options.confidence
      );
    }
    if (options.stratifyCriteria) {
      results.stratification = this.modules.sampling.stratifyPopulation(population, options.stratifyCriteria);
    }

    // AI interpretation if we have projection or representativeness results
    if (results.projection || results.representativeness) {
      results.aiInterpretation = await this.modules.sampling.interpretSamplingResults(results, options.context || {});
    }

    this.metrics.successfulRequests++;
    return { ...results, module: 'sampling', isaReference: 'ISA 530', timestamp: new Date().toISOString() };
  }

  // ═══════════════════════════════════════════════════════════════════
  // BATCH PROCESSING (50% cheaper via claudeClient.sendBatch)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Submit multiple accuracy checks as a batch for cost-efficient processing.
   * @param {Array<{id: string, type: string, data: Object}>} items
   * @returns {Promise<{batchId: string, status: string}>}
   */
  async runBatchAccuracyChecks(items) {
    this._checkEnabled();
    this.metrics.totalRequests++;

    const batchRequests = items.map(item => ({
      id: `accuracy_${item.id}`,
      prompt: this._buildBatchPrompt(item.type, item.data),
      model: item.type === 'estimates' ? 'claude-opus-4-6' : 'claude-sonnet-4-6',
      maxTokens: 4096,
      system: 'You are an audit accuracy verification specialist. Return valid JSON only.',
    }));

    const result = await this.claude.sendBatch(batchRequests);
    this.metrics.successfulRequests++;
    return result;
  }

  /**
   * Await batch results.
   * @param {string} batchId
   * @returns {Promise<Array>}
   */
  async awaitBatchResults(batchId) {
    return this.claude.awaitBatchResults(batchId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // MONITORING & DASHBOARD
  // ═══════════════════════════════════════════════════════════════════

  getAccuracyDashboard(engagementId) {
    return this.modules.monitoring.getMonitoringDashboard(engagementId);
  }

  getAlerts(engagementId, severity) {
    return this.modules.monitoring.getDiscrepancyAlerts(engagementId, severity);
  }

  getMetrics() {
    const moduleMetrics = {};
    for (const [name, module] of Object.entries(this.modules)) {
      moduleMetrics[name] = module.getMetrics?.() || { status: 'READY' };
    }

    return {
      agent: 'AuditAccuracyEnhancement',
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
      agent: 'AuditAccuracyEnhancement',
      enabled: this.enabled,
      status: this.enabled ? 'READY' : 'DISABLED',
      modules: Object.keys(this.modules).length,
      modulesReady: Object.keys(this.modules).filter(m => this.modules[m]).length,
      isaReferences: ['ISA 330', 'ISA 500', 'ISA 520', 'ISA 530', 'ISA 540'],
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════

  _checkEnabled() {
    if (!this.enabled) {
      throw new Error('Accuracy Enhancement Engine is disabled. Set ENABLE_ACCURACY_ENHANCEMENTS=true to enable.');
    }
  }

  _cleanupCache() {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now - data.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  _buildBatchPrompt(type, data) {
    const prompts = {
      crossAccount: `Analyze these cross-account anomalies and provide audit interpretations:\n${JSON.stringify(data)}`,
      estimates: `Evaluate the reasonableness of this accounting estimate under ISA 540:\n${JSON.stringify(data)}`,
      reconciliation: `Investigate these unmatched reconciliation items under ISA 500:\n${JSON.stringify(data)}`,
      sampling: `Interpret these audit sampling results under ISA 530:\n${JSON.stringify(data)}`,
    };
    return prompts[type] || `Analyze this audit data for accuracy:\n${JSON.stringify(data)}`;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton export
const accuracyEngine = new AuditAccuracyEnhancementEngine();
export default accuracyEngine;
