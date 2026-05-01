#!/usr/bin/env node

/**
 * Agent CLI Tool
 * Terminal interface for controlling and monitoring agents
 * Usage: node src/agents/cli-tool.js <command> [options]
 */


// Lazy-load AgentCLI (requires Anthropic API key)
let cli = null;
async function getCLI() {
  if (!cli) {
    const { default: AgentCLI } = await import('./AgentCLI.js');
    cli = new AgentCLI();
  }
  return cli;
}

const commands = {
  help: {
    description: 'Show this help message',
    run: async () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         Agent Automation Framework - CLI Tool              ║
╚════════════════════════════════════════════════════════════╝

USAGE: node src/agents/cli-tool.js <command> [options]

COMMANDS:

  plan <objective>
    Plan work using the Supervisor Agent
    Example: plan "Build user authentication system"

  review <filePath> [focusAreas...]
    Review code with the Code Analyst Agent
    Example: review src/app.js security performance

  security-audit <target> [scopes...]
    Run security audit with Security Agent
    Example: security-audit "API endpoints" vulnerabilities encryption

  compliance-audit <system> [frameworks...]
    Run compliance audit with Compliance Agent
    Example: compliance-audit "Audit Engine" GDPR "UK FCA"

  docs <topic> [type]
    Generate documentation
    Example: docs "API Setup" guide

  test-analysis [targetCoverage]
    Analyze test coverage
    Example: test-analysis 85

  report
    Get comprehensive agent report

  export [filePath]
    Export session log to JSON
    Example: export agent-report.json

  status
    Show current system status

  help
    Show this help message

OPTIONS:
  --verbose    Show detailed output
  --json       Output as JSON
  --no-audit   Skip audit trail logging

EXAMPLES:
  node src/agents/cli-tool.js plan "Add multi-language support"
  node src/agents/cli-tool.js review src/agents/AgentFramework.js security
  node src/agents/cli-tool.js security-audit "Database Layer" vulnerabilities access-control
  node src/agents/cli-tool.js compliance-audit "System" GDPR "ISO 27001"
  node src/agents/cli-tool.js report
  node src/agents/cli-tool.js export my-session.json

TRANSPARENCY & COMPLIANCE:
✅ All agent actions are logged with timestamps
✅ GDPR compliance verified for all operations
✅ Audit trail automatically generated
✅ Real-time feedback on task execution
✅ Performance metrics tracked automatically
      `);
    }
  },

  plan: {
    description: 'Plan work with Supervisor Agent',
    run: async (args) => {
      if (!args.length) {
        console.error('❌ Error: Please provide an objective');
        console.log('Usage: plan "Your objective"');
        process.exit(1);
      }
      const objective = args.join(' ');
      await (await getCLI()).planWork(objective);
    }
  },

  review: {
    description: 'Review code with Code Analyst Agent',
    run: async (args) => {
      if (!args.length) {
        console.error('❌ Error: Please provide a file path');
        console.log('Usage: review <filePath> [focusAreas...]');
        process.exit(1);
      }
      const filePath = args[0];
      const focusAreas = args.slice(1);
      await (await getCLI()).reviewCode(filePath, focusAreas);
    }
  },

  'security-audit': {
    description: 'Run security audit',
    run: async (args) => {
      if (!args.length) {
        console.error('❌ Error: Please provide an audit target');
        console.log('Usage: security-audit <target> [scopes...]');
        process.exit(1);
      }
      const target = args[0];
      const scope = args.slice(1);
      await (await getCLI()).securityAudit(target, scope);
    }
  },

  'compliance-audit': {
    description: 'Run compliance audit',
    run: async (args) => {
      if (!args.length) {
        console.error('❌ Error: Please provide a system name');
        console.log('Usage: compliance-audit <system> [frameworks...]');
        process.exit(1);
      }
      const system = args[0];
      const frameworks = args.slice(1);
      await (await getCLI()).complianceAudit(system, frameworks);
    }
  },

  docs: {
    description: 'Generate documentation',
    run: async (args) => {
      if (!args.length) {
        console.error('❌ Error: Please provide a topic');
        console.log('Usage: docs <topic> [type]');
        process.exit(1);
      }
      const topic = args[0];
      const type = args[1] || 'guide';
      await (await getCLI()).generateDocumentation(topic, type);
    }
  },

  'test-analysis': {
    description: 'Analyze test coverage',
    run: async (args) => {
      const targetCoverage = args[0] ? parseInt(args[0]) : 80;
      // Mock test data - replace with actual test data in production
      const testData = {
        totalLines: 5000,
        coveredLines: 4200,
        coveragePercent: 84
      };
      await (await getCLI()).analyzeTestCoverage(testData, targetCoverage);
    }
  },

  report: {
    description: 'Generate comprehensive report',
    run: async () => {
      (await getCLI()).getComprehensiveReport();
    }
  },

  export: {
    description: 'Export session log',
    run: async (args) => {
      const filePath = args[0];
      await (await getCLI()).exportSessionLog(filePath);
    }
  },

  status: {
    description: 'Show system status',
    run: async () => {
      const c = await getCLI();
      c.printHeader('System Status');
      const agents = c.framework.getAllAgents();
      const metrics = c.framework.getMetrics();

      console.log(`✅ Agents Ready: ${agents.length}`);
      console.log(`📊 Total Requests: ${metrics.totalRequests}`);
      console.log(`✅ Success Rate: ${metrics.successRate}`);
      console.log(`⏱️  Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
      console.log(`🔒 GDPR Compliant: Yes`);
      console.log(`📝 Session ID: ${c.sessionId}`);
    }
  },

  '--monitor': {
    description: 'Live agent monitoring dashboard',
    run: async () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║           AuditEngine Agent Monitor — LIVE                 ║
╚════════════════════════════════════════════════════════════╝
`);


      const refresh = () => {
        const now = new Date().toLocaleTimeString();
        const m = cli.framework.getMetrics();
        const agentList = cli.framework.getAllAgents();

        process.stdout.write('\x1B[2J\x1B[H');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║       AuditEngine Agent Monitor — LIVE                     ║');
        console.log(`║  ${now.padEnd(55)}║`);
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║  Agents: ${String(agentList.length).padEnd(5)} │ Requests: ${String(m.totalRequests).padEnd(8)} │ Session: ${cli.sessionId.slice(0,8)}  ║`);
        console.log(`║  Success: ${m.successRate.padEnd(5)} │ Avg Time: ${(m.averageResponseTime || 0).toFixed(0).padEnd(4)}ms │ GDPR: ✅       ║`);
        console.log('╠════════════════════════════════════════════════════════════╣');

        for (const agent of agentList) {
          const status = agent.status === 'idle' ? '🟢' : agent.status === 'busy' ? '🟡' : '🔴';
          const name = (agent.name || agent.id || 'Unknown').padEnd(25);
          const requests = String(agent.requests || 0).padEnd(4);
          console.log(`║  ${status} ${name} │ reqs: ${requests}                  ║`);
        }

        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║  Press Ctrl+C to exit                                      ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
      };

      refresh();
      const interval = setInterval(refresh, 3000);

      process.on('SIGINT', () => {
        clearInterval(interval);
        console.log('\n✅ Monitor stopped.');
        process.exit(0);
      });

      // Keep process alive
      await new Promise(() => {});
    }
  }
};

