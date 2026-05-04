/**
 * Foundational Agent Execution Tests
 * Tests materialityAgent, samplingAgent, goingConcernAgent, documentationAgent
 * with mock engagement state to verify analyze steps produce correct cell suggestions.
 */

import { describe, it, expect } from 'vitest';
import { AGENT_DEFINITIONS } from '../../agents/definitions/index.js';

const mockState = {
  cfg: {
    entityName: 'Test Corp Ltd',
    fye: '2026-03-31',
    framework: 'FRS 102',
    entitySize: 'medium',
    industry: 'Technology',
    revenue: '5000000',
    turnover: '5000000',
    profitBeforeTax: '500000',
    totalAssets: '3000000',
    netAssets: '1500000',
    overallMateriality: '37500',
    performanceMateriality: '26250',
    firmName: 'TestFirm LLP',
    partner: 'J. Smith',
    revenueRisk: 'high',
    payablesRisk: 'medium',
    configured: true,
  },
  cellData: {
    'a1_entity_name': 'Test Corp Ltd',
    'a3_overall_materiality': '£37,500',
    'a4_audit_approach': 'Substantive',
  },
  signOffs: { a1: true, a3: true },
  ind: { l: 'Technology', r: [{ t: 'Revenue recognition', lv: 'SIGNIFICANT' }] },
};

describe('Materiality Agent (ISA 320/450)', () => {
  const agent = AGENT_DEFINITIONS.materiality;

  it('should be registered with correct metadata', () => {
    expect(agent.name).toBe('Materiality Agent');
    expect(agent.wpScope).toContain('a3');
    expect(agent.steps.length).toBeGreaterThanOrEqual(3);
  });

  it('step 1: should calculate multi-benchmark materiality', () => {
    const step = agent.steps[0];
    expect(step.type).toBe('analyze');
    const suggestions = step.analyze(mockState);
    expect(suggestions.length).toBeGreaterThan(0);

    const omSuggestion = suggestions.find(s => s.field === 'overall_materiality');
    expect(omSuggestion).toBeDefined();
    expect(omSuggestion.value).toContain('£');
    expect(omSuggestion.reason).toContain('ISA 320');
  });

  it('step 1: should use PBT benchmark for profitable entities', () => {
    const step = agent.steps[0];
    const suggestions = step.analyze(mockState);
    const benchmarkSuggestion = suggestions.find(s => s.field === 'primary_benchmark');
    expect(benchmarkSuggestion.value).toBe('Profit before tax');
  });

  it('step 2: should assess revision triggers', () => {
    const step = agent.steps[1];
    const suggestions = step.analyze(mockState);
    const trigger = suggestions.find(s => s.field === 'revision_required');
    expect(trigger).toBeDefined();
    expect(trigger.value).toContain('NO');
  });

  it('step 3: should evaluate accumulated misstatements', () => {
    const stateWithMisstatements = {
      ...mockState,
      cfg: { ...mockState.cfg, accumulatedMisstatements: '20000', overallMateriality: '37500' }
    };
    const step = agent.steps[2];
    const suggestions = step.analyze(stateWithMisstatements);
    const assessment = suggestions.find(s => s.field === 'misstatement_assessment');
    expect(assessment).toBeDefined();
    expect(assessment.value).toContain('SIGNIFICANT');
  });
});

describe('Sampling Agent (ISA 530)', () => {
  const agent = AGENT_DEFINITIONS.sampling;

  it('should be registered with correct metadata', () => {
    expect(agent.name).toBe('Sampling Agent');
    expect(agent.wpScope).toContain('b2');
  });

  it('step 1: should determine per-FSLI sampling approach', () => {
    const step = agent.steps[0];
    const suggestions = step.analyze(mockState);
    expect(suggestions.length).toBeGreaterThan(0);

    const revenueSample = suggestions.find(s => s.value.includes('Revenue'));
    expect(revenueSample).toBeDefined();
    expect(revenueSample.reason).toContain('HIGH');
  });

  it('step 2: should set high-value threshold from materiality', () => {
    const step = agent.steps[1];
    const suggestions = step.analyze(mockState);
    const threshold = suggestions.find(s => s.field === 'high_value_threshold');
    expect(threshold).toBeDefined();
    expect(threshold.value).toContain('£');
  });

  it('step 3: should evaluate sample results', () => {
    const stateWithResults = {
      cfg: { ...mockState.cfg, exceptionsFound: '3', sampleSize: '25', populationSize: '500', avgExceptionValue: '2000' }
    };
    const step = agent.steps[2];
    const suggestions = step.analyze(stateWithResults);
    const conclusion = suggestions.find(s => s.field === 'sample_conclusion');
    expect(conclusion).toBeDefined();
  });
});

