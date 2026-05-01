// ═══════════════════════════════════════════════════════════════
// TB PIPELINE — Trial Balance Data Flow Utilities
// AuditEngine v10 AURA
// ═══════════════════════════════════════════════════════════════

/**
 * Parse an xlsx/xls file ArrayBuffer into TB rows.
 * Returns array of { code, account, py, cy }
 */
export async function parseTBXlsx(arrayBuffer) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(arrayBuffer);
  if (!wb.worksheets.length) return [];

  const allRows = [];

  // Iterate through all sheets and merge rows
  for (const ws of wb.worksheets) {
    const sheetName = ws.name;
    // Build array-of-arrays representation
    const data = [];
    ws.eachRow({ includeEmpty: true }, (row) => {
      const values = row.values || [];
      // exceljs row.values is 1-indexed; slice(1) to get 0-indexed
      const cells = values.slice(1).map(v => {
        if (v === null || v === undefined) return "";
        if (typeof v === "object" && v.result !== undefined) return v.result;
        if (typeof v === "object" && v.text !== undefined) return v.text;
        return v;
      });
      data.push(cells);
    });
    if (data.length < 2) continue;

    // Try to detect header row — look for rows containing "code" or "account" keywords
    let headerIdx = 0;
    for (let i = 0; i < Math.min(data.length, 5); i++) {
      const rowStr = data[i].map(c => String(c).toLowerCase()).join(" ");
      if (rowStr.includes("code") || rowStr.includes("account") || rowStr.includes("description") || rowStr.includes("balance")) {
        headerIdx = i;
        break;
      }
    }

    for (let i = headerIdx + 1; i < data.length; i++) {
      const cols = data[i];
      if (cols.length >= 3 && cols[0] && String(cols[0]).trim()) {
        allRows.push({
          code: String(cols[0]).trim(),
          account: String(cols[1] || "").trim(),
          py: parseFloat(cols[2]) || 0,
          cy: parseFloat(cols[3]) || 0,
          _sheet: sheetName
        });
      }
    }
  }

  return allRows;
}

/**
 * Compute mapped totals from TB data and mappings.
 * Returns { [fsliCategory]: { py, cy } }
 */
export function computeMappedTotals(tbData, tbMappings, fsliCats) {
  const cats = fsliCats || ["Revenue", "Receivables", "Inventory", "Payables", "Cash", "Fixed Assets", "Equity", "Loans", "Provisions", "Tax", "Other"];
  const totals = {};
  cats.forEach(c => { totals[c] = { py: 0, cy: 0 }; });
  tbData.forEach((r, i) => {
    const cat = tbMappings[i];
    if (cat && totals[cat]) {
      totals[cat].py += r.py;
      totals[cat].cy += r.cy;
    }
  });
  return totals;
}

/**
 * Map mapped totals to P&L lead schedule line items.
 * Returns array of { item, py, cy, wpRef } matching LEAD_SCHEDULES.pl.lines structure.
 * Only returns values for FSLI categories that map to P&L items.
 */
export function computePLLead(mappedTotals) {
  // P&L categories from FSLI
  const mapping = [
    { item: "Revenue / Turnover", fsli: "Revenue", wpRef: "D1" },
    { item: "Cost of sales", fsli: null, wpRef: "D3/D5" },
    { item: "Gross profit", fsli: null, wpRef: "" },
    { item: "Administrative expenses", fsli: null, wpRef: "D5/D7" },
    { item: "Other operating income", fsli: null, wpRef: "D1" },
    { item: "Operating profit", fsli: null, wpRef: "" },
    { item: "Interest payable", fsli: null, wpRef: "D11" },
    { item: "Interest receivable", fsli: null, wpRef: "D6" },
    { item: "Profit before tax", fsli: null, wpRef: "" },
    { item: "Taxation", fsli: "Tax", wpRef: "D13" },
    { item: "Profit after tax", fsli: null, wpRef: "" },
  ];

  return mapping.map(m => ({
    item: m.item,
    py: m.fsli && mappedTotals[m.fsli] ? mappedTotals[m.fsli].py : 0,
    cy: m.fsli && mappedTotals[m.fsli] ? mappedTotals[m.fsli].cy : 0,
    wpRef: m.wpRef,
    fromTB: !!m.fsli
  }));
}

/**
 * Map mapped totals to Balance Sheet lead schedule line items.
 */
export function computeBSLead(mappedTotals) {
  const mapping = [
    { item: "Fixed assets", fsli: "Fixed Assets", wpRef: "D7" },
    { item: "Investments", fsli: null, wpRef: "D9" },
    { item: "Stock / WIP", fsli: "Inventory", wpRef: "D3" },
    { item: "Trade debtors", fsli: "Receivables", wpRef: "D2" },
    { item: "Cash at bank", fsli: "Cash", wpRef: "D6" },
    { item: "Trade creditors", fsli: "Payables", wpRef: "D4" },
    { item: "Taxation", fsli: "Tax", wpRef: "D13" },
    { item: "Loans & borrowings", fsli: "Loans", wpRef: "D11" },
    { item: "Provisions", fsli: "Provisions", wpRef: "D12" },
    { item: "Share capital & reserves", fsli: "Equity", wpRef: "D10" },
  ];

  return mapping.map(m => ({
    item: m.item,
    py: m.fsli && mappedTotals[m.fsli] ? mappedTotals[m.fsli].py : 0,
    cy: m.fsli && mappedTotals[m.fsli] ? mappedTotals[m.fsli].cy : 0,
    wpRef: m.wpRef,
    fromTB: !!m.fsli
  }));
}

