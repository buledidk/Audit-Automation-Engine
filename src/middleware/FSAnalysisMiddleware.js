/**
 * FINANCIAL STATEMENT ANALYSIS MIDDLEWARE
 * Feature gate, request validation, and rate limiting for FS analysis routes.
 */

import { createRateLimit } from './rateLimitMiddleware.js';

/**
 * Feature gate — returns 503 if ENABLE_FS_ANALYSIS is explicitly 'false'.
 */
export function fsAnalysisFeatureGate(req, res, next) {
  if (process.env.ENABLE_FS_ANALYSIS === 'false') {
    return res.status(503).json({
      error: 'Financial Statement Analysis Agent is disabled',
      hint: 'Set ENABLE_FS_ANALYSIS=true in environment variables',
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

/**
 * Validate required fields in request body.
 * @param {Array<string>} requiredFields
 * @returns {Function} Express middleware
 */
export function validateFSRequest(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Request body must be a JSON object' });
    }
    const missing = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], req.body);
      return value === undefined || value === null;
    });
    if (missing.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields: missing });
    }
    next();
  };
}

/**
 * Rate limiter for AI-heavy FS analysis endpoints.
 * 8 requests per 5-minute window (multiple OPUS calls per request).
 */
export const fsAnalysisRateLimit = createRateLimit({
  windowMs: 300000,
  maxRequests: 8,
});

export default { fsAnalysisFeatureGate, validateFSRequest, fsAnalysisRateLimit };
