// ═══════════════════════════════════════════════════════════════
// INTEGRATIONS ENGINE — Platform Connectors, CSV Parsers, Validation
// AuditEngine v10 AURA
// 10 UK accounting platform connectors, template library,
// Companies House lookup, journal export, compatibility matrix
// ═══════════════════════════════════════════════════════════════

import { extractFromCSV, extractFromExcel } from "./DataExtractor";

// ─── A) CONNECTORS ARRAY ───

const CONNECTORS = [
  {
    id: "sage", name: "Sage 50/200/Cloud", logo: "🌿", category: "Accounting",
    apiDocsUrl: "https://developer.sage.com/accounting/", authMethod: "OAuth2", country: "UK",
    exportFormats: ["CSV", "Excel"], dataTypes: ["trialBalance", "arAging", "apAging", "bank", "fixedAssets"],
    columnMaps: {
      trialBalance: { code: ["N/C", "Nominal Code", "Account Code", "NC"], account: ["Name", "Account Name", "Description"], debit: ["Debit", "Dr", "Debit Balance"], credit: ["Credit", "Cr", "Credit Balance"] },
      arAging: { customer: ["Customer", "Account Name", "A/C Name"], amount: ["Balance", "Amount", "Outstanding"], current: ["Current"], days30: ["30 Days", "Period 1"], days60: ["60 Days", "Period 2"], days90: ["90 Days", "Period 3"] },
      apAging: { supplier: ["Supplier", "Account Name", "A/C Name"], amount: ["Balance", "Amount", "Outstanding"], current: ["Current"], days30: ["30 Days", "Period 1"], days60: ["60 Days", "Period 2"], days90: ["90 Days", "Period 3"] },
      bank: { date: ["Date", "Tran Date"], reference: ["Reference", "Ref", "No."], description: ["Details", "Description", "Narrative"], debit: ["Debit", "Payment"], credit: ["Credit", "Receipt"], balance: ["Balance", "Running Balance"] }
    },
    nominalRanges: { revenue: [4000, 4999], expenses: [5000, 8999], assets: [0, 999], liabilities: [2000, 2999], equity: [3000, 3999] },
    parseExport(rows, headers, dataType) { return parsePlatformRows(this, rows, headers, dataType); },
    fsliMapper(parsedRows) { return mapSageToFSLI(parsedRows, this.nominalRanges); }
  },
  {
    id: "xero", name: "Xero", logo: "💙", category: "Accounting",
    apiDocsUrl: "https://developer.xero.com/documentation/", authMethod: "OAuth2", country: "UK/Global",
    exportFormats: ["CSV", "Excel", "PDF"], dataTypes: ["trialBalance", "arAging", "apAging", "bank", "fixedAssets"],
    columnMaps: {
      trialBalance: { code: ["Account Code", "Code", "Account"], account: ["Account", "Account Name", "Name"], debit: ["Debit", "YTD Debit"], credit: ["Credit", "YTD Credit"], accountType: ["Account Type", "Type"] },
      arAging: { customer: ["Contact", "Customer", "Name"], amount: ["Total", "Amount"], current: ["Current", "<1 Month"], days30: ["1 Month", "1-30 Days"], days60: ["2 Months", "31-60 Days"], days90: ["3 Months", "61-90 Days"] },
      bank: { date: ["Date"], reference: ["Reference", "Check No."], description: ["Description", "Payee"], debit: ["Spent", "Debit"], credit: ["Received", "Credit"], balance: ["Balance", "Running Balance"] }
    },
    accountTypeMap: { REVENUE: "Revenue", EXPENSE: "Expenses", CURRENT: "Cash", CURRLIAB: "Payables", FIXED: "Fixed Assets", EQUITY: "Equity", BANK: "Cash", OTHERINCOME: "Revenue", DIRECTCOSTS: "Expenses", OVERHEADS: "Expenses", TERMLIAB: "Loans" },
    parseExport(rows, headers, dataType) { return parsePlatformRows(this, rows, headers, dataType); },
    fsliMapper(parsedRows) {
      return parsedRows.map(r => {
        const typeKey = (r._accountType || "").toUpperCase().replace(/\s+/g, "");
        return { ...r, fsli: this.accountTypeMap[typeKey] || "Other" };
      });
    }
  },
  {
    id: "quickbooks", name: "QuickBooks Online", logo: "🟢", category: "Accounting",
    apiDocsUrl: "https://developer.intuit.com/app/developer/qbo/docs/", authMethod: "OAuth2", country: "UK/Global",
    exportFormats: ["CSV", "Excel", "PDF"], dataTypes: ["trialBalance", "arAging", "apAging", "bank"],
    columnMaps: {
      trialBalance: { code: ["Account", "Account #", "Account Number"], account: ["Account", "Account Name"], debit: ["Debit", "Debit Amount"], credit: ["Credit", "Credit Amount"] },
      arAging: { customer: ["Customer", "Name"], amount: ["Total", "Amount"], current: ["Current"], days30: ["1-30", "1 - 30"], days60: ["31-60", "31 - 60"], days90: ["61-90", "61 - 90"] },
      bank: { date: ["Date", "Transaction Date"], description: ["Description", "Memo"], debit: ["Payment", "Debit"], credit: ["Deposit", "Credit"], balance: ["Balance"] }
    },
    parseExport(rows, headers, dataType) { return parsePlatformRows(this, rows, headers, dataType); },
    fsliMapper(parsedRows) { return parsedRows.map(r => ({ ...r, fsli: guessKeywordFSLI(r.account) })); }
  },
  {
    id: "netsuite", name: "Oracle NetSuite", logo: "🔶", category: "ERP",
    apiDocsUrl: "https://docs.oracle.com/en/cloud/saas/netsuite/", authMethod: "Token-Based Auth", country: "Global",
    exportFormats: ["CSV", "Excel"], dataTypes: ["trialBalance", "arAging", "apAging", "bank", "fixedAssets", "payroll"],
    columnMaps: {
      trialBalance: { code: ["Account Number", "Account #", "Acct. #"], account: ["Account Name", "Account", "Description"], debit: ["Debit", "Debit Amount"], credit: ["Credit", "Credit Amount"], accountType: ["Account Type", "Type"], subsidiary: ["Subsidiary", "Sub"] },
      arAging: { customer: ["Customer", "Entity"], amount: ["Amount Due", "Total"], current: ["Current"], days30: ["1-30 Days"], days60: ["31-60 Days"], days90: ["61-90 Days"], days120: ["91+ Days", "Over 90 Days"] }
    },
    parseExport(rows, headers, dataType) { return parsePlatformRows(this, rows, headers, dataType); },
    fsliMapper(parsedRows) { return parsedRows.map(r => ({ ...r, fsli: guessKeywordFSLI(r.account) })); }
  },
  {
    id: "freeagent", name: "FreeAgent", logo: "🟤", category: "Accounting",
    apiDocsUrl: "https://dev.freeagent.com/docs/", authMethod: "OAuth2", country: "UK",
    exportFormats: ["CSV"], dataTypes: ["trialBalance", "bank"],
    columnMaps: {
      trialBalance: { code: ["Category", "Account"], account: ["Category", "Description"], amount: ["Amount", "Balance", "Value"] },
      bank: { date: ["Date"], description: ["Description", "Explanation"], amount: ["Amount", "Value"] }
    },
    parseExport(rows, headers, dataType) {
      if (dataType === "trialBalance") {
        const mapped = parseSingleAmountRows(this, rows, headers);
        return { rows: mapped, totals: calcTotals(mapped), warnings: [] };
      }
      return parsePlatformRows(this, rows, headers, dataType);
    },
    fsliMapper(parsedRows) { return parsedRows.map(r => ({ ...r, fsli: guessKeywordFSLI(r.account) })); }
  },
  {
    id: "iris", name: "IRIS Accountancy", logo: "🟣", category: "Accounting",
    apiDocsUrl: "https://www.iris.co.uk/", authMethod: "Manual Export", country: "UK",
    exportFormats: ["CSV", "Excel"], dataTypes: ["trialBalance", "fixedAssets"],
    columnMaps: {
      trialBalance: { code: ["Code", "Nominal Code", "Nom Code"], account: ["Description", "Account Name", "Name"], debit: ["Debit", "Dr"], credit: ["Credit", "Cr"] },
      fixedAssets: { assetId: ["Asset Code", "ID"], description: ["Description", "Asset Name"], cost: ["Cost", "Original Cost"], depreciation: ["Accum Dep", "Depreciation"], nbv: ["NBV", "Net Book Value"] }
    },
    parseExport(rows, headers, dataType) { return parsePlatformRows(this, rows, headers, dataType); },
    fsliMapper(parsedRows) { return parsedRows.map(r => ({ ...r, fsli: guessKeywordFSLI(r.account) })); }
  },
  {
    id: "moneysoft", name: "Moneysoft Payroll", logo: "💰", category: "Payroll",
    apiDocsUrl: "https://www.moneysoft.co.uk/", authMethod: "Manual Export", country: "UK",
    exportFormats: ["CSV"], dataTypes: ["payroll"],
    columnMaps: {
      payroll: { employee: ["Employee", "Name", "Employee Name"], grossPay: ["Gross Pay", "Gross", "Total Gross"], paye: ["Tax", "PAYE", "Income Tax"], niEmployee: ["NI EE", "NI Employee", "Employee NI"], niEmployer: ["NI ER", "NI Employer", "Employer NI"], pension: ["Pension", "Pension EE"], netPay: ["Net Pay", "Net", "Take Home"] }
    },
    parseExport(rows, headers) {
      const colMap = resolveColumns(this.columnMaps.payroll, headers);
      const parsed = rows.filter(r => r[colMap.employee]).map(r => ({
        employee: str(r[colMap.employee]),
        grossPay: num(r[colMap.grossPay]),
        paye: num(r[colMap.paye]),
        niEmployee: num(r[colMap.niEmployee]),
        niEmployer: num(r[colMap.niEmployer]),
        pension: num(r[colMap.pension]),
        netPay: num(r[colMap.netPay])
      }));
      const totals = parsed.reduce((t, r) => ({ grossPay: t.grossPay + r.grossPay, paye: t.paye + r.paye, niEmployee: t.niEmployee + r.niEmployee, niEmployer: t.niEmployer + r.niEmployer, pension: t.pension + r.pension, netPay: t.netPay + r.netPay }), { grossPay: 0, paye: 0, niEmployee: 0, niEmployer: 0, pension: 0, netPay: 0 });
      const warnings = [];
      parsed.forEach(r => {
        const expected = r.grossPay - r.paye - r.niEmployee - (r.pension || 0);
        if (Math.abs(expected - r.netPay) > 1) warnings.push(`${r.employee}: Net pay £${r.netPay} != expected £${expected.toFixed(2)}`);
      });
      return { rows: parsed, totals, warnings };
    },
    fsliMapper(parsedRows) { return parsedRows; }
  },
  {
    id: "dext", name: "Dext (Receipt Bank)", logo: "📸", category: "Document Capture",
    apiDocsUrl: "https://help.dext.com/", authMethod: "API Key", country: "UK/Global",
    exportFormats: ["CSV", "Excel"], dataTypes: ["apInvoices", "expenses"],
    columnMaps: {
      apInvoices: { date: ["Date", "Invoice Date", "Document Date"], supplier: ["Supplier", "Merchant", "Vendor"], amount: ["Amount", "Total", "Net Amount"], category: ["Category", "Account", "Nominal Code"], vat: ["VAT", "Tax", "Tax Amount"] }
    },
    parseExport(rows, headers) {
      const colMap = resolveColumns(this.columnMaps.apInvoices, headers);
      const parsed = rows.filter(r => r[colMap.supplier] || r[colMap.amount]).map(r => ({
        date: str(r[colMap.date]),
        supplier: str(r[colMap.supplier]),
        amount: num(r[colMap.amount]),
        category: str(r[colMap.category]),
        vat: num(r[colMap.vat])
      }));
      return { rows: parsed, totals: { total: parsed.reduce((s, r) => s + r.amount, 0), vat: parsed.reduce((s, r) => s + r.vat, 0) }, warnings: [] };
    },
    fsliMapper(parsedRows) { return parsedRows; }
  },
  {
    id: "companieshouse", name: "Companies House", logo: "🏛️", category: "Registry",
    apiDocsUrl: "https://developer.company-information.service.gov.uk/", authMethod: "API Key (Free)", country: "UK",
    exportFormats: ["API"], dataTypes: ["companyProfile", "directors", "filingHistory"],
    columnMaps: {},
    parseExport() { return { rows: [], totals: {}, warnings: ["Use lookupCompaniesHouse() for this connector"] }; },
    fsliMapper(parsedRows) { return parsedRows; }
  },
  {
    id: "hmrc_mtd", name: "HMRC Making Tax Digital", logo: "🇬🇧", category: "Tax/VAT",
    apiDocsUrl: "https://developer.service.hmrc.gov.uk/api-documentation", authMethod: "OAuth2 (Gov Gateway)", country: "UK",
    exportFormats: ["API", "CSV"], dataTypes: ["vatReturn", "vatObligations"],
    columnMaps: {
      vatReturn: { period: ["Period", "VAT Period"], outputTax: ["Output Tax", "Box 1", "VAT Due Sales"], inputTax: ["Input Tax", "Box 4", "VAT Reclaimed"], netVAT: ["Net VAT", "Box 5", "Net VAT Due"], totalSales: ["Total Sales", "Box 6"], totalPurchases: ["Total Purchases", "Box 7"] }
    },
    parseExport(rows, headers, dataType) {
      if (dataType === "vatReturn") {
        const colMap = resolveColumns(this.columnMaps.vatReturn, headers);
        const parsed = rows.map(r => ({
          period: str(r[colMap.period]),
          outputTax: num(r[colMap.outputTax]),
          inputTax: num(r[colMap.inputTax]),
          netVAT: num(r[colMap.netVAT]),
          totalSales: num(r[colMap.totalSales]),
          totalPurchases: num(r[colMap.totalPurchases])
        }));
        return { rows: parsed, totals: {}, warnings: [] };
      }
      return { rows: [], totals: {}, warnings: [] };
    },
    fsliMapper(parsedRows) { return parsedRows; }
  }
];

