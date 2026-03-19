/**
 * Agent Configuration
 * Centralized configuration for all agents
 */

export const agentConfig = {
  // Framework configuration
  framework: {
    model: process.env.AGENT_MODEL || 'claude-opus-4-6',
    maxTokens: parseInt(process.env.AGENT_MAX_TOKENS) || 4096,
    temperature: parseFloat(process.env.AGENT_TEMPERATURE) || 0.7,
    timeout: parseInt(process.env.AGENT_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.AGENT_RETRY_ATTEMPTS) || 3
  },

  // Agent-specific configurations
  agents: {
    supervisor: {
      model: 'claude-opus-4-6',
      capabilities: ['task-coordination', 'agent-management', 'workflow-orchestration'],
      responseFormat: 'structured',
      requiresApproval: true
    },
    codeAnalyst: {
      model: 'claude-opus-4-6',
      capabilities: ['code-review', 'security-analysis', 'performance-analysis'],
      focusAreas: ['security', 'performance', 'maintainability', 'error-handling'],
      maxCodeSize: 50000
    },
    security: {
      model: 'claude-opus-4-6',
      capabilities: ['vulnerability-scanning', 'encryption-review', 'compliance-check'],
      frameworks: ['OWASP Top 10', 'ISO 27001', 'CWE'],
      riskScoring: true
    },
    documentation: {
      model: 'claude-opus-4-6',
      capabilities: ['documentation-generation', 'api-documentation', 'technical-writing'],
      formats: ['markdown', 'html', 'pdf'],
      includeExamples: true
    },
    compliance: {
      model: 'claude-opus-4-6',
      capabilities: ['gdpr-audit', 'data-protection-review', 'compliance-reporting'],
      frameworks: ['GDPR', 'UK FCA', 'ICO', 'ISA', 'ISO 27001'],
      requiresAuditTrail: true
    },
    testing: {
      model: 'claude-opus-4-6',
      capabilities: ['test-strategy', 'test-design', 'coverage-analysis'],
      minCoverageTarget: 80,
      includeSecurityTests: true
    }
  },

  // Compliance settings
  compliance: {
    gdprEnabled: true,
    gdprArticles: [5, 28, 32, 33, 34, 35],
    auditTrailRequired: true,
    dataMinimization: true,
    encryptionRequired: true,
    consentRequired: false // Disabled for development use
  },

  // Transparency settings
  transparency: {
    logAllActions: true,
    logLevelOfDetail: 'detailed', // 'minimal', 'detailed', 'comprehensive'
    includeTokenUsage: true,
    includeLatency: true,
    includeDecisionRationale: true
  },

  // Performance settings
  performance: {
    enableMetrics: true,
    enableProfiling: false,
    cacheResponses: false,
    parallelExecution: false,
    timeoutWarningThreshold: 5000 // ms
  },

  // Integration settings
  integration: {
    auditEngineIntegration: true,
    loggingToFile: process.env.AGENT_LOG_FILE || './logs/agent-operations.log',
    metricsCollection: true
  },

  // Development settings
  development: {
    debug: process.env.DEBUG === 'true',
    verbose: process.env.VERBOSE === 'true',
    mockResponses: false,
    dryRun: false
  }
};

/**
 * Get agent configuration by name
 */
export function getAgentConfig(agentName) {
  return agentConfig.agents[agentName] || null;
}

/**
 * Validate configuration
 */
export function validateConfig() {
  const required = ['model', 'maxTokens'];
  const framework = agentConfig.framework;

  for (const field of required) {
    if (!framework[field]) {
      throw new Error(`Missing required framework configuration: ${field}`);
    }
  }

  return true;
}

export default agentConfig;
