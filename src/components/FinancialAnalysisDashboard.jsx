/**
 * Financial Ratio Analysis Dashboard
 *
 * Comprehensive financial health analysis with ratio computation,
 * DuPont decomposition, going concern indicators, and FTSE 250
 * sector benchmarking. Adapts visible tabs by entity type per ISA requirements.
 */

import { useState, useMemo, useEffect } from "react";
import { FinancialRatioEngine } from "../services/financialRatioEngine.js";

const COLORS = {
  bg: "#0A0E17",
  sidebar: "#0F1622",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  accent: "#F5A623",
  text: "#F8F8F8",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  green: "#66BB6A",
  red: "#EF5350",
  orange: "#FFA726",
  blue: "#42A5F5",
  purple: "#CE93D8",
  planning: "#1E88E5",
  risk: "#E53935"
};

const SEVERITY_COLORS = {
  critical: COLORS.red,
  high: COLORS.orange,
  medium: COLORS.accent,
  low: COLORS.blue,
  info: COLORS.dim
};

const POSITION_COLORS = {
  excellent: COLORS.green,
  good: COLORS.blue,
  average: COLORS.accent,
  below_average: COLORS.orange,
  poor: COLORS.red
};

/** Determine which tabs are available for the given entity type */
function getTabsForEntityType(entityType) {
  switch (entityType) {
    case "micro":
      return ["overview", "ratios"];
    case "small":
      return ["overview", "ratios", "alerts"];
    case "medium":
      return ["overview", "ratios", "alerts", "goingConcern", "trends"];
    case "large":
    case "plc":
    default:
      return ["overview", "ratios", "alerts", "goingConcern", "benchmarking", "trends", "dupont"];
  }
}

const TAB_LABELS = {
  overview: "Overview",
  ratios: "Ratios",
  alerts: "Health & Alerts",
  goingConcern: "Going Concern",
  benchmarking: "Benchmarking",
  trends: "Trends",
  dupont: "DuPont"
};

/* ───────────────────────── Formatting helpers ───────────────────────── */

function formatCurrency(value) {
  if (value == null || isNaN(value)) return "--";
  const prefix = value < 0 ? "-" : "";
  return prefix + "\u00A3" + Math.abs(value).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatPercent(value) {
  if (value == null || isNaN(value)) return "--";
  return value.toFixed(1) + "%";
}

function formatRatioValue(value, unit) {
  if (value == null || isNaN(value)) return "--";
  if (unit === "%" || unit === "percent") return formatPercent(value);
  if (unit === "x" || unit === "times") return value.toFixed(2) + "x";
  if (unit === "days") return Math.round(value) + " days";
  if (unit === "currency" || unit === "\u00A3") return formatCurrency(value);
  return typeof value === "number" ? value.toFixed(2) : String(value);
}

function gradeColor(grade) {
  if (!grade) return COLORS.dim;
  const g = grade.toUpperCase();
  if (g === "A" || g === "A+") return COLORS.green;
  if (g === "B" || g === "B+") return COLORS.blue;
  if (g === "C" || g === "C+") return COLORS.accent;
  if (g === "D") return COLORS.orange;
  return COLORS.red;
}

/* ───────────────────────── Shared inline styles ───────────────────────── */

const styles = {
  wrapper: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "12px",
    padding: "24px",
    margin: "20px 0",
    color: COLORS.text,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  header: {
    marginBottom: "24px",
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: "16px"
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: COLORS.blue,
    fontWeight: 700
  },
  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: COLORS.dim
  },
  tabBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: "12px",
    flexWrap: "wrap"
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    color: COLORS.text,
    fontWeight: 600
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "24px"
  },
  card: {
    padding: "16px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "8px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px"
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.dim,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600
  },
  td: {
    padding: "10px 12px",
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.text
  },
  badge: (color) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#fff",
    background: color + "30",
    border: `1px solid ${color}60`
  }),
  emptyState: {
    padding: "48px 24px",
    textAlign: "center",
    color: COLORS.dim,
    fontSize: "14px"
  }
};

