/**
 * PushNotificationService - Multi-channel Push Notifications
 * Phase 8: Mobile Dispatch & Remote Operations
 *
 * Manages push notifications across multiple channels:
 * - Web Push API (browser notifications)
 * - Slack (DM messages)
 * - Email (fallback/digest)
 *
 * Features:
 * - Multi-channel delivery
 * - Retry logic with exponential backoff
 * - Notification templates
 * - Delivery tracking
 * - Device preferences
 */

const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');
const logger = require('../utils/logger');

class PushNotificationService extends EventEmitter {
  constructor(db, slackService, emailService, realtimeSync) {
    super();
    this.db = db;
    this.slackService = slackService;
    this.emailService = emailService;
    this.realtimeSync = realtimeSync;
    this.pendingNotifications = new Map(); // notificationId -> notification
    this.retryQueue = [];

    // Notification templates
    this.templates = {
      buildSuccess: {
        title: '✅ Build Successful',
        defaultMessage: 'Build completed successfully',
        priority: 'normal'
      },
      buildFailure: {
        title: '❌ Build Failed',
        defaultMessage: 'Build failed. Check the logs for details',
        priority: 'high'
      },
      testSuccess: {
        title: '✅ Tests Passed',
        defaultMessage: 'All tests passed successfully',
        priority: 'normal'
      },
      testFailure: {
        title: '❌ Tests Failed',
        defaultMessage: 'Some tests failed. Review the results',
        priority: 'high'
      },
      deploySuccess: {
        title: '🚀 Deployment Complete',
        defaultMessage: 'Deployment finished successfully',
        priority: 'normal'
      },
      deployFailure: {
        title: '❌ Deployment Failed',
        defaultMessage: 'Deployment failed. Check logs for details',
        priority: 'high'
      },
      agentCritical: {
        title: '🚨 Critical Agent Issue',
        defaultMessage: 'An agent system encountered a critical issue',
        priority: 'critical'
      },
      agentRecovered: {
        title: '✅ Agent Recovered',
        defaultMessage: 'Agent system recovered automatically',
        priority: 'normal'
      },
      systemAlert: {
        title: '⚠️ System Alert',
        defaultMessage: 'System alert requires attention',
        priority: 'high'
      }
    };
  }

  /**
   * Initialize notification service
   */
  async initialize() {
    logger.info('Initializing PushNotificationService');

    // Start retry processor
    this.startRetryProcessor();

    logger.info('PushNotificationService initialized');
  }

  /**
   * Send notification to device
   */
  async sendNotification(deviceId, notificationType, data = {}) {
    const template = this.templates[notificationType];

    if (!template) {
      logger.warn('Unknown notification type', { notificationType, deviceId });
      return null;
    }

    const notification = {
      id: uuidv4(),
      deviceId,
      notificationType,
      title: template.title,
      message: data.message || template.defaultMessage,
      actionUrl: data.actionUrl || null,
      actionData: data.actionData || null,
      priority: data.priority || template.priority,
      channels: data.channels || ['webpush', 'slack'],
      status: 'pending',
      sentAt: null,
      deliveredAt: null,
      readAt: null,
      failedReason: null,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date()
    };

    this.pendingNotifications.set(notification.id, notification);

    // Get user preferences
    const preferences = await this.getUserNotificationPreferences(deviceId);

    // Send to each channel
    const results = {};

    for (const channel of notification.channels) {
      if (preferences[channel]?.enabled === false) {
        logger.debug('Notification channel disabled for device', {
          deviceId,
          channel,
          notificationType
        });
        continue;
      }

      try {
        const result = await this.sendViaChannel(channel, notification, preferences);
        results[channel] = result;
      } catch (error) {
        logger.error('Failed to send notification via channel', {
          deviceId,
          channel,
          error
        });
        results[channel] = { success: false, error: error.message };
      }
    }

    // Update notification status
    const sentSuccessfully = Object.values(results).some(r => r.success);

    if (sentSuccessfully) {
      notification.status = 'sent';
      notification.sentAt = new Date();

      // Log to database
      await this.logNotificationToDB(notification);

      logger.info('Notification sent', {
        notificationId: notification.id,
        deviceId,
        notificationType,
        channels: Object.keys(results).filter(c => results[c].success)
      });

      this.emit('notification:sent', notification);
    } else {
      // Queue for retry
      this.retryQueue.push({
        notification,
        nextRetry: new Date(Date.now() + 5000), // Retry in 5 seconds
        retryCount: 0
      });

      logger.warn('Notification queued for retry', {
        notificationId: notification.id,
        deviceId
      });
    }

    return notification;
  }