describe('Going Concern Agent (ISA 570)', () => {
  const agent = AGENT_DEFINITIONS.goingConcern;

  it('should be registered with correct metadata', () => {
    expect(agent.name).toBe('Going Concern Agent');
    expect(agent.wpScope).toContain('a6');
  });

  it('step 1: should be a tool step using evaluateGoingConcern', () => {
    const step = agent.steps[0];
    expect(step.type).toBe('tool');
    expect(step.tool).toBe('evaluateGoingConcern');
    expect(typeof step.getParams).toBe('function');
    expect(typeof step.mapResult).toBe('function');
  });

  it('step 1: getParams should extract financial data from state', () => {
    const step = agent.steps[0];
    const params = step.getParams({ cfg: { totalAssets: '1000000', totalLiabilities: '500000', operatingCashFlow: '100000' } });
    expect(params).toHaveProperty('financialData');
    expect(params).toHaveProperty('indicators');
  });

  it('step 1: mapResult should produce cell suggestions', () => {
    const step = agent.steps[0];
    const mockResult = { score: 25, assessment: 'INDICATORS_PRESENT', flags: [{ indicator: 'Test', severity: 'medium', isaRef: 'ISA 570.A3' }], conclusion: 'Monitor', assessmentPeriod: '12 months', isaRef: 'ISA 570' };
    const suggestions = step.mapResult(mockResult);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].wp).toBe('a6');
  });

  it('step 2: should assess management forecast', () => {
    const step = agent.steps[1];
    expect(step.type).toBe('analyze');
    const suggestions = step.analyze({ cfg: { managementForecastAvailable: 'true', forecastPeriodMonths: '18' } });
    const forecast = suggestions.find(s => s.field === 'management_forecast');
    expect(forecast.value).toContain('18-month');
  });
});

describe('Documentation Agent (ISA 230)', () => {
  const agent = AGENT_DEFINITIONS.documentation;

  it('should be registered with correct metadata', () => {
    expect(agent.name).toBe('Documentation Agent');
    expect(agent.wpScope.length).toBe(10); // a1-a10
  });

  it('step 1: should validate documentation completeness', () => {
    const step = agent.steps[0];
    const suggestions = step.analyze(mockState);
    const completion = suggestions.find(s => s.field === 'documentation_completion');
    expect(completion).toBeDefined();
    expect(completion.value).toContain('%');
  });

  it('step 1: should identify documentation gaps', () => {
    const step = agent.steps[0];
    const sparseState = { cfg: {}, cellData: { 'a1_test': 'x' }, signOffs: {} };
    const suggestions = step.analyze(sparseState);
    const gaps = suggestions.find(s => s.field === 'documentation_gaps');
    expect(gaps).toBeDefined();
    expect(gaps.value).toContain('NOT signed off');
  });

  it('step 2: should be a tool step using generateNarrative', () => {
    const step = agent.steps[1];
    expect(step.type).toBe('tool');
    expect(step.tool).toBe('generateNarrative');
  });

  it('step 3: should build audit file index', () => {
    const step = agent.steps[2];
    const suggestions = step.analyze(mockState);
    const index = suggestions.find(s => s.field === 'audit_file_index');
    expect(index).toBeDefined();
  });

  it('step 4: should check ISA 230 required elements', () => {
    const step = agent.steps[3];
    const suggestions = step.analyze(mockState);
    const checklist = suggestions.find(s => s.field === 'isa230_checklist');
    expect(checklist).toBeDefined();
    expect(checklist.value).toMatch(/\d+\/\d+/); // e.g. "3/7"
  });
});