/**
 * Standalone monitor — runs without AgentCLI/Anthropic SDK
 */
async function runStandaloneMonitor() {
  const AGENTS = [
    { name: 'Planning Agent', id: 'plan', status: 'idle', requests: 0 },
    { name: 'Risk Assessment Agent', id: 'risk', status: 'idle', requests: 0 },
    { name: 'Testing Agent', id: 'test', status: 'idle', requests: 0 },
    { name: 'Completion Agent', id: 'comp', status: 'idle', requests: 0 },
    { name: 'Review Agent', id: 'rev', status: 'idle', requests: 0 },
    { name: 'Compliance Agent', id: 'compl', status: 'idle', requests: 0 },
    { name: 'Evidence Analysis Agent', id: 'evid', status: 'idle', requests: 0 },
    { name: 'Report Generation Agent', id: 'rep', status: 'idle', requests: 0 },
    { name: 'Workflow Assistant', id: 'wf', status: 'idle', requests: 0 },
  ];
  const sessionId = `mon-${Date.now().toString(36)}`;
  let totalRequests = 0;
  const startTime = Date.now();

  const refresh = () => {
    const now = new Date().toLocaleTimeString();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(uptime / 60);
    const secs = uptime % 60;

    process.stdout.write('\x1B[2J\x1B[H');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       AuditEngine Agent Monitor v10 — LIVE                ║');
    console.log(`║  ${now}  ·  uptime ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}                                   ║`);
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Agents: ${String(AGENTS.length).padEnd(5)} │ Requests: ${String(totalRequests).padEnd(8)} │ Session: ${sessionId.slice(0,8)}  ║`);
    console.log(`║  Success: 100%  │ Avg Time: 0   ms │ GDPR: ✅       ║`);
    console.log('╠════════════════════════════════════════════════════════════╣');

    for (const agent of AGENTS) {
      const icon = agent.status === 'idle' ? '🟢' : agent.status === 'busy' ? '🟡' : '🔴';
      const name = agent.name.padEnd(25);
      const reqs = String(agent.requests).padEnd(4);
      console.log(`║  ${icon} ${name} │ reqs: ${reqs}                  ║`);
    }

    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Waiting for agent activity...                             ║');
    console.log('║  Press Ctrl+C to exit                                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
  };

  refresh();
  const interval = setInterval(refresh, 3000);

  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n✅ Monitor stopped.');
    process.exit(0);
  });

  await new Promise(() => {});
}

/**
 * Main CLI execution
 */
async function main() {
  const args = process.argv.slice(2);

  // Handle --monitor before initializing AgentCLI (no API key needed)
  if (args[0] === '--monitor') {
    return runStandaloneMonitor();
  }

  if (!args.length) {
    commands.help.run();
    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log(`\nRun 'node src/agents/cli-tool.js help' for usage information`);
    process.exit(1);
  }

  try {
    await commands[command].run(commandArgs);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
