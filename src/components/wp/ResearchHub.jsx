import { useState } from "react";
import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";

export default function ResearchHub() {
  const { arMod } = useEngagement();
  const { _ST } = useAuditHelpers();
  const[resTab,setResTab]=useState("assertions");
  let resContent=null;
  if(arMod){
    const AR=arMod;
    const resTabs=[
      {k:"assertions",l:"Assertions (ISA 315)",c:C.pln},
      {k:"evidence",l:"Evidence (ISA 500)",c:C.blu},
      {k:"sampling",l:"Sampling (ISA 530)",c:C.tl},
      {k:"estimates",l:"Estimates (ISA 540)",c:C.org},
      {k:"fraud",l:"Fraud (ISA 240)",c:C.red},
      {k:"going_concern",l:"Going Concern (ISA 570)",c:C.pur},
      {k:"group",l:"Group Audit (ISA 600)",c:"#818CF8"}
    ];
    resContent=<div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {resTabs.map(t=><button key={t.k} onClick={()=>setResTab(t.k)} style={{padding:"8px 16px",borderRadius:8,background:resTab===t.k?t.c+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(resTab===t.k?t.c+"66":"rgba(255,255,255,0.08)"),color:resTab===t.k?t.c:C.dim,cursor:"pointer",fontSize:11,fontWeight:resTab===t.k?700:400,transition:"all 0.2s ease"}}>{t.l}</button>)}
      </div>
      {resTab==="assertions"&&AR.AUDIT_ASSERTIONS&&<div>
        <ST t="Financial Statement Assertions — ISA 315 (Revised 2019)" color={C.pln}/>
        <div style={{fontSize:11,color:C.dim,marginBottom:16}}>13 assertions across three categories: Classes of Transactions, Account Balances, and Presentation & Disclosure.</div>
        {["Classes of Transactions & Events","Account Balances at Period End","Presentation & Disclosure"].map(cat=>{
          const items=AR.AUDIT_ASSERTIONS.filter(a=>a.category===cat);
          if(!items.length)return null;
          return<div key={cat} style={{marginBottom:20}}>
            <div style={{fontSize:12,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,paddingBottom:6,borderBottom:"1px solid "+C.acc+"33"}}>{cat}</div>
            {items.map(a=><div key={a.id} style={{background:C.card,border:"1px solid "+C.brd,borderRadius:8,padding:14,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontFamily:"monospace",color:C.acc,fontWeight:700,fontSize:10}}>{a.id}</span>
                <span style={{fontSize:13,color:C.tx,fontWeight:600}}>{a.name}</span>
                <span style={{fontSize:9,color:C.fnt,fontStyle:"italic"}}>{a.isaRef}</span>
              </div>
              <div style={{fontSize:12,color:C.dim,lineHeight:1.6,marginBottom:8}}>{a.definition}</div>
              {a.typicalProcedures&&a.typicalProcedures.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{a.typicalProcedures.slice(0,3).map((p,i)=><span key={i} style={{padding:"3px 8px",borderRadius:4,background:"rgba(255,255,255,0.03)",border:"1px solid "+C.brd,fontSize:9,color:C.dim}}>{p}</span>)}</div>}
            </div>)}
          </div>;
        })}
      </div>}
      {resTab==="evidence"&&AR.EVIDENCE_HIERARCHY&&<div>
        <ST t="Audit Evidence Hierarchy — ISA 500" color={C.blu}/>
        {AR.EVIDENCE_HIERARCHY.map(e=><div key={e.rank} style={{display:"flex",gap:12,marginBottom:10,padding:12,borderRadius:8,background:C.card,border:"1px solid "+C.brd}}>
          <div style={{width:36,height:36,borderRadius:8,background:e.reliability==="High"?C.grn+"22":e.reliability==="Medium"?C.org+"22":C.red+"22",border:"1px solid "+(e.reliability==="High"?C.grn:e.reliability==="Medium"?C.org:C.red)+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:e.reliability==="High"?C.grn:e.reliability==="Medium"?C.org:C.red,flexShrink:0}}>{e.rank}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:C.tx,fontWeight:600}}>{e.type} <span style={{fontSize:9,color:C.fnt}}>({e.reliability} reliability)</span></div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.5,marginTop:4}}>{e.description}</div>
          </div>
        </div>)}
      </div>}
      {resTab==="sampling"&&AR.SAMPLING_GUIDANCE&&<div>
        <ST t="Audit Sampling — ISA 530" color={C.tl}/>
        {AR.SAMPLING_GUIDANCE.statisticalMethods&&<div>
          <div style={{fontSize:12,color:C.tl,fontWeight:700,marginBottom:10}}>Statistical Methods</div>
          {AR.SAMPLING_GUIDANCE.statisticalMethods.map((m,i)=><div key={i} style={{background:C.card,border:"1px solid "+C.brd,borderRadius:8,padding:14,marginBottom:8}}>
            <div style={{fontSize:13,color:C.tx,fontWeight:600}}>{m.name||m.method}</div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.5,marginTop:4}}>{m.description||m.formula}</div>
          </div>)}
        </div>}
        {AR.SAMPLING_GUIDANCE.minimumSamples&&<div style={{marginTop:16}}>
          <div style={{fontSize:12,color:C.tl,fontWeight:700,marginBottom:10}}>Minimum Sample Sizes</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {(Array.isArray(AR.SAMPLING_GUIDANCE.minimumSamples)?AR.SAMPLING_GUIDANCE.minimumSamples:Object.entries(AR.SAMPLING_GUIDANCE.minimumSamples).map(([k,v])=>({population:k,minimum:v}))).map((m,i)=><div key={i} style={{padding:10,borderRadius:6,background:C.tl+"0D",border:"1px solid "+C.tl+"33",textAlign:"center"}}>
              <div style={{fontSize:10,color:C.tl,fontWeight:600}}>{m.population||m.populationRange}</div>
              <div style={{fontSize:16,color:C.tx,fontWeight:700}}>{m.minimum||m.sampleSize}</div>
            </div>)}
          </div>
        </div>}
      </div>}
      {resTab==="estimates"&&AR.ESTIMATES_FRAMEWORK&&<div>
        <ST t="Auditing Accounting Estimates — ISA 540 (Revised)" color={C.org}/>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.6,marginBottom:16}}>{AR.ESTIMATES_FRAMEWORK.overview||"ISA 540 (Revised) requires the auditor to obtain sufficient appropriate audit evidence about whether accounting estimates and related disclosures are reasonable."}</div>
        {AR.ESTIMATES_FRAMEWORK.spectrumOfInherentRisk&&<div style={{marginBottom:16}}>
          <div style={{fontSize:12,color:C.org,fontWeight:700,marginBottom:8}}>Spectrum of Inherent Risk</div>
          {AR.ESTIMATES_FRAMEWORK.spectrumOfInherentRisk.map((r,i)=><div key={i} style={{padding:"6px 12px",borderRadius:6,background:C.org+"0D",border:"1px solid "+C.org+"33",marginBottom:4,fontSize:11,color:C.dim}}>{typeof r==="string"?r:r.level+" — "+r.description}</div>)}
        </div>}
      </div>}
      {resTab==="fraud"&&AR.FRAUD_FRAMEWORK&&<div>
        <ST t="Fraud Risk Assessment — ISA 240" color={C.red}/>
        {AR.FRAUD_FRAMEWORK.fraudTriangle&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
          {Object.entries(AR.FRAUD_FRAMEWORK.fraudTriangle).map(([k,v])=><div key={k} style={{padding:14,borderRadius:8,background:C.red+"0D",border:"1px solid "+C.red+"33",textAlign:"center"}}>
            <div style={{fontSize:12,color:C.red,fontWeight:700,textTransform:"capitalize",marginBottom:6}}>{k}</div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.5}}>{typeof v==="string"?v:Array.isArray(v)?v.slice(0,3).join("; "):JSON.stringify(v).slice(0,100)}</div>
          </div>)}
        </div>}
        {AR.FRAUD_FRAMEWORK.presumedRisks&&<div>
          <div style={{fontSize:12,color:C.red,fontWeight:700,marginBottom:8}}>Presumed Fraud Risks</div>
          {AR.FRAUD_FRAMEWORK.presumedRisks.map((r,i)=><div key={i} style={{padding:10,borderRadius:6,background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",marginBottom:6,fontSize:11,color:C.dim,borderLeft:"4px solid "+C.red}}>{typeof r==="string"?r:r.risk||r.description}</div>)}
        </div>}
      </div>}
      {resTab==="going_concern"&&AR.GOING_CONCERN_FRAMEWORK&&<div>
        <ST t="Going Concern — ISA 570" color={C.pur}/>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.6,marginBottom:16}}>Assessment period: {AR.GOING_CONCERN_FRAMEWORK.assessmentPeriod||"At least 12 months from the date of the auditor's report"}</div>
        {AR.GOING_CONCERN_FRAMEWORK.financialIndicators&&<div>
          <div style={{fontSize:12,color:C.pur,fontWeight:700,marginBottom:8}}>Financial Indicators</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>{AR.GOING_CONCERN_FRAMEWORK.financialIndicators.map((f,i)=><div key={i} style={{padding:"6px 10px",borderRadius:4,background:C.pur+"0D",border:"1px solid "+C.pur+"33",fontSize:11,color:C.dim}}>• {typeof f==="string"?f:f.indicator||f.description}</div>)}</div>
        </div>}
      </div>}
      {resTab==="group"&&AR.GROUP_AUDIT_FRAMEWORK&&<div>
        <ST t="Group Audit — ISA 600" color={"#818CF8"}/>
        {AR.GROUP_AUDIT_FRAMEWORK.scopingProcess&&<div>
          <div style={{fontSize:12,color:"#818CF8",fontWeight:700,marginBottom:8}}>Scoping Process</div>
          {AR.GROUP_AUDIT_FRAMEWORK.scopingProcess.map((s,i)=><div key={i} style={{padding:"6px 10px",borderRadius:4,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.2)",marginBottom:4,fontSize:11,color:C.dim}}>{typeof s==="string"?s:s.step||s.description}</div>)}
        </div>}
      </div>}
    </div>;
  }else{
    resContent=<div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:20,textAlign:"center"}}>
      <div style={{fontSize:14,color:C.dim,marginBottom:8}}>Audit Research module loading...</div>
      <div style={{fontSize:11,color:C.fnt}}>The AuditResearch.js module is initialising.</div>
    </div>;
  }
  return<div><ST t="Audit Research Hub — ISA Reference Library" color={"#0097A7"}/>{resContent}</div>;
}
