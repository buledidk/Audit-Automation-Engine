import { useCallback } from "react";
import { useEngagement } from "../context/EngagementContext";
import { useAuditHelpers } from "./useAuditHelpers.jsx";
import { ENGAGEMENT_LETTER, REPRESENTATIONS, AUDIT_OPINIONS } from "../AuditMethodology";
import { TESTS } from "../data";
import { exportEngagement, importEngagement, createStorageEngine, createEngagement, setActiveEngagementId } from "../StorageEngine";
import { generateDemoState } from "../demoSeed";

export function useExportHandlers() {
  const {
    cfg, setCfg, cellData, setCellData, signOffs, setSignOffs,
    wpNotes, setWpNotes, customItems, setCustomItems,
    ind, fw, sz, engId, setEngId, allWPs, // eslint-disable-line no-unused-vars
    setTbData, setTbMappings, setUploads, setArchived,
    setReviewStatus, setSignOffLog, setReviewNotes,
    setDocumentLinks, setChangeLog,
    switchEngagement, showToast
  } = useEngagement();

  const { getCell, formatSignOff } = useAuditHelpers();

  const loadDemoEngagement = useCallback((demoFn, label) => {
    const demo = (demoFn || generateDemoState)();
    const name = demo.cfg.entityName || label || "Demo Engagement";
    const id = createEngagement(name);
    setActiveEngagementId(id);
    setEngId(id);
    const engine = createStorageEngine(id);
    engine.saveImmediate("cfg", demo.cfg);
    engine.saveImmediate("cellData", demo.cellData);
    engine.saveImmediate("signOffs", demo.signOffs);
    engine.saveImmediate("wpNotes", demo.wpNotes);
    engine.saveImmediate("customItems", demo.customItems);
    setCfg(demo.cfg);
    setCellData(demo.cellData);
    setSignOffs(demo.signOffs);
    setWpNotes(demo.wpNotes);
    setCustomItems(demo.customItems);
    setTbData([]);setTbMappings({});setUploads({});setArchived(false);setReviewStatus("");setSignOffLog([]);setReviewNotes({});setDocumentLinks({});setChangeLog([]);
    showToast("Demo loaded — " + name);
  }, [setCfg, setCellData, setSignOffs, setWpNotes, setCustomItems, setTbData, setTbMappings, setUploads, setArchived, setReviewStatus, setSignOffLog, setReviewNotes, setDocumentLinks, setChangeLog, setEngId, showToast]);

  const doExportEngagement = useCallback(() => {
    if (!engId) return;
    const data = exportEngagement(engId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (cfg.entityName || "Engagement").replace(/[^a-zA-Z0-9]/g, "_") + "_backup.json"; a.click();
  }, [engId, cfg.entityName]);

  const doImportEngagement = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const id = importEngagement(e.target.result);
        switchEngagement(id);
      } catch (err) { console.error("Import failed:", err); }
    };
    reader.readAsText(file);
  }, [switchEngagement]);

  const buildWPCsv = useCallback((wp) => {
    const rows = []; const add = (...c) => rows.push(c.map(x => '"' + String(x || '').replace(/"/g, '""') + '"').join(","));
    add("Working Paper: " + wp.ref + " — " + wp.label); add("Entity:", cfg.entityName); add("FYE:", cfg.fye); add("Materiality:", "£" + (cfg.materiality || "TBD")); add("Generated:", new Date().toISOString().slice(0, 10)); rows.push("");
    const prefix = wp.id; const keys = Object.keys(cellData).filter(k => k.startsWith(prefix + "_") || k.startsWith("fsli_" + prefix + "_") || k.startsWith("sub_" + prefix + "_") || k.startsWith("proc_" + prefix + "_") || k.startsWith("test_" + prefix + "_") || k.startsWith("cyc_" + prefix + "_") || k.startsWith("ifrs15_cr_") || k.startsWith("ifrs15_at_"));
    if (keys.length) { add("Cell Data"); add("Key", "Value"); keys.forEach(k => add(k, cellData[k])); }
    const so = signOffs[wp.id] || {}; add(""); add("Sign-off"); add("Prepared By", formatSignOff(so.preparedBy)); add("Reviewed By", formatSignOff(so.reviewedBy));
    if (wpNotes[wp.id]) { add(""); add("Notes"); add(wpNotes[wp.id]); }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_" + (cfg.fye || "FYE").replace(/[^a-zA-Z0-9]/g, "") + "_" + wp.ref + ".csv"; a.click();
  }, [cfg.entityName, cfg.fye, cfg.materiality, cellData, signOffs, wpNotes, formatSignOff]);

  const doExport = useCallback(() => {
    if (!cfg.configured || !ind) return; const r = []; const add = (...c) => r.push(c.map(x => '"' + String(x || '').replace(/"/g, '""') + '"').join(","));
    add("AUDIT WORKING PAPER FILE"); add("Entity:", cfg.entityName); add("Generated:", "AuditEngine v10 AURA — " + new Date().toISOString().slice(0, 10)); r.push("");
    add("Industry:", ind.l); add("Sector:", cfg.sector); add("Framework:", fw?.l); add("FYE:", cfg.fye); add("Materiality:", "£" + cfg.materiality); r.push("");
    add("═══ RISKS ═══"); add("Ref", "Risk", "Level", "ISA", "Response"); [...ind.r, ...customItems.risks].forEach(x => add(x.id, x.t, x.lv, x.isa, x.rs || "")); r.push("");
    add("═══ PROCEDURES ═══"); add("WP", "Area", "Procedure", "Assertion", "ISA"); ind.p.forEach(x => add(x.ref, x.a, x.pr, x.as, x.isa)); r.push("");
    add("═══ WP INDEX ═══"); add("Ref", "WP", "ISA", "Status", "Prepared", "Reviewed", "Notes"); allWPs.forEach(w => { const so = signOffs[w.id] || {}; add(w.ref, w.label, w.isa || "", so.preparedBy ? "Complete" : "Open", so.preparedBy || "", so.reviewedBy || "", wpNotes[w.id] || ""); });
    const blob = new Blob(["\uFEFF" + r.join("\n")], { type: "text/csv;charset=utf-8;" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (cfg.entityName.replace(/[^a-zA-Z0-9]/g, "_") || "Audit") + "_AuditFile.csv"; a.click();
  }, [cfg, ind, fw, customItems.risks, allWPs, signOffs, wpNotes]);

  const generateWord = useCallback((title, htmlContent, filename) => {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Calibri,sans-serif;font-size:11pt;color:#333;line-height:1.6;margin:40px 60px}
h1{font-size:18pt;color:#1a237e;border-bottom:2px solid #1a237e;padding-bottom:8px}
h2{font-size:14pt;color:#283593;margin-top:20px}h3{font-size:12pt;color:#3949ab}
table{border-collapse:collapse;width:100%;margin:12px 0}th,td{border:1px solid #ccc;padding:6px 10px;font-size:10pt}
th{background:#e8eaf6;font-weight:bold;text-align:left}.header{text-align:center;margin-bottom:30px}
.footer{margin-top:40px;border-top:1px solid #ccc;padding-top:10px;font-size:9pt;color:#666}
.sig-block{margin-top:40px;display:flex;gap:60px}.sig-line{border-top:1px solid #333;width:200px;margin-top:40px;padding-top:4px}
</style></head><body>${htmlContent}
<div class="footer">Generated by AuditEngine v10 AURA | ${new Date().toISOString().slice(0, 10)} | ${cfg.firmName || "[Firm]"}</div>
</body></html>`;
    const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  }, [cfg.firmName]);

  const generateEngagementLetterWord = useCallback(() => {
    const el = ENGAGEMENT_LETTER; const rep = s => s.replace(/\{FYE\}/g, cfg.fye || "[FYE]").replace(/\{FRAMEWORK\}/g, fw?.l || "[Framework]");
    const html = `<div class="header"><h1>ENGAGEMENT LETTER</h1><p>${cfg.firmName || "[Firm Name]"}</p></div>
<p><strong>To:</strong> The Board of Directors of <strong>${cfg.entityName || "[Entity]"}</strong></p>
<p><strong>Date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
<p><strong>Re:</strong> Audit of financial statements for the year ended ${cfg.fye || "[FYE]"}</p>
<h2>1. Objective (ISA 200.11)</h2><p>${rep(el.objective)}</p>
<h2>2. Scope of Audit</h2>${el.scope.map(s => "<p>• " + rep(s) + "</p>").join("")}
<h2>3. Engagement Team</h2>
<table><tr><th>Role</th><th>Name</th></tr>
<tr><td>Engagement Partner</td><td>${cfg.partner || "[TBD]"}</td></tr>
<tr><td>Audit Manager</td><td>${cfg.manager || "[TBD]"}</td></tr>
<tr><td>Audit Firm</td><td>${cfg.firmName || "[TBD]"}</td></tr></table>
<h2>4. Responsibilities of Management (ISA 210.6)</h2>
<table><tr><th>#</th><th>Responsibility</th></tr>${el.responsibilities_management.map((r, i) => "<tr><td>" + (i + 1) + "</td><td>" + r + "</td></tr>").join("")}</table>
<h2>5. Responsibilities of the Auditor (ISA 210.10)</h2>
<table><tr><th>#</th><th>Responsibility</th></tr>${el.responsibilities_auditor.map((r, i) => "<tr><td>" + (i + 1) + "</td><td>" + r + "</td></tr>").join("")}</table>
<h2>6. Inherent Limitations (ISA 200.A53)</h2><p>${el.limitations}</p>
<h2>7. Fees</h2><p>[To be agreed]</p>
<p>Please sign and return one copy of this letter to indicate your acknowledgement of, and agreement with, the arrangements for our audit.</p>
<div class="sig-block"><div><div class="sig-line">For and on behalf of ${cfg.firmName || "[Firm]"}</div><p>${cfg.partner || "[Partner]"}</p></div>
<div><div class="sig-line">For and on behalf of ${cfg.entityName || "[Entity]"}</div><p>[Director Name]</p></div></div>`;
    generateWord("Engagement Letter — " + cfg.entityName, (html), (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_A1_Engagement_Letter.doc");
  }, [cfg.entityName, cfg.fye, cfg.firmName, cfg.partner, cfg.manager, fw, generateWord]);

  const generateRepresentationsWord = useCallback(() => {
    const reps = REPRESENTATIONS; const rep = s => s.replace(/\{FRAMEWORK\}/g, fw?.l || "[Framework]");
    const html = `<div class="header"><h1>WRITTEN REPRESENTATIONS</h1><p>ISA 580</p></div>
<p>Dear ${cfg.firmName || "[Firm Name]"},</p>
<p>This representation letter is provided in connection with your audit of the financial statements of <strong>${cfg.entityName || "[Entity]"}</strong> for the year ended <strong>${cfg.fye || "[FYE]"}</strong>.</p>
<table><tr><th>Ref</th><th>Representation</th><th>ISA</th><th>Mandatory</th></tr>
${reps.map(r => "<tr><td>" + r.ref + "</td><td>" + rep(r.text) + "</td><td>" + r.isa + "</td><td>" + (r.mandatory ? "YES" : "No") + "</td></tr>").join("")}</table>
<p style="margin-top:30px">Yours faithfully,</p>
<div class="sig-block"><div><div class="sig-line">Director</div><p>[Name]</p><p>${cfg.entityName || "[Entity]"}</p><p>Date: _______________</p></div></div>`;
    generateWord("Written Representations — " + cfg.entityName, (html), (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_E4_Representations.doc");
  }, [cfg.entityName, cfg.fye, cfg.firmName, fw, generateWord]);

  const generateManagementLetterWord = useCallback(() => {
    const html = `<div class="header"><h1>MANAGEMENT LETTER</h1><p>ISA 265 — Communicating Deficiencies in Internal Control</p></div>
<p><strong>PRIVATE AND CONFIDENTIAL</strong></p>
<p>The Board of Directors<br/>${cfg.entityName || "[Entity]"}</p>
<p>Dear Directors,</p>
<p>Following our audit of the financial statements for the year ended <strong>${cfg.fye || "[FYE]"}</strong>, we write to bring the following matters to your attention in accordance with ISA (UK) 265.</p>
<h2>Matters Arising</h2>
<table><tr><th>#</th><th>Finding</th><th>Risk/Impact</th><th>Recommendation</th><th>Priority</th><th>Management Response</th></tr>
<tr><td>1</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>2</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>3</td><td></td><td></td><td></td><td></td><td></td></tr></table>
<h2>Status of Prior Year Matters</h2>
<table><tr><th>#</th><th>Prior Year Finding</th><th>Status</th><th>Comment</th></tr>
<tr><td>1</td><td></td><td></td><td></td></tr></table>
<p>This letter is provided for the sole use of the directors of ${cfg.entityName || "[Entity]"} and should not be disclosed to third parties without our prior written consent.</p>
<p>Yours faithfully,</p>
<div class="sig-block"><div><div class="sig-line">${cfg.firmName || "[Firm]"}</div><p>${cfg.partner || "[Partner]"}</p></div></div>`;
    generateWord("Management Letter — " + cfg.entityName, (html), (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_F1_Management_Letter.doc");
  }, [cfg.entityName, cfg.fye, cfg.firmName, cfg.partner, generateWord]);

  const generateAuditReportWord = useCallback(() => {
    const ops = AUDIT_OPINIONS; const rep = s => s.replace(/\{FYE\}/g, cfg.fye || "[FYE]").replace(/\{FRAMEWORK\}/g, fw?.l || "[Framework]");
    const html = `<div class="header"><h1>INDEPENDENT AUDITOR'S REPORT</h1><p>To the members of ${cfg.entityName || "[Entity]"}</p></div>
<h2>Opinion</h2>
<p>We have audited the financial statements of <strong>${cfg.entityName || "[Entity]"}</strong> for the year ended <strong>${cfg.fye || "[FYE]"}</strong> which comprise the statement of comprehensive income, the balance sheet, the statement of changes in equity, the statement of cash flows, and related notes to the financial statements, including a summary of significant accounting policies.</p>
<p>${rep(ops.unmodified.wording)}</p>
<h2>Basis for Opinion</h2>
<p>We conducted our audit in accordance with International Standards on Auditing (UK) (ISAs (UK)) and applicable law. Our responsibilities under those standards are further described in the Auditor's responsibilities for the audit of the financial statements section of our report. We are independent of the company in accordance with the ethical requirements that are relevant to our audit of the financial statements in the UK, including the FRC's Ethical Standard, and we have fulfilled our other ethical responsibilities in accordance with these requirements. We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our opinion.</p>
<h2>Conclusions Relating to Going Concern</h2>
<p>In auditing the financial statements, we have concluded that the directors' use of the going concern basis of accounting in the preparation of the financial statements is appropriate.</p>
<p>Based on the work we have performed, we have not identified any material uncertainties relating to events or conditions that, individually or collectively, may cast significant doubt on the company's ability to continue as a going concern for a period of at least twelve months from when the financial statements are authorised for issue.</p>
<h2>Other Information</h2>
<p>The directors are responsible for the other information. The other information comprises the information included in the annual report, other than the financial statements and our auditor's report thereon. Our opinion on the financial statements does not cover the other information and we do not express any form of assurance conclusion thereon.</p>
<h2>Responsibilities of Directors</h2>
<p>As explained more fully in the directors' responsibilities statement, the directors are responsible for the preparation of the financial statements and for being satisfied that they give a true and fair view, and for such internal control as the directors determine is necessary to enable the preparation of financial statements that are free from material misstatement, whether due to fraud or error.</p>
<h2>Auditor's Responsibilities</h2>
<p>Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's report that includes our opinion. Reasonable assurance is a high level of assurance, but is not a guarantee that an audit conducted in accordance with ISAs (UK) will always detect a material misstatement when it exists.</p>
<p style="margin-top:30px"><strong>${cfg.firmName || "[Firm Name]"}</strong><br/>Statutory Auditor<br/>[Address]<br/>Date: _______________</p>`;
    generateWord("Audit Report — " + cfg.entityName, (html), (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_F2_Audit_Report.doc");
  }, [cfg.entityName, cfg.fye, cfg.firmName, fw, generateWord]);

  const generateAuditWorkbook = useCallback(async (wp) => {
    try {
      const JSZip = (await import('jszip')).default; const zip = new JSZip();
      const entity = cfg.entityName || "Entity"; const fye = cfg.fye || "FYE"; const mat = cfg.materiality || "TBD";
      const csvSheet = (name, headers, dataRows) => {
        const rows = [headers.map(h => '"' + String(h).replace(/"/g, '""') + '"').join(",")];
        dataRows.forEach(r => rows.push(r.map(c => '"' + String(c || "").replace(/"/g, '""') + '"').join(",")));
        return "\uFEFF" + rows.join("\n");
      };
      // Sheet 1: Cover
      zip.file("01_Cover.csv", csvSheet("Cover", ["Field", "Value"], [
        ["Working Paper", wp.ref + " — " + wp.label], ["Entity", entity], ["FYE", fye],
        ["Industry", ind?.l + " — " + cfg.sector], ["Framework", fw?.l], ["Materiality", "£" + mat],
        ["Performance Materiality", "£" + (cfg.perfMateriality || "TBD")], ["Trivial", "£" + (cfg.trivial || "TBD")],
        ["ISA Reference", wp.isa || ""], ["Generated", new Date().toISOString().slice(0, 10)],
        ["Prepared By", signOffs[wp.id]?.preparedBy || ""], ["Reviewed By", signOffs[wp.id]?.reviewedBy || ""]
      ]));
      // Sheet 2: FSLI Lead
      if (wp.fk && ind?.f?.[wp.fk]) {
        const lines = ind.f[wp.fk].filter(l => l !== "N/A" && l !== "N/A for pure SaaS");
        zip.file("02_FSLI_Lead.csv", csvSheet("FSLI Lead", ["Line Item", "PY (£)", "CY (£)", "Movement", "Movement %", "Status"],
          lines.map(l => [l, getCell("fsli_" + wp.id, lines.indexOf(l), 1), getCell("fsli_" + wp.id, lines.indexOf(l), 2), "", "", ""])));
      }
      // Sheet 3: Procedures
      const tests = [...(TESTS[wp.id] || []), ...(customItems.tests[wp.id] || [])];
      if (tests.length) { zip.file("03_Procedures.csv", csvSheet("Procedures", ["Ref", "Procedure", "Sample", "Result", "Exceptions", "Prepared", "Reviewed"],
        tests.map((t, i) => [wp.ref + ".S" + String(i + 1).padStart(2, "0"), t, "", "", "", "", ""]))); }
      // Sheet 4: Sample Grid
      zip.file("04_Sample_Grid.csv", csvSheet("Sample Selection", ["#", "Item Selected", "Value (£)", "Test Performed", "Result", "Exception", "Comment"],
        Array.from({ length: 25 }, (_, i) => [i + 1, "", "", "", "", "", ""])));
      // Sheet 5: Results
      zip.file("05_Results.csv", csvSheet("Results", ["Metric", "Value"], [
        ["Total items tested", ""], ["Exceptions found", ""], ["Exception rate %", ""],
        ["Material exceptions", ""], ["Conclusion", ""], ["Follow-up required", ""],
        ["Prepared by", ""], ["Reviewed by", ""], ["Date", ""]
      ]));
      // Sheet 6: Notes
      zip.file("06_Notes.csv", csvSheet("Notes", ["Category", "Content"], [
        ["Working Paper Notes", wpNotes[wp.id] || ""], ["Conclusion Notes", wpNotes["conclusion_" + wp.id] || ""]
      ]));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = entity.replace(/[^a-zA-Z0-9]/g, "_") + "_" + wp.ref + "_Workbook.zip"; a.click();
    } catch (e) { console.error("Workbook generation error:", e); }
  }, [cfg.entityName, cfg.fye, cfg.materiality, cfg.perfMateriality, cfg.trivial, cfg.sector, ind, fw, signOffs, wpNotes, customItems.tests, getCell]);

  return {
    generateWord,
    generateEngagementLetterWord,
    generateRepresentationsWord,
    generateManagementLetterWord,
    generateAuditReportWord,
    generateAuditWorkbook,
    doExportEngagement,
    doImportEngagement,
    loadDemoEngagement,
    buildWPCsv,
    doExport
  };
}
