// ═══════════════════════════════════════════════════════════════
// DATA EXTRACTOR — Universal Data Ingestion Engine
// AuditEngine v10 AURA
// Handles CSV, Excel, Text, TB, Loans, Bank, FA, Debtors, Creditors,
// Payroll, Shares, Contracts, Investments, Leases, VAT, Provisions
// ═══════════════════════════════════════════════════════════════

import Papa from "papaparse";

// ─── A) CSV EXTRACTION ───
export function extractFromCSV(text) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
  const headers = parsed.meta?.fields || [];
  const numericCols = headers.filter(h => {
    const vals = parsed.data.map(r => r[h]).filter(v => v !== null && v !== undefined && v !== "");
    return vals.length > 0 && vals.every(v => typeof v === "number" || !isNaN(parseFloat(v)));
  });
  return { headers, rows: parsed.data, numericColumns: numericCols, rowCount: parsed.data.length };
}

// ─── B) EXCEL EXTRACTION ───
export async function extractFromExcel(arrayBuffer) {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheets = {};
  wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    const headers = json.length > 0 ? json[0].map(String) : [];
    const rows = json.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? row[i] : ""; });
      return obj;
    });
    sheets[name] = { headers, rows, rowCount: rows.length };
  });
  return { sheetNames: wb.SheetNames, sheets };
}

// ─── C) TEXT EXTRACTION ───
export function extractFromText(text) {
  const entities = [];
  // Company names (Ltd, PLC, LLP patterns)
  const companyRe = /\b([A-Z][A-Za-z&\s]+(?:Ltd|Limited|PLC|LLP|Inc|Corp)\.?)\b/g;
  let m;
  while ((m = companyRe.exec(text)) !== null) entities.push({ type: "company", value: m[1].trim(), index: m.index });
  // Dates (DD/MM/YYYY, DD-MM-YYYY, DD Month YYYY)
  const dateRe = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g;
  while ((m = dateRe.exec(text)) !== null) entities.push({ type: "date", value: m[1], index: m.index });
  const dateWordRe = /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi;
  while ((m = dateWordRe.exec(text)) !== null) entities.push({ type: "date", value: m[1], index: m.index });
  // Currency amounts
  const currRe = /(-?\s*£|£\s*-?)([\d,]+(?:\.\d{1,2})?)/g;
  while ((m = currRe.exec(text)) !== null) { const neg = m[1].includes("-") ? -1 : 1; entities.push({ type: "currency", value: neg * parseFloat(m[2].replace(/,/g, "")), raw: m[0], index: m.index }); }
  // Percentages
  const pctRe = /([\d.]+)\s*%/g;
  while ((m = pctRe.exec(text)) !== null) entities.push({ type: "percentage", value: parseFloat(m[1]), raw: m[0], index: m.index });
  // Account codes (4-8 digit numbers)
  const codeRe = /\b(\d{4,8})\b/g;
  while ((m = codeRe.exec(text)) !== null) entities.push({ type: "accountCode", value: m[1], index: m.index });
  // Reference numbers (INV-XXXX, PO-XXXX etc)
  const refRe = /\b([A-Z]{2,4}-\d{3,8})\b/g;
  while ((m = refRe.exec(text)) !== null) entities.push({ type: "reference", value: m[1], index: m.index });
  return { entities, entityCount: entities.length };
}

// ─── D) TRIAL BALANCE EXTRACTION ───
export function extractTrialBalance(rows, headers) {
  // Auto-detect format: code+name+debit+credit OR code+name+balance
  const h = headers.map(x => String(x).toLowerCase());
  const hasDebitCredit = h.some(x => x.includes("debit")) && h.some(x => x.includes("credit"));
  const result = [];
  rows.forEach(row => {
    const vals = headers.map(hh => row[hh]);
    const code = String(vals[0] || "").trim();
    const account = String(vals[1] || "").trim();
    if (!code && !account) return;
    let py = 0, cy = 0;
    if (hasDebitCredit) {
      const dr = parseFloat(vals[2]) || 0;
      const cr = parseFloat(vals[3]) || 0;
      cy = dr - cr;
      py = vals.length > 4 ? (parseFloat(vals[4]) || 0) - (parseFloat(vals[5]) || 0) : 0;
    } else {
      py = parseFloat(vals[2]) || 0;
      cy = parseFloat(vals[3]) || 0;
    }
    result.push({ code, account, py, cy });
  });
  return result;
}

// ─── E) LOAN SCHEDULE EXTRACTION ───
export function extractLoanSchedule(rows, headers) {
  const loans = rows.map(row => {
    const principal = parseFloat(row[headers[0]]) || parseFloat(row.principal) || parseFloat(row.Principal) || 0;
    const rate = (parseFloat(row[headers[1]]) || parseFloat(row.rate) || parseFloat(row.Rate) || 0) / 100;
    const term = parseInt(row[headers[2]]) || parseInt(row.term) || parseInt(row.Term) || 12;
    const frequency = row.frequency || row.Frequency || "monthly";
    const periodsPerYear = frequency === "quarterly" ? 4 : frequency === "annually" ? 1 : 12;
    const periodicRate = rate / periodsPerYear;
    const totalPeriods = term * periodsPerYear;
    const pmt = periodicRate > 0 ? principal * periodicRate / (1 - Math.pow(1 + periodicRate, -totalPeriods)) : principal / totalPeriods;
    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(totalPeriods, 360); i++) {
      const interest = balance * periodicRate;
      const principalPay = pmt - interest;
      balance = Math.max(0, balance - principalPay);
      schedule.push({ period: i, payment: Math.round(pmt * 100) / 100, interest: Math.round(interest * 100) / 100, principal: Math.round(principalPay * 100) / 100, balance: Math.round(balance * 100) / 100 });
    }
    return { principal, rate, term, frequency, periodicPayment: Math.round(pmt * 100) / 100, totalInterest: Math.round(schedule.reduce((s, r) => s + r.interest, 0) * 100) / 100, schedule };
  });
  return loans;
}

