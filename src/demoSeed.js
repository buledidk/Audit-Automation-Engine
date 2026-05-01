// ═══════════════════════════════════════════════════════════════
// DEMO SEED — Meridian Construction Ltd
// Pre-populates every editable field with realistic audit data
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = "auditengine_demo_v10";

export function loadDemo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ } // eslint-disable-line no-unused-vars
  return null;
}

export function saveDemo(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ } // eslint-disable-line no-unused-vars
}

export function clearDemo() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ } // eslint-disable-line no-unused-vars
}

export function generateDemoConstruction() {
  const cfg = {
    industry: "construction",
    sector: "Commercial",
    framework: "frs102",
    entitySize: "medium",
    entityName: "Meridian Construction Ltd",
    fye: "31/03/2026",
    partner: "J. Whitfield FCA",
    manager: "S. Patel ACA",
    companyNumber: "12345678",
    firmName: "Whitfield & Partners LLP",
    materiality: "125000",
    perfMateriality: "93750",
    trivial: "6250",
    engagementType: "statutory",
    employees: "45",
    groupParent: "",
    groupComponents: "",
    groupCompMateriality: "",
    entityStructure: "Standalone",
    subsidiaries: "",
    parentName: "",
    configured: true
  };

  const cellData = {};
  const c = (id, row, col, val) => { cellData[`${id}_${row}_${col}`] = val; };

  // ═══ A2 — Client Acceptance (editable cols 4=Assessment, 5=Conclusion) ═══
  const a2Assessments = [
    ["Satisfactory — no integrity concerns identified", "Accept engagement"],
    ["Competent — construction sector expertise confirmed", "Accept"],
    ["Adequate resources — team available for Q1 2027 fieldwork", "Accept"],
    ["No independence threats identified per FRC ES 2024", "Accept"],
    ["Terms agreed per ISA 210 engagement letter", "Accept"],
    ["FRS 102 applicable — medium-sized company", "Accept"],
    ["No predecessor auditor — new incorporation 2019", "N/A — first audit by firm"],
    ["AML checks completed — no adverse findings", "Accept"],
    ["Engagement letter signed 15/01/2026", "Accept"],
    ["ISQM 1 acceptance procedures completed", "Accept"]
  ];
  a2Assessments.forEach((row, i) => { c("a2", i, 4, row[0]); c("a2", i, 5, row[1]); });

  // ═══ A3 — Audit Strategy (editable cols 1=Approach, 4=Planned Hours) ═══
  const a3Hours = ["Substantive", "Substantive", "Substantive", "Substantive", "Substantive", "Substantive", "Substantive", "Substantive"];
  const a3Hrs = ["12", "8", "16", "8", "6", "10", "4", "6"];
  a3Hours.forEach((v, i) => { c("a3", i, 1, v); c("a3", i, 4, a3Hrs[i]); });

  // ═══ A4 — Materiality benchmarks (editable cols 4=Amount, 5=% Applied, 6=Materiality, 7=Selected?) ═══
  const a4Data = [
    ["8200000", "1.5%", "123000", ""],        // Revenue
    ["620000", "8%", "49600", ""],             // PBT
    ["5100000", "2.5%", "127500", "✓"],        // Total assets — SELECTED
    ["2800000", "4%", "112000", ""],           // Net assets
    ["7580000", "1.5%", "113700", ""],         // Total expenditure
    ["8200000", "1%", "82000", ""],            // Gross income
  ];
  a4Data.forEach((row, i) => { c("a4", i, 4, row[0]); c("a4", i, 5, row[1]); c("a4", i, 6, row[2]); c("a4", i, 7, row[3]); });

  // ═══ A5 — Understanding the Entity — KPIs (editable cols 1-4) ═══
  const kpiData = [
    ["18.2%", "17.5%", "+0.7pp", "Improved margins on M4 motorway project; CIS recovery better than forecast"],
    ["£1.4m", "£1.1m", "+27%", "Increased WIP reflects three new commercial builds started Q3"],
    ["58 days", "62 days", "-6.5%", "Improved collections following new credit control procedures"],
    ["£620k / 90+ days: £85k", "£540k / 90+ days: £110k", "15% increase; 90+ improved", "Retention releases progressing; main contractor paying on schedule"],
    ["42%", "38%", "+4pp", "Higher subcontractor use on M4 project (specialist civil works)"],
    ["78%", "72%", "+6pp", "New CAT excavator fleet improving utilisation; sold 2 idle units"],
    ["1.8 months", "2.1 months", "-14%", "Better cash conversion from faster retention release"]
  ];
  kpiData.forEach((row, i) => { c("kpi", i, 1, row[0]); c("kpi", i, 2, row[1]); c("kpi", i, 3, row[2]); c("kpi", i, 4, row[3]); });

  // A5 — Controls (editable cols 1-4)
  const a5cData = [
    ["Yes — monthly variation approvals", "Yes — tested 5 contracts", "Yes", "Board minutes; variation order log"],
    ["Yes — job costing system with monthly reconciliation", "Yes — 3 projects tested", "Yes", "Sage Construction Cloud reports"],
    ["Yes — monthly CIS reconciliation", "Yes — tested Q1 & Q3", "Yes", "CIS monthly return filings"],
    ["Yes — incident reporting to board", "Yes — reviewed 12 months", "No — low volume", "H&S incident log; board minutes"],
    ["Yes — asset register maintained", "Yes — spot check 10 assets", "Yes", "FA register; insurance schedule"]
  ];
  a5cData.forEach((row, i) => { c("a5c", i, 1, row[0]); c("a5c", i, 2, row[1]); c("a5c", i, 3, row[2]); c("a5c", i, 4, row[3]); });

  // ═══ A6 — Fraud Risk Assessment ═══
  // a6_jet (editable cols 2=Tested?, 3=Exceptions, 4=Comment)
  const jetData = [
    ["Yes", "None", "Tested 15 manual journals > PM — no anomalies"],
    ["Yes", "None", "Weekend/holiday entries: 3 found, all authorised maintenance"],
    ["Yes", "None", "Round-number journals: 8 identified, all legitimate accruals"],
    ["Yes", "None", "Journals by unusual users: CFO posted 2 journals — both reviewed"],
    ["Yes", "1 minor", "Unusual accounts: 1 journal to suspense — cleared within 5 days"],
    ["Yes", "None", "Revenue journals: all supported by certified valuations"],
    ["Yes", "None", "Year-end journals: 12 tested — all with supporting documentation"],
    ["Yes", "None", "Consolidation adjustments: N/A — standalone entity"]
  ];
  jetData.forEach((row, i) => { c("a6_jet", i, 2, row[0]); c("a6_jet", i, 3, row[1]); c("a6_jet", i, 4, row[2]); });

  // a6_risks — significant risks only (construction has R01, R02 as SIGNIFICANT). editable cols 4,5,6
  const a6RiskData = [
    ["See D1 testing programme — stage of completion recalculated for all contracts > PM", "D1", "Satisfactory — no material misstatement identified"],
    ["See D3 — cost-to-complete analysis performed on all active projects", "D3", "Satisfactory — WIP provisions adequate"]
  ];
  a6RiskData.forEach((row, i) => { c("a6_risks", i, 4, row[0]); c("a6_risks", i, 5, row[1]); c("a6_risks", i, 6, row[2]); });

  // ═══ A7 — Going Concern ═══
  // a7_score_0 (Financial indicators) — editable cols 2=Score, 3=Weighted, 4=Evidence, 5=Mitigating
  const gcFinData = [
    ["0", "0", "No net liability position — net assets £2.8m", "N/A"],
    ["0", "0", "Current ratio 1.4:1 — satisfactory", "N/A"],
    ["1", "3", "Debtor days increased from 58 to 62 days", "New credit control procedures in place; subsequent receipts testing satisfactory"],
    ["0", "0", "No borrowing limit issues — facilities headroom £850k", "N/A"],
    ["0", "0", "No adverse covenants — all met", "N/A"],
    ["0", "0", "Operating cash flows positive at £780k", "N/A"],
    ["0", "0", "No loss-making contracts identified", "N/A"],
    ["0", "0", "No fixed-price contracts causing concern", "N/A"]
  ];
  gcFinData.forEach((row, i) => { c("a7_score_0", i, 2, row[0]); c("a7_score_0", i, 3, row[1]); c("a7_score_0", i, 4, row[2]); c("a7_score_0", i, 5, row[3]); });

  // a7_score_1 (Operating indicators)
  const gcOpsData = [
    ["0", "0", "Management team stable — no key departures", "N/A"],
    ["0", "0", "No loss of major customer — top 3 clients represent 45% revenue", "Diversified customer base across commercial and infrastructure"],
    ["0", "0", "Skilled labour available — no shortages reported", "N/A"],
    ["1", "2", "Supply chain: some material cost inflation (steel +8%)", "Fixed-price contracts include escalation clauses"],
    ["0", "0", "No legal proceedings — clean solicitor's letter", "N/A"],
    ["0", "0", "CDM compliance satisfactory — no enforcement action", "N/A"]
  ];
  gcOpsData.forEach((row, i) => { c("a7_score_1", i, 2, row[0]); c("a7_score_1", i, 3, row[1]); c("a7_score_1", i, 4, row[2]); c("a7_score_1", i, 5, row[3]); });

  // a7_fin (editable cols 2,3,4)
  const a7FinData = [
    ["No", "Net assets £2.8m; positive equity", "No concern"],
    ["No", "Current ratio 1.4:1", "Satisfactory"],
    ["No", "Positive operating cash flows £780k", "No concern"],
    ["No", "All bank covenants met with headroom", "No concern"],
    ["No", "No fixed charge coverage issues", "No concern"],
    ["No", "No inability to pay creditors", "No concern"],
    ["No", "No adverse trends in key ratios", "No concern"],
    ["No", "Forecasts show continued profitability", "No concern"]
  ];
  a7FinData.forEach((row, i) => { c("a7_fin", i, 2, row[0]); c("a7_fin", i, 3, row[1]); c("a7_fin", i, 4, row[2]); });

  // a7_ops (editable cols 2,3,4)
  const a7OpsData = [
    ["No", "Management team stable", "No concern"],
    ["No", "No loss of key customer", "Diversified base"],
    ["No", "Adequate skilled labour supply", "No concern"],
    ["Minor", "Steel cost inflation +8%", "Escalation clauses in contracts mitigate"],
    ["No", "Clean solicitor's letter", "No concern"]
  ];
  a7OpsData.forEach((row, i) => { c("a7_ops", i, 2, row[0]); c("a7_ops", i, 3, row[1]); c("a7_ops", i, 4, row[2]); });

  // a7_ind (industry going concern factors, editable cols 2,3,4)
  const a7IndData = [
    ["Satisfactory", "Order book: £14.2m contracted for next 18 months", "No concern — strong pipeline"],
    ["Satisfactory", "Retention cash flow: £620k expected in next 12 months", "Manageable — all performing"],
    ["Satisfactory", "Bonding capacity: £2m available; £1.2m utilised", "Adequate headroom"],
    ["Satisfactory", "Top 3 clients = 45% revenue", "Acceptable concentration level"],
    ["Satisfactory", "Cash flow seasonal but manageable — overdraft facility in place", "No concern"]
  ];
  a7IndData.forEach((row, i) => { c("a7_ind", i, 2, row[0]); c("a7_ind", i, 3, row[1]); c("a7_ind", i, 4, row[2]); });

  // a7_proc (editable cols 3,4,5)
  const a7ProcData = [
    ["Yes", "2026-02-10", "Management assessment reviewed and found reasonable"],
    ["Yes", "2026-02-10", "Cash flow forecast tested — assumptions reasonable"],
    ["Yes", "2026-02-15", "Order book reviewed — £14.2m contracted"],
    ["Yes", "2026-02-15", "Bank facilities confirmed — no withdrawal notices"],
    ["Yes", "2026-03-01", "Post year-end events reviewed — no adverse matters"],
    ["Yes", "2026-03-01", "Representations obtained — going concern confirmed"],
    ["Yes", "2026-03-05", "12-month assessment from report date — no issues"],
    ["Yes", "2026-03-10", "Overall conclusion: going concern basis appropriate"]
  ];
  a7ProcData.forEach((row, i) => { c("a7_proc", i, 3, row[0]); c("a7_proc", i, 4, row[1]); c("a7_proc", i, 5, row[2]); });

  // ═══ A8 — Planning Analytical Review (covered via a5/kpi above) ═══

  // ═══ A9 — Laws & Regulations (editable cols 2,3,4) ═══
  const a9Data = [
    ["Compliant", "No non-compliance identified", "Accounts filed on time; CT paid"],
    ["Compliant", "No incidents reported", "H&S log reviewed; zero RIDDOR"],
    ["Compliant", "CDM Principal Designer appointed", "CDM notifications confirmed"],
    ["Compliant", "Building Safety Act requirements met", "Higher-risk building register reviewed"],
    ["Compliant", "CIS returns filed monthly", "CIS reconciliation to payroll"]
  ];
  a9Data.forEach((row, i) => { c("a9", i, 2, row[0]); c("a9", i, 3, row[1]); c("a9", i, 4, row[2]); });

  // ═══ B1 — Risk Assessment Matrix (editable cols 4=Control, 5=Detection, 6=Combined, 8=Response) ═══
  // Construction has 14 risks
  const b1Data = [
    ["Moderate", "Low", "SIGNIFICANT", "Extended substantive — recalculate stage of completion on all contracts > PM"],
    ["Moderate", "Low", "SIGNIFICANT", "Cost-to-complete analysis on all active projects; independent QS review"],
    ["Moderate", "Moderate", "ELEVATED", "Ageing analysis; confirm balances > £50k; subsequent receipts"],
    ["Moderate", "Moderate", "ELEVATED", "CIS reconciliation; subcontractor accruals testing"],
    ["Moderate", "Low", "ELEVATED", "H&S register review; legal update letter"],
    ["Moderate", "Low", "ELEVATED", "Review contract schedules; assess LD exposure on 3 largest contracts"],
    ["Good", "Moderate", "NORMAL", "Test additions > PM; verify capitalisation policy"],
    ["Good", "Moderate", "NORMAL", "Verify translation rates at reporting date"],
    ["Good", "Moderate", "NORMAL", "Reconcile plant register; test 5 disposals"],
    ["Good", "Moderate", "NORMAL", "Verify 3 monthly CIS returns; test calculations"],
    ["Good", "Moderate", "NORMAL", "Test retention release against defect certificates"],
    ["Good", "Moderate", "NORMAL", "Verify client approval; test cut-off for 3 VOs"],
    ["Good", "Low", "NORMAL", "Confirm bond balances; review contingent liability note"],
    ["Good", "Low", "NORMAL", "Test timesheet allocation on 2 projects"]
  ];
  b1Data.forEach((row, i) => { c("b1", i, 4, row[0]); c("b1", i, 5, row[1]); c("b1", i, 6, row[2]); c("b1", i, 8, row[3]); });

  // ═══ B2 — Controls Assessment ═══
  // b2_entity (editable cols 2,3,4,5)
  const b2EntityData = [
    ["Yes — monthly approval process", "Yes — tested 5 contracts", "Inquiry + reperformance", "Yes"],
    ["Yes — Sage Cloud system enforces", "Yes — tested 3 projects", "Reperformance", "Yes"],
    ["Yes — monthly reconciliation", "Yes — tested Q1 and Q3", "Inspection", "Yes"],
    ["Yes — incident register maintained", "Yes — reviewed 12 months", "Inquiry + inspection", "No — low volume"],
    ["Yes — quarterly reconciliation", "Yes — tested year-end", "Inspection", "Yes"]
  ];
  b2EntityData.forEach((row, i) => { c("b2_entity", i, 2, row[0]); c("b2_entity", i, 3, row[1]); c("b2_entity", i, 4, row[2]); c("b2_entity", i, 5, row[3]); });

  // ═══ B3 — Significant Risks (editable cols 1,2,3,4) ═══
  const b3Data = [
    ["Long-term contract revenue involves significant estimation of stage of completion; susceptible to management bias per ISA 240.26", "Recalculate stage of completion for all contracts > PM; compare to QS certificates", "ISA 240.26; ISA 540; FRS 102 s23", "Satisfactory — see D1"],
    ["WIP valuation depends on cost-to-complete estimates which are inherently uncertain", "Independent cost-to-complete analysis; project margin review on all active builds", "ISA 540; FRS 102 s13", "Satisfactory — see D3"]
  ];
  b3Data.forEach((row, i) => { c("b3", i, 1, row[0]); c("b3", i, 2, row[1]); c("b3", i, 3, row[2]); c("b3", i, 4, row[3]); });

  // ═══ C2 — P&L Lead Schedule (editable cols 1=PY, 2=CY, 3=Movement, 4=Movement%, 7=Status) ═══
  const c2Data = [
    ["7,450,000", "8,200,000", "750,000", "10.1%", "✓"],
    ["4,100,000", "4,510,000", "410,000", "10.0%", "✓"],
    ["3,350,000", "3,690,000", "340,000", "10.1%", "✓"],
    ["1,650,000", "1,820,000", "170,000", "10.3%", "✓"],
    ["380,000", "420,000", "40,000", "10.5%", "✓"],
    ["120,000", "135,000", "15,000", "12.5%", "✓"],
    ["1,200,000", "1,265,000", "65,000", "5.4%", "✓"],
    ["", "", "", "", ""],
    ["580,000", "620,000", "40,000", "6.9%", "✓"],
    ["45,000", "52,000", "7,000", "15.6%", "✓"],
    ["535,000", "568,000", "33,000", "6.2%", "✓"],
    ["105,000", "110,000", "5,000", "4.8%", "✓"],
    ["430,000", "458,000", "28,000", "6.5%", "✓"]
  ];
  c2Data.forEach((row, i) => { c("c2", i, 1, row[0]); c("c2", i, 2, row[1]); c("c2", i, 3, row[2]); c("c2", i, 4, row[3]); c("c2", i, 7, row[4]); });

  // ═══ C3 — Balance Sheet Lead (editable cols 1=PY, 2=CY, 3=Movement, 4=Movement%, 7=Status) ═══
  const c3Data = [
    ["1,850,000", "1,920,000", "70,000", "3.8%", "✓"],
    ["1,100,000", "1,400,000", "300,000", "27.3%", "✓"],
    ["620,000", "540,000", "-80,000", "-12.9%", "✓"],
    ["280,000", "310,000", "30,000", "10.7%", "✓"],
    ["3,850,000", "4,170,000", "320,000", "8.3%", "✓"],
    ["", "", "", "", ""],
    ["1,200,000", "1,350,000", "150,000", "12.5%", "✓"],
    ["180,000", "210,000", "30,000", "16.7%", "✓"],
    ["95,000", "120,000", "25,000", "26.3%", "✓"],
    ["1,475,000", "1,680,000", "205,000", "13.9%", "✓"],
    ["", "", "", "", ""],
    ["100,000", "100,000", "0", "0%", "✓"],
    ["0", "0", "0", "0%", "✓"],
    ["1,680,000", "2,100,000", "420,000", "25.0%", "✓"],
    ["1,780,000", "2,200,000", "420,000", "23.6%", "✓"],
    ["", "", "", "", ""],
    ["500,000", "600,000", "100,000", "20.0%", "✓"],
    ["280,000", "150,000", "-130,000", "-46.4%", "✓"],
    ["780,000", "750,000", "-30,000", "-3.8%", "✓"],
    ["110,000", "130,000", "20,000", "18.2%", "✓"],
    ["95,000", "110,000", "15,000", "15.8%", "✓"],
    ["2,475,000", "2,870,000", "395,000", "16.0%", "✓"]
  ];
  c3Data.forEach((row, i) => { c("c3", i, 1, row[0]); c("c3", i, 2, row[1]); c("c3", i, 3, row[2]); c("c3", i, 4, row[3]); c("c3", i, 7, row[4]); });

  // ═══ C5 — Fixed Assets Lead (editable cols 1-5) ═══
  const c5Data = [
    ["850,000", "0", "0", "0", "850,000"],
    ["320,000", "45,000", "0", "28,000", "337,000"],
    ["480,000", "185,000", "32,000", "95,000", "538,000"],
    ["120,000", "45,000", "18,000", "38,000", "109,000"],
    ["80,000", "12,000", "0", "5,000", "87,000"]
  ];
  c5Data.forEach((row, i) => { c("c5", i, 1, row[0]); c("c5", i, 2, row[1]); c("c5", i, 3, row[2]); c("c5", i, 4, row[3]); c("c5", i, 5, row[4]); });

  // ═══ C6 — Equity & Reserves (editable cols 1,2,3,4,6) ═══
  const c6Data = [
    ["100,000", "0", "0", "100,000", ""],
    ["0", "0", "0", "0", ""],
    ["1,680,000", "458,000", "38,000", "2,100,000", "Profit for year less dividends"],
    ["0", "0", "0", "0", ""]
  ];
  c6Data.forEach((row, i) => { c("c6", i, 1, row[0]); c("c6", i, 2, row[1]); c("c6", i, 3, row[2]); c("c6", i, 4, row[3]); c("c6", i, 6, row[4]); });

  // ═══ C7 — Loans & Borrowings (editable cols 1-7) ═══
  const c7Data = [
    ["250,000", "180,000", "Base+2.5%", "On demand", "Debenture", "N/A", "Current"],
    ["500,000", "350,000", "5.2%", "Jun 2029", "Freehold charge", "DSCR > 1.2x", "£100k Current / £250k Non-current"],
    ["120,000", "85,000", "6.1%", "Various", "Assets financed", "N/A", "£35k Current / £50k Non-current"],
    ["0", "0", "", "", "", "", ""]
  ];
  c7Data.forEach((row, i) => { c("c7", i, 1, row[0]); c("c7", i, 2, row[1]); c("c7", i, 3, row[2]); c("c7", i, 4, row[3]); c("c7", i, 5, row[4]); c("c7", i, 6, row[5]); c("c7", i, 7, row[6]); });

  // ═══ C8 — Provisions Lead (editable cols 1-5) ═══
  const c8Data = [
    ["45,000", "20,000", "12,000", "0", "53,000"],
    ["60,000", "5,000", "0", "0", "65,000"],
    ["0", "0", "0", "0", "0"],
    ["5,000", "7,000", "0", "0", "12,000"]
  ];
  c8Data.forEach((row, i) => { c("c8", i, 1, row[0]); c("c8", i, 2, row[1]); c("c8", i, 3, row[2]); c("c8", i, 4, row[3]); c("c8", i, 5, row[4]); });

  // ═══ FSLI LEADS for testing WPs ═══
  // Construction FSLI lines for each testing area
  const fsliLeads = {
    d1: { // Revenue (fk=rev): Contract revenue, Variation income, Claims income, Other operating income
      data: [["7,450,000", "8,200,000", "750,000", "10.1%", "✓"], ["280,000", "340,000", "60,000", "21.4%", "✓"], ["0", "15,000", "15,000", "N/A", "✓"], ["120,000", "95,000", "-25,000", "-20.8%", "✓"]]
    },
    d2: { // Receivables (fk=rec): Trade receivables, Retentions receivable, Amounts due on contracts, Prepayments
      data: [["680,000", "740,000", "60,000", "8.8%", "✓"], ["320,000", "380,000", "60,000", "18.8%", "✓"], ["0", "180,000", "180,000", "N/A", "✓"], ["100,000", "100,000", "0", "0%", "✓"]]
    },
    d3: { // Inventory (fk=inv): Work in progress, Raw materials
      data: [["1,050,000", "1,340,000", "290,000", "27.6%", "✓"], ["50,000", "60,000", "10,000", "20.0%", "✓"]]
    },
    d4: { // Payables (fk=pay)
      data: [["580,000", "650,000", "70,000", "12.1%", "✓"], ["310,000", "380,000", "70,000", "22.6%", "✓"], ["120,000", "140,000", "20,000", "16.7%", "✓"], ["45,000", "52,000", "7,000", "15.6%", "✓"], ["145,000", "128,000", "-17,000", "-11.7%", "✓"]]
    },
    d6: { // Cash (fk=cash): Current accounts, Deposit accounts
      data: [["280,000", "310,000", "30,000", "10.7%", "✓"], ["0", "0", "0", "0%", "✓"]]
    },
    d7: { // FA (fk=fa)
      data: [["850,000", "850,000", "0", "0%", "✓"], ["320,000", "337,000", "17,000", "5.3%", "✓"], ["480,000", "538,000", "58,000", "12.1%", "✓"], ["120,000", "109,000", "-11,000", "-9.2%", "✓"], ["80,000", "87,000", "7,000", "8.8%", "✓"]]
    },
    d10: { // Equity (fk=eq)
      data: [["100,000", "100,000", "0", "0%", "✓"], ["0", "0", "0", "0%", "✓"], ["1,680,000", "2,100,000", "420,000", "25.0%", "✓"]]
    },
    d11: { // Loans (fk=ln)
      data: [["250,000", "180,000", "-70,000", "-28.0%", "✓"], ["500,000", "350,000", "-150,000", "-30.0%", "✓"], ["120,000", "85,000", "-35,000", "-29.2%", "✓"], ["0", "0", "0", "0%", "✓"]]
    },
    d12: { // Provisions (fk=prov)
      data: [["45,000", "53,000", "8,000", "17.8%", "✓"], ["60,000", "65,000", "5,000", "8.3%", "✓"], ["0", "0", "0", "0%", "✓"], ["5,000", "12,000", "7,000", "140%", "✓"]]
    },
    d13: { // Tax (fk=tax)
      data: [["105,000", "110,000", "5,000", "4.8%", "✓"], ["5,000", "12,000", "7,000", "140%", "✓"], ["18,000", "22,000", "4,000", "22.2%", "✓"]]
    }
  };
  Object.entries(fsliLeads).forEach(([wpId, spec]) => {
    spec.data.forEach((row, ri) => {
      c("fsli_" + wpId, ri, 1, row[0]); c("fsli_" + wpId, ri, 2, row[1]);
      c("fsli_" + wpId, ri, 3, row[2]); c("fsli_" + wpId, ri, 4, row[3]);
      c("fsli_" + wpId, ri, 6, row[4]);
    });
  });

  // ═══ TESTING WP — Standard test results ═══
  // For each testing WP, populate test_XX (editable cols 2=Sample, 3=Result, 4=Exception, 5=Prepared, 6=Reviewed)
  const testResults = {
    d1: [
      ["5 contracts > PM", "Stage of completion agrees to QS certificates ±2%", "None", "SP", "JW"],
      ["3 contracts", "Revenue per contract agrees to certified valuations", "None", "SP", "JW"],
      ["All despatch notes ±10 days", "Revenue recognised in correct period", "None", "SP", "JW"],
      ["Sample of 15", "GL coding correct for all items tested", "None", "SP", "JW"],
      ["Full roll-forward", "Deferred revenue schedule agrees to contracts", "None", "SP", "JW"]
    ],
    d2: [
      ["5 balances > £50k", "All confirmations returned agreeing", "None", "SP", "JW"],
      ["Receipts to 13/03/2026", "89% of year-end balance received", "None", "SP", "JW"],
      ["Full aged analysis", "90+ days: £85k — all with agreed retention terms", "None", "SP", "JW"],
      ["All credit notes to 30/04/2026", "No material post-year-end credit notes", "None", "SP", "JW"],
      ["N/A", "No intercompany — standalone entity", "N/A", "SP", "JW"]
    ],
    d3: [
      ["Attended 31/03/2026", "Count satisfactory — variance <0.5% of book value", "None", "SP", "JW"],
      ["10 projects", "Cost build-up traced to invoices and timesheets", "None", "SP", "JW"],
      ["3 projects", "Overhead absorption rate tested — 15% applied consistently", "None", "SP", "JW"],
      ["Goods ±5 days of year end", "Cut-off correct", "None", "SP", "JW"],
      ["All projects", "NRV testing satisfactory — no projects below cost", "None", "SP", "JW"]
    ],
    d4: [
      ["10 supplier statements", "All reconcile within £500", "None", "SP", "JW"],
      ["Invoices to 30/04/2026", "Search satisfactory — £12k unrecorded liability identified and adjusted", "1 — adjusted", "SP", "JW"],
      ["GRNI listing", "Accrual correct — 8 items tested", "None", "SP", "JW"],
      ["Full review", "Accruals complete — holiday pay, utilities, audit fee", "None", "SP", "JW"],
      ["N/A", "No intercompany — standalone entity", "N/A", "SP", "JW"]
    ],
    d5: [
      ["Full year analysis", "Payroll cost per head consistent with budget", "None", "SP", "JW"],
      ["5 starters, 3 leavers", "All agree to contracts and P45s", "None", "SP", "JW"],
      ["Year-end accrual", "Overtime accrual of £8,500 correctly calculated", "None", "SP", "JW"],
      ["12-month reconciliation", "RTI agrees to payroll summary ±£200", "None", "SP", "JW"],
      ["Board minutes", "Director remuneration agrees to service contracts", "None", "SP", "JW"]
    ],
    d6: [
      ["All accounts", "Bank confirmation received — agrees to accounts", "None", "SP", "JW"],
      ["Year-end reconciliation", "3 outstanding items — all cleared by 15/04/2026", "None", "SP", "JW"],
      ["Outstanding items", "All cleared within 10 working days", "None", "SP", "JW"],
      ["N/A", "No cash on site", "N/A", "SP", "JW"],
      ["N/A", "GBP only — no foreign currency", "N/A", "SP", "JW"]
    ],
    d7: [
      ["8 additions > PM", "All traced to purchase invoices and delivery notes", "None", "SP", "JW"],
      ["3 disposals", "Proceeds traced to bank; P&L on disposal correctly calculated", "None", "SP", "JW"],
      ["All classes", "Depreciation recalculated — agrees within £2,000", "None", "SP", "JW"],
      ["All classes", "No impairment indicators identified", "None", "SP", "JW"],
      ["5 assets", "Physical verification — all located and in use", "None", "SP", "JW"],
      ["Land Registry + HP docs", "Freehold confirmed; 3 HP agreements verified", "None", "SP", "JW"],
      ["10 items near boundary", "All correctly capitalised per policy (> £1,000)", "None", "SP", "JW"]
    ],
    d10: [
      ["Companies House", "100,000 ordinary shares of £1 each — confirmed", "None", "SP", "JW"],
      ["Board minutes", "No share movements in year", "None", "SP", "JW"],
      ["Board minutes", "Interim dividend £38,000 — s.830 distributable reserves confirmed", "None", "SP", "JW"]
    ],
    d11: [
      ["All facilities", "Bank confirmation agrees to accounting records", "None", "SP", "JW"],
      ["DSCR covenant", "DSCR 1.8x vs required 1.2x — compliant with headroom", "None", "SP", "JW"],
      ["All loans", "Interest recalculated — agrees within £500", "None", "SP", "JW"],
      ["Loan agreements", "No new borrowings in year — confirmed", "None", "SP", "JW"],
      ["All facilities", "Current/non-current split correctly classified", "None", "SP", "JW"]
    ],
    d12: [
      ["All provisions", "FRS 102 s21.4 criteria met for all recognised provisions", "None", "SP", "JW"],
      ["Solicitor's letter", "No pending or threatened litigation — clean response", "None", "SP", "JW"],
      ["Warranty register", "Claims history supports £53k provision — adequate", "None", "SP", "JW"],
      ["All contracts", "No onerous contracts identified", "None", "SP", "JW"],
      ["Disclosure note", "Contingent liabilities note adequate — performance bonds disclosed", "None", "SP", "JW"]
    ],
    d13: [
      ["CT computation", "Agrees to financial statements — tax at 25%", "None", "SP", "JW"],
      ["Schedule", "AIA claim of £185k verified; SBA on commercial unit confirmed", "None", "SP", "JW"],
      ["Full review", "Disallowable items: entertaining £3.2k, depreciation £166k — correct", "None", "SP", "JW"],
      ["CT61/HMRC", "PY computation agreed to assessment — no queries", "None", "SP", "JW"],
      ["Full calculation", "Timing differences: accelerated CA £45k, provisions £12k — correct", "None", "SP", "JW"],
      ["N/A", "No R&D activity", "N/A", "SP", "JW"]
    ],
    d14: [
      ["Lease register", "5 leases identified — all accounted for", "None", "SP", "JW"],
      ["5 leases", "All correctly classified as operating under FRS 102 s20", "None", "SP", "JW"],
      ["Disclosure note", "Commitments note: < 1yr £85k, 2-5yr £210k, > 5yr £0", "None", "SP", "JW"]
    ],
    d15: [
      ["Companies House + declarations", "2 directors identified; PSC register confirmed", "None", "SP", "JW"],
      ["Full search", "No undisclosed connected companies", "None", "SP", "JW"],
      ["Director transactions", "No RP transactions identified beyond remuneration", "None", "SP", "JW"],
      ["Year-end", "No RP balances outstanding", "None", "SP", "JW"],
      ["Companies House", "No directors loans — s.197-214 not applicable", "None", "SP", "JW"],
      ["Disclosure note", "FRS 102 s33 disclosures complete — key management comp £185k", "None", "SP", "JW"]
    ],
    d16: [
      ["Full reconciliation", "Operating activities agrees to P&L adjusted for working capital", "None", "SP", "JW"],
      ["BS movements", "Working capital movements traced to BS — all agree", "None", "SP", "JW"],
      ["FA/investment schedules", "Investing: additions £287k, disposals proceeds £22k — agrees", "None", "SP", "JW"],
      ["Loan/dividend records", "Financing: loan repayments £255k, dividends £38k — agrees", "None", "SP", "JW"],
      ["Bank reconciliation", "Opening £280k → Closing £310k — reconciles to cash flow ±£0", "None", "SP", "JW"]
    ]
  };
  Object.entries(testResults).forEach(([wpId, tests]) => {
    tests.forEach((row, i) => {
      c("test_" + wpId, i, 2, row[0]); c("test_" + wpId, i, 3, row[1]);
      c("test_" + wpId, i, 4, row[2]); c("test_" + wpId, i, 5, row[3]);
      c("test_" + wpId, i, 6, row[4]);
    });
  });

  // ═══ E1 — Completion Checklist (editable cols 4=Done?, 5=Date, 6=Comment) ═══
  const e1Data = [
    ["✓", "2026-03-10", "All WPs reviewed and signed off"],
    ["✓", "2026-03-10", "No subsequent events requiring adjustment"],
    ["✓", "2026-03-08", "Analytical review satisfactory — no unexplained fluctuations"],
    ["✓", "2026-03-05", "Going concern — no material uncertainty"],
    ["✓", "2026-03-10", "Written representations obtained"],
    ["✓", "2026-03-08", "ISA 450 schedule: 1 adjusted difference (£12k unrecorded liability)"],
    ["✓", "2026-03-10", "FRS 102 disclosure checklist complete"],
    ["✓", "2026-03-10", "Independence confirmed — no threats identified"],
    ["✓", "2026-03-10", "ISQM 1 engagement quality review N/A — not PIE"],
    ["✓", "2026-03-10", "Ethical requirements met — FRC ES 2024 compliance confirmed"],
    ["✓", "2026-03-10", "Second partner review N/A"],
    ["✓", "2026-03-10", "Technical consultation: none required"],
    ["✓", "2026-03-10", "ISA 240 fraud procedures completed — no fraud identified"],
    ["✓", "2026-03-10", "ISA 250 laws & regulations — compliance confirmed"],
    ["✓", "2026-03-10", "File assembly: target 60 days from report date per ISA 230.14"],
    ["✓", "2026-03-10", "Audit report: unmodified opinion recommended"],
    ["✓", "2026-03-10", "Management letter: 3 points raised"],
    ["✓", "2026-03-10", "Accounts signed by director and filed"]
  ];
  e1Data.forEach((row, i) => { c("e1", i, 4, row[0]); c("e1", i, 5, row[1]); c("e1", i, 6, row[2]); });

  // ═══ E2 — Final Analytical Review (editable cols 1-5) ═══
  const e2Data = [
    ["18.2%", "17.5%", "15-20%", "Improved margins on M4 project; consistent with expectations", "Yes"],
    ["£1.4m (17% of rev)", "£1.1m (15%)", "10-20%", "Increased WIP from new projects — consistent with activity", "Yes"],
    ["58 days", "62 days", "45-60 days", "Within range — improved from PY", "Yes"],
    ["90+ days: £85k", "90+ days: £110k", "< 10% of total", "Improved from PY; all with agreed retention terms", "Yes"],
    ["42%", "38%", "30-50%", "Higher subcontractor use on civil works — consistent", "Yes"],
    ["78%", "72%", "> 70%", "Improved fleet utilisation", "Yes"],
    ["1.8 months", "2.1 months", "< 3 months", "Improved cash conversion", "Yes"]
  ];
  e2Data.forEach((row, i) => { c("e2", i, 1, row[0]); c("e2", i, 2, row[1]); c("e2", i, 3, row[2]); c("e2", i, 4, row[3]); c("e2", i, 5, row[4]); });

  // ═══ E4 — Written Representations (editable cols 4,5,6) ═══
  // Populate first 16 rows
  for (let i = 0; i < 16; i++) {
    c("e4", i, 4, "✓"); c("e4", i, 5, ""); c("e4", i, 6, "Included in signed letter dated 13/03/2026");
  }

  // ═══ E5 — Summary of Adjustments (editable cols 1-6) ═══
  c("e5", 0, 1, "Unrecorded liability — supplier invoice received post year-end for pre year-end services");
  c("e5", 0, 2, "12,000"); c("e5", 0, 3, "12,000"); c("e5", 0, 4, "D4");
  c("e5", 0, 5, "Increases trade payables and cost of sales — below PM but adjusted"); c("e5", 0, 6, "Yes");

  // ═══ E6 — Audit Completion Memo (editable cols in summary table) ═══
  const e6Data = [
    ["Unmodified opinion — true and fair view", "F2"],
    ["Going concern basis appropriate — no material uncertainty", "A7"],
    ["One adjusted difference: unrecorded liability £12k", "E5"],
    ["Materiality: £125k overall, £93,750 PM — no revision required", "A4"],
    ["Fraud: no matters identified; journal testing satisfactory", "A6"],
    ["Laws & regulations: no non-compliance", "A9"],
    ["Subsequent events: no adjusting events to report date", "E3"],
    ["Related parties: no undisclosed transactions", "D15"],
    ["Management letter: 3 points — stock count procedures, CIS filing timing, asset register updates", "F1"],
    ["Overall: satisfactory audit — recommend signing", "F2"]
  ];
  e6Data.forEach((row, i) => { c("e6_summary", i, 1, row[0]); c("e6_summary", i, 2, row[1]); });

  // ═══ FS1 — Income Statement (editable cols 2=CY, 3=PY, 4=Movement, 5=WP Ref) ═══
  const fs1Data = [
    ["8,200,000", "7,450,000", "750,000", "D1"],
    ["-4,510,000", "-4,100,000", "-410,000", "D3/D4"],
    ["3,690,000", "3,350,000", "340,000", ""],
    ["-1,820,000", "-1,650,000", "-170,000", "D5"],
    ["-420,000", "-380,000", "-40,000", ""],
    ["-135,000", "-120,000", "-15,000", ""],
    ["-1,265,000", "-1,200,000", "-65,000", "D5/D7"],
    ["", "", "", ""],
    ["620,000", "580,000", "40,000", ""],
    ["-52,000", "-45,000", "-7,000", "D11"],
    ["568,000", "535,000", "33,000", ""],
    ["-110,000", "-105,000", "-5,000", "D13"],
    ["458,000", "430,000", "28,000", ""]
  ];
  fs1Data.forEach((row, i) => { c("fs1", i, 2, row[0]); c("fs1", i, 3, row[1]); c("fs1", i, 4, row[2]); c("fs1", i, 5, row[3]); });

  // ═══ FS2 — Balance Sheet (editable cols 2=CY, 3=PY, 4=Movement, 5=WP Ref) ═══
  const fs2Data = [
    ["1,920,000", "1,850,000", "70,000", "D7"],
    ["", "", "", ""],
    ["1,400,000", "1,100,000", "300,000", "D3"],
    ["1,400,000", "1,100,000", "300,000", "D2"],
    ["310,000", "280,000", "30,000", "D6"],
    ["3,110,000", "2,480,000", "630,000", ""],
    ["", "", "", ""],
    ["-1,680,000", "-1,475,000", "-205,000", "D4"],
    ["-135,000", "-100,000", "-35,000", "D11"],
    ["-1,815,000", "-1,575,000", "-240,000", ""],
    ["1,295,000", "905,000", "390,000", ""],
    ["3,215,000", "2,755,000", "460,000", ""],
    ["", "", "", ""],
    ["-480,000", "-380,000", "-100,000", "D11"],
    ["-130,000", "-110,000", "-20,000", "D12"],
    ["-12,000", "-5,000", "-7,000", "D13"],
    ["-622,000", "-495,000", "-127,000", ""],
    ["2,593,000", "2,260,000", "333,000", ""],
    ["", "", "", ""],
    ["100,000", "100,000", "0", "D10"],
    ["0", "0", "0", "D10"],
    ["2,100,000", "1,680,000", "420,000", "D10"],
    ["2,200,000", "1,780,000", "420,000", ""]
  ];
  fs2Data.forEach((row, i) => { c("fs2", i, 2, row[0]); c("fs2", i, 3, row[1]); c("fs2", i, 4, row[2]); c("fs2", i, 5, row[3]); });

  // ═══ REG1 — Companies House (editable cols 2,3,4) ═══
  const reg1Data = [
    ["Filed", "Filed 15/01/2026", "Companies House confirmation"],
    ["Filed", "Filed 01/03/2026", "Confirmation statement"],
    ["Up to date", "2 directors; 1 PSC", "Companies House search"],
    ["Current", "Registered at Meridian House, Bristol", "Companies House"],
    ["Current", "No changes in year", "Board minutes"],
    ["N/A", "No new shares issued", "Board minutes"],
    ["N/A", "No special resolutions passed", "Board minutes"],
    ["Current", "Debenture registered", "Companies House search"],
    ["Current", "PSC: M. Thompson (75%+)", "Companies House search"],
    ["Confirmed", "Medium-sized company — qualifies for exemptions", "Threshold calculation"]
  ];
  reg1Data.forEach((row, i) => { c("reg1", i, 2, row[0]); c("reg1", i, 3, row[1]); c("reg1", i, 4, row[2]); });

  // ═══ REG2 — HMRC (editable cols 2,3,4,5) ═══
  const reg2Data = [
    ["Filed", "£110,000", "CT600 submitted 15/01/2027", ""],
    ["Paid", "£105,000", "Payment made 01/01/2027", ""],
    ["N/A", "", "", "No income tax payments made"],
    ["Filed", "", "All FPS submitted on time", "Monthly review"],
    ["Filed", "", "EPS submitted monthly", ""],
    ["Filed", "£2,400", "P11D filed 05/07/2026", ""],
    ["Filed", "£185,000 net", "All quarterly returns filed via MTD", ""],
    ["Filed", "", "Monthly CIS returns filed", "CIS reconciliation agreed"],
    ["Filed", "", "Submitted with CT600", ""],
    ["Compliant", "", "All filings iXBRL tagged", ""],
    ["N/A", "", "", "No R&D activity"],
    ["Claimed", "£185,000 AIA", "Via CT600", ""]
  ];
  reg2Data.forEach((row, i) => { c("reg2", i, 2, row[0]); c("reg2", i, 3, row[1]); c("reg2", i, 4, row[2]); c("reg2", i, 5, row[3]); });

  // ═══ SIGN-OFFS ═══
  const signOffs = {};
  const planningWPs = ["a1", "a2", "a3", "a4", "a5", "a6", "a8", "a9"];
  const riskWPs = ["b1", "b2", "b3"];
  const leadWPs = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];
  const fsWPs = ["fs1", "fs2", "fs3", "fs4"];
  const testingWPs = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14", "d15", "d16"];
  const completionWPs = ["e1", "a7", "e2", "e3", "e4", "e5", "e6", "dc1"];
  const reportingWPs = ["f1", "f2"];
  const regulatoryWPs = ["reg1", "reg2", "std1"];

  const allSignable = [...planningWPs, ...riskWPs, ...leadWPs, ...fsWPs, ...testingWPs, ...completionWPs, ...reportingWPs, ...regulatoryWPs];
  allSignable.forEach(wp => {
    signOffs[wp] = { preparedBy: "2026-03-08", reviewedBy: "2026-03-10" };
  });

  // ═══ WP NOTES ═══
  const wpNotes = {
    a1: "Engagement letter signed by M. Thompson (Director) on 15/01/2026. Terms per ISA 210. Fee: £28,500 + VAT.",
    a2: "Client acceptance procedures completed per ISQM 1. No integrity concerns. AML checks satisfactory. Independence confirmed.",
    a3: "Audit approach: primarily substantive. Key focus areas: long-term contract revenue, WIP valuation, retentions recoverability. Planned fieldwork: February-March 2026.",
    a4: "Materiality based on 2.5% of total assets (£5.1m). Selected as most stable benchmark for a construction entity where PBT can fluctuate significantly. PM set at 75% of OM. Trivial at 5% of OM.",
    a5: "Meridian Construction Ltd is a medium-sized commercial construction company established 2019, based in Bristol. Revenue £8.2m (PY £7.45m). Key clients: local authorities and private developers. 85 employees. Uses Sage Construction Cloud for project costing.",
    a6: "ISA 240 presumed risks addressed: (1) Revenue recognition — stage of completion tested for all contracts > PM. (2) Management override — journal entry testing performed per criteria. No fraud indicators identified.",
    a7: "Going concern assessment: no material uncertainty. Entity has positive net assets of £2.8m, contracted order book of £14.2m, and adequate banking facilities. Cash flow forecast reviewed and tested — supports 12-month assessment.",
    a8: "Planning analytical review completed. Revenue growth of 10.1% consistent with new project wins. Gross margin stable at 45%. No unexpected fluctuations requiring further investigation.",
    a9: "Laws and regulations: Companies Act 2006, H&S at Work Act, CDM Regulations 2015, Building Safety Act 2022, ITEPA 2003 (CIS). No non-compliance identified.",
    b1: "Risk assessment matrix completed. 2 significant risks (revenue recognition, WIP valuation), 4 elevated risks, 8 normal risks. All construction-specific.",
    b2: "Controls assessment: 5 entity-level controls tested. Revenue cycle, purchases cycle, payroll cycle walkthrough completed. Design and operating effectiveness confirmed for all key controls relied upon.",
    b3: "Two significant risks identified per ISA 315.28: (1) Long-term contract revenue — addressed via extended substantive testing on D1; (2) WIP valuation — addressed via cost-to-complete analysis on D3.",
    c2: "P&L lead schedule agrees to trial balance. All line items traced to supporting WPs. Revenue £8.2m (PY £7.45m). PBT £620k (PY £580k).",
    c3: "Balance sheet lead schedule agrees to trial balance. Total assets £5.1m (PY £4.47m). Net assets £2.2m (PY £1.78m).",
    d1: "Revenue testing: stage of completion recalculated for 5 contracts > PM. All agree to QS certificates within 2%. Cut-off testing satisfactory. No material misstatement.",
    d2: "Receivables: 5 balances circularised (ISA 505) — all confirmed. Subsequent receipts: 89% collected. Aged debt provision adequate.",
    d3: "Inventory/WIP: attended stock count 31/03/2026. Count satisfactory (variance < 0.5%). Cost build-up and overhead absorption tested on 10 projects. NRV testing: no projects below cost.",
    d4: "Payables: 10 supplier statements reconciled. Unrecorded liabilities search: 1 item of £12k identified and adjusted. GRNI and accruals testing satisfactory.",
    d7: "Fixed assets: 8 additions > PM tested to invoices. 3 disposals verified. Depreciation recalculated. Physical verification of 5 assets. No impairment indicators.",
    d13: "Taxation: CT computation agrees to FS. Capital allowances (AIA £185k) verified. Disallowable items tested. Deferred tax timing differences confirmed.",
    e1: "All completion procedures performed. File ready for assembly.",
    e2: "Final analytical review performed per ISA 520.6. All ratios consistent with expectations. No unexplained fluctuations.",
    e5: "One adjusted difference: unrecorded liability of £12,000 for services received before year end. Below PM but adjusted at management's request.",
    e6: "Audit completion memorandum: unmodified opinion recommended. All ISA requirements met. One adjusted difference (£12k). Management letter with 3 points. File assembly within 60 days of report date.",
    f1: "Management letter points: (1) Stock count procedures — recommend formalised count instructions (Medium). (2) CIS filing timing — 2 returns filed late by 1-2 days (Low). (3) Asset register — recommend quarterly reconciliation to GL (Low).",
    f2: "Independent auditor's report: unmodified opinion on financial statements prepared under FRS 102. No Material Uncertainty related to Going Concern. Companies Act requirements met.",
    "a7_total_score": "5",
    "a7_risk_level": "Low",
    "a7_conclusion": "Going concern basis of accounting is appropriate. No material uncertainty identified. Entity has strong order book, positive cash flows, and adequate financing.",
  };

  return { cfg, cellData, signOffs, wpNotes, customItems: { risks: [], tests: {} } };
}

