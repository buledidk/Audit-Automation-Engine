import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";
import { parseTBXlsx, isExcelFile, enhancedAutoMap } from "../../TBPipeline";
import { LEAD_SCHEDULES, JOURNAL_ENTRY_TESTING } from "../../AuditMethodology";
import Papa from "papaparse";

const FSLI_CATS=["Revenue","Receivables","Inventory","Payables","Cash","Fixed Assets","Equity","Loans","Provisions","Tax","Other"];

const parseTbCsv=(text)=>{
  try{
    const parsed=Papa.parse(text,{header:false,skipEmptyLines:true,dynamicTyping:false});
    if(!parsed.data||parsed.data.length<2)return[];
    const rows=[];
    for(let i=1;i<parsed.data.length;i++){
      const cols=parsed.data[i];
      if(cols.length>=3&&cols[0]&&String(cols[0]).trim()){
        rows.push({code:String(cols[0]).trim(),account:String(cols[1]||"").trim(),py:parseFloat(cols[2])||0,cy:parseFloat(cols[3])||0});
      }
    }
    return rows;
  }catch(e){ // eslint-disable-line no-unused-vars
    // fallback to basic parsing
    const lines=text.trim().split("\n");const rows=[];
    for(let i=1;i<lines.length;i++){const cols=lines[i].split(",").map(c=>c.replace(/^"|"$/g,"").trim());if(cols.length>=3&&cols[0]){rows.push({code:cols[0],account:cols[1]||"",py:parseFloat(cols[2])||0,cy:parseFloat(cols[3])||0});}}
    return rows;
  }
};

