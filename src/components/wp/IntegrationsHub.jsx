import { useState } from "react";
import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";
import { getConnectors, parsePlatformExport, mapToTrialBalance, validateImportData, generateAllTemplatesZip, lookupCompaniesHouse, getCompatibilityMatrix } from "../../IntegrationsEngine";
import { reconcileTBToFS, reconcileBankToLedger, reconcileSubLedgerToControl, reconcilePayrollToGL, reconcileIntercompany, exportReconciliation } from "../../ReconciliationEngine";

export default function IntegrationsHub({ buildExportCtx, getMappedTotals }) {
  const { integrations, setIntegrations, tbData, setTbData, tbMappings, setTbMappings, cfg, setCfg, showToast, setAiAuditTrail } = useEngagement();
  const { _ST } = useAuditHelpers();
  const[importPreview,setImportPreview]=useState(null);
  const[importValidation,setImportValidation]=useState(null);
  const[showMatrix,setShowMatrix]=useState(false);
  const[reconResults,setReconResults]=useState(null);
  const[activeConnector,setActiveConnector]=useState(null);
  const connectors=getConnectors();
  const intState=integrations||{};

  const handleFileImport=async(connectorId,dataType)=>{
    const fi=document.createElement("input");fi.type="file";fi.accept=".csv,.xlsx,.xls";
    fi.onchange=async(ev)=>{
      const file=ev.target.files[0];if(!file)return;
      try{
        const result=await parsePlatformExport(connectorId,file,dataType||"trialBalance");
        const validation=validateImportData(result,dataType||"trialBalance");
        setImportPreview({connectorId,dataType:dataType||"trialBalance",fileName:file.name,data:result});
        setImportValidation(validation);
        // Log to import history
        setIntegrations(p=>({...p,[connectorId]:{...(p[connectorId]||{}),importHistory:[...((p[connectorId]||{}).importHistory||[]),{timestamp:new Date().toISOString(),file:file.name,rows:result.rows.length,dataType:dataType||"trialBalance",validation:validation.valid?"valid":validation.errors.length?"errors":"warnings"}],lastSync:new Date().toISOString()}}));
        // Log to audit trail
        setAiAuditTrail(prev=>[...prev,{id:"IMP-"+String(prev.length+1).padStart(4,"0"),timestamp:new Date().toISOString(),wpRef:"INT1",prompt:"Import from "+connectorId+": "+file.name,responseSummary:result.rows.length+" rows, validation: "+(validation.valid?"passed":validation.errors.length+" errors"),responseLength:result.rows.length,approvedBy:cfg.partner||"[Not set]",modifications:"Data import",status:validation.valid?"Validated":"Review required"}]);
        showToast("Imported "+result.rows.length+" rows from "+file.name);
      }catch(e){showToast("Import failed: "+e.message,"error");}
    };fi.click();
  };

  const applyToTB=(data,connectorId)=>{
    const tbRows=mapToTrialBalance(data,connectorId);
    setTbData(prev=>[...prev,...tbRows]);
    const newMappings={...tbMappings};
    tbRows.forEach((r,i)=>{if(r._fsli&&r._fsli!=="Other")newMappings[tbData.length+i]=r._fsli;});
    setTbMappings(newMappings);
    setImportPreview(null);
    showToast("Applied "+tbRows.length+" rows to Trial Balance");
  };

  const runReconciliation=(type)=>{
    let result;
    if(type==="tbToFS"){result=reconcileTBToFS(tbData,tbMappings,{});}
    else if(type==="bankToLedger"){result=reconcileBankToLedger([],[]);}
    else if(type==="subLedgerAR"){const arTotal=0;const tbDebtors=getMappedTotals().Receivables?.cy||0;result=reconcileSubLedgerToControl(arTotal,tbDebtors,"AR to TB Debtors");}
    else if(type==="subLedgerAP"){const apTotal=0;const tbCreditors=getMappedTotals().Payables?.cy||0;result=reconcileSubLedgerToControl(apTotal,tbCreditors,"AP to TB Creditors");}
    else if(type==="payroll"){result=reconcilePayrollToGL([],{});}
    else if(type==="intercompany"){result=reconcileIntercompany({},{});}
    setReconResults({type,result});
  };

  const statusColor=s=>s==="balanced"?C.grn:s==="differences"?C.org:C.red;
  const matrix=getCompatibilityMatrix();

  return<div>
    <ST t="Integrations Hub — Platform Connectors & Data Import" color="#00BFA5"/>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
      <button onClick={async()=>{try{await generateAllTemplatesZip();showToast("Templates downloaded","export");}catch(e){showToast("Download failed: "+e.message,"error");}}} style={{padding:"10px 20px",borderRadius:8,background:"rgba(0,191,165,0.1)",border:"1px solid rgba(0,191,165,0.35)",color:"#00BFA5",cursor:"pointer",fontSize:11,fontWeight:700}}>📋 Download Import Templates (ZIP)</button>
      <button onClick={()=>setShowMatrix(p=>!p)} style={{padding:"10px 20px",borderRadius:8,background:"rgba(66,165,245,0.1)",border:"1px solid rgba(66,165,245,0.35)",color:C.blu,cursor:"pointer",fontSize:11,fontWeight:700}}>{showMatrix?"Hide":"Show"} Compatibility Matrix</button>
    </div>

    {showMatrix&&<div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:16,marginBottom:20,overflowX:"auto"}}>
      <div style={{fontSize:12,color:"#00BFA5",fontWeight:700,marginBottom:12}}>Platform Compatibility Matrix</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr>{["Platform","Category","Country","Auth","Import Methods","Data Types","Limitations"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 10px",background:C.thBg,borderBottom:"2px solid #00BFA544",fontSize:9,color:"#00BFA5",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>{matrix.map((m,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.tx,fontWeight:600}}>{m.logo} {m.name}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim}}>{m.category}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim}}>{m.country}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim,fontSize:10}}>{m.authMethod}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{m.importMethods.map((f,fi)=><span key={fi} style={{padding:"1px 6px",borderRadius:3,background:"rgba(0,191,165,0.1)",border:"1px solid rgba(0,191,165,0.25)",fontSize:9,color:"#00BFA5",marginRight:4}}>{f}</span>)}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:10,color:C.dim}}>{m.dataTypes.join(", ")}</td>
          <td style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:10,color:C.fnt}}>{m.limitations}</td>
        </tr>)}</tbody>
      </table>
    </div>}

    <div style={{fontSize:10,color:"#00BFA5",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:12,fontWeight:700}}>Platform Connectors</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:24}}>
      {connectors.map(c=>{const cs=intState[c.id]||{};const histCount=(cs.importHistory||[]).length;return<div key={c.id} style={{background:C.card,border:"1px solid "+(activeConnector===c.id?"#00BFA566":C.brd),borderRadius:10,padding:16,cursor:"pointer"}} onClick={()=>setActiveConnector(p=>p===c.id?null:c.id)}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:24}}>{c.logo}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:C.tx}}>{c.name}</div>
            <div style={{fontSize:10,color:C.fnt}}>{c.category} · {c.country}</div>
          </div>
          <span style={{padding:"3px 10px",borderRadius:6,fontSize:9,fontWeight:700,background:cs.lastSync?"rgba(102,187,106,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(cs.lastSync?C.grn+"44":C.brd),color:cs.lastSync?C.grn:C.fnt}}>{cs.lastSync?"Connected":"Not connected"}</span>
        </div>
        {cs.lastSync&&<div style={{fontSize:9,color:C.fnt,marginBottom:4}}>Last sync: {new Date(cs.lastSync).toLocaleString()} · {histCount} import{histCount!==1?"s":""}</div>}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          {c.id!=="companieshouse"&&c.dataTypes.map(dt=><button key={dt} onClick={e=>{e.stopPropagation();handleFileImport(c.id,dt);}} style={{padding:"5px 12px",borderRadius:6,background:"rgba(0,191,165,0.08)",border:"1px solid rgba(0,191,165,0.25)",color:"#00BFA5",cursor:"pointer",fontSize:10,fontWeight:600}}>📂 Import {dt}</button>)}
          {c.id==="companieshouse"&&<button onClick={e=>{e.stopPropagation();const cn=prompt("Enter Companies House number (8 digits):");if(cn){const data=lookupCompaniesHouse(cn);setCfg(p=>({...p,companyNumber:cn,entityName:data.name||p.entityName}));showToast("Companies House data loaded for "+cn);}}} style={{padding:"5px 12px",borderRadius:6,background:"rgba(0,191,165,0.08)",border:"1px solid rgba(0,191,165,0.25)",color:"#00BFA5",cursor:"pointer",fontSize:10,fontWeight:600}}>🏛️ Lookup Company</button>}
        </div>
        {activeConnector===c.id&&(cs.importHistory||[]).length>0&&<div style={{marginTop:12,borderTop:"1px solid "+C.brd,paddingTop:8}}>
          <div style={{fontSize:9,color:"#00BFA5",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Import History</div>
          {cs.importHistory.slice(-5).reverse().map((h,hi)=><div key={hi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:10}}>
            <span style={{color:C.dim}}>{new Date(h.timestamp).toLocaleString()}</span>
            <span style={{color:C.tx}}>{h.file}</span>
            <span style={{color:C.fnt}}>{h.rows} rows</span>
            <span style={{padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:600,background:h.validation==="valid"?C.grn+"15":h.validation==="errors"?C.red+"15":C.org+"15",color:h.validation==="valid"?C.grn:h.validation==="errors"?C.red:C.org}}>{h.validation}</span>
          </div>)}
        </div>}
      </div>})}
    </div>

    {importPreview&&<div style={{background:C.card,border:"1px solid #00BFA544",borderRadius:10,padding:20,marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:13,color:"#00BFA5",fontWeight:700}}>Import Preview — {importPreview.fileName}</div>
          <div style={{fontSize:10,color:C.dim}}>Source: {importPreview.connectorId} · Type: {importPreview.dataType} · {importPreview.data.rows.length} rows</div>
        </div>
        <button onClick={()=>{setImportPreview(null);setImportValidation(null);}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      {importValidation&&<div style={{marginBottom:12}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <span style={{padding:"4px 12px",borderRadius:6,fontSize:10,fontWeight:700,background:importValidation.valid?C.grn+"15":C.red+"15",border:"1px solid "+(importValidation.valid?C.grn:C.red)+"44",color:importValidation.valid?C.grn:C.red}}>{importValidation.valid?"✓ Validation Passed":"✗ Validation Failed"}</span>
          {importValidation.warnings.length>0&&<span style={{padding:"4px 12px",borderRadius:6,fontSize:10,fontWeight:700,background:C.org+"15",border:"1px solid "+C.org+"44",color:C.org}}>{importValidation.warnings.length} warning{importValidation.warnings.length!==1?"s":""}</span>}
        </div>
        {importValidation.errors.map((e,i)=><div key={i} style={{padding:"4px 8px",fontSize:10,color:C.red,background:C.red+"08",borderRadius:4,marginBottom:2}}>✗ {e}</div>)}
        {importValidation.warnings.slice(0,5).map((w,i)=><div key={i} style={{padding:"4px 8px",fontSize:10,color:C.org,background:C.org+"08",borderRadius:4,marginBottom:2}}>⚠ {w}</div>)}
        {importValidation.warnings.length>5&&<div style={{fontSize:9,color:C.fnt,marginTop:4}}>...and {importValidation.warnings.length-5} more warnings</div>}
      </div>}
      {importPreview.data.rows.length>0&&<div style={{overflowX:"auto",maxHeight:300,marginBottom:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr>{Object.keys(importPreview.data.rows[0]).filter(k=>!k.startsWith("_")).slice(0,8).map((h,i)=><th key={i} style={{padding:"6px 8px",background:C.thBg,borderBottom:"1px solid "+C.brd,color:"#00BFA5",textAlign:"left",fontSize:9,textTransform:"uppercase",position:"sticky",top:0}}>{h}</th>)}</tr></thead>
          <tbody>{importPreview.data.rows.slice(0,20).map((row,ri)=><tr key={ri}>{Object.entries(row).filter(([k])=>!k.startsWith("_")).slice(0,8).map(([,v],ci)=><td key={ci} style={{padding:"4px 8px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim,fontSize:11}}>{typeof v==="number"?v.toLocaleString("en-GB",{minimumFractionDigits:v%1?2:0}):String(v||"").slice(0,40)}</td>)}</tr>)}</tbody>
        </table>
        {importPreview.data.rows.length>20&&<div style={{padding:4,textAlign:"center",fontSize:9,color:C.fnt}}>Showing 20 of {importPreview.data.rows.length} rows</div>}
      </div>}
      <div style={{display:"flex",gap:8}}>
        {importPreview.dataType==="trialBalance"&&<button onClick={()=>applyToTB(importPreview.data,importPreview.connectorId)} style={{padding:"8px 20px",borderRadius:8,background:"linear-gradient(135deg,#00BFA5,#00E5CC)",border:"none",color:"#000",cursor:"pointer",fontSize:11,fontWeight:700}}>Apply to Trial Balance</button>}
        <button onClick={()=>{setImportPreview(null);setImportValidation(null);}} style={{padding:"8px 16px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.brd,color:C.dim,cursor:"pointer",fontSize:11}}>Cancel</button>
      </div>
    </div>}

    <div style={{fontSize:10,color:"#00BFA5",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:12,fontWeight:700}}>Reconciliation</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
      {[{id:"tbToFS",l:"TB to FS"},{id:"bankToLedger",l:"Bank to Ledger"},{id:"subLedgerAR",l:"AR Sub-ledger"},{id:"subLedgerAP",l:"AP Sub-ledger"},{id:"payroll",l:"Payroll to GL"},{id:"intercompany",l:"Intercompany"}].map(r=><button key={r.id} onClick={()=>runReconciliation(r.id)} style={{padding:"8px 16px",borderRadius:8,background:"rgba(0,191,165,0.08)",border:"1px solid rgba(0,191,165,0.25)",color:"#00BFA5",cursor:"pointer",fontSize:11,fontWeight:600}}>{r.l}</button>)}
    </div>
    {reconResults&&reconResults.result&&<div style={{background:C.card,border:"1px solid "+statusColor(reconResults.result.status)+"44",borderRadius:10,padding:16,marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:statusColor(reconResults.result.status)}}>{reconResults.type.replace(/([A-Z])/g," $1")} — {reconResults.result.status.toUpperCase()}</div>
          <div style={{fontSize:10,color:C.dim}}>Matched: {reconResults.result.matched.length} · Differences: {reconResults.result.differences.length} · Unmatched: {reconResults.result.unmatched.length}</div>
        </div>
        <button onClick={async()=>{try{await exportReconciliation(reconResults.result,reconResults.type,buildExportCtx());showToast("Reconciliation exported","export");}catch(e){showToast("Export failed: "+e.message,"error");}}} style={{padding:"6px 14px",borderRadius:6,background:"rgba(0,191,165,0.1)",border:"1px solid rgba(0,191,165,0.25)",color:"#00BFA5",cursor:"pointer",fontSize:10,fontWeight:600}}>📊 Export Excel</button>
      </div>
      {reconResults.result.differences.length>0&&<div style={{marginBottom:8}}>
        <div style={{fontSize:9,color:C.org,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Differences</div>
        {reconResults.result.differences.slice(0,10).map((d,i)=><div key={i} style={{padding:"4px 8px",fontSize:10,color:C.org,background:C.org+"08",borderRadius:4,marginBottom:2}}>{Object.entries(d).map(([k,v])=>k+": "+(typeof v==="number"?"£"+v.toFixed(2):v)).join(" · ")}</div>)}
      </div>}
      {reconResults.result.summary&&<div style={{fontSize:10,color:C.dim,marginTop:8}}>
        {Object.entries(reconResults.result.summary).map(([k,v],i)=><span key={i} style={{marginRight:12}}><span style={{color:C.fnt}}>{k.replace(/([A-Z])/g," $1")}:</span> <span style={{color:C.tx,fontWeight:600}}>{typeof v==="number"?"£"+v.toFixed(2):String(v)}</span></span>)}
      </div>}
    </div>}
  </div>;
}
