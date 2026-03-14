/**
 * COMPREHENSIVE AUDIT PLATFORM SERVICE
 * Master service coordinating all audit platform operations
 * Integrates: Jurisdiction, Risk, Materiality, Procedures, Evidence
 *
 * PRODUCTION GRADE - All services coordinated here
 */

const axios = require("axios");
const EventEmitter = require("events");

class AuditPlatformService extends EventEmitter {
  constructor(apiBaseUrl = "http://localhost:3001/api") {
    super();
    this.apiBaseUrl = apiBaseUrl;
    this.client = axios.create({
      baseURL: apiBaseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    // State management
    this.state = {
      currentEngagement: null,
      jurisdictions: [],
      frameworks: [],
      procedures: [],
      evidence: [],
      findings: [],
      riskAssessments: [],
      materiality: null,
      user: null,
      organization: null,
      isLoading: false,
      error: null,
      syncStatus: "idle" // idle, syncing, synced, error
    };

    // Cache for performance
    this.cache = {
      jurisdictions: null,
      frameworks: null,
      procedures: null,
      ttl: 3600000 // 1 hour
    };

    // Initialize
    this._setupInterceptors();
    this._setupSyncInterval();
  }

  /**
   * INITIALIZATION
   */

  _setupInterceptors() {
    this.client.interceptors.response.use(
      response => response,
      error => {
        this._handleError(error);
        return Promise.reject(error);
      }
    );
  }

  _setupSyncInterval() {
    // Sync state every 30 seconds
    setInterval(() => {
      if (this.state.currentEngagement) {
        this._syncEngagementState();
      }
    }, 30000);
  }

  /**
   * AUTHENTICATION & USER MANAGEMENT
   */

  async setAuthToken(token) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
    await this.fetchCurrentUser();
  }

  async fetchCurrentUser() {
    try {
      const response = await this.client.get("/users/me");
      this.state.user = response.data.user;
      this.state.organization = response.data.organization;
      this.emit("user-updated", this.state.user);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  /**
   * JURISDICTION OPERATIONS
   */

  async loadJurisdictions() {
    if (this.cache.jurisdictions) {
      this.state.jurisdictions = this.cache.jurisdictions;
      return this.state.jurisdictions;
    }

    try {
      this.state.isLoading = true;
      const response = await this.client.get("/jurisdictions");
      this.state.jurisdictions = response.data.jurisdictions;
      this.cache.jurisdictions = response.data.jurisdictions;
      this.emit("jurisdictions-loaded", this.state.jurisdictions);
      return this.state.jurisdictions;
    } catch (error) {
      this._handleError(error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  async getJurisdictionDetails(code) {
    try {
      const response = await this.client.get(`/jurisdictions/${code}`);
      return response.data.jurisdiction;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * ENGAGEMENT OPERATIONS
   */

  async createEngagement(engagementData) {
    try {
      this.state.isLoading = true;
      this.emit("engagement-creating", engagementData);

      const response = await this.client.post("/engagements", {
        entity_id: engagementData.entityId,
        engagement_type: engagementData.type,
        framework_code: engagementData.framework,
        financial_year_end: engagementData.yearEnd,
        partner_id: engagementData.partnerId,
        manager_id: engagementData.managerId,
        estimated_budget_hours: engagementData.budgetHours
      });

      this.state.currentEngagement = response.data.engagement;

      // Load related data
      await Promise.all([
        this.loadProcedures(),
        this.loadMateriality(),
        this.loadRiskAssessments()
      ]);

      this.emit("engagement-created", this.state.currentEngagement);
      return this.state.currentEngagement;
    } catch (error) {
      this._handleError(error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  async loadEngagement(engagementId) {
    try {
      this.state.isLoading = true;
      const response = await this.client.get(`/engagements/${engagementId}`);

      this.state.currentEngagement = response.data.engagement;

      // Load all related data in parallel
      await Promise.all([
        this.loadProcedures(engagementId),
        this.loadEvidence(engagementId),
        this.loadFindings(engagementId),
        this.loadMateriality(engagementId),
        this.loadRiskAssessments(engagementId)
      ]);

      this.emit("engagement-loaded", this.state.currentEngagement);
      return this.state.currentEngagement;
    } catch (error) {
      this._handleError(error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  async updateEngagementStatus(engagementId, newStatus) {
    try {
      const response = await this.client.patch(
        `/engagements/${engagementId}/status`,
        { status: newStatus }
      );

      this.state.currentEngagement.status = newStatus;
      this.emit("engagement-status-updated", { engagementId, status: newStatus });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * MATERIALITY OPERATIONS
   */

  async loadMateriality(engagementId = null) {
    const targetId = engagementId || this.state.currentEngagement?.id;
    if (!targetId) return null;

    try {
      const response = await this.client.get(
        `/engagements/${targetId}/materiality`
      );

      this.state.materiality = response.data.materiality;
      this.emit("materiality-loaded", this.state.materiality);
      return this.state.materiality;
    } catch (error) {
      console.warn("Error loading materiality:", error);
      return null;
    }
  }

  calculateMaterially(financials) {
    if (!this.state.materiality) return null;

    return {
      overall: this.state.materiality.overall_materiality,
      performance: this.state.materiality.performance_materiality,
      trivial: this.state.materiality.trivial_threshold,
      benchmarks: this.state.materiality.benchmarks
    };
  }

  /**
   * PROCEDURE OPERATIONS
   */

  async loadProcedures(engagementId = null) {
    const targetId = engagementId || this.state.currentEngagement?.id;
    if (!targetId) return [];

    try {
      const response = await this.client.get(
        `/engagements/${targetId}/procedures`
      );

      this.state.procedures = response.data.procedures;
      this.emit("procedures-loaded", this.state.procedures);
      return this.state.procedures;
    } catch (error) {
      console.warn("Error loading procedures:", error);
      return [];
    }
  }

  async updateProcedureStatus(procedureId, status, percentComplete = 0) {
    try {
      const response = await this.client.patch(
        `/procedures/${procedureId}`,
        {
          status: status,
          completion_percentage: percentComplete
        }
      );

      const procedureIndex = this.state.procedures.findIndex(
        p => p.id === procedureId
      );
      if (procedureIndex >= 0) {
        this.state.procedures[procedureIndex] = response.data.procedure;
      }

      this.emit("procedure-updated", response.data.procedure);
      return response.data.procedure;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  getProcedureProgress() {
    const total = this.state.procedures.length;
    const completed = this.state.procedures.filter(
      p => p.status === "completed"
    ).length;
    const inProgress = this.state.procedures.filter(
      p => p.status === "in_progress"
    ).length;

    return {
      total,
      completed,
      inProgress,
      notStarted: total - completed - inProgress,
      percentComplete: Math.round((completed / total) * 100) || 0
    };
  }

  /**
   * RISK ASSESSMENT OPERATIONS
   */

  async loadRiskAssessments(engagementId = null) {
    const targetId = engagementId || this.state.currentEngagement?.id;
    if (!targetId) return [];

    try {
      const response = await this.client.get(
        `/engagements/${targetId}/risk-assessments`
      );

      this.state.riskAssessments = response.data.riskAssessments;
      this.emit("risk-assessments-loaded", this.state.riskAssessments);
      return this.state.riskAssessments;
    } catch (error) {
      console.warn("Error loading risk assessments:", error);
      return [];
    }
  }

  async createRiskAssessment(fsli, risks) {
    const engagementId = this.state.currentEngagement?.id;
    if (!engagementId) throw new Error("No engagement loaded");

    try {
      const response = await this.client.post(
        `/engagements/${engagementId}/risk-assessments`,
        {
          fsli,
          inherent_risk_score: risks.inherentRisk,
          control_risk_score: risks.controlRisk,
          detection_risk_score: risks.detectionRisk,
          risk_factors: risks.factors,
          key_risks: risks.keyRisks,
          significant_risks: risks.significantRisks
        }
      );

      this.state.riskAssessments.push(response.data.riskAssessment);
      this.emit("risk-assessment-created", response.data.riskAssessment);
      return response.data.riskAssessment;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * EVIDENCE OPERATIONS
   */

  async loadEvidence(engagementId = null) {
    const targetId = engagementId || this.state.currentEngagement?.id;
    if (!targetId) return [];

    try {
      const response = await this.client.get(
        `/engagements/${targetId}/evidence`
      );

      this.state.evidence = response.data.evidence;
      this.emit("evidence-loaded", this.state.evidence);
      return this.state.evidence;
    } catch (error) {
      console.warn("Error loading evidence:", error);
      return [];
    }
  }

  async uploadEvidence(procedureId, file, metadata) {
    const engagementId = this.state.currentEngagement?.id;
    if (!engagementId) throw new Error("No engagement loaded");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("procedure_id", procedureId);
      formData.append("description", metadata.description);
      formData.append("evidence_type", metadata.type);

      const response = await this.client.post(
        `/engagements/${engagementId}/evidence`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      this.state.evidence.push(response.data.evidence);
      this.emit("evidence-uploaded", response.data.evidence);
      return response.data.evidence;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  async reviewEvidence(evidenceId, status, notes = "") {
    try {
      const response = await this.client.patch(
        `/evidence/${evidenceId}/review`,
        {
          review_status: status,
          review_notes: notes
        }
      );

      const evidenceIndex = this.state.evidence.findIndex(
        e => e.id === evidenceId
      );
      if (evidenceIndex >= 0) {
        this.state.evidence[evidenceIndex] = response.data.evidence;
      }

      this.emit("evidence-reviewed", response.data.evidence);
      return response.data.evidence;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * FINDINGS OPERATIONS
   */

  async loadFindings(engagementId = null) {
    const targetId = engagementId || this.state.currentEngagement?.id;
    if (!targetId) return [];

    try {
      const response = await this.client.get(
        `/engagements/${targetId}/findings`
      );

      this.state.findings = response.data.findings;
      this.emit("findings-loaded", this.state.findings);
      return this.state.findings;
    } catch (error) {
      console.warn("Error loading findings:", error);
      return [];
    }
  }

  async createFinding(findingData) {
    const engagementId = this.state.currentEngagement?.id;
    if (!engagementId) throw new Error("No engagement loaded");

    try {
      const response = await this.client.post(
        `/engagements/${engagementId}/findings`,
        {
          fsli: findingData.fsli,
          finding_type: findingData.type,
          severity: findingData.severity,
          description: findingData.description,
          impact_amount: findingData.impactAmount,
          root_cause: findingData.rootCause,
          recommendation: findingData.recommendation
        }
      );

      this.state.findings.push(response.data.finding);
      this.emit("finding-created", response.data.finding);
      return response.data.finding;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * SEARCH & FILTER
   */

  searchProcedures(query) {
    return this.state.procedures.filter(p =>
      p.procedure_name.toLowerCase().includes(query.toLowerCase()) ||
      p.fsli.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterFindingsBySeverity(severity) {
    if (!severity) return this.state.findings;
    return this.state.findings.filter(f => f.severity === severity);
  }

  getOpenFindings() {
    return this.state.findings.filter(f => f.status !== "closed");
  }

  getProceduresByStatus(status) {
    return this.state.procedures.filter(p => p.status === status);
  }

  /**
   * ANALYTICS & REPORTING
   */

  getEngagementSummary() {
    const procedures = this.getProcedureProgress();
    const findings = this.state.findings;
    const evidence = this.state.evidence;

    return {
      engagement: this.state.currentEngagement,
      procedures,
      findings: {
        total: findings.length,
        open: findings.filter(f => f.status !== "closed").length,
        byGravity: {
          critical: findings.filter(f => f.severity === "critical").length,
          high: findings.filter(f => f.severity === "high").length,
          medium: findings.filter(f => f.severity === "medium").length,
          low: findings.filter(f => f.severity === "low").length
        }
      },
      evidence: {
        total: evidence.length,
        accepted: evidence.filter(e => e.review_status === "accepted").length,
        pending: evidence.filter(e => e.review_status === "pending").length,
        rejected: evidence.filter(e => e.review_status === "rejected").length
      },
      materiality: this.state.materiality
    };
  }

  /**
   * REAL-TIME SYNCHRONIZATION
   */

  async _syncEngagementState() {
    if (!this.state.currentEngagement?.id) return;

    try {
      this.state.syncStatus = "syncing";
      this.emit("sync-started");

      const engagementId = this.state.currentEngagement.id;
      await Promise.all([
        this.loadEngagement(engagementId),
        this.loadProcedures(engagementId),
        this.loadFindings(engagementId),
        this.loadEvidence(engagementId)
      ]);

      this.state.syncStatus = "synced";
      this.emit("sync-complete");
    } catch (error) {
      this.state.syncStatus = "error";
      this.emit("sync-error", error);
    }
  }

  /**
   * ERROR HANDLING
   */

  _handleError(error) {
    if (error.response?.status === 401) {
      this.emit("auth-error", error);
      localStorage.removeItem("authToken");
    } else if (error.response?.status === 403) {
      this.emit("permission-error", error);
    } else if (error.response?.status >= 500) {
      this.emit("server-error", error);
    } else {
      this.emit("error", error);
    }

    this.state.error = error.message;
  }

  /**
   * STATE MANAGEMENT
   */

  getState() {
    return { ...this.state };
  }

  clearState() {
    this.state = {
      currentEngagement: null,
      jurisdictions: [],
      frameworks: [],
      procedures: [],
      evidence: [],
      findings: [],
      riskAssessments: [],
      materiality: null,
      user: null,
      organization: null,
      isLoading: false,
      error: null,
      syncStatus: "idle"
    };
    this.emit("state-cleared");
  }

  /**
   * UTILITY
   */

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("en-GB").format(new Date(date));
  }
}

// Export singleton instance
module.exports = new AuditPlatformService();
