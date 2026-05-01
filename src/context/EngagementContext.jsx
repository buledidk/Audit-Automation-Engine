import { createContext, useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { createStorageEngine, listEngagements, createEngagement, getActiveEngagementId, setActiveEngagementId } from "../StorageEngine";
import { DEFAULT_CFG } from "../components/Shared/utils/constants";
import { I, FW, SZ, WPS, C, CL } from "../data";

const EngagementContext = createContext(null);

// ═══ Persisted state keys — auto-saved to StorageEngine ═══
const PERSISTED_KEYS = [
  "cfg","cellData","signOffs","wpNotes","customItems","tbData","tbMappings",
  "uploads","archived","reviewStatus","integrations","signOffLog","reviewNotes",
  "documentLinks","changeLog","procedureLinks"
];

export function EngagementProvider({ initialEngId, engId: engIdProp, children }) {
  // ═══ Engagement identity ═══
  const [engId, setEngId] = useState(() => initialEngId || engIdProp || getActiveEngagementId());
  const storageRef = useRef(null);
  const mounted = useRef(false);

  // ═══ Persisted state (saved to StorageEngine) ═══
  const [cfg, setCfg] = useState({ ...DEFAULT_CFG });
  const [cellData, setCellData] = useState({});
  const [signOffs, setSignOffs] = useState({});
  const [wpNotes, setWpNotes] = useState({});
  const [customItems, setCustomItems] = useState({ risks: [], tests: {} });
  const [tbData, setTbData] = useState([]);
  const [tbMappings, setTbMappings] = useState({});
  const [uploads, setUploads] = useState({});
  const [archived, setArchived] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const [integrations, setIntegrations] = useState({});
  const [signOffLog, setSignOffLog] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [documentLinks, setDocumentLinks] = useState({});
  const [changeLog, setChangeLog] = useState([]);
  const [procedureLinks, setProcedureLinks] = useState({});

  // ═══ UI state (not persisted) ═══
  const [activeWP, setActiveWP] = useState("dashboard");
  const [sbOpen, setSbOpen] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [mi, setMi] = useState({});
  const [showSampleCalc, setShowSampleCalc] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiMode, setAiMode] = useState("assist");
  const [aiAuditTrail, setAiAuditTrail] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadingBtns, setDownloadingBtns] = useState({});
  const [extractPreview, setExtractPreview] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [chResult, setChResult] = useState(null);
  const [wpSearch, setWpSearch] = useState("");
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [splashDone, setSplashDone] = useState(false);
  const [cellHistoryKey, setCellHistoryKey] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("ae-theme") || "dark");
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [agentResults, setAgentResults] = useState([]);

  // Lazy-loaded modules
  const [arMod, setArMod] = useState(null);
  const [coaMod, setCoaMod] = useState(null);
  const [fmUIMod, setFmUIMod] = useState(null);

  // Refs
  const debugClicks = useRef(0);
  const debugTimer = useRef(null);
  const renderCount = useRef(0);
  const wpSearchRef = useRef(null);

  // ═══ Derived config ═══
  const CC = theme === "light" ? CL : C;
  const ind = cfg.industry ? I[cfg.industry] : null;
  const fw = cfg.framework ? FW[cfg.framework] : null;
  const sz = cfg.entitySize ? SZ[cfg.entitySize] : null;
  const indAcc = ind?.ac || C.acc;

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ae-theme", next);
  }, [theme]);

  const handleDebugClick = useCallback(() => {
    debugClicks.current++;
    if (debugTimer.current) clearTimeout(debugTimer.current);
    if (debugClicks.current >= 3) {
      debugClicks.current = 0;
      setShowDebug(p => !p);
      return;
    }
    debugTimer.current = setTimeout(() => {
      if (debugClicks.current < 3) setSbOpen(prev => !prev);
      debugClicks.current = 0;
    }, 300);
  }, [debugClicks, debugTimer, setShowDebug, setSbOpen]);

  const showToast = useCallback((msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  const upd = useCallback((k, v) => setCfg(p => ({ ...p, [k]: v })), []);

  // ═══ Splash screen auto-dismiss ═══
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // ═══ Lazy-load modules ═══
  useEffect(() => {
    import("../AuditResearch").then(m => setArMod(m)).catch(() => {});
    import("../ChartOfAccounts").then(m => setCoaMod(m)).catch(() => {});
    import("../FinancialModelUI.jsx").then(m => setFmUIMod(m)).catch(() => {});
  }, []);

  // ═══ STORAGE ENGINE — Persistence ═══
  useEffect(() => {
    if (!engId) return;
    storageRef.current = createStorageEngine(engId);
    const saved = storageRef.current.loadAll();
    if (saved.cfg) setCfg(saved.cfg);
    if (saved.cellData) setCellData(saved.cellData);
    if (saved.signOffs) setSignOffs(saved.signOffs);
    if (saved.wpNotes) setWpNotes(saved.wpNotes);
    if (saved.customItems) setCustomItems(saved.customItems);
    if (saved.tbData) setTbData(saved.tbData);
    if (saved.tbMappings) setTbMappings(saved.tbMappings);
    if (saved.uploads) setUploads(saved.uploads);
    if (saved.archived) setArchived(saved.archived);
    if (saved.reviewStatus) setReviewStatus(saved.reviewStatus);
    if (saved.integrations) setIntegrations(saved.integrations);
    if (saved.signOffLog) setSignOffLog(saved.signOffLog);
    if (saved.reviewNotes) setReviewNotes(saved.reviewNotes);
    if (saved.documentLinks) setDocumentLinks(saved.documentLinks);
    if (saved.changeLog) setChangeLog(saved.changeLog);
    if (saved.procedureLinks) setProcedureLinks(saved.procedureLinks);
    if (!saved.cfg || !saved.cfg.configured) setShowWelcome(true);
    // Cloud sync
    if (storageRef.current.syncFromCloud) {
      storageRef.current.syncFromCloud().then(cloud => {
        if (cloud && Object.keys(cloud).length) {
          if (cloud.cfg) setCfg(cloud.cfg);
          if (cloud.cellData) setCellData(cloud.cellData);
          if (cloud.signOffs) setSignOffs(cloud.signOffs);
          if (cloud.wpNotes) setWpNotes(cloud.wpNotes);
          if (cloud.customItems) setCustomItems(cloud.customItems);
          if (cloud.tbData) setTbData(cloud.tbData);
          if (cloud.tbMappings) setTbMappings(cloud.tbMappings);
          if (cloud.uploads) setUploads(cloud.uploads);
          if (cloud.archived) setArchived(cloud.archived);
          if (cloud.reviewStatus) setReviewStatus(cloud.reviewStatus);
          if (cloud.integrations) setIntegrations(cloud.integrations);
          if (cloud.signOffLog) setSignOffLog(cloud.signOffLog);
          if (cloud.reviewNotes) setReviewNotes(cloud.reviewNotes);
          if (cloud.documentLinks) setDocumentLinks(cloud.documentLinks);
          if (cloud.changeLog) setChangeLog(cloud.changeLog);
          if (cloud.procedureLinks) setProcedureLinks(cloud.procedureLinks);
        }
      });
    }
    mounted.current = true;
  }, [engId]);

  // ═══ Auto-save each persisted state key ═══
  const save = useCallback((key, value) => {
    if (!storageRef.current || !mounted.current) return;
    storageRef.current.save(key, value);
  }, []);

  useEffect(() => { if (mounted.current) { save("cfg", cfg); setLastSaveTime(new Date().toLocaleTimeString()); } }, [cfg, save]);
  useEffect(() => { if (mounted.current) save("cellData", cellData); }, [cellData, save]);
  useEffect(() => { if (mounted.current) save("signOffs", signOffs); }, [signOffs, save]);
  useEffect(() => { if (mounted.current) save("wpNotes", wpNotes); }, [wpNotes, save]);
  useEffect(() => { if (mounted.current) save("customItems", customItems); }, [customItems, save]);
  useEffect(() => { if (mounted.current) save("tbData", tbData); }, [tbData, save]);
  useEffect(() => { if (mounted.current) save("tbMappings", tbMappings); }, [tbMappings, save]);
  useEffect(() => { if (mounted.current) save("uploads", uploads); }, [uploads, save]);
  useEffect(() => { if (mounted.current) save("archived", archived); }, [archived, save]);
  useEffect(() => { if (mounted.current) save("reviewStatus", reviewStatus); }, [reviewStatus, save]);
  useEffect(() => { if (mounted.current) save("integrations", integrations); }, [integrations, save]);
  useEffect(() => { if (mounted.current) save("signOffLog", signOffLog); }, [signOffLog, save]);
  useEffect(() => { if (mounted.current) save("reviewNotes", reviewNotes); }, [reviewNotes, save]);
  useEffect(() => { if (mounted.current) save("documentLinks", documentLinks); }, [documentLinks, save]);
  useEffect(() => { if (mounted.current) save("changeLog", changeLog); }, [changeLog, save]);
  useEffect(() => { if (mounted.current) save("procedureLinks", procedureLinks); }, [procedureLinks, save]);

  // ═══ Auto-create engagement on first use ═══
  useEffect(() => {
    if (!engId) {
      const engs = listEngagements();
      if (engs.length > 0) {
        const id = engs[engs.length - 1].id;
        setActiveEngagementId(id);
        setEngId(id);
      } else {
        const id = createEngagement("Default Engagement");
        setActiveEngagementId(id);
        setEngId(id);
      }
    }
  }, []);

  // ═══ Engagement management helpers ═══
  const startNewEngagement = useCallback((name) => {
    const id = createEngagement(name || "New Engagement");
    setActiveEngagementId(id);
    setEngId(id);
    setCfg({ ...DEFAULT_CFG });
    setCellData({}); setSignOffs({}); setWpNotes({}); setCustomItems({ risks: [], tests: {} });
    setTbData([]); setTbMappings({}); setUploads({}); setArchived(false); setReviewStatus("");
    setSignOffLog([]); setReviewNotes({}); setDocumentLinks({}); setChangeLog([]); setProcedureLinks({});
  }, []);

  const switchEngagement = useCallback((id) => {
    setActiveEngagementId(id);
    setEngId(id);
    setActiveWP("dashboard");
  }, []);

  // ═══ Force save all ═══
  const forceSaveAll = useCallback(() => {
    if (!storageRef.current) return;
    const stateMap = { cfg, cellData, signOffs, wpNotes, customItems, tbData, tbMappings, uploads, archived, reviewStatus, integrations, signOffLog, reviewNotes, documentLinks, changeLog, procedureLinks };
    PERSISTED_KEYS.forEach(k => {
      if (stateMap[k] !== undefined) storageRef.current.saveImmediate(k, stateMap[k]);
    });
    setLastSaveTime(new Date().toLocaleTimeString());
    showToast("All changes saved");
  }, [cfg, cellData, signOffs, wpNotes, customItems, tbData, tbMappings, uploads, archived, reviewStatus, integrations, signOffLog, reviewNotes, documentLinks, changeLog, procedureLinks, showToast]);

  // ═══ Visible WPs list ═══
  const allWPs = useMemo(() => WPS.filter(w => w.type !== "separator"), []);
  const totalWPs = allWPs.length;
  const doneCount = useMemo(() => Object.keys(signOffs).filter(k => signOffs[k]?.preparedBy).length, [signOffs]);
  const visibleWPs = useMemo(() => {
    const list = ["dashboard"];
    WPS.forEach(w => {
      if (w.type === "separator") return;
      if (w.id === "a10" && cfg.engagementType !== "group") return;
      if (w.id === "reg3" && cfg.industry !== "financial_services") return;
      if (w.id === "reg4" && cfg.industry !== "charities") return;
      list.push(w.id);
    });
    return list;
  }, [cfg.engagementType, cfg.industry]);

  const curWP = activeWP !== "dashboard" && activeWP !== "engagement-planning" && activeWP !== "review-dashboard"
    ? WPS.find(w => w.id === activeWP) : null;

  const value = {
    // Identity
    engId, setEngId, storageRef,
    // Persisted state
    cfg, setCfg, cellData, setCellData, signOffs, setSignOffs,
    wpNotes, setWpNotes, customItems, setCustomItems,
    tbData, setTbData, tbMappings, setTbMappings,
    uploads, setUploads, archived, setArchived,
    reviewStatus, setReviewStatus, integrations, setIntegrations,
    signOffLog, setSignOffLog, reviewNotes, setReviewNotes,
    documentLinks, setDocumentLinks, changeLog, setChangeLog,
    procedureLinks, setProcedureLinks,
    // UI state
    activeWP, setActiveWP, sbOpen, setSbOpen,
    showModal, setShowModal, mi, setMi,
    showSampleCalc, setShowSampleCalc,
    aiOpen, setAiOpen, aiLoading, setAiLoading,
    aiMessages, setAiMessages, aiInput, setAiInput,
    aiMode, setAiMode, aiAuditTrail, setAiAuditTrail,
    showDebug, setShowDebug, toastMsg, setToastMsg,
    showWelcome, setShowWelcome, mobileMenuOpen, setMobileMenuOpen,
    downloadingBtns, setDownloadingBtns,
    extractPreview, setExtractPreview,
    validationResult, setValidationResult,
    chResult, setChResult, wpSearch, setWpSearch,
    lastSaveTime, setLastSaveTime,
    splashDone, setSplashDone,
    cellHistoryKey, setCellHistoryKey,
    theme, setTheme, toggleTheme, handleDebugClick,
    agentPanelOpen, setAgentPanelOpen,
    agentResults, setAgentResults,
    // Lazy modules
    arMod, coaMod, fmUIMod,
    // Refs
    debugClicks, debugTimer, renderCount, wpSearchRef,
    // Derived
    CC, ind, fw, sz, indAcc,
    // Helpers
    showToast, upd, forceSaveAll,
    startNewEngagement, switchEngagement,
    // Computed
    allWPs, totalWPs, doneCount, visibleWPs, curWP
  };

  return (
    <EngagementContext.Provider value={value}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const ctx = useContext(EngagementContext);
  return ctx || null;
}

export default EngagementContext;
