/**
 * Data Snipping Engine — ISA 530 compliant sampling and population analysis
 * Full-population testing (Inflo-style: 100% of transactions)
 * Benford's Law, anomaly detection, period comparison, stratification
 */

// ─── Constants ─────────────────────────────────────────────────────────────

const BENFORD_EXPECTED = [null, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
const CONFIDENCE_FACTORS = { 90: 2.31, 95: 2.6, 99: 3.0 };

// ─── extractSample ─────────────────────────────────────────────────────────

/**
 * ISA 530-compliant sample selection
 * @param {Array}  population  array of objects
 * @param {number} sampleSize
 * @param {'random'|'systematic'|'stratified'|'monetary_unit'} method
 * @param {Object} options     { field, confidence, tolerableMisstatement, expectedMisstatement }
 */
export function extractSample(population, sampleSize, method = 'random', options = {}) {
  const { field = 'amount', confidence = 95, tolerableMisstatement, _expectedMisstatement = 0 } = options;
  const n = population.length;

  // ISA 530 sample size formula for MUS
  let calculatedSize = sampleSize;
  if (method === 'monetary_unit' && tolerableMisstatement) {
    const cf        = CONFIDENCE_FACTORS[confidence] || 2.6;
    const bookValue = population.reduce((s, i) => s + Math.abs(i[field] || 0), 0);
    calculatedSize  = Math.ceil((bookValue * cf) / tolerableMisstatement);
    calculatedSize  = Math.min(calculatedSize, n);
  }

  let selectedItems = [];

  if (method === 'random') {
    const shuffled = [...population].sort(() => Math.random() - 0.5);
    selectedItems  = shuffled.slice(0, calculatedSize);

  } else if (method === 'systematic') {
    const interval = Math.floor(n / calculatedSize);
    const start    = Math.floor(Math.random() * interval);
    for (let i = start; i < n && selectedItems.length < calculatedSize; i += interval) {
      selectedItems.push(population[i]);
    }

  } else if (method === 'stratified') {
    const strata    = stratifyData(population, field, null);
    const perStrata = Math.ceil(calculatedSize / strata.strata.length);
    for (const stratum of strata.strata) {
      const shuffled = [...stratum.items].sort(() => Math.random() - 0.5);
      selectedItems.push(...shuffled.slice(0, perStrata));
    }
    selectedItems = selectedItems.slice(0, calculatedSize);

  } else if (method === 'monetary_unit') {
    // Probability proportional to size (PPS) sampling
    const totBookValue = population.reduce((s, i) => s + Math.abs(i[field] || 0), 0);
    const samplingInt  = totBookValue / calculatedSize;
    let cumulativeVal  = 0;
    let nextHit        = Math.random() * samplingInt;

    for (const item of population) {
      cumulativeVal += Math.abs(item[field] || 0);
      if (cumulativeVal >= nextHit) {
        selectedItems.push(item);
        nextHit += samplingInt;
        if (selectedItems.length >= calculatedSize) break;
      }
    }
  }

  const bookValue   = population.reduce((s, i) => s + Math.abs(i[field] || 0), 0);
  const sampleValue = selectedItems.reduce((s, i) => s + Math.abs(i[field] || 0), 0);

  return {
    selectedItems,
    populationSize:   n,
    sampleSize:       calculatedSize,
    method,
    bookValue,
    sampleValue,
    coveragePct:      ((sampleValue / bookValue) * 100).toFixed(1) + '%',
    projectedMisstmt: `Projected misstatement = (Sample misstatements / Sample value) × Population value`,
    isaReference:     'ISA 530',
    notes:            [
      `${method.toUpperCase()} sample of ${calculatedSize} items from population of ${n}`,
      `Sample covers ${((sampleValue / bookValue) * 100).toFixed(1)}% of population value`,
      method === 'monetary_unit' ? `MUS confidence level: ${confidence}%` : '',
    ].filter(Boolean),
  };
}

// ─── analysePopulation ─────────────────────────────────────────────────────

/**
 * Full statistical analysis of a data population (Inflo-style 100% testing)
 * @param {Array}  data   array of objects
 * @param {string} field  numeric field to analyse
 */
export function analysePopulation(data, field = 'amount') {
  const values = data.map(d => Number(d[field] || 0)).filter(v => !isNaN(v));
  if (values.length === 0) return { error: 'No numeric values found' };

  values.sort((a, b) => a - b);
  const n      = values.length;
  const sum    = values.reduce((s, v) => s + v, 0);
  const mean   = sum / n;
  const min    = values[0];
  const max    = values[n - 1];

  // Median
  const median = n % 2 === 0
    ? (values[n / 2 - 1] + values[n / 2]) / 2
    : values[Math.floor(n / 2)];

  // Mode
  const freq   = {};
  values.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const mode    = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);

  // Std Dev
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
  const stddev   = Math.sqrt(variance);

  // Quartiles
  const q1 = values[Math.floor(n * 0.25)];
  const q3 = values[Math.floor(n * 0.75)];

  // Histogram (10 buckets)
  const bucketSize = (max - min) / 10 || 1;
  const histogram  = Array.from({ length: 10 }, (_, i) => ({
    bucket: `${(min + i * bucketSize).toFixed(0)}–${(min + (i + 1) * bucketSize).toFixed(0)}`,
    count:  values.filter(v => v >= min + i * bucketSize && v < min + (i + 1) * bucketSize).length,
  }));

  // Outliers (> 3 std devs from mean)
  const outliers = data.filter(d => Math.abs(Number(d[field] || 0) - mean) > 3 * stddev);

  // Top/Bottom 10
  const sorted   = [...data].sort((a, b) => Number(b[field] || 0) - Number(a[field] || 0));
  const topN     = sorted.slice(0, 10);
  const bottomN  = sorted.slice(-10).reverse();

  // Benford's Law
  const benford  = _benfordsLaw(values);

  return {
    field,
    count:    n,
    sum,
    min,
    max,
    mean:     Number(mean.toFixed(2)),
    median,
    mode,
    stddev:   Number(stddev.toFixed(2)),
    quartiles: { q1, q3, iqr: q3 - q1 },
    histogram,
    outliers,
    outlierCount: outliers.length,
    topN,
    bottomN,
    benford,
    isaReference: 'ISA 530 / ISA 520 (analytical procedures)',
  };
}

