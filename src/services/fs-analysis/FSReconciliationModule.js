/**
 * FINANCIAL STATEMENT RECONCILIATION MODULE
 * Pure computation — no AI calls.
 * Validates internal consistency: balance sheet equation, equity movement,
 * cash flow reconciliation, note-to-face agreement, and schedule casting.
 *
 * Framework: IAS 1.40A, IAS 7, FRS 102 Sections 3-7
 * ISA: ISA 330.20-21, ISA 520.5
 */

export class FSReconciliationModule {
  constructor() {
    this.checksPerformed = 0;
  }

  /**
   * Validate balance sheet: Assets = Liabilities + Equity.
   * Also validates sub-totals (current/non-current splits).
   * @param {Object} balanceSheet
   * @returns {{balanced: boolean, assetsTotal: number, liabilitiesAndEquityTotal: number, difference: number, castingErrors: Array}}
   */
  validateBalanceSheetEquation(balanceSheet) {
    this.checksPerformed++;
    if (!balanceSheet) return { balanced: false, assetsTotal: 0, liabilitiesAndEquityTotal: 0, difference: 0, castingErrors: ['No balance sheet data'] };

    const errors = [];
    const assets = balanceSheet.assets || {};
    const liabilities = balanceSheet.liabilities || {};
    const equity = balanceSheet.equity || {};

    // Calculate asset totals
    const currentAssets = Number(assets.current) || 0;
    const nonCurrentAssets = Number(assets.nonCurrent) || 0;
    const computedAssetsTotal = Math.round((currentAssets + nonCurrentAssets) * 100) / 100;
    const statedAssetsTotal = Number(assets.total) || computedAssetsTotal;

    if (Math.abs(computedAssetsTotal - statedAssetsTotal) >= 0.01 && assets.total !== undefined) {
      errors.push({ type: 'asset_subtotal', expected: computedAssetsTotal, stated: statedAssetsTotal, difference: Math.round((statedAssetsTotal - computedAssetsTotal) * 100) / 100 });
    }

    // Calculate liability totals
    const currentLiabilities = Number(liabilities.current) || 0;
    const nonCurrentLiabilities = Number(liabilities.nonCurrent) || 0;
    const computedLiabilitiesTotal = Math.round((currentLiabilities + nonCurrentLiabilities) * 100) / 100;
    const statedLiabilitiesTotal = Number(liabilities.total) || computedLiabilitiesTotal;

    if (Math.abs(computedLiabilitiesTotal - statedLiabilitiesTotal) >= 0.01 && liabilities.total !== undefined) {
      errors.push({ type: 'liability_subtotal', expected: computedLiabilitiesTotal, stated: statedLiabilitiesTotal, difference: Math.round((statedLiabilitiesTotal - computedLiabilitiesTotal) * 100) / 100 });
    }

    // Equity total
    const equityTotal = Number(equity.total) || 0;
    const equityComponents = equity.components || {};
    if (Object.keys(equityComponents).length > 0) {
      const computedEquity = Math.round(Object.values(equityComponents).reduce((s, v) => s + (Number(v) || 0), 0) * 100) / 100;
      if (Math.abs(computedEquity - equityTotal) >= 0.01) {
        errors.push({ type: 'equity_subtotal', expected: computedEquity, stated: equityTotal, difference: Math.round((equityTotal - computedEquity) * 100) / 100 });
      }
    }

    // Main equation
    const assetsTotal = statedAssetsTotal;
    const liabilitiesAndEquityTotal = Math.round((statedLiabilitiesTotal + equityTotal) * 100) / 100;
    const difference = Math.round((assetsTotal - liabilitiesAndEquityTotal) * 100) / 100;

    return {
      balanced: Math.abs(difference) < 0.01,
      assetsTotal: Math.round(assetsTotal * 100) / 100,
      liabilitiesAndEquityTotal,
      difference,
      castingErrors: errors,
      breakdown: { currentAssets, nonCurrentAssets, currentLiabilities, nonCurrentLiabilities, equityTotal },
      isaReference: 'ISA 520',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Reconcile profit/loss to equity movement (retained earnings).
   * @param {Object} data - { openingEquity, profitForYear, otherComprehensiveIncome, dividends, otherMovements, closingEquity }
   * @returns {{reconciled: boolean, expectedClosing: number, actualClosing: number, difference: number, movementSchedule: Array}}
   */
  reconcileEquityMovement(data) {
    this.checksPerformed++;
    if (!data) return { reconciled: false, expectedClosing: 0, actualClosing: 0, difference: 0, movementSchedule: [] };

    const opening = Number(data.openingEquity) || 0;
    const profit = Number(data.profitForYear) || 0;
    const oci = Number(data.otherComprehensiveIncome) || 0;
    const dividends = Number(data.dividends) || 0;
    const other = Number(data.otherMovements) || 0;
    const closingStated = Number(data.closingEquity) || 0;

    const expectedClosing = Math.round((opening + profit + oci - dividends + other) * 100) / 100;
    const difference = Math.round((closingStated - expectedClosing) * 100) / 100;

    const movementSchedule = [
      { item: 'Opening equity', amount: opening },
      { item: 'Profit for the year', amount: profit },
      { item: 'Other comprehensive income', amount: oci },
      { item: 'Dividends', amount: -dividends },
      { item: 'Other movements', amount: other },
      { item: 'Expected closing', amount: expectedClosing },
      { item: 'Stated closing', amount: closingStated },
      { item: 'Difference', amount: difference },
    ];

    return {
      reconciled: Math.abs(difference) < 0.01,
      expectedClosing,
      actualClosing: closingStated,
      difference,
      movementSchedule,
      isaReference: 'IAS 1.40A',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate cash flow statement: Opening + Net activities = Closing.
   * @param {Object} cashFlow - { openingCash, operating, investing, financing, fxEffects, closingCash }
   * @returns {{reconciled: boolean, computedClosing: number, statedClosing: number, difference: number}}
   */
  reconcileCashFlowStatement(cashFlow) {
    this.checksPerformed++;
    if (!cashFlow) return { reconciled: false, computedClosing: 0, statedClosing: 0, difference: 0 };

    const opening = Number(cashFlow.openingCash) || 0;
    const operating = Number(cashFlow.operating) || 0;
    const investing = Number(cashFlow.investing) || 0;
    const financing = Number(cashFlow.financing) || 0;
    const fx = Number(cashFlow.fxEffects) || 0;
    const closingStated = Number(cashFlow.closingCash) || 0;

    const computedClosing = Math.round((opening + operating + investing + financing + fx) * 100) / 100;
    const difference = Math.round((closingStated - computedClosing) * 100) / 100;

    return {
      reconciled: Math.abs(difference) < 0.01,
      computedClosing,
      statedClosing: closingStated,
      difference,
      breakdown: { opening, operating, investing, financing, fx },
      netMovement: Math.round((operating + investing + financing + fx) * 100) / 100,
      isaReference: 'IAS 7',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verify note figures agree to face of financial statements.
   * @param {Array<{lineItem: string, amount: number, noteRef: string}>} faceAmounts
   * @param {Object} noteDetails - { noteNumber: { total, breakdown?: Array } }
   * @returns {{matched: Array, mismatched: Array, missingNotes: Array, accuracy: number}}
   */
  reconcileNotesToFace(faceAmounts, noteDetails = {}) {
    this.checksPerformed++;
    if (!Array.isArray(faceAmounts)) return { matched: [], mismatched: [], missingNotes: [], accuracy: 100 };

    const matched = [];
    const mismatched = [];
    const missingNotes = [];

    for (const face of faceAmounts) {
      const noteKey = String(face.noteRef);
      const note = noteDetails[noteKey];

      if (!note) {
        missingNotes.push({ lineItem: face.lineItem, noteRef: noteKey, faceAmount: face.amount });
        continue;
      }

      const noteTotal = Number(note.total) || 0;
      const faceAmt = Number(face.amount) || 0;
      const diff = Math.round((faceAmt - noteTotal) * 100) / 100;

      if (Math.abs(diff) < 0.01) {
        matched.push({ lineItem: face.lineItem, noteRef: noteKey, amount: faceAmt });
      } else {
        mismatched.push({
          lineItem: face.lineItem,
          noteRef: noteKey,
          faceAmount: faceAmt,
          noteTotal,
          difference: diff,
          severity: Math.abs(diff) > 10000 ? 'HIGH' : Math.abs(diff) > 1000 ? 'MEDIUM' : 'LOW',
        });
      }
    }

    const total = matched.length + mismatched.length;
    return {
      matched,
      mismatched,
      missingNotes,
      accuracy: total > 0 ? Math.round((matched.length / total) * 10000) / 100 : 100,
      summary: { total: faceAmounts.length, matched: matched.length, mismatched: mismatched.length, missing: missingNotes.length },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Cast and cross-foot all schedules and supporting notes.
   * @param {Array<{id: string, rows: Array<{label: string, values: number[], total: number}>, columnTotals?: number[], grandTotal?: number}>} schedules
   * @returns {{results: Array, overallAccuracy: number}}
   */
  castAllSchedules(schedules) {
    this.checksPerformed++;
    if (!Array.isArray(schedules)) return { results: [], overallAccuracy: 100 };

    const results = [];
    let totalChecks = 0;
    let passedChecks = 0;

    for (const schedule of schedules) {
      const errors = [];

      // Check each row total
      for (let i = 0; i < (schedule.rows || []).length; i++) {
        const row = schedule.rows[i];
        if (row.values && row.total !== undefined) {
          const computed = Math.round(row.values.reduce((s, v) => s + (Number(v) || 0), 0) * 100) / 100;
          const stated = Math.round(Number(row.total) * 100) / 100;
          totalChecks++;
          if (Math.abs(computed - stated) < 0.01) { passedChecks++; }
          else { errors.push({ type: 'row', row: i + 1, label: row.label, computed, stated, diff: Math.round((stated - computed) * 100) / 100 }); }
        }
      }

      // Check column totals
      if (schedule.columnTotals) {
        for (let c = 0; c < schedule.columnTotals.length; c++) {
          const computed = Math.round((schedule.rows || []).reduce((s, row) => s + (Number((row.values || [])[c]) || 0), 0) * 100) / 100;
          const stated = Math.round(Number(schedule.columnTotals[c]) * 100) / 100;
          totalChecks++;
          if (Math.abs(computed - stated) < 0.01) { passedChecks++; }
          else { errors.push({ type: 'column', column: c + 1, computed, stated, diff: Math.round((stated - computed) * 100) / 100 }); }
        }
      }

      // Check grand total
      if (schedule.grandTotal !== undefined) {
        const computed = Math.round((schedule.rows || []).reduce((s, row) => s + (Number(row.total) || 0), 0) * 100) / 100;
        const stated = Math.round(Number(schedule.grandTotal) * 100) / 100;
        totalChecks++;
        if (Math.abs(computed - stated) < 0.01) { passedChecks++; }
        else { errors.push({ type: 'grand_total', computed, stated, diff: Math.round((stated - computed) * 100) / 100 }); }
      }

      results.push({ id: schedule.id, valid: errors.length === 0, errors, checksRun: totalChecks });
    }

    return {
      results,
      overallAccuracy: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 10000) / 100 : 100,
      totalSchedules: schedules.length,
      totalChecks,
      passedChecks,
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    return {
      module: 'FSReconciliation',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 330/520',
      aiRequired: false,
    };
  }
}

export default new FSReconciliationModule();
