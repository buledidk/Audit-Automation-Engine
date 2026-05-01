import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";
import { COMPLETION_CHECKLIST, REPRESENTATIONS, AUDIT_OPINIONS } from "../../AuditMethodology";

export default function CompletionWP({ wp }) {
  const { cfg, ind, fw, sz, wpNotes, setWpNotes, _signOffs, _customItems } = useEngagement();
  const { _BoundET, _ST, inp, _tc } = useAuditHelpers();

    if(wp.id==="e1")return<div><ST t="Completion Checklist — ISA 220/230" color={C.cmp}/>
      <BoundET id="e1" headers={["Ref","Category","Completion Item","ISA","Done?","Date","Comment"]} rows={COMPLETION_CHECKLIST.map(c=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{c.ref}</span>,<span style={{fontSize:10,color:C.pur,fontWeight:600,textTransform:"uppercase"}}>{c.category}</span>,<span style={{color:C.tx}}>{c.item}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{c.isa}</span>,"","",""])} editable={[4,5,6]}/>
    </div>;
    if(wp.id==="e2")return<div><ST t="Final Analytical Review — ISA 520.6" color={C.cmp}/>
      <div style={{background:"rgba(142,36,170,0.06)",border:"1px solid rgba(142,36,170,0.2)",borderRadius:10,padding:14,marginBottom:16,borderLeft:"4px solid "+C.cmp}}>
        <div style={{fontSize:10,color:C.cmp,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>ISA 520.6 Requirement</div>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>The auditor shall design and perform analytical procedures near the end of the audit that assist when forming an overall conclusion as to whether the financial statements are consistent with the auditor's understanding of the entity. If previously unrecognised risks are identified, the auditor shall revise the risk assessment (ISA 520.7).</div>
      </div>
      <ST t="Key Financial Ratios" color={C.cmp}/>
      <BoundET id="e2_ratios" headers={["Ratio","CY","PY","Movement","Benchmark","Commentary","Consistent with Understanding?"]} rows={[
        [<span style={{color:C.tx,fontWeight:500}}>Gross margin %</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Operating margin %</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Current ratio</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Gearing ratio %</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Interest cover</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Debtor days</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Creditor days</span>,"","","","","",""],
        [<span style={{color:C.tx,fontWeight:500}}>Revenue growth %</span>,"","","","","",""]
      ]} editable={[1,2,3,4,5,6]}/>
      <div style={{marginTop:20}}><ST t="Industry KPI Comparison" color={C.tl}/></div>
      <BoundET id="e2_kpi" headers={["KPI","CY","PY","Industry Avg","Commentary","Consistent?"]} rows={ind.k.map(k=>[<span style={{color:C.tx}}>{k}</span>,"","","","",""])} editable={[1,2,3,4,5]}/>
      <div style={{marginTop:20}}><ST t="Financial Statement Line Item Review" color={C.blu}/></div>
      <BoundET id="e2_fsli" headers={["Line Item","PY (£)","CY (£)","Movement %","Expected?","Explanation Required?"]} rows={["Revenue","Cost of sales","Staff costs","Other expenses","Depreciation","Finance costs","Tax charge","Trade receivables","Trade payables","Cash","Fixed assets","Borrowings"].map(l=>[<span style={{color:C.tx}}>{l}</span>,"","","","",""])} editable={[1,2,3,4,5]}/>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Conclusion (ISA 520.6)</div>
        <textarea value={wpNotes["e2_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,e2_conclusion:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Based on our final analytical review, the financial statements are consistent with our understanding of the entity and its environment. No previously unrecognised risks of material misstatement were identified. All material fluctuations have been satisfactorily explained..."/></div>
    </div>;
    if(wp.id==="e3")return<div><ST t="Subsequent Events Review — ISA 560" color={C.cmp}/>
      <div style={{background:"rgba(142,36,170,0.06)",border:"1px solid rgba(142,36,170,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.cmp}}>
        <div style={{fontSize:10,color:C.cmp,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>ISA 560 — Types of Subsequent Events</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{padding:10,borderRadius:8,background:C.grn+"0D",border:"1px solid "+C.grn+"33"}}><div style={{fontSize:11,color:C.grn,fontWeight:700,marginBottom:4}}>Adjusting Events (ISA 560.8)</div><div style={{fontSize:10,color:C.dim,lineHeight:1.5}}>Conditions existing at year end. Require adjustment to FS amounts. E.g.: resolution of court case, evidence of asset impairment, discovery of fraud/error, determination of cost/proceeds.</div></div>
          <div style={{padding:10,borderRadius:8,background:C.org+"0D",border:"1px solid "+C.org+"33"}}><div style={{fontSize:11,color:C.org,fontWeight:700,marginBottom:4}}>Non-Adjusting Events (ISA 560.10)</div><div style={{fontSize:10,color:C.dim,lineHeight:1.5}}>Conditions arising after year end. Disclosure required if material. E.g.: major acquisition/disposal, fire/flood, decline in market values, management plans (restructuring).</div></div>
        </div>
      </div>
      <ST t="Procedures Performed (ISA 560.7)" color={C.cmp}/>
      <BoundET id="e3_proc" headers={["#","Procedure","ISA Ref","Done?","Date Performed","Findings"]} rows={[
        [1,"Review post year-end bank statements to report date","ISA 560.7(a)","","",""],
        [2,"Review post year-end management accounts","ISA 560.7(b)","","",""],
        [3,"Read board/committee minutes held after year end","ISA 560.7(c)","","",""],
        [4,"Enquire of management whether any subsequent events have occurred","ISA 560.7(d)","","",""],
        [5,"Review latest interim financial information (if any)","ISA 560.7(e)","","",""],
        [6,"Review post year-end legal correspondence and solicitor updates","ISA 560.7(f)","","",""],
        [7,"Confirm post year-end insurance claims status","ISA 560.7","","",""],
        [8,"Review major customer/supplier changes since year end","ISA 560.7","","",""],
        [9,"Review post year-end cash receipts for receivables","ISA 560.7","","",""],
        [10,"Review post year-end invoices for accruals completeness","ISA 560.7","","",""]
      ].map(r=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{r[0]}</span>,<span style={{color:C.tx}}>{r[1]}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{r[2]}</span>,"","",""])} editable={[3,4,5]}/>
      <div style={{marginTop:20}}><ST t="Events Identified" color={C.org}/></div>
      <BoundET id="e3_events" headers={["Date","Event Description","Type","Impact (£)","Disclosure Required?","FS Adjustment Required?","Action Taken"]} rows={[["","","Adjusting","","","",""],["","","Non-adjusting","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""]]} editable={[0,1,2,3,4,5,6]}/>
      <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><div style={{fontSize:10,color:C.cmp,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Procedures Performed Through Date</div>
          <input value={wpNotes["e3_through_date"]||""} onChange={e=>setWpNotes(p=>({...p,e3_through_date:e.target.value}))} style={inp} placeholder="Date of auditor's report or date procedures performed through..."/></div>
        <div><div style={{fontSize:10,color:C.cmp,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Management Written Confirmation</div>
          <input value={wpNotes["e3_mgmt_confirm"]||""} onChange={e=>setWpNotes(p=>({...p,e3_mgmt_confirm:e.target.value}))} style={inp} placeholder="Management has confirmed all subsequent events have been disclosed (Y/N + date)"/></div>
      </div>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Conclusion</div>
        <textarea value={wpNotes["e3_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,e3_conclusion:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Based on our procedures performed through [date], we are satisfied that all significant subsequent events have been identified and appropriately reflected or disclosed in the financial statements in accordance with ISA 560..."/></div>
    </div>;
    if(wp.id==="e4"){const reps=REPRESENTATIONS;const rep=s=>s.replace(/\{FRAMEWORK\}/g,fw?.l||"[Framework]");return<div><ST t="Written Representations — ISA 580" color={C.cmp}/>
      <div style={{background:C.card,borderRadius:10,padding:16,border:"1px solid "+C.brd,marginBottom:16,fontSize:13,color:C.dim,lineHeight:1.8}}>
        <p>Dear <b style={{color:C.al}}>{cfg.firmName||"[Firm Name]"}</b>,</p>
        <p style={{marginTop:8}}>This representation letter is provided in connection with your audit of the financial statements of <b style={{color:C.al}}>{cfg.entityName}</b> for the year ended <b style={{color:C.al}}>{cfg.fye}</b> for the purpose of expressing an opinion as to whether the financial statements give a true and fair view in accordance with <b style={{color:C.al}}>{fw?.l}</b>.</p>
      </div>
      <BoundET id="e4" headers={["Ref","Representation","ISA Ref","Mandatory","Included?","N/A?","Comment"]} rows={reps.map(r=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{r.ref}</span>,<span style={{color:C.tx}}>{rep(r.text)}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{r.isa}</span>,<span style={{fontSize:10,color:r.mandatory?C.red:C.dim,fontWeight:r.mandatory?600:400}}>{r.mandatory?"YES":"No"}</span>,"","",""])} editable={[4,5,6]}/>
    </div>;}
    if(wp.id==="e5")return<div><ST t="Summary of Unadjusted Differences — ISA 450" color={C.cmp}/>
      <div style={{background:"rgba(142,36,170,0.06)",border:"1px solid rgba(142,36,170,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.cmp}}>
        <div style={{fontSize:10,color:C.cmp,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>ISA 450 — Evaluation of Misstatements</div>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>The auditor shall accumulate misstatements identified during the audit, other than those that are clearly trivial (ISA 450.5). Communicate all accumulated misstatements to management and request correction (ISA 450.8). If management refuses to correct, obtain understanding of reasons and evaluate whether aggregate uncorrected misstatements are material (ISA 450.11).</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
        {[{l:"Overall Materiality",v:"£"+(cfg.materiality||"TBD"),c:C.acc},{l:"Performance Materiality",v:"£"+(cfg.perfMateriality||"TBD"),c:C.blu},{l:"Clearly Trivial",v:"£"+(cfg.trivial||"TBD"),c:C.grn}].map((m,i)=><div key={i} style={{padding:14,borderRadius:8,background:m.c+"0D",border:"1px solid "+m.c+"33",textAlign:"center"}}><div style={{fontSize:20,color:m.c,fontWeight:700}}>{m.v}</div><div style={{fontSize:9,color:C.dim,marginTop:4}}>{m.l}</div></div>)}
      </div>
      <ST t="Unadjusted Differences (Not Corrected by Management)" color={C.red}/>
      <BoundET id="e5_unadj" headers={["#","Description","WP Ref","Income Dr/(Cr) £","BS Dr/(Cr) £","Tax Effect £","Reason Not Adjusted"]} rows={Array.from({length:10},(_,i)=>[String(i+1),"","","","","",""])} editable={[1,2,3,4,5,6]}/>
      <div style={{marginTop:16,background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",borderRadius:10,padding:14,borderLeft:"4px solid "+C.red}}>
        <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:4}}>Warning: ISA 450.12</div>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>If the aggregate of uncorrected misstatements approaches or exceeds materiality (£{cfg.materiality||"TBD"}), the auditor shall consider whether the opinion needs to be modified. Include prior period uncorrected misstatements in the evaluation.</div>
      </div>
      <div style={{marginTop:20}}><ST t="Adjusted Differences (Corrected by Management)" color={C.grn}/></div>
      <BoundET id="e5_adj" headers={["#","Description","WP Ref","Dr (£)","Cr (£)","Date Adjusted","Journal Ref"]} rows={Array.from({length:5},(_,i)=>[String(i+1),"","","","","",""])} editable={[1,2,3,4,5,6]}/>
      <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><div style={{fontSize:10,color:C.org,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Management's Reasons for Not Adjusting (ISA 450.9)</div>
          <textarea value={wpNotes["e5_mgmt_reason"]||""} onChange={e=>setWpNotes(p=>({...p,e5_mgmt_reason:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Document management's reasons for not adjusting each uncorrected misstatement..."/></div>
        <div><div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Auditor's Assessment (ISA 450.11)</div>
          <textarea value={wpNotes["e5_auditor_assessment"]||""} onChange={e=>setWpNotes(p=>({...p,e5_auditor_assessment:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Conclude whether uncorrected misstatements are material, individually or in aggregate. Consider nature, cause, and circumstances of each misstatement and whether they affect specific disclosures..."/></div>
      </div>
      <div style={{marginTop:12}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Overall Conclusion</div>
        <textarea value={wpNotes["e5_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,e5_conclusion:e.target.value}))} style={{...inp,minHeight:50,resize:"vertical"}} placeholder="We are satisfied that the aggregate of uncorrected misstatements is not material to the financial statements as a whole. Management's representation letter includes acknowledgement of all uncorrected misstatements (ISA 580.A14)..."/></div>
    </div>;
    if(wp.id==="e6")return<div><ST t="Audit Completion Memorandum — ISA 230" color={C.cmp}/>
      <div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.brd,fontSize:14,color:C.dim,lineHeight:1.9,marginBottom:20}}>
        <p><b style={{color:C.tx}}>Entity:</b> {cfg.entityName} · <b style={{color:C.tx}}>FYE:</b> {cfg.fye} · <b style={{color:C.tx}}>Industry:</b> {ind.l} — {cfg.sector}</p>
        <p><b style={{color:C.tx}}>Framework:</b> {fw?.l} · <b style={{color:C.tx}}>Size:</b> {sz?.l} · <b style={{color:C.tx}}>Materiality:</b> £{cfg.materiality||"TBD"}</p>
        <p><b style={{color:C.tx}}>Partner:</b> {cfg.partner||"TBD"} · <b style={{color:C.tx}}>Manager:</b> {cfg.manager||"TBD"}</p>
      </div>
      <BoundET id="e6_summary" headers={["Area","Conclusion","Cross-Reference"]} rows={[
        [<span style={{color:C.tx,fontWeight:500}}>Materiality — final assessment (ISA 320.12)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>A4</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Risk assessment — any changes from planning (ISA 315)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>B1-B3</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Going concern conclusion (ISA 570)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>A7</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Fraud — any indicators identified (ISA 240)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>A6, C4</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Subsequent events (ISA 560)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>E3</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Related parties (ISA 550)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>D15</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Laws & regulations (ISA 250)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>A9</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Uncorrected misstatements (ISA 450)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>E5</span>],
        [<span style={{color:C.tx,fontWeight:500}}>Written representations obtained (ISA 580)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>E4</span>],
        [<span style={{color:C.tx,fontWeight:500}}>EQCR required / performed (ISQM 2)</span>,"",<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>—</span>]
      ]} editable={[1]}/>
      <div style={{marginTop:20}}><p style={{marginBottom:8}}><b style={{color:C.acc}}>Significant matters arising:</b></p>
        <textarea value={wpNotes["e6_matters"]||""} onChange={e=>setWpNotes(p=>({...p,e6_matters:e.target.value}))} style={{...inp,minHeight:80}} placeholder="Document significant matters arising during the audit..."/></div>
      <div style={{marginTop:16}}><p style={{marginBottom:8}}><b style={{color:C.acc}}>Audit opinion — proposed:</b></p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{Object.entries(AUDIT_OPINIONS).slice(0,5).map(([k,o])=>{const col=k==="unmodified"?C.grn:k==="adverse"||k==="disclaimer"?C.red:C.org;return<span key={k} style={{padding:"4px 10px",borderRadius:4,background:col+"15",border:"1px solid "+col+"33",fontSize:10,color:col,fontWeight:600}}>{o.title} ({o.isa})</span>})}
        </div>
        <textarea value={wpNotes["e6_opinion"]||""} onChange={e=>setWpNotes(p=>({...p,e6_opinion:e.target.value}))} style={{...inp,minHeight:60}} placeholder="State proposed opinion and basis — reference ISA 700/705/706 as applicable..."/></div>
    </div>;
    // ═══ DISCLOSURE CHECKLIST ═══
    if(wp.id==="dc1"){const fwk=cfg.framework||"frs102";const disclosures=[
      {ref:"FRS 102 s3",desc:"Financial statement presentation — true and fair override",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s4",desc:"Statement of financial position — minimum line items",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s5",desc:"Statement of comprehensive income — minimum line items",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s6",desc:"Statement of changes in equity",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s7",desc:"Statement of cash flows",fw:["frs102","charities_sorp"],entity:["medium","large","listed"]},
      {ref:"FRS 102 s8",desc:"Notes to financial statements — accounting policies",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s9",desc:"Consolidated and separate financial statements",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s10",desc:"Accounting policies, estimates and errors",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s11",desc:"Basic financial instruments disclosures",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s12",desc:"Other financial instruments issues",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s13",desc:"Inventories disclosures",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s14",desc:"Investments in associates",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s15",desc:"Investments in joint ventures",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s16",desc:"Investment property disclosures",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s17",desc:"Property, plant and equipment disclosures",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s18",desc:"Intangible assets other than goodwill",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s19",desc:"Business combinations and goodwill",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s20",desc:"Leases disclosures",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s21",desc:"Provisions and contingencies",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s22",desc:"Liabilities and equity disclosures",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s23",desc:"Revenue recognition disclosures",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s24",desc:"Government grants disclosures",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s25",desc:"Borrowing costs",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s26",desc:"Share-based payment disclosures",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s27",desc:"Impairment of assets",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s28",desc:"Employee benefits",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s29",desc:"Income tax disclosures",fw:["frs102","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s30",desc:"Foreign currency translation",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s33",desc:"Related party disclosures",fw:["frs102","frs102_1a","charities_sorp"],entity:["all"]},
      {ref:"FRS 102 s34",desc:"Specialised activities",fw:["frs102"],entity:["all"]},
      {ref:"FRS 102 s35",desc:"Transition to FRS 102",fw:["frs102","frs102_1a"],entity:["all"]},
      {ref:"FRS 102 s1A",desc:"Small entities — reduced disclosure requirements",fw:["frs102_1a"],entity:["small","micro"]},
      {ref:"IAS 1",desc:"Presentation of financial statements",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 7",desc:"Statement of cash flows",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 12",desc:"Income taxes",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 16",desc:"Property, plant and equipment",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 24",desc:"Related party disclosures",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 36",desc:"Impairment of assets",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 37",desc:"Provisions, contingent liabilities and contingent assets",fw:["ifrs"],entity:["all"]},
      {ref:"IAS 38",desc:"Intangible assets",fw:["ifrs"],entity:["all"]},
      {ref:"IFRS 7",desc:"Financial instruments disclosures",fw:["ifrs"],entity:["all"]},
      {ref:"IFRS 9",desc:"Financial instruments — classification and measurement",fw:["ifrs"],entity:["all"]},
      {ref:"IFRS 15",desc:"Revenue from contracts with customers",fw:["ifrs"],entity:["all"]},
      {ref:"IFRS 16",desc:"Leases",fw:["ifrs"],entity:["all"]},
      {ref:"FRS 105 s4",desc:"Statement of financial position — micro-entity minimum line items",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s5",desc:"Income statement — micro-entity minimum line items",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s6",desc:"Notes to accounts — micro-entity minimum notes (guarantees, advances/credits to directors, financial commitments)",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s7",desc:"Accounting policies — measurement at cost or fair value where required",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s10",desc:"Basic financial instruments — amortised cost measurement",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s13",desc:"Inventories — lower of cost and estimated selling price",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s15",desc:"Property, plant and equipment — cost less depreciation",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s19",desc:"Provisions — recognised only when obligation is probable and measurable",fw:["frs105"],entity:["micro"]},
      {ref:"FRS 105 s22",desc:"Government grants — recognised when receivable",fw:["frs105"],entity:["micro"]},
      {ref:"CA s393",desc:"Accounts to give true and fair view",fw:["frs102","frs102_1a","frs105","ifrs","charities_sorp"],entity:["all"]},
      {ref:"CA s394-s396",desc:"Individual company accounts — requirements",fw:["frs102","frs102_1a","frs105","ifrs","charities_sorp"],entity:["all"]},
      {ref:"CA s414A-414D",desc:"Strategic report — required content",fw:["frs102","ifrs"],entity:["medium","large","listed"]},
      {ref:"CA s415-s419",desc:"Directors' report — required content",fw:["frs102","frs102_1a","ifrs","charities_sorp"],entity:["all"]},
      {ref:"CA s420-s422",desc:"Directors' remuneration report (quoted)",fw:["ifrs"],entity:["listed"]},
      {ref:"CA s465-s467",desc:"Small company exemptions",fw:["frs102_1a","frs105"],entity:["small","micro"]},
      {ref:"CA s471-s474",desc:"Publication of accounts",fw:["frs102","frs102_1a","ifrs","charities_sorp"],entity:["all"]},
      {ref:"FCA DTR 4.1",desc:"Annual financial report — regulated entities",fw:["ifrs"],entity:["listed"]},
      {ref:"FCA DTR 7.1",desc:"Corporate governance statement",fw:["ifrs"],entity:["listed"]},
      {ref:"SORP",desc:"Charities SORP — fund accounting and activity analysis",fw:["charities_sorp"],entity:["all"]}
    ];const filtered=disclosures.filter(d=>d.fw.includes(fwk));
    return<div><ST t={"Disclosure Checklist — "+fw?.l} color={C.cmp}/>
      <div style={{marginBottom:12,fontSize:11,color:C.dim}}>{filtered.length} disclosure requirements for {fw?.l}. Filter applied automatically based on selected framework.</div>
      <BoundET id="dc1" headers={["Ref","Disclosure Requirement","Framework","Completed","N/A","WP Ref","Comment"]} rows={filtered.map(d=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:600,fontSize:10}}>{d.ref}</span>,<span style={{color:C.tx}}>{d.desc}</span>,<span style={{fontSize:9,color:C.fnt}}>{d.fw.join(", ")}</span>,"","","",""])} editable={[3,4,5,6]}/>
    </div>}

  return null;
}
