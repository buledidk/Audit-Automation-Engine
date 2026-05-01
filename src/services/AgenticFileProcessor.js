// ═══════════════════════════════════════════════════════════════
// Agentic File Processor — Multi-agent coordination for large files
// Orchestrates specialised agents to analyse uploaded audit data:
// TB analysis, bank statement matching, workbook reconciliation,
// journal entry testing, and anomaly detection.
// ═══════════════════════════════════════════════════════════════

import { fileIngestionEngine } from './FileIngestionEngine.js';

// ─── AGENT DEFINITIONS ─────────────────────────────────────────

const FILE_AGENTS = {
  tbAnalyser: {
    name: 'Trial Balance Analyser',
    description: 'Analyses trial balance data for completeness, classification, and anomalies',
    accepts: ['trial_balance'],
    capabilities: ['balance_validation', 'classification_check', 'movement_analysis', 'ratio_computation'],
  },
  journalTester: {
    name: 'Journal Entry Tester',
    description: 'ISA 240 journal entry testing — identifies unusual patterns per fraud risk indicators',
    accepts: ['journal_listing', 'general_ledger'],
    capabilities: ['round_number_detection', 'weekend_entries', 'unusual_users', 'duplicate_detection', 'benford_analysis'],
  },
  bankReconciler: {
    name: 'Bank Reconciliation Agent',
    description: 'Matches bank statement lines to cashbook entries, identifies unmatched items',
    accepts: ['bank_statement', 'cashbook'],
    capabilities: ['one_to_one_match', 'many_to_one_match', 'unmatched_identification', 'timing_analysis'],
  },
  leadScheduleMapper: {
    name: 'Lead Schedule Mapper',
    description: 'Maps TB balances to FSLI codes and working paper references',
    accepts: ['trial_balance'],
    capabilities: ['fsli_mapping', 'wp_linkage', 'movement_schedule', 'comparative_analysis'],
  },
  anomalyDetector: {
    name: 'Anomaly Detection Agent',
    description: 'Statistical anomaly detection across any tabular data using Z-scores and IQR',
    accepts: ['trial_balance', 'journal_listing', 'bank_statement', 'general_ledger', 'generic'],
    capabilities: ['zscore_outliers', 'iqr_outliers', 'trend_breaks', 'benford_law'],
  },
};

// ─── AGENTIC FILE PROCESSOR ────────────────────────────────────

export class AgenticFileProcessor {
  constructor() {
    this.processingLog = [];
    this.activeJobs = new Map();
  }

  /**
   * Process a file through the appropriate agent pipeline.
   * Auto-detects file type and dispatches to specialised agents.
   *
   * @param {File|ArrayBuffer} source — the file to process
   * @param {Object} options — { fileName, fileType, agents, engagement }
   * @returns {Object} { success, agentResults, summary, auditTrailEntry }
   */
  async processFile(source, options = {}) {
    const jobId = 'FP-' + Date.now().toString(36).toUpperCase();
    const startTime = Date.now();

    this.activeJobs.set(jobId, { status: 'ingesting', startTime });

    // Step 1: Ingest the file
    const fileType = options.fileType || 'generic';
    let ingested;

    if (fileType === 'trial_balance') {
      ingested = await fileIngestionEngine.ingestTrialBalance(source, options);
    } else {
      ingested = await fileIngestionEngine.ingestFile(source, options);
    }

    if (!ingested.success) {
      this.activeJobs.delete(jobId);
      return { success: false, error: ingested.error, jobId };
    }

    this.activeJobs.set(jobId, { status: 'analysing', startTime, rows: ingested.metadata.totalRows });

    // Step 2: Determine which agents to run
    const requestedAgents = options.agents || this._autoSelectAgents(fileType, ingested.metadata);
    const agentResults = {};

    // Step 3: Run each agent
    for (const agentKey of requestedAgents) {
      const agentDef = FILE_AGENTS[agentKey];
      if (!agentDef) continue;

      this.activeJobs.set(jobId, { status: `running ${agentDef.name}`, startTime });

      try {
        const result = await this._runAgent(agentKey, agentDef, ingested, options);
        agentResults[agentKey] = { success: true, ...result };
      } catch (err) {
        agentResults[agentKey] = { success: false, error: err.message };
      }
    }

    const elapsed = Date.now() - startTime;
    this.activeJobs.delete(jobId);

    // Step 4: Build summary and audit trail entry
    const summary = this._buildSummary(ingested, agentResults);
    const auditTrailEntry = {
      action: 'file_analysis',
      jobId,
      fileName: options.fileName,
      fileType,
      rowsProcessed: ingested.metadata.totalRows,
      agentsRun: requestedAgents,
      findingsCount: summary.totalFindings,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    };

    this.processingLog.push(auditTrailEntry);

    return {
      success: true,
      jobId,
      ingested: {
        metadata: ingested.metadata,
        validation: ingested.validation,
      },
      agentResults,
      summary,
      auditTrailEntry,
      elapsedMs: elapsed,
    };
  }

