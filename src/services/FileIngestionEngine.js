// ═══════════════════════════════════════════════════════════════
// File Ingestion Engine — Large file processing for audit data
// Handles Excel workbooks, CSV trial balances, PDF bank statements,
// and Word documents with chunked streaming and memory-safe processing
// ═══════════════════════════════════════════════════════════════

import * as XLSX from 'xlsx';

// ─── CONSTANTS ──────────────────────────────────────────────────────

const MAX_ROWS_PER_CHUNK = 5000;
const MAX_FILE_SIZE_MB = 100;
const SUPPORTED_FORMATS = ['.xlsx', '.xls', '.csv', '.tsv', '.json', '.pdf', '.docx'];

// ─── FILE INGESTION ENGINE ─────────────────────────────────────────

export class FileIngestionEngine {
  constructor() {
    this.ingestionLog = [];
    this.stats = {
      filesProcessed: 0,
      totalRowsIngested: 0,
      totalCellsExtracted: 0,
      errors: [],
    };
  }

  /**
   * Ingest a file from a browser File object or ArrayBuffer.
   * Returns structured data with metadata for agent consumption.
   *
   * @param {File|ArrayBuffer} source — the file to ingest
   * @param {Object} options — { fileName, sheetName, headerRow, maxRows, columnMap }
   * @returns {Object} { success, data, metadata, chunks, errors }
   */
  async ingestFile(source, options = {}) {
    const fileName = options.fileName || (source instanceof File ? source.name : 'unknown');
    const ext = this._getExtension(fileName);
    const startTime = Date.now();

    if (!SUPPORTED_FORMATS.includes(ext)) {
      return { success: false, error: `Unsupported format: ${ext}. Supported: ${SUPPORTED_FORMATS.join(', ')}` };
    }

    // Size check
    const sizeBytes = source instanceof File ? source.size : source.byteLength;
    const sizeMB = sizeBytes / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return { success: false, error: `File exceeds ${MAX_FILE_SIZE_MB}MB limit (${sizeMB.toFixed(1)}MB)` };
    }

