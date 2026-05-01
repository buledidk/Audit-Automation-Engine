#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import http from 'http';
import net from 'net';
import { fileURLToPath } from 'url';

// ── Constants ────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const WIDTH = 64;

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

const ICON = {
  pass: `${C.green}✓${C.reset}`,
  fail: `${C.red}✗${C.reset}`,
  warn: `${C.yellow}⚠${C.reset}`,
  info: `${C.cyan}●${C.reset}`,
};

const PORTS = {
  vite: 5173,
  api: 3001,
  postgres: 5432,
};

// ── Utilities ────────────────────────────────────────────────

function exec(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf8', timeout: 5000 }).trim();
  } catch {
    return null;
  }
}

function httpCheck(port, timeout = 3000) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port, timeout }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    setTimeout(() => { req.destroy(); resolve(false); }, timeout);
  });
}

function tcpCheck(port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(timeout);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function dirStats(dirPath) {
  let totalSize = 0;
  let fileCount = 0;
  function walk(dir) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else {
          totalSize += fs.statSync(full).size;
          fileCount++;
        }
      }
    } catch { /* ignore */ }
  }
  walk(dirPath);
  return { totalSize, fileCount };
}

function countFiles(dir, extensions) {
  let count = 0;
  function walk(d) {
    try {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        if (entry.isDirectory()) {
          walk(full);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          count++;
        }
      }
    } catch { /* ignore */ }
  }
  walk(dir);
  return count;
}

function estimateLOC(dir, extensions) {
  let loc = 0;
  function walk(d) {
    try {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        if (entry.isDirectory()) {
          walk(full);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          try {
            const content = fs.readFileSync(full, 'utf8');
            loc += content.split('\n').length;
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  }
  walk(dir);
  return loc;
}

function padRight(str, len) {
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, '');
  return str + ' '.repeat(Math.max(0, len - stripped.length));
}

function line(char = '═', label = '') {
  if (label) {
    const rest = WIDTH - 5 - label.length;
    return `${C.cyan}${char.repeat(3)} ${label} ${char.repeat(Math.max(1, rest))}${C.reset}`;
  }
  return `${C.cyan}${char.repeat(WIDTH)}${C.reset}`;
}

// ── Gather Functions ─────────────────────────────────────────

function gatherProject() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
    const branch = exec('git rev-parse --abbrev-ref HEAD') || 'unknown';
    const commitCount = exec('git rev-list --count HEAD') || '0';
    const latestHash = exec('git rev-parse --short HEAD') || 'N/A';
    const nodeVersion = process.version;
    const timestamp = new Date().toLocaleString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }).replace(',', '');

    return {
      name: pkg.name || 'unknown',
      version: pkg.version || '0.0.0',
      branch,
      commitCount,
      latestHash,
      nodeVersion,
      timestamp,
    };
  } catch {
    return { name: 'unknown', version: '0.0.0', branch: 'unknown', commitCount: '0', latestHash: 'N/A', nodeVersion: process.version, timestamp: new Date().toISOString() };
  }
}

async function gatherServices() {
  const [vite, api, postgres] = await Promise.all([
    httpCheck(PORTS.vite),
    httpCheck(PORTS.api),
    tcpCheck(PORTS.postgres),
  ]);
  return [
    { name: 'Vite Dev', running: vite, port: PORTS.vite },
    { name: 'Express API', running: api, port: PORTS.api },
    { name: 'PostgreSQL', running: postgres, port: PORTS.postgres },
  ];
}

