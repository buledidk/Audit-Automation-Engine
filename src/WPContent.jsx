import { memo } from "react";

/* ───────────────────────────────────────────────────────────────
   A8 — ISA 520 Planning Analytical Review
   ─────────────────────────────────────────────────────────────── */
export const AnalyticalReviewWP = memo(function AnalyticalReviewWP({
  _BoundET, _ST, _cfg, ind, C, inp, wpNotes, setWpNotes
}) {
  const ratios = [
    ["Gross Margin %", "Gross Profit / Revenue × 100"],
    ["Operating Margin %", "Operating Profit / Revenue × 100"],
    ["Current Ratio", "Current Assets / Current Liabilities"],
    ["Quick Ratio", "(Current Assets − Inventory) / Current Liabilities"],
    ["Debtor Days", "Trade Receivables / Revenue × 365"],
    ["Creditor Days", "Trade Payables / Cost of Sales × 365"],
    ["Stock Turn Days", "Inventory / Cost of Sales × 365"],
    ["Gearing Ratio", "Total Debt / (Total Debt + Equity) × 100"],
    ["Interest Cover", "Operating Profit / Finance Costs"],
    ["Return on Equity", "Profit After Tax / Equity × 100"],
    ["Revenue Growth %", "(CY Revenue − PY Revenue) / PY Revenue × 100"],
    ["Staff Costs / Revenue", "Staff Costs / Revenue × 100"],
  ];
  const expectAccounts = [
    "Revenue", "Cost of Sales", "Staff Costs", "Other Operating Expenses",
    "Depreciation", "Finance Costs", "Trade Receivables", "Trade Payables", "Cash and Bank",
  ];
  return (
    <div>
      <ST t="A8 — Planning Analytical Review (ISA 520)" color={C.pln} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>ISA 520 — Analytical Procedures:</strong> The auditor shall design and perform analytical procedures near the end of the audit that assist when forming an overall conclusion as to whether the financial statements are consistent with the auditor's understanding of the entity. Planning-stage analytics help identify areas of potential misstatement and inform the risk assessment.
      </div>

      <ST t="Ratio Analysis" color={C.blu} />
      <BoundET id="a8_ratios" headers={["Ratio", "Formula", "CY", "PY", "Movement", "Benchmark", "Commentary", "Investigate?"]}
        rows={ratios.map(([r, f]) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{r}</span>,
          <span style={{ color: C.dim, fontSize: 11 }}>{f}</span>,
          "", "", "", "", "", "",
        ])} editable={[2, 3, 4, 6, 7]} />

      <ST t="Industry KPI Analysis" color={C.tl} />
      <BoundET id="a8_kpis" headers={["KPI", "CY", "PY", "Industry Avg", "Variance", "Significant?", "Comment"]}
        rows={(ind.k || []).map((k) => [
          <span style={{ color: C.tx }}>{k}</span>, "", "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5, 6]} />

      <ST t="Revenue by Quarter" color={C.blu} />
      <BoundET id="a8_rev_q" headers={["Quarter", "PY (£)", "CY (£)", "Movement (£)", "Movement %", "Commentary"]}
        rows={["Q1", "Q2", "Q3", "Q4"].map((q) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{q}</span>, "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5]} />

      <ST t="Expectation vs Actual" color={C.org} />
      <BoundET id="a8_expect" headers={["Account", "Expected (£)", "Actual (£)", "Difference (£)", "Difference %", "Exceeds Threshold?", "Explanation"]}
        rows={expectAccounts.map((a) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{a}</span>, "", "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5, 6]} />

      <ST t="Conclusion" color={C.pln} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on the results of planning-stage analytical procedures and areas requiring further investigation..."
        value={wpNotes["a8_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a8_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   A3 — ISA 300 Audit Strategy
   ─────────────────────────────────────────────────────────────── */
export const AuditStrategyEnhanced = memo(function AuditStrategyEnhanced({
  _BoundET, _ST, cfg, ind, fw, C, inp, wpNotes, setWpNotes
}) {
  const teamRows = [
    ["Engagement Partner", "", "", "", "", ""],
    ["Engagement Quality Reviewer", "", "", "", "", ""],
    ["Audit Manager", "", "", "", "", ""],
    ["Audit Senior", "", "", "", "", ""],
    ["Audit Staff 1", "", "", "", "", ""],
    ["Audit Staff 2", "", "", "", "", ""],
    ["Tax Specialist", "", "", "", "", ""],
    ["IT Specialist", "", "", "", "", ""],
  ];
  const indepDecl = [
    "Financial interests in the entity or its affiliates",
    "Employment relationship with the entity (current or recent)",
    "Business relationships with the entity",
    "Family or personal connections with entity personnel",
    "Gifts or hospitality from the entity",
    "Non-audit services provided to the entity",
    "Fee dependency exceeds 15% of firm turnover",
    "Long association / rotation requirements per FRC Ethical Standard",
  ];
  const phases = [
    ["Planning", "", "", "", ""],
    ["Interim fieldwork", "", "", "", ""],
    ["Year-end procedures", "", "", "", ""],
    ["Final fieldwork", "", "", "", ""],
    ["Completion", "", "", "", ""],
    ["Reporting", "", "", "", ""],
  ];
  return (
    <div>
      <ST t="A3 — Audit Strategy (ISA 300)" color={C.pln} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>Entity:</strong> {cfg.entityName} &nbsp;|&nbsp; <strong>Industry:</strong> {ind.l} &nbsp;|&nbsp; <strong>Sector:</strong> {cfg.sector} &nbsp;|&nbsp; <strong>Framework:</strong> {fw.l}<br />
        <strong>FYE:</strong> {cfg.fye} &nbsp;|&nbsp; <strong>Materiality:</strong> £{cfg.materiality?.toLocaleString()} &nbsp;|&nbsp; <strong>Perf. Materiality:</strong> £{cfg.perfMateriality?.toLocaleString()} &nbsp;|&nbsp; <strong>Trivial:</strong> £{cfg.trivial?.toLocaleString()}
      </div>

      <ST t="Team Allocation" color={C.blu} />
      <BoundET id="a3_team" headers={["Role", "Name", "Grade", "Hours Budget", "Independence Confirmed", "Declarations Signed"]}
        rows={teamRows.map(([role]) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{role}</span>, "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5]} />

      <ST t="Independence Declarations — FRC Ethical Standard" color={C.rsk} />
      <BoundET id="a3_indep" headers={["Declaration", "Applicable?", "Confirmed Clear?", "Comment"]}
        rows={indepDecl.map((d) => [
          <span style={{ color: C.tx }}>{d}</span>, "", "", "",
        ])} editable={[1, 2, 3]} />

      <ST t="FSLI Approach" color={C.tst} />
      <BoundET id="a3_fsli" headers={["FSLI Area", "Approach", "Key Procedures", "Assertions", "ISA Reference", "WP Ref"]}
        rows={(ind.p || []).map((p, i) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{typeof p === "string" ? p : p.area || `FSLI ${i + 1}`}</span>,
          "", typeof p === "string" ? "" : p.procedures || "", "", "", "",
        ])} editable={[1]} />

      <ST t="Audit Timetable" color={C.pln} />
      <BoundET id="a3_timetable" headers={["Phase", "Start Date", "End Date", "Responsible", "Status"]}
        rows={phases.map(([ph]) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{ph}</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4]} />

      <ST t="Use of Experts (ISA 620)" color={C.tl} />
      <BoundET id="a3_experts" headers={["Area", "Expert Name / Firm", "Nature of Work", "ISA 620 Compliance", "Reliance"]}
        rows={[1, 2, 3].map((_n) => [
          "", "", "", "", "",
        ])} editable={[0, 1, 2, 3, 4]} />

      <ST t="Conclusion" color={C.pln} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on overall audit strategy, planned approach and resource allocation..."
        value={wpNotes["a3_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a3_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   A5 — ISA 315 Entity Understanding
   ─────────────────────────────────────────────────────────────── */
export const EntityUnderstandingEnhanced = memo(function EntityUnderstandingEnhanced({
  _BoundET, _ST, cfg, ind, fw, C, inp, wpNotes, setWpNotes
}) {
  const policies = [
    ["Revenue recognition", "", "", "", ""],
    ["Depreciation policy", "", "", "", ""],
    ["Inventory valuation", "", "", "", ""],
    ["Financial instruments", "", "", "", ""],
    ["Leases", "", "", "", ""],
    ["Provisions", "", "", "", ""],
    ["Foreign currency", "", "", "", ""],
    ["Government grants", "", "", "", ""],
  ];
  return (
    <div>
      <ST t="A5 — Understanding the Entity (ISA 315)" color={C.pln} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>Entity:</strong> {cfg.entityName} &nbsp;|&nbsp; <strong>Industry:</strong> {ind.l} &nbsp;|&nbsp; <strong>Sector:</strong> {cfg.sector} &nbsp;|&nbsp; <strong>Framework:</strong> {fw.l}
      </div>

      <ST t="Key Accounting Policies" color={C.blu} />
      <BoundET id="a5_policies" headers={["Policy Area", "Current Policy", "Framework Reference", "Changed in Year?", "Appropriateness Assessment"]}
        rows={policies.map(([area]) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{area}</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4]} />

      <ST t="Changes Since Prior Year" color={C.org} />
      <textarea style={{ ...inp, width: "100%", minHeight: 70 }} placeholder="Document significant changes since the prior year (ownership, management, operations, systems, legal, regulatory)..."
        value={wpNotes["a5_changes"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a5_changes: e.target.value }))} />

      <ST t="Industry KPI Analysis" color={C.tl} />
      <BoundET id="a5_kpis" headers={["KPI", "CY", "PY", "Movement %", "Commentary"]}
        rows={(ind.k || []).map((k) => [
          <span style={{ color: C.tx }}>{k}</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4]} />

      <ST t="Key Controls Assessment" color={C.tst} />
      <BoundET id="a5_controls" headers={["Control", "Design Effective", "Operating Effective", "Reliance?", "Evidence"]}
        rows={(ind.ct || []).map((c) => [
          <span style={{ color: C.tx }}>{c}</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4]} />

      <ST t="Going Concern Indicators" color={C.rsk} />
      <BoundET id="a5_gc" headers={["Indicator", "Assessment", "Risk Level", "Evidence"]}
        rows={(ind.gc || []).map((g) => [
          <span style={{ color: C.tx }}>{g}</span>, "", "", "",
        ])} editable={[1, 2, 3]} />

      <ST t="Regulatory Environment" color={C.pur} />
      <BoundET id="a5_regs" headers={["Law / Regulation", "Compliance Confirmed", "Evidence"]}
        rows={(ind.lw || []).map((l) => [
          <span style={{ color: C.tx }}>{l}</span>, "", "",
        ])} editable={[1, 2]} />

      <ST t="Conclusion" color={C.pln} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on understanding of the entity, its environment, applicable framework, and internal controls..."
        value={wpNotes["a5_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a5_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   A9 — ISA 250A + ISA 250B Laws & Regulations / AML
   ─────────────────────────────────────────────────────────────── */
export const LawsRegsEnhanced = memo(function LawsRegsEnhanced({
  _BoundET, _ST, _cfg, ind, C, inp, wpNotes, setWpNotes
}) {
  const directLaws = [
    ["Companies Act 2006", "Direct"],
    ["Health & Safety at Work Act 1974", "Direct"],
    ["Employment Rights Act 1996", "Direct"],
    ["Equality Act 2010", "Direct"],
    ["GDPR / Data Protection Act 2018", "Direct"],
    ["Bribery Act 2010", "Direct"],
  ];
  const cddItems = [
    "Beneficial owner identified",
    "ID verified via reliable independent source",
    "Source of funds understood",
    "PEP check completed",
    "Sanctions check completed",
    "Adverse media check completed",
  ];
  const saiItems = [
    "Unusual cash transactions",
    "Complex structures with no clear purpose",
    "Reluctance to provide information",
    "Transactions inconsistent with business profile",
    "Last-minute changes to payment instructions",
    "Use of shell companies",
    "Nominee arrangements without clear reason",
    "Transactions at unusual prices",
    "Connections to high-risk jurisdictions",
    "Unexplained wealth or lifestyle",
  ];
  return (
    <div>
      <ST t="A9 — Laws & Regulations (ISA 250A / 250B)" color={C.pln} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>ISA 250A:</strong> The auditor shall obtain sufficient appropriate audit evidence regarding compliance with the provisions of those laws and regulations generally recognised to have a direct effect on the determination of material amounts and disclosures in the financial statements (ISA 250.14). For other laws and regulations, the auditor shall perform specified audit procedures to help identify instances of non-compliance that may have a material effect on the financial statements.
      </div>

      <ST t="Laws with Direct Effect on Financial Statements" color={C.rsk} />
      <BoundET id="a9_direct" headers={["Law / Regulation", "Category", "Applicable Y/N", "Compliance Confirmed", "Source of Evidence", "Comments"]}
        rows={directLaws.map(([law, cat]) => [
          <span style={{ color: C.tx, fontWeight: 500 }}>{law}</span>,
          <span style={{ color: C.dim }}>{cat}</span>, "", "", "", "",
        ])} editable={[2, 3, 4, 5]} />

      <ST t="Industry-Specific Laws & Regulations" color={C.org} />
      <BoundET id="a9_industry" headers={["Law / Regulation", "Category", "Applicable Y/N", "Compliance Confirmed", "Source of Evidence", "Comments"]}
        rows={(ind.lw || []).map((l) => [
          <span style={{ color: C.tx }}>{l}</span>,
          <span style={{ color: C.dim }}>Indirect</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5]} />

      <ST t="ISA 250B — Anti-Money Laundering / POCCA" color={C.rsk} />

      <ST t="Customer Due Diligence" color={C.tst} />
      <BoundET id="a9_cdd" headers={["CDD Requirement", "Completed Y/N", "Date", "Evidence", "Comments"]}
        rows={cddItems.map((c) => [
          <span style={{ color: C.tx }}>{c}</span>, "", "", "", "",
        ])} editable={[1, 2, 3, 4]} />

      <ST t="Suspicious Activity Indicators" color={C.red} />
      <BoundET id="a9_sai" headers={["Indicator", "Present Y/N", "Risk Assessment", "Action Taken"]}
        rows={saiItems.map((s) => [
          <span style={{ color: C.tx }}>{s}</span>, "", "", "",
        ])} editable={[1, 2, 3]} />

      <ST t="SAR Reporting Considerations" color={C.rsk} />
      <textarea style={{ ...inp, width: "100%", minHeight: 70 }} placeholder="Document any Suspicious Activity Report (SAR) considerations, including whether a report to the NCA is required..."
        value={wpNotes["a9_sar"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a9_sar: e.target.value }))} />

      <ST t="Conclusion" color={C.pln} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on compliance with laws and regulations and AML/POCCA requirements..."
        value={wpNotes["a9_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, a9_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   E3 — ISA 560 Subsequent Events
   ─────────────────────────────────────────────────────────────── */
export const SubsequentEventsEnhanced = memo(function SubsequentEventsEnhanced({
  _BoundET, _ST, cfg, C, inp, wpNotes, setWpNotes
}) {
  const procedures = [
    "Review post-year-end bank statements",
    "Review post-year-end management accounts",
    "Review board minutes after year end",
    "Enquire of management about subsequent events",
    "Review latest interim financial information",
    "Review legal correspondence post-year-end",
    "Confirm insurance claims status",
    "Review major customer/supplier changes",
  ];
  return (
    <div>
      <ST t="E3 — Subsequent Events (ISA 560)" color={C.cmp} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>ISA 560:</strong> The auditor shall perform audit procedures to obtain sufficient appropriate audit evidence that all events occurring between the date of the financial statements and the date of the auditor's report that require adjustment of, or disclosure in, the financial statements have been identified.<br /><br />
        <strong>Adjusting events (Type 1):</strong> provide evidence of conditions that existed at the balance sheet date — adjust the financial statements.<br />
        <strong>Non-adjusting events (Type 2):</strong> indicate conditions that arose after the balance sheet date — disclose if material but do not adjust.
      </div>

      <ST t="Procedures Performed" color={C.tst} />
      <BoundET id="e3_procs" headers={["#", "Procedure", "Done Y/N", "Date Performed", "Findings"]}
        rows={procedures.map((p, i) => [
          i + 1, <span style={{ color: C.tx }}>{p}</span>, "", "", "",
        ])} editable={[2, 3, 4]} />

      <ST t="Events Identified" color={C.rsk} />
      <BoundET id="e3_events" headers={["Date", "Event Description", "Type (Adjusting / Non-adjusting)", "Impact (£)", "Disclosure Required", "FS Adjustment Required", "Action Taken"]}
        rows={[1, 2, 3, 4, 5].map(() => ["", "", "", "", "", "", ""])} editable={[0, 1, 2, 3, 4, 5, 6]} />

      <ST t="Procedures Performed Through" color={C.blu} />
      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.tx, fontSize: 12, marginRight: 8 }}>Date procedures performed through:</label>
        <input style={{ ...inp, width: 160 }} type="text" placeholder="DD/MM/YYYY"
          value={wpNotes["e3_date_through"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e3_date_through: e.target.value }))} />
      </div>

      <ST t="Written Confirmation from Management" color={C.tl} />
      <textarea style={{ ...inp, width: "100%", minHeight: 60 }} placeholder="Document written representations obtained from management regarding subsequent events (ISA 560.9)..."
        value={wpNotes["e3_written_conf"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e3_written_conf: e.target.value }))} />

      <ST t="Conclusion" color={C.cmp} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }}
        placeholder={"Based on the procedures performed through [date], we have obtained sufficient appropriate audit evidence that all events occurring between " + cfg.fye + " and the date of our report requiring adjustment or disclosure have been identified and appropriately dealt with in the financial statements."}
        value={wpNotes["e3_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e3_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   E5 — ISA 450 Adjustments Summary
   ─────────────────────────────────────────────────────────────── */
export const AdjustmentsSummaryEnhanced = memo(function AdjustmentsSummaryEnhanced({
  _BoundET, _ST, cfg, C, inp, wpNotes, setWpNotes
}) {
  const unadjRows = Array.from({ length: 10 }, (_, i) => [
    i + 1, "", "", "", "", "", "",
  ]);
  const adjRows = Array.from({ length: 5 }, (_, i) => [
    i + 1, "", "", "", "", "", "",
  ]);
  return (
    <div>
      <ST t="E5 — Summary of Audit Differences (ISA 450)" color={C.cmp} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        <strong>ISA 450:</strong> The auditor shall accumulate misstatements identified during the audit, other than those that are clearly trivial (below £{cfg.trivial?.toLocaleString() || "—"}). The auditor shall communicate on a timely basis all misstatements accumulated during the audit with the appropriate level of management and request management to correct those misstatements.
      </div>

      <ST t="Unadjusted Differences" color={C.rsk} />
      <BoundET id="e5_unadj" headers={["#", "Description", "WP Ref", "Income Effect Dr/(Cr)", "BS Effect Dr/(Cr)", "Tax Effect", "Management's Reason for Not Adjusting"]}
        rows={unadjRows} editable={[1, 2, 3, 4, 5, 6]} />
      <div style={{ color: C.dim, fontSize: 11, fontStyle: "italic", marginBottom: 14 }}>
        Sum all income and BS effects to determine total unadjusted misstatements. Compare against materiality and performance materiality thresholds.
      </div>

      <ST t="Materiality Comparison" color={C.org} />
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          ["Total Unadjusted", "£ [per schedule above]", C.red],
          ["Overall Materiality", `£${cfg.materiality?.toLocaleString() || "—"}`, C.blu],
          ["Performance Materiality", `£${cfg.perfMateriality?.toLocaleString() || "—"}`, C.org],
        ].map(([label, val, col]) => (
          <div key={label} style={{ flex: 1, minWidth: 180, background: C.card, border: `2px solid ${col}`, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ color: C.dim, fontSize: 11 }}>{label}</div>
            <div style={{ color: col, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `2px solid ${C.red}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.red, fontSize: 12, fontWeight: 600 }}>
        Warning: If total unadjusted differences exceed materiality, the auditor must either obtain an adjustment or modify the audit opinion (ISA 450.12).
      </div>

      <ST t="Adjusted Differences" color={C.grn} />
      <BoundET id="e5_adj" headers={["#", "Description", "WP Ref", "Income Effect Dr/(Cr)", "BS Effect Dr/(Cr)", "Tax Effect", "Management's Reason for Not Adjusting"]}
        rows={adjRows} editable={[1, 2, 3, 4, 5, 6]} />

      <ST t="Management Representation" color={C.tl} />
      <textarea style={{ ...inp, width: "100%", minHeight: 60 }} placeholder="Document management's reasons for not adjusting the above items..."
        value={wpNotes["e5_mgmt_reason"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e5_mgmt_reason: e.target.value }))} />

      <ST t="Auditor's Assessment" color={C.blu} />
      <textarea style={{ ...inp, width: "100%", minHeight: 60 }} placeholder="Assess whether uncorrected misstatements are material, individually or in aggregate, and evaluate the effect on the audit opinion..."
        value={wpNotes["e5_auditor_assessment"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e5_auditor_assessment: e.target.value }))} />

      <ST t="Conclusion" color={C.cmp} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on whether uncorrected misstatements are material individually or in aggregate and the impact on the audit opinion..."
        value={wpNotes["e5_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, e5_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   F1 — ISA 265 Management Letter
   ─────────────────────────────────────────────────────────────── */
export const ManagementLetterEnhanced = memo(function ManagementLetterEnhanced({
  _BoundET, _ST, cfg, C, inp, wpNotes, setWpNotes
}) {
  return (
    <div>
      <ST t="F1 — Management Letter (ISA 265)" color={C.rpt} />
      <div style={{ background: C.card, border: `1px solid ${C.brd}`, borderRadius: 8, padding: 14, marginBottom: 14, color: C.tx, fontSize: 12 }}>
        Dear Directors of <strong>{cfg.entityName}</strong>,<br /><br />
        Following our audit of the financial statements for the year ended <strong>{cfg.fye}</strong>, we write to bring to your attention certain matters that came to our notice during the course of our audit which we believe merit your consideration. These matters do not affect our audit opinion. This letter is provided on the basis set out in our engagement letter and should not be disclosed to third parties without our prior written consent.
      </div>

      <ST t="Findings" color={C.rsk} />
      <BoundET id="f1_findings" headers={["Ref", "Category", "Finding Description", "Risk Rating", "Affected Area", "ISA Reference", "Recommendation", "Management Response", "Responsible Person", "Target Date"]}
        rows={Array.from({ length: 8 }, (_, i) => [
          `F${i + 1}`, "", "", "", "", "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />

      <ST t="Prior Year Points Follow-Up" color={C.org} />
      <BoundET id="f1_py" headers={["Prior Year Ref", "Finding", "Original Recommendation", "Status", "Current Status", "Comment"]}
        rows={[1, 2, 3].map((n) => [
          `PY-${n}`, "", "", "", "", "",
        ])} editable={[1, 2, 3, 4, 5]} />

      <ST t="Risk Rating Legend" color={C.blu} />
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          ["High", C.red, "Immediate action required — significant risk to financial statements or operations"],
          ["Medium", C.org, "Address within reporting period — moderate risk requiring management attention"],
          ["Low", C.grn, "Best practice improvement — minor enhancement to processes or controls"],
        ].map(([level, col, desc]) => (
          <div key={level} style={{ flex: 1, minWidth: 200, border: `2px solid ${col}`, borderRadius: 8, padding: 10 }}>
            <span style={{ color: col, fontWeight: 700, fontSize: 13 }}>{level}</span>
            <div style={{ color: C.dim, fontSize: 11, marginTop: 4 }}>{desc}</div>
          </div>
        ))}
      </div>

      <ST t="Conclusion" color={C.rpt} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Summarise the key findings, overall assessment of the control environment, and any overarching recommendations..."
        value={wpNotes["f1_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, f1_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   C2 — Enhanced P&L Lead Schedule
   ─────────────────────────────────────────────────────────────── */
export const PLLeadEnhanced = memo(function PLLeadEnhanced({
  _BoundET, _ST, _cfg, C, inp, wpNotes, setWpNotes
}) {
  const lines = [
    { item: "Revenue", sub: false },
    { item: "Cost of Sales", sub: false },
    { item: "Gross Profit", sub: true },
    { item: "Distribution Costs", sub: false },
    { item: "Administrative Expenses", sub: false },
    { item: "Other Operating Income", sub: false },
    { item: "Operating Profit", sub: true },
    { item: "Finance Income", sub: false },
    { item: "Finance Costs", sub: false },
    { item: "Profit Before Tax", sub: true },
    { item: "Tax", sub: false },
    { item: "Profit After Tax", sub: true },
  ];
  return (
    <div>
      <ST t="C2 — Profit & Loss Lead Schedule" color={C.ld} />
      <BoundET id="c2_pl" headers={["Note Ref", "Line Item", "PY (£)", "CY (£)", "Movement (£)", "Movement %", "WP Ref", "Audit Adj Dr", "Audit Adj Cr", "Adjusted Balance", "Status"]}
        rows={lines.map((l, _i) => [
          "", <span style={{ color: C.tx, fontWeight: l.sub ? 700 : 500, fontStyle: l.sub ? "italic" : "normal" }}>{l.item}</span>,
          "", "", "", "", "", "", "", "", "",
        ])} editable={[0, 2, 3, 4, 7, 8, 9, 10]} />
      <div style={{ color: C.dim, fontSize: 11, fontStyle: "italic", marginBottom: 14 }}>
        Convention: Debit entries are positive; Credit entries are shown in brackets e.g. (1,000). Subtotal rows should auto-cast from line items above. All adjustments must cross-reference to E5 schedule.
      </div>

      <ST t="Conclusion" color={C.ld} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on the P&L lead schedule — confirm all line items have been audited, adjustments processed, and balances agree to the financial statements..."
        value={wpNotes["c2_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, c2_conclusion: e.target.value }))} />
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────
   C3 — Enhanced Balance Sheet Lead Schedule
   ─────────────────────────────────────────────────────────────── */
export const BSLeadEnhanced = memo(function BSLeadEnhanced({
  _BoundET, _ST, _cfg, C, inp, wpNotes, setWpNotes
}) {
  const lines = [
    { item: "Intangible Assets", sub: false },
    { item: "Tangible Assets", sub: false },
    { item: "Investments", sub: false },
    { item: "Inventory", sub: false },
    { item: "Trade Receivables", sub: false },
    { item: "Other Receivables", sub: false },
    { item: "Prepayments", sub: false },
    { item: "Cash and Bank", sub: false },
    { item: "TOTAL ASSETS", sub: true },
    { item: "Trade Payables", sub: false },
    { item: "Other Payables", sub: false },
    { item: "Accruals", sub: false },
    { item: "Tax Payable", sub: false },
    { item: "Bank Overdraft", sub: false },
    { item: "Current Portion of Loans", sub: false },
    { item: "NET CURRENT ASSETS", sub: true },
    { item: "Bank Loans", sub: false },
    { item: "Provisions", sub: false },
    { item: "Deferred Tax", sub: false },
    { item: "NET ASSETS", sub: true },
    { item: "Share Capital", sub: false },
    { item: "Share Premium", sub: false },
    { item: "Retained Earnings", sub: false },
    { item: "Other Reserves", sub: false },
    { item: "TOTAL EQUITY", sub: true },
  ];
  return (
    <div>
      <ST t="C3 — Balance Sheet Lead Schedule" color={C.ld} />
      <BoundET id="c3_bs" headers={["Note Ref", "Line Item", "PY (£)", "CY (£)", "Movement (£)", "Movement %", "WP Ref", "Audit Adj Dr", "Audit Adj Cr", "Adjusted Balance", "Status"]}
        rows={lines.map((l) => [
          "", <span style={{ color: C.tx, fontWeight: l.sub ? 700 : 500, fontStyle: l.sub ? "italic" : "normal" }}>{l.item}</span>,
          "", "", "", "", "", "", "", "", "",
        ])} editable={[0, 2, 3, 4, 7, 8, 9, 10]} />
      <div style={{ color: C.dim, fontSize: 11, fontStyle: "italic", marginBottom: 14 }}>
        Convention: Debit entries are positive; Credit entries are shown in brackets e.g. (1,000). Subtotal rows should auto-cast from line items above. All adjustments must cross-reference to E5 schedule.
      </div>

      <ST t="Conclusion" color={C.ld} />
      <textarea style={{ ...inp, width: "100%", minHeight: 80 }} placeholder="Conclude on the Balance Sheet lead schedule — confirm all balances have been audited, adjustments processed, and the balance sheet balances (Total Assets = Total Equity + Total Liabilities)..."
        value={wpNotes["c3_conclusion"] || ""} onChange={(e) => setWpNotes((p) => ({ ...p, c3_conclusion: e.target.value }))} />
    </div>
  );
});