  // ─── AGENT IMPLEMENTATIONS ──────────────────────────────────────

  async _runAgent(agentKey, _agentDef, ingested, _options) {
    switch (agentKey) {
      case 'tbAnalyser':
        return this._runTBAnalyser(ingested);
      case 'journalTester':
        return this._runJournalTester(ingested);
      case 'anomalyDetector':
        return this._runAnomalyDetector(ingested);
      case 'leadScheduleMapper':
        return this._runLeadScheduleMapper(ingested);
      case 'bankReconciler':
        return this._runBankReconciler(ingested);
      default:
        return { findings: [], note: `Agent ${agentKey} not yet implemented` };
    }
  }

  _runTBAnalyser(ingested) {
    const findings = [];
    const { data, metadata } = ingested;

    // Validate balance
    if (metadata.type === 'trial_balance' && !metadata.isBalanced) {
      findings.push({
        severity: 'HIGH',
        type: 'balance_error',
        message: `Trial balance out of balance by ${metadata.balanceDifference}`,
        isa: 'ISA 500.9',
        action: 'Investigate TB difference before proceeding with substantive testing',
      });
    }

    // Check for unusual balances
    data.forEach(row => {
      const balance = typeof row.balance === 'number' ? row.balance : 0;
      const code = row.accountCode || '';

      // Revenue accounts with debit balances
      if (/^[4-5]/.test(code) && balance > 0) {
        findings.push({
          severity: 'MEDIUM',
          type: 'classification_anomaly',
          message: `Revenue/income account ${code} (${row.accountName}) has debit balance of ${balance}`,
          isa: 'ISA 315.25',
          action: 'Verify classification and investigate debit balance on income account',
          rowIndex: row._rowIndex,
        });
      }

      // Asset accounts with credit balances (except provisions/allowances)
      if (/^[0-1]/.test(code) && balance < 0 && !/provision|allowance|depreciation/i.test(row.accountName || '')) {
        findings.push({
          severity: 'MEDIUM',
          type: 'classification_anomaly',
          message: `Asset account ${code} (${row.accountName}) has credit balance of ${balance}`,
          isa: 'ISA 315.25',
          action: 'Verify classification — potential misclassification or provision needed',
          rowIndex: row._rowIndex,
        });
      }
    });

    // Movement analysis (if prior year available)
    const withPY = data.filter(r => r.priorYear !== null && r.priorYear !== undefined);
    if (withPY.length > 0) {
      withPY.forEach(row => {
        const movement = row.balance - (row.priorYear || 0);
        const pct = row.priorYear ? Math.abs(movement / row.priorYear) * 100 : 0;
        if (pct > 50 && Math.abs(movement) > 10000) {
          findings.push({
            severity: 'LOW',
            type: 'significant_movement',
            message: `${row.accountCode} (${row.accountName}): ${pct.toFixed(0)}% movement (${movement > 0 ? '+' : ''}${movement})`,
            isa: 'ISA 520.5',
            action: 'Obtain explanation for significant year-on-year movement',
            rowIndex: row._rowIndex,
          });
        }
      });
    }

    return { findings, accountCount: data.length };
  }

