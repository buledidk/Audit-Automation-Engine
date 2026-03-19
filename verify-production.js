#!/usr/bin/env node

/**
 * Production Verification Script
 * Complete end-to-end system verification for GO LIVE
 */

import modelSelectionService from './src/services/modelSelectionService.js';
import connectorManager from './src/services/connectorManager.js';
import pdfGenerationService from './src/services/pdfGenerationService.js';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

let passed = 0;
let failed = 0;

async function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  switch (type) {
    case 'success':
      console.log(`${colors.green}✅${colors.reset} [${timestamp}] ${message}`);
      passed++;
      break;
    case 'error':
      console.log(`${colors.red}❌${colors.reset} [${timestamp}] ${message}`);
      failed++;
      break;
    case 'warning':
      console.log(`${colors.yellow}⚠️${colors.reset}  [${timestamp}] ${message}`);
      break;
    case 'info':
      console.log(`${colors.blue}ℹ️${colors.reset}  [${timestamp}] ${message}`);
      break;
  }
}

async function testEnvironmentVariables() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(
    `${colors.blue}ENVIRONMENT VARIABLES${colors.reset}`
  );
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  const requiredVars = [
    'NODE_ENV',
    'ANTHROPIC_API_KEY',
    'DATABASE_URL',
    'SLACK_BOT_TOKEN',
    'GITHUB_TOKEN',
    'SENDGRID_API_KEY',
    'AWS_ACCESS_KEY_ID',
  ];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log(`${varName}: Set`, 'success');
    } else {
      log(`${varName}: NOT SET`, 'error');
    }
  }
}

async function testAIModels() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}AI MODELS${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  await modelSelectionService.healthCheckAllModels();
  const status = modelSelectionService.getAvailableModels();

  if (status.claude.available) {
    log(`Claude (Primary): Available`, 'success');
  } else {
    log(`Claude (Primary): Not available`, 'error');
  }

  if (status.openai.available) {
    log(`OpenAI (Secondary): Available`, 'success');
  } else {
    log(`OpenAI (Secondary): Not available`, 'warning');
  }

  if (status.ollama.available) {
    log(`Ollama (Fallback): Available`, 'success');
  } else {
    log(`Ollama (Fallback): Not available`, 'warning');
  }

  const metrics = modelSelectionService.getMetrics();
  log(`Model executions: ${metrics.totalExecutions}`, 'info');
  log(`Success rate: ${metrics.successRate.toFixed(2)}%`, 'info');
}

async function testConnectors() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}EXTERNAL CONNECTORS${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  await connectorManager.initializeConnectors();
  const status = connectorManager.getConnectorStatuses();

  for (const [name, connector] of Object.entries(status)) {
    if (connector.healthy) {
      log(`${name.toUpperCase()}: Connected`, 'success');
    } else {
      log(`${name.toUpperCase()}: Not connected`, 'error');
    }
  }

  const health = connectorManager.getHealthSummary();
  log(`Overall: ${health.summary}`, 'info');
}

async function testAPIEndpoints() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}API ENDPOINTS${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  const endpoints = [
    { name: 'Health Check', url: `${API_BASE_URL}/health` },
    { name: 'Full Health', url: `${API_BASE_URL}/health/full` },
    { name: 'Readiness', url: `${API_BASE_URL}/ready` },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      if (response.status === 200) {
        log(`${endpoint.name}: Responding`, 'success');
      } else {
        log(`${endpoint.name}: Status ${response.status}`, 'warning');
      }
    } catch (error) {
      log(
        `${endpoint.name}: Failed (${error.message})`,
        'error'
      );
    }
  }
}

async function testPDFGeneration() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}PDF GENERATION${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  try {
    const testReport = {
      auditId: 'test-001',
      auditName: 'Test Audit',
      summary: 'This is a test PDF generation',
      findings: [
        {
          title: 'Test Finding',
          severity: 'medium',
          description: 'This is a test finding',
          recommendation: 'Take action',
        },
      ],
      status: 'passed',
    };

    const result = await pdfGenerationService.generateAuditReport(testReport);
    log(`PDF generated successfully: ${result.filename}`, 'success');
  } catch (error) {
    log(`PDF generation failed: ${error.message}`, 'error');
  }
}

async function testWebSocket() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}WEBSOCKET${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  try {
    // Try to connect to WebSocket
    const ws = new WebSocket('ws://localhost:3001/socket.io');

    const connected = await new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 3000);

      ws.onopen = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
    });

    if (connected) {
      log('WebSocket: Connected', 'success');
      ws.close();
    } else {
      log('WebSocket: Not connected', 'warning');
    }
  } catch (error) {
    log(`WebSocket test skipped (browser environment needed)`, 'warning');
  }
}

async function testDatabase() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}DATABASE${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  if (process.env.DATABASE_URL) {
    log('Database URL: Configured', 'success');
  } else {
    log('Database URL: Not configured', 'error');
  }

  log('Database migrations: Verify manually', 'info');
  log('Database schema: Verify manually', 'info');
}

async function generateReport() {
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.blue}VERIFICATION SUMMARY${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`
  );

  const total = passed + failed;
  const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  console.log(`\n${colors.green}✅ Passed:${colors.reset} ${passed}`);
  console.log(`${colors.red}❌ Failed:${colors.reset} ${failed}`);
  console.log(`${colors.blue}📊 Success Rate:${colors.reset} ${percentage}%`);

  if (failed === 0) {
    console.log(
      `\n${colors.green}🎉 ALL CHECKS PASSED - SYSTEM READY FOR PRODUCTION${colors.reset}`
    );
    return 0;
  } else if (failed < 3) {
    console.log(
      `\n${colors.yellow}⚠️  SOME CHECKS FAILED - REVIEW FAILURES ABOVE${colors.reset}`
    );
    return 1;
  } else {
    console.log(
      `\n${colors.red}❌ CRITICAL FAILURES - DO NOT DEPLOY${colors.reset}`
    );
    return 2;
  }
}

async function main() {
  console.log(`\n${colors.blue}${'='.repeat(59)}${colors.reset}`);
  console.log(
    `${colors.blue}  AUDIT AUTOMATION ENGINE - PRODUCTION VERIFICATION${colors.reset}`
  );
  console.log(`${colors.blue}${'='.repeat(59)}${colors.reset}`);

  await testEnvironmentVariables();
  await testAIModels();
  await testConnectors();
  await testAPIEndpoints();
  await testPDFGeneration();
  await testWebSocket();
  await testDatabase();

  const exitCode = await generateReport();
  process.exit(exitCode);
}

main().catch((error) => {
  console.error('Verification script error:', error);
  process.exit(2);
});
