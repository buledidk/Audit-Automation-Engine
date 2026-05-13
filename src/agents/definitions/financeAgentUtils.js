// ═══════════════════════════════════════════════════════════════
// Finance Agent Utilities — Shared helpers for finance ops agents
// Provides AI-powered narrative generation via the /api/ai proxy
// ═══════════════════════════════════════════════════════════════

import { AiProxyClient } from '../../services/aiProxyClient.js';

const aiClient = new AiProxyClient();

/**
 * Generate ISA-compliant narrative from agent results using Claude.
 * Falls back to the agent's own generateFindings() if AI is unavailable.
 */
export async function generateAINarrative(agent, results, context = {}) {
  const staticFindings = agent.generateFindings(results);

  try {
    const response = await aiClient.messages.create({
      model: context.model || 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: `You are a senior UK statutory auditor drafting ISA-compliant working paper narratives.
Write concise, professional audit documentation. Reference ISA standards by number.
Use UK English. Do not add disclaimers or caveats. Output plain text, not markdown.
The findings below are machine-generated — rewrite them as polished audit documentation.`,
      messages: [
        {
          role: 'user',
          content: `Rewrite these ${agent.name} findings as polished ISA-compliant audit documentation:\n\n${staticFindings}\n\nEntity: ${context.entityName || 'N/A'}\nFramework: ${context.framework || 'FRS 102'}\nMateriality: £${(context.materiality || 0).toLocaleString()}\nPeriod: ${context.periodEnd || 'N/A'}`,
        },
      ],
    });

    const aiText = response?.content?.[0]?.text;
    return aiText || staticFindings;
  } catch {
    // AI unavailable — return static findings (offline-first)
    return staticFindings;
  }
}

/**
 * Wrap an analytical agent as an orchestrator-compatible step definition.
 * Allows AGENT_DEFINITIONS agents to invoke finance agents via the step runner.
 */
export function asOrchestratorStep(agent, dataExtractor) {
  return {
    name: agent.name,
    type: 'analyze',
    analyze: (state) => {
      const data = dataExtractor(state);
      const results = agent.analyze(data.primary, data.secondary, data.context);
      const findings = agent.generateFindings(results);
      const affected = agent.getAffectedSections(results);

      return {
        agentId: agent.id,
        status: results.overallStatus,
        findings,
        affectedSections: affected,
        warnings: results.warnings || [],
        raw: results,
      };
    },
  };
}

/**
 * Common rounding utility.
 */
export function round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}

/**
 * Format currency value for audit documentation.
 */
export function formatCurrency(val, currency = '£') {
  if (val === null || val === undefined) return 'N/A';
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return val < 0 ? `(${currency}${formatted})` : `${currency}${formatted}`;
}

/**
 * Calculate percentage safely.
 */
export function pct(numerator, denominator, dp = 1) {
  if (!denominator || denominator === 0) return null;
  return round((numerator / denominator) * 100, dp);
}
