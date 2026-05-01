import { useEngagement } from "../context/EngagementContext";
import { useAuditHelpers } from "../hooks/useAuditHelpers.jsx";
import { WPS, C, I } from "../data";

export default function AuditSidebar(){
  const {
    activeWP, setActiveWP, sbOpen, setSbOpen, cfg, theme, CC, toggleTheme,
    handleDebugClick, debugClicks, debugTimer, setShowDebug, wpSearchRef, wpSearch, setWpSearch,
    totalWPs, doneCount, signOffs, reviewNotes, mobileMenuOpen,
    indAcc, lastSaveTime, agentPanelOpen, setAgentPanelOpen // eslint-disable-line no-unused-vars
  } = useEngagement();

  const { tc } = useAuditHelpers();

  const sw=sbOpen?268:52;

  return(
      <aside aria-label="Working paper navigation" role="navigation" className={mobileMenuOpen?"ae-mobile-open":""} style={{width:sw,height:"100vh",position:"fixed",left:0,top:0,background:CC.sb,borderRight:"1px solid "+CC.brd,overflowY:"auto",overflowX:"hidden",transition:"width 0.3s ease, transform 0.3s ease",zIndex:100,display:"flex",flexDirection:"column"}}>
        <div style={{padding:sbOpen?"16px 18px":"16px 10px",borderBottom:"1px solid "+CC.brd,display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}} onClick={handleDebugClick}>
          <div style={{width:32,height:32,borderRadius:8,background:"#1E3A5F",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>AE</div>
          {sbOpen&&<div style={{overflow:"hidden",whiteSpace:"nowrap",flex:1}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>Audit<span style={{color:CC.acc}}>Engine</span></div><div style={{fontSize:9,color:CC.fnt,letterSpacing:"0.18em",textTransform:"uppercase",fontVariant:"small-caps"}}>AURA</div></div>}
          {sbOpen&&<button onClick={e=>{e.stopPropagation();toggleTheme();}} title={theme==="dark"?"Switch to Light Mode":"Switch to Dark Mode"} style={{width:28,height:28,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid "+CC.brd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",color:CC.dim,flexShrink:0}}>{theme==="dark"?"☀️":"🌙"}</button>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {sbOpen&&cfg.configured&&(()=>{const pct=totalWPs>0?Math.round((doneCount/totalWPs)*100):0;return<div style={{padding:"6px 18px 10px",borderBottom:"1px solid "+C.brd}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:9,color:C.fnt,textTransform:"uppercase",letterSpacing:"0.1em"}}>Overall</span><span style={{fontSize:9,color:pct===100?C.grn:C.acc,fontWeight:700}}>{pct}%</span></div>
            <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,width:pct+"%",background:pct===100?C.grn:C.acc,transition:"width 0.3s"}}/></div>
          </div>})()}
          {sbOpen&&cfg.configured&&<div style={{padding:"4px 14px 6px"}}>
            <div style={{position:"relative"}}>
              <input ref={wpSearchRef} value={wpSearch} onChange={e=>setWpSearch(e.target.value)} placeholder="Search WPs... (Ctrl+K)" style={{width:"100%",padding:"6px 10px 6px 26px",borderRadius:6,background:"rgba(255,255,255,0.05)",border:"1px solid "+CC.brd,color:CC.tx,fontSize:10,outline:"none"}}/>
              <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:10,color:CC.fnt}}>🔍</span>
              {wpSearch&&<span style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",fontSize:8,color:CC.acc,fontWeight:700,background:CC.acc+"22",padding:"1px 5px",borderRadius:3}}>{WPS.filter(w=>w.type!=="separator"&&(w.label.toLowerCase().includes(wpSearch.toLowerCase())||w.ref.toLowerCase().includes(wpSearch.toLowerCase())||(w.isa||"").toLowerCase().includes(wpSearch.toLowerCase()))).length}</span>}
            </div>
          </div>}
          <button onClick={()=>setActiveWP("dashboard")} title="Dashboard" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sbOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",background:activeWP==="dashboard"?"linear-gradient(90deg,"+CC.acc+"22,transparent)":"transparent",borderLeft:activeWP==="dashboard"?"3px solid "+CC.acc:"3px solid transparent",color:activeWP==="dashboard"?CC.tx:CC.dim,fontSize:12,fontWeight:activeWP==="dashboard"?600:400}}>
            <span style={{fontSize:sbOpen?14:18}}>📊</span>{sbOpen&&<span>Dashboard</span>}
          </button>
          <button onClick={()=>setActiveWP("review-dashboard")} title="Review Dashboard" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sbOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",background:activeWP==="review-dashboard"?"linear-gradient(90deg,"+CC.acc+"22,transparent)":"transparent",borderLeft:activeWP==="review-dashboard"?"3px solid "+CC.acc:"3px solid transparent",color:activeWP==="review-dashboard"?CC.tx:CC.dim,fontSize:12,fontWeight:activeWP==="review-dashboard"?600:400}}>
            <span style={{fontSize:sbOpen?14:18}}>📋</span>{sbOpen&&<span>Review Dashboard</span>}
          </button>
          <button onClick={()=>setActiveWP("engagement-planning")} title="Engagement Planning" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sbOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",background:activeWP==="engagement-planning"?"linear-gradient(90deg,"+CC.acc+"22,transparent)":"transparent",borderLeft:activeWP==="engagement-planning"?"3px solid "+CC.acc:"3px solid transparent",color:activeWP==="engagement-planning"?CC.tx:CC.dim,fontSize:12,fontWeight:activeWP==="engagement-planning"?600:400}}>
            <span style={{fontSize:sbOpen?14:18}}>📝</span>{sbOpen&&<span>Engagement Planning</span>}
          </button>
          {cfg.configured&&<button onClick={()=>setAgentPanelOpen(p=>!p)} title="Audit Agents" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sbOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",background:agentPanelOpen?"linear-gradient(90deg,rgba(16,185,129,0.13),transparent)":"transparent",borderLeft:agentPanelOpen?"3px solid #10B981":"3px solid transparent",color:agentPanelOpen?CC.tx:CC.dim,fontSize:12,fontWeight:agentPanelOpen?600:400}}>
            <span style={{fontSize:sbOpen?14:18}}>🤖</span>{sbOpen&&<span style={{color:"#10B981"}}>Audit Agents</span>}
          </button>}
          {WPS.map((w,i)=>{
            if(w.id==="a10"&&cfg.engagementType!=="group")return null;
            if(w.id==="reg3"&&cfg.industry!=="financial_services")return null;
            if(w.id==="reg4"&&cfg.industry!=="charities")return null;
            if(wpSearch&&w.type!=="separator"){const q=wpSearch.toLowerCase();if(!w.label.toLowerCase().includes(q)&&!w.ref.toLowerCase().includes(q)&&!(w.isa||"").toLowerCase().includes(q))return null;}
            if(w.type==="separator"){
              if(!sbOpen)return<div key={i} style={{height:1,background:CC.brd,margin:"4px 8px"}}/>;
              if(wpSearch){const secWPs2=[];for(let j=WPS.indexOf(w)+1;j<WPS.length&&WPS[j].type!=="separator";j++)secWPs2.push(WPS[j]);const q2=wpSearch.toLowerCase();const hasMatch=secWPs2.some(sw=>sw.label.toLowerCase().includes(q2)||sw.ref.toLowerCase().includes(q2)||(sw.isa||"").toLowerCase().includes(q2));if(!hasMatch)return null;}
              // Calculate section progress
              const secWPs=[];for(let j=WPS.indexOf(w)+1;j<WPS.length&&WPS[j].type!=="separator";j++)secWPs.push(WPS[j]);
              const secDone=secWPs.filter(sw=>signOffs[sw.id]?.preparedBy).length;
              const secPct=secWPs.length>0?Math.round((secDone/secWPs.length)*100):0;
              const secCol=secPct===100?C.grn:secPct>0?C.org:"rgba(255,255,255,0.08)";
              return<div key={i} style={{padding:"12px 18px 4px",borderTop:i>0?"1px solid "+C.brd:"none",marginTop:i>0?4:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:9,fontWeight:700,color:w.color||C.fnt,letterSpacing:"0.15em",textTransform:"uppercase"}}>{w.label}</span>{cfg.configured&&<span style={{fontSize:8,color:secCol,fontWeight:600}}>{secDone}/{secWPs.length}</span>}</div>
                {cfg.configured&&secWPs.length>0&&<div style={{height:2,borderRadius:1,background:"rgba(255,255,255,0.06)",marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:secPct+"%",background:secCol,borderRadius:1,transition:"width 0.3s"}}/></div>}
              </div>;
            };
            const active=activeWP===w.id;const col=tc(w.type);const so=signOffs[w.id]||{};const status=so.approvedBy?"approved":so.preparedBy&&so.reviewedBy?"done":so.preparedBy?"wip":"open";
            return<button key={w.id} onClick={()=>setActiveWP(w.id)} title={w.label} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sbOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",background:active?"linear-gradient(90deg,"+col+"22,transparent)":"transparent",borderLeft:active?"3px solid "+col:"3px solid transparent",color:active?CC.tx:CC.dim,fontSize:12,fontWeight:active?600:400}}>
              <span style={{fontSize:sbOpen?14:18,flexShrink:0}}>{w.icon}</span>
              {sbOpen&&<><span style={{flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}><span style={{fontFamily:"monospace",color:col,fontSize:10,marginRight:4}}>{w.ref}</span>{w.label}</span><span style={{fontSize:8,color:status==="approved"?"#FFD54F":status==="done"?C.grn:status==="wip"?C.org:CC.fnt}}>{status==="approved"?"★":status==="done"?"✓":status==="wip"?"◐":"○"}</span>{(()=>{const open=(reviewNotes[w.id]||[]).filter(n=>n.status!=="cleared").length;return open>0?<span style={{fontSize:7,padding:"1px 4px",borderRadius:3,background:C.red+"22",color:C.red,fontWeight:700,marginLeft:2}}>{open}</span>:null;})()}</>}
            </button>;
          })}
        </div>
        {sbOpen&&<div style={{padding:"12px 18px",borderTop:"1px solid "+CC.brd,fontSize:9,color:CC.fnt,flexShrink:0}}>
          <div>AuditEngine v10 AURA · Indus Nexus Limited</div>
          <div style={{marginTop:4,fontSize:8,color:"rgba(255,255,255,0.2)"}}>{totalWPs} WPs · {Object.keys(I).length} Industries · ISA (UK) Compliant</div>
          <div style={{marginTop:4,fontSize:8,color:"rgba(255,255,255,0.2)",lineHeight:1.6}}>⌘S Save · ⌘E Export · ⌘/ AI · Esc Close{lastSaveTime?" · Saved "+lastSaveTime:""}</div>
        </div>}
      </aside>
  );
}
