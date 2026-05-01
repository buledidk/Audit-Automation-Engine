import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";
import { TRANSACTION_CYCLES, RISK_TRILOGY } from "../../AuditMethodology";
import { ENTITY_LEVEL_CONTROLS } from "../../AdditionalWPs";

const RiskHeatMap=({risks})=>{ // eslint-disable-line no-unused-vars
  const levels={"SIGNIFICANT":{impact:4,likelihood:4},"ELEVATED":{impact:3,likelihood:3},"NORMAL":{impact:2,likelihood:2}};
  const grid=Array.from({length:5},()=>Array.from({length:5},()=>[]));
  risks.forEach(r=>{const lv=levels[r.lv]||levels.NORMAL;grid[4-lv.impact][lv.likelihood-1].push(r);});
  const cellColor=(row,col)=>{const score=(5-row)*(col+1);return score>=16?C.red:score>=9?C.org:score>=4?"#FDD835":C.grn;};
  return<div style={{marginBottom:24}}>
    <div style={{display:"grid",gridTemplateColumns:"40px repeat(5,1fr)",gridTemplateRows:"repeat(5,60px) 30px",gap:2,maxWidth:600}}>
      {[5,4,3,2,1].map((impLv,row)=><>
        <div key={"lbl"+row} style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.dim,fontWeight:600,writingMode:"horizontal-tb"}}>{impLv}</div>
        {[0,1,2,3,4].map(col=>{const cc=cellColor(row,col);const cellRisks=grid[row][col];return<div key={col} style={{background:cc+"15",border:"1px solid "+cc+"33",borderRadius:4,display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"center",gap:2,padding:2,cursor:cellRisks.length?"pointer":"default"}} onClick={()=>{if(cellRisks.length){const el=document.getElementById("risk_"+cellRisks[0].id);if(el)el.scrollIntoView({behavior:"smooth",block:"center"});}}}>
          {cellRisks.map((r,ri)=><span key={ri} style={{width:20,height:20,borderRadius:4,background:cc+"44",border:"1px solid "+cc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700}} title={r.t}>{r.id.replace("R","").replace("CR","C")}</span>)}
        </div>})}
      </>)}
      <div/>
      {[1,2,3,4,5].map(n=><div key={n} style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.dim,fontWeight:600}}>{n}</div>)}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",maxWidth:600,marginTop:8}}>
      <div style={{fontSize:9,color:C.dim,transform:"rotate(0deg)"}}>← Impact →</div>
      <div style={{fontSize:9,color:C.dim}}>← Likelihood →</div>
    </div>
    <div style={{display:"flex",gap:12,marginTop:8}}>{[{l:"Critical (16-25)",c:C.red},{l:"High (9-15)",c:C.org},{l:"Medium (4-8)",c:"#FDD835"},{l:"Low (1-3)",c:C.grn}].map((lg,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:12,borderRadius:2,background:lg.c+"44",border:"1px solid "+lg.c}}/><span style={{fontSize:9,color:C.dim}}>{lg.l}</span></div>)}</div>
  </div>};

