/**
 * CommandDispatcher Service - Remote Command Execution
 * Phase 8: Mobile Dispatch & Remote Operations
 *
 * Handles dispatch of commands from mobile clients and other sources.
 * Manages command execution, queuing, timeout handling, and result tracking.
 *
 * Features:
 * - Whitelist-based command execution (security)
 * - Task queuing with priority
 * - Timeout management
 * - Real-time output streaming
 * - Execution history and audit logging
 * - Resource limits per device
 */

const { v4: uuidv4 } = require('uuid');
const { _exec } = require('child_process');
const { spawn } = require('child_process');
const EventEmitter = require('events');
const logger = require('../utils/logger');

class CommandDispatcher extends EventEmitter {
  constructor() {
    super();
    this.jobQueue = [];
    this.activeJobs = new Map(); // jobId -> job object
    this.completedJobs = [];
    this.deviceLimits = new Map(); // deviceId -> { commandsPerHour, activeCommands }
    this.maxConcurrentJobs = 10;
    this.maxQueueSize = 100;
    this.maxCompletedJobsHistory = 1000;
    this.jobTimeout = 300000; // 5 minutes default

    // Whitelist of allowed commands
    this.allowedCommands = {
      'build': { cmd: 'npm run build', timeout: 300000 },
      'test': { cmd: 'npm run test', timeout: 600000 },
      'test:watch': { cmd: 'npm run test:watch', timeout: 0 }, // No timeout for watch mode
      'test:coverage': { cmd: 'npm run test:coverage', timeout: 600000 },
      'dev': { cmd: 'npm run dev', timeout: 0 }, // No timeout for dev server
      'health-check': { cmd: 'bash scripts/health-check.sh', timeout: 30000 },
      'health-full': { cmd: 'curl http://localhost:3001/api/health/full', timeout: 15000 },
      'deploy': { cmd: 'bash BUILD_AND_DEPLOY.sh', timeout: 600000 },
      'git-status': { cmd: 'git status', timeout: 10000 },
      'git-fetch': { cmd: 'git fetch origin', timeout: 60000 },
      'git-pull': { cmd: 'git pull origin main', timeout: 120000 },
      'git-log': { cmd: 'git log -10 --oneline', timeout: 10000 },
      'npm-install': { cmd: 'npm install', timeout: 300000 },
      'agent-monitor': { cmd: 'npm run agent-monitor', timeout: 0 } // Long-running
    };
  }

  /**
   * Initialize command dispatcher
   */
  initialize() {
    logger.info('Initializing CommandDispatcher service');

    // Start job processor
    this.startJobProcessor();

    logger.info('CommandDispatcher service initialized');
  }

  /**
   * Submit a command for execution
   */
  async submitCommand(command, args, options = {}) {
    const {
      deviceId,
      sessionId,
      priority = 0,
      timeout = null,
      maxRetries = 1,
      onOutput = null
    } = options;

    // Validate command
    if (!this.allowedCommands[command]) {
      const error = `Command not allowed: ${command}`;
      logger.warn('Disallowed command attempted', { command, deviceId });
      throw new Error(error);
    }

    // Check device rate limiting
    if (!this.checkDeviceLimit(deviceId)) {
      throw new Error('Command rate limit exceeded for device');
    }

    // Create job
    const job = {
      id: uuidv4(),
      command,
      args,
      status: 'queued',
      priority,
      timeout: timeout || this.allowedCommands[command].timeout,
      maxRetries,
      retryCount: 0,
      deviceId,
      sessionId,
      output: [],
      result: null,
      error: null,
      exitCode: null,
      startTime: null,
      endTime: null,
      createdAt: new Date(),
      onOutput // Callback for streaming output
    };

    // Check queue size
    if (this.jobQueue.length >= this.maxQueueSize) {
      throw new Error('Command queue is full, please try again later');
    }

    // Add to queue
    this.jobQueue.push(job);
    this.jobQueue.sort((a, b) => b.priority - a.priority);

    logger.info('Command submitted to queue', {
      jobId: job.id,
      command,
      deviceId,
      queueSize: this.jobQueue.length
    });

    this.emit('job:queued', job);

    return job;
  }