// ─── F) BANK STATEMENT EXTRACTION ───
export function extractBankStatement(rows, headers) {
  const h = headers.map(x => String(x).toLowerCase());
  const dateIdx = h.findIndex(x => x.includes("date"));
  const descIdx = h.findIndex(x => x.includes("desc") || x.includes("narr") || x.includes("detail"));
  const drIdx = h.findIndex(x => x.includes("debit") || x.includes("payment") || x.includes("out"));
  const crIdx = h.findIndex(x => x.includes("credit") || x.includes("receipt") || x.includes("in"));
  const balIdx = h.findIndex(x => x.includes("balance") || x.includes("bal"));
  const result = [];
  let runningBal = null;
  const exceptions = [];
  rows.forEach((row, i) => {
    const vals = headers.map(hh => row[hh]);
    const date = vals[dateIdx >= 0 ? dateIdx : 0] || "";
    const desc = vals[descIdx >= 0 ? descIdx : 1] || "";
    const debit = Math.abs(parseFloat(vals[drIdx >= 0 ? drIdx : 2])) || 0;
    const credit = Math.abs(parseFloat(vals[crIdx >= 0 ? crIdx : 3])) || 0;
    const statedBal = balIdx >= 0 ? parseFloat(vals[balIdx]) : null;
    if (runningBal === null) runningBal = statedBal || 0;
    runningBal = runningBal - debit + credit;
    if (statedBal !== null && Math.abs(runningBal - statedBal) > 0.01) {
      exceptions.push({ row: i + 1, expected: Math.round(runningBal * 100) / 100, stated: statedBal, difference: Math.round((runningBal - statedBal) * 100) / 100 });
      runningBal = statedBal;
    }
    result.push({ date, description: desc, debit, credit, balance: Math.round(runningBal * 100) / 100 });
  });
  return { transactions: result, exceptions, totalDebits: Math.round(result.reduce((s, r) => s + r.debit, 0) * 100) / 100, totalCredits: Math.round(result.reduce((s, r) => s + r.credit, 0) * 100) / 100, closingBalance: result.length ? result[result.length - 1].balance : 0 };
}

// ─── G) FIXED ASSET REGISTER EXTRACTION ───
export function extractFixedAssetRegister(rows, headers) {
  const assets = [];
  const errors = [];
  rows.forEach((row, i) => {
    const vals = headers.map(h => row[h]);
    const assetId = String(vals[0] || "").trim();
    const description = String(vals[1] || "").trim();
    const cost = parseFloat(vals[2]) || 0;
    const dateAcquired = vals[3] || "";
    const usefulLife = parseInt(vals[4]) || 0;
    const method = String(vals[5] || "SL").trim();
    const accDep = parseFloat(vals[6]) || 0;
    const nbv = parseFloat(vals[7]) || 0;
    const expectedNBV = Math.round((cost - accDep) * 100) / 100;
    if (Math.abs(nbv - expectedNBV) > 0.01) {
      errors.push({ row: i + 1, assetId, expectedNBV, statedNBV: nbv, difference: Math.round((nbv - expectedNBV) * 100) / 100 });
    }
    assets.push({ assetId, description, cost, dateAcquired, usefulLife, method, accDep, nbv, expectedNBV });
  });
  return { assets, errors, totalCost: Math.round(assets.reduce((s, a) => s + a.cost, 0) * 100) / 100, totalAccDep: Math.round(assets.reduce((s, a) => s + a.accDep, 0) * 100) / 100, totalNBV: Math.round(assets.reduce((s, a) => s + a.nbv, 0) * 100) / 100 };
}

// ─── H) DEBTOR AGING EXTRACTION ───
export function extractDebtorAging(rows, headers, eclRates = { current: 0.005, "30": 0.02, "60": 0.05, "90": 0.10, "120+": 0.25 }) {
  const debtors = [];
  let totalCurrent = 0, total30 = 0, total60 = 0, total90 = 0, total120 = 0;
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const customer = String(vals[0] || "").trim();
    const current = parseFloat(vals[1]) || 0;
    const d30 = parseFloat(vals[2]) || 0;
    const d60 = parseFloat(vals[3]) || 0;
    const d90 = parseFloat(vals[4]) || 0;
    const d120 = parseFloat(vals[5]) || 0;
    const total = current + d30 + d60 + d90 + d120;
    const provision = current * eclRates.current + d30 * eclRates["30"] + d60 * eclRates["60"] + d90 * eclRates["90"] + d120 * eclRates["120+"];
    totalCurrent += current; total30 += d30; total60 += d60; total90 += d90; total120 += d120;
    debtors.push({ customer, current, d30, d60, d90, d120, total: Math.round(total * 100) / 100, provision: Math.round(provision * 100) / 100 });
  });
  const grandTotal = totalCurrent + total30 + total60 + total90 + total120;
  const totalProvision = totalCurrent * eclRates.current + total30 * eclRates["30"] + total60 * eclRates["60"] + total90 * eclRates["90"] + total120 * eclRates["120+"];
  return { debtors, grandTotal: Math.round(grandTotal * 100) / 100, totalProvision: Math.round(totalProvision * 100) / 100, eclRates, agingSummary: { current: Math.round(totalCurrent * 100) / 100, d30: Math.round(total30 * 100) / 100, d60: Math.round(total60 * 100) / 100, d90: Math.round(total90 * 100) / 100, d120: Math.round(total120 * 100) / 100 } };
}

// ─── I) CREDITOR AGING EXTRACTION ───
export function extractCreditorAging(rows, headers) {
  const creditors = [];
  const overdue = [];
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const supplier = String(vals[0] || "").trim();
    const current = parseFloat(vals[1]) || 0;
    const d30 = parseFloat(vals[2]) || 0;
    const d60 = parseFloat(vals[3]) || 0;
    const d90 = parseFloat(vals[4]) || 0;
    const d120 = parseFloat(vals[5]) || 0;
    const total = current + d30 + d60 + d90 + d120;
    if (d60 + d90 + d120 > 0) overdue.push({ supplier, overdueAmount: Math.round((d60 + d90 + d120) * 100) / 100 });
    creditors.push({ supplier, current, d30, d60, d90, d120, total: Math.round(total * 100) / 100 });
  });
  return { creditors, overdue, grandTotal: Math.round(creditors.reduce((s, c) => s + c.total, 0) * 100) / 100 };
}

