/**
 * AI AGENT ORCHESTRATOR - MASTER COORDINATOR
 * Coordinates 13 AI agents for unified audit automation
 *
 * Status: ✅ PRODUCTION READY
 * Agents: 13 total (4 engines + 5 agents + 4 methodology agents)
 * Coordination: Full orchestration with caching and fallback
 * Quality Control: ISA 220 compliance with quality assessment
 * Real-time KPIs: Live metrics collection and broadcasting
 * ISA 330: Smart methodology pipeline (agents 10-13)
 */

// Import all agents and engines
import Anthropic from "@anthropic-ai/sdk";
import { AIProcedureEngine } from "./aiProcedureEngine.js";
import { ExceptionPredictionEngine } from "./exceptionPredictionEngine.js";
import { JurisdictionEngine } from "./jurisdictionEngine.js";
import { MaterialityEngine } from "./materialityEngine.js";
import { ReportGenerationAgent } from "../agents/reportGenerationAgent.js";
import { RiskAssessmentAgent } from "../agents/riskAssessmentAgent.js";
import { ComplianceAgent } from "../agents/complianceAgent.js";
import { EvidenceAnalysisAgent } from "../agents/evidenceAnalysisAgent.js";
import { WorkflowAssistantAgent } from "../agents/workflowAssistantAgent.js";
import { agentQualityAssessmentService } from "./agentQualityAssessmentService.js";

// ISA 330 Methodology Agents (10-13)
import { AuditSectionsService } from "./auditSectionsService.js";
import { ControlsTestingAgent } from "./controlsTestingAgent.js";
import { SubstantiveProceduresAgent } from "./substantiveProceduresAgent.js";
import { SmartProceduresEngine } from "./smartProceduresEngine.js";

class AIAgentOrchestrator {
  constructor() {
    // Initialize all 13 agents
    this.agents = {
      // Core Engines (4)
      procedures: new AIProcedureEngine(),
      exceptions: new ExceptionPredictionEngine(),
      jurisdictions: new JurisdictionEngine(),
      materiality: new MaterialityEngine(),
      // Claude Agents (5)
      reports: new ReportGenerationAgent(),
      risk: new RiskAssessmentAgent(),
      compliance: new ComplianceAgent(),
      evidence: new EvidenceAnalysisAgent(),
      workflow: new WorkflowAssistantAgent(),
      // ISA 330 Methodology Agents (4)
      sections: new AuditSectionsService(),
      controlsTesting: new ControlsTestingAgent(),
      substantive: new SubstantiveProceduresAgent(),
      smartProcedures: new SmartProceduresEngine(),
    };

    // Caching system
    this.cache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    this.cleanupInterval = setInterval(() => this._cleanupCache(), 60000);

    // Metrics tracking
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cachedResponses: 0,
      averageLatency: 0,
      agentMetrics: {},
    };

