#!/usr/bin/env node

/**
 * AUDITENGINE AURA — WATCHDOG MONITOR
 *
 * Long-running process that health-checks all services,
 * auto-restarts failures, and provides a live console dashboard.
 *
 * Services monitored:
 *   - PostgreSQL (Docker, port 5432)
 *   - Express API (port 3001)
 *   - Vite Dev Server (port 5173)
 *
 * Usage: node scripts/start-watchdog.js
 */

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import http from "http";
import net from "net";
import { fileURLToPath } from "url";

// ============================================================================
// CONSTANTS
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PIDS_DIR = path.join(PROJECT_ROOT, ".pids");

const CONFIG = {
  checkInterval: 10_000,    // Health check every 10s
  renderInterval: 5_000,    // Dashboard refresh every 5s
  failThreshold: 3,         // Consecutive fails before restart
  restartCooldown: 30_000,  // Min 30s between restarts of same service
  maxRestartsPerHour: 5,    // Then mark as abandoned
};

// Terminal colors (copied from project conventions, not imported)
const C = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

const ICON = {
  ok: "\u2713",
  fail: "\u2717",
  warn: "\u26A0",
  restart: "\u21BB",
  watch: "\u25CF",
};

const IS_TTY = process.stdout.isTTY;

// ============================================================================
// HEALTH CHECKS
// ============================================================================

function httpCheck(port, pathStr = "/", timeout = 3000) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: "127.0.0.1", port, path: pathStr, timeout }, (res) => {
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
    });
    req.on("error", () => resolve({ ok: false, status: 0 }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0 }); });
  });
}

function tcpCheck(port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on("connect", () => { socket.destroy(); resolve({ ok: true }); });
    socket.on("error", () => { socket.destroy(); resolve({ ok: false }); });
    socket.on("timeout", () => { socket.destroy(); resolve({ ok: false }); });
    socket.connect(port, "127.0.0.1");
  });
}

function httpCheckWithTiming(port, pathStr = "/", timeout = 3000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get({ hostname: "127.0.0.1", port, path: pathStr, timeout }, (res) => {
      const latency = Date.now() - start;
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode, latency });
    });
    req.on("error", () => resolve({ ok: false, status: 0, latency: null }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0, latency: null }); });
  });
}

// ============================================================================
// PID MANAGEMENT
// ============================================================================

function ensurePidsDir() {
  if (!fs.existsSync(PIDS_DIR)) {
    fs.mkdirSync(PIDS_DIR, { recursive: true });
  }
}

