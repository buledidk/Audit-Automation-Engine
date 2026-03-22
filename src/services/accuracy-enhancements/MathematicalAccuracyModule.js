/**
 * MATHEMATICAL ACCURACY MODULE (ISA 330)
 * Pure computation — no AI calls.
 * Provides recalculation, cross-footing, trial balance validation,
 * and formula verification for audit substantive procedures.
 */

export class MathematicalAccuracyModule {
  constructor() {
    this.checksPerformed = 0;
  }

  /**
   * Validate trial balance — debits must equal credits (ISA 330 casting check).
   * @param {Array<{account: string, debit: number, credit: number}>} tbData
   * @returns {{balanced: boolean, debitTotal: number, creditTotal: number, difference: number, castingErrors: Array}}
   */
  validateTrialBalance(tbData) {
    this.checksPerformed++;

    if (!Array.isArray(tbData) || tbData.length === 0) {
      return { balanced: false, debitTotal: 0, creditTotal: 0, difference: 0, castingErrors: [{ error: 'No trial balance data provided' }] };
    }

    const castingErrors = [];
    let debitTotal = 0;
    let creditTotal = 0;

    for (let i = 0; i < tbData.length; i++) {
      const line = tbData[i];
      const debit = Number(line.debit) || 0;
      const credit = Number(line.credit) || 0;

      // Flag lines where both debit and credit are non-zero
      if (debit > 0 && credit > 0) {
        castingErrors.push({
          line: i + 1,
          account: line.account,
          error: 'Both debit and credit are non-zero',
          debit,
          credit,
        });
      }

      // Flag negative values
      if (debit < 0 || credit < 0) {
        castingErrors.push({
          line: i + 1,
          account: line.account,
          error: 'Negative value detected',
          debit,
          credit,
        });
      }

      debitTotal += debit;
      creditTotal += credit;
    }

    // Round to 2 decimal places to avoid floating-point issues
    debitTotal = Math.round(debitTotal * 100) / 100;
    creditTotal = Math.round(creditTotal * 100) / 100;
    const difference = Math.round((debitTotal - creditTotal) * 100) / 100;

    return {
      balanced: Math.abs(difference) < 0.01,
      debitTotal,
      creditTotal,
      difference,
      castingErrors,
      lineCount: tbData.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Cross-foot a schedule — validate that row totals and column totals agree.
   * @param {Object} scheduleData - { rows: [{label, values: [number], total: number}], columnTotals: [number], grandTotal: number }
   * @returns {{valid: boolean, errors: Array, totalChecked: number}}
   */
  crossFootSchedule(scheduleData) {
    this.checksPerformed++;

    const errors = [];
    let totalChecked = 0;
    const { rows = [], columnTotals = [], grandTotal } = scheduleData;

    // 1. Validate each row total
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const computedTotal = (row.values || []).reduce((sum, v) => sum + (Number(v) || 0), 0);
      const rounded = Math.round(computedTotal * 100) / 100;
      const expected = Math.round((Number(row.total) || 0) * 100) / 100;
      totalChecked++;

      if (Math.abs(rounded - expected) >= 0.01) {
        errors.push({
          type: 'row_total_mismatch',
          row: i + 1,
          label: row.label,
          expected,
          computed: rounded,
          difference: Math.round((expected - rounded) * 100) / 100,
        });
      }
    }

    // 2. Validate column totals
    if (columnTotals.length > 0 && rows.length > 0) {
      const colCount = Math.max(columnTotals.length, ...rows.map(r => (r.values || []).length));
      for (let c = 0; c < colCount; c++) {
        const computedColTotal = rows.reduce((sum, row) => sum + (Number((row.values || [])[c]) || 0), 0);
        const rounded = Math.round(computedColTotal * 100) / 100;
        const expected = Math.round((Number(columnTotals[c]) || 0) * 100) / 100;
        totalChecked++;

        if (Math.abs(rounded - expected) >= 0.01) {
          errors.push({
            type: 'column_total_mismatch',
            column: c + 1,
            expected,
            computed: rounded,
            difference: Math.round((expected - rounded) * 100) / 100,
          });
        }
      }
    }

    // 3. Validate grand total
    if (grandTotal !== undefined) {
      const computedGrand = rows.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
      const rounded = Math.round(computedGrand * 100) / 100;
      const expected = Math.round(Number(grandTotal) * 100) / 100;
      totalChecked++;

      if (Math.abs(rounded - expected) >= 0.01) {
        errors.push({
          type: 'grand_total_mismatch',
          expected,
          computed: rounded,
          difference: Math.round((expected - rounded) * 100) / 100,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      totalChecked,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate formula results — recompute each formula and compare.
   * @param {Array<{id: string, formula: string, inputs: Object, expectedResult: number}>} formulaData
   * @returns {{results: Array, accuracyPercent: number}}
   */
  validateFormulas(formulaData) {
    this.checksPerformed++;

    if (!Array.isArray(formulaData) || formulaData.length === 0) {
      return { results: [], accuracyPercent: 100 };
    }

    const results = [];
    let correct = 0;

    for (const item of formulaData) {
      const computed = this._evaluateFormula(item.formula, item.inputs || {});
      const expected = Number(item.expectedResult) || 0;
      const match = Math.abs(computed - expected) < 0.01;
      if (match) correct++;

      results.push({
        id: item.id,
        formula: item.formula,
        expected,
        computed: Math.round(computed * 100) / 100,
        match,
        variance: Math.round((computed - expected) * 100) / 100,
      });
    }

    return {
      results,
      accuracyPercent: Math.round((correct / formulaData.length) * 10000) / 100,
      totalFormulas: formulaData.length,
      correctCount: correct,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Recalculate line item totals and flag variances.
   * @param {Array<{id: string, description: string, quantity: number, unitPrice: number, total: number}>} lineItems
   * @returns {{recalculated: Array, varianceFlags: Array}}
   */
  recalculateTotals(lineItems) {
    this.checksPerformed++;

    if (!Array.isArray(lineItems)) {
      return { recalculated: [], varianceFlags: [] };
    }

    const recalculated = [];
    const varianceFlags = [];

    for (const item of lineItems) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const expected = Number(item.total) || 0;
      const computed = Math.round(qty * price * 100) / 100;
      const variance = Math.round((expected - computed) * 100) / 100;

      recalculated.push({
        id: item.id,
        description: item.description,
        quantity: qty,
        unitPrice: price,
        expectedTotal: expected,
        computedTotal: computed,
        variance,
        accurate: Math.abs(variance) < 0.01,
      });

      if (Math.abs(variance) >= 0.01) {
        varianceFlags.push({
          id: item.id,
          description: item.description,
          variance,
          percentVariance: expected !== 0 ? Math.round((variance / expected) * 10000) / 100 : null,
          severity: Math.abs(variance) > 1000 ? 'HIGH' : Math.abs(variance) > 100 ? 'MEDIUM' : 'LOW',
        });
      }
    }

    return {
      recalculated,
      varianceFlags,
      totalItems: lineItems.length,
      accurateCount: lineItems.length - varianceFlags.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Evaluate a simple formula string with variable substitution.
   * Supports: +, -, *, /, parentheses, and named variables.
   * @private
   */
  _evaluateFormula(formula, inputs) {
    if (!formula) return 0;
    try {
      let expr = formula;
      for (const [key, value] of Object.entries(inputs)) {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), String(Number(value) || 0));
      }
      // Only allow numbers, operators, parentheses, decimal points, and spaces
      if (!/^[\d\s+\-*/().]+$/.test(expr)) {
        return 0;
      }
      // eslint-disable-next-line no-new-func
      return new Function(`return (${expr})`)();
    } catch {
      return 0;
    }
  }

  getMetrics() {
    return {
      module: 'MathematicalAccuracy',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 330',
      aiRequired: false,
    };
  }
}

export default new MathematicalAccuracyModule();