export default function RiskWP({ wp }){
  const {cfg, ind, customItems, _signOffs, setShowModal, _setMi} = useEngagement();
  const {_BoundET, _ST, _tc} = useAuditHelpers();

  if(!ind)return null;

  if(wp.id==="b1"){const allRisks=[...ind.r,...customItems.risks];const trilogy=RISK_TRILOGY[cfg.industry]||[];return<div>
    <ST t="Risk Heat Map — Likelihood vs Impact" color={C.rsk}/>
    <RiskHeatMap risks={allRisks}/>
    <ST t={"Risk Register — "+ind.l+" ("+allRisks.length+" risks)"} color={C.rsk}/>
    <BoundET id="b1" headers={["Ref","Risk Factor","Category","Inherent","Control","Detection","Combined","ISA","Response"]} rows={allRisks.map(r=>[<span id={"risk_"+r.id} style={{fontFamily:"monospace",color:C.acc,fontWeight:700}}>{r.id}</span>,<span style={{color:C.tx}}>{r.t}</span>,<span style={{fontSize:9,color:r.lv==="SIGNIFICANT"?C.red:r.lv==="ELEVATED"?C.org:C.grn,fontWeight:600}}>{r.lv==="SIGNIFICANT"?"Inherent/Fraud":r.lv==="ELEVATED"?"Inherent":"Financial Reporting"}</span>,<Badge level={r.lv}/>,"","","",<span style={{fontSize:10,fontStyle:"italic"}}>{r.isa}</span>,r.rs||""])} editable={[4,5,6,8]}/>
    <button onClick={()=>setShowModal("risk")} style={{marginTop:12,padding:"8px 20px",borderRadius:8,background:C.abg,border:"1px solid "+C.acc+"44",color:C.acc,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Add Custom Risk</button>
    {trilogy.length>0&&<div style={{marginTop:32}}><ST t="Risk Trilogy — Risk → Control → Test Chain (ISA 315/330)" color={C.pur}/>
      <div style={{fontSize:11,color:C.dim,marginBottom:16}}>Each chain maps a risk through its control mitigations, substantive tests, affected FSLI lines, assertions at risk, and disclosure requirements.</div>
      {trilogy.map((rt,ri)=>{const col=rt.level==="SIGNIFICANT"?C.red:C.org;return<div key={ri} style={{marginBottom:24}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
          <div style={{background:col+"0D",border:"1px solid "+col+"33",borderRadius:"10px 0 0 0",padding:14,borderRight:"2px solid "+col+"55"}}>
            <div style={{fontSize:9,color:col,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>① Risk ({rt.riskId})</div>
            <div style={{fontSize:12,color:C.tx,fontWeight:500,marginBottom:6}}>{rt.riskDescription.slice(0,120)}{rt.riskDescription.length>120?"...":""}</div>
            <Badge level={rt.level}/>
            <div style={{marginTop:6}}>{rt.inherentRiskFactors.slice(0,2).map((f,fi)=><div key={fi} style={{fontSize:9,color:C.fnt}}>• {f}</div>)}</div>
          </div>
          <div style={{background:C.pur+"0D",border:"1px solid "+C.pur+"33",padding:14,borderRight:"2px solid "+C.pur+"55"}}>
            <div style={{fontSize:9,color:C.pur,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>② Controls</div>
            {rt.controlProcedures.slice(0,3).map((cp,ci)=><div key={ci} style={{fontSize:10,color:C.dim,lineHeight:1.4,marginBottom:4}}>• {cp}</div>)}
            <div style={{fontSize:9,color:C.fnt,marginTop:4}}>ISA 315.14 · ISA 330.6</div>
          </div>
          <div style={{background:C.tst+"0D",border:"1px solid "+C.tst+"33",borderRadius:"0 10px 0 0",padding:14}}>
            <div style={{fontSize:9,color:C.tst,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>③ Substantive Tests</div>
            {rt.substantiveTests.slice(0,3).map((st,si)=><div key={si} style={{fontSize:10,color:C.dim,lineHeight:1.4,marginBottom:4}}>• {st.test.slice(0,80)}{st.test.length>80?"...":""} <span style={{fontSize:8,color:C.fnt}}>({st.wpRef})</span></div>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid "+C.brd,borderRadius:"0 0 0 10px",padding:10}}>
            <div style={{fontSize:9,color:C.blu,fontWeight:700,marginBottom:4}}>FSLI Impact</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{rt.fsliImpact.map((f,fi)=><span key={fi} style={{padding:"2px 6px",borderRadius:3,background:C.blu+"15",border:"1px solid "+C.blu+"33",fontSize:8,color:C.blu}}>{f}</span>)}</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid "+C.brd,padding:10}}>
            <div style={{fontSize:9,color:C.tl,fontWeight:700,marginBottom:4}}>Assertions</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{rt.assertions.map((a,ai)=><span key={ai} style={{padding:"2px 6px",borderRadius:3,background:C.tl+"15",border:"1px solid "+C.tl+"33",fontSize:8,color:C.tl}}>{a}</span>)}</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid "+C.brd,borderRadius:"0 0 10px 0",padding:10}}>
            <div style={{fontSize:9,color:C.grn,fontWeight:700,marginBottom:4}}>Disclosures</div>
            {rt.disclosureRequirements.slice(0,2).map((d,di)=><div key={di} style={{fontSize:8,color:C.fnt}}>{d}</div>)}
          </div>
        </div>
      </div>})}
    </div>}
  </div>}
  if(wp.id==="b2"){const cycles=Object.values(TRANSACTION_CYCLES);return<div><ST t="Controls Assessment — ISA 315.14" color={C.rsk}/>
    {cycles.map((cyc,ci)=><div key={ci} style={{marginBottom:24}}>
      <div style={{background:"rgba(229,57,53,0.06)",border:"1px solid rgba(229,57,53,0.2)",borderRadius:"10px 10px 0 0",padding:"12px 16px",borderLeft:"4px solid "+C.rsk}}>
        <div style={{fontSize:11,color:C.rsk,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{cyc.name}</div>
        <div style={{fontSize:9,color:C.fnt,marginTop:2}}>{cyc.isa} · Processes: {cyc.processes.join(" → ")}</div>
      </div>
      <BoundET id={"b2_"+ci} headers={["Control","Assertion","Risk Addressed","Design Effective?","Operating Effective?","Test Method","Reliance?"]} rows={cyc.key_controls.map(kc=>[<span style={{color:C.tx}}>{kc.control}</span>,<span style={{fontSize:10,color:C.blu}}>{kc.assertion}</span>,<span style={{fontSize:11,color:C.dim}}>{kc.risk}</span>,"","","",""])} editable={[3,4,5,6]}/>
    </div>)}
    <div style={{marginTop:8}}><ST t="Entity-Specific Controls" color={C.org}/></div>
    <BoundET id="b2_entity" headers={["Control Area","Description","Design Effective?","Operating Effective?","Test Method","Reliance?"]} rows={ind.ct.map(c=>[ind.l,<span style={{color:C.tx}}>{c}</span>,"","","",""])} editable={[2,3,4,5]}/>
  </div>;}
  if(wp.id==="b3")return<div><ST t="Significant Risks — ISA 315.28" color={C.rsk}/><BoundET id="b3" headers={["Risk","Why Significant","Planned Response","WP Ref","Conclusion"]} rows={ind.r.filter(r=>r.lv==="SIGNIFICANT").map(r=>[<span style={{color:C.tx}}>{r.t}</span>,"Inherent complexity; estimation uncertainty",r.rs||"",r.isa,""])} editable={[1,2,3,4]}/></div>;
  if(wp.id==="b4")return<div><ST t="Entity-Level Controls Assessment — ISA 315.14–21" color={C.rsk}/>
    <div style={{background:"rgba(198,40,40,0.04)",border:"1px solid rgba(198,40,40,0.15)",borderRadius:10,padding:14,marginBottom:16,borderLeft:"4px solid "+C.rsk}}>
      <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>Assess the entity's control environment, risk assessment process, information system, control activities, and monitoring per ISA 315.14–21 and the COSO 2013 framework. Document design effectiveness for each component.</div>
    </div>
    <BoundET id="b4" headers={["#","Control Component","ISA / Framework Ref","Guidance","Required Evidence","Design Assessment","Operating Assessment","Conclusion"]} rows={ENTITY_LEVEL_CONTROLS.map((c,i)=>[i+1,<span style={{color:C.tx,fontWeight:500}}>{c.item}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.fnt}}>{c.isa}</span>,<span style={{fontSize:11,color:C.dim}}>{c.guidance.slice(0,100)}...</span>,<span style={{fontSize:10,color:C.dim}}>{c.evidence.slice(0,80)}...</span>,"","",""])} editable={[5,6,7]}/>
  </div>;

  return null;
}
