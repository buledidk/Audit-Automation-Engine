/**
 * StatusBar — Fixed bottom bar showing engagement metrics
 * Completion %, Open Items, Pending Approvals, Agent Alerts, FRC Score, Next Deadline
 */

import { useState, useEffect, useCallback } from 'react';
import { useEventSubscription, useEventBus } from '../hooks/useEventBus';
import { EVENT_TYPES } from '../services/agentEventBus';

const COLORS = {
  bg: '#0A0E17', sidebar: '#0F1622', card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)', text: '#F8F8F8', dim: 'rgba(255,255,255,0.6)',
  faint: 'rgba(255,255,255,0.3)', green: '#66BB6A', red: '#EF5350',
  orange: '#FFA726', blue: '#42A5F5', accent: '#F5A623'
};

function MetricPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '0 12px', borderRight: `1px solid ${COLORS.border}`
    }}>
      <span style={{ color: COLORS.faint, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ color: color || COLORS.text, fontSize: '12px', fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
}

export default function StatusBar({ engagement }) {
  const [alertCount, setAlertCount] = useState(0);
  const { getRecentEvents } = useEventBus();

  const hasEngagement = !!(engagement?.entityName);

  // Count unacknowledged alerts
  useEventSubscription(EVENT_TYPES.FINDING_LOGGED, useCallback(() => {
    setAlertCount(prev => prev + 1);
  }, []));
  useEventSubscription(EVENT_TYPES.CONTROL_FAILED, useCallback(() => {
    setAlertCount(prev => prev + 1);
  }, []));
  useEventSubscription(EVENT_TYPES.DEADLINE_APPROACHING, useCallback(() => {
    setAlertCount(prev => prev + 1);
  }, []));

  // Compute metrics from engagement data
  const metrics = (() => {
    if (!hasEngagement) return null;

    const signOffs = engagement.signOffs || {};
    const fslis = Object.keys(signOffs);
    const totalWPs = Math.max(fslis.length, 14); // Default 14 FSLI areas
    const doneCount = fslis.filter(k => signOffs[k]?.status === 'signed').length;
    const completionPct = totalWPs > 0 ? Math.round((doneCount / totalWPs) * 100) : 0;

    const openItems = totalWPs - doneCount;
    const pendingApprovals = fslis.filter(k =>
      signOffs[k]?.status === 'prepared' && !signOffs[k]?.reviewedBy
    ).length;

    // FRC Score: composite based on available data
    const hasDocumentation = !!(engagement.materiality?.overall_materiality);
    const hasRiskAssessment = !!(engagement.riskAssessments?.length > 0 || engagement.risks);
    const hasTeam = !!(engagement.teamMembers?.length > 0 || engagement.partner);
    const frcBase = 40;
    const frcScore = Math.min(100,
      frcBase +
      (completionPct > 0 ? 15 : 0) +
      (hasDocumentation ? 15 : 0) +
      (hasRiskAssessment ? 15 : 0) +
      (hasTeam ? 15 : 0)
    );

    // Next deadline from FYE
    let nextDeadline = '—';
    const fye = engagement.financialYearEnd;
    if (fye) {
      const fyeDate = new Date(fye);
      const ch = new Date(fyeDate);
      ch.setMonth(ch.getMonth() + 9);
      const now = new Date();
      const daysToFiling = Math.ceil((ch - now) / (1000 * 60 * 60 * 24));
      if (daysToFiling > 0) {
        nextDeadline = `CH: ${daysToFiling}d`;
      } else {
        nextDeadline = 'Overdue';
      }
    }

    return { completionPct, openItems, pendingApprovals, frcScore, nextDeadline };
  })();

  return (
    <div style={{
      height: 36, width: '100%', background: COLORS.sidebar,
      borderTop: `1px solid ${COLORS.border}`, display: 'flex',
      alignItems: 'center', fontSize: '11px', flexShrink: 0, zIndex: 100
    }}>
      {!hasEngagement ? (
        <div style={{ padding: '0 16px', color: COLORS.faint, fontSize: '11px' }}>
          No engagement selected
        </div>
      ) : (
        <>
          <MetricPill
            label="Complete"
            value={`${metrics.completionPct}%`}
            color={metrics.completionPct >= 80 ? COLORS.green : metrics.completionPct >= 50 ? COLORS.orange : COLORS.red}
          />
          <MetricPill
            label="Open"
            value={metrics.openItems}
            color={metrics.openItems === 0 ? COLORS.green : COLORS.text}
          />
          <MetricPill
            label="Pending"
            value={metrics.pendingApprovals}
            color={metrics.pendingApprovals > 0 ? COLORS.orange : COLORS.green}
          />
          <MetricPill
            label="Alerts"
            value={alertCount}
            color={alertCount > 0 ? COLORS.red : COLORS.green}
          />
          <MetricPill
            label="FRC"
            value={metrics.frcScore}
            color={metrics.frcScore >= 80 ? COLORS.green : metrics.frcScore >= 60 ? COLORS.orange : COLORS.red}
          />
          <MetricPill
            label="Deadline"
            value={metrics.nextDeadline}
            color={metrics.nextDeadline === 'Overdue' ? COLORS.red : COLORS.accent}
          />
          <div style={{ flex: 1 }} />
          <div style={{ padding: '0 12px', color: COLORS.faint, fontSize: '10px' }}>
            {engagement.entityName} • FYE {engagement.financialYearEnd || '—'}
          </div>
        </>
      )}
    </div>
  );
}
