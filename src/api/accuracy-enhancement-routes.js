/**
 * AUDIT ACCURACY ENHANCEMENT API ROUTES
 * ====================================
 * Express routes for AAEE functionality.
 * Exposes all accuracy enhancement features via REST API.
 */

import express from 'express';
import AuditAccuracyEnhancementEngine from '../services/AuditAccuracyEnhancementEngine.js';
import { workflowPhaseEnhancementMiddleware } from '../services/accuracy-enhancements/AccuracyEnhancementMiddleware.js';

const router = express.Router();

// Initialize engine
const engine = new AuditAccuracyEnhancementEngine({
  enableConsensus: true,
  enableAnomalyDetection: true,
  enableConfidenceScoring: true,
  enableXAI: true,
  enableContinuousAssurance: true,
  enableBlockchainEvidence: true,
  enableFraudDetection: true,
  enableDataQualityValidation: true,
  enablePredictiveRisking: true,
  enableRegulatoryUpdates: true,
  enableSentimentAnalysis: true,
  enableReconciliation: true,
  enableAIProcedures: true,
  enableDataValidation: true,
  enableSampling: true
});

/**
 * POST /api/accuracy/enhance
 * Run comprehensive accuracy enhancement analysis
 */
router.post('/enhance', async (req, res) => {
  try {
    const { auditData } = req.body;

    if (!auditData) {
      return res.status(400).json({ error: 'auditData is required' });
    }

    console.log('🚀 Starting comprehensive accuracy enhancement analysis...');
    const startTime = Date.now();

    const report = await engine.enhanceAuditAccuracy(auditData);

    const duration = Date.now() - startTime;

    res.json({
      success: true,
      duration: duration,
      report: report,
      summary: {
        completedEnhancements: Object.keys(report).filter(k => report[k] !== null).length,
        overallConfidence: report.overallConfidenceScore,
        recommendations: report.recommendations.length,
        auditTrailEntries: report.auditTrail.length
      }
    });
  } catch (error) {
    console.error('Accuracy enhancement error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/workflow/:phase
 * Apply accuracy enhancements for specific audit phase
 */
router.post('/workflow/:phase', workflowPhaseEnhancementMiddleware(engine, ':phase'), async (req, res) => {
  try {
    const phase = req.params.phase.toUpperCase();
    const { auditData, workflowState } = req.body;

    if (!auditData) {
      return res.status(400).json({ error: 'auditData is required' });
    }

    console.log(`📊 Applying ${phase} phase enhancements...`);

    const integration = await engine.integrateWithWorkflow(phase, auditData, workflowState || {});

    res.json({
      success: true,
      phase: phase,
      enhancements: {
        applied: integration.enhancementsApplied,
        count: integration.enhancementsApplied.length,
        modifiedData: integration.modifiedData
      }
    });
  } catch (error) {
    console.error('Workflow enhancement error for phase %s:', req.params.phase, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/planning
 * Apply accuracy enhancements for planning phase
 */
router.post('/planning', async (req, res) => {
  try {
    const { auditData } = req.body;
    const integration = await engine.integrateWithWorkflow('PLANNING', auditData || {}, {});
    res.json({ success: true, phase: 'PLANNING', enhancements: integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/risk-assessment
 * Apply accuracy enhancements for risk assessment phase
 */
router.post('/risk-assessment', async (req, res) => {
  try {
    const { auditData } = req.body;
    const integration = await engine.integrateWithWorkflow('RISK_ASSESSMENT', auditData || {}, {});
    res.json({ success: true, phase: 'RISK_ASSESSMENT', enhancements: integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/testing
 * Apply accuracy enhancements for testing phase
 */
router.post('/testing', async (req, res) => {
  try {
    const { auditData } = req.body;
    const integration = await engine.integrateWithWorkflow('TESTING', auditData || {}, {});
    res.json({ success: true, phase: 'TESTING', enhancements: integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/reconciliation
 * Apply accuracy enhancements for reconciliation phase
 */
router.post('/reconciliation', async (req, res) => {
  try {
    const { auditData } = req.body;
    const integration = await engine.integrateWithWorkflow('RECONCILIATION', auditData || {}, {});
    res.json({ success: true, phase: 'RECONCILIATION', enhancements: integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/reporting
 * Apply accuracy enhancements for reporting phase
 */
router.post('/reporting', async (req, res) => {
  try {
    const { auditData } = req.body;
    const integration = await engine.integrateWithWorkflow('REPORTING', auditData || {}, {});
    res.json({ success: true, phase: 'REPORTING', enhancements: integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/accuracy/metrics
 * Get enhancement metrics and statistics
 */
router.get('/metrics', (req, res) => {
  try {
    const metrics = engine.getMetrics();
    res.json({
      success: true,
      metrics: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/anomalies
 * Detect anomalies in provided data
 */
router.post('/anomalies', async (req, res) => {
  try {
    const { auditData } = req.body;
    const anomalies = await engine.engines.anomalyDetection.detectAnomalies(auditData || {});
    res.json({ success: true, anomalies: anomalies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/fraud-detection
 * Analyze fraud patterns
 */
router.post('/fraud-detection', async (req, res) => {
  try {
    const { auditData } = req.body;
    const fraud = await engine.engines.fraudPatternRecognition.analyzeFraudRisks(auditData || {});
    res.json({ success: true, fraudAnalysis: fraud });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/data-quality
 * Validate data quality
 */
router.post('/data-quality', async (req, res) => {
  try {
    const { auditData } = req.body;
    const quality = await engine.engines.dataQualityValidation.validateAll(auditData || {});
    res.json({ success: true, dataQuality: quality });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/confidence-scores
 * Calculate confidence scores for findings
 */
router.post('/confidence-scores', async (req, res) => {
  try {
    const { results } = req.body;
    const scores = await engine.engines.confidenceScoring.scoreAllFindings(results || {});
    res.json({ success: true, confidenceScores: scores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/consensus
 * Perform multi-agent consensus validation
 */
router.post('/consensus', async (req, res) => {
  try {
    const { findings, threshold } = req.body;
    const consensus = await engine.engines.consensus.validateWithConsensus(
      findings || {},
      threshold || 0.80
    );
    res.json({ success: true, consensus: consensus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/accuracy/export
 * Export enhancement results in specified format
 */
router.post('/export', async (req, res) => {
  try {
    const { format } = req.body;
    const result = await engine.exportResults(format || 'json');

    if (format === 'markdown') {
      res.setHeader('Content-Type', 'text/markdown');
      res.send(result);
    } else {
      res.json(JSON.parse(result));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/accuracy/status
 * Get system status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'OPERATIONAL',
    engine: 'AuditAccuracyEnhancementEngine v1.0',
    enhancements: 15,
    timestamp: new Date()
  });
});

export default router;
