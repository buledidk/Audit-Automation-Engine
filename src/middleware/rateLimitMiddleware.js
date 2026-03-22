/**
 * RATE LIMIT MIDDLEWARE
 * In-memory token bucket rate limiter — no external dependencies
 * Designed for heavy automation endpoints (expensive Opus 4.6 calls)
 */

const buckets = new Map();

/**
 * Create a rate limit middleware with configurable window and max requests.
 *
 * @param {Object} options
 * @param {number} [options.windowMs=300000] - Time window in ms (default: 5 minutes)
 * @param {number} [options.maxRequests=3] - Max requests per window per user
 * @returns {Function} Express middleware
 */
export function createRateLimit({ windowMs = 300000, maxRequests = 3 } = {}) {
  // Cleanup stale buckets every 10 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
      if (bucket.timestamps.length === 0) {
        buckets.delete(key);
      }
    }
  }, 10 * 60 * 1000);

  // Allow GC if the process unloads this module
  if (cleanupInterval.unref) cleanupInterval.unref();

  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();

    if (!buckets.has(key)) {
      buckets.set(key, { timestamps: [] });
    }

    const bucket = buckets.get(key);

    // Slide the window — keep only timestamps within the window
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

    if (bucket.timestamps.length >= maxRequests) {
      const oldestInWindow = bucket.timestamps[0];
      const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);

      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Rate limit exceeded for heavy automation",
        retryAfter,
        limit: maxRequests,
        windowMs,
      });
    }

    bucket.timestamps.push(now);
    next();
  };
}

export default createRateLimit;
