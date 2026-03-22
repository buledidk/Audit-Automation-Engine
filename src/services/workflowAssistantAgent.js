/**
 * WORKFLOW ASSISTANT AGENT
 * Helps guide auditors through audit workflow and provides real-time assistance
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Haiku (fast, real-time)
 */

import claudeClient, { MODELS, EFFORT } from "./claudeClient.js";

export class WorkflowAssistantAgent {
  constructor() {
    this.claude = claudeClient;
    this.model = MODELS.HAIKU;  // Fast model for real-time guidance
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

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 300,
      thinking: false,
      temperature: 0.5,
    });
    return this.claude.parseJSON(text);
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

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 400,
      thinking: false,
      temperature: 0.4,
    });
    return this.claude.parseJSON(text);
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

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 500,
      thinking: false,
      temperature: 0.6,
    });
    return this.claude.parseJSON(text);
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

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 200,
      thinking: false,
      temperature: 0.7,
    });
    return text || "No answer available";
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

    const { text } = await this.claude.sendMessage({
      prompt,
      model: this.model,
      maxTokens: 400,
      thinking: false,
      temperature: 0.3,
    });
    return this.claude.parseJSON(text);
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