// ─── J) PAYROLL EXTRACTION ───
export function extractPayroll(rows, headers) {
  const employees = [];
  let totals = { gross: 0, paye: 0, niEr: 0, niEe: 0, pension: 0, studentLoan: 0, net: 0 };
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const emp = { employee: String(vals[0] || "").trim(), gross: parseFloat(vals[1]) || 0, paye: parseFloat(vals[2]) || 0, niEr: parseFloat(vals[3]) || 0, niEe: parseFloat(vals[4]) || 0, pension: parseFloat(vals[5]) || 0, studentLoan: parseFloat(vals[6]) || 0, net: parseFloat(vals[7]) || 0 };
    const expectedNet = emp.gross - emp.paye - emp.niEe - emp.pension - emp.studentLoan;
    emp.reconciled = Math.abs(emp.net - expectedNet) < 0.01;
    emp.difference = Math.round((emp.net - expectedNet) * 100) / 100;
    Object.keys(totals).forEach(k => { totals[k] += emp[k] || 0; });
    employees.push(emp);
  });
  Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] * 100) / 100; });
  return { employees, totals, headcount: employees.length, allReconciled: employees.every(e => e.reconciled) };
}

// ─── K) SHARE REGISTER EXTRACTION ───
export function extractShareRegister(rows, headers) {
  const shareholders = [];
  let totalShares = 0, totalNominal = 0;
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const sh = { shareholder: String(vals[0] || "").trim(), shareClass: String(vals[1] || "Ordinary").trim(), numberOfShares: parseInt(vals[2]) || 0, nominalValue: parseFloat(vals[3]) || 1.00, paidUp: parseFloat(vals[4]) || parseFloat(vals[3]) || 1.00 };
    sh.totalNominal = sh.numberOfShares * sh.nominalValue;
    totalShares += sh.numberOfShares;
    totalNominal += sh.totalNominal;
    shareholders.push(sh);
  });
  shareholders.forEach(sh => { sh.percentage = totalShares > 0 ? Math.round((sh.numberOfShares / totalShares) * 10000) / 100 : 0; });
  return { shareholders, totalShares, totalNominal: Math.round(totalNominal * 100) / 100, shareCapital: Math.round(totalNominal * 100) / 100 };
}

// ─── L) CONTRACT REGISTER EXTRACTION (Construction) ───
export function extractContractRegister(rows, headers) {
  const contracts = [];
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const c = { name: String(vals[0] || "").trim(), client: String(vals[1] || "").trim(), contractValue: parseFloat(vals[2]) || 0, variations: parseFloat(vals[3]) || 0, costsToDate: parseFloat(vals[4]) || 0, estimatedTotalCost: parseFloat(vals[5]) || 0 };
    c.totalContractValue = c.contractValue + c.variations;
    c.stageOfCompletion = c.estimatedTotalCost > 0 ? Math.round((c.costsToDate / c.estimatedTotalCost) * 10000) / 100 : 0;
    c.revenueToDate = Math.round(c.totalContractValue * c.stageOfCompletion / 100 * 100) / 100;
    c.estimatedProfit = c.totalContractValue - c.estimatedTotalCost;
    c.profitToDate = Math.round(c.estimatedProfit * c.stageOfCompletion / 100 * 100) / 100;
    c.wipBalance = Math.round((c.costsToDate + c.profitToDate - c.revenueToDate) * 100) / 100;
    c.isLossMaking = c.estimatedProfit < 0;
    contracts.push(c);
  });
  return { contracts, totalRevenue: Math.round(contracts.reduce((s, c) => s + c.revenueToDate, 0) * 100) / 100, totalCosts: Math.round(contracts.reduce((s, c) => s + c.costsToDate, 0) * 100) / 100, lossMakingContracts: contracts.filter(c => c.isLossMaking) };
}

// ─── M) INVESTMENT PORTFOLIO EXTRACTION ───
export function extractInvestmentPortfolio(rows, headers) {
  const instruments = [];
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const inst = { instrument: String(vals[0] || "").trim(), isin: String(vals[1] || "").trim(), quantity: parseInt(vals[2]) || 0, cost: parseFloat(vals[3]) || 0, fairValue: parseFloat(vals[4]) || 0, classification: String(vals[5] || "FVPL").trim() };
    inst.unrealisedGainLoss = Math.round((inst.fairValue - inst.cost) * 100) / 100;
    inst.totalCost = inst.quantity * inst.cost;
    inst.totalFairValue = inst.quantity * inst.fairValue;
    inst.totalGainLoss = Math.round((inst.totalFairValue - inst.totalCost) * 100) / 100;
    instruments.push(inst);
  });
  return { instruments, totalCost: Math.round(instruments.reduce((s, i) => s + i.totalCost, 0) * 100) / 100, totalFairValue: Math.round(instruments.reduce((s, i) => s + i.totalFairValue, 0) * 100) / 100, totalUnrealisedGainLoss: Math.round(instruments.reduce((s, i) => s + i.totalGainLoss, 0) * 100) / 100 };
}

// ─── N) LEASE SCHEDULE EXTRACTION ───
export function extractLeaseSchedule(rows, headers) {
  const leases = [];
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const leaseName = String(vals[0] || "").trim();
    const term = parseInt(vals[1]) || 0;
    const paymentAmount = parseFloat(vals[2]) || 0;
    const frequency = String(vals[3] || "monthly").trim().toLowerCase();
    const rate = (parseFloat(vals[4]) || 0) / 100;
    const periodsPerYear = frequency === "quarterly" ? 4 : frequency === "annually" ? 1 : 12;
    const totalPeriods = term * periodsPerYear;
    const periodicRate = rate / periodsPerYear;
    // Calculate present value of lease liability (IFRS 16)
    let presentValue = 0;
    const schedule = [];
    let liability = 0;
    if (periodicRate > 0 && totalPeriods > 0) {
      presentValue = paymentAmount * (1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate;
      liability = presentValue;
      for (let i = 1; i <= Math.min(totalPeriods, 360); i++) {
        const interest = liability * periodicRate;
        const principalPay = paymentAmount - interest;
        liability = Math.max(0, liability - principalPay);
        schedule.push({ period: i, payment: paymentAmount, interest: Math.round(interest * 100) / 100, principal: Math.round(principalPay * 100) / 100, closingLiability: Math.round(liability * 100) / 100 });
      }
    }
    leases.push({ leaseName, term, paymentAmount, frequency, rate, presentValue: Math.round(presentValue * 100) / 100, totalPayments: Math.round(paymentAmount * totalPeriods * 100) / 100, totalInterest: Math.round((paymentAmount * totalPeriods - presentValue) * 100) / 100, schedule });
  });
  return { leases, totalPresentValue: Math.round(leases.reduce((s, l) => s + l.presentValue, 0) * 100) / 100, totalPayments: Math.round(leases.reduce((s, l) => s + l.totalPayments, 0) * 100) / 100, leaseCount: leases.length };
}

