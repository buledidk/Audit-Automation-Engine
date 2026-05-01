import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers.jsx";
import { C } from "../../data";

export const FSLILead = ({ wp }) => {
  const { ind } = useEngagement();
  const { _BoundET } = useAuditHelpers();

  if (!wp.fk || !ind?.f?.[wp.fk]) return null;
  const lines = ind.f[wp.fk].filter(l => l !== "N/A" && l !== "N/A for pure SaaS");
  if (!lines.length) return null;

  return (
    <div style={{marginBottom:0}}>
      <div style={{background:"linear-gradient(135deg,rgba(67,160,71,0.08),rgba(67,160,71,0.03))",border:"1px solid rgba(67,160,71,0.25)",borderRadius:"12px 12px 0 0",padding:"18px 20px",borderLeft:"4px solid "+C.ld,borderBottom:"2px dashed rgba(67,160,71,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#66BB6A,#43A047)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>LS</div>
          <div>
            <div style={{fontSize:11,color:C.ld,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>FSLI Lead — {wp.label}</div>
            <div style={{fontSize:9,color:C.fnt}}>Traces to C2 (P&L) / C3 (Balance Sheet)</div>
          </div>
        </div>
        <BoundET id={"fsli_"+wp.id} headers={["FSLI Line Item","PY (£)","CY (£)","Movement (£)","Movement %","Ref","Status"]} rows={lines.map(l=>[<span style={{color:C.tx,fontWeight:500}}>{l}</span>,"","","","",wp.ref,""])} editable={[1,2,3,4,6]}/>
      </div>
      <div style={{display:"flex",justifyContent:"center",padding:"4px 0",background:"linear-gradient(180deg,rgba(67,160,71,0.04),rgba(251,140,0,0.04))"}}><div style={{padding:"4px 16px",fontSize:9,color:C.dim,letterSpacing:"0.12em",fontWeight:600}}><span style={{color:C.ld}}>▲ LEAD</span> ─── traces to ─── <span style={{color:C.tst}}>▼ TESTING</span></div></div>
    </div>
  );
};
