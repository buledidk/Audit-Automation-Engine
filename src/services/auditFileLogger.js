/**
 * Audit File Logger
 * Appends structured audit trail entries to disk for compliance with ISA 230.
 * Writes to audits/{year}/audit.log as append-only JSONL (one JSON object per line).
 *
 * Usage:
 *   import { auditFileLogger } from './services/auditFileLogger';
 *   auditFileLogger.log({ action: 'engagement:create', user: 'S. Chen', ... });
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

class AuditFileLogger {
  constructor(baseDir = path.join(PROJECT_ROOT, 'audits')) {
    this.baseDir = baseDir;
  }

  /**
   * Append an audit entry to the current year's log file.
   */
  log(entry) {
    const now = new Date();
    const year = now.getFullYear();
    const dir = path.join(this.baseDir, String(year));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const record = {
      id: `AT-${year}-${now.getTime()}`,
      timestamp: now.toISOString(),
      ...entry,
    };

    const logPath = path.join(dir, 'audit.log');
    fs.appendFileSync(logPath, JSON.stringify(record) + '\n');

    return record;
  }

  /**
   * Log an engagement lifecycle event.
   */
  logEngagement(action, engagementId, user, details = {}) {
    return this.log({
      category: 'engagement',
      action,
      engagementId,
      user,
      ...details,
    });
  }

  /**
   * Log a working paper event.
   */
  logWorkingPaper(action, wpRef, engagementId, user, details = {}) {
    return this.log({
      category: 'working-paper',
      action,
      wpRef,
      engagementId,
      user,
      ...details,
    });
  }

  /**
   * Log an export event.
   */
  logExport(format, filename, user, details = {}) {
    return this.log({
      category: 'export',
      action: `export:${format}`,
      filename,
      user,
      ...details,
    });
  }

  /**
   * Log a sign-off event.
   */
  logSignOff(type, wpRef, engagementId, user, details = {}) {
    return this.log({
      category: 'sign-off',
      action: `signoff:${type}`,
      wpRef,
      engagementId,
      user,
      ...details,
    });
  }

  /**
   * Log an authentication event.
   */
  logAuth(action, user, details = {}) {
    return this.log({
      category: 'auth',
      action: `auth:${action}`,
      user,
      ...details,
    });
  }

  /**
   * Read the current year's log entries.
   */
  readLog(year = new Date().getFullYear()) {
    const logPath = path.join(this.baseDir, String(year), 'audit.log');
    if (!fs.existsSync(logPath)) return [];

    return fs.readFileSync(logPath, 'utf-8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
  }

  /**
   * Tail the last N entries from the current year's log.
   */
  tail(n = 20, year = new Date().getFullYear()) {
    const entries = this.readLog(year);
    return entries.slice(-n);
  }

  /**
   * Search log entries by filter function.
   */
  search(filterFn, year = new Date().getFullYear()) {
    return this.readLog(year).filter(filterFn);
  }

  /**
   * Get log file path for a given year.
   */
  getLogPath(year = new Date().getFullYear()) {
    return path.join(this.baseDir, String(year), 'audit.log');
  }
}

export const auditFileLogger = new AuditFileLogger();
export default AuditFileLogger;
