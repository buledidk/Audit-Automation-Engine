-- Phase 8: Mobile Dispatch & Remote Operations Database Schema
-- Created: March 23, 2026
-- Purpose: Store dispatch operations, push notifications, and mobile session data

-- Dispatch Operations Table (tracks all mobile/remote command executions)
CREATE TABLE IF NOT EXISTS dispatch_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR(50) NOT NULL,        -- build, test, deploy, health-check, git, etc.
  command VARCHAR(500) NOT NULL,
  arguments JSONB,                             -- Command arguments as JSON
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, running, success, failed, cancelled
  triggered_by VARCHAR(100),                  -- mobile, slack, api, scheduled, cli
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  output TEXT,                                -- Complete command output
  result JSONB,                               -- Structured result data
  error_message TEXT,                         -- Error details if failed
  exit_code INTEGER,
  duration_ms INTEGER,                        -- Total execution time in milliseconds
  device_id VARCHAR(100),                     -- Mobile device identifier (fingerprint)
  device_type VARCHAR(50),                    -- web, ios, android, slack, etc.
  session_id VARCHAR(100),                    -- User session identifier
  context JSONB,                              -- Full context/state at execution time
  git_commit VARCHAR(40),                     -- Current git commit hash
  branch VARCHAR(100),                        -- Current git branch
  environment VARCHAR(50),                    -- development, staging, production
  user_agent TEXT,                            -- Mobile browser/client user agent
  ip_address VARCHAR(45),                     -- Client IP address
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast queries
CREATE INDEX idx_dispatch_operation_type ON dispatch_operations(operation_type);
CREATE INDEX idx_dispatch_status ON dispatch_operations(status);
CREATE INDEX idx_dispatch_triggered_at ON dispatch_operations(triggered_at DESC);
CREATE INDEX idx_dispatch_device_id ON dispatch_operations(device_id);
CREATE INDEX idx_dispatch_session_id ON dispatch_operations(session_id);
CREATE INDEX idx_dispatch_created_at ON dispatch_operations(created_at DESC);

-- Push Notifications Table (tracks all push notifications sent to users)
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(100) NOT NULL,            -- Target device
  notification_type VARCHAR(50),              -- build_failure, test_failure, deployment, alert, etc.
  title VARCHAR(200),
  message TEXT,
  action_url VARCHAR(500),                    -- URL to navigate to on click
  action_data JSONB,                          -- Additional action payload
  status VARCHAR(20) DEFAULT 'pending',       -- pending, sent, delivered, failed, read
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  failed_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  channel VARCHAR(50),                        -- web_push, slack, email, sms
  priority VARCHAR(20) DEFAULT 'normal',      -- critical, high, normal, low
  expiry_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for push notifications
CREATE INDEX idx_push_device_id ON push_notifications(device_id);
CREATE INDEX idx_push_status ON push_notifications(status);
CREATE INDEX idx_push_created_at ON push_notifications(created_at DESC);
CREATE INDEX idx_push_notification_type ON push_notifications(notification_type);

-- Mobile Sessions Table (tracks active mobile user sessions)
CREATE TABLE IF NOT EXISTS mobile_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(100) NOT NULL UNIQUE,    -- Device fingerprint/ID
  device_type VARCHAR(50),                    -- web, ios, android
  device_name VARCHAR(200),                   -- Device name for user recognition
  user_agent TEXT,
  last_seen_ip VARCHAR(45),
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  auth_token VARCHAR(500),                    -- JWT token
  refresh_token VARCHAR(500),
  token_expires_at TIMESTAMP,
  websocket_connected BOOLEAN DEFAULT false,
  websocket_id VARCHAR(100),                  -- WebSocket connection ID
  preferences JSONB,                          -- User preferences (notifications, etc.)
  metadata JSONB,                             -- Additional device metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for mobile sessions
CREATE INDEX idx_mobile_session_device_id ON mobile_sessions(device_id);
CREATE INDEX idx_mobile_session_last_active ON mobile_sessions(last_active DESC);
CREATE INDEX idx_mobile_session_is_active ON mobile_sessions(is_active);

