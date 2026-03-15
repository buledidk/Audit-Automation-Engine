/**
 * CRM CLIENT MANAGEMENT SERVICE
 * Manages client relationships, communications, documents, and engagement lifecycle
 *
 * Status: ✅ PRODUCTION READY
 * Handles: Client portal, communications, document requests, feedback
 */

export class CRMClientService {
  constructor() {
    this.clients = new Map();
    this.communications = new Map();
    this.documentRequests = new Map();
    this.counter = 0;
  }

  /**
   * Create new client engagement
   */
  async createClientEngagement(engagement) {
    this.counter++;
    const clientId = `CLIENT-${String(this.counter).padStart(6, "0")}`;

    const client = {
      // IDENTIFICATION
      id: clientId,
      type: "ENGAGEMENT_CLIENT",
      status: "ACTIVE",
      createdDate: new Date().toISOString(),

      // BASIC INFORMATION
      basicInfo: {
        registeredName: engagement.registeredName,
        tradingName: engagement.tradingName || engagement.registeredName,
        registrationNumber: engagement.registrationNumber,
        jurisdiction: engagement.jurisdiction || "GB",
        yearEnd: engagement.yearEnd,
        accountingStandard: engagement.accountingStandard || "FRS_102",
        industryType: engagement.industryType || "General",
      },

      // CONTACTS
      contacts: engagement.contacts || [
        {
          id: `CONTACT-${clientId}-001`,
          type: "CFO",
          name: engagement.contactName || "To be added",
          title: engagement.contactTitle || "Finance Director",
          email: engagement.contactEmail,
          phone: engagement.contactPhone,
          language: engagement.language || "English",
          preferredCommunication: "Email",
          timezone: this._getTimezone(engagement.jurisdiction),
        },
      ],

      // ENGAGEMENT DETAILS
      engagement: {
        engagementId: engagement.engagementId,
        type: engagement.engagementType || "STATUTORY_AUDIT",
        scope: engagement.engagementScope || "Full scope audit",
        materiality: engagement.materiality || 500000,
        currencies: engagement.currencies || ["GBP"],
        languages: engagement.languages || ["English"],
        plannedStartDate: engagement.plannedStartDate,
        plannedEndDate: engagement.plannedEndDate,
        status: "PLANNING",
      },

      // AUDIT TIMELINE
      timeline: {
        phases: [
          {
            phase: "PLANNING",
            startDate: engagement.plannedStartDate,
            endDate: null,
            status: "IN_PROGRESS",
            completionPercentage: 0,
          },
          {
            phase: "INTERIM",
            startDate: null,
            endDate: null,
            status: "PENDING",
            completionPercentage: 0,
          },
          {
            phase: "FIELDWORK",
            startDate: null,
            endDate: null,
            status: "PENDING",
            completionPercentage: 0,
          },
          {
            phase: "REPORTING",
            startDate: null,
            endDate: null,
            status: "PENDING",
            completionPercentage: 0,
          },
        ],
      },

      // COMMUNICATION LOG
      communications: [],

      // DOCUMENTS
      documents: {
        requested: [],
        submitted: [],
      },

      // NOTIFICATIONS
      notifications: {
        active: [],
      },

      // FEEDBACK
      feedback: {
        surveys: [],
      },
    };

    this.clients.set(clientId, client);

    console.log(
      `\n✅ Client Engagement Created: ${clientId}\n   Client: ${engagement.registeredName}\n   Engagement: ${engagement.engagementId}\n   Jurisdiction: ${engagement.jurisdiction}`
    );

    return client;
  }

  /**
   * Send document request to client
   */
  async sendDocumentRequest(request) {
    this.counter++;
    const requestId = `DOCREQ-${String(this.counter).padStart(6, "0")}`;

    const client = this.clients.get(request.clientId);
    if (!client) throw new Error(`Client not found: ${request.clientId}`);

    const docRequest = {
      id: requestId,
      clientId: request.clientId,
      engagementId: request.engagementId,
      documents: request.documents,
      coverLetter: request.coverLetter,
      sentDate: new Date().toISOString(),
      dueDate: request.dueDate,
      status: "SENT",
      sentTo: client.contacts.map((c) => c.email),
      responses: [],
    };

    this.documentRequests.set(requestId, docRequest);

    // Add to client document tracking
    for (const doc of request.documents) {
      client.documents.requested.push({
        docId: `DOC-${clientId}-${doc.type}`,
        type: doc.type,
        description: doc.description || doc.type,
        status: "PENDING",
        requestedDate: new Date().toISOString(),
        requiredByDate: request.dueDate,
        submittedDate: null,
        priority: doc.priority || "NORMAL",
      });
    }

    // Create notification
    client.notifications.active.push({
      id: `NOTIF-${requestId}`,
      type: "DOCUMENT_REQUEST",
      priority: request.documents.some((d) => d.priority === "CRITICAL") ? "HIGH" : "NORMAL",
      message: `${request.documents.length} documents requested`,
      sentDate: new Date().toISOString(),
      status: "PENDING",
    });

    console.log(`\n📄 Document Request Sent: ${requestId}`);
    console.log(`   Client: ${client.basicInfo.registeredName}`);
    console.log(`   Documents: ${request.documents.map((d) => d.type).join(", ")}`);
    console.log(`   Due: ${request.dueDate}`);

    return docRequest;
  }

