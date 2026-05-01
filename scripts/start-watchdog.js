#!/usr/bin/env node

/**
 * start-watchdog.js — Health monitor for AuditEngine services
 *
 * Usage: node scripts/start-watchdog.js
 *
 * Polls the backend health endpoint and frontend dev server at regular
 * intervals. Logs status changes and alerts on failures.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const POLL_INTERVAL = parseInt(process.env.WATCHDOG_INTERVAL || '10000', 10); // 10s default
const MAX_CONSECUTIVE_FAILURES = 3;

const state = {
  backend: { up: null, failures: 0, lastCheck: null },
  frontend: { up: null, failures: 0, lastCheck: null },
  startTime: new Date(),
  checks: 0,
};

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function formatUptime() {
  const ms = Date.now() - state.startTime.getTime();
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return `${h}h ${m}m ${s}s`;
}

async function checkService(name, url, healthPath) {
  const svc = state[name];
  const fullUrl = `${url}${healthPath}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const wasDown = svc.up === false;
    svc.up = res.ok;
    svc.failures = 0;
    svc.lastCheck = new Date();

    if (wasDown) {
      console.log(`[watchdog] ${timestamp()} ✓ ${name} RECOVERED (${res.status})`);
    }
  } catch (err) {
    svc.failures++;
    svc.lastCheck = new Date();
    const wasUp = svc.up === true || svc.up === null;

    if (wasUp) {
      svc.up = false;
      console.log(`[watchdog] ${timestamp()} ✗ ${name} DOWN — ${err.cause?.code || err.message}`);
    }

    if (svc.failures >= MAX_CONSECUTIVE_FAILURES && svc.failures % MAX_CONSECUTIVE_FAILURES === 0) {
      console.log(
        `[watchdog] ${timestamp()} ⚠ ${name} has been down for ${svc.failures} consecutive checks`
      );
    }
  }
}

function printStatus() {
  const be = state.backend.up === null ? '?' : state.backend.up ? '✓' : '✗';
  const fe = state.frontend.up === null ? '?' : state.frontend.up ? '✓' : '✗';

  console.log(
    `[watchdog] ${timestamp()} ` +
      `Backend[${be}] Frontend[${fe}] ` +
      `Checks:${state.checks} Uptime:${formatUptime()}`
  );
}

async function poll() {
  state.checks++;

  await Promise.all([
    checkService('backend', BACKEND_URL, '/api/health'),
    checkService('frontend', FRONTEND_URL, '/'),
  ]);

  // Print full status every 6th check (~1 min at 10s interval)
  if (state.checks % 6 === 0) {
    printStatus();
  }
}

// ─── Main ────────────────────────────────────────────────────────
console.log(`[watchdog] AuditEngine Health Monitor`);
console.log(`[watchdog] Backend:  ${BACKEND_URL}/api/health`);
console.log(`[watchdog] Frontend: ${FRONTEND_URL}/`);
console.log(`[watchdog] Interval: ${POLL_INTERVAL / 1000}s`);
console.log('');

// Initial check
poll();

// Periodic polling
const timer = setInterval(poll, POLL_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n[watchdog] Shutting down — ran ${state.checks} checks over ${formatUptime()}`);
  clearInterval(timer);
  process.exit(0);
});

process.on('SIGTERM', () => {
  clearInterval(timer);
  process.exit(0);
});
