# 🚀 3-TERMINAL INTEGRATED SYSTEM SETUP

## Overview

Complete Audit Automation Engine running on **3 synchronized terminals**:

```
TERMINAL 1 (Brain)    ←→    TERMINAL 2 (Engine)    ←→    TERMINAL 3 (Watchdog)
npm run dev (3000)           API Gateway (4000)           Monitoring (5000)
React UI + Agents            Hub + Connectors              Sync + Health
```

---

## Quick Start: One Command

```bash
cd /home/user/Audit-Automation-Engine
./scripts/start-3terminals.sh
```

This script:
- ✅ Installs dependencies
- ✅ Launches all 3 terminals sequentially
- ✅ Verifies connectivity
- ✅ Shows real-time status

**Execution time: ~15-20 seconds to full startup**

---

## Manual Launch (if you prefer 3 separate terminals)

### TERMINAL 1: Brain (Development Server)

```bash
cd /home/user/Audit-Automation-Engine
npm run dev
```

**Expected Output:**
```
✅ Compiled successfully
🎉 App is running at: http://localhost:3000
```

**What it does:**
- Runs React development server
- Loads all 6 AI agents
- Serves audit interface
- Auto-recompiles on changes

---

### TERMINAL 2: Engine (API Gateway + Integration Hub)

```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-engine.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║   🚪 API GATEWAY + INTEGRATION HUB STARTED            ║
╚════════════════════════════════════════════════════════╝

✅ API Gateway ready on http://localhost:4000

📍 Available Endpoints:
   GET  http://localhost:4000/health
   GET  http://localhost:4000/api/system/status
   GET  http://localhost:4000/api/integrations/status
   GET  http://localhost:4000/api/connected-terminals
```

**What it does:**
- Unified REST API gateway on port 4000
- Central integration hub
- Slack, GitHub, Email connectors
- Route all requests to appropriate services
- Manage events and event bus

---

### TERMINAL 3: Watchdog (Monitoring + Sync + Health)

```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-watchdog.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║   🏥 MONITORING + SYNC + HEALTH WATCHDOG STARTED     ║
║   (TERMINAL 3 - Watchdog)                            ║
╚════════════════════════════════════════════════════════╝

📊 WATCHDOG SERVICES:
   ✅ Health Monitoring (30s checks)
   ✅ Database Sync Engine (real-time)
   ✅ Terminal Connectivity Checker

✅ Watchdog health endpoint: http://localhost:5000/health

✅ WATCHDOG FULLY INITIALIZED

🔗 CONNECTED COMPONENTS:
   ✅ Terminal 1 (Brain) - Development Server
   ✅ Terminal 2 (Engine) - API Gateway + Hub
   ✅ Terminal 3 (Watchdog) - This process

🎯 All 3 terminals synchronized and communicating
```

**What it does:**
- Health monitoring every 30 seconds
- Real-time database synchronization
- Checks all 3 terminals are connected
- Replication lag monitoring (<100ms)
- Event processing metrics
- Serves health endpoint on port 5000

---

## Verify Everything is Working

### Test Terminal 1 (Brain)
```bash
curl http://localhost:3000
# Should return HTML content (React app)
```

### Test Terminal 2 (Engine)
```bash
curl http://localhost:4000/health | jq .
# Expected: {"status":"healthy","component":"api-gateway","timestamp":"..."}
```

### Test Terminal 3 (Watchdog)
```bash
curl http://localhost:5000/health | jq .
# Expected: {"status":"healthy","component":"watchdog","monitoring":"active","sync":"active"}
```

### Test System Status
```bash
curl http://localhost:4000/api/system/status | jq .
# Shows all services and queue status
```

### Test Integration Status
```bash
curl http://localhost:4000/api/integrations/status | jq .
# Shows all connectors (Slack, GitHub, Email)
```

### Check Terminal Connectivity
```bash
curl http://localhost:4000/api/connected-terminals | jq .
# Shows status of all 3 terminals
```

---

## View Logs

### Real-time logs from all 3 terminals
```bash
tail -f /tmp/terminal-*.log
```