  _runJournalTester(ingested) {
    const findings = [];
    const { data, metadata } = ingested;
    const headers = metadata.headers.map(h => h.toLowerCase());

    // Try to find relevant columns
    const amountCol = metadata.headers[this._findCol(headers, ['amount', 'value', 'debit', 'total'])];
    const dateCol = metadata.headers[this._findCol(headers, ['date', 'posted', 'entry date', 'journal date'])];
    const userCol = metadata.headers[this._findCol(headers, ['user', 'posted by', 'created by', 'entered by'])];
    const descCol = metadata.headers[this._findCol(headers, ['description', 'narrative', 'memo', 'reference'])];

    if (!amountCol) {
      return { findings: [{ severity: 'INFO', type: 'column_missing', message: 'Could not identify amount column for journal testing' }] };
    }

    // Round number detection (ISA 240)
    let roundCount = 0;
    data.forEach(row => {
      const amount = typeof row[amountCol] === 'number' ? row[amountCol] : 0;
      if (amount !== 0 && amount % 1000 === 0 && Math.abs(amount) >= 5000) {
        roundCount++;
      }
    });
    if (roundCount > data.length * 0.05) {
      findings.push({
        severity: 'MEDIUM',
        type: 'round_numbers',
        message: `${roundCount} journals (${(roundCount / data.length * 100).toFixed(1)}%) are round thousands — investigate per ISA 240`,
        isa: 'ISA 240.32',
        action: 'Select sample of round-number journals for detailed testing',
      });
    }

    // Weekend/holiday entries
    if (dateCol) {
      let weekendCount = 0;
      data.forEach(row => {
        const d = new Date(row[dateCol]);
        if (!isNaN(d) && (d.getDay() === 0 || d.getDay() === 6)) weekendCount++;
      });
      if (weekendCount > 0) {
        findings.push({
          severity: weekendCount > 10 ? 'MEDIUM' : 'LOW',
          type: 'weekend_entries',
          message: `${weekendCount} journal entries posted on weekends`,
          isa: 'ISA 240.32',
          action: 'Investigate weekend entries — verify authorisation and business purpose',
        });
      }
    }

    // Duplicate detection
    const seen = new Map();
    let duplicates = 0;
    data.forEach(row => {
      const key = `${row[amountCol]}|${row[dateCol]}|${row[descCol] || ''}`;
      if (seen.has(key)) duplicates++;
      else seen.set(key, row._rowIndex);
    });
    if (duplicates > 0) {
      findings.push({
        severity: duplicates > 5 ? 'HIGH' : 'MEDIUM',
        type: 'potential_duplicates',
        message: `${duplicates} potential duplicate journal entries detected`,
        isa: 'ISA 240.32',
        action: 'Verify duplicates are not double-posted — check source documentation',
      });
    }

    // Benford's Law (first digit distribution)
    const firstDigits = data
      .map(r => Math.abs(typeof r[amountCol] === 'number' ? r[amountCol] : 0))
      .filter(v => v >= 10)
      .map(v => parseInt(String(v)[0]));

    if (firstDigits.length > 50) {
      const benford = [0, 0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046];
      const observed = new Array(10).fill(0);
      firstDigits.forEach(d => observed[d]++);
      const total = firstDigits.length;

      let maxDeviation = 0;
      let maxDigit = 0;
      for (let d = 1; d <= 9; d++) {
        const deviation = Math.abs(observed[d] / total - benford[d]);
        if (deviation > maxDeviation) {
          maxDeviation = deviation;
          maxDigit = d;
        }
      }

      if (maxDeviation > 0.05) {
        findings.push({
          severity: maxDeviation > 0.10 ? 'HIGH' : 'MEDIUM',
          type: 'benford_anomaly',
          message: `Benford's Law anomaly: digit ${maxDigit} deviates by ${(maxDeviation * 100).toFixed(1)}% from expected distribution`,
          isa: 'ISA 240',
          action: 'Investigate transactions with leading digit ' + maxDigit + ' — potential manipulation indicator',
        });
      }
    }

    return {
      findings,
      journalCount: data.length,
      testsPerformed: ['round_numbers', 'weekend_entries', 'duplicates', 'benford_law'],
    };
  }

  _runAnomalyDetector(ingested) {
    const findings = [];
    const { data, metadata } = ingested;

    // Find numeric columns
    const numericCols = Object.entries(metadata.columnTypes || {})
      .filter(([, type]) => type === 'number')
      .map(([col]) => col);

    numericCols.forEach(col => {
      const values = data.map(r => typeof r[col] === 'number' ? r[col] : null).filter(v => v !== null);
      if (values.length < 10) return;

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      if (std === 0) return;

      // Z-score outliers (> 3 std devs)
      const outliers = [];
      data.forEach(row => {
        const val = typeof row[col] === 'number' ? row[col] : null;
        if (val === null) return;
        const z = Math.abs((val - mean) / std);
        if (z > 3) {
          outliers.push({ rowIndex: row._rowIndex, value: val, zScore: Math.round(z * 10) / 10 });
        }
      });

      if (outliers.length > 0) {
        findings.push({
          severity: outliers.length > 5 ? 'HIGH' : 'MEDIUM',
          type: 'statistical_outlier',
          message: `${outliers.length} outliers in column "${col}" (Z-score > 3.0)`,
          isa: 'ISA 520',
          action: `Investigate outlier values in "${col}" — may indicate errors or unusual transactions`,
          detail: outliers.slice(0, 10),
        });
      }
    });

    return { findings, columnsAnalysed: numericCols.length };
  }