function gatherBuild() {
  const distPath = path.join(PROJECT_ROOT, 'dist');
  const exists = fs.existsSync(distPath);
  if (!exists) {
    return { exists: false, size: null, fileCount: 0, lastModified: null, hasIndex: false };
  }
  const stats = dirStats(distPath);
  let lastModified = null;
  try {
    lastModified = fs.statSync(distPath).mtime;
  } catch { /* ignore */ }

  const hasIndex = fs.existsSync(path.join(distPath, 'index.html'));
  return {
    exists: true,
    size: stats.totalSize,
    fileCount: stats.fileCount,
    lastModified,
    hasIndex,
  };
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function gatherTests() {
  try {
    const raw = execSync('npx vitest run 2>&1', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      timeout: 30000,
    });
    const result = stripAnsi(raw);

    const filesMatch = result.match(/Test Files\s+(\d+)\s+passed/);
    const testsMatch = result.match(/Tests\s+(\d+)\s+passed/);
    const durationMatch = result.match(/Duration\s+([\d.]+\s*\w+)/);

    return {
      ran: true,
      filesPassed: filesMatch ? parseInt(filesMatch[1], 10) : 0,
      testsPassed: testsMatch ? parseInt(testsMatch[1], 10) : 0,
      duration: durationMatch ? durationMatch[1] : 'N/A',
      failed: false,
      raw: null,
    };
  } catch (err) {
    const output = stripAnsi(err.stdout || err.stderr || '');
    const filesMatch = output.match(/Test Files\s+(\d+)\s+passed/);
    const failedFilesMatch = output.match(/Test Files\s+(\d+)\s+failed/);
    const testsMatch = output.match(/Tests\s+(\d+)\s+passed/);
    const failedTestsMatch = output.match(/Tests\s+(\d+)\s+failed/);
    const durationMatch = output.match(/Duration\s+([\d.]+\s*\w+)/);

    return {
      ran: true,
      filesPassed: filesMatch ? parseInt(filesMatch[1], 10) : 0,
      filesFailed: failedFilesMatch ? parseInt(failedFilesMatch[1], 10) : 0,
      testsPassed: testsMatch ? parseInt(testsMatch[1], 10) : 0,
      testsFailed: failedTestsMatch ? parseInt(failedTestsMatch[1], 10) : 0,
      duration: durationMatch ? durationMatch[1] : 'N/A',
      failed: true,
      raw: output.slice(-200),
    };
  }
}

function gatherCodebase() {
  const srcPath = path.join(PROJECT_ROOT, 'src');
  if (!fs.existsSync(srcPath)) {
    return { sourceFiles: 0, components: 0, services: 0, pages: 0, loc: 0 };
  }

  const sourceFiles = countFiles(srcPath, ['.js', '.jsx', '.ts', '.tsx']);

  let components = 0;
  const compDir = path.join(srcPath, 'components');
  if (fs.existsSync(compDir)) {
    components = countFiles(compDir, ['.js', '.jsx', '.ts', '.tsx']);
  }

  let services = 0;
  const svcDir = path.join(srcPath, 'services');
  if (fs.existsSync(svcDir)) {
    services = countFiles(svcDir, ['.js', '.jsx', '.ts', '.tsx']);
  }

  let pages = 0;
  const pagesDir = path.join(srcPath, 'pages');
  if (fs.existsSync(pagesDir)) {
    pages = countFiles(pagesDir, ['.js', '.jsx', '.ts', '.tsx']);
  }

  const loc = estimateLOC(srcPath, ['.js', '.jsx', '.ts', '.tsx']);

  return { sourceFiles, components, services, pages, loc };
}

function gatherGit() {
  const branch = exec('git rev-parse --abbrev-ref HEAD') || 'unknown';
  const remote = exec('git remote -v') || '';
  const hasRemote = remote.length > 0;
  const remoteName = hasRemote ? remote.split('\n')[0].split('\t')[1]?.split(' ')[0] || 'unknown' : null;

  const statusRaw = exec('git status --porcelain') || '';
  const uncommitted = statusRaw ? statusRaw.split('\n').filter(l => l.trim()).length : 0;

  const logRaw = exec('git log --oneline -5') || '';
  const commits = logRaw ? logRaw.split('\n').filter(l => l.trim()).map(l => {
    const [hash, ...rest] = l.split(' ');
    return { hash, message: rest.join(' ') };
  }) : [];

  return { branch, hasRemote, remoteName, uncommitted, commits };
}