function tabStyle(isActive, accentColor) {
  return {
    padding: "10px 16px",
    background: isActive ? accentColor + "30" : "transparent",
    border: `1px solid ${isActive ? accentColor + "60" : COLORS.border}`,
    color: isActive ? accentColor : COLORS.dim,
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase"
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export function FinancialAnalysisDashboard({
  financialData = {},
  priorYearData = null,
  entityName = "",
  entityType = "private",
  sector = "general",
  sicCode = "",
  companyNumber = "",
  initialTab = "overview",
  onAnalysisComplete = () => {}
}) {
  const engine = useMemo(() => new FinancialRatioEngine(), []);

  const [analysis, setAnalysis] = useState(null);
  const [dupont, setDupont] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [ratioSet, setRatioSet] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [error, setError] = useState(null);

  const availableTabs = useMemo(() => getTabsForEntityType(entityType), [entityType]);

  // Ensure activeTab stays valid when entity type changes
  useEffect(() => {
    const isValid = availableTabs.includes(activeTab);
    if (!isValid) {
      // Deferred state update to avoid cascading renders in effect
      const id = requestAnimationFrame(() => setActiveTab(availableTabs[0] || "overview"));
      return () => cancelAnimationFrame(id);
    }
  }, [availableTabs, activeTab]);

  // Auto-compute when financial data changes
  useEffect(() => {
    if (!financialData || (!financialData.revenue && !financialData.totalAssets)) {
      return;
    }

    // Use microtask to avoid synchronous setState cascade within effect
    const run = () => { try {
      setError(null);

      // Core analysis
      const result = engine.calculateAllRatios(financialData, priorYearData, {
        entityType,
        sector,
        sicCode,
        companyNumber
      });
      setAnalysis(result);

      // Ratio set for entity type
      const rs = engine.getRatioSetForEntityType(entityType);
      setRatioSet(rs);

      // DuPont analysis (large / plc only)
      if (entityType === "large" || entityType === "plc") {
        try {
          const dp = engine.dupontAnalysis(financialData);
          setDupont(dp);
        } catch (_) {
          setDupont(null);
        }
      }

      // Benchmarking
      if (entityType === "large" || entityType === "plc") {
        try {
          const bm = engine.benchmarkAgainstFTSE250(
            result.ratios,
            entityName || companyNumber,
            sicCode
          );
          setBenchmark(bm);
        } catch (_) {
          setBenchmark(null);
        }
      }

      onAnalysisComplete(result);
    } catch (err) {
      setError(err.message || "Financial analysis failed");
    } };
    run();
  }, [financialData, priorYearData, entityType, sector, sicCode, companyNumber, entityName, engine, onAnalysisComplete]);

  /* ── Alert counts by severity ── */
  const alertCounts = useMemo(() => {
    if (!analysis || !analysis.alerts) return { critical: 0, high: 0, medium: 0 };
    const counts = { critical: 0, high: 0, medium: 0 };
    analysis.alerts.forEach((a) => {
      const sev = (a.severity || "").toLowerCase();
      if (counts[sev] !== undefined) counts[sev]++;
    });
    return counts;
  }, [analysis]);

  /* ── Grouped ratios by category ── */
  const groupedRatios = useMemo(() => {
    if (!analysis || !analysis.ratios) return {};
    const groups = {};
    const ratios = analysis.ratios;
    const categories = analysis.categories || {};
    Object.entries(ratios).forEach(([key, data]) => {
      const cat = (data && data.category) || categories[key] || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ key, ...data });
    });
    return groups;
  }, [analysis]);

  /* ── Sorted alerts ── */
  const sortedAlerts = useMemo(() => {
    if (!analysis || !analysis.alerts) return [];
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return [...analysis.alerts].sort((a, b) => {
      return (order[(a.severity || "").toLowerCase()] || 5) - (order[(b.severity || "").toLowerCase()] || 5);
    });
  }, [analysis]);

  /* ───────────────────── Render helpers ───────────────────── */

  function renderHealthCircle() {
    const hs = analysis?.overallHealthScore;
    if (!hs) return null;
    const circleSize = 120;
    const color = hs.color || gradeColor(hs.grade);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
        <div style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          border: `4px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: color + "15",
          flexShrink: 0
        }}>
          <div style={{ fontSize: "32px", fontWeight: 800, color }}>{hs.grade || "--"}</div>
          <div style={{ fontSize: "12px", color: COLORS.dim }}>{hs.score != null ? hs.score + "/100" : ""}</div>
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>
            {hs.label || "Financial Health"}
          </div>
          {hs.factors && hs.factors.length > 0 && (
            <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 18px", color: COLORS.dim, fontSize: "12px", lineHeight: "1.8" }}>
              {hs.factors.slice(0, 4).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </div>
      </div>
    );
  }

  function renderAlertBadges() {
    return (
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {["critical", "high", "medium"].map((sev) => (
          <div key={sev} style={{
            padding: "8px 14px",
            borderRadius: "6px",
            background: SEVERITY_COLORS[sev] + "15",
            border: `1px solid ${SEVERITY_COLORS[sev]}40`,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "18px", fontWeight: 700, color: SEVERITY_COLORS[sev] }}>
              {alertCounts[sev]}
            </span>
            <span style={{ fontSize: "11px", color: COLORS.dim, textTransform: "uppercase", fontWeight: 600 }}>
              {sev}
            </span>
          </div>
        ))}
      </div>
    );
  }

  function renderBenchmarkBar(value, min, median, max, color) {
    const range = max - min || 1;
    const pos = Math.max(0, Math.min(100, ((value - min) / range) * 100));
    const medianPos = Math.max(0, Math.min(100, ((median - min) / range) * 100));
    return (
      <div style={{ position: "relative", height: "8px", background: COLORS.border, borderRadius: "4px", marginTop: "6px" }}>
        <div style={{
          position: "absolute",
          left: medianPos + "%",
          top: "-3px",
          width: "2px",
          height: "14px",
          background: COLORS.dim,
          borderRadius: "1px"
        }} />
        <div style={{
          position: "absolute",
          left: Math.max(0, pos - 3) + "%",
          top: "-2px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: color || COLORS.blue,
          border: "2px solid " + COLORS.text
        }} />
      </div>
    );
  }

  /* ═════════════════════ TAB RENDERERS ═════════════════════ */

  /* ── 1. Overview Tab ── */
  function renderOverview() {
    if (!analysis) return <div style={styles.emptyState}>No financial data loaded.</div>;

    const keyMetrics = [
      { label: "Current Ratio", value: analysis.ratios?.currentRatio?.value, unit: "x", color: COLORS.blue },
      { label: "Gross Margin", value: analysis.ratios?.grossMargin?.value, unit: "%", color: COLORS.green },
      { label: "Return on Equity", value: analysis.ratios?.returnOnEquity?.value, unit: "%", color: COLORS.purple },
      { label: "Altman Z-Score", value: analysis.ratios?.altmanZScore?.value, unit: "", color: COLORS.accent }
    ];

    return (
      <div>
        {/* Entity info bar */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "20px", flexWrap: "wrap", fontSize: "12px", color: COLORS.dim }}>
          {entityName && <span><strong style={{ color: COLORS.text }}>Entity:</strong> {entityName}</span>}
          <span><strong style={{ color: COLORS.text }}>Type:</strong> {entityType.toUpperCase()}</span>
          {sector !== "general" && <span><strong style={{ color: COLORS.text }}>Sector:</strong> {sector}</span>}
          {sicCode && <span><strong style={{ color: COLORS.text }}>SIC:</strong> {sicCode}</span>}
        </div>

        {renderHealthCircle()}
        {renderAlertBadges()}

        {/* Key metrics cards */}
        <h4 style={styles.sectionTitle}>Key Metrics</h4>
        <div style={styles.grid4}>
          {keyMetrics.map((m, i) => (
            <div key={i} style={{
              ...styles.card,
              borderLeft: `3px solid ${m.color}`
            }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: m.color, marginBottom: "4px" }}>
                {formatRatioValue(m.value, m.unit)}
              </div>
              <div style={{ fontSize: "12px", color: COLORS.dim }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Audit focus areas */}
        {analysis.auditFocusAreas && analysis.auditFocusAreas.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            <h4 style={styles.sectionTitle}>Audit Focus Areas</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {analysis.auditFocusAreas.map((area, i) => (
                <span key={i} style={{
                  padding: "6px 12px",
                  background: COLORS.accent + "20",
                  border: `1px solid ${COLORS.accent}50`,
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: COLORS.accent,
                  fontWeight: 500
                }}>
                  {typeof area === "string" ? area : area.area || area.name || JSON.stringify(area)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── 2. Ratios Tab ── */
  function renderRatios() {
    if (!analysis || !analysis.ratios) return <div style={styles.emptyState}>No ratios computed.</div>;

    const categoryOrder = ["Profitability", "Liquidity", "Solvency", "Efficiency", "Cash Flow", "Investor"];
    const sortedCategories = Object.keys(groupedRatios).sort((a, b) => {
      const ai = categoryOrder.indexOf(a);
      const bi = categoryOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    return (
      <div>
        {ratioSet && ratioSet.label && (
          <p style={{ margin: "0 0 20px 0", fontSize: "12px", color: COLORS.dim }}>
            Ratio set: <strong style={{ color: COLORS.text }}>{ratioSet.label}</strong>
          </p>
        )}

        {sortedCategories.map((cat) => (
          <div key={cat} style={{ marginBottom: "28px" }}>
            <h4 style={{ ...styles.sectionTitle, color: COLORS.blue, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "8px" }}>
              {cat}
            </h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ratio</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Value</th>
                  <th style={{ ...styles.th, width: "200px" }}>Benchmark Position</th>
                </tr>
              </thead>
              <tbody>
                {groupedRatios[cat].map((r) => {
                  const position = (r.position || "").toLowerCase().replace(/\s+/g, "_");
                  const posColor = POSITION_COLORS[position] || COLORS.dim;
                  const barWidth = r.score != null ? Math.min(100, Math.max(5, r.score)) : 50;
                  return (
                    <tr key={r.key}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500 }}>{r.name || r.key}</div>
                        {r.formula && (
                          <div style={{ fontSize: "10px", color: COLORS.faint, marginTop: "2px" }} title={r.formula}>
                            {r.formula}
                          </div>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                        {formatRatioValue(r.value, r.unit)}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "6px", background: COLORS.border, borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: barWidth + "%", height: "100%", background: posColor, borderRadius: "3px", transition: "width 0.4s ease" }} />
                          </div>
                          <span style={{ fontSize: "10px", color: posColor, fontWeight: 600, textTransform: "uppercase", minWidth: "60px", textAlign: "right" }}>
                            {(r.position || "").replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  /* ── 3. Health & Alerts Tab ── */
  function renderAlerts() {
    if (!sortedAlerts.length) return <div style={styles.emptyState}>No alerts generated.</div>;

    const grouped = {};
    sortedAlerts.forEach((a) => {
      const sev = (a.severity || "info").toLowerCase();
      if (!grouped[sev]) grouped[sev] = [];
      grouped[sev].push(a);
    });

    const severityOrder = ["critical", "high", "medium", "low", "info"];

    return (
      <div>
        {renderAlertBadges()}

        {severityOrder.map((sev) => {
          const items = grouped[sev];
          if (!items || items.length === 0) return null;
          const color = SEVERITY_COLORS[sev] || COLORS.dim;

          return (
            <div key={sev} style={{ marginBottom: "24px" }}>
              <h4 style={{ ...styles.sectionTitle, color }}>
                {sev.charAt(0).toUpperCase() + sev.slice(1)} ({items.length})
              </h4>
              {items.map((alert, i) => (
                <div key={i} style={{
                  ...styles.card,
                  borderLeft: `3px solid ${color}`,
                  marginBottom: "10px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 600, fontSize: "13px" }}>
                      {alert.message || alert.title || alert.description || "Alert"}
                    </div>
                    <span style={styles.badge(color)}>{sev.toUpperCase()}</span>
                  </div>
                  {alert.isaReference && (
                    <div style={{ fontSize: "11px", color: COLORS.blue, marginBottom: "4px" }}>
                      ISA Ref: {alert.isaReference}
                    </div>
                  )}
                  {alert.recommendedAction && (
                    <div style={{ fontSize: "12px", color: COLORS.dim, marginTop: "6px" }}>
                      <strong style={{ color: COLORS.text }}>Action:</strong> {alert.recommendedAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  /* ── 4. Going Concern Tab ── */
  function renderGoingConcern() {
    const indicators = analysis?.goingConcernIndicators;
    if (!indicators || indicators.length === 0) {
      return <div style={styles.emptyState}>No going concern indicators identified. This is a positive sign.</div>;
    }

    return (
      <div>
        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: COLORS.dim }}>
          ISA 570 Going Concern Assessment - {indicators.length} indicator{indicators.length !== 1 ? "s" : ""} identified
        </p>

        {indicators.map((ind, i) => {
          const sev = (ind.severity || "medium").toLowerCase();
          const color = SEVERITY_COLORS[sev] || COLORS.orange;
          return (
            <div key={i} style={{
              ...styles.card,
              borderLeft: `3px solid ${color}`,
              marginBottom: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ fontWeight: 600, fontSize: "13px", flex: 1 }}>
                  {ind.indicator || ind.description || ind.title || "Indicator"}
                </div>
                <span style={styles.badge(color)}>{sev.toUpperCase()}</span>
              </div>
              {ind.isaReference && (
                <div style={{ fontSize: "11px", color: COLORS.blue, marginBottom: "6px" }}>
                  {ind.isaReference}
                </div>
              )}
              {ind.auditAction && (
                <div style={{ fontSize: "12px", color: COLORS.dim }}>
                  <strong style={{ color: COLORS.green }}>Audit Action:</strong> {ind.auditAction}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ── 5. Benchmarking Tab ── */
  function renderBenchmarking() {
    if (!benchmark) return <div style={styles.emptyState}>Benchmarking data not available for this entity type or sector.</div>;

    const comparisons = benchmark.comparison || [];

    return (
      <div>
        <div style={{ display: "flex", gap: "24px", marginBottom: "20px", fontSize: "12px", color: COLORS.dim }}>
          <span><strong style={{ color: COLORS.text }}>Sector:</strong> {benchmark.sectorName || benchmark.sector || "--"}</span>
          <span><strong style={{ color: COLORS.text }}>Sample Size:</strong> {benchmark.sampleSize || "--"}</span>
        </div>

        {comparisons.length === 0 ? (
          <div style={styles.emptyState}>No comparison data available.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ratio</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Entity</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Sector Median</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Deviation</th>
                <th style={{ ...styles.th, width: "180px" }}>Position</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => {
                const dev = c.deviation ?? c.deviationPercent;
                const devColor = dev == null ? COLORS.dim : dev >= 0 ? COLORS.green : COLORS.red;
                const entityVal = c.entityValue ?? c.value;
                const medianVal = c.sectorMedian ?? c.median;
                const minVal = c.sectorMin ?? c.min ?? 0;
                const maxVal = c.sectorMax ?? c.max ?? (medianVal ? medianVal * 2 : 100);
                const posColor = POSITION_COLORS[(c.position || "").toLowerCase().replace(/\s+/g, "_")] || COLORS.blue;

                return (
                  <tr key={i}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{c.name || c.ratio || c.key || "--"}</div>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {formatRatioValue(entityVal, c.unit)}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", color: COLORS.dim, fontVariantNumeric: "tabular-nums" }}>
                      {formatRatioValue(medianVal, c.unit)}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", color: devColor, fontWeight: 600 }}>
                      {dev != null ? (dev >= 0 ? "+" : "") + dev.toFixed(1) + "%" : "--"}
                    </td>
                    <td style={styles.td}>
                      {renderBenchmarkBar(entityVal || 0, minVal, medianVal || 0, maxVal, posColor)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  /* ── 6. Trends Tab ── */
  function renderTrends() {
    if (!priorYearData) {
      return <div style={styles.emptyState}>Prior year data not provided. Trend analysis requires comparative data.</div>;
    }

    const trends = analysis?.trendAnalysis;
    if (!trends || (Array.isArray(trends) && trends.length === 0)) {
      return <div style={styles.emptyState}>No trend data computed.</div>;
    }

    const trendList = Array.isArray(trends) ? trends : Object.entries(trends).map(([key, t]) => ({ key, ...t }));

    function directionArrow(direction) {
      const d = (direction || "").toLowerCase();
      if (d === "improving" || d === "up") return { symbol: "\u2191", color: COLORS.green };
      if (d === "deteriorating" || d === "down") return { symbol: "\u2193", color: COLORS.red };
      return { symbol: "\u2192", color: COLORS.dim };
    }

    return (
      <div>
        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: COLORS.dim }}>
          Year-on-year comparison with prior period
        </p>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ratio</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Prior Year</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Current Year</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Change %</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Direction</th>
              <th style={styles.th}>Materiality</th>
              <th style={styles.th}>Audit Implication</th>
            </tr>
          </thead>
          <tbody>
            {trendList.map((t, i) => {
              const changeVal = t.changePercent ?? t.change;
              const arrow = directionArrow(t.direction);
              const materialColor = t.materialityFlag || t.material ? COLORS.red : COLORS.dim;

              return (
                <tr key={i}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>{t.name || t.ratio || t.key || "--"}</div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", color: COLORS.dim, fontVariantNumeric: "tabular-nums" }}>
                    {formatRatioValue(t.priorValue ?? t.prior, t.unit)}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {formatRatioValue(t.currentValue ?? t.current, t.unit)}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", color: changeVal >= 0 ? COLORS.green : COLORS.red, fontWeight: 600 }}>
                    {changeVal != null ? (changeVal >= 0 ? "+" : "") + changeVal.toFixed(1) + "%" : "--"}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center", fontSize: "18px", color: arrow.color }}>
                    {arrow.symbol}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge(materialColor),
                      ...(!(t.materialityFlag || t.material) && { opacity: 0.5 })
                    }}>
                      {(t.materialityFlag || t.material) ? "MATERIAL" : "Immaterial"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontSize: "12px", color: COLORS.dim, maxWidth: "200px" }}>
                    {t.auditImplication || t.implication || "--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── 7. DuPont Tab ── */
  function renderDuPont() {
    if (!dupont) return <div style={styles.emptyState}>DuPont analysis not available.</div>;

    const { threeWay, fiveWay, interpretation } = dupont;

    function renderComponent(label, value, formula, color) {
      return (
        <div style={{
          ...styles.card,
          borderTop: `3px solid ${color}`,
          textAlign: "center",
          minWidth: "140px",
          flex: "1 1 140px"
        }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color, marginBottom: "4px" }}>
            {value != null ? (typeof value === "number" ? value.toFixed(3) : value) : "--"}
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>{label}</div>
          {formula && <div style={{ fontSize: "10px", color: COLORS.faint }}>{formula}</div>}
        </div>
      );
    }

    function renderConnector(symbol) {
      return (
        <div style={{ display: "flex", alignItems: "center", padding: "0 4px", fontSize: "18px", color: COLORS.faint, fontWeight: 700 }}>
          {symbol}
        </div>
      );
    }

    return (
      <div>
        {/* 3-Way Decomposition */}
        <h4 style={styles.sectionTitle}>3-Way DuPont Decomposition</h4>
        <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: COLORS.dim }}>
          ROE = Net Profit Margin x Asset Turnover x Equity Multiplier
        </p>
        {threeWay && (
          <div style={{ display: "flex", alignItems: "stretch", gap: "0", flexWrap: "wrap", marginBottom: "32px", justifyContent: "center" }}>
            {renderComponent("Net Profit Margin", threeWay.netProfitMargin, "Net Income / Revenue", COLORS.green)}
            {renderConnector("\u00D7")}
            {renderComponent("Asset Turnover", threeWay.assetTurnover, "Revenue / Total Assets", COLORS.blue)}
            {renderConnector("\u00D7")}
            {renderComponent("Equity Multiplier", threeWay.equityMultiplier, "Total Assets / Equity", COLORS.purple)}
            {renderConnector("=")}
            {renderComponent("ROE", threeWay.roe, "Return on Equity", COLORS.accent)}
          </div>
        )}

        {/* 5-Way Decomposition */}
        <h4 style={styles.sectionTitle}>5-Way DuPont Decomposition</h4>
        <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: COLORS.dim }}>
          ROE = Tax Burden x Interest Burden x Operating Margin x Asset Turnover x Equity Multiplier
        </p>
        {fiveWay && (
          <div style={{ display: "flex", alignItems: "stretch", gap: "0", flexWrap: "wrap", marginBottom: "24px", justifyContent: "center" }}>
            {renderComponent("Tax Burden", fiveWay.taxBurden, "Net Income / EBT", COLORS.red)}
            {renderConnector("\u00D7")}
            {renderComponent("Interest Burden", fiveWay.interestBurden, "EBT / EBIT", COLORS.orange)}
            {renderConnector("\u00D7")}
            {renderComponent("Operating Margin", fiveWay.operatingMargin, "EBIT / Revenue", COLORS.green)}
            {renderConnector("\u00D7")}
            {renderComponent("Asset Turnover", fiveWay.assetTurnover, "Revenue / Assets", COLORS.blue)}
            {renderConnector("\u00D7")}
            {renderComponent("Equity Multiplier", fiveWay.equityMultiplier, "Assets / Equity", COLORS.purple)}
          </div>
        )}

        {/* Interpretation */}
        {interpretation && (
          <div style={{
            ...styles.card,
            borderLeft: `3px solid ${COLORS.blue}`,
            marginTop: "16px"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: COLORS.blue }}>Interpretation</h4>
            {typeof interpretation === "string" ? (
              <p style={{ margin: 0, fontSize: "13px", color: COLORS.dim, lineHeight: "1.6" }}>{interpretation}</p>
            ) : (
              <ul style={{ margin: 0, padding: "0 0 0 18px", color: COLORS.dim, fontSize: "13px", lineHeight: "1.8" }}>
                {(Array.isArray(interpretation) ? interpretation : Object.values(interpretation)).map((line, i) => (
                  <li key={i}>{typeof line === "string" ? line : JSON.stringify(line)}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ═════════════════════ TAB ROUTER ═════════════════════ */

  function renderActiveTab() {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "ratios": return renderRatios();
      case "alerts": return renderAlerts();
      case "goingConcern": return renderGoingConcern();
      case "benchmarking": return renderBenchmarking();
      case "trends": return renderTrends();
      case "dupont": return renderDuPont();
      default: return renderOverview();
    }
  }

  /* ═════════════════════ MAIN RENDER ═════════════════════ */

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Financial Ratio Analysis</h3>
        <p style={styles.subtitle}>
          {entityName || "Entity"} &mdash; {(entityType || "private").toUpperCase()} &mdash; Comprehensive ISA Financial Health Assessment
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          padding: "12px 16px",
          background: COLORS.red + "15",
          border: `1px solid ${COLORS.red}40`,
          borderRadius: "6px",
          color: COLORS.red,
          fontSize: "13px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      {/* Tab navigation */}
      <div style={styles.tabBar}>
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabStyle(activeTab === tab, COLORS.blue)}
          >
            {TAB_LABELS[tab] || tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default FinancialAnalysisDashboard;
