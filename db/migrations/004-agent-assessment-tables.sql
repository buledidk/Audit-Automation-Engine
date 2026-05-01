-- Phase 8.5: Head Agent & Comprehensive Agent Assessment Database Schema
-- Created: March 23, 2026
-- Purpose: Store agent health metrics, incidents, rankings, and performance data

-- Agent Health Metrics Table (time-series data, collected every 30 seconds)
CREATE TABLE IF NOT EXISTS agent_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  agent_type VARCHAR(50),                     -- core, domain, framework
  specialty VARCHAR(100),                     -- Risk, Compliance, Monitoring, etc.
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20),                         -- healthy, degraded, failed
  is_responding BOOLEAN,
  latency_ms INTEGER,
  response_time_avg_ms FLOAT,
  response_time_p95_ms FLOAT,
  response_time_p99_ms FLOAT,
  tasks_completed BIGINT DEFAULT 0,
  tasks_failed INTEGER DEFAULT 0,
  tasks_pending INTEGER DEFAULT 0,
  tasks_total BIGINT DEFAULT 0,
  error_rate FLOAT DEFAULT 0,                 -- percentage 0-100
  success_rate FLOAT DEFAULT 0,               -- percentage 0-100
  cpu_usage FLOAT,                            -- percentage 0-100
  memory_usage_mb INTEGER,
  memory_limit_mb INTEGER,
  memory_usage_percent FLOAT,
  queue_length INTEGER,
  queue_max_length INTEGER,
  workload_level VARCHAR(20),                 -- light, medium, heavy
  health_score FLOAT DEFAULT 100,             -- 0-100 score
  uptime_percent FLOAT DEFAULT 100,
  last_success_at TIMESTAMP,
  last_failure_at TIMESTAMP,
  consecutive_failures INTEGER DEFAULT 0,
  recovery_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (agent_id, timestamp)
);

-- Indexes for agent health metrics (time-series optimized)
CREATE INDEX idx_agent_health_agent_timestamp ON agent_health_metrics(agent_id, timestamp DESC);
CREATE INDEX idx_agent_health_timestamp ON agent_health_metrics(timestamp DESC);
CREATE INDEX idx_agent_health_status ON agent_health_metrics(status);
CREATE INDEX idx_agent_health_agent_id ON agent_health_metrics(agent_id);

-- Agent Incidents Table (failures, timeouts, errors, recoveries)
CREATE TABLE IF NOT EXISTS agent_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  incident_type VARCHAR(50),                  -- failure, timeout, error, memory_spike, cpu_spike, latency_spike
  severity VARCHAR(20),                       -- critical, high, medium, low
  description TEXT,
  error_details JSONB,                        -- Stack trace, error message, context
  affected_tasks JSONB,                       -- Tasks affected by this incident
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  detected_at TIMESTAMP,
  detection_latency_ms INTEGER,               -- How long to detect after occurrence
  recovery_action VARCHAR(100),               -- restart, rebalance, escalate
  recovery_status VARCHAR(20),                -- attempted, succeeded, failed, pending
  recovery_started_at TIMESTAMP,
  recovery_completed_at TIMESTAMP,
  recovery_duration_ms INTEGER,
  root_cause TEXT,                            -- Analysis of root cause
  resolution TEXT,                            -- How it was resolved
  preventive_measures TEXT,                   -- Recommendations to prevent recurrence
  assigned_to VARCHAR(100),                   -- Human assignee if escalated
  status VARCHAR(20) DEFAULT 'open',          -- open, resolved, closed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for incidents
CREATE INDEX idx_agent_incidents_agent_id ON agent_incidents(agent_id);
CREATE INDEX idx_agent_incidents_timestamp ON agent_incidents(timestamp DESC);
CREATE INDEX idx_agent_incidents_severity ON agent_incidents(severity);
CREATE INDEX idx_agent_incidents_status ON agent_incidents(status);

-- Agent Rankings Table (daily performance snapshots)
CREATE TABLE IF NOT EXISTS agent_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  rank INTEGER,                               -- 1-18 ranking
  rank_previous_day INTEGER,                  -- Previous day's rank (for trend)
  rank_change INTEGER,                        -- Change in rank (+/- from previous day)
  success_rate FLOAT,                         -- Tasks completed / all tasks attempted
  failure_rate FLOAT,
  avg_latency_ms FLOAT,
  p95_latency_ms FLOAT,
  p99_latency_ms FLOAT,
  reliability_score FLOAT DEFAULT 100,        -- 0-100: consistency of performance
  efficiency_score FLOAT DEFAULT 100,         -- 0-100: tasks per resource unit
  specialization_score FLOAT DEFAULT 100,     -- 0-100: performance in specialty domain
  trustworthiness_score FLOAT DEFAULT 100,    -- 0-100: used for consensus voting weights
  consistency_score FLOAT DEFAULT 100,        -- 0-100: low variance in performance
  innovation_score FLOAT DEFAULT 100,         -- 0-100: improvement over time
  overall_score FLOAT,                        -- Weighted average of all scores
  trend VARCHAR(20),                          -- improving, stable, degrading
  trend_percent FLOAT,                        -- % change from previous day
  percentile_rank FLOAT,                      -- Percentile vs all agents (0-100)
  tasks_completed BIGINT,
  tasks_failed INTEGER,
  incident_count INTEGER DEFAULT 0,
  critical_incidents INTEGER DEFAULT 0,
  recovery_events INTEGER DEFAULT 0,
  uptime_percent FLOAT DEFAULT 100,
  notes TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint: one ranking per agent per day
