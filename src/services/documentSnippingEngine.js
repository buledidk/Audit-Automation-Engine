/**
 * Document Snipping Engine — DataSnipper-style capabilities
 * Cross-referencing, document matching, AI extraction, tie-out automation,
 * disclosure matching, and complete traceability chains
 */

// ─── 1. CROSS-REFERENCING (Snip-to-source) ───────────────────────────────

/**
 * Registry of all "snips" — links between work paper data points and source docs
 * Each snip stores where a number came from (page, position, document)
 */
class SnipRegistry {
  constructor() {
    this._snips = new Map();
    this._nextId = 1;
  }

  /**
   * Register a data point with its source location
   * @param {string} workPaperRef  e.g. 'WP-A1', 'FS-2023'
   * @param {string} fieldName     e.g. 'revenue', 'total_debtors'
   * @param {*}      value         the actual value
   * @param {Object} source        { documentId, documentName, page, coordinates, extractedText }
   */
  createSnip(workPaperRef, fieldName, value, source) {
    const id = `SNIP-${String(this._nextId++).padStart(5, '0')}`;
    const snip = {
      id,
      workPaperRef,
      fieldName,
      value,
      source: {
        documentId:    source.documentId,
        documentName:  source.documentName,
        page:          source.page || 1,
        coordinates:   source.coordinates || null,   // { x, y, width, height } for PDF highlight
        extractedText: source.extractedText || String(value),
        extractedAt:   new Date().toISOString(),
        confidence:    source.confidence || 1.0,
      },
      createdAt: new Date().toISOString(),
      verified:  false,
    };
    this._snips.set(id, snip);
    return snip;
  }

  getSnip(id) {
    return this._snips.get(id) || null;
  }

  getSnipsForWorkPaper(workPaperRef) {
    return Array.from(this._snips.values()).filter(s => s.workPaperRef === workPaperRef);
  }

  getSnipsForDocument(documentId) {
    return Array.from(this._snips.values()).filter(s => s.source.documentId === documentId);
  }

  verifySnip(id) {
    const s = this._snips.get(id);
    if (s) { s.verified = true; s.verifiedAt = new Date().toISOString(); }
    return s;
  }

  exportRegistry() {
    return Array.from(this._snips.values());
  }
}

export const globalSnipRegistry = new SnipRegistry();

// ─── 2. DOCUMENT MATCHING (GL vs source docs) ────────────────────────────

/**
 * Auto-match GL/spreadsheet data against source documents
 * Mimics DataSnipper's "Document Matcher"
 *
 * @param {Array}  extractedData   data extracted from documents [{ docId, docName, page, amount, date, reference, description }]
 * @param {Array}  workPaperData   [{ id, account, amount, date, reference, description }]
 * @param {Object} options         { tolerancePct, dateWindowDays, autoSnip }
 */
export function matchDocumentsToWorkPaper(extractedData, workPaperData, options = {}) {
  const { tolerancePct = 0.005, dateWindowDays = 3, autoSnip = true, workPaperRef = 'WP' } = options;
  const matched    = [];
  const unmatched  = [];
  const exceptions = [];
  const used       = new Set();

  for (const wpItem of workPaperData) {
    let bestMatch   = null;
    let bestScore   = 0;

    for (const docItem of extractedData) {
      if (used.has(docItem.id || JSON.stringify(docItem))) continue;

      let score = 0;
      // Amount match (most important)
      const amtDiff = Math.abs((wpItem.amount || 0) - (docItem.amount || 0));
      const amtTol  = Math.abs(wpItem.amount || 0) * tolerancePct;
      if (amtDiff <= amtTol) score += 50;
      else if (amtDiff <= amtTol * 5) score += 20;

      // Date match
      if (wpItem.date && docItem.date) {
        const diff = Math.abs(new Date(wpItem.date) - new Date(docItem.date)) / (1000 * 60 * 60 * 24);
        if (diff <= dateWindowDays) score += 30;
        else if (diff <= dateWindowDays * 3) score += 10;
      }

      // Reference match
      if (wpItem.reference && docItem.reference) {
        const norm = s => String(s).replace(/\s+/g, '').toUpperCase();
        if (norm(wpItem.reference) === norm(docItem.reference)) score += 20;
      }

      if (score > bestScore) { bestScore = score; bestMatch = docItem; }
    }

    if (bestMatch && bestScore >= 50) {
      const uid = bestMatch.id || JSON.stringify(bestMatch);
      used.add(uid);

      const result = {
        workPaperItem: wpItem,
        sourceDocument: bestMatch,
        matchScore:    bestScore,
        amountDiff:    Number(((wpItem.amount || 0) - (bestMatch.amount || 0)).toFixed(2)),
        verified:      bestScore >= 80,
      };

      if (autoSnip) {
        const snip = globalSnipRegistry.createSnip(workPaperRef, wpItem.id || wpItem.reference, wpItem.amount, {
          documentId:   bestMatch.docId || bestMatch.id,
          documentName: bestMatch.docName || 'Unknown',
          page:         bestMatch.page || 1,
          extractedText: String(bestMatch.amount),
          confidence:   bestScore / 100,
        });
        result.snipId = snip.id;
      }

      matched.push(result);

      if (Math.abs(result.amountDiff) > 0) {
        exceptions.push({ ...result, type: 'amount_difference', flag: `Work paper amount differs from source document by ${result.amountDiff}` });
      }
    } else {
      unmatched.push({ workPaperItem: wpItem, reason: 'No matching source document found', action: 'Obtain source document or explain basis of balance' });
    }
  }

  return {
    matched,
    unmatched,
    exceptions,
    summary: {
      total:      workPaperData.length,
      matched:    matched.length,
      unmatched:  unmatched.length,
      exceptions: exceptions.length,
      matchRate:  ((matched.length / (workPaperData.length || 1)) * 100).toFixed(1) + '%',
      autoSnipped: autoSnip ? matched.length : 0,
    },
  };
}

