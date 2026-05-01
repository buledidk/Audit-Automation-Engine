import { useState } from "react";
import { C, REGULATORY_DETAIL_MAP } from "../../data";
import {
  COMPANIES_ACT_2006, ISA_UK_STANDARDS, FRS_102_SECTIONS,
  FRS_101_SUMMARY, FRS_105_SUMMARY, IFRS_STANDARDS, UK_REGULATORS,
  FRAMEWORK_DECISION_TREE
} from "../../StandardsLibrary";
import {
  FRC_DETAIL, HMRC_DETAIL, FCA_DETAIL, PRA_DETAIL, CHARITY_COMMISSION_DETAIL
} from "../../RegulatoryData";
import { VERIFICATION_METADATA } from "../../CrossReferenceIndex";
import {
  INSURANCE_AUDIT_STANDARDS, BANKING_AUDIT_STANDARDS, CHARITY_SORP_DETAIL,
  PUBLIC_SECTOR_STANDARDS, HOUSING_ASSOCIATION_STANDARDS,
  ESG_STANDARDS, DIGITAL_ASSETS_GUIDANCE, CORPORATE_GOVERNANCE
} from "../../StandardsLibrary";
import {
  COMPLIANCE_FRAMEWORKS, COMPLIANCE_FRAMEWORK_LIST
} from "../../ComplianceFrameworks";
import {
  INVENTORY_COUNT_PROCEDURES, CONFIRMATION_PROCEDURES,
  CUTOFF_TESTING_PROCEDURES, ISQM_REQUIREMENTS
} from "../../AuditMethodology";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";

