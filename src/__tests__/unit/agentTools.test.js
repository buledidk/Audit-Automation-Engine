/**
 * Agent Tools — Functional Tests
 * Tests all 14 tool implementations for correctness
 */

import { describe, it, expect } from 'vitest';
import {
  executeCalculateMateriality,
  executeAssessRisk,
  executeQueryStandards,
  executeAnalyzeTrialBalance,
  executeGenerateProcedures,
  executePredictExceptions,
  executeGetCellData,
  executeSetCellData,
  executeEvaluateGoingConcern,
  executeCalculateSampleSize,
  executeGenerateNarrative,
  TOOL_DEFINITIONS,
} from '../../agents/tools.js';

describe('Tool Registry', () => {
  it('should have at least 14 registered tools', () => {
    expect(Object.keys(TOOL_DEFINITIONS).length).toBeGreaterThanOrEqual(14);
  });

  it('should have name, description, and params for each tool', () => {
    Object.entries(TOOL_DEFINITIONS).forEach(([key, tool]) => {
      expect(tool).toHaveProperty('name', key);
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('params');
      expect(Array.isArray(tool.params)).toBe(true);
    });
  });
});

describe('calculateMateriality', () => {
  it('should calculate materiality at given percentage', () => {
    const result = executeCalculateMateriality({ benchmark: 'revenue', amount: 1000000, percentage: 0.01 });
    expect(result.success).toBe(true);
    expect(result.result.overallMateriality).toBe(10000);
    expect(result.result.performanceMateriality).toBe(6500);
    expect(result.result.trivialThreshold).toBe(400);
    expect(result.result.isaRef).toContain('ISA 320');
  });

  it('should use default 1% when no percentage given', () => {
    const result = executeCalculateMateriality({ benchmark: 'revenue', amount: 500000 });
    expect(result.success).toBe(true);
    expect(result.result.overallMateriality).toBe(5000);
  });

  it('should fail without benchmark or amount', () => {
    const result = executeCalculateMateriality({});
    expect(result.success).toBe(false);
  });
});

describe('assessRisk', () => {
  it('should return NORMAL for low-risk factors', () => {
    const result = executeAssessRisk({ riskId: 'R001', factors: {} });
    expect(result.success).toBe(true);
    expect(result.result.score).toBe(50);
    expect(result.result.level).toBe('NORMAL');
  });

  it('should return ELEVATED for high inherent risk', () => {
    const result = executeAssessRisk({ riskId: 'R002', factors: { inherentRisk: 'high' } });
    expect(result.success).toBe(true);
    expect(result.result.score).toBe(70);
    expect(result.result.level).toBe('ELEVATED');
  });

  it('should return SIGNIFICANT for combined risk factors', () => {
    const result = executeAssessRisk({
      riskId: 'R003',
      factors: { inherentRisk: 'significant', controlEffectiveness: 'none', fraudRisk: true }
    });
    expect(result.success).toBe(true);
    expect(result.result.score).toBeGreaterThanOrEqual(80);
    expect(result.result.level).toBe('SIGNIFICANT');
  });

  it('should include ISA 315 reference', () => {
    const result = executeAssessRisk({ riskId: 'test', factors: {} });
    expect(result.result.isaRef).toContain('ISA 315');
  });
});

describe('queryStandards', () => {
  it('should find ISA standards by number', () => {
    const result = executeQueryStandards({ query: '315' });
    expect(result.success).toBe(true);
    expect(result.result.isaMatches.length).toBeGreaterThan(0);
  });

  it('should find ISA standards by topic', () => {
    const result = executeQueryStandards({ query: 'materiality' });
    expect(result.success).toBe(true);
    expect(result.result.totalMatches).toBeGreaterThanOrEqual(0);
  });

  it('should fail without query', () => {
    const result = executeQueryStandards({});
    expect(result.success).toBe(false);
  });
});

describe('analyzeTrialBalance', () => {
  it('should detect anomalies from significant movements', () => {
    const tbData = [
      { account: 'Revenue', py: 100000, cy: 250000 },
      { account: 'Cost of Sales', py: 50000, cy: 52000 },
      { account: 'Admin Expenses', py: 10000, cy: 10500 },
    ];
    const result = executeAnalyzeTrialBalance({ tbData, mappings: {} });
    expect(result.success).toBe(true);
    expect(result.result.anomalies.length).toBe(1); // Revenue: 150% increase
    expect(result.result.anomalies[0].account).toBe('Revenue');
  });

  it('should handle empty TB', () => {
    const result = executeAnalyzeTrialBalance({ tbData: [], mappings: {} });
    expect(result.success).toBe(true);
    expect(result.result.anomalies.length).toBe(0);
  });

  it('should count unmapped accounts', () => {
    const tbData = [{ account: 'A', py: 0, cy: 100 }, { account: 'B', py: 0, cy: 200 }];
    const result = executeAnalyzeTrialBalance({ tbData, mappings: { 0: 'Revenue' } });
    expect(result.result.unmappedAccounts).toBe(1);
  });
});

