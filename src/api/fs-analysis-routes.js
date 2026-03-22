/**
 * FINANCIAL STATEMENT ANALYSIS API ROUTES
 * Express router for /api/fs-analysis/* endpoints.
 */

import { Router } from 'express';
import fsAnalysisAgent from '../services/FinancialStatementAnalysisAgent.js';
import {
  fsAnalysisFeatureGate,
  validateFSRequest,
  fsAnalysisRateLimit,
} from '../middleware/FSAnalysisMiddleware.js';

const router = Router();
router.use(fsAnalysisFeatureGate);

// ============================================================================
// FULL ANALYSIS (rate limited — runs all 7 modules)
// ============================================================================

router.post('/full', fsAnalysisRateLimit, validateFSRequest(['engagementId', 'data']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runFullFSAnalysis(req.body.engagementId, req.body.data);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Full FS analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// INDIVIDUAL MODULE ENDPOINTS
// ============================================================================

router.post('/extract', validateFSRequest(['document']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runFSExtraction(req.body);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('FS extraction error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/reconcile', validateFSRequest(['data']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runFSReconciliation(req.body.data);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('FS reconciliation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/disclosures', validateFSRequest(['financialStatements']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runDisclosureCompleteness(
      req.body.financialStatements, req.body.framework || 'IFRS', req.body.context || {}
    );
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Disclosure completeness error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/estimates', fsAnalysisRateLimit, validateFSRequest(['financialStatements']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runEstimateAnalysis(req.body.financialStatements, req.body.context || {});
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Estimate analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/consolidation', validateFSRequest(['data']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runConsolidationValidation(req.body.data);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Consolidation validation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/compliance', fsAnalysisRateLimit, validateFSRequest(['financialStatements']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runFrameworkCompliance(req.body.financialStatements, req.body.context || {});
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Framework compliance error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/risk', fsAnalysisRateLimit, validateFSRequest(['financialStatements']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runFSRiskAssessment(req.body.financialStatements, req.body.context || {});
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('FS risk assessment error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/going-concern', fsAnalysisRateLimit, validateFSRequest(['data']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runGoingConcern(req.body.data);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Going concern assessment error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// BATCH PROCESSING
// ============================================================================

router.post('/batch', fsAnalysisRateLimit, validateFSRequest(['items']), async (req, res) => {
  try {
    const result = await fsAnalysisAgent.runBatchFSChecks(req.body.items);
    res.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Batch FS check error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/batch/:batchId', async (req, res) => {
  try {
    const results = await fsAnalysisAgent.awaitBatchResults(req.params.batchId);
    res.json({ success: true, results, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// STATUS & METRICS
// ============================================================================

router.get('/status', (req, res) => {
  try {
    res.json({ success: true, status: fsAnalysisAgent.getStatus(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics', (req, res) => {
  try {
    res.json({ success: true, metrics: fsAnalysisAgent.getMetrics(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