    try {
      let result;
      switch (ext) {
        case '.xlsx':
        case '.xls':
          result = await this._ingestExcel(source, options);
          break;
        case '.csv':
        case '.tsv':
          result = await this._ingestDelimited(source, options, ext === '.tsv' ? '\t' : ',');
          break;
        case '.json':
          result = await this._ingestJSON(source, options);
          break;
        default:
          return { success: false, error: `Format ${ext} ingestion not yet implemented` };
      }

      const elapsed = Date.now() - startTime;
      this.stats.filesProcessed++;
      this.stats.totalRowsIngested += result.metadata.totalRows;
      this.stats.totalCellsExtracted += result.metadata.totalCells;

      this.ingestionLog.push({
        fileName,
        format: ext,
        rows: result.metadata.totalRows,
        cells: result.metadata.totalCells,
        chunks: result.chunks.length,
        elapsedMs: elapsed,
        timestamp: new Date().toISOString(),
      });

      return { success: true, ...result, elapsedMs: elapsed };
    } catch (err) {
      this.stats.errors.push({ fileName, error: err.message });
      return { success: false, error: err.message };
    }
  }

  /**
   * Ingest an Excel workbook — handles multi-sheet, large row counts.
   * Chunks data into MAX_ROWS_PER_CHUNK segments for memory-safe processing.
   */
  async _ingestExcel(source, options) {
    const buffer = source instanceof File
      ? await source.arrayBuffer()
      : source;

    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, cellNF: true });
    const sheetName = options.sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    }

    const headerRow = options.headerRow || 0;
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    // Extract headers
    const headers = jsonData[headerRow]?.map(String) || [];
    const dataRows = jsonData.slice(headerRow + 1);
    const maxRows = options.maxRows || dataRows.length;
    const trimmedRows = dataRows.slice(0, maxRows);

    // Build structured rows with column names
    const structured = trimmedRows.map((row, idx) => {
      const obj = { _rowIndex: idx + headerRow + 1 };
      headers.forEach((h, ci) => {
        if (h && row[ci] !== undefined && row[ci] !== '') {
          obj[h] = row[ci];
        }
      });
      return obj;
    }).filter(row => Object.keys(row).length > 1); // filter empty rows

    // Chunk for agent consumption
    const chunks = this._chunkArray(structured, MAX_ROWS_PER_CHUNK);

    // Auto-detect column types
    const columnTypes = this._detectColumnTypes(structured, headers);

    // Summary stats per column (for numeric columns)
    const columnStats = this._computeColumnStats(structured, headers, columnTypes);

    return {
      data: structured,
      chunks,
      metadata: {
        fileName: options.fileName,
        format: 'excel',
        sheetName,
        allSheets: workbook.SheetNames,
        headers,
        headerRow,
        totalRows: structured.length,
        totalCells: structured.reduce((acc, row) => acc + Object.keys(row).length - 1, 0),
        chunkCount: chunks.length,
        chunkSize: MAX_ROWS_PER_CHUNK,
        columnTypes,
        columnStats,
      },
    };
  }

  /**
   * Ingest CSV/TSV — streaming-friendly for large files.
   */
  async _ingestDelimited(source, options, delimiter) {
    const text = source instanceof File
      ? await source.text()
      : new TextDecoder().decode(source);

    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const headerRow = options.headerRow || 0;
    const headers = lines[headerRow].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
    const dataLines = lines.slice(headerRow + 1);
    const maxRows = options.maxRows || dataLines.length;

    const structured = dataLines.slice(0, maxRows).map((line, idx) => {
      const values = this._parseDelimitedLine(line, delimiter);
      const obj = { _rowIndex: idx + headerRow + 1 };
      headers.forEach((h, ci) => {
        if (h && values[ci] !== undefined && values[ci] !== '') {
          obj[h] = this._coerceValue(values[ci]);
        }
      });
      return obj;
    }).filter(row => Object.keys(row).length > 1);

    const chunks = this._chunkArray(structured, MAX_ROWS_PER_CHUNK);
    const columnTypes = this._detectColumnTypes(structured, headers);
    const columnStats = this._computeColumnStats(structured, headers, columnTypes);

    return {
      data: structured,
      chunks,
      metadata: {
        fileName: options.fileName,
        format: delimiter === '\t' ? 'tsv' : 'csv',
        headers,
        headerRow,
        totalRows: structured.length,
        totalCells: structured.reduce((acc, row) => acc + Object.keys(row).length - 1, 0),
        chunkCount: chunks.length,
        chunkSize: MAX_ROWS_PER_CHUNK,
        columnTypes,
        columnStats,
      },
    };
  }

  /**
   * Ingest JSON data (e.g. from API exports, Xero/Sage dumps).
   */
  async _ingestJSON(source, options) {
    const text = source instanceof File
      ? await source.text()
      : new TextDecoder().decode(source);

    let parsed = JSON.parse(text);

    // Handle nested JSON — look for arrays
    if (!Array.isArray(parsed)) {
      const arrayKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
      if (arrayKey) {
        parsed = parsed[arrayKey];
      } else {
        parsed = [parsed];
      }
    }

    const maxRows = options.maxRows || parsed.length;
    const structured = parsed.slice(0, maxRows).map((row, idx) => ({
      _rowIndex: idx,
      ...row,
    }));

    const headers = [...new Set(structured.flatMap(r => Object.keys(r).filter(k => k !== '_rowIndex')))];
    const chunks = this._chunkArray(structured, MAX_ROWS_PER_CHUNK);
    const columnTypes = this._detectColumnTypes(structured, headers);

    return {
      data: structured,
      chunks,
      metadata: {
        fileName: options.fileName,
        format: 'json',
        headers,
        totalRows: structured.length,
        totalCells: structured.reduce((acc, row) => acc + Object.keys(row).length - 1, 0),
        chunkCount: chunks.length,
        chunkSize: MAX_ROWS_PER_CHUNK,
        columnTypes,
      },
    };
  }

  // ─── TRIAL BALANCE SPECIFIC ──────────────────────────────────────

  /**
   * Specialised TB ingestion — auto-detects account code, description,
   * debit, credit columns and validates TB balances.
   */
  async ingestTrialBalance(source, options = {}) {
    const result = await this.ingestFile(source, options);
    if (!result.success) return result;

    const { data, metadata } = result;
    const headers = metadata.headers.map(h => h.toLowerCase().trim());

    // Auto-detect TB columns
    const colMap = {
      accountCode: this._findColumn(headers, ['account', 'code', 'acc', 'nominal', 'gl']),
      accountName: this._findColumn(headers, ['description', 'name', 'account name', 'nominal name']),
      debit: this._findColumn(headers, ['debit', 'dr', 'debit balance']),
      credit: this._findColumn(headers, ['credit', 'cr', 'credit balance']),
      balance: this._findColumn(headers, ['balance', 'net', 'amount', 'total']),
      priorYear: this._findColumn(headers, ['prior', 'py', 'previous', 'last year', 'prior year']),
    };

    // Map to standardised TB structure
    const tbRows = data.map(row => {
      const mapped = {
        _rowIndex: row._rowIndex,
        accountCode: colMap.accountCode ? row[metadata.headers[colMap.accountCode]] : null,
        accountName: colMap.accountName ? row[metadata.headers[colMap.accountName]] : null,
        debit: colMap.debit ? this._parseNumber(row[metadata.headers[colMap.debit]]) : 0,
        credit: colMap.credit ? this._parseNumber(row[metadata.headers[colMap.credit]]) : 0,
        balance: 0,
        priorYear: colMap.priorYear ? this._parseNumber(row[metadata.headers[colMap.priorYear]]) : null,
      };
      mapped.balance = colMap.balance
        ? this._parseNumber(row[metadata.headers[colMap.balance]])
        : mapped.debit - mapped.credit;
      return mapped;
    }).filter(r => r.accountCode || r.accountName);

    // TB validation
    const totalDebits = tbRows.reduce((sum, r) => sum + r.debit, 0);
    const totalCredits = tbRows.reduce((sum, r) => sum + r.credit, 0);
    const netBalance = tbRows.reduce((sum, r) => sum + r.balance, 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    const tbMetadata = {
      ...metadata,
      type: 'trial_balance',
      columnMapping: colMap,
      accountCount: tbRows.length,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      isBalanced,
      balanceDifference: Math.round((totalDebits - totalCredits) * 100) / 100,
    };

    return {
      success: true,
      data: tbRows,
      chunks: this._chunkArray(tbRows, MAX_ROWS_PER_CHUNK),
      metadata: tbMetadata,
      validation: {
        isBalanced,
        totalDebits: tbMetadata.totalDebits,
        totalCredits: tbMetadata.totalCredits,
        difference: tbMetadata.balanceDifference,
        warnings: isBalanced ? [] : [`TB out of balance by ${tbMetadata.balanceDifference}`],
      },
    };
  }

  // ─── AGENT-READY SUMMARISATION ───────────────────────────────────

  /**
   * Produce a compact summary suitable for AI agent context windows.
   * Reduces large datasets to key metrics the agent can reason about
   * without exceeding token limits.
   */
  summariseForAgent(ingestedData, options = {}) {
    const { data, metadata } = ingestedData;
    const maxSampleRows = options.maxSampleRows || 10;
    const maxColumns = options.maxColumns || 20;

    const headers = (metadata.headers || []).slice(0, maxColumns);
    const sampleRows = data.slice(0, maxSampleRows);

    const summary = {
      overview: {
        source: metadata.fileName,
        format: metadata.format,
        rows: metadata.totalRows,
        columns: headers.length,
        type: metadata.type || 'generic',
      },
      schema: headers.map(h => ({
        name: h,
        type: metadata.columnTypes?.[h] || 'unknown',
        stats: metadata.columnStats?.[h] || null,
      })),
      sampleData: sampleRows.map(row => {
        const sample = {};
        headers.forEach(h => {
          if (row[h] !== undefined) sample[h] = row[h];
        });
        return sample;
      }),
    };

    // Add TB-specific summary if applicable
    if (metadata.type === 'trial_balance') {
      summary.trialBalance = {
        accountCount: metadata.accountCount,
        totalDebits: metadata.totalDebits,
        totalCredits: metadata.totalCredits,
        isBalanced: metadata.isBalanced,
        difference: metadata.balanceDifference,
      };
    }

    return summary;
  }

  // ─── HELPERS ─────────────────────────────────────────────────────

  _getExtension(fileName) {
    const idx = fileName.lastIndexOf('.');
    return idx >= 0 ? fileName.slice(idx).toLowerCase() : '';
  }

  _chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push({
        index: Math.floor(i / size),
        startRow: i,
        endRow: Math.min(i + size, arr.length),
        rows: arr.slice(i, i + size),
      });
    }
    return chunks;
  }

  _parseDelimitedLine(line, delimiter) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    return values;
  }

  _coerceValue(val) {
    if (val === '' || val === null || val === undefined) return '';
    const stripped = String(val).replace(/[£$€,\s]/g, '');
    const num = Number(stripped);
    if (!isNaN(num) && stripped !== '') return num;
    return val;
  }

  _parseNumber(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const stripped = String(val).replace(/[£$€,\s()]/g, '');
    const isNeg = String(val).includes('(') && String(val).includes(')');
    const num = Number(stripped);
    if (isNaN(num)) return 0;
    return isNeg ? -Math.abs(num) : num;
  }

  _findColumn(headers, patterns) {
    for (const pattern of patterns) {
      const idx = headers.findIndex(h => h.includes(pattern));
      if (idx >= 0) return idx;
    }
    return null;
  }

  _detectColumnTypes(data, headers) {
    const types = {};
    const sample = data.slice(0, 100);
    headers.forEach(h => {
      const values = sample.map(r => r[h]).filter(v => v !== undefined && v !== '');
      if (values.length === 0) { types[h] = 'empty'; return; }
      const numCount = values.filter(v => typeof v === 'number' || (!isNaN(Number(String(v).replace(/[£$€,]/g, ''))) && String(v).replace(/[£$€,]/g, '') !== '')).length;
      const dateCount = values.filter(v => v instanceof Date || /^\d{2}[\/-]\d{2}[\/-]\d{4}/.test(String(v))).length;
      if (dateCount > values.length * 0.5) types[h] = 'date';
      else if (numCount > values.length * 0.7) types[h] = 'number';
      else types[h] = 'text';
    });
    return types;
  }

  _computeColumnStats(data, headers, types) {
    const stats = {};
    headers.forEach(h => {
      if (types[h] !== 'number') return;
      const values = data.map(r => this._parseNumber(r[h])).filter(v => v !== 0);
      if (values.length === 0) return;
      stats[h] = {
        min: Math.min(...values),
        max: Math.max(...values),
        sum: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100,
        mean: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
        count: values.length,
      };
    });
    return stats;
  }

  getStats() {
    return { ...this.stats };
  }

  getLog() {
    return [...this.ingestionLog];
  }
}

// Singleton instance
export const fileIngestionEngine = new FileIngestionEngine();
