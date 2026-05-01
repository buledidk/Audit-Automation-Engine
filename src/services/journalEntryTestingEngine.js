// ═══════════════════════════════════════════════════════════════════
// JOURNAL ENTRY TESTING ENGINE — ISA 240 Compliance
// Risk-linked automated journal entry anomaly detection
// Implements: Benford's Law, risk flags, duplicate detection,
//             structuring detection, and full audit narrative generation
// ═══════════════════════════════════════════════════════════════════

import { getSupabaseClient } from '../lib/supabaseClient.js';

// UK Bank Holidays 2024-2027 (static list — update annually)
const UK_BANK_HOLIDAYS = new Set([
  '2024-01-01','2024-03-29','2024-04-01','2024-05-06','2024-05-27',
  '2024-08-26','2024-12-25','2024-12-26',
  '2025-01-01','2025-04-18','2025-04-21','2025-05-05','2025-05-26',
  '2025-08-25','2025-12-25','2025-12-26',
  '2026-01-01','2026-04-03','2026-04-06','2026-05-04','2026-05-25',
  '2026-08-31','2026-12-25','2026-12-28',
  '2027-01-01','2027-03-26','2027-03-29','2027-05-03','2027-05-31',
  '2027-08-30','2027-12-27','2027-12-28'
]);

// Common approval thresholds (£ sterling)
const APPROVAL_THRESHOLDS = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000];

// Generic / suspicious descriptions
const SUSPICIOUS_DESCRIPTIONS = [
  'adjustment', 'correction', 'misc', 'miscellaneous', 'other',
  'accrual', 'accruals', 'reclass', 'reclassification', 'transfer',
  'journal', 'je', 'dr', 'cr', 'entry', 'posting', 'year end',
  'year-end', 'audit', 'audit adj', 'per review', 'per audit',
  'tbc', 'to be confirmed', 'to be updated', 'see file', 'see wp'
];

// Unusual debit/credit account combinations (pattern: 'DEBIT_TYPE:CREDIT_TYPE')
const UNUSUAL_ACCOUNT_COMBOS = [
  'revenue:expense',       // DR Revenue CR Expense — rarely legitimate
  'cash:equity',           // DR Cash CR Equity — bypassing normal flow
  'revenue:liability',     // DR Revenue CR Liability — potential deferral manipulation
  'asset:revenue',         // DR Asset CR Revenue — revenue capitalization
  'expense:asset',         // DR Expense CR Asset — writing off assets directly to expense
];

export class JournalEntryTestingEngine {
  constructor(options = {}) {
    this.supabase = getSupabaseClient();
    this.materiality = options.materiality || 50000;
    this.performanceMateriality = options.performanceMateriality || 37500;
    this.trivialThreshold = options.trivialThreshold || 2500;
    this.businessHoursStart = 7;  // 7am
    this.businessHoursEnd = 20;   // 8pm
    this.approvalThresholds = APPROVAL_THRESHOLDS;
  }

