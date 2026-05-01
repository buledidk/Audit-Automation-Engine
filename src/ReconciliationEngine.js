// ═══════════════════════════════════════════════════════════════
// RECONCILIATION ENGINE — Cross-Data Matching & Verification
// AuditEngine v10 AURA
// 5 reconciliation functions + Excel export
// ═══════════════════════════════════════════════════════════════

import { computeMappedTotals } from "./TBPipeline";

// ─── 1) TB TO FINANCIAL STATEMENTS ───

export function reconcileTBToFS(tbData, tbMappings, fsData) {
  const fsliCats = ["Revenue", "Receivables", "Inventory", "Payables", "Cash", "Fixed Assets", "Equity", "Loans", "Provisions", "Tax", "Other"];
  const mapped = computeMappedTotals(tbData, tbMappings, fsliCats);

  const matched = [];
  const unmatched = [];
  const differences = [];
  let totalDiff = 0;

  fsliCats.forEach(cat => {
    const tbAmount = mapped[cat] ? mapped[cat].cy : 0;
    const fsAmount = fsData && fsData[cat] ? fsData[cat] : 0;
    const diff = Math.abs(tbAmount - fsAmount);

    if (tbAmount === 0 && fsAmount === 0) return;

    const item = { category: cat, tbAmount, fsAmount, difference: tbAmount - fsAmount };

    if (diff < 1) {
      matched.push(item);
    } else {
      differences.push(item);
      totalDiff += diff;
    }
  });

  // Any FS items not in FSLI
  if (fsData) {
    Object.keys(fsData).forEach(k => {
      if (!fsliCats.includes(k)) unmatched.push({ category: k, fsAmount: fsData[k], tbAmount: 0, source: "FS only" });
    });
  }

  return {
    status: differences.length === 0 && unmatched.length === 0 ? "balanced" : totalDiff < 100 ? "differences" : "unbalanced",
    matched,
    unmatched,
    differences,
    summary: { totalMatched: matched.length, totalDifferences: differences.length, totalUnmatched: unmatched.length, netDifference: totalDiff }
  };
}


// ─── 2) BANK TO LEDGER ───

