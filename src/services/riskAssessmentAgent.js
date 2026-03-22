/**
 * RISK ASSESSMENT AGENT
 * Evaluates and categorizes audit risks with detailed analysis
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude Opus (via claudeClient sendMessage API)
 */

import claudeClient, { MODELS, EFFORT } from "./claudeClient.js";

export class RiskAssessmentAgent {
  constructor() {
    this.claude = claudeClient;
    this.model = MODELS.OPUS;  // Risk assessment uses Opus for deep reasoning
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Assess inherent risk for an area
   */
  async assessInherentRisk(context) {
    const cacheKey = `risk_inherent_${context.fsli}_${context.industry}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const prompt = `
You are an expert auditor assessing inherent risk. Evaluate risk for:

FSLI Area: ${context.fsli}
Industry: ${context.industry}
Entity Type: ${context.entityType}
Prior Issues: ${context.priorIssues || 0}
Materiality: ${context.materiality}

Return structured JSON:
{
  "riskLevel": "HIGH/MEDIUM/LOW",
  "score": 0-100,
  "factors": ["Key risk factors"],
  "procedures": ["Recommended procedures"],
  "guidance": "Brief explanation"
}

Respond with ONLY valid JSON.
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 1000,
      thinking: true,
      effort: EFFORT.HIGH,
      domain: "riskAssessment",
    });

    const risk = this.claude.parseJSON(text);

    this.cache.set(cacheKey, risk);
    setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

    return risk;
  }

  /**
   * Assess control risk
   */
  async assessControlRisk(context) {
    const prompt = `
Assess control risk based on:

Entity Size: ${context.entitySize}
Control Environment: ${context.controlEnvironment || "Not Assessed"}
IT Systems: ${context.itComplexity || "Basic"}
Prior Control Issues: ${context.priorControlIssues || 0}

Return JSON:
{
  "controlRisk": "HIGH/MEDIUM/LOW",
  "score": 0-100,
  "weaknesses": ["Any control weaknesses identified"],
  "mitigation": "How to mitigate",
  "testing": "Recommended testing"
}
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 800,
      thinking: true,
      effort: EFFORT.HIGH,
      domain: "riskAssessment",
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Calculate overall risk level
   */
  async calculateOverallRisk(inherentRisk, controlRisk) {
    const inherentScore = inherentRisk?.score || 50;
    const controlScore = controlRisk?.score || 50;

    // Risk of misstatement = Inherent Risk × Control Risk
    const detectionRiskRequired = (inherentScore * controlScore) / 10000;

    const prompt = `
Calculate overall audit risk:

Inherent Risk Score: ${inherentScore}/100
Control Risk Score: ${controlScore}/100
Detection Risk Target: ${(detectionRiskRequired * 100).toFixed(2)}%

Return JSON:
{
  "overallRisk": "HIGH/MEDIUM/LOW",
  "riskScore": number,
  "auditStrategy": "Conservative/Balanced/Focused",
  "sampleSizeMultiplier": 1-3,
  "focusAreas": ["Areas requiring more testing"]
}
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 500,
      thinking: true,
      effort: EFFORT.HIGH,
      domain: "riskAssessment",
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Identify risk mitigation procedures
   */
  async identifyMitigationProcedures(risks) {
    const prompt = `
For these identified risks, recommend specific audit procedures:

${risks.map((r) => `- ${r.description} (Level: ${r.level})`).join("\n")}

Return JSON:
{
  "procedures": [
    { "risk": "Risk name", "procedure": "Specific procedure", "effectiveness": "%" }
  ],
  "totalProcedures": number
}
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 1000,
      thinking: true,
      effort: EFFORT.HIGH,
      domain: "riskAssessment",
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      agent: "RiskAssessment",
      status: "READY",
      cacheSize: this.cache.size,
      model: this.model,
      api: "claude.sendMessage",
      thinking: true,
    };
  }
}

export default new RiskAssessmentAgent();
