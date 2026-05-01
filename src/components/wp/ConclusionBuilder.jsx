import { useState, useCallback, useMemo, memo } from "react";

function parseTemplate(template) {
  if (!template) return [];
  const parts = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIdx = 0, match;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIdx) parts.push({ type: "text", value: template.slice(lastIdx, match.index) });
    const opts = match[1].split("/").map(s => s.trim()).filter(Boolean);
    parts.push(opts.length > 1 ? { type: "select", options: opts } : { type: "text", value: match[0] });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < template.length) parts.push({ type: "text", value: template.slice(lastIdx) });
  return parts;
}

export default memo(function ConclusionBuilder({ template, value, onChange, inputStyle, colors }) {
  const CC = colors || {};
  const parts = useMemo(() => parseTemplate(template), [template]);
  const hasSelects = parts.some(p => p.type === "select");
  const [selections, setSelections] = useState({});

  const assembleText = useCallback((sels) => {
    return parts.map((p, i) => p.type === "text" ? p.value : (sels[i] || p.options[0])).join("");
  }, [parts]);

  const handleSelect = useCallback((idx, val) => {
    const next = { ...selections, [idx]: val };
    setSelections(next);
    onChange(assembleText(next));
  }, [selections, assembleText, onChange]);

  if (!hasSelects) return <textarea value={value || ""} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder={template} />;

  return <div>
    <div style={{ fontSize: 10, color: CC.acc || "#FFA726", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Structured Conclusion</div>
    <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, lineHeight: 2.2, fontSize: 12, color: CC.dim || "#B0B8C8", marginBottom: 8 }}>
      {parts.map((p, i) => p.type === "text" ? <span key={i}>{p.value}</span> :
        <select key={i} value={selections[i] || ""} onChange={e => handleSelect(i, e.target.value)}
          style={{ padding: "2px 8px", borderRadius: 4, fontSize: 12, cursor: "pointer", margin: "0 2px",
            background: selections[i] ? "rgba(76,175,80,0.15)" : "rgba(255,193,7,0.15)",
            border: "1px solid " + (selections[i] ? "rgba(76,175,80,0.4)" : "rgba(255,193,7,0.4)"),
            color: CC.tx || "#E8ECF1" }}>
          <option value="">select...</option>
          {p.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
    <textarea value={value || ""} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="Override or add notes to the structured conclusion above..." />
  </div>;
});