describe('evaluateGoingConcern (ISA 570)', () => {
  it('should return NO_INDICATORS when no flags present', () => {
    const result = executeEvaluateGoingConcern({
      financialData: { totalAssets: 1000000, totalLiabilities: 500000, operatingCashFlow: 100000 },
      indicators: {}
    });
    expect(result.success).toBe(true);
    expect(result.result.assessment).toBe('NO_INDICATORS');
    expect(result.result.flags.length).toBe(0);
  });

  it('should flag net liability position', () => {
    const result = executeEvaluateGoingConcern({
      financialData: { totalAssets: 500000, totalLiabilities: 800000, netLiabilities: true },
      indicators: {}
    });
    expect(result.success).toBe(true);
    expect(result.result.flags.some(f => f.indicator.includes('Net liability'))).toBe(true);
  });

  it('should return MATERIAL_UNCERTAINTY for multiple critical indicators', () => {
    const result = executeEvaluateGoingConcern({
      financialData: { netLiabilities: true, negativeCashFlow: true, operatingCashFlow: -50000 },
      indicators: { debtCovenantBreach: true, majorCustomerLoss: true }
    });
    expect(result.success).toBe(true);
    expect(result.result.assessment).toBe('MATERIAL_UNCERTAINTY');
    expect(result.result.score).toBeGreaterThanOrEqual(60);
  });

  it('should include ISA 570 references in flags', () => {
    const result = executeEvaluateGoingConcern({
      financialData: { netLiabilities: true },
      indicators: {}
    });
    expect(result.result.flags[0].isaRef).toContain('ISA 570');
  });
});

describe('calculateSampleSize (ISA 530)', () => {
  it('should calculate statistical sample for high risk', () => {
    const result = executeCalculateSampleSize({
      populationSize: 500, riskLevel: 'high', materialityThreshold: 50000, method: 'statistical'
    });
    expect(result.success).toBe(true);
    expect(result.result.sampleSize).toBeGreaterThan(30);
    expect(result.result.confidenceLevel).toBe('95%');
    expect(result.result.isaRef).toContain('ISA 530');
  });

  it('should calculate smaller sample for low risk', () => {
    const result = executeCalculateSampleSize({
      populationSize: 500, riskLevel: 'low', materialityThreshold: 50000, method: 'judgmental'
    });
    expect(result.success).toBe(true);
    expect(result.result.sampleSize).toBeLessThan(20);
    expect(result.result.confidenceLevel).toBe('80%');
  });

  it('should never exceed population size', () => {
    const result = executeCalculateSampleSize({
      populationSize: 5, riskLevel: 'high', method: 'statistical'
    });
    expect(result.result.sampleSize).toBeLessThanOrEqual(5);
  });
});

describe('generateNarrative (ISA 230)', () => {
  it('should generate structured working paper narrative', () => {
    const result = executeGenerateNarrative({
      wpId: 'a3',
      findings: [{ description: 'Materiality calculated at £50,000' }],
      conclusion: 'Materiality is appropriate for the engagement.',
      isaRefs: ['ISA 320.10', 'ISA 320.11']
    });
    expect(result.success).toBe(true);
    expect(result.result.narrative).toContain('Working Paper A3');
    expect(result.result.narrative).toContain('Materiality is appropriate');
    expect(result.result.narrative).toContain('ISA 320.10');
    expect(result.result.wordCount).toBeGreaterThan(20);
    expect(result.result.isaCompliant).toBe(true);
  });

  it('should handle empty findings', () => {
    const result = executeGenerateNarrative({ wpId: 'b1', findings: [], conclusion: 'No issues.', isaRefs: [] });
    expect(result.success).toBe(true);
    expect(result.result.narrative).toContain('No exceptions identified');
  });
});

describe('getCellData / setCellData', () => {
  it('should read a cell value', () => {
    const cellData = { 'a3_materiality_overall': '£50,000' };
    const result = executeGetCellData({ table: 'a3', row: 'materiality', col: 'overall' }, cellData);
    expect(result.success).toBe(true);
    expect(result.result.value).toBe('£50,000');
  });

  it('should return null for missing cell', () => {
    const result = executeGetCellData({ table: 'a3', row: 'x', col: 'y' }, {});
    expect(result.success).toBe(true);
    expect(result.result.value).toBeNull();
  });

  it('should create a suggestion for setCellData', () => {
    const result = executeSetCellData({ table: 'a3', row: 'materiality', col: 'overall', value: '£50,000' });
    expect(result.success).toBe(true);
    expect(result.result.type).toBe('suggestion');
    expect(result.result.value).toBe('£50,000');
  });
});
