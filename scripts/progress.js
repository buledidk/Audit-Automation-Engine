#!/usr/bin/env node

/**
 * Audit Engine — Progress Tracker CLI
 * ====================================
 * npm run progress           — Full progress report
 * npm run progress:init      — Initialize default tasks
 * npm run progress:add       — Add a task
 * npm run progress:start     — Start a task
 * npm run progress:complete  — Complete a task
 * npm run progress:reset     — Reset all data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', '.progress.json');

// ── Colors (no dependency needed) ──────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  white: '\x1b[97m',
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgRed: '\x1b[41m',
};

// ── Data persistence ───────────────────────────────────────────────────────

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    return { tasks: [], builds: [], createdAt: new Date().toISOString() };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function save(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── Render helpers ─────────────────────────────────────────────────────────

function bar(percent, width = 30) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const color = percent === 100 ? c.green : percent > 50 ? c.yellow : c.red;
  return `${color}${'█'.repeat(filled)}${c.gray}${'░'.repeat(empty)}${c.reset} ${c.bold}${percent}%${c.reset}`;
}

function statusIcon(status) {
  switch (status) {
    case 'completed': return `${c.green}✓${c.reset}`;
    case 'in-progress': return `${c.yellow}◉${c.reset}`;
    default: return `${c.gray}○${c.reset}`;
  }
}

function line(char = '─', len = 60) {
  return c.gray + char.repeat(len) + c.reset;
}

// ── Commands ───────────────────────────────────────────────────────────────

function init() {
  const data = load();
  if (data.tasks.length > 0) {
    console.log(`${c.yellow}⚠  Progress data already exists (${data.tasks.length} tasks). Use reset first to start fresh.${c.reset}`);
    return;
  }

  const defaults = [
    { name: 'Supabase schema deployment', category: 'Database' },
    { name: 'Prisma integration', category: 'Database' },
    { name: 'RLS policies', category: 'Database' },
    { name: 'Auth implementation', category: 'Backend' },
    { name: 'API routes', category: 'Backend' },
    { name: 'Real-time subscriptions', category: 'Backend' },
    { name: 'Dashboard components', category: 'Frontend' },
    { name: 'Working paper UI', category: 'Frontend' },
    { name: 'Export functionality', category: 'Frontend' },
    { name: 'Unit tests', category: 'Testing' },
    { name: 'Integration tests', category: 'Testing' },
    { name: 'E2E tests', category: 'Testing' },
    { name: 'CI/CD pipeline', category: 'DevOps' },
    { name: 'Vercel deployment', category: 'DevOps' },
    { name: 'Security audit', category: 'DevOps' },
  ];

  data.tasks = defaults.map((t, i) => ({
    id: i + 1,
    name: t.name,
    category: t.category,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));

  save(data);
  console.log(`${c.green}✓${c.reset} Initialized ${defaults.length} default tasks.`);
  report();
}

function addTask(name) {
  if (!name) {
    console.log(`${c.red}✗ Usage: npm run progress:add -- "task name"${c.reset}`);
    return;
  }
  const data = load();
  const id = data.tasks.length > 0 ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1;
  data.tasks.push({
    id,
    name,
    category: 'Custom',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  save(data);
  console.log(`${c.green}✓${c.reset} Added task #${id}: ${name}`);
}

function startTask(name) {
  if (!name) {
    console.log(`${c.red}✗ Usage: npm run progress:start -- "task name"${c.reset}`);
    return;
  }
  const data = load();
  const task = data.tasks.find(t => t.name.toLowerCase().includes(name.toLowerCase()));
  if (!task) {
    console.log(`${c.red}✗ No task matching "${name}"${c.reset}`);
    return;
  }
  task.status = 'in-progress';
  task.startedAt = new Date().toISOString();
  save(data);
  console.log(`${c.yellow}◉${c.reset} Started: ${task.name}`);
}

function completeTask(name) {
  if (!name) {
    console.log(`${c.red}✗ Usage: npm run progress:complete -- "task name"${c.reset}`);
    return;
  }
  const data = load();
  const task = data.tasks.find(t => t.name.toLowerCase().includes(name.toLowerCase()));
  if (!task) {
    console.log(`${c.red}✗ No task matching "${name}"${c.reset}`);
    return;
  }
  task.status = 'completed';
  task.completedAt = new Date().toISOString();
  save(data);
  console.log(`${c.green}✓${c.reset} Completed: ${task.name}`);
}

function reset() {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  console.log(`${c.green}✓${c.reset} Progress data reset.`);
}

// ── Build tracking ─────────────────────────────────────────────────────────

function trackBuild() {
  const data = load();
  const start = Date.now();
  let lintOk = false, buildOk = false, testResult = null;

  try {
    execSync('npm run lint', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    lintOk = true;
  } catch { lintOk = false; }

  try {
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    buildOk = true;
  } catch { buildOk = false; }

  try {
    const out = execSync('npm run test -- --run 2>&1', { cwd: path.join(__dirname, '..'), encoding: 'utf-8' });
    const passMatch = out.match(/(\d+) passed/);
    const failMatch = out.match(/(\d+) failed/);
    testResult = {
      passed: passMatch ? parseInt(passMatch[1]) : 0,
      failed: failMatch ? parseInt(failMatch[1]) : 0,
    };
  } catch (e) {
    const out = e.stdout || '';
    const passMatch = out.match(/(\d+) passed/);
    const failMatch = out.match(/(\d+) failed/);
    testResult = {
      passed: passMatch ? parseInt(passMatch[1]) : 0,
      failed: failMatch ? parseInt(failMatch[1]) : 0,
    };
  }

  const duration = ((Date.now() - start) / 1000).toFixed(1);

  const build = {
    timestamp: new Date().toISOString(),
    lint: lintOk,
    build: buildOk,
    tests: testResult,
    duration: `${duration}s`,
  };

  if (!data.builds) data.builds = [];
  data.builds.push(build);
  save(data);

  console.log(`\n${c.bold}${c.cyan}Build Report${c.reset}`);
  console.log(line());
  console.log(`  Lint:   ${lintOk ? `${c.green}PASS${c.reset}` : `${c.red}FAIL${c.reset}`}`);
  console.log(`  Build:  ${buildOk ? `${c.green}PASS${c.reset}` : `${c.red}FAIL${c.reset}`}`);
  console.log(`  Tests:  ${c.green}${testResult.passed} passed${c.reset}  ${testResult.failed > 0 ? `${c.red}${testResult.failed} failed${c.reset}` : ''}`);
  console.log(`  Time:   ${duration}s`);
  console.log(line());
}

// ── Full report ────────────────────────────────────────────────────────────

function report() {
  const data = load();
  const tasks = data.tasks || [];

  if (tasks.length === 0) {
    console.log(`\n${c.yellow}No tasks yet. Run: npm run progress:init${c.reset}\n`);
    return;
  }

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const percent = Math.round((completed / tasks.length) * 100);

  console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║          AUDIT ENGINE — PROJECT PROGRESS                 ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════════════╝${c.reset}\n`);

  // Overall bar
  console.log(`  ${c.bold}Overall${c.reset}  ${bar(percent)}`);
  console.log(`           ${c.green}${completed} done${c.reset}  ${c.yellow}${inProgress} active${c.reset}  ${c.gray}${pending} pending${c.reset}\n`);
  console.log(line());

  // Group by category
  const categories = [...new Set(tasks.map(t => t.category))];
  for (const cat of categories) {
    const catTasks = tasks.filter(t => t.category === cat);
    const catDone = catTasks.filter(t => t.status === 'completed').length;
    const catPercent = Math.round((catDone / catTasks.length) * 100);

    console.log(`\n  ${c.bold}${c.magenta}${cat}${c.reset}  ${bar(catPercent, 20)}`);
    for (const t of catTasks) {
      console.log(`    ${statusIcon(t.status)}  ${t.name}`);
    }
  }

  // Recent build
  if (data.builds && data.builds.length > 0) {
    const last = data.builds[data.builds.length - 1];
    console.log(`\n${line()}`);
    console.log(`\n  ${c.bold}Last Build${c.reset}  ${c.dim}${last.timestamp}${c.reset}`);
    console.log(`    Lint: ${last.lint ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`}  Build: ${last.build ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`}  Tests: ${c.green}${last.tests?.passed || 0}${c.reset}/${c.red}${last.tests?.failed || 0}${c.reset}  (${last.duration})`);
  }

  console.log(`\n${line()}\n`);
}

// ── CLI Router ─────────────────────────────────────────────────────────────

const [,, command, ...rest] = process.argv;
const arg = rest.join(' ');

switch (command) {
  case 'init':       init(); break;
  case 'add':        addTask(arg); break;
  case 'start':      startTask(arg); break;
  case 'complete':   completeTask(arg); break;
  case 'reset':      reset(); break;
  case 'build':      trackBuild(); break;
  default:           report(); break;
}