// ─── O) VAT RETURN EXTRACTION ───
export function extractVATReturn(rows, headers) {
  const returns = [];
  let totalOutputTax = 0, totalInputTax = 0, totalNetVAT = 0;
  rows.forEach(row => {
    const vals = headers.map(h => row[h]);
    const period = String(vals[0] || "").trim();
    const outputTax = parseFloat(vals[1]) || 0;
    const inputTax = parseFloat(vals[2]) || 0;
    const netVAT = parseFloat(vals[3]) || (outputTax - inputTax);
    const expectedNet = Math.round((outputTax - inputTax) * 100) / 100;
    const reconciled = Math.abs(netVAT - expectedNet) < 0.01;
    const difference = Math.round((netVAT - expectedNet) * 100) / 100;
    totalOutputTax += outputTax;
    totalInputTax += inputTax;
    totalNetVAT += netVAT;
    returns.push({ period, outputTax, inputTax, netVAT: Math.round(netVAT * 100) / 100, expectedNet, reconciled, difference });
  });
  const exceptions = returns.filter(r => !r.reconciled);
  return { returns, totalOutputTax: Math.round(totalOutputTax * 100) / 100, totalInputTax: Math.round(totalInputTax * 100) / 100, totalNetVAT: Math.round(totalNetVAT * 100) / 100, exceptions, allReconciled: exceptions.length === 0, periodCount: returns.length };
}

// ─── P) PROVISIONS EXTRACTION ───
export function extractProvisions(rows, headers) {
  const provisions = [];
  const errors = [];
  rows.forEach((row, i) => {
    const vals = headers.map(h => row[h]);
    const provisionType = String(vals[0] || "").trim();
    const openingBalance = parseFloat(vals[1]) || 0;
    const additions = parseFloat(vals[2]) || 0;
    const utilised = parseFloat(vals[3]) || 0;
    const released = parseFloat(vals[4]) || 0;
    const closingBalance = parseFloat(vals[5]) || 0;
    const expectedClosing = Math.round((openingBalance + additions - utilised - released) * 100) / 100;
    if (Math.abs(closingBalance - expectedClosing) > 0.01) {
      errors.push({ row: i + 1, provisionType, expectedClosing, statedClosing: closingBalance, difference: Math.round((closingBalance - expectedClosing) * 100) / 100 });
    }
    provisions.push({ provisionType, openingBalance, additions, utilised, released, closingBalance, expectedClosing, reconciled: Math.abs(closingBalance - expectedClosing) < 0.01 });
  });
  return { provisions, errors, totalOpening: Math.round(provisions.reduce((s, p) => s + p.openingBalance, 0) * 100) / 100, totalAdditions: Math.round(provisions.reduce((s, p) => s + p.additions, 0) * 100) / 100, totalUtilised: Math.round(provisions.reduce((s, p) => s + p.utilised, 0) * 100) / 100, totalReleased: Math.round(provisions.reduce((s, p) => s + p.released, 0) * 100) / 100, totalClosing: Math.round(provisions.reduce((s, p) => s + p.closingBalance, 0) * 100) / 100, allReconciled: errors.length === 0 };
}

// ─── Q) STANDARDISED EXTRACTORS — Accept PapaParse data, return {headers, rows, summary, warnings} ───

export function extractLoanScheduleStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const warnings = [];
  const rows = [];
  data.forEach((row, idx) => {
    const principal = parseFloat(row.principal || row.Principal || row[headers[0]]) || 0;
    const rate = (parseFloat(row.rate || row.Rate || row[headers[1]]) || 0) / 100;
    const term = parseInt(row.term || row.Term || row[headers[2]]) || 12;
    const frequency = row.frequency || row.Frequency || row[headers[3]] || "monthly";
    if (principal <= 0) { warnings.push({ row: idx + 1, message: "Principal is zero or missing" }); return; }
    if (rate <= 0) { warnings.push({ row: idx + 1, message: "Interest rate is zero or missing" }); }
    const periodsPerYear = frequency === "quarterly" ? 4 : frequency === "annually" ? 1 : 12;
    const periodicRate = rate / periodsPerYear;
    const totalPeriods = term * periodsPerYear;
    const pmt = periodicRate > 0 ? principal * periodicRate / (1 - Math.pow(1 + periodicRate, -totalPeriods)) : principal / totalPeriods;
    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(totalPeriods, 360); i++) {
      const interest = balance * periodicRate;
      const principalPay = pmt - interest;
      balance = Math.max(0, balance - principalPay);
      schedule.push({ period: i, payment: Math.round(pmt * 100) / 100, interest: Math.round(interest * 100) / 100, principal: Math.round(principalPay * 100) / 100, balance: Math.round(balance * 100) / 100 });
    }
    const totalInterest = Math.round(schedule.reduce((s, r) => s + r.interest, 0) * 100) / 100;
    rows.push({ principal, rate: rate * 100, term, frequency, periodicPayment: Math.round(pmt * 100) / 100, totalInterest, schedule });
  });
  return {
    headers: ["principal", "rate", "term", "frequency", "periodicPayment", "totalInterest"],
    rows,
    summary: { loanCount: rows.length, totalPrincipal: Math.round(rows.reduce((s, r) => s + r.principal, 0) * 100) / 100, totalInterestAllLoans: Math.round(rows.reduce((s, r) => s + r.totalInterest, 0) * 100) / 100 },
    warnings
  };
}

