/**
 * REPORT GENERATION AGENT
 * Orchestrates generation of audit reports with findings and recommendations
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet (or Opus for complex reports)
 */

import claudeClient, { MODELS, EFFORT } from "./claudeClient.js";

export class ReportGenerationAgent {
  constructor() {
    this.claude = claudeClient;
    this.model = MODELS.OPUS;  // Reports use Opus for professional quality
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Generate comprehensive audit report
   */
  async generateReport(context) {
    const cacheKey = `report_${context.engagementId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const prompt = `
You are an expert audit report generator. Generate a professional audit report based on:

Engagement: ${context.engagementName || "Unnamed"}
Entity: ${context.entityName || "Unknown"}
Jurisdiction: ${context.jurisdiction || "N/A"}
Materiality: ${context.materiality || "Not Set"}
Risk Level: ${context.riskLevel || "Medium"}

Findings Summary: ${JSON.stringify(context.findings || [])}
Procedures Performed: ${context.proceduresCount || 0}
Exceptions Found: ${context.exceptionsCount || 0}

Generate a structured JSON report with:
{
  "executiveSummary": "Brief overview",
  "auditScope": "What was audited",
  "findingsSummary": "Key findings and counts",
  "riskAssessment": "Overall risk assessment",
  "recommendations": ["List of 3-5 recommendations"],
  "compliance": "Compliance assessment",
  "conclusion": "Audit opinion"
}

Respond with ONLY valid JSON, no markdown.
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 2000,
      thinking: true,
      effort: EFFORT.MAX,
    });
    const report = this.claude.parseJSON(text);

    // Cache result
    this.cache.set(cacheKey, report);
    setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

    return report;
  }

  /**
   * Generate section-by-section report
   */
  async generateReportSection(engagementId, section, context) {
    const prompt = `
Generate the "${section}" section of an audit report.

Context: ${JSON.stringify(context)}

Generate professional, concise content suitable for ${section}.
Respond with plain text, not JSON.
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 1000,
      thinking: false,
      temperature: 0.2,
    });
    return text || "";
  }

  /**
   * Generate findings summary
   */
  async summarizeFindings(findings) {
    if (!findings || findings.length === 0) {
      return { summary: "No significant findings identified.", count: 0 };
    }

    const prompt = `
Summarize these audit findings into a concise professional summary:

${findings.map((f) => `- ${f.description} (Severity: ${f.severity})`).join("\n")}

Return JSON:
{
  "summary": "Brief summary",
  "count": ${findings.length},
  "severity": "overall severity",
  "impacts": ["List of impacts"]
}
`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 500,
      thinking: false,
      temperature: 0.2,
    });
    return this.claude.parseJSON(text);
  }

  /**
   * Check metric status
   */
  getMetrics() {
    return {
      agent: "ReportGeneration",
      status: "READY",
      cacheSize: this.cache.size,
      model: this.model,
    };
  }
}

export default new ReportGenerationAgent();
