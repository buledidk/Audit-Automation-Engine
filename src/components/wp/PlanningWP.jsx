import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";
import {
  ENGAGEMENT_LETTER, ACCEPTANCE_CHECKLIST, MATERIALITY_BENCHMARKS, MATERIALITY_NOTES,
  FRAUD_PRESUMPTIONS, JOURNAL_ENTRY_TESTING, GOING_CONCERN, RISK_TRILOGY // eslint-disable-line no-unused-vars
} from "../../AuditMethodology";

export default function PlanningWP({ wp }) {
  const { cfg, _setCfg, ind, fw, sz, _indAcc, wpNotes, setWpNotes, _customItems, _signOffs, _setShowModal, _setMi, _showToast } = useEngagement();
  const { _BoundET, _ST, inp, _lbl, _tc } = useAuditHelpers();

  if (!ind) return null;

  if(wp.id==="a1"){const el=ENGAGEMENT_LETTER;const rep=s=>s.replace(/\{FYE\}/g,cfg.fye||"[FYE]").replace(/\{FRAMEWORK\}/g,fw?.l||"[Framework]");return<div><ST t={"Engagement Letter — "+wp.isa} color={C.pln}/>
      <div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.brd,marginBottom:20}}><div style={{fontSize:14,color:C.dim,lineHeight:1.9}}>
        <p><b style={{color:C.tx}}>To:</b> The Board of Directors of <b style={{color:C.al}}>{cfg.entityName}</b></p>
        <p style={{marginTop:12}}><b style={{color:C.acc}}>1. Objective (ISA 200.11)</b></p><p style={{marginTop:4}}>{rep(el.objective)}</p>
        <p style={{marginTop:16}}><b style={{color:C.acc}}>2. Scope of Audit</b></p>{el.scope.map((s,i)=><p key={i} style={{marginTop:4,paddingLeft:16}}>• {rep(s)}</p>)}
        <p style={{marginTop:16}}><b style={{color:C.acc}}>3. Engagement Partner:</b> <b style={{color:C.al}}>{cfg.partner||"[TBD]"}</b> of <b style={{color:C.al}}>{cfg.firmName||"[TBD]"}</b></p>
        <p style={{marginTop:4}}>As a <b style={{color:C.al}}>{ind.l}</b> entity ({cfg.sector}), classified as <b style={{color:C.al}}>{sz?.l}</b>, our approach addresses sector-specific risks including: {ind.r.slice(0,3).map(r=>r.t).join("; ")}.</p>
      </div></div>
      <ST t="Responsibilities of Management (ISA 210.6)" color={C.blu}/>
      <BoundET id="a1_mgmt" headers={["#","Management Responsibility","ISA Ref"]} rows={el.responsibilities_management.map((r,i)=>{const m=r.match(/\(ISA[^)]+\)/);return[i+1,<span style={{color:C.tx}}>{r.replace(m?.[0]||"","").trim()}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{m?.[0]||""}</span>]})} editable={[]}/>
      <div style={{marginTop:20}}><ST t="Responsibilities of Auditor (ISA 210.10)" color={C.blu}/></div>
      <BoundET id="a1_aud" headers={["#","Auditor Responsibility","ISA Ref"]} rows={el.responsibilities_auditor.map((r,i)=>{const m=r.match(/\(ISA[^)]+\)/);return[i+1,<span style={{color:C.tx}}>{r.replace(m?.[0]||"","").trim()}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{m?.[0]||""}</span>]})} editable={[]}/>
      <div style={{marginTop:20,background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",borderRadius:10,padding:16,borderLeft:"4px solid "+C.red}}>
        <div style={{fontSize:11,color:C.red,fontWeight:700,marginBottom:4}}>Inherent Limitations (ISA 200.A53)</div>
        <div style={{fontSize:13,color:C.dim,lineHeight:1.7}}>{el.limitations}</div>
      </div>
    </div>;}

  if(wp.id==="a2")return<div><ST t="Client Acceptance & Continuance — ISA 220" color={C.pln}/>
      <BoundET id="a2" headers={["Factor","ISA / Ref","Criteria","Required Evidence","Assessment","Conclusion"]} rows={ACCEPTANCE_CHECKLIST.map(c=>[<span style={{color:C.tx,fontWeight:500}}>{c.factor}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{c.isa}</span>,<span style={{color:C.dim}}>{c.criteria}</span>,<span style={{color:C.dim,fontSize:11}}>{c.evidence}</span>,"",""])} editable={[4,5]}/>
    </div>;

  if(wp.id==="a3")return<div><ST t="Audit Strategy & Team — ISA 300" color={C.pln}/>
      <div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:16,border:"1px solid rgba(21,101,192,0.2)",marginBottom:16,fontSize:13,color:C.dim,lineHeight:1.8}}>
        <b style={{color:C.tx}}>Entity:</b> {cfg.entityName} · <b style={{color:C.tx}}>Industry:</b> {ind.l} — {cfg.sector} · <b style={{color:C.tx}}>Framework:</b> {fw?.l}<br/>
        <b style={{color:C.al}}>Materiality:</b> £{cfg.materiality||"TBD"} · <b style={{color:C.al}}>Perf Mat:</b> £{cfg.perfMateriality||"TBD"} · <b style={{color:C.al}}>Trivial:</b> £{cfg.trivial||"TBD"}
      </div>
      <ST t="Team Allocation & Independence (FRC Ethical Standard)" color={C.blu}/>
      <BoundET id="a3_team" headers={["Role","Name","Grade","Hours Budget","Independence Confirmed","Declarations Signed"]} rows={[
        ["Engagement Partner","","Partner","","",""],["Engagement Quality Reviewer","","Partner","","",""],
        ["Audit Manager","","Manager","","",""],["Audit Senior","","Senior","","",""],
        ["Audit Staff 1","","Semi-Senior","","",""],["Audit Staff 2","","Trainee","","",""],
        ["Tax Specialist","","Manager","","",""],["IT Specialist","","Specialist","","",""]
      ].map(r=>[<span style={{color:C.tx,fontWeight:500}}>{r[0]}</span>,r[1],r[2],"","",""])} editable={[1,2,3,4,5]}/>
      <div style={{marginTop:20}}><ST t="Independence Declarations — FRC Ethical Standard 2019" color={C.pur}/></div>
      <BoundET id="a3_indep" headers={["#","Declaration","Applicable?","Confirmed Clear?","Comment"]} rows={[
        "No financial interest in entity or its affiliates",
        "No employment relationship in past 2 years",
        "No business relationships beyond audit",
        "No family/personal connections with management or TCWG",
        "No gifts/hospitality from entity exceeding trivial value",
        "Non-audit services do not impair independence",
        "Total fees do not exceed 15% of firm turnover (non-PIE) / 5% (PIE)",
        "Partner rotation requirements met (7 years non-PIE / 5 years PIE)"
      ].map((d,i)=>[i+1,<span style={{color:C.tx}}>{d}</span>,"","",""])} editable={[2,3,4]}/>
      <div style={{marginTop:20}}><ST t="FSLI Approach — Audit Plan" color={C.pln}/></div>
      <BoundET id="a3_approach" headers={["FSLI Area","Approach","Key Procedures","Assertions","ISA Ref","WP Ref","Hours"]} rows={ind.p.map(p=>[<span style={{color:C.tx,fontWeight:500}}>{p.a}</span>,"Substantive",<span style={{fontSize:11,color:C.dim}}>{p.pr}</span>,<span style={{fontSize:10,color:C.blu}}>{p.as}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{p.isa}</span>,<span style={{fontFamily:"monospace",color:C.acc,fontSize:10}}>{p.ref}</span>,""])} editable={[1,6]}/>
      <div style={{marginTop:20}}><ST t="Audit Timetable" color={C.tl}/></div>
      <BoundET id="a3_time" headers={["Phase","Start Date","End Date","Responsible","Status"]} rows={[
        ["Planning & risk assessment","","","",""],["Interim fieldwork","","","",""],
        ["Year-end procedures","","","",""],["Final fieldwork","","","",""],
        ["Completion & review","","","",""],["Reporting & sign-off","","","",""]
      ].map(r=>[<span style={{color:C.tx,fontWeight:500}}>{r[0]}</span>,"","","",""])} editable={[1,2,3,4]}/>
      <div style={{marginTop:20}}><ST t="Use of Experts (ISA 620)" color={C.org}/></div>
      <BoundET id="a3_experts" headers={["Area","Expert Name/Firm","Nature of Work","ISA 620 Compliance","Reliance Conclusion"]} rows={[["","","","",""],["","","","",""],["","","","",""]]} editable={[0,1,2,3,4]}/>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Overall Strategy Conclusion (ISA 300.7)</div>
        <textarea value={wpNotes["a3_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,a3_conclusion:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Summarise the overall audit strategy including: scope, timing, and direction. Document any matters that may affect the nature, timing or extent of planned procedures..."/></div>
    </div>;

  if(wp.id==="a4"){const mb=MATERIALITY_BENCHMARKS;const mn=MATERIALITY_NOTES;return<div><ST t="Materiality — ISA 320" color={C.pln}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>{[{l:"Overall Materiality",v:"£"+(cfg.materiality||"—"),d:"ISA 320.10",c:C.acc},{l:"Performance Materiality",v:"£"+(cfg.perfMateriality||"—"),d:"ISA 320.11",c:C.blu},{l:"Trivial Threshold",v:"£"+(cfg.trivial||"—"),d:"ISA 450.A2",c:C.grn}].map((m,i)=><div key={i} style={{padding:24,borderRadius:12,background:"linear-gradient(135deg,"+m.c+"12,"+m.c+"06)",border:"1px solid "+m.c+"33",textAlign:"center"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:m.c,fontWeight:700}}>{m.v}</div><div style={{fontSize:11,color:C.dim,marginTop:6,fontWeight:600}}>{m.l}</div><div style={{fontSize:9,color:C.fnt,marginTop:4}}>{m.d}</div></div>)}</div>
      <ST t="Benchmark Analysis" color={C.blu}/>
      <BoundET id="a4" headers={["Benchmark","Range","Typical %","When Appropriate","Amount (£)","% Applied","Materiality (£)","Selected?"]} rows={Object.entries(mb).map(([k,v])=>[<span style={{color:C.tx,fontWeight:500}}>{k==="pbt"?"Profit before tax":k==="grossProfit"?"Gross profit":k==="totalAssets"?"Total assets":k==="netAssets"?"Net assets":k==="totalExpenditure"?"Total expenditure":k==="grossIncome"?"Gross income":k.charAt(0).toUpperCase()+k.slice(1)}</span>,<span style={{color:C.acc,fontWeight:600}}>{v.range}</span>,v.typical,<span style={{fontSize:11,color:C.dim}}>{v.when}</span>,"","","",""])} editable={[4,5,6,7]}/>
      <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{t:"Performance Materiality (ISA 320.11)",c:mn.performanceMateriality,col:C.blu},{t:"Trivial Threshold (ISA 450.A2)",c:mn.trivialThreshold,col:C.grn},{t:"Revision During Audit (ISA 320.12)",c:mn.revision,col:C.org}].map((n,i)=>
          <div key={i} style={{background:n.col+"0D",border:"1px solid "+n.col+"33",borderRadius:10,padding:14,borderLeft:"4px solid "+n.col}}>
            <div style={{fontSize:10,color:n.col,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{n.t}</div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>{n.c}</div>
          </div>)}
      </div>
    </div>;}

  if(wp.id==="a5")return<div><ST t={"Understanding the Entity & Its Environment — ISA 315 · "+ind.l} color={C.pln}/>
      <div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:16,border:"1px solid rgba(21,101,192,0.2)",marginBottom:16,borderLeft:"4px solid "+C.blu}}>
        <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Entity Background (ISA 315.11)</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
          {[{l:"Entity",v:cfg.entityName||"[Not set]"},{l:"Industry",v:ind.l+" — "+cfg.sector},{l:"Framework",v:fw?.l||"[Not set]"},{l:"Engagement",v:cfg.engagementType||"statutory"}].map((m,i)=><div key={i} style={{padding:8,borderRadius:6,background:"rgba(255,255,255,0.04)",textAlign:"center"}}><div style={{fontSize:9,color:C.blu,fontWeight:600,textTransform:"uppercase"}}>{m.l}</div><div style={{fontSize:12,color:C.tx,fontWeight:500,marginTop:2}}>{m.v}</div></div>)}
        </div>
      </div>
      <ST t="Key Accounting Policies" color={C.pln}/>
      <BoundET id="a5_policies" headers={["Policy Area","Current Policy","Framework Ref","Changed in Year?","Appropriateness"]} rows={[
        "Revenue recognition","Depreciation (useful lives & method)","Inventory valuation","Financial instruments classification","Lease accounting","Provisions & contingencies","Foreign currency translation","Government grants"
      ].map(p=>[<span style={{color:C.tx,fontWeight:500}}>{p}</span>,"","","",""])} editable={[1,2,3,4]}/>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.pln,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Changes Since Prior Year (ISA 315.11(a))</div>
        <textarea value={wpNotes["a5_changes"]||""} onChange={e=>setWpNotes(p=>({...p,a5_changes:e.target.value}))} style={{...inp,minHeight:50,resize:"vertical"}} placeholder="Document any significant changes to the entity, its operations, accounting policies, or internal control since the prior year audit..."/></div>
      <div style={{marginTop:20}}><ST t="Industry KPI Analysis" color={C.blu}/></div>
      <BoundET id="kpi" headers={["KPI","CY","PY","Movement %","Commentary"]} rows={ind.k.map(k=>[<span style={{color:C.tx,fontWeight:500}}>{k}</span>,"","","",""])} editable={[1,2,3,4]}/>
      <div style={{marginTop:20}}><ST t="Key Controls (ISA 315.14)" color={C.tl}/></div>
      <BoundET id="a5c" headers={["Control","Design Effective?","Operating Effective?","Reliance?","Evidence"]} rows={ind.ct.map(c=>[<span style={{color:C.tx}}>{c}</span>,"","","",""])} editable={[1,2,3,4]}/>
      <div style={{marginTop:20}}><ST t="Going Concern Indicators (ISA 315 / ISA 570)" color={C.org}/></div>
      <BoundET id="a5_gc" headers={["Indicator","Assessment","Risk Level","Evidence"]} rows={ind.gc.map(g=>[<span style={{color:C.tx}}>{g}</span>,"","",""])} editable={[1,2,3]}/>
      <div style={{marginTop:20}}><ST t="Regulatory Environment" color={C.pur}/></div>
      <BoundET id="a5_reg" headers={["Law / Regulation","Compliance Confirmed?","Evidence"]} rows={ind.lw.map(l=>[<span style={{color:C.tx}}>{l}</span>,"",""])} editable={[1,2]}/>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Conclusion (ISA 315.11)</div>
        <textarea value={wpNotes["a5_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,a5_conclusion:e.target.value}))} style={{...inp,minHeight:50,resize:"vertical"}} placeholder="Based on our understanding of the entity and its environment, we have identified the key risks of material misstatement as documented in B1. The entity's internal control environment is assessed as [adequate/requires improvement]..."/></div>
    </div>;

  if(wp.id==="a6")return<div><ST t="Fraud Risk Assessment — ISA 240" color={C.red}/>
      {FRAUD_PRESUMPTIONS.map((fp,i)=><div key={i} style={{background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.red}}>
        <div style={{fontSize:11,color:C.red,fontWeight:700,marginBottom:4}}>⚠ {fp.isa} — PRESUMED FRAUD RISK</div>
        <div style={{fontSize:13,color:C.tx,fontWeight:500,marginBottom:6}}>{fp.risk}</div>
        <div style={{fontSize:12,color:C.dim,marginBottom:4}}><b style={{color:C.org}}>Rebuttal:</b> {fp.rebuttal}</div>
        <div style={{fontSize:12,color:C.dim}}><b style={{color:C.grn}}>Planned response:</b> {fp.response}</div>
      </div>)}
      <div style={{marginTop:8}}><ST t="Journal Entry Testing Criteria (ISA 240.32(a))" color={C.org}/></div>
      <div style={{background:C.card,borderRadius:10,padding:16,border:"1px solid "+C.brd,marginBottom:20}}>
        <div style={{fontSize:10,color:C.fnt,fontStyle:"italic",marginBottom:10}}>{JOURNAL_ENTRY_TESTING.isa_ref}</div>
        <BoundET id="a6_jet" headers={["#","Selection Criterion","Tested?","Exceptions","Comment"]} rows={JOURNAL_ENTRY_TESTING.criteria.map((c,i)=>[i+1,<span style={{color:C.tx}}>{c}</span>,"","",""])} editable={[2,3,4]}/>
      </div>
      <ST t="Industry Significant Risks" color={C.red}/>
      <BoundET id="a6_risks" headers={["Ref","Risk","Level","ISA","Response","WP Ref","Conclusion"]} rows={ind.r.filter(r=>r.lv==="SIGNIFICANT").map(r=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{r.id}</span>,<span style={{color:C.tx}}>{r.t}</span>,<Badge level="SIGNIFICANT"/>,<span style={{fontSize:10,fontStyle:"italic"}}>{r.isa}</span>,r.rs||"","",""])} editable={[4,5,6]}/>
    </div>;

  if(wp.id==="a7"){const gc=GOING_CONCERN;
      const gcMonths=["Month 1","Month 2","Month 3","Month 4","Month 5","Month 6","Month 7","Month 8","Month 9","Month 10","Month 11","Month 12"];
      const gcScoring=[
        {cat:"Financial",indicators:gc.financial_indicators,weight:3},
        {cat:"Operating",indicators:gc.operating_indicators,weight:2}
      ];
      const gcDecisionTree=[
        {scenario:"No material uncertainty identified",indicators:"No financial or operating indicators present; forecasts show adequate cash flow; covenants met; no adverse events",reportImpact:"Unmodified opinion",isa:"ISA 570.17",color:C.grn},
        {scenario:"Material uncertainty — adequate disclosure",indicators:"One or more indicators present but entity remains going concern; adequate disclosure of material uncertainty in notes",reportImpact:"Unmodified opinion with Material Uncertainty related to Going Concern (MUCGC) paragraph",isa:"ISA 570.22",color:C.org},
        {scenario:"Material uncertainty — inadequate disclosure",indicators:"Material uncertainty exists but entity refuses to make adequate disclosure in financial statements",reportImpact:"Qualified or Adverse opinion depending on pervasiveness",isa:"ISA 570.23; ISA 705",color:C.red},
        {scenario:"Going concern basis inappropriate",indicators:"Entity will cease trading or has no realistic alternative to doing so; financial statements still prepared on going concern basis",reportImpact:"Adverse opinion",isa:"ISA 570.21",color:C.red},
        {scenario:"Going concern basis appropriate but significant doubt",indicators:"Multiple indicators present but management's plans appear feasible; very close judgement call",reportImpact:"Consider Emphasis of Matter paragraph (ISA 706) or MUCGC depending on severity",isa:"ISA 570.19; ISA 706",color:C.org},
        {scenario:"Management unwilling to make or extend assessment",indicators:"Management refuses to make or extend its going concern assessment beyond 12 months when requested by the auditor",reportImpact:"Consider qualification for scope limitation",isa:"ISA 570.24; ISA 705",color:C.red}
      ];
      return<div><ST t="Going Concern Assessment — ISA 570" color={C.cmp}/>
      <div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:14,border:"1px solid rgba(21,101,192,0.2)",marginBottom:20,borderLeft:"4px solid "+C.blu}}>
        <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Assessment Period (ISA 570.13)</div>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.6}}>{gc.assessment_period}</div>
      </div>

      <ST t="Going Concern Indicators — Scoring Matrix" color={C.red}/>
      <div style={{background:"rgba(239,83,80,0.04)",border:"1px solid rgba(239,83,80,0.15)",borderRadius:10,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Score each indicator: 0 = Not present, 1 = Minor concern, 2 = Moderate concern, 3 = Significant concern. Total score guides the assessment conclusion.</div>
        {gcScoring.map((cat,ci)=><div key={ci} style={{marginBottom:ci<gcScoring.length-1?16:0}}>
          <div style={{fontSize:10,color:ci===0?C.red:C.org,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{cat.cat} Indicators (Weight: ×{cat.weight})</div>
          <BoundET id={"a7_score_"+ci} headers={["#","Indicator","Score (0-3)","Weighted","Evidence","Mitigating Factors"]} rows={cat.indicators.map((ind2,i)=>[i+1,<span style={{color:C.tx}}>{ind2}</span>,"","","",""])} editable={[2,3,4,5]}/>
        </div>)}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:16}}>
          {[{l:"Total Score",desc:"Sum all weighted scores",c:C.acc},{l:"Risk Level",desc:"0-5: Low | 6-15: Medium | 16+: High",c:C.org},{l:"Conclusion",desc:"Document overall assessment",c:C.red}].map((m,i)=><div key={i} style={{padding:"12px 14px",borderRadius:8,background:m.c+"0D",border:"1px solid "+m.c+"33"}}>
            <div style={{fontSize:9,color:m.c,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{m.l}</div>
            <div style={{fontSize:10,color:C.dim,marginTop:2}}>{m.desc}</div>
            <textarea value={wpNotes["a7_"+m.l.toLowerCase().replace(/ /g,"_")]||""} onChange={e=>setWpNotes(p=>({...p,["a7_"+m.l.toLowerCase().replace(/ /g,"_")]:e.target.value}))} style={{...inp,minHeight:30,marginTop:6,fontSize:11}} placeholder={"Enter "+m.l.toLowerCase()+"..."}/>
          </div>)}
        </div>
      </div>

      <ST t="Cash Flow Forecast Evaluation — 12-Month Projection" color={C.blu}/>
      <div style={{background:"rgba(21,101,192,0.04)",border:"1px solid rgba(21,101,192,0.15)",borderRadius:10,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Evaluate management's cash flow forecast for at least 12 months from the date of approval of the financial statements (ISA 570.13). Test the reliability of the underlying data (ISA 570.16(c)).</div>
        <BoundET id="a7_cashflow" headers={["","M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","Total"]} rows={[
          [<span style={{color:C.tx,fontWeight:600}}>Opening cash</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.grn}}>Cash receipts — trading</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.grn}}>Cash receipts — other</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — trading</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — payroll</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — overheads</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — tax</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — loan repayments</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.red}}>Cash payments — capex</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.acc,fontWeight:600}}>Net cash flow</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.tx,fontWeight:600}}>Closing cash</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.pur,fontWeight:600}}>Available facilities</span>,...gcMonths.map(()=>""),""],
          [<span style={{color:C.blu,fontWeight:600}}>Headroom (cash + facilities)</span>,...gcMonths.map(()=>""),""]
        ]} editable={[1,2,3,4,5,6,7,8,9,10,11,12,13]}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
          <div style={{background:C.card,borderRadius:8,padding:12,border:"1px solid "+C.brd}}>
            <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:4}}>Auditor's Assessment of Forecast Reliability</div>
            <textarea value={wpNotes.a7_forecast_reliability||""} onChange={e=>setWpNotes(p=>({...p,a7_forecast_reliability:e.target.value}))} style={{...inp,minHeight:60,fontSize:11}} placeholder="Assess: Are assumptions reasonable? Historical accuracy of management forecasts? Key sensitivities? Worst-case scenario impact?"/>
          </div>
          <div style={{background:C.card,borderRadius:8,padding:12,border:"1px solid "+C.brd}}>
            <div style={{fontSize:10,color:C.org,fontWeight:700,marginBottom:4}}>Sensitivity Analysis</div>
            <textarea value={wpNotes.a7_sensitivity||""} onChange={e=>setWpNotes(p=>({...p,a7_sensitivity:e.target.value}))} style={{...inp,minHeight:60,fontSize:11}} placeholder="Key sensitivities: Revenue -10%, -20%; Cost increase +10%; Debtor days increase by 15; Loss of key customer; Interest rate rise..."/>
          </div>
        </div>
      </div>

      <ST t="Covenant Testing Worksheet" color={C.pur}/>
      <div style={{background:"rgba(206,147,216,0.04)",border:"1px solid rgba(206,147,216,0.15)",borderRadius:10,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Test compliance with all financial covenants in loan agreements. Covenant breach may trigger going concern assessment and require disclosure.</div>
        <BoundET id="a7_covenants" headers={["Covenant","Lender","Required Level","Actual Level","Compliant?","Headroom","Breach Consequence","Waiver Obtained?"]} rows={[
          ["Interest cover ratio","","","","","","",""],
          ["Net debt / EBITDA","","","","","","",""],
          ["Current ratio","","","","","","",""],
          ["Net worth minimum","","","","","","",""],
          ["Capital expenditure limit","","","","","","",""],
          ["Dividend restriction","","","","","","",""]
        ]} editable={[0,1,2,3,4,5,6,7]}/>
        <div style={{marginTop:8}}>
          <textarea value={wpNotes.a7_covenant_conclusion||""} onChange={e=>setWpNotes(p=>({...p,a7_covenant_conclusion:e.target.value}))} style={{...inp,minHeight:40,fontSize:11}} placeholder="Covenant compliance conclusion: All covenants met / Breach identified — describe and assess impact on going concern..."/>
        </div>
      </div>

      <ST t="Financial Indicators" color={C.red}/>
      <BoundET id="a7_fin" headers={["#","Financial Indicator","Present?","Evidence","Impact Assessment"]} rows={gc.financial_indicators.map((fi,i)=>[i+1,<span style={{color:C.tx}}>{fi}</span>,"","",""])} editable={[2,3,4]}/>
      <div style={{marginTop:20}}><ST t="Operating Indicators" color={C.org}/></div>
      <BoundET id="a7_ops" headers={["#","Operating Indicator","Present?","Evidence","Impact Assessment"]} rows={gc.operating_indicators.map((oi,i)=>[i+1,<span style={{color:C.tx}}>{oi}</span>,"","",""])} editable={[2,3,4]}/>
      <div style={{marginTop:20}}><ST t="Industry-Specific Going Concern Factors" color={C.tl}/></div>
      <BoundET id="a7_ind" headers={["#","Industry Factor","Assessment","Evidence","Conclusion"]} rows={ind.gc.map((g,i)=>[i+1,<span style={{color:C.tx}}>{g}</span>,"","",""])} editable={[2,3,4]}/>

      <div style={{marginTop:20}}><ST t="Post Balance Sheet Events — Going Concern Impact" color={C.org}/></div>
      <div style={{background:"rgba(255,167,38,0.04)",border:"1px solid rgba(255,167,38,0.15)",borderRadius:10,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Identify events after the reporting date that may affect the going concern assessment (ISA 560 / ISA 570.15). Consider whether any events provide evidence of conditions that existed at the reporting date.</div>
        <BoundET id="a7_pbs" headers={["Date","Event Description","Type 1/Type 2","Going Concern Impact?","Action Required","Assessed By"]} rows={[
          ["","","","","",""],["","","","","",""],["","","","","",""],["","","","","",""]
        ]} editable={[0,1,2,3,4,5]}/>
      </div>

      <div style={{marginTop:20}}><ST t="Auditor Procedures (ISA 570.12-16)" color={C.blu}/></div>
      <BoundET id="a7_proc" headers={["#","Required Procedure","ISA Ref","Performed?","Date","Conclusion"]} rows={gc.auditor_procedures.map((p,i)=>{const m=p.match(/\(ISA[^)]+\)/);return[i+1,<span style={{color:C.tx}}>{p.replace(m?.[0]||"","").trim()}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{m?.[0]||""}</span>,"","",""]})} editable={[3,4,5]}/>

      <div style={{marginTop:20}}><ST t="Report Impact — Decision Tree (ISA 570/700/705/706)" color={C.acc}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {gcDecisionTree.map((dt,i)=><div key={i} style={{background:dt.color+"0D",border:"1px solid "+dt.color+"33",borderRadius:10,padding:14,borderLeft:"4px solid "+dt.color}}>
          <div style={{fontSize:11,color:dt.color,fontWeight:700,marginBottom:4}}>{dt.scenario}</div>
          <div style={{fontSize:9,color:C.fnt,fontStyle:"italic",marginBottom:6}}>{dt.isa}</div>
          <div style={{fontSize:10,color:C.dim,lineHeight:1.5,marginBottom:6}}>{dt.indicators}</div>
          <div style={{fontSize:10,color:C.tx,fontWeight:600,padding:"4px 8px",borderRadius:4,background:dt.color+"15",display:"inline-block"}}>{dt.reportImpact}</div>
        </div>)}
      </div>

      <div style={{marginTop:4}}><ST t="Going Concern — Overall Conclusion" color={C.cmp}/></div>
      <div style={{background:C.card,borderRadius:10,padding:16,border:"1px solid "+C.brd}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:4}}>Going concern basis appropriate?</div>
            <select value={wpNotes.a7_gc_appropriate||""} onChange={e=>setWpNotes(p=>({...p,a7_gc_appropriate:e.target.value}))} style={{...inp,fontSize:11}}>
              <option value="">— Select —</option>
              <option value="yes_no_mucgc">Yes — no material uncertainty</option>
              <option value="yes_mucgc">Yes — but material uncertainty exists (MUCGC required)</option>
              <option value="no">No — going concern basis not appropriate</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:4}}>Report impact</div>
            <select value={wpNotes.a7_report_impact||""} onChange={e=>setWpNotes(p=>({...p,a7_report_impact:e.target.value}))} style={{...inp,fontSize:11}}>
              <option value="">— Select —</option>
              <option value="unmodified">Unmodified opinion — no going concern issue</option>
              <option value="mucgc">Unmodified with MUCGC paragraph (ISA 570.22)</option>
              <option value="emphasis">Emphasis of matter (ISA 706)</option>
              <option value="qualified">Qualified opinion (ISA 705)</option>
              <option value="adverse">Adverse opinion (ISA 570.21 / ISA 705)</option>
              <option value="disclaimer">Disclaimer of opinion (ISA 705)</option>
            </select>
          </div>
        </div>
        <textarea value={wpNotes.a7_overall_conclusion||""} onChange={e=>setWpNotes(p=>({...p,a7_overall_conclusion:e.target.value}))} style={{...inp,minHeight:80,fontSize:11}} placeholder="Document overall going concern conclusion: Based on our procedures including review of management's assessment, cash flow forecasts, covenant compliance, and post balance sheet events, we conclude that..."/>
      </div>
    </div>;}

  if(wp.id==="a8"){
      const a8Ratios=[
        {n:"Gross Margin %",f:"Gross Profit / Revenue × 100",b:"Industry dependent",s:"Indicates pricing pressure, cost control"},
        {n:"Operating Margin %",f:"Operating Profit / Revenue × 100",b:"Industry dependent",s:"Reflects operational efficiency"},
        {n:"Current Ratio",f:"Current Assets / Current Liabilities",b:">1.0",s:"Short-term liquidity; <1.0 may indicate GC risk"},
        {n:"Quick Ratio",f:"(CA - Inventory) / CL",b:">0.8",s:"Excludes inventory — conservative liquidity"},
        {n:"Debtor Days",f:"Trade Receivables / Revenue × 365",b:"30-90 days",s:"Lengthening may indicate recoverability/recognition issues"},
        {n:"Creditor Days",f:"Trade Payables / COS × 365",b:"30-60 days",s:"Shortening indicates cash pressure; lengthening may indicate GC"},
        {n:"Stock Turn Days",f:"Inventory / COS × 365",b:"Industry dependent",s:"Increasing may indicate obsolescence"},
        {n:"Gearing Ratio",f:"Total Debt / Total Equity × 100",b:"<100%",s:"High gearing = financial risk, covenant breach"},
        {n:"Interest Cover",f:"Operating Profit / Finance Costs",b:">3.0×",s:"Low cover = difficulty servicing debt"},
        {n:"Return on Equity",f:"PAT / Equity × 100",b:">10%",s:"Declining returns may indicate impairment"},
        {n:"Revenue Growth %",f:"(CY Rev - PY Rev) / PY Rev × 100",b:"Positive",s:"Significant change triggers ISA 240.26"},
        {n:"Staff Costs / Revenue",f:"Staff Costs / Revenue × 100",b:"Industry dependent",s:"Changes may indicate payroll fraud or misallocation"}
      ];
      return<div>
        <ST t="Analytical Review (Planning Stage) — ISA 520" color={C.pln}/>
        <div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:16,border:"1px solid rgba(21,101,192,0.2)",marginBottom:16,borderLeft:"4px solid "+C.blu}}>
          <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>ISA 520 Requirement</div>
          <div style={{fontSize:12,color:C.dim,lineHeight:1.6}}>At the planning stage, analytical procedures help identify unusual transactions, amounts, ratios and trends that may indicate matters with audit significance (ISA 520.5). The auditor shall design and perform analytical procedures near the end of the audit that assist when forming an overall conclusion (ISA 520.6).</div>
        </div>
        <ST t="Ratio Analysis — CY vs PY Comparison" color={C.blu}/>
        <BoundET id="a8_ratios" headers={["Ratio","Formula","CY","PY","Movement","Benchmark","Commentary","Investigate?"]} rows={a8Ratios.map(r=>[<span style={{color:C.tx,fontWeight:500}}>{r.n}</span>,<span style={{fontSize:10,color:C.fnt}}>{r.f}</span>,"","","",<span style={{fontSize:10,color:C.acc}}>{r.b}</span>,"",""])} editable={[2,3,4,6,7]}/>
        <div style={{marginTop:20}}><ST t="Industry KPI Analysis" color={C.tl}/></div>
        <BoundET id="a8_kpi" headers={["KPI","CY","PY","Industry Avg","Variance","Significant?","Comment"]} rows={ind.k.map(k=>[<span style={{color:C.tx,fontWeight:500}}>{k}</span>,"","","","","",""])} editable={[1,2,3,4,5,6]}/>
        <div style={{marginTop:20}}><ST t="Revenue Analysis by Quarter" color={C.org}/></div>
        <BoundET id="a8_rev" headers={["Period","PY (£)","CY (£)","Movement (£)","Movement %","Commentary"]} rows={["Q1 (Apr-Jun)","Q2 (Jul-Sep)","Q3 (Oct-Dec)","Q4 (Jan-Mar)","TOTAL"].map(q=>[<span style={{color:C.tx,fontWeight:q==="TOTAL"?700:500}}>{q}</span>,"","","","",""])} editable={[1,2,3,4,5]}/>
        <div style={{marginTop:20}}><ST t="Expectation vs Actual Analysis (ISA 520.5)" color={C.grn}/></div>
        <div style={{background:"rgba(102,187,106,0.06)",border:"1px solid rgba(102,187,106,0.2)",borderRadius:10,padding:14,marginBottom:12,borderLeft:"4px solid "+C.grn}}>
          <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>Develop expectations using prior year data, budgets, industry benchmarks, and known changes. Investigate differences exceeding performance materiality (£{cfg.perfMateriality||"TBD"}).</div>
        </div>
        <BoundET id="a8_expect" headers={["Account/Balance","Expected (£)","Actual (£)","Difference (£)","Diff %","Exceeds PM?","Explanation"]} rows={["Revenue","Cost of Sales","Staff Costs","Other Operating Expenses","Depreciation","Finance Costs","Trade Receivables","Trade Payables","Cash and Bank","Fixed Assets (NBV)","Inventory","Provisions"].map(a=>[<span style={{color:C.tx,fontWeight:500}}>{a}</span>,"","","","","",""])} editable={[1,2,3,4,5,6]}/>
        <div style={{marginTop:20}}><ST t="Conclusion" color={C.acc}/></div>
        <textarea value={wpNotes["a8_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,a8_conclusion:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="Summarise findings from planning-stage analytical review. Note areas requiring further investigation during fieldwork. State whether analytical procedures have identified any unusual or unexpected relationships that may indicate risks of material misstatement (ISA 520.5)..."/>
      </div>}

  if(wp.id==="a9")return<div><ST t="Laws & Regulations — ISA 250A & ISA 250B" color={C.pln}/>
      <div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:14,border:"1px solid rgba(21,101,192,0.2)",marginBottom:16,borderLeft:"4px solid "+C.blu}}>
        <div style={{fontSize:10,color:C.blu,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>ISA 250A — Laws with Direct Effect on FS</div>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>Obtain sufficient appropriate audit evidence regarding compliance with provisions of those laws and regulations generally recognised to have a direct effect on the determination of material amounts and disclosures (ISA 250.12).</div>
      </div>
      <ST t="Direct-Effect Laws (Determine FS Amounts)" color={C.pln}/>
      <BoundET id="a9_direct" headers={["Law / Regulation","Category","Applicable?","Compliance Confirmed","Source of Evidence","Comments"]} rows={[
        ["Companies Act 2006 (accounting provisions)","Direct","Yes","","",""],
        ["Tax legislation (CTA 2009, ITEPA 2003, VATA 1994)","Direct","Yes","","",""],
        ["Employment law (wages, NIC, holiday pay)","Direct","Yes","","",""],
        ["Pension regulations (auto-enrolment)","Direct","Yes","","",""]
      ].map(r=>[<span style={{color:C.tx}}>{r[0]}</span>,<span style={{fontSize:10,color:C.blu,fontWeight:600}}>{r[1]}</span>,r[2],"","",""])} editable={[2,3,4,5]}/>
      <div style={{marginTop:20}}><ST t="Industry-Specific & Indirect Laws" color={C.org}/></div>
      <BoundET id="a9_indirect" headers={["Law / Regulation","Category","Applicable?","Compliance Confirmed","Source of Evidence","Comments"]} rows={[
        ...ind.lw.map(l=>[l,l.includes("Companies")?"Direct":"Indirect","Yes","","",""]),
        ["H&S at Work Act 1974","Indirect","Yes","","",""],
        ["Equality Act 2010","Indirect","Yes","","",""],
        ["GDPR / Data Protection Act 2018","Indirect","Yes","","",""],
        ["Bribery Act 2010","Indirect","Yes","","",""],
        ["Modern Slavery Act 2015","Indirect","","","",""]
      ].map(r=>[<span style={{color:C.tx}}>{r[0]}</span>,<span style={{fontSize:10,color:r[1]==="Direct"?C.blu:C.org,fontWeight:600}}>{r[1]}</span>,r[2],"","",""])} editable={[2,3,4,5]}/>
      <div style={{marginTop:20}}><ST t="ISA 250B — Anti-Money Laundering (POCCA 2002 / Terrorism Act 2000)" color={C.red}/></div>
      <div style={{background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",borderRadius:10,padding:14,marginBottom:12,borderLeft:"4px solid "+C.red}}>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>The auditor has a duty under UK law to report suspicions of money laundering to the National Crime Agency (NCA). Consider client due diligence, suspicious activity indicators, and SAR reporting obligations.</div>
      </div>
      <BoundET id="a9_cdd" headers={["CDD Requirement","Completed?","Date","Evidence","Comments"]} rows={[
        "Beneficial owner(s) identified and verified","Client identity verified via reliable, independent source","Source of funds and wealth understood","PEP (Politically Exposed Person) check completed","Sanctions screening (OFSI/HMT) completed","Adverse media check completed"
      ].map(c=>[<span style={{color:C.tx}}>{c}</span>,"","","",""])} editable={[1,2,3,4]}/>
      <div style={{marginTop:16}}><ST t="Suspicious Activity Indicators" color={C.red}/></div>
      <BoundET id="a9_sai" headers={["Indicator","Present?","Risk Assessment","Action Taken"]} rows={[
        "Unusual cash transactions inconsistent with business","Complex structures with no clear commercial purpose","Reluctance to provide information or unusual secrecy","Transactions inconsistent with known business profile","Last-minute changes to payment instructions","Use of nominee arrangements without clear reason","Significant unexplained wealth or lifestyle","Connections to high-risk jurisdictions (FATF grey/black list)","Round-sum transactions at unusual values","Unexplained movements through client account"
      ].map(s=>[<span style={{color:C.tx}}>{s}</span>,"","",""])} editable={[1,2,3]}/>
      <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>SAR Reporting Considerations</div>
          <textarea value={wpNotes["a9_sar"]||""} onChange={e=>setWpNotes(p=>({...p,a9_sar:e.target.value}))} style={{...inp,minHeight:50,resize:"vertical"}} placeholder="Document whether any suspicious activity identified requires a SAR to be filed with the NCA. Note: Tipping off is a criminal offence (POCA s333A)..."/></div>
        <div><div style={{fontSize:10,color:C.pln,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Firm AML Policy Compliance</div>
          <textarea value={wpNotes["a9_aml_policy"]||""} onChange={e=>setWpNotes(p=>({...p,a9_aml_policy:e.target.value}))} style={{...inp,minHeight:50,resize:"vertical"}} placeholder="Confirm compliance with firm's AML policies and procedures. MLRO has been consulted on any matters of concern..."/></div>
      </div>
    </div>;

  if(wp.id==="a10")return<div><ST t="Group Audit — ISA 600" color={C.pln}/>
      {cfg.groupParent&&<div style={{background:"rgba(99,102,241,0.06)",borderRadius:10,padding:14,border:"1px solid rgba(99,102,241,0.2)",marginBottom:16,borderLeft:"4px solid #818CF8"}}>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.8}}><b style={{color:C.tx}}>Parent Entity:</b> {cfg.groupParent} · <b style={{color:C.tx}}>Component Materiality:</b> £{cfg.groupCompMateriality||"TBD"}</div>
        {cfg.groupComponents&&<div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{cfg.groupComponents.split(",").map((c,i)=><span key={i} style={{padding:"4px 10px",borderRadius:4,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",fontSize:11,color:"#A5B4FC"}}>{c.trim()}</span>)}</div>}
      </div>}
      {cfg.groupComponents&&<><ST t="Component Analysis (ISA 600.19)" color={"#818CF8"}/><BoundET id="a10_comp" headers={["Component","Significance","Scope","Component Materiality (£)","Component Auditor","Instructions Sent","Response Received"]} rows={cfg.groupComponents.split(",").map(c=>[<span style={{color:C.tx,fontWeight:500}}>{c.trim()}</span>,"","Full/Specific/Analytical","","","",""])} editable={[1,2,3,4,5,6]}/><div style={{marginTop:20}}/></>}
      <ST t="Group Audit Considerations" color={C.pln}/>
      <BoundET id="a10" headers={["Consideration","ISA Ref","Assessment","Response"]} rows={[["Group structure complexity","ISA 600.12","",""],["Component auditors — competence and independence","ISA 600.19","",""],["Intercompany transactions and eliminations","ISA 600.34","",""],["Consolidation adjustments","ISA 600.34","",""],["Group materiality allocation to components","ISA 600.21","",""],["Communication with component auditors","ISA 600.40","",""],["Access to component auditor working papers","ISA 600.42","",""]]} editable={[2,3]}/>
    </div>;

  return null;
}
