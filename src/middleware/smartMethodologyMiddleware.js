/**
 * SMART METHODOLOGY MIDDLEWARE
 * Feature gate and request validation for the ISA 330 methodology pipeline.
 *
 * Feature gate: ENABLE_SMART_METHODOLOGY env var (enabled by default).
 * Set ENABLE_SMART_METHODOLOGY=false to disable all methodology endpoints.
 */

/**
 * Feature gate middleware — returns 503 if methodology is disabled
 */
export function requireSmartMethodology(req, res, next) {
  const enabled = process.env.ENABLE_SMART_METHODOLOGY !== "false";

  if (!enabled) {
    return res.status(503).json({
      error: "Smart Methodology is disabled",
      message: "Set ENABLE_SMART_METHODOLOGY=true (or unset) to enable ISA 330 methodology endpoints",
      feature: "SMART_METHODOLOGY",
    });
  }

  next();
}

/**
 * Validate engagement context for methodology requests
 */
export function validateMethodologyRequest(req, res, next) {
  const { engagementId } = req.body;

  if (!engagementId && !req.params.engagementId) {
    return res.status(400).json({
      error: "Missing engagementId",
      message: "engagementId is required in the request body or URL params",
    });
  }

  // Normalize: ensure engagementId is accessible on req
  if (!req.body.engagementId && req.params.engagementId) {
    req.body.engagementId = req.params.engagementId;
  }

  next();
}

/**
 * Validate section code parameter
 */
export function validateSectionCode(req, res, next) {
  const { code } = req.params;
  const validCodes = ["D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14"];

  if (code && !validCodes.includes(code)) {
    return res.status(400).json({
      error: `Invalid section code: ${code}`,
      validCodes,
    });
  }

  next();
}

export default {
  requireSmartMethodology,
  validateMethodologyRequest,
  validateSectionCode,
};
