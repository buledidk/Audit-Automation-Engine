// ═══════════════════════════════════════════════════════════════
// EXCEL GENERATOR — Real .xlsx workbook generation
// AuditEngine v10 AURA
// Uses SheetJS (xlsx) for workbook creation
// ═══════════════════════════════════════════════════════════════

async function getXLSX() { return import("xlsx"); }

function dl(wb, XLSX, filename) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
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

function coverData(ctx, wpRef, wpLabel) {
  return [["AuditEngine v10 AURA", "", "", "", ""], [ctx.entityName || "Entity", "", "FYE: " + (ctx.fye || ""), "", ""], ["Generated: " + new Date().toISOString().slice(0, 10), "", "Indus Nexus Limited", "", ""], [], ["Working Paper", wpRef + " — " + wpLabel], ["Industry", ctx.industry || ""], ["Framework", ctx.framework || ""], ["Materiality", "£" + (ctx.materiality || "TBD")], ["Perf Materiality", "£" + (ctx.perfMateriality || "TBD")]];
}

function fname(ctx, ref, suffix) {
  return (ctx.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_" + (ctx.fye || "FYE").replace(/[^a-zA-Z0-9]/g, "") + "_" + ref + "_" + new Date().toISOString().slice(0, 10) + (suffix ? "_" + suffix : "") + ".xlsx";
}

// ─── TESTING WORKBOOK (D1-D16) ───
export async function generateTestingWorkbook(wp, ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", coverData(ctx, wp.ref, wp.label));
  // FSLI Lead
  const fsliLines = ctx.fsliLines || [];
  if (fsliLines.length) {
    const fData = [["FSLI Line Item", "PY (£)", "CY (£)", "Movement (£)", "Movement %", "Status"]];
    fsliLines.forEach(l => fData.push([l, "", "", "", "", ""]));
    addSheet(XLSX, wb, "FSLI Lead", fData);
  }
  // Procedures
  const tests = [...(ctx.tests || []), ...(ctx.customTests || [])];
  if (tests.length) {
    const pData = [["Ref", "Procedure", "Assertion", "ISA", "Sample Size", "Result", "Exceptions", "Judgment", "Judgment Note", "Prepared", "Reviewed"]];
    tests.forEach((t, i) => pData.push([wp.ref + ".S" + String(i + 1).padStart(2, "0"), t, "", wp.isa || "", "", "", "", "", "", "", ""]));
    addSheet(XLSX, wb, "Procedures", pData);
  }
  // Sample Grid
  const sData = [["#", "Item Selected", "Value (£)", "Test Performed", "Result", "Exception", "Comment"]];
  for (let i = 1; i <= 25; i++) sData.push([i, "", "", "", "", "", ""]);
  addSheet(XLSX, wb, "Sample Grid", sData);
  // Results
  addSheet(XLSX, wb, "Results", [["Metric", "Value"], ["Total items tested", ""], ["Exceptions found", ""], ["Exception rate %", ""], ["Material exceptions", ""], ["Conclusion", ctx.conclusion || ""], ["Follow-up required", ""], ["Prepared by", ""], ["Reviewed by", ""], ["Date", ""]]);
  // Notes
  addSheet(XLSX, wb, "Conclusion", [["Working Paper Conclusion"], [], ["Notes", ctx.wpNotes || ""], ["Conclusion", ctx.conclusion || ""]]);
  // Evidence Links
  if (ctx.procedureLinks) {
    const evData = [["Procedure Key", "Linked Evidence"]];
    Object.entries(ctx.procedureLinks).forEach(([key, ids]) => { if (ids && ids.length) evData.push([key, ids.join(", ")]); });
    if (evData.length > 1) addSheet(XLSX, wb, "Evidence Links", evData);
  }
  dl(wb, XLSX, fname(ctx, wp.ref, wp.label.replace(/[^a-zA-Z0-9]/g, "_")));
}

// ─── TRIAL BALANCE WORKBOOK ───
export async function generateTrialBalanceWorkbook(ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", coverData(ctx, "C1", "Trial Balance"));
  if (ctx.tbData && ctx.tbData.length) {
    const tbSheet = [["Code", "Account", "PY (£)", "CY (£)", "Movement (£)", "Movement %", "FSLI Category"]];
    ctx.tbData.forEach((r, i) => {
      const mv = r.cy - r.py;
      const mvPct = r.py !== 0 ? Math.round(mv / Math.abs(r.py) * 100) : "";
      tbSheet.push([r.code, r.account, r.py, r.cy, mv, mvPct, ctx.tbMappings?.[i] || ""]);
    });
    addSheet(XLSX, wb, "Trial Balance", tbSheet);
    // Reconciliation
    const totalPY = ctx.tbData.reduce((s, r) => s + r.py, 0);
    const totalCY = ctx.tbData.reduce((s, r) => s + r.cy, 0);
    const mapped = Object.keys(ctx.tbMappings || {}).filter(k => ctx.tbMappings[k]).length;
    addSheet(XLSX, wb, "Reconciliation", [["Summary", ""], ["Total PY", totalPY], ["Total CY", totalCY], ["Net Movement", totalCY - totalPY], ["Accounts", ctx.tbData.length], ["Mapped", mapped], ["Unmapped", ctx.tbData.length - mapped], ["Mapping %", Math.round(mapped / ctx.tbData.length * 100)]]);
  }
  dl(wb, XLSX, fname(ctx, "C1", "Trial_Balance"));
}

// ─── FINANCIAL MODEL WORKBOOK (generic for any calculator) ───
export async function generateModelWorkbook(modelName, inputs, outputs, schedule, ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", [...coverData(ctx, modelName, modelName), [], ["Model", modelName]]);
  // Inputs
  const iData = [["Input Parameter", "Value"]];
  Object.entries(inputs).forEach(([k, v]) => iData.push([k, v]));
  addSheet(XLSX, wb, "Inputs", iData);
  // Outputs
  const oData = [["Output", "Value"]];
  Object.entries(outputs).forEach(([k, v]) => oData.push([k, typeof v === "object" ? JSON.stringify(v) : v]));
  addSheet(XLSX, wb, "Outputs", oData);
  // Schedule
  if (schedule && schedule.length) {
    const headers = Object.keys(schedule[0]);
    const sData = [headers];
    schedule.forEach(row => sData.push(headers.map(h => row[h])));
    addSheet(XLSX, wb, "Schedule", sData);
  }
  dl(wb, XLSX, fname(ctx, modelName, "Model"));
}

// ─── MASTER AUDIT FILE ───
export async function generateMasterAuditFile(ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  // 1. Index
  addSheet(XLSX, wb, "Index", [["MASTER AUDIT FILE"], [], ["Entity", ctx.entityName], ["FYE", ctx.fye], ["Framework", ctx.framework], ["Industry", ctx.industry], ["Sector", ctx.sector], ["Materiality", "£" + (ctx.materiality || "TBD")], ["Perf Materiality", "£" + (ctx.perfMateriality || "TBD")], ["Partner", ctx.partner], ["Manager", ctx.manager], ["Generated", new Date().toISOString().slice(0, 10)]]);
  // 2. WP Status
  const wpData = [["Ref", "Working Paper", "ISA", "Status", "Prepared", "Reviewed", "Notes"]];
  (ctx.allWPs || []).forEach(w => {
    const so = ctx.signOffs?.[w.id] || {};
    wpData.push([w.ref, w.label, w.isa || "", so.preparedBy ? "Complete" : "Open", so.preparedBy || "", so.reviewedBy || "", ctx.wpNotes?.[w.id] || ""]);
  });
  addSheet(XLSX, wb, "WP Status", wpData);
  // 3. Risk Register
  if (ctx.risks && ctx.risks.length) {
    const rData = [["Ref", "Risk", "Level", "ISA", "Response"]];
    ctx.risks.forEach(r => rData.push([r.id, r.t, r.lv, r.isa, r.rs || ""]));
    addSheet(XLSX, wb, "Risk Register", rData);
  }
  // 4. Trial Balance
  if (ctx.tbData && ctx.tbData.length) {
    const tbData = [["Code", "Account", "PY", "CY", "Movement", "FSLI"]];
    ctx.tbData.forEach((r, i) => tbData.push([r.code, r.account, r.py, r.cy, r.cy - r.py, ctx.tbMappings?.[i] || ""]));
    addSheet(XLSX, wb, "Trial Balance", tbData);
  }
  // 5. All cell data
  const cdKeys = Object.keys(ctx.cellData || {});
  if (cdKeys.length) {
    const cdData = [["Key", "Value"]];
    cdKeys.forEach(k => cdData.push([k, ctx.cellData[k]]));
    addSheet(XLSX, wb, "Cell Data", cdData);
  }
  // 6. Sign-offs
  const soData = [["WP ID", "Prepared By", "Reviewed By"]];
  Object.entries(ctx.signOffs || {}).forEach(([id, so]) => soData.push([id, so.preparedBy || "", so.reviewedBy || ""]));
  addSheet(XLSX, wb, "Sign-offs", soData);
  // 7. Individual WP sheets — one sheet per working paper with its cell data
  const allWPs = ctx.allWPs || [];
  allWPs.forEach(w => {
    const prefix = w.id;
    const cellData = ctx.cellData || {};
    const keys = Object.keys(cellData).filter(k =>
      k.startsWith(prefix + "_") ||
      k.startsWith("fsli_" + prefix + "_") ||
      k.startsWith("sub_" + prefix + "_") ||
      k.startsWith("proc_" + prefix + "_") ||
      k.startsWith("test_" + prefix + "_") ||
      k.startsWith("cyc_" + prefix + "_")
    );
    if (keys.length) {
      const wpSheetData = [["Key", "Value"]];
      keys.forEach(k => wpSheetData.push([k, cellData[k]]));
      const sheetName = (w.ref + " " + w.label).slice(0, 31).replace(/[\\/*?[\]:]/g, "");
      addSheet(XLSX, wb, sheetName, wpSheetData);
    }
  });
  dl(wb, XLSX, fname(ctx, "MASTER", "Audit_File"));
}

// ─── IAS 36 IMPAIRMENT WORKBOOK ───
export async function generateIAS36Workbook(ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", [...coverData(ctx, "IAS36", "Impairment Review"), [], ["Standard", "IAS 36 — Impairment of Assets"]]);
  // Inputs
  const inputs = ctx.modelData?.inputs || {};
  const iData = [["Input Parameter", "Value"]];
  const defaultInputs = {
    "CGU / Asset": "", "Carrying Amount (£)": "", "Discount Rate (WACC %)": "",
    "Terminal Growth Rate (%)": "", "Forecast Period (years)": "5",
    "Tax Rate (%)": "", "Revenue Growth Year 1 (%)": "", "Revenue Growth Year 2 (%)": "",
    "Revenue Growth Year 3 (%)": "", "Revenue Growth Year 4 (%)": "", "Revenue Growth Year 5 (%)": "",
    "EBITDA Margin (%)": "", "Capex as % of Revenue": "", "Working Capital Movement (£)": ""
  };
  Object.entries({ ...defaultInputs, ...inputs }).forEach(([k, v]) => iData.push([k, v]));
  addSheet(XLSX, wb, "Inputs", iData);
  // DCF Schedule
  const schedule = ctx.modelData?.schedule || [];
  if (schedule.length) {
    const headers = Object.keys(schedule[0]);
    const sData = [headers];
    schedule.forEach(row => sData.push(headers.map(h => row[h])));
    addSheet(XLSX, wb, "DCF Schedule", sData);
  } else {
    addSheet(XLSX, wb, "DCF Schedule", [
      ["Year", "Revenue (£)", "EBITDA (£)", "Depreciation (£)", "EBIT (£)", "Tax (£)", "NOPAT (£)", "Capex (£)", "WC Change (£)", "Free Cash Flow (£)", "Discount Factor", "PV of FCF (£)"],
      [1, "", "", "", "", "", "", "", "", "", "", ""],
      [2, "", "", "", "", "", "", "", "", "", "", ""],
      [3, "", "", "", "", "", "", "", "", "", "", ""],
      [4, "", "", "", "", "", "", "", "", "", "", ""],
      [5, "", "", "", "", "", "", "", "", "", "", ""],
      ["Terminal", "", "", "", "", "", "", "", "", "", "", ""],
    ]);
  }
  // Outputs
  const outputs = ctx.modelData?.outputs || {};
  const oData = [["Output", "Value"]];
  const defaultOutputs = {
    "Sum of PV of FCFs (£)": "", "Terminal Value (£)": "", "PV of Terminal Value (£)": "",
    "Enterprise Value (£)": "", "Less: Net Debt (£)": "", "Value in Use (£)": "",
    "Carrying Amount (£)": "", "Headroom / (Impairment) (£)": "", "Impairment Required": ""
  };
  Object.entries({ ...defaultOutputs, ...outputs }).forEach(([k, v]) => oData.push([k, typeof v === "object" ? JSON.stringify(v) : v]));
  addSheet(XLSX, wb, "Outputs", oData);
  // Sensitivity Matrix
  const sensData = [
    ["SENSITIVITY MATRIX — Headroom / (Impairment) (£)"],
    [],
    ["Discount Rate \\ Growth Rate", "-1.0%", "-0.5%", "Base", "+0.5%", "+1.0%"],
    ["-1.0%", "", "", "", "", ""],
    ["-0.5%", "", "", "", "", ""],
    ["Base", "", "", "", "", ""],
    ["+0.5%", "", "", "", "", ""],
    ["+1.0%", "", "", "", "", ""],
    [],
    ["Key assumptions and sources:"],
    ["Discount rate source", ""],
    ["Growth rate source", ""],
    ["Management's key assumptions", ""],
    ["Auditor's assessment of reasonableness", ""],
  ];
  addSheet(XLSX, wb, "Sensitivity Matrix", sensData);
  // Conclusion
  addSheet(XLSX, wb, "Conclusion", [
    ["IAS 36 Impairment Conclusion"], [],
    ["CGU / Asset", ""], ["Carrying Amount", ""], ["Recoverable Amount", ""],
    ["Basis (VIU or FVLCD)", "Value in Use"],
    ["Headroom / (Impairment)", ""], ["Impairment recognised", ""],
    ["Sensitivity: is headroom sensitive to reasonable changes?", ""],
    [], ["Conclusion", ctx.wpNotes?.ias36 || ""],
    ["Prepared by", ""], ["Reviewed by", ""], ["Date", ""]
  ]);
  dl(wb, XLSX, fname(ctx, "IAS36", "Impairment"));
}

// ─── IFRS 16 LEASES WORKBOOK ───
export async function generateIFRS16Workbook(ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", [...coverData(ctx, "IFRS16", "Lease Accounting"), [], ["Standard", "IFRS 16 — Leases"]]);
  // Inputs
  const inputs = ctx.modelData?.inputs || {};
  const iData = [["Input Parameter", "Value"]];
  const defaultInputs = {
    "Lease Description": "", "Commencement Date": "", "Lease Term (months)": "",
    "Annual Lease Payment (£)": "", "Payment Frequency": "Monthly",
    "Incremental Borrowing Rate (%)": "", "Initial Direct Costs (£)": "0",
    "Lease Incentives Received (£)": "0", "Residual Value Guarantee (£)": "0",
    "Extension Option (months)": "0", "Reasonably Certain to Extend": "No",
    "Short-Term Lease Exemption": "No", "Low-Value Asset Exemption": "No"
  };
  Object.entries({ ...defaultInputs, ...inputs }).forEach(([k, v]) => iData.push([k, v]));
  addSheet(XLSX, wb, "Inputs", iData);
  // Amortisation Schedule
  const schedule = ctx.modelData?.schedule || [];
  if (schedule.length) {
    const headers = Object.keys(schedule[0]);
    const sData = [headers];
    schedule.forEach(row => sData.push(headers.map(h => row[h])));
    addSheet(XLSX, wb, "Amortisation Schedule", sData);
  } else {
    const amortData = [["Period", "Opening Lease Liability (£)", "Interest Charge (£)", "Lease Payment (£)", "Closing Lease Liability (£)", "Opening ROU Asset (£)", "Depreciation (£)", "Closing ROU Asset (£)"]];
    for (let i = 1; i <= 60; i++) amortData.push([i, "", "", "", "", "", "", ""]);
    addSheet(XLSX, wb, "Amortisation Schedule", amortData);
  }
  // Summary
  const outputs = ctx.modelData?.outputs || {};
  const oData = [["Output", "Value"]];
  const defaultOutputs = {
    "Initial Lease Liability (£)": "", "Initial ROU Asset (£)": "",
    "Total Interest over Lease Term (£)": "", "Total Depreciation over Lease Term (£)": "",
    "Closing Lease Liability — Current (£)": "", "Closing Lease Liability — Non-Current (£)": "",
    "Closing ROU Asset (£)": "", "P&L Impact — Interest (£)": "", "P&L Impact — Depreciation (£)": "",
    "Cash Flow — Financing (£)": "", "Cash Flow — Operating (£)": ""
  };
  Object.entries({ ...defaultOutputs, ...outputs }).forEach(([k, v]) => oData.push([k, typeof v === "object" ? JSON.stringify(v) : v]));
  addSheet(XLSX, wb, "Summary", oData);
  // Journal Entries
  addSheet(XLSX, wb, "Journal Entries", [
    ["IFRS 16 Journal Entries"], [],
    ["Date", "Account", "Dr (£)", "Cr (£)", "Narrative"],
    ["Commencement", "Right-of-Use Asset", "", "", "Initial recognition of ROU asset"],
    ["Commencement", "Lease Liability", "", "", "Initial recognition of lease liability"],
    ["Period End", "Interest Expense", "", "", "Unwinding of discount on lease liability"],
    ["Period End", "Lease Liability", "", "", "Interest accrual"],
    ["Period End", "Depreciation Expense", "", "", "Depreciation of ROU asset"],
    ["Period End", "ROU Asset — Accum Depn", "", "", "Accumulated depreciation"],
    ["Payment Date", "Lease Liability", "", "", "Lease payment — principal"],
    ["Payment Date", "Cash / Bank", "", "", "Cash outflow for lease payment"],
  ]);
  // Conclusion
  addSheet(XLSX, wb, "Conclusion", [
    ["IFRS 16 Lease Conclusion"], [],
    ["Lease Description", ""], ["Classification", "Right-of-Use Lease"],
    ["Lease Liability at FYE", ""], ["ROU Asset at FYE", ""],
    [], ["Conclusion", ctx.wpNotes?.ifrs16 || ""],
    ["Prepared by", ""], ["Reviewed by", ""], ["Date", ""]
  ]);
  dl(wb, XLSX, fname(ctx, "IFRS16", "Leases"));
}

// ─── IFRS 9 ECL WORKBOOK ───
export async function generateECLWorkbook(ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", [...coverData(ctx, "ECL", "Expected Credit Losses"), [], ["Standard", "IFRS 9 — Expected Credit Losses"]]);
  // Inputs
  const inputs = ctx.modelData?.inputs || {};
  const iData = [["Input Parameter", "Value"]];
  const defaultInputs = {
    "Portfolio / Asset Class": "", "Gross Carrying Amount (£)": "",
    "Measurement Approach": "General (3-stage)",
    "Historical Loss Rate (%)": "", "Forward-Looking Adjustment (%)": "",
    "Macro-Economic Scenarios": "Base / Upside / Downside",
    "Base Scenario Weighting (%)": "50", "Upside Scenario Weighting (%)": "25",
    "Downside Scenario Weighting (%)": "25", "Recovery Rate (%)": "",
    "Credit-Impaired Threshold (days past due)": "90"
  };
  Object.entries({ ...defaultInputs, ...inputs }).forEach(([k, v]) => iData.push([k, v]));
  addSheet(XLSX, wb, "Inputs", iData);
  // Staging Analysis
  const stagingData = [
    ["ECL STAGING ANALYSIS"], [],
    ["Stage", "Description", "Criteria", "Gross Carrying Amount (£)", "ECL Rate (%)", "ECL Provision (£)", "Net Carrying Amount (£)"],
    ["Stage 1", "Performing — 12-month ECL", "No significant increase in credit risk", "", "", "", ""],
    ["Stage 2", "Under-performing — Lifetime ECL", "Significant increase in credit risk", "", "", "", ""],
    ["Stage 3", "Non-performing — Credit-impaired", ">90 days past due or specific default", "", "", "", ""],
    ["POCI", "Purchased / originated credit-impaired", "Credit-impaired at initial recognition", "", "", "", ""],
    [], ["Total", "", "", "", "", "", ""],
  ];
  addSheet(XLSX, wb, "Staging Analysis", stagingData);
  // Movement Schedule
  const movementData = [
    ["ECL MOVEMENT SCHEDULE"], [],
    ["Movement", "Stage 1 (£)", "Stage 2 (£)", "Stage 3 (£)", "Total (£)"],
    ["Opening balance", "", "", "", ""],
    ["Transfers to Stage 1", "", "", "", ""],
    ["Transfers to Stage 2", "", "", "", ""],
    ["Transfers to Stage 3", "", "", "", ""],
    ["New financial assets originated", "", "", "", ""],
    ["Financial assets derecognised", "", "", "", ""],
    ["Changes in PD / LGD / EAD", "", "", "", ""],
    ["Write-offs", "", "", "", ""],
    ["Recoveries", "", "", "", ""],
    ["Foreign exchange", "", "", "", ""],
    ["Other movements", "", "", "", ""],
    ["Closing balance", "", "", "", ""],
  ];
  addSheet(XLSX, wb, "Movement Schedule", movementData);
  // Ageing Analysis
  addSheet(XLSX, wb, "Ageing Analysis", [
    ["AGEING ANALYSIS"], [],
    ["Ageing Bucket", "Gross Amount (£)", "Expected Loss Rate (%)", "ECL (£)"],
    ["Current (not past due)", "", "", ""],
    ["1-30 days past due", "", "", ""],
    ["31-60 days past due", "", "", ""],
    ["61-90 days past due", "", "", ""],
    ["91-180 days past due", "", "", ""],
    ["181-365 days past due", "", "", ""],
    [">365 days past due", "", "", ""],
    [], ["Total", "", "", ""],
  ]);
  // Outputs
  const outputs = ctx.modelData?.outputs || {};
  const oData = [["Output", "Value"]];
  const defaultOutputs = {
    "Total Gross Carrying Amount (£)": "", "Total ECL Provision (£)": "",
    "ECL as % of Gross Amount": "", "Coverage Ratio (%)": "",
    "Stage 1 ECL (£)": "", "Stage 2 ECL (£)": "", "Stage 3 ECL (£)": "",
    "P&L Charge / (Credit) (£)": "", "Weighted Average Loss Rate (%)": ""
  };
  Object.entries({ ...defaultOutputs, ...outputs }).forEach(([k, v]) => oData.push([k, typeof v === "object" ? JSON.stringify(v) : v]));
  addSheet(XLSX, wb, "Outputs", oData);
  // Conclusion
  addSheet(XLSX, wb, "Conclusion", [
    ["IFRS 9 ECL Conclusion"], [],
    ["Portfolio / Asset Class", ""], ["Total ECL Provision", ""],
    ["Movement in Period", ""], ["Key Judgements", ""],
    [], ["Conclusion", ctx.wpNotes?.ecl || ""],
    ["Prepared by", ""], ["Reviewed by", ""], ["Date", ""]
  ]);
  dl(wb, XLSX, fname(ctx, "ECL", "Expected_Credit_Losses"));
}

// ─── LEAD SCHEDULE WORKBOOK ───
export async function generateLeadWorkbook(wp, headers, rows, ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", coverData(ctx, wp.ref, wp.label));
  const data = [headers];
  (rows || []).forEach(row => {
    data.push(row.map(cell => {
      if (cell && typeof cell === "object" && cell.props) return String(cell.props.children || "");
      return cell || "";
    }));
  });
  addSheet(XLSX, wb, wp.label.slice(0, 31), data);
  dl(wb, XLSX, fname(ctx, wp.ref, wp.label.replace(/[^a-zA-Z0-9]/g, "_")));
}

// ─── RISK REGISTER WORKBOOK ───
export async function generateRiskWorkbook(risks, ctx) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  addSheet(XLSX, wb, "Cover", coverData(ctx, "B1", "Risk Register"));
  const data = [["Ref", "Risk Description", "Level", "ISA Reference", "Audit Response", "WP Ref", "Conclusion"]];
  risks.forEach(r => data.push([r.id, r.t, r.lv, r.isa, r.rs || "", "", ""]));
  addSheet(XLSX, wb, "Risk Register", data);
  // Heat Map Data
  const heatData = [["Risk", "Impact", "Likelihood"]];
  const levels = { SIGNIFICANT: [4, 4], ELEVATED: [3, 3], NORMAL: [2, 2] };
  risks.forEach(r => { const [imp, lik] = levels[r.lv] || [2, 2]; heatData.push([r.id, imp, lik]); });
  addSheet(XLSX, wb, "Heat Map Data", heatData);
  dl(wb, XLSX, fname(ctx, "B1", "Risk_Register"));
}

// ═══════════════════════════════════════════════════════════════
// STANDALONE CALCULATOR WORKBOOK GENERATORS
// Each accepts (inputs, result) and creates a professional workbook
// with AuditEngine v10 AURA branding headers
// ═══════════════════════════════════════════════════════════════

function brandHeader(entityName) {
  return [
    ["AuditEngine v10 AURA"],
    ["Entity", entityName || "[Entity Name]"],
    ["Date", new Date().toISOString().slice(0, 10)],
    ["Powered by Indus Nexus Limited"],
    [],
  ];
}

function addStyledSheet(XLSX, wb, name, aoa, opts = {}) {
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Auto-set column widths
  const colWidths = [];
  aoa.forEach(row => row.forEach((cell, ci) => {
    const len = String(cell || "").length;
    colWidths[ci] = Math.max(colWidths[ci] || 8, Math.min(len + 2, 50));
  }));
  ws["!cols"] = colWidths.map(w => ({ wch: w }));
  // Freeze header rows (first 5 rows are brand header, then data header at row 6)
  if (opts.freezeRow) {
    ws["!freeze"] = { xSplit: 0, ySplit: opts.freezeRow, topLeftCell: "A" + (opts.freezeRow + 1) };
  }
  // Auto-filter on data header row
  if (opts.autoFilter && aoa.length > 0) {
    const maxCols = Math.max(...aoa.map(r => r.length));
    const colToLetter = (n) => { let s = ""; while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); } return s; };
    const lastCol = colToLetter(maxCols);
    ws["!autofilter"] = { ref: "A" + opts.autoFilter + ":" + lastCol + aoa.length };
  }
  // Tab colour
  if (opts.tabColor) {
    ws["!tabColor"] = opts.tabColor;
  }
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

// ─── IAS 36 IMPAIRMENT WORKBOOK (standalone) ───
export async function generateImpairmentWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // DCF Sheet
  const dcfData = [
    ...brandHeader(i.entityName),
    ["IAS 36 — IMPAIRMENT: DCF ANALYSIS"],
    [],
    ["Input Parameter", "Value"],
    ["CGU / Asset Name", i.cguName || ""],
    ["Carrying Amount (£)", i.carryingAmount || ""],
    ["Discount Rate — WACC (%)", i.discountRate || ""],
    ["Terminal Growth Rate (%)", i.terminalGrowthRate || ""],
    ["Forecast Period (years)", i.forecastYears || 5],
    ["Tax Rate (%)", i.taxRate || ""],
    ["EBITDA Margin (%)", i.ebitdaMargin || ""],
    ["Capex as % of Revenue", i.capexPct || ""],
    [],
    ["Year", "Revenue (£)", "EBITDA (£)", "Depreciation (£)", "EBIT (£)", "Tax (£)", "NOPAT (£)", "Capex (£)", "WC Change (£)", "Free Cash Flow (£)", "Discount Factor", "PV of FCF (£)"],
  ];
  const schedule = r.schedule || [];
  if (schedule.length) {
    schedule.forEach(row => {
      dcfData.push([row.year, row.revenue, row.ebitda, row.depreciation, row.ebit, row.tax, row.nopat, row.capex, row.wcChange, row.fcf, row.discountFactor, row.pvFCF]);
    });
  } else {
    for (let yr = 1; yr <= (i.forecastYears || 5); yr++) dcfData.push([yr, "", "", "", "", "", "", "", "", "", "", ""]);
    dcfData.push(["Terminal", "", "", "", "", "", "", "", "", "", "", ""]);
  }
  dcfData.push([]);
  dcfData.push(["Output", "Value"]);
  dcfData.push(["Sum of PV of FCFs (£)", r.sumPVFCF || ""]);
  dcfData.push(["Terminal Value (£)", r.terminalValue || ""]);
  dcfData.push(["PV of Terminal Value (£)", r.pvTerminalValue || ""]);
  dcfData.push(["Enterprise Value (£)", r.enterpriseValue || ""]);
  dcfData.push(["Value in Use (£)", r.valueInUse || ""]);
  dcfData.push(["Carrying Amount (£)", r.carryingAmount || i.carryingAmount || ""]);
  dcfData.push(["Headroom / (Impairment) (£)", r.headroom || ""]);
  dcfData.push(["Impairment Required", r.impairmentRequired || ""]);
  addStyledSheet(XLSX, wb, "DCF Analysis", dcfData, { freezeRow: 14, tabColor: "1a237e" });

  // Sensitivity Matrix Sheet
  const baseWACC = parseFloat(i.discountRate) || 10;
  const baseGrowth = parseFloat(i.terminalGrowthRate) || 2;
  const sensMatrix = r.sensitivityMatrix || {};
  const waccOffsets = [-2, -1, -0.5, 0, 0.5, 1, 2];
  const growthOffsets = [-1, -0.5, 0, 0.5, 1];
  const sensData = [
    ...brandHeader(i.entityName),
    ["SENSITIVITY MATRIX — Headroom / (Impairment) (£)"],
    [],
    ["WACC \\ Terminal Growth", ...growthOffsets.map(g => (baseGrowth + g).toFixed(1) + "%")],
  ];
  waccOffsets.forEach(w => {
    const waccLabel = (baseWACC + w).toFixed(1) + "%";
    const row = [waccLabel];
    growthOffsets.forEach(g => {
      const key = (baseWACC + w).toFixed(1) + "_" + (baseGrowth + g).toFixed(1);
      row.push(sensMatrix[key] || "");
    });
    sensData.push(row);
  });
  sensData.push([]);
  sensData.push(["Key assumptions and sources:"]);
  sensData.push(["Discount rate source", i.discountRateSource || ""]);
  sensData.push(["Growth rate source", i.growthRateSource || ""]);
  sensData.push(["Management's key assumptions", i.mgmtAssumptions || ""]);
  sensData.push(["Auditor's assessment", i.auditorAssessment || ""]);
  addStyledSheet(XLSX, wb, "Sensitivity Matrix", sensData, { tabColor: "283593" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_IAS36_Impairment_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── IFRS 9 ECL WORKBOOK (standalone) ───
export async function generateECLStandaloneWorkbook(stages, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const s = stages || {};
  const r = result || {};

  // Staging Sheet
  const stagingData = [
    ...brandHeader(s.entityName),
    ["IFRS 9 — EXPECTED CREDIT LOSSES: STAGING ANALYSIS"],
    [],
    ["Stage", "Description", "Criteria", "Gross Carrying Amount (£)", "ECL Rate (%)", "ECL Provision (£)", "Net Carrying Amount (£)"],
    ["Stage 1", "Performing — 12-month ECL", "No significant increase in credit risk", s.stage1Gross || "", s.stage1Rate || "", r.stage1ECL || "", r.stage1Net || ""],
    ["Stage 2", "Under-performing — Lifetime ECL", "Significant increase in credit risk", s.stage2Gross || "", s.stage2Rate || "", r.stage2ECL || "", r.stage2Net || ""],
    ["Stage 3", "Non-performing — Credit-impaired", ">90 days past due or specific default", s.stage3Gross || "", s.stage3Rate || "", r.stage3ECL || "", r.stage3Net || ""],
    ["POCI", "Purchased / originated credit-impaired", "Credit-impaired at initial recognition", s.pociGross || "", s.pociRate || "", r.pociECL || "", r.pociNet || ""],
    [],
    ["Total", "", "", r.totalGross || "", "", r.totalECL || "", r.totalNet || ""],
    [],
    ["Measurement Approach", s.approach || "General (3-stage)"],
    ["Portfolio / Asset Class", s.portfolio || ""],
    ["Forward-Looking Adjustment (%)", s.forwardLookingAdj || ""],
    ["Macro-Economic Scenario Weightings:"],
    ["  Base (%)", s.baseWeight || "50"],
    ["  Upside (%)", s.upsideWeight || "25"],
    ["  Downside (%)", s.downsideWeight || "25"],
  ];
  addStyledSheet(XLSX, wb, "Staging Analysis", stagingData, { freezeRow: 8, autoFilter: 8, tabColor: "0d47a1" });

  // Movement Table Sheet
  const movData = [
    ...brandHeader(s.entityName),
    ["IFRS 9 — ECL MOVEMENT TABLE"],
    [],
    ["Movement", "Stage 1 (£)", "Stage 2 (£)", "Stage 3 (£)", "Total (£)"],
    ["Opening balance", r.openStage1 || "", r.openStage2 || "", r.openStage3 || "", r.openTotal || ""],
    ["Transfers to Stage 1", "", "", "", ""],
    ["Transfers to Stage 2", "", "", "", ""],
    ["Transfers to Stage 3", "", "", "", ""],
    ["New financial assets originated", "", "", "", ""],
    ["Financial assets derecognised", "", "", "", ""],
    ["Changes in PD / LGD / EAD", "", "", "", ""],
    ["Write-offs", r.writeOffs || "", "", "", ""],
    ["Recoveries", r.recoveries || "", "", "", ""],
    ["Foreign exchange", "", "", "", ""],
    ["Other movements", "", "", "", ""],
    ["Closing balance", r.closeStage1 || "", r.closeStage2 || "", r.closeStage3 || "", r.closeTotal || ""],
    [],
    ["P&L Charge / (Credit) (£)", r.plCharge || ""],
    ["Coverage Ratio (%)", r.coverageRatio || ""],
    ["Weighted Average Loss Rate (%)", r.waLossRate || ""],
  ];
  addStyledSheet(XLSX, wb, "Movement Table", movData, { freezeRow: 8, tabColor: "1565c0" });

  dl(wb, XLSX, (s.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_IFRS9_ECL_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── IFRS 16 LEASE WORKBOOK (standalone) ───
export async function generateLeaseWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // Amortisation Schedule Sheet
  const amortData = [
    ...brandHeader(i.entityName),
    ["IFRS 16 — LEASE: AMORTISATION SCHEDULE"],
    [],
    ["Input Parameter", "Value"],
    ["Lease Description", i.leaseDescription || ""],
    ["Commencement Date", i.commencementDate || ""],
    ["Lease Term (months)", i.leaseTerm || ""],
    ["Annual Lease Payment (£)", i.annualPayment || ""],
    ["Payment Frequency", i.paymentFrequency || "Monthly"],
    ["Incremental Borrowing Rate (%)", i.ibrRate || ""],
    ["Initial Direct Costs (£)", i.initialDirectCosts || 0],
    ["Lease Incentives Received (£)", i.leaseIncentives || 0],
    [],
    ["Period", "Opening Lease Liability (£)", "Interest Charge (£)", "Lease Payment (£)", "Closing Lease Liability (£)"],
  ];
  const schedule = r.amortisationSchedule || [];
  if (schedule.length) {
    schedule.forEach(row => {
      amortData.push([row.period, row.openingLiability, row.interestCharge, row.leasePayment, row.closingLiability]);
    });
  } else {
    const periods = parseInt(i.leaseTerm) || 60;
    for (let pd = 1; pd <= periods; pd++) amortData.push([pd, "", "", "", ""]);
  }
  addStyledSheet(XLSX, wb, "Amortisation Schedule", amortData, { freezeRow: 18, tabColor: "2e7d32" });

  // ROU Depreciation Sheet
  const rouData = [
    ...brandHeader(i.entityName),
    ["IFRS 16 — RIGHT-OF-USE ASSET DEPRECIATION"],
    [],
    ["Period", "Opening ROU Asset (£)", "Depreciation Charge (£)", "Impairment (£)", "Closing ROU Asset (£)"],
  ];
  const rouSchedule = r.rouDepreciation || [];
  if (rouSchedule.length) {
    rouSchedule.forEach(row => {
      rouData.push([row.period, row.openingROU, row.depreciation, row.impairment || 0, row.closingROU]);
    });
  } else {
    const yrs = Math.ceil((parseInt(i.leaseTerm) || 60) / 12);
    for (let yr = 1; yr <= yrs; yr++) rouData.push([yr, "", "", 0, ""]);
  }
  rouData.push([]);
  rouData.push(["Initial ROU Asset (£)", r.initialROU || ""]);
  rouData.push(["Useful Life (months)", i.leaseTerm || ""]);
  rouData.push(["Depreciation Method", "Straight-line"]);
  addStyledSheet(XLSX, wb, "ROU Depreciation", rouData, { freezeRow: 8, tabColor: "388e3c" });

  // P&L Impact Sheet
  const plData = [
    ...brandHeader(i.entityName),
    ["IFRS 16 — P&L AND BALANCE SHEET IMPACT"],
    [],
    ["Impact Item", "Year 1 (£)", "Year 2 (£)", "Year 3 (£)", "Year 4 (£)", "Year 5 (£)", "Total (£)"],
    ["Depreciation — ROU Asset", "", "", "", "", "", r.totalDepreciation || ""],
    ["Interest Expense — Lease Liability", "", "", "", "", "", r.totalInterest || ""],
    ["Total P&L Charge", "", "", "", "", "", r.totalPLCharge || ""],
    [],
    ["Pre-IFRS 16 Lease Expense (for comparison)", "", "", "", "", "", ""],
    ["Net P&L Impact vs Operating Lease", "", "", "", "", "", ""],
    [],
    ["Balance Sheet at FYE", "Amount (£)"],
    ["Right-of-Use Asset", r.closingROU || ""],
    ["Lease Liability — Current", r.currentLiability || ""],
    ["Lease Liability — Non-Current", r.nonCurrentLiability || ""],
    ["Total Lease Liability", r.totalLiability || ""],
    [],
    ["Cash Flow Statement", "Amount (£)"],
    ["Operating Activities (interest element)", r.operatingCF || ""],
    ["Financing Activities (principal element)", r.financingCF || ""],
  ];
  addStyledSheet(XLSX, wb, "P&L Impact", plData, { tabColor: "43a047" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_IFRS16_Lease_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── IFRS 2 SHARE-BASED PAYMENT WORKBOOK ───
export async function generateSBPWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // Black-Scholes Inputs Sheet
  const bsData = [
    ...brandHeader(i.entityName),
    ["IFRS 2 — SHARE-BASED PAYMENT: BLACK-SCHOLES VALUATION"],
    [],
    ["Input Parameter", "Value", "Source / Notes"],
    ["Share Price at Grant Date (£)", i.sharePrice || "", ""],
    ["Exercise Price (£)", i.exercisePrice || "", ""],
    ["Expected Volatility (%)", i.volatility || "", "Historical / implied volatility"],
    ["Risk-Free Interest Rate (%)", i.riskFreeRate || "", "UK Gilt rate matching expected life"],
    ["Expected Life (years)", i.expectedLife || "", "Midpoint of vesting and contractual life"],
    ["Expected Dividend Yield (%)", i.dividendYield || "", ""],
    ["Number of Options Granted", i.numberOfOptions || "", ""],
    ["Grant Date", i.grantDate || "", ""],
    ["Vesting Period (years)", i.vestingPeriod || "", ""],
    ["Settlement Type", i.settlementType || "Equity-settled", "Equity / Cash"],
    [],
    ["Black-Scholes Output", "Value"],
    ["d1", r.d1 || ""],
    ["d2", r.d2 || ""],
    ["N(d1)", r.nd1 || ""],
    ["N(d2)", r.nd2 || ""],
    ["Fair Value per Option (£)", r.fairValuePerOption || ""],
    ["Total Fair Value (£)", r.totalFairValue || ""],
    ["Annual P&L Charge (£)", r.annualCharge || ""],
  ];
  addStyledSheet(XLSX, wb, "Black-Scholes Inputs", bsData, { freezeRow: 8, tabColor: "6a1b9a" });

  // Vesting Schedule Sheet
  const vestData = [
    ...brandHeader(i.entityName),
    ["IFRS 2 — VESTING SCHEDULE AND EXPENSE RECOGNITION"],
    [],
    ["Year", "Opening Estimate of Vesting", "Leavers / Forfeitures", "Closing Estimate of Vesting", "Cumulative Expense (£)", "Charge for Year (£)", "Equity Reserve (£)"],
  ];
  const vestSchedule = r.vestingSchedule || [];
  if (vestSchedule.length) {
    vestSchedule.forEach(row => {
      vestData.push([row.year, row.openingEstimate, row.forfeitures, row.closingEstimate, row.cumulativeExpense, row.yearCharge, row.equityReserve]);
    });
  } else {
    const vestYrs = parseInt(i.vestingPeriod) || 3;
    for (let yr = 1; yr <= vestYrs; yr++) vestData.push([yr, "", "", "", "", "", ""]);
  }
  vestData.push([]);
  vestData.push(["Journal Entries", "Dr (£)", "Cr (£)"]);
  vestData.push(["Staff Costs / P&L", r.annualCharge || "", ""]);
  vestData.push(["Equity — SBP Reserve", "", r.annualCharge || ""]);
  vestData.push([]);
  vestData.push(["Non-market vesting conditions", i.nonMarketConditions || "[Service condition — continued employment]"]);
  vestData.push(["Market vesting conditions", i.marketConditions || "[None]"]);
  vestData.push(["True-up for forfeiture estimate", "Required at each reporting date (IFRS 2.20)"]);
  addStyledSheet(XLSX, wb, "Vesting Schedule", vestData, { freezeRow: 8, tabColor: "7b1fa2" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_IFRS2_SBP_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── BOND VALUATION WORKBOOK ───
export async function generateBondWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // Bond Pricing Sheet
  const bondData = [
    ...brandHeader(i.entityName),
    ["BOND VALUATION — CLEAN/DIRTY PRICE, YTM, DURATION"],
    [],
    ["Input Parameter", "Value"],
    ["Bond / Instrument Name", i.bondName || ""],
    ["Face Value / Nominal (£)", i.faceValue || 100],
    ["Coupon Rate (%)", i.couponRate || ""],
    ["Coupon Frequency", i.couponFrequency || "Semi-annual"],
    ["Issue Date", i.issueDate || ""],
    ["Maturity Date", i.maturityDate || ""],
    ["Settlement Date", i.settlementDate || ""],
    ["Market Yield / YTM (%)", i.marketYield || ""],
    ["Day Count Convention", i.dayCount || "Actual/365"],
    [],
    ["Output", "Value"],
    ["Clean Price (£)", r.cleanPrice || ""],
    ["Accrued Interest (£)", r.accruedInterest || ""],
    ["Dirty Price (£)", r.dirtyPrice || ""],
    ["Yield to Maturity — YTM (%)", r.ytm || ""],
    ["Current Yield (%)", r.currentYield || ""],
    ["Macaulay Duration (years)", r.macaulayDuration || ""],
    ["Modified Duration", r.modifiedDuration || ""],
    ["Convexity", r.convexity || ""],
    ["DV01 / BPV (£)", r.dv01 || ""],
    [],
    ["Cash Flow Schedule"],
    ["Period", "Date", "Coupon Payment (£)", "Principal (£)", "Total Cash Flow (£)", "Discount Factor", "PV of Cash Flow (£)", "Period x PV (for Duration)"],
  ];
  const cfSchedule = r.cashFlowSchedule || [];
  if (cfSchedule.length) {
    cfSchedule.forEach(row => {
      bondData.push([row.period, row.date, row.coupon, row.principal, row.totalCF, row.discountFactor, row.pvCF, row.periodPV]);
    });
  } else {
    const periods = parseInt(i.periods) || 10;
    for (let pd = 1; pd <= periods; pd++) bondData.push([pd, "", "", "", "", "", "", ""]);
  }
  addStyledSheet(XLSX, wb, "Bond Valuation", bondData, { freezeRow: 8, tabColor: "b71c1c" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_Bond_Valuation_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── IAS 19 PENSION WORKBOOK ───
export async function generatePensionWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // DBO Sheet
  const dboData = [
    ...brandHeader(i.entityName),
    ["IAS 19 — DEFINED BENEFIT OBLIGATION (DBO)"],
    [],
    ["Actuarial Assumptions", "Value"],
    ["Discount Rate (%)", i.discountRate || ""],
    ["Salary Increase Rate (%)", i.salaryIncreaseRate || ""],
    ["Pension Increase Rate (%)", i.pensionIncreaseRate || ""],
    ["Inflation Rate — RPI (%)", i.rpiRate || ""],
    ["Inflation Rate — CPI (%)", i.cpiRate || ""],
    ["Mortality Table", i.mortalityTable || "S3PMA / S3PFA CMI_2022"],
    ["Expected Retirement Age", i.retirementAge || 65],
    [],
    ["DBO Movement", "Amount (£)"],
    ["Opening DBO", r.openingDBO || ""],
    ["Current Service Cost", r.currentServiceCost || ""],
    ["Interest Cost", r.interestCost || ""],
    ["Past Service Cost", r.pastServiceCost || ""],
    ["Benefits Paid", r.benefitsPaid || ""],
    ["Actuarial (Gains) / Losses — Financial", r.actuarialFinancial || ""],
    ["Actuarial (Gains) / Losses — Demographic", r.actuarialDemographic || ""],
    ["Actuarial (Gains) / Losses — Experience", r.actuarialExperience || ""],
    ["Settlements / Curtailments", r.settlements || ""],
    ["Closing DBO", r.closingDBO || ""],
  ];
  addStyledSheet(XLSX, wb, "DBO", dboData, { freezeRow: 8, tabColor: "e65100" });

  // Plan Assets Sheet
  const paData = [
    ...brandHeader(i.entityName),
    ["IAS 19 — PLAN ASSETS"],
    [],
    ["Plan Asset Movement", "Amount (£)"],
    ["Opening Fair Value of Plan Assets", r.openingPlanAssets || ""],
    ["Interest Income on Plan Assets", r.interestIncome || ""],
    ["Employer Contributions", r.employerContributions || i.employerContributions || ""],
    ["Employee Contributions", r.employeeContributions || ""],
    ["Benefits Paid", r.benefitsPaidAssets || r.benefitsPaid || ""],
    ["Return on Plan Assets (excl. interest)", r.returnOnAssets || ""],
    ["Administration Costs", r.adminCosts || ""],
    ["Settlements", r.assetSettlements || ""],
    ["Closing Fair Value of Plan Assets", r.closingPlanAssets || ""],
    [],
    ["Asset Allocation", "Amount (£)", "Proportion (%)"],
    ["Equities", r.equities || "", r.equitiesPct || ""],
    ["Government Bonds", r.govBonds || "", r.govBondsPct || ""],
    ["Corporate Bonds", r.corpBonds || "", r.corpBondsPct || ""],
    ["Property", r.property || "", r.propertyPct || ""],
    ["Cash and Other", r.cashOther || "", r.cashOtherPct || ""],
    ["Total", r.closingPlanAssets || "", "100%"],
  ];
  addStyledSheet(XLSX, wb, "Plan Assets", paData, { freezeRow: 8, tabColor: "ef6c00" });

  // P&L and OCI Split Sheet
  const plociData = [
    ...brandHeader(i.entityName),
    ["IAS 19 — P&L AND OCI ANALYSIS"],
    [],
    ["P&L Components (IAS 19.120)", "Amount (£)"],
    ["Current Service Cost", r.currentServiceCost || ""],
    ["Past Service Cost", r.pastServiceCost || ""],
    ["Net Interest on Net Defined Benefit Liability", r.netInterest || ""],
    ["Administration Costs", r.adminCosts || ""],
    ["Settlement / Curtailment Gain or Loss", r.settlementGainLoss || ""],
    ["Total P&L Charge / (Credit)", r.totalPLCharge || ""],
    [],
    ["OCI Components (IAS 19.120)", "Amount (£)"],
    ["Actuarial (Gains) / Losses on DBO", r.actuarialGainsLosses || ""],
    ["Return on Plan Assets (excl. interest income)", r.returnOnAssetsOCI || ""],
    ["Total Remeasurement in OCI", r.totalOCI || ""],
    [],
    ["Balance Sheet", "Amount (£)"],
    ["Closing DBO", r.closingDBO || ""],
    ["Less: Fair Value of Plan Assets", r.closingPlanAssets || ""],
    ["Net Defined Benefit Liability / (Asset)", r.netLiability || ""],
    ["Asset Ceiling Adjustment (IFRIC 14)", r.assetCeiling || ""],
    ["Net Amount Recognised", r.netRecognised || ""],
  ];
  addStyledSheet(XLSX, wb, "P&L and OCI Split", plociData, { freezeRow: 8, tabColor: "f57c00" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_IAS19_Pension_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── DEFERRED TAX WORKBOOK ───
export async function generateDeferredTaxWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};
  const taxRate = i.taxRate || 25;

  // Temporary Differences Sheet
  const tdData = [
    ...brandHeader(i.entityName),
    ["DEFERRED TAX — TEMPORARY DIFFERENCES (IAS 12)"],
    ["UK Corporation Tax Rate: " + taxRate + "%"],
    [],
    ["Category", "Carrying Amount (£)", "Tax Base (£)", "Taxable Temporary Difference (£)", "Deductible Temporary Difference (£)", "Deferred Tax Liability (£)", "Deferred Tax Asset (£)"],
    ["Property, Plant & Equipment", i.ppeCa || "", i.ppeTb || "", "", "", "", ""],
    ["Right-of-Use Assets (IFRS 16)", i.rouCa || "", i.rouTb || "", "", "", "", ""],
    ["Intangible Assets", i.intangiblesCa || "", i.intangiblesTb || "", "", "", "", ""],
    ["Inventory", i.inventoryCa || "", i.inventoryTb || "", "", "", "", ""],
    ["Trade Receivables", i.receivablesCa || "", i.receivablesTb || "", "", "", "", ""],
    ["Provisions", i.provisionsCa || "", i.provisionsTb || "", "", "", "", ""],
    ["Pension Obligations", i.pensionCa || "", i.pensionTb || "", "", "", "", ""],
    ["Share-Based Payments", i.sbpCa || "", i.sbpTb || "", "", "", "", ""],
    ["Tax Losses Carried Forward", i.taxLossesCa || "", i.taxLossesTb || "", "", "", "", ""],
    ["Lease Liabilities (IFRS 16)", i.leaseLiabCa || "", i.leaseLiabTb || "", "", "", "", ""],
    ["Other", i.otherCa || "", i.otherTb || "", "", "", "", ""],
    [],
    ["Total", "", "", r.totalTaxableDiff || "", r.totalDeductibleDiff || "", r.totalDTL || "", r.totalDTA || ""],
    [],
    ["Net Deferred Tax Liability / (Asset) (£)", r.netDeferredTax || ""],
    ["Tax Rate Applied (%)", taxRate],
    [],
    ["Movement", "Amount (£)"],
    ["Opening Deferred Tax", r.openingDT || ""],
    ["Charge / (Credit) to P&L", r.dtPL || ""],
    ["Charge / (Credit) to OCI", r.dtOCI || ""],
    ["Charge / (Credit) to Equity", r.dtEquity || ""],
    ["Rate Change Adjustment", r.rateChangeAdj || ""],
    ["Closing Deferred Tax", r.closingDT || ""],
  ];
  addStyledSheet(XLSX, wb, "Temp Differences", tdData, { freezeRow: 9, autoFilter: 9, tabColor: "4a148c" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_Deferred_Tax_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}

// ─── DISTRIBUTABLE PROFITS WORKBOOK ───
export async function generateDistributableProfitsWorkbook(inputs, result) {
  const XLSX = await getXLSX();
  const wb = XLSX.utils.book_new();
  const i = inputs || {};
  const r = result || {};

  // s830-831 Analysis Sheet
  const dpData = [
    ...brandHeader(i.entityName),
    ["DISTRIBUTABLE PROFITS — s830-831 COMPANIES ACT 2006 ANALYSIS"],
    [],
    ["Section 830 — Profits Available for Distribution", "Amount (£)", "Reference / Notes"],
    ["Accumulated Realised Profits", i.realisedProfits || "", "s830(2)(a)"],
    ["Less: Accumulated Realised Losses", i.realisedLosses || "", "s830(2)(b)"],
    [],
    ["Adjustments Required:"],
    ["Unrealised Gains — Revaluation Reserve", i.unrealisedGains || "", "Not distributable (TECH 02/17BL)"],
    ["Unrealised Losses", i.unrealisedLosses || "", "Must be deducted (s841)"],
    ["Fair Value Gains through P&L", i.fvGains || "", "Assess if realised"],
    ["Share-Based Payment Charges", i.sbpCharges || "", "Not a realised loss (TECH 02/17BL)"],
    ["Goodwill Previously Written Off to Reserves", i.goodwillWrittenOff || "", "Consider per TECH 02/17BL"],
    ["Impairment of Goodwill / Intangibles", i.impairmentCharges || "", "Realised loss"],
    ["IFRS 16 Lease Adjustments", i.leaseAdjustments || "", "Adjust for lease accounting effect"],
    ["Foreign Exchange on Monetary Items", i.fxMonetary || "", "Realised per s843(2)"],
    ["Foreign Exchange on Non-Monetary Items", i.fxNonMonetary || "", "May be unrealised"],
    ["Provisions — Realised Losses", i.provisions || "", "Generally realised"],
    ["Development Costs Capitalised", i.devCosts || "", "s844 — not distributable unless conditions met"],
    [],
    ["Distributable Profits Computation", "Amount (£)"],
    ["Accumulated Realised Profits", r.accRealisedProfits || ""],
    ["Less: Accumulated Realised Losses", r.accRealisedLosses || ""],
    ["Less: s831 Adjustments (public companies)", r.s831Adjustments || ""],
    ["Distributable Profits / (Losses)", r.distributableProfits || ""],
    [],
    ["Section 831 — Public Companies Net Asset Test", "Amount (£)"],
    ["Net Assets", r.netAssets || ""],
    ["Less: Called-Up Share Capital", r.calledUpShareCapital || ""],
    ["Less: Undistributable Reserves", r.undistributableReserves || ""],
    ["Amount by which net assets exceed aggregate", r.s831Excess || ""],
    [],
    ["Proposed Distribution", "Amount (£)"],
    ["Interim Dividend", i.interimDividend || ""],
    ["Final Dividend (proposed)", i.finalDividend || ""],
    ["Total Distribution", r.totalDistribution || ""],
    ["Headroom / (Shortfall)", r.headroom || ""],
    ["Conclusion", r.conclusion || "Sufficient distributable profits exist to support the proposed distribution"],
  ];
  addStyledSheet(XLSX, wb, "s830-831 Analysis", dpData, { freezeRow: 8, tabColor: "004d40" });

  dl(wb, XLSX, (i.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_Distributable_Profits_" + new Date().toISOString().slice(0, 10) + ".xlsx");
  return wb;
}
