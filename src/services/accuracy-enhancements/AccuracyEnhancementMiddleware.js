/**
 * ACCURACY ENHANCEMENT MIDDLEWARE
 * ===============================
 * Express middleware to integrate AAEE with audit workflows.
 * Automatically enhances accuracy at each workflow phase.
 */

import AuditAccuracyEnhancementEngine from '../AuditAccuracyEnhancementEngine.js';

export const createAccuracyEnhancementMiddleware = (options = {}) => {
  const engine = new AuditAccuracyEnhancementEngine({
    enableConsensus: options.enableConsensus !== false,
    enableAnomalyDetection: options.enableAnomalyDetection !== false,
    enableConfidenceScoring: options.enableConfidenceScoring !== false,
    enableXAI: options.enableXAI !== false,
    enableContinuousAssurance: options.enableContinuousAssurance !== false,
    enableBlockchainEvidence: options.enableBlockchainEvidence !== false,
    enableFraudDetection: options.enableFraudDetection !== false,
    enableDataQualityValidation: options.enableDataQualityValidation !== false,
    enablePredictiveRisking: options.enablePredictiveRisking !== false,
    enableRegulatoryUpdates: options.enableRegulatoryUpdates !== false,
    enableSentimentAnalysis: options.enableSentimentAnalysis !== false,
    enableReconciliation: options.enableReconciliation !== false,
    enableAIProcedures: options.enableAIProcedures !== false,
    enableDataValidation: options.enableDataValidation !== false,
    enableSampling: options.enableSampling !== false
  });

  return async (req, res, next) => {
    try {
      // Store engine in request for use in route handlers
      req.accuracyEngine = engine;

      // Log the incoming request
      console.log(`[ACCURACY] ${req.method} ${req.path}`);

      // Proceed to next handler
      next();
    } catch (error) {
      console.error('[ACCURACY] Middleware error:', error);
      res.status(500).json({ error: 'Accuracy enhancement middleware error' });
    }
  };
};

/**
 * Middleware to automatically enhance audit data
 */
export const enhanceAuditDataMiddleware = (engine) => {
  return async (req, res, next) => {
    if (req.body && req.body.auditData) {
      try {
        console.log('[ACCURACY] Running enhancement analysis...');
        const enhancedData = await engine.enhanceAuditAccuracy(req.body.auditData);

        // Store enhanced data in request
        req.enhancedData = enhancedData;
        req.body.enhancements = enhancedData;

        console.log('[ACCURACY] Enhancement analysis complete');
      } catch (error) {
        console.error('[ACCURACY] Enhancement error:', error);
        // Don't fail the request, just log the error
      }
    }

    next();
  };
};

/**
 * Middleware to apply enhancements to specific workflow phases
 */
export const workflowPhaseEnhancementMiddleware = (engine, phase) => {
  return async (req, res, next) => {
    if (req.body && req.body.auditData) {
      try {
        console.log(`[ACCURACY] Applying ${phase} phase enhancements...`);
        const integration = await engine.integrateWithWorkflow(
          phase,
          req.body.auditData,
          req.body.workflowState || {}
        );

        // Merge enhanced data with request
        req.body.auditData = { ...req.body.auditData, ...integration.modifiedData };
        req.workflowEnhancements = integration;

        console.log(`[ACCURACY] ${phase} enhancements applied: ${integration.enhancementsApplied.length}`);
      } catch (error) {
        console.error(`[ACCURACY] ${phase} enhancement error:`, error);
      }
    }

    next();
  };
};

export default {
  createAccuracyEnhancementMiddleware,
  enhanceAuditDataMiddleware,
  workflowPhaseEnhancementMiddleware
};