function readPid(name) {
  const pidFile = path.join(PIDS_DIR, `${name}.pid`);
  try {
    const content = fs.readFileSync(pidFile, "utf-8").trim();
    const pid = parseInt(content, 10);
    return isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

function writePid(name, pid) {
  ensurePidsDir();
  fs.writeFileSync(path.join(PIDS_DIR, `${name}.pid`), String(pid));
}

function removePid(name) {
  const pidFile = path.join(PIDS_DIR, `${name}.pid`);
  try { fs.unlinkSync(pidFile); } catch { /* ignore */ }
}

function isPidRunning(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopProcess(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, "SIGTERM");
    return true;
  } catch {
    return false;
  }
}

function findProcessOnPort(port) {
  try {
    const output = execSync(`lsof -ti :${port}`, { encoding: "utf-8", timeout: 3000 }).trim();
    if (output) {
      const pids = output.split("\n").map((p) => parseInt(p, 10)).filter(Boolean);
      return pids[0] || null;
    }
  } catch { /* no process found */ }
  return null;
}

// ============================================================================
// SERVICE DEFINITIONS
// ============================================================================

const SERVICES = [
  {
    name: "PostgreSQL",
    key: "postgres",
    port: 5432,
    type: "tcp",
    dockerManaged: true,
  },
  {
    name: "Express API",
    key: "api",
    port: 3001,
    type: "http",
    healthPath: "/health",
    dockerManaged: false,
  },
  {
    name: "Vite Dev",
    key: "vite",
    port: 5173,
    type: "http",
    healthPath: "/",
    dockerManaged: false,
  },
];

// ============================================================================
// STATE TRACKER
// ============================================================================

const startTime = Date.now();
let totalChecks = 0;
let totalRestarts = 0;
const events = [];         // Recent event log (in-memory ring buffer)
const MAX_EVENTS = 50;

const state = {};
for (const svc of SERVICES) {
  state[svc.key] = {
    status: "unknown",     // healthy | unhealthy | restarting | abandoned | unknown
    consecutiveFails: 0,
    totalChecks: 0,
    healthyChecks: 0,
    restartCount: 0,
    restartTimestamps: [],
    lastRestart: 0,
    latency: null,
    pid: null,
  };
}

// ============================================================================
// SERVICE STARTERS
// ============================================================================

function startPostgres() {
  try {
    logEvent("RESTART", `Starting PostgreSQL via docker compose...`);
    execSync("docker compose up -d postgres", {
      cwd: PROJECT_ROOT,
      stdio: "pipe",
      timeout: 30_000,
    });
    logEvent("INFO", "PostgreSQL container started");
    return true;
  } catch (err) {
    logEvent("ERROR", `Failed to start PostgreSQL: ${err.message}`);
    return false;
  }
}

function startApi() {
  // Kill any stale process on port
  const existingPid = readPid("api") || findProcessOnPort(3001);
  if (existingPid && isPidRunning(existingPid)) {
    stopProcess(existingPid);
    // Give it a moment to release the port
    try { execSync("sleep 1"); } catch { /* */ }
  }
  removePid("api");

  const logPath = path.join(PIDS_DIR, "api.log");
  const out = fs.openSync(logPath, "a");
  const err = fs.openSync(logPath, "a");

  const child = spawn("node", ["server/index.js"], {
    cwd: PROJECT_ROOT,
    detached: true,
    stdio: ["ignore", out, err],
    env: { ...process.env, PORT: "3001" },
  });

  child.unref();
  writePid("api", child.pid);
  logEvent("INFO", `Express API started (PID ${child.pid})`);
  return child.pid;
}

function startVite() {
  const existingPid = readPid("vite") || findProcessOnPort(5173);
  if (existingPid && isPidRunning(existingPid)) {
    stopProcess(existingPid);
    try { execSync("sleep 1"); } catch { /* */ }
  }
  removePid("vite");

  const logPath = path.join(PIDS_DIR, "vite.log");
  const out = fs.openSync(logPath, "a");
  const err = fs.openSync(logPath, "a");

  const child = spawn("npx", ["vite"], {
    cwd: PROJECT_ROOT,
    detached: true,
    stdio: ["ignore", out, err],
  });

  child.unref();
  writePid("vite", child.pid);
  logEvent("INFO", `Vite Dev started (PID ${child.pid})`);
  return child.pid;
}

const starters = {
  postgres: startPostgres,
  api: startApi,
  vite: startVite,
};

// ============================================================================
// RESTART LOGIC
// ============================================================================

function maybeRestart(svc) {
  const s = state[svc.key];

  if (s.status === "abandoned" || s.status === "restarting") return;
  if (s.consecutiveFails < CONFIG.failThreshold) return;

  // Cooldown check
  if (Date.now() - s.lastRestart < CONFIG.restartCooldown) return;

  // Hourly restart limit
  const oneHourAgo = Date.now() - 3600_000;
  s.restartTimestamps = s.restartTimestamps.filter((t) => t > oneHourAgo);
  if (s.restartTimestamps.length >= CONFIG.maxRestartsPerHour) {
    s.status = "abandoned";
    logEvent("ABANDON", `${svc.name} exceeded ${CONFIG.maxRestartsPerHour} restarts/hour — abandoned`);
    return;
  }

  // Perform restart
  s.status = "restarting";
  logEvent("ERROR", `${svc.name} failed (${s.consecutiveFails}/${CONFIG.failThreshold})`);
  logEvent("RESTART", `Restarting ${svc.name}...`);

  const starter = starters[svc.key];
  if (starter) {
    const result = starter();
    if (result !== false) {
      s.restartCount++;
      s.restartTimestamps.push(Date.now());
      s.lastRestart = Date.now();
      s.consecutiveFails = 0;
      totalRestarts++;
    } else {
      s.status = "unhealthy";
    }
  }
}

// ============================================================================
// EVENT LOGGING
// ============================================================================

function logEvent(level, message) {
  const now = new Date();
  const ts = now.toTimeString().slice(0, 8);
  const entry = { ts, level, message };
  events.push(entry);
  if (events.length > MAX_EVENTS) events.shift();

  // Append to file log
  const logLine = `[${now.toISOString()}] ${level.padEnd(8)} ${message}\n`;
  try {
    ensurePidsDir();
    fs.appendFileSync(path.join(PIDS_DIR, "watchdog.log"), logLine);
  } catch { /* best effort */ }
}

// ============================================================================
// RESOURCE STATS
// ============================================================================

function getProcessStats(pid) {
  if (!pid || !isPidRunning(pid)) return null;
  try {
    const output = execSync(`ps -o rss=,pcpu= -p ${pid}`, { encoding: "utf-8", timeout: 2000 }).trim();
    const [rss, cpu] = output.split(/\s+/);
    return {
      memMB: (parseInt(rss, 10) / 1024).toFixed(1),
      cpu: parseFloat(cpu).toFixed(1),
    };
  } catch {
    return null;
  }
}

// ============================================================================
// CONSOLE RENDERER
// ============================================================================

function formatUptime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function uptimePercent(svcKey) {
  const s = state[svcKey];
  if (s.totalChecks === 0) return "—";
  return ((s.healthyChecks / s.totalChecks) * 100).toFixed(1) + "%";
}

function renderStatus() {
  if (!IS_TTY) {
    // Non-TTY: one-line summary
    const parts = SERVICES.map((svc) => {
      const s = state[svc.key];
      const icon = s.status === "healthy" ? ICON.ok : ICON.fail;
      return `${svc.name}:${icon}`;
    });
    process.stdout.write(`[watchdog] ${parts.join(" | ")} | checks:${totalChecks} restarts:${totalRestarts}\n`);
    return;
  }

  // TTY: full dashboard
  process.stdout.write("\x1b[2J\x1b[H"); // clear screen + cursor home

  const w = 60;
  const line = "\u2550".repeat(w - 2);
  const headerText = "AuditEngine AURA \u2014 Watchdog Monitor";
  const pad = Math.max(0, Math.floor((w - 2 - headerText.length) / 2));

  console.log(`${C.cyan}\u2554${line}\u2557${C.reset}`);
  console.log(`${C.cyan}\u2551${" ".repeat(pad)}${C.bold}${headerText}${C.reset}${C.cyan}${" ".repeat(w - 2 - pad - headerText.length)}\u2551${C.reset}`);
  console.log(`${C.cyan}\u255A${line}\u255D${C.reset}`);
  console.log();

  const uptime = formatUptime(Date.now() - startTime);
  console.log(`  ${C.dim}Uptime: ${C.reset}${uptime}     ${C.dim}Checks: ${C.reset}${totalChecks}     ${C.dim}Restarts: ${C.reset}${totalRestarts}`);
  console.log();

  // Table header
  console.log(`  ${C.bold}${"SERVICE".padEnd(15)} ${"STATUS".padEnd(14)} ${"PORT".padEnd(7)} ${"LATENCY".padEnd(10)} ${"UPTIME".padEnd(9)} RESTARTS${C.reset}`);

  for (const svc of SERVICES) {
    const s = state[svc.key];
    let statusStr;
    switch (s.status) {
      case "healthy":
        statusStr = `${C.green}${ICON.ok} Healthy${C.reset}`;
        break;
      case "unhealthy":
        statusStr = `${C.red}${ICON.fail} Unhealthy${C.reset}`;
        break;
      case "restarting":
        statusStr = `${C.yellow}${ICON.restart} Restarting${C.reset}`;
        break;
      case "abandoned":
        statusStr = `${C.red}${ICON.warn} Abandoned${C.reset}`;
        break;
      default:
        statusStr = `${C.dim}? Unknown${C.reset}`;
    }

    // Pad without ANSI codes for alignment
    const rawStatus = s.status === "healthy" ? `${ICON.ok} Healthy`
      : s.status === "unhealthy" ? `${ICON.fail} Unhealthy`
      : s.status === "restarting" ? `${ICON.restart} Restarting`
      : s.status === "abandoned" ? `${ICON.warn} Abandoned`
      : "? Unknown";
    const statusPad = " ".repeat(Math.max(0, 14 - rawStatus.length));

    const latStr = s.latency != null ? `${s.latency}ms` : "\u2014";
    const upPct = uptimePercent(svc.key);

    console.log(`  ${svc.name.padEnd(15)} ${statusStr}${statusPad} ${String(svc.port).padEnd(7)} ${latStr.padEnd(10)} ${upPct.padEnd(9)} ${s.restartCount}`);
  }

  console.log();

  // Recent events
  console.log(`  ${C.bold}Recent Events:${C.reset}`);
  const recentEvents = events.slice(-6);
  if (recentEvents.length === 0) {
    console.log(`  ${C.dim}(no events yet)${C.reset}`);
  } else {
    for (const ev of recentEvents) {
      let color = C.dim;
      if (ev.level === "ERROR" || ev.level === "ABANDON") color = C.red;
      else if (ev.level === "RESTART") color = C.yellow;
      else if (ev.level === "INFO") color = C.green;
      else if (ev.level === "WARN") color = C.yellow;
      console.log(`  ${C.dim}[${ev.ts}]${C.reset} ${color}${ev.level.padEnd(8)}${C.reset} ${ev.message}`);
    }
  }

  console.log();
  console.log(`  ${C.dim}Watching every ${CONFIG.checkInterval / 1000}s \u2502 Ctrl+C to stop \u2502 Log: .pids/watchdog.log${C.reset}`);
}

// ============================================================================
// MAIN LOOP
// ============================================================================

async function checkAll() {
  totalChecks++;

  for (const svc of SERVICES) {
    const s = state[svc.key];
    s.totalChecks++;

    let result;
    if (svc.type === "tcp") {
      result = await tcpCheck(svc.port);
      s.latency = null;
    } else {
      result = await httpCheckWithTiming(svc.port, svc.healthPath || "/");
      s.latency = result.ok ? result.latency : null;
    }

    if (result.ok) {
      s.healthyChecks++;
      s.consecutiveFails = 0;
      if (s.status !== "abandoned") {
        s.status = "healthy";
      }
      // Track PID for non-docker services
      if (!svc.dockerManaged) {
        const pid = readPid(svc.key);
        if (pid && isPidRunning(pid)) {
          s.pid = pid;
        } else {
          // Try to find via port
          s.pid = findProcessOnPort(svc.port);
        }
      }
    } else {
      s.consecutiveFails++;
      if (s.status !== "abandoned" && s.status !== "restarting") {
        s.status = "unhealthy";
      }
      if (s.consecutiveFails === 1) {
        logEvent("WARN", `${svc.name} health check failed (1/${CONFIG.failThreshold})`);
      }
      maybeRestart(svc);
    }
  }
}

// ============================================================================
// DUPLICATE WATCHDOG CHECK
// ============================================================================

function checkDuplicateWatchdog() {
  const existingPid = readPid("watchdog");
  if (existingPid && isPidRunning(existingPid)) {
    console.error(`${C.red}${ICON.fail} Watchdog already running (PID ${existingPid}). Exiting.${C.reset}`);
    process.exit(1);
  }
  // Clean up stale PID
  if (existingPid) removePid("watchdog");
}

function cleanStalePids() {
  for (const svc of SERVICES) {
    if (svc.dockerManaged) continue;
    const pid = readPid(svc.key);
    if (pid && !isPidRunning(pid)) {
      logEvent("INFO", `Removed stale PID file for ${svc.name} (PID ${pid})`);
      removePid(svc.key);
    }
  }
}

// ============================================================================
// SHUTDOWN HANDLER
// ============================================================================

function shutdown(signal) {
  logEvent("INFO", `Watchdog stopping (${signal})`);
  removePid("watchdog");
  clearInterval(checkTimer);
  clearInterval(renderTimer);

  if (IS_TTY) {
    console.log(`\n${C.cyan}${ICON.watch} Watchdog stopped. Services are still running.${C.reset}`);
  }
  process.exit(0);
}

let checkTimer;
let renderTimer;

// ============================================================================
// ENTRY POINT
// ============================================================================

async function main() {
  ensurePidsDir();
  checkDuplicateWatchdog();
  cleanStalePids();

  // Register ourselves
  writePid("watchdog", process.pid);

  logEvent("INFO", "Watchdog started");

  // Initial check
  await checkAll();
  renderStatus();

  // Start loops
  checkTimer = setInterval(async () => {
    await checkAll();
  }, CONFIG.checkInterval);

  renderTimer = setInterval(() => {
    renderStatus();
  }, CONFIG.renderInterval);

  // Shutdown handlers
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error(`${C.red}Watchdog fatal error: ${err.message}${C.reset}`);
  removePid("watchdog");
  process.exit(1);
});
