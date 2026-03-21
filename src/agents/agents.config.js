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
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
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
    }
  },

  // Agent-to-Model Mapping
  agentModels: {
    // Original Agents
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

    // NEW: Professional Audit Specialist Agents
    'technical-accounting-lead': 'primary',     // Claude - accounting technical expertise
    'controls-governance-assessor': 'primary',  // Claude - control testing and governance
    'compliance-advisor': 'primary',            // Claude - UK regulatory/Companies House
    'transactional-testing-agent': 'primary'    // Claude - detailed transaction testing
  },

  // Fallback chain: try in order
  fallbackChain: ['primary', 'secondary', 'fallback'],

  // Framework configuration
  framework: {
    model: process.env.AGENT_MODEL || 'claude-3-5-sonnet-20241022',
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
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // NEW: PROFESSIONAL AUDIT SPECIALIST AGENTS
    // ═══════════════════════════════════════════════════════════════════════════

    'technical-accounting-lead': {
      model: 'claude-opus-4-6',
      capabilities: [
        'ifrs-16-leases',
        'ifrs-15-revenue',
        'ifrs-17-insurance',
        'frs-102-gaap',
        'fair-value-accounting',
        'goodwill-impairment',
        'consolidations',
        'related-party-transactions',
        'going-concern',
        'significant-accounting-judgments',
        'disclosure-requirements',
        'technical-memo-preparation',
        'assertion-mapping',
        'financial-reporting-standards'
      ],
      focusAreas: [
        'IFRS 16 - Leases',
        'IFRS 15 - Revenue Recognition',
        'IFRS 17 - Insurance Contracts',
        'FRS 102 - Accounting Treatment',
        'Fair Value Accounting',
        'Going Concern Assessment',
        'Significant Accounting Judgments',
        'Financial Statement Assertions'
      ],
      requiresApproval: true,
      auditTrailRequired: true,
      maxTokens: 8000,
      temperature: 0.3
    },

    'controls-governance-assessor': {
      model: 'claude-opus-4-6',
      capabilities: [
        'coso-internal-control-framework',
        'control-environment-assessment',
        'control-design-evaluation',
        'control-testing',
        'segregation-of-duties',
        'reconciliation-controls',
        'authorization-controls',
        'preventive-detective-controls',
        'process-mapping',
        'risk-of-misstatement',
        'transaction-cycle-controls',
        'service-organization-controls',
        'audit-committee-assessment',
        'control-deviation-analysis',
        'isa-330-assessment',
        'isa-402-service-orgs'
      ],
      focusAreas: [
        'COSO Internal Control Framework',
        'Control Environment Evaluation',
        'Control Design & Documentation',
        'Control Testing Procedures',
        'Transaction Cycle Controls',
        'Segregation of Duties',
        'Risk Assessment & Remediation',
        'Service Organization Controls'
      ],
      requiresApproval: true,
      auditTrailRequired: true,
      maxTokens: 8000,
      temperature: 0.3
    },

    'compliance-advisor': {
      model: 'claude-opus-4-6',
      capabilities: [
        'companies-house-2006-act',
        'schedule-1-presentation',
        'schedule-3-small-company',
        'schedule-4-micro-entity',
        'directors-report-requirements',
        'strategic-report-requirements',
        'fca-regulation',
        'isa-compliance-requirements',
        'frs-102-disclosure',
        'frs-105-micro-entity',
        'related-party-transactions',
        'going-concern-disclosure',
        'filing-requirements',
        'disclosure-checklists',
        'regulatory-guidance',
        'independence-verification',
        'audit-documentation-compliance',
        'post-balance-sheet-events'
      ],
      focusAreas: [
        'Companies House 2006 Act Compliance',
        'Schedule 1/3/4 Requirements',
        'Directors\' Report & Strategic Report',
        'FCA Regulatory Requirements',
        'ISA Compliance & Standards',
        'Disclosure Requirements',
        'Filing Deadlines & Requirements',
        'Regulatory Guidance & Interpretation'
      ],
      requiresApproval: true,
      auditTrailRequired: true,
      regutatoryReferenceRequired: true,
      maxTokens: 8000,
      temperature: 0.2
    },

    'transactional-testing-agent': {
      model: 'claude-opus-4-6',
      capabilities: [
        'substantive-procedures',
        'transaction-testing',
        'assertion-testing',
        'occurrence-assertion',
        'completeness-assertion',
        'accuracy-assertion',
        'cutoff-assertion',
        'classification-assertion',
        'valuation-assertion',
        'sampling-methodologies',
        'statistical-sampling',
        'non-statistical-sampling',
        'evidence-collection',
        'evidence-evaluation',
        'control-testing-coordination',
        'finding-documentation',
        'audit-procedures',
        'reconciliation-testing'
      ],
      focusAreas: [
        'Transaction Testing Procedures',
        'Financial Statement Assertions',
        'Sampling Methodologies',
        'Evidence Collection & Evaluation',
        'Finding Documentation',
        'Control Testing Coordination',
        'Audit Procedures Design',
        'Reconciliation Testing'
      ],
      requiresApproval: false,
      auditTrailRequired: true,
      maxTokens: 8000,
      temperature: 0.3
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
