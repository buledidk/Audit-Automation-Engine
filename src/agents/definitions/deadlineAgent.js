/**
 * Deadline Agent — Filing countdowns (CH 9mo, HMRC 12mo), alerts at 30/14/7/3/1 days
 * ISA 250 (Laws and Regulations)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

const FILING_DEADLINES = {
  companiesHouse: { months: 9, label: 'Companies House Annual Accounts', authority: 'CH' },
  hmrcCorporationTax: { months: 12, label: 'HMRC Corporation Tax Return', authority: 'HMRC' },
  hmrcVAT: { months: 1, label: 'HMRC VAT Return (quarterly)', authority: 'HMRC' },
  annualConfirmation: { months: 12, label: 'Confirmation Statement (CS01)', authority: 'CH' }
};

const ALERT_THRESHOLDS = [30, 14, 7, 3, 1]; // days

export const deadlineAgent = {
  id: 'deadline',
  name: 'Deadline Agent',
  description: 'Tracks Companies House (9 months) and HMRC (12 months) filing deadlines from FYE',
  category: 'operational',
  isaReferences: ['ISA 250'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _alertsSent: new Set(),

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.ENGAGEMENT_UPDATED, () => this._checkDeadlines());
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const { engagement } = context || {};
    if (!engagement?.financialYearEnd) {
      return [{ severity: 'info', message: 'No FYE set — cannot calculate deadlines', isaRef: 'ISA 250', recommendation: 'Set the financial year end in the Planning phase' }];
    }

    const deadlines = this._computeDeadlines(engagement.financialYearEnd);
    return deadlines.map(d => ({
      severity: d.daysRemaining <= 7 ? 'high' : d.daysRemaining <= 30 ? 'medium' : 'low',
      message: d.overdue
        ? `OVERDUE: ${d.label} — ${Math.abs(d.daysRemaining)} days past due`
        : `${d.label}: ${d.daysRemaining} days remaining (${d.dueDate})`,
      isaRef: 'ISA 250',
      recommendation: d.overdue
        ? `Urgent: ${d.authority} filing is overdue — potential penalties apply`
        : d.daysRemaining <= 14
          ? `Finalise ${d.authority} filing urgently`
          : `Track ${d.authority} filing deadline`
    }));
  },

  analyze(data, context) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const fye = data?.fye || context?.engagement?.financialYearEnd;
    if (!fye) {
      this._setStatus('idle');
      return { deadlines: [], error: 'No FYE provided' };
    }

    const deadlines = this._computeDeadlines(fye);
    const customDeadlines = data?.customDeadlines || [];

    // Send alerts for approaching thresholds
    deadlines.forEach(d => {
      ALERT_THRESHOLDS.forEach(threshold => {
        const alertKey = `${d.key}_${threshold}`;
        if (d.daysRemaining <= threshold && d.daysRemaining > 0 && !this._alertsSent.has(alertKey)) {
          this._alertsSent.add(alertKey);
          this._alertCount++;
          if (this._eventBus) {
            this._eventBus.publish(EVENT_TYPES.DEADLINE_APPROACHING, {
              agentId: this.id,
              deadline: d.label,
              authority: d.authority,
              daysRemaining: d.daysRemaining,
              dueDate: d.dueDate,
              description: `${d.label} due in ${d.daysRemaining} days`
            });
          }
        }
      });
    });

    this._setStatus('idle');
    return {
      deadlines: [...deadlines, ...customDeadlines.map(cd => ({
        ...cd, daysRemaining: Math.ceil((new Date(cd.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      }))],
      nextDeadline: deadlines.reduce((min, d) => (!min || d.daysRemaining < min.daysRemaining) ? d : min, null),
      overdueCount: deadlines.filter(d => d.overdue).length
    };
  },

  _computeDeadlines(fye) {
    const fyeDate = new Date(fye);
    const now = new Date();

    return Object.entries(FILING_DEADLINES).map(([key, config]) => {
      const dueDate = new Date(fyeDate);
      dueDate.setMonth(dueDate.getMonth() + config.months);
      const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      return {
        key,
        label: config.label,
        authority: config.authority,
        dueDate: dueDate.toISOString().split('T')[0],
        daysRemaining,
        overdue: daysRemaining < 0
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
  },

  _checkDeadlines() {
    this._status = 'thinking';
    setTimeout(() => { this._status = 'idle'; }, 300);
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
