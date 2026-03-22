/**
 * DATA QUALITY MODULE
 * Pure computation — no AI calls.
 * Detects duplicates, assesses completeness, checks consistency,
 * identifies outliers, and computes an overall data quality score.
 */

export class DataQualityModule {
  constructor() {
    this.checksPerformed = 0;
  }

  /**
   * Detect duplicate transactions based on key fields.
   * @param {Array<Object>} transactions
   * @param {Array<string>} [keyFields] - Fields to match for duplicates (default: all fields)
   * @returns {{duplicates: Array, duplicateRate: number, totalScanned: number}}
   */
  detectDuplicates(transactions, keyFields) {
    this.checksPerformed++;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { duplicates: [], duplicateRate: 0, totalScanned: 0 };
    }

    const seen = new Map();
    const duplicates = [];

    for (let i = 0; i < transactions.length; i++) {
      const txn = transactions[i];
      const key = keyFields
        ? keyFields.map(f => String(txn[f] ?? '')).join('|')
        : JSON.stringify(txn);

      if (seen.has(key)) {
        duplicates.push({
          index: i,
          originalIndex: seen.get(key),
          transaction: txn,
          matchKey: key,
        });
      } else {
        seen.set(key, i);
      }
    }

    return {
      duplicates,
      duplicateRate: Math.round((duplicates.length / transactions.length) * 10000) / 100,
      totalScanned: transactions.length,
      uniqueCount: seen.size,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Assess completeness of a dataset against an expected schema.
   * @param {Array<Object>} dataset
   * @param {Array<string>} expectedSchema - Required field names
   * @returns {{completeness: number, missingFields: Array, recordCompleteness: Array}}
   */
  assessCompleteness(dataset, expectedSchema) {
    this.checksPerformed++;

    if (!Array.isArray(dataset) || dataset.length === 0 || !Array.isArray(expectedSchema)) {
      return { completeness: 0, missingFields: [], recordCompleteness: [] };
    }

    let totalFields = 0;
    let presentFields = 0;
    const fieldMissing = {};
    const recordCompleteness = [];

    for (const field of expectedSchema) {
      fieldMissing[field] = 0;
    }

    for (let i = 0; i < dataset.length; i++) {
      const record = dataset[i];
      let recordPresent = 0;

      for (const field of expectedSchema) {
        totalFields++;
        const value = record[field];
        const isPresent = value !== undefined && value !== null && value !== '';
        if (isPresent) {
          presentFields++;
          recordPresent++;
        } else {
          fieldMissing[field]++;
        }
      }

      recordCompleteness.push({
        index: i,
        completeness: Math.round((recordPresent / expectedSchema.length) * 10000) / 100,
        missingCount: expectedSchema.length - recordPresent,
      });
    }

    const missingFields = expectedSchema
      .filter(f => fieldMissing[f] > 0)
      .map(f => ({
        field: f,
        missingCount: fieldMissing[f],
        missingRate: Math.round((fieldMissing[f] / dataset.length) * 10000) / 100,
      }));

    return {
      completeness: totalFields > 0 ? Math.round((presentFields / totalFields) * 10000) / 100 : 0,
      missingFields,
      recordCompleteness,
      totalRecords: dataset.length,
      totalFieldsChecked: totalFields,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check data consistency against defined rules.
   * @param {Array<Object>} dataset
   * @param {Array<{name: string, field: string, rule: string, value?: any, min?: number, max?: number}>} rules
   * @returns {{consistent: boolean, violations: Array, consistencyScore: number}}
   */
  checkConsistency(dataset, rules) {
    this.checksPerformed++;

    if (!Array.isArray(dataset) || !Array.isArray(rules)) {
      return { consistent: true, violations: [], consistencyScore: 100 };
    }

    const violations = [];
    let totalChecks = 0;
    let passedChecks = 0;

    for (let i = 0; i < dataset.length; i++) {
      const record = dataset[i];
      for (const rule of rules) {
        totalChecks++;
        const value = record[rule.field];
        let passed = true;

        switch (rule.rule) {
          case 'required':
            passed = value !== undefined && value !== null && value !== '';
            break;
          case 'positive':
            passed = Number(value) > 0;
            break;
          case 'non_negative':
            passed = Number(value) >= 0;
            break;
          case 'range':
            passed = Number(value) >= (rule.min ?? -Infinity) && Number(value) <= (rule.max ?? Infinity);
            break;
          case 'equals':
            passed = value === rule.value;
            break;
          case 'type_number':
            passed = !isNaN(Number(value));
            break;
          case 'type_date':
            passed = !isNaN(Date.parse(value));
            break;
          default:
            passed = true;
        }

        if (passed) {
          passedChecks++;
        } else {
          violations.push({
            recordIndex: i,
            field: rule.field,
            rule: rule.name || rule.rule,
            value,
            expected: rule.value ?? (rule.min !== undefined ? `${rule.min}-${rule.max}` : rule.rule),
          });
        }
      }
    }

    return {
      consistent: violations.length === 0,
      violations,
      consistencyScore: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 10000) / 100 : 100,
      totalChecks,
      passedChecks,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate an overall data quality score (0-100) across multiple dimensions.
   * @param {Array<Object>} dataset
   * @param {Object} [options] - { expectedSchema?: string[], rules?: Array, keyFields?: string[] }
   * @returns {{overallScore: number, dimensions: Object, recommendations: Array}}
   */
  calculateDataQualityScore(dataset, options = {}) {
    this.checksPerformed++;

    if (!Array.isArray(dataset) || dataset.length === 0) {
      return {
        overallScore: 0,
        dimensions: {},
        recommendations: ['No data provided for quality assessment'],
      };
    }

    const dimensions = {};
    const recommendations = [];

    // Completeness dimension
    if (options.expectedSchema) {
      const completeness = this.assessCompleteness(dataset, options.expectedSchema);
      dimensions.completeness = completeness.completeness;
      if (completeness.completeness < 95) {
        recommendations.push(`Completeness is ${completeness.completeness}% — investigate ${completeness.missingFields.length} fields with missing data`);
      }
    }

    // Uniqueness dimension (duplicates)
    const dupes = this.detectDuplicates(dataset, options.keyFields);
    dimensions.uniqueness = Math.round((1 - dupes.duplicateRate / 100) * 10000) / 100;
    if (dupes.duplicates.length > 0) {
      recommendations.push(`${dupes.duplicates.length} duplicate records found (${dupes.duplicateRate}% rate) — review and reconcile`);
    }

    // Consistency dimension
    if (options.rules) {
      const consistency = this.checkConsistency(dataset, options.rules);
      dimensions.consistency = consistency.consistencyScore;
      if (consistency.violations.length > 0) {
        recommendations.push(`${consistency.violations.length} consistency violations found — review data entry controls`);
      }
    }

    // Validity dimension — check for obviously invalid data
    let validRecords = 0;
    for (const record of dataset) {
      const values = Object.values(record);
      const hasContent = values.some(v => v !== undefined && v !== null && v !== '');
      if (hasContent) validRecords++;
    }
    dimensions.validity = Math.round((validRecords / dataset.length) * 10000) / 100;

    // Calculate overall weighted score
    const weights = { completeness: 0.3, uniqueness: 0.25, consistency: 0.25, validity: 0.2 };
    let weightedSum = 0;
    let weightTotal = 0;
    for (const [dim, weight] of Object.entries(weights)) {
      if (dimensions[dim] !== undefined) {
        weightedSum += dimensions[dim] * weight;
        weightTotal += weight;
      }
    }
    const overallScore = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 100) / 100 : 0;

    if (overallScore >= 95) {
      recommendations.push('Data quality is excellent — proceed with audit testing');
    } else if (overallScore >= 80) {
      recommendations.push('Data quality is acceptable — note identified issues in working papers');
    } else {
      recommendations.push('Data quality is below threshold — consider expanding substantive testing');
    }

    return {
      overallScore,
      dimensions,
      recommendations,
      recordCount: dataset.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Detect outliers using IQR or Z-score method.
   * @param {Array<number>} values
   * @param {string} [method='iqr'] - 'iqr' or 'zscore'
   * @param {number} [threshold=1.5] - IQR multiplier (default 1.5) or Z-score threshold (default 3)
   * @returns {{outliers: Array, method: string, threshold: number, stats: Object}}
   */
  detectOutliers(values, method = 'iqr', threshold) {
    this.checksPerformed++;

    if (!Array.isArray(values) || values.length === 0) {
      return { outliers: [], method, threshold: threshold || (method === 'zscore' ? 3 : 1.5), stats: {} };
    }

    const nums = values.map(Number).filter(n => !isNaN(n));
    const sorted = [...nums].sort((a, b) => a - b);
    const n = sorted.length;

    const mean = nums.reduce((s, v) => s + v, 0) / n;
    const stdDev = Math.sqrt(nums.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    let outliers = [];

    if (method === 'zscore') {
      const zThreshold = threshold || 3;
      outliers = nums
        .map((v, i) => ({ index: i, value: v, zScore: stdDev > 0 ? Math.round(((v - mean) / stdDev) * 100) / 100 : 0 }))
        .filter(item => Math.abs(item.zScore) > zThreshold);
      threshold = zThreshold;
    } else {
      // IQR method
      const iqrThreshold = threshold || 1.5;
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - iqrThreshold * iqr;
      const upperBound = q3 + iqrThreshold * iqr;

      outliers = nums
        .map((v, i) => ({ index: i, value: v, bound: v < lowerBound ? 'below' : 'above' }))
        .filter(item => item.value < lowerBound || item.value > upperBound);
      threshold = iqrThreshold;
    }

    return {
      outliers,
      method,
      threshold,
      stats: {
        count: n,
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
        min: sorted[0],
        max: sorted[n - 1],
      },
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    return {
      module: 'DataQuality',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      aiRequired: false,
    };
  }
}

export default new DataQualityModule();