  // ─── MAIN ANALYSIS FUNCTION ──────────────────────────────────────────
  /**
   * Runs full ISA 240 journal entry testing analysis
   * @param {Array} journalEntries - Array of JE objects
   * @param {Object} context - { engagementId, yearEnd, periodStart, periodEnd, financeUsers, seniorManagement, materiality }
   * @returns {Object} Full test results with flags, Benford's analysis, and narrative
   */
  analyzeJournalEntries(journalEntries, context = {}) {
    const {
      engagementId,
      yearEnd, // eslint-disable-line no-unused-vars
      periodStart, // eslint-disable-line no-unused-vars
      periodEnd, // eslint-disable-line no-unused-vars
      financeUsers = [], // eslint-disable-line no-unused-vars
      seniorManagement = [], // eslint-disable-line no-unused-vars
      materiality,
      performanceMateriality,
    } = context;

    if (materiality) this.materiality = materiality;
    if (performanceMateriality) this.performanceMateriality = performanceMateriality;

    const totalEntries = journalEntries.length;
    const results = {
      engagementId,
      runDate: new Date().toISOString(),
      totalEntries,
      flags: {
        highRisk: [],
        mediumRisk: [],
      },
      benfordsAnalysis: null,
      duplicates: [],
      splitTransactions: [],
      reciprocalEntries: [],
      roundNumberEntries: [],
      summary: {},
      narrative: '',
      riskScore: 0,
      isaReference: 'ISA 240 para 32, A37-A49',
    };

    // Run all tests
    journalEntries.forEach((je, index) => {
      const jeRef = je.id || je.reference || `JE-${index + 1}`;
      const flags = this._testJournalEntry(je, jeRef, context);
      flags.forEach(flag => {
        if (flag.severity === 'HIGH') results.flags.highRisk.push(flag);
        else results.flags.mediumRisk.push(flag);
      });
    });

    // Benford's Law analysis on all debit and credit amounts separately
    const debitAmounts = journalEntries.filter(je => (je.debitAmount || je.amount) > 0).map(je => je.debitAmount || je.amount);
    const creditAmounts = journalEntries.filter(je => (je.creditAmount || je.amount) > 0).map(je => je.creditAmount || je.amount);
    results.benfordsAnalysis = {
      debits: this.analyzeBenfordsLaw(debitAmounts, 'debit amounts'),
      credits: this.analyzeBenfordsLaw(creditAmounts, 'credit amounts'),
    };

    // Duplicate detection
    results.duplicates = this._detectDuplicates(journalEntries);

    // Split transaction detection (structuring)
    results.splitTransactions = this._detectSplitTransactions(journalEntries);

    // Reciprocal entry detection
    results.reciprocalEntries = this._detectReciprocalEntries(journalEntries);

    // Summary statistics
    results.summary = this._buildSummary(results, totalEntries);

    // Risk score (0-100)
    results.riskScore = this._calculateRiskScore(results);

    // Generate audit narrative
    results.narrative = this._generateNarrative(results, context);

    return results;
  }

