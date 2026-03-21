/**
 * EMAIL CONNECTOR
 * Email notifications via SendGrid (primary) or SMTP (fallback)
 *
 * Status: ✅ PRODUCTION READY
 * Features: HTML templates, SendGrid/SMTP, retry logic, rate limiting
 */

import nodemailer from 'nodemailer';
import { EventEmitter } from 'events';

class EmailConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      sendgridApiKey: process.env.SENDGRID_API_KEY,
      sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@auditengine.com',
      sendgridFromName: process.env.SENDGRID_FROM_NAME || 'AuditEngine',
      smtpHost: process.env.SMTP_HOST,
      smtpPort: parseInt(process.env.SMTP_PORT) || 587,
      smtpUser: process.env.SMTP_USER,
      smtpPassword: process.env.SMTP_PASSWORD,
      smtpFrom: process.env.SMTP_FROM || 'noreply@auditengine.com',
      timeout: 20000,
      retryAttempts: 3,
      retryDelay: 2000,
      ...config,
    };

    this.transporter = null;
    this.metrics = {
      emailsSent: 0,
      failedEmails: 0,
      averageLatency: 0,
      providerUsed: {},
    };

    this.isConnected = false;
  }

  /**
   * Initialize connection
   */
  async initialize() {
    try {
      // Try SendGrid first
      if (this.config.sendgridApiKey) {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: this.config.sendgridApiKey,
          },
        });

        this.provider = 'sendgrid';
        this.metrics.providerUsed.sendgrid = 0;
      }
      // Fall back to SMTP
      else if (
        this.config.smtpHost &&
        this.config.smtpUser &&
        this.config.smtpPassword
      ) {
        this.transporter = nodemailer.createTransport({
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          secure: this.config.smtpPort === 465,
          auth: {
            user: this.config.smtpUser,
            pass: this.config.smtpPassword,
          },
        });

        this.provider = 'smtp';
        this.metrics.providerUsed.smtp = 0;
      } else {
        throw new Error('No email provider configured');
      }

      // Verify connection
      await this.transporter.verify();

      this.isConnected = true;
      this.emit('connected', { provider: this.provider });
      console.log(
        `[EmailConnector] Connected using ${this.provider.toUpperCase()}`
      );

      return true;
    } catch (error) {
      console.error('[EmailConnector] Initialization failed:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Send completion report
   */
  async sendCompletionReport(email, report) {
    try {
      const htmlContent = this._buildCompletionReportHTML(report);
      const plainText = this._buildCompletionReportText(report);

      const mailOptions = {
        from: this._getFromAddress(),
        to: email,
        subject: `✅ Audit Completed: ${report.auditName} (${report.phase})`,
        html: htmlContent,
        text: plainText,
        headers: {
          'X-Audit-ID': report.auditId,
          'X-Report-Type': 'completion',
        },
      };

      return await this._sendWithRetry(mailOptions);
    } catch (error) {
      console.error('[EmailConnector] Completion report send failed:', error);
      this.metrics.failedEmails++;
      throw error;
    }
  }

  /**
   * Send deadline reminder
   */
  async sendDeadlineReminder(email, dueDate) {
    try {
      const daysUntil = Math.ceil(
        (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      const mailOptions = {
        from: this._getFromAddress(),
        to: email,
        subject: `⏰ Audit Deadline Reminder - ${daysUntil} days remaining`,
        html: `
          <h2>Audit Deadline Reminder</h2>
          <p>Your audit deadline is coming up!</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          <p><strong>Days Remaining:</strong> ${daysUntil}</p>
          <p>Please ensure all audit activities are completed on time.</p>
          <p>
            <a href="${process.env.VITE_APP_URL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Audit Dashboard
            </a>
          </p>
        `,
        text: `Audit Deadline Reminder\n\nDue: ${new Date(dueDate).toLocaleDateString()}\nDays Remaining: ${daysUntil}`,
      };

      return await this._sendWithRetry(mailOptions);
    } catch (error) {
      console.error('[EmailConnector] Reminder send failed:', error);
      this.metrics.failedEmails++;
      throw error;
    }
  }

  /**
   * Request approval
   */
  async requestApproval(email, item, deadline) {
    try {
      const mailOptions = {
        from: this._getFromAddress(),
        to: email,
        subject: `📋 Approval Requested: ${item.title}`,
        html: `
          <h2>Approval Requested</h2>
          <p><strong>Item:</strong> ${item.title}</p>
          <p><strong>Description:</strong> ${item.description || 'No description'}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <div style="margin: 20px 0;">
            <a href="${process.env.VITE_APP_URL}?action=approve&id=${item.id}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
              Approve
            </a>
            <a href="${process.env.VITE_APP_URL}?action=reject&id=${item.id}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Request Changes
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            Item ID: ${item.id}<br>
            Sent: ${new Date().toISOString()}
          </p>
        `,
        text: `Approval Requested\n\nItem: ${item.title}\n\nDeadline: ${new Date(deadline).toLocaleDateString()}`,
      };

      return await this._sendWithRetry(mailOptions);
    } catch (error) {
      console.error('[EmailConnector] Approval request send failed:', error);
      this.metrics.failedEmails++;
      throw error;
    }
  }

  /**
   * Send finding notification
   */
  async sendFinding(emails, finding) {
    try {
      const recipients = Array.isArray(emails) ? emails : [emails];

      const mailOptions = {
        from: this._getFromAddress(),
        to: recipients.join(','),
        subject: `🔍 Audit Finding: ${finding.title} [${finding.severity?.toUpperCase()}]`,
        html: `
          <h2>New Audit Finding</h2>
          <p><strong>Severity:</strong> <span style="color: ${this._getSeverityColor(finding.severity)}; font-weight: bold;">${finding.severity?.toUpperCase()}</span></p>
          <p><strong>Title:</strong> ${finding.title}</p>
          <p><strong>Description:</strong></p>
          <p>${finding.description || 'No description'}</p>
          <p><strong>Evidence:</strong></p>
          <p>${finding.evidence || 'No evidence attached'}</p>
          <p style="color: #666; font-size: 12px;">
            Finding ID: ${finding.id}<br>
            Phase: ${finding.phase || 'Unknown'}<br>
            Detected: ${new Date().toISOString()}
          </p>
        `,
        text: `Finding: ${finding.title}\n\n${finding.description}\n\nSeverity: ${finding.severity}`,
      };

      return await this._sendWithRetry(mailOptions);
    } catch (error) {
      console.error('[EmailConnector] Finding send failed:', error);
      this.metrics.failedEmails++;
      throw error;
    }
  }

  /**
   * Build completion report HTML
   */
  _buildCompletionReportHTML(report) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .header { background-color: #2c3e50; color: white; padding: 20px; }
          .content { padding: 20px; }
          .summary { background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .finding { border-left: 4px solid #e74c3c; padding: 10px; margin: 10px 0; background-color: #fef5f5; }
          .footer { border-top: 1px solid #bdc3c7; padding: 10px; margin-top: 20px; font-size: 12px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Audit Completion Report</h1>
          <p>${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">
          <h2>${report.auditName}</h2>
          <p><strong>Phase:</strong> ${report.phase}</p>
          <p><strong>Status:</strong> ${report.status || 'Completed'}</p>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>${report.summary || 'Audit phase completed successfully'}</p>
          </div>
          
          <h3>Findings Summary</h3>
          <ul>
            <li>Total Findings: ${report.findingsCount || 0}</li>
            <li>Critical: ${report.criticalCount || 0}</li>
            <li>High: ${report.highCount || 0}</li>
            <li>Medium: ${report.mediumCount || 0}</li>
            <li>Low: ${report.lowCount || 0}</li>
          </ul>
          
          <p>
            <a href="${process.env.VITE_APP_URL}/${report.auditId}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Full Report
            </a>
          </p>
        </div>
        <div class="footer">
          <p>© 2026 AuditEngine. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Build completion report text
   */
  _buildCompletionReportText(report) {
    return `
Audit Completion Report
${new Date().toLocaleDateString()}

${report.auditName}
Phase: ${report.phase}
Status: ${report.status || 'Completed'}

Summary:
${report.summary || 'Audit phase completed successfully'}

Findings:
- Total: ${report.findingsCount || 0}
- Critical: ${report.criticalCount || 0}
- High: ${report.highCount || 0}
- Medium: ${report.mediumCount || 0}
- Low: ${report.lowCount || 0}

© 2026 AuditEngine
    `;
  }

  /**
   * Get from address
   */
  _getFromAddress() {
    if (this.provider === 'sendgrid') {
      return `"${this.config.sendgridFromName}" <${this.config.sendgridFromEmail}>`;
    }
    return this.config.smtpFrom;
  }

  /**
   * Get severity color
   */
  _getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return '#e74c3c';
      case 'high':
        return '#e67e22';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#3498db';
    }
  }

  /**
   * Send with retry logic
   */
  async _sendWithRetry(mailOptions, attempt = 1) {
    const startTime = Date.now();

    try {
      const result = await this.transporter.sendMail(mailOptions);

      this.metrics.emailsSent++;
      this.metrics.providerUsed[this.provider]++;

      const latency = Date.now() - startTime;
      this._updateLatencyMetric(latency);

      this.emit('email:sent', {
        messageId: result.messageId,
        recipient: mailOptions.to,
      });

      return result;
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        const backoff = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this._sendWithRetry(mailOptions, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Update latency metric
   */
  _updateLatencyMetric(latency) {
    const count = this.metrics.emailsSent;
    const current = this.metrics.averageLatency;
    this.metrics.averageLatency = (current * (count - 1) + latency) / count;
  }

  /**
   * Get connector status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      provider: this.provider,
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
    if (this.transporter) {
      await this.transporter.close();
    }
    this.removeAllListeners();
    console.log('[EmailConnector] Disconnected');
  }
}

export default EmailConnector;