/**
 * Enhanced auto-mapping combining keyword matching with ChartOfAccounts module if available.
 */
export function enhancedAutoMap(tbRows, industryId, ChartOfAccounts) {
  const autoMap = {};

  // Phase 1: Keyword-based mapping (same as existing inline logic)
  const lowerCats = {
    Revenue: ["revenue", "sales", "turnover", "income", "fee"],
    Receivables: ["receivable", "debtor", "trade debtor", "accrued income"],
    Inventory: ["stock", "inventory", "wip", "work in progress", "raw material", "finished good"],
    Payables: ["payable", "creditor", "accrual", "trade creditor", "deferred"],
    Cash: ["cash", "bank", "deposit", "petty cash"],
    "Fixed Assets": ["fixed asset", "tangible", "property", "plant", "equipment", "motor", "furniture", "leasehold", "rou", "right-of-use", "intangible", "goodwill"],
    Equity: ["share capital", "share premium", "retained", "reserve", "profit and loss", "capital", "drawings"],
    Loans: ["loan", "borrowing", "mortgage", "overdraft", "hire purchase", "finance lease", "lease liability"],
    Provisions: ["provision", "contingent", "dilapidation", "warranty", "deferred tax"],
    Tax: ["tax", "corporation tax", "vat", "paye", "nic", "national insurance", "hmrc"]
  };

  tbRows.forEach((r, i) => {
    const accLower = r.account.toLowerCase();
    for (const [fsli, keywords] of Object.entries(lowerCats)) {
      if (keywords.some(kw => accLower.includes(kw))) {
        autoMap[i] = fsli;
        break;
      }
    }
  });

  // Phase 2: If ChartOfAccounts available, use its autoMapTrialBalance for unmapped rows
  if (ChartOfAccounts && industryId) {
    try {
      const results = ChartOfAccounts.autoMapTrialBalance(tbRows, industryId);
      if (results) {
        results.forEach((r, i) => {
          if (r.mappedFsli && !autoMap[i]) {
            autoMap[i] = r.mappedFsli;
          }
        });
      }
    } catch (e) { // eslint-disable-line no-unused-vars
      // ChartOfAccounts mapping is optional enhancement
    }
  }

  return autoMap;
}

/**
 * DR=CR reconciliation check.
 * Assumes positive values are debits and negative values are credits.
 * Returns { balanced, totalDR, totalCR, difference } for current year balances.
 */
export function reconcileTB(rows) {
  let totalDR = 0;
  let totalCR = 0;

  for (const row of rows) {
    const val = row.cy ?? 0;
    if (val >= 0) {
      totalDR += val;
    } else {
      totalCR += Math.abs(val);
    }
  }

  const difference = Math.abs(totalDR - totalCR);
  // Treat as balanced if difference is within rounding tolerance (0.01)
  const balanced = difference < 0.01;

  return {
    balanced,
    totalDR: Math.round(totalDR * 100) / 100,
    totalCR: Math.round(totalCR * 100) / 100,
    difference: Math.round(difference * 100) / 100
  };
}

/**
 * Variance analysis — computes year-on-year movement for each row
 * and flags rows where the absolute movement exceeds the materiality threshold.
 * Returns an array of enriched row objects with { ...row, movement, movementPct, flagged }.
 */
export function analyzeVariances(rows, materiality) {
  const threshold = materiality ?? 0;

  return rows.map(row => {
    const py = row.py ?? 0;
    const cy = row.cy ?? 0;
    const movement = cy - py;
    const movementPct = py !== 0 ? (movement / Math.abs(py)) * 100 : (cy !== 0 ? 100 : 0);
    const flagged = Math.abs(movement) > threshold;

    return {
      ...row,
      movement: Math.round(movement * 100) / 100,
      movementPct: Math.round(movementPct * 100) / 100,
      flagged
    };
  });
}

/**
 * Group accounts by code range (1000-1999, 2000-2999, etc.) with subtotals.
 * Returns an object keyed by range label, each containing { rangeStart, rangeEnd, accounts, subtotalPY, subtotalCY }.
 */
export function groupByCodeRange(rows) {
  const groups = {};

  for (const row of rows) {
    // Extract leading numeric portion of the account code
    const numericMatch = row.code.match(/^(\d+)/);
    if (!numericMatch) continue;

    const codeNum = parseInt(numericMatch[1], 10);
    const rangeStart = Math.floor(codeNum / 1000) * 1000;
    const rangeEnd = rangeStart + 999;
    const label = `${rangeStart}-${rangeEnd}`;

    if (!groups[label]) {
      groups[label] = {
        rangeStart,
        rangeEnd,
        accounts: [],
        subtotalPY: 0,
        subtotalCY: 0
      };
    }

    groups[label].accounts.push(row);
    groups[label].subtotalPY += row.py ?? 0;
    groups[label].subtotalCY += row.cy ?? 0;
  }

  // Round subtotals
  for (const g of Object.values(groups)) {
    g.subtotalPY = Math.round(g.subtotalPY * 100) / 100;
    g.subtotalCY = Math.round(g.subtotalCY * 100) / 100;
  }

  return groups;
}

/**
 * Detect whether a File is xlsx/xls by extension.
 */
export function isExcelFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  return ext === "xlsx" || ext === "xls";
}
