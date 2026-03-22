/**
 * ACCURACY ENHANCEMENT MIDDLEWARE
 * Feature gate, request validation, and rate limiting for accuracy API routes.
 */

import { createRateLimit } from './rateLimitMiddleware.js';

/**
 * Feature gate — returns 503 if ENABLE_ACCURACY_ENHANCEMENTS is explicitly 'false'.
 * Defaults to enabled (ON) when env var is absent.
 */
export function accuracyFeatureGate(req, res, next) {
  if (process.env.ENABLE_ACCURACY_ENHANCEMENTS === 'false') {
    return res.status(503).json({
      error: 'Accuracy Enhancement Engine is disabled',
      hint: 'Set ENABLE_ACCURACY_ENHANCEMENTS=true in environment variables',
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

/**
 * Validate that required fields exist in the request body.
 * @param {Array<string>} requiredFields - Field names to check
 * @returns {Function} Express middleware
 */
export function validateAccuracyRequest(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Request body must be a JSON object',
        timestamp: new Date().toISOString(),
      });
    }

    const missing = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], req.body);
      return value === undefined || value === null;
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missing,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}

/**
 * Rate limiter for AI-heavy accuracy endpoints.
 * 10 requests per 5-minute window (more generous than heavy automation's 3).
 */
export const accuracyRateLimit = createRateLimit({
  windowMs: 300000,
  maxRequests: 10,
});

export default {
  accuracyFeatureGate,
  validateAccuracyRequest,
  accuracyRateLimit,
};
