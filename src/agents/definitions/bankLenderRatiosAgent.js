// ═══════════════════════════════════════════════════════════════
// Bank & Lender Ratios Agent — Debt Service & Credit Analysis
// ═══════════════════════════════════════════════════════════════

export const bankLenderRatiosAgent = {
  id: 'bank_lender_ratios',
  name: 'Bank & Lender Ratios Agent',
  description: 'Analyses debt service capacity, bank covenant compliance, working capital facility utilisation, and generates bank reporting pack templates.',
  category: 'financial_analysis',
  isaReferences: ['ISA 570', 'ISA 315', 'IFRS 9', 'IAS 17', 'IFRS 16'],

  analyze(financials, context = {}) {
    const f = financials || {};
    const ctx = context || {};
    const results = {
      debtServiceRatios: {},
      workingCapitalFacility: {},
      bankReportingPack: {},
      overallStatus: 'GREEN',
      warnings: [],
    };

    const ebit = f.ebit || f.operatingProfit || 0;
    const ebitda = f.ebitda || (ebit + (f.depreciation || 0) + (f.amortisation || 0));
    const interestExpense = f.interestExpense || 0;
    const principalRepayments = f.principalRepayments || 0;
    const leasePayments = f.leasePayments || 0;
    const maintenanceCapex = f.maintenanceCapex || f.capitalExpenditure || 0;
    const totalBorrowings = f.totalBorrowings || f.totalDebt || 0;
    const cash = f.cashAndEquivalents || f.cash || 0;
    const netDebt = totalBorrowings - cash;
    const cfo = f.operatingCashFlow || 0;
    const dividendsPaid = f.dividendsPaid || 0;
    const loanBalance = f.loanBalance || totalBorrowings;
    const assetValue = f.securedAssetValue || f.totalAssets || 0;

    // ─── 1. INTEREST COVERAGE RATIO ─────────────────────────────────
    const interestCover = interestExpense > 0 ? ebit / interestExpense : null;
    let icStatus = 'GREEN';
    if (interestCover !== null) {
      if (interestCover < 1.5) icStatus = 'RED';
      else if (interestCover < 2.5) icStatus = 'AMBER';
    }
    results.debtServiceRatios.interestCover = { value: _round(interestCover, 2), status: icStatus, isaNote: 'Critical for debt covenants (ISA 570)' };

    // ─── 2. DEBT SERVICE COVERAGE RATIO (DSCR) ──────────────────────
    const dscrDenominator = interestExpense + principalRepayments;
    const dscr = dscrDenominator > 0 ? (ebitda - maintenanceCapex) / dscrDenominator : null;
    let dscrStatus = 'GREEN';
    if (dscr !== null) {
      if (dscr < 1.0) dscrStatus = 'RED';
      else if (dscr < 1.25) dscrStatus = 'AMBER';
    }
    results.debtServiceRatios.dscr = { value: _round(dscr, 2), status: dscrStatus, note: 'DSCR = (EBITDA - Maintenance Capex) / (Interest + Principal)' };

    // ─── 3. NET DEBT & NET DEBT / EBITDA ────────────────────────────
    const netDebtEbitda = ebitda > 0 ? netDebt / ebitda : null;
    let ndStatus = 'GREEN';
    if (netDebtEbitda !== null) {
      if (netDebtEbitda > 4.0) ndStatus = 'RED';
      else if (netDebtEbitda > 2.5) ndStatus = 'AMBER';
    }
    results.debtServiceRatios.netDebt = { value: _round(netDebt, 0) };
    results.debtServiceRatios.netDebtToEbitda = { value: _round(netDebtEbitda, 2), status: ndStatus };

    // ─── 4. LOAN-TO-VALUE ────────────────────────────────────────────
    const ltv = assetValue > 0 && loanBalance > 0 ? loanBalance / assetValue : null;
    let ltvStatus = 'GREEN';
    if (ltv !== null) {
      if (ltv > 0.8) ltvStatus = 'RED';
      else if (ltv > 0.65) ltvStatus = 'AMBER';
    }
    results.debtServiceRatios.loanToValue = { value: _round(ltv ? ltv * 100 : null, 1), status: ltvStatus, pct: true, note: 'Secured lending LTV' };

    // ─── 5. FIXED CHARGE COVERAGE ───────────────────────────────────
    const fccDenominator = interestExpense + leasePayments;
    const fixedChargeCover = fccDenominator > 0 ? (ebit + leasePayments) / fccDenominator : null;
    let fccStatus = 'GREEN';
    if (fixedChargeCover !== null) {
      if (fixedChargeCover < 1.25) fccStatus = 'RED';
      else if (fixedChargeCover < 2.0) fccStatus = 'AMBER';
    }
    results.debtServiceRatios.fixedChargeCover = { value: _round(fixedChargeCover, 2), status: fccStatus };

    // ─── 6. CASH FLOW ADEQUACY ───────────────────────────────────────
    const avgTotalDebt = (totalBorrowings + (f.priorYearTotalDebt || totalBorrowings)) / 2;
    const cashFlowAdequacy = avgTotalDebt > 0 ? (cfo - dividendsPaid) / avgTotalDebt : null;
    let cfaStatus = cashFlowAdequacy === null ? 'N/A' : cashFlowAdequacy > 0.2 ? 'GREEN' : cashFlowAdequacy > 0.1 ? 'AMBER' : 'RED';
    results.debtServiceRatios.cashFlowAdequacy = { value: _round(cashFlowAdequacy, 3), status: cfaStatus };

    // ─── 7. WORKING CAPITAL FACILITY ANALYSIS ───────────────────────
    const facilityLimit = ctx.facilityLimit || f.revolvingCreditFacility || 0;
    const monthlyDrawings = f.monthlyWcDrawings || [];
    if (facilityLimit > 0 && monthlyDrawings.length > 0) {
      const avgDrawing = monthlyDrawings.reduce((a, b) => a + b, 0) / monthlyDrawings.length;
      const peakDrawing = Math.max(...monthlyDrawings);
      const avgHeadroom = facilityLimit - avgDrawing;
      const avgHeadroomPct = (avgHeadroom / facilityLimit) * 100;
      const tightMonths = monthlyDrawings.filter(d => (facilityLimit - d) / facilityLimit < 0.2);

      results.workingCapitalFacility = {
        facilityLimit,
        avgDrawing: _round(avgDrawing, 0),
        peakDrawing: _round(peakDrawing, 0),
        avgHeadroom: _round(avgHeadroom, 0),
        avgHeadroomPct: _round(avgHeadroomPct, 1),
        tightMonthsCount: tightMonths.length,
        status: tightMonths.length > 3 ? 'RED' : tightMonths.length > 0 ? 'AMBER' : 'GREEN',
      };

      if (tightMonths.length > 0) {
        results.warnings.push(`Working capital facility: ${tightMonths.length} month(s) where headroom was below 20% of facility limit.`);
      }
    } else {
      results.workingCapitalFacility = { status: 'N/A', note: 'Monthly drawings data not provided' };
    }

    // ─── 8. BANK REPORTING PACK ─────────────────────────────────────
    const covenants = ctx.covenants || f.covenants || {};
    const covenantTable = _buildCovenantTable(results.debtServiceRatios, covenants);

    results.bankReportingPack = {
      covenantTable,
      managementCommentaryTemplate: _generateManagementCommentary(results, f),
      cashFlowForecastSummary: {
        currentMonthCFO: _round(cfo / 12, 0),
        principalDueNextYear: f.debtMaturingIn12Months || 0,
        interestDueNextYear: interestExpense,
        netCashRequired: _round((f.debtMaturingIn12Months || 0) + interestExpense - cfo, 0),
      },
    };

    // ─── 9. OVERALL STATUS ──────────────────────────────────────────
    const statusList = [icStatus, dscrStatus, ndStatus, ltvStatus, fccStatus, cfaStatus].filter(s => s !== 'N/A');
    if (statusList.includes('RED')) results.overallStatus = 'RED';
    else if (statusList.includes('AMBER')) results.overallStatus = 'AMBER';

    // Warnings for critical metrics
    if (dscr !== null && dscr < 1.0) results.warnings.push('DSCR below 1.0 — entity cannot service debt from operations. Immediate attention required (ISA 570).');
    if (netDebtEbitda !== null && netDebtEbitda > 4.0) results.warnings.push(`Net debt / EBITDA of ${_round(netDebtEbitda, 2)}x exceeds typical maximum covenant threshold of 4.0x.`);

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const dr = r.debtServiceRatios || {};
    const wcf = r.workingCapitalFacility || {};
    const bpk = r.bankReportingPack || {};

    const lines = [
      `BANK & LENDER RATIOS ANALYSIS`,
      `Overall Status: [${r.overallStatus}]`,
      '',
      'DEBT SERVICE RATIOS:',
      `  • Interest Coverage: ${dr.interestCover?.value ?? 'N/A'}x [${dr.interestCover?.status}] — ${dr.interestCover?.isaNote || ''}`,
      `  • DSCR: ${dr.dscr?.value ?? 'N/A'}x [${dr.dscr?.status}]`,
      `  • Net Debt: £${(dr.netDebt?.value || 0).toLocaleString()}`,
      `  • Net Debt / EBITDA: ${dr.netDebtToEbitda?.value ?? 'N/A'}x [${dr.netDebtToEbitda?.status}]`,
      `  • Loan-to-Value: ${dr.loanToValue?.value ?? 'N/A'}% [${dr.loanToValue?.status}]`,
      `  • Fixed Charge Cover: ${dr.fixedChargeCover?.value ?? 'N/A'}x [${dr.fixedChargeCover?.status}]`,
      `  • Cash Flow Adequacy: ${dr.cashFlowAdequacy?.value ?? 'N/A'} [${dr.cashFlowAdequacy?.status}]`,
      '',
      'WORKING CAPITAL FACILITY:',
    ];

    if (wcf.facilityLimit) {
      lines.push(`  • Facility Limit: £${(wcf.facilityLimit || 0).toLocaleString()}`);
      lines.push(`  • Average Drawing: £${(wcf.avgDrawing || 0).toLocaleString()}`);
      lines.push(`  • Peak Drawing: £${(wcf.peakDrawing || 0).toLocaleString()}`);
      lines.push(`  • Average Headroom: £${(wcf.avgHeadroom || 0).toLocaleString()} (${wcf.avgHeadroomPct}%) [${wcf.status}]`);
      lines.push(`  • Months with <20% headroom: ${wcf.tightMonthsCount}`);
    } else {
      lines.push(`  • ${wcf.note || 'N/A'}`);
    }

    if (bpk.covenantTable && bpk.covenantTable.length > 0) {
      lines.push('', 'COVENANT COMPLIANCE TABLE:');
      bpk.covenantTable.forEach(row => {
        lines.push(`  • ${row.covenant}: Actual ${row.actual}, Threshold ${row.threshold}, Headroom ${row.headroom}, Status [${row.status}]`);
      });
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 570, ISA 315, IFRS 16`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['trade_debtors', 'trade_creditors', 'cash_bank', 'provisions', 'leases', 'going_concern'];
    const r = results || {};

    if (r.overallStatus === 'RED') sections.push('audit_differences', 'loans_borrowings');
    if (r.debtServiceRatios?.dscr?.status === 'RED') sections.push('loans_borrowings');

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    const dr = r.debtServiceRatios || {};
    return {
      sheetName: 'Bank & Lender Ratios',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Debt Service Ratios',
          columns: ['Ratio', 'Value', 'Threshold', 'Status'],
          rows: [
            ['Interest Coverage', dr.interestCover?.value, '>2.5 GREEN / 1.5-2.5 AMBER / <1.5 RED', dr.interestCover?.status],
            ['DSCR', dr.dscr?.value, '>1.25 GREEN / 1.0-1.25 AMBER / <1.0 RED', dr.dscr?.status],
            ['Net Debt (£)', dr.netDebt?.value, '', ''],
            ['Net Debt / EBITDA', dr.netDebtToEbitda?.value, '<2.5 GREEN / 2.5-4.0 AMBER / >4.0 RED', dr.netDebtToEbitda?.status],
            ['LTV %', dr.loanToValue?.value, '<65% GREEN / 65-80% AMBER / >80% RED', dr.loanToValue?.status],
            ['Fixed Charge Cover', dr.fixedChargeCover?.value, '>2.0 GREEN / 1.25-2.0 AMBER / <1.25 RED', dr.fixedChargeCover?.status],
            ['Cash Flow Adequacy', dr.cashFlowAdequacy?.value, '>0.2 GREEN / 0.1-0.2 AMBER / <0.1 RED', dr.cashFlowAdequacy?.status],
          ],
        },
        {
          title: 'Working Capital Facility',
          columns: ['Item', 'Value'],
          rows: [
            ['Facility Limit (£)', r.workingCapitalFacility?.facilityLimit],
            ['Average Drawing (£)', r.workingCapitalFacility?.avgDrawing],
            ['Peak Drawing (£)', r.workingCapitalFacility?.peakDrawing],
            ['Average Headroom (£)', r.workingCapitalFacility?.avgHeadroom],
            ['Average Headroom %', r.workingCapitalFacility?.avgHeadroomPct],
            ['Months <20% Headroom', r.workingCapitalFacility?.tightMonthsCount],
          ],
        },
        {
          title: 'Covenant Compliance Certificate',
          columns: ['Covenant', 'Actual', 'Threshold', 'Headroom', 'Status'],
          rows: (r.bankReportingPack?.covenantTable || []).map(row => [row.covenant, row.actual, row.threshold, row.headroom, row.status]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

// ─── Helpers ────────────────────────────────────────────────────
function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}

function _buildCovenantTable(ratios, covenants) {
  const rows = [];
  if (covenants.maxNetDebtEbitda && ratios.netDebtToEbitda?.value !== null) {
    const actual = ratios.netDebtToEbitda.value;
    const threshold = covenants.maxNetDebtEbitda;
    const headroomPct = _round(((threshold - actual) / threshold) * 100, 1);
    rows.push({ covenant: 'Net Debt / EBITDA', actual, threshold: `≤${threshold}x`, headroom: `${headroomPct}%`, status: headroomPct < 0 ? 'RED' : headroomPct < 20 ? 'AMBER' : 'GREEN' });
  }
  if (covenants.minInterestCover && ratios.interestCover?.value !== null) {
    const actual = ratios.interestCover.value;
    const threshold = covenants.minInterestCover;
    const headroomPct = _round(((actual - threshold) / threshold) * 100, 1);
    rows.push({ covenant: 'Interest Cover', actual, threshold: `≥${threshold}x`, headroom: `${headroomPct}%`, status: headroomPct < 0 ? 'RED' : headroomPct < 20 ? 'AMBER' : 'GREEN' });
  }
  if (covenants.maxLTV && ratios.loanToValue?.value !== null) {
    const actual = ratios.loanToValue.value;
    const threshold = covenants.maxLTV;
    const headroomPct = _round(((threshold - actual) / threshold) * 100, 1);
    rows.push({ covenant: 'Loan-to-Value', actual: `${actual}%`, threshold: `≤${threshold}%`, headroom: `${headroomPct}%`, status: headroomPct < 0 ? 'RED' : headroomPct < 20 ? 'AMBER' : 'GREEN' });
  }
  return rows;
}

function _generateManagementCommentary(results, financials) {
  const dr = results.debtServiceRatios || {};
  return [
    `MANAGEMENT COMMENTARY — BANK COVENANT COMPLIANCE`,
    `Period: [INSERT PERIOD]`,
    '',
    `We confirm that as at [date], the Group/Company was [in compliance / not in compliance] with all financial covenants contained in its financing arrangements.`,
    '',
    `Key metrics for the period:`,
    `  Net Debt / EBITDA: ${dr.netDebtToEbitda?.value ?? 'N/A'}x (covenant: [insert threshold])`,
    `  Interest Cover: ${dr.interestCover?.value ?? 'N/A'}x (covenant: [insert threshold])`,
    `  DSCR: ${dr.dscr?.value ?? 'N/A'}x`,
    '',
    `Cash flow position: Operating cash flow for the period was £${((financials.operatingCashFlow || 0)).toLocaleString()}. Management expects [insert commentary].`,
    '',
    `[To be completed by management and reviewed by auditors]`,
  ].join('\n');
}
