/**
 * GLOBAL AUDIT STATE MANAGEMENT
 * Central context for managing audit platform state
 * Coordinates all services and components
 */

import React, { createContext, useContext, useReducer, useCallback } from "react";
import auditService from "../services/auditPlatformService";

const AuditContext = createContext();

// Action types
export const ACTIONS = {
  // Authentication
  SET_USER: "SET_USER",
  SET_AUTH_TOKEN: "SET_AUTH_TOKEN",
  LOGOUT: "LOGOUT",

  // Engagement
  SET_CURRENT_ENGAGEMENT: "SET_CURRENT_ENGAGEMENT",
  UPDATE_ENGAGEMENT_STATUS: "UPDATE_ENGAGEMENT_STATUS",
  CLEAR_ENGAGEMENT: "CLEAR_ENGAGEMENT",

  // Data
  SET_JURISDICTIONS: "SET_JURISDICTIONS",
  SET_PROCEDURES: "SET_PROCEDURES",
  SET_EVIDENCE: "SET_EVIDENCE",
  SET_FINDINGS: "SET_FINDINGS",
  SET_MATERIALITY: "SET_MATERIALITY",
  SET_RISK_ASSESSMENTS: "SET_RISK_ASSESSMENTS",

  // UI State
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_SYNC_STATUS: "SET_SYNC_STATUS",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Notifications
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION"
};

// Initial state
const initialState = {
  // Auth
  user: null,
  authToken: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),

  // Engagement
  currentEngagement: null,
  engagements: [],

  // Data
  jurisdictions: [],
  procedures: [],
  evidence: [],
  findings: [],
  materiality: null,
  riskAssessments: [],

  // UI
  isLoading: false,
  error: null,
  syncStatus: "idle", // idle, syncing, synced, error

  // Notifications
  notifications: [] // { id, type, message, duration }
};

// Reducer
function auditReducer(state, action) {
  switch (action.type) {
    // Auth actions
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload, isAuthenticated: true };

    case ACTIONS.SET_AUTH_TOKEN:
      return { ...state, authToken: action.payload };

    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        authToken: null,
        isAuthenticated: false
      };

    // Engagement actions
    case ACTIONS.SET_CURRENT_ENGAGEMENT:
      return { ...state, currentEngagement: action.payload };

    case ACTIONS.UPDATE_ENGAGEMENT_STATUS:
      if (state.currentEngagement?.id === action.payload.id) {
        return {
          ...state,
          currentEngagement: {
            ...state.currentEngagement,
            status: action.payload.status
          }
        };
      }
      return state;

    case ACTIONS.CLEAR_ENGAGEMENT:
      return { ...state, currentEngagement: null };

    // Data actions
    case ACTIONS.SET_JURISDICTIONS:
      return { ...state, jurisdictions: action.payload };

    case ACTIONS.SET_PROCEDURES:
      return { ...state, procedures: action.payload };

    case ACTIONS.SET_EVIDENCE:
      return { ...state, evidence: action.payload };

    case ACTIONS.SET_FINDINGS:
      return { ...state, findings: action.payload };

    case ACTIONS.SET_MATERIALITY:
      return { ...state, materiality: action.payload };

    case ACTIONS.SET_RISK_ASSESSMENTS:
      return { ...state, riskAssessments: action.payload };

    // UI actions
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_SYNC_STATUS:
      return { ...state, syncStatus: action.payload };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    // Notification actions
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          n => n.id !== action.payload
        )
      };

    default:
      return state;
  }
}