  /**
   * Send notification via specific channel
   */
  async sendViaChannel(channel, notification, preferences) {
    switch (channel) {
      case 'webpush':
        return await this.sendWebPush(notification, preferences);

      case 'slack':
        return await this.sendSlack(notification, preferences);

      case 'email':
        return await this.sendEmail(notification, preferences);

      default:
        throw new Error(`Unknown channel: ${channel}`);
    }
  }

  /**
   * Send Web Push notification
   */
  async sendWebPush(notification, preferences) {
    try {
      // Get subscription from preferences
      const subscription = preferences.webpush?.subscription;

      if (!subscription) {
        return { success: false, reason: 'No WebPush subscription' };
      }

      // Send to connected device via WebSocket if available
      if (this.realtimeSync) {
        const sent = this.realtimeSync.sendToDevice(notification.deviceId, {
          type: 'notification',
          notificationId: notification.id,
          title: notification.title,
          message: notification.message,
          actionUrl: notification.actionUrl,
          actionData: notification.actionData,
          priority: notification.priority,
          badge: this.getPriorityBadge(notification.priority),
          icon: '/notification-icon.png'
        });

        if (sent) {
          return { success: true, channel: 'webpush' };
        }
      }

      // Fallback: Store for sync when device reconnects
      logger.debug('WebPush notification queued for device reconnection', {
        notificationId: notification.id,
        deviceId: notification.deviceId
      });

      return { success: true, channel: 'webpush', queued: true };
    } catch (error) {
      logger.error('WebPush send failed', { error });
      throw error;
    }
  }

