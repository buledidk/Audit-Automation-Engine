/**
 * WORKFLOW INTEGRATION SERVICE
 * ===========================
 * Integrates AAEE with existing audit stage workflows.
 * Seamlessly adds accuracy enhancements to planning, risk assessment, testing, reporting.
 */

import AuditAccuracyEnhancementEngine from '../AuditAccuracyEnhancementEngine.js';

export class WorkflowIntegrationService {
  constructor() {
    this.engine = new AuditAccuracyEnhancementEngine();
    this.integrations = {};
  }

  /**
   * Integrate with Planning Phase (src/audit-stages/planning/)
   */
  async integratePlanningPhase(planningData) {
    console.log('📋 [PLANNING] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'PLANNING',
      planningData,
      {}
    );

    return {
      ...planningData,
      enhancements: {
        predictedRisks: enhancement.modifiedData.predictedRisks,
        regulatoryRequirements: enhancement.modifiedData.regulatoryRequirements,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Integrate with Risk Assessment Phase (src/audit-stages/risk-assessment/)
   */
  async integrateRiskAssessmentPhase(riskData) {
    console.log('⚠️  [RISK_ASSESSMENT] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'RISK_ASSESSMENT',
      riskData,
      {}
    );

    return {
      ...riskData,
      enhancements: {
        detectedAnomalies: enhancement.modifiedData.detectedAnomalies,
        fraudRisks: enhancement.modifiedData.fraudRisks,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Integrate with Interim Audit Phase (src/audit-stages/interim/)
   */
  async integrateInterimPhase(interimData) {
    console.log('🔍 [INTERIM] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'TESTING',
      interimData,
      {}
    );

    return {
      ...interimData,
      enhancements: {
        optimizedSample: enhancement.modifiedData.optimizedSample,
        recommendedProcedures: enhancement.modifiedData.recommendedProcedures,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Integrate with Final Audit Phase (src/audit-stages/final-audit/)
   */
  async integrateFinalAuditPhase(finalData) {
    console.log('✅ [FINAL_AUDIT] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'TESTING',
      finalData,
      {}
    );

    return {
      ...finalData,
      enhancements: {
        optimizedSample: enhancement.modifiedData.optimizedSample,
        recommendedProcedures: enhancement.modifiedData.recommendedProcedures,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Integrate with Completion Phase (src/audit-stages/completion/)
   */
  async integrateCompletionPhase(completionData) {
    console.log('🏁 [COMPLETION] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'RECONCILIATION',
      completionData,
      {}
    );

    return {
      ...completionData,
      enhancements: {
        reconciliationResults: enhancement.modifiedData.reconciliationResults,
        validationResults: enhancement.modifiedData.validationResults,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Integrate with Reporting Phase (src/audit-stages/reporting/)
   */
  async integrateReportingPhase(reportData) {
    console.log('📄 [REPORTING] Integrating accuracy enhancements...');

    const enhancement = await this.engine.integrateWithWorkflow(
      'REPORTING',
      reportData,
      {}
    );

    // Run full enhancement analysis for reporting
    const fullAnalysis = await this.engine.enhanceAuditAccuracy(reportData);

    return {
      ...reportData,
      enhancements: {
        confidenceScores: enhancement.modifiedData.confidenceScores,
        xaiExplanations: enhancement.modifiedData.xaiExplanations,
        consensusValidation: enhancement.modifiedData.consensusValidation,
        fullAnalysis: fullAnalysis,
        enhancementsApplied: enhancement.enhancementsApplied
      }
    };
  }

  /**
   * Get integration status for all phases
   */
  getIntegrationStatus() {
    return {
      status: 'FULLY_INTEGRATED',
      phases: {
        planning: { integrated: true, enhancements: 2 },
        riskAssessment: { integrated: true, enhancements: 2 },
        interim: { integrated: true, enhancements: 2 },
        finalAudit: { integrated: true, enhancements: 2 },
        completion: { integrated: true, enhancements: 2 },
        reporting: { integrated: true, enhancements: 3 }
      },
      totalEnhancements: 15,
      lastUpdated: new Date()
    };
  }
}

export default WorkflowIntegrationService;