function gatherActions() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
    const scripts = pkg.scripts || {};
    const descriptions = {
      dev: 'Start dev server',
      build: 'Build for production',
      test: 'Run tests',
      lint: 'Lint codebase',
      preview: 'Preview production build',
      dashboard: 'This dashboard',
      format: 'Format code',
      'format:check': 'Check formatting',
      'test:watch': 'Run tests in watch mode',
      'test:coverage': 'Run tests with coverage',
      'test:load': 'Run load tests',
    };
    return Object.keys(scripts).map(name => ({
      command: `npm run ${name}`,
      description: descriptions[name] || scripts[name],
    }));
  } catch {
    return [];
  }
}

// ── Render Functions ─────────────────────────────────────────

function renderHeader(data) {
  const title = 'AuditEngine v10 AURA — Orchestrator Dashboard';
  const pad = Math.max(0, WIDTH - 4 - title.length);
  const left = Math.floor(pad / 2);
  const right = pad - left;

  console.log(`${C.cyan}╔${'═'.repeat(WIDTH - 2)}╗${C.reset}`);
  console.log(`${C.cyan}║${C.reset}${' '.repeat(left + 1)}${C.bold}${C.magenta}${title}${C.reset}${' '.repeat(right + 1)}${C.cyan}║${C.reset}`);
  console.log(`${C.cyan}╚${'═'.repeat(WIDTH - 2)}╝${C.reset}`);
  console.log();
  console.log(`  ${C.dim}Project:${C.reset}  ${C.white}${data.name} v${data.version}${C.reset}`);
  console.log(`  ${C.dim}Branch:${C.reset}   ${C.white}${data.branch}${C.reset} (${data.commitCount} commits, latest: ${C.yellow}${data.latestHash}${C.reset})`);
  console.log(`  ${C.dim}Node:${C.reset}     ${C.white}${data.nodeVersion}${C.reset}`);
  console.log(`  ${C.dim}Time:${C.reset}     ${C.white}${data.timestamp}${C.reset}`);
  console.log();
}

function renderServices(services) {
  console.log(line('═', 'Services'));
  console.log();
  console.log(`  ${padRight(`${C.bold}SERVICE${C.reset}`, 24)}${padRight(`${C.bold}STATUS${C.reset}`, 24)}${C.bold}PORT${C.reset}`);
  for (const svc of services) {
    const status = svc.running
      ? `${ICON.pass} ${C.green}Running${C.reset}`
      : `${ICON.fail} ${C.red}Not Running${C.reset}`;
    console.log(`  ${padRight(svc.name, 17)}${padRight(status, 24)}${svc.port}`);
  }
  console.log();
}

function renderBuild(build) {
  console.log(line('═', 'Build'));
  console.log();
  if (!build.exists) {
    console.log(`  ${C.dim}dist/ exists:${C.reset}    ${ICON.fail} ${C.red}No (run npm run build)${C.reset}`);
  } else {
    console.log(`  ${C.dim}dist/ exists:${C.reset}    ${ICON.pass} ${C.green}Yes${C.reset} (${formatSize(build.size)}, ${build.fileCount} files)`);
    if (build.lastModified) {
      const d = new Date(build.lastModified);
      console.log(`  ${C.dim}Last built:${C.reset}      ${d.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}`);
    }
    console.log(`  ${C.dim}index.html:${C.reset}      ${build.hasIndex ? `${ICON.pass} ${C.green}Present${C.reset}` : `${ICON.fail} ${C.red}Missing${C.reset}`}`);
  }
  console.log();
}

