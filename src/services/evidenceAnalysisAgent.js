/**
 * EVIDENCE ANALYSIS AGENT
 * Analyzes audit evidence quality, sufficiency, and relevance
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet
 */

import { Anthropic } from "@anthropic-ai/sdk";

export class EvidenceAnalysisAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-3-5-sonnet-20241022";
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Evaluate evidence quality
   */
  async evaluateEvidence(evidence) {
    const cacheKey = `evidence_quality_${evidence.id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const prompt = `
Evaluate the quality and sufficiency of audit evidence:

Evidence Type: ${evidence.type || "Document"}
Source: ${evidence.source || "Internal"}
Document: ${evidence.documentName || "Unknown"}
Description: ${evidence.description || "No description"}

Return JSON:
{
  "reliability": "HIGH/MEDIUM/LOW",
  "relevance": "HIGHLY_RELEVANT/RELEVANT/TANGENTIAL",
  "sufficiency": "SUFFICIENT/INSUFFICIENT",
  "score": 0-100,
  "issues": ["Any issues with evidence"],
  "recommendations": ["How to improve or supplement"]
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const evaluation = JSON.parse(text);

    this.cache.set(cacheKey, evaluation);
    setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

    return evaluation;
  }

  /**
   * Assess sufficiency of evidence for assertion
   */
  async assessSufficiency(assertion, evidence) {
    const prompt = `
Assess if evidence is sufficient to support audit assertion:

Assertion: ${assertion.statement}
Type: ${assertion.type} (Existence, Completeness, Rights, Valuation, etc.)
Materiality: ${assertion.materiality}

Supporting Evidence:
${evidence.map((e) => `- ${e.type}: ${e.description}`).join("\n")}

Return JSON:
{
  "sufficient": true/false,
  "confidence": 0-100,
  "gaps": ["Any gaps in evidence"],
  "additionalEvidence": [
    { "type": "Evidence type", "description": "What to collect" }
  ],
  "guidance": "Overall assessment"
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Suggest evidence collection strategy
   */
  async suggestEvidenceStrategy(assertion, fsli) {
    const prompt = `
Recommend an evidence collection strategy for:

Assertion: ${assertion}
FSLI Area: ${fsli}

Return JSON:
{
  "strategy": "Conservative/Balanced/Focused",
  "sources": [
    { "source": "Source type", "documents": ["Doc 1", "Doc 2"], "rationale": "Why this" }
  ],
  "estimatedHours": number,
  "riskFactors": ["Risks to consider"],
  "guidance": "Overall guidance"
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Review and summarize evidence file
   */
  async summarizeEvidenceFile(fileContent, fileType) {
    const prompt = `
Analyze and summarize this audit evidence:

File Type: ${fileType}
Content Summary: ${fileContent.substring(0, 500)}...

Return JSON:
{
  "title": "What this evidence is",
  "relevantTo": ["FSLI areas or assertions"],
  "keyFindings": ["Key data points"],
  "redFlags": ["Any issues or concerns"],
  "usefulness": "HIGH/MEDIUM/LOW",
  "nextSteps": ["Recommended next steps"]
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      agent: "EvidenceAnalysis",
      status: "READY",
      cacheSize: this.cache.size,
      model: this.model,
    };
  }
}

export default new EvidenceAnalysisAgent();
