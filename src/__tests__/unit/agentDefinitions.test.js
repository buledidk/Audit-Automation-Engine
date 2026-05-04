/**
 * Agent Definitions — Structural Validation Tests
 * Ensures all 26+ registered agents conform to the required shape
 * and reference valid tools, functions, and WP scopes.
 */

import { describe, it, expect } from 'vitest';
import { AGENT_DEFINITIONS, CORE_AGENTS, ANALYTICAL_AGENTS, FOUNDATIONAL_AGENTS, OPERATIONAL_AGENTS } from '../../agents/definitions/index.js';
import { TOOL_DEFINITIONS } from '../../agents/tools.js';

const VALID_STEP_TYPES = ['analyze', 'tool', 'ai', 'parallel', 'conditional', 'compute'];
const ALL_TOOL_NAMES = Object.keys(TOOL_DEFINITIONS);

describe('Agent Definitions Registry', () => {
  it('should have at least 26 registered agents', () => {
    expect(Object.keys(AGENT_DEFINITIONS).length).toBeGreaterThanOrEqual(26);
  });

  it('should have no duplicate keys', () => {
    const keys = Object.keys(AGENT_DEFINITIONS);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('should group agents into 4 categories', () => {
    expect(Object.keys(CORE_AGENTS).length).toBe(5);
    expect(Object.keys(ANALYTICAL_AGENTS).length).toBe(8);
    expect(Object.keys(FOUNDATIONAL_AGENTS).length).toBe(4);
    expect(Object.keys(OPERATIONAL_AGENTS).length).toBe(9);
  });

  it('should have all grouped agents present in AGENT_DEFINITIONS', () => {
    const allGrouped = {
      ...CORE_AGENTS,
      ...ANALYTICAL_AGENTS,
      ...FOUNDATIONAL_AGENTS,
      ...OPERATIONAL_AGENTS,
    };
    for (const key of Object.keys(allGrouped)) {
      expect(AGENT_DEFINITIONS).toHaveProperty(key);
    }
  });
});

describe('Agent Definition Structure', () => {
  const entries = Object.entries(AGENT_DEFINITIONS);

  entries.forEach(([key, agent]) => {
    describe(`Agent: ${key}`, () => {
      it('should have a name and description (or title)', () => {
        const hasName = typeof agent.name === 'string' || typeof agent.title === 'string';
        const hasDesc = typeof agent.description === 'string' || typeof agent.purpose === 'string';
        expect(hasName).toBe(true);
        expect(hasDesc).toBe(true);
      });

      it('should have an execution model (steps, analyze, execute, calculate, ratios, or wpScope)', () => {
        const hasSteps = Array.isArray(agent.steps);
        const hasAnalyze = typeof agent.analyze === 'function';
        const hasExecute = typeof agent.execute === 'function';
        const hasCalc = typeof agent.calculate === 'function';
        const hasRatios = Array.isArray(agent.ratios) || agent.ratios;
        const hasWpScope = Array.isArray(agent.wpScope);
        const hasRun = typeof agent.run === 'function';
        const hasAny = hasSteps || hasAnalyze || hasExecute || hasCalc || hasRatios || hasWpScope || hasRun;
        expect(hasAny).toBe(true);
      });

      it('should have a non-empty name string', () => {
        expect(typeof agent.name).toBe('string');
        expect(agent.name.length).toBeGreaterThan(0);
      });

      it('should have a non-empty description', () => {
        expect(typeof agent.description).toBe('string');
        expect(agent.description.length).toBeGreaterThan(10);
      });

      it('should have wpScope as an array if step-based', () => {
        if (agent.steps) {
          expect(Array.isArray(agent.wpScope)).toBe(true);
        }
        // Analytical/operational agents may not have wpScope
      });

      it('should have steps as an array (may be empty for event-driven agents)', () => {
        if (agent.steps) {
          expect(Array.isArray(agent.steps)).toBe(true);
        }
      });

      if (agent.steps && agent.steps.length > 0) {
        agent.steps.forEach((step, i) => {
          describe(`Step ${i}: ${step.name || 'unnamed'}`, () => {
            it('should have a name', () => {
              expect(step).toHaveProperty('name');
              expect(typeof step.name).toBe('string');
            });

            it('should have a type string', () => {
              expect(step).toHaveProperty('type');
              expect(typeof step.type).toBe('string');
            });

            if (step.type === 'analyze') {
              it('should have a callable analyze function', () => {
                expect(typeof step.analyze).toBe('function');
              });
            }

            if (step.type === 'tool') {
              it('should reference a registered tool', () => {
                expect(step).toHaveProperty('tool');
                expect(ALL_TOOL_NAMES).toContain(step.tool);
              });

              it('should have getParams function', () => {
                expect(typeof step.getParams).toBe('function');
              });

              it('should have mapResult function', () => {
                expect(typeof step.mapResult).toBe('function');
              });
            }
          });
        });
      }
    });
  });
});
