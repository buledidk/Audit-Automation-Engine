/**
 * useRealtimeSync Hook - Phase 8
 * Real-time Supabase subscription for agent monitoring & dispatch operations
 * Provides <1s latency updates for mobile dashboard
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';

const POLL_INTERVAL = 3000;
const RECONNECT_DELAY = 5000;

export function useRealtimeSync(tables = [], options = {}) {
  const { onInsert, onUpdate, onDelete, enablePolling = true } = options;
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const channelsRef = useRef([]);
  const pollTimerRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchInitialData = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const results = {};
    for (const table of tables) {
      try {
        const { data: rows, error: fetchError } = await supabase
          .from(table).select('*').order('created_at', { ascending: false }).limit(100);
        if (!fetchError) results[table] = rows || [];
      } catch (err) { // eslint-disable-line no-unused-vars
        results[table] = [];
      }
    }
    if (mountedRef.current) {
      setData(results);
      setLastUpdate(new Date());
    }
  }, [tables]);

  useEffect(() => {
    mountedRef.current = true;
    const supabase = getSupabaseClient();

    if (!isSupabaseConfigured() || !supabase) {
      setTimeout(() => {
        setData(generateDemoData(tables));
        setConnected(false);
      }, 0);
      if (enablePolling) {
        pollTimerRef.current = setInterval(() => {
          if (mountedRef.current) {
            setData(prev => refreshDemoData(prev, tables));
            setLastUpdate(new Date());
          }
        }, POLL_INTERVAL);
      }
      return () => {
        mountedRef.current = false;
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      };
    }

    setTimeout(() => { fetchInitialData(); }, 0);

    tables.forEach(table => {
      const channel = supabase
        .channel('realtime-' + table)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
          if (!mountedRef.current) return;
          setLastUpdate(new Date());
          if (payload.eventType === 'INSERT') {
            setData(prev => ({
              ...prev,
              [table]: [payload.new, ...(prev[table] || [])].slice(0, 100)
            }));
            onInsert?.(table, payload.new);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => ({
              ...prev,
              [table]: (prev[table] || []).map(row =>
                row.id === payload.new.id ? payload.new : row
              )
            }));
            onUpdate?.(table, payload.new, payload.old);
          } else if (payload.eventType === 'DELETE') {
            setData(prev => ({
              ...prev,
              [table]: (prev[table] || []).filter(row => row.id !== payload.old.id)
            }));
            onDelete?.(table, payload.old);
          }
        })
        .subscribe((status) => {
          if (mountedRef.current) {
            setConnected(status === 'SUBSCRIBED');
            if (status === 'CHANNEL_ERROR') {
              setError('Subscription error');
              setTimeout(() => fetchInitialData(), RECONNECT_DELAY);
            }
          }
        });
      channelsRef.current.push(channel);
    });

    return () => {
      mountedRef.current = false;
      channelsRef.current.forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = [];
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [tables.join(','), enablePolling]);

  const refresh = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await fetchInitialData();
    } else {
      setData(prev => refreshDemoData(prev, tables));
      setLastUpdate(new Date());
    }
  }, [fetchInitialData, tables]);

  return { data, connected, lastUpdate, error, refresh };
}

function generateDemoData(tables) {
  const result = {};
  const agents = [
    'RiskAssessmentAgent', 'ComplianceAgent', 'DataValidationAgent',
    'DocumentAnalysisAgent', 'FinancialReviewAgent', 'QualityControlAgent',
    'SamplingAgent', 'ReportingAgent', 'FraudDetectionAgent',
    'MaterialityAgent', 'EvidenceAgent', 'WorkpaperAgent',
    'TimelineAgent', 'CommunicationAgent', 'ArchiveAgent',
    'PlanningAgent', 'AnalyticsAgent', 'SupervisorAgent'
  ];
  tables.forEach(table => {
    if (table === 'agent_health_checks') {
      result[table] = agents.map((name, i) => ({
        id: 'health-' + i, agent_id: 'agent-' + i, agent_name: name,
        status: ['healthy', 'healthy', 'healthy', 'warning', 'healthy'][i % 5],
        cpu_usage: Math.round(20 + Math.random() * 60),
        memory_usage: Math.round(30 + Math.random() * 50),
        response_time_ms: Math.round(50 + Math.random() * 200),
        uptime_seconds: Math.round(3600 + Math.random() * 86400),
        last_heartbeat: new Date().toISOString(),
        error_count: Math.floor(Math.random() * 3),
        created_at: new Date().toISOString()
      }));
    } else if (table === 'dispatch_operations') {
      result[table] = [
        { id: 'op-1', command: 'build', target: 'frontend', status: 'completed', priority: 'high', created_at: new Date(Date.now() - 300000).toISOString() },
        { id: 'op-2', command: 'test', target: 'all', status: 'running', priority: 'medium', created_at: new Date(Date.now() - 120000).toISOString() },
        { id: 'op-3', command: 'deploy', target: 'staging', status: 'queued', priority: 'low', created_at: new Date(Date.now() - 60000).toISOString() },
        { id: 'op-4', command: 'lint', target: 'src', status: 'completed', priority: 'medium', created_at: new Date(Date.now() - 600000).toISOString() },
        { id: 'op-5', command: 'git pull', target: 'main', status: 'completed', priority: 'high', created_at: new Date(Date.now() - 900000).toISOString() }
      ];
    } else if (table === 'agent_incidents') {
      result[table] = [
        { id: 'inc-1', agent_id: 'agent-3', agent_name: 'DataValidationAgent', severity: 'warning', message: 'High memory usage detected', status: 'resolved', created_at: new Date(Date.now() - 1800000).toISOString() },
        { id: 'inc-2', agent_id: 'agent-8', agent_name: 'FraudDetectionAgent', severity: 'info', message: 'Routine health check passed', status: 'resolved', created_at: new Date(Date.now() - 3600000).toISOString() }
      ];
    } else if (table === 'agent_rankings') {
      result[table] = agents.slice(0, 10).map((name, i) => ({
        id: 'rank-' + i, agent_id: 'agent-' + i, agent_name: name,
        overall_score: Math.round(70 + Math.random() * 30),
        reliability_score: Math.round(75 + Math.random() * 25),
        performance_score: Math.round(65 + Math.random() * 35),
        efficiency_score: Math.round(70 + Math.random() * 30),
        rank: i + 1, created_at: new Date().toISOString()
      }));
    } else if (table === 'dispatch_notifications') {
      result[table] = [
        { id: 'notif-1', type: 'success', title: 'Build Complete', message: 'Frontend build succeeded', read: false, created_at: new Date(Date.now() - 60000).toISOString() },
        { id: 'notif-2', type: 'warning', title: 'Agent Warning', message: 'DataValidationAgent high memory', read: true, created_at: new Date(Date.now() - 300000).toISOString() },
        { id: 'notif-3', type: 'info', title: 'Deploy Queued', message: 'Staging deploy scheduled', read: false, created_at: new Date(Date.now() - 120000).toISOString() }
      ];
    } else {
      result[table] = [];
    }
  });
  return result;
}

function refreshDemoData(prev, tables) {
  const updated = { ...prev };
  tables.forEach(table => {
    if (table === 'agent_health_checks' && updated[table]) {
      updated[table] = updated[table].map(agent => ({
        ...agent,
        cpu_usage: Math.max(5, Math.min(95, agent.cpu_usage + Math.round((Math.random() - 0.5) * 10))),
        memory_usage: Math.max(10, Math.min(90, agent.memory_usage + Math.round((Math.random() - 0.5) * 8))),
        response_time_ms: Math.max(20, agent.response_time_ms + Math.round((Math.random() - 0.5) * 40)),
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: agent.uptime_seconds + 3
      }));
    }
  });
  return updated;
}

export default useRealtimeSync;
