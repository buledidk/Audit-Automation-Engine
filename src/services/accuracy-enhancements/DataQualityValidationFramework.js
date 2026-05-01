/**
 * ENHANCEMENT #8: DATA QUALITY VALIDATION FRAMEWORK
 * ==================================================
 * Pre-analysis validation gates. Prevents garbage-in-garbage-out.
 */

export class DataQualityValidationFramework {
  constructor() {
    this.validationRules = this._initializeRules();
  }

  async validateAll(auditData) {
    const results = {
      score: 1.0,
      issues: [],
      completeness: {},
      consistency: {},
      reasonableness: {},
      format: {},
      overallStatus: 'PASS'
    };

    results.completeness = await this._validateCompleteness(auditData);
    results.consistency = await this._validateConsistency(auditData);
    results.reasonableness = await this._validateReasonableness(auditData);
    results.format = await this._validateFormat(auditData);

    // Calculate data quality score
    const scores = [
      results.completeness.score || 1.0,
      results.consistency.score || 1.0,
      results.reasonableness.score || 1.0,
      results.format.score || 1.0
    ];
    results.score = scores.reduce((a, b) => a + b) / scores.length;

    // Collect all issues
    results.issues = [
      ...(results.completeness.issues || []),
      ...(results.consistency.issues || []),
      ...(results.reasonableness.issues || []),
      ...(results.format.issues || [])
    ];

    results.overallStatus = results.score > 0.85 ? 'PASS' : results.score > 0.7 ? 'WARNING' : 'FAIL';

    return results;
  }

  async _validateCompleteness(auditData) {
    const result = { score: 1.0, issues: [] };

    if (!auditData.accounts || auditData.accounts.length === 0) {
      result.issues.push('No accounts provided');
      result.score -= 0.25;
    }

    if (!auditData.transactions || auditData.transactions.length === 0) {
      result.issues.push('No transactions provided');
      result.score -= 0.25;
    }

    auditData.accounts?.forEach((acc, idx) => {
      if (!acc.code) {
        result.issues.push(`Account ${idx}: Missing account code`);
        result.score -= 0.05;
      }
      if (acc.balance === undefined || acc.balance === null) {
        result.issues.push(`Account ${acc.code}: Missing balance`);
        result.score -= 0.05;
      }
    });

    return { ...result, score: Math.max(0, result.score) };
  }

  async _validateConsistency(auditData) {
    const result = { score: 1.0, issues: [] };

    if (auditData.accounts && auditData.transactions) {
      const accountCodes = new Set(auditData.accounts.map(a => a.code));
      auditData.transactions.forEach(t => {
        if (t.accountCode && !accountCodes.has(t.accountCode)) {
          result.issues.push(`Transaction references non-existent account: ${t.accountCode}`);
          result.score -= 0.02;
        }
      });
    }

    if (auditData.accounts) {
      const totalAssets = auditData.accounts
        .filter(a => a.type === 'ASSET')
        .reduce((sum, a) => sum + (a.balance || 0), 0);

      const totalLiabilitiesEquity = auditData.accounts
        .filter(a => ['LIABILITY', 'EQUITY'].includes(a.type))
        .reduce((sum, a) => sum + (a.balance || 0), 0);

      if (Math.abs(totalAssets - totalLiabilitiesEquity) > 1) {
        result.issues.push(`Balance sheet does not balance: Assets ${totalAssets} vs L&E ${totalLiabilitiesEquity}`);
        result.score -= 0.20;
      }
    }

    return { ...result, score: Math.max(0, result.score) };
  }

  async _validateReasonableness(auditData) {
    const result = { score: 1.0, issues: [] };

    auditData.accounts?.forEach(acc => {
      // Negative asset balances
      if (acc.type === 'ASSET' && acc.balance < 0) {
        result.issues.push(`${acc.code}: Asset has negative balance ${acc.balance}`);
        result.score -= 0.05;
      }

      // Unreasonable values
      if (Math.abs(acc.balance) > 1000000000) {
        result.issues.push(`${acc.code}: Balance appears unusually large: ${acc.balance}`);
        result.score -= 0.03;
      }
    });

    auditData.transactions?.forEach(t => {
      // Future dated transactions
      if (new Date(t.date) > new Date()) {
        result.issues.push(`Transaction ${t.id}: Future dated transaction`);
        result.score -= 0.02;
      }

      // Unusually large amounts
      if (Math.abs(t.amount) > 100000000) {
        result.issues.push(`Transaction ${t.id}: Amount ${t.amount} appears unusually large`);
        result.score -= 0.02;
      }
    });

    return { ...result, score: Math.max(0, result.score) };
  }

  async _validateFormat(auditData) {
    const result = { score: 1.0, issues: [] };

    auditData.accounts?.forEach(acc => {
      if (acc.balance !== null && typeof acc.balance !== 'number') {
        result.issues.push(`${acc.code}: Balance is not numeric`);
        result.score -= 0.05;
      }

      if (acc.code && typeof acc.code !== 'string') {
        result.issues.push(`Account code is not a string`);
        result.score -= 0.05;
      }
    });

    auditData.transactions?.forEach(t => {
      if (!t.date || isNaN(new Date(t.date))) {
        result.issues.push(`Transaction ${t.id}: Invalid date format`);
        result.score -= 0.02;
      }

      if (typeof t.amount !== 'number') {
        result.issues.push(`Transaction ${t.id}: Amount is not numeric`);
        result.score -= 0.02;
      }
    });

    return { ...result, score: Math.max(0, result.score) };
  }

  _initializeRules() {
    return {
      required: ['accounts', 'transactions'],
      formats: {
        date: /^\d{4}-\d{2}-\d{2}$/,
        amount: /^-?\d+(\.\d{2})?$/,
        code: /^[A-Z0-9\-]+$/
      }
    };
  }
}

export default DataQualityValidationFramework;