// Alias for backward compatibility
export const generateDemoState = generateDemoConstruction;

// ═══════════════════════════════════════════════════════════════
// DEMO SEED — Nexus Financial Services Ltd
// Pre-populates every editable field with realistic audit data
// for a large IFRS asset management firm (PIE engagement)
// ═══════════════════════════════════════════════════════════════

export function generateDemoFinancialServices() {
  const cfg = {
    industry: "financial_services",
    sector: "Asset Management",
    framework: "ifrs",
    entitySize: "large",
    entityName: "Nexus Financial Services Ltd",
    companyNumber: "87654321",
    fye: "31/12/2025",
    partner: "R Williams",
    manager: "S Thompson",
    firmName: "Williams Thornton LLP",
    materiality: "500000",
    perfMateriality: "375000",
    trivial: "25000",
    engagementType: "pie",
    revenue: "22000000",
    totalAssets: "180000000",
    pbt: "3200000",
    configured: true
  };

  const cellData = {};
  const c = (id, row, col, val) => { cellData[`${id}_${row}_${col}`] = val; };

  // ═══ A1 — Engagement Planning ═══
  c("a1", 0, 1, "Nexus Financial Services Ltd — FCA authorised and regulated");
  c("a1", 0, 2, "IFRS statutory audit — PIE engagement under ISA (UK)");
  c("a1", 1, 1, "AUM £2.4bn across 12 funds; fee income £38.2m");
  c("a1", 1, 2, "Engagement quality review required per ISQM 1");

  // ═══ A2 — Client Acceptance ═══
  const a2Assessments = [
    ["FCA register confirms authorised status — no enforcement actions", "Accept engagement"],
    ["Competent — financial services sector team assigned", "Accept"],
    ["Adequate resources — 6 team members assigned for Q1 fieldwork", "Accept"],
    ["No independence threats — no financial interests in entity or funds", "Accept"],
    ["Terms agreed per ISA 210 engagement letter dated 05/11/2025", "Accept"],
    ["IFRS applicable — PIE entity per FCA definition", "Accept"],
    ["Predecessor auditor: Grant Stanley — professional clearance obtained", "Accept — no matters of concern"],
    ["AML/KYC checks completed — PEP screening negative", "Accept"],
    ["Engagement letter signed 10/11/2025 by CEO and CFO", "Accept"],
    ["ISQM 1 acceptance procedures completed — EQR assigned", "Accept"]
  ];
  a2Assessments.forEach((row, i) => { c("a2", i, 4, row[0]); c("a2", i, 5, row[1]); });

  // ═══ A4 — Materiality benchmarks ═══
  const a4Data = [
    ["38200000", "1.5%", "573000", ""],
    ["6800000", "7%", "476000", ""],
    ["142000000", "0.35%", "497000", "✓"],
    ["28500000", "2%", "570000", ""],
    ["31400000", "1.5%", "471000", ""],
  ];
  a4Data.forEach((row, i) => { c("a4", i, 4, row[0]); c("a4", i, 5, row[1]); c("a4", i, 6, row[2]); c("a4", i, 7, row[3]); });

  // ═══ A5 — Understanding the Entity — KPIs ═══
  const kpiData = [
    ["0.28%", "0.26%", "+2bp", "Management fee rate stable; slight increase from new fund launches"],
    ["£6.8m", "£5.9m", "+15%", "PBT growth driven by AUM increase and performance fees"],
    ["62%", "64%", "-2pp", "Cost-to-income ratio improved via operational efficiencies"],
    ["£2.4bn", "£2.1bn", "+14%", "AUM growth from net inflows of £180m and market appreciation"],
    ["98.2%", "97.8%", "+0.4pp", "Client retention rate remains high"],
    ["45 days", "48 days", "-6%", "Debtor days improved with new invoicing system"],
    ["£1.2m", "£0.9m", "+33%", "Performance fees increased on equity funds outperforming benchmarks"]
  ];
  kpiData.forEach((row, i) => { c("kpi", i, 1, row[0]); c("kpi", i, 2, row[1]); c("kpi", i, 3, row[2]); c("kpi", i, 4, row[3]); });

  // ═══ A5 — Controls ═══
  const a5cData = [
    ["Yes — daily NAV reconciliation with independent administrator", "Yes — tested 20 business days", "Yes", "Administrator reports; Bloomberg feeds"],
    ["Yes — FCA CASS 7 daily client money reconciliation", "Yes — tested 10 days", "Yes", "CASS resolution pack; bank confirmations"],
    ["Yes — four-eyes principle on all trades", "Yes — tested 15 transactions", "Yes", "Trade blotters; compliance reports"],
    ["Yes — monthly management fee calculations reviewed by CFO", "Yes — tested 4 months", "Yes", "Fee calculation workbooks; fund admin confirmation"],
    ["Yes — quarterly FCA regulatory return preparation", "Yes — reviewed 4 quarters", "Yes", "FCA Gabriel filings; capital adequacy workings"]
  ];
  a5cData.forEach((row, i) => { c("a5c", i, 1, row[0]); c("a5c", i, 2, row[1]); c("a5c", i, 3, row[2]); c("a5c", i, 4, row[3]); });

  // ═══ A6 — Fraud Risk Assessment ═══
  const jetData = [
    ["Yes", "None", "Tested 20 manual journals > PM — no anomalies"],
    ["Yes", "None", "Weekend/holiday entries: 1 found, authorised month-end process"],
    ["Yes", "None", "Round-number journals: 5 identified, all legitimate fee accruals"],
    ["Yes", "None", "Journals by unusual users: all posted by authorised finance team"],
    ["Yes", "None", "Unusual accounts: no entries to suspense accounts"],
    ["Yes", "None", "Revenue journals: all supported by AUM data and fee schedules"],
    ["Yes", "None", "Year-end journals: 18 tested — all with supporting documentation"],
    ["Yes", "None", "Consolidation adjustments: N/A — standalone entity"]
  ];
  jetData.forEach((row, i) => { c("a6_jet", i, 2, row[0]); c("a6_jet", i, 3, row[1]); c("a6_jet", i, 4, row[2]); });

  const a6RiskData = [
    ["See D1 — management fee income recalculated for all funds using AUM data", "D1", "Satisfactory — fee income agrees to independent AUM data"],
    ["See D9 — CASS client money segregation tested against FCA requirements", "D9", "Satisfactory — full compliance with CASS 7"]
  ];
  a6RiskData.forEach((row, i) => { c("a6_risks", i, 4, row[0]); c("a6_risks", i, 5, row[1]); c("a6_risks", i, 6, row[2]); });

  // ═══ B1 — Risk Assessment Matrix ═══
  const b1Data = [
    ["Moderate", "Low", "SIGNIFICANT", "Recalculate management fees for all 12 funds using independent AUM; test performance fee calculations"],
    ["Moderate", "Low", "SIGNIFICANT", "CASS 7 client money reconciliation — daily balances tested; resolution pack reviewed"],
    ["Moderate", "Moderate", "ELEVATED", "FCA capital adequacy: recalculate regulatory capital; test ICARA assessment"],
    ["Moderate", "Moderate", "ELEVATED", "Trade receivables confirmation; subsequent receipts; ageing analysis"],
    ["Good", "Moderate", "NORMAL", "Test fee accruals against AUM data and contractual rates"],
    ["Good", "Moderate", "NORMAL", "Staff costs: test bonus accruals and deferred compensation"],
    ["Good", "Moderate", "NORMAL", "Test IT general controls — Bloomberg, Advent Geneva access"],
    ["Good", "Moderate", "NORMAL", "Verify bank balances and reconciling items"],
    ["Good", "Low", "NORMAL", "Test lease accounting under IFRS 16 — office leases"],
    ["Good", "Low", "NORMAL", "Verify regulatory provisions and FCA levies"]
  ];
  b1Data.forEach((row, i) => { c("b1", i, 4, row[0]); c("b1", i, 5, row[1]); c("b1", i, 6, row[2]); c("b1", i, 8, row[3]); });

  // ═══ C1 — Trial Balance / Mapping ═══
  c("c1", 0, 1, "Trial balance imported from Sage Intacct — 31/12/2025");
  c("c1", 0, 2, "TB agrees to GL export within £0");
  c("c1", 1, 1, "Chart of accounts mapped to IFRS taxonomy");
  c("c1", 1, 2, "All accounts mapped — no unmapped balances");

  // ═══ D1 — Revenue Testing ═══
  const testD1 = [
    ["All 12 funds", "Management fees recalculated using daily AUM x contractual rate", "None", "ST", "RW"],
    ["3 funds with perf fees", "Performance fee crystallisation tested against HWM and benchmarks", "None", "ST", "RW"],
    ["Q4 invoices +/- 10 days", "Revenue cut-off tested — fee income recognised in correct period", "None", "ST", "RW"],
    ["Full year", "Fee income reconciled to fund administrator confirmations", "None", "ST", "RW"],
    ["Deferred fees", "Deferred revenue schedule agrees to billing terms", "None", "ST", "RW"]
  ];
  testD1.forEach((row, i) => { c("test_d1", i, 2, row[0]); c("test_d1", i, 3, row[1]); c("test_d1", i, 4, row[2]); c("test_d1", i, 5, row[3]); c("test_d1", i, 6, row[4]); });

  // ═══ D2 — Receivables Testing ═══
  const testD2 = [
    ["8 balances > £200k", "All confirmations returned — agree to records", "None", "ST", "RW"],
    ["Receipts to 13/03/2026", "94% of year-end balance received", "None", "ST", "RW"],
    ["Full aged analysis", "No amounts > 90 days — all current", "None", "ST", "RW"],
    ["Performance fee receivables", "Crystallised amounts confirmed by fund administrators", "None", "ST", "RW"]
  ];
  testD2.forEach((row, i) => { c("test_d2", i, 2, row[0]); c("test_d2", i, 3, row[1]); c("test_d2", i, 4, row[2]); c("test_d2", i, 5, row[3]); c("test_d2", i, 6, row[4]); });

  // ═══ D6 — Cash Testing ═══
  const testD6 = [
    ["All 4 accounts", "Bank confirmations received — agree to GL", "None", "ST", "RW"],
    ["Year-end reconciliation", "5 outstanding items — all cleared by 20/01/2026", "None", "ST", "RW"],
    ["CASS client money accounts", "Segregated accounts confirmed by custodian banks", "None", "ST", "RW"],
    ["FX balances", "USD and EUR balances translated at 31/12/2025 closing rates", "None", "ST", "RW"]
  ];
  testD6.forEach((row, i) => { c("test_d6", i, 2, row[0]); c("test_d6", i, 3, row[1]); c("test_d6", i, 4, row[2]); c("test_d6", i, 5, row[3]); c("test_d6", i, 6, row[4]); });

  // ═══ D9 — Regulatory / CASS Testing ═══
  const testD9 = [
    ["Daily reconciliation — 20 days", "Client money agrees to trust account statements within £0", "None", "ST", "RW"],
    ["Resolution pack", "CASS resolution pack complete and up to date", "None", "ST", "RW"],
    ["Acknowledgement letters", "All client money bank acknowledgement letters current", "None", "ST", "RW"],
    ["CMAR filings", "12 monthly CASS returns filed on time", "None", "ST", "RW"]
  ];
  testD9.forEach((row, i) => { c("test_d9", i, 2, row[0]); c("test_d9", i, 3, row[1]); c("test_d9", i, 4, row[2]); c("test_d9", i, 5, row[3]); c("test_d9", i, 6, row[4]); });

  // ═══ D11 — Loans Testing ═══
  const testD11 = [
    ["RCF facility", "Bank confirmation: £5m facility, £2.8m drawn — agrees", "None", "ST", "RW"],
    ["Financial covenants", "Interest cover 8.2x vs required 4.0x — compliant", "None", "ST", "RW"],
    ["Interest recalculation", "Interest charges recalculated — agrees within £1,200", "None", "ST", "RW"],
    ["All facilities", "Current/non-current split correctly classified under IAS 1", "None", "ST", "RW"]
  ];
  testD11.forEach((row, i) => { c("test_d11", i, 2, row[0]); c("test_d11", i, 3, row[1]); c("test_d11", i, 4, row[2]); c("test_d11", i, 5, row[3]); c("test_d11", i, 6, row[4]); });

  // ═══ D13 — Tax Testing ═══
  const testD13 = [
    ["CT computation", "Agrees to financial statements — corporation tax at 25%", "None", "ST", "RW"],
    ["Transfer pricing", "Intercompany management charges tested — arm's length confirmed", "None", "ST", "RW"],
    ["Deferred tax", "IAS 12 — timing differences on IFRS 16 leases and bonus accruals", "None", "ST", "RW"],
    ["Pillar Two assessment", "GloBE rules assessed — no top-up tax required", "None", "ST", "RW"]
  ];
  testD13.forEach((row, i) => { c("test_d13", i, 2, row[0]); c("test_d13", i, 3, row[1]); c("test_d13", i, 4, row[2]); c("test_d13", i, 5, row[3]); c("test_d13", i, 6, row[4]); });

  // ═══ D15 — Related Parties Testing ═══
  const testD15 = [
    ["FCA register + Companies House", "4 directors; 2 controllers identified; fund relationships mapped", "None", "ST", "RW"],
    ["Intercompany transactions", "Management charges to 3 related funds tested — arm's length", "None", "ST", "RW"],
    ["Director transactions", "No RP transactions beyond approved remuneration", "None", "ST", "RW"],
    ["IAS 24 disclosures", "Key management compensation £2.8m disclosed; related fund fees £4.1m", "None", "ST", "RW"]
  ];
  testD15.forEach((row, i) => { c("test_d15", i, 2, row[0]); c("test_d15", i, 3, row[1]); c("test_d15", i, 4, row[2]); c("test_d15", i, 5, row[3]); c("test_d15", i, 6, row[4]); });

  // ═══ FSLI Leads ═══
  const fsliLeads = {
    d1: { data: [["34800000", "38200000", "3400000", "9.8%", "✓"], ["800000", "1200000", "400000", "50.0%", "✓"], ["280000", "310000", "30000", "10.7%", "✓"]] },
    d2: { data: [["4200000", "4800000", "600000", "14.3%", "✓"], ["1100000", "1400000", "300000", "27.3%", "✓"], ["320000", "280000", "-40000", "-12.5%", "✓"]] },
    d6: { data: [["42000000", "48000000", "6000000", "14.3%", "✓"], ["8500000", "9200000", "700000", "8.2%", "✓"]] },
    d9: { data: [["180000000", "210000000", "30000000", "16.7%", "✓"], ["15000000", "18000000", "3000000", "20.0%", "✓"]] },
    d11: { data: [["3200000", "2800000", "-400000", "-12.5%", "✓"], ["1500000", "1200000", "-300000", "-20.0%", "✓"]] },
    d13: { data: [["1450000", "1600000", "150000", "10.3%", "✓"], ["280000", "320000", "40000", "14.3%", "✓"], ["85000", "92000", "7000", "8.2%", "✓"]] },
    d15: { data: [["3800000", "4100000", "300000", "7.9%", "✓"], ["2400000", "2800000", "400000", "16.7%", "✓"]] }
  };
  Object.entries(fsliLeads).forEach(([wpId, spec]) => {
    spec.data.forEach((row, ri) => {
      c("fsli_" + wpId, ri, 1, row[0]); c("fsli_" + wpId, ri, 2, row[1]);
      c("fsli_" + wpId, ri, 3, row[2]); c("fsli_" + wpId, ri, 4, row[3]);
      c("fsli_" + wpId, ri, 6, row[4]);
    });
  });

  // ═══ E1 — Completion Checklist ═══
  const e1Data = [
    ["✓", "2026-03-10", "All WPs reviewed and signed off — EQR completed"],
    ["✓", "2026-03-10", "No subsequent events requiring adjustment"],
    ["✓", "2026-03-08", "Analytical review satisfactory — no unexplained fluctuations"],
    ["✓", "2026-03-05", "Going concern — no material uncertainty; regulatory capital adequate"],
    ["✓", "2026-03-10", "Written representations obtained from CEO and CFO"],
    ["✓", "2026-03-08", "ISA 450 schedule: no adjusted or unadjusted differences"],
    ["✓", "2026-03-10", "IFRS disclosure checklist complete — IAS 1 through IFRS 16"],
    ["✓", "2026-03-10", "Independence confirmed — no threats identified; rotation compliant"],
    ["✓", "2026-03-10", "ISQM 1 engagement quality review completed — no concerns"],
    ["✓", "2026-03-10", "FRC Ethical Standard 2024 compliance confirmed"],
    ["✓", "2026-03-10", "CASS audit opinion — reasonable assurance on client money"],
    ["✓", "2026-03-10", "FCA regulatory return reviewed — capital adequacy confirmed"],
    ["✓", "2026-03-10", "ISA 240 fraud procedures completed — no fraud identified"],
    ["✓", "2026-03-10", "ISA 250 laws & regulations — FCA compliance confirmed"],
    ["✓", "2026-03-10", "File assembly: target 60 days from report date per ISA 230.14"],
    ["✓", "2026-03-10", "Audit report: unmodified opinion recommended"],
    ["✓", "2026-03-10", "Management letter: 2 points raised"],
    ["✓", "2026-03-10", "Accounts approved by board and filed"]
  ];
  e1Data.forEach((row, i) => { c("e1", i, 4, row[0]); c("e1", i, 5, row[1]); c("e1", i, 6, row[2]); });

  // ═══ SIGN-OFFS ═══
  const signOffs = {};
  const signableWPs = [
    "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9",
    "b1", "b2", "b3",
    "c1", "c2", "c3",
    "d1", "d2", "d6", "d9", "d11", "d13", "d15",
    "e1", "e2", "e3", "e4", "e5", "e6",
    "f1", "f2"
  ];
  signableWPs.forEach(wp => {
    signOffs[wp] = { preparedBy: "2026-03-08", reviewedBy: "2026-03-10" };
  });

  // ═══ WP NOTES ═══
  const wpNotes = {
    a1: "Engagement letter signed by CEO (J. Harrison) and CFO (L. Chen) on 10/11/2025. PIE engagement — EQR assigned (Partner: A. Greenfield). Fee: £185,000 + VAT.",
    a2: "Client acceptance: FCA register checked — no enforcement actions. Professional clearance from predecessor auditor (Grant Stanley) — no matters of concern. AML/KYC completed.",
    a4: "Materiality based on 0.35% of total assets (£142m). Selected as most appropriate benchmark for asset management entity where AUM-related assets dominate. PM at 75%, trivial at 5%.",
    a5: "Nexus Financial Services Ltd is an FCA-authorised asset management firm. AUM £2.4bn across 12 funds (equity, fixed income, multi-asset). 120 employees. Custody held by Northern Trust. Fund administration by BNP Paribas.",
    a6: "ISA 240 — Presumed risks: (1) Management fee revenue — tested by recalculating fees using independent AUM data. (2) Management override — journal testing completed. No fraud indicators.",
    b1: "Risk assessment: 2 significant risks (fee income recognition, CASS client money), 2 elevated risks (regulatory capital, receivables), 6 normal risks. Financial services-specific risk profile.",
    d1: "Revenue: management fees recalculated for all 12 funds. Performance fees tested on 3 funds with crystallisation events. All agree to fund administrator confirmations. No misstatement.",
    d2: "Receivables: 8 balances confirmed (ISA 505). Subsequent receipts: 94% collected. No aged items over 90 days. Performance fee receivables confirmed by fund administrators.",
    d6: "Cash: bank confirmations received for all 4 accounts. CASS segregated client money accounts confirmed by custodian banks. FX balances translated at closing rates.",
    d9: "CASS 7 client money: daily reconciliation tested for 20 business days — all balances agree. Resolution pack reviewed and complete. Acknowledgement letters all current. CMAR filings on time.",
    d13: "Taxation: CT computation agrees. Transfer pricing on intercompany charges confirmed arm's length. Deferred tax on IFRS 16 and bonus accruals. Pillar Two assessment — no top-up tax.",
    d15: "Related parties: fund management relationships mapped. Intercompany charges tested — arm's length per transfer pricing policy. IAS 24 disclosures adequate.",
    e1: "All completion procedures performed. EQR completed. File ready for assembly.",
    e6: "Audit completion: unmodified opinion recommended. CASS reasonable assurance opinion issued. No adjusted or unadjusted differences. Management letter: 2 points (IT access controls, business continuity testing)."
  };

  const customItems = {
    risks: [
      { id: "CR01", t: "CASS 7 client money segregation failure", lv: "SIGNIFICANT", isa: "ISA 250" },
      { id: "CR02", t: "FCA regulatory capital adequacy breach risk", lv: "ELEVATED", isa: "ISA 250" }
    ],
    tests: {}
  };

  return { cfg, cellData, signOffs, wpNotes, customItems };
}

