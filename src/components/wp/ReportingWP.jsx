import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C, WPS } from "../../data";
import { AUDIT_OPINIONS } from "../../AuditMethodology";
import { ENGAGEMENT_COMPLETION_LETTER, AUDIT_COMMITTEE_REPORT } from "../../AdditionalWPs";

export default function ReportingWP({ wp }) {
  const { cfg, _ind, fw, _sz, wpNotes, setWpNotes, signOffs, allWPs } = useEngagement();
  const { _BoundET, _ST, inp, tc } = useAuditHelpers();

    if(wp.id==="f1")return<div><ST t="Management Letter — ISA 265" color={C.rpt}/>
      <div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.brd,marginBottom:16,fontSize:13,color:C.dim,lineHeight:1.9}}>
        <p><b style={{color:C.tx}}>PRIVATE AND CONFIDENTIAL</b></p>
        <p style={{marginTop:8}}>The Board of Directors<br/><b style={{color:C.al}}>{cfg.entityName||"[Entity Name]"}</b></p>
        <p style={{marginTop:8}}>Dear Directors,</p>
        <p style={{marginTop:8}}>Following our audit of the financial statements of <b style={{color:C.al}}>{cfg.entityName||"[Entity]"}</b> for the year ended <b style={{color:C.al}}>{cfg.fye||"[FYE]"}</b>, prepared in accordance with <b style={{color:C.al}}>{fw?.l||"[Framework]"}</b>, we write to bring to your attention the following matters identified during our audit.</p>
        <p style={{marginTop:8}}>This letter has been prepared for the sole use of the Board and should not be disclosed to third parties without our prior written consent. Our observations are not intended to provide a comprehensive statement of all weaknesses that may exist or of all improvements that could be made.</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[{l:"High",c:C.red,d:"Immediate action required — significant risk of material misstatement"},{l:"Medium",c:C.org,d:"Address within reporting period — control deficiency"},{l:"Low",c:C.grn,d:"Best practice improvement — enhancement opportunity"}].map(r=><div key={r.l} style={{flex:1,padding:10,borderRadius:8,background:r.c+"0D",border:"1px solid "+r.c+"33",textAlign:"center"}}><div style={{fontSize:12,color:r.c,fontWeight:700}}>{r.l} Risk</div><div style={{fontSize:9,color:C.dim,marginTop:4}}>{r.d}</div></div>)}
      </div>
      <ST t="Current Year Findings" color={C.rpt}/>
      <BoundET id="f1_findings" headers={["Ref","Category","Finding Description","Risk (H/M/L)","Affected Area","ISA Ref","Recommendation","Mgmt Response","Responsible","Target Date"]} rows={Array.from({length:8},(_,i)=>[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>ML.{String(i+1).padStart(2,"0")}</span>,"","","","","","","","",""])} editable={[1,2,3,4,5,6,7,8,9]}/>
      <div style={{marginTop:20}}><ST t="Prior Year Points — Follow-Up" color={C.org}/></div>
      <BoundET id="f1_prior" headers={["PY Ref","Finding","Original Recommendation","Status","Current Assessment","Comment"]} rows={Array.from({length:3},(_,i)=>[<span style={{fontFamily:"monospace",color:C.fnt}}>PY.{String(i+1).padStart(2,"0")}</span>,"","","","",""])} editable={[1,2,3,4,5]}/>
      <div style={{marginTop:16}}><div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Conclusion</div>
        <textarea value={wpNotes["f1_conclusion"]||""} onChange={e=>setWpNotes(p=>({...p,f1_conclusion:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical"}} placeholder="We would be pleased to discuss any of the above matters with you at your convenience. We would like to take this opportunity to thank the management team for their assistance during the audit..."/></div>
    </div>;
    if(wp.id==="f2"){const ops=AUDIT_OPINIONS;const rep=s=>s.replace(/\{FYE\}/g,cfg.fye||"[FYE]").replace(/\{FRAMEWORK\}/g,fw?.l||"[Framework]");return<div><ST t="Audit Report — ISA 700/705/706" color={C.rpt}/>
      <div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.brd,fontSize:14,color:C.dim,lineHeight:1.9,marginBottom:20}}>
        <p style={{textAlign:"center",fontWeight:700,color:C.tx,fontSize:16}}>INDEPENDENT AUDITOR'S REPORT</p>
        <p style={{textAlign:"center",marginBottom:16}}>To the members of <b style={{color:C.al}}>{cfg.entityName}</b></p>
        <p><b style={{color:C.acc}}>Opinion</b></p>
        <p>We have audited the financial statements of {cfg.entityName} for the year ended {cfg.fye} which comprise the statement of comprehensive income, the balance sheet, the statement of changes in equity, the statement of cash flows, and related notes. The framework applied is {fw?.l}.</p>
        <p style={{marginTop:8,whiteSpace:"pre-line"}}>{rep(ops.unmodified.wording)}</p>
      </div>
      <ST t="Opinion Templates Reference (ISA 700/705/706)" color={C.rpt}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {Object.entries(ops).map(([k,o])=>{const col=k==="unmodified"?C.grn:k==="adverse"||k==="disclaimer"?C.red:k.includes("going_concern")?C.org:k.includes("emphasis")?C.blu:C.org;
          return<div key={k} style={{background:col+"0D",border:"1px solid "+col+"33",borderRadius:10,padding:14,borderLeft:"4px solid "+col}}>
            <div style={{fontSize:11,color:col,fontWeight:700,marginBottom:4}}>{o.title}</div>
            <div style={{fontSize:9,color:C.fnt,fontStyle:"italic",marginBottom:6}}>{o.isa} — {o.when}</div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.5,whiteSpace:"pre-line"}}>{rep(o.wording).slice(0,200)}{rep(o.wording).length>200?"...":""}</div>
            {o.basis&&<div style={{fontSize:10,color:C.dim,marginTop:6,fontStyle:"italic",padding:"6px 8px",background:"rgba(255,255,255,0.02)",borderRadius:4}}>{o.basis}</div>}
          </div>})}
      </div>
    </div>;}
    if(wp.id==="f3")return<div><ST t="Completion Letter to Management — ISA 260/265" color={C.rpt}/>
      <div style={{background:C.card,borderRadius:10,padding:20,border:"1px solid "+C.brd,marginBottom:20}}>
        <div style={{fontSize:13,color:C.dim,lineHeight:1.8}}>
          <p><b style={{color:C.tx}}>PRIVATE AND CONFIDENTIAL</b></p>
          <p style={{marginTop:8}}>The Directors<br/><b style={{color:C.al}}>{cfg.entityName||"[Entity]"}</b></p>
          <p style={{marginTop:8}}>Dear Directors,</p>
          <p style={{marginTop:8}}>We have completed our audit of the financial statements for the year ended <b style={{color:C.al}}>{cfg.fye||"[FYE]"}</b> and write to confirm completion of the engagement in accordance with ISA (UK) 260.</p>
        </div>
      </div>
      <BoundET id="f3" headers={["#","Matter","ISA Ref","Detail","Status","Management Response"]} rows={ENGAGEMENT_COMPLETION_LETTER.map((c,i)=>[i+1,<span style={{color:C.tx,fontWeight:500}}>{c.item}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{c.isa}</span>,<span style={{fontSize:11,color:C.dim}}>{c.guidance.slice(0,120)}...</span>,"",""])} editable={[4,5]}/>
    </div>;
    if(wp.id==="f4")return<div><ST t="Audit Committee Report — ISA 260" color={C.rpt}/>
      <div style={{background:"rgba(93,64,55,0.06)",border:"1px solid rgba(93,64,55,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.rpt}}>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>ISA (UK) 260 requires the auditor to communicate significant audit matters to those charged with governance. This report documents all matters required to be communicated and provides a record of governance engagement.</div>
      </div>
      <BoundET id="f4" headers={["#","Communication Requirement","ISA Ref","Detail","Communicated?","Date","Response"]} rows={AUDIT_COMMITTEE_REPORT.map((c,i)=>[i+1,<span style={{color:C.tx,fontWeight:500}}>{c.item}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{c.isa}</span>,<span style={{fontSize:11,color:C.dim}}>{c.guidance.slice(0,120)}...</span>,"","",""])} editable={[4,5,6]}/>
    </div>;
    if(wp.id==="z1"){
      const sections=WPS.filter(w=>w.type==="separator");
      return<div><ST t="Audit Trail Map" color={C.acc}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
          {sections.map((sec,si)=>{
            const secWPs=[];for(let j=WPS.indexOf(sec)+1;j<WPS.length&&WPS[j].type!=="separator";j++)secWPs.push(WPS[j]);
            const secDone=secWPs.filter(w=>signOffs[w.id]?.preparedBy).length;
            const secPct=secWPs.length>0?Math.round((secDone/secWPs.length)*100):0;
            return<div key={si} style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid "+(sec.color||C.brd)+"33"}}>
              <div style={{fontSize:10,color:sec.color||C.fnt,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{sec.label}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                <span style={{fontSize:16,color:C.tx,fontWeight:700}}>{secDone}/{secWPs.length}</span>
                <span style={{fontSize:11,color:secPct===100?C.grn:C.dim}}>{secPct}%</span>
              </div>
              <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",width:secPct+"%",background:secPct===100?C.grn:sec.color||C.acc,borderRadius:2,transition:"width 0.3s"}}/></div>
            </div>;
          })}
        </div>
        <BoundET id="z1" headers={["Ref","Working Paper","ISA","Type","Status","Prepared","Reviewed"]} rows={allWPs.map(w=>{const so=signOffs[w.id]||{};const done=so.preparedBy&&so.reviewedBy;return[<span style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{w.ref}</span>,w.label,w.isa||"—",<span style={{color:tc(w.type),fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{w.type}</span>,<span style={{color:done?C.grn:so.preparedBy?C.org:C.fnt}}>{done?"✓ Complete":so.preparedBy?"◐ WIP":"○ Open"}</span>,so.preparedBy||"",so.reviewedBy||""]})} editable={[]}/>
      </div>;
    }

  return null;
}