export default function StandardsBrowser() {
  const { _ST, inp } = useAuditHelpers();
  const [stdTab,setStdTab]=useState("isa");
  const [stdSearch,setStdSearch]=useState("");
  const [stdExpanded,setStdExpanded]=useState(null);
  const q=stdSearch.toLowerCase();
  const tabs=[
    {k:"isa",l:"ISA (UK)",c:C.pln,count:ISA_UK_STANDARDS.length},
    {k:"frs102",l:"FRS 102",c:C.grn,count:FRS_102_SECTIONS.length},
    {k:"frs101",l:"FRS 101",c:C.tl,count:1},
    {k:"frs105",l:"FRS 105",c:C.blu,count:1},
    {k:"ifrs",l:"IFRS/IAS",c:C.red,count:IFRS_STANDARDS.length},
    {k:"ca06",l:"Companies Act",c:C.org,count:COMPANIES_ACT_2006.length},
    {k:"regulators",l:"Regulators",c:C.pur,count:UK_REGULATORS.length},
    {k:"sector",l:"Sector",c:"#F59E0B",count:5},
    {k:"compliance",l:"Compliance",c:"#EC4899",count:COMPLIANCE_FRAMEWORK_LIST.length},
    {k:"esg",l:"ESG & Emerging",c:"#22C55E",count:3},
    {k:"procedures",l:"Procedures",c:"#06B6D4",count:4},
    {k:"framework",l:"Framework Guide",c:C.acc,count:1}
  ];
  const renderISA=()=>{const filtered=ISA_UK_STANDARDS.filter(s=>!q||s.number.toLowerCase().includes(q)||s.title.toLowerCase().includes(q)||s.objective.toLowerCase().includes(q));
    const phases=["Quality","Planning","Risk Assessment","Execution","Completion","Reporting"];
    return<div>{phases.map(phase=>{const group=filtered.filter(s=>s.auditPhase===phase);if(!group.length)return null;
      return<div key={phase} style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.pln,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+C.pln+"33"}}>{phase} ({group.length})</div>
        {group.map(s=><div key={s.number} style={{marginBottom:8,background:stdExpanded===s.number?C.pln+"12":C.card,border:"1px solid "+(stdExpanded===s.number?C.pln+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===s.number?null:s.number)}>
          <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"monospace",color:C.pln,fontWeight:700,fontSize:11,minWidth:70}}>{s.number}</span>
            <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{s.title}<VerifiedBadge source={s.source} lastVerified={s.lastVerified}/></span>
            <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===s.number?"▼":"▶"}</span>
          </div>
          {stdExpanded===s.number&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
            <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}><b style={{color:C.acc}}>Objective:</b> {s.objective}</div>
            <div style={{marginBottom:8}}><b style={{fontSize:10,color:C.pln}}>Key Requirements:</b>{s.keyRequirements.map((r,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.pln+"33"}}>• {r}</div>)}</div>
            {s.keyParagraphs.length>0&&<div><b style={{fontSize:10,color:C.fnt}}>Key Paragraphs:</b> <span style={{fontSize:10,color:C.dim}}>{s.keyParagraphs.join(", ")}</span></div>}
          </div>}
        </div>)}
      </div>})}</div>};
  const renderFRS102=()=>{const filtered=FRS_102_SECTIONS.filter(s=>!q||("section "+s.section).includes(q)||s.title.toLowerCase().includes(q)||s.scope.toLowerCase().includes(q));
    return<div>{filtered.map(s=><div key={s.section} style={{marginBottom:8,background:stdExpanded==="frs102_"+s.section?C.grn+"12":C.card,border:"1px solid "+(stdExpanded==="frs102_"+s.section?C.grn+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded==="frs102_"+s.section?null:"frs102_"+s.section)}>
      <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontFamily:"monospace",color:C.grn,fontWeight:700,fontSize:11,minWidth:70}}>s{s.section}</span>
        <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{s.title}<VerifiedBadge source={s.source} lastVerified={s.lastVerified}/></span>
        <span style={{fontSize:10,color:C.fnt}}>{stdExpanded==="frs102_"+s.section?"▼":"▶"}</span>
      </div>
      {stdExpanded==="frs102_"+s.section&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
        <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}><b style={{color:C.acc}}>Scope:</b> {s.scope}</div>
        <div style={{marginBottom:8}}><b style={{fontSize:10,color:C.grn}}>Key Requirements:</b>{s.keyRequirements.map((r,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.grn+"33"}}>• {r}</div>)}</div>
        {s.disclosures.length>0&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:C.org}}>Disclosures:</b>{s.disclosures.map((d,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.org+"33"}}>• {d}</div>)}</div>}
        <div style={{fontSize:11,color:C.dim,lineHeight:1.6,padding:8,background:"rgba(255,255,255,0.02)",borderRadius:6}}><b style={{color:C.acc,fontSize:10}}>Audit Considerations:</b> {s.auditConsiderations}</div>
      </div>}
    </div>)}</div>};
  const renderFRS101=()=><div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:20}}>
    <div style={{fontSize:16,color:C.tl,fontWeight:700,marginBottom:8}}>{FRS_101_SUMMARY.title}<VerifiedBadge source={FRS_101_SUMMARY.source} lastVerified={FRS_101_SUMMARY.lastVerified}/></div>
    <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginBottom:12}}>{FRS_101_SUMMARY.description}</div>
    <div style={{fontSize:11,color:C.fnt,marginBottom:8}}><b style={{color:C.acc}}>Applicable to:</b> {FRS_101_SUMMARY.applicableTo}</div>
    <div style={{fontSize:11,color:C.fnt,marginBottom:12}}><b style={{color:C.acc}}>Effective:</b> {FRS_101_SUMMARY.effectiveDate}</div>
    <div style={{marginBottom:8}}><b style={{fontSize:11,color:C.tl}}>Key Exemptions Available:</b>{FRS_101_SUMMARY.keyExemptions.map((e,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"4px 0 4px 12px",borderLeft:"2px solid "+C.tl+"33"}}>• {e}</div>)}</div>
  </div>;
  const renderFRS105=()=><div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:20}}>
    <div style={{fontSize:16,color:C.blu,fontWeight:700,marginBottom:8}}>{FRS_105_SUMMARY.title}<VerifiedBadge source={FRS_105_SUMMARY.source} lastVerified={FRS_105_SUMMARY.lastVerified}/></div>
    <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginBottom:12}}>{FRS_105_SUMMARY.description}</div>
    <div style={{fontSize:11,color:C.fnt,marginBottom:8}}><b style={{color:C.acc}}>Applicable to:</b> {FRS_105_SUMMARY.applicableTo}</div>
    <div style={{fontSize:11,color:C.fnt,marginBottom:12}}><b style={{color:C.acc}}>Effective:</b> {FRS_105_SUMMARY.effectiveDate}</div>
    <div style={{marginBottom:8}}><b style={{fontSize:11,color:C.blu}}>Key Restrictions:</b>{FRS_105_SUMMARY.keyRestrictions.map((r,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"4px 0 4px 12px",borderLeft:"2px solid "+C.blu+"33"}}>• {r}</div>)}</div>
  </div>;
  const renderIFRS=()=>{const filtered=IFRS_STANDARDS.filter(s=>!q||s.number.toLowerCase().includes(q)||s.title.toLowerCase().includes(q)||s.scope.toLowerCase().includes(q));
    const ifrsGroup=filtered.filter(s=>s.number.startsWith("IFRS"));const iasGroup=filtered.filter(s=>s.number.startsWith("IAS"));
    return<div>{[{l:"IFRS Standards",items:ifrsGroup,c:C.red},{l:"IAS Standards",items:iasGroup,c:C.org}].map(g=>g.items.length?<div key={g.l} style={{marginBottom:20}}>
      <div style={{fontSize:11,color:g.c,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+g.c+"33"}}>{g.l} ({g.items.length})</div>
      {g.items.map(s=><div key={s.number} style={{marginBottom:8,background:stdExpanded===s.number?g.c+"12":C.card,border:"1px solid "+(stdExpanded===s.number?g.c+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===s.number?null:s.number)}>
        <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"monospace",color:g.c,fontWeight:700,fontSize:11,minWidth:70}}>{s.number}</span>
          <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{s.title}{s.status==="superseded"&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:3,background:"rgba(239,83,80,0.12)",border:"1px solid rgba(239,83,80,0.3)",color:C.red,fontWeight:600,marginLeft:6}}>SUPERSEDED</span>}<VerifiedBadge source={s.source} lastVerified={s.lastVerified}/></span>
          <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===s.number?"▼":"▶"}</span>
        </div>
        {stdExpanded===s.number&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
          {s.status==="superseded"&&s.supersededBy&&<div style={{fontSize:11,color:C.red,marginTop:8,marginBottom:4,padding:"4px 8px",background:"rgba(239,83,80,0.06)",borderRadius:4}}>Superseded by: {s.supersededBy}</div>}
          <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}><b style={{color:C.acc}}>Scope:</b> {s.scope}</div>
          {s.keyPrinciples&&s.keyPrinciples.length>0&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:g.c}}>Key Principles:</b>{s.keyPrinciples.map((p,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+g.c+"33"}}>• {p}</div>)}</div>}
          {s.disclosureRequirements&&s.disclosureRequirements.length>0&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:C.org}}>Disclosure Requirements:</b>{s.disclosureRequirements.map((d,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.org+"33"}}>• {d}</div>)}</div>}
          {s.ukRelevance&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6,padding:8,background:"rgba(255,255,255,0.02)",borderRadius:6}}><b style={{color:C.acc,fontSize:10}}>UK Relevance:</b> {s.ukRelevance}</div>}
          {s.effectiveDate&&<div style={{fontSize:10,color:C.fnt,marginTop:6}}>Effective: {s.effectiveDate}</div>}
        </div>}
      </div>)}
    </div>:null)}</div>};
  const renderCA06=()=>{const filtered=COMPANIES_ACT_2006.filter(s=>!q||s.section.toLowerCase().includes(q)||s.title.toLowerCase().includes(q)||s.summary.toLowerCase().includes(q));
    const parts={};filtered.forEach(s=>{const p=s.section.match(/^s(\d+)/);const num=p?parseInt(p[1]):0;const part=num<=170?"Part 1-9":num<=222?"Part 10 (Directors)":num<=269?"Part 11-12":num<=361?"Part 13 (Resolutions)":num<=474?"Part 15 (Accounts)":num<=539?"Part 16 (Audit)":num<=657?"Part 17 (Share Capital)":num<=790?"Part 18-21":num<=830?"Part 21A (PSC)":"Part 23+ (Distributions)";if(!parts[part])parts[part]=[];parts[part].push(s);});
    return<div>{Object.entries(parts).map(([part,items])=><div key={part} style={{marginBottom:20}}>
      <div style={{fontSize:11,color:C.org,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+C.org+"33"}}>{part} ({items.length})</div>
      {items.map(s=><div key={s.section} style={{marginBottom:6,background:stdExpanded===s.section?C.org+"12":C.card,border:"1px solid "+(stdExpanded===s.section?C.org+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===s.section?null:s.section)}>
        <div style={{padding:"8px 14px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"monospace",color:C.org,fontWeight:700,fontSize:11,minWidth:70}}>{s.section}</span>
          <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{s.title}<VerifiedBadge source={s.source} lastVerified={s.lastVerified}/></span>
          <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===s.section?"▼":"▶"}</span>
        </div>
        {stdExpanded===s.section&&<div style={{padding:"0 14px 12px",borderTop:"1px solid "+C.brd}}>
          <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:8}}>{s.summary}</div>
          <div style={{fontSize:11,color:C.dim,lineHeight:1.6,padding:8,background:"rgba(255,255,255,0.02)",borderRadius:6}}><b style={{color:C.acc,fontSize:10}}>Audit Relevance:</b> {s.auditRelevance}</div>
        </div>}
      </div>)}
    </div>)}</div>};
  const renderRegulators=()=>{const filtered=UK_REGULATORS.filter(r=>!q||r.name.toLowerCase().includes(q)||r.abbreviation.toLowerCase().includes(q)||r.role.toLowerCase().includes(q)||r.category.toLowerCase().includes(q));
    const cats=[...new Set(filtered.map(r=>r.category))];
    return<div>{cats.map(cat=>{const group=filtered.filter(r=>r.category===cat);
      return<div key={cat} style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.pur,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+C.pur+"33"}}>{cat} ({group.length})</div>
        {group.map(r=><div key={r.id} style={{marginBottom:8,background:stdExpanded===r.id?C.pur+"12":C.card,border:"1px solid "+(stdExpanded===r.id?C.pur+"44":C.brd),borderRadius:8,borderLeft:r.isCustom?"4px solid "+C.acc:"none",overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===r.id?null:r.id)}>
          <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"monospace",color:C.pur,fontWeight:700,fontSize:11,minWidth:60}}>{r.abbreviation}</span>
            <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{r.name}</span>
            {r.isCustom&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:C.acc+"22",color:C.acc,fontWeight:600}}>CUSTOM</span>}
            <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===r.id?"▼":"▶"}</span>
          </div>
          {stdExpanded===r.id&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
            <div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}><b style={{color:C.acc}}>Role:</b> {r.role}</div>
            <div style={{fontSize:11,color:C.fnt,marginBottom:10}}>Website: <a href={r.website} target="_blank" rel="noopener noreferrer" style={{color:C.blu}}>{r.website}</a></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
              <div><b style={{fontSize:10,color:C.pur}}>Key Rules for Auditors:</b>{r.keyRulesForAuditors.map((rule,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.pur+"33"}}>• {rule}</div>)}</div>
              <div><b style={{fontSize:10,color:C.org}}>Filing Deadlines:</b>{r.filingDeadlines.map((d,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.org+"33"}}>• {d}</div>)}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><b style={{fontSize:10,color:C.grn}}>Affected Industries:</b><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{r.affectedIndustries.map((ind,i)=><span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.grn+"15",border:"1px solid "+C.grn+"33",color:C.grn}}>{ind}</span>)}</div></div>
              <div><b style={{fontSize:10,color:C.blu}}>Legislation Enforced:</b>{r.legislationEnforced.map((l,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.blu+"33"}}>• {l}</div>)}</div>
            </div>
            {REGULATORY_DETAIL_MAP[r.id]&&<div style={{marginTop:12,padding:12,background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid "+C.pur+"22"}}>
              <div style={{fontSize:10,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Detailed Regulatory Data <VerifiedBadge source={REGULATORY_DETAIL_MAP[r.id].source} lastVerified={REGULATORY_DETAIL_MAP[r.id].lastVerified}/></div>
              {r.id==="frc"&&FRC_DETAIL.ethicalStandard2024&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                <div style={{marginBottom:6}}><b style={{color:C.pur,fontSize:10}}>Ethical Standard 2024:</b></div>
                <div style={{marginBottom:4}}>Partner Rotation (PIE): {FRC_DETAIL.ethicalStandard2024.partnerRotation?.pie}</div>
                <div style={{marginBottom:4}}>Partner Rotation (Non-PIE): {FRC_DETAIL.ethicalStandard2024.partnerRotation?.nonPie}</div>
                {FRC_DETAIL.isqmUK1&&<div style={{marginTop:8}}><b style={{color:C.pur,fontSize:10}}>ISQM (UK) 1 Components:</b>{FRC_DETAIL.isqmUK1.components?.map((c,i)=><div key={i} style={{padding:"2px 0 2px 12px",borderLeft:"2px solid "+C.pur+"33"}}>• {c.name}</div>)}</div>}
              </div>}
              {r.id==="hmrc"&&HMRC_DETAIL.corporationTax&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                <div style={{marginBottom:4}}><b style={{color:C.org,fontSize:10}}>CT600 Filing:</b> {HMRC_DETAIL.corporationTax.ct600?.filingDeadline}</div>
                <div style={{marginBottom:4}}><b style={{color:C.org,fontSize:10}}>CT Payment:</b> {HMRC_DETAIL.corporationTax.ct600?.paymentDeadline}</div>
                {HMRC_DETAIL.vat&&<div><b style={{color:C.org,fontSize:10}}>MTD VAT:</b> {HMRC_DETAIL.vat.mtdObligations}</div>}
              </div>}
              {r.id==="fca"&&FCA_DETAIL.prin&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                <b style={{color:C.blu,fontSize:10}}>FCA Principles for Business:</b>
                {FCA_DETAIL.prin.principlesForBusiness?.slice(0,6).map((p,i)=><div key={i} style={{padding:"2px 0 2px 12px",borderLeft:"2px solid "+C.blu+"33"}}>• {typeof p==="string"?p:p.name||p.principle||JSON.stringify(p)}</div>)}
                {FCA_DETAIL.prin.principlesForBusiness?.length>6&&<div style={{color:C.fnt,paddingLeft:12}}>...and {FCA_DETAIL.prin.principlesForBusiness.length-6} more</div>}
              </div>}
              {r.id==="pra"&&PRA_DETAIL.capitalRequirements&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                <div><b style={{color:C.tl,fontSize:10}}>CET1:</b> {PRA_DETAIL.capitalRequirements.cet1}</div>
                <div><b style={{color:C.tl,fontSize:10}}>Tier 1:</b> {PRA_DETAIL.capitalRequirements.at1}</div>
                <div><b style={{color:C.tl,fontSize:10}}>Tier 2:</b> {PRA_DETAIL.capitalRequirements.tier2}</div>
              </div>}
              {r.id==="charity-commission"&&CHARITY_COMMISSION_DETAIL.thresholds&&<div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                <div><b style={{color:C.grn,fontSize:10}}>Audit Required:</b> Income over £{CHARITY_COMMISSION_DETAIL.thresholds.auditRequired?.income?.toLocaleString()} or assets over £{CHARITY_COMMISSION_DETAIL.thresholds.auditRequired?.assets?.toLocaleString()}</div>
                <div><b style={{color:C.grn,fontSize:10}}>Accruals Required:</b> Income over £{CHARITY_COMMISSION_DETAIL.thresholds.accrualsRequired?.toLocaleString()}</div>
              </div>}
            </div>}
          </div>}
        </div>)}
      </div>})}</div>};
  return<div>
    <ST t="Standards & Regulatory Browser" color={"#37474F"}/>
    <div style={{marginBottom:16}}>
      <input value={stdSearch} onChange={e=>setStdSearch(e.target.value)} placeholder="Search standards, sections, regulators..." style={{...inp,marginBottom:12,fontSize:13}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{tabs.map(t=><button key={t.k} onClick={()=>{setStdTab(t.k);setStdExpanded(null);}} style={{padding:"6px 14px",borderRadius:6,background:stdTab===t.k?t.c+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(stdTab===t.k?t.c+"55":C.brd),color:stdTab===t.k?t.c:C.dim,fontSize:11,fontWeight:stdTab===t.k?700:400,cursor:"pointer"}}>{t.l} <span style={{fontSize:9,opacity:0.7}}>({t.count})</span></button>)}</div>
    </div>
    <div style={{maxHeight:"calc(100vh - 280px)",overflowY:"auto",paddingRight:4}}>
      {stdTab==="isa"&&renderISA()}
      {stdTab==="frs102"&&renderFRS102()}
      {stdTab==="frs101"&&renderFRS101()}
      {stdTab==="frs105"&&renderFRS105()}
      {stdTab==="ifrs"&&renderIFRS()}
      {stdTab==="ca06"&&renderCA06()}
      {stdTab==="regulators"&&renderRegulators()}
      {stdTab==="sector"&&<div>
        {[
          {data:INSURANCE_AUDIT_STANDARDS,color:"#F59E0B"},
          {data:BANKING_AUDIT_STANDARDS,color:"#3B82F6"},
          {data:CHARITY_SORP_DETAIL,color:"#22C55E"},
          {data:PUBLIC_SECTOR_STANDARDS,color:"#8B5CF6"},
          {data:HOUSING_ASSOCIATION_STANDARDS,color:"#EC4899"}
        ].filter(s=>s.data).map((sector,si)=>{
          const d=sector.data;
          const items=d.standards||d.modules||d.standards||[];
          const title=d.title||"";
          if(q&&!title.toLowerCase().includes(q)&&!JSON.stringify(items).toLowerCase().includes(q))return null;
          return<div key={si} style={{marginBottom:20}}>
            <div style={{fontSize:11,color:sector.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+sector.color+"33"}}>{title}</div>
            <div style={{fontSize:10,color:C.fnt,marginBottom:8}}>Source: {d.source} | Verified: {d.lastVerified}</div>
            {items.map((item,ii)=>{
              const itemId="sector_"+si+"_"+ii;
              const itemTitle=item.title||item.module||item.id||"";
              return<div key={ii} style={{marginBottom:8,background:stdExpanded===itemId?sector.color+"12":C.card,border:"1px solid "+(stdExpanded===itemId?sector.color+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===itemId?null:itemId)}>
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{itemTitle}</span>
                  <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===itemId?"▼":"▶"}</span>
                </div>
                {stdExpanded===itemId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                  {item.description&&<div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}>{item.description}</div>}
                  {item.requirements&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:sector.color}}>Requirements:</b>{(Array.isArray(item.requirements)?item.requirements:item.requirements.map?.(r=>typeof r==="string"?r:r.name||JSON.stringify(r))||[]).map((r,ri)=><div key={ri} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+sector.color+"33"}}>• {typeof r==="string"?r:r}</div>)}</div>}
                  {item.auditConsiderations&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:C.acc}}>Audit Considerations:</b>{item.auditConsiderations.map((a,ai)=><div key={ai} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.acc+"33"}}>• {a}</div>)}</div>}
                  {item.auditProcedures&&<div><b style={{fontSize:10,color:C.grn}}>Audit Procedures:</b>{item.auditProcedures.map((a,ai)=><div key={ai} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.grn+"33"}}>• {a}</div>)}</div>}
                  {item.pillars&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:sector.color}}>Pillars:</b>{item.pillars.map((p,pi)=><div key={pi} style={{padding:"4px 0 4px 12px",borderLeft:"2px solid "+sector.color+"33"}}><div style={{fontSize:11,color:C.tx,fontWeight:600}}>{p.pillar||p.name}</div>{(p.items||p.description?[p.description]:[]).map((it,iti)=><div key={iti} style={{fontSize:10,color:C.dim,paddingLeft:8}}>• {it}</div>)}</div>)}</div>}
                </div>}
              </div>;
            })}
          </div>;
        })}
      </div>}
      {stdTab==="compliance"&&<div>
        {COMPLIANCE_FRAMEWORK_LIST.map(fw=>{
          const framework=COMPLIANCE_FRAMEWORKS[fw.key];
          if(!framework)return null;
          const items=framework.components||framework.offences||framework.requirements||framework.keyElements||[];
          if(q&&!framework.title.toLowerCase().includes(q)&&!JSON.stringify(items).toLowerCase().includes(q))return null;
          return<div key={fw.key} style={{marginBottom:20}}>
            <div style={{fontSize:11,color:fw.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid "+fw.color+"33"}}>{fw.icon} {fw.title}</div>
            <div style={{fontSize:10,color:C.fnt,marginBottom:8}}>{framework.legislation} | {framework.regulator}</div>
            {items.map((item,ii)=>{
              const itemId="comp_"+fw.key+"_"+ii;
              const itemTitle=item.area||item.title||item.section||"Component "+(ii+1);
              return<div key={ii} style={{marginBottom:8,background:stdExpanded===itemId?fw.color+"12":C.card,border:"1px solid "+(stdExpanded===itemId?fw.color+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===itemId?null:itemId)}>
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:"monospace",color:fw.color,fontWeight:700,fontSize:11,minWidth:40}}>{item.regulation||item.article||item.section||""}</span>
                  <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{itemTitle}</span>
                  <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===itemId?"▼":"▶"}</span>
                </div>
                {stdExpanded===itemId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                  {item.description&&<div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}>{item.description}</div>}
                  {item.requirements&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:fw.color}}>Requirements:</b>{item.requirements.map((r,ri)=><div key={ri} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+fw.color+"33"}}>• {r}</div>)}</div>}
                  {item.detail&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:fw.color}}>Details:</b>{item.detail.map((d,di)=><div key={di} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+fw.color+"33"}}>• {d}</div>)}</div>}
                  {item.auditProcedures&&<div><b style={{fontSize:10,color:C.grn}}>Audit Procedures:</b>{item.auditProcedures.map((a,ai)=><div key={ai} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.grn+"33"}}>• {a}</div>)}</div>}
                  {item.triggers&&<div style={{marginTop:6}}><b style={{fontSize:10,color:C.org}}>Triggers:</b>{item.triggers.map((t,ti)=><div key={ti} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.org+"33"}}>• {t}</div>)}</div>}
                  {item.considerations&&<div style={{marginTop:6}}><b style={{fontSize:10,color:C.acc}}>Considerations:</b>{item.considerations.map((c,ci)=><div key={ci} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.acc+"33"}}>• {c}</div>)}</div>}
                  {item.bases&&<div style={{marginTop:6}}><b style={{fontSize:10,color:fw.color}}>Lawful Bases:</b>{item.bases.map((b,bi)=><div key={bi} style={{padding:"4px 0 4px 12px",borderLeft:"2px solid "+fw.color+"33"}}><span style={{fontSize:11,color:C.tx,fontWeight:600}}>{b.basis}</span> <span style={{fontSize:10,color:C.fnt}}>({b.article})</span><div style={{fontSize:10,color:C.dim}}>{b.notes}</div></div>)}</div>}
                </div>}
              </div>;
            })}
          </div>;
        })}
        {COMPLIANCE_FRAMEWORKS.briberyAct&&<div style={{marginTop:16,padding:16,background:C.card,border:"1px solid "+C.brd,borderRadius:10}}>
          <div style={{fontSize:11,color:"#F59E0B",fontWeight:700,marginBottom:8}}>Six Principles of Adequate Procedures</div>
          {COMPLIANCE_FRAMEWORKS.briberyAct.adequateProcedures?.principles?.map((p,i)=><div key={i} style={{marginBottom:6,padding:"4px 0 4px 12px",borderLeft:"2px solid #F59E0B33"}}><div style={{fontSize:11,color:C.tx,fontWeight:600}}>{p.principle}</div><div style={{fontSize:10,color:C.dim}}>{p.description}</div></div>)}
        </div>}
      </div>}
      {stdTab==="esg"&&<div>
        {ESG_STANDARDS&&<div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#22C55E",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #22C55E33"}}>ESG & Sustainability ({ESG_STANDARDS.frameworks?.length||0})</div>
          {ESG_STANDARDS.frameworks?.map((fw,fi)=>{
            const fwId="esg_"+fi;
            if(q&&!fw.title.toLowerCase().includes(q)&&!JSON.stringify(fw).toLowerCase().includes(q))return null;
            return<div key={fi} style={{marginBottom:8,background:stdExpanded===fwId?"#22C55E12":C.card,border:"1px solid "+(stdExpanded===fwId?"#22C55E44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===fwId?null:fwId)}>
              <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{fw.title}</span>
                {fw.status&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:"#22C55E15",color:"#22C55E",fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fw.status.slice(0,40)}</span>}
                <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===fwId?"▼":"▶"}</span>
              </div>
              {stdExpanded===fwId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                {fw.pillars&&<div style={{marginTop:8,marginBottom:8}}><b style={{fontSize:10,color:"#22C55E"}}>Pillars:</b>{fw.pillars.map((p,pi)=><div key={pi} style={{padding:"4px 0 4px 12px",borderLeft:"2px solid #22C55E33"}}><span style={{fontSize:11,color:C.tx,fontWeight:600}}>{p.pillar}</span><div style={{fontSize:10,color:C.dim}}>{p.description}</div></div>)}</div>}
                {fw.standards&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:"#3B82F6"}}>Standards:</b>{fw.standards.map((s,si)=><div key={si} style={{padding:"4px 0 4px 12px",borderLeft:"2px solid #3B82F633"}}><span style={{fontSize:11,color:C.tx,fontWeight:600}}>{s.standard}: {s.title}</span><div style={{fontSize:10,color:C.dim}}>{s.scope}</div></div>)}</div>}
                {fw.requirements&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:"#22C55E"}}>Requirements:</b>{fw.requirements.map((r,ri)=><div key={ri} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid #22C55E33"}}>• {r}</div>)}</div>}
                {fw.scopes&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:"#22C55E"}}>GHG Scopes:</b>{fw.scopes.map((s,si)=><div key={si} style={{padding:"4px 0 4px 12px",borderLeft:"2px solid #22C55E33"}}><span style={{fontSize:11,color:C.tx,fontWeight:600}}>{s.scope}</span><div style={{fontSize:10,color:C.dim}}>{s.description}</div></div>)}</div>}
                {fw.auditConsiderations&&<div><b style={{fontSize:10,color:C.acc}}>Audit Considerations:</b>{fw.auditConsiderations.map((a,ai)=><div key={ai} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.acc+"33"}}>• {a}</div>)}</div>}
              </div>}
            </div>;
          })}
        </div>}
        {DIGITAL_ASSETS_GUIDANCE&&<div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#F59E0B",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #F59E0B33"}}>Digital Assets & Crypto ({DIGITAL_ASSETS_GUIDANCE.topics?.length||0})</div>
          {DIGITAL_ASSETS_GUIDANCE.topics?.map((topic,ti)=>{
            const tId="da_"+ti;
            return<div key={ti} style={{marginBottom:8,background:stdExpanded===tId?"#F59E0B12":C.card,border:"1px solid "+(stdExpanded===tId?"#F59E0B44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===tId?null:tId)}>
              <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{topic.title}</span>
                <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===tId?"▼":"▶"}</span>
              </div>
              {stdExpanded===tId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                {topic.guidance&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:"#F59E0B"}}>Guidance:</b>{topic.guidance.map((g,gi)=><div key={gi} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid #F59E0B33"}}>• {g}</div>)}</div>}
                {topic.auditProcedures&&<div><b style={{fontSize:10,color:C.grn}}>Audit Procedures:</b>{topic.auditProcedures.map((a,ai)=><div key={ai} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+C.grn+"33"}}>• {a}</div>)}</div>}
              </div>}
            </div>;
          })}
        </div>}
        {CORPORATE_GOVERNANCE&&<div>
          <div style={{fontSize:11,color:"#8B5CF6",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #8B5CF633"}}>Corporate Governance ({CORPORATE_GOVERNANCE.codes?.length||0})</div>
          {CORPORATE_GOVERNANCE.codes?.map((code,ci)=>{
            const cId="cg_"+ci;
            return<div key={ci} style={{marginBottom:8,background:stdExpanded===cId?"#8B5CF612":C.card,border:"1px solid "+(stdExpanded===cId?"#8B5CF644":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===cId?null:cId)}>
              <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{code.title}</span>
                <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===cId?"▼":"▶"}</span>
              </div>
              {stdExpanded===cId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                <div style={{fontSize:11,color:C.dim,marginTop:8,marginBottom:4}}><b style={{color:C.acc}}>Applicability:</b> {code.applicability}</div>
                {code.effectiveDate&&<div style={{fontSize:10,color:C.fnt,marginBottom:8}}>Effective: {code.effectiveDate}</div>}
                {code.sections&&code.sections.map((sec,si)=><div key={si} style={{marginBottom:8,padding:"6px 0 6px 12px",borderLeft:"2px solid #8B5CF633"}}><div style={{fontSize:11,color:C.tx,fontWeight:600,marginBottom:4}}>{sec.section}</div>{sec.principles.map((p,pi)=><div key={pi} style={{fontSize:10,color:C.dim,padding:"2px 0 2px 8px"}}>• {typeof p==="string"?p:p.principle||""}</div>)}</div>)}
                {code.principles&&code.principles.map((p,pi)=><div key={pi} style={{marginBottom:6,padding:"4px 0 4px 12px",borderLeft:"2px solid #8B5CF633"}}><div style={{fontSize:11,color:C.tx,fontWeight:600}}>{p.principle}</div><div style={{fontSize:10,color:C.dim}}>{p.description}</div></div>)}
              </div>}
            </div>;
          })}
        </div>}
      </div>}
      {stdTab==="procedures"&&<div>
        {[
          {data:INVENTORY_COUNT_PROCEDURES,label:"Inventory Count",color:"#06B6D4",items:INVENTORY_COUNT_PROCEDURES?.sections},
          {data:CONFIRMATION_PROCEDURES,label:"External Confirmations",color:"#8B5CF6",items:CONFIRMATION_PROCEDURES?.types},
          {data:CUTOFF_TESTING_PROCEDURES,label:"Cut-off Testing",color:"#F59E0B",items:CUTOFF_TESTING_PROCEDURES?.areas},
          {data:ISQM_REQUIREMENTS,label:"ISQM (UK) 1 & 2",color:"#EC4899",items:ISQM_REQUIREMENTS?.standards}
        ].map((proc,pi)=>{
          if(!proc.data)return null;
          const items=proc.items||[];
          return<div key={pi} style={{marginBottom:20}}>
            <div style={{fontSize:11,color:proc.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4,paddingBottom:6,borderBottom:"1px solid "+proc.color+"33"}}>{proc.label} — {proc.data.standard||proc.data.isa||proc.data.title}</div>
            <div style={{fontSize:10,color:C.fnt,marginBottom:8}}>Source: {proc.data.source} | Verified: {proc.data.lastVerified}</div>
            {items.map((item,ii)=>{
              const iId="proc_"+pi+"_"+ii;
              const title=item.phase||item.type||item.area||item.standard||item.component||"";
              if(q&&!title.toLowerCase().includes(q)&&!JSON.stringify(item).toLowerCase().includes(q))return null;
              return<div key={ii} style={{marginBottom:8,background:stdExpanded===iId?proc.color+"12":C.card,border:"1px solid "+(stdExpanded===iId?proc.color+"44":C.brd),borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setStdExpanded(stdExpanded===iId?null:iId)}>
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{flex:1,fontSize:12,color:C.tx,fontWeight:500}}>{item.title||title}</span>
                  <span style={{fontSize:10,color:C.fnt}}>{stdExpanded===iId?"▼":"▶"}</span>
                </div>
                {stdExpanded===iId&&<div style={{padding:"0 14px 14px",borderTop:"1px solid "+C.brd}}>
                  {item.description&&<div style={{fontSize:12,color:C.dim,lineHeight:1.7,marginTop:10,marginBottom:10}}>{item.description}</div>}
                  {item.procedures&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:proc.color}}>Procedures:</b>{item.procedures.map((p,pii)=><div key={pii} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+proc.color+"33"}}>• {p}</div>)}</div>}
                  {item.requirements&&<div style={{marginBottom:8}}><b style={{fontSize:10,color:proc.color}}>Requirements:</b>{(Array.isArray(item.requirements)?item.requirements:[]).map((r,ri)=><div key={ri} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+proc.color+"33"}}>• {typeof r==="string"?r:r}</div>)}</div>}
                  {item.assertions&&<div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap"}}>{item.assertions.map((a,ai)=><span key={ai} style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:proc.color+"15",border:"1px solid "+proc.color+"33",color:proc.color}}>{a}</span>)}</div>}
                  {item.components&&<div style={{marginTop:8}}><b style={{fontSize:10,color:proc.color}}>Components:</b>{item.components.map((comp,ci)=><div key={ci} style={{marginBottom:8,padding:"6px 0 6px 12px",borderLeft:"2px solid "+proc.color+"33"}}><div style={{fontSize:11,color:C.tx,fontWeight:600}}>{comp.component||comp.name}</div>{comp.description&&<div style={{fontSize:10,color:C.dim,marginBottom:4}}>{comp.description}</div>}{comp.requirements&&comp.requirements.map((r,ri)=><div key={ri} style={{fontSize:10,color:C.dim,paddingLeft:8}}>• {r}</div>)}</div>)}</div>}
                  {item.eqrScope&&<div style={{marginTop:8}}><b style={{fontSize:10,color:proc.color}}>EQR Scope:</b>{item.eqrScope.map((s,si)=><div key={si} style={{fontSize:11,color:C.dim,padding:"3px 0 3px 12px",borderLeft:"2px solid "+proc.color+"33"}}>• {s}</div>)}</div>}
                </div>}
              </div>;
            })}
          </div>;
        })}
      </div>}
      {stdTab==="framework"&&<div>
        <div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:20,marginBottom:16}}>
          <div style={{fontSize:16,color:C.acc,fontWeight:700,marginBottom:4}}>UK Financial Reporting Framework Decision Guide</div>
          <div style={{fontSize:11,color:C.fnt,marginBottom:16}}>Source: {FRAMEWORK_DECISION_TREE.thresholdSource}</div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Size Thresholds (April 2025)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
            {Object.entries(FRAMEWORK_DECISION_TREE.thresholds).map(([size,vals])=><div key={size} style={{padding:14,borderRadius:8,background:C.acc+"0A",border:"1px solid "+C.acc+"33",textAlign:"center"}}>
              <div style={{fontSize:13,color:C.acc,fontWeight:700,textTransform:"capitalize",marginBottom:8}}>{size}</div>
              <div style={{fontSize:11,color:C.dim}}>Turnover: £{vals.turnover?.toLocaleString()}</div>
              <div style={{fontSize:11,color:C.dim}}>Assets: £{vals.assets?.toLocaleString()}</div>
              <div style={{fontSize:11,color:C.dim}}>Employees: {vals.employees}</div>
            </div>)}
          </div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Framework Decision Flow</div>
          {FRAMEWORK_DECISION_TREE.decisionNodes.map((node,i)=><div key={node.id} style={{display:"flex",alignItems:"stretch",marginBottom:8}}>
            <div style={{width:32,display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:24,height:24,borderRadius:12,background:C.acc+"22",border:"1px solid "+C.acc+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.acc,fontWeight:700}}>{node.id}</div>
              {i<FRAMEWORK_DECISION_TREE.decisionNodes.length-1&&<div style={{width:2,flex:1,background:C.acc+"33",marginTop:4}}/>}
            </div>
            <div style={{flex:1,marginLeft:10,padding:10,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid "+C.brd}}>
              <div style={{fontSize:12,color:C.tx,fontWeight:500,marginBottom:6}}>{node.question}</div>
              <div style={{display:"flex",gap:12}}>
                <div style={{fontSize:11}}><span style={{color:C.grn,fontWeight:600}}>Yes →</span> <span style={{color:C.dim}}>{typeof node.yes==="number"?"Go to step "+node.yes:node.yes}</span></div>
                <div style={{fontSize:11}}><span style={{color:C.red,fontWeight:600}}>No →</span> <span style={{color:C.dim}}>{typeof node.no==="number"?"Go to step "+node.no:node.no}</span></div>
              </div>
            </div>
          </div>)}
        </div>
        <div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:16}}>
          <div style={{fontSize:10,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Verification</div>
          <div style={{fontSize:11,color:C.dim}}>Total standard entries indexed: {VERIFICATION_METADATA.totalStandardEntries} | Sources: {VERIFICATION_METADATA.sourcesUsed.join(", ")} | Last verified: {VERIFICATION_METADATA.lastFullVerification}</div>
        </div>
      </div>}
    </div>
  </div>;
}
