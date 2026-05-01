/**
 * GITHUB CONNECTOR
 * GitHub API integration for PR automation, issue creation, and repo management
 *
 * Status: PRODUCTION READY
 * Features: Issue creation, PR management, comments, releases, webhooks
 */

import axios from 'axios';
import { EventEmitter } from 'events';
import { createHmac, timingSafeEqual } from 'crypto';

class GitHubConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      token: process.env.GITHUB_TOKEN,
      webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
      repo: process.env.GITHUB_REPO || 'buledidk/Audit-Automation-Engine',
      owner: process.env.GITHUB_OWNER || 'buledidk',
      timeout: 15000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
    const [owner, repo] = this.config.repo.split('/');
    this.config.owner = owner;
    this.config.repo = repo;
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      timeout: this.config.timeout,
      headers: { Authorization: `token ${this.config.token}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
    });
    this.metrics = { issuesCreated: 0, prsCreated: 0, commentsAdded: 0, failedOperations: 0, averageLatency: 0 };
    this.isConnected = false;
  }

  async initialize() {
    try {
      const response = await this.client.get('/user');
      if (!response.data?.login) throw new Error('Failed to authenticate with GitHub');
      this.isConnected = true;
      this.emit('connected', { user: response.data.login });
      console.log(`[GitHubConnector] Connected as ${response.data.login}`);
      return true;
    } catch (error) { console.error('[GitHubConnector] Initialization failed:', error); this.emit('error', error); return false; }
  }

  async createIssueFromFinding(finding) {
    try {
      const issuePayload = { title: `[AUDIT] ${finding.title}`, body: this._buildIssueBody(finding),
        labels: ['audit-finding', `severity-${finding.severity || 'medium'}`, `phase-${finding.phase || 'unknown'}`], assignees: finding.assignees || [] };
      const response = await this._makeRequestWithRetry('POST', `/repos/${this.config.owner}/${this.config.repo}/issues`, issuePayload);
      this.metrics.issuesCreated++;
      this.emit('issue:created', { issueNumber: response.data.number, finding });
      return response.data;
    } catch (error) { console.error('[GitHubConnector] Issue creation failed:', error); this.metrics.failedOperations++; throw error; }
  }

  async createPRFromAuditReport(report) {
    try {
      const branchName = `audit/phase-${report.phase}-${Date.now()}`;
      const prPayload = { title: `[AUDIT REPORT] ${report.auditName} - ${report.phase}`, body: this._buildPRBody(report), head: branchName, base: 'main', draft: false };
      const response = await this._makeRequestWithRetry('POST', `/repos/${this.config.owner}/${this.config.repo}/pulls`, prPayload);
      this.metrics.prsCreated++;
      this.emit('pr:created', { prNumber: response.data.number, report });
      return response.data;
    } catch (error) { console.error('[GitHubConnector] PR creation failed:', error); this.metrics.failedOperations++; throw error; }
  }

  async addPRComment(prNumber, findings) {
    try {
      const commentBody = this._buildCommentBody(findings);
      const response = await this._makeRequestWithRetry('POST', `/repos/${this.config.owner}/${this.config.repo}/issues/${prNumber}/comments`, { body: commentBody });
      this.metrics.commentsAdded++;
      this.emit('comment:added', { prNumber, commentId: response.data.id });
      return response.data;
    } catch (error) { console.error('[GitHubConnector] Comment addition failed:', error); this.metrics.failedOperations++; throw error; }
  }

  async createRelease(version, notes) {
    try {
      const releasePayload = { tag_name: `v${version}`, name: `Audit Report Release v${version}`, body: notes, draft: false, prerelease: false };
      const response = await this._makeRequestWithRetry('POST', `/repos/${this.config.owner}/${this.config.repo}/releases`, releasePayload);
      this.emit('release:created', { version, releaseId: response.data.id });
      return response.data;
    } catch (error) { console.error('[GitHubConnector] Release creation failed:', error); this.metrics.failedOperations++; throw error; }
  }

  async handleWebhook(payload, signature) {
    try {
      const rawBody = payload._rawBody || JSON.stringify(payload);
      if (signature && !this._verifySignature(rawBody, signature)) throw new Error('Invalid GitHub signature');
      const event = payload.action;
      switch (event) {
        case 'opened': case 'reopened':
          if (payload.pull_request) this._handlePROpened(payload.pull_request);
          else if (payload.issue) this._handleIssueOpened(payload.issue);
          break;
        case 'closed': if (payload.pull_request) this._handlePRClosed(payload.pull_request); break;
        case 'synchronize': if (payload.pull_request) this._handlePRUpdated(payload.pull_request); break;
        case 'created': if (payload.comment) this._handleComment(payload.comment, payload.issue?.number); break;
        case 'labeled': if (payload.pull_request) this._handlePRLabeled(payload.pull_request, payload.label); break;
      }
      return { ok: true };
    } catch (error) { console.error('[GitHubConnector] Webhook handling failed:', error); this.emit('error', error); return { ok: false, error: error.message }; }
  }

  _handlePROpened(pr) { this.emit('pr:opened', { number: pr.number, title: pr.title, author: pr.user?.login, url: pr.html_url }); }
  _handlePRClosed(pr) { this.emit('pr:closed', { number: pr.number, merged: pr.merged }); }
  _handlePRUpdated(pr) { this.emit('pr:updated', { number: pr.number, commits: pr.commits }); }
  _handleIssueOpened(issue) { this.emit('issue:opened', { number: issue.number, title: issue.title, author: issue.user?.login, url: issue.html_url }); }
  _handleComment(comment, issueNumber) { this.emit('comment:received', { issueNumber, body: comment.body, author: comment.user?.login, url: comment.html_url }); }
  _handlePRLabeled(pr, label) { this.emit('pr:labeled', { number: pr.number, label: label?.name }); }

  /**
   * Verify GitHub webhook signature
   * @param {string} rawBody - The raw request body string (NOT parsed JSON)
   * @param {string} signature - The X-Hub-Signature-256 header value
   */
  _verifySignature(rawBody, signature) {
    if (!this.config.webhookSecret) { console.warn('[GitHubConnector] No webhook secret configured'); return false; }
    if (!signature) return false;
    const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
    const hash = createHmac('sha256', this.config.webhookSecret).update(body).digest('hex');
    const expectedSignature = `sha256=${hash}`;
    try { return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature)); } catch { return false; }
  }

  _buildIssueBody(finding) {
    return `## Audit Finding\n\n**Severity**: ${finding.severity || 'Unknown'}\n**Phase**: ${finding.phase || 'Unknown'}\n**Description**: ${finding.description || 'No description provided'}\n\n### Evidence\n${finding.evidence || 'No evidence attached'}\n\n### Recommended Action\n${finding.recommendation || 'Review and address finding'}\n\n### Audit Trail\n- **Finding ID**: ${finding.id}\n- **Created**: ${new Date().toISOString()}\n- **Source**: AuditEngine Automated System`;
  }

  _buildPRBody(report) {
    return `## Audit Report\n\n**Audit**: ${report.auditName}\n**Phase**: ${report.phase}\n**Status**: ${report.status || 'Completed'}\n**Date**: ${new Date().toISOString()}\n\n### Summary\n${report.summary || 'No summary provided'}\n\n### Key Findings\n- Total Findings: ${report.findingsCount || 0}\n- Critical: ${report.criticalCount || 0}\n- High: ${report.highCount || 0}\n- Medium: ${report.mediumCount || 0}\n- Low: ${report.lowCount || 0}\n\n### Next Steps\n${report.nextSteps || 'Review findings and take appropriate action'}\n\n---\n*Generated by AuditEngine Automated System*`;
  }

  _buildCommentBody(findings) {
    let body = '## Audit Findings\n\n';
    if (Array.isArray(findings)) { findings.forEach((finding, index) => { body += `### Finding ${index + 1}: ${finding.title}\n- **Severity**: ${finding.severity}\n- **Description**: ${finding.description}\n\n`; }); }
    else { body += `${findings.title}\n${findings.description}`; }
    body += '\n---\n*Generated by AuditEngine*';
    return body;
  }

  async _makeRequestWithRetry(method, url, data = null, attempt = 1) {
    const startTime = Date.now();
    try {
      const config = { method, url };
      if (data) config.data = data;
      const response = await this.client(config);
      this._updateLatencyMetric(Date.now() - startTime);
      return response;
    } catch (error) {
      if (attempt < this.config.retryAttempts && error.response?.status >= 500) {
        const backoff = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this._makeRequestWithRetry(method, url, data, attempt + 1);
      }
      throw error;
    }
  }

  _updateLatencyMetric(latency) {
    const totalOps = this.metrics.issuesCreated + this.metrics.prsCreated + this.metrics.commentsAdded;
    const current = this.metrics.averageLatency;
    this.metrics.averageLatency = totalOps > 0 ? (current * (totalOps - 1) + latency) / totalOps : latency;
  }

  getStatus() { return { connected: this.isConnected, repo: `${this.config.owner}/${this.config.repo}`, metrics: this.metrics }; }
  getMetrics() { return { ...this.metrics }; }
  async disconnect() { this.isConnected = false; this.removeAllListeners(); console.log('[GitHubConnector] Disconnected'); }
}

export default GitHubConnector;