function _benfordsLaw(values) {
  const positives    = values.filter(v => v > 0);
  const digitCounts  = Array(10).fill(0);

  for (const v of positives) {
    const firstDigit = parseInt(String(Math.abs(v)).replace('.', '').replace(/^0+/, '')[0]);
    if (firstDigit >= 1 && firstDigit <= 9) digitCounts[firstDigit]++;
  }

  const total  = positives.length || 1;
  const result = [];
  let chiSq    = 0;

  for (let d = 1; d <= 9; d++) {
    const observed = digitCounts[d] / total;
    const expected = BENFORD_EXPECTED[d];
    const deviation = Math.abs(observed - expected);
    chiSq += Math.pow(observed - expected, 2) / expected;
    result.push({ digit: d, observed: Number(observed.toFixed(4)), expected, deviation: Number(deviation.toFixed(4)) });
  }

  // Chi-squared critical value at 8 df, 5% significance: 15.507
  const suspicious = chiSq > 15.507;

  return {
    distribution:    result,
    chiSquared:      Number(chiSq.toFixed(3)),
    criticalValue:   15.507,
    suspicious,
    interpretation:  suspicious
      ? 'Chi-squared exceeds critical value — distribution deviates significantly from Benford\'s Law. Possible manipulation or data anomaly.'
      : 'Distribution conforms to Benford\'s Law — no statistical evidence of manipulation.',
  };
}

// ─── stratifyData ──────────────────────────────────────────────────────────

/**
 * Stratify population by field, with auto-suggest if strata not provided
 */
export function stratifyData(data, field = 'amount', strata = null) {
  const values = data.map(d => Number(d[field] || 0));
  const max    = Math.max(...values);
  const min    = Math.min(...values);

  const autoStrata = strata || _autoStrata(min, max);

  const strataResults = autoStrata.map(s => {
    const items = data.filter(d => {
      const v = Number(d[field] || 0);
      return v >= s.min && (s.max === null ? true : v < s.max);
    });
    const total = items.reduce((sum, d) => sum + Number(d[field] || 0), 0);
    return { ...s, items, count: items.length, total, pct: 0 };
  });

  const grandTotal = strataResults.reduce((s, r) => s + r.total, 0);
  strataResults.forEach(s => { s.pct = ((s.total / grandTotal) * 100).toFixed(1) + '%'; });

  return {
    field,
    strata:     strataResults,
    grandTotal,
    totalItems: data.length,
    autoSuggested: !strata,
  };
}

function _autoStrata(min, max) {
  const range = max - min;
  if (range <= 0) return [{ label: 'All', min, max: null }];
  const breaks = [min, min + range * 0.1, min + range * 0.25, min + range * 0.5, min + range * 0.75, max + 1];
  return breaks.slice(0, -1).map((b, i) => ({
    label: `${b.toFixed(0)}–${breaks[i + 1].toFixed(0)}`,
    min:   b,
    max:   breaks[i + 1],
  }));
}

