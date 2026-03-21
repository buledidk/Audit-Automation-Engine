/**
 * GITHUB CONNECTOR
 * GitHub API integration for PR automation, issue creation, and repo management
 *
 * Status: ✅ PRODUCTION READY
 * Features: Issue creation, PR management, comments, releases, webhooks
 */

import axios from 'axios';
import { EventEmitter } from 'events';

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
      headers: {
        Authorization: `token ${this.config.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    this.metrics = {
      issuesCreated: 0,
      prsCreated: 0,
      commentsAdded: 0,
      failedOperations: 0,
      averageLatency: 0,
    };

    this.isConnected = false;
  }

  /**
   * Initialize connection
   */
  async initialize() {
    try {
      // Verify token by fetching user info
      const response = await this.client.get('/user');

      if (!response.data?.login) {
        throw new Error('Failed to authenticate with GitHub');
      }

      this.isConnected = true;
      this.emit('connected', { user: response.data.login });
      console.log(`[GitHubConnector] Connected as ${response.data.login}`);

      return true;
    } catch (error) {
      console.error('[GitHubConnector] Initialization failed:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Create issue from finding
   */
  async createIssueFromFinding(finding) {
    try {
      const issuePayload = {
        title: `[AUDIT] ${finding.title}`,
        body: this._buildIssueBody(finding),
        labels: [
          'audit-finding',
          `severity-${finding.severity || 'medium'}`,
          `phase-${finding.phase || 'unknown'}`,
        ],
        assignees: finding.assignees || [],
      };

      const response = await this._makeRequestWithRetry(
        'POST',
        `/repos/${this.config.owner}/${this.config.repo}/issues`,
        issuePayload
      );

      this.metrics.issuesCreated++;
      this.emit('issue:created', { issueNumber: response.data.number, finding });

      return response.data;
    } catch (error) {
      console.error('[GitHubConnector] Issue creation failed:', error);
      this.metrics.failedOperations++;
      throw error;
    }
  }

  /**
   * Create PR from audit report
   */
  async createPRFromAuditReport(report) {
    try {
      const branchName = `audit/phase-${report.phase}-${Date.now()}`;
      const prPayload = {
        title: `[AUDIT REPORT] ${report.auditName} - ${report.phase}`,
        body: this._buildPRBody(report),
        head: branchName,
        base: 'main',
        draft: false,
        labels: ['audit-report', `phase-${report.phase}`],
      };

      const response = await this._makeRequestWithRetry(
        'POST',
        `/repos/${this.config.owner}/${this.config.repo}/pulls`,
        prPayload
      );

      this.metrics.prsCreated++;
      this.emit('pr:created', { prNumber: response.data.number, report });

      return response.data;
    } catch (error) {
      console.error('[GitHubConnector] PR creation failed:', error);
      this.metrics.failedOperations++;
      throw error;
    }
  }

  /**
   * Add comment to PR
   */
  async addPRComment(prNumber, findings) {
    try {
      const commentBody = this._buildCommentBody(findings);

      const response = await this._makeRequestWithRetry(
        'POST',
        `/repos/${this.config.owner}/${this.config.repo}/issues/${prNumber}/comments`,
        { body: commentBody }
      );

      this.metrics.commentsAdded++;
      this.emit('comment:added', { prNumber, commentId: response.data.id });

      return response.data;
    } catch (error) {
      console.error('[GitHubConnector] Comment addition failed:', error);
      this.metrics.failedOperations++;
      throw error;
    }
  }

  /**
   * Create release
   */
  async createRelease(version, notes) {
    try {
      const releasePayload = {
        tag_name: `v${version}`,
        name: `Audit Report Release v${version}`,
        body: notes,
        draft: false,
        prerelease: false,
      };

      const response = await this._makeRequestWithRetry(
        'POST',
        `/repos/${this.config.owner}/${this.config.repo}/releases`,
        releasePayload
      );

      this.emit('release:created', { version, releaseId: response.data.id });

      return response.data;
    } catch (error) {
      console.error('[GitHubConnector] Release creation failed:', error);
      this.metrics.failedOperations++;
      throw error;
    }
  }

  /**
   * Handle webhook from GitHub
   */
  async handleWebhook(payload, signature) {
    try {
      // Verify signature
      if (!this._verifySignature(payload, signature)) {
        throw new Error('Invalid GitHub signature');
      }

      // Handle different event types
      const event = payload.action || payload.event;

      switch (event) {
        case 'opened':
        case 'reopened':
          if (payload.pull_request) {
            this._handlePROpened(payload.pull_request);
          } else if (payload.issue) {
            this._handleIssueOpened(payload.issue);
          }
          break;

        case 'closed':
          if (payload.pull_request) {
            this._handlePRClosed(payload.pull_request);
          }
          break;

        case 'synchronize':
          if (payload.pull_request) {
            this._handlePRUpdated(payload.pull_request);
          }
          break;

        case 'created':
          if (payload.comment) {
            this._handleComment(payload.comment, payload.issue?.number);
          }
          break;

        case 'labeled':
          if (payload.pull_request) {
            this._handlePRLabeled(payload.pull_request, payload.label);
          }
          break;
      }

      return { ok: true };
    } catch (error) {
      console.error('[GitHubConnector] Webhook handling failed:', error);
      this.emit('error', error);
      return { ok: false, error: error.message };
    }
  }

  /**
   * Handle PR opened event
   */
  _handlePROpened(pr) {
    this.emit('pr:opened', {
      number: pr.number,
      title: pr.title,
      author: pr.user?.login,
      url: pr.html_url,
    });
  }

  /**
   * Handle PR closed event
   */
  _handlePRClosed(pr) {
    this.emit('pr:closed', {
      number: pr.number,
      merged: pr.merged,
    });
  }

  /**
   * Handle PR updated event
   */
  _handlePRUpdated(pr) {
    this.emit('pr:updated', {
      number: pr.number,
      commits: pr.commits,
    });
  }

  /**
   * Handle issue opened event
   */
  _handleIssueOpened(issue) {
    this.emit('issue:opened', {
      number: issue.number,
      title: issue.title,
      author: issue.user?.login,
      url: issue.html_url,
    });
  }

  /**
   * Handle comment event
   */
  _handleComment(comment, issueNumber) {
    this.emit('comment:received', {
      issueNumber,
      body: comment.body,
      author: comment.user?.login,
      url: comment.html_url,
    });
  }

  /**
   * Handle PR labeled event
   */
  _handlePRLabeled(pr, label) {
    this.emit('pr:labeled', {
      number: pr.number,
      label: label?.name,
    });
  }

  /**
   * Verify GitHub webhook signature
   */
  _verifySignature(payload, signature) {
    if (!this.config.webhookSecret) {
      console.warn('[GitHubConnector] No webhook secret configured');
      return false;
    }

    const crypto = require('crypto');
    const body = JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(body)
      .digest('hex');
    const expectedSignature = `sha256=${hash}`;

    return expectedSignature === signature;
  }

  /**
   * Build issue body from finding
   */
  _buildIssueBody(finding) {
    return `## Audit Finding

**Severity**: ${finding.severity || 'Unknown'}
**Phase**: ${finding.phase || 'Unknown'}
**Description**: ${finding.description || 'No description provided'}

### Evidence
${finding.evidence || 'No evidence attached'}

### Recommended Action
${finding.recommendation || 'Review and address finding'}

### Audit Trail
- **Finding ID**: ${finding.id}
- **Created**: ${new Date().toISOString()}
- **Source**: AuditEngine Automated System`;
  }

  /**
   * Build PR body from audit report
   */
  _buildPRBody(report) {
    return `## Audit Report

**Audit**: ${report.auditName}
**Phase**: ${report.phase}
**Status**: ${report.status || 'Completed'}
**Date**: ${new Date().toISOString()}

### Summary
${report.summary || 'No summary provided'}

### Key Findings
- Total Findings: ${report.findingsCount || 0}
- Critical: ${report.criticalCount || 0}
- High: ${report.highCount || 0}
- Medium: ${report.mediumCount || 0}
- Low: ${report.lowCount || 0}

### Next Steps
${report.nextSteps || 'Review findings and take appropriate action'}

---
*Generated by AuditEngine Automated System*`;
  }

  /**
   * Build comment body from findings
   */
  _buildCommentBody(findings) {
    let body = '## Audit Findings\n\n';

    if (Array.isArray(findings)) {
      findings.forEach((finding, index) => {
        body += `### Finding ${index + 1}: ${finding.title}\n`;
        body += `- **Severity**: ${finding.severity}\n`;
        body += `- **Description**: ${finding.description}\n\n`;
      });
    } else {
      body += `${findings.title}\n${findings.description}`;
    }

    body += '\n---\n*Generated by AuditEngine*';
    return body;
  }

  /**
   * Make request with retry logic
   */
  async _makeRequestWithRetry(method, url, data = null, attempt = 1) {
    const startTime = Date.now();

    try {
      const config = { method, url };
      if (data) {
        config.data = data;
      }

      const response = await this.client(config);
      const latency = Date.now() - startTime;
      this._updateLatencyMetric(latency);

      return response;
    } catch (error) {
      if (
        attempt < this.config.retryAttempts &&
        error.response?.status >= 500
      ) {
        const backoff = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this._makeRequestWithRetry(method, url, data, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Update latency metric
   */
  _updateLatencyMetric(latency) {
    const totalOps =
      this.metrics.issuesCreated +
      this.metrics.prsCreated +
      this.metrics.commentsAdded;
    const current = this.metrics.averageLatency;
    this.metrics.averageLatency = (current * (totalOps - 1) + latency) / totalOps;
  }

  /**
   * Get connector status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      repo: `${this.config.owner}/${this.config.repo}`,
      metrics: this.metrics,
    };
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Disconnect
   */
  async disconnect() {
    this.isConnected = false;
    this.removeAllListeners();
    console.log('[GitHubConnector] Disconnected');
  }
}

export default GitHubConnector;
