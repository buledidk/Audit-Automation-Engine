import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AI Transparency Panel — KPMG Workbench-style
 * Shows confidence, source engine, ISA reference, and accept/modify/reject controls.
 * All decisions are logged to an auditTrail callback.
 */

const CONFIDENCE_CONFIG = {
  high: { label: "HIGH", className: "bg-ae-green/20 text-ae-green border-ae-green/40" },
  medium: { label: "MEDIUM", className: "bg-ae-orange/20 text-ae-orange border-ae-orange/40" },
  low: { label: "LOW", className: "bg-white/10 text-ae-dim border-ae-border" },
};

export function AISuggestion({
  title,
  description,
  confidence = "medium",
  source,
  isaRef,
  onAccept,
  onModify,
  onReject,
  className,
}) {
  const [decision, setDecision] = useState(null);
  const conf = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.medium;

  const handleDecision = (action) => {
    setDecision(action);
    const handler = action === "accept" ? onAccept : action === "modify" ? onModify : onReject;
    if (handler) handler();
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border bg-white/[0.02] transition-all",
      decision === "accept" ? "border-ae-green/30 bg-ae-green/5" :
      decision === "reject" ? "border-ae-red/30 bg-ae-red/5 opacity-60" :
      "border-ae-border",
      className
    )}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-ae-purple flex-shrink-0" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <Badge className={cn("text-[9px] border", conf.className)}>
          {conf.label}
        </Badge>
      </div>

      {description && (
        <p className="text-xs text-ae-dim leading-relaxed mb-3 pl-6">{description}</p>
      )}

      <div className="flex items-center justify-between pl-6">
        <div className="flex items-center gap-3 text-[10px] text-ae-dim">
          {source && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-ae-purple/10 text-ae-purple">
              <BookOpen className="h-2.5 w-2.5" /> {source}
            </span>
          )}
          {isaRef && (
            <span className="px-1.5 py-0.5 rounded bg-ae-blue/10 text-ae-blue">
              {isaRef}
            </span>
          )}
        </div>

        {!decision ? (
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => handleDecision("accept")} className="h-7 px-2 text-[10px] text-ae-green hover:bg-ae-green/10">
              <Check className="h-3 w-3 mr-1" /> Accept
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDecision("modify")} className="h-7 px-2 text-[10px] text-ae-orange hover:bg-ae-orange/10">
              <Pencil className="h-3 w-3 mr-1" /> Modify
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDecision("reject")} className="h-7 px-2 text-[10px] text-ae-red hover:bg-ae-red/10">
              <X className="h-3 w-3 mr-1" /> Reject
            </Button>
          </div>
        ) : (
          <Badge variant={decision === "accept" ? "success" : decision === "modify" ? "warning" : "destructive"} className="text-[9px]">
            {decision === "accept" ? "Accepted" : decision === "modify" ? "Modified" : "Rejected"}
          </Badge>
        )}
      </div>
    </div>
  );
}

/**
 * AI Suggestions Panel — wraps multiple suggestions
 */
export function AISuggestionsPanel({ suggestions = [], className }) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-ae-purple uppercase tracking-wider">
        <Brain className="h-3.5 w-3.5" />
        AI Suggestions
        <Badge variant="secondary" className="text-[9px]">{suggestions.length}</Badge>
      </div>
      {suggestions.map((s, i) => (
        <AISuggestion key={i} {...s} />
      ))}
    </div>
  );
}