export default function LeadScheduleWP({ wp }){
  const { cfg, _ind, tbData, setTbData, tbMappings, setTbMappings, coaMod } = useEngagement();
  const { _BoundET, _ST, _inp } = useAuditHelpers();

  const handleTbUpload=(files)=>{if(!files.length)return;const f=files[0];
    const applyRows=(rows)=>{if(rows.length){setTbData(rows);
      const autoMap=enhancedAutoMap(rows,cfg.industry,coaMod);
      if(Object.keys(autoMap).length)setTbMappings(p=>({...autoMap,...p}));
    }};
    if(isExcelFile(f)){
      const reader=new FileReader();reader.onload=async e=>{try{const rows=await parseTBXlsx(e.target.result);applyRows(rows);}catch(err){console.error("XLSX parse error:",err);}};reader.readAsArrayBuffer(f);
    }else{
      const reader=new FileReader();reader.onload=e=>{applyRows(parseTbCsv(e.target.result));};reader.readAsText(f);
    }
  };

  const getMappedTotals=()=>{const totals={};FSLI_CATS.forEach(c=>totals[c]={py:0,cy:0});tbData.forEach((r,i)=>{const cat=tbMappings[i];if(cat&&totals[cat]){totals[cat].py+=r.py;totals[cat].cy+=r.cy;}});return totals;};

  const leads={c1:{t:"Trial Balance",h:["Code","Account","PY (£)","CY (£)","Movement","Lead Ref","Comment"],e:[0,1,2,3,4,5,6]},c2:{t:"P&L Lead Schedule — Income Statement",h:["Note","Line Item","PY (£)","CY (£)","Movement","Movement %","WP Ref","Audit Adj Dr","Audit Adj Cr","Adjusted Balance","Status"],r:LEAD_SCHEDULES.pl.lines.map((l,_i)=>[<span style={{fontFamily:"monospace",color:C.fnt,fontSize:10}}>{_i+1}</span>,<span style={{color:"#F8F8F8",fontWeight:l.item.includes("profit")||l.item.includes("Profit")||l.item.includes("loss")?700:400}}>{l.item}</span>,"","","","",<span style={{fontFamily:"monospace",color:"#F5A623",fontSize:10}}>{l.wpRef}</span>,"","","",""]),e:[2,3,4,5,7,8,9,10]},c3:{t:"Balance Sheet Lead Schedule",h:["Note","Line Item","PY (£)","CY (£)","Movement","Movement %","WP Ref","Audit Adj Dr","Audit Adj Cr","Adjusted Balance","Status"],r:LEAD_SCHEDULES.bs.lines.map((l,_i)=>[<span style={{fontFamily:"monospace",color:C.fnt,fontSize:10}}>{_i+1}</span>,<span style={{color:"#F8F8F8",fontWeight:500}}>{l.item}</span>,"","","","",<span style={{fontFamily:"monospace",color:"#F5A623",fontSize:10}}>{l.wpRef}</span>,"","","",""]),e:[2,3,4,5,7,8,9,10]},c4:{t:"Journal Entry Testing — ISA 240.32(a)",h:["Journal #","Date","Description","Dr (£)","Cr (£)","Posted By","Selection Criterion","Risk?","Business Rationale","Evidence","Result"],r:Array.from({length:15},(_,_i)=>["","","","","","","","","","",""]),e:[0,1,2,3,4,5,6,7,8,9,10],extra:{criteria:JOURNAL_ENTRY_TESTING.criteria,isa_ref:JOURNAL_ENTRY_TESTING.isa_ref}},c5:{t:"Fixed Assets Register & Lead Schedule",h:["Asset Class","PY NBV (£)","Additions (£)","Disposals (£)","Depreciation (£)","Impairment (£)","CY NBV (£)","Useful Life","WP"],r:[["Freehold property","","","","","","","50 yrs","D7"],["Leasehold improvements","","","","","","","Lease term","D7"],["Plant & machinery","","","","","","","5-10 yrs","D7"],["Motor vehicles","","","","","","","4 yrs","D7"],["Office equipment","","","","","","","3-5 yrs","D7"],["Computer equipment","","","","","","","3 yrs","D7"],["Right-of-use assets","","","","","","","Lease term","D14"],["TOTAL","","","","","","","",""]],e:[1,2,3,4,5,6]},c6:{t:"Equity & Reserves Movement Schedule",h:["Component","Opening Balance (£)","Profit/(Loss) (£)","Dividends (£)","Share Issues (£)","Other Movements (£)","Closing Balance (£)","WP","Comment"],r:[["Share capital","","","","","","","D10",""],["Share premium","","","","","","","D10",""],["Revaluation reserve","","","","","","","D7",""],["Retained earnings","","","","","","","D10",""],["Other reserves","","","","","","","D10",""],["TOTAL EQUITY","","","","","","","",""]],e:[1,2,3,4,5,6,8]},c7:{t:"Loans & Borrowings Schedule",h:["Lender","Facility (£)","Drawn (£)","Rate %","Maturity","Security","Covenants","Current (£)","Non-current (£)"],r:[["Bank overdraft","","","","","","","","—"],["Bank term loan","","","","","","","",""],["HP / finance lease","","","","","","","",""],["Directors loan","","","","","","","",""],["Other borrowings","","","","","","","",""],["TOTAL","","","","","","","",""]],e:[1,2,3,4,5,6,7,8]},c8:{t:"Provisions & Contingencies Lead",h:["Type","Opening (£)","Charged (£)","Utilised (£)","Released (£)","Unwinding (£)","Closing (£)","Basis","WP"],r:[["Warranty/defects","","","","","","","FRS 102 s21","D12"],["Dilapidations","","","","","","","FRS 102 s21","D12"],["Legal claims","","","","","","","FRS 102 s21","D12"],["Onerous contracts","","","","","","","FRS 102 s21","D12"],["Restructuring","","","","","","","FRS 102 s21","D12"],["Deferred tax","","","","","","","FRS 102 s29","D13"],["TOTAL","","","","","","","",""]],e:[1,2,3,4,5,6]}};

  if(wp.id==="c1"){const mapped=getMappedTotals();return<div><ST t="Trial Balance & GL Mapping" color={C.ld}/>
    <div style={{background:"rgba(67,160,71,0.06)",border:"1px solid rgba(67,160,71,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.ld}}>
      <div style={{fontSize:10,color:C.ld,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Upload Trial Balance (CSV / Excel)</div>
      <div style={{fontSize:11,color:C.dim,marginBottom:10}}>Upload a CSV or Excel file with columns: Code, Account, PY Balance, CY Balance. Map each account to an FSLI category to auto-populate lead schedules C2 and C3.</div>
      <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleTbUpload(e.dataTransfer.files);}} onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept=".csv,.xlsx,.xls";inp.onchange=e=>handleTbUpload(e.target.files);inp.click();}}
        style={{border:"2px dashed "+C.ld+"66",borderRadius:8,padding:tbData.length?"10px":"20px",textAlign:"center",cursor:"pointer",background:"rgba(67,160,71,0.04)"}}>
        {!tbData.length?<div><div style={{fontSize:18}}>📊</div><div style={{fontSize:11,color:C.dim}}>Drop CSV/Excel here or click to upload</div></div>
        :<div style={{fontSize:11,color:C.grn,fontWeight:600}}>{tbData.length} accounts loaded</div>}
      </div>
    </div>
    {tbData.length>0&&<>
      <ST t={"FSLI Mapping — "+tbData.length+" Accounts"} color={C.blu}/>
      <div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+C.brd,marginBottom:20}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Code","Account","PY (£)","CY (£)","Movement","FSLI Category"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+C.acc+"44",fontSize:10,color:C.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
          <tbody>{tbData.map((r,ri)=>{const mv=r.cy-r.py;return<tr key={ri} style={{background:ri%2===0?"rgba(255,255,255,0.015)":"transparent",transition:"background 0.15s ease"}}>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.acc,fontFamily:"monospace",fontSize:11}}>{r.code}</td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><input value={r.account} onChange={e=>{const v=e.target.value;setTbData(p=>{const n=[...p];n[ri]={...n[ri],account:v};return n;});}} style={{width:"100%",padding:"4px 8px",borderRadius:4,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:C.tx,fontSize:12,outline:"none"}}/></td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><input type="number" value={r.py} onChange={e=>{const v=parseFloat(e.target.value)||0;setTbData(p=>{const n=[...p];n[ri]={...n[ri],py:v};return n;});}} style={{width:"100%",padding:"4px 8px",borderRadius:4,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:C.dim,fontSize:12,textAlign:"right",outline:"none"}}/></td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><input type="number" value={r.cy} onChange={e=>{const v=parseFloat(e.target.value)||0;setTbData(p=>{const n=[...p];n[ri]={...n[ri],cy:v};return n;});}} style={{width:"100%",padding:"4px 8px",borderRadius:4,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:C.dim,fontSize:12,textAlign:"right",outline:"none"}}/></td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:mv>=0?C.grn:C.red,textAlign:"right",fontWeight:500,fontSize:12}}>{mv.toLocaleString()}</td>
            <td style={{padding:"4px 8px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><select value={tbMappings[ri]||""} onChange={e=>setTbMappings(p=>({...p,[ri]:e.target.value}))} style={{width:"100%",padding:"6px 10px",borderRadius:6,background:tbMappings[ri]?"rgba(67,160,71,0.08)":"rgba(255,255,255,0.05)",border:"1px solid "+(tbMappings[ri]?C.ld+"55":C.brd),color:tbMappings[ri]?C.ld:C.tx,fontSize:11,cursor:"pointer",transition:"all 0.2s ease"}}><option value="">— Select FSLI —</option>{FSLI_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></td>
          </tr>})}</tbody>
        </table>
      </div>
      <ST t="Mapped FSLI Totals → Lead Schedules" color={C.ld}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
        {FSLI_CATS.filter(c=>mapped[c]&&(mapped[c].py||mapped[c].cy)).map(c=>{const mv=mapped[c].cy-mapped[c].py;return<div key={c} style={{padding:"10px 12px",borderRadius:8,background:C.ld+"0D",border:"1px solid "+C.ld+"33"}}>
          <div style={{fontSize:9,color:C.ld,fontWeight:700,textTransform:"uppercase"}}>{c}</div>
          <div style={{fontSize:14,color:C.tx,fontWeight:600}}>£{mapped[c].cy.toLocaleString()}</div>
          <div style={{fontSize:9,color:mv>=0?C.grn:C.red}}>PY: £{mapped[c].py.toLocaleString()} | Mvt: £{mv.toLocaleString()}</div>
          <div style={{fontSize:8,color:C.fnt,marginTop:2}}>→ {c==="Revenue"||c==="Tax"?"C2 (P&L)":"C3 (BS)"}</div>
        </div>})}
      </div>
      <ST t="TB Reconciliation" color={C.tl}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        {(()=>{const totalPY=tbData.reduce((s,r)=>s+r.py,0);const totalCY=tbData.reduce((s,r)=>s+r.cy,0);const mappedCount=Object.keys(tbMappings).filter(k=>tbMappings[k]).length;const unmappedCount=tbData.length-mappedCount;
          return[
            {l:"Total PY",v:"£"+totalPY.toLocaleString(),c:C.dim},{l:"Total CY",v:"£"+totalCY.toLocaleString(),c:C.tx},{l:"Net Movement",v:"£"+(totalCY-totalPY).toLocaleString(),c:(totalCY-totalPY)>=0?C.grn:C.red},
            {l:"Accounts Mapped",v:mappedCount+"/"+tbData.length,c:C.ld},{l:"Unmapped",v:String(unmappedCount),c:unmappedCount>0?C.org:C.grn},{l:"Mapping %",v:tbData.length?Math.round(mappedCount/tbData.length*100)+"%":"0%",c:C.acc}
          ].map((m,i)=><div key={i} style={{padding:"10px 14px",borderRadius:8,background:m.c+"0D",border:"1px solid "+m.c+"33",textAlign:"center"}}>
            <div style={{fontSize:9,color:m.c,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{m.l}</div>
            <div style={{fontSize:16,color:C.tx,fontWeight:700,marginTop:4}}>{m.v}</div>
          </div>);
        })()}
      </div>
    </>}
    {!tbData.length&&<BoundET id="c1" headers={["Code","Account","PY (£)","CY (£)","Movement","Lead Ref","Comment"]} rows={[["","","","","","",""]]} editable={[0,1,2,3,4,5,6]}/>}
  </div>}

  if(leads[wp.id]){const l=leads[wp.id];return<div><ST t={l.t} color={C.ld}/>
    {l.extra&&l.extra.criteria&&<div style={{background:"rgba(67,160,71,0.06)",border:"1px solid rgba(67,160,71,0.2)",borderRadius:10,padding:16,marginBottom:16,borderLeft:"4px solid "+C.ld}}>
      <div style={{fontSize:10,color:C.ld,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Selection Criteria — {l.extra.isa_ref}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{l.extra.criteria.map((c,i)=><div key={i} style={{fontSize:11,color:C.dim,padding:"4px 8px",background:"rgba(255,255,255,0.02)",borderRadius:4}}>• {c}</div>)}</div>
    </div>}
    <BoundET id={wp.id} headers={l.h} rows={l.r||[["","","","","","","",""]]} editable={l.e}/></div>}

  return null;
}