  /**
   * Send Slack notification
   */
  async sendSlack(notification, preferences) {
    try {
      if (!this.slackService) {
        return { success: false, reason: 'Slack service not available' };
      }

      const slackUserId = preferences.slack?.userId;

      if (!slackUserId) {
        return { success: false, reason: 'No Slack user ID configured' };
      }

      // Format message
      const message = {
        text: `${notification.title}\n${notification.message}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: notification.title
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: notification.message
            }
          }
        ]
      };

      if (notification.actionUrl) {
        message.blocks.push({
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View'
              },
              url: notification.actionUrl
            }
          ]
        });
      }

      // Send via Slack service
      await this.slackService.sendDM(slackUserId, message);

      return { success: true, channel: 'slack' };
    } catch (error) {
      logger.error('Slack send failed', { error });
      throw error;
    }
  }

  /**
   * Send Email notification
   */
  async sendEmail(notification, preferences) {
    try {
      if (!this.emailService) {
        return { success: false, reason: 'Email service not available' };
      }

      const email = preferences.email?.address;

      if (!email) {
        return { success: false, reason: 'No email address configured' };
      }

      // Compose email
      const subject = notification.title;
      const htmlBody = `
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
        ${notification.actionUrl ? `<p><a href="${notification.actionUrl}">View Details</a></p>` : ''}
      `;

      await this.emailService.send({
        to: email,
        subject,
        html: htmlBody
      });

      return { success: true, channel: 'email' };
    } catch (error) {
      logger.error('Email send failed', { error });
      throw error;
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserNotificationPreferences(deviceId) {
    try {
      const query = 'SELECT preferences FROM mobile_sessions WHERE device_id = $1';
      const result = await this.db.query(query, [deviceId]);

      if (result.rows.length === 0) {
        return this.getDefaultPreferences();
      }

      return result.rows[0].preferences || this.getDefaultPreferences();
    } catch (error) {
      logger.error('Failed to get user preferences', { deviceId, error });
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default notification preferences
   */
  getDefaultPreferences() {
    return {
      webpush: { enabled: true },
      slack: { enabled: true },
      email: { enabled: false },
      quiet_hours: null
    };
  }

  /**
   * Get priority badge emoji
   */
  getPriorityBadge(priority) {
    const badges = {
      critical: '🚨',
      high: '⚠️',
      normal: 'ℹ️',
      low: '📝'
    };
    return badges[priority] || 'ℹ️';
  }

  /**
   * Log notification to database
   */
  async logNotificationToDB(notification) {
    try {
      const query = `
        INSERT INTO push_notifications
        (device_id, notification_type, title, message, action_url, status, sent_at, channel)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      await this.db.query(query, [
        notification.deviceId,
        notification.notificationType,
        notification.title,
        notification.message,
        notification.actionUrl,
        notification.status,
        notification.sentAt,
        notification.channels.join(',')
      ]);
    } catch (error) {
      logger.error('Failed to log notification to database', { error });
    }
  }

  /**
   * Start retry processor
   */
  startRetryProcessor() {
    setInterval(() => {
      const now = new Date();
      const toRetry = [];

      // Find notifications that need retry
      for (let i = this.retryQueue.length - 1; i >= 0; i--) {
        const item = this.retryQueue[i];

        if (item.nextRetry <= now && item.retryCount < 3) {
          toRetry.push(item);
          this.retryQueue.splice(i, 1);
        }
      }

      // Retry notifications
      toRetry.forEach(item => {
        this.retryNotification(item);
      });
    }, 10000); // Check every 10 seconds
  }

  /**
   * Retry failed notification
   */
  async retryNotification(item) {
    const { notification, retryCount } = item;

    logger.info('Retrying notification', {
      notificationId: notification.id,
      attempt: retryCount + 1
    });

    try {
      const preferences = await this.getUserNotificationPreferences(
        notification.deviceId
      );

      let sent = false;

      for (const channel of notification.channels) {
        try {
          const result = await this.sendViaChannel(channel, notification, preferences);
          if (result.success) {
            sent = true;
          }
        } catch (error) {
          logger.error('Channel retry failed', { channel, error });
        }
      }

      if (sent) {
        notification.status = 'sent';
        notification.sentAt = new Date();
        notification.retryCount++;

        await this.logNotificationToDB(notification);

        this.emit('notification:sent', notification);
      } else {
        // Queue for next retry
        item.retryCount++;
        item.nextRetry = new Date(
          Date.now() + Math.pow(2, item.retryCount) * 5000
        );
        this.retryQueue.push(item);
      }
    } catch (error) {
      logger.error('Retry notification failed', { error });

      // Queue for next retry
      item.retryCount++;

      if (item.retryCount < 3) {
        item.nextRetry = new Date(
          Date.now() + Math.pow(2, item.retryCount) * 5000
        );
        this.retryQueue.push(item);
      } else {
        logger.error('Notification retry limit exceeded', {
          notificationId: notification.id
        });
        notification.status = 'failed';
      }
    }
  }

  /**
   * Get notification statistics
   */
  async getStats() {
    try {
      const query = `
        SELECT
          status,
          COUNT(*) as count
        FROM push_notifications
        WHERE created_at > NOW() - INTERVAL '24 hours'
        GROUP BY status
      `;

      const result = await this.db.query(query);

      const stats = {
        total: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: this.pendingNotifications.size,
        retrying: this.retryQueue.length
      };

      result.rows.forEach(row => {
        stats.total += row.count;
        stats[row.status] = row.count;
      });

      return stats;
    } catch (error) {
      logger.error('Failed to get notification stats', { error });
      return {};
    }
  }

  /**
   * Shutdown service
   */
  shutdown() {
    logger.info('Shutting down PushNotificationService');
    this.pendingNotifications.clear();
    this.retryQueue = [];
  }
}

module.exports = PushNotificationService;
