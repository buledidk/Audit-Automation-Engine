import { useState } from "react";
import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers.jsx";
import { C, WPS } from "../../data";
import { uploadFile, getDownloadUrl, deleteDocument } from "../../DocumentService";
import { isSupabaseConfigured, supabase } from "../../supabaseClient";

const fileIcon = ext => ext === "pdf" ? "📄" : ["csv","xlsx","xls"].includes(ext) ? "📊" : ["doc","docx"].includes(ext) ? "📝" : "📎";

export const DropZone = ({ wpId, label }) => {
  const {
    uploads, setUploads, documentLinks, setDocumentLinks,
    archived, indAcc, showToast, engId, CC // eslint-disable-line no-unused-vars
  } = useEngagement();

  const { getUserIdentity, tc } = useAuditHelpers();

  const [dragOver, setDragOver] = useState(false);
  const [linkPopover, setLinkPopover] = useState(null);
  const [linkSearch, setLinkSearch] = useState("");
  const files = uploads[wpId] || [];
  const ASSERTIONS = ["Existence","Completeness","Accuracy","Valuation","Rights","Cut-off","Presentation"];

  const handleFileDrop = async (wId, rawFiles) => {
    if (archived) return;
    const fileList = [...rawFiles];
    for (const f of fileList) {
      try {
        const doc = await uploadFile(engId, wId, f);
        setUploads(p => ({...p, [wId]: [...(p[wId] || []), doc]}));
        showToast(f.name + " uploaded", "success");
      } catch (err) {
        console.error("Upload error:", err);
        showToast("Upload failed: " + f.name, "error");
      }
    }
  };

  const handleDownload = async (f) => {
    const url = await getDownloadUrl(f);
    if (url) window.open(url, "_blank");
    else showToast("Download not available (metadata only)", "warning");
  };

  const handleDelete = async (f, i) => {
    await deleteDocument(f, engId);
    setUploads(p => ({...p, [wpId]: p[wpId].filter((_, j) => j !== i)}));
  };

  const setTag = (i, tag) => setUploads(p => ({...p, [wpId]: p[wpId].map((x, j) => j === i ? {...x, evidence_tag: tag} : x)}));

  const linkDocToWP = (docId, targetWpId, assertion) => {
    const link = {wpId: targetWpId, assertion, linkedAt: new Date().toISOString(), linkedBy: getUserIdentity()?.name || "Unknown"};
    setDocumentLinks(p => ({...p, [docId]: [...(p[docId] || []), link]}));
    if (isSupabaseConfigured()) {
      supabase.from('document_links').insert({document_id: docId, wp_id: targetWpId, assertion, linked_by: link.linkedBy}).then(null, e => console.warn(e));
    }
    showToast("Linked to " + targetWpId.toUpperCase(), "success");
    setLinkPopover(null);
    setLinkSearch("");
  };

  // Cross-referenced evidence from other WPs
  const crossRefs = Object.entries(documentLinks).flatMap(([docId, links]) =>
    links.filter(l => l.wpId === wpId).map(l => {
      const sourceWp = Object.entries(uploads).find(([_wid, fls]) => fls.some(f => f.id === docId));
      const doc = sourceWp ? sourceWp[1].find(f => f.id === docId) : null;
      return doc ? {...doc, sourceWpId: sourceWp[0], assertion: l.assertion, linkedBy: l.linkedBy} : null;
    }).filter(Boolean)
  );

  return (
    <div style={{marginTop:12}}>
      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}}
           onDragLeave={()=>setDragOver(false)}
           onDrop={e=>{e.preventDefault();setDragOver(false);handleFileDrop(wpId,e.dataTransfer.files);}}
           onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.multiple=true;inp.accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.jpg,.png";inp.onchange=e=>handleFileDrop(wpId,e.target.files);inp.click();}}
        style={{border:"2px dashed "+(dragOver?indAcc+"99":C.brd),borderRadius:10,padding:files.length?"12px 16px":"20px 16px",textAlign:"center",cursor:archived?"not-allowed":"pointer",background:dragOver?indAcc+"0D":"rgba(255,255,255,0.015)",transition:"all 0.2s"}}>
        {!files.length&&<><div style={{fontSize:20,marginBottom:4}}>📁</div><div style={{fontSize:11,color:C.dim}}>{label||"Drop files here or click to upload"}</div><div style={{fontSize:9,color:C.fnt,marginTop:2}}>CSV · Excel · PDF · Word · Images</div></>}
        {files.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"flex-start"}}>
          {files.map((f,i)=><div key={f.id||i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:6,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.brd,fontSize:11,position:"relative"}}>
            <span>{fileIcon(f.ext)}</span>
            <span style={{color:C.tx,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
            <span style={{fontSize:9,color:C.fnt}}>{(f.size/1024).toFixed(0)}KB</span>
            {f.evidence_tag&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:C.grn+"22",color:C.grn,fontWeight:600}}>{f.evidence_tag}</span>}
            {f._oversized&&<span style={{fontSize:8,color:C.org}}>⚠ offline N/A</span>}
            {f.id&&<select onClick={e=>e.stopPropagation()} value={f.evidence_tag||""} onChange={e=>{e.stopPropagation();setTag(i,e.target.value);}} style={{fontSize:9,background:"transparent",border:"1px solid "+C.brd,borderRadius:3,color:C.dim,cursor:"pointer",padding:"1px 2px"}}>
              <option value="">Tag</option>{ASSERTIONS.map(a=><option key={a} value={a}>{a}</option>)}
            </select>}
            {f.id&&<span onClick={e=>{e.stopPropagation();handleDownload(f);}} style={{cursor:"pointer",color:C.blu,fontSize:11}} title="Download">📥</span>}
            {f.id&&<span onClick={e=>{e.stopPropagation();setLinkPopover(linkPopover===f.id?null:f.id);}} style={{cursor:"pointer",color:C.pur,fontSize:11}} title="Link to WP">🔗</span>}
            {!archived&&<span onClick={e=>{e.stopPropagation();handleDelete(f,i);}} style={{cursor:"pointer",color:C.red,fontSize:12}}>×</span>}
            {linkPopover===f.id&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"100%",left:0,zIndex:100,background:"#151D30",border:"1px solid "+C.brd,borderRadius:8,padding:8,width:200,marginTop:4,boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>
              <input value={linkSearch} onChange={e=>setLinkSearch(e.target.value)} placeholder="Search WPs..." style={{width:"100%",padding:"4px 6px",borderRadius:4,background:"rgba(255,255,255,0.06)",border:"1px solid "+C.brd,color:C.tx,fontSize:9,outline:"none",marginBottom:4}}/>
              <div style={{maxHeight:120,overflowY:"auto"}}>{WPS.filter(w=>w.type!=="separator"&&w.id!==wpId&&(!linkSearch||w.label.toLowerCase().includes(linkSearch.toLowerCase())||w.ref.toLowerCase().includes(linkSearch.toLowerCase()))).slice(0,10).map(w=><div key={w.id} onClick={()=>linkDocToWP(f.id,w.id,f.evidence_tag||null)} style={{padding:"3px 6px",fontSize:9,color:C.dim,cursor:"pointer",borderRadius:3,display:"flex",gap:4}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}><span style={{color:tc(w.type),fontFamily:"monospace"}}>{w.ref}</span><span>{w.label}</span></div>)}</div>
            </div>}
          </div>)}
          <div style={{fontSize:10,color:C.dim,display:"flex",alignItems:"center",gap:4}}>+ Add more</div>
        </div>}
      </div>
      {crossRefs.length>0&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:6,background:"rgba(206,147,216,0.05)",border:"1px solid rgba(206,147,216,0.15)"}}>
        <div style={{fontSize:9,color:C.pur,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Cross-Referenced Evidence</div>
        {crossRefs.map((cr,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.dim,padding:"2px 0"}}>
          <span>{fileIcon(cr.ext)}</span>
          <span style={{color:C.tx}}>{cr.name}</span>
          <span style={{fontSize:8,color:C.fnt}}>(from {cr.sourceWpId.toUpperCase()})</span>
          {cr.assertion&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:C.grn+"22",color:C.grn,fontWeight:600}}>{cr.assertion}</span>}
          <span style={{fontSize:8,color:C.fnt}}>— {cr.linkedBy}</span>
        </div>)}
      </div>}
    </div>
  );
};
