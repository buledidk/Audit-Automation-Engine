// ═══════════════════════════════════════════════════════════════
// STORAGEENGINE — localStorage Persistence & Engagement Management
// AuditEngine v10 AURA
// Write-through: localStorage (instant) + Supabase (async cloud sync)
// ═══════════════════════════════════════════════════════════════

import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_PREFIX = "ae_";
const QUOTA_WARNING_BYTES = 4 * 1024 * 1024; // 4MB warning threshold
const DEBOUNCE_MS = 1500;

const STATE_KEYS = ["cfg", "cellData", "signOffs", "wpNotes", "customItems", "tbData", "tbMappings", "uploads", "archived", "reviewStatus", "integrations", "signOffLog", "reviewNotes", "documentLinks", "changeLog"];

const MAX_NAME_LENGTH = 200;
const MAX_IMPORT_SIZE = 50 * 1024 * 1024; // 50MB

function sanitizeName(name) {
  if (typeof name !== "string") return "Unnamed";
  return name.trim().slice(0, MAX_NAME_LENGTH) || "Unnamed";
}

const debounceTimers = {};

function storageKey(engagementId, key) {
  return `${STORAGE_PREFIX}${engagementId}_${key}`;
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("StorageEngine: quota exceeded or write failed", e);
    return false;
  }
}

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("StorageEngine: parse error for key", key, e);
    return null;
  }
}

// Fire-and-forget Supabase upsert for a single state key
function cloudUpsert(engagementId, stateKey, data) {
  if (!isSupabaseConfigured()) return;
  supabase.from('engagement_data').upsert(
    { engagement_id: engagementId, state_key: stateKey, data, updated_at: new Date().toISOString() },
    { onConflict: 'engagement_id,state_key' }
  ).then(null, e => console.warn('Supabase sync:', e));
}

export function createStorageEngine(engagementId) {
  if (!engagementId) throw new Error("engagementId required");

  const save = (key, value) => {
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(() => {
      safeSet(storageKey(engagementId, key), value);
      cloudUpsert(engagementId, key, value);
    }, DEBOUNCE_MS);
  };

  const saveImmediate = (key, value) => {
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
    safeSet(storageKey(engagementId, key), value);
    cloudUpsert(engagementId, key, value);
  };

  const load = (key) => {
    return safeGet(storageKey(engagementId, key));
  };

  const loadAll = () => {
    const state = {};
    STATE_KEYS.forEach(key => {
      const val = load(key);
      if (val !== null) state[key] = val;
    });
    return state;
  };

  const clear = () => {
    STATE_KEYS.forEach(key => {
      localStorage.removeItem(storageKey(engagementId, key));
    });
    if (isSupabaseConfigured()) {
      supabase.from('engagement_data').delete()
        .eq('engagement_id', engagementId)
        .then(null, e => console.warn('Supabase clear:', e));
    }
  };

  const syncFromCloud = async () => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('engagement_data')
        .select('state_key, data')
        .eq('engagement_id', engagementId);
      if (error) { console.warn('Supabase syncFromCloud:', error); return null; }
      if (!data || data.length === 0) return null;
      const cloud = {};
      data.forEach(row => {
        cloud[row.state_key] = row.data;
        // Update localStorage cache with cloud data
        safeSet(storageKey(engagementId, row.state_key), row.data);
      });
      return cloud;
    } catch (e) {
      console.warn('Supabase syncFromCloud:', e);
      return null;
    }
  };

  const getUsageBytes = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(storageKey(engagementId, ""))) {
        total += k.length + (localStorage.getItem(k) || "").length;
      }
    }
    return total * 2; // UTF-16
  };

  const isNearQuota = () => {
    return getUsageBytes() > QUOTA_WARNING_BYTES;
  };

  return { save, saveImmediate, load, loadAll, clear, syncFromCloud, getUsageBytes, isNearQuota };
}

export function listEngagements() {
  const engagements = safeGet(STORAGE_PREFIX + "engagements") || [];
  return engagements;
}

