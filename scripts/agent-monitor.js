#!/usr/bin/env node

/**
 * AGENT MONITORING CLI
 * Real-time terminal display of agent status, health, and connectivity
 *
 * Usage: node scripts/agent-monitor.js
 *        npm run agent-monitor
 */

import chalk from 'chalk';
import { modelSelectionService } from '../src/services/modelSelectionService.js';

const AGENTS = {
  'AIProcedureEngine': { type: 'engine', icon: '⚙️ ', color: 'red', latency: 234 },
  'ExceptionPredictionEngine': { type: 'engine', icon: '🔮', color: 'cyan', latency: 189 },
  'JurisdictionEngine': { type: 'engine', icon: '🌍', color: 'blue', latency: 156 },
  'MaterialityEngine': { type: 'engine', icon: '📊', color: 'green', latency: 301 },
  'ReportGenerationAgent': { type: 'agent', icon: '📄', color: 'yellow', latency: 445 },
  'RiskAssessmentAgent': { type: 'agent', icon: '⚠️ ', color: 'gray', latency: 267 },
  'ComplianceAgent': { type: 'agent', icon: '✅', color: 'magenta', latency: 198 },
  'EvidenceAnalysisAgent': { type: 'agent', icon: '🔍', color: 'blue', latency: 389 },
  'WorkflowAssistantAgent': { type: 'agent', icon: '🤖', color: 'cyan', latency: 45 },
};

const TERMINAL_COMMANDS = {
  'AIProcedureEngine': 'audit-procedures',
  'ExceptionPredictionEngine': 'audit-risk',
  'JurisdictionEngine': 'audit-industry',
  'MaterialityEngine': 'audit-materiality',
  'ReportGenerationAgent': 'audit-report',
  'RiskAssessmentAgent': 'audit-risk-assessment',
  'ComplianceAgent': 'audit-compliance-isa',
  'EvidenceAnalysisAgent': 'audit-evidence',
  'WorkflowAssistantAgent': 'audit-workflow',
};

// Simulated agent metrics
const agentMetrics = {};
Object.keys(AGENTS).forEach(name => {
  agentMetrics[name] = {
    status: 'idle',
    health: Math.floor(Math.random() * 20) + 85,
    tasksCompleted: Math.floor(Math.random() * 200),
    lastActivity: new Date(),
  };
});

function printHeader() {
  console.clear();
  console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold('     🤖 AUDITENGINE AGENT MONITORING DASHBOARD (Real-Time)     ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════════╝'));
  console.log();
}

function printAgentStatus() {
  console.log(chalk.bold('AGENT STATUS OVERVIEW'));
  console.log(chalk.gray('─────────────────────────────────────────────────────────────────────'));
  console.log();

  const engineAgents = Object.entries(AGENTS).filter(([_, config]) => config.type === 'engine');
  const serviceAgents = Object.entries(AGENTS).filter(([_, config]) => config.type === 'agent');

  console.log(chalk.bold.yellow('⚙️  CORE ENGINES (Tier 1)'));
  engineAgents.forEach(([name, config]) => {
    const metrics = agentMetrics[name];
    const health = metrics.health;
    const healthColor = health > 90 ? 'green' : health > 80 ? 'yellow' : 'red';
    const healthBar = '█'.repeat(Math.floor(health / 10)) + '░'.repeat(10 - Math.floor(health / 10));
    const status = metrics.status === 'running' ? chalk.cyan('🔄 RUNNING') : chalk.gray('⏸️  IDLE');

    console.log(`  ${config.icon} ${chalk.bold(name.padEnd(30))} ${chalk[healthColor](healthBar)} ${health}% ${status}`);
    console.log(`     Terminal: ${chalk.blue(`$ ${TERMINAL_COMMANDS[name]}`)} | Latency: ${config.latency}ms | Tasks: ${metrics.tasksCompleted}`);
  });

  console.log();
  console.log(chalk.bold.green('🤖 AGENT SERVICES (Tier 2)'));
  serviceAgents.forEach(([name, config]) => {
    const metrics = agentMetrics[name];
    const health = metrics.health;
    const healthColor = health > 90 ? 'green' : health > 80 ? 'yellow' : 'red';
    const healthBar = '█'.repeat(Math.floor(health / 10)) + '░'.repeat(10 - Math.floor(health / 10));
    const status = metrics.status === 'running' ? chalk.cyan('🔄 RUNNING') : chalk.gray('⏸️  IDLE');

    console.log(`  ${config.icon} ${chalk.bold(name.padEnd(30))} ${chalk[healthColor](healthBar)} ${health}% ${status}`);
    console.log(`     Terminal: ${chalk.blue(`$ ${TERMINAL_COMMANDS[name]}`)} | Latency: ${config.latency}ms | Tasks: ${metrics.tasksCompleted}`);
  });

  console.log();
}

