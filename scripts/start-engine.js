#!/usr/bin/env node

/**
 * start-engine.js — Starts the AuditEngine Express backend
 *
 * Usage: node scripts/start-engine.js
 *
 * Features:
 *   - Loads .env from project root
 *   - Graceful shutdown on SIGINT/SIGTERM
 *   - Clear startup logging with service URLs
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SERVER_ENTRY = path.join(ROOT, 'server', 'index.js');

// Verify server entry exists
if (!fs.existsSync(SERVER_ENTRY)) {
  console.error(`[engine] ✗ Server entry not found: ${SERVER_ENTRY}`);
  process.exit(1);
}

// Verify .env exists
if (!fs.existsSync(path.join(ROOT, '.env'))) {
  console.error('[engine] ✗ .env file not found. Run: cp .env.template .env');
  process.exit(1);
}

const PORT = process.env.PORT || 3001;

console.log(`[engine] Starting AuditEngine backend...`);
console.log(`[engine] Server: http://localhost:${PORT}`);
console.log(`[engine] Health: http://localhost:${PORT}/api/health`);
console.log('');

const child = spawn('node', [SERVER_ENTRY], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env },
});

child.on('error', (err) => {
  console.error(`[engine] Failed to start server: ${err.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`[engine] Server stopped (signal: ${signal})`);
  } else if (code !== 0) {
    console.error(`[engine] Server exited with code ${code}`);
    process.exit(code);
  }
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n[engine] ${signal} received — shutting down...`);
  child.kill('SIGTERM');
  setTimeout(() => {
    console.log('[engine] Forcing exit after timeout');
    child.kill('SIGKILL');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
