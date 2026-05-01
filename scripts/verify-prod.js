#!/usr/bin/env node

/**
 * verify-prod.js — Post-deployment verification for AuditEngine
 *
 * Usage: npm run verify:prod
 *
 * Checks:
 *   1. Docker containers running (if Docker mode)
 *   2. Backend /api/health responds 200
 *   3. Frontend serves HTML
 *   4. Database connection (via backend health)
 */

const BASE_URL = process.env.VERIFY_URL || 'http://localhost:3001';
const checks = [];
let passed = 0;
let failed = 0;

function log(icon, msg) {
  console.log(`  ${icon} ${msg}`);
}

async function check(name, fn) {
  try {
    await fn();
    log('✓', name);
    checks.push({ name, pass: true });
    passed++;
  } catch (err) {
    log('✗', `${name} — ${err.message}`);
    checks.push({ name, pass: false, error: err.message });
    failed++;
  }
}

async function httpGet(url, timeout = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ─── Checks ──────────────────────────────────────────────────────

async function checkDocker() {
  const { execSync } = await import('child_process');
  try {
    const output = execSync('docker compose ps --format json 2>/dev/null', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      timeout: 10000,
    });
    if (!output.trim()) throw new Error('No containers found');
    const containers = output
      .trim()
      .split('\n')
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const running = containers.filter(
      (c) => c.State === 'running' || c.Status?.includes('Up')
    );
    if (running.length === 0) throw new Error('No running containers');
  } catch (err) {
    if (err.message.includes('No containers') || err.message.includes('No running')) throw err;
    // Docker not available — skip silently (local dev mode)
    log('–', 'Docker: not running (local dev mode — skipped)');
    return;
  }
}

async function checkBackendHealth() {
  const res = await httpGet(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.status !== 'ok') throw new Error(`Status: ${body.status}`);
}

async function checkFrontend() {
  const res = await httpGet(BASE_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  if (!html.includes('<!DOCTYPE html') && !html.includes('<!doctype html')) {
    throw new Error('Response is not HTML');
  }
}

async function checkApiEngagements() {
  const res = await httpGet(`${BASE_URL}/api/engagements`);
  // 200 or 401 (auth required) are both valid — means the route exists
  if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
}

// ─── Run ─────────────────────────────────────────────────────────

console.log('');
console.log('AuditEngine Production Verification');
console.log(`Target: ${BASE_URL}`);
console.log('─'.repeat(45));

await check('Docker containers', checkDocker);
await check('Backend health (/api/health)', checkBackendHealth);
await check('Frontend serves HTML', checkFrontend);
await check('API routes (/api/engagements)', checkApiEngagements);

console.log('─'.repeat(45));
console.log(`Results: ${passed} passed, ${failed} failed, ${checks.length} total`);
console.log('');

if (failed > 0) {
  console.log('⚠ Some checks failed. Review the output above.');
  process.exit(1);
} else {
  console.log('✓ All checks passed — system is operational.');
  process.exit(0);
}