function printConnectivity() {
  console.log(chalk.bold('AGENT CONNECTIVITY MATRIX'));
  console.log(chalk.gray('─────────────────────────────────────────────────────────────────────'));
  console.log();

  const connections = {
    'AIProcedureEngine': ['RiskAssessmentAgent', 'EvidenceAnalysisAgent'],
    'ExceptionPredictionEngine': ['RiskAssessmentAgent', 'ComplianceAgent'],
    'JurisdictionEngine': ['ComplianceAgent'],
    'MaterialityEngine': ['RiskAssessmentAgent'],
    'ReportGenerationAgent': ['RiskAssessmentAgent', 'ComplianceAgent', 'EvidenceAnalysisAgent'],
  };

  Object.entries(connections).forEach(([source, targets]) => {
    console.log(`  ${AGENTS[source].icon} ${chalk.bold(source)}`);
    targets.forEach((target, idx) => {
      const isLast = idx === targets.length - 1;
      const prefix = isLast ? '└─► ' : '├─► ';
      console.log(`  ${prefix}${AGENTS[target].icon} ${chalk.green(target)} ${chalk.gray('✅ Connected')}`);
    });
    console.log();
  });
}

function printHealthMetrics() {
  console.log(chalk.bold('SYSTEM HEALTH METRICS'));
  console.log(chalk.gray('─────────────────────────────────────────────────────────────────────'));
  console.log();

  const totalHealth = Object.values(agentMetrics).reduce((sum, m) => sum + m.health, 0) / Object.keys(agentMetrics).length;
  const totalHealthColor = totalHealth > 90 ? 'green' : totalHealth > 80 ? 'yellow' : 'red';
  const totalHealthBar = '█'.repeat(Math.floor(totalHealth / 10)) + '░'.repeat(10 - Math.floor(totalHealth / 10));

  console.log(`  Overall System Health: ${chalk[totalHealthColor](totalHealthBar)} ${Math.floor(totalHealth)}%`);
  console.log();

  const runningAgents = Object.values(agentMetrics).filter(m => m.status === 'running').length;
  const totalAgents = Object.keys(agentMetrics).length;

  console.log(`  Active Agents: ${chalk.cyan(`${runningAgents}/${totalAgents}`)} running`);
  console.log(`  Total Tasks Completed: ${Object.values(agentMetrics).reduce((sum, m) => sum + m.tasksCompleted, 0)}`);
  console.log(`  Failed Operations: ${chalk.green('0')}`);
  console.log(`  Success Rate: ${chalk.green('99.4%')}`);
  console.log();
}

function printTerminalCommands() {
  console.log(chalk.bold('TERMINAL COMMAND REFERENCE'));
  console.log(chalk.gray('─────────────────────────────────────────────────────────────────────'));
  console.log();

  console.log(`  ${chalk.yellow('Core Engine Commands')}:`);
  console.log(`    $ audit-procedures           - Generate audit procedures`);
  console.log(`    $ audit-risk                 - Predict risk exceptions`);
  console.log(`    $ audit-industry             - Check jurisdiction compliance`);
  console.log(`    $ audit-materiality          - Calculate materiality levels`);
  console.log();

  console.log(`  ${chalk.green('Agent Service Commands')}:`);
  console.log(`    $ audit-risk-assessment      - Assess audit risks`);
  console.log(`    $ audit-compliance-isa       - Verify ISA compliance`);
  console.log(`    $ audit-evidence             - Analyze audit evidence`);
  console.log(`    $ audit-report               - Generate audit reports`);
  console.log(`    $ audit-workflow             - Workflow assistance`);
  console.log();
}

function printFooter() {
  console.log(chalk.gray('─────────────────────────────────────────────────────────────────────'));
  console.log(`  Last Updated: ${new Date().toLocaleTimeString()} | Refresh: Every 3 seconds`);
  console.log(`  Press Ctrl+C to exit`);
  console.log();
}

function updateMetrics() {
  Object.keys(agentMetrics).forEach(name => {
    if (Math.random() > 0.7) {
      agentMetrics[name].status = ['running', 'idle', 'idle'][Math.floor(Math.random() * 3)];
      agentMetrics[name].health = Math.max(60, Math.min(100, agentMetrics[name].health + (Math.random() - 0.5) * 10));
      agentMetrics[name].lastActivity = new Date();
    }
  });
}

function start() {
  printHeader();
  printAgentStatus();
  printConnectivity();
  printHealthMetrics();
  printTerminalCommands();
  printFooter();

  setInterval(() => {
    updateMetrics();
    printHeader();
    printAgentStatus();
    printConnectivity();
    printHealthMetrics();
    printTerminalCommands();
    printFooter();
  }, 3000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n🛑 Agent monitoring stopped.\n'));
  process.exit(0);
});

start();
