#!/usr/bin/env node

/**
 * NPM Progress Tracker for Audit Automation Engine
 * Tracks build progress, project metrics, and task completion status.
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, extname, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PROGRESS_FILE = join(ROOT, '.progress.json');

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
  magenta: '\x1b[35m',
};

function c(color, text) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function progressBar(percent, width = 30) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const color = percent >= 80 ? 'green' : percent >= 50 ? 'yellow' : 'red';
  return `${c(color, bar)} ${c('bold', `${percent.toFixed(1)}%`)}`;
}

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return {
    tasks: [],
    builds: [],
    createdAt: new Date().toISOString(),
  };
}

function saveProgress(data) {
  data.updatedAt = new Date().toISOString();
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function getProjectMetrics() {
  const srcFiles = [];
  const exts = new Map();
  let totalLines = 0;

  function walk(dir, depth = 0) {
    if (depth > 5) return;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = extname(entry.name) || '(no ext)';
          exts.set(ext, (exts.get(ext) || 0) + 1);
          try {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n').length;
            totalLines += lines;
            srcFiles.push({ path: fullPath.replace(ROOT + '/', ''), lines, ext, size: statSync(fullPath).size });
          } catch { /* binary file */ }
        }
      }
    } catch { /* permission error */ }
  }

  walk(ROOT);
  return { srcFiles, exts, totalLines };
}

function cmdReport() {
  const data = loadProgress();
  const metrics = getProjectMetrics();

  console.log(`\n${c('bold', c('cyan', '╔══════════════════════════════════════════════════╗'))}`);
  console.log(`${c('bold', c('cyan', '║'))}  ${c('bold', '📊 Audit Automation Engine — Progress Report')}   ${c('bold', c('cyan', '║'))}`);
  console.log(`${c('bold', c('cyan', '╚══════════════════════════════════════════════════╝'))}\n`);

  // Project metrics
  console.log(c('bold', '  Project Metrics'));
  console.log(c('dim', '  ─────────────────────────────────────────'));
  console.log(`  Source files:  ${c('cyan', String(metrics.srcFiles.length))}`);
  console.log(`  Total lines:   ${c('cyan', totalLines(metrics.totalLines))}`);
  console.log(`  File types:    ${[...metrics.exts.entries()].map(([k, v]) => `${k}(${v})`).join(', ')}`);
  console.log();

  // Top files by size
  const topFiles = metrics.srcFiles.sort((a, b) => b.lines - a.lines).slice(0, 5);
  console.log(c('bold', '  Largest Files'));
  console.log(c('dim', '  ─────────────────────────────────────────'));
  for (const f of topFiles) {
    console.log(`  ${c('yellow', padRight(f.path, 35))} ${c('cyan', String(f.lines).padStart(6))} lines`);
  }
  console.log();

  // Task progress
  const tasks = data.tasks || [];
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  console.log(c('bold', '  Task Progress'));
  console.log(c('dim', '  ─────────────────────────────────────────'));
  if (total === 0) {
    console.log(`  ${c('dim', 'No tasks tracked yet. Use: npm run progress:add "task name"')}`);
  } else {
    console.log(`  ${progressBar(pct)}  (${completed}/${total} tasks)`);
    console.log();
    for (const task of tasks) {
      const icon = task.status === 'completed' ? c('green', '✓') : task.status === 'in_progress' ? c('yellow', '◐') : c('dim', '○');
      const label = task.status === 'completed' ? c('dim', task.name) : task.name;
      console.log(`  ${icon} ${label}`);
    }
  }
  console.log();

  // Build history
  const builds = (data.builds || []).slice(-5);
  console.log(c('bold', '  Recent Builds'));
  console.log(c('dim', '  ─────────────────────────────────────────'));
  if (builds.length === 0) {
    console.log(`  ${c('dim', 'No builds recorded yet. Run: npm run build:track')}`);
  } else {
    for (const b of builds) {
      const statusIcon = b.success ? c('green', '✓') : c('red', '✗');
      const duration = b.duration ? ` (${(b.duration / 1000).toFixed(1)}s)` : '';
      console.log(`  ${statusIcon} ${c('dim', new Date(b.timestamp).toLocaleString())}${duration}`);
    }
  }
  console.log();
}

function totalLines(n) {
  return n.toLocaleString();
}

function padRight(str, len) {
  return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
}

function cmdAdd(name) {
  if (!name) {
    console.error(c('red', 'Usage: npm run progress:add -- "task name"'));
    process.exit(1);
  }
  const data = loadProgress();
  data.tasks.push({ name, status: 'pending', createdAt: new Date().toISOString() });
  saveProgress(data);
  console.log(`${c('green', '✓')} Added task: ${name}`);
}