// ═══════════════════════════════════════════════════════════════
// DEMO SEED — Riverside Community Trust
// Pre-populates every editable field with realistic audit data
// for a small charity under Charities SORP (FRS 102)
// ═══════════════════════════════════════════════════════════════

export function generateDemoCharity() {
  const cfg = {
    industry: "charities",
    sector: "Service Delivery",
    framework: "charities_sorp",
    entitySize: "small",
    entityName: "Riverside Community Trust",
    charityNumber: "1234567",
    fye: "31/03/2026",
    partner: "M Patel",
    manager: "K O'Brien",
    firmName: "Patel & Associates",
    materiality: "25000",
    perfMateriality: "18750",
    trivial: "1250",
    engagementType: "statutory",
    totalIncome: "1800000",
    totalAssets: "950000",
    surplus: "85000",
    configured: true
  };

  const cellData = {};
  const c = (id, row, col, val) => { cellData[`${id}_${row}_${col}`] = val; };

  // ═══ A1 — Engagement Planning ═══
  c("a1", 0, 1, "Riverside Community Trust — Charity Commission registered (No. 1182456)");
  c("a1", 0, 2, "Statutory audit under Charities Act 2011 s.144 — income > £1m");
  c("a1", 1, 1, "Total income £1.6m; service delivery charity — youth services and community outreach");
  c("a1", 1, 2, "Charities SORP (FRS 102) applicable — trustees' annual report required");

  // ═══ A2 — Client Acceptance ═══
  const a2Assessments = [
    ["Charity Commission register checked — no regulatory actions; Satisfactory", "Accept engagement"],
    ["Competent — charities sector experience on team", "Accept"],
    ["Adequate resources — 3 team members for April fieldwork", "Accept"],
    ["No independence threats — no trustee connections", "Accept"],
    ["Terms agreed per ISA 210; Charities Act 2011 reporting requirements noted", "Accept"],
    ["Charities SORP (FRS 102) applicable — income > £500k", "Accept"],
    ["Continuing engagement — 4th year of appointment", "Accept — reappointment confirmed at AGM"],
    ["AML checks completed — all trustees verified", "Accept"],
    ["Engagement letter signed by Chair of Trustees 20/02/2026", "Accept"],
    ["ISQM 1 acceptance procedures completed", "Accept"]
  ];
  a2Assessments.forEach((row, i) => { c("a2", i, 4, row[0]); c("a2", i, 5, row[1]); });

  // ═══ A4 — Materiality benchmarks ═══
  const a4Data = [
    ["1620000", "1.5%", "24300", "✓"],
    ["82000", "8%", "6560", ""],
    ["1180000", "2%", "23600", ""],
    ["680000", "3%", "20400", ""],
    ["1538000", "1.5%", "23070", ""],
  ];
  a4Data.forEach((row, i) => { c("a4", i, 4, row[0]); c("a4", i, 5, row[1]); c("a4", i, 6, row[2]); c("a4", i, 7, row[3]); });

  // ═══ A5 — Understanding the Entity — KPIs ═══
  const kpiData = [
    ["£1.62m", "£1.48m", "+9.5%", "Income growth from new Heritage Lottery Fund grant awarded in year"],
    ["£82k", "£65k", "+26%", "Net income improved; restricted fund expenditure matched to grant conditions"],
    ["92%", "94%", "-2pp", "Charitable expenditure ratio: high proportion of income spent on objectives"],
    ["3.2 months", "2.8 months", "+14%", "Free reserves increased slightly — within reserves policy range"],
    ["85%", "82%", "+3pp", "Grant conditions met on time — improved project monitoring"],
    ["£420k", "£380k", "+11%", "Restricted fund balances increased from new multi-year grant"],
    ["42", "38", "+11%", "FTE staff increased with new project workers for youth programme"]
  ];
  kpiData.forEach((row, i) => { c("kpi", i, 1, row[0]); c("kpi", i, 2, row[1]); c("kpi", i, 3, row[2]); c("kpi", i, 4, row[3]); });

  // ═══ A5 — Controls ═══
  const a5cData = [
    ["Yes — dual authorisation on all payments > £500", "Yes — tested 10 payments", "Yes", "Bank mandate; payment authorisation log"],
    ["Yes — restricted fund tracking in Xero Projects", "Yes — tested 3 grants", "Yes", "Grant monitoring reports; Xero project codes"],
    ["Yes — monthly management accounts to board", "Yes — reviewed 6 months", "Yes", "Board minutes; management accounts packs"],
    ["Yes — DBS checks for all staff and volunteers", "Yes — sample of 15 personnel files", "No — reliance on HR records", "HR register; DBS certificates"],
    ["Yes — fundraising income reconciled to CRM (Donorfy)", "Yes — tested 2 quarters", "Yes", "Donorfy reports; bank reconciliations"]
  ];
  a5cData.forEach((row, i) => { c("a5c", i, 1, row[0]); c("a5c", i, 2, row[1]); c("a5c", i, 3, row[2]); c("a5c", i, 4, row[3]); });

  // ═══ A6 — Fraud Risk Assessment ═══
  const jetData = [
    ["Yes", "None", "Tested 12 manual journals > PM — no anomalies"],
    ["Yes", "None", "Weekend entries: 2 found, both authorised gift aid batch processing"],
    ["Yes", "None", "Round-number journals: 4 identified, all legitimate grant income postings"],
    ["Yes", "None", "Journals by unusual users: CEO posted 1 journal — approved by finance manager"],
    ["Yes", "None", "Unusual accounts: no entries to suspense or dormant funds"],
    ["Yes", "None", "Income journals: all supported by grant agreements or donation records"],
    ["Yes", "None", "Year-end journals: 8 tested — all with supporting documentation"],
    ["N/A", "N/A", "No consolidation — standalone charity"]
  ];
  jetData.forEach((row, i) => { c("a6_jet", i, 2, row[0]); c("a6_jet", i, 3, row[1]); c("a6_jet", i, 4, row[2]); });

  const a6RiskData = [
    ["See D1 — grant income recognition tested against performance conditions", "D1", "Satisfactory — income recognised per SORP module 5"],
    ["See D2 — restricted fund balances tested for compliance with grant terms", "D2", "Satisfactory — all restrictions properly tracked"]
  ];
  a6RiskData.forEach((row, i) => { c("a6_risks", i, 4, row[0]); c("a6_risks", i, 5, row[1]); c("a6_risks", i, 6, row[2]); });

  // ═══ B1 — Risk Assessment Matrix ═══
  const b1Data = [
    ["Moderate", "Low", "ELEVATED", "Test grant income recognition against performance conditions per SORP module 5"],
    ["Moderate", "Moderate", "ELEVATED", "Restricted fund tracking — verify expenditure matches grant conditions"],
    ["Moderate", "Moderate", "ELEVATED", "Donation income — test completeness of cash and online donations"],
    ["Good", "Moderate", "NORMAL", "Staff costs — test payroll, NIC, pension auto-enrolment"],
    ["Good", "Moderate", "NORMAL", "Direct charitable expenditure — test programme costs to budgets"],
    ["Good", "Moderate", "NORMAL", "Support costs — test allocation basis across charitable activities"],
    ["Good", "Moderate", "NORMAL", "Governance costs — verify audit fee, trustee expenses, legal fees"],
    ["Good", "Low", "NORMAL", "Cash and bank — confirm balances; test reconciling items"],
    ["Good", "Low", "NORMAL", "Fixed assets — verify community centre leasehold improvements"],
    ["Good", "Low", "NORMAL", "Trustee expenses and related party transactions — completeness"]
  ];
  b1Data.forEach((row, i) => { c("b1", i, 4, row[0]); c("b1", i, 5, row[1]); c("b1", i, 6, row[2]); c("b1", i, 8, row[3]); });

  // ═══ C1 — Trial Balance / Mapping ═══
  c("c1", 0, 1, "Trial balance imported from Xero — 31/03/2026");
  c("c1", 0, 2, "TB agrees to Xero GL export within £0");
  c("c1", 1, 1, "Chart of accounts mapped to Charities SORP (FRS 102) taxonomy");
  c("c1", 1, 2, "All accounts mapped — fund designations confirmed (unrestricted / restricted / endowment)");

  // ═══ D1 — Income Testing ═══
  const testD1 = [
    ["5 grants > PM", "Grant income recognised per performance conditions — SORP module 5 compliant", "None", "KO", "MP"],
    ["Heritage Lottery Fund grant", "£280k recognised; £120k deferred — conditions not yet met — correct", "None", "KO", "MP"],
    ["All donation channels", "Completeness: Donorfy CRM reconciled to bank receipts — agrees +/- £85", "None", "KO", "MP"],
    ["Gift Aid claims", "4 quarterly claims tested — HMRC receipts agree to Donorfy calculations", "None", "KO", "MP"],
    ["Fundraising events", "3 events tested — income reconciled to ticket sales and bank deposits", "None", "KO", "MP"]
  ];
  testD1.forEach((row, i) => { c("test_d1", i, 2, row[0]); c("test_d1", i, 3, row[1]); c("test_d1", i, 4, row[2]); c("test_d1", i, 5, row[3]); c("test_d1", i, 6, row[4]); });

  // ═══ D2 — Receivables / Restricted Funds Testing ═══
  const testD2 = [
    ["All restricted funds", "Fund-by-fund analysis — all expenditure per grant conditions", "None", "KO", "MP"],
    ["3 multi-year grants", "Deferred income tested — conditions outstanding confirmed with funders", "None", "KO", "MP"],
    ["Gift Aid receivable", "Q4 claim £18,200 — confirmed received from HMRC 22/04/2026", "None", "KO", "MP"],
    ["Prepayments", "Insurance prepayment £4,800 — policy document verified", "None", "KO", "MP"]
  ];
  testD2.forEach((row, i) => { c("test_d2", i, 2, row[0]); c("test_d2", i, 3, row[1]); c("test_d2", i, 4, row[2]); c("test_d2", i, 5, row[3]); c("test_d2", i, 6, row[4]); });

  // ═══ D6 — Cash Testing ═══
  const testD6 = [
    ["All 3 accounts", "Bank confirmations received — agree to accounts", "None", "KO", "MP"],
    ["Year-end reconciliation", "2 outstanding items — both cleared by 10/04/2026", "None", "KO", "MP"],
    ["Petty cash", "£150 float counted and verified", "None", "KO", "MP"],
    ["Restricted fund cash", "Separate restricted fund bank account balance confirmed", "None", "KO", "MP"]
  ];
  testD6.forEach((row, i) => { c("test_d6", i, 2, row[0]); c("test_d6", i, 3, row[1]); c("test_d6", i, 4, row[2]); c("test_d6", i, 5, row[3]); c("test_d6", i, 6, row[4]); });

  // ═══ D9 — Charitable Activities Testing ═══
  const testD9 = [
    ["Youth programme costs", "£485k expenditure tested to invoices and payroll — all per budget", "None", "KO", "MP"],
    ["Community outreach costs", "£320k tested — project worker salaries and venue hire", "None", "KO", "MP"],
    ["Support cost allocation", "Allocation basis tested — staff time basis reasonable and consistent", "None", "KO", "MP"],
    ["Governance costs", "Audit fee £12k, legal £3.5k, trustee expenses £1.8k — all verified", "None", "KO", "MP"]
  ];
  testD9.forEach((row, i) => { c("test_d9", i, 2, row[0]); c("test_d9", i, 3, row[1]); c("test_d9", i, 4, row[2]); c("test_d9", i, 5, row[3]); c("test_d9", i, 6, row[4]); });

  // ═══ D11 — Creditors Testing ═══
  const testD11 = [
    ["5 supplier statements", "All reconcile within £200", "None", "KO", "MP"],
    ["Accruals", "Holiday pay £8.2k, audit fee £12k — all correctly accrued", "None", "KO", "MP"],
    ["Deferred income", "£120k HLF grant deferred — conditions confirmed with funder", "None", "KO", "MP"],
    ["PAYE/NIC", "Month 12 liability £14.5k agrees to RTI submission", "None", "KO", "MP"]
  ];
  testD11.forEach((row, i) => { c("test_d11", i, 2, row[0]); c("test_d11", i, 3, row[1]); c("test_d11", i, 4, row[2]); c("test_d11", i, 5, row[3]); c("test_d11", i, 6, row[4]); });

  // ═══ D13 — Tax Testing ═══
  const testD13 = [
    ["Charitable status", "HMRC recognition confirmed — trading income within s.505 limits", "None", "KO", "MP"],
    ["Gift Aid", "All claims verified — donor declarations on file", "None", "KO", "MP"],
    ["VAT", "Partial exemption calculation tested — recovery rate 38%", "None", "KO", "MP"],
    ["PAYE/NIC", "Full year reconciliation to payroll — agrees within £120", "None", "KO", "MP"]
  ];
  testD13.forEach((row, i) => { c("test_d13", i, 2, row[0]); c("test_d13", i, 3, row[1]); c("test_d13", i, 4, row[2]); c("test_d13", i, 5, row[3]); c("test_d13", i, 6, row[4]); });

  // ═══ D15 — Related Parties Testing ═══
  const testD15 = [
    ["Charity Commission + declarations", "8 trustees identified; annual declarations of interest obtained", "None", "KO", "MP"],
    ["Trustee expenses", "£1,800 travel expenses — all with receipts and board approval", "None", "KO", "MP"],
    ["Connected organisations", "Chair is also trustee of partner charity — disclosed; no financial transactions", "None", "KO", "MP"],
    ["Benefits in kind", "No trustee remuneration or benefits — confirmed per governing document", "None", "KO", "MP"]
  ];
  testD15.forEach((row, i) => { c("test_d15", i, 2, row[0]); c("test_d15", i, 3, row[1]); c("test_d15", i, 4, row[2]); c("test_d15", i, 5, row[3]); c("test_d15", i, 6, row[4]); });

  // ═══ FSLI Leads ═══
  const fsliLeads = {
    d1: { data: [["920000", "1040000", "120000", "13.0%", "✓"], ["280000", "320000", "40000", "14.3%", "✓"], ["180000", "160000", "-20000", "-11.1%", "✓"], ["68000", "100000", "32000", "47.1%", "✓"]] },
    d2: { data: [["42000", "58000", "16000", "38.1%", "✓"], ["18000", "18200", "200", "1.1%", "✓"], ["4200", "4800", "600", "14.3%", "✓"]] },
    d6: { data: [["185000", "210000", "25000", "13.5%", "✓"], ["45000", "52000", "7000", "15.6%", "✓"], ["150", "150", "0", "0%", "✓"]] },
    d9: { data: [["420000", "485000", "65000", "15.5%", "✓"], ["280000", "320000", "40000", "14.3%", "✓"], ["85000", "92000", "7000", "8.2%", "✓"]] },
    d11: { data: [["65000", "78000", "13000", "20.0%", "✓"], ["45000", "52000", "7000", "15.6%", "✓"], ["80000", "120000", "40000", "50.0%", "✓"], ["12000", "14500", "2500", "20.8%", "✓"]] },
    d13: { data: [["0", "0", "0", "0%", "✓"], ["48000", "52000", "4000", "8.3%", "✓"], ["8200", "9100", "900", "11.0%", "✓"]] },
    d15: { data: [["1500", "1800", "300", "20.0%", "✓"], ["0", "0", "0", "0%", "✓"]] }
  };
  Object.entries(fsliLeads).forEach(([wpId, spec]) => {
    spec.data.forEach((row, ri) => {
      c("fsli_" + wpId, ri, 1, row[0]); c("fsli_" + wpId, ri, 2, row[1]);
      c("fsli_" + wpId, ri, 3, row[2]); c("fsli_" + wpId, ri, 4, row[3]);
      c("fsli_" + wpId, ri, 6, row[4]);
    });
  });

  // ═══ E1 — Completion Checklist ═══
  const e1Data = [
    ["✓", "2026-06-10", "All WPs reviewed and signed off"],
    ["✓", "2026-06-10", "No subsequent events requiring adjustment"],
    ["✓", "2026-06-08", "Analytical review satisfactory — no unexplained fluctuations"],
    ["✓", "2026-06-05", "Going concern — no material uncertainty; free reserves adequate"],
    ["✓", "2026-06-10", "Written representations obtained from Chair and Treasurer"],
    ["✓", "2026-06-08", "ISA 450 schedule: no adjusted or unadjusted differences"],
    ["✓", "2026-06-10", "Charities SORP disclosure checklist complete"],
    ["✓", "2026-06-10", "Independence confirmed — no threats identified"],
    ["✓", "2026-06-10", "ISQM 1 engagement review completed"],
    ["✓", "2026-06-10", "Trustees' annual report consistent with financial statements"],
    ["✓", "2026-06-10", "Charity Commission filing requirements reviewed"],
    ["✓", "2026-06-10", "Fund accounting disclosures — unrestricted, restricted, endowment — complete"],
    ["✓", "2026-06-10", "ISA 240 fraud procedures completed — no fraud identified"],
    ["✓", "2026-06-10", "ISA 250 — Charities Act 2011 and fundraising regulations compliance confirmed"],
    ["✓", "2026-06-10", "File assembly: target 60 days from report date"],
    ["✓", "2026-06-10", "Audit report: unmodified opinion recommended"],
    ["✓", "2026-06-10", "Management letter: 1 point raised"],
    ["✓", "2026-06-10", "Accounts approved by trustees and filed with Charity Commission"]
  ];
  e1Data.forEach((row, i) => { c("e1", i, 4, row[0]); c("e1", i, 5, row[1]); c("e1", i, 6, row[2]); });

  // ═══ SIGN-OFFS ═══
  const signOffs = {};
  const signableWPs = [
    "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9",
    "b1", "b2", "b3",
    "c1", "c2", "c3",
    "d1", "d2", "d6", "d9", "d11", "d13", "d15",
    "e1", "e2", "e3", "e4", "e5", "e6",
    "f1", "f2"
  ];
  signableWPs.forEach(wp => {
    signOffs[wp] = { preparedBy: "2026-06-05", reviewedBy: "2026-06-10" };
  });

  // ═══ WP NOTES ═══
  const wpNotes = {
    a1: "Engagement letter signed by Chair of Trustees (Dr. A. Rahman) on 20/02/2026. Statutory audit under Charities Act 2011 s.144 — income exceeds £1m threshold. Fee: £12,000 + VAT.",
    a2: "Client acceptance: Charity Commission register checked — no regulatory concerns. Continuing engagement (4th year). Annual declarations of interest from all trustees reviewed. AML checks current.",
    a4: "Materiality based on 1.5% of total income (£1.62m). Total income selected as primary benchmark per Charities SORP guidance — most relevant measure for donor and funder accountability. PM at 75%, trivial at 5%.",
    a5: "Riverside Community Trust operates youth services and community outreach programmes across South London. 42 FTE staff. Funded by grants (65%), donations (20%), earned income (15%). Key funders: Heritage Lottery Fund, Big Lottery Fund, Southwark Council.",
    a6: "ISA 240 — Presumed risks: (1) Grant income recognition — tested against performance conditions. (2) Management override — journal testing completed. Donation income completeness considered. No fraud indicators identified.",
    b1: "Risk assessment: 3 elevated risks (grant income, restricted funds, donation completeness), 7 normal risks. Charity-specific risk profile reflecting fund accounting and regulatory requirements.",
    d1: "Income: grant income tested for 5 grants > PM against performance conditions. Donation income completeness tested via CRM reconciliation. Gift Aid claims verified against HMRC receipts. Fundraising event income reconciled.",
    d2: "Restricted funds: fund-by-fund analysis completed. All expenditure traced to eligible costs per grant conditions. Deferred income confirmed with funders. Gift Aid receivable confirmed post year-end.",
    d9: "Charitable activities: youth programme and community outreach costs tested to invoices and payroll. Support cost allocation basis (staff time) tested and found reasonable. Governance costs verified.",
    d11: "Creditors: 5 supplier statements reconciled. Accruals complete (holiday pay, audit fee). HLF deferred income of £120k confirmed with funder. PAYE/NIC month 12 agrees to RTI.",
    d15: "Related parties: 8 trustees identified. Annual declarations of interest reviewed. Trustee expenses of £1,800 verified — all travel with receipts. No trustee remuneration per governing document. Connected charity relationship disclosed.",
    e1: "All completion procedures performed. Trustees' annual report reviewed for consistency with financial statements. File ready for assembly.",
    e6: "Audit completion: unmodified opinion recommended. No adjusted or unadjusted differences. Charities SORP disclosures complete. Management letter: 1 point (restricted fund monitoring — recommend quarterly trustee reports on grant conditions)."
  };

  const customItems = {
    risks: [
      { id: "CR01", t: "Restricted fund compliance - grant conditions not tracked", lv: "ELEVATED", isa: "Charities SORP" },
      { id: "CR02", t: "Trustee benefit-in-kind under-reporting", lv: "NORMAL", isa: "ISA 550" }
    ],
    tests: {}
  };

  return { cfg, cellData, signOffs, wpNotes, customItems };
}