CREATE UNIQUE INDEX idx_agent_rankings_date_agent ON agent_rankings(date, agent_id);

-- Indexes for rankings
CREATE INDEX idx_agent_rankings_date ON agent_rankings(date DESC);
CREATE INDEX idx_agent_rankings_rank ON agent_rankings(rank);
CREATE INDEX idx_agent_rankings_overall_score ON agent_rankings(overall_score DESC);
CREATE INDEX idx_agent_rankings_trend ON agent_rankings(trend);

-- Agent Performance Trends Table (weekly/monthly aggregates)
CREATE TABLE IF NOT EXISTS agent_performance_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  period VARCHAR(20),                         -- daily, weekly, monthly
  period_start DATE,
  period_end DATE,
  success_rate_avg FLOAT,
  success_rate_min FLOAT,
  success_rate_max FLOAT,
  latency_avg_ms FLOAT,
  latency_p95_ms FLOAT,
  latency_p99_ms FLOAT,
  reliability_score_avg FLOAT,
  error_rate_avg FLOAT,
  incident_count INTEGER,
  critical_incident_count INTEGER,
  recovery_success_rate FLOAT,
  tasks_completed_total BIGINT,
  tasks_failed_total INTEGER,
  uptime_percent FLOAT,
  trend_direction VARCHAR(20),                -- up, down, stable
  trend_magnitude FLOAT,                      -- percentage change
  anomalies JSONB,                            -- Detected anomalies
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for trends
CREATE INDEX idx_agent_trends_agent_id ON agent_performance_trends(agent_id);
CREATE INDEX idx_agent_trends_period ON agent_performance_trends(period, period_start DESC);

-- Agent Comparison Table (peer comparisons)
CREATE TABLE IF NOT EXISTS agent_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  comparison_agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  comparison_agent_name VARCHAR(200),
  metric VARCHAR(50),                         -- success_rate, latency, reliability, etc.
  agent_value FLOAT,
  comparison_value FLOAT,
  difference FLOAT,
  percent_difference FLOAT,
  agent_percentile FLOAT,                     -- Where agent ranks among similar agents
  category VARCHAR(50),                       -- same_specialty, all_agents, core_agents, etc.
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for comparisons
CREATE INDEX idx_agent_comparison_agent_id ON agent_comparisons(agent_id);
CREATE INDEX idx_agent_comparison_metric ON agent_comparisons(metric);

-- Head Agent State Table (tracks master agent status and decisions)
CREATE TABLE IF NOT EXISTS head_agent_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) DEFAULT 'head-agent',
  status VARCHAR(20) DEFAULT 'healthy',      -- healthy, degraded, failed
  health_score FLOAT DEFAULT 100,
  agents_monitored INTEGER,
  agents_healthy INTEGER,
  agents_degraded INTEGER,
  agents_failed INTEGER,
  total_decisions_made BIGINT DEFAULT 0,
  total_recoveries_attempted BIGINT DEFAULT 0,
  successful_recoveries BIGINT DEFAULT 0,
  failed_recoveries BIGINT DEFAULT 0,
  recovery_success_rate FLOAT,
  last_monitoring_cycle TIMESTAMP,
  monitoring_cycle_duration_ms INTEGER,
  workload_balance_score FLOAT,               -- 0-100: how well balanced are agent loads
  next_monitoring_at TIMESTAMP,
  metadata JSONB,
  decision_log JSONB,                         -- Recent major decisions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for head agent state
CREATE INDEX idx_head_agent_state_updated_at ON head_agent_state(updated_at DESC);
CREATE INDEX idx_head_agent_state_status ON head_agent_state(status);

