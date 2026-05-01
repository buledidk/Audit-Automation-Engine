import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { TOUR_CONFIG } from "./tourSteps";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react"; // eslint-disable-line no-unused-vars

/**
 * TourStep — renders a spotlight overlay + tooltip for one tour step.
 * Handles element highlighting, positioning, keyboard, and auto-advance.
 */
export default function TourStep({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  autoAdvance,
  onToggleAuto,
  children, // optional slot for agent showcase or export demo
}) {
  const tooltipRef = useRef(null);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // Find and measure the target element
  const measureTarget = useCallback(() => {
    if (!step.target && !step.fallbackTarget) {
      setTargetRect(null);
      return;
    }
    const el =
      document.querySelector(step.target) ||
      document.querySelector(step.fallbackTarget);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top - TOUR_CONFIG.spotlightPadding,
        left: rect.left - TOUR_CONFIG.spotlightPadding,
        width: rect.width + TOUR_CONFIG.spotlightPadding * 2,
        height: rect.height + TOUR_CONFIG.spotlightPadding * 2,
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useLayoutEffect(() => {
    measureTarget(); // eslint-disable-line react-hooks/set-state-in-effect -- DOM measurement requires setState in layout effect
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [measureTarget]);

  // Position tooltip relative to target or centre of screen
  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const tt = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!targetRect) {
      // Centre overlay
      setTooltipPos({
        top: Math.max(40, (vh - tt.height) / 2),
        left: Math.max(20, (vw - tt.width) / 2),
      });
      return;
    }

    // Position below target by default, or above if not enough space
    let top = targetRect.top + targetRect.height + 16;
    let left = targetRect.left + targetRect.width / 2 - tt.width / 2;

    if (top + tt.height > vh - 20) {
      top = targetRect.top - tt.height - 16;
    }
    left = Math.max(20, Math.min(left, vw - tt.width - 20));
    top = Math.max(20, top);

    setTooltipPos({ top, left });
  }, [targetRect, step]);

  // Auto-advance timer
  useEffect(() => {
    if (!autoAdvance) {
      setProgress(0); // eslint-disable-line react-hooks/set-state-in-effect -- reset is intentional cleanup
      return;
    }
    const start = Date.now();
    const duration = TOUR_CONFIG.autoAdvanceMs;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / duration);
      setProgress(pct);
      if (pct >= 1) {
        onNext();
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [autoAdvance, stepIndex, onNext]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); onNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
      if (e.key === "Escape") { onSkip(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onSkip]);

  const isOverlay = !targetRect;

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "auto" }}>
      {/* Dimmed backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#tour-mask)"
        />
        {targetRect && (
          <rect
            x={targetRect.left}
            y={targetRect.top}
            width={targetRect.width}
            height={targetRect.height}
            rx="8"
            fill="none"
            stroke="#F5A623"
            strokeWidth="2"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`absolute z-[10000] transition-all duration-300 ${isOverlay ? "w-[90vw] max-w-[520px]" : ""}`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          maxWidth: isOverlay ? 520 : TOUR_CONFIG.tooltipMaxWidth,
          pointerEvents: "auto",
        }}
      >
        <div className="bg-[#1a2235] border border-ae-border rounded-xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[10px] text-brand font-semibold uppercase tracking-wider mb-1">
                Step {stepIndex + 1} of {totalSteps}
              </div>
              <h3 className="text-white font-['Cormorant_Garamond',serif] text-xl font-bold">
                {step.title}
              </h3>
            </div>
            <button
              onClick={onSkip}
              className="text-slate-500 hover:text-white transition-colors p-1"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {step.body}
          </p>

          {/* Stats grid (welcome + summary steps) */}
          {step.stats && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {step.stats.map((s) => (
                <div key={s.label} className="text-center bg-[#0f1729] rounded-lg p-2">
                  <div className="text-lg font-bold text-brand">{s.value}</div>
                  <div className="text-[9px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Optional children (agent showcase, export demo) */}
          {children}

          {/* Auto-advance progress bar */}
          {autoAdvance && (
            <div className="h-1 bg-[#0f1729] rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={stepIndex === 0}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAuto}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                title={autoAdvance ? "Pause auto-advance" : "Start auto-advance"}
              >
                {autoAdvance ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {autoAdvance ? "Pause" : "Auto"}
              </button>
              {step.isFinal ? (
                <button
                  onClick={onSkip}
                  className="bg-brand text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors"
                >
                  Finish Tour
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="bg-brand text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