export function reconcileBankToLedger(bankData, ledgerData, toleranceDays = 3) {
  const matched = [];
  const unmatchedBank = [];
  const unmatchedLedger = [];

  const bankItems = (bankData || []).map((b, i) => ({ ...b, _idx: i, _matched: false }));
  const ledgerItems = (ledgerData || []).map((l, i) => ({ ...l, _idx: i, _matched: false }));

  bankItems.forEach(bank => {
    const bankAmount = (bank.debit || 0) - (bank.credit || 0);
    const bankDate = new Date(bank.date);

    const match = ledgerItems.find(ledger => {
      if (ledger._matched) return false;
      const ledgerAmount = (ledger.debit || 0) - (ledger.credit || 0);
      if (Math.abs(bankAmount - ledgerAmount) > 0.01) return false;

      if (bank.date && ledger.date) {
        const ledgerDate = new Date(ledger.date);
        const daysDiff = Math.abs((bankDate - ledgerDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= toleranceDays;
      }
      return true;
    });

    if (match) {
      match._matched = true;
      bank._matched = true;
      matched.push({ bank, ledger: match, matchType: "amount+date" });
    }
  });

  bankItems.filter(b => !b._matched).forEach(b => unmatchedBank.push(b));
  ledgerItems.filter(l => !l._matched).forEach(l => unmatchedLedger.push(l));

  const bankTotal = bankItems.reduce((s, b) => s + (b.debit || 0) - (b.credit || 0), 0);
  const ledgerTotal = ledgerItems.reduce((s, l) => s + (l.debit || 0) - (l.credit || 0), 0);

  return {
    status: unmatchedBank.length === 0 && unmatchedLedger.length === 0 ? "balanced" : "differences",
    matched,
    unmatched: [...unmatchedBank.map(b => ({ ...b, source: "Bank" })), ...unmatchedLedger.map(l => ({ ...l, source: "Ledger" }))],
    differences: [{ item: "Bank vs Ledger", bankTotal, ledgerTotal, difference: bankTotal - ledgerTotal }],
    summary: {
      bankItems: bankItems.length, ledgerItems: ledgerItems.length,
      matchedCount: matched.length,
      unmatchedBank: unmatchedBank.length, unmatchedLedger: unmatchedLedger.length,
      bankTotal, ledgerTotal, netDifference: bankTotal - ledgerTotal
    }
  };
}


// ─── 3) SUB-LEDGER TO CONTROL ───

export function reconcileSubLedgerToControl(subLedgerTotal, controlAccountBalance, label) {
  const diff = Math.abs(subLedgerTotal - controlAccountBalance);
  const status = diff < 1 ? "balanced" : diff < 100 ? "differences" : "unbalanced";

  return {
    status,
    matched: status === "balanced" ? [{ label, subLedgerTotal, controlAccountBalance }] : [],
    unmatched: [],
    differences: status !== "balanced" ? [{ label, subLedgerTotal, controlAccountBalance, difference: subLedgerTotal - controlAccountBalance }] : [],
    summary: { label, subLedgerTotal, controlAccountBalance, difference: subLedgerTotal - controlAccountBalance, percentageDiff: controlAccountBalance ? ((subLedgerTotal - controlAccountBalance) / controlAccountBalance * 100).toFixed(2) + "%" : "N/A" }
  };
}


// ─── 4) PAYROLL TO GL ───

export function reconcilePayrollToGL(payrollData, glPayrollAccounts) {
  const payrollTotals = (payrollData || []).reduce((t, r) => ({
    grossPay: t.grossPay + (r.grossPay || 0),
    paye: t.paye + (r.paye || 0),
    niEmployee: t.niEmployee + (r.niEmployee || 0),
    niEmployer: t.niEmployer + (r.niEmployer || 0),
    pension: t.pension + (r.pension || 0),
    netPay: t.netPay + (r.netPay || 0)
  }), { grossPay: 0, paye: 0, niEmployee: 0, niEmployer: 0, pension: 0, netPay: 0 });

  const gl = glPayrollAccounts || {};
  const matched = [];
  const differences = [];

  const checks = [
    { label: "Gross Pay / Staff Costs", payroll: payrollTotals.grossPay, gl: gl.staffCosts || 0 },
    { label: "PAYE Creditor", payroll: payrollTotals.paye, gl: gl.payeCreditor || 0 },
    { label: "NI Employee", payroll: payrollTotals.niEmployee, gl: gl.niEmployeeCreditor || 0 },
    { label: "NI Employer", payroll: payrollTotals.niEmployer, gl: gl.niCreditor || 0 },
    { label: "Pension", payroll: payrollTotals.pension, gl: gl.pensionCreditor || 0 },
    { label: "Net Pay / Wages Control", payroll: payrollTotals.netPay, gl: gl.netPayControl || 0 }
  ];

  checks.forEach(c => {
    const diff = Math.abs(c.payroll - c.gl);
    if (diff < 1) matched.push(c);
    else differences.push({ ...c, difference: c.payroll - c.gl });
  });

  return {
    status: differences.length === 0 ? "balanced" : "differences",
    matched,
    unmatched: [],
    differences,
    summary: { payrollTotals, glTotals: gl, checksPerformed: checks.length, matchedCount: matched.length, differenceCount: differences.length }
  };
}


// ─── 5) INTERCOMPANY ───

export function reconcileIntercompany(entityBalances, counterpartyBalances) {
  const matched = [];
  const unmatched = [];
  const differences = [];

  const entities = Object.keys(entityBalances || {});
  const counterparties = Object.keys(counterpartyBalances || {});

  entities.forEach(entity => {
    const balance = entityBalances[entity];
    if (counterpartyBalances && counterpartyBalances[entity] !== undefined) {
      const cpBalance = counterpartyBalances[entity];
      const diff = Math.abs(balance + cpBalance); // IC balances should net to zero
      if (diff < 1) {
        matched.push({ entity, entityBalance: balance, counterpartyBalance: cpBalance });
      } else {
        differences.push({ entity, entityBalance: balance, counterpartyBalance: cpBalance, difference: balance + cpBalance });
      }
    } else {
      unmatched.push({ entity, balance, source: "Entity — no counterparty match" });
    }
  });

  counterparties.forEach(cp => {
    if (!entityBalances || entityBalances[cp] === undefined) {
      unmatched.push({ entity: cp, balance: counterpartyBalances[cp], source: "Counterparty — no entity match" });
    }
  });

  return {
    status: differences.length === 0 && unmatched.length === 0 ? "balanced" : "differences",
    matched,
    unmatched,
    differences,
    summary: { totalEntities: entities.length, matchedCount: matched.length, differenceCount: differences.length, unmatchedCount: unmatched.length }
  };
}


// ─── EXCEL EXPORT ───

export async function exportReconciliation(reconResult, reconType, ctx) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const labels = {
    tbToFS: "TB to FS Reconciliation",
    bankToLedger: "Bank to Ledger Reconciliation",
    subLedger: "Sub-Ledger to Control",
    payroll: "Payroll to GL Reconciliation",
    intercompany: "Intercompany Reconciliation"
  };

  // Cover sheet
  const cover = [
    ["RECONCILIATION REPORT"],
    [],
    ["Type", labels[reconType] || reconType],
    ["Entity", ctx?.entityName || ""],
    ["FYE", ctx?.fye || ""],
    ["Status", reconResult.status.toUpperCase()],
    ["Generated", new Date().toISOString().slice(0, 10)],
    ["Generated by", "AuditEngine v10 AURA"]
  ];
  addSheet(XLSX, wb, "Cover", cover);

  // Matched sheet
  if (reconResult.matched.length) {
    const mHeaders = Object.keys(reconResult.matched[0]);
    const mData = [mHeaders.map(h => h.charAt(0).toUpperCase() + h.slice(1)), ...reconResult.matched.map(m => mHeaders.map(h => formatVal(m[h])))];
    addSheet(XLSX, wb, "Matched", mData);
  }

  // Unmatched sheet
  if (reconResult.unmatched.length) {
    const uHeaders = Object.keys(reconResult.unmatched[0]);
    const uData = [uHeaders.map(h => h.charAt(0).toUpperCase() + h.slice(1)), ...reconResult.unmatched.map(u => uHeaders.map(h => formatVal(u[h])))];
    addSheet(XLSX, wb, "Unmatched", uData);
  }

  // Differences sheet
  if (reconResult.differences.length) {
    const dHeaders = Object.keys(reconResult.differences[0]);
    const dData = [dHeaders.map(h => h.charAt(0).toUpperCase() + h.slice(1)), ...reconResult.differences.map(d => dHeaders.map(h => formatVal(d[h])))];
    addSheet(XLSX, wb, "Differences", dData);
  }

  // Summary sheet
  const summaryRows = [["Summary"]];
  if (reconResult.summary) {
    Object.entries(reconResult.summary).forEach(([k, v]) => {
      summaryRows.push([k.replace(/([A-Z])/g, " $1").trim(), formatVal(v)]);
    });
  }
  addSheet(XLSX, wb, "Summary", summaryRows);

  // Download
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (ctx?.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_" + (reconType || "Reconciliation") + "_" + new Date().toISOString().slice(0, 10) + ".xlsx";
  a.click();
  URL.revokeObjectURL(a.href);
}

function addSheet(XLSX, wb, name, aoa) {
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const colWidths = [];
  aoa.forEach(row => row.forEach((cell, ci) => {
    const len = String(cell || "").length;
    colWidths[ci] = Math.max(colWidths[ci] || 8, Math.min(len + 2, 45));
  }));
  ws["!cols"] = colWidths.map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

function formatVal(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return v;
}


// ═══════════════════════════════════════════════════════════════
// ENHANCED RECONCILIATION FUNCTIONS
// Three-way bank rec, typed sub-ledger, payroll breakdowns,
// intercompany with net difference, CSV export
// ═══════════════════════════════════════════════════════════════


// ─── 1E) TB TO FS (FSLI-TOTAL COMPARISON) ───

export function reconcileTBToFSByTotals(tbData, tbMappings, fsData) {
  const fsliCategories = [
    "Revenue", "Cost of Sales", "Gross Profit", "Operating Expenses",
    "Administrative Expenses", "Distribution Costs", "Finance Costs",
    "Tax", "Other Income", "Fixed Assets", "Current Assets",
    "Cash", "Receivables", "Inventory", "Payables", "Loans",
    "Provisions", "Equity", "Retained Earnings"
  ];

  const mapped = computeMappedTotals(tbData, tbMappings, fsliCategories);
  const matched = [];
  const differences = [];
  let totalDifference = 0;

  fsliCategories.forEach(cat => {
    const tbTotal = mapped[cat] ? (mapped[cat].cy || 0) : 0;
    const fsLine = fsData && fsData[cat] !== undefined ? fsData[cat] : null;

    if (fsLine === null && tbTotal === 0) return;

    const fsAmount = fsLine !== null ? fsLine : 0;
    const diff = tbTotal - fsAmount;

    if (Math.abs(diff) < 0.01) {
      matched.push({ fsli: cat, tbTotal, fsAmount, difference: 0 });
    } else {
      differences.push({ fsli: cat, tbTotal, fsAmount, difference: diff });
      totalDifference += diff;
    }
  });

  // Catch FS lines not in the standard FSLI list
  if (fsData) {
    Object.keys(fsData).forEach(key => {
      if (!fsliCategories.includes(key)) {
        const fsAmount = fsData[key];
        differences.push({ fsli: key, tbTotal: 0, fsAmount, difference: -fsAmount });
        totalDifference -= fsAmount;
      }
    });
  }

  return { matched, differences, totalDifference };
}


// ─── 2E) THREE-WAY BANK RECONCILIATION ───

export function reconcileBankToLedgerThreeWay(bankStatements, cashBookEntries, tbBankBalance) {
  // Bank statement closing balance (bank convention: credits increase balance, debits decrease)
  const bankBalance = (bankStatements || []).reduce((sum, txn) => {
    return sum + (txn.credit || 0) - (txn.debit || 0);
  }, 0);

  // Cash book balance from entries (same sign convention as bank for comparison)
  const cashBookBalance = (cashBookEntries || []).reduce((sum, entry) => {
    return sum + (entry.credit || 0) - (entry.debit || 0);
  }, 0);

  const tbBalance = tbBankBalance || 0;

  // Identify outstanding items (in cash book but not on bank statement)
  const bankRefs = new Set((bankStatements || []).map(t => t.reference).filter(Boolean));
  const cashRefs = new Set((cashBookEntries || []).map(e => e.reference).filter(Boolean));

  const outstandingItems = [];

  // Unpresented cheques / payments — in cash book but not on bank
  (cashBookEntries || []).forEach(entry => {
    if (entry.reference && !bankRefs.has(entry.reference)) {
      outstandingItems.push({
        type: "unpresented",
        reference: entry.reference,
        date: entry.date,
        amount: (entry.debit || 0) - (entry.credit || 0),
        description: entry.description || entry.narration || ""
      });
    }
  });

  // Outstanding lodgements — on bank but not in cash book
  (bankStatements || []).forEach(txn => {
    if (txn.reference && !cashRefs.has(txn.reference)) {
      outstandingItems.push({
        type: "outstanding_lodgement",
        reference: txn.reference,
        date: txn.date,
        amount: (txn.credit || 0) - (txn.debit || 0),
        description: txn.description || txn.narration || ""
      });
    }
  });

  const bankVsCashBook = Math.abs(bankBalance - cashBookBalance) < 0.01;
  const cashBookVsTB = Math.abs(cashBookBalance - tbBalance) < 0.01;
  const reconciled = bankVsCashBook && cashBookVsTB;

  return {
    bankBalance,
    cashBookBalance,
    tbBalance,
    reconciled,
    outstandingItems
  };
}


// ─── 3E) SUB-LEDGER TO CONTROL ACCOUNT (TYPED) ───

export function reconcileSubLedgerToControlTyped(subLedgerTotal, controlAccountBalance, type) {
  const difference = subLedgerTotal - controlAccountBalance;
  const reconciled = Math.abs(difference) < 0.01;

  const items = [];

  if (!reconciled) {
    items.push({
      type: type || "unknown",
      description: type === "AR"
        ? "Accounts Receivable sub-ledger vs control account"
        : type === "AP"
          ? "Accounts Payable sub-ledger vs control account"
          : "Sub-ledger vs control account (" + (type || "unspecified") + ")",
      subLedgerTotal,
      controlAccountBalance,
      variance: difference
    });
  }

  return {
    subTotal: subLedgerTotal,
    controlBalance: controlAccountBalance,
    difference,
    reconciled,
    items
  };
}


// ─── 4E) PAYROLL TO GL WITH BREAKDOWNS ───

export function reconcilePayrollToGLDetailed(payrollSummary, glEntries) {
  const payroll = payrollSummary || {};
  const gl = glEntries || {};

  const grossPay = payroll.gross || payroll.grossPay || 0;
  const paye = payroll.paye || payroll.PAYE || 0;
  const ni = payroll.ni || payroll.NI || payroll.nationalInsurance || 0;
  const pension = payroll.pension || 0;
  const netPay = payroll.net || payroll.netPay || 0;

  const glStaffCosts = gl.staffCosts || gl.grossPay || 0;
  const glPAYE = gl.payeCreditor || gl.paye || 0;
  const glNI = gl.niCreditor || gl.ni || 0;
  const glPension = gl.pensionCreditor || gl.pension || 0;
  const glNet = gl.netPayControl || gl.netPay || 0;

  const payrollTotal = grossPay;
  const glTotal = glStaffCosts;

  const breakdowns = [
    { component: "Gross Pay / Staff Costs", payrollAmount: grossPay, glAmount: glStaffCosts, difference: grossPay - glStaffCosts },
    { component: "PAYE", payrollAmount: paye, glAmount: glPAYE, difference: paye - glPAYE },
    { component: "National Insurance", payrollAmount: ni, glAmount: glNI, difference: ni - glNI },
    { component: "Pension", payrollAmount: pension, glAmount: glPension, difference: pension - glPension },
    { component: "Net Pay", payrollAmount: netPay, glAmount: glNet, difference: netPay - glNet }
  ];

  const difference = breakdowns.reduce((sum, b) => sum + Math.abs(b.difference), 0);

  return {
    payrollTotal,
    glTotal,
    difference,
    breakdowns
  };
}


// ─── 5E) INTERCOMPANY WITH NET DIFFERENCE ───

export function reconcileIntercompanyDetailed(parentEntries, subEntries) {
  const parentItems = parentEntries || [];
  const subItems = subEntries || [];

  const matched = [];
  const unmatched = [];
  let netDifference = 0;

  const subUsed = new Set();

  // Match parent entries to subsidiary entries
  parentItems.forEach(parent => {
    const parentRef = parent.reference || parent.entity || parent.counterparty;
    const parentAmount = parent.amount || parent.balance || 0;

    const matchIdx = subItems.findIndex((sub, idx) => {
      if (subUsed.has(idx)) return false;
      const subRef = sub.reference || sub.entity || sub.counterparty;
      const subAmount = sub.amount || sub.balance || 0;

      // Intercompany balances should be equal and opposite
      const refMatch = parentRef && subRef && (parentRef === subRef || parent.entity === sub.counterparty);
      const amountMatch = Math.abs(parentAmount + subAmount) < 0.01;

      return refMatch && amountMatch;
    });

    if (matchIdx >= 0) {
      subUsed.add(matchIdx);
      const sub = subItems[matchIdx];
      matched.push({
        parentEntity: parent.entity || parentRef,
        subEntity: sub.entity || sub.reference || sub.counterparty,
        parentBalance: parentAmount,
        subBalance: sub.amount || sub.balance || 0,
        status: "matched"
      });
    } else {
      unmatched.push({
        source: "parent",
        entity: parent.entity || parentRef,
        amount: parentAmount,
        description: parent.description || ""
      });
      netDifference += parentAmount;
    }
  });

  // Unmatched subsidiary entries
  subItems.forEach((sub, idx) => {
    if (!subUsed.has(idx)) {
      const subAmount = sub.amount || sub.balance || 0;
      unmatched.push({
        source: "subsidiary",
        entity: sub.entity || sub.reference || sub.counterparty,
        amount: subAmount,
        description: sub.description || ""
      });
      netDifference += subAmount;
    }
  });

  return {
    matched,
    unmatched,
    netDifference
  };
}


// ─── 6E) CSV EXPORT ───

export function exportReconciliationCSV(reconcResult, type, entityName) {
  const lines = [];

  // Header
  lines.push("Reconciliation Report");
  lines.push("Type," + csvEscape(type || ""));
  lines.push("Entity," + csvEscape(entityName || ""));
  lines.push("Generated," + new Date().toISOString().slice(0, 10));
  lines.push("");

  // Matched section
  if (reconcResult.matched && reconcResult.matched.length > 0) {
    lines.push("MATCHED ITEMS");
    const headers = Object.keys(reconcResult.matched[0]);
    lines.push(headers.map(csvEscape).join(","));
    reconcResult.matched.forEach(row => {
      lines.push(headers.map(h => csvEscape(row[h])).join(","));
    });
    lines.push("");
  }

  // Differences section
  if (reconcResult.differences && reconcResult.differences.length > 0) {
    lines.push("DIFFERENCES");
    const headers = Object.keys(reconcResult.differences[0]);
    lines.push(headers.map(csvEscape).join(","));
    reconcResult.differences.forEach(row => {
      lines.push(headers.map(h => csvEscape(row[h])).join(","));
    });
    lines.push("");
  }

  // Unmatched section
  if (reconcResult.unmatched && reconcResult.unmatched.length > 0) {
    lines.push("UNMATCHED ITEMS");
    const headers = Object.keys(reconcResult.unmatched[0]);
    lines.push(headers.map(csvEscape).join(","));
    reconcResult.unmatched.forEach(row => {
      lines.push(headers.map(h => csvEscape(row[h])).join(","));
    });
    lines.push("");
  }

  // Breakdowns section (for payroll)
  if (reconcResult.breakdowns && reconcResult.breakdowns.length > 0) {
    lines.push("BREAKDOWNS");
    const headers = Object.keys(reconcResult.breakdowns[0]);
    lines.push(headers.map(csvEscape).join(","));
    reconcResult.breakdowns.forEach(row => {
      lines.push(headers.map(h => csvEscape(row[h])).join(","));
    });
    lines.push("");
  }

  // Outstanding items section (for bank rec)
  if (reconcResult.outstandingItems && reconcResult.outstandingItems.length > 0) {
    lines.push("OUTSTANDING ITEMS");
    const headers = Object.keys(reconcResult.outstandingItems[0]);
    lines.push(headers.map(csvEscape).join(","));
    reconcResult.outstandingItems.forEach(row => {
      lines.push(headers.map(h => csvEscape(row[h])).join(","));
    });
    lines.push("");
  }

  // Summary values
  if (reconcResult.totalDifference !== undefined) {
    lines.push("SUMMARY");
    lines.push("Total Difference," + reconcResult.totalDifference);
  }
  if (reconcResult.netDifference !== undefined) {
    lines.push("Net Difference," + reconcResult.netDifference);
  }
  if (reconcResult.reconciled !== undefined) {
    lines.push("Reconciled," + reconcResult.reconciled);
  }
  if (reconcResult.bankBalance !== undefined) {
    lines.push("Bank Balance," + reconcResult.bankBalance);
    lines.push("Cash Book Balance," + (reconcResult.cashBookBalance || 0));
    lines.push("TB Balance," + (reconcResult.tbBalance || 0));
  }
  if (reconcResult.subTotal !== undefined) {
    lines.push("Sub-Ledger Total," + reconcResult.subTotal);
    lines.push("Control Balance," + reconcResult.controlBalance);
  }
  if (reconcResult.payrollTotal !== undefined) {
    lines.push("Payroll Total," + reconcResult.payrollTotal);
    lines.push("GL Total," + reconcResult.glTotal);
  }

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  return blob;
}

function csvEscape(val) {
  if (val === null || val === undefined) return "";
  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