function saveEngagementList(list) {
  safeSet(STORAGE_PREFIX + "engagements", list);
}

export function createEngagement(name) {
  const safeName = sanitizeName(name);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const now = new Date().toISOString();
  const engagements = listEngagements();
  engagements.push({ id, name: safeName, createdAt: now, updatedAt: now });
  saveEngagementList(engagements);
  if (isSupabaseConfigured()) {
    supabase.from('engagements').insert({ id, name: safeName, created_at: now, updated_at: now })
      .then(null, e => console.warn('Supabase createEngagement:', e));
  }
  return id;
}

export function deleteEngagement(engagementId) {
  const engine = createStorageEngine(engagementId);
  engine.clear();
  const engagements = listEngagements().filter(e => e.id !== engagementId);
  saveEngagementList(engagements);
  if (isSupabaseConfigured()) {
    supabase.from('engagements').delete().eq('id', engagementId)
      .then(null, e => console.warn('Supabase deleteEngagement:', e));
  }
}

export function renameEngagement(engagementId, newName) {
  const safeName = sanitizeName(newName);
  const engagements = listEngagements();
  const eng = engagements.find(e => e.id === engagementId);
  if (eng) {
    eng.name = safeName;
    eng.updatedAt = new Date().toISOString();
    saveEngagementList(engagements);
    if (isSupabaseConfigured()) {
      supabase.from('engagements').update({ name: safeName, updated_at: eng.updatedAt })
        .eq('id', engagementId)
        .then(null, e => console.warn('Supabase renameEngagement:', e));
    }
  }
}

export function exportEngagement(engagementId) {
  const engine = createStorageEngine(engagementId);
  const data = engine.loadAll();
  const meta = listEngagements().find(e => e.id === engagementId);
  return { meta, data, exportedAt: new Date().toISOString(), version: "AuditEngine v10 AURA" };
}

export function importEngagement(json) {
  if (typeof json === "string" && json.length > MAX_IMPORT_SIZE) {
    throw new Error("Import file too large (max 50MB)");
  }
  let parsed;
  if (typeof json === "string") {
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error("Invalid JSON format");
    }
  } else {
    parsed = json;
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid engagement data");
  }
  const name = sanitizeName(parsed.meta?.name || "Imported Engagement") + " (imported)";
  const id = createEngagement(name);
  const engine = createStorageEngine(id);
  if (parsed.data && typeof parsed.data === "object") {
    STATE_KEYS.forEach(key => {
      if (parsed.data[key] !== undefined) {
        engine.saveImmediate(key, parsed.data[key]);
      }
    });
  }
  return id;
}

export async function syncEngagementList() {
  if (!isSupabaseConfigured()) return listEngagements();
  try {
    const { data, error } = await supabase.from('engagements').select('*');
    if (error) { console.warn('Supabase syncEngagementList:', error); return listEngagements(); }
    const local = listEngagements();
    const localIds = new Set(local.map(e => e.id));
    // Merge: add any cloud engagements not in localStorage
    let merged = [...local];
    (data || []).forEach(row => {
      if (!localIds.has(row.id)) {
        merged.push({ id: row.id, name: row.name, createdAt: row.created_at, updatedAt: row.updated_at });
      }
    });
    saveEngagementList(merged);
    return merged;
  } catch (e) {
    console.warn('Supabase syncEngagementList:', e);
    return listEngagements();
  }
}

export function getActiveEngagementId() {
  return localStorage.getItem(STORAGE_PREFIX + "activeId") || null;
}

export function setActiveEngagementId(id) {
  if (id) {
    localStorage.setItem(STORAGE_PREFIX + "activeId", id);
  } else {
    localStorage.removeItem(STORAGE_PREFIX + "activeId");
  }
}

export function getTotalUsageBytes() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith(STORAGE_PREFIX)) {
      total += k.length + (localStorage.getItem(k) || "").length;
    }
  }
  return total * 2;
}
