import { useEffect } from "react";
import { useEngagement } from "../context/EngagementContext";

export function useKeyboardShortcuts({ buildWPCsv, doExport, curWP }) {
  const {
    showModal, setShowModal, setMi, aiOpen, setAiOpen,
    showSampleCalc, setShowSampleCalc, extractPreview, setExtractPreview,
    showWelcome, setShowWelcome, showDebug, setShowDebug,
    setSbOpen, wpSearchRef, cfg, visibleWPs, activeWP, setActiveWP,
    forceSaveAll
  } = useEngagement();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (showModal) { setShowModal(null); setMi({}); e.preventDefault(); return; }
        if (aiOpen) { setAiOpen(false); e.preventDefault(); return; }
        if (showSampleCalc) { setShowSampleCalc(false); e.preventDefault(); return; }
        if (extractPreview) { setExtractPreview(null); e.preventDefault(); return; }
        if (showWelcome) { setShowWelcome(false); e.preventDefault(); return; }
        if (showDebug) { setShowDebug(false); e.preventDefault(); return; }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        forceSaveAll();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (curWP && curWP.type !== "separator") buildWPCsv(curWP);
        else doExport();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setAiOpen(p => !p);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSbOpen(p => !p);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (wpSearchRef.current) { wpSearchRef.current.focus(); wpSearchRef.current.select(); }
      }
      const tag = document.activeElement?.tagName;
      if (!tag || !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
        if (e.key === "ArrowDown" && cfg.configured) {
          e.preventDefault();
          const ci = visibleWPs.indexOf(activeWP);
          if (ci < visibleWPs.length - 1) setActiveWP(visibleWPs[ci + 1]);
        }
        if (e.key === "ArrowUp" && cfg.configured) {
          e.preventDefault();
          const ci = visibleWPs.indexOf(activeWP);
          if (ci > 0) setActiveWP(visibleWPs[ci - 1]);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
}