// ─── HELPER FUNCTIONS ───

function str(v) { return v != null ? String(v).trim() : ""; }
function num(v) {
  if (v == null || v === "") return 0;
  let s = String(v).trim();
  // Handle bracket-negatives: (1,234.56) → -1234.56
  if (s.startsWith("(") && s.endsWith(")")) s = "-" + s.slice(1, -1);
  // Remove currency symbols and thousands separators
  s = s.replace(/[£$€¥,]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function resolveColumns(colMap, headers) {
  const resolved = {};
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  for (const [field, aliases] of Object.entries(colMap)) {
    let found = null;
    for (const alias of aliases) {
      const idx = lowerHeaders.indexOf(alias.toLowerCase());
      if (idx >= 0) { found = headers[idx]; break; }
    }
    if (!found) {
      for (const alias of aliases) {
        const partial = lowerHeaders.findIndex(h => h.includes(alias.toLowerCase()));
        if (partial >= 0) { found = headers[partial]; break; }
      }
    }
    resolved[field] = found || aliases[0];
  }
  return resolved;
}

function parsePlatformRows(connector, rows, headers, dataType) {
  const maps = connector.columnMaps[dataType];
  if (!maps) return { rows: [], totals: {}, warnings: ["No column mapping for data type: " + dataType] };
  const colMap = resolveColumns(maps, headers);
  const warnings = [];

  if (dataType === "trialBalance") {
    const parsed = rows.filter(r => r[colMap.code] || r[colMap.account]).map(r => ({
      code: str(r[colMap.code]),
      account: str(r[colMap.account]),
      debit: num(r[colMap.debit]),
      credit: num(r[colMap.credit]),
      balance: num(r[colMap.debit]) - num(r[colMap.credit]),
      _accountType: colMap.accountType ? str(r[colMap.accountType]) : ""
    }));
    const totals = parsed.reduce((t, r) => ({ debit: t.debit + r.debit, credit: t.credit + r.credit }), { debit: 0, credit: 0 });
    if (Math.abs(totals.debit - totals.credit) > 1) {
      warnings.push(`TB imbalance: Debits £${totals.debit.toFixed(2)} ≠ Credits £${totals.credit.toFixed(2)} (diff: £${Math.abs(totals.debit - totals.credit).toFixed(2)})`);
    }
    return { rows: parsed, totals, warnings };
  }

  if (dataType === "arAging" || dataType === "apAging") {
    const nameField = dataType === "arAging" ? "customer" : "supplier";
    const parsed = rows.filter(r => r[colMap[nameField]]).map(r => ({
      name: str(r[colMap[nameField]]),
      amount: num(r[colMap.amount]),
      current: num(r[colMap.current]),
      days30: num(r[colMap.days30]),
      days60: num(r[colMap.days60]),
      days90: num(r[colMap.days90]),
      days120: colMap.days120 ? num(r[colMap.days120]) : 0
    }));
    const totals = parsed.reduce((t, r) => ({ amount: t.amount + r.amount, current: t.current + r.current, days30: t.days30 + r.days30, days60: t.days60 + r.days60, days90: t.days90 + r.days90, days120: t.days120 + r.days120 }), { amount: 0, current: 0, days30: 0, days60: 0, days90: 0, days120: 0 });
    return { rows: parsed, totals, warnings };
  }

  if (dataType === "bank") {
    const parsed = rows.filter(r => r[colMap.date] || r[colMap.description]).map(r => ({
      date: str(r[colMap.date]),
      reference: str(r[colMap.reference]),
      description: str(r[colMap.description]),
      debit: num(r[colMap.debit]),
      credit: num(r[colMap.credit]),
      balance: num(r[colMap.balance])
    }));
    return { rows: parsed, totals: { debits: parsed.reduce((s, r) => s + r.debit, 0), credits: parsed.reduce((s, r) => s + r.credit, 0) }, warnings };
  }

  // Generic fallback
  const parsed = rows.map(r => {
    const obj = {};
    for (const [field, col] of Object.entries(colMap)) obj[field] = str(r[col]);
    return obj;
  });
  return { rows: parsed, totals: {}, warnings };
}

function parseSingleAmountRows(connector, rows, headers) {
  const colMap = resolveColumns(connector.columnMaps.trialBalance, headers);
  return rows.filter(r => r[colMap.code] || r[colMap.account]).map(r => {
    const amount = num(r[colMap.amount]);
    return {
      code: str(r[colMap.code]),
      account: str(r[colMap.account]),
      debit: amount > 0 ? amount : 0,
      credit: amount < 0 ? Math.abs(amount) : 0,
      balance: amount,
      _accountType: ""
    };
  });
}

function calcTotals(rows) {
  return rows.reduce((t, r) => ({ debit: t.debit + r.debit, credit: t.credit + r.credit }), { debit: 0, credit: 0 });
}

function mapSageToFSLI(parsedRows, nominalRanges) {
  return parsedRows.map(r => {
    const codeNum = parseInt(r.code);
    let fsli = "Other";
    if (!isNaN(codeNum)) {
      if (codeNum >= nominalRanges.revenue[0] && codeNum <= nominalRanges.revenue[1]) fsli = "Revenue";
      else if (codeNum >= nominalRanges.expenses[0] && codeNum <= nominalRanges.expenses[1]) fsli = "Expenses";
      else if (codeNum >= nominalRanges.assets[0] && codeNum <= nominalRanges.assets[1]) fsli = guessAssetFSLI(r.account);
      else if (codeNum >= nominalRanges.liabilities[0] && codeNum <= nominalRanges.liabilities[1]) fsli = guessLiabilityFSLI(r.account);
      else if (codeNum >= nominalRanges.equity[0] && codeNum <= nominalRanges.equity[1]) fsli = "Equity";
    }
    return { ...r, fsli };
  });
}

function guessAssetFSLI(account) {
  const a = (account || "").toLowerCase();
  if (a.includes("bank") || a.includes("cash") || a.includes("petty")) return "Cash";
  if (a.includes("debtor") || a.includes("receivable") || a.includes("trade")) return "Receivables";
  if (a.includes("stock") || a.includes("inventory") || a.includes("wip")) return "Inventory";
  if (a.includes("fixed") || a.includes("equipment") || a.includes("vehicle") || a.includes("property") || a.includes("plant") || a.includes("furniture")) return "Fixed Assets";
  return "Other";
}

function guessLiabilityFSLI(account) {
  const a = (account || "").toLowerCase();
  if (a.includes("creditor") || a.includes("payable") || a.includes("trade")) return "Payables";
  if (a.includes("loan") || a.includes("mortgage") || a.includes("finance") || a.includes("hire purchase") || a.includes("overdraft")) return "Loans";
  if (a.includes("tax") || a.includes("vat") || a.includes("paye") || a.includes("corporation")) return "Tax";
  if (a.includes("provision") || a.includes("accrual")) return "Provisions";
  return "Other";
}

function guessKeywordFSLI(account) {
  const a = (account || "").toLowerCase();
  if (a.includes("revenue") || a.includes("sales") || a.includes("turnover") || a.includes("income") || a.includes("fee")) return "Revenue";
  if (a.includes("debtor") || a.includes("receivable")) return "Receivables";
  if (a.includes("stock") || a.includes("inventory") || a.includes("wip")) return "Inventory";
  if (a.includes("creditor") || a.includes("payable")) return "Payables";
  if (a.includes("bank") || a.includes("cash") || a.includes("petty")) return "Cash";
  if (a.includes("fixed") || a.includes("equipment") || a.includes("vehicle") || a.includes("property") || a.includes("plant") || a.includes("depreciation")) return "Fixed Assets";
  if (a.includes("share") || a.includes("equity") || a.includes("capital") || a.includes("reserve") || a.includes("retained")) return "Equity";
  if (a.includes("loan") || a.includes("mortgage") || a.includes("overdraft") || a.includes("finance lease")) return "Loans";
  if (a.includes("provision") || a.includes("warranty") || a.includes("restructur")) return "Provisions";
  if (a.includes("tax") || a.includes("vat") || a.includes("corporation") || a.includes("deferred tax")) return "Tax";
  return "Other";
}


// ─── B) PLATFORM CSV PARSER ───

export async function parsePlatformExport(connectorId, file, dataType) {
  const connector = CONNECTORS.find(c => c.id === connectorId);
  if (!connector) throw new Error("Unknown connector: " + connectorId);

  let headers = [];
  let rows = [];

  if (file.name.match(/\.xlsx?$/i)) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await extractFromExcel(arrayBuffer);
    const sheetName = result.sheetNames[0];
    const sheet = result.sheets[sheetName];
    headers = sheet.headers;
    rows = sheet.rows;
  } else {
    const text = await file.text();
    const result = extractFromCSV(text);
    headers = result.headers;
    rows = result.rows;
  }

  return connector.parseExport(rows, headers, dataType || "trialBalance");
}


// ─── C) MAP TO TRIAL BALANCE ───

export function mapToTrialBalance(parsedData, connectorId) {
  const connector = CONNECTORS.find(c => c.id === connectorId);
  if (!connector) return parsedData.rows.map(r => ({ code: r.code || "", account: r.account || "", py: 0, cy: r.balance || (r.debit - r.credit) || 0 }));

  const withFSLI = connector.fsliMapper(parsedData.rows);
  return withFSLI.map(r => ({
    code: r.code || "",
    account: r.account || "",
    py: 0,
    cy: r.balance !== undefined ? r.balance : (r.debit || 0) - (r.credit || 0),
    _fsli: r.fsli || "Other"
  }));
}


// ─── D) VALIDATE IMPORT DATA ───

export function validateImportData(data, dataType) {
  const errors = [];
  const warnings = [];
  const rows = data.rows || data;

  if (!rows || rows.length === 0) {
    return { valid: false, errors: ["No data rows found"], warnings: [] };
  }

  if (dataType === "trialBalance") {
    const totalDebit = rows.reduce((s, r) => s + (r.debit || 0), 0);
    const totalCredit = rows.reduce((s, r) => s + (r.credit || 0), 0);
    const diff = Math.abs(totalDebit - totalCredit);
    if (diff > 1) errors.push(`TB does not balance: Debits £${totalDebit.toFixed(2)} vs Credits £${totalCredit.toFixed(2)} (diff: £${diff.toFixed(2)})`);
    else if (diff > 0) warnings.push(`Minor TB rounding: £${diff.toFixed(2)} difference`);

    rows.forEach(r => {
      const acLower = (r.account || "").toLowerCase();
      if ((acLower.includes("revenue") || acLower.includes("sales")) && r.debit > 0 && r.credit === 0) {
        warnings.push(`${r.account}: Revenue account has debit balance — check for reversals`);
      }
      if ((acLower.includes("expense") || acLower.includes("cost")) && r.credit > 0 && r.debit === 0) {
        warnings.push(`${r.account}: Expense account has credit balance — check for reversals`);
      }
    });
  }

  if (dataType === "arAging") {
    rows.forEach(r => {
      const bucketSum = (r.current || 0) + (r.days30 || 0) + (r.days60 || 0) + (r.days90 || 0) + (r.days120 || 0);
      if (r.amount && Math.abs(bucketSum - r.amount) > 1) {
        warnings.push(`${r.name}: Bucket sum £${bucketSum.toFixed(2)} ≠ total £${(r.amount || 0).toFixed(2)}`);
      }
      if ((r.days90 || 0) + (r.days120 || 0) > 0) {
        warnings.push(`${r.name}: Amounts > 90 days (£${((r.days90 || 0) + (r.days120 || 0)).toFixed(2)}) — assess ISA 540 impairment`);
      }
    });
  }

  if (dataType === "apAging") {
    rows.forEach(r => {
      const bucketSum = (r.current || 0) + (r.days30 || 0) + (r.days60 || 0) + (r.days90 || 0) + (r.days120 || 0);
      if (r.amount && Math.abs(bucketSum - r.amount) > 1) {
        warnings.push(`${r.name}: Bucket sum £${bucketSum.toFixed(2)} ≠ total £${(r.amount || 0).toFixed(2)}`);
      }
      if ((r.days90 || 0) > 0) {
        warnings.push(`${r.name}: Items past 90 days (£${(r.days90 || 0).toFixed(2)}) — check for unrecorded liabilities`);
      }
    });
  }

  if (dataType === "bank") {
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1];
      const curr = rows[i];
      if (prev.balance && curr.balance) {
        const expected = prev.balance + (curr.credit || 0) - (curr.debit || 0);
        if (Math.abs(expected - curr.balance) > 0.01) {
          warnings.push(`Row ${i + 1}: Running balance break — expected £${expected.toFixed(2)}, got £${curr.balance.toFixed(2)}`);
        }
      }
      // ISA 240 fraud indicators
      const day = new Date(curr.date);
      if (day.getDay && (day.getDay() === 0 || day.getDay() === 6)) {
        warnings.push(`Row ${i + 1}: Weekend transaction (${curr.date}) — ISA 240 indicator`);
      }
      if (curr.debit > 0 && curr.debit === Math.round(curr.debit) && curr.debit >= 1000) {
        warnings.push(`Row ${i + 1}: Round-number payment £${curr.debit} — ISA 240 indicator`);
      }
    }
  }

  if (dataType === "payroll") {
    rows.forEach(r => {
      const expected = r.grossPay - r.paye - r.niEmployee - (r.pension || 0);
      if (Math.abs(expected - r.netPay) > 1) {
        errors.push(`${r.employee}: Net £${r.netPay} ≠ Gross £${r.grossPay} - deductions £${(r.grossPay - expected).toFixed(2)}`);
      }
      if (r.paye === 0 && r.grossPay > 12570) {
        warnings.push(`${r.employee}: Zero PAYE on gross £${r.grossPay} — verify tax code`);
      }
      const niRate = r.grossPay > 0 ? r.niEmployee / r.grossPay : 0;
      if (r.grossPay > 12570 && (niRate < 0.05 || niRate > 0.15)) {
        warnings.push(`${r.employee}: NI rate ${(niRate * 100).toFixed(1)}% outside expected 8-13.25% band`);
      }
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}


// ─── E) CSV TEMPLATE LIBRARY ───

const TEMPLATES = {
  TB_Import_Template: "# AuditEngine v10 AURA — Trial Balance Import Template\n# Columns: AccountCode (required), AccountName (required), OpeningBalance, DebitMovement, CreditMovement, ClosingBalance\nAccountCode,AccountName,OpeningBalance,DebitMovement,CreditMovement,ClosingBalance\n1001,Cash at bank,50000,25000,30000,45000\n1100,Trade debtors,120000,180000,175000,125000",
  AR_Aging_Template: "# AuditEngine v10 AURA — Accounts Receivable Aging Template\n# Columns: Customer (required), InvoiceNo, InvoiceDate, DueDate, Amount (required), Current, Days30, Days60, Days90, Days120Plus\nCustomer,InvoiceNo,InvoiceDate,DueDate,Amount,Current,Days30,Days60,Days90,Days120Plus\nAcme Ltd,INV-001,01/01/2026,31/01/2026,5000,5000,0,0,0,0",
  AP_Aging_Template: "# AuditEngine v10 AURA — Accounts Payable Aging Template\n# Columns: Supplier (required), InvoiceNo, InvoiceDate, DueDate, Amount (required), Current, Days30, Days60, Days90, Days120Plus\nSupplier,InvoiceNo,InvoiceDate,DueDate,Amount,Current,Days30,Days60,Days90,Days120Plus\nSmith Supplies,SINV-001,15/01/2026,14/02/2026,3500,3500,0,0,0,0",
  Bank_Template: "# AuditEngine v10 AURA — Bank Statement Import Template\n# Columns: Date (required), Reference, Description, Debit, Credit, Balance\nDate,Reference,Description,Debit,Credit,Balance\n01/01/2026,CHQ001,Opening Balance,0,0,50000\n02/01/2026,BAC001,Customer Receipt,0,12500,62500",
  Assets_Template: "# AuditEngine v10 AURA — Fixed Assets Register Template\n# Columns: AssetID (required), Description (required), Category, AcquisitionDate, Cost, UsefulLife, Method, AccumDep, NBV\nAssetID,Description,Category,AcquisitionDate,Cost,UsefulLife,Method,AccumDep,NBV\nFA001,Office Equipment,Equipment,01/04/2020,25000,5,Straight-line,15000,10000",
  Payroll_Template: "# AuditEngine v10 AURA — Payroll Data Import Template\n# Columns: Employee (required), GrossPay (required), PAYE, NIEmployer, NIEmployee, Pension, StudentLoan, NetPay\nEmployee,GrossPay,PAYE,NIEmployer,NIEmployee,Pension,StudentLoan,NetPay\nJohn Smith,3500,450,380,280,175,0,2595",
  Loans_Template: "# AuditEngine v10 AURA — Loans & Borrowings Template\n# Columns: LoanRef (required), Lender, Principal (required), InterestRate, StartDate, MaturityDate, PaymentFrequency, CurrentBalance\nLoanRef,Lender,Principal,InterestRate,StartDate,MaturityDate,PaymentFrequency,CurrentBalance\nLN001,Barclays,500000,4.5,01/01/2022,01/01/2032,Monthly,425000",
  Contracts_Template: "# AuditEngine v10 AURA — Contracts Template\n# Columns: ContractRef (required), Client, ContractValue, Variations, CostsToDate, EstimatedTotalCost, BilledToDate\nContractRef,Client,ContractValue,Variations,CostsToDate,EstimatedTotalCost,BilledToDate\nCON001,Riverside Development,2500000,150000,1800000,2400000,1950000"
};

export async function generateAllTemplatesZip() {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const [name, content] of Object.entries(TEMPLATES)) {
    zip.file(name + ".csv", "\uFEFF" + content);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "AuditEngine_Import_Templates.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}


// ─── F) COMPANIES HOUSE LOOKUP ───

const SIC_TO_INDUSTRY = {
  "10-33": "manufacturing", "41-43": "construction", "45-47": "retail",
  "49-53": "transport", "55-56": "hospitality", "58-63": "technology",
  "64-66": "financial_services", "68": "real_estate", "69-75": "professional_services",
  "85": "education", "86-88": "nfp", "90-93": "entertainment"
};

function mapSICToIndustry(sicCodes) {
  for (const sic of sicCodes) {
    const code = parseInt(sic);
    for (const [range, industry] of Object.entries(SIC_TO_INDUSTRY)) {
      const [lo, hi] = range.split("-").map(Number);
      if (code >= lo && code <= (hi || lo)) return industry;
    }
  }
  return null;
}

export function lookupCompaniesHouse(companyNumber) {
  // Simulated Companies House response
  const cn = String(companyNumber).padStart(8, "0");
  return {
    companyNumber: cn,
    name: "Company " + cn + " Ltd",
    registeredAddress: "71-75 Shelton Street, London, WC2H 9JQ",
    status: "Active",
    incorporationDate: "2015-03-15",
    sicCodes: ["62020", "62090"],
    companyType: "Private limited by shares",
    industry: mapSICToIndustry(["62"]) || "technology",
    directors: [
      { name: "Jane Director", appointedDate: "2015-03-15", resigned: null },
      { name: "John Secretary", appointedDate: "2018-06-01", resigned: null },
      { name: "Sarah Former", appointedDate: "2015-03-15", resigned: "2022-12-31" }
    ],
    filingHistory: [
      { type: "AA", date: "2025-09-30", description: "Full accounts made up to 31/03/2025" },
      { type: "CS01", date: "2025-04-15", description: "Confirmation statement" },
      { type: "AA", date: "2024-09-28", description: "Full accounts made up to 31/03/2024" },
      { type: "AR01", date: "2024-04-10", description: "Annual return" }
    ],
    lastAccountsFiled: "2025-09-30",
    nextAccountsDue: "2026-12-31",
    confirmationStatementDue: "2026-04-15"
  };
}


// ─── G) JOURNAL EXPORT FUNCTIONS ───

export function generateSageJournals(adjustments) {
  const header = "Type,Account Reference,Nominal A/C Ref,Date,Reference,Details,Net Amount,Tax Code,Tax Amount\n";
  const rows = adjustments.map(adj =>
    `JC,${adj.accountCode || ""},${adj.nominalCode || ""},${adj.date || ""},${adj.reference || ""},${adj.description || ""},${adj.amount || 0},T9,0`
  ).join("\n");
  return header + rows;
}

export function generateXeroJournals(adjustments) {
  const header = "*Narration,*Date,*AccountCode,*Debit,*Credit,Description\n";
  const rows = adjustments.map(adj =>
    `${adj.reference || "AE Adjustment"},${adj.date || ""},${adj.accountCode || ""},${adj.debit || ""},${adj.credit || ""},${adj.description || ""}`
  ).join("\n");
  return header + rows;
}

export function generateQBOJournals(adjustments) {
  const header = "JournalNo,JournalDate,Account,Debits,Credits,Description,Name\n";
  const rows = adjustments.map((adj, i) =>
    `AE${String(i + 1).padStart(4, "0")},${adj.date || ""},${adj.accountCode || ""},${adj.debit || ""},${adj.credit || ""},${adj.description || ""},`
  ).join("\n");
  return header + rows;
}

export function generateGenericJournals(adjustments) {
  const header = "Date,Reference,AccountCode,AccountName,Description,Debit,Credit\n";
  const rows = adjustments.map(adj =>
    `${adj.date || ""},${adj.reference || ""},${adj.accountCode || ""},${adj.accountName || ""},${adj.description || ""},${adj.debit || ""},${adj.credit || ""}`
  ).join("\n");
  return "\uFEFF" + header + rows;
}


// ─── H) COMPATIBILITY MATRIX ───

export function getCompatibilityMatrix() {
  return CONNECTORS.map(c => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
    category: c.category,
    country: c.country,
    authMethod: c.authMethod,
    importMethods: c.exportFormats,
    dataTypes: c.dataTypes,
    limitations: c.id === "companieshouse" ? "Read-only company data" : c.id === "hmrc_mtd" ? "VAT data only; requires Gov Gateway" : c.id === "moneysoft" ? "Payroll data only" : c.id === "dext" ? "Purchase invoices/expenses only" : "Full TB and sub-ledger support",
    setupInstructions: c.authMethod === "OAuth2" ? `1. Register app at ${c.name} developer portal\n2. Obtain client ID/secret\n3. Configure redirect URI\n4. Authorise in AuditEngine` : c.authMethod === "Manual Export" ? `1. Export data from ${c.name} as CSV/Excel\n2. Import file into AuditEngine` : `1. Obtain API key from ${c.name}\n2. Enter in connector settings`
  }));
}


// ─── EXPORTS ───

export function getConnectors() { return CONNECTORS; }