  _runLeadScheduleMapper(ingested) {
    const findings = [];
    const { data, metadata } = ingested;

    if (metadata.type !== 'trial_balance') {
      return { findings: [{ severity: 'INFO', message: 'Lead schedule mapping requires trial balance data' }] };
    }

    // Map account codes to FSLI categories
    const fsliMap = {
      '0': { fsli: 'FA', wp: 'D7', label: 'Fixed Assets' },
      '1': { fsli: 'CA', wp: 'D2-D6', label: 'Current Assets' },
      '10': { fsli: 'CASH', wp: 'D6', label: 'Cash and Bank' },
      '11': { fsli: 'REC', wp: 'D2', label: 'Trade Receivables' },
      '12': { fsli: 'INV', wp: 'D3', label: 'Inventory / WIP' },
      '2': { fsli: 'CL', wp: 'D4', label: 'Current Liabilities' },
      '20': { fsli: 'PAY', wp: 'D4', label: 'Trade Payables' },
      '21': { fsli: 'TAX', wp: 'D13', label: 'Tax Liabilities' },
      '3': { fsli: 'LTL', wp: 'D11', label: 'Long-term Liabilities' },
      '4': { fsli: 'REV', wp: 'D1', label: 'Revenue' },
      '5': { fsli: 'COS', wp: 'D3/D4', label: 'Cost of Sales' },
      '6': { fsli: 'ADM', wp: 'D5', label: 'Administrative Expenses' },
      '7': { fsli: 'FIN', wp: 'D11', label: 'Finance Costs' },
      '8': { fsli: 'TAX', wp: 'D13', label: 'Taxation' },
      '9': { fsli: 'EQ', wp: 'D10', label: 'Equity' },
    };

    const mapped = data.map(row => {
      const code = String(row.accountCode || '');
      const prefix2 = code.slice(0, 2);
      const prefix1 = code.slice(0, 1);
      const match = fsliMap[prefix2] || fsliMap[prefix1] || { fsli: 'UNMAPPED', wp: '?', label: 'Unmapped' };
      return { ...row, fsli: match.fsli, wp: match.wp, fsliLabel: match.label };
    });

    const unmapped = mapped.filter(r => r.fsli === 'UNMAPPED');
    if (unmapped.length > 0) {
      findings.push({
        severity: 'MEDIUM',
        type: 'unmapped_accounts',
        message: `${unmapped.length} accounts could not be mapped to FSLI codes`,
        isa: 'ISA 315',
        action: 'Review and manually map unmapped accounts to working papers',
        detail: unmapped.slice(0, 10).map(r => ({ code: r.accountCode, name: r.accountName })),
      });
    }

    // Build lead schedule summary by FSLI
    const leadSchedule = {};
    mapped.forEach(row => {
      if (!leadSchedule[row.fsli]) {
        leadSchedule[row.fsli] = { fsli: row.fsli, label: row.fsliLabel, wp: row.wp, balance: 0, accountCount: 0, accounts: [] };
      }
      leadSchedule[row.fsli].balance += row.balance || 0;
      leadSchedule[row.fsli].accountCount++;
      leadSchedule[row.fsli].accounts.push({ code: row.accountCode, name: row.accountName, balance: row.balance });
    });

    return {
      findings,
      mappedAccounts: mapped.length - unmapped.length,
      unmappedAccounts: unmapped.length,
      leadSchedule: Object.values(leadSchedule).map(ls => ({
        ...ls,
        balance: Math.round(ls.balance * 100) / 100,
        accounts: undefined, // too large for summary
      })),
    };
  }

  _runBankReconciler(ingested) {
    return {
      findings: [{
        severity: 'INFO',
        type: 'not_implemented',
        message: 'Bank reconciliation requires two files (bank statement + cashbook). Use processReconciliation() with both files.',
      }],
    };
  }

  // ─── HELPERS ─────────────────────────────────────────────────────

  _findCol(headers, patterns) {
    for (const p of patterns) {
      const idx = headers.findIndex(h => h.includes(p));
      if (idx >= 0) return idx;
    }
    return -1;
  }

  _autoSelectAgents(fileType, metadata) {
    switch (fileType) {
      case 'trial_balance':
        return ['tbAnalyser', 'leadScheduleMapper', 'anomalyDetector'];
      case 'journal_listing':
        return ['journalTester', 'anomalyDetector'];
      case 'bank_statement':
        return ['bankReconciler', 'anomalyDetector'];
      default:
        return ['anomalyDetector'];
    }
  }

  _buildSummary(ingested, agentResults) {
    const allFindings = [];
    Object.values(agentResults).forEach(r => {
      if (r.success && r.findings) allFindings.push(...r.findings);
    });

    return {
      totalFindings: allFindings.length,
      bySeverity: {
        HIGH: allFindings.filter(f => f.severity === 'HIGH').length,
        MEDIUM: allFindings.filter(f => f.severity === 'MEDIUM').length,
        LOW: allFindings.filter(f => f.severity === 'LOW').length,
        INFO: allFindings.filter(f => f.severity === 'INFO').length,
      },
      agentsRun: Object.keys(agentResults).length,
      topFindings: allFindings
        .filter(f => f.severity === 'HIGH' || f.severity === 'MEDIUM')
        .slice(0, 10),
    };
  }

  getActiveJobs() {
    return Object.fromEntries(this.activeJobs);
  }

  getProcessingLog() {
    return [...this.processingLog];
  }
}

// Singleton
export const agenticFileProcessor = new AgenticFileProcessor();