// ─── 3. AI EXTRACTION (OCR + structured data) ────────────────────────────

/**
 * Simulate AI extraction from uploaded documents
 * In production: integrate with Textract / Google Document AI / Azure Form Recognizer
 *
 * @param {string} documentType  'invoice' | 'bank_statement' | 'contract' | 'confirmation' | 'payslip'
 * @param {Object} rawContent    parsed content from OCR (lines of text with positions)
 */
export function extractStructuredData(documentType, rawContent) {
  const extractors = {
    invoice:       _extractInvoice,
    bank_statement: _extractBankStatement,
    contract:      _extractContract,
    confirmation:  _extractConfirmation,
    payslip:       _extractPayslip,
  };

  const extractor = extractors[documentType];
  if (!extractor) return { error: `Unknown document type: ${documentType}` };

  const extracted = extractor(rawContent);

  return {
    documentType,
    extractedAt: new Date().toISOString(),
    confidence:  extracted.confidence || 0.85,
    data:        extracted.data,
    rawFields:   extracted.rawFields || [],
    needsReview: (extracted.confidence || 0.85) < 0.7,
    isaReference: 'ISA 500 (Audit Evidence) — automated extraction',
  };
}

function _extractInvoice(content) {
  const lines = Array.isArray(content) ? content : (content.lines || []);
  const text  = lines.map(l => (typeof l === 'string' ? l : l.text || '')).join('\n');

  const amountMatch = text.match(/(?:total|amount due|invoice total|£)\s*[£$]?\s*([\d,]+\.?\d*)/i);
  const dateMatch   = text.match(/(?:invoice date|date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  const refMatch    = text.match(/(?:invoice no|invoice #|ref)[.:\s]+([A-Z0-9\-\/]+)/i);
  const vatMatch    = text.match(/(?:vat|tax)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);

  return {
    confidence: (amountMatch ? 0.3 : 0) + (dateMatch ? 0.3 : 0) + (refMatch ? 0.2 : 0) + 0.2,
    data: {
      amount:    amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
      date:      dateMatch  ? dateMatch[1]  : null,
      reference: refMatch   ? refMatch[1]   : null,
      vat:       vatMatch   ? parseFloat(vatMatch[1].replace(/,/g, '')) : null,
    },
    rawFields: [amountMatch?.[0], dateMatch?.[0], refMatch?.[0]].filter(Boolean),
  };
}

function _extractBankStatement(content) {
  const lines = Array.isArray(content) ? content : (content.lines || []);
  const transactions = [];

  for (const line of lines) {
    const text  = typeof line === 'string' ? line : line.text || '';
    const match = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})\s+(.+?)\s+([\d,]+\.?\d*)\s*(DR|CR)?/i);
    if (match) {
      transactions.push({
        date:        match[1],
        description: match[2].trim(),
        amount:      parseFloat(match[3].replace(/,/g, '')) * (match[4]?.toUpperCase() === 'DR' ? -1 : 1),
        type:        match[4]?.toUpperCase() || 'CR',
      });
    }
  }

  return {
    confidence: transactions.length > 0 ? 0.85 : 0.3,
    data: { transactions, transactionCount: transactions.length },
    rawFields: [],
  };
}

function _extractContract(content) {
  const text = Array.isArray(content) ? content.join('\n') : (content.text || content.lines?.join('\n') || '');
  const valueMatch    = text.match(/(?:contract value|total value|consideration)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);
  const startMatch    = text.match(/(?:commencement date|start date|from)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  const endMatch      = text.match(/(?:expiry date|end date|until|to)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  const partiesMatch  = text.match(/(?:between|party)[:\s]+([A-Za-z\s]+(?:Ltd|Limited|LLP|plc))/gi);

  return {
    confidence: 0.75,
    data: {
      contractValue: valueMatch ? parseFloat(valueMatch[1].replace(/,/g, '')) : null,
      startDate:     startMatch ? startMatch[1] : null,
      endDate:       endMatch   ? endMatch[1]   : null,
      parties:       partiesMatch || [],
    },
    rawFields: [],
  };
}

function _extractConfirmation(content) {
  const text = Array.isArray(content) ? content.join('\n') : (content.text || '');
  const balanceMatch = text.match(/(?:balance|outstanding|amount)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);
  const dateMatch    = text.match(/(?:as at|as of)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);

  return {
    confidence: balanceMatch ? 0.85 : 0.5,
    data: {
      confirmedBalance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : null,
      confirmationDate: dateMatch ? dateMatch[1] : null,
      type: 'confirmation',
    },
    rawFields: [],
  };
}

function _extractPayslip(content) {
  const text = Array.isArray(content) ? content.join('\n') : (content.text || '');
  const grossMatch = text.match(/(?:gross pay|gross)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);
  const netMatch   = text.match(/(?:net pay|take home)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);
  const taxMatch   = text.match(/(?:income tax|paye)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);
  const nicMatch   = text.match(/(?:national insurance|nic)[:\s]+[£$]?\s*([\d,]+\.?\d*)/i);

  return {
    confidence: grossMatch ? 0.85 : 0.5,
    data: {
      grossPay: grossMatch ? parseFloat(grossMatch[1].replace(/,/g, '')) : null,
      netPay:   netMatch   ? parseFloat(netMatch[1].replace(/,/g, '')) : null,
      paye:     taxMatch   ? parseFloat(taxMatch[1].replace(/,/g, '')) : null,
      nic:      nicMatch   ? parseFloat(nicMatch[1].replace(/,/g, '')) : null,
    },
    rawFields: [],
  };
}

// ─── 4. TIE-OUT AUTOMATION ───────────────────────────────────────────────

/**
 * Build complete traceability chain:
 * Financial Statement → Lead Schedule → Work Paper → Source Document
 *
 * @param {Object} financialStatement  { items: [{ name, amount }] }
 * @param {Object} leadSchedule        { items: [{ fsli, amount, workPaperRef }] }
 * @param {Map}    workPapers          Map<ref, { items: [{ description, amount, snipId }] }>
 */
export function buildTraceabilityChain(financialStatement, leadSchedule, workPapers) {
  const chain   = [];
  const gaps    = [];
  const verified = [];

  for (const fsItem of financialStatement.items || []) {
    const lsMatch = (leadSchedule.items || []).find(ls =>
      ls.fsli?.toLowerCase() === fsItem.name?.toLowerCase() ||
      Math.abs((ls.amount || 0) - (fsItem.amount || 0)) < 1
    );

    const link = {
      financialStatement: fsItem,
      leadSchedule:       lsMatch || null,
      workPaper:          null,
      sourceDocuments:    [],
      complete:           false,
      tieOut:             false,
    };

    if (lsMatch) {
      const wp = workPapers.get(lsMatch.workPaperRef);
      if (wp) {
        link.workPaper = wp;
        const wpTotal  = wp.items.reduce((s, i) => s + (i.amount || 0), 0);
        link.tieOut    = Math.abs(wpTotal - fsItem.amount) < 1;

        // Find snips for each work paper item
        for (const wpItem of (wp.items || [])) {
          if (wpItem.snipId) {
            const snip = globalSnipRegistry.getSnip(wpItem.snipId);
            if (snip) link.sourceDocuments.push(snip);
          }
        }

        link.complete = link.tieOut && link.sourceDocuments.length > 0;
      } else {
        gaps.push({ fsli: fsItem.name, issue: 'Work paper referenced but not found', severity: 'high' });
      }
    } else {
      gaps.push({ fsli: fsItem.name, issue: 'No matching lead schedule entry', severity: 'high' });
    }

    chain.push(link);
    if (link.complete) verified.push(fsItem.name);
  }

  const completePct = ((verified.length / (financialStatement.items?.length || 1)) * 100).toFixed(1);

  return {
    chain,
    gaps,
    verified,
    summary: {
      total:        financialStatement.items?.length || 0,
      complete:     verified.length,
      incomplete:   gaps.length,
      completePct:  completePct + '%',
    },
    isaReference: 'ISA 230 (Audit Documentation) — traceability chain',
  };
}

// ─── 5. DISCLOSURE MATCHING ──────────────────────────────────────────────

/**
 * Compare required disclosures (per FRS 102/IFRS) against draft financial statements
 * @param {'FRS 102'|'IFRS'|'FRS 105'|'FRS 102 small'} framework
 * @param {string} entityType   'small' | 'medium' | 'large' | 'listed' | 'micro'
 * @param {Object} actualDisclosures  { [disclosureKey]: text | boolean }
 * @param {Object} entityContext      { hasBorrowings, hasLeases, hasEmployees, hasRelatedParties, ... }
 */
export function matchDisclosures(framework, entityType, actualDisclosures, entityContext = {}) {
  const required = _getRequiredDisclosures(framework, entityType, entityContext);
  const results  = [];

  for (const req of required) {
    const actual   = actualDisclosures[req.key];
    const present  = actual !== undefined && actual !== null && actual !== false && actual !== '';
    const adequate = present && (typeof actual !== 'string' || actual.length >= (req.minLength || 10));

    results.push({
      ...req,
      present,
      adequate,
      status: !present ? 'missing' : !adequate ? 'inadequate' : 'ok',
      actualContent: actual || null,
    });
  }

  const missing    = results.filter(r => r.status === 'missing');
  const inadequate = results.filter(r => r.status === 'inadequate');

  return {
    framework,
    entityType,
    required:    required.length,
    results,
    missing,
    inadequate,
    passed:      results.filter(r => r.status === 'ok').length,
    summary: {
      total:       required.length,
      ok:          results.filter(r => r.status === 'ok').length,
      missing:     missing.length,
      inadequate:  inadequate.length,
      compliance:  (((required.length - missing.length - inadequate.length) / (required.length || 1)) * 100).toFixed(1) + '%',
    },
    isaReference: 'ISA 700 / ISA 720 — Disclosure review',
  };
}

function _getRequiredDisclosures(framework, entityType, ctx) {
  const base = [
    { key: 'accounting_policies',       description: 'Accounting policies — basis of preparation and significant policies', section: 'Notes', mandatory: true, minLength: 100 },
    { key: 'going_concern',             description: 'Going concern — basis of preparation', section: 'Notes', mandatory: true },
    { key: 'revenue_recognition',       description: 'Revenue recognition policy', section: 'Notes', mandatory: true },
    { key: 'fixed_assets_policy',       description: 'Tangible fixed assets — depreciation policy and rates', section: 'Notes', mandatory: true },
    { key: 'directors_remuneration',    description: 'Directors\' remuneration — total emoluments and highest paid', section: 'Notes', mandatory: entityType !== 'micro' },
    { key: 'related_party_transactions', description: 'Related party transactions disclosure', section: 'Notes', mandatory: ctx.hasRelatedParties },
    { key: 'post_balance_sheet_events', description: 'Post balance sheet events', section: 'Notes', mandatory: ctx.hasPostYearEndEvents },
    { key: 'contingent_liabilities',    description: 'Contingent liabilities and commitments', section: 'Notes', mandatory: ctx.hasContingencies },
    { key: 'average_employees',         description: 'Average number of employees', section: 'Notes', mandatory: entityType !== 'micro' },
  ];

  const loanDisclosures = ctx.hasBorrowings ? [
    { key: 'loans_terms',  description: 'Loan terms, interest rates, security, and repayment schedule', section: 'Notes', mandatory: true },
    { key: 'covenant_compliance', description: 'Covenant compliance confirmation', section: 'Notes', mandatory: true },
  ] : [];

  const leaseDisclosures = ctx.hasLeases ? [
    { key: 'lease_commitments', description: 'Lease commitments — minimum future payments', section: 'Notes', mandatory: true },
    { key: 'rou_assets',        description: 'Right-of-use assets and lease liabilities (IFRS 16 / FRS 102 Sec 20A)', section: 'Notes', mandatory: framework !== 'FRS 105' },
  ] : [];

  const listedExtras = entityType === 'listed' ? [
    { key: 'eps', description: 'Earnings per share (IAS 33)', section: 'Notes', mandatory: true },
    { key: 'segment_reporting', description: 'Segment reporting (IFRS 8)', section: 'Notes', mandatory: true },
  ] : [];

  return [...base, ...loanDisclosures, ...leaseDisclosures, ...listedExtras].filter(d => d.mandatory);
}

// ─── Utility: auto-generate disclosure checklist ──────────────────────────

export function generateDisclosureChecklist(framework, entityType, entityContext) {
  return _getRequiredDisclosures(framework, entityType, entityContext).map(d => ({
    ...d,
    status:   'unchecked',
    reviewer: null,
    notes:    '',
  }));
}
