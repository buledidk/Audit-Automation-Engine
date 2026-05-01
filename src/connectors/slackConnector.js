/**
 * SLACK CONNECTOR
 * Real-time Slack integration for audit alerts, findings, and notifications
 *
 * Status: PRODUCTION READY
 * Features: Alerts, findings, completions, reactions, webhooks
 */

import axios from 'axios';
import { EventEmitter } from 'events';
import { createHmac, timingSafeEqual } from 'crypto';

class SlackConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      botToken: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      appToken: process.env.SLACK_APP_TOKEN,
      channels: {
        audits: process.env.SLACK_CHANNELS_AUDITS || '#audits',
        findings: process.env.SLACK_CHANNELS_FINDINGS || '#findings',
        deployments: process.env.SLACK_CHANNELS_DEPLOYMENTS || '#deployments',
      },
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };

    this.client = axios.create({
      baseURL: 'https://slack.com/api',
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.botToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.metrics = { messagesSent: 0, failedMessages: 0, webhooksCaught: 0, averageLatency: 0 };
    this.messageQueue = [];
    this.isConnected = false;
  }

  async initialize() {
    try {
      const response = await this.client.post('auth.test');
      if (!response.data.ok) throw new Error(`Slack auth failed: ${response.data.error}`);
      this.isConnected = true;
      this.emit('connected', { user: response.data.user_id });
      console.log(`[SlackConnector] Connected as ${response.data.user_id}`);
      this._subscribeToAgentEvents();
      return true;
    } catch (error) {
      console.error('[SlackConnector] Initialization failed:', error);
      this.emit('error', error);
      return false;
    }
  }

  async sendAlert(channel, message, severity = 'info') {
    try {
      const slackChannel = this.config.channels[channel] || channel;
      const color = severity === 'critical' ? '#FF0000' : severity === 'warning' ? '#FFA500' : '#0099FF';
      const payload = { channel: slackChannel, attachments: [{ color, title: `${severity.toUpperCase()} Alert`, text: message, ts: Math.floor(Date.now() / 1000), footer: 'AuditEngine Alert System' }] };
      return await this._sendWithRetry(payload);
    } catch (error) { console.error('[SlackConnector] Alert send failed:', error); this.metrics.failedMessages++; throw error; }
  }

  async sendFinding(finding) {
    try {
      const attachment = { channel: this.config.channels.findings, attachments: [{
        color: this._getSeverityColor(finding.severity), title: finding.title, text: finding.description,
        fields: [ { title: 'Severity', value: finding.severity.toUpperCase(), short: true }, { title: 'Phase', value: finding.phase || 'Unknown', short: true }, { title: 'Evidence', value: finding.evidence || 'No evidence attached', short: false } ],
        actions: [ { type: 'button', text: 'Approve', value: `approve_${finding.id}` }, { type: 'button', text: 'Request Review', value: `review_${finding.id}` } ],
        footer: 'AuditEngine Findings', ts: Math.floor(Date.now() / 1000)
      }]};
      return await this._sendWithRetry(attachment);
    } catch (error) { console.error('[SlackConnector] Finding send failed:', error); this.metrics.failedMessages++; throw error; }
  }

  async sendAuditCompletion(auditReport) {
    try {
      const attachment = { channel: this.config.channels.audits, attachments: [{
        color: '#36a64f', title: `Audit Completed: ${auditReport.auditName}`, text: `Audit phase "${auditReport.phase}" completed successfully`,
        fields: [ { title: 'Phase', value: auditReport.phase, short: true }, { title: 'Duration', value: auditReport.duration || 'Unknown', short: true },
          { title: 'Findings', value: `${auditReport.findingsCount || 0} findings`, short: true }, { title: 'Status', value: auditReport.status || 'Completed', short: true },
          { title: 'Summary', value: auditReport.summary || 'No summary provided', short: false } ],
        actions: [{ type: 'button', text: 'View Report', url: auditReport.reportUrl || '#' }],
        footer: 'AuditEngine Completion', ts: Math.floor(Date.now() / 1000)
      }]};
      return await this._sendWithRetry(attachment);
    } catch (error) { console.error('[SlackConnector] Completion send failed:', error); this.metrics.failedMessages++; throw error; }
  }

  _subscribeToAgentEvents() {
    this.on('agent:completed', async (event) => {
      try { await this.sendAlert('audits', `Agent ${event.agentName} completed task with ${event.tasksCompleted} items`, 'info'); }
      catch (error) { console.error('[SlackConnector] Agent event handling failed:', error); }
    });
    this.on('finding:critical', async (finding) => {
      try { await this.sendFinding(finding); }
      catch (error) { console.error('[SlackConnector] Finding event handling failed:', error); }
    });
  }

  async handleWebhook(payload) {
    try {
      this.metrics.webhooksCaught++;
      const rawBody = payload._rawBody || JSON.stringify(payload);
      const timestamp = payload._headers?.['x-slack-request-timestamp'];
      const sig = payload._headers?.['x-slack-signature'];
      if (timestamp && sig && !this._verifySignature(rawBody, timestamp, sig)) throw new Error('Invalid Slack signature');
      if (payload.type === 'url_verification') return { challenge: payload.challenge };
      if (payload.type === 'event_callback') this._handleEvent(payload.event);
      if (payload.type === 'block_actions') this._handleActions(payload.actions);
      return { ok: true };
    } catch (error) { console.error('[SlackConnector] Webhook handling failed:', error); this.emit('error', error); return { ok: false, error: error.message }; }
  }

  _handleEvent(event) {
    switch (event.type) {
      case 'reaction_added': this.emit('reaction:added', { user: event.user, emoji: event.reaction, timestamp: event.event_ts }); break;
      case 'message': if (event.subtype !== 'bot_message') this.emit('message:received', { text: event.text, user: event.user, channel: event.channel, timestamp: event.ts }); break;
      case 'app_mention': this.emit('mention:received', { text: event.text, user: event.user, channel: event.channel, timestamp: event.ts }); break;
    }
  }

  _handleActions(actions) {
    actions.forEach((action) => { this.emit('action:triggered', { actionId: action.action_id, value: action.value, user: action.user?.id, timestamp: action.action_ts }); });
  }

  /**
   * Verify Slack signature for webhook security
   * @param {string} rawBody - The raw request body string (NOT parsed JSON)
   * @param {string} timestamp - The x-slack-request-timestamp header value
   * @param {string} signature - The x-slack-signature header value
   */
  _verifySignature(rawBody, timestamp, signature) {
    if (!this.config.signingSecret) { console.warn('[SlackConnector] No signing secret configured'); return false; }
    const fiveMinutes = 5 * 60;
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > fiveMinutes) return false;
    const baseString = `v0:${timestamp}:${rawBody}`;
    const hash = createHmac('sha256', this.config.signingSecret).update(baseString).digest('hex');
    const expectedSignature = `v0=${hash}`;
    try { return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature)); } catch { return false; }
  }

  _getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#FF0000'; case 'high': return '#FF6600'; case 'medium': return '#FFAA00'; case 'low': return '#00CC00'; default: return '#0099FF';
    }
  }

  async _sendWithRetry(payload, attempt = 1) {
    const startTime = Date.now();
    try {
      const response = await this.client.post('chat.postMessage', payload);
      if (!response.data.ok) throw new Error(`Slack error: ${response.data.error}`);
      this.metrics.messagesSent++;
      this._updateLatencyMetric(Date.now() - startTime);
      return response.data;
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        const backoff = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this._sendWithRetry(payload, attempt + 1);
      }
      this.metrics.failedMessages++; throw error;
    }
  }

  _updateLatencyMetric(latency) { const count = this.metrics.messagesSent; const current = this.metrics.averageLatency; this.metrics.averageLatency = (current * (count - 1) + latency) / count; }
  getStatus() { return { connected: this.isConnected, metrics: this.metrics, channels: this.config.channels }; }
  getMetrics() { return { ...this.metrics }; }
  async disconnect() { this.isConnected = false; this.removeAllListeners(); console.log('[SlackConnector] Disconnected'); }
}

export default SlackConnector;
