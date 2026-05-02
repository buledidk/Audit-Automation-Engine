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
  evaluateGoingConcern: {
    name: 'evaluateGoingConcern',
    description: 'Evaluate going concern indicators per ISA 570 — cash flow, debt covenants, order book, net liabilities',
    params: ['financialData', 'indicators'],
  },
  calculateSampleSize: {
    name: 'calculateSampleSize',
    description: 'Calculate audit sample size per ISA 530 using statistical or judgmental methods',
    params: ['populationSize', 'riskLevel', 'materialityThreshold', 'method'],
  },
  generateNarrative: {
    name: 'generateNarrative',
    description: 'Generate structured audit narrative for working paper conclusions per ISA 230',
    params: ['wpId', 'findings', 'conclusion', 'isaRefs'],
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
    case 'evaluateGoingConcern':
      return executeEvaluateGoingConcern(params);
    case 'calculateSampleSize':
      return executeCalculateSampleSize(params);
    case 'generateNarrative':
      return executeGenerateNarrative(params);
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ─── FOUNDATIONAL AUDIT TOOLS ───────────────────────────────────────

export function executeEvaluateGoingConcern({ financialData, indicators }) {
  const fd = financialData || {};
  const ind = indicators || {};
  const flags = [];
  let score = 0;

  // ISA 570.10 — Financial indicators
  if (fd.netLiabilities || (fd.totalLiabilities > fd.totalAssets)) {
    flags.push({ indicator: "Net liability position", severity: "high", isaRef: "ISA 570.A3" });
    score += 25;
  }
  if (fd.negativeCashFlow || fd.operatingCashFlow < 0) {
    flags.push({ indicator: "Negative operating cash flow", severity: "high", isaRef: "ISA 570.A3" });
    score += 20;
  }
  if (ind.debtCovenantBreach) {
    flags.push({ indicator: "Debt covenant breach", severity: "critical", isaRef: "ISA 570.A4" });
    score += 30;
  }
  if (ind.loanMaturityNoRefinancing) {
    flags.push({ indicator: "Loan maturity without refinancing", severity: "high", isaRef: "ISA 570.A4" });
    score += 20;
  }
  // ISA 570.A5 — Operating indicators
  if (ind.keyManagementDeparture) {
    flags.push({ indicator: "Key management departure without replacement", severity: "medium", isaRef: "ISA 570.A5" });
    score += 10;
  }
  if (ind.majorCustomerLoss) {
    flags.push({ indicator: "Loss of major customer/supplier", severity: "high", isaRef: "ISA 570.A5" });
    score += 15;
  }
  if (ind.regulatoryAction) {
    flags.push({ indicator: "Adverse regulatory action", severity: "high", isaRef: "ISA 570.A6" });
    score += 15;
  }

  score = Math.min(100, score);
  const assessment = score >= 60 ? "MATERIAL_UNCERTAINTY" : score >= 30 ? "INDICATORS_PRESENT" : "NO_INDICATORS";

  return {
    success: true,
    result: {
      score,
      assessment,
      flags,
      conclusion: assessment === "MATERIAL_UNCERTAINTY"
        ? "Material uncertainty exists. ISA 570 paragraph disclosure required. Consider adequacy of going concern basis."
        : assessment === "INDICATORS_PRESENT"
          ? "Going concern indicators present but mitigated. Document management's plans and assess their feasibility."
          : "No significant going concern indicators identified. Document assessment per ISA 570.10.",
      isaRef: "ISA 570.10-16",
      assessmentPeriod: "12 months from date of approval of financial statements",
    },
  };
}

export function executeCalculateSampleSize({ populationSize, riskLevel, materialityThreshold, method }) {
  const pop = populationSize || 100;
  const risk = (riskLevel || "medium").toLowerCase();
  const mat = materialityThreshold || 50000;
  const m = (method || "statistical").toLowerCase();

  // ISA 530 confidence levels by risk
  const confidenceMap = { low: 0.80, medium: 0.90, high: 0.95 };
  const confidence = confidenceMap[risk] || 0.90;

  // Tolerable error rate
  const tolerableRate = risk === "high" ? 0.03 : risk === "medium" ? 0.05 : 0.08;

  let sampleSize;
  if (m === "statistical") {
    // Simplified attribute sampling formula
    const zScores = { 0.80: 1.28, 0.90: 1.645, 0.95: 1.96 };
    const z = zScores[confidence] || 1.645;
    sampleSize = Math.ceil((z * z * 0.25) / (tolerableRate * tolerableRate));
    sampleSize = Math.min(sampleSize, pop);
  } else {
    // Judgmental — ISA 530 table approach
    const baseMap = { low: 10, medium: 25, high: 40 };
    sampleSize = baseMap[risk] || 25;
    if (pop > 500) sampleSize = Math.ceil(sampleSize * 1.3);
    if (pop > 2000) sampleSize = Math.ceil(sampleSize * 1.5);
    sampleSize = Math.min(sampleSize, pop);
  }

  return {
    success: true,
    result: {
      populationSize: pop,
      sampleSize,
      method: m,
      riskLevel: risk,
      confidenceLevel: (confidence * 100) + "%",
      tolerableErrorRate: (tolerableRate * 100) + "%",
      coveragePercentage: ((sampleSize / pop) * 100).toFixed(1) + "%",
      materialityThreshold: mat,
      selectionMethod: risk === "high" ? "Stratified random (concentrate on high-value items)" : "Simple random",
      isaRef: "ISA 530.7-11",
    },
  };
}

export function executeGenerateNarrative({ wpId, findings, conclusion, isaRefs }) {
  const refs = isaRefs || [];
  const findingsText = (findings || []).map((f, i) =>
    `${i + 1}. ${f.description || f}${f.severity ? ` [${f.severity}]` : ""}${f.amount ? ` — £${f.amount.toLocaleString()}` : ""}`
  ).join("\n");

  const narrativeBlocks = [
    `## Working Paper ${(wpId || "").toUpperCase()} — Audit Conclusion`,
    "",
    `**Objective:** Obtain sufficient appropriate audit evidence to conclude on the assertions relevant to this area.`,
    "",
    `**Procedures performed:**`,
    findings?.length ? findingsText : "No exceptions identified from procedures performed.",
    "",
    `**Conclusion:** ${conclusion || "Based on the procedures performed and evidence obtained, we are satisfied that the balance/disclosure is not materially misstated."}`,
    "",
    refs.length ? `**ISA References:** ${refs.join(", ")}` : "",
    "",
    `**Prepared by:** [Engagement team member]`,
    `**Date:** ${new Date().toISOString().split("T")[0]}`,
    `**Reviewed by:** [Manager/Partner]`,
  ].filter(Boolean).join("\n");

  return {
    success: true,
    result: {
      wpId,
      narrative: narrativeBlocks,
      wordCount: narrativeBlocks.split(/\s+/).length,
      isaCompliant: true,
      isaRef: "ISA 230.8-11",
    },
  };
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
