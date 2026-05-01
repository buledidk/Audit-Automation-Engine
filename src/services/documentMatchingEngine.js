/**
 * Document Matching Engine
 * ISA 501, ISA 505, ISA 510, ISA 530 — audit evidence direction testing
 * Sheet-to-Floor / Floor-to-Sheet / 3-Way Match / Cut-Off Testing
 */

// ─── Fuzzy matching helpers ───────────────────────────────────────────────

function _amountMatch(a, b, tolerancePct = 0.01) {
  if (!a || !b) return false;
  return Math.abs(a - b) / Math.max(Math.abs(a), 1) <= tolerancePct;
}

function _dateMatch(d1, d2, windowDays = 3) {
  if (!d1 || !d2) return false;
  const diff = Math.abs(new Date(d1) - new Date(d2)) / (1000 * 60 * 60 * 24);
  return diff <= windowDays;
}

function _refMatch(r1, r2) {
  if (!r1 || !r2) return false;
  const norm = s => String(s).replace(/\s+/g, '').toUpperCase();
  return norm(r1) === norm(r2) || norm(r1).includes(norm(r2)) || norm(r2).includes(norm(r1));
}

function _matchScore(item1, item2, matchKeys) {
  let score = 0;
  let maxScore = 0;
  for (const key of matchKeys) {
    maxScore++;
    if (key === 'amount' && _amountMatch(item1.amount, item2.amount)) score++;
    else if (key === 'date'  && _dateMatch(item1.date, item2.date))     score++;
    else if (key === 'reference' && _refMatch(item1.reference, item2.reference)) score++;
    else if (item1[key] !== undefined && String(item1[key]).toUpperCase() === String(item2[key]).toUpperCase()) score++;
  }
  return maxScore > 0 ? score / maxScore : 0;
}

// ─── sheetToFloor ──────────────────────────────────────────────────────────

/**
 * Direction: GL → Physical Evidence (existence assertion)
 * Trace items from accounting records to physical/external confirmation
 * @param {Array}  glEntries         [{ id, reference, amount, date, description }]
 * @param {Array}  physicalCountData [{ id, reference, amount, date, description }]
 * @param {number} trivialThreshold
 */
export function sheetToFloor(glEntries, physicalCountData, trivialThreshold = 0) {
  const matched       = [];
  const unmatched     = [];
  const differences   = [];
  const usedPhysical  = new Set();

  for (const glItem of glEntries) {
    let bestMatch   = null;
    let bestScore   = 0;

    for (const physItem of physicalCountData) {
      if (usedPhysical.has(physItem.id)) continue;
      const score = _matchScore(glItem, physItem, ['amount', 'date', 'reference']);
      if (score > bestScore) { bestScore = score; bestMatch = physItem; }
    }

    if (bestMatch && bestScore >= 0.5) {
      usedPhysical.add(bestMatch.id);
      const diff = glItem.amount - bestMatch.amount;

      matched.push({ glItem, physicalItem: bestMatch, matchScore: bestScore, difference: diff });

      if (Math.abs(diff) > trivialThreshold) {
        differences.push({
          glItem,
          physicalItem:  bestMatch,
          difference:    diff,
          diffPct:       (diff / glItem.amount * 100).toFixed(2),
          risk:          Math.abs(diff) > trivialThreshold * 10 ? 'high' : 'medium',
          flag:          diff > 0 ? 'GL higher than physical — possible overstatement (existence risk)' : 'GL lower than physical — possible understatement',
        });
      }
    } else {
      unmatched.push({
        glItem,
        reason:     'No matching physical evidence found',
        risk:       'high',
        assertion:  'Existence',
        action:     'Obtain physical evidence or third-party confirmation (ISA 501)',
      });
    }
  }

  const unmatchedPhysical = physicalCountData.filter(p => !usedPhysical.has(p.id));

  return {
    direction:       'Sheet → Floor (Existence)',
    matched,
    unmatchedFromGL: unmatched,
    unmatchedPhysical,
    differences,
    summary: {
      total:          glEntries.length,
      matched:        matched.length,
      unmatched:      unmatched.length,
      withDifferences: differences.length,
      matchRate:      ((matched.length / (glEntries.length || 1)) * 100).toFixed(1) + '%',
    },
    isaReference: 'ISA 501 / ISA 505',
  };
}