-- Agent Specialization Table (tracks agent specializations and expertise)
CREATE TABLE IF NOT EXISTS agent_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  specialty VARCHAR(100) NOT NULL,           -- Risk, Compliance, Evidence, etc.
  expertise_level VARCHAR(20),               -- expert, advanced, intermediate, beginner
  success_rate_in_specialty FLOAT,           -- Success rate in specialty domain
  avg_latency_in_specialty_ms FLOAT,
  tasks_completed_in_specialty BIGINT,
  tasks_failed_in_specialty INTEGER,
  expertise_score FLOAT DEFAULT 100,         -- 0-100: measure of expertise
  is_primary_specialty BOOLEAN DEFAULT true,
  alternate_specialties JSONB,               -- Secondary specialties agent can handle
  min_confidence_threshold FLOAT DEFAULT 0.8,-- Minimum confidence to accept tasks
  preferred_workload_percent FLOAT,          -- Ideal percentage of workload for this specialty
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for specializations
CREATE INDEX idx_specialization_agent_id ON agent_specializations(agent_id);
CREATE INDEX idx_specialization_specialty ON agent_specializations(specialty);
CREATE INDEX idx_specialization_expertise_score ON agent_specializations(expertise_score DESC);

-- Agent Workload Distribution Table (tracks task assignments and load balancing)
CREATE TABLE IF NOT EXISTS agent_workload_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  total_assigned INTEGER,
  total_completed INTEGER,
  total_pending INTEGER,
  total_failed INTEGER,
  completion_rate FLOAT,
  avg_task_duration_ms FLOAT,
  workload_percent FLOAT,                    -- % of total workload
  workload_level VARCHAR(20),                -- light, medium, heavy
  max_concurrent_tasks INTEGER,
  current_concurrent_tasks INTEGER,
  queue_wait_time_avg_ms FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workload distribution
CREATE INDEX idx_workload_agent_id ON agent_workload_distribution(agent_id);
CREATE INDEX idx_workload_timestamp ON agent_workload_distribution(timestamp DESC);

-- Agent Recommendation Table (system recommendations for improvements)
CREATE TABLE IF NOT EXISTS agent_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(200),
  recommendation_type VARCHAR(50),           -- optimization, specialization, escalation, recovery
  title VARCHAR(200),
  description TEXT,
  priority VARCHAR(20),                      -- critical, high, medium, low
  expected_improvement TEXT,                 -- What improvement is expected
  action_required VARCHAR(500),              -- What user should do
  estimated_effort VARCHAR(50),              -- low, medium, high
  status VARCHAR(20) DEFAULT 'open',         -- open, in_progress, completed, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Indexes for recommendations
CREATE INDEX idx_agent_recommendations_agent_id ON agent_recommendations(agent_id);
CREATE INDEX idx_agent_recommendations_priority ON agent_recommendations(priority);
CREATE INDEX idx_agent_recommendations_status ON agent_recommendations(status);

-- Row-Level Security (RLS) Policies
ALTER TABLE agent_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent metrics
CREATE POLICY agent_health_metrics_read ON agent_health_metrics
  FOR SELECT USING (true);  -- All authenticated users can view agent metrics

CREATE POLICY agent_incidents_read ON agent_incidents
  FOR SELECT USING (true);  -- All authenticated users can view incidents

-- Create views for common queries
CREATE OR REPLACE VIEW agent_health_summary AS
SELECT
  agent_id,
  agent_name,
  agent_type,
  specialty,
  status,
  health_score,
  success_rate,
  avg(latency_ms) as avg_latency_ms,
  tasks_completed,
  tasks_failed,
  error_rate,
  cpu_usage,
  memory_usage_percent,
  workload_level,
  timestamp
FROM agent_health_metrics
WHERE timestamp > NOW() - INTERVAL '1 minute'
ORDER BY timestamp DESC;

CREATE OR REPLACE VIEW agent_incident_summary AS
SELECT
  agent_id,
  agent_name,
  COUNT(*) as total_incidents,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_incidents,
  COUNT(*) FILTER (WHERE severity = 'high') as high_incidents,
  COUNT(*) FILTER (WHERE recovery_status = 'succeeded') as successful_recoveries,
  COUNT(*) FILTER (WHERE recovery_status = 'failed') as failed_recoveries,
  MAX(timestamp) as last_incident
FROM agent_incidents
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY agent_id, agent_name;

CREATE OR REPLACE VIEW agent_rankings_summary AS
SELECT
  agent_id,
  agent_name,
  rank,
  overall_score,
  success_rate,
  avg_latency_ms,
  reliability_score,
  efficiency_score,
  trend,
  trend_percent,
  recommendations
FROM agent_rankings
WHERE date = CURRENT_DATE
ORDER BY rank ASC;

-- Grant permissions
GRANT SELECT, INSERT ON agent_health_metrics TO app_user;
GRANT SELECT, INSERT, UPDATE ON agent_incidents TO app_user;
GRANT SELECT, INSERT ON agent_rankings TO app_user;
GRANT SELECT, INSERT ON agent_performance_trends TO app_user;
GRANT SELECT, INSERT ON agent_comparisons TO app_user;
GRANT SELECT, INSERT, UPDATE ON head_agent_state TO app_user;
GRANT SELECT, INSERT, UPDATE ON agent_specializations TO app_user;
GRANT SELECT, INSERT ON agent_workload_distribution TO app_user;
GRANT SELECT, INSERT, UPDATE ON agent_recommendations TO app_user;
