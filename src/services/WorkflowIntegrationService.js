/**
 * WORKFLOW INTEGRATION SERVICE
 * Maps accuracy checks to the 6 audit phases.
 * Provides hooks for procedure completion and evidence upload events.
 *
 * Phases: Planning → Risk Assessment → Interim → Final Audit → Completion → Reporting
 */

import accuracyEngine from './AuditAccuracyEnhancementEngine.js';

const PHASE_CHECKS = {
  planning: ['dataQuality', 'crossAccount'],
  riskAssessment: ['crossAccount', 'estimates'],
  interim: ['mathematical', 'dataQuality', 'sampling'],
  finalAudit: ['mathematical', 'reconciliation', 'estimates', 'sampling', 'crossAccount'],
  completion: ['fullAssessment'],
  reporting: ['monitoring'],
};

export class WorkflowIntegrationService {
  constructor() {
    this.engine = accuracyEngine;
    this.phaseHistory = new Map(); // engagementId -> phase results
  }

  /**
   * Get the recommended accuracy checks for a given audit phase.
   * @param {string} phase - planning|riskAssessment|interim|finalAudit|completion|reporting
   * @returns {Array<string>} List of check names
   */
  getRecommendedChecks(phase) {
    return PHASE_CHECKS[phase] || [];
  }

  /**
   * Execute accuracy checks appropriate for the current audit phase.
   * @param {string} phase
   * @param {string} engagementId
   * @param {Object} data - Available data for checks
   * @returns {Promise<Object>} Phase-specific results
   */
  async executePhaseAccuracyChecks(phase, engagementId, data) {
    const checks = this.getRecommendedChecks(phase);
    if (checks.length === 0) return { phase, checks: [], result: null };

    const results = {};

    for (const check of checks) {
      try {
        switch (check) {
          case 'mathematical':
            if (data.trialBalance || data.lineItems || data.scheduleData) {
              results.mathematical = await this.engine.runMathematicalAccuracy(data);
            }
            break;
          case 'dataQuality':
            if (data.transactions || data.dataset) {
              results.dataQuality = await this.engine.runDataQualityAssessment(data);
            }
            break;
          case 'crossAccount':
            if (data.accounts || (data.current && data.prior)) {
              results.crossAccount = await this.engine.runCrossAccountValidation(data);
            }
            break;
          case 'estimates':
            if (data.estimates) {
              results.estimates = await this.engine.runEstimateAccuracy(data.estimates, data.context || {});
            }
            break;
          case 'reconciliation':
            if (data.sourceA && data.sourceB) {
              results.reconciliation = await this.engine.runReconciliation(data.sourceA, data.sourceB, data.matchRules);
            }
            break;
          case 'sampling':
            if (data.sample && data.population) {
              results.sampling = await this.engine.runSamplingAccuracy(data.sample, data.population, data.samplingOptions || {});
            }
            break;
          case 'fullAssessment':
            results.fullAssessment = await this.engine.runFullAccuracyAssessment(engagementId, data);
            break;
          case 'monitoring':
            results.monitoring = this.engine.getAccuracyDashboard(engagementId);
            break;
        }
      } catch (error) {
        results[check] = { error: error.message };
      }
    }

    // Store in phase history
    if (!this.phaseHistory.has(engagementId)) {
      this.phaseHistory.set(engagementId, {});
    }
    this.phaseHistory.get(engagementId)[phase] = {
      results,
      completedAt: new Date().toISOString(),
    };

    return {
      phase,
      checks,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Hook: Called when an audit procedure is completed.
   * Triggers relevant accuracy checks based on the procedure type.
   * @param {string} engagementId
   * @param {Object} result - Procedure result { type, data, phase }
   */
  async onProcedureCompleted(engagementId, result) {
    if (!result?.data) return;

    const checksToRun = [];

    // Determine what to check based on procedure type
    if (result.type === 'substantive_detail' || result.type === 'recalculation') {
      checksToRun.push('mathematical');
    }
    if (result.type === 'analytical_procedures') {
      checksToRun.push('crossAccount');
    }
    if (result.type === 'sampling') {
      checksToRun.push('sampling');
    }
    if (result.type === 'confirmation' || result.type === 'reconciliation') {
      checksToRun.push('reconciliation');
    }

    const results = {};
    for (const check of checksToRun) {
      try {
        if (check === 'mathematical' && (result.data.trialBalance || result.data.lineItems)) {
          results.mathematical = await this.engine.runMathematicalAccuracy(result.data);
        }
        if (check === 'crossAccount' && result.data.accounts) {
          results.crossAccount = await this.engine.runCrossAccountValidation(result.data);
        }
        if (check === 'sampling' && result.data.sample && result.data.population) {
          results.sampling = await this.engine.runSamplingAccuracy(result.data.sample, result.data.population);
        }
        if (check === 'reconciliation' && result.data.sourceA && result.data.sourceB) {
          results.reconciliation = await this.engine.runReconciliation(result.data.sourceA, result.data.sourceB);
        }
      } catch (error) {
        results[check] = { error: error.message };
      }
    }

    return { engagementId, procedureType: result.type, checksRun: checksToRun, results };
  }

  /**
   * Hook: Called when evidence is uploaded.
   * Triggers data quality assessment on the uploaded data.
   * @param {string} engagementId
   * @param {Object} evidence - { type, data, format }
   */
  async onEvidenceUploaded(engagementId, evidence) {
    if (!evidence?.data) return;

    const results = {};

    // Always run data quality on uploaded evidence
    if (Array.isArray(evidence.data) && evidence.data.length > 0) {
      results.dataQuality = await this.engine.runDataQualityAssessment({
        dataset: evidence.data,
        keyFields: evidence.keyFields,
        expectedSchema: evidence.expectedSchema,
      });
    }

    return { engagementId, evidenceType: evidence.type, results };
  }

  /**
   * Check if the engagement can proceed past a phase gate.
   * Returns pass/fail based on accuracy scores.
   * @param {string} engagementId
   * @returns {{canProceed: boolean, score: Object, blockers: Array}}
   */
  getPhaseGateStatus(engagementId) {
    const dashboard = this.engine.getAccuracyDashboard(engagementId);
    const alerts = this.engine.getAlerts(engagementId, 'HIGH');
    const history = this.phaseHistory.get(engagementId) || {};

    const blockers = [];
    if (alerts.alerts && alerts.alerts.length > 0) {
      blockers.push(`${alerts.alerts.length} unresolved HIGH severity alerts`);
    }
    if (dashboard.score?.overall < 70) {
      blockers.push(`Overall accuracy score ${dashboard.score.overall} below 70 threshold`);
    }

    return {
      canProceed: blockers.length === 0,
      score: dashboard.score,
      blockers,
      completedPhases: Object.keys(history),
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    return {
      service: 'WorkflowIntegration',
      status: 'READY',
      activeEngagements: this.phaseHistory.size,
      phases: Object.keys(PHASE_CHECKS),
    };
  }
}

export default new WorkflowIntegrationService();
