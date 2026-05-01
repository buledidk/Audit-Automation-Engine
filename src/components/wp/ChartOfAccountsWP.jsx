import { useState } from "react";
import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";

export default function ChartOfAccountsWP() {
  const { cfg, ind, coaMod, tbData, tbMappings, setTbMappings } = useEngagement();
  const { _ST, inp } = useAuditHelpers();
  const[coaSearch,setCoaSearch]=useState("");
  let coaContent=null;
  if(coaMod){
    const COA=coaMod;
    const indId=cfg.industry||"construction";
    const template=COA.UK_COA_TEMPLATES?.[indId]||[];
    const q=coaSearch.toLowerCase();
    const filtered=q?template.filter(a=>String(a.code).includes(q)||a.name.toLowerCase().includes(q)||a.category?.toLowerCase().includes(q)):template;
    const categories=[...new Set(template.map(a=>a.category))];
    coaContent=<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
        {[{l:"Total Accounts",v:template.length,c:C.acc},{l:"BS Accounts",v:template.filter(a=>a.type==="BS").length,c:C.blu},{l:"PL Accounts",v:template.filter(a=>a.type==="PL").length,c:C.grn},{l:"Categories",v:categories.length,c:C.org}].map((m,i)=><div key={i} style={{padding:"12px 14px",borderRadius:8,background:m.c+"0D",border:"1px solid "+m.c+"33",textAlign:"center"}}>
          <div style={{fontSize:20,color:m.c,fontWeight:700}}>{m.v}</div>
          <div style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em"}}>{m.l}</div>
        </div>)}
      </div>
      <div style={{marginBottom:16}}>
        <input value={coaSearch} onChange={e=>setCoaSearch(e.target.value)} placeholder="Search accounts by code, name, or category..." style={{...inp,marginBottom:0}}/>
      </div>
      <div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+C.brd}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Code","Account Name","Type","Category","FSLI Mapping","Normal Bal"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+C.acc+"44",fontSize:10,color:C.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.slice(0,100).map((a,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.acc,fontFamily:"monospace",fontWeight:600}}>{a.code}</td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.tx}}>{a.name}</td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><span style={{padding:"2px 8px",borderRadius:4,background:a.type==="BS"?C.blu+"22":C.grn+"22",border:"1px solid "+(a.type==="BS"?C.blu:C.grn)+"55",fontSize:9,color:a.type==="BS"?C.blu:C.grn,fontWeight:600}}>{a.type}</span></td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim,fontSize:11}}>{a.category}</td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.ld,fontSize:11,fontWeight:500}}>{a.fsliMapping}</td>
            <td style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.fnt,fontSize:10}}>{a.normalBalance}</td>
          </tr>)}</tbody>
        </table>
        {filtered.length>100&&<div style={{padding:8,textAlign:"center",fontSize:10,color:C.fnt}}>Showing 100 of {filtered.length} accounts. Use search to filter.</div>}
      </div>
      {tbData.length>0&&<div style={{marginTop:20}}>
        <ST t="Auto-Map Trial Balance to COA" color={C.ld}/>
        <div style={{fontSize:11,color:C.dim,marginBottom:12}}>Fuzzy matching {tbData.length} TB accounts against {ind?.l} COA template ({template.length} accounts).</div>
        {COA.autoMapTrialBalance&&<button onClick={()=>{
          const results=COA.autoMapTrialBalance(tbData,indId);
          const newMappings={};
          results.forEach((r,i)=>{if(r.mappedFsli&&!tbMappings[i])newMappings[i]=r.mappedFsli;});
          if(Object.keys(newMappings).length)setTbMappings(p=>({...p,...newMappings}));
        }} style={{padding:"10px 24px",borderRadius:8,background:"linear-gradient(135deg,"+C.ld+"22,"+C.ld+"08)",border:"1px solid "+C.ld+"55",color:C.ld,cursor:"pointer",fontSize:12,fontWeight:700}}>🔄 Auto-Map TB Accounts ({tbData.length} rows)</button>}
      </div>}
    </div>;
  }else{
    coaContent=<div style={{background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:20,textAlign:"center"}}>
      <div style={{fontSize:14,color:C.dim,marginBottom:8}}>Chart of Accounts module loading...</div>
      <div style={{fontSize:11,color:C.fnt}}>The ChartOfAccounts.js module is initialising.</div>
    </div>;
  }
  return<div><ST t={"Chart of Accounts — "+(ind?.l||"Industry")} color={"#0097A7"}/>{coaContent}</div>;
}
