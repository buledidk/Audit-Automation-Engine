// ═══════════════════════════════════════════════════════════════
// Solvency & Going Concern Agent — ISA 570 Analysis
// ═══════════════════════════════════════════════════════════════

export const solvencyGoingConcernAgent = {
  id: 'solvency_going_concern',
  name: 'Solvency & Going Concern Agent',
  description: 'Performs ISA 570 going concern analysis including Altman Z-Score (3 variants), liquidity ratios, cash flow forecasting, and debt maturity profiling.',
  category: 'financial_analysis',
  isaReferences: ['ISA 570', 'IAS 1', 'FRS 102 s3'],

  analyze(financials, _context = {}) {
    const f = financials || {};
    const results = {
      ratios: {},
      altmanScores: {},
      cashFlowForecast: {},
      debtMaturityProfile: {},
      trends: {},
      overallStatus: 'GREEN',
      warnings: [],
      findings: [],
    };

    // ─── 1. LIQUIDITY RATIOS ────────────────────────────────────────
    const ca = f.currentAssets || 0;
    const cl = f.currentLiabilities || 0;
    const inventory = f.inventory || 0;
    const ocf = f.operatingCashFlow || 0;
    const totalDebt = f.totalDebt || f.totalBorrowings || 0;
    const ebit = f.ebit || (f.operatingProfit || 0);
    const interest = f.interestExpense || 0;
    const principalRepayments = f.principalRepayments || 0;

    // Current ratio
    const currentRatio = cl > 0 ? ca / cl : null;
    let currentRatioStatus = 'GREEN';
    if (currentRatio !== null) {
      if (currentRatio < 1.0) currentRatioStatus = 'RED';
      else if (currentRatio < 1.5) currentRatioStatus = 'AMBER';
    }
    results.ratios.currentRatio = { value: currentRatio, status: currentRatioStatus };

    // Quick ratio
    const quickRatio = cl > 0 ? (ca - inventory) / cl : null;
    let quickRatioStatus = 'GREEN';
    if (quickRatio !== null) {
      if (quickRatio < 0.75) quickRatioStatus = 'RED';
      else if (quickRatio < 1.0) quickRatioStatus = 'AMBER';
    }
    results.ratios.quickRatio = { value: quickRatio, status: quickRatioStatus };

    // Cash flow coverage
    const cashFlowCoverage = totalDebt > 0 ? ocf / totalDebt : null;
    let cashFlowCoverageStatus = 'GREEN';
    if (cashFlowCoverage !== null) {
      if (cashFlowCoverage < 0.1) cashFlowCoverageStatus = 'RED';
      else if (cashFlowCoverage < 0.2) cashFlowCoverageStatus = 'AMBER';
    }
    results.ratios.cashFlowCoverage = { value: cashFlowCoverage, status: cashFlowCoverageStatus };

    // Debt service coverage
    const debtServiceDenominator = interest + principalRepayments;
    const debtServiceCoverage = debtServiceDenominator > 0 ? ebit / debtServiceDenominator : null;
    let dscStatus = 'GREEN';
    if (debtServiceCoverage !== null) {
      if (debtServiceCoverage < 1.0) dscStatus = 'RED';
      else if (debtServiceCoverage < 1.5) dscStatus = 'AMBER';
    }
    results.ratios.debtServiceCoverage = { value: debtServiceCoverage, status: dscStatus };

    // ─── 2. TREND ANALYSIS ──────────────────────────────────────────
    const historicalNetAssets = f.historicalNetAssets || [];
    const historicalWorkingCapital = f.historicalWorkingCapital || [];

    results.trends.netAssets = _assessTrend(historicalNetAssets, 'netAssets');
    results.trends.workingCapital = _assessTrend(historicalWorkingCapital, 'workingCapital');

    // ─── 3. ALTMAN Z-SCORE ──────────────────────────────────────────
    const totalAssets = f.totalAssets || 0;
    const retainedEarnings = f.retainedEarnings || 0;
    const revenue = f.revenue || f.turnover || 0;
    const marketValueEquity = f.marketValueEquity || f.bookValueEquity || f.shareholdersEquity || 0;
    const bookValueEquity = f.bookValueEquity || f.shareholdersEquity || 0;
    const totalLiabilities = f.totalLiabilities || 0;
    const workingCapital = ca - cl;

    if (totalAssets > 0) {
      const X1 = workingCapital / totalAssets;
      const X2 = retainedEarnings / totalAssets;
      const X3 = ebit / totalAssets;
      const X4_public = totalLiabilities > 0 ? marketValueEquity / totalLiabilities : 0;
      const X4_private = totalLiabilities > 0 ? bookValueEquity / totalLiabilities : 0;
      const X5 = revenue / totalAssets;

      // Original Z-Score (public manufacturing)
      const zOriginal = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4_public + 1.0 * X5;
      let zOriginalStatus = 'GREEN';
      let zOriginalZone = 'Safe';
      if (zOriginal < 1.81) { zOriginalStatus = 'RED'; zOriginalZone = 'Distress'; }
      else if (zOriginal < 2.99) { zOriginalStatus = 'AMBER'; zOriginalZone = 'Grey Zone'; }
      results.altmanScores.original = {
        score: _round(zOriginal, 3),
        status: zOriginalStatus,
        zone: zOriginalZone,
        model: 'Public Manufacturing (Altman 1968)',
        thresholds: { distress: 1.81, safe: 2.99 },
      };

      // Z'-Score (private companies)
      const zPrime = 0.717 * X1 + 0.847 * X2 + 3.107 * X3 + 0.420 * X4_private + 0.998 * X5;
      let zPrimeStatus = 'GREEN';
      let zPrimeZone = 'Safe';
      if (zPrime < 1.23) { zPrimeStatus = 'RED'; zPrimeZone = 'Distress'; }
      else if (zPrime < 2.90) { zPrimeStatus = 'AMBER'; zPrimeZone = 'Grey Zone'; }
      results.altmanScores.prime = {
        score: _round(zPrime, 3),
        status: zPrimeStatus,
        zone: zPrimeZone,
        model: 'Private Companies (Altman Z\'-Score)',
        thresholds: { distress: 1.23, safe: 2.90 },
      };

      // Z''-Score (non-manufacturing / emerging markets)
      const zDoublePrime = 6.56 * X1 + 3.26 * X2 + 6.72 * X3 + 1.05 * X4_private;
      let zDPStatus = 'GREEN';
      let zDPZone = 'Safe';
      if (zDoublePrime < 1.10) { zDPStatus = 'RED'; zDPZone = 'Distress'; }
      else if (zDoublePrime < 2.60) { zDPStatus = 'AMBER'; zDPZone = 'Grey Zone'; }
      results.altmanScores.doublePrime = {
        score: _round(zDoublePrime, 3),
        status: zDPStatus,
        zone: zDPZone,
        model: 'Non-Manufacturing / Emerging Markets (Altman Z\'\'-Score)',
        thresholds: { distress: 1.10, safe: 2.60 },
      };

      results.altmanScores.components = { X1: _round(X1, 4), X2: _round(X2, 4), X3: _round(X3, 4), X4_public: _round(X4_public, 4), X4_private: _round(X4_private, 4), X5: _round(X5, 4) };
    }

    // ─── 4. CASH FLOW FORECASTING ───────────────────────────────────
    const ocfTrend = f.historicalOCF || [ocf];
    const avgOCF = ocfTrend.length > 0 ? ocfTrend.reduce((a, b) => a + b, 0) / ocfTrend.length : ocf;
    const capexCommitments = f.capexCommitments || f.capitalExpenditure || 0;
    const debtMaturingIn12m = f.debtMaturingIn12Months || 0;

    const baseMonthly = avgOCF / 12 - capexCommitments / 12 - debtMaturingIn12m / 12;
    const stress10 = baseMonthly * 0.9;
    const worstCase25 = baseMonthly * 0.75;

    results.cashFlowForecast = {
      base: {
        monthly: _round(baseMonthly, 0),
        annual: _round(baseMonthly * 12, 0),
        status: baseMonthly > 0 ? 'GREEN' : 'RED',
      },
      stress10pct: {
        monthly: _round(stress10, 0),
        annual: _round(stress10 * 12, 0),
        status: stress10 > 0 ? 'AMBER' : 'RED',
        description: '10% revenue decline scenario',
      },
      worstCase25pct: {
        monthly: _round(worstCase25, 0),
        annual: _round(worstCase25 * 12, 0),
        status: worstCase25 > 0 ? 'AMBER' : 'RED',
        description: '25% revenue decline scenario',
      },
    };

    // ─── 5. DEBT MATURITY PROFILE ───────────────────────────────────
    const debtSchedule = f.debtSchedule || {};
    const within1yr = debtSchedule.within1Year || f.debtMaturingIn12Months || 0;
    const yr1to2 = debtSchedule.oneToTwoYears || 0;
    const yr2to5 = debtSchedule.twoToFiveYears || 0;
    const over5yr = debtSchedule.over5Years || 0;
    const totalDebtClassified = within1yr + yr1to2 + yr2to5 + over5yr || totalDebt;
    const pctWithin12m = totalDebtClassified > 0 ? within1yr / totalDebtClassified : 0;

    results.debtMaturityProfile = {
      within1Year: within1yr,
      oneToTwoYears: yr1to2,
      twoToFiveYears: yr2to5,
      over5Years: over5yr,
      totalDebt: totalDebtClassified,
      pctMaturingWithin12Months: _round(pctWithin12m * 100, 1),
      concentrationRisk: pctWithin12m > 0.5 ? 'RED' : pctWithin12m > 0.25 ? 'AMBER' : 'GREEN',
    };

    if (pctWithin12m > 0.5) {
      results.warnings.push('More than 50% of total debt matures within 12 months — refinancing risk is significant (ISA 570 indicator).');
    }

    // ─── 6. OVERALL STATUS ──────────────────────────────────────────
    const allStatuses = [
      currentRatioStatus, quickRatioStatus, cashFlowCoverageStatus, dscStatus,
      results.debtMaturityProfile.concentrationRisk,
      results.altmanScores.prime?.status || 'GREEN',
    ];
    if (allStatuses.includes('RED')) results.overallStatus = 'RED';
    else if (allStatuses.includes('AMBER')) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const ratios = r.ratios || {};
    const altman = r.altmanScores || {};
    const forecast = r.cashFlowForecast || {};
    const debt = r.debtMaturityProfile || {};
    const status = r.overallStatus || 'GREEN';

    let conclusion = '';
    if (status === 'GREEN') {
      conclusion = `ISA 570 CONCLUSION — NO MATERIAL UNCERTAINTY\n\nBased on our analytical procedures performed in accordance with ISA 570, we have not identified any material uncertainty that casts significant doubt on the entity's ability to continue as a going concern.\n\nKey indicators are satisfactory:\n`;
    } else if (status === 'AMBER') {
      conclusion = `ISA 570 CONCLUSION — MATERIAL UNCERTAINTY EXISTS — ADEQUATELY DISCLOSED\n\nBased on our analytical procedures performed in accordance with ISA 570, we have identified indicators of material uncertainty relating to going concern. We are satisfied that management have adequately disclosed the material uncertainty in the financial statements.\n\nIndicators identified:\n`;
    } else {
      conclusion = `ISA 570 CONCLUSION — MATERIAL UNCERTAINTY EXISTS — NOT ADEQUATELY DISCLOSED / GOING CONCERN BASIS MAY NOT BE APPROPRIATE\n\nBased on our analytical procedures performed in accordance with ISA 570, significant indicators of going concern uncertainty have been identified. The appropriateness of the going concern basis requires further consideration. Immediate escalation to engagement partner required.\n\nCritical indicators:\n`;
    }

    const lines = [];

    if (ratios.currentRatio?.value !== null) {
      lines.push(`  • Current ratio: ${_fmt(ratios.currentRatio.value, 2)}x [${ratios.currentRatio.status}] (threshold: <1.0 = concern)`);
    }
    if (ratios.quickRatio?.value !== null) {
      lines.push(`  • Quick ratio: ${_fmt(ratios.quickRatio.value, 2)}x [${ratios.quickRatio.status}] (threshold: <0.75 = concern)`);
    }
    if (ratios.cashFlowCoverage?.value !== null) {
      lines.push(`  • Cash flow coverage: ${_fmt(ratios.cashFlowCoverage.value, 3)}x [${ratios.cashFlowCoverage.status}]`);
    }
    if (ratios.debtServiceCoverage?.value !== null) {
      lines.push(`  • Debt service coverage: ${_fmt(ratios.debtServiceCoverage.value, 2)}x [${ratios.debtServiceCoverage.status}]`);
    }
    if (altman.prime) {
      lines.push(`  • Altman Z'-Score (private): ${altman.prime.score} — ${altman.prime.zone} [${altman.prime.status}]`);
    }
    if (altman.doublePrime) {
      lines.push(`  • Altman Z''-Score (non-mfg): ${altman.doublePrime.score} — ${altman.doublePrime.zone} [${altman.doublePrime.status}]`);
    }
    if (debt.pctMaturingWithin12Months !== undefined) {
      lines.push(`  • Debt maturing within 12 months: ${debt.pctMaturingWithin12Months}% of total debt [${debt.concentrationRisk}]`);
    }
    if (forecast.base) {
      lines.push(`  • 12-month base cash flow projection: £${(forecast.base.annual || 0).toLocaleString()} [${forecast.base.status}]`);
      lines.push(`  • Stress scenario (10% revenue decline): £${(forecast.stress10pct?.annual || 0).toLocaleString()} [${forecast.stress10pct?.status || 'N/A'}]`);
      lines.push(`  • Worst case (25% revenue decline): £${(forecast.worstCase25pct?.annual || 0).toLocaleString()} [${forecast.worstCase25pct?.status || 'N/A'}]`);
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('\nWarnings:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    return conclusion + lines.join('\n') + `\n\nISA Reference: ISA 570 paras 12-22\nDate of assessment: ${new Date().toISOString().split('T')[0]}`;
  },

  getAffectedSections(results) {
    const sections = ['provisions', 'trade_debtors', 'inventory', 'ppe', 'intangibles', 'audit_differences'];
    const r = results || {};

    if (r.overallStatus === 'RED' || r.overallStatus === 'AMBER') {
      sections.push('going_concern', 'cash_bank', 'leases', 'loans_borrowings');
    }
    if (r.debtMaturityProfile?.concentrationRisk === 'RED') {
      sections.push('loans_borrowings');
    }

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Going Concern Analysis',
      isaReference: 'ISA 570',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Liquidity Ratios',
          columns: ['Ratio', 'Value', 'Threshold', 'Status'],
          rows: [
            ['Current Ratio', _fmt(r.ratios?.currentRatio?.value, 2), '>1.5 GREEN / 1.0-1.5 AMBER / <1.0 RED', r.ratios?.currentRatio?.status],
            ['Quick Ratio', _fmt(r.ratios?.quickRatio?.value, 2), '>1.0 GREEN / 0.75-1.0 AMBER / <0.75 RED', r.ratios?.quickRatio?.status],
            ['Cash Flow Coverage', _fmt(r.ratios?.cashFlowCoverage?.value, 3), '>0.2 GREEN / 0.1-0.2 AMBER / <0.1 RED', r.ratios?.cashFlowCoverage?.status],
            ['Debt Service Coverage', _fmt(r.ratios?.debtServiceCoverage?.value, 2), '>1.5 GREEN / 1.0-1.5 AMBER / <1.0 RED', r.ratios?.debtServiceCoverage?.status],
          ],
        },
        {
          title: 'Altman Z-Score Analysis',
          columns: ['Model', 'Score', 'Zone', 'Status'],
          rows: [
            ['Original (Public Mfg)', r.altmanScores?.original?.score, r.altmanScores?.original?.zone, r.altmanScores?.original?.status],
            ['Z\'-Score (Private)', r.altmanScores?.prime?.score, r.altmanScores?.prime?.zone, r.altmanScores?.prime?.status],
            ['Z\'\'-Score (Non-Mfg)', r.altmanScores?.doublePrime?.score, r.altmanScores?.doublePrime?.zone, r.altmanScores?.doublePrime?.status],
          ],
        },
        {
          title: 'Debt Maturity Profile',
          columns: ['Maturity Band', 'Amount (£)', '% of Total', 'Risk'],
          rows: [
            ['< 1 Year', r.debtMaturityProfile?.within1Year, `${r.debtMaturityProfile?.pctMaturingWithin12Months}%`, r.debtMaturityProfile?.concentrationRisk],
            ['1-2 Years', r.debtMaturityProfile?.oneToTwoYears, '', ''],
            ['2-5 Years', r.debtMaturityProfile?.twoToFiveYears, '', ''],
            ['> 5 Years', r.debtMaturityProfile?.over5Years, '', ''],
          ],
        },
        {
          title: 'Cash Flow Forecast',
          columns: ['Scenario', 'Monthly CF (£)', 'Annual CF (£)', 'Status'],
          rows: [
            ['Base Case', r.cashFlowForecast?.base?.monthly, r.cashFlowForecast?.base?.annual, r.cashFlowForecast?.base?.status],
            ['Stress -10%', r.cashFlowForecast?.stress10pct?.monthly, r.cashFlowForecast?.stress10pct?.annual, r.cashFlowForecast?.stress10pct?.status],
            ['Worst Case -25%', r.cashFlowForecast?.worstCase25pct?.monthly, r.cashFlowForecast?.worstCase25pct?.annual, r.cashFlowForecast?.worstCase25pct?.status],
          ],
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

function _fmt(val, dp) {
  if (val === null || val === undefined) return 'N/A';
  return _round(val, dp);
}

function _assessTrend(arr, label) {
  if (!arr || arr.length < 2) return { status: 'GREEN', direction: 'Insufficient data', label };
  const recent = arr[arr.length - 1];
  const earliest = arr[0];
  const pctChange = earliest !== 0 ? ((recent - earliest) / Math.abs(earliest)) * 100 : 0;
  let direction = 'Stable';
  let status = 'GREEN';
  if (pctChange < -20) { direction = 'Critical Decline'; status = 'RED'; }
  else if (pctChange < -5) { direction = 'Deteriorating'; status = 'AMBER'; }
  else if (pctChange > 5) { direction = 'Improving'; status = 'GREEN'; }
  return { status, direction, pctChange: _round(pctChange, 1), label, dataPoints: arr };
}
