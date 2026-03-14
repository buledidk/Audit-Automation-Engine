/**
 * AUDIT PLATFORM SERVER BOOTSTRAP
 * Complete application startup and coordination
 */

const app = require("./app");

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║       AUDIT PLATFORM API SERVER STARTED                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ✓ Server: http://localhost:${PORT}                   ║
║  ✓ Health: http://localhost:${PORT}/health             ║
║  ✓ Docs:   http://localhost:${PORT}/api-docs           ║
║                                                           ║
║  Environment: ${process.env.NODE_ENV || "development"}                  ║
║  Version: 2.0.0                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n[SIGTERM] Graceful shutdown initiated...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n[SIGINT] Graceful shutdown initiated...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
