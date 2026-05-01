import { useState } from "react";
import { useEngagement } from "../context/EngagementContext";
import { useAuditHelpers } from "../hooks/useAuditHelpers.jsx";
import { C, I, FW, SZ, ET } from "../data";
import { parsePlatformExport, mapToTrialBalance } from "../IntegrationsEngine";

export const AddModal=()=>{
  const { showModal, setShowModal, mi, setMi, _customItems, setCustomItems } = useEngagement();
  const { lbl, inp } = useAuditHelpers();
  if(!showModal)return null;const type=showModal;return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowModal(null)}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#151D30",border:"1px solid "+C.brd,borderRadius:16,padding:32,width:500,maxWidth:"90vw"}}>
      <div style={{fontSize:16,color:C.tx,fontWeight:700,marginBottom:16}}>Add Custom {type==="risk"?"Risk":"Test"}</div>
      {type==="risk"&&<><label style={lbl}>Risk Description</label><textarea value={mi.text||""} onChange={e=>setMi(p=>({...p,text:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical",marginBottom:12}} placeholder="Describe the risk..."/>
        <label style={lbl}>Risk Level</label><select value={mi.level||"ELEVATED"} onChange={e=>setMi(p=>({...p,level:e.target.value}))} style={{...inp,marginBottom:12,cursor:"pointer"}}><option value="SIGNIFICANT">Significant</option><option value="ELEVATED">Elevated</option><option value="NORMAL">Normal</option></select>
        <label style={lbl}>ISA Reference</label><input value={mi.isa||""} onChange={e=>setMi(p=>({...p,isa:e.target.value}))} style={{...inp,marginBottom:16}} placeholder="e.g. ISA 540"/></>}
      {type==="test"&&<><label style={lbl}>Test Procedure</label><textarea value={mi.text||""} onChange={e=>setMi(p=>({...p,text:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical",marginBottom:16}} placeholder="Describe the test..."/></>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={()=>{setShowModal(null);setMi({});}} style={{padding:"10px 20px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.brd,color:C.dim,cursor:"pointer",fontSize:12}}>Cancel</button>
        <button onClick={()=>{if(type==="risk"&&mi.text)setCustomItems(p=>({...p,risks:[...p.risks,{id:"CR"+String(p.risks.length+1).padStart(2,"0"),t:mi.text,lv:mi.level||"ELEVATED",isa:mi.isa||""}]}));if(type==="test"&&mi.text)setCustomItems(p=>({...p,tests:{...p.tests,[mi.wp||"d7"]:[...(p.tests[mi.wp||"d7"]||[]),mi.text]}}));setShowModal(null);setMi({});}} style={{padding:"10px 20px",borderRadius:8,background:C.acc,border:"none",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700}}>Add</button>
      </div>
    </div>
  </div>};

export const SampleCalcModal=()=>{
  const { showSampleCalc, setShowSampleCalc, cfg } = useEngagement();
  const { lbl, inp } = useAuditHelpers();
  const[popSize,setPopSize]=useState("");const[matLevel,setMatLevel]=useState(cfg.materiality||"");const[confidence,setConfidence]=useState("95");
    if(!showSampleCalc)return null;
    const N=parseFloat(popSize)||0;const M=parseFloat(matLevel)||1;const conf=confidence==="95"?3.0:2.31;
    const monetaryUnit=N>0&&M>0?Math.max(Math.ceil(conf*N/M),1):0;
    const recommended=N>0?Math.min(Math.max(Math.ceil(N/(1+(N*((confidence==="95"?0.05:0.1)**2)))),Math.ceil(conf*2),25),N):0;
    return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowSampleCalc(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#151D30",border:"1px solid "+C.brd,borderRadius:16,padding:32,width:560,maxWidth:"90vw"}}>
        <div style={{fontSize:16,color:C.tx,fontWeight:700,marginBottom:4}}>🧮 Sample Size Calculator</div>
        <div style={{fontSize:10,color:C.fnt,marginBottom:20}}>ISA 530 — Audit Sampling</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
          <div><label style={lbl}>Population Size (items/£)</label><input value={popSize} onChange={e=>setPopSize(e.target.value)} style={inp} placeholder="e.g. 5000"/></div>
          <div><label style={lbl}>Tolerable Misstatement (£)</label><input value={matLevel} onChange={e=>setMatLevel(e.target.value)} style={inp} placeholder={cfg.materiality||"e.g. 125000"}/></div>
          <div><label style={lbl}>Confidence Level</label><select value={confidence} onChange={e=>setConfidence(e.target.value)} style={{...inp,cursor:"pointer"}}><option value="90">90%</option><option value="95">95%</option></select></div>
        </div>
        {N>0&&M>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+C.acc+"15,"+C.acc+"08)",border:"1px solid "+C.acc+"44",textAlign:"center"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:C.acc,fontWeight:700}}>{recommended}</div>
            <div style={{fontSize:11,color:C.dim,fontWeight:600}}>Recommended Sample</div>
            <div style={{fontSize:9,color:C.fnt,marginTop:4}}>Statistical sampling</div>
          </div>
          <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+C.blu+"15,"+C.blu+"08)",border:"1px solid "+C.blu+"44",textAlign:"center"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:C.blu,fontWeight:700}}>{Math.min(monetaryUnit,N)}</div>
            <div style={{fontSize:11,color:C.dim,fontWeight:600}}>MUS Sample</div>
            <div style={{fontSize:9,color:C.fnt,marginTop:4}}>Monetary Unit Sampling</div>
          </div>
        </div>}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid "+C.brd,borderRadius:10,padding:14,marginBottom:16}}>
          <div style={{fontSize:10,color:C.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Methodology (ISA 530)</div>
          <div style={{fontSize:11,color:C.dim,lineHeight:1.7}}>
            <b style={{color:C.tx}}>Statistical Sampling:</b> n = N / (1 + N × e²) where e = {confidence==="95"?"0.05":"0.10"} ({confidence}% confidence)<br/>
            <b style={{color:C.tx}}>MUS (Monetary Unit):</b> n = Confidence Factor × Population Value / Tolerable Misstatement (Factor: {conf})<br/>
            <b style={{color:C.tx}}>Minimum:</b> ISA 530.A13 — sample must be sufficient to reduce sampling risk to acceptably low level. Minimum 25 items recommended for populations {">"} 250.
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>setShowSampleCalc(false)} style={{padding:"10px 24px",borderRadius:8,background:C.acc,border:"none",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700}}>Close</button></div>
      </div>
    </div>};

export const WelcomeWizard=()=>{
  const { showWelcome, setShowWelcome, setCfg, setTbData, showToast } = useEngagement();
  const { _inp } = useAuditHelpers();
    const[step,setStep]=useState(1);
    const[wCfg,setWCfg]=useState({industry:"",framework:"",entityName:"",fye:"",entitySize:"",engagementType:"statutory"});
    if(!showWelcome)return null;
    const industryList=Object.entries(I).map(([k,v])=>({k,l:v.l,ic:v.ic}));
    return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#151D30",border:"1px solid "+C.acc+"44",borderRadius:16,padding:32,width:560,maxWidth:"95vw",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700}}>Welcome to Audit<span style={{color:C.acc}}>Engine</span></div>
          <div style={{fontSize:11,color:C.dim,marginTop:4}}>v10 AURA · Powered by Indus Nexus Limited — Step {step} of 5</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>{[1,2,3,4,5].map(s=><div key={s} style={{width:32,height:4,borderRadius:2,background:s<=step?C.acc:C.brd}}/>)}</div>
        </div>
        {step===1&&<div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Select Industry</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {industryList.map(ind=><button key={ind.k} onClick={()=>setWCfg(p=>({...p,industry:ind.k}))} style={{padding:"14px 16px",borderRadius:10,background:wCfg.industry===ind.k?C.acc+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(wCfg.industry===ind.k?C.acc+"66":C.brd),color:wCfg.industry===ind.k?C.acc:C.tx,cursor:"pointer",fontSize:13,fontWeight:wCfg.industry===ind.k?700:400,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{ind.ic}</span>{ind.l}
            </button>)}
          </div>
        </div>}
        {step===2&&<div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Select Framework</div>
          {Object.entries(FW).map(([k,v])=><button key={k} onClick={()=>setWCfg(p=>({...p,framework:k}))} style={{width:"100%",padding:"12px 16px",marginBottom:8,borderRadius:8,background:wCfg.framework===k?v.c+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(wCfg.framework===k?v.c+"66":C.brd),color:wCfg.framework===k?v.c:C.tx,cursor:"pointer",fontSize:13,fontWeight:wCfg.framework===k?700:400,textAlign:"left"}}>{v.l} — {v.d}</button>)}
        </div>}
        {step===3&&<div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Connect Accounting System (Optional)</div>
          <div style={{fontSize:11,color:C.dim,marginBottom:16}}>Import your trial balance directly from your accounting software, or skip to enter details manually.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{id:"sage",logo:"🌿",name:"Sage 50/200"},{id:"xero",logo:"💙",name:"Xero"},{id:"quickbooks",logo:"🟢",name:"QuickBooks"},{id:"freeagent",logo:"🟤",name:"FreeAgent"}].map(c=><button key={c.id} onClick={()=>{const fi=document.createElement("input");fi.type="file";fi.accept=".csv,.xlsx,.xls";fi.onchange=async(ev)=>{const file=ev.target.files[0];if(!file)return;try{const result=await parsePlatformExport(c.id,file,"trialBalance");const tbRows=mapToTrialBalance(result,c.id);setTbData(tbRows);showToast("Imported "+tbRows.length+" accounts from "+c.name);setStep(4);}catch(e){showToast("Import failed: "+e.message,"error");}};fi.click();}} style={{padding:"14px 16px",borderRadius:10,background:"rgba(0,191,165,0.06)",border:"1px solid rgba(0,191,165,0.25)",color:C.tx,cursor:"pointer",fontSize:13,fontWeight:500,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{c.logo}</span>{c.name}
            </button>)}
          </div>
        </div>}
        {step===4&&<div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Entity Details</div>
          {[{k:"entityName",l:"Entity Name",ph:"e.g. Meridian Construction Ltd"},{k:"fye",l:"Financial Year End",ph:"e.g. 31/03/2026"},{k:"firmName",l:"Audit Firm",ph:"e.g. Smith & Partners LLP"},{k:"partner",l:"Engagement Partner",ph:"e.g. J Smith"},{k:"manager",l:"Audit Manager",ph:"e.g. A Jones"}].map(f=><div key={f.k} style={{marginBottom:12}}><label style={{fontSize:10,color:C.acc,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,display:"block",fontWeight:600}}>{f.l}</label><input value={wCfg[f.k]||""} onChange={e=>setWCfg(p=>({...p,[f.k]:e.target.value}))} style={{width:"100%",padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid "+C.brd,color:C.tx,fontSize:13,outline:"none"}} placeholder={f.ph}/></div>)}
        </div>}
        {step===5&&<div>
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Engagement Type & Size</div>
          {ET.map(et=><button key={et.k} onClick={()=>setWCfg(p=>({...p,engagementType:et.k}))} style={{width:"100%",padding:"10px 16px",marginBottom:6,borderRadius:8,background:wCfg.engagementType===et.k?C.acc+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(wCfg.engagementType===et.k?C.acc+"66":C.brd),color:wCfg.engagementType===et.k?C.acc:C.tx,cursor:"pointer",fontSize:12}}>{et.l}</button>)}
          <div style={{fontSize:12,color:C.acc,fontWeight:700,marginTop:16,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>Entity Size</div>
          {Object.entries(SZ).map(([k,v])=><button key={k} onClick={()=>setWCfg(p=>({...p,entitySize:k}))} style={{width:"100%",padding:"8px 16px",marginBottom:4,borderRadius:8,background:wCfg.entitySize===k?C.acc+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(wCfg.entitySize===k?C.acc+"66":C.brd),color:wCfg.entitySize===k?C.acc:C.tx,cursor:"pointer",fontSize:11}}>{v.l} — TO {v.to}, Assets {v.as}</button>)}
        </div>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{padding:"10px 24px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.brd,color:C.dim,cursor:"pointer",fontSize:12}}>Back</button>}
          {step<5&&<button onClick={()=>setStep(s=>s+1)} style={{padding:"10px 24px",borderRadius:8,background:C.acc,border:"none",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700}}>Next</button>}
          {step===5&&<button onClick={()=>{setCfg(p=>({...p,...wCfg,configured:true}));setShowWelcome(false);showToast("Engagement configured!");}} style={{padding:"10px 24px",borderRadius:8,background:"linear-gradient(135deg,#43A047,#66BB6A)",border:"none",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>Launch Audit</button>}
          <button onClick={()=>setShowWelcome(false)} style={{padding:"10px 16px",borderRadius:8,background:"none",border:"1px solid "+C.brd,color:C.dim,cursor:"pointer",fontSize:11}}>Skip</button>
        </div>
      </div>
    </div>;
  };

export const ExtractPreviewModal=()=>{
  const { extractPreview, setExtractPreview, setCellData, showToast } = useEngagement();
    if(!extractPreview)return null;
    const{wpId,result,fileName}=extractPreview;
    const rows=Array.isArray(result.data)?result.data:result.data?.rows||result.data?.transactions||result.data?.assets||result.data?.employees||result.data?.debtors||result.data?.creditors||result.data?.contracts||result.data?.instruments||result.data?.shareholders||[];
    const preview=rows.slice(0,10);
    return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setExtractPreview(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#151D30",border:"1px solid "+C.acc+"44",borderRadius:16,padding:24,width:700,maxWidth:"95vw",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{fontSize:14,color:C.acc,fontWeight:700,marginBottom:8}}>Extracted Data — {fileName}</div>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Type: {result.type} | {rows.length} rows found</div>
        {extractPreview.validation&&<div style={{marginBottom:8}}>
          <span style={{padding:"3px 10px",borderRadius:6,fontSize:9,fontWeight:700,background:extractPreview.validation.valid?C.grn+"15":C.red+"15",border:"1px solid "+(extractPreview.validation.valid?C.grn:C.red)+"44",color:extractPreview.validation.valid?C.grn:C.red}}>{extractPreview.validation.valid?"✓ Validated":"✗ Issues found"}</span>
          {extractPreview.validation.errors.length>0&&<div style={{marginTop:4}}>{extractPreview.validation.errors.slice(0,3).map((e,i)=><div key={i} style={{fontSize:10,color:C.red}}>✗ {e}</div>)}</div>}
          {extractPreview.validation.warnings.length>0&&<div style={{marginTop:4}}>{extractPreview.validation.warnings.slice(0,3).map((w,i)=><div key={i} style={{fontSize:10,color:C.org}}>⚠ {w}</div>)}</div>}
        </div>}
        {preview.length>0&&<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr>{Object.keys(preview[0]||{}).slice(0,8).map((h,i)=><th key={i} style={{padding:"6px 8px",background:C.thBg,borderBottom:"1px solid "+C.brd,color:C.acc,textAlign:"left",fontSize:9,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{preview.map((row,ri)=><tr key={ri}>{Object.values(row).slice(0,8).map((v,ci)=><td key={ci} style={{padding:"4px 8px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim,fontSize:11}}>{typeof v==="number"?v.toLocaleString():String(v||"").slice(0,30)}</td>)}</tr>)}</tbody>
        </table></div>}
        <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
          <button onClick={()=>setExtractPreview(null)} style={{padding:"8px 16px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.brd,color:C.dim,cursor:"pointer",fontSize:11}}>Cancel</button>
          <button onClick={()=>{
            // Actually populate cellData from extracted rows
            if(rows.length>0){
              const newCellData={};
              rows.forEach((row,ri)=>{
                Object.values(row).forEach((val,ci)=>{
                  if(val!==undefined&&val!==null&&val!=="")newCellData[`${wpId}_${ri}_${ci+1}`]=String(val);
                });
              });
              setCellData(p=>({...p,...newCellData}));
            }
            showToast("Data applied to "+wpId.toUpperCase()+" — "+rows.length+" rows populated");
            setExtractPreview(null);
          }} style={{padding:"8px 16px",borderRadius:8,background:C.acc,border:"none",color:"#000",cursor:"pointer",fontSize:11,fontWeight:700}}>Apply to WP</button>
        </div>
      </div>
    </div>;
  };

export const ToastNotification=()=>{
  const { toastMsg } = useEngagement();
    if(!toastMsg)return null;
    const tGrad={success:"linear-gradient(135deg,#43A047,#66BB6A)",export:"linear-gradient(135deg,#1565C0,#42A5F5)",error:"linear-gradient(135deg,#C62828,#EF5350)",ai:"linear-gradient(135deg,#E65100,#FFB74D)"};
    const tShad={success:"rgba(67,160,71,0.4)",export:"rgba(21,101,192,0.4)",error:"rgba(198,40,40,0.4)",ai:"rgba(230,81,0,0.4)"};
    const bg=tGrad[toastMsg.type]||tGrad.success;
    const sh=tShad[toastMsg.type]||tShad.success;
    return<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",padding:"10px 24px",borderRadius:10,background:bg,color:"#fff",fontSize:12,fontWeight:600,zIndex:3000,boxShadow:"0 4px 20px "+sh,animation:"fadeUp 0.3s ease-out"}}>{toastMsg.msg}</div>;
  };
