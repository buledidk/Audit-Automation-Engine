// ═══════════════════════════════════════════════════════════════
// Statement Audit Agent — Financial Statement Review (ISA 700)
// Inspired by Anthropic Financial Services Statement Auditor plugin
// ═══════════════════════════════════════════════════════════════

import { generateAINarrative } from './financeAgentUtils.js';

const CROSS_CHECK_TOLERANCES = { casting: 0, crossCast: 1, priorYear: 0, noteAgreement: 0 };

export const statementAuditAgent = {
  id: 'statement_audit',
  name: 'Statement Audit Agent',
  description: 'Reviews financial statements for internal consistency, casting accuracy, note agreement, prior year comparatives, and disclosure completeness before distribution. ISA 700 / ISA 710 / ISA 720.',
  category: 'finance_ops',
  wpScope: ['z1', 'z2', 'z3', 'z4'],
  isaReferences: ['ISA 700', 'ISA 710', 'ISA 720', 'ISA 450', 'FRS 102', 'Companies Act 2006'],

  async runWithAI(financialStatements, context) {
    const results = this.analyze(financialStatements, context);
    results.aiNarrative = await generateAINarrative(this, results, context);
    return results;
  },

  analyze(financialStatements, context = {}) {
    const fs = financialStatements || {};
    const ctx = context || {};
    const framework = ctx.framework || 'FRS 102';
    const materiality = ctx.performanceMateriality || ctx.materiality || 0;

    const results = {
      castingChecks: [],
      crossCastChecks: [],
      priorYearChecks: [],
      noteAgreementChecks: [],
      disclosureChecklist: [],
      missingDisclosures: [],
      overallStatus: 'GREEN',
      warnings: [],
      errorCount: 0,
      checkDate: new Date().toISOString().split('T')[0],
    };

    // 1. Casting checks — do the numbers add up?
    _runCastingChecks(fs, results);

    // 2. Cross-cast — BS balances, P&L to retained earnings, etc.
    _runCrossCastChecks(fs, results, materiality);

    // 3. Prior year comparatives
    _runPriorYearChecks(fs, results);

    // 4. Note agreement — primary statements agree to notes
    _runNoteAgreementChecks(fs, results);

    // 5. Disclosure completeness
    _runDisclosureChecklist(fs, results, framework);

    // Overall
    if (results.errorCount > 0) {
      results.overallStatus = 'RED';
      results.warnings.push(`${results.errorCount} error(s) found — statements not ready for distribution.`);
    } else if (results.missingDisclosures.length > 0) {
      results.overallStatus = 'AMBER';
      results.warnings.push(`${results.missingDisclosures.length} potentially missing disclosure(s).`);
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      'FINANCIAL STATEMENT REVIEW',
      `Overall Status: [${r.overallStatus}]`,
      `Review Date: ${r.checkDate}`,
      '',
      `SUMMARY:`,
      `  Casting checks: ${(r.castingChecks || []).length} (${(r.castingChecks || []).filter(c => c.status === 'PASS').length} pass)`,
      `  Cross-cast checks: ${(r.crossCastChecks || []).length} (${(r.crossCastChecks || []).filter(c => c.status === 'PASS').length} pass)`,
      `  Prior year checks: ${(r.priorYearChecks || []).length} (${(r.priorYearChecks || []).filter(c => c.status === 'PASS').length} pass)`,
      `  Note agreement checks: ${(r.noteAgreementChecks || []).length} (${(r.noteAgreementChecks || []).filter(c => c.status === 'PASS').length} pass)`,
      `  Missing disclosures: ${(r.missingDisclosures || []).length}`,
      `  Total errors: ${r.errorCount}`,
      '',
    ];

    const failures = [
      ...(r.castingChecks || []).filter(c => c.status === 'FAIL'),
      ...(r.crossCastChecks || []).filter(c => c.status === 'FAIL'),
      ...(r.priorYearChecks || []).filter(c => c.status === 'FAIL'),
      ...(r.noteAgreementChecks || []).filter(c => c.status === 'FAIL'),
    ];

    if (failures.length > 0) {
      lines.push('ERRORS FOUND:');
      failures.forEach(f => {
        lines.push(`  [FAIL] ${f.check}: Expected £${(f.expected || 0).toLocaleString()}, Got £${(f.actual || 0).toLocaleString()} (Diff: £${(f.difference || 0).toLocaleString()})`);
      });
      lines.push('');
    }

    if ((r.missingDisclosures || []).length > 0) {
      lines.push('POTENTIALLY MISSING DISCLOSURES:');
      r.missingDisclosures.forEach(d => lines.push(`  - ${d.disclosure} (${d.reference})`));
      lines.push('');
    }

    if ((r.warnings || []).length > 0) {
      lines.push('AUDIT ATTENTION POINTS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', 'ISA References: ISA 700, ISA 710, ISA 720, Companies Act 2006');

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['financial_statements', 'audit_report'];
    if ((results?.missingDisclosures || []).length > 0) sections.push('notes_disclosures');
    if (results?.errorCount > 0) sections.push('audit_differences');
    return sections;
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Statement Audit',
      isaReference: 'ISA 700 / ISA 710',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Casting Checks',
          columns: ['Check', 'Expected (£)', 'Actual (£)', 'Difference (£)', 'Status'],
          rows: (r.castingChecks || []).map(c => [c.check, c.expected, c.actual, c.difference, c.status]),
        },
        {
          title: 'Cross-Cast Checks',
          columns: ['Check', 'Expected (£)', 'Actual (£)', 'Difference (£)', 'Status'],
          rows: (r.crossCastChecks || []).map(c => [c.check, c.expected, c.actual, c.difference, c.status]),
        },
        {
          title: 'Missing Disclosures',
          columns: ['Disclosure', 'Reference', 'Severity'],
          rows: (r.missingDisclosures || []).map(d => [d.disclosure, d.reference, d.severity]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

function _runCastingChecks(fs, results) {
  const bs = fs.balanceSheet || fs.sofp || {};
  const pl = fs.profitAndLoss || fs.soci || {};

  // Total assets = sum of fixed + current
  const fixedAssets = parseFloat(bs.fixedAssets || bs.nonCurrentAssets || 0);
  const currentAssets = parseFloat(bs.currentAssets || 0);
  const totalAssetsExpected = fixedAssets + currentAssets;
  const totalAssetsActual = parseFloat(bs.totalAssets || 0);
  _addCheck(results.castingChecks, 'Total assets = Fixed + Current', totalAssetsExpected, totalAssetsActual, CROSS_CHECK_TOLERANCES.casting, results);

  // Net assets = Total assets - Total liabilities
  const totalLiabilities = parseFloat(bs.totalLiabilities || 0);
  const netAssetsExpected = totalAssetsActual - totalLiabilities;
  const netAssetsActual = parseFloat(bs.netAssets || bs.totalEquity || 0);
  _addCheck(results.castingChecks, 'Net assets = Assets - Liabilities', netAssetsExpected, netAssetsActual, CROSS_CHECK_TOLERANCES.casting, results);

  // P&L: Revenue - COS = Gross profit
  const revenue = parseFloat(pl.revenue || pl.turnover || 0);
  const costOfSales = parseFloat(pl.costOfSales || 0);
  const grossProfitExpected = revenue - costOfSales;
  const grossProfitActual = parseFloat(pl.grossProfit || 0);
  if (grossProfitActual !== 0) {
    _addCheck(results.castingChecks, 'Gross profit = Revenue - COS', grossProfitExpected, grossProfitActual, CROSS_CHECK_TOLERANCES.casting, results);
  }
}

function _runCrossCastChecks(fs, results, materiality) {
  const bs = fs.balanceSheet || fs.sofp || {};
  const pl = fs.profitAndLoss || fs.soci || {};
  const equity = fs.equity || fs.soce || {};

  // BS balance: Assets = Liabilities + Equity
  const totalAssets = parseFloat(bs.totalAssets || 0);
  const totalLiabilitiesAndEquity = parseFloat(bs.totalLiabilities || 0) + parseFloat(bs.totalEquity || bs.netAssets || 0);
  _addCheck(results.crossCastChecks, 'BS balance: Assets = Liabilities + Equity', totalAssets, totalLiabilitiesAndEquity, CROSS_CHECK_TOLERANCES.crossCast, results);

  // P&L profit agrees to equity movement
  const plProfit = parseFloat(pl.profitForYear || pl.netProfit || pl.retainedProfit || 0);
  const equityMovement = parseFloat(equity.profitForYear || equity.retainedProfitMovement || 0);
  if (equityMovement !== 0) {
    _addCheck(results.crossCastChecks, 'P&L profit agrees to equity movement', plProfit, equityMovement, materiality * 0.01, results);
  }
}

function _runPriorYearChecks(fs, results) {
  const pyBs = fs.priorYearBalanceSheet || fs.priorYearSofp || {};
  const bs = fs.balanceSheet || fs.sofp || {};

  const pyFields = ['totalAssets', 'totalLiabilities', 'netAssets', 'fixedAssets', 'currentAssets'];
  pyFields.forEach(field => {
    const pyVal = parseFloat(pyBs[field] || 0);
    const cyPyVal = parseFloat(bs[`priorYear_${field}`] || bs[`py_${field}`] || 0);
    if (pyVal > 0 && cyPyVal > 0) {
      _addCheck(results.priorYearChecks, `PY ${field} agrees to CY comparative`, pyVal, cyPyVal, CROSS_CHECK_TOLERANCES.priorYear, results);
    }
  });
}

function _runNoteAgreementChecks(fs, results) {
  const bs = fs.balanceSheet || fs.sofp || {};
  const notes = fs.notes || {};

  const noteChecks = [
    { bsField: 'ppe', noteKey: 'ppeTotal', check: 'PPE per BS agrees to PPE note' },
    { bsField: 'tradeDebtors', noteKey: 'tradeDebtorsTotal', check: 'Trade debtors per BS agrees to note' },
    { bsField: 'tradeCreditors', noteKey: 'tradeCreditorsTotal', check: 'Trade creditors per BS agrees to note' },
    { bsField: 'borrowings', noteKey: 'borrowingsTotal', check: 'Borrowings per BS agrees to note' },
    { bsField: 'provisions', noteKey: 'provisionsTotal', check: 'Provisions per BS agrees to note' },
  ];

  noteChecks.forEach(nc => {
    const bsVal = parseFloat(bs[nc.bsField] || 0);
    const noteVal = parseFloat(notes[nc.noteKey] || 0);
    if (bsVal > 0 && noteVal > 0) {
      _addCheck(results.noteAgreementChecks, nc.check, bsVal, noteVal, CROSS_CHECK_TOLERANCES.noteAgreement, results);
    }
  });
}

function _runDisclosureChecklist(fs, results, framework) {
  const notes = fs.notes || {};
  const disclosures = fs.disclosures || {};
  const isFRS102 = framework.includes('FRS 102');

  const required = [
    { key: 'accountingPolicies', disclosure: 'Accounting policies note', reference: isFRS102 ? 'FRS 102 s8' : 'IAS 1.117', severity: 'HIGH' },
    { key: 'turnoverAnalysis', disclosure: 'Turnover analysis by activity/geography', reference: isFRS102 ? 'FRS 102 s23' : 'IFRS 15', severity: 'MEDIUM' },
    { key: 'directorsRemuneration', disclosure: 'Directors remuneration', reference: 'CA 2006 s412-413', severity: 'HIGH' },
    { key: 'employeeNumbers', disclosure: 'Average employee numbers', reference: 'CA 2006 s411', severity: 'MEDIUM' },
    { key: 'relatedParties', disclosure: 'Related party transactions', reference: isFRS102 ? 'FRS 102 s33' : 'IAS 24', severity: 'HIGH' },
    { key: 'postBalanceSheetEvents', disclosure: 'Post balance sheet events', reference: isFRS102 ? 'FRS 102 s32' : 'IAS 10', severity: 'HIGH' },
    { key: 'contingentLiabilities', disclosure: 'Contingent liabilities', reference: isFRS102 ? 'FRS 102 s21' : 'IAS 37', severity: 'MEDIUM' },
    { key: 'goingConcern', disclosure: 'Going concern basis', reference: isFRS102 ? 'FRS 102 s3.8' : 'IAS 1.25', severity: 'HIGH' },
  ];

  required.forEach(req => {
    const present = notes[req.key] || disclosures[req.key];
    results.disclosureChecklist.push({ ...req, present: !!present });
    if (!present) {
      results.missingDisclosures.push(req);
    }
  });
}

function _addCheck(checkList, check, expected, actual, tolerance, results) {
  const difference = Math.round((actual - expected) * 100) / 100;
  const status = Math.abs(difference) <= tolerance ? 'PASS' : 'FAIL';
  if (status === 'FAIL') results.errorCount++;
  checkList.push({ check, expected, actual, difference, status });
}
