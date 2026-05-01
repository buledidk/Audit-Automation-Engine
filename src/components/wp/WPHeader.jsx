import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers.jsx";
import { exportWP, getExportFormat, getExportLabel, getExportIcon } from "../../ExportEngine";
import { TESTS, C } from "../../data";
import { ENGAGEMENT_LETTER, REPRESENTATIONS, AUDIT_OPINIONS } from "../../AuditMethodology";

export const WPHead = ({ wp, buildWPCsv, callAI, handleSmartExtract }) => {
  const {
    cfg, ind, fw, sz, signOffs, reviewStatus, archived,
    reviewNotes, setReviewNotes, CC, indAcc, // eslint-disable-line no-unused-vars
    setAiOpen, setAiMessages,
    cellData, wpNotes, customItems
  } = useEngagement();

  const { doSign, formatSignOff, tc, getCell, getUserIdentity } = useAuditHelpers();

  const col = tc(wp.type);

  return (
    <div style={{background:"linear-gradient(135deg,"+col+"15,"+col+"08)",border:"1px solid "+col+"33",borderRadius:12,padding:"18px 22px",marginBottom:20,borderLeft:"4px solid "+col}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>{wp.icon}</span>
          <div><div style={{display:"flex",alignItems:"baseline",gap:8}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:col}}>{wp.ref}</span><span style={{fontSize:16,color:C.tx,fontWeight:600}}>{wp.label}</span></div>
          <div style={{fontSize:11,color:C.dim,marginTop:2}}>{wp.isa} · {ind?.l} · {cfg.sector}</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{const ctx={entityName:cfg.entityName,fye:cfg.fye,industry:ind?.l,sector:cfg.sector,framework:fw?.l,materiality:cfg.materiality,perfMateriality:cfg.perfMateriality,trivial:cfg.trivial,firmName:cfg.firmName,partner:cfg.partner,manager:cfg.manager,entitySize:sz?.l,cellData,signOffs,wpNotes,customItems,getCell,tests:TESTS,customTests:customItems.tests,risks:ind?[...ind.r,...customItems.risks]:[],fsliLines:wp.fk&&ind?.f?.[wp.fk]?ind.f[wp.fk].filter(l=>l!=="N/A"&&l!=="N/A for pure SaaS"):[],engagementLetterData:ENGAGEMENT_LETTER,representationsData:REPRESENTATIONS,auditOpinions:AUDIT_OPINIONS};exportWP(wp,ctx).catch(e=>console.error("Export error:",e));}} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:getExportFormat(wp)==="docx"?"rgba(21,101,192,0.1)":"rgba(0,105,92,0.1)",border:"1px solid "+(getExportFormat(wp)==="docx"?"rgba(21,101,192,0.35)":"rgba(0,105,92,0.35)"),color:getExportFormat(wp)==="docx"?"#42A5F5":"#26A69A",textTransform:"uppercase",letterSpacing:"0.08em"}}>{getExportIcon(wp)} {getExportLabel(wp)}</button> // eslint-disable-line no-unused-vars
          <button onClick={()=>buildWPCsv(wp)} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:"rgba(67,160,71,0.1)",border:"1px solid rgba(67,160,71,0.35)",color:C.grn,textTransform:"uppercase",letterSpacing:"0.08em"}}>📥 CSV</button>
          <button onClick={()=>{setAiOpen(true);setAiMessages([]);callAI(`I'm working on ${wp.ref} ${wp.label} (${wp.isa}). Give me a concise briefing: (1) What this working paper must document per ISA requirements, (2) Key risks for ${ind?.l||"this industry"} in this area, (3) Minimum evidence required, (4) Common deficiencies reviewers find. Be specific and practical.`);}} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))",border:"1px solid rgba(99,102,241,0.35)",color:"#A5B4FC",textTransform:"uppercase",letterSpacing:"0.08em"}}>🤖 AI Assist</button>
          <button onClick={()=>{setAiOpen(true);setAiMessages([]);callAI(`Auto-populate working paper ${wp.ref} ${wp.label} for entity ${cfg.entityName||"[Entity]"} in ${ind?.l||"[Industry]"} (${cfg.sector||"[Sector]"}). Fill in all assessment fields, evidence descriptions, and conclusions based on a typical ${fw?.l||"FRS 102"} audit. Use professional judgment language. Include ISA paragraph references. For each field, provide realistic sample content that an auditor would write. Structure your response as a numbered list matching each row in the working paper.`);}} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:"linear-gradient(135deg,rgba(245,166,35,0.15),rgba(255,213,79,0.15))",border:"1px solid rgba(245,166,35,0.35)",color:"#FFD54F",textTransform:"uppercase",letterSpacing:"0.08em"}}>⚡ AI Fill</button>
          <button onClick={()=>{const fi=document.createElement("input");fi.type="file";fi.accept=".csv,.xlsx,.xls,.txt,.pdf";fi.onchange=ev=>{if(ev.target.files[0])handleSmartExtract(wp.id,ev.target.files[0]);};fi.click();}} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:"rgba(156,39,176,0.1)",border:"1px solid rgba(156,39,176,0.35)",color:"#CE93D8",textTransform:"uppercase",letterSpacing:"0.08em"}}>📂 Extract</button>
          {["preparedBy","reviewedBy"].map(role=>{const done=signOffs[wp.id]?.[role];return<button key={role} onClick={()=>doSign(wp.id,role)} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:done?"rgba(76,175,80,0.15)":"rgba(255,255,255,0.05)",border:"1px solid "+(done?"rgba(76,175,80,0.4)":"rgba(255,255,255,0.1)"),color:done?C.grn:C.dim,textTransform:"uppercase",letterSpacing:"0.08em"}}>{done?("✓ "+(role==="preparedBy"?"Prepared":"Reviewed")+" "+formatSignOff(done)):(role==="preparedBy"?"✎ Prepared By":"✎ Reviewed By")}</button>})}
          {signOffs[wp.id]?.preparedBy&&signOffs[wp.id]?.reviewedBy&&(()=>{const approved=signOffs[wp.id]?.approvedBy;return<button onClick={()=>doSign(wp.id,"approvedBy")} style={{padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:approved?"rgba(255,213,79,0.15)":"rgba(255,255,255,0.05)",border:"1px solid "+(approved?"rgba(255,213,79,0.4)":"rgba(255,255,255,0.1)"),color:approved?"#FFD54F":C.dim,textTransform:"uppercase",letterSpacing:"0.08em"}}>{approved?"★ Partner Approved "+formatSignOff(approved):"★ Partner Approved"}</button>;})()}
        </div>
      </div>
      <div style={{display:"flex",gap:16,marginTop:12,fontSize:10,color:C.fnt,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)",alignItems:"center"}}>
        <span>Entity: <b style={{color:C.al}}>{cfg.entityName}</b></span><span>FYE: <b style={{color:C.dim}}>{cfg.fye}</b></span><span>Materiality: <b style={{color:C.al}}>£{cfg.materiality||"TBD"}</b></span>
        {reviewStatus&&<span style={{marginLeft:"auto",padding:"2px 10px",borderRadius:4,background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.3)",color:"#A5B4FC",fontSize:9,fontWeight:700}}>{reviewStatus}</span>}
        {archived&&<span style={{marginLeft:reviewStatus?"0":"auto",padding:"2px 10px",borderRadius:4,background:"rgba(239,83,80,0.15)",border:"1px solid rgba(239,83,80,0.3)",color:C.red,fontSize:9,fontWeight:700}}>🔒 ARCHIVED</span>}
      </div>
      {signOffs[wp.id]?.reviewedBy&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,padding:"6px 12px",borderRadius:6,background:"rgba(66,165,245,0.08)",border:"1px solid rgba(66,165,245,0.25)"}}>
        <span>🔒</span>
        <span style={{fontSize:10,color:C.blu,fontWeight:600}}>Reviewed — edits will clear sign-off</span>
      </div>}
      <DropZone wpId={wp.id} label="Attach supporting evidence"/>
      <ReviewNotesPanel
        wpId={wp.id}
        notes={reviewNotes[wp.id]||[]}
        onAddNote={(note)=>setReviewNotes(p=>({...p,[wp.id]:[...(p[wp.id]||[]),note]}))}
        onRespond={(noteId,data)=>setReviewNotes(p=>({...p,[wp.id]:(p[wp.id]||[]).map(n=>n.id===noteId?{...n,...data,status:"responded"}:n)}))}
        onClear={(noteId,data)=>setReviewNotes(p=>({...p,[wp.id]:(p[wp.id]||[]).map(n=>n.id===noteId?{...n,...data,status:"cleared"}:n)}))}
        onReopen={(noteId)=>setReviewNotes(p=>({...p,[wp.id]:(p[wp.id]||[]).map(n=>n.id===noteId?{...n,status:"raised",respondedBy:null,respondedAt:null,response:null,clearedBy:null,clearedAt:null}:n)}))}
        colors={CC}
        archived={archived}
        getUserIdentity={getUserIdentity}
      />
    </div>
  );
};
