/**
 * AUDIT PLATFORM SERVER BOOTSTRAP
 * Complete application startup with master integration
 *
 * Boot order:
 *   1. Express HTTP server
 *   2. Master Integration (all services, agents, connectors, monitoring)
 *   3. WebSocket layer
 *   4. Health check scheduler
 */

import '../src/lib/loadEnv.js';
import app from "./app.js";
import masterIntegration from "../src/services/masterIntegrationService.js";

const PORT = process.env.PORT || 3001;

// ── Start HTTP Server ─────────────────────────────────────────────
const server = app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║         AUDIT AUTOMATION ENGINE - PRODUCTION SERVER              ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ✓ HTTP Server:  http://localhost:${PORT}                        ║
║  ✓ Health:       http://localhost:${PORT}/health                 ║
║  ✓ Metrics:      http://localhost:${PORT}/api/metrics/dashboard  ║
║  ✓ Admin:        http://localhost:${PORT}/api/admin/status       ║
║                                                                   ║
║  Environment: ${(process.env.NODE_ENV || "development").padEnd(15)}                            ║
║  Version:     3.0.0 (Phase 8 - Full Integration)                 ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
  `);

  // ── Run Master Integration ────────────────────────────────────
  try {
    const status = await masterIntegration.initialize(server);

    // Make integration status available on the app
    app.locals.integration = status;
    app.locals.masterIntegration = masterIntegration;

    console.log(`🟢 All systems operational. Server ready on port ${PORT}\n`);
  } catch (error) {
    console.error('⚠️  Master integration completed with errors:', error.message);
    console.log('Server is running but some subsystems may be degraded.\n');
  }
});

// ── Expose integration status endpoint ────────────────────────────
app.get('/api/integration/status', (req, res) => {
  try {
    const status = masterIntegration.getIntegrationStatus();
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── Graceful Shutdown ─────────────────────────────────────────────
async function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Graceful shutdown initiated...`);

  // Shutdown master integration first
  try {
    await masterIntegration.shutdown();
  } catch (err) {
    console.error('Error during integration shutdown:', err.message);
  }

  // Then close HTTP server
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default server;
