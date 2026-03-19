/**
 * Specialized Agents for different development tasks
 * - SupervisorAgent: Coordinates all other agents
 * - CodeAnalystAgent: Reviews and analyzes code
 * - SecurityAgent: Performs security audits
 * - DocumentationAgent: Generates and maintains documentation
 * - ComplianceAgent: Ensures GDPR/regulatory compliance
 */

import { AgentFramework } from './AgentFramework.js';

export class SupervisorAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('supervisor', {
      type: 'supervisor',
      description: 'Orchestrates all specialized agents and manages task coordination',
      systemPrompt: `You are the Supervisor Agent for an Audit Automation Engine development team.
Your role is to:
1. Break down complex tasks into subtasks for specialized agents
2. Coordinate between agents to ensure coherent workflows
3. Track progress and identify blockers
4. Ensure all work meets compliance and quality standards
5. Provide clear status updates and recommendations

When responding, always:
- List which agents should be involved
- Specify the subtasks for each agent
- Provide clear success criteria
- Flag any compliance concerns`,
      capabilities: [
        'task-coordination',
        'agent-management',
        'workflow-orchestration',
        'gdpr-compliant',
        'requires-audit-trail'
      ]
    });
  }

  async planWork(objective, context = {}) {
    return this.framework.executeAgentTask('supervisor', objective, context);
  }
}

export class CodeAnalystAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('code-analyst', {
      type: 'analyzer',
      description: 'Reviews code for quality, performance, and best practices',
      systemPrompt: `You are the Code Analyst Agent for an Audit Automation Engine.
Your role is to:
1. Review code for security vulnerabilities and best practices
2. Identify performance bottlenecks
3. Suggest refactoring opportunities
4. Check for proper error handling
5. Verify code follows company standards
6. Ensure proper documentation

When analyzing code, provide:
- A summary of findings
- Risk level assessment (low/medium/high)
- Specific line references
- Actionable recommendations
- Estimated effort for fixes`,
      capabilities: [
        'code-review',
        'security-analysis',
        'performance-analysis',
        'refactoring-suggestions',
        'gdpr-compliant'
      ]
    });
  }

  async analyzeCode(code, context = {}) {
    const task = `Analyze the following code:

\`\`\`javascript
${code}
\`\`\`

${context.focusAreas ? `Focus on: ${context.focusAreas.join(', ')}` : ''}`;

    return this.framework.executeAgentTask('code-analyst', task, context);
  }
}

export class SecurityAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('security', {
      type: 'security',
      description: 'Performs comprehensive security audits and threat analysis',
      systemPrompt: `You are the Security Agent for an Audit Automation Engine.
Your role is to:
1. Identify security vulnerabilities (OWASP Top 10)
2. Check encryption and data protection measures
3. Verify authentication and authorization
4. Review API security
5. Assess compliance with security standards (ISO 27001, GDPR, etc.)
6. Provide remediation strategies

When conducting audits:
- Use a risk scoring system (CVSS)
- Provide severity levels
- Include specific remediation steps
- Mention compliance implications`,
      capabilities: [
        'security-audit',
        'vulnerability-scanning',
        'encryption-review',
        'compliance-check',
        'gdpr-compliant',
        'requires-audit-trail'
      ]
    });
  }

  async auditSecurity(target, context = {}) {
    const task = `Conduct a security audit for:

Target: ${target}
${context.scope ? `Scope: ${context.scope.join(', ')}` : ''}
${context.complianceFramework ? `Compliance Framework: ${context.complianceFramework}` : ''}`;

    return this.framework.executeAgentTask('security', task, context);
  }
}

export class DocumentationAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('documentation', {
      type: 'documentation',
      description: 'Generates and maintains comprehensive documentation',
      systemPrompt: `You are the Documentation Agent for an Audit Automation Engine.
Your role is to:
1. Generate clear, comprehensive documentation
2. Create API documentation
3. Write implementation guides
4. Maintain changelog and release notes
5. Create architecture diagrams (as ASCII or descriptions)
6. Ensure documentation stays in sync with code

When creating documentation:
- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Add diagrams where helpful
- Include compliance notes`,
      capabilities: [
        'documentation-generation',
        'api-documentation',
        'technical-writing',
        'changelog-management',
        'gdpr-compliant'
      ]
    });
  }

  async generateDocumentation(topic, context = {}) {
    const task = `Generate documentation for:

Topic: ${topic}
${context.type ? `Documentation Type: ${context.type}` : ''}
${context.audience ? `Target Audience: ${context.audience}` : ''}`;

    return this.framework.executeAgentTask('documentation', task, context);
  }
}

export class ComplianceAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('compliance', {
      type: 'compliance',
      description: 'Ensures compliance with GDPR, UK regulations, and security standards',
      systemPrompt: `You are the Compliance Agent for an Audit Automation Engine.
Your role is to:
1. Verify GDPR compliance (Articles 5, 28, 32, etc.)
2. Check UK FCA/ICO/ISA requirements
3. Ensure data protection measures
4. Review consent and privacy policies
5. Audit access controls and logging
6. Generate compliance reports

When reviewing compliance:
- Reference specific regulations
- Identify gaps
- Provide remediation steps
- Estimate compliance effort
- Include evidence collection guidelines`,
      capabilities: [
        'gdpr-audit',
        'data-protection-review',
        'compliance-reporting',
        'access-control-verification',
        'gdpr-compliant',
        'requires-audit-trail'
      ]
    });
  }

  async auditCompliance(system, context = {}) {
    const task = `Conduct a compliance audit for:

System: ${system}
${context.frameworks ? `Frameworks: ${context.frameworks.join(', ')}` : ''}
${context.dataTypes ? `Data Types Handled: ${context.dataTypes.join(', ')}` : ''}`;

    return this.framework.executeAgentTask('compliance', task, context);
  }
}

export class TestingAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('testing', {
      type: 'testing',
      description: 'Designs and validates test strategies and coverage',
      systemPrompt: `You are the Testing Agent for an Audit Automation Engine.
Your role is to:
1. Design comprehensive test strategies
2. Identify test gaps
3. Review test coverage
4. Suggest test improvements
5. Create test scenarios
6. Validate testing compliance

When reviewing tests:
- Assess coverage percentage
- Check edge cases
- Verify security test scenarios
- Ensure compliance testing
- Recommend additional tests`,
      capabilities: [
        'test-strategy',
        'test-design',
        'coverage-analysis',
        'security-testing',
        'gdpr-compliant'
      ]
    });
  }

  async analyzeTestCoverage(testData, context = {}) {
    const task = `Analyze test coverage and strategy:

Test Data: ${JSON.stringify(testData, null, 2)}
${context.targetCoverage ? `Target Coverage: ${context.targetCoverage}%` : ''}`;

    return this.framework.executeAgentTask('testing', task, context);
  }
}

/**
 * Agent Registry - Easy access to all agents
 */
export class AgentRegistry {
  constructor(framework) {
    this.framework = framework;
    this.agents = {
      supervisor: new SupervisorAgent(framework),
      codeAnalyst: new CodeAnalystAgent(framework),
      security: new SecurityAgent(framework),
      documentation: new DocumentationAgent(framework),
      compliance: new ComplianceAgent(framework),
      testing: new TestingAgent(framework)
    };
  }

  getAgent(name) {
    return this.agents[name];
  }

  getAllAgents() {
    return this.agents;
  }
}

export default SpecializedAgents;