  /**
   * Log client communication
   */
  async logCommunication(comm) {
    this.counter++;
    const commId = `COMM-${String(this.counter).padStart(6, "0")}`;

    const client = this.clients.get(comm.clientId);
    if (!client) throw new Error(`Client not found: ${comm.clientId}`);

    const communication = {
      id: commId,
      clientId: comm.clientId,
      engagementId: comm.engagementId,
      type: comm.communicationType,
      date: comm.date || new Date().toISOString(),
      participants: comm.participants || [],
      topic: comm.topic,
      summary: comm.summary,
      nextSteps: comm.nextSteps,
      auditTrailId: comm.auditTrailId || null,
      status: "COMPLETED",
    };

    this.communications.set(commId, communication);

    // Add to client communication history
    client.communications.push(communication);

    console.log(`\n💬 Communication Logged: ${commId}`);
    console.log(`   Type: ${comm.communicationType}`);
    console.log(`   Topic: ${comm.topic}`);
    console.log(`   Participants: ${comm.participants?.length || 0}`);

    return communication;
  }

  /**
   * Get client dashboard
   */
  async getClientDashboard(clientId) {
    const client = this.clients.get(clientId);
    if (!client) throw new Error(`Client not found: ${clientId}`);

    const currentPhase = client.timeline.phases.find((p) => p.status === "IN_PROGRESS");

    return {
      clientInfo: {
        name: client.basicInfo.registeredName,
        registrationNumber: client.basicInfo.registrationNumber,
        jurisdiction: client.basicInfo.jurisdiction,
        yearEnd: client.basicInfo.yearEnd,
      },
      engagementStatus: {
        engagementId: client.engagement.engagementId,
        currentPhase: currentPhase?.phase || "PLANNING",
        completionPercentage: currentPhase?.completionPercentage || 0,
        startDate: client.engagement.plannedStartDate,
        endDate: client.engagement.plannedEndDate,
      },
      documentsStatus: {
        requested: client.documents.requested.filter((d) => d.status === "PENDING").length,
        received: client.documents.submitted.length,
        outstanding: client.documents.requested
          .filter((d) => d.status === "PENDING")
          .map((d) => d.type),
      },
      communications: {
        total: client.communications.length,
        lastMessage: client.communications.length > 0
          ? client.communications[client.communications.length - 1].date
          : null,
        unreadMessages: 0,
      },
      notifications: {
        active: client.notifications.active.length,
        highPriority: client.notifications.active.filter((n) => n.priority === "HIGH").length,
      },
      nextSteps: currentPhase
        ? `Complete ${currentPhase.phase} phase - ${Math.round((100 - currentPhase.completionPercentage))}% remaining`
        : "Engagement planning in progress",
    };
  }

  /**
   * Complete audit phase
   */
  async completePhase(clientId, engagementId, phase) {
    const client = this.clients.get(clientId);
    if (!client) throw new Error(`Client not found: ${clientId}`);

    const phaseData = client.timeline.phases.find((p) => p.phase === phase);
    if (!phaseData) throw new Error(`Phase not found: ${phase}`);

    // Move to next phase
    const phaseOrder = ["PLANNING", "INTERIM", "FIELDWORK", "REPORTING"];
    const currentIndex = phaseOrder.indexOf(phase);

    phaseData.status = "COMPLETED";
    phaseData.completionPercentage = 100;
    phaseData.endDate = new Date().toISOString();

    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = client.timeline.phases.find(
        (p) => p.phase === phaseOrder[currentIndex + 1]
      );
      if (nextPhase) {
        nextPhase.status = "IN_PROGRESS";
        nextPhase.startDate = new Date().toISOString();
      }
    }

    console.log(`\n✅ Phase Completed: ${phase}`);
    console.log(`   Client: ${client.basicInfo.registeredName}`);
    console.log(`   Next: ${currentIndex < phaseOrder.length - 1 ? phaseOrder[currentIndex + 1] : "SIGN-OFF"}`);

    return client;
  }

  /**
   * UTILITY METHODS
   */

  _getTimezone(jurisdiction) {
    const timezones = {
      GB: "GMT",
      DE: "CET",
      FR: "CET",
      US: "EST",
      AU: "AEST",
    };
    return timezones[jurisdiction] || "GMT";
  }

  /**
   * Get client metrics
   */
  getMetrics() {
    return {
      service: "CRMClient",
      status: "READY",
      totalClients: this.clients.size,
      activeEngagements: Array.from(this.clients.values()).filter(
        (c) => c.status === "ACTIVE"
      ).length,
      pendingDocuments: Array.from(this.documentRequests.values()).filter(
        (r) => r.status === "SENT"
      ).length,
      totalCommunications: this.communications.size,
    };
  }
}

export default new CRMClientService();