export function extractBankStatementStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const dateKey = headers[h.findIndex(x => x.includes("date"))] || headers[0];
  const descKey = headers[h.findIndex(x => x.includes("desc") || x.includes("narr") || x.includes("detail"))] || headers[1];
  const drKey = headers[h.findIndex(x => x.includes("debit") || x.includes("payment") || x.includes("out") || x === "dr")] || headers[2];
  const crKey = headers[h.findIndex(x => x.includes("credit") || x.includes("receipt") || x.includes("in") || x === "cr")] || headers[3];
  const balKey = headers[h.findIndex(x => x.includes("balance") || x.includes("bal"))];
  const warnings = [];
  const rows = [];
  let runningBal = null;
  data.forEach((row, i) => {
    const date = row[dateKey] || "";
    const desc = row[descKey] || "";
    const debit = Math.abs(parseFloat(row[drKey])) || 0;
    const credit = Math.abs(parseFloat(row[crKey])) || 0;
    const statedBal = balKey ? parseFloat(row[balKey]) : null;
    if (runningBal === null) runningBal = statedBal || 0;
    runningBal = runningBal - debit + credit;
    if (statedBal !== null && Math.abs(runningBal - statedBal) > 0.01) {
      warnings.push({ row: i + 1, message: `Balance break: expected ${Math.round(runningBal * 100) / 100}, stated ${statedBal}, diff ${Math.round((runningBal - statedBal) * 100) / 100}` });
      runningBal = statedBal;
    }
    rows.push({ date, description: desc, debit, credit, balance: Math.round(runningBal * 100) / 100 });
  });
  return {
    headers: ["date", "description", "debit", "credit", "balance"],
    rows,
    summary: { transactionCount: rows.length, totalDebits: Math.round(rows.reduce((s, r) => s + r.debit, 0) * 100) / 100, totalCredits: Math.round(rows.reduce((s, r) => s + r.credit, 0) * 100) / 100, closingBalance: rows.length ? rows[rows.length - 1].balance : 0, balanceBreaks: warnings.length },
    warnings
  };
}

export function extractFixedAssetRegisterStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const idKey = headers[h.findIndex(x => x.includes("id") || x.includes("asset"))] || headers[0];
  const descKey = headers[h.findIndex(x => x.includes("desc"))] || headers[1];
  const costKey = headers[h.findIndex(x => x.includes("cost"))] || headers[2];
  const dateKey = headers[h.findIndex(x => x.includes("date") || x.includes("acquired"))] || headers[3];
  const lifeKey = headers[h.findIndex(x => x.includes("life") || x.includes("useful"))] || headers[4];
  const methodKey = headers[h.findIndex(x => x.includes("method"))] || headers[5];
  const accDepKey = headers[h.findIndex(x => x.includes("acc") && x.includes("dep"))] || headers[6];
  const nbvKey = headers[h.findIndex(x => x.includes("nbv") || x.includes("net book") || x.includes("wdv"))] || headers[7];
  data.forEach((row, i) => {
    const assetId = String(row[idKey] || "").trim();
    const description = String(row[descKey] || "").trim();
    const cost = parseFloat(row[costKey]) || 0;
    const dateAcquired = row[dateKey] || "";
    const usefulLife = parseInt(row[lifeKey]) || 0;
    const method = String(row[methodKey] || "SL").trim();
    const accDep = parseFloat(row[accDepKey]) || 0;
    const nbv = parseFloat(row[nbvKey]) || 0;
    const expectedNBV = Math.round((cost - accDep) * 100) / 100;
    if (Math.abs(nbv - expectedNBV) > 0.01) {
      warnings.push({ row: i + 1, assetId, message: `NBV mismatch: cost(${cost}) - accDep(${accDep}) = ${expectedNBV}, stated NBV = ${nbv}, diff = ${Math.round((nbv - expectedNBV) * 100) / 100}` });
    }
    rows.push({ assetId, description, cost, dateAcquired, usefulLife, method, accDep, nbv, expectedNBV });
  });
  return {
    headers: ["assetId", "description", "cost", "dateAcquired", "usefulLife", "method", "accDep", "nbv"],
    rows,
    summary: { assetCount: rows.length, totalCost: Math.round(rows.reduce((s, a) => s + a.cost, 0) * 100) / 100, totalAccDep: Math.round(rows.reduce((s, a) => s + a.accDep, 0) * 100) / 100, totalNBV: Math.round(rows.reduce((s, a) => s + a.nbv, 0) * 100) / 100, nbvErrors: warnings.length },
    warnings
  };
}

export function extractDebtorAgingStd(data, eclRates = { current: 0.005, "30": 0.02, "60": 0.05, "90": 0.10, "90+": 0.25 }) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const custKey = headers[h.findIndex(x => x.includes("customer") || x.includes("debtor") || x.includes("name"))] || headers[0];
  const invKey = headers[h.findIndex(x => x.includes("invoice") || x.includes("inv"))] || null;
  const dateKey = headers[h.findIndex(x => x.includes("date"))] || null;
  const amtKey = headers[h.findIndex(x => x.includes("amount") || x.includes("total"))] || null;
  const curKey = headers[h.findIndex(x => x.includes("current"))] || headers[1];
  const d30Key = headers[h.findIndex(x => x === "30" || x.includes("30"))] || headers[2];
  const d60Key = headers[h.findIndex(x => x === "60" || x.includes("60"))] || headers[3];
  const d90Key = headers[h.findIndex(x => x === "90" || (x.includes("90") && !x.includes("90+")))] || headers[4];
  const d90pKey = headers[h.findIndex(x => x.includes("90+") || x.includes("120") || x.includes("over"))] || headers[5];
  let totalCurrent = 0, total30 = 0, total60 = 0, total90 = 0, total90p = 0;
  data.forEach((row, i) => {
    const customer = String(row[custKey] || "").trim();
    const invoice = invKey ? String(row[invKey] || "").trim() : "";
    const date = dateKey ? row[dateKey] || "" : "";
    const amount = amtKey ? parseFloat(row[amtKey]) || 0 : 0;
    const current = parseFloat(row[curKey]) || 0;
    const d30 = parseFloat(row[d30Key]) || 0;
    const d60 = parseFloat(row[d60Key]) || 0;
    const d90 = parseFloat(row[d90Key]) || 0;
    const d90p = parseFloat(row[d90pKey]) || 0;
    const total = current + d30 + d60 + d90 + d90p;
    const provision = current * eclRates.current + d30 * eclRates["30"] + d60 * eclRates["60"] + d90 * eclRates["90"] + d90p * eclRates["90+"];
    if (amount > 0 && Math.abs(amount - total) > 0.01) {
      warnings.push({ row: i + 1, customer, message: `Total amount (${amount}) does not match sum of aging buckets (${Math.round(total * 100) / 100})` });
    }
    totalCurrent += current; total30 += d30; total60 += d60; total90 += d90; total90p += d90p;
    rows.push({ customer, invoice, date, current, d30, d60, d90, "d90+": d90p, total: Math.round(total * 100) / 100, provision: Math.round(provision * 100) / 100 });
  });
  const grandTotal = totalCurrent + total30 + total60 + total90 + total90p;
  const totalProvision = totalCurrent * eclRates.current + total30 * eclRates["30"] + total60 * eclRates["60"] + total90 * eclRates["90"] + total90p * eclRates["90+"];
  return {
    headers: ["customer", "invoice", "date", "current", "d30", "d60", "d90", "d90+", "total", "provision"],
    rows,
    summary: { debtorCount: rows.length, grandTotal: Math.round(grandTotal * 100) / 100, totalProvision: Math.round(totalProvision * 100) / 100, eclRates, agingSummary: { current: Math.round(totalCurrent * 100) / 100, d30: Math.round(total30 * 100) / 100, d60: Math.round(total60 * 100) / 100, d90: Math.round(total90 * 100) / 100, "d90+": Math.round(total90p * 100) / 100 } },
    warnings
  };
}