// ─── comparePeriods ────────────────────────────────────────────────────────

/**
 * Period-over-period comparison with trend analysis
 */
export function comparePeriods(currentData, priorData, keyField = 'account', valueField = 'amount') {
  const currentMap = new Map(currentData.map(d => [d[keyField], d]));
  const priorMap   = new Map(priorData.map(d => [d[keyField], d]));

  const results       = [];
  const newItems      = [];
  const removedItems  = [];
  const flagged       = [];

  for (const [key, curr] of currentMap) {
    const prior = priorMap.get(key);
    if (prior) {
      const currVal  = Number(curr[valueField] || 0);
      const priorVal = Number(prior[valueField] || 0);
      const absDiff  = currVal - priorVal;
      const pctChange = priorVal !== 0 ? ((absDiff / Math.abs(priorVal)) * 100) : (currVal !== 0 ? 100 : 0);
      const trend    = Math.abs(pctChange) <= 5 ? 'stable' : absDiff > 0 ? 'increasing' : 'decreasing';

      const item = { key, current: curr, prior, currentValue: currVal, priorValue: priorVal, absDiff, pctChange: Number(pctChange.toFixed(1)), trend };
      results.push(item);

      if (Math.abs(pctChange) > 20) {
        flagged.push({ ...item, flag: `${Math.abs(pctChange).toFixed(1)}% change — exceeds 20% threshold`, severity: Math.abs(pctChange) > 50 ? 'high' : 'medium' });
      }
    } else {
      newItems.push({ key, item: curr, value: Number(curr[valueField] || 0), note: 'New item in current period — not present in prior' });
    }
  }

  for (const [key, prior] of priorMap) {
    if (!currentMap.has(key)) {
      removedItems.push({ key, item: prior, value: Number(prior[valueField] || 0), note: 'Item in prior period not found in current — possible omission or disposal' });
    }
  }

  return {
    results,
    flagged,
    newItems,
    removedItems,
    summary: {
      total:       results.length,
      flagged:     flagged.length,
      new:         newItems.length,
      removed:     removedItems.length,
      increasing:  results.filter(r => r.trend === 'increasing').length,
      decreasing:  results.filter(r => r.trend === 'decreasing').length,
      stable:      results.filter(r => r.trend === 'stable').length,
    },
    isaReference: 'ISA 520 (Analytical Procedures)',
  };
}

// ─── searchForAnomalies ────────────────────────────────────────────────────

/**
 * Full-population anomaly detection (MindBridge / Inflo style)
 * @param {Array}  data   population
 * @param {Array}  rules  optional custom rules; if omitted all built-in rules run
 */
export function searchForAnomalies(data, rules = null) {
  const builtInRules = [
    { name: 'round_numbers',     fn: _roundNumbers },
    { name: 'duplicates',        fn: _duplicates },
    { name: 'sequence_gaps',     fn: _sequenceGaps },
    { name: 'weekend_dates',     fn: _weekendDates },
    { name: 'threshold_cluster', fn: _thresholdCluster },
    { name: 'negative_amounts',  fn: _negativeAmounts },
    { name: 'unusual_times',     fn: _unusualTimes },
  ];

  const activeRules = rules || builtInRules;
  const flaggedItems = [];

  for (const rule of activeRules) {
    const flags = rule.fn(data);
    flaggedItems.push(...flags.map(f => ({ ...f, rule: rule.name || f.rule })));
  }

  // Transaction-level risk scores (0–100, MindBridge style)
  const scoredData = data.map(item => {
    const itemFlags = flaggedItems.filter(f => f.item === item || f.id === item.id);
    const riskScore = Math.min(100, itemFlags.length * 25 + (itemFlags.some(f => f.severity === 'high') ? 30 : 0));
    return { ...item, riskScore, flags: itemFlags };
  });

  return {
    flaggedItems,
    scoredData: scoredData.filter(d => d.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore),
    totalFlagged:  flaggedItems.length,
    highSeverity:  flaggedItems.filter(f => f.severity === 'high').length,
    byRule:        _groupBy(flaggedItems, 'rule'),
    isaReference:  'ISA 240 / ISA 530 / ISA 315',
  };
}

function _roundNumbers(data) {
  return data
    .filter(d => {
      const v = Math.abs(Number(d.amount || 0));
      return v > 0 && v % 1000 === 0;
    })
    .map(d => ({ item: d, id: d.id, rule: 'round_numbers', severity: 'medium', flag: `Round number amount: ${d.amount}`, action: 'Verify authenticity — round numbers may indicate estimation or fabrication' }));
}