### Log for each terminal
```bash
tail -f /tmp/terminal-1-brain.log          # Brain (npm dev)
tail -f /tmp/terminal-2-engine.log         # Engine (API + Hub)
tail -f /tmp/terminal-3-watchdog.log       # Watchdog (Monitor + Sync)
```

### Watch specific endpoint
```bash
watch -n 1 'curl http://localhost:4000/api/system/status | jq .'
```

---

## System Architecture

```
┌──────────────────────────────────────────────┐
│       TERMINAL 1: BRAIN (port 3000)          │
│  React UI + 6 AI Agents + Audit Interface    │
└─────────────────────┬────────────────────────┘
                      │
                      │ HTTP Requests
                      │ WebSocket
                      ▼
┌──────────────────────────────────────────────┐
│     TERMINAL 2: ENGINE (port 4000)           │
│  API Gateway + Integration Hub + Connectors  │
│  • Slack Connector                           │
│  • GitHub Connector                          │
│  • Email Connector                           │
└─────────────────────┬────────────────────────┘
                      │
                      │ Events & Sync
                      │ Real-time Updates
                      ▼
┌──────────────────────────────────────────────┐
│    TERMINAL 3: WATCHDOG (port 5000)          │
│  Monitoring + Sync Engine + Health Checks    │
│  • 30s Health Cycles                         │
│  • DB Replication (<100ms)                   │
│  • Event Processing                          │
│  • Terminal Connectivity                     │
└──────────────────────────────────────────────┘

✅ All 3 terminals synced & communicating
```

---

## Commands Reference

### Start Everything
```bash
./scripts/start-3terminals.sh
```

### Start Individual Terminals (separate shells)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
node scripts/start-engine.js
```

**Terminal 3:**
```bash
node scripts/start-watchdog.js
```

### Stop All Services
```bash
pkill -f "npm run dev"
pkill -f "start-engine.js"
pkill -f "start-watchdog.js"
```

### Restart Everything
```bash
# Kill all
pkill -f "npm run dev" || true
pkill -f "start-engine.js" || true
pkill -f "start-watchdog.js" || true

# Wait
sleep 2

# Start
./scripts/start-3terminals.sh
```

---

## Ports Used

| Terminal | Service | Port | Purpose |
|----------|---------|------|---------|
| 1 | Development Server | 3000 | React UI |
| 2 | API Gateway | 4000 | REST API |
| 3 | Watchdog Health | 5000 | Health Check Endpoint |

---

## Troubleshooting

### Port Already in Use?

```bash
# Find what's using a port
lsof -i :3000
lsof -i :4000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Dependencies Missing?

```bash
npm install --legacy-peer-deps
```

### Terminal 1 not starting?

```bash
# Check if port 3000 is free
lsof -i :3000

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Terminal 2 or 3 not responding?

```bash
# Restart just that terminal
pkill -f "start-engine.js"  # or "start-watchdog.js"
node scripts/start-engine.js  # or start-watchdog.js
```

### Check connectivity between terminals

```bash
# From Terminal 2, check if Terminal 1 is running
curl http://localhost:3000

# From Terminal 3, check if Terminal 2 is running
curl http://localhost:4000/health

# From anywhere, test full system
curl http://localhost:4000/api/connected-terminals | jq .
```

---

## Expected Output When All Running

```
✅ Terminal 1 (Brain)     [ONLINE]  http://localhost:3000
✅ Terminal 2 (Engine)    [ONLINE]  http://localhost:4000
✅ Terminal 3 (Watchdog)  [ONLINE]  http://localhost:5000

✨ 3-TERMINAL SYSTEM ARCHITECTURE:

🎨 Development Server (3000) ←→ 🚪 API Gateway (4000) ←→ 🏥 Watchdog (5000)

🎯 All 3 terminals synchronized and communicating
```

---

## Next Steps

1. **Launch:** `./scripts/start-3terminals.sh`
2. **Wait:** 15-20 seconds for full initialization
3. **Access:** Open http://localhost:3000 in browser
4. **Verify:** Check all endpoints are responding
5. **Monitor:** Watch logs with `tail -f /tmp/terminal-*.log`
6. **Audit:** Start using the audit interface

---

**Everything is configured and ready to run! 🚀**