function renderTests(tests) {
  console.log(line('═', 'Tests'));
  console.log();
  if (!tests.ran) {
    console.log(`  ${ICON.warn} ${C.yellow}Tests did not run${C.reset}`);
  } else if (tests.failed) {
    if (tests.filesFailed) {
      console.log(`  ${C.dim}Test files:${C.reset}      ${ICON.fail} ${C.red}${tests.filesFailed} failed${C.reset}${tests.filesPassed ? `, ${C.green}${tests.filesPassed} passed${C.reset}` : ''}`);
    }
    if (tests.testsFailed) {
      console.log(`  ${C.dim}Tests:${C.reset}           ${ICON.fail} ${C.red}${tests.testsFailed} failed${C.reset}${tests.testsPassed ? `, ${C.green}${tests.testsPassed} passed${C.reset}` : ''}`);
    }
    if (tests.duration !== 'N/A') {
      console.log(`  ${C.dim}Duration:${C.reset}        ${tests.duration}`);
    }
  } else {
    console.log(`  ${C.dim}Test files:${C.reset}      ${ICON.pass} ${C.green}${tests.filesPassed} passed${C.reset}`);
    console.log(`  ${C.dim}Tests:${C.reset}           ${ICON.pass} ${C.green}${tests.testsPassed} passed${C.reset}`);
    console.log(`  ${C.dim}Duration:${C.reset}        ${tests.duration}`);
  }
  console.log();
}

function renderCodebase(code) {
  console.log(line('═', 'Codebase'));
  console.log();
  console.log(`  ${C.dim}Source files:${C.reset}    ~${code.sourceFiles} JS/JSX`);
  console.log(`  ${C.dim}Components:${C.reset}      ~${code.components}`);
  console.log(`  ${C.dim}Services:${C.reset}        ${code.services}`);
  console.log(`  ${C.dim}Pages:${C.reset}           ${code.pages}`);
  console.log(`  ${C.dim}Est. LOC:${C.reset}        ~${code.loc.toLocaleString()}`);
  console.log();
}

function renderGit(git) {
  console.log(line('═', 'Git'));
  console.log();
  console.log(`  ${C.dim}Branch:${C.reset}          ${C.white}${git.branch}${C.reset}`);
  console.log(`  ${C.dim}Remote:${C.reset}          ${git.hasRemote ? `${ICON.pass} ${git.remoteName}` : `${ICON.fail} ${C.red}None${C.reset}`}`);
  console.log(`  ${C.dim}Uncommitted:${C.reset}     ${git.uncommitted > 0 ? `${ICON.warn} ${C.yellow}${git.uncommitted} file${git.uncommitted > 1 ? 's' : ''}${C.reset}` : `${ICON.pass} ${C.green}Clean${C.reset}`}`);
  if (git.commits.length > 0) {
    console.log(`  ${C.dim}Recent:${C.reset}`);
    for (const c of git.commits.slice(0, 3)) {
      const msg = c.message.length > 42 ? c.message.slice(0, 39) + '...' : c.message;
      console.log(`    ${C.yellow}${c.hash}${C.reset}  ${msg}`);
    }
  }
  console.log();
}

function renderActions(actions) {
  console.log(line('═', 'Quick Actions'));
  console.log();
  const show = ['dev', 'build', 'test', 'lint', 'dashboard'];
  for (const action of actions) {
    const scriptName = action.command.replace('npm run ', '');
    if (show.includes(scriptName)) {
      console.log(`  ${padRight(`${C.cyan}${action.command}${C.reset}`, 30)}${C.dim}${action.description}${C.reset}`);
    }
  }
  console.log();
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();

  console.log();

  // Gather data (parallel where possible)
  const projectData = gatherProject();
  const [services, build, codebase, git, actions] = await Promise.all([
    gatherServices(),
    Promise.resolve(gatherBuild()),
    Promise.resolve(gatherCodebase()),
    Promise.resolve(gatherGit()),
    Promise.resolve(gatherActions()),
  ]);

  // Render header and non-test sections first
  renderHeader(projectData);
  renderServices(services);
  renderBuild(build);

  // Run tests (can be slow)
  const tests = gatherTests();
  renderTests(tests);

  renderCodebase(codebase);
  renderGit(git);
  renderActions(actions);

  // Footer
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`${C.dim}${'─'.repeat(WIDTH)}${C.reset}`);
  console.log(`  ${C.dim}Generated in ${elapsed}s${C.reset}`);
  console.log();
}

main().catch((err) => {
  console.error(`${C.red}Dashboard error: ${err.message}${C.reset}`);
  process.exit(1);
});
