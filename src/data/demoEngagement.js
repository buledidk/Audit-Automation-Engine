/**
 * Demo Engagement Data — pre-populated Construction audit at 62% completion
 * Used for sales demos and guided tours.
 */
export const DEMO_ENGAGEMENT = {
  cfg: {
    entityName: "BuildRight Construction Ltd",
    companyNumber: "08765432",
    industry: "construction",
    sector: "Commercial",
    framework: "frs102",
    entitySize: "medium",
    engagementType: "statutory",
    fye: "2026-03-31",
    partner: "James Parker",
    manager: "Sarah Khan",
    firmName: "Indus Nexus Audit LLP",
    materiality: "125000",
    perfMateriality: "93750",
    trivial: "6250",
    configured: true,
  },
  signOffs: {
    a1: { preparedBy: { name: "Sarah Khan", date: "2026-01-15" }, reviewedBy: { name: "James Parker", date: "2026-01-18" }, approvedBy: { name: "James Parker", date: "2026-01-18" } },
    a2: { preparedBy: { name: "Sarah Khan", date: "2026-01-15" }, reviewedBy: { name: "James Parker", date: "2026-01-18" }, approvedBy: { name: "James Parker", date: "2026-01-18" } },
    a3: { preparedBy: { name: "Sarah Khan", date: "2026-01-20" }, reviewedBy: { name: "James Parker", date: "2026-01-22" } },
    a4: { preparedBy: { name: "Robert Miles", date: "2026-01-22" }, reviewedBy: { name: "Sarah Khan", date: "2026-01-24" }, approvedBy: { name: "James Parker", date: "2026-01-25" } },
    a5: { preparedBy: { name: "Robert Miles", date: "2026-01-25" }, reviewedBy: { name: "Sarah Khan", date: "2026-01-28" } },
    a6: { preparedBy: { name: "Sarah Khan", date: "2026-02-01" } },
    b1: { preparedBy: { name: "Robert Miles", date: "2026-02-05" }, reviewedBy: { name: "Sarah Khan", date: "2026-02-08" } },
    b2: { preparedBy: { name: "Robert Miles", date: "2026-02-08" } },
    b3: { preparedBy: { name: "Sarah Khan", date: "2026-02-10" } },
    d1: { preparedBy: { name: "Alice Wong", date: "2026-03-01" }, reviewedBy: { name: "Sarah Khan", date: "2026-03-05" } },
    d2: { preparedBy: { name: "Alice Wong", date: "2026-03-03" } },
    d3: { preparedBy: { name: "David Chen", date: "2026-03-08" } },
    d4: { preparedBy: { name: "Alice Wong", date: "2026-03-10" }, reviewedBy: { name: "Robert Miles", date: "2026-03-12" } },
    d6: { preparedBy: { name: "David Chen", date: "2026-03-15" }, reviewedBy: { name: "Sarah Khan", date: "2026-03-18" }, approvedBy: { name: "James Parker", date: "2026-03-20" } },
    d7: { preparedBy: { name: "Robert Miles", date: "2026-03-20" } },
    d13: { preparedBy: { name: "Alice Wong", date: "2026-03-22" } },
  },
  customItems: {
    risks: [
      { id: "CR01", t: "Revenue recognition on long-term contracts — stage of completion method applied to 3 material contracts (>£5m each)", lv: "SIGNIFICANT", isa: "ISA 240.26", rs: "Extended substantive testing performed; stage of completion recalculated for all 3 contracts" },
      { id: "CR02", t: "WIP valuation — £2.4m of WIP at year end includes management estimates for costs to complete", lv: "SIGNIFICANT", isa: "ISA 540", rs: "Independent cost-to-complete analysis performed; reviewed project manager estimates" },
      { id: "CR03", t: "Retentions receivable — £890k retentions, of which £320k >12 months old", lv: "ELEVATED", isa: "ISA 540", rs: "Confirmed material balances; reviewed ageing; tested post year-end releases" },
    ],
    tests: {},
  },
  reviewNotes: {
    d1: [
      { id: "rn1", text: "Revenue cut-off: 2 invoices dated 1 April included in March revenue. Need to verify delivery dates.", status: "raised", raisedBy: { name: "Sarah Khan", date: "2026-03-06" } },
    ],
    d3: [
      { id: "rn2", text: "WIP: Project 847 shows negative margin — investigate with site team", status: "responded", raisedBy: { name: "Sarah Khan", date: "2026-03-10" }, respondedBy: { name: "David Chen", date: "2026-03-11" }, response: "Spoke with Project Manager — confirmed cost overrun due to material price increase. Additional £45k provision recommended." },
    ],
  },
  changeLog: [
    { field: "signOff", wpId: "d6", action: "Partner approved Cash & Bank", timestamp: "2026-03-20T14:30:00Z", user: "James Parker" },
    { field: "signOff", wpId: "d4", action: "Manager reviewed Payables", timestamp: "2026-03-12T11:00:00Z", user: "Robert Miles" },
    { field: "cellData", wpId: "d1", action: "Revenue testing — updated sample results", timestamp: "2026-03-05T16:20:00Z", user: "Alice Wong" },
    { field: "signOff", wpId: "a4", action: "Partner approved Materiality", timestamp: "2026-01-25T10:15:00Z", user: "James Parker" },
    { field: "customItems", wpId: "b1", action: "Added CR01 — Revenue recognition significant risk", timestamp: "2026-02-06T09:00:00Z", user: "Sarah Khan" },
    { field: "reviewNotes", wpId: "d1", action: "Review note raised — revenue cut-off query", timestamp: "2026-03-06T14:45:00Z", user: "Sarah Khan" },
    { field: "reviewNotes", wpId: "d3", action: "Review note responded — WIP negative margin", timestamp: "2026-03-11T16:30:00Z", user: "David Chen" },
    { field: "signOff", wpId: "d1", action: "Manager reviewed Revenue testing", timestamp: "2026-03-05T17:00:00Z", user: "Sarah Khan" },
  ],
  uploads: {
    d6: [
      { id: "u1", name: "Barclays_Bank_Confirmation_2026.pdf", uploadedAt: "2026-03-16T10:00:00Z", size: "89KB" },
      { id: "u2", name: "HSBC_Bank_Statement_Mar2026.pdf", uploadedAt: "2026-03-16T10:05:00Z", size: "1.2MB" },
    ],
    d1: [
      { id: "u3", name: "Sales_Invoice_Sample_20items.xlsx", uploadedAt: "2026-03-02T14:00:00Z", size: "342KB" },
      { id: "u4", name: "Revenue_Analytical_Review.xlsx", uploadedAt: "2026-03-04T09:30:00Z", size: "156KB" },
    ],
    d3: [
      { id: "u5", name: "Inventory_Count_Sheets_Mar2026.pdf", uploadedAt: "2026-03-09T16:00:00Z", size: "4.8MB" },
    ],
    a4: [
      { id: "u6", name: "Materiality_Calculation_WP.xlsx", uploadedAt: "2026-01-23T11:00:00Z", size: "45KB" },
    ],
  },
  wpNotes: {
    d1: "Revenue testing focused on 3 material contracts (>£5m). Stage of completion recalculated. 2 cut-off issues identified — see review note rn1.",
    d6: "Bank confirmations obtained for all 4 accounts. All reconciled to TB without exception. Cash balance £2.1m agreed.",
    a4: "Overall materiality set at £125,000 (1.25% of revenue £10m). Performance materiality £93,750 (75% of OM). Trivial threshold £6,250 (5% of OM). Benchmark: Revenue selected as most appropriate — PBT volatile due to contract timing.",
  },
  signOffLog: [
    { wpId: "a1", role: "approvedBy", signOff: { name: "James Parker", date: "2026-01-18" }, action: "sign", timestamp: "2026-01-18T14:00:00Z" },
    { wpId: "a4", role: "approvedBy", signOff: { name: "James Parker", date: "2026-01-25" }, action: "sign", timestamp: "2026-01-25T10:15:00Z" },
    { wpId: "d6", role: "approvedBy", signOff: { name: "James Parker", date: "2026-03-20" }, action: "sign", timestamp: "2026-03-20T14:30:00Z" },
  ],
  cellData: {},
  tbData: [],
  tbMappings: {},
  archived: false,
  reviewStatus: "In Progress",
  integrations: {},
  documentLinks: {},
  procedureLinks: {},
};
