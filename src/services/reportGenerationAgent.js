/**
 * REPORT GENERATION AGENT
 * Orchestrates generation of audit reports with findings and recommendations
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet (or Opus for complex reports)
 */

import { Anthropic } from "@anthropic-ai/sdk";

export class ReportGenerationAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-3-5-sonnet-20241022";
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

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // More deterministic for reports
    });

    const reportText = message.content[0].type === "text" ? message.content[0].text : "{}";
    const report = JSON.parse(reportText);

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

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return message.content[0].type === "text" ? message.content[0].text : "";
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

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
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
