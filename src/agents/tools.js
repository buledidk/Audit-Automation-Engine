// ═══════════════════════════════════════════════════════════════
// Agent Tools — Capabilities available to agent definitions
// Each tool wraps an existing service/engine for agent use
// ═══════════════════════════════════════════════════════════════

import { AIProcedureEngine } from '../services/aiProcedureEngine.js';
import { ExceptionPredictionEngine } from '../services/exceptionPredictionEngine.js';
import { ISA_UK_STANDARDS } from '../StandardsLibrary.js';
import { CROSS_REFERENCE_INDEX } from '../CrossReferenceIndex.js';
import { agenticFileProcessor } from '../services/AgenticFileProcessor.js';
import { fileIngestionEngine } from '../services/FileIngestionEngine.js';

// Instantiate engines for tool use
const aiProcedureEngine = new AIProcedureEngine();
const exceptionEngine = new ExceptionPredictionEngine();

// ─── TOOL REGISTRY ──────────────────────────────────────────────────

export const TOOL_DEFINITIONS = {
  calculateMateriality: {
    name: 'calculateMateriality',
    description: 'Calculate materiality using ISA 320 benchmarks',
    params: ['benchmark', 'amount', 'percentage'],
  },
  assessRisk: {
    name: 'assessRisk',
    description: 'Score and assess audit risk for a given area',
    params: ['riskId', 'factors'],
  },
  queryStandards: {
    name: 'queryStandards',
    description: 'Search ISA/FRS standards and cross-reference index',
    params: ['query'],
  },
  analyzeTrialBalance: {
    name: 'analyzeTrialBalance',
    description: 'Detect anomalies and patterns in trial balance data',
    params: ['tbData', 'mappings'],
  },
  generateProcedures: {
    name: 'generateProcedures',
    description: 'Generate relevant audit procedures for a working paper',
    params: ['wpId', 'context'],
  },
  predictExceptions: {
    name: 'predictExceptions',
    description: 'Predict audit exceptions from engagement data',
    params: ['engagementData'],
  },
  getCellData: {
    name: 'getCellData',
    description: 'Read a cell value from the engagement',
    params: ['table', 'row', 'col'],
  },
  setCellData: {
    name: 'setCellData',
    description: 'Write a value to an engagement cell (queued as suggestion)',
    params: ['table', 'row', 'col', 'value'],
  },
  processFile: {
    name: 'processFile',
    description: 'Ingest and analyse a file through specialised AI agents (TB, journals, bank statements). Handles Excel, CSV, JSON up to 100MB with chunked processing.',
    params: ['source', 'options'],
  },
  ingestTrialBalance: {
    name: 'ingestTrialBalance',
    description: 'Specialised TB ingestion — auto-detects columns, validates balance, maps to FSLI codes',
    params: ['source', 'options'],
  },
  summariseForAgent: {
    name: 'summariseForAgent',
    description: 'Compress ingested file data into a compact summary for AI agent context windows',
    params: ['ingestedData', 'options'],
  },
};

// ─── TOOL IMPLEMENTATIONS ───────────────────────────────────────────

export function executeCalculateMateriality({ benchmark, amount, percentage }) {
  if (!benchmark || !amount) {
    return { success: false, error: 'benchmark and amount are required' };
  }
  const pct = percentage || 0.01;
  const materiality = Math.round(amount * pct);
  const perfMateriality = Math.round(materiality * 0.65);
  const trivial = Math.round(materiality * 0.04);
  return {
    success: true,
    result: {
      benchmark,
      baseAmount: amount,
      percentage: pct,
      overallMateriality: materiality,
      performanceMateriality: perfMateriality,
      trivialThreshold: trivial,
      isaRef: 'ISA 320.10-11',
    },
  };
}

export function executeAssessRisk({ riskId, factors }) {
  const safeFactors = factors || {};
  let score = 50;
  if (safeFactors.inherentRisk === 'high') score += 20;
  if (safeFactors.inherentRisk === 'significant') score += 35;
  if (safeFactors.controlEffectiveness === 'weak') score += 15;
  if (safeFactors.controlEffectiveness === 'none') score += 25;
  if (safeFactors.fraudRisk) score += 15;
  if (safeFactors.estimationUncertainty) score += 10;
  if (safeFactors.relatedParty) score += 10;
  if (safeFactors.firstYearAudit) score += 5;
  score = Math.min(100, score);

  const level = score >= 80 ? 'SIGNIFICANT' : score >= 60 ? 'ELEVATED' : 'NORMAL';
  return {
    success: true,
    result: {
      riskId,
      score,
      level,
      factors: safeFactors,
      response: level === 'SIGNIFICANT'
        ? 'Extended substantive procedures required. Consider specialist involvement.'
        : level === 'ELEVATED'
          ? 'Enhanced substantive procedures. Increase sample sizes.'
          : 'Standard audit procedures with routine testing.',
      isaRef: 'ISA 315.25-27',
    },
  };
}

