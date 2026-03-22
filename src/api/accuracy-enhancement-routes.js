/**
 * ACCURACY ENHANCEMENT API ROUTES
 * Express router for /api/accuracy/* endpoints.
 * All routes gated by accuracyFeatureGate middleware.
 */

import { Router } from 'express';
import accuracyEngine from '../services/AuditAccuracyEnhancementEngine.js';
import {
  accuracyFeatureGate,
  validateAccuracyRequest,
  accuracyRateLimit,
} from '../middleware/AccuracyEnhancementMiddleware.js';

const router = Router();

// Apply feature gate to all routes
router.use(accuracyFeatureGate);

// ============================================================================
// FULL ASSESSMENT (rate limited — runs all 7 modules)
// ============================================================================

router.post(
  '/full-assessment',
  accuracyRateLimit,
  validateAccuracyRequest(['engagementId', 'data']),
  async (req, res) => {
    try {
      const { engagementId, data } = req.body;
      const result = await accuracyEngine.runFullAccuracyAssessment(engagementId, data);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Full accuracy assessment error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// INDIVIDUAL MODULE ENDPOINTS
// ============================================================================

// Mathematical accuracy (ISA 330) — pure computation, no rate limit
router.post(
  '/mathematical',
  validateAccuracyRequest(['data']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runMathematicalAccuracy(req.body.data);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Mathematical accuracy error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Data quality — pure computation, no rate limit
router.post(
  '/data-quality',
  validateAccuracyRequest(['data']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runDataQualityAssessment(req.body.data);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Data quality error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Cross-account validation (ISA 520) — no rate limit
router.post(
  '/cross-account',
  validateAccuracyRequest(['data']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runCrossAccountValidation(req.body.data);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Cross-account validation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Estimate accuracy (ISA 540) — rate limited (uses OPUS)
router.post(
  '/estimates',
  accuracyRateLimit,
  validateAccuracyRequest(['estimates']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runEstimateAccuracy(req.body.estimates, req.body.context || {});
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Estimate accuracy error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Reconciliation (ISA 500) — no rate limit
router.post(
  '/reconciliation',
  validateAccuracyRequest(['sourceA', 'sourceB']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runReconciliation(
        req.body.sourceA, req.body.sourceB, req.body.rules || {}
      );
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Reconciliation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Sampling accuracy (ISA 530) — no rate limit
router.post(
  '/sampling',
  validateAccuracyRequest(['sample', 'population']),
  async (req, res) => {
    try {
      const { sample, population, ...options } = req.body;
      const result = await accuracyEngine.runSamplingAccuracy(sample, population, options);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Sampling accuracy error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// BATCH PROCESSING (rate limited — AI calls at 50% cost)
// ============================================================================

router.post(
  '/batch',
  accuracyRateLimit,
  validateAccuracyRequest(['items']),
  async (req, res) => {
    try {
      const result = await accuracyEngine.runBatchAccuracyChecks(req.body.items);
      res.json({ success: true, result, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Batch accuracy check error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/batch/:batchId', async (req, res) => {
  try {
    const results = await accuracyEngine.awaitBatchResults(req.params.batchId);
    res.json({ success: true, results, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Batch results error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// MONITORING & DASHBOARD
// ============================================================================

router.get('/dashboard/:engagementId', (req, res) => {
  try {
    const dashboard = accuracyEngine.getAccuracyDashboard(req.params.engagementId);
    res.json({ success: true, dashboard, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/alerts/:engagementId', (req, res) => {
  try {
    const alerts = accuracyEngine.getAlerts(req.params.engagementId, req.query.severity);
    res.json({ success: true, alerts, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// STATUS & METRICS
// ============================================================================

router.get('/status', (req, res) => {
  try {
    const status = accuracyEngine.getStatus();
    res.json({ success: true, status, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/metrics', (req, res) => {
  try {
    const metrics = accuracyEngine.getMetrics();
    res.json({ success: true, metrics, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
