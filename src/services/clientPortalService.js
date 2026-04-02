/**
 * Client Portal Service
 * Manages invitations, PBC requests, dialogue threads, archival, rollforward, GDPR compliance
 */

import { agentEventBus, EVENT_TYPES } from './agentEventBus';

// PBC Request phases mapped to audit phases
const PBC_PHASES = {
  A: { label: 'Phase A — Planning', items: [
    { id: 'entity-info', label: 'Entity information & org chart', isaRef: 'ISA 315' },
    { id: 'prior-accounts', label: 'Prior year signed accounts', isaRef: 'ISA 510' },
    { id: 'engagement-letter', label: 'Signed engagement letter', isaRef: 'ISA 210' },
    { id: 'board-minutes', label: 'Board minutes for the year', isaRef: 'ISA 315' },
    { id: 'management-accounts', label: 'Latest management accounts', isaRef: 'ISA 520' }
  ]},
  B: { label: 'Phase B — Interim', items: [
    { id: 'bank-statements', label: 'Bank statements (all accounts)', isaRef: 'ISA 500' },
    { id: 'sales-invoices', label: 'Sample of sales invoices', isaRef: 'ISA 500' },
    { id: 'purchase-invoices', label: 'Sample of purchase invoices', isaRef: 'ISA 500' },
    { id: 'payroll-records', label: 'Payroll records & PAYE submissions', isaRef: 'ISA 500' },
    { id: 'vat-returns', label: 'VAT returns filed in the period', isaRef: 'ISA 250' }
  ]},
  C: { label: 'Phase C — Year-End', items: [
    { id: 'trial-balance', label: 'Trial balance at year-end', isaRef: 'ISA 500' },
    { id: 'bank-reconciliation', label: 'Bank reconciliations', isaRef: 'ISA 500' },
    { id: 'fixed-asset-register', label: 'Fixed asset register', isaRef: 'ISA 500' },
    { id: 'stock-sheets', label: 'Stock count sheets / valuation', isaRef: 'ISA 501' },
    { id: 'debtor-listing', label: 'Aged debtor listing', isaRef: 'ISA 500' },
    { id: 'creditor-listing', label: 'Aged creditor listing', isaRef: 'ISA 500' }
  ]},
  D: { label: 'Phase D — Completion', items: [
    { id: 'management-rep', label: 'Management representation letter', isaRef: 'ISA 580' },
    { id: 'post-ye-events', label: 'Post-year-end events summary', isaRef: 'ISA 560' },
    { id: 'related-party', label: 'Related party disclosures', isaRef: 'ISA 550' },
    { id: 'going-concern', label: 'Going concern assessment / forecasts', isaRef: 'ISA 570' },
    { id: 'legal-confirmation', label: 'Legal confirmation letters', isaRef: 'ISA 501' }
  ]}
};

class ClientPortalService {
  constructor() {
    this._invitations = new Map();
    this._messages = new Map();
    this._pbcStatuses = new Map();
    this._consents = new Map();
  }

  /**
   * Create invitation requiring partner approval
   */
  createInvitation({ engId, clientEmail, partnerId }) {
    const invId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const invitation = {
      invitationId: invId,
      engId,
      clientEmail,
      partnerId,
      status: 'pending_partner_approval',
      createdAt: new Date().toISOString()
    };
    this._invitations.set(invId, invitation);
    return invitation;
  }

  /**
   * Partner approves invitation -> generates access token
   */
  approveInvitation(invId, partnerId) {
    const inv = this._invitations.get(invId);
    if (!inv) throw new Error('Invitation not found');
    if (inv.partnerId !== partnerId) throw new Error('Only the engagement partner can approve');
    inv.status = 'approved';
    inv.approvedAt = new Date().toISOString();
    inv.portalAccessToken = `pat_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    return { portalAccessToken: inv.portalAccessToken };
  }

  /**
   * Get PBC requests structured by phase
   */
  getPBCRequests(engId, phase) {
    const result = {};
    const phases = phase ? { [phase]: PBC_PHASES[phase] } : PBC_PHASES;

    Object.entries(phases).forEach(([key, config]) => {
      result[`phase${key}`] = config.items.map(item => {
        const statusKey = `${engId}_${item.id}`;
        const status = this._pbcStatuses.get(statusKey) || {
          status: 'requested', uploadedAt: null, reviewedAt: null, notes: ''
        };
        return { ...item, ...status, phase: key };
      });
    });

    return result;
  }

  /**
   * Update PBC request status
   */
  updatePBCStatus(engId, itemId, update) {
    const statusKey = `${engId}_${itemId}`;
    const current = this._pbcStatuses.get(statusKey) || {};
    this._pbcStatuses.set(statusKey, { ...current, ...update, updatedAt: new Date().toISOString() });
    agentEventBus.publish(EVENT_TYPES.ENGAGEMENT_UPDATED, { engId, pbcItem: itemId, ...update });
  }

  /**
   * Post a message in a dialogue thread
   */
  postMessage({ requestId, senderId, text, mentions = [] }) {
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    if (!this._messages.has(requestId)) this._messages.set(requestId, []);

    const message = {
      messageId: msgId,
      requestId,
      senderId,
      text,
      mentions,
      readReceipts: [],
      createdAt: new Date().toISOString()
    };

    this._messages.get(requestId).push(message);
    return { messageId: msgId, readReceipts: [] };
  }

  /**
   * Get messages for a request
   */
  getMessages(requestId) {
    return this._messages.get(requestId) || [];
  }

  /**
   * Archive portal (triggered by Gate 9 sign-off)
   */
  archivePortal(engId) {
    return { engId, archived: true, archivedAt: new Date().toISOString() };
  }

  /**
   * Rollforward portal data to new engagement
   */
  rollforwardPortal(sourceEngId, targetEngId, newFYE) {
    // Copy PBC structure, clear statuses
    const sourcePBC = this.getPBCRequests(sourceEngId);
    Object.entries(sourcePBC).forEach(([phase, items]) => {
      items.forEach(item => {
        const statusKey = `${targetEngId}_${item.id}`;
        this._pbcStatuses.set(statusKey, { status: 'requested', notes: `Rolled forward from ${sourceEngId}` });
      });
    });
    return { sourceEngId, targetEngId, newFYE, rolledForwardAt: new Date().toISOString() };
  }

  // GDPR methods
  collectConsent(engId, clientId, consentType) {
    this._consents.set(`${engId}_${clientId}`, { consentType, collectedAt: new Date().toISOString() });
    return { consented: true };
  }

  generateDPA(engId) {
    return {
      title: 'Data Processing Agreement',
      engagementId: engId,
      clauses: [
        'Purpose limitation — data processed only for audit purposes',
        'Data minimisation — only necessary data collected',
        'Storage limitation — retained per regulatory requirements',
        'Security — encrypted at rest and in transit',
        'Access rights — client can request data export/deletion'
      ],
      generatedAt: new Date().toISOString()
    };
  }

  processDataDeletion(engId, clientId) {
    this._messages.forEach((msgs, key) => {
      if (key.startsWith(engId)) this._messages.delete(key);
    });
    return { deleted: true, engId, clientId, deletedAt: new Date().toISOString() };
  }

  exportClientData(engId) {
    const pbcRequests = this.getPBCRequests(engId);
    const messages = {};
    this._messages.forEach((msgs, key) => {
      if (key.includes(engId)) messages[key] = msgs;
    });
    return { engId, pbcRequests, messages, exportedAt: new Date().toISOString() };
  }
}

export const PBC_PHASE_CONFIG = PBC_PHASES;
export default new ClientPortalService();