export function extractCreditorAgingStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const suppKey = headers[h.findIndex(x => x.includes("supplier") || x.includes("creditor") || x.includes("vendor") || x.includes("name"))] || headers[0];
  const invKey = headers[h.findIndex(x => x.includes("invoice") || x.includes("inv"))] || null;
  const dateKey = headers[h.findIndex(x => x.includes("date"))] || null;
  const amtKey = headers[h.findIndex(x => x.includes("amount") || x.includes("total"))] || null;
  const curKey = headers[h.findIndex(x => x.includes("current"))] || headers[1];
  const d30Key = headers[h.findIndex(x => x === "30" || x.includes("30"))] || headers[2];
  const d60Key = headers[h.findIndex(x => x === "60" || x.includes("60"))] || headers[3];
  const d90Key = headers[h.findIndex(x => x === "90" || (x.includes("90") && !x.includes("90+")))] || headers[4];
  const d90pKey = headers[h.findIndex(x => x.includes("90+") || x.includes("120") || x.includes("over"))] || headers[5];
  data.forEach((row, i) => {
    const supplier = String(row[suppKey] || "").trim();
    const invoice = invKey ? String(row[invKey] || "").trim() : "";
    const date = dateKey ? row[dateKey] || "" : "";
    const amount = amtKey ? parseFloat(row[amtKey]) || 0 : 0;
    const current = parseFloat(row[curKey]) || 0;
    const d30 = parseFloat(row[d30Key]) || 0;
    const d60 = parseFloat(row[d60Key]) || 0;
    const d90 = parseFloat(row[d90Key]) || 0;
    const d90p = parseFloat(row[d90pKey]) || 0;
    const total = current + d30 + d60 + d90 + d90p;
    if (amount > 0 && Math.abs(amount - total) > 0.01) {
      warnings.push({ row: i + 1, supplier, message: `Total amount (${amount}) does not match sum of aging buckets (${Math.round(total * 100) / 100})` });
    }
    if (d60 + d90 + d90p > 0) {
      warnings.push({ row: i + 1, supplier, message: `Overdue balance of ${Math.round((d60 + d90 + d90p) * 100) / 100} (60+ days)` });
    }
    rows.push({ supplier, invoice, date, current, d30, d60, d90, "d90+": d90p, total: Math.round(total * 100) / 100 });
  });
  const grandTotal = Math.round(rows.reduce((s, r) => s + r.total, 0) * 100) / 100;
  const overdueTotal = Math.round(rows.reduce((s, r) => s + r.d60 + r.d90 + r["d90+"], 0) * 100) / 100;
  return {
    headers: ["supplier", "invoice", "date", "current", "d30", "d60", "d90", "d90+", "total"],
    rows,
    summary: { creditorCount: rows.length, grandTotal, overdueTotal, overduePercentage: grandTotal > 0 ? Math.round(overdueTotal / grandTotal * 10000) / 100 : 0 },
    warnings
  };
}

export function extractPayrollStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const empKey = headers[h.findIndex(x => x.includes("employee") || x.includes("name") || x.includes("staff"))] || headers[0];
  const grossKey = headers[h.findIndex(x => x.includes("gross"))] || headers[1];
  const payeKey = headers[h.findIndex(x => x.includes("paye") || x.includes("tax"))] || headers[2];
  const niKey = headers[h.findIndex(x => x.includes("ni") || x.includes("national"))] || headers[3];
  const pensionKey = headers[h.findIndex(x => x.includes("pension"))] || headers[4];
  const netKey = headers[h.findIndex(x => x.includes("net"))] || headers[5];
  let totals = { gross: 0, paye: 0, ni: 0, pension: 0, net: 0 };
  data.forEach((row, i) => {
    const employee = String(row[empKey] || "").trim();
    const gross = parseFloat(row[grossKey]) || 0;
    const paye = parseFloat(row[payeKey]) || 0;
    const ni = parseFloat(row[niKey]) || 0;
    const pension = parseFloat(row[pensionKey]) || 0;
    const net = parseFloat(row[netKey]) || 0;
    const expectedNet = Math.round((gross - paye - ni - pension) * 100) / 100;
    const reconciled = Math.abs(net - expectedNet) < 0.01;
    const difference = Math.round((net - expectedNet) * 100) / 100;
    if (!reconciled) {
      warnings.push({ row: i + 1, employee, message: `Gross-to-net reconciliation failure: expected ${expectedNet}, stated ${net}, diff ${difference}` });
    }
    totals.gross += gross; totals.paye += paye; totals.ni += ni; totals.pension += pension; totals.net += net;
    rows.push({ employee, gross, paye, ni, pension, net, expectedNet, reconciled, difference });
  });
  Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] * 100) / 100; });
  return {
    headers: ["employee", "gross", "paye", "ni", "pension", "net"],
    rows,
    summary: { headcount: rows.length, totals, allReconciled: rows.every(r => r.reconciled), reconFailures: warnings.length },
    warnings
  };
}