// ─── floorToSheet ──────────────────────────────────────────────────────────

/**
 * Direction: Physical Evidence → GL (completeness assertion)
 * Start from physical evidence, trace to accounting records
 */
export function floorToSheet(physicalData, glEntries, trivialThreshold = 0) {
  const matched     = [];
  const unrecorded  = []; // in physical but not in GL
  const notVerified = []; // in GL but not physically confirmed
  const usedGL      = new Set();

  for (const physItem of physicalData) {
    let bestMatch = null;
    let bestScore = 0;

    for (const glItem of glEntries) {
      if (usedGL.has(glItem.id)) continue;
      const score = _matchScore(physItem, glItem, ['amount', 'date', 'reference']);
      if (score > bestScore) { bestScore = score; bestMatch = glItem; }
    }

    if (bestMatch && bestScore >= 0.5) {
      usedGL.add(bestMatch.id);
      matched.push({ physicalItem: physItem, glItem: bestMatch, matchScore: bestScore });
    } else {
      unrecorded.push({
        physicalItem: physItem,
        risk:         'high',
        assertion:    'Completeness',
        flag:         'Asset/item physically present but not recorded in accounting records',
        action:       'Investigate unrecorded asset — may indicate theft, off-balance sheet item, or recording error',
      });
    }
  }

  for (const glItem of glEntries) {
    if (!usedGL.has(glItem.id)) {
      notVerified.push({
        glItem,
        risk:      Math.abs(glItem.amount || 0) > trivialThreshold ? 'high' : 'medium',
        assertion: 'Existence',
        flag:      'Recorded in books but not physically verified',
        action:    'Obtain physical confirmation or written representation',
      });
    }
  }

  return {
    direction:    'Floor → Sheet (Completeness)',
    matched,
    unrecorded,
    notVerified,
    summary: {
      total:        physicalData.length,
      matched:      matched.length,
      unrecorded:   unrecorded.length,
      notVerified:  notVerified.length,
      matchRate:    ((matched.length / (physicalData.length || 1)) * 100).toFixed(1) + '%',
    },
    isaReference: 'ISA 501 / ISA 505',
  };
}

// ─── matchInternalToExternal ───────────────────────────────────────────────

/**
 * Generic matcher: GL vs bank statement, debtor ledger vs confirmation, creditor vs supplier statement
 * @param {Array}  internalData  [{ id, amount, date, reference, ... }]
 * @param {Array}  externalData  [{ id, amount, date, reference, ... }]
 * @param {Array}  matchKeys     ['amount', 'date', 'reference']
 * @param {Object} options       { amountTolerance, dateTolerance, threshold }
 */
