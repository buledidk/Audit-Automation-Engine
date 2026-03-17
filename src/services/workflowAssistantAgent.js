/**
 * WORKFLOW ASSISTANT AGENT
 * Helps guide auditors through audit workflow and provides real-time assistance
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Haiku (fast, real-time)
 */

import { Anthropic } from "@anthropic-ai/sdk";

export class WorkflowAssistantAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-3-5-haiku-20241022"; // Fast model for real-time
    this.cache = new Map();
    this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes (shorter for dynamic content)
  }

  /**
   * Get next recommended step in audit
   */
  async getNextStep(context) {
    const prompt = `
An auditor is at this stage of an audit:

Current Phase: ${context.phase}
Engagement: ${context.engagementName}
Procedures Completed: ${context.proceduresCompleted}
Exceptions Found: ${context.exceptionsFound || 0}
Issues to Address: ${context.openIssues || 0}

What is the most critical next step? Respond concisely.

Return JSON:
{
  "step": "Specific action to take",
  "priority": "CRITICAL/HIGH/MEDIUM/LOW",
  "timeEstimate": "X hours",
  "rationale": "Why this is important",
  "relatedTeamMembers": ["Who should be involved"]
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // Slightly more creative than pure analysis
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Provide guidance on audit procedure
   */
  async guideProcedure(procedureName, context) {
    const prompt = `
Auditor is performing: "${procedureName}"

Context:
- FSLI: ${context.fsli}
- Risk Level: ${context.riskLevel}
- Assertion: ${context.assertion}

Provide brief, practical guidance (2-3 sentences max).

Return JSON:
{
  "guidance": "Practical tip",
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "expectedOutcome": "What you should find",
  "estimatedTime": "X minutes"
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Suggest resolution for issue
   */
  async suggestResolution(issue) {
    const prompt = `
Help resolve this audit issue:

Issue: ${issue.description}
Type: ${issue.type}
Severity: ${issue.severity}
Context: ${issue.context}

Suggest 2-3 ways to resolve this. Be concise.

Return JSON:
{
  "solutions": [
    { "approach": "Description", "pros": ["Pro 1"], "cons": ["Con 1"], "effort": "hours" }
  ],
  "recommended": "Which is best and why"
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Answer quick audit questions
   */
  async answerQuestion(question, context) {
    const prompt = `
Answer this auditor's question in 2-3 sentences:

Question: "${question}"
Audit Context: ${context || "General audit question"}

Be practical and direct.
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return message.content[0].type === "text" ? message.content[0].text : "No answer available";
  }

  /**
   * Validate audit phase completion
   */
  async validatePhaseCompletion(phase, completionData) {
    const prompt = `
Validate if this audit phase is complete:

Phase: ${phase}
Evidence:
${Object.entries(completionData)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

Return JSON:
{
  "complete": true/false,
  "completeness": 0-100,
  "missingItems": ["Item 1"],
  "recommendations": ["Verify X", "Document Y"]
}
`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      agent: "WorkflowAssistant",
      status: "READY",
      model: this.model,
      responseTime: "Fast (Haiku)",
    };
  }
}

export default new WorkflowAssistantAgent();
