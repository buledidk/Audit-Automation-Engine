import { useEngagement } from "../../context/EngagementContext";
import { C, WPS } from "../../data";

export const EvidenceTracker = ({ wpId }) => {
  const { uploads, documentLinks, CC } = useEngagement();

  const curWPObj = WPS.find(w => w.id === wpId);
  if (!curWPObj || curWPObj.type !== "testing") return null;

  const ASSERTIONS = ["Existence","Completeness","Accuracy","Valuation","Rights","Cut-off","Presentation"];
  const directTags = (uploads[wpId] || []).map(f => f.evidence_tag).filter(Boolean);
  const crossTags = Object.entries(documentLinks).flatMap(([_docId, links]) =>
    links.filter(l => l.wpId === wpId && l.assertion).map(l => l.assertion));
  const allTags = [...directTags, ...crossTags];

  return (
    <div style={{marginTop:12,padding:12,borderRadius:8,background:C.card,border:"1px solid "+C.brd}}>
      <div style={{fontSize:10,color:C.acc,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>Evidence Sufficiency</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
        {ASSERTIONS.map(a => {
          const count = allTags.filter(t => t === a).length;
          return (
            <div key={a} style={{textAlign:"center",padding:"6px 4px",borderRadius:6,background:count>0?C.grn+"0D":C.red+"0D",border:"1px solid "+(count>0?C.grn+"33":C.red+"33")}}>
              <div style={{fontSize:8,color:count>0?C.grn:C.red,fontWeight:600}}>{a}</div>
              <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginTop:2}}>{count}</div>
              <div style={{fontSize:8,color:count>0?C.grn:C.red}}>{count>0?"✓":"✗"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
