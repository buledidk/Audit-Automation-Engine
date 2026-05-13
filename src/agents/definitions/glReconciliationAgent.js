// ═══════════════════════════════════════════════════════════════
// GL Reconciliation Agent — Balance Sheet Substantive Testing
// Inspired by Anthropic Financial Services GL Reconciler plugin
// ═══════════════════════════════════════════════════════════════

import { generateAINarrative } from './financeAgentUtils.js';

const TOLERANCE_PCT = 0.01; // 1% tolerance for auto-match
const STALE_DAYS_THRESHOLD = 90;

export const glReconciliationAgent = {
  id: 'gl_reconciliation',
  name: 'GL Reconciliation Agent',
  description: 'Reconciles general ledger balances to sub-ledgers and supporting schedules. Identifies breaks, traces root causes, and routes for sign-off. ISA 500 / ISA 330 substantive procedures.',
  category: 'finance_ops',
  wpScope: ['b1', 'b2', 'b3', 'c1', 'c2', 'd1', 'e1', 'f1'],
  isaReferences: ['ISA 500', 'ISA 330', 'ISA 505', 'ISA 501', 'FRS 102'],

  async runWithAI(glData, subLedgerData, context) {
    const results = this.analyze(glData, subLedgerData, context);
    results.aiNarrative = await generateAINarrative(this, results, context);
    return results;
  },

  analyze(glData, subLedgerData, context = {}) {
    const gl = glData || {};
    const sub = subLedgerData || {};
    const ctx = context || {};
    const materiality = ctx.performanceMateriality || ctx.materiality || 0;

    const results = {
      accounts: [],
      totalBreaks: 0,
      materialBreaks: 0,
      unmatchedItems: [],
      staleItems: [],
      overallStatus: 'GREEN',
      warnings: [],
      reconciliationDate: new Date().toISOString().split('T')[0],
    };

    // Reconcile each GL account against sub-ledger
    const glAccounts = gl.accounts || gl.trialBalance || [];
    const subLedgers = sub.ledgers || sub.schedules || {};

    glAccounts.forEach(account => {
      const code = account.code || account.accountCode;
      const glBalance = parseFloat(account.balance || account.closingBalance || 0);
      const subLedger = subLedgers[code] || {};
      const subBalance = parseFloat(subLedger.total || subLedger.balance || 0);

      const difference = _round(glBalance - subBalance, 2);
      const absDiff = Math.abs(difference);
      const diffPct = glBalance !== 0 ? _round((absDiff / Math.abs(glBalance)) * 100, 2) : (absDiff > 0 ? 100 : 0);

      let status = 'MATCHED';
      if (absDiff > 0 && diffPct <= TOLERANCE_PCT * 100) {
        status = 'WITHIN_TOLERANCE';
      } else if (absDiff > 0 && absDiff <= materiality) {
        status = 'BREAK_IMMATERIAL';
        results.totalBreaks++;
      } else if (absDiff > 0) {
        status = 'BREAK_MATERIAL';
        results.totalBreaks++;
        results.materialBreaks++;
      }

      // Check for stale reconciling items
      const reconItems = subLedger.reconcilingItems || [];
      const staleItems = reconItems.filter(item => {
        const itemDate = new Date(item.date || item.transactionDate);
        const daysSince = Math.floor((Date.now() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince > STALE_DAYS_THRESHOLD;
      });

      if (staleItems.length > 0) {
        results.staleItems.push(...staleItems.map(s => ({
          account: code,
          accountName: account.name || account.accountName,
          ...s,
        })));
      }

      results.accounts.push({
        code,
        name: account.name || account.accountName,
        fsli: account.fsli || _inferFSLI(account.name || ''),
        glBalance,
        subLedgerBalance: subBalance,
        difference,
        diffPct,
        status,
        reconcilingItemsCount: reconItems.length,
        staleItemsCount: staleItems.length,
        rootCause: status.startsWith('BREAK') ? _inferRootCause(difference, reconItems, account) : null,
      });
    });

    // Unmatched sub-ledger entries (exist in sub but not GL)
    Object.keys(subLedgers).forEach(code => {
      const hasGL = glAccounts.some(a => (a.code || a.accountCode) === code);
      if (!hasGL && subLedgers[code].total > 0) {
        results.unmatchedItems.push({
          code,
          subLedgerBalance: subLedgers[code].total,
          type: 'sub_ledger_only',
          note: 'Sub-ledger balance with no corresponding GL account',
        });
      }
    });

    // Overall status
    if (results.materialBreaks > 0) {
      results.overallStatus = 'RED';
      results.warnings.push(`${results.materialBreaks} material break(s) identified exceeding performance materiality of £${materiality.toLocaleString()}.`);
    } else if (results.totalBreaks > 0 || results.staleItems.length > 0) {
      results.overallStatus = 'AMBER';
      if (results.totalBreaks > 0) results.warnings.push(`${results.totalBreaks} immaterial break(s) — aggregate impact to be assessed against trivial threshold.`);
      if (results.staleItems.length > 0) results.warnings.push(`${results.staleItems.length} reconciling item(s) older than ${STALE_DAYS_THRESHOLD} days — potential write-off or reclassification required.`);
    }

    if (results.unmatchedItems.length > 0) {
      results.warnings.push(`${results.unmatchedItems.length} unmatched sub-ledger balance(s) — completeness risk.`);
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      'GL RECONCILIATION ANALYSIS',
      `Overall Status: [${r.overallStatus}]`,
      `Reconciliation Date: ${r.reconciliationDate}`,
      '',
      `SUMMARY:`,
      `  Accounts reconciled: ${(r.accounts || []).length}`,
      `  Matched / within tolerance: ${(r.accounts || []).filter(a => a.status === 'MATCHED' || a.status === 'WITHIN_TOLERANCE').length}`,
      `  Total breaks: ${r.totalBreaks}`,
      `  Material breaks: ${r.materialBreaks}`,
      `  Stale reconciling items: ${(r.staleItems || []).length}`,
      `  Unmatched sub-ledger items: ${(r.unmatchedItems || []).length}`,
      '',
    ];

    const breaks = (r.accounts || []).filter(a => a.status.startsWith('BREAK'));
    if (breaks.length > 0) {
      lines.push('BREAKS IDENTIFIED:');
      breaks.forEach(b => {
        lines.push(`  ${b.code} ${b.name}: GL £${b.glBalance.toLocaleString()} vs Sub £${b.subLedgerBalance.toLocaleString()} = Diff £${b.difference.toLocaleString()} (${b.diffPct}%) [${b.status}]`);
        if (b.rootCause) lines.push(`    Root cause: ${b.rootCause}`);
      });
      lines.push('');
    }

    if ((r.staleItems || []).length > 0) {
      lines.push('STALE RECONCILING ITEMS (>90 DAYS):');
      r.staleItems.forEach(s => {
        lines.push(`  ${s.account} ${s.accountName}: £${(s.amount || 0).toLocaleString()} — ${s.description || 'No description'}`);
      });
      lines.push('');
    }

    if ((r.warnings || []).length > 0) {
      lines.push('AUDIT ATTENTION POINTS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', 'ISA References: ISA 500, ISA 330, ISA 505');
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = new Set();
    (results?.accounts || []).filter(a => a.status.startsWith('BREAK')).forEach(a => {
      if (a.fsli) sections.add(a.fsli);
    });
    if (results?.materialBreaks > 0) sections.add('audit_differences');
    return [...sections];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'GL Reconciliation',
      isaReference: 'ISA 500 / ISA 330',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Reconciliation Summary',
          columns: ['Account Code', 'Account Name', 'FSLI', 'GL Balance (£)', 'Sub-Ledger (£)', 'Difference (£)', 'Diff %', 'Status', 'Root Cause'],
          rows: (r.accounts || []).map(a => [a.code, a.name, a.fsli, a.glBalance, a.subLedgerBalance, a.difference, `${a.diffPct}%`, a.status, a.rootCause || '']),
        },
        {
          title: 'Stale Reconciling Items',
          columns: ['Account', 'Description', 'Amount (£)', 'Date', 'Days Outstanding'],
          rows: (r.staleItems || []).map(s => [s.account, s.description, s.amount, s.date, s.daysOutstanding]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

function _inferFSLI(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('revenue') || n.includes('sales') || n.includes('turnover')) return 'revenue';
  if (n.includes('trade debtor') || n.includes('receivable')) return 'trade_debtors';
  if (n.includes('trade creditor') || n.includes('payable')) return 'trade_creditors';
  if (n.includes('cash') || n.includes('bank')) return 'cash_bank';
  if (n.includes('stock') || n.includes('inventory')) return 'inventory';
  if (n.includes('ppe') || n.includes('fixed asset') || n.includes('property')) return 'ppe';
  if (n.includes('loan') || n.includes('borrowing')) return 'borrowings';
  if (n.includes('tax') || n.includes('vat') || n.includes('corporation')) return 'taxation';
  if (n.includes('wage') || n.includes('salary') || n.includes('payroll')) return 'payroll';
  return 'other';
}

function _inferRootCause(difference, reconItems, account) {
  if (reconItems.length === 0) return 'No reconciling items provided — unexplained difference.';
  const reconTotal = reconItems.reduce((s, i) => s + (i.amount || 0), 0);
  const residual = Math.abs(difference - reconTotal);
  if (residual < 1) return 'Reconciling items fully explain the difference.';
  if (residual < Math.abs(difference) * 0.1) return `Reconciling items explain most of the difference. Residual: £${_round(residual, 2).toLocaleString()}.`;
  return `Reconciling items total £${_round(reconTotal, 2).toLocaleString()} but GL difference is £${_round(difference, 2).toLocaleString()} — £${_round(residual, 2).toLocaleString()} unexplained.`;
}

function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