// Provider component
export function AuditProvider({ children }) {
  const [state, dispatch] = useReducer(auditReducer, initialState);

  // Setup service event listeners
  React.useEffect(() => {
    const handleUserUpdated = (user) => {
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    };

    const handleEngagementLoaded = (engagement) => {
      dispatch({
        type: ACTIONS.SET_CURRENT_ENGAGEMENT,
        payload: engagement
      });
    };

    const handleProceduresLoaded = (procedures) => {
      dispatch({ type: ACTIONS.SET_PROCEDURES, payload: procedures });
    };

    const handleEvidenceLoaded = (evidence) => {
      dispatch({ type: ACTIONS.SET_EVIDENCE, payload: evidence });
    };

    const handleFindingsLoaded = (findings) => {
      dispatch({ type: ACTIONS.SET_FINDINGS, payload: findings });
    };

    const handleMaterialityLoaded = (materiality) => {
      dispatch({ type: ACTIONS.SET_MATERIALITY, payload: materiality });
    };

    const handleSyncStarted = () => {
      dispatch({ type: ACTIONS.SET_SYNC_STATUS, payload: "syncing" });
    };

    const handleSyncComplete = () => {
      dispatch({ type: ACTIONS.SET_SYNC_STATUS, payload: "synced" });
    };

    const handleError = (error) => {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: error.message || "An error occurred"
      });
    };

    auditService.on("user-updated", handleUserUpdated);
    auditService.on("engagement-loaded", handleEngagementLoaded);
    auditService.on("procedures-loaded", handleProceduresLoaded);
    auditService.on("evidence-loaded", handleEvidenceLoaded);
    auditService.on("findings-loaded", handleFindingsLoaded);
    auditService.on("materiality-loaded", handleMaterialityLoaded);
    auditService.on("sync-started", handleSyncStarted);
    auditService.on("sync-complete", handleSyncComplete);
    auditService.on("error", handleError);

    return () => {
      auditService.removeListener("user-updated", handleUserUpdated);
      auditService.removeListener("engagement-loaded", handleEngagementLoaded);
      auditService.removeListener("procedures-loaded", handleProceduresLoaded);
      auditService.removeListener("evidence-loaded", handleEvidenceLoaded);
      auditService.removeListener("findings-loaded", handleFindingsLoaded);
      auditService.removeListener("materiality-loaded", handleMaterialityLoaded);
      auditService.removeListener("sync-started", handleSyncStarted);
      auditService.removeListener("sync-complete", handleSyncComplete);
      auditService.removeListener("error", handleError);
    };
  }, []);

  // Context value with actions
  const value = {
    // State
    state,
    dispatch,

    // Auth actions
    setAuthToken: useCallback(
      (token) => {
        dispatch({ type: ACTIONS.SET_AUTH_TOKEN, payload: token });
        auditService.setAuthToken(token);
      },
      []
    ),

    logout: useCallback(() => {
      dispatch({ type: ACTIONS.LOGOUT });
      localStorage.removeItem("authToken");
    }, []),

    // Engagement actions
    loadEngagement: useCallback(
      (engagementId) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        return auditService.loadEngagement(engagementId);
      },
      []
    ),

    createEngagement: useCallback((data) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      return auditService.createEngagement(data);
    }, []),

    updateEngagementStatus: useCallback((engagementId, status) => {
      return auditService.updateEngagementStatus(engagementId, status);
    }, []),

    // Procedure actions
    updateProcedureStatus: useCallback((procedureId, status, percent) => {
      return auditService.updateProcedureStatus(procedureId, status, percent);
    }, []),

    // Evidence actions
    uploadEvidence: useCallback((procedureId, file, metadata) => {
      return auditService.uploadEvidence(procedureId, file, metadata);
    }, []),

    reviewEvidence: useCallback((evidenceId, status, notes) => {
      return auditService.reviewEvidence(evidenceId, status, notes);
    }, []),

    // Finding actions
    createFinding: useCallback((data) => {
      return auditService.createFinding(data);
    }, []),

    // Risk actions
    createRiskAssessment: useCallback((fsli, risks) => {
      return auditService.createRiskAssessment(fsli, risks);
    }, []),

    // Utility actions
    addNotification: useCallback((type, message, duration = 3000) => {
      const id = Date.now();
      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,
        payload: { id, type, message, duration }
      });

      if (duration) {
        setTimeout(() => {
          dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
        }, duration);
      }

      return id;
    }, []),

    removeNotification: useCallback((id) => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
    }, []),

    clearError: useCallback(() => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    }, [])
  };

  return (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
  );
}

// Custom hook
export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within AuditProvider");
  }
  return context;
}

export default AuditContext;