-- Command Queue Table (pending commands to be executed)
CREATE TABLE IF NOT EXISTS command_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command VARCHAR(500) NOT NULL,
  arguments JSONB,
  priority INTEGER DEFAULT 0,                 -- Higher number = higher priority
  status VARCHAR(20) DEFAULT 'queued',        -- queued, processing, completed, failed
  max_retries INTEGER DEFAULT 3,
  retry_count INTEGER DEFAULT 0,
  requested_by VARCHAR(100),
  device_id VARCHAR(100),
  timeout_seconds INTEGER DEFAULT 300,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  dispatch_operation_id UUID REFERENCES dispatch_operations(id) ON DELETE SET NULL
);

-- Indexes for command queue
CREATE INDEX idx_command_queue_status ON command_queue(status);
CREATE INDEX idx_command_queue_priority ON command_queue(priority DESC);
CREATE INDEX idx_command_queue_created_at ON command_queue(created_at ASC);

-- Dispatch History/Audit Log Table (immutable log of all operations)
CREATE TABLE IF NOT EXISTS dispatch_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_operation_id UUID REFERENCES dispatch_operations(id) ON DELETE CASCADE,
  operation_type VARCHAR(50),
  action VARCHAR(100),                       -- created, started, completed, failed, cancelled
  previous_status VARCHAR(20),
  new_status VARCHAR(20),
  change_details JSONB,
  triggered_by VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit log
CREATE INDEX idx_dispatch_audit_operation_id ON dispatch_audit_log(dispatch_operation_id);
CREATE INDEX idx_dispatch_audit_timestamp ON dispatch_audit_log(timestamp DESC);

-- WebSocket Connections Table (track active WebSocket connections)
CREATE TABLE IF NOT EXISTS websocket_connections (
  id VARCHAR(100) PRIMARY KEY,                -- WebSocket ID
  device_id VARCHAR(100) NOT NULL,
  connection_type VARCHAR(50),                -- mobile, web, cli
  ip_address VARCHAR(45),
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscriptions JSONB,                        -- Events subscribed to (status, notifications, etc.)
  is_connected BOOLEAN DEFAULT true,
  metadata JSONB
);

-- Indexes for WebSocket connections
CREATE INDEX idx_websocket_device_id ON websocket_connections(device_id);
CREATE INDEX idx_websocket_connected_at ON websocket_connections(connected_at DESC);
CREATE INDEX idx_websocket_is_connected ON websocket_connections(is_connected);

-- Row-Level Security (RLS) Policies
ALTER TABLE dispatch_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE command_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own dispatch operations
CREATE POLICY dispatch_operations_isolation ON dispatch_operations
  FOR SELECT USING (device_id = current_setting('app.current_device_id', true)::text OR current_user = 'admin');

CREATE POLICY dispatch_operations_insert ON dispatch_operations
  FOR INSERT WITH CHECK (device_id = current_setting('app.current_device_id', true)::text OR current_user = 'admin');

-- Similar policies for other tables
CREATE POLICY push_notifications_isolation ON push_notifications
  FOR SELECT USING (device_id = current_setting('app.current_device_id', true)::text OR current_user = 'admin');

CREATE POLICY mobile_sessions_isolation ON mobile_sessions
  FOR SELECT USING (device_id = current_setting('app.current_device_id', true)::text OR current_user = 'admin');

-- Create views for common queries
CREATE OR REPLACE VIEW dispatch_operations_summary AS
SELECT
  DATE(triggered_at) as date,
  operation_type,
  status,
  COUNT(*) as count,
  AVG(duration_ms) as avg_duration,
  MAX(duration_ms) as max_duration,
  MIN(duration_ms) as min_duration,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END)::float / COUNT(*) * 100 as failure_rate
FROM dispatch_operations
GROUP BY DATE(triggered_at), operation_type, status;

CREATE OR REPLACE VIEW recent_push_notifications AS
SELECT
  id,
  device_id,
  notification_type,
  title,
  status,
  sent_at,
  delivered_at,
  created_at
FROM push_notifications
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Data retention policy for dispatch operations (keep for 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_dispatch_operations()
RETURNS void AS $$
BEGIN
  DELETE FROM dispatch_operations
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND status IN ('success', 'failed', 'cancelled');
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON dispatch_operations TO app_user;
GRANT SELECT, INSERT, UPDATE ON push_notifications TO app_user;
GRANT SELECT, INSERT, UPDATE ON mobile_sessions TO app_user;
GRANT SELECT, INSERT ON dispatch_audit_log TO app_user;
GRANT SELECT, INSERT, UPDATE ON command_queue TO app_user;
GRANT SELECT, INSERT, UPDATE ON websocket_connections TO app_user;
