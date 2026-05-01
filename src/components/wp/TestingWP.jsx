import { useState, useCallback } from "react";
import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C, TESTS } from "../../data";
import { TRANSACTION_CYCLES, SUBSTANTIVE_PROCEDURES, IFRS15_REVENUE_COMPLIANCE } from "../../AuditMethodology";
import { TESTING_PROGRAMMES } from "../../TestingProgrammes";

const JUDGMENT_OPTIONS = ["Satisfactory", "Satisfactory with observations", "Exception noted", "Unable to conclude", "Further work required", "N/A"];

export default function TestingWP({ wp }) {
  const { cfg, ind, customItems, setShowModal, setShowSampleCalc, setMi, wpNotes, setWpNotes, procedureLinks, _uploads } = useEngagement();
  const { _BoundET, _ST, inp, _tc } = useAuditHelpers();
  const [evPopover, setEvPopover] = useState(null);
  const handleLinkEvidence = useCallback((tableId, ri) => setEvPopover({ key: tableId + "_" + ri, wpId: wp.id }), [wp.id]);
  const getLinkCounts = useCallback((tableId, count) => { const c = {}; for (let i = 0; i < count; i++) { const k = tableId + "_" + i; if (procedureLinks[k]?.length) c[i] = procedureLinks[k].length; } return c; }, [procedureLinks]);

  const procs=ind.p.filter(p=>p.ref===wp.ref);const tp=TESTING_PROGRAMMES[wp.id];const addT=[...(tp?.procedures?.map(p=>p.procedure)||TESTS[wp.id]||[]),...(customItems.tests[wp.id]||[])];
  const SP_KEY_MAP={d1:"d1_revenue",d2:"d2_receivables",d3:"d3_inventory",d4:"d4_payables",d5:"d5_payroll",d6:"d6_cash",d7:"d7_fixed_assets",d8:"d8_intangibles",d9:"d9_investments",d10:"d10_equity",d11:"d11_loans",d12:"d12_provisions",d13:"d13_tax",d14:"d14_leases",d15:"d15_related_parties",d16:"d16_cashflow"};
  const spKey=SP_KEY_MAP[wp.id]||null;
  const subProcs=spKey&&SUBSTANTIVE_PROCEDURES[spKey]?SUBSTANTIVE_PROCEDURES[spKey]:null;
  const relCycle=wp.id==="d1"?TRANSACTION_CYCLES.revenue:wp.id==="d4"?TRANSACTION_CYCLES.purchases:wp.id==="d5"?TRANSACTION_CYCLES.payroll:wp.id==="d6"?TRANSACTION_CYCLES.treasury:null;
  return<div><FSLILead wp={wp}/>
    <div style={{background:"linear-gradient(135deg,rgba(251,140,0,0.08),rgba(251,140,0,0.03))",border:"1px solid rgba(251,140,0,0.25)",borderRadius:wp.fk?"0 0 12px 12px":"12px",padding:"18px 20px",borderLeft:"4px solid "+C.tst,marginBottom:20}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#FFA726,#FB8C00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>TP</div><div style={{flex:1}}><div style={{fontSize:11,color:C.tst,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>Testing Programme — {wp.label}</div><div style={{fontSize:9,color:C.fnt}}>{ind.l} · {cfg.sector} · {wp.isa}</div></div><button onClick={()=>setShowSampleCalc(true)} style={{padding:"6px 14px",borderRadius:6,background:"rgba(245,166,35,0.1)",border:"1px solid "+C.acc+"44",color:C.acc,cursor:"pointer",fontSize:10,fontWeight:700}}>🧮 Sample Calculator</button><button onClick={()=>{const hdr=[cfg.entityName+" — "+wp.label,"FYE: "+cfg.fye,"Materiality: £"+(cfg.materiality||"TBD"),"Generated: "+new Date().toISOString().slice(0,10)];const fsliLines=ind?.f?.[wp.fk]?.filter(l=>l!=="N/A"&&l!=="N/A for pure SaaS")||[];const csvRows=[hdr.join(" | "),"","FSLI LEAD SCHEDULE","Line Item,PY (£),CY (£),Movement,Movement %,Status",...fsliLines.map(l=>l+",,,,,"),"","SUBSTANTIVE PROCEDURES","#,Procedure,Assertion,ISA,Sample,Result,Prepared,Reviewed",...(TESTS[wp.id]||[]).map((t,i)=>(wp.ref+".S"+String(i+1).padStart(2,"0"))+","+t+",,,,,"),"","SAMPLE SELECTION","#,Item Selected,Value (£),Test Performed,Result,Exception","1,,,,","2,,,,","3,,,,","","RESULTS SUMMARY","Total items tested:,","Exceptions found:,","Conclusion:,","Prepared by:,","Reviewed by:,","Date:,"];const blob=new Blob(["\uFEFF"+csvRows.join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(cfg.entityName||"Entity").replace(/[^a-zA-Z0-9]/g,"_")+"_"+wp.ref+"_Workbook.csv";a.click();}} style={{padding:"6px 14px",borderRadius:6,background:"rgba(67,160,71,0.1)",border:"1px solid "+C.grn+"44",color:C.grn,cursor:"pointer",fontSize:10,fontWeight:700}}>📥 Download Excel</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>{[{l:"ISA Ref",v:wp.isa,c:C.blu},{l:"Materiality",v:"£"+(cfg.materiality||"TBD"),c:C.acc},{l:"Perf Mat",v:"£"+(cfg.perfMateriality||"TBD"),c:C.tl},{l:"Trivial",v:"£"+(cfg.trivial||"TBD"),c:C.grn}].map((m,i)=><div key={i} style={{padding:"8px 12px",borderRadius:6,background:m.c+"0D",border:"1px solid "+m.c+"33",textAlign:"center"}}><div style={{fontSize:9,color:m.c,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{m.l}</div><div style={{fontSize:13,color:C.tx,fontWeight:600,marginTop:2}}>{m.v}</div></div>)}</div>
    {relCycle&&<div style={{marginBottom:20}}>
      <ST t={"Transaction Cycle Walkthrough — "+relCycle.name} color={C.pur}/>
      <div style={{background:"rgba(206,147,216,0.06)",border:"1px solid rgba(206,147,216,0.2)",borderRadius:10,padding:14,marginBottom:12}}>
        <div style={{fontSize:10,color:C.fnt,marginBottom:8}}>{relCycle.isa} · Processes: {relCycle.processes.join(" → ")}</div>
        {relCycle.walkthrough_steps&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{relCycle.walkthrough_steps.map((s,i)=><span key={i} style={{padding:"4px 10px",borderRadius:4,background:"rgba(206,147,216,0.08)",border:"1px solid rgba(206,147,216,0.2)",fontSize:10,color:C.dim}}>{i+1}. {s}</span>)}</div>}
      </div>
      <BoundET id={"cyc_"+wp.id} headers={["Control","Assertion","Risk","Design OK?","Operating OK?","Evidence"]} rows={relCycle.key_controls.map(kc=>[<span style={{color:C.tx}}>{kc.control}</span>,<span style={{fontSize:10,color:C.blu}}>{kc.assertion}</span>,<span style={{fontSize:11,color:C.dim}}>{kc.risk}</span>,"","",""])} editable={[3,4,5]}/>
    </div>}
    {subProcs&&<div style={{marginBottom:20}}>
      <ST t={subProcs.title+" ("+subProcs.isa+")"} color={C.tst}/>
      {subProcs.objective&&<div style={{background:"rgba(251,140,0,0.06)",border:"1px solid rgba(251,140,0,0.2)",borderRadius:10,padding:14,marginBottom:12,borderLeft:"4px solid "+C.tst}}>
        <div style={{fontSize:10,color:C.tst,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Objective</div>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.6}}>{subProcs.objective}</div>
      </div>}
      {(subProcs.population||subProcs.samplingGuidance)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        {subProcs.population&&<div style={{background:C.card,borderRadius:8,padding:12,border:"1px solid "+C.brd}}>
          <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:4}}>Population</div>
          <div style={{fontSize:11,color:C.dim}}>{subProcs.population}</div>
        </div>}
        {subProcs.samplingGuidance&&<div style={{background:C.card,borderRadius:8,padding:12,border:"1px solid "+C.brd}}>
          <div style={{fontSize:10,color:C.pur,fontWeight:700,marginBottom:4}}>Sampling Guidance (ISA 530)</div>
          <div style={{fontSize:11,color:C.dim}}>{subProcs.samplingGuidance}</div>
        </div>}
      </div>}
      <BoundET id={"sub_"+wp.id} headers={["Ref","Procedure","Assertion","ISA","Sample Size","Result","Exceptions","Judgment","Judgment Note","Prepared","Reviewed"]} rows={subProcs.procedures.map(sp=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{sp.ref}</span>,<span style={{color:C.tx}}>{sp.procedure}</span>,<span style={{fontSize:10,color:C.blu}}>{sp.assertion}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{sp.isa}</span>,<span style={{fontSize:10,color:C.dim}}>{sp.sample}</span>,"","","","","",""])} editable={[5,6,7,8,9,10]} editableTypes={{7:{type:"dropdown",options:JUDGMENT_OPTIONS}}} onLinkEvidence={handleLinkEvidence} linkCounts={getLinkCounts("sub_"+wp.id,subProcs.procedures.length)}/>
      {(subProcs.expectedResults||subProcs.exceptionHandling)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        {subProcs.expectedResults&&<div style={{background:"rgba(102,187,106,0.06)",borderRadius:8,padding:12,border:"1px solid rgba(102,187,106,0.2)",borderLeft:"4px solid "+C.grn}}>
          <div style={{fontSize:10,color:C.grn,fontWeight:700,marginBottom:4}}>Expected Results</div>
          <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>{subProcs.expectedResults}</div>
        </div>}
        {subProcs.exceptionHandling&&<div style={{background:"rgba(239,83,80,0.06)",borderRadius:8,padding:12,border:"1px solid rgba(239,83,80,0.2)",borderLeft:"4px solid "+C.red}}>
          <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:4}}>Exception Handling</div>
          <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>{subProcs.exceptionHandling}</div>
        </div>}
      </div>}
      {subProcs.conclusionTemplate&&<div style={{marginTop:12}}><ConclusionBuilder template={subProcs.conclusionTemplate} value={wpNotes["conclusion_"+wp.id]||""} onChange={v=>setWpNotes(p=>({...p,["conclusion_"+wp.id]:v}))} inputStyle={{...inp,minHeight:60,resize:"vertical"}} colors={C}/></div>}
    </div>}
    {procs.length>0&&<><ST t="Industry-Specific Procedures" color={C.org}/><BoundET id={"proc_"+wp.id} headers={["#","Procedure","Assertion","ISA","Sample","Result","Judgment","Judgment Note","Prepared","Reviewed"]} rows={procs.map((p,i)=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{wp.ref}.{String(i+1).padStart(2,"0")}</span>,<span style={{color:C.tx}}>{p.pr}</span>,<span style={{fontSize:10}}>{p.as}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{p.isa}</span>,"","","","","",""])} editable={[4,5,6,7,8,9]} editableTypes={{6:{type:"dropdown",options:JUDGMENT_OPTIONS}}} onLinkEvidence={handleLinkEvidence} linkCounts={getLinkCounts("proc_"+wp.id,procs.length)}/></>}
    {addT.length>0&&<div style={{marginTop:20}}><ST t="Standard Test Programme" color={C.org}/><BoundET id={"test_"+wp.id} headers={["#","Test Procedure","Sample","Result","Exception","Judgment","Judgment Note","Prepared","Reviewed"]} rows={addT.map((t,i)=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{wp.ref}.S{String(i+1).padStart(2,"0")}</span>,<span style={{color:C.tx}}>{t}</span>,"","","","","","",""])} editable={[2,3,4,5,6,7,8]} editableTypes={{5:{type:"dropdown",options:JUDGMENT_OPTIONS}}} onLinkEvidence={handleLinkEvidence} linkCounts={getLinkCounts("test_"+wp.id,addT.length)}/></div>}
    <button onClick={()=>{setMi({wp:wp.id});setShowModal("test");}} style={{marginTop:12,padding:"8px 20px",borderRadius:8,background:C.abg,border:"1px solid "+C.acc+"44",color:C.acc,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Add Custom Test</button>
    {wp.id==="d1"&&IFRS15_REVENUE_COMPLIANCE&&IFRS15_REVENUE_COMPLIANCE.length>0&&<div style={{marginTop:24}}>
      <ST t="IFRS 15 Revenue Compliance — Scenario Analysis" color={C.tl}/>
      <div style={{fontSize:11,color:C.dim,marginBottom:16}}>Assess each IFRS 15 scenario for applicability to {cfg.entityName||"this entity"} ({ind?.l} — {cfg.sector})</div>
      {IFRS15_REVENUE_COMPLIANCE.map((rc,_rci)=><div key={rc.id} style={{marginBottom:16,background:C.card,border:"1px solid "+C.brd,borderRadius:10,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",background:C.tl+"0D",borderBottom:"1px solid "+C.tl+"33",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"monospace",color:C.tl,fontWeight:700,fontSize:11}}>{rc.id}</span>
          <span style={{fontSize:12,color:C.tx,fontWeight:600}}>{rc.topic}</span>
        </div>
        <div style={{padding:16}}>
          <div style={{fontSize:10,color:C.tl,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Recognition Criteria</div>
          <BoundET id={"ifrs15_cr_"+rc.id} headers={["#","Criterion","Met?","Evidence","Comment"]} rows={rc.criteria.map((cr,i)=>[i+1,<span style={{color:C.tx}}>{cr}</span>,"","",""])} editable={[2,3,4]}/>
          <div style={{marginTop:12,fontSize:10,color:C.tl,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Audit Tests</div>
          <BoundET id={"ifrs15_at_"+rc.id} headers={["#","Audit Test","Performed?","Result","Exception"]} rows={rc.auditTests.map((at,i)=>[i+1,<span style={{color:C.tx}}>{at}</span>,"","",""])} editable={[2,3,4]}/>
        </div>
      </div>)}
    </div>}
    {wp.id==="d1"&&<div style={{marginTop:24}}><ST t="IFRS 15 Revenue — 5-Step Model Calculator" color={C.tl}/><IFRS15RevenueCalc colors={C}/></div>}
    {wp.id==="d7"&&<div style={{marginTop:24}}><ST t="IAS 36 Impairment — DCF Calculator" color={C.mdl}/><ImpairmentDCFCalc colors={C}/></div>}
    {wp.id==="d8"&&<div style={{marginTop:24}}><ST t="IAS 36 Impairment — DCF Calculator (Intangibles)" color={C.mdl}/><ImpairmentDCFCalc colors={C}/></div>}
    {wp.id==="d9"&&<div style={{marginTop:24}}><ST t="Investment Valuation — DCF Calculator" color={C.mdl}/><StandaloneDCFCalc colors={C}/></div>}
    {wp.id==="d10"&&<div style={{marginTop:24}}><ST t="IFRS 2 Share-Based Payment — Black-Scholes Calculator" color={C.mdl}/><BlackScholesCalc colors={C}/></div>}
    {wp.id==="d11"&&<div style={{marginTop:24}}><ST t="IFRS 9 Financial Instruments — EIR & ECL Calculators" color={C.mdl}/><EIRCalc colors={C}/><div style={{marginTop:24}}/><ECLCalc colors={C}/></div>}
    {wp.id==="d12"&&<div style={{marginTop:24}}><ST t="IAS 37 Provisions — Unwinding Calculator" color={C.mdl}/><ProvisionUnwindingCalc colors={C}/></div>}
    {wp.id==="d14"&&<div style={{marginTop:24}}><ST t="IFRS 16 / FRS 102 s20 — Lease Calculator" color={C.mdl}/><LeaseCalc colors={C}/></div>}
    {evPopover&&<ProcedureEvidencePopover procedureKey={evPopover.key} wpId={evPopover.wpId} onClose={()=>setEvPopover(null)}/>}
    </div></div>;
}
