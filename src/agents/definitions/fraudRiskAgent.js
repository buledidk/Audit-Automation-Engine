// ═══════════════════════════════════════════════════════════════
// Fraud Risk Agent — ISA 240 Fraud Detection Engine
// ═══════════════════════════════════════════════════════════════

const BENFORD_EXPECTED = { 1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097, 5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046 };
const CHI_SQUARE_CRITICAL_5PCT = 15.507; // df = 8

// UK Bank Holidays 2024/2025/2026 (hardcoded)
const UK_BANK_HOLIDAYS = new Set([
  '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', '2024-05-27',
  '2024-08-26', '2024-12-25', '2024-12-26',
  '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26',
  '2025-08-25', '2025-12-25', '2025-12-26',
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04', '2026-05-25',
  '2026-08-31', '2026-12-25', '2026-12-28',
]);

const APPROVAL_THRESHOLDS = [10000, 25000, 50000, 100000, 250000, 500000];
const FINANCE_USERS = new Set(['finance', 'accounts', 'controller', 'accountant', 'bookkeeper', 'treasurer']);

export const fraudRiskAgent = {
  id: 'fraud_risk',
  name: 'Fraud Risk Agent',
  description: 'ISA 240 fraud detection: Benford\'s Law analysis, Beneish M-Score, comprehensive journal entry testing, revenue manipulation indicators, and fraud triangle assessment.',
  category: 'risk_assessment',
  isaReferences: ['ISA 240', 'ISA 315', 'ISA 550', 'ACFE Fraud Tree'],

  analyze(financials, transactions = [], journalEntries = [], context = {}) {
    const f = financials || {};
    const ctx = context || {};
    const results = {
      benfordAnalysis: {},
      beneishMScore: {},
      journalEntryTesting: {},
      revenueManipulation: {},
      expenseManipulation: {},
      fraudTriangle: {},
      overallStatus: 'GREEN',
      overallFraudRisk: 'LOW',
      warnings: [],
      flaggedItems: [],
    };

    // ─── 1. BENFORD'S LAW ────────────────────────────────────────────
    results.benfordAnalysis = _performBenfordAnalysis(transactions, journalEntries);
    if (results.benfordAnalysis.chiSquare > CHI_SQUARE_CRITICAL_5PCT) {
      results.warnings.push(`Benford's Law: Chi-square ${_round(results.benfordAnalysis.chiSquare, 2)} exceeds critical value ${CHI_SQUARE_CRITICAL_5PCT} — statistically significant digit manipulation detected.`);
    }

    // ─── 2. BENEISH M-SCORE ──────────────────────────────────────────
    results.beneishMScore = _calculateBeneishMScore(f);
    if (results.beneishMScore.score !== null) {
      if (results.beneishMScore.score > -1.78) {
        results.warnings.push(`Beneish M-Score of ${_round(results.beneishMScore.score, 3)} > -1.78 — earnings manipulation LIKELY (ISA 240). Full fraud investigation procedures required.`);
      } else if (results.beneishMScore.score > -2.22) {
        results.warnings.push(`Beneish M-Score of ${_round(results.beneishMScore.score, 3)} — in grey zone (-2.22 to -1.78). Enhanced professional scepticism required.`);
      }
    }

    // ─── 3. JOURNAL ENTRY TESTING ────────────────────────────────────
    results.journalEntryTesting = _testJournalEntries(journalEntries, ctx);

    // ─── 4. REVENUE MANIPULATION INDICATORS ─────────────────────────
    results.revenueManipulation = _assessRevenueManipulation(f, transactions, ctx);

    // ─── 5. EXPENSE MANIPULATION ─────────────────────────────────────
    results.expenseManipulation = _assessExpenseManipulation(f, transactions);

    // ─── 6. FRAUD TRIANGLE ───────────────────────────────────────────
    results.fraudTriangle = _assessFraudTriangle(f, ctx, results);

    // ─── 7. OVERALL STATUS ───────────────────────────────────────────
    const fraudScore = results.fraudTriangle.totalScore;
    if (fraudScore > 0.66 || results.beneishMScore.status === 'RED' || results.benfordAnalysis.status === 'RED') {
      results.overallStatus = 'RED';
      results.overallFraudRisk = 'HIGH';
    } else if (fraudScore > 0.33 || results.beneishMScore.status === 'AMBER' || results.journalEntryTesting.highRiskCount > 5) {
      results.overallStatus = 'AMBER';
      results.overallFraudRisk = 'MEDIUM';
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      `ISA 240 FRAUD RISK ASSESSMENT`,
      `Overall Fraud Risk: ${r.overallFraudRisk} [${r.overallStatus}]`,
      '',
      `BENFORD'S LAW ANALYSIS:`,
      `  • Population tested: ${r.benfordAnalysis?.populationSize ?? 'N/A'} transactions`,
      `  • Chi-square statistic: ${r.benfordAnalysis?.chiSquare ?? 'N/A'} (critical value at 5%: ${CHI_SQUARE_CRITICAL_5PCT})`,
      `  • Result: ${r.benfordAnalysis?.status === 'RED' ? 'SIGNIFICANT DEVIATION — digits do not conform to Benford\'s Law' : 'Conforms to expected distribution'} [${r.benfordAnalysis?.status}]`,
      `  • Flagged digits: ${r.benfordAnalysis?.flaggedDigits?.join(', ') || 'None'}`,
      '',
      'BENEISH M-SCORE (Earnings Manipulation):',
      `  • M-Score: ${r.beneishMScore?.score ?? 'N/A'} [${r.beneishMScore?.status}]`,
      `  • Interpretation: ${r.beneishMScore?.interpretation || 'N/A'}`,
      `  • Key drivers: ${r.beneishMScore?.keyDrivers?.join(', ') || 'N/A'}`,
    ];

    if (r.journalEntryTesting) {
      lines.push('', 'JOURNAL ENTRY TESTING:');
      lines.push(`  • Total entries tested: ${r.journalEntryTesting.totalEntries ?? 'N/A'}`);
      lines.push(`  • High risk entries flagged: ${r.journalEntryTesting.highRiskCount ?? 0}`);
      lines.push(`  • Weekend/holiday entries: ${r.journalEntryTesting.weekendHolidayCount ?? 0}`);
      lines.push(`  • Round number entries: ${r.journalEntryTesting.roundNumberCount ?? 0}`);
      lines.push(`  • Just-below-threshold entries: ${r.journalEntryTesting.belowThresholdCount ?? 0}`);
      lines.push(`  • No description entries: ${r.journalEntryTesting.noDescriptionCount ?? 0}`);
      lines.push(`  • Post-period-close entries: ${r.journalEntryTesting.postPeriodCloseCount ?? 0}`);
      lines.push(`  • Period-end entries (last day): ${r.journalEntryTesting.periodEndCount ?? 0}`);
    }

    if (r.revenueManipulation) {
      lines.push('', 'REVENUE MANIPULATION INDICATORS:');
      Object.entries(r.revenueManipulation).forEach(([k, v]) => {
        if (v && typeof v === 'object' && v.status) {
          lines.push(`  • ${v.label || k}: [${v.status}] ${v.note || ''}`);
        }
      });
    }

    if (r.fraudTriangle) {
      lines.push('', 'FRAUD TRIANGLE ASSESSMENT:');
      lines.push(`  • Incentive: ${r.fraudTriangle.incentive?.score ?? 'N/A'}/3 — ${r.fraudTriangle.incentive?.factors?.join(', ') || 'None identified'}`);
      lines.push(`  • Opportunity: ${r.fraudTriangle.opportunity?.score ?? 'N/A'}/3 — ${r.fraudTriangle.opportunity?.factors?.join(', ') || 'None identified'}`);
      lines.push(`  • Rationalization: ${r.fraudTriangle.rationalization?.score ?? 'N/A'}/3 — ${r.fraudTriangle.rationalization?.factors?.join(', ') || 'None identified'}`);
      lines.push(`  • Total fraud score: ${_round(r.fraudTriangle.totalScore, 2)} [${r.fraudTriangle.status}]`);
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'FRAUD RISK WARNINGS (require further procedures):');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 240 paras 12-33, ISA 315`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(_results) {
    // Fraud risk affects all sections
    return [
      'revenue', 'trade_debtors', 'inventory', 'ppe', 'intangibles',
      'provisions', 'trade_creditors', 'cash_bank', 'payroll',
      'related_parties', 'going_concern', 'audit_differences',
      'financial_instruments', 'leases', 'loans_borrowings', 'tax',
    ];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Fraud Risk Assessment',
      isaReference: 'ISA 240',
      overallStatus: r.overallStatus,
      overallFraudRisk: r.overallFraudRisk,
      sections: [
        {
          title: "Benford's Law Analysis",
          columns: ['Digit', 'Expected %', 'Observed %', 'Deviation %', 'Flagged'],
          rows: r.benfordAnalysis?.digitAnalysis ? Object.entries(r.benfordAnalysis.digitAnalysis).map(([d, v]) => [
            d, `${_round(BENFORD_EXPECTED[d] * 100, 1)}%`, `${v.observedPct}%`, `${v.deviationPct}%`, v.flagged ? 'YES' : ''
          ]) : [],
        },
        {
          title: 'Beneish M-Score Components',
          columns: ['Variable', 'Value', 'Interpretation'],
          rows: r.beneishMScore?.components ? [
            ['DSRI (Days Sales Receivable Index)', r.beneishMScore.components.DSRI, '>1 = AR growing faster than revenue'],
            ['GMI (Gross Margin Index)', r.beneishMScore.components.GMI, '>1 = gross margin declining'],
            ['AQI (Asset Quality Index)', r.beneishMScore.components.AQI, '>1 = more non-productive assets'],
            ['SGI (Sales Growth Index)', r.beneishMScore.components.SGI, '>1 = sales growth'],
            ['DEPI (Depreciation Index)', r.beneishMScore.components.DEPI, '>1 = declining depreciation rate'],
            ['SGAI (SGA Index)', r.beneishMScore.components.SGAI, '>1 = SGA expense increasing'],
            ['LVGI (Leverage Index)', r.beneishMScore.components.LVGI, '>1 = increasing leverage'],
            ['TATA (Total Accruals)', r.beneishMScore.components.TATA, '>0 = accrual-based earnings'],
            ['M-Score', r.beneishMScore.score, r.beneishMScore.interpretation],
          ] : [],
        },
        {
          title: 'Journal Entry Testing Summary',
          columns: ['Test', 'Count', 'Status'],
          rows: [
            ['Total entries tested', r.journalEntryTesting?.totalEntries, ''],
            ['Weekend/bank holiday entries', r.journalEntryTesting?.weekendHolidayCount, r.journalEntryTesting?.weekendHolidayCount > 0 ? 'AMBER' : 'GREEN'],
            ['Round number entries (≥3 zeros)', r.journalEntryTesting?.roundNumberCount, r.journalEntryTesting?.roundNumberCount > 0 ? 'AMBER' : 'GREEN'],
            ['Just-below-threshold entries', r.journalEntryTesting?.belowThresholdCount, r.journalEntryTesting?.belowThresholdCount > 0 ? 'RED' : 'GREEN'],
            ['No description/narrative', r.journalEntryTesting?.noDescriptionCount, r.journalEntryTesting?.noDescriptionCount > 0 ? 'AMBER' : 'GREEN'],
            ['Top-side / manual entries', r.journalEntryTesting?.topSideCount, r.journalEntryTesting?.topSideCount > 0 ? 'AMBER' : 'GREEN'],
            ['Post-period-close entries', r.journalEntryTesting?.postPeriodCloseCount, r.journalEntryTesting?.postPeriodCloseCount > 0 ? 'RED' : 'GREEN'],
            ['Period-end (last day) entries', r.journalEntryTesting?.periodEndCount, r.journalEntryTesting?.periodEndCount > 0 ? 'AMBER' : 'GREEN'],
            ['Reversals within 30 days of year end', r.journalEntryTesting?.reversalNearYearEndCount, r.journalEntryTesting?.reversalNearYearEndCount > 0 ? 'RED' : 'GREEN'],
            ['Backdated entries', r.journalEntryTesting?.backdatedCount, r.journalEntryTesting?.backdatedCount > 0 ? 'RED' : 'GREEN'],
          ],
        },
        {
          title: 'Fraud Triangle',
          columns: ['Dimension', 'Score', 'Key Factors'],
          rows: [
            ['Incentive', `${r.fraudTriangle?.incentive?.score}/3`, (r.fraudTriangle?.incentive?.factors || []).join('; ')],
            ['Opportunity', `${r.fraudTriangle?.opportunity?.score}/3`, (r.fraudTriangle?.opportunity?.factors || []).join('; ')],
            ['Rationalization', `${r.fraudTriangle?.rationalization?.score}/3`, (r.fraudTriangle?.rationalization?.factors || []).join('; ')],
            ['Total Score', _round(r.fraudTriangle?.totalScore, 2), r.fraudTriangle?.status],
          ],
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

// ─── Benford's Law ───────────────────────────────────────────────
function _performBenfordAnalysis(transactions, journalEntries) {
  const allAmounts = [
    ...(transactions || []).map(t => Math.abs(t.amount || t.value || 0)),
    ...(journalEntries || []).map(j => Math.abs(j.amount || j.debit || j.credit || 0)),
  ].filter(a => a > 0);

  const populationSize = allAmounts.length;
  if (populationSize < 30) {
    return { status: 'N/A', note: 'Insufficient population for Benford\'s Law (minimum 30 transactions required)', populationSize };
  }

  const digitCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  allAmounts.forEach(amt => {
    const firstDigit = parseInt(String(Math.abs(amt)).replace(/^0\.0*/, '').replace('.', '')[0]);
    if (firstDigit >= 1 && firstDigit <= 9) digitCounts[firstDigit]++;
  });

  let chiSquare = 0;
  const digitAnalysis = {};
  const flaggedDigits = [];

  for (let d = 1; d <= 9; d++) {
    const observed = digitCounts[d] / populationSize;
    const expected = BENFORD_EXPECTED[d];
    const deviation = observed - expected;
    const deviationPct = _round(deviation * 100, 2);
    const chiContribution = populationSize * Math.pow(deviation, 2) / expected;
    chiSquare += chiContribution;
    const flagged = Math.abs(deviation) > 0.05;
    if (flagged) flaggedDigits.push(d);
    digitAnalysis[d] = {
      count: digitCounts[d],
      observedPct: _round(observed * 100, 2),
      expectedPct: _round(expected * 100, 2),
      deviationPct,
      flagged,
    };
  }

  const status = chiSquare > CHI_SQUARE_CRITICAL_5PCT ? 'RED' : chiSquare > CHI_SQUARE_CRITICAL_5PCT * 0.7 ? 'AMBER' : 'GREEN';

  return {
    populationSize,
    chiSquare: _round(chiSquare, 3),
    criticalValue: CHI_SQUARE_CRITICAL_5PCT,
    status,
    digitAnalysis,
    flaggedDigits,
    interpretation: status === 'RED'
      ? 'Significant deviation from Benford\'s Law — manual fabrication of numbers indicated. Full investigation of flagged digit transactions required.'
      : 'Distribution broadly conforms to Benford\'s Law.',
  };
}

// ─── Beneish M-Score ─────────────────────────────────────────────
function _calculateBeneishMScore(f) {
  const ar_t = f.tradeDebtors || f.accountsReceivable || 0;
  const ar_t1 = f.priorTradeDebtors || f.priorAccountsReceivable || ar_t;
  const rev_t = f.revenue || f.turnover || 0;
  const rev_t1 = f.priorRevenue || rev_t;
  const gm_t = rev_t > 0 ? (f.grossProfit || 0) / rev_t : 0;
  const gm_t1 = rev_t1 > 0 ? (f.priorGrossProfit || f.grossProfit || 0) / rev_t1 : gm_t;
  const ca_t = f.currentAssets || 0;
  const ca_t1 = f.priorCurrentAssets || ca_t;
  const ppe_t = f.ppe || f.tangibleAssets || 0;
  const ppe_t1 = f.priorPpe || ppe_t;
  const ta_t = f.totalAssets || 1;
  const ta_t1 = f.priorTotalAssets || ta_t;
  const dep_t = f.depreciation || 0;
  const dep_t1 = f.priorDepreciation || dep_t;
  const sga_t = f.sgaExpense || f.adminExpenses || 0;
  const sga_t1 = f.priorSgaExpense || sga_t;
  const ltd_t = f.longTermDebt || 0;
  const ltd_t1 = f.priorLongTermDebt || ltd_t;
  const cl_t = f.currentLiabilities || 0;
  const cl_t1 = f.priorCurrentLiabilities || cl_t;
  const cash_t = f.cash || f.cashAndEquivalents || 0;
  const cash_t1 = f.priorCash || cash_t;
  const currentPortionLtd_t = f.currentPortionLongTermDebt || 0;
  const currentPortionLtd_t1 = f.priorCurrentPortionLongTermDebt || currentPortionLtd_t;

  if (rev_t === 0 || ta_t === 0) return { score: null, status: 'N/A', interpretation: 'Insufficient data for M-Score calculation' };

  const dsri = (ar_t1 / rev_t1) > 0 ? (ar_t / rev_t) / (ar_t1 / rev_t1) : 1;
  const gmi = gm_t > 0 ? gm_t1 / gm_t : 1;
  const nonProdAssets_t = 1 - (ca_t + ppe_t) / ta_t;
  const nonProdAssets_t1 = ta_t1 > 0 ? 1 - (ca_t1 + ppe_t1) / ta_t1 : nonProdAssets_t;
  const aqi = nonProdAssets_t1 !== 0 ? nonProdAssets_t / nonProdAssets_t1 : 1;
  const sgi = rev_t1 > 0 ? rev_t / rev_t1 : 1;
  const depiDenom_t = dep_t + ppe_t;
  const depiDenom_t1 = dep_t1 + ppe_t1;
  const depi = (depiDenom_t > 0 && depiDenom_t1 > 0) ? (dep_t1 / depiDenom_t1) / (dep_t / depiDenom_t) : 1;
  const sgai = (rev_t1 > 0 && rev_t > 0) ? (sga_t / rev_t) / (sga_t1 / rev_t1) : 1;
  const lvgi = ta_t > 0 ? ((ltd_t + cl_t) / ta_t) / ((ltd_t1 + cl_t1) / (ta_t1 || ta_t)) : 1;
  const deltaCA = ca_t - ca_t1;
  const deltaCash = cash_t - cash_t1;
  const deltaCL = cl_t - cl_t1;
  const deltaCurrentPortionLtd = currentPortionLtd_t - currentPortionLtd_t1;
  const tata = (deltaCA - deltaCash - deltaCL + deltaCurrentPortionLtd - dep_t) / ta_t;

  const score = -4.84 + 0.920 * dsri + 0.528 * gmi + 0.404 * aqi + 0.892 * sgi
    + 0.115 * depi - 0.172 * sgai + 4.679 * tata - 0.327 * lvgi;

  let status = 'GREEN';
  let interpretation = 'M-Score suggests no evidence of earnings manipulation.';
  const keyDrivers = [];

  if (score > -1.78) {
    status = 'RED';
    interpretation = 'M-Score > -1.78: Earnings manipulation LIKELY. Immediate expanded procedures required under ISA 240.';
  } else if (score > -2.22) {
    status = 'AMBER';
    interpretation = 'M-Score in grey zone (-2.22 to -1.78): Possible manipulation. Enhanced scepticism required.';
  }

  if (dsri > 1.2) keyDrivers.push('DSRI elevated — receivables growing faster than revenue');
  if (gmi > 1.2) keyDrivers.push('GMI elevated — deteriorating gross margin');
  if (Math.abs(tata) > 0.1) keyDrivers.push('TATA high — large total accruals');
  if (aqi > 1.2) keyDrivers.push('AQI elevated — increasing non-productive assets');

  return {
    score: _round(score, 3),
    status,
    interpretation,
    keyDrivers,
    components: {
      DSRI: _round(dsri, 3), GMI: _round(gmi, 3), AQI: _round(aqi, 3), SGI: _round(sgi, 3),
      DEPI: _round(depi, 3), SGAI: _round(sgai, 3), LVGI: _round(lvgi, 3), TATA: _round(tata, 4),
    },
  };
}

// ─── Journal Entry Testing ───────────────────────────────────────
function _testJournalEntries(journalEntries, ctx) {
  const entries = journalEntries || [];
  const periodEnd = ctx.periodEnd ? new Date(ctx.periodEnd) : null;
  const financeUsers = ctx.financeUsers ? new Set(ctx.financeUsers.map(u => u.toLowerCase())) : FINANCE_USERS;

  const summary = {
    totalEntries: entries.length,
    highRiskCount: 0,
    weekendHolidayCount: 0,
    roundNumberCount: 0,
    belowThresholdCount: 0,
    noDescriptionCount: 0,
    topSideCount: 0,
    postPeriodCloseCount: 0,
    periodEndCount: 0,
    reversalNearYearEndCount: 0,
    backdatedCount: 0,
    unusualUserCount: 0,
    flaggedEntries: [],
  };

  entries.forEach((je, idx) => {
    const flags = [];
    const amount = Math.abs(je.amount || je.debit || je.credit || 0);
    const postedDate = je.postedDate || je.date ? new Date(je.postedDate || je.date) : null;
    const transactionDate = je.transactionDate ? new Date(je.transactionDate) : postedDate;

    if (postedDate) {
      const day = postedDate.getDay();
      const dateStr = postedDate.toISOString().split('T')[0];

      if (day === 0 || day === 6) {
        flags.push('Weekend entry');
        summary.weekendHolidayCount++;
      }
      if (UK_BANK_HOLIDAYS.has(dateStr)) {
        flags.push('Bank holiday entry');
        summary.weekendHolidayCount++;
      }

      if (periodEnd && postedDate > periodEnd) {
        flags.push('Posted after period close');
        summary.postPeriodCloseCount++;
      }

      if (periodEnd) {
        const periodEndDay = new Date(periodEnd);
        periodEndDay.setHours(0, 0, 0, 0);
        const postedDay = new Date(postedDate);
        postedDay.setHours(0, 0, 0, 0);
        if (postedDay.getTime() === periodEndDay.getTime()) {
          flags.push('Period-end entry (last day of period)');
          summary.periodEndCount++;
        }
      }

      // Backdated: posted significantly after transaction date
      if (transactionDate && postedDate > transactionDate) {
        const daysDiff = (postedDate - transactionDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > 30) {
          flags.push(`Backdated entry (${Math.round(daysDiff)} days late)`);
          summary.backdatedCount++;
        }
      }
    }

    // Round numbers
    if (amount > 0 && amount % 1000 === 0) {
      flags.push('Round number amount');
      summary.roundNumberCount++;
    }

    // Just below approval threshold
    const belowThreshold = APPROVAL_THRESHOLDS.find(t => amount > t * 0.95 && amount < t);
    if (belowThreshold) {
      flags.push(`Just below approval threshold (£${belowThreshold.toLocaleString()})`);
      summary.belowThresholdCount++;
    }

    // No description
    if (!je.description && !je.narrative && !je.reference) {
      flags.push('No description or narrative');
      summary.noDescriptionCount++;
    }

    // Unusual user
    if (je.postedBy) {
      const user = je.postedBy.toLowerCase();
      const isFinanceUser = [...financeUsers].some(fu => user.includes(fu));
      if (!isFinanceUser) {
        flags.push(`Unusual posting user: ${je.postedBy}`);
        summary.unusualUserCount++;
      }
    }

    // Top-side / manual entries
    if (!je.source || je.source === 'MANUAL' || je.source === 'TOPSIDE' || je.isManual) {
      flags.push('Manual / top-side entry (no system source)');
      summary.topSideCount++;
    }

    // Reversals near year end
    if (je.isReversal && periodEnd) {
      const daysFromYearEnd = periodEnd ? (periodEnd - (postedDate || periodEnd)) / (1000 * 60 * 60 * 24) : 999;
      if (Math.abs(daysFromYearEnd) <= 30) {
        flags.push('Reversal within 30 days of year end');
        summary.reversalNearYearEndCount++;
      }
    }

    if (flags.length > 0) {
      summary.highRiskCount++;
      summary.flaggedEntries.push({ index: idx, id: je.id || je.reference, amount, flags });
    }
  });

  summary.status = summary.highRiskCount > 10 ? 'RED' : summary.highRiskCount > 3 ? 'AMBER' : 'GREEN';
  return summary;
}

// ─── Revenue Manipulation Indicators ────────────────────────────
function _assessRevenueManipulation(f, transactions, ctx) {
  const results = {};
  const periodEnd = ctx.periodEnd ? new Date(ctx.periodEnd) : null;
  const revenue = f.revenue || f.turnover || 0;
  const priorRevenue = f.priorRevenue || 0;

  // Bill-and-hold: large near-period-end invoices with extended payment terms
  const nearPeriodEndInvoices = (transactions || []).filter(t => {
    if (!periodEnd || !t.date) return false;
    const tDate = new Date(t.date);
    const daysToEnd = (periodEnd - tDate) / (1000 * 60 * 60 * 24);
    const isLargeInvoice = Math.abs(t.amount || 0) > (revenue * 0.01);
    const hasExtendedTerms = (t.paymentTermsDays || 0) > 90;
    return daysToEnd >= 0 && daysToEnd <= 30 && isLargeInvoice && hasExtendedTerms;
  });
  results.billAndHold = {
    label: 'Bill-and-hold arrangements',
    count: nearPeriodEndInvoices.length,
    status: nearPeriodEndInvoices.length > 0 ? 'AMBER' : 'GREEN',
    note: nearPeriodEndInvoices.length > 0 ? `${nearPeriodEndInvoices.length} large near-period-end invoices with extended payment terms — review for bill-and-hold criteria` : 'No indicators identified',
  };

  // Channel stuffing: abnormal spike in distributor invoices near year end
  const distributorInvoices = (transactions || []).filter(t => t.customerType === 'distributor' || t.isDistributor);
  const revenueStdDevThreshold = revenue * 0.02;
  const channelStuffingFlag = distributorInvoices.filter(t => {
    if (!periodEnd || !t.date) return false;
    const tDate = new Date(t.date);
    const daysToEnd = (periodEnd - tDate) / (1000 * 60 * 60 * 24);
    return daysToEnd >= 0 && daysToEnd <= 30 && Math.abs(t.amount || 0) > revenueStdDevThreshold * 2;
  });
  results.channelStuffing = {
    label: 'Channel stuffing indicators',
    count: channelStuffingFlag.length,
    status: channelStuffingFlag.length > 0 ? 'RED' : 'GREEN',
    note: channelStuffingFlag.length > 0 ? 'Abnormal distributor invoices near year end — potential channel stuffing. Review post-year-end returns.' : 'No indicators',
  };

  // Post-year-end revenue reversals
  const postYearEndReversals = (transactions || []).filter(t => {
    if (!periodEnd || !t.date) return false;
    const tDate = new Date(t.date);
    const daysAfterEnd = (tDate - periodEnd) / (1000 * 60 * 60 * 24);
    return daysAfterEnd > 0 && daysAfterEnd <= 60 && (t.isCredit || t.isReversal || (t.amount || 0) < 0);
  });
  results.postYearEndReversals = {
    label: 'Post-year-end revenue reversals',
    count: postYearEndReversals.length,
    status: postYearEndReversals.length > 0 ? 'RED' : 'GREEN',
    note: postYearEndReversals.length > 0 ? `${postYearEndReversals.length} revenue reversals within 60 days post year end — potential premature revenue recognition` : 'None identified',
  };

  // Percentage completion manipulation
  const pcRevenue = f.percentageCompletionRevenue || 0;
  const pcGrossMargin = pcRevenue > 0 ? ((f.percentageCompletionGrossProfit || 0) / pcRevenue) * 100 : null;
  const pcPriorGrossMargin = (f.priorPercentageCompletionRevenue || 0) > 0
    ? ((f.priorPercentageCompletionGrossProfit || 0) / f.priorPercentageCompletionRevenue) * 100 : pcGrossMargin;
  const pcGrowth = priorRevenue > 0 ? ((revenue - priorRevenue) / priorRevenue) * 100 : null;

  if (pcRevenue > 0) {
    const marginImprovedWhileRevenueDeclined = pcGrossMargin !== null && pcPriorGrossMargin !== null
      && pcGrossMargin > pcPriorGrossMargin && pcGrowth !== null && pcGrowth < 0;
    results.pcManipulation = {
      label: 'Percentage completion manipulation',
      status: marginImprovedWhileRevenueDeclined ? 'RED' : 'GREEN',
      note: marginImprovedWhileRevenueDeclined
        ? 'Gross margin improvement despite revenue decline in construction/POC contracts — review stage of completion estimates'
        : 'No POC manipulation indicators',
    };
  }

  return results;
}

// ─── Expense Manipulation ────────────────────────────────────────
function _assessExpenseManipulation(f, _transactions) {
  const results = {};
  const totalExpenses = f.totalExpenses || f.operatingExpenses || 0;
  const priorExpenses = f.priorTotalExpenses || totalExpenses;
  const expenseChange = priorExpenses > 0 ? ((totalExpenses - priorExpenses) / priorExpenses) * 100 : null;

  // Large near-year-end deferrals
  const capitalised = f.capitalisedDevelopmentCosts || f.capitalisedExpenses || 0;
  const priorCapitalised = f.priorCapitalisedDevelopmentCosts || capitalised;
  const capitalisationIncrease = priorCapitalised > 0 ? ((capitalised - priorCapitalised) / priorCapitalised) * 100 : null;

  results.expenseDeferral = {
    label: 'Unusual expense capitalisation',
    status: capitalisationIncrease !== null && capitalisationIncrease > 25 ? 'RED' : 'GREEN',
    note: capitalisationIncrease !== null && capitalisationIncrease > 25
      ? `Capitalised expenses increased ${_round(capitalisationIncrease, 1)}% YoY — potential expense deferral to improve reported earnings`
      : 'No unusual capitalisation identified',
  };

  results.expenseAllocationChange = {
    label: 'Expense allocation change',
    status: expenseChange !== null && Math.abs(expenseChange) > 20 ? 'AMBER' : 'GREEN',
    note: expenseChange !== null ? `Total expenses changed ${_round(expenseChange, 1)}% YoY — review allocation methodology` : 'N/A',
  };

  return results;
}

// ─── Fraud Triangle ──────────────────────────────────────────────
function _assessFraudTriangle(f, ctx, analysisResults) {
  let incentiveScore = 0;
  const incentiveFactors = [];
  let opportunityScore = 0;
  const opportunityFactors = [];
  let rationalizationScore = 0;
  const rationalizationFactors = [];

  // INCENTIVE (0-3)
  if (ctx.missingTargets || f.operatingProfit < 0) { incentiveScore++; incentiveFactors.push('Missing profitability targets'); }
  if (ctx.managementBonuses) { incentiveScore++; incentiveFactors.push('Performance-based management bonuses'); }
  if (ctx.covenantPressure || (f.interestCover && f.interestCover < 2)) { incentiveScore++; incentiveFactors.push('Covenant pressure'); }

  // OPPORTUNITY (0-3)
  if (ctx.weakControls || ctx.entitySize === 'micro' || ctx.entitySize === 'small') { opportunityScore++; opportunityFactors.push('Weak internal controls / limited segregation of duties'); }
  if (ctx.managementOverride || (analysisResults.journalEntryTesting?.topSideCount || 0) > 3) { opportunityScore++; opportunityFactors.push('Evidence of management override of controls'); }
  if (ctx.complexStructures || ctx.relatedPartyTransactions) { opportunityScore++; opportunityFactors.push('Complex organisational structure or significant related party transactions'); }

  // RATIONALIZATION (0-3)
  if (ctx.managementAttitude === 'aggressive') { rationalizationScore++; rationalizationFactors.push('Aggressive management attitude to financial reporting'); }
  if (ctx.priorAuditAdjustments || ctx.priorMisstatements) { rationalizationScore++; rationalizationFactors.push('History of prior audit adjustments or misstatements'); }
  if (ctx.regulatoryIssues) { rationalizationScore++; rationalizationFactors.push('Regulatory or legal issues'); }

  const totalRaw = incentiveScore + opportunityScore + rationalizationScore;
  const totalScore = totalRaw / 9;

  let status = 'GREEN';
  if (totalScore > 0.66) status = 'RED';
  else if (totalScore > 0.33) status = 'AMBER';

  return {
    incentive: { score: incentiveScore, maxScore: 3, factors: incentiveFactors },
    opportunity: { score: opportunityScore, maxScore: 3, factors: opportunityFactors },
    rationalization: { score: rationalizationScore, maxScore: 3, factors: rationalizationFactors },
    totalScore: _round(totalScore, 2),
    rawScore: totalRaw,
    maxRawScore: 9,
    status,
    interpretation: status === 'RED'
      ? 'HIGH fraud risk — all three fraud triangle dimensions elevated. Expanded fraud procedures required under ISA 240.'
      : status === 'AMBER'
        ? 'MEDIUM fraud risk — one or more fraud triangle dimensions elevated. Enhanced professional scepticism required.'
        : 'LOW fraud risk — fraud triangle assessment does not indicate elevated risk at this time.',
  };
}

// ─── Helpers ────────────────────────────────────────────────────
function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