export function executeQueryStandards({ query }) {
  if (!query) return { success: false, error: 'query is required' };
  const q = query.toLowerCase();

  const isaResults = ISA_UK_STANDARDS.filter(s =>
    s.number.toLowerCase().includes(q) ||
    s.title.toLowerCase().includes(q) ||
    s.objective.toLowerCase().includes(q)
  ).slice(0, 10).map(s => ({
    number: s.number,
    title: s.title,
    objective: s.objective,
    source: 'ISA_UK_STANDARDS',
  }));

  const xrefResults = [];
  if (CROSS_REFERENCE_INDEX) {
    const entries = Array.isArray(CROSS_REFERENCE_INDEX) ? CROSS_REFERENCE_INDEX : Object.values(CROSS_REFERENCE_INDEX).flat();
    entries.filter(e => {
      const str = JSON.stringify(e).toLowerCase();
      return str.includes(q);
    }).slice(0, 5).forEach(e => xrefResults.push(e));
  }

  return {
    success: true,
    result: {
      query,
      isaMatches: isaResults,
      crossReferences: xrefResults,
      totalMatches: isaResults.length + xrefResults.length,
    },
  };
}

export function executeAnalyzeTrialBalance({ tbData, mappings }) {
  const safeTb = tbData || [];
  const safeMappings = mappings || {};
  const anomalies = [];

  safeTb.forEach((row, i) => {
    if (!row) return;
    const py = row.py || 0;
    const cy = row.cy || 0;
    const diff = cy - py;
    const pctChange = py !== 0 ? Math.abs(diff / py) * 100 : (cy !== 0 ? 100 : 0);

    if (pctChange > 50 && Math.abs(diff) > 1000) {
      anomalies.push({
        rowIndex: i,
        account: row.account || row.name || `Row ${i}`,
        priorYear: py,
        currentYear: cy,
        change: diff,
        percentChange: Math.round(pctChange),
        category: safeMappings[i] || 'Unmapped',
        severity: pctChange > 100 ? 'high' : 'medium',
        suggestion: `Investigate ${Math.round(pctChange)}% movement in ${row.account || 'this account'}`,
      });
    }
  });

  const unmappedCount = safeTb.filter((_, i) => !safeMappings[i]).length;

  return {
    success: true,
    result: {
      totalAccounts: safeTb.length,
      anomalies,
      unmappedAccounts: unmappedCount,
      summary: `${anomalies.length} anomalies detected across ${safeTb.length} accounts. ${unmappedCount} unmapped.`,
    },
  };
}

export function executeGenerateProcedures({ wpId, context }) {
  const safeCfg = context?.cfg || {};
  const safeIndustryData = context?.industryData || null;
  const safeCellData = context?.cellData || {};

  const procedures = aiProcedureEngine.suggestProcedures
    ? aiProcedureEngine.suggestProcedures(safeCfg, wpId, safeCellData, safeIndustryData)
    : [];

  return {
    success: true,
    result: {
      wpId,
      procedures: procedures || [],
      count: procedures?.length || 0,
    },
  };
}

export function executePredictExceptions({ engagementData }) {
  const d = engagementData || {};
  const predictions = exceptionEngine.predictExceptions
    ? exceptionEngine.predictExceptions(
        d.cfg || {},
        d.cellData || {},
        d.signOffs || {},
        d.tbData || [],
        d.industryData || null,
        d.visibleWPs || []
      )
    : [];

  return {
    success: true,
    result: {
      predictions: predictions || [],
      count: predictions?.length || 0,
    },
  };
}

export function executeGetCellData({ table, row, col }, cellData) {
  const key = `${table}_${row}_${col}`;
  return {
    success: true,
    result: { key, value: cellData?.[key] || null },
  };
}

export function executeSetCellData({ table, row, col, value }) {
  const key = `${table}_${row}_${col}`;
  return {
    success: true,
    result: {
      key,
      value,
      type: 'suggestion',
      message: `Set ${key} = ${value}`,
    },
  };
}

// ─── TOOL EXECUTOR ──────────────────────────────────────────────────

export function executeTool(toolName, params, engagementState) {
  switch (toolName) {
    case 'calculateMateriality':
      return executeCalculateMateriality(params);
    case 'assessRisk':
      return executeAssessRisk(params);
    case 'queryStandards':
      return executeQueryStandards(params);
    case 'analyzeTrialBalance':
      return executeAnalyzeTrialBalance(params);
    case 'generateProcedures':
      return executeGenerateProcedures(params);
    case 'predictExceptions':
      return executePredictExceptions(params);
    case 'getCellData':
      return executeGetCellData(params, engagementState?.cellData);
    case 'setCellData':
      return executeSetCellData(params);
    case 'processFile':
      return executeProcessFile(params);
    case 'ingestTrialBalance':
      return executeIngestTrialBalance(params);
    case 'summariseForAgent':
      return executeSummariseForAgent(params);
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ─── FILE PROCESSING TOOLS ─────────────────────────────────────────

export async function executeProcessFile({ source, options }) {
  return agenticFileProcessor.processFile(source, options || {});
}

export async function executeIngestTrialBalance({ source, options }) {
  return fileIngestionEngine.ingestTrialBalance(source, options || {});
}

export function executeSummariseForAgent({ ingestedData, options }) {
  return {
    success: true,
    result: fileIngestionEngine.summariseForAgent(ingestedData, options || {}),
  };
}