export function matchInternalToExternal(internalData, externalData, matchKeys = ['amount', 'date', 'reference'], options = {}) {
  const { amountTolerance = 0.01, dateTolerance = 3, threshold = 0.6 } = options;
  const matched            = [];
  const unmatchedInternal  = [];
  const unmatchedExternal  = [];
  const differences        = [];
  const usedExternal       = new Set();

  for (const intItem of internalData) {
    let bestMatch = null;
    let bestScore = 0;

    for (const extItem of externalData) {
      if (usedExternal.has(extItem.id ?? JSON.stringify(extItem))) continue;
      let score = 0;
      let keys  = 0;
      for (const key of matchKeys) {
        keys++;
        if (key === 'amount'    && _amountMatch(intItem.amount, extItem.amount, amountTolerance)) score++;
        else if (key === 'date' && _dateMatch(intItem.date, extItem.date, dateTolerance))         score++;
        else if (key === 'reference' && _refMatch(intItem.reference, extItem.reference))          score++;
        else if (intItem[key] !== undefined && String(intItem[key]).toUpperCase() === String(extItem[key] ?? '').toUpperCase()) score++;
      }
      const pct = keys > 0 ? score / keys : 0;
      if (pct > bestScore) { bestScore = pct; bestMatch = extItem; }
    }

    if (bestMatch && bestScore >= threshold) {
      const uid = bestMatch.id ?? JSON.stringify(bestMatch);
      usedExternal.add(uid);
      const diff = (intItem.amount || 0) - (bestMatch.amount || 0);
      matched.push({ internalItem: intItem, externalItem: bestMatch, matchScore: bestScore, difference: diff });
      if (Math.abs(diff) > 0) differences.push({ internalItem: intItem, externalItem: bestMatch, difference: diff });
    } else {
      unmatchedInternal.push({ item: intItem, reason: 'No external match found', action: 'Investigate — potential recording error or timing difference' });
    }
  }

  for (const extItem of externalData) {
    const uid = extItem.id ?? JSON.stringify(extItem);
    if (!usedExternal.has(uid)) {
      unmatchedExternal.push({ item: extItem, reason: 'No internal match found', action: 'Investigate — possible unrecorded transaction or bank error' });
    }
  }

  return {
    matched,
    unmatchedInternal,
    unmatchedExternal,
    differences,
    matchRate: ((matched.length / (internalData.length || 1)) * 100).toFixed(1) + '%',
    summary: {
      internal:  internalData.length,
      external:  externalData.length,
      matched:   matched.length,
      unmatchedI: unmatchedInternal.length,
      unmatchedE: unmatchedExternal.length,
      diffs:      differences.length,
    },
    isaReference: 'ISA 505 / ISA 330',
  };
}

// ─── threeWayMatch ─────────────────────────────────────────────────────────

/**
 * Classic 3-way match: PO → GRN → Invoice
 * @param {Array} purchaseOrders  [{ id, ref, supplier, amount, date, items }]
 * @param {Array} grns            [{ id, ref, poRef, supplier, date, items }]
 * @param {Array} invoices        [{ id, ref, poRef, grnRef, supplier, amount, date }]
 */
export function threeWayMatch(purchaseOrders, goodsReceivedNotes, invoices) {
  const fullyMatched  = [];
  const partialMatch  = [];
  const unmatched     = [];
  const exceptions    = [];

  const grnsByPO     = {};
  const invoicesByPO = {};

  for (const grn of goodsReceivedNotes) {
    const key = String(grn.poRef || grn.ref).toUpperCase();
    if (!grnsByPO[key]) grnsByPO[key] = [];
    grnsByPO[key].push(grn);
  }

  for (const inv of invoices) {
    const key = String(inv.poRef || inv.ref).toUpperCase();
    if (!invoicesByPO[key]) invoicesByPO[key] = [];
    invoicesByPO[key].push(inv);
  }

  for (const po of purchaseOrders) {
    const key        = String(po.ref || po.id).toUpperCase();
    const matchedGRN = grnsByPO[key] || [];
    const matchedInv = invoicesByPO[key] || [];

    if (matchedGRN.length > 0 && matchedInv.length > 0) {
      const invTotal = matchedInv.reduce((s, i) => s + (i.amount || 0), 0);
      const amtDiff  = (po.amount || 0) - invTotal;

      if (Math.abs(amtDiff) < 1) {
        fullyMatched.push({ po, grns: matchedGRN, invoices: matchedInv });
      } else {
        partialMatch.push({ po, grns: matchedGRN, invoices: matchedInv, amountDiff: amtDiff });
        exceptions.push({ type: 'amount_mismatch', po, diff: amtDiff, severity: Math.abs(amtDiff) > po.amount * 0.05 ? 'high' : 'low' });
      }
    } else if (matchedGRN.length === 0) {
      unmatched.push({ po, issue: 'PO without GRN — goods may not have been received', severity: 'medium' });
      exceptions.push({ type: 'po_without_grn', po, severity: 'medium' });
    } else {
      unmatched.push({ po, issue: 'GRN received but no invoice — accrual may be required', grns: matchedGRN, severity: 'medium' });
      exceptions.push({ type: 'grn_without_invoice', po, grns: matchedGRN, severity: 'medium' });
    }
  }

  // Invoices without PO
  for (const inv of invoices) {
    const key   = String(inv.poRef || inv.ref).toUpperCase();
    const hasP0 = purchaseOrders.some(po => String(po.ref || po.id).toUpperCase() === key);
    if (!hasP0) {
      exceptions.push({ type: 'invoice_without_po', invoice: inv, severity: 'high', action: 'Obtain purchase authorisation — possible unauthorised commitment' });
    }
  }

  return {
    fullyMatched,
    partialMatch,
    unmatched,
    exceptions,
    summary: {
      pos:          purchaseOrders.length,
      grns:         goodsReceivedNotes.length,
      invoices:     invoices.length,
      fullyMatched: fullyMatched.length,
      partial:      partialMatch.length,
      unmatched:    unmatched.length,
      exceptions:   exceptions.length,
    },
    isaReference: 'ISA 315 / ISA 330 (completeness and occurrence)',
  };
}

