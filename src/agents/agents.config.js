/**
 * Agent Configuration
 * Centralized configuration for all agents with multi-model support
 */

export const agentConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // AI MODELS - Multi-Model Strategy Configuration
  // ═══════════════════════════════════════════════════════════════════════════
  models: {
    primary: {
      provider: 'anthropic',
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 4096,
      temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.2,
      timeout: 30000,
      priority: 1
    },
    secondary: {
      provider: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      apiKey: process.env.OPENAI_API_KEY,
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 8000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
      timeout: 30000,
      priority: 2
    },
    fallback: {
      provider: 'ollama',
      model: process.env.OLLAMA_MODEL || 'llama3',
      baseURL: process.env.OLLAMA_URL || 'http://localhost:11434',
      maxTokens: parseInt(process.env.OLLAMA_MAX_TOKENS) || 2048,
      temperature: parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.5,
      timeout: 30000,
      priority: 3
    },
    heavy: {
      provider: 'anthropic',
      model: 'claude-opus-4-6',
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxTokens: 64000,
      temperature: 0.2,
      timeout: 120000,
      thinking: { type: "enabled", budget_tokens: 16384 },
      priority: 0
    }
  },

  // Agent-to-Model Mapping
  agentModels: {
    SupervisorAgent: 'primary',           // Use Claude for supervision
    CodeAnalystAgent: 'primary',          // Use Claude for code analysis
    SecurityAgent: 'secondary',           // Use OpenAI for security (better at security)
    DocumentationAgent: 'primary',        // Use Claude for documentation
    ComplianceAgent: 'primary',           // Use Claude for compliance
    TestingAgent: 'secondary',            // Use OpenAI for testing
    AIProcedureEngine: 'primary',         // Use Claude
    ExceptionPredictionEngine: 'primary', // Use Claude
    JurisdictionEngine: 'primary',        // Use Claude
    MaterialityEngine: 'primary',         // Use Claude
    ReportGenerationAgent: 'primary',     // Use Claude
    RiskAssessmentAgent: 'primary',       // Use Claude
    EvidenceAnalysisAgent: 'primary',     // Use Claude
    WorkflowAssistantAgent: 'fallback',   // Use Ollama (fast, local)
    ComplianceAgent_Audit: 'primary',     // Use Claude
    HeavyAutomationService: 'heavy',       // Use Opus 4.6 with extended thinking
    AuditAccuracyEnhancementEngine: 'primary', // Mix of Sonnet + Opus internally
    FinancialStatementAnalysisAgent: 'heavy'    // Opus-heavy for FS compliance/estimates/risk
  },

  // Fallback chain: try in order
  fallbackChain: ['primary', 'secondary', 'fallback'],

  // Framework configuration
  framework: {
    model: process.env.AGENT_MODEL || 'claude-sonnet-4-6',
    maxTokens: parseInt(process.env.AGENT_MAX_TOKENS) || 4096,
    temperature: parseFloat(process.env.AGENT_TEMPERATURE) || 0.2,
    timeout: parseInt(process.env.AGENT_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.AGENT_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.AGENT_RETRY_DELAY) || 1000,
    enableFallback: true,
    healthCheckInterval: 60000 // Check model health every minute
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