export function extractShareRegisterStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const holderKey = headers[h.findIndex(x => x.includes("holder") || x.includes("shareholder") || x.includes("name"))] || headers[0];
  const classKey = headers[h.findIndex(x => x.includes("class") || x.includes("type"))] || headers[1];
  const sharesKey = headers[h.findIndex(x => x.includes("shares") || x.includes("number") || x.includes("qty"))] || headers[2];
  const nominalKey = headers[h.findIndex(x => x.includes("nominal") || x.includes("par"))] || headers[3];
  const paidKey = headers[h.findIndex(x => x.includes("paid"))] || headers[4];
  const pctKey = headers[h.findIndex(x => x.includes("%") || x.includes("percent"))] || null;
  let totalShares = 0, totalNominal = 0, totalPaid = 0;
  data.forEach((row) => {
    const shares = parseInt(row[sharesKey]) || 0;
    totalShares += shares;
  });
  data.forEach((row, i) => {
    const holder = String(row[holderKey] || "").trim();
    const shareClass = String(row[classKey] || "Ordinary").trim();
    const shares = parseInt(row[sharesKey]) || 0;
    const nominal = parseFloat(row[nominalKey]) || 1.00;
    const paid = parseFloat(row[paidKey]) || nominal;
    const statedPct = pctKey ? parseFloat(row[pctKey]) || 0 : null;
    const calcPct = totalShares > 0 ? Math.round(shares / totalShares * 10000) / 100 : 0;
    if (statedPct !== null && Math.abs(statedPct - calcPct) > 0.01) {
      warnings.push({ row: i + 1, holder, message: `Percentage mismatch: stated ${statedPct}%, calculated ${calcPct}%` });
    }
    if (paid < nominal * shares && paid > 0) {
      warnings.push({ row: i + 1, holder, message: `Shares not fully paid: nominal ${nominal * shares}, paid ${paid}` });
    }
    const nominalTotal = shares * nominal;
    totalNominal += nominalTotal;
    totalPaid += paid > 0 ? paid : nominalTotal;
    rows.push({ holder, class: shareClass, shares, nominal, paid, percentage: calcPct, nominalTotal: Math.round(nominalTotal * 100) / 100 });
  });
  const pctTotal = Math.round(rows.reduce((s, r) => s + r.percentage, 0) * 100) / 100;
  if (Math.abs(pctTotal - 100) > 0.01 && rows.length > 0) {
    warnings.push({ message: `Total percentage is ${pctTotal}%, expected 100%` });
  }
  return {
    headers: ["holder", "class", "shares", "nominal", "paid", "percentage"],
    rows,
    summary: { shareholderCount: rows.length, totalShares, totalNominal: Math.round(totalNominal * 100) / 100, totalPaid: Math.round(totalPaid * 100) / 100, shareCapital: Math.round(totalNominal * 100) / 100 },
    warnings
  };
}

export function extractContractRegisterStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const nameKey = headers[h.findIndex(x => x.includes("contract") || x.includes("project") || x.includes("name"))] || headers[0];
  const valueKey = headers[h.findIndex(x => x.includes("value") || x.includes("contract value") || x.includes("price"))] || headers[1];
  const costsKey = headers[h.findIndex(x => x.includes("cost") && x.includes("date"))] || headers[2];
  const estCostKey = headers[h.findIndex(x => x.includes("estimated") || x.includes("total cost") || x.includes("est"))] || headers[3];
  const compKey = headers[h.findIndex(x => x.includes("completion") || x.includes("%") || x.includes("complete"))] || null;
  data.forEach((row, i) => {
    const name = String(row[nameKey] || "").trim();
    const contractValue = parseFloat(row[valueKey]) || 0;
    const costsToDate = parseFloat(row[costsKey]) || 0;
    const estimatedTotalCost = parseFloat(row[estCostKey]) || 0;
    // IAS 11 / FRS 102 s23: cost-to-cost method for stage of completion
    const statedCompletion = compKey ? parseFloat(row[compKey]) : null;
    const calcCompletion = estimatedTotalCost > 0 ? Math.round(costsToDate / estimatedTotalCost * 10000) / 100 : 0;
    if (statedCompletion !== null && Math.abs(statedCompletion - calcCompletion) > 1) {
      warnings.push({ row: i + 1, name, message: `Completion % mismatch: stated ${statedCompletion}%, cost-to-cost ${calcCompletion}%` });
    }
    const completionPct = calcCompletion / 100;
    const revenueToDate = Math.round(contractValue * completionPct * 100) / 100;
    const estimatedProfit = contractValue - estimatedTotalCost;
    const profitToDate = Math.round(estimatedProfit * completionPct * 100) / 100;
    const wipBalance = Math.round((costsToDate + Math.max(0, profitToDate) - revenueToDate) * 100) / 100;
    const billedToDate = parseFloat(row.billed || row.Billed || row.billings || 0) || 0;
    const overUnderBilling = billedToDate > 0 ? Math.round((revenueToDate - billedToDate) * 100) / 100 : 0;
    const isLossMaking = estimatedProfit < 0;
    if (isLossMaking) {
      warnings.push({ row: i + 1, name, message: `Loss-making contract: estimated loss ${Math.round(Math.abs(estimatedProfit) * 100) / 100}. Full provision required per IAS 11/FRS 102 s23.` });
    }
    rows.push({ name, contractValue, costsToDate, estimatedTotalCost, completionPct: calcCompletion, revenueToDate, estimatedProfit: Math.round(estimatedProfit * 100) / 100, profitToDate, wipBalance, overUnderBilling, isLossMaking });
  });
  return {
    headers: ["name", "contractValue", "costsToDate", "estimatedTotalCost", "completionPct", "revenueToDate", "estimatedProfit", "profitToDate", "wipBalance"],
    rows,
    summary: { contractCount: rows.length, totalRevenue: Math.round(rows.reduce((s, r) => s + r.revenueToDate, 0) * 100) / 100, totalCosts: Math.round(rows.reduce((s, r) => s + r.costsToDate, 0) * 100) / 100, totalWIP: Math.round(rows.reduce((s, r) => s + r.wipBalance, 0) * 100) / 100, lossMakingCount: rows.filter(r => r.isLossMaking).length },
    warnings
  };
}

