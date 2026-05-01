// ═══════════════════════════════════════════════════════════════
// Agent Orchestrator — Core engine for autonomous audit workflows
// Manages task queues, step execution, and result aggregation
// ═══════════════════════════════════════════════════════════════

import { executeTool } from './tools.js';
import { AGENT_DEFINITIONS } from './definitions/index.js';

// ─── ORCHESTRATOR ───────────────────────────────────────────────────

class AgentOrchestrator {
  constructor() {
    this.taskQueue = [];
    this.isRunning = false;
    this.currentAgent = null;
    this.listeners = new Set();
    this.abortController = null;
  }

  // Subscribe to status updates
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify(event) {
    this.listeners.forEach(fn => {
      try { fn(event); } catch (e) { console.error('Agent listener error:', e); }
    });
  }

  // Get available agent definitions
  getAgentList() {
    return Object.entries(AGENT_DEFINITIONS).map(([key, def]) => ({
      key,
      name: def.name,
      description: def.description,
      icon: def.icon,
      wpScope: def.wpScope,
      estimatedSteps: def.steps?.length || 0,
    }));
  }

  // ─── MAIN ENTRY POINT ─────────────────────────────────────────────

  async runAgent(agentName, engagementState, options = {}) {
    const definition = AGENT_DEFINITIONS[agentName];
    if (!definition) {
      return { success: false, error: `Unknown agent: ${agentName}`, results: [] };
    }

    if (this.isRunning) {
      return { success: false, error: 'An agent is already running', results: [] };
    }

    this.isRunning = true;
    this.currentAgent = agentName;
    this.abortController = new AbortController();

    const runId = 'AGENT-' + Date.now().toString(36).toUpperCase();
    const results = [];
    const log = [];

    this._notify({
      type: 'started',
      runId,
      agentName,
      agentDef: definition,
      totalSteps: definition.steps.length,
    });

    try {
      // Execute each step in sequence
      for (let i = 0; i < definition.steps.length; i++) {
        if (this.abortController.signal.aborted) {
          log.push({ step: i, status: 'aborted' });
          break;
        }

        const step = definition.steps[i];
        this._notify({
          type: 'step_start',
          runId,
          stepIndex: i,
          totalSteps: definition.steps.length,
          step,
        });

        const stepResult = await this._executeStep(step, engagementState, results, options);
        log.push({ step: i, stepName: step.name, ...stepResult });

        if (stepResult.suggestions) {
          results.push(...stepResult.suggestions.map(s => ({
            ...s,
            id: `${runId}-${i}-${results.length + 1}`,
            stepName: step.name,
            status: 'pending',
          })));
        }

        this._notify({
          type: 'step_complete',
          runId,
          stepIndex: i,
          totalSteps: definition.steps.length,
          stepResult,
          resultsSoFar: results.length,
        });
      }
    } catch (err) {
      log.push({ error: err.message });
      this._notify({ type: 'error', runId, error: err.message });
    }

    this.isRunning = false;
    this.currentAgent = null;
    this.abortController = null;

    const finalResult = {
      success: true,
      runId,
      agentName,
      agentLabel: definition.name,
      results,
      log,
      timestamp: new Date().toISOString(),
    };

    this._notify({ type: 'completed', runId, ...finalResult });
    return finalResult;
  }

  // ─── STEP EXECUTION ───────────────────────────────────────────────

  async _executeStep(step, engagementState, previousResults, _options) {
    const suggestions = [];

    try {
      switch (step.type) {
        case 'tool': {
          const params = typeof step.getParams === 'function'
            ? step.getParams(engagementState, previousResults)
            : step.params || {};
          const toolResult = executeTool(step.tool, params, engagementState);
          if (toolResult.success && step.mapResult) {
            const mapped = step.mapResult(toolResult.result, engagementState);
            if (Array.isArray(mapped)) suggestions.push(...mapped);
            else if (mapped) suggestions.push(mapped);
          }
          return { status: 'ok', toolResult, suggestions };
        }

        case 'analyze': {
          const analysis = step.analyze(engagementState, previousResults);
          if (Array.isArray(analysis)) suggestions.push(...analysis);
          else if (analysis) suggestions.push(analysis);
          return { status: 'ok', suggestions };
        }

        case 'multi-tool': {
          const calls = step.getCalls(engagementState, previousResults);
          for (const call of calls) {
            const toolResult = executeTool(call.tool, call.params, engagementState);
            if (toolResult.success && call.mapResult) {
              const mapped = call.mapResult(toolResult.result, engagementState);
              if (Array.isArray(mapped)) suggestions.push(...mapped);
              else if (mapped) suggestions.push(mapped);
            }
          }
          return { status: 'ok', suggestions };
        }

        case 'verify': {
          const issues = step.verify(engagementState, previousResults);
          if (Array.isArray(issues)) suggestions.push(...issues);
          return { status: 'ok', suggestions };
        }

        default:
          return { status: 'skipped', reason: `Unknown step type: ${step.type}` };
      }
    } catch (err) {
      return { status: 'error', error: err.message, suggestions };
    }
  }

  // ─── ABORT ────────────────────────────────────────────────────────

  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this._notify({ type: 'aborted', agentName: this.currentAgent });
    }
  }
}

// Singleton instance
export const orchestrator = new AgentOrchestrator();
export default AgentOrchestrator;
