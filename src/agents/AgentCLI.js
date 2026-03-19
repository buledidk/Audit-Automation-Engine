/**
 * Agent CLI Interface
 * Terminal control for agents with real-time feedback and transparency
 */

import { AgentFramework } from './AgentFramework.js';
import { AgentRegistry } from './SpecializedAgents.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class AgentCLI {
  constructor() {
    this.framework = new AgentFramework({
      model: 'claude-opus-4-6',
      maxTokens: 4096,
      temperature: 0.7
    });

    this.registry = new AgentRegistry(this.framework);
    this.setupEventListeners();
    this.sessionId = this.generateSessionId();
    this.sessionLog = [];
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `agent-session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  /**
   * Setup event listeners for transparency
   */
  setupEventListeners() {
    this.framework.on('agent:registered', (data) => {
      this.logEvent('AGENT_REGISTERED', data);
    });

    this.framework.on('task:started', (data) => {
      this.logEvent('TASK_STARTED', data);
      this.printStatus(`▶️  Task started: ${data.taskId}`);
    });

    this.framework.on('task:completed', (data) => {
      this.logEvent('TASK_COMPLETED', data);
      this.printStatus(`✅ Task completed: ${data.taskId} (${data.executionTime}ms)`);
    });

    this.framework.on('task:failed', (data) => {
      this.logEvent('TASK_FAILED', data);
      this.printStatus(`❌ Task failed: ${data.taskId}`);
    });
  }

  /**
   * Plan work using supervisor agent
   */
  async planWork(objective) {
    this.printHeader('Planning Work with Supervisor Agent');
    console.log(`Objective: ${objective}\n`);

    try {
      const result = await this.registry.agents.supervisor.planWork(objective, {
        compliance: {
          gdprRequired: true,
          auditTrailRequired: true,
          transparencyRequired: true
        }
      });

      console.log('\n📋 Work Plan:');
      console.log(result.output);
      console.log(`\n⏱️  Execution time: ${result.executionTime}ms`);
      console.log(`📊 Tokens used: ${JSON.stringify(result.tokenUsage)}`);

      return result;
    } catch (error) {
      this.printError(`Failed to plan work: ${error.message}`);
      throw error;
    }
  }

  /**
   * Review code
   */
  async reviewCode(filePath, focusAreas = []) {
    this.printHeader('Code Review Analysis');
    console.log(`File: ${filePath}`);
    if (focusAreas.length) console.log(`Focus Areas: ${focusAreas.join(', ')}\n`);

    try {
      const code = await fs.readFile(filePath, 'utf-8');

      if (code.length > 50000) {
        this.printWarning('Code file is large. Analyzing first 50KB...');
      }

      const result = await this.registry.agents.codeAnalyst.analyzeCode(
        code.slice(0, 50000),
        { focusAreas }
      );

      console.log('\n📊 Code Analysis:');
      console.log(result.output);
      console.log(`\n⏱️  Analysis time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      this.printError(`Code review failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Security audit
   */
  async securityAudit(target, scope = []) {
    this.printHeader('Security Audit');
    console.log(`Target: ${target}`);
    if (scope.length) console.log(`Scope: ${scope.join(', ')}\n`);

    try {
      const result = await this.registry.agents.security.auditSecurity(target, {
        scope: scope.length ? scope : ['vulnerabilities', 'encryption', 'access-control', 'api-security'],
        complianceFramework: 'OWASP Top 10, ISO 27001'
      });

      console.log('\n🔒 Security Findings:');
      console.log(result.output);
      console.log(`\n⏱️  Audit time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      this.printError(`Security audit failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Compliance audit
   */
  async complianceAudit(system, frameworks = []) {
    this.printHeader('Compliance Audit');
    console.log(`System: ${system}`);
    if (frameworks.length) console.log(`Frameworks: ${frameworks.join(', ')}\n`);

    try {
      const result = await this.registry.agents.compliance.auditCompliance(system, {
        frameworks: frameworks.length ? frameworks : ['GDPR', 'UK FCA', 'ICO', 'ISA'],
        dataTypes: ['personal_data', 'financial_data', 'audit_logs']
      });

      console.log('\n⚖️  Compliance Assessment:');
      console.log(result.output);
      console.log(`\n⏱️  Audit time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      this.printError(`Compliance audit failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(topic, type = 'guide') {
    this.printHeader('Documentation Generation');
    console.log(`Topic: ${topic}`);
    console.log(`Type: ${type}\n`);

    try {
      const result = await this.registry.agents.documentation.generateDocumentation(topic, {
        type,
        audience: 'developers'
      });

      console.log('\n📚 Generated Documentation:');
      console.log(result.output);
      console.log(`\n⏱️  Generation time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      this.printError(`Documentation generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze test coverage
   */
  async analyzeTestCoverage(testData, targetCoverage = 80) {
    this.printHeader('Test Coverage Analysis');
    console.log(`Target Coverage: ${targetCoverage}%\n`);

    try {
      const result = await this.registry.agents.testing.analyzeTestCoverage(testData, {
        targetCoverage
      });

      console.log('\n🧪 Test Analysis:');
      console.log(result.output);
      console.log(`\n⏱️  Analysis time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      this.printError(`Test analysis failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get comprehensive report
   */
  getComprehensiveReport() {
    this.printHeader('Comprehensive Agent Report');

    const agents = this.framework.getAllAgents();
    console.log(`\n📋 Registered Agents: ${agents.length}`);
    agents.forEach(agent => {
      console.log(`  • ${agent.name} (${agent.type}) - Status: ${agent.status}`);
    });

    const metrics = this.framework.getMetrics();
    console.log(`\n📊 Performance Metrics:`);
    console.log(`  • Total Requests: ${metrics.totalRequests}`);
    console.log(`  • Successful: ${metrics.successfulRequests} (${metrics.successRate})`);
    console.log(`  • Failed: ${metrics.failedRequests}`);
    console.log(`  • Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`  • Total Tokens Used: ${metrics.totalTokensUsed}`);
    console.log(`  • Avg Tokens/Request: ${metrics.avgTokensPerRequest}`);

    const auditTrail = this.framework.getAuditTrail();
    console.log(`\n📝 Audit Trail Entries: ${auditTrail.length}`);
    if (auditTrail.length > 0) {
      console.log(`  • Latest entries:`);
      auditTrail.slice(-5).forEach(entry => {
        console.log(`    - [${entry.timestamp}] ${entry.action}`);
      });
    }

    console.log(`\n✅ GDPR Compliant: ${this.framework.compliance.gdprCompliant ? 'Yes' : 'No'}`);
    console.log(`✅ Data Minimization: ${this.framework.compliance.dataMinimization ? 'Yes' : 'No'}`);

    return {
      agents,
      metrics,
      auditTrail: auditTrail.slice(-100),
      compliance: this.framework.compliance
    };
  }

  /**
   * Export session log
   */
  async exportSessionLog(filePath = null) {
    const fileName = filePath || `agent-session-${this.sessionId}.json`;
    const fullPath = path.join(process.cwd(), fileName);

    const report = this.getComprehensiveReport();
    report.sessionId = this.sessionId;
    report.sessionLog = this.sessionLog;

    await fs.writeFile(fullPath, JSON.stringify(report, null, 2));
    this.printStatus(`📁 Session log exported: ${fullPath}`);

    return fullPath;
  }

  /**
   * Log event
   */
  logEvent(eventType, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      data
    };
    this.sessionLog.push(entry);
  }

  /**
   * Utility: Print formatted header
   */
  printHeader(title) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${'═'.repeat(60)}\n`);
  }

  /**
   * Utility: Print status
   */
  printStatus(message) {
    console.log(`  ${message}`);
  }

  /**
   * Utility: Print warning
   */
  printWarning(message) {
    console.log(`  ⚠️  ${message}`);
  }

  /**
   * Utility: Print error
   */
  printError(message) {
    console.error(`  ❌ ${message}`);
  }
}

export default AgentCLI;