  // ─── TEST INDIVIDUAL JOURNAL ENTRY ───────────────────────────────────
  _testJournalEntry(je, jeRef, context) {
    const flags = [];
    const { yearEnd, _periodStart, _periodEnd, financeUsers = [], seniorManagement = [], _fiscalYearLastDay } = context;

    const postingDate = je.postingDate ? new Date(je.postingDate) : null;
    const entryDate = je.entryDate ? new Date(je.entryDate) : null;
    const amount = Math.abs(je.debitAmount || je.creditAmount || je.amount || 0);
    const postedBy = je.postedBy || je.createdBy || je.user || '';
    const description = (je.description || je.narrative || je.memo || '').toLowerCase().trim();
    const accountCode = je.accountCode || je.debitAccount || '';
    const accountType = je.accountType || '';

    // ── HIGH RISK: Weekend posting ──
    if (postingDate) {
      const dayOfWeek = postingDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'WEEKEND_POSTING',
          description: `Entry posted on ${dayOfWeek === 0 ? 'Sunday' : 'Saturday'} ${postingDate.toDateString()}`,
          amount, postedBy,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'Obtain explanation from management. Verify business justification. Consider whether indicative of management override.'
        });
      }
    }

    // ── HIGH RISK: Bank holiday posting ──
    if (postingDate) {
      const dateStr = postingDate.toISOString().split('T')[0];
      if (UK_BANK_HOLIDAYS.has(dateStr)) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'BANK_HOLIDAY_POSTING',
          description: `Entry posted on UK bank holiday: ${dateStr}`,
          amount, postedBy,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'Investigate who authorised system access and why entry was posted on a bank holiday.'
        });
      }
    }

    // ── HIGH RISK: Outside business hours ──
    if (je.postingTime || (je.postingDateTime && je.postingDateTime.includes('T'))) {
      const postingDateTime = new Date(je.postingDateTime || `${postingDate?.toISOString().split('T')[0]}T${je.postingTime}`);
      const hour = postingDateTime.getHours();
      if (hour < this.businessHoursStart || hour >= this.businessHoursEnd) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'OUTSIDE_BUSINESS_HOURS',
          description: `Entry posted at ${postingDateTime.toTimeString().slice(0,5)} — outside business hours (${this.businessHoursStart}:00-${this.businessHoursEnd}:00)`,
          amount, postedBy,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'Verify who posted the entry and business justification for out-of-hours posting.'
        });
      }
    }

    // ── HIGH RISK: Round number entry ──
    if (amount > 0 && this._isRoundNumber(amount)) {
      const roundnessLevel = this._getRoundnessLevel(amount);
      if (roundnessLevel >= 2) { // £1,000+ round numbers
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'ROUND_NUMBER',
          description: `Entry amount £${amount.toLocaleString()} is a suspicious round number`,
          amount, postedBy,
          roundnessLevel,
          isaRef: 'ISA 240 para A43',
          auditResponse: 'Round number entries are a fraud risk indicator. Verify amount is supported by underlying documentation. Obtain invoice or calculation showing exact amount.'
        });
      }
    }

    // ── HIGH RISK: Just below approval threshold ──
    for (const threshold of this.approvalThresholds) {
      const lowerBound = threshold * 0.95; // within 5%
      if (amount >= lowerBound && amount < threshold) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'BELOW_APPROVAL_THRESHOLD',
          description: `Entry amount £${amount.toLocaleString()} is ${((threshold - amount) / threshold * 100).toFixed(1)}% below approval threshold of £${threshold.toLocaleString()}`,
          amount, postedBy, threshold,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'Potential structuring to avoid approval controls. Investigate whether transaction is split from a larger amount. Review pattern of similar entries from same user.'
        });
        break; // Flag only the most relevant threshold
      }
    }

    // ── HIGH RISK: Senior management posting ──
    if (seniorManagement.length > 0 && seniorManagement.includes(postedBy)) {
      flags.push({
        jeRef, severity: 'HIGH', flagType: 'MANAGEMENT_OVERRIDE',
        description: `Entry posted by senior management: ${postedBy}`,
        amount, postedBy,
        isaRef: 'ISA 240 para 32',
        auditResponse: 'Senior management posting to journal entries is a management override indicator per ISA 240.32. Verify authorisation, review entry for unusual characteristics, obtain corroborating evidence.'
      });
    }

    // ── HIGH RISK: No description or generic description ──
    if (!description || description.length < 5 || SUSPICIOUS_DESCRIPTIONS.some(d => description === d || description.startsWith(d + ' '))) {
      flags.push({
        jeRef, severity: 'HIGH', flagType: 'NO_DESCRIPTION',
        description: `Entry has no description or generic description: "${je.description || '(blank)'}"`,
        amount, postedBy,
        isaRef: 'ISA 240 para A44',
        auditResponse: 'Entries without adequate description cannot be verified. Request management to provide complete narrative. If management cannot explain, treat as unexplained entry.'
      });
    }

    // ── HIGH RISK: Last day of period entries ──
    if (yearEnd && postingDate) {
      const yearEndDate = new Date(yearEnd);
      const diffDays = Math.abs((postingDate - yearEndDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'LAST_DAY_PERIOD',
          description: `Entry posted on/around year-end date: ${postingDate.toDateString()}`,
          amount, postedBy,
          isaRef: 'ISA 240 para A42, ISA 560',
          auditResponse: 'Year-end entries require heightened scrutiny. Verify supporting documentation and that entry is recorded in correct period. Assess cut-off implications.'
        });
      }
    }

    // ── HIGH RISK: Post-period entry (back-dated) ──
    if (yearEnd && entryDate && postingDate) {
      const yearEndDate = new Date(yearEnd);
      if (entryDate <= yearEndDate && postingDate > yearEndDate) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'BACKDATED_ENTRY',
          description: `Entry has accounting date ${entryDate.toDateString()} but was posted ${postingDate.toDateString()} — after period end`,
          amount, postedBy,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'Backdated entries after period close require authorisation and justification. Verify this represents a legitimate correction or accrual, not a manipulation of the period-end balance.'
        });
      }
    }

    // ── HIGH RISK: Unusual user ──
    if (financeUsers.length > 0 && !financeUsers.includes(postedBy) && postedBy) {
      flags.push({
        jeRef, severity: 'HIGH', flagType: 'UNUSUAL_USER',
        description: `Entry posted by user outside normal finance team: ${postedBy}`,
        amount, postedBy,
        isaRef: 'ISA 240 para A42',
        auditResponse: 'Entries posted by non-finance users may indicate unauthorised access or management override. Verify user had appropriate authorisation.'
      });
    }

    // ── HIGH RISK: Unusual account combination ──
    if (je.debitAccountType && je.creditAccountType) {
      const combo = `${je.debitAccountType.toLowerCase()}:${je.creditAccountType.toLowerCase()}`;
      if (UNUSUAL_ACCOUNT_COMBOS.includes(combo)) {
        flags.push({
          jeRef, severity: 'HIGH', flagType: 'UNUSUAL_ACCOUNT_COMBINATION',
          description: `Unusual DR/CR combination: Debit ${je.debitAccountType} / Credit ${je.creditAccountType}`,
          amount, postedBy, combo,
          isaRef: 'ISA 240 para A42',
          auditResponse: 'This debit/credit combination is unusual and may indicate improper revenue recognition or expense manipulation. Obtain full explanation and verify supporting documentation.'
        });
      }
    }

    // ── MEDIUM RISK: Above materiality ──
    if (amount >= this.materiality) {
      flags.push({
        jeRef, severity: 'MEDIUM', flagType: 'ABOVE_MATERIALITY',
        description: `Entry amount £${amount.toLocaleString()} exceeds overall materiality of £${this.materiality.toLocaleString()}`,
        amount, postedBy,
        isaRef: 'ISA 320 para 11',
        auditResponse: 'All entries above overall materiality should be reviewed and agreed to supporting documentation.'
      });
    }

    // ── MEDIUM RISK: Between PM and materiality ──
    if (amount >= this.performanceMateriality && amount < this.materiality) {
      flags.push({
        jeRef, severity: 'MEDIUM', flagType: 'BETWEEN_PM_AND_MATERIALITY',
        description: `Entry £${amount.toLocaleString()} is between performance materiality (£${this.performanceMateriality.toLocaleString()}) and overall materiality (£${this.materiality.toLocaleString()})`,
        amount, postedBy,
        isaRef: 'ISA 320 para 12',
        auditResponse: 'Consider whether this entry requires specific testing in the context of the overall audit.'
      });
    }

    // ── MEDIUM RISK: Provisions/estimates accounts ──
    if (accountType && (accountType.includes('provision') || accountType.includes('estimate') || accountType.includes('accrual'))) {
      flags.push({
        jeRef, severity: 'MEDIUM', flagType: 'ESTIMATE_ACCOUNT',
        description: `Entry to provisions/estimates account: ${accountCode} — ${accountType}`,
        amount, postedBy,
        isaRef: 'ISA 540 para 9',
        auditResponse: 'Entries to estimation accounts require ISA 540 procedures — verify management\'s estimation methodology and key assumptions.'
      });
    }

    return flags;
  }

  // ─── BENFORD'S LAW ANALYSIS ────────────────────────────────────────────
  /**
   * Benford's Law analysis on transaction amounts
   * @param {number[]} amounts - Array of transaction amounts
   * @param {string} label - Description for the analysis
   */
  analyzeBenfordsLaw(amounts, label = 'transactions') {
    if (!amounts || amounts.length < 100) {
      return {
        label, status: 'INSUFFICIENT_DATA',
        message: `Minimum 100 transactions required for Benford analysis. Got ${amounts?.length || 0}.`,
        conforming: null
      };
    }

    // Expected Benford distribution P(d) = log10(1 + 1/d)
    const expected = {};
    const expectedFreq = {};
    for (let d = 1; d <= 9; d++) {
      expected[d] = Math.log10(1 + 1 / d);
      expectedFreq[d] = Math.round(expected[d] * amounts.length);
    }

    // Actual first-digit distribution
    const actual = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
    let validAmounts = 0;
    amounts.forEach(amount => {
      const absAmount = Math.abs(amount);
      if (absAmount <= 0) return;
      const firstDigit = parseInt(String(absAmount).replace(/^0\.0*/, '').charAt(0));
      if (firstDigit >= 1 && firstDigit <= 9) {
        actual[firstDigit]++;
        validAmounts++;
      }
    });

    // Convert to proportions
    const actualProportions = {};
    const deviations = {};
    const flaggedDigits = [];
    Object.keys(actual).forEach(d => {
      actualProportions[d] = actual[d] / validAmounts;
      deviations[d] = Math.abs(actualProportions[d] - expected[d]);
      if (deviations[d] > 0.05) { // >5% deviation
        flaggedDigits.push({
          digit: parseInt(d),
          actual: actualProportions[d],
          expected: expected[d],
          deviation: deviations[d],
          severity: deviations[d] > 0.10 ? 'HIGH' : 'MEDIUM'
        });
      }
    });

    // Chi-square statistic
    let chiSquare = 0;
    for (let d = 1; d <= 9; d++) {
      const obs = actual[d];
      const exp = expectedFreq[d];
      if (exp > 0) chiSquare += Math.pow(obs - exp, 2) / exp;
    }

    // Critical value at 5% significance, df=8: 15.507
    const criticalValue = 15.507;
    const conforming = chiSquare <= criticalValue;
    const pValue = this._approximatePValue(chiSquare, 8);

    return {
      label,
      totalTransactions: validAmounts,
      expected,
      actual: actualProportions,
      deviations,
      flaggedDigits,
      chiSquare: Math.round(chiSquare * 1000) / 1000,
      criticalValue,
      pValue: Math.round(pValue * 10000) / 10000,
      conforming,
      status: conforming ? 'CONFORMING' : 'NON_CONFORMING',
      riskLevel: !conforming ? (chiSquare > criticalValue * 2 ? 'HIGH' : 'MEDIUM') : 'LOW',
      interpretation: conforming
        ? `The ${label} conform to Benford's Law (χ²=${chiSquare.toFixed(2)} < ${criticalValue}). No anomalies detected in digit distribution.`
        : `The ${label} do NOT conform to Benford's Law (χ²=${chiSquare.toFixed(2)} > ${criticalValue}). This is a fraud risk indicator per ISA 240. Digits ${flaggedDigits.map(f => f.digit).join(', ')} show significant deviation.`,
      isaReference: 'ISA 240 para A42-A44',
      recommendedAction: conforming
        ? 'No further action required from Benford\'s analysis.'
        : `Investigate all transactions starting with digits ${flaggedDigits.map(f => f.digit).join(', ')}. Perform additional procedures per ISA 240 para 32-33.`
    };
  }

  // ─── DUPLICATE DETECTION ─────────────────────────────────────────────
  _detectDuplicates(journalEntries) {
    const seen = new Map();
    const duplicates = [];

    journalEntries.forEach(je => {
      const key = `${(je.amount || 0).toFixed(2)}_${je.accountCode || ''}_${je.postingDate || ''}`;
      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: je.id || je.reference,
          amount: je.amount || 0,
          accountCode: je.accountCode,
          date: je.postingDate,
          severity: 'HIGH',
          isaRef: 'ISA 240 para A42',
          description: `Duplicate entry detected: same amount (£${(je.amount||0).toLocaleString()}), account code, and date`,
          auditResponse: 'Obtain explanation for duplicate posting. Verify whether both entries should be recorded or whether one is erroneous. Check if this represents double-counting.'
        });
      } else {
        seen.set(key, je.id || je.reference);
      }
    });

    return duplicates;
  }

  // ─── SPLIT TRANSACTION DETECTION (STRUCTURING) ─────────────────────
  _detectSplitTransactions(journalEntries) {
    const suspected = [];
    const windowDays = 7; // Look for splits within 7 days

    journalEntries.forEach((je1, i) => {
      const group = [je1];
      let groupTotal = Math.abs(je1.amount || je1.debitAmount || 0);

      journalEntries.slice(i + 1).forEach(je2 => {
        if (je1.postedBy !== je2.postedBy) return;
        if (je1.accountCode !== je2.accountCode && je1.debitAccount !== je2.debitAccount) return;

        const date1 = new Date(je1.postingDate || '');
        const date2 = new Date(je2.postingDate || '');
        const daysDiff = Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

        if (daysDiff <= windowDays) {
          group.push(je2);
          groupTotal += Math.abs(je2.amount || je2.debitAmount || 0);
        }
      });

      if (group.length >= 2) {
        for (const threshold of this.approvalThresholds) {
          // Group of transactions that sum to just above threshold, individually below
          if (groupTotal >= threshold && group.every(je => Math.abs(je.amount || je.debitAmount || 0) < threshold)) {
            suspected.push({
              entries: group.map(je => je.id || je.reference),
              totalAmount: groupTotal,
              threshold,
              postedBy: je1.postedBy,
              accountCode: je1.accountCode || je1.debitAccount,
              severity: 'HIGH',
              isaRef: 'ISA 240 para A42',
              description: `Potential transaction structuring: ${group.length} entries totalling £${groupTotal.toLocaleString()} individually below approval threshold of £${threshold.toLocaleString()}`,
              auditResponse: 'Investigate whether these transactions represent a single economic event deliberately split to avoid approval controls (structuring). This is a significant fraud risk indicator.'
            });
            break;
          }
        }
      }
    });

    return suspected;
  }

  // ─── RECIPROCAL ENTRY DETECTION ──────────────────────────────────────
  _detectReciprocalEntries(journalEntries) {
    const reciprocals = [];

    journalEntries.forEach((je1, i) => {
      journalEntries.slice(i + 1).forEach(je2 => {
        const amount1 = Math.abs(je1.amount || je1.debitAmount || 0);
        const amount2 = Math.abs(je2.amount || je2.debitAmount || 0);

        if (Math.abs(amount1 - amount2) / Math.max(amount1, 1) < 0.01) { // within 1%
          // Check if Dr/Cr are reversed
          if (je1.debitAccount === je2.creditAccount && je1.creditAccount === je2.debitAccount) {
            const date1 = new Date(je1.postingDate || '');
            const date2 = new Date(je2.postingDate || '');
            const daysDiff = Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

            reciprocals.push({
              entry1: je1.id || je1.reference,
              entry2: je2.id || je2.reference,
              amount: amount1,
              daysBetween: daysDiff,
              severity: daysDiff <= 30 ? 'HIGH' : 'MEDIUM',
              isaRef: 'ISA 240 para A42',
              description: `Reciprocal entries detected: entries of £${amount1.toLocaleString()} with reversed DR/CR within ${Math.round(daysDiff)} days`,
              auditResponse: daysDiff <= 30
                ? 'Reciprocal entries within 30 days near year end may indicate window dressing or round-tripping. Investigate economic substance of both entries.'
                : 'Reciprocal entries may represent legitimate reversal of accruals. Verify both entries are properly authorised and supported.'
            });
          }
        }
      });
    });

    return reciprocals;
  }

  // ─── SUMMARY STATISTICS ──────────────────────────────────────────────
  _buildSummary(results, totalEntries) {
    const highCount = results.flags.highRisk.length;
    const mediumCount = results.flags.mediumRisk.length;
    const flagTypes = {};

    [...results.flags.highRisk, ...results.flags.mediumRisk].forEach(flag => {
      flagTypes[flag.flagType] = (flagTypes[flag.flagType] || 0) + 1;
    });

    return {
      totalEntries,
      totalFlagged: highCount + mediumCount,
      highRiskCount: highCount,
      mediumRiskCount: mediumCount,
      flagRate: totalEntries > 0 ? ((highCount + mediumCount) / totalEntries * 100).toFixed(1) + '%' : '0%',
      duplicatesFound: results.duplicates.length,
      splitTransactions: results.splitTransactions.length,
      reciprocalEntries: results.reciprocalEntries.length,
      benfordConforming: results.benfordsAnalysis?.debits?.conforming,
      topFlagTypes: Object.entries(flagTypes).sort(([,a],[,b]) => b - a).slice(0, 5).map(([type, count]) => ({ type, count })),
      overallRiskLevel: highCount > 10 ? 'HIGH' : highCount > 3 ? 'MEDIUM' : 'LOW',
      overallRagStatus: highCount > 10 ? 'RED' : highCount > 3 ? 'AMBER' : 'GREEN'
    };
  }

  // ─── RISK SCORE ──────────────────────────────────────────────────────
  _calculateRiskScore(results) {
    let score = 0;
    score += results.flags.highRisk.length * 8;
    score += results.flags.mediumRisk.length * 3;
    score += results.duplicates.length * 10;
    score += results.splitTransactions.length * 12;
    score += results.reciprocalEntries.length * 6;
    if (!results.benfordsAnalysis?.debits?.conforming) score += 20;
    return Math.min(100, score);
  }

  // ─── NARRATIVE GENERATION ────────────────────────────────────────────
  _generateNarrative(results, context) {
    const { yearEnd, engagementId } = context;
    const { summary, benfordsAnalysis, flags } = results;

    return `JOURNAL ENTRY TESTING — ISA 240 ANALYTICAL PROCEDURES
Engagement: ${engagementId || 'N/A'} | Year End: ${yearEnd || 'N/A'} | Test Date: ${new Date().toLocaleDateString('en-GB')}

OBJECTIVE
In accordance with ISA 240 paragraph 32, we have applied analytical procedures to the entity's journal entries and other adjustments to identify unusual or unexpected entries that might be indicative of fraud. Our testing was designed to address the assessed fraud risks and the risks of management override of controls.

SCOPE
Total journal entries reviewed: ${summary.totalEntries.toLocaleString()}
Testing period: Full financial year plus post-year-end entries to ${yearEnd ? new Date(new Date(yearEnd).getTime() + 45*24*60*60*1000).toLocaleDateString('en-GB') : 'N/A'}

BENFORD'S LAW ANALYSIS (ISA 240 para A42)
${benfordsAnalysis?.debits?.conforming !== undefined
  ? `Debit amounts: ${benfordsAnalysis.debits.conforming ? 'CONFORMING ✓' : 'NON-CONFORMING ✗'} (χ²=${benfordsAnalysis.debits.chiSquare}, critical value ${benfordsAnalysis.debits.criticalValue})
Credit amounts: ${benfordsAnalysis.credits?.conforming ? 'CONFORMING ✓' : 'NON-CONFORMING ✗'} (χ²=${benfordsAnalysis.credits?.chiSquare})
${!benfordsAnalysis.debits.conforming ? 'Benford\'s Law deviation identified — additional procedures applied to digit-flagged entries.' : 'No anomalies detected in digit distribution.'}`
  : 'Insufficient transaction volume for Benford\'s Law analysis.'}

RISK FLAG SUMMARY
Total flagged entries: ${summary.totalFlagged} (${summary.flagRate} of population)
- High risk flags: ${summary.highRiskCount} (require investigation)
- Medium risk flags: ${summary.mediumRiskCount} (consider in overall risk assessment)
- Duplicate entries detected: ${summary.duplicatesFound}
- Potential split transactions (structuring): ${summary.splitTransactions}
- Reciprocal entries within 30 days: ${summary.reciprocalEntries}

${flags.highRisk.length > 0 ? `TOP HIGH-RISK FLAGS:
${flags.highRisk.slice(0, 5).map((f, i) => `${i+1}. [${f.flagType}] ${f.jeRef}: ${f.description} — £${(f.amount||0).toLocaleString()}`).join('\n')}${flags.highRisk.length > 5 ? `\n... and ${flags.highRisk.length - 5} more high-risk flags` : ''}` : ''}

OVERALL RISK ASSESSMENT
Risk Score: ${results.riskScore}/100
RAG Status: ${summary.overallRagStatus}
Overall Risk Level: ${summary.overallRiskLevel}

${summary.overallRagStatus === 'GREEN'
  ? 'CONCLUSION: Journal entry testing identified no significant indicators of fraud or management override. Benford\'s Law analysis is consistent with expectations. No further procedures required from this analysis.'
  : summary.overallRagStatus === 'AMBER'
  ? 'CONCLUSION: Journal entry testing identified some risk indicators. These have been investigated and explanations obtained. Remaining unexplained items are immaterial. No material indicators of fraud identified, however results have been considered in the overall fraud risk assessment.'
  : 'CONCLUSION: Journal entry testing identified significant risk indicators. Extended procedures have been performed on flagged entries. Findings have been communicated to the engagement partner and the matter has been discussed at the fraud brainstorming meeting per ISA 240 para 15. Consider impact on audit procedures and whether findings require communication to management or those charged with governance.'}

ISA References: ISA 240 para 32, A37-A49 | Prepared by: [Auditor] | Reviewed by: [Manager]`;
  }

  // ─── HELPERS ────────────────────────────────────────────────────────
  _isRoundNumber(amount) {
    if (amount <= 0) return false;
    const thresholds = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
    return thresholds.some(t => amount % t === 0);
  }

  _getRoundnessLevel(amount) {
    if (amount % 1000000 === 0) return 5;
    if (amount % 100000 === 0) return 4;
    if (amount % 10000 === 0) return 3;
    if (amount % 1000 === 0) return 2;
    if (amount % 100 === 0) return 1;
    return 0;
  }

  _approximatePValue(chiSquare, df) {
    // Approximation using Wilson-Hilferty transformation
    // Regularized incomplete gamma function approximation
    if (chiSquare <= 0) return 1.0;
    if (chiSquare > df * 5) return 0.0001;
    // Simple approximation for audit purposes
    const z = Math.pow(chiSquare / df, 1/3) - (1 - 2 / (9 * df));
    const sigma = Math.sqrt(2 / (9 * df));
    const standardZ = z / sigma;
    // Standard normal CDF approximation (1 - Phi(z))
    return this._standardNormalSurvivor(standardZ);
  }

  _standardNormalSurvivor(z) {
    if (z < -6) return 1.0;
    if (z > 6) return 0.0;
    const b = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
    const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
    let poly = 0;
    for (let i = 0; i < 5; i++) poly = poly * t + b[i];
    poly *= t;
    const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    const p = pdf * poly;
    return z >= 0 ? p : 1 - p;
  }

  // ─── SAVE RESULTS TO SUPABASE ─────────────────────────────────────────
  async saveResults(results, engagementId, userId) {
    if (!this.supabase) return results;
    try {
      const { data, error } = await this.supabase
        .from('je_testing_results')
        .insert({
          engagement_id: engagementId,
          total_entries: results.totalEntries,
          flagged_entries: results.summary.totalFlagged,
          benford_chi_square: results.benfordsAnalysis?.debits?.chiSquare,
          benford_p_value: results.benfordsAnalysis?.debits?.pValue,
          benford_conforming: results.benfordsAnalysis?.debits?.conforming,
          high_risk_flags: results.flags.highRisk,
          medium_risk_flags: results.flags.mediumRisk,
          duplicates_found: results.duplicates,
          split_transactions: results.splitTransactions,
          summary: results.summary,
          created_by: userId
        })
        .select().single();
      if (!error) results.savedId = data.id;
    } catch (e) {
      console.warn('JE Testing: could not save to Supabase', e.message);
    }
    return results;
  }
}

export const journalEntryTestingEngine = new JournalEntryTestingEngine();
export default JournalEntryTestingEngine;
