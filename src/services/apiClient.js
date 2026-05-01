/**
 * UNIFIED API CLIENT SERVICE
 * Centralized API communication for all frontend components
 * Handles authentication, error handling, and data transformation
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add Supabase JWT to requests
api.interceptors.request.use(async (config) => {
  // Try Supabase session first, fall back to legacy token
  try {
    const { getSession } = await import('../lib/supabaseClient.js');
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      return config;
    }
  } catch (e) {
    // Supabase not available, fall back
  }
  // Legacy fallback
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear both legacy and Supabase tokens
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      try {
        const { signOut } = await import('../lib/supabaseClient.js');
        await signOut();
      } catch (e) {
        // Ignore if Supabase not configured
      }
      window.location.href = "/login";
    }
    throw error.response?.data || { error: "Network error" };
  }
);

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const auth = {
  login: async (email, password) => {
    // Try Supabase auth first
    try {
      const { signIn } = await import('../lib/supabaseClient.js');
      const data = await signIn(email, password);
      if (data?.session) {
        return { success: true, token: data.session.access_token, user: data.user };
      }
    } catch (e) {
      // Fall back to server auth if Supabase auth fails
      console.warn('Supabase auth failed, trying server auth:', e.message);
    }
    return api.post("/api/auth/login", { email, password });
  },
  logout: async () => {
    try {
      const { signOut } = await import('../lib/supabaseClient.js');
      await signOut();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
  },
  getCurrentUser: () =>
    api.get("/api/users/me")
};

// ============================================================================
// ENGAGEMENTS
// ============================================================================
export const engagements = {
  create: (data) =>
    api.post("/api/engagements", data),
  getById: (id) =>
    api.get(`/api/engagements/${id}`),
  list: (params = {}) =>
    api.get("/api/engagements", { params }),
  updateStatus: (id, status) =>
    api.patch(`/api/engagements/${id}/status`, { status })
};

// ============================================================================
// MATERIALITY
// ============================================================================
export const materiality = {
  calculate: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/materiality`)
};

// ============================================================================
// PROCEDURES
// ============================================================================
export const procedures = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/procedures`),
  update: (id, data) =>
    api.patch(`/api/procedures/${id}`, data)
};

// ============================================================================
// EVIDENCE
// ============================================================================
export const evidence = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/evidence`),
  upload: (engagementId, formData) =>
    api.post(`/api/engagements/${engagementId}/evidence`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  review: (id, data) =>
    api.patch(`/api/evidence/${id}/review`, data)
};

// ============================================================================
// FINDINGS
// ============================================================================
export const findings = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/findings`),
  create: (engagementId, data) =>
    api.post(`/api/engagements/${engagementId}/findings`, data)
};

// ============================================================================
// RISK ASSESSMENTS
// ============================================================================
export const riskAssessments = {
  list: (engagementId) =>
    api.get(`/api/engagements/${engagementId}/risk-assessments`),
  create: (engagementId, data) =>
    api.post(`/api/engagements/${engagementId}/risk-assessments`, data)
};

// ============================================================================
// ORCHESTRATOR - AI AGENTS
// ============================================================================
export const orchestrator = {
  request: (data) =>
    api.post("/api/orchestrator/request", data),
  fullAnalysis: (data) =>
    api.post("/api/orchestrator/full-analysis", data),
  exceptionHandling: (data) =>
    api.post("/api/orchestrator/exception-handling", data),
  riskAssessmentSuite: (data) =>
    api.post("/api/orchestrator/risk-assessment", data),
  getStatus: () =>
    api.get("/api/orchestrator/status"),
  getMetrics: () =>
    api.get("/api/orchestrator/metrics")
};

// ============================================================================
// JURISDICTIONS
// ============================================================================
export const jurisdictions = {
  list: () =>
    api.get("/api/jurisdictions"),
  getByCode: (code) =>
    api.get(`/api/jurisdictions/${code}`)
};

export default api;