// ─── cutoffTesting ─────────────────────────────────────────────────────────

/**
 * Select and test transactions around year-end for cut-off
 * @param {Array}  transactions  [{ id, ref, amount, invoiceDate, deliveryDate, recognitionDate, type }]
 * @param {string} yearEndDate
 * @param {number} windowDays    days before/after year-end to include
 */
export function cutoffTesting(transactions, yearEndDate, windowDays = 10) {
  const ye      = new Date(yearEndDate);
  const preStart  = new Date(ye); preStart.setDate(ye.getDate() - windowDays);
  const postEnd   = new Date(ye); postEnd.setDate(ye.getDate() + windowDays);

  const windowItems = transactions.filter(t => {
    const ref = new Date(t.invoiceDate || t.recognitionDate || t.deliveryDate);
    return ref >= preStart && ref <= postEnd;
  });

  const flags = [];

  for (const t of windowItems) {
    const invDate  = t.invoiceDate  ? new Date(t.invoiceDate)  : null;
    const delDate  = t.deliveryDate ? new Date(t.deliveryDate) : null;
    const recDate  = t.recognitionDate ? new Date(t.recognitionDate) : null;

    // Revenue cut-off: delivered pre-YE, invoiced post-YE
    if (delDate && invDate && delDate <= ye && invDate > ye) {
      flags.push({ transaction: t, type: 'revenue_cutoff', risk: 'high',
        flag: 'Delivered before year-end but invoiced after — revenue may be understated (omission)',
        assertion: 'Completeness', action: 'Verify revenue recognition date per IFRS 15 / FRS 102' });
    }

    // Expense cut-off: received pre-YE, not accrued
    if (delDate && recDate && delDate <= ye && recDate > ye && t.type === 'expense') {
      flags.push({ transaction: t, type: 'expense_cutoff', risk: 'high',
        flag: 'Goods/services received before year-end but recognised after — accrual required',
        assertion: 'Completeness', action: 'Post year-end accrual and adjust closing position' });
    }

    // Invoice pre-YE, delivery post-YE (overstatement risk)
    if (invDate && delDate && invDate <= ye && delDate > ye) {
      flags.push({ transaction: t, type: 'overstatement_risk', risk: 'medium',
        flag: 'Invoice raised before year-end but goods not yet delivered — possible overstatement',
        assertion: 'Occurrence', action: 'Confirm delivery date and review revenue recognition' });
    }
  }

  return {
    windowStart:  preStart.toISOString().split('T')[0],
    yearEnd:      yearEndDate,
    windowEnd:    postEnd.toISOString().split('T')[0],
    windowItems,
    flags,
    summary: {
      inWindow:        windowItems.length,
      flagged:         flags.length,
      highRisk:        flags.filter(f => f.risk === 'high').length,
      revenueCutoff:   flags.filter(f => f.type === 'revenue_cutoff').length,
      expenseCutoff:   flags.filter(f => f.type === 'expense_cutoff').length,
    },
    isaReference: 'ISA 501 / ISA 315 (cut-off assertion)',
  };
}
