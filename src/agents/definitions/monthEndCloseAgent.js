// ═══════════════════════════════════════════════════════════════
// Month-End Close Agent — Accruals, Journal Entries, Close Checklist
// Inspired by Anthropic Financial Services Month-End Closer plugin
// ═══════════════════════════════════════════════════════════════

import { generateAINarrative } from './financeAgentUtils.js';

const ACCRUAL_CATEGORIES = ['salaries', 'rent', 'utilities', 'professional_fees', 'interest', 'bonuses', 'insurance', 'other'];

export const monthEndCloseAgent = {
  id: 'month_end_close',
  name: 'Month-End Close Agent',
  description: 'Executes close checklists, identifies required accruals, validates journal entries, produces variance commentary, and tracks close status. ISA 500 / ISA 540 / FRS 102.',
  category: 'finance_ops',
  wpScope: ['a1', 'a3', 'b1', 'c1', 'd1', 'e1'],
  isaReferences: ['ISA 500', 'ISA 540', 'ISA 240', 'ISA 330', 'FRS 102'],

  async runWithAI(closeData, priorPeriod, context) {
    const results = this.analyze(closeData, priorPeriod, context);
    results.aiNarrative = await generateAINarrative(this, results, context);
    return results;
  },

  analyze(closeData, priorPeriod, context = {}) {
    const cd = closeData || {};
    const pp = priorPeriod || {};
    const ctx = context || {};
    const materiality = ctx.performanceMateriality || ctx.materiality || 0;
    const trivial = ctx.trivialThreshold || materiality * 0.05;

    const results = {
      accruals: [],
      journalEntries: [],
      journalFlags: [],
      varianceAnalysis: [],
      closeChecklist: [],
      overallStatus: 'GREEN',
      warnings: [],
      closeDate: cd.closeDate || new Date().toISOString().split('T')[0],
      periodEnd: cd.periodEnd || cd.closeDate,
    };

    // 1. Accruals analysis
    _analyzeAccruals(cd, pp, results, materiality, trivial);

    // 2. Journal entry validation (ISA 240 management override focus)
    _validateJournalEntries(cd, results, materiality, ctx);

    // 3. Variance analysis (current vs prior period)
    _runVarianceAnalysis(cd, pp, results, materiality);

    // 4. Close checklist
    _buildCloseChecklist(cd, results);

    // Overall
    if (results.journalFlags.length > 0) {
      results.overallStatus = 'RED';
      results.warnings.push(`${results.journalFlags.length} journal entry flag(s) requiring investigation (ISA 240).`);
    } else if (results.accruals.filter(a => a.status === 'MISSING').length > 0) {
      results.overallStatus = 'AMBER';
      results.warnings.push('Missing accruals identified — potential understatement of liabilities.');
    } else if (results.varianceAnalysis.filter(v => v.status === 'INVESTIGATE').length > 0) {
      results.overallStatus = 'AMBER';
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      'MONTH-END CLOSE ANALYSIS',
      `Overall Status: [${r.overallStatus}]`,
      `Period End: ${r.periodEnd}`,
      '',
    ];

    // Accruals
    const missing = (r.accruals || []).filter(a => a.status === 'MISSING');
    const booked = (r.accruals || []).filter(a => a.status === 'BOOKED');
    lines.push(`ACCRUALS: ${booked.length} booked, ${missing.length} potentially missing`);
    if (missing.length > 0) {
      missing.forEach(a => lines.push(`  [MISSING] ${a.category}: Estimated £${(a.estimatedAmount || 0).toLocaleString()} — ${a.note}`));
    }
    lines.push('');

    // Journal flags
    if ((r.journalFlags || []).length > 0) {
      lines.push('JOURNAL ENTRY FLAGS (ISA 240):');
      r.journalFlags.forEach(f => lines.push(`  [FLAG] JE ${f.journalRef}: £${(f.amount || 0).toLocaleString()} — ${f.reason}`));
      lines.push('');
    }

    // Variances
    const investigate = (r.varianceAnalysis || []).filter(v => v.status === 'INVESTIGATE');
    if (investigate.length > 0) {
      lines.push('VARIANCES REQUIRING INVESTIGATION:');
      investigate.forEach(v => lines.push(`  ${v.account}: £${(v.currentPeriod || 0).toLocaleString()} vs PY £${(v.priorPeriod || 0).toLocaleString()} (${v.variancePct}%) — ${v.commentary}`));
      lines.push('');
    }

    // Checklist
    const incomplete = (r.closeChecklist || []).filter(c => !c.complete);
    if (incomplete.length > 0) {
      lines.push(`CLOSE CHECKLIST: ${incomplete.length} item(s) outstanding`);
      incomplete.forEach(c => lines.push(`  [ ] ${c.step}`));
    }

    if ((r.warnings || []).length > 0) {
      lines.push('', 'AUDIT ATTENTION POINTS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', 'ISA References: ISA 500, ISA 540, ISA 240');

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['accruals', 'journal_entries'];
    if ((results?.journalFlags || []).length > 0) sections.push('management_override', 'fraud_risk');
    if ((results?.varianceAnalysis || []).filter(v => v.status === 'INVESTIGATE').length > 0) sections.push('analytical_procedures');
    return sections;
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Month-End Close',
      isaReference: 'ISA 500 / ISA 540',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Accruals Review',
          columns: ['Category', 'Status', 'Booked Amount (£)', 'Estimated Amount (£)', 'Difference (£)', 'Notes'],
          rows: (r.accruals || []).map(a => [a.category, a.status, a.bookedAmount, a.estimatedAmount, a.difference, a.note]),
        },
        {
          title: 'Journal Entry Flags',
          columns: ['Journal Ref', 'Date', 'Amount (£)', 'Description', 'Flag Reason', 'Risk Level'],
          rows: (r.journalFlags || []).map(f => [f.journalRef, f.date, f.amount, f.description, f.reason, f.riskLevel]),
        },
        {
          title: 'Variance Analysis',
          columns: ['Account', 'Current Period (£)', 'Prior Period (£)', 'Variance (£)', 'Variance %', 'Status', 'Commentary'],
          rows: (r.varianceAnalysis || []).map(v => [v.account, v.currentPeriod, v.priorPeriod, v.variance, `${v.variancePct}%`, v.status, v.commentary]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

function _analyzeAccruals(cd, pp, results, materiality, trivial) {
  const bookedAccruals = cd.accruals || {};
  const priorAccruals = pp.accruals || {};

  ACCRUAL_CATEGORIES.forEach(category => {
    const booked = parseFloat(bookedAccruals[category] || 0);
    const priorAmount = parseFloat(priorAccruals[category] || 0);
    const expectedIndicator = cd.expectedAccruals?.[category];

    let status = 'BOOKED';
    let estimatedAmount = booked;
    let note = '';

    if (booked === 0 && priorAmount > trivial) {
      status = 'MISSING';
      estimatedAmount = priorAmount;
      note = `Accrued £${priorAmount.toLocaleString()} in prior period but nothing booked this period.`;
    } else if (booked > 0 && expectedIndicator && Math.abs(booked - expectedIndicator) > materiality * 0.1) {
      status = 'REVIEW';
      estimatedAmount = expectedIndicator;
      note = `Booked £${booked.toLocaleString()} but expected approximately £${expectedIndicator.toLocaleString()}.`;
    } else if (booked > 0) {
      note = priorAmount > 0
        ? `Movement from PY: £${(booked - priorAmount).toLocaleString()} (${_round(((booked - priorAmount) / priorAmount) * 100, 1)}%)`
        : 'New accrual this period.';
    }

    results.accruals.push({
      category,
      status,
      bookedAmount: booked,
      estimatedAmount,
      difference: _round(booked - estimatedAmount, 2),
      note,
    });
  });
}

function _validateJournalEntries(cd, results, materiality, ctx) {
  const journals = cd.journalEntries || cd.journals || [];

  journals.forEach(je => {
    const amount = Math.abs(parseFloat(je.amount || je.debit || je.credit || 0));
    const ref = je.ref || je.journalRef || je.id || 'N/A';
    const date = je.date || je.postingDate;
    const desc = je.description || je.narrative || '';
    const postedBy = je.postedBy || je.user || '';

    results.journalEntries.push({ journalRef: ref, date, amount, description: desc, postedBy });

    // ISA 240 flags
    const flags = [];

    // Round-number amounts above materiality
    if (amount > materiality && amount % 1000 === 0) {
      flags.push({ reason: 'Round-number amount above materiality', riskLevel: 'MEDIUM' });
    }

    // Posted outside business hours (before 7am or after 9pm)
    if (date) {
      const hour = new Date(date).getHours();
      if (hour < 7 || hour >= 21) {
        flags.push({ reason: 'Posted outside business hours', riskLevel: 'HIGH' });
      }
    }

    // Posted by senior management (management override risk)
    const seniorRoles = ['cfo', 'ceo', 'director', 'partner', 'controller', 'finance director'];
    if (seniorRoles.some(r => postedBy.toLowerCase().includes(r))) {
      flags.push({ reason: 'Posted by senior management (ISA 240 management override)', riskLevel: 'HIGH' });
    }

    // Unusual description keywords
    const unusualKeywords = ['adjustment', 'correction', 'reclassification', 'reversal', 'write-off', 'write off', 'provision release'];
    if (unusualKeywords.some(k => desc.toLowerCase().includes(k)) && amount > materiality * 0.5) {
      flags.push({ reason: `Contains "${unusualKeywords.find(k => desc.toLowerCase().includes(k))}" and amount is significant`, riskLevel: 'MEDIUM' });
    }

    // Back-dated entries
    const periodEnd = cd.periodEnd ? new Date(cd.periodEnd) : null;
    if (periodEnd && date) {
      const jeDate = new Date(date);
      const daysDiff = Math.floor((periodEnd - jeDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 45) {
        flags.push({ reason: `Back-dated by ${daysDiff} days from period end`, riskLevel: 'HIGH' });
      }
    }

    if (flags.length > 0) {
      flags.forEach(f => {
        results.journalFlags.push({ journalRef: ref, date, amount, description: desc, ...f });
      });
    }
  });
}

function _runVarianceAnalysis(cd, pp, results, materiality) {
  const current = cd.trialBalance || cd.accounts || {};
  const prior = pp.trialBalance || pp.accounts || {};

  const allAccounts = new Set([...Object.keys(current), ...Object.keys(prior)]);

  allAccounts.forEach(account => {
    const cy = parseFloat(current[account] || 0);
    const py = parseFloat(prior[account] || 0);
    const variance = cy - py;
    const variancePct = py !== 0 ? _round((variance / Math.abs(py)) * 100, 1) : (cy !== 0 ? 100 : 0);

    let status = 'OK';
    let commentary = '';

    if (Math.abs(variance) > materiality) {
      status = 'INVESTIGATE';
      commentary = `Variance of £${variance.toLocaleString()} exceeds performance materiality — corroborating evidence required.`;
    } else if (Math.abs(variancePct) > 25 && Math.abs(variance) > materiality * 0.25) {
      status = 'INVESTIGATE';
      commentary = `${variancePct}% movement — investigate whether consistent with understanding of entity.`;
    } else if (Math.abs(variancePct) > 10) {
      status = 'NOTE';
      commentary = `${variancePct}% movement — within expectations but noted.`;
    }

    if (status !== 'OK' || Math.abs(cy) > materiality) {
      results.varianceAnalysis.push({
        account,
        currentPeriod: cy,
        priorPeriod: py,
        variance,
        variancePct,
        status,
        commentary,
      });
    }
  });

  results.varianceAnalysis.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
}

function _buildCloseChecklist(cd, results) {
  const completed = cd.completedSteps || {};
  const steps = [
    'Bank reconciliations completed',
    'Intercompany balances agreed',
    'Revenue cut-off verified',
    'Payroll accrual posted',
    'Depreciation charge posted',
    'Prepayments and accruals reviewed',
    'VAT reconciliation completed',
    'Fixed asset register reconciled',
    'Stock count / valuation updated',
    'Provisions reviewed and updated',
    'Management review of trial balance',
    'Prior period adjustments processed',
  ];

  steps.forEach(step => {
    const key = step.toLowerCase().replace(/[^a-z0-9]/g, '_');
    results.closeChecklist.push({
      step,
      complete: !!completed[key],
      completedBy: completed[key]?.by || null,
      completedDate: completed[key]?.date || null,
    });
  });
}

function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