  /**
   * Process job queue
   */
  startJobProcessor() {
    setInterval(() => {
      // Check if we can process more jobs
      if (this.activeJobs.size >= this.maxConcurrentJobs) {
        return;
      }

      // Get next job from queue
      const job = this.jobQueue.shift();
      if (!job) {
        return;
      }

      this.executeJob(job);
    }, 100); // Check queue every 100ms
  }

  /**
   * Execute a job
   */
  async executeJob(job) {
    job.status = 'running';
    job.startTime = new Date();

    this.activeJobs.set(job.id, job);

    logger.info('Executing command', {
      jobId: job.id,
      command: job.command,
      deviceId: job.deviceId
    });

    this.emit('job:started', job);

    try {
      const cmdInfo = this.allowedCommands[job.command];
      const fullCommand = job.args
        ? `${cmdInfo.cmd} ${job.args}`
        : cmdInfo.cmd;

      // Execute command with spawn for real-time output
      const process = spawn('/bin/bash', ['-c', fullCommand], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let timeout = null;

      // Set timeout if specified
      if (job.timeout > 0) {
        timeout = setTimeout(() => {
          logger.warn('Command timeout', { jobId: job.id, command: job.command });
          process.kill('SIGTERM');
          job.error = 'Command execution timeout';
          job.output.push(`\n[TIMEOUT] Command exceeded ${job.timeout}ms`);
        }, job.timeout);
      }

      // Capture output
      process.stdout.on('data', (data) => {
        const chunk = data.toString();
        job.output.push(chunk);

        if (job.onOutput) {
          job.onOutput({ type: 'stdout', data: chunk });
        }

        // Broadcast to real-time sync if available
        this.emit('job:output', {
          jobId: job.id,
          type: 'stdout',
          data: chunk
        });
      });

      process.stderr.on('data', (data) => {
        const chunk = data.toString();
        job.output.push(chunk);

        if (job.onOutput) {
          job.onOutput({ type: 'stderr', data: chunk });
        }

        this.emit('job:output', {
          jobId: job.id,
          type: 'stderr',
          data: chunk
        });
      });

      // Wait for process to complete
      await new Promise((resolve, _reject) => {
        process.on('close', (exitCode) => {
          if (timeout) clearTimeout(timeout);

          job.exitCode = exitCode;
          job.result = {
            output: job.output.join(''),
            exitCode,
            success: exitCode === 0
          };

          if (exitCode === 0) {
            job.status = 'success';
          } else {
            job.error = `Command failed with exit code ${exitCode}`;
            job.status = 'failed';
          }

          resolve();
        });

        process.on('error', (error) => {
          if (timeout) clearTimeout(timeout);
          logger.error('Process error', { jobId: job.id, error });
          job.error = error.message;
          job.status = 'failed';
          resolve();
        });
      });

    } catch (error) {
      logger.error('Job execution failed', { jobId: job.id, error });
      job.error = error.message;
      job.status = 'failed';
    } finally {
      job.endTime = new Date();
      job.duration = job.endTime - job.startTime;

      this.activeJobs.delete(job.id);

      // Add to completed jobs history
      this.completedJobs.push(job);
      if (this.completedJobs.length > this.maxCompletedJobsHistory) {
        this.completedJobs.shift();
      }

      logger.info('Command execution completed', {
        jobId: job.id,
        command: job.command,
        status: job.status,
        duration: job.duration,
        deviceId: job.deviceId
      });

      this.emit('job:completed', job);

      // Retry if failed and retries remaining
      if (job.status === 'failed' && job.retryCount < job.maxRetries) {
        logger.info('Retrying command', {
          jobId: job.id,
          command: job.command,
          attempt: job.retryCount + 1
        });

        job.retryCount++;
        job.status = 'queued';
        job.output = [];
        job.error = null;
        job.exitCode = null;
        job.startTime = null;
        job.endTime = null;

        this.jobQueue.push(job);
        this.jobQueue.sort((a, b) => b.priority - a.priority);

        this.emit('job:retried', job);
      }
    }
  }

  /**
   * Check device rate limiting
   */
  checkDeviceLimit(deviceId) {
    let limit = this.deviceLimits.get(deviceId);

    if (!limit) {
      limit = {
        commandsPerHour: 100,
        commandsThisHour: 0,
        lastHourStart: new Date(),
        activeCommands: 0
      };
      this.deviceLimits.set(deviceId, limit);
    }

    // Reset hour if needed
    const now = new Date();
    if (now - limit.lastHourStart > 3600000) {
      limit.commandsThisHour = 0;
      limit.lastHourStart = now;
    }

    // Check limits
    if (limit.commandsThisHour >= limit.commandsPerHour) {
      return false;
    }

    if (limit.activeCommands >= 5) { // Max 5 concurrent commands per device
      return false;
    }

    limit.commandsThisHour++;
    limit.activeCommands++;

    return true;
  }

  /**
   * Get job status
   */
  getJobStatus(jobId) {
    // Check active jobs
    if (this.activeJobs.has(jobId)) {
      return this.activeJobs.get(jobId);
    }

    // Check completed jobs
    const completed = this.completedJobs.find(j => j.id === jobId);
    if (completed) {
      return completed;
    }

    // Check queued jobs
    const queued = this.jobQueue.find(j => j.id === jobId);
    if (queued) {
      return queued;
    }

    return null;
  }

  /**
   * Get job history
   */
  getJobHistory(filter = {}) {
    const { deviceId, command, status, limit = 100, offset = 0 } = filter;

    let jobs = [...this.completedJobs];

    if (deviceId) {
      jobs = jobs.filter(j => j.deviceId === deviceId);
    }

    if (command) {
      jobs = jobs.filter(j => j.command === command);
    }

    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }

    // Sort by most recent first
    jobs.sort((a, b) => b.createdAt - a.createdAt);

    return {
      total: jobs.length,
      items: jobs.slice(offset, offset + limit),
      offset,
      limit
    };
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    const running = Array.from(this.activeJobs.values());
    const queued = this.jobQueue;
    const completed = this.completedJobs.slice(-10); // Last 10

    return {
      queued: {
        count: queued.length,
        max: this.maxQueueSize,
        percentFull: (queued.length / this.maxQueueSize) * 100,
        jobs: queued
      },
      running: {
        count: running.length,
        max: this.maxConcurrentJobs,
        percentFull: (running.length / this.maxConcurrentJobs) * 100,
        jobs: running.map(j => ({
          id: j.id,
          command: j.command,
          deviceId: j.deviceId,
          startTime: j.startTime,
          duration: new Date() - j.startTime
        }))
      },
      completed: {
        count: this.completedJobs.length,
        recent: completed.map(j => ({
          id: j.id,
          command: j.command,
          status: j.status,
          deviceId: j.deviceId,
          endTime: j.endTime
        }))
      }
    };
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId) {
    const job = this.activeJobs.get(jobId);

    if (!job) {
      // Try to remove from queue
      const queueIndex = this.jobQueue.findIndex(j => j.id === jobId);
      if (queueIndex > -1) {
        this.jobQueue.splice(queueIndex, 1);
        return true;
      }

      return false;
    }

    job.status = 'cancelled';
    job.error = 'Job cancelled by user';
    logger.info('Job cancelled', { jobId, command: job.command });

    return true;
  }

  /**
   * Get statistics
   */
  getStats() {
    const completed = this.completedJobs;
    const successful = completed.filter(j => j.status === 'success');
    const failed = completed.filter(j => j.status === 'failed');

    const avgDuration = completed.length > 0
      ? completed.reduce((sum, j) => sum + (j.duration || 0), 0) / completed.length
      : 0;

    return {
      queued: this.jobQueue.length,
      active: this.activeJobs.size,
      completed: completed.length,
      successful: successful.length,
      failed: failed.length,
      successRate: completed.length > 0
        ? (successful.length / completed.length) * 100
        : 0,
      averageDuration: avgDuration,
      allowedCommands: Object.keys(this.allowedCommands)
    };
  }

  /**
   * Shutdown dispatcher
   */
  shutdown() {
    logger.info('Shutting down CommandDispatcher service');

    // Cancel all active jobs
    for (const job of this.activeJobs.values()) {
      this.cancelJob(job.id);
    }

    this.jobQueue = [];
    this.activeJobs.clear();
  }
}

module.exports = CommandDispatcher;
