import { useState, useEffect, useRef } from "react";
import { DEMO_AGENT_RECORDING } from "../../data/demoAgentRecording";
import { Brain, CheckCircle2, Loader2 } from "lucide-react"; // eslint-disable-line no-unused-vars

/**
 * AgentShowcase — displays a simulated AI agent session with typewriter effect.
 * Shows the planning agent reasoning through a construction audit engagement.
 */
export default function AgentShowcase() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef(null);

  const rec = DEMO_AGENT_RECORDING;
  const totalSteps = rec.steps.length;
  const currentAgentStep = rec.steps[currentStepIdx];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines, currentLine]);

  // Typewriter effect
  useEffect(() => {
    if (!started || !currentAgentStep) return;

    let lineIdx = 0;
    let charIdx = 0;
    let cancelled = false;

    const initialDelay = setTimeout(() => {
      if (cancelled) return;
      setIsTyping(true);

      const typeNext = () => {
        if (cancelled) return;

        if (lineIdx >= currentAgentStep.lines.length) {
          // Step complete — move to next step
          setIsTyping(false);
          setCurrentLine("");
          const nextStep = currentStepIdx + 1;
          if (nextStep < totalSteps) {
            setTimeout(() => {
              if (!cancelled) {
                setCurrentStepIdx(nextStep);
                setDisplayedLines([]);
              }
            }, 800);
          }
          return;
        }

        const line = currentAgentStep.lines[lineIdx];

        if (charIdx < line.length) {
          setCurrentLine(line.slice(0, charIdx + 1));
          charIdx++;
          setTimeout(typeNext, 15 + Math.random() * 10);
        } else {
          // Line complete
          setDisplayedLines((prev) => [...prev, line]);
          setCurrentLine("");
          lineIdx++;
          charIdx = 0;
          setTimeout(typeNext, line === "" ? 100 : 200);
        }
      };

      typeNext();
    }, currentAgentStep.delay || 500);

    return () => {
      cancelled = true;
      clearTimeout(initialDelay);
    };
  }, [started, currentStepIdx, currentAgentStep, totalSteps]);

  const phaseColor = {
    ANALYSING: "text-blue-400",
    REASONING: "text-brand",
    GENERATING: "text-purple-400",
    "CROSS-REFERENCING": "text-cyan-400",
    COMPLETE: "text-ae-green",
  };

  return (
    <div className="bg-[#0a0f1e] border border-ae-border/50 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-ae-border/30 bg-[#0f1729]">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-brand" />
          <span className="text-[10px] font-semibold text-slate-300">
            AI Agent: Planning
          </span>
          <span className="text-[9px] text-slate-500">
            {rec.model}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-slate-500">
          <span>Step {Math.min(currentStepIdx + 1, totalSteps)}/{totalSteps}</span>
          {currentAgentStep && (
            <span className={phaseColor[currentAgentStep.phase] || "text-slate-400"}>
              {currentAgentStep.phase}
            </span>
          )}
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className="p-4 font-mono text-xs leading-relaxed max-h-[200px] overflow-y-auto"
      >
        {!started ? (
          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 text-brand hover:text-brand-light transition-colors text-xs"
          >
            <Brain className="h-4 w-4" />
            Click to watch the planning agent analyse this engagement
          </button>
        ) : (
          <>
            {/* Step header */}
            {currentAgentStep && (
              <div className="flex items-center gap-2 mb-2">
                {currentAgentStep.phase === "COMPLETE" ? (
                  <CheckCircle2 className="h-3 w-3 text-ae-green" />
                ) : (
                  <Loader2 className={`h-3 w-3 animate-spin ${phaseColor[currentAgentStep.phase] || "text-slate-400"}`} />
                )}
                <span className={`text-[10px] font-semibold ${phaseColor[currentAgentStep.phase] || "text-slate-400"}`}>
                  {currentAgentStep.title}
                </span>
              </div>
            )}

            {/* Typed lines */}
            {displayedLines.map((line, i) => (
              <div key={i} className={`${line === "" ? "h-2" : ""} ${line.startsWith("SIGNIFICANT") || line.startsWith("ELEVATED") ? "text-brand font-semibold" : line.startsWith("  \u2192") ? "text-slate-400" : line.startsWith("\u2713") ? "text-ae-green" : "text-slate-300"}`}>
                {line}
              </div>
            ))}

            {/* Currently typing line */}
            {isTyping && currentLine && (
              <div className="text-slate-300">
                {currentLine}
                <span className="inline-block w-1.5 h-3.5 bg-brand ml-0.5 animate-pulse" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer stats */}
      {currentStepIdx >= totalSteps - 1 && !isTyping && started && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-ae-border/30 bg-[#0f1729] text-[9px] text-slate-500">
          <span>Duration: {rec.duration}</span>
          <span>Tokens: {rec.tokens.input.toLocaleString()} in / {rec.tokens.output.toLocaleString()} out</span>
          <span className="text-ae-green">{Math.round(rec.tokens.cached / rec.tokens.input * 100)}% cache hit</span>
        </div>
      )}
    </div>
  );
}