export function extractInvestmentPortfolioStd(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const h = headers.map(x => String(x).toLowerCase());
  const warnings = [];
  const rows = [];
  const instKey = headers[h.findIndex(x => x.includes("instrument") || x.includes("security") || x.includes("name"))] || headers[0];
  const isinKey = headers[h.findIndex(x => x.includes("isin") || x.includes("identifier"))] || headers[1];
  const qtyKey = headers[h.findIndex(x => x.includes("qty") || x.includes("quantity") || x.includes("units") || x.includes("holding"))] || headers[2];
  const costKey = headers[h.findIndex(x => x.includes("cost"))] || headers[3];
  const fvKey = headers[h.findIndex(x => x.includes("fair") || x.includes("fv") || x.includes("market") || x.includes("value"))] || headers[4];
  const classifKey = headers[h.findIndex(x => x.includes("classif") || x.includes("ifrs") || x.includes("category"))] || headers[5];
  const validClassifications = ["FVPL", "FVOCI", "AmortisedCost", "HFT", "AFS", "HTM", "L&R"];
  data.forEach((row, i) => {
    const instrument = String(row[instKey] || "").trim();
    const isin = String(row[isinKey] || "").trim();
    const quantity = parseInt(row[qtyKey]) || 0;
    const cost = parseFloat(row[costKey]) || 0;
    const fairValue = parseFloat(row[fvKey]) || 0;
    const classification = String(row[classifKey] || "FVPL").trim();
    if (isin && !/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) {
      warnings.push({ row: i + 1, instrument, message: `Invalid ISIN format: ${isin}` });
    }
    if (!validClassifications.includes(classification)) {
      warnings.push({ row: i + 1, instrument, message: `Unrecognised IFRS 9 classification: ${classification}. Expected one of: ${validClassifications.join(", ")}` });
    }
    const totalCost = quantity * cost;
    const totalFairValue = quantity * fairValue;
    const unrealisedGainLoss = Math.round((totalFairValue - totalCost) * 100) / 100;
    rows.push({ instrument, isin, quantity, cost, fairValue, classification, totalCost: Math.round(totalCost * 100) / 100, totalFairValue: Math.round(totalFairValue * 100) / 100, unrealisedGainLoss });
  });
  const byClassification = {};
  rows.forEach(r => {
    if (!byClassification[r.classification]) byClassification[r.classification] = { count: 0, totalFV: 0, totalGainLoss: 0 };
    byClassification[r.classification].count++;
    byClassification[r.classification].totalFV += r.totalFairValue;
    byClassification[r.classification].totalGainLoss += r.unrealisedGainLoss;
  });
  return {
    headers: ["instrument", "isin", "quantity", "cost", "fairValue", "classification", "totalCost", "totalFairValue", "unrealisedGainLoss"],
    rows,
    summary: { instrumentCount: rows.length, totalCost: Math.round(rows.reduce((s, r) => s + r.totalCost, 0) * 100) / 100, totalFairValue: Math.round(rows.reduce((s, r) => s + r.totalFairValue, 0) * 100) / 100, totalUnrealisedGainLoss: Math.round(rows.reduce((s, r) => s + r.unrealisedGainLoss, 0) * 100) / 100, byClassification },
    warnings
  };
}

// ─── R) SMART EXTRACT — Auto-detect and route ───
export async function smartExtract(file, targetWP) {
  const ext = file.name.split(".").pop().toLowerCase();
  const isXls = ext === "xlsx" || ext === "xls";

  let rawData;
  if (isXls) {
    const buf = await file.arrayBuffer();
    const extracted = await extractFromExcel(buf);
    const firstSheet = extracted.sheets[extracted.sheetNames[0]];
    rawData = { headers: firstSheet.headers, rows: firstSheet.rows };
  } else {
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
    rawData = { headers: parsed.meta?.fields || [], rows: parsed.data };
  }

  // Route based on target WP
  const wpRoutes = {
    c1: () => ({ type: "trialBalance", data: extractTrialBalance(rawData.rows, rawData.headers) }),
    d1: () => ({ type: "revenue", data: rawData }),
    d2: () => ({ type: "debtorAging", data: extractDebtorAging(rawData.rows, rawData.headers) }),
    d3: () => ({ type: "inventory", data: rawData }),
    d4: () => ({ type: "creditorAging", data: extractCreditorAging(rawData.rows, rawData.headers) }),
    d5: () => ({ type: "payroll", data: extractPayroll(rawData.rows, rawData.headers) }),
    d6: () => ({ type: "bankStatement", data: extractBankStatement(rawData.rows, rawData.headers) }),
    d7: () => ({ type: "fixedAssets", data: extractFixedAssetRegister(rawData.rows, rawData.headers) }),
    d9: () => ({ type: "investments", data: extractInvestmentPortfolio(rawData.rows, rawData.headers) }),
    d10: () => ({ type: "shareRegister", data: extractShareRegister(rawData.rows, rawData.headers) }),
    d11: () => ({ type: "loanSchedule", data: extractLoanSchedule(rawData.rows, rawData.headers) }),
    d12: () => ({ type: "provisions", data: extractProvisions(rawData.rows, rawData.headers) }),
    d13: () => ({ type: "taxComputation", data: rawData }),
    d14: () => ({ type: "leaseSchedule", data: extractLeaseSchedule(rawData.rows, rawData.headers) }),
    d15: () => ({ type: "relatedParties", data: rawData }),
    d16: () => ({ type: "cashFlow", data: rawData }),
    // Standardised extractors (accept PapaParse data, return {headers, rows, summary, warnings})
    s_loan: () => ({ type: "loanScheduleStd", data: extractLoanScheduleStd(rawData.rows) }),
    s_bank: () => ({ type: "bankStatementStd", data: extractBankStatementStd(rawData.rows) }),
    s_fa: () => ({ type: "fixedAssetsStd", data: extractFixedAssetRegisterStd(rawData.rows) }),
    s_debtor: () => ({ type: "debtorAgingStd", data: extractDebtorAgingStd(rawData.rows) }),
    s_creditor: () => ({ type: "creditorAgingStd", data: extractCreditorAgingStd(rawData.rows) }),
    s_payroll: () => ({ type: "payrollStd", data: extractPayrollStd(rawData.rows) }),
    s_shares: () => ({ type: "shareRegisterStd", data: extractShareRegisterStd(rawData.rows) }),
    s_contract: () => ({ type: "contractRegisterStd", data: extractContractRegisterStd(rawData.rows) }),
    s_investment: () => ({ type: "investmentPortfolioStd", data: extractInvestmentPortfolioStd(rawData.rows) }),
  };

  if (wpRoutes[targetWP]) {
    try {
      return wpRoutes[targetWP]();
    } catch (e) {
      return { type: "generic", data: rawData, error: e.message };
    }
  }
  return { type: "generic", data: rawData };
}