function _duplicates(data) {
  const seen    = new Map();
  const flagged = [];
  for (const d of data) {
    const key = `${d.amount}|${d.date}|${d.reference}`;
    if (seen.has(key)) {
      flagged.push({ item: d, id: d.id, rule: 'duplicates', severity: 'high', flag: `Possible duplicate: same amount/date/reference as item ${seen.get(key)}`, action: 'Verify this is not a duplicate payment/receipt' });
    } else {
      seen.set(key, d.id);
    }
  }
  return flagged;
}

function _sequenceGaps(data) {
  const withRef = data.filter(d => d.reference && /^\d+$/.test(String(d.reference)));
  if (withRef.length < 2) return [];
  const sorted = withRef.map(d => parseInt(d.reference)).sort((a, b) => a - b);
  const gaps   = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] > 1) {
      gaps.push({ rule: 'sequence_gaps', severity: 'medium', flag: `Sequence gap: references ${sorted[i - 1]} to ${sorted[i]} — ${sorted[i] - sorted[i - 1] - 1} missing`, action: 'Investigate missing sequence numbers — possible voided or suppressed transactions' });
    }
  }
  return gaps;
}

function _weekendDates(data) {
  return data
    .filter(d => {
      if (!d.date) return false;
      const day = new Date(d.date).getDay();
      return day === 0 || day === 6;
    })
    .map(d => ({ item: d, id: d.id, rule: 'weekend_dates', severity: 'medium', flag: `Transaction dated on weekend: ${d.date}`, action: 'Verify authorisation for weekend transactions' }));
}

function _thresholdCluster(data) {
  // Flag items just below common thresholds (approval, VAT, reporting limits)
  const thresholds = [10000, 25000, 50000, 100000];
  return data
    .filter(d => {
      const v = Math.abs(Number(d.amount || 0));
      return thresholds.some(t => v >= t * 0.95 && v < t);
    })
    .map(d => ({ item: d, id: d.id, rule: 'threshold_cluster', severity: 'high', flag: `Amount just below approval threshold: ${d.amount}`, action: 'Investigate — possible transaction splitting to avoid authorisation controls' }));
}

function _negativeAmounts(data) {
  return data
    .filter(d => Number(d.amount || 0) < 0 && d.type !== 'credit' && d.type !== 'refund')
    .map(d => ({ item: d, id: d.id, rule: 'negative_amounts', severity: 'medium', flag: `Unexpected negative amount: ${d.amount}`, action: 'Verify legitimacy of negative entry — possible reversal or error' }));
}

function _unusualTimes(data) {
  return data
    .filter(d => {
      if (!d.timestamp) return false;
      const hour = new Date(d.timestamp).getHours();
      return hour < 6 || hour > 22;
    })
    .map(d => ({ item: d, id: d.id, rule: 'unusual_times', severity: 'medium', flag: `Transaction entered outside business hours: ${d.timestamp}`, action: 'Verify authorisation for off-hours transactions' }));
}

function _groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'unknown';
    acc[k] = (acc[k] || []);
    acc[k].push(item);
    return acc;
  }, {});
}

// ─── Accounting system data ingestion ──────────────────────────────────────

/**
 * Parse CSV/Excel-style GL exports from Xero, Sage, QuickBooks
 * @param {Array}  rows       parsed rows from import
 * @param {'xero'|'sage'|'quickbooks'|'generic'} source
 */
export function ingestAccountingData(rows, source = 'generic') {
  const fieldMaps = {
    xero:        { date: 'Date', reference: 'Reference', description: 'Description', debit: 'Debit', credit: 'Credit', account: 'Account' },
    sage:        { date: 'Trans Date', reference: 'Ref', description: 'Details', debit: 'Debit', credit: 'Credit', account: 'N/C' },
    quickbooks:  { date: 'Date', reference: 'Num', description: 'Memo', debit: 'Debit', credit: 'Credit', account: 'Account' },
    generic:     { date: 'date', reference: 'reference', description: 'description', debit: 'debit', credit: 'credit', account: 'account' },
  };

  const map = fieldMaps[source] || fieldMaps.generic;

  return rows
    .filter(r => r[map.date])
    .map((r, i) => {
      const debit  = parseFloat(String(r[map.debit]  || '0').replace(/,/g, '')) || 0;
      const credit = parseFloat(String(r[map.credit] || '0').replace(/,/g, '')) || 0;
      return {
        id:          i + 1,
        date:        r[map.date],
        reference:   r[map.reference] || '',
        description: r[map.description] || '',
        account:     r[map.account] || '',
        debit,
        credit,
        amount:      debit - credit,
        source,
      };
    });
}