function cmdComplete(nameOrIndex) {
  const data = loadProgress();
  const idx = parseInt(nameOrIndex);
  let task;

  if (!isNaN(idx) && idx >= 0 && idx < data.tasks.length) {
    task = data.tasks[idx];
  } else {
    task = data.tasks.find(t => t.name.toLowerCase().includes(nameOrIndex.toLowerCase()) && t.status !== 'completed');
  }

  if (!task) {
    console.error(c('red', `Task not found: ${nameOrIndex}`));
    process.exit(1);
  }

  task.status = 'completed';
  task.completedAt = new Date().toISOString();
  saveProgress(data);
  console.log(`${c('green', '✓')} Completed: ${task.name}`);
}

function cmdStart(nameOrIndex) {
  const data = loadProgress();
  const idx = parseInt(nameOrIndex);
  let task;

  if (!isNaN(idx) && idx >= 0 && idx < data.tasks.length) {
    task = data.tasks[idx];
  } else {
    task = data.tasks.find(t => t.name.toLowerCase().includes(nameOrIndex.toLowerCase()) && t.status === 'pending');
  }

  if (!task) {
    console.error(c('red', `Task not found: ${nameOrIndex}`));
    process.exit(1);
  }

  task.status = 'in_progress';
  task.startedAt = new Date().toISOString();
  saveProgress(data);
  console.log(`${c('yellow', '◐')} Started: ${task.name}`);
}

function cmdBuildTrack() {
  const data = loadProgress();
  const start = Date.now();

  console.log(`${c('cyan', '▶')} Starting tracked build...\n`);

  import('child_process').then(({ execSync }) => {
    try {
      execSync('npx vite build', { cwd: ROOT, stdio: 'inherit' });
      const duration = Date.now() - start;
      data.builds.push({ timestamp: new Date().toISOString(), success: true, duration });
      saveProgress(data);
      console.log(`\n${c('green', '✓')} Build succeeded in ${(duration / 1000).toFixed(1)}s`);
    } catch (err) {
      const duration = Date.now() - start;
      data.builds.push({ timestamp: new Date().toISOString(), success: false, duration });
      saveProgress(data);
      console.log(`\n${c('red', '✗')} Build failed after ${(duration / 1000).toFixed(1)}s`);
      process.exit(1);
    }
  });
}

function cmdReset() {
  saveProgress({ tasks: [], builds: [], createdAt: new Date().toISOString() });
  console.log(`${c('green', '✓')} Progress data reset.`);
}

function cmdInit() {
  if (existsSync(PROGRESS_FILE)) {
    console.log(`${c('yellow', '!')} Progress file already exists. Use ${c('cyan', 'npm run progress:reset')} to clear.`);
    return;
  }
  const defaultTasks = [
    { name: 'Set up project dependencies', status: 'completed', createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { name: 'Configure build pipeline', status: 'completed', createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { name: 'Implement core audit working papers', status: 'completed', createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { name: 'Add industry-specific configurations', status: 'completed', createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { name: 'Implement progress tracking system', status: 'in_progress', createdAt: new Date().toISOString(), startedAt: new Date().toISOString() },
    { name: 'Add data persistence layer', status: 'pending', createdAt: new Date().toISOString() },
    { name: 'Write automated tests', status: 'pending', createdAt: new Date().toISOString() },
    { name: 'Performance optimization', status: 'pending', createdAt: new Date().toISOString() },
  ];
  saveProgress({ tasks: defaultTasks, builds: [], createdAt: new Date().toISOString() });
  console.log(`${c('green', '✓')} Initialized progress tracking with ${defaultTasks.length} tasks.`);
  cmdReport();
}

// CLI dispatch
const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'report':
  case undefined:
    cmdReport();
    break;
  case 'add':
    cmdAdd(args.join(' '));
    break;
  case 'complete':
    cmdComplete(args.join(' '));
    break;
  case 'start':
    cmdStart(args.join(' '));
    break;
  case 'build':
    cmdBuildTrack();
    break;
  case 'reset':
    cmdReset();
    break;
  case 'init':
    cmdInit();
    break;
  default:
    console.log(`${c('bold', 'NPM Progress Tracker')}`);
    console.log(`\n${c('cyan', 'Commands:')}`);
    console.log(`  ${c('yellow', 'report')}    Show progress report (default)`);
    console.log(`  ${c('yellow', 'init')}      Initialize with default tasks`);
    console.log(`  ${c('yellow', 'add')}       Add a new task`);
    console.log(`  ${c('yellow', 'start')}     Mark a task as in-progress`);
    console.log(`  ${c('yellow', 'complete')}  Mark a task as completed`);
    console.log(`  ${c('yellow', 'build')}     Run a tracked build`);
    console.log(`  ${c('yellow', 'reset')}     Reset all progress data`);
}
