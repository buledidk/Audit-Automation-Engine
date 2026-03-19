/**
 * Agent Integration Module
 * Integrates agents with the Audit Automation Engine
 * Provides unified interface for agent orchestration and monitoring
 */

import { AgentFramework } from './AgentFramework.js';
import { AgentRegistry } from './SpecializedAgents.js';

export class AgentIntegration {
  constructor(auditEngine = null) {
    this.auditEngine = auditEngine;
    this.framework = new AgentFramework();
    this.registry = new AgentRegistry(this.framework);
    this.workflowHistory = [];
    this.complianceCheckpoints = [];
  }

  /**
   * Initialize agent system with audit engine
   */
  async initialize() {
    console.log('🤖 Initializing Agent System...');

    // Register all agents
    const agents = this.registry.getAllAgents();
    console.log(`✅ ${Object.keys(agents).length} agents registered`);

    // Setup compliance monitoring
    this.setupComplianceMonitoring();

    // Setup performance tracking
    this.setupPerformanceTracking();

    console.log('✅ Agent System Ready');
    return this;
  }

  /**
   * Setup compliance monitoring
   */
  setupComplianceMonitoring() {
    this.framework.on('task:completed', (data) => {
      this.complianceCheckpoints.push({
        timestamp: new Date(),
        taskId: data.taskId,
        agentName: data.agentName,
        status: 'compliant',
        dataHandled: data.output ? 'yes' : 'no'
      });
    });
  }

  /**
   * Setup performance tracking
   */
  setupPerformanceTracking() {
    this.framework.on('task:completed', (data) => {
      if (data.executionTime > 5000) {
        console.warn(`⚠️  Slow task: ${data.taskId} took ${data.executionTime}ms`);
      }
    });
  }

  /**
   * Execute development workflow
   */
  async executeDevWorkflow(workflow) {
    console.log(`\n📋 Starting Workflow: ${workflow.name}`);

    const workflowExecution = {
      id: Date.now(),
      name: workflow.name,
      startTime: new Date(),
      steps: [],
      status: 'in-progress'
    };

    try {
      for (const step of workflow.steps) {
        console.log(`\n→ Step: ${step.name}`);

        const result = await this.executeWorkflowStep(step);

        workflowExecution.steps.push({
          name: step.name,
          agent: step.agent,
          status: 'completed',
          result
        });

        // Check compliance after each step
        await this.checkStepCompliance(step, result);
      }

      workflowExecution.status = 'completed';
      workflowExecution.endTime = new Date();

      this.workflowHistory.push(workflowExecution);

      console.log(`\n✅ Workflow "${workflow.name}" completed successfully`);
      return workflowExecution;
    } catch (error) {
      workflowExecution.status = 'failed';
      workflowExecution.error = error.message;
      this.workflowHistory.push(workflowExecution);

      console.error(`\n❌ Workflow "${workflow.name}" failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a single workflow step
   */
  async executeWorkflowStep(step) {
    const agentName = step.agent;
    const task = step.task || step.description;
    const context = step.context || {};

    // Add compliance context
    context.compliance = {
      gdprRequired: true,
      auditTrailRequired: true,
      transparencyRequired: true
    };

    return this.framework.executeAgentTask(agentName, task, context);
  }

  /**
   * Check compliance for a workflow step
   */
  async checkStepCompliance(step, result) {
    if (result.output) {
      // Basic compliance check
      if (result.output.toLowerCase().includes('security issue')) {
        this.complianceCheckpoints.push({
          timestamp: new Date(),
          step: step.name,
          issue: 'potential-security-finding',
          severity: 'medium',
          requiresReview: true
        });
      }
    }
  }

  /**
   * Get comprehensive audit trail
   */
  getAuditTrail() {
    return {
      framework: this.framework.getAuditTrail(),
      workflows: this.workflowHistory,
      complianceCheckpoints: this.complianceCheckpoints,
      metrics: this.framework.getMetrics()
    };
  }

  /**
   * Example: Code Review Workflow
   */
  async codeReviewWorkflow(filePath) {
    return this.executeDevWorkflow({
      name: 'Code Review Workflow',
      steps: [
        {
          name: 'Analyze Code Quality',
          agent: 'code-analyst',
          task: `Review code from ${filePath}`,
          context: { focusAreas: ['security', 'performance', 'maintainability'] }
        },
        {
          name: 'Security Audit',
          agent: 'security',
          task: `Audit security of ${filePath}`,
          context: { scope: ['vulnerabilities', 'encryption', 'access-control'] }
        },
        {
          name: 'Generate Review Report',
          agent: 'documentation',
          task: `Document code review findings for ${filePath}`,
          context: { type: 'code-review-report' }
        }
      ]
    });
  }

  /**
   * Example: Release Readiness Workflow
   */
  async releaseReadinessWorkflow(version) {
    return this.executeDevWorkflow({
      name: `Release Readiness Workflow - v${version}`,
      steps: [
        {
          name: 'Security Verification',
          agent: 'security',
          task: `Verify security readiness for v${version}`,
          context: { scope: ['vulnerabilities', 'encryption', 'authentication'] }
        },
        {
          name: 'Compliance Check',
          agent: 'compliance',
          task: `Verify compliance status for v${version}`,
          context: { frameworks: ['GDPR', 'UK FCA', 'ISO 27001'] }
        },
        {
          name: 'Test Coverage Analysis',
          agent: 'testing',
          task: `Analyze test coverage for v${version}`,
          context: { targetCoverage: 90 }
        },
        {
          name: 'Generate Release Notes',
          agent: 'documentation',
          task: `Generate release notes and deployment guide for v${version}`,
          context: { type: 'release-notes' }
        }
      ]
    });
  }

  /**
   * Example: Feature Development Workflow
   */
  async featureDevelopmentWorkflow(featureName, requirements) {
    return this.executeDevWorkflow({
      name: `Feature Development - ${featureName}`,
      steps: [
        {
          name: 'Plan Implementation',
          agent: 'supervisor',
          task: `Plan implementation for feature: ${featureName}. Requirements: ${requirements.join(', ')}`,
          context: {}
        },
        {
          name: 'Security Design Review',
          agent: 'security',
          task: `Review security implications of ${featureName}`,
          context: { scope: ['access-control', 'data-protection', 'api-security'] }
        },
        {
          name: 'Compliance Check',
          agent: 'compliance',
          task: `Ensure ${featureName} meets GDPR and regulatory requirements`,
          context: {}
        },
        {
          name: 'Create Technical Documentation',
          agent: 'documentation',
          task: `Document technical implementation for ${featureName}`,
          context: { type: 'technical-guide', audience: 'developers' }
        }
      ]
    });
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      agents: this.framework.getAllAgents(),
      metrics: this.framework.getMetrics(),
      workflows: this.workflowHistory.length,
      latestWorkflow: this.workflowHistory[this.workflowHistory.length - 1] || null,
      complianceStatus: {
        gdprCompliant: this.framework.compliance.gdprCompliant,
        dataMinimization: this.framework.compliance.dataMinimization,
        auditTrailActive: this.framework.compliance.auditTrail.length > 0
      },
      complianceCheckpoints: this.complianceCheckpoints.slice(-10)
    };
  }
}

export default AgentIntegration;
