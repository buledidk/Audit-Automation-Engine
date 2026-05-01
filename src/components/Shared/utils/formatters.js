// ═══ Shared Formatters — extracted from AuditEngine_AURA.jsx ═══

export const formatCurrency = (value, symbol = "£") => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === null || num === undefined) return symbol + "0";
  return symbol + Math.round(num).toLocaleString();
};

export const formatDate = (isoString) => {
  if (!isoString) return "";
  return isoString.slice(0, 10);
};

export const formatPct = (value, decimals = 1) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === null || num === undefined) return "0%";
  return num.toFixed(decimals) + "%";
};

export const formatSignOff = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val; // legacy date-only format
  return val.name + " (" + val.date + ")";
};

export const sanitizeFilename = (name) =>
  (name || "").replace(/[^a-zA-Z0-9]/g, "_");
