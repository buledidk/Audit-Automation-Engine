import { useState, useEffect, useCallback, useRef, memo } from "react";
import { C, HELP_TEXT } from "../../data";

// ═══ EXTRACTED COMPONENTS — outside AuditEngine to prevent remounting ═══

const EditableCell=memo(function EditableCell({value,onChange,style}){
  const[local,setLocal]=useState(value||"");
  const ref=useRef(null);
  useEffect(()=>{if(document.activeElement!==ref.current){const v=value||"";setTimeout(()=>setLocal(v),0);}},[value]);
  const handleKeyDown=useCallback(e=>{
    if(e.key==="Escape"){e.preventDefault();setLocal(value||"");ref.current?.blur();}
    if(e.key==="Enter"){e.preventDefault();onChange(local);const td=ref.current?.closest("td");if(td){const ci=Array.from(td.parentElement.children).indexOf(td);const nextRow=td.parentElement.nextElementSibling;if(nextRow){const nextInput=nextRow.children[ci]?.querySelector("input");if(nextInput){nextInput.focus();nextInput.select();}else ref.current?.blur();}else ref.current?.blur();}}
  },[value,local,onChange]);
  return<input ref={ref} value={local} onChange={e=>{e.stopPropagation();setLocal(e.target.value);}} onBlur={()=>onChange(local)} onKeyDown={handleKeyDown} style={style} placeholder="—"/>;
});

const EditableDropdownCell=memo(function EditableDropdownCell({value,onChange,options,style}){
  return<select value={value||""} onChange={e=>onChange(e.target.value)} style={{...style,cursor:"pointer",appearance:"auto"}}><option value="">—</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
});

const ETable=memo(function ETable({id,headers,rows,editable=[],editableTypes={},getCell,setCell,colors,onCellContextMenu,onLinkEvidence,linkCounts={}}){
  const CC=colors||C;
  const cs={width:"100%",padding:"8px 10px",borderRadius:4,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.10)",color:CC.tx,fontSize:12,outline:"none"};
  return<div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+CC.brd}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr>{onLinkEvidence&&<th style={{width:32,textAlign:"center",padding:"10px 4px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+CC.acc+"44",fontSize:10,color:CC.acc}}>📎</th>}{headers.map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+CC.acc+"44",fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
        {onLinkEvidence&&<td style={{textAlign:"center",padding:"4px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><button onClick={()=>onLinkEvidence(id,ri)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:2,opacity:linkCounts[ri]?1:0.4,position:"relative"}} title="Link evidence">📎{linkCounts[ri]?<span style={{position:"absolute",top:-4,right:-6,fontSize:8,background:CC.acc,color:"#fff",borderRadius:"50%",width:14,height:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{linkCounts[ri]}</span>:null}</button></td>}
        {row.map((cell,ci)=><td key={ci} onContextMenu={editable.includes(ci)&&onCellContextMenu?e=>{e.preventDefault();onCellContextMenu(`${id}_${ri}_${ci}`);}:undefined} style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim,lineHeight:1.5}}>
        {editable.includes(ci)?(editableTypes[ci]?.type==="dropdown"?<EditableDropdownCell value={getCell(id,ri,ci)} onChange={v=>setCell(id,ri,ci,v)} options={editableTypes[ci].options} style={cs}/>:<EditableCell value={getCell(id,ri,ci)} onChange={v=>setCell(id,ri,ci,v)} style={cs}/>):cell}
      </td>)}</tr>)}</tbody>
    </table>
  </div>;
});

const Badge=memo(function Badge({level}){const c=level==="SIGNIFICANT"?C.red:level==="ELEVATED"?C.org:C.grn;return<span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:c+"22",border:"1px solid "+c+"55",color:c,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{level}</span>});

const VerifiedBadge=memo(function VerifiedBadge({source,lastVerified}){
  if(!source)return null;
  return<span style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:"rgba(76,175,80,0.12)",border:"1px solid rgba(76,175,80,0.3)",color:"#66BB6A",fontWeight:600,marginLeft:6}}>{"✓ "+source+(lastVerified?" · "+lastVerified:"")}</span>;
});

const HelpTip=memo(function HelpTip({text}){
  const[show,setShow]=useState(false);
  if(!text)return null;
  return<span style={{position:"relative",display:"inline-flex",alignItems:"center",marginLeft:6}}>
    <span onClick={e=>{e.stopPropagation();setShow(p=>!p);}} style={{width:16,height:16,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#B0B8C8",cursor:"pointer",fontWeight:700,userSelect:"none"}}>?</span>
    {show&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",width:300,padding:"12px 14px",borderRadius:8,background:"#1A2340",border:"1px solid rgba(255,255,255,0.15)",boxShadow:"0 4px 20px rgba(0,0,0,0.5)",fontSize:11,color:"#B0B8C8",lineHeight:1.6,zIndex:500}}>
      {text}
      <div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:10,height:10,background:"#1A2340",borderRight:"1px solid rgba(255,255,255,0.15)",borderBottom:"1px solid rgba(255,255,255,0.15)"}}/>
    </div>}
  </span>;
});

const SecTitle=memo(function SecTitle({t,color,indAcc,helpType}){const sc=color||(indAcc||C.acc);return<div style={{fontSize:14,color:sc,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:14,fontWeight:700,paddingBottom:8,borderBottom:"2px solid "+sc+"33",display:"flex",alignItems:"center",gap:8}}><div style={{width:4,height:18,borderRadius:2,background:sc}}/>{t}{helpType&&HELP_TEXT[helpType]&&<HelpTip text={HELP_TEXT[helpType]}/>}</div>});

export { EditableCell, EditableDropdownCell, ETable, SecTitle, Badge, VerifiedBadge, HelpTip };