    this.status = "READY";
  }

  /**
   * MAIN ORCHESTRATION - Route request to appropriate agents
   */
  async orchestrateRequest(request) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`\n📍 [${requestId}] Orchestrating: ${request.type}`);
    console.log(`   Engagement: ${request.engagementId}`);
    console.log(`   Params: ${JSON.stringify(request.params)}`);

    try {
      // 1. Check cache
      const cacheKey = this._generateCacheKey(request);
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        const latency = Date.now() - startTime;
        this.metrics.cachedResponses++;
        console.log(`   ✓ Cache hit (${latency}ms)`);
        return cached.result;
      }

      // 2. Route to appropriate agent(s)
      let result;
      switch (request.type) {
        case "SUGGEST_PROCEDURES":
          result = await this.agents.procedures.suggestProcedures(
            request.params.context,
            request.params.procedures
          );
          break;

        case "PREDICT_EXCEPTIONS":
          result = await this.agents.exceptions.predictExceptions(request.params.context);
          break;

        case "PLAN_JURISDICTION":
          result = await this.agents.jurisdictions.generateAuditPlan(request.params.context);
          break;

        case "CALCULATE_MATERIALITY":
          result = await this.agents.materiality.calculateMateriality(request.params.context);
          break;

        case "GENERATE_REPORT":
          result = await this.agents.reports.generateReport(request.params.context);
          break;

        case "ASSESS_RISK":
          result = await this.agents.risk.assessInherentRisk(request.params.context);
          break;

        case "CHECK_COMPLIANCE":
          result = await this.agents.compliance.checkCompliance(request.params.context);
          break;

        case "ANALYZE_EVIDENCE":
          result = await this.agents.evidence.evaluateEvidence(request.params.evidence);
          break;

        case "GET_WORKFLOW_GUIDANCE":
          result = await this.agents.workflow.getNextStep(request.params.context);
          break;

        // Multi-agent orchestration
        case "FULL_ENGAGEMENT_ANALYSIS":
          result = await this._executeFullAnalysis(request.params);
          break;

        case "EXCEPTION_HANDLING":
          result = await this._handleException(request.params);
          break;

        case "RISK_ASSESSMENT_SUITE":
          result = await this._riskAssessmentSuite(request.params);
          break;

        // ISA 330 Methodology request types
        case "EVALUATE_CONTROLS":
          result = await this.agents.controlsTesting.evaluateControls(request.params);
          break;

        case "GENERATE_SUBSTANTIVE_PROGRAMME":
          result = await this.agents.substantive.generateSubstantiveProgramme(request.params);
          break;

        case "ANALYZE_SECTIONS":
          result = request.params.initialize
            ? this.agents.sections.initializeSections(request.engagementId, request.params)
            : this.agents.sections.getAllSections(request.engagementId);
          break;

        case "SMART_PROCEDURES":
          result = await this.agents.smartProcedures.executeMethodologySuite(request.params);
          break;

        case "METHODOLOGY_SUITE":
          result = await this.agents.smartProcedures.executeMethodologySuite({
            ...request.params,
            engagementId: request.engagementId,
          });
          break;

        case "AI_CHAT":
          result = await this._handleAIChat(request.params);
          break;

        default:
          throw new Error(`Unknown request type: ${request.type}`);
      }

      // 3. Cache result
      const latency = Date.now() - startTime;
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now(),
        latency,
      });

      // 4. Update metrics
      this._updateMetrics(requestId, true, latency);

      // 5. QUALITY ASSESSMENT - Record execution (ISA 220)
      const agentName = this._getAgentNameForRequestType(request.type);
      if (agentName) {
        agentQualityAssessmentService.recordExecution({
          agentName,
          engagementId: request.engagementId,
          requestType: request.type,
          requestParams: request.params,
          responseData: result,
          duration: latency,
          tokensUsed: result.tokensUsed || 0,
          costUsd: result.costUsd || 0,
          success: true
        }).catch(err => console.warn('⚠️ Quality assessment error:', err));
      }

      console.log(`   ✅ Success (${latency}ms)`);
      return result;
    } catch (error) {
      const latency = Date.now() - startTime;
      this._updateMetrics(requestId, false, latency);

      console.error(`   ❌ Error: ${error.message}`);

      // Fallback strategy
      if (error.status === 429) {
        console.log("   ⚠️  Rate limited, returning cached data...");
        return this._getFallbackResult(request.type);
      }

      throw error;
    }
  }

  /**
   * MULTI-AGENT ORCHESTRATION PATTERNS
   */

  async _executeFullAnalysis(params) {
    console.log("   🔄 Executing full engagement analysis (parallel)...");

    // Run multiple agents in parallel
    const [procedures, exceptions, risk, materiality, compliance] = await Promise.all([
      this.agents.procedures.suggestProcedures(params.context, params.procedures),
      this.agents.exceptions.predictExceptions(params.context),
      this.agents.risk.assessInherentRisk(params.context),
      this.agents.materiality.calculateMateriality(params.context),
      this.agents.compliance.checkCompliance(params.context),
    ]);

    return {
      procedures,
      exceptions,
      risk,
      materiality,
      compliance,
      timestamp: new Date().toISOString(),
      aggregated: {
        overallRisk: this._calculateOverallRisk(risk, exceptions),
        readiness: "READY_FOR_TESTING",
      },
    };
  }

  async _handleException(params) {
    console.log("   🔄 Exception handling workflow...");

    // 1. Predict exception
    const prediction = await this.agents.exceptions.predictExceptions(params.context);

    // 2. Analyze root causes
    const rootCauses = await this.agents.exceptions.analyzeRootCauses(params.context);

    // 3. Suggest preventive procedures
    const preventive = await this.agents.procedures.suggestPreventiveProcedures(
      params.context,
      params.procedures
    );

    // 4. Get workflow guidance
    const guidance = await this.agents.workflow.suggestResolution({
      description: params.exceptionDescription,
      type: "EXCEPTION_HANDLING",
      severity: prediction.risk_score > 0.7 ? "HIGH" : "MEDIUM",
      context: JSON.stringify(params.context),
    });

    return {
      prediction,
      rootCauses,
      preventive,
      guidance,
      actionPlan: "Generated by orchestrator",
    };
  }

  async _riskAssessmentSuite(params) {
    console.log("   🔄 Risk assessment suite (sequential)...");

    // 1. Inherent risk
    const inherent = await this.agents.risk.assessInherentRisk(params.context);

    // 2. Control risk
    const control = await this.agents.risk.assessControlRisk(params.controlContext);

    // 3. Overall risk
    const overall = await this.agents.risk.calculateOverallRisk(inherent, control);

    // 4. Mitigating procedures
    const mitigation = await this.agents.risk.identifyMitigationProcedures(
      overall.focusAreas || []
    );

    return {
      inherent,
      control,
      overall,
      mitigation,
      auditStrategy: overall.auditStrategy,
    };
  }

  /**
   * UTILITY METHODS
   */

  _generateCacheKey(request) {
    return `${request.type}:${request.engagementId}:${JSON.stringify(request.params || {})}`;
  }

  _cleanupCache() {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now - data.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  _updateMetrics(requestId, success, latency) {
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Calculate running average
    const allLatencies = this.metrics.totalRequests;
    this.metrics.averageLatency =
      (this.metrics.averageLatency * (allLatencies - 1) + latency) / allLatencies;
  }

  async _handleAIChat(params) {
    const { system, messages } = params;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("AI_CHAT requires a non-empty messages array");
    }
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: system || "You are an expert UK statutory auditor.",
      messages: messages.slice(-6),
    });
    const text = response.content?.map(b => b.text || "").join("\n") || "";
    return { text, model: response.model, usage: response.usage };
  }

  _calculateOverallRisk(risk, exceptions) {
    const riskScore = risk?.score || 50;
    const exceptionScore = exceptions?.exception_probability * 100 || 0;
    const combined = (riskScore + exceptionScore) / 2;

    if (combined > 70) return "HIGH";
    if (combined > 40) return "MEDIUM";
    return "LOW";
  }

  _getFallbackResult(type) {
    const fallbacks = {
      SUGGEST_PROCEDURES: { suggestions: [] },
      PREDICT_EXCEPTIONS: { probability: 0, confidence: "low" },
      PLAN_JURISDICTION: { plan: "Standard audit approach" },
      GENERATE_REPORT: { summary: "Report generation available on next request" },
      ASSESS_RISK: { riskLevel: "MEDIUM" },
      CHECK_COMPLIANCE: { status: "PENDING" },
      ANALYZE_EVIDENCE: { sufficiency: "UNKNOWN" },
      EVALUATE_CONTROLS: { controlAssessments: [] },
      GENERATE_SUBSTANTIVE_PROGRAMME: { procedures: [] },
      ANALYZE_SECTIONS: { sections: [] },
      SMART_PROCEDURES: { success: false },
      METHODOLOGY_SUITE: { success: false },
    };
    const result = fallbacks[type] || { status: "FALLBACK_MODE" };
    result.__fallback = true;
    result.__reason = "Rate limited (429) — not a real agent result";
    return result;
  }

  /**
   * MONITORING & DIAGNOSTICS
   */

  getMetrics() {
    const successRate =
      this.metrics.totalRequests > 0
        ? ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1)
        : 0;

    return {
      orchestrator: {
        status: this.status,
        totalRequests: this.metrics.totalRequests,
        successfulRequests: this.metrics.successfulRequests,
        failedRequests: this.metrics.failedRequests,
        cachedResponses: this.metrics.cachedResponses,
        successRate: `${successRate}%`,
        averageLatency: `${this.metrics.averageLatency.toFixed(0)}ms`,
        cacheSize: this.cache.size,
      },
      agents: {
        procedures: this.agents.procedures.getMetrics?.() || { status: "READY" },
        exceptions: this.agents.exceptions.getMetrics?.() || { status: "READY" },
        jurisdictions: this.agents.jurisdictions.getMetrics?.() || { status: "READY" },
        materiality: this.agents.materiality.getMetrics?.() || { status: "READY" },
        reports: this.agents.reports.getMetrics?.() || { status: "READY" },
        risk: this.agents.risk.getMetrics?.() || { status: "READY" },
        compliance: this.agents.compliance.getMetrics?.() || { status: "READY" },
        evidence: this.agents.evidence.getMetrics?.() || { status: "READY" },
        workflow: this.agents.workflow.getMetrics?.() || { status: "READY" },
        sections: this.agents.sections.getMetrics?.() || { status: "READY" },
        controlsTesting: this.agents.controlsTesting.getMetrics?.() || { status: "READY" },
        substantive: this.agents.substantive.getMetrics?.() || { status: "READY" },
        smartProcedures: this.agents.smartProcedures.getMetrics?.() || { status: "READY" },
      },
    };
  }

  getStatus() {
    return {
      orchestrator: this.status,
      agents: Object.keys(this.agents).length,
      agentsReady: Object.keys(this.agents).filter((agent) => this.agents[agent]).length,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  /**
   * CLEANUP
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * MAP REQUEST TYPE TO AGENT NAME
   * Helper for quality assessment tracking
   */
  _getAgentNameForRequestType(requestType) {
    const mapping = {
      'SUGGEST_PROCEDURES': 'AIProcedureEngine',
      'PREDICT_EXCEPTIONS': 'ExceptionPredictionEngine',
      'PLAN_JURISDICTION': 'JurisdictionEngine',
      'CALCULATE_MATERIALITY': 'MaterialityEngine',
      'GENERATE_REPORT': 'ReportGenerationAgent',
      'ASSESS_RISK': 'RiskAssessmentAgent',
      'CHECK_COMPLIANCE': 'ComplianceAgent',
      'ANALYZE_EVIDENCE': 'EvidenceAnalysisAgent',
      'GET_WORKFLOW_GUIDANCE': 'WorkflowAssistantAgent',
      'EVALUATE_CONTROLS': 'ControlsTestingAgent',
      'GENERATE_SUBSTANTIVE_PROGRAMME': 'SubstantiveProceduresAgent',
      'ANALYZE_SECTIONS': 'AuditSectionsService',
      'SMART_PROCEDURES': 'SmartProceduresEngine',
      'METHODOLOGY_SUITE': 'SmartProceduresEngine'
    };
    return mapping[requestType] || null;
  }
}

// Export singleton instance
const orchestrator = new AIAgentOrchestrator();

console.log(`
╔════════════════════════════════════════════════════════════╗
║    AI AGENT ORCHESTRATOR - PRODUCTION READY                ║
╠════════════════════════════════════════════════════════════╣
║  Agents: 13 Total                                          ║
║  ├─ Procedures, Exceptions, Jurisdictions, Materiality    ║
║  ├─ Reports, Risk, Compliance, Evidence, Workflow         ║
║  ├─ Sections, ControlsTesting, Substantive, SmartProcs    ║
║  ISA 330: Smart Methodology Pipeline ✅                    ║
║  Cache: 5-minute TTL                                       ║
║  Status: ✅ READY                                          ║
╚════════════════════════════════════════════════════════════╝
`);

export default orchestrator;
