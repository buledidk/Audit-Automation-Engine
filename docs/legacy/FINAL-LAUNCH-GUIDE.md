# 🚀 FINAL LAUNCH GUIDE - 3-TERMINAL AUDIT AUTOMATION ENGINE

## ⚡ QUICK START: Copy & Paste These Exact Commands

---

## **TERMINAL 1: BRAIN (Development Server)**

```bash
npm run dev
```

### Expected Output:
```
✅ Compiled successfully
📦 Built for production
🎉 App is running at: http://localhost:3000

📁 Watching for changes in:
  src/components/
  src/services/
  src/api/

🔄 Auto-recompile on save enabled
```

### What it does:
- Starts React development server on **port 3000**
- Loads all **6 AI agents**
- Serves the audit interface
- Auto-recompiles on file changes
- Ready to accept HTTP requests from Terminal 2

**Status: ✅ ONLINE** when you see "App is running at: http://localhost:3000"

---

## **TERMINAL 2: ENGINE (API Gateway + Integration Hub)**

```bash
cd /home/user/Audit-Automation-Engine && node scripts/start-engine.js
```

### Expected Output:
```
╔════════════════════════════════════════════════════════╗
║   🚪 API GATEWAY + INTEGRATION HUB STARTED            ║
║   (TERMINAL 2 - Engine)                              ║
╚════════════════════════════════════════════════════════╝

🔌 Initializing Integration Hub...
✅ Hub initialized

🔗 Initializing Connectors...
   ✅ slack-connector
   ✅ github-connector
   ✅ email-connector

✅ API Gateway ready on http://localhost:4000

📍 Available Endpoints:
   GET  http://localhost:4000/health
   GET  http://localhost:4000/api/system/status
   GET  http://localhost:4000/api/integrations/status
   GET  http://localhost:4000/api/connected-terminals

✅ All services online and communicating
```

### What it does:
- Starts API Gateway on **port 4000**
- Initializes **Integration Hub**
- Loads **Slack, GitHub, Email connectors**
- Routes requests from Terminal 1 to services
- Manages event bus and synchronization
- Communicates with Terminal 3

**Status: ✅ ONLINE** when you see "API Gateway ready on http://localhost:4000"

---

## **TERMINAL 3: WATCHDOG (Monitoring + Sync + Health)**

```bash
cd /home/user/Audit-Automation-Engine && node scripts/start-watchdog.js
```

### Expected Output:
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

### What it does:
- Serves health endpoint on **port 5000**
- Runs health checks every **30 seconds**
- Monitors real-time **database synchronization**
- Checks all **3 terminals are connected**
- Tracks **replication lag (<100ms)**
- Processes event metrics
- Monitors sync operations

**Status: ✅ ONLINE** when you see "All 3 terminals synchronized and communicating"

---

## ✅ VERIFICATION: ALL 3 TERMINALS CONNECTED

Once all 3 terminals show their "ONLINE" status, verify connectivity:

### Test Terminal 1 (Brain)
```bash
curl http://localhost:3000
```
**Expected:** HTML content (React app loads)

### Test Terminal 2 (Engine)
```bash
curl http://localhost:4000/health | jq .
```
**Expected:**
```json
{
  "status": "healthy",
  "component": "api-gateway",
  "timestamp": "2026-03-19T..."
}
```

### Test Terminal 3 (Watchdog)
```bash
curl http://localhost:5000/health | jq .
```
**Expected:**
```json
{
  "status": "healthy",
  "component": "watchdog",
  "monitoring": "active",
  "sync": "active",
  "timestamp": "2026-03-19T..."
}
```

### Test System Status
```bash
curl http://localhost:4000/api/system/status | jq .
```
**Expected:** Shows all services online and queue status

### Test Integrations
```bash
curl http://localhost:4000/api/integrations/status | jq .
```
**Expected:** Shows slack-connector, github-connector, email-connector all ONLINE

### Test Terminal Connectivity (from Engine)
```bash
curl http://localhost:4000/api/connected-terminals | jq .
```
**Expected:** Shows all 3 terminals connected

---

## 🎯 COMPLETE LAUNCH SEQUENCE

### Step 1: Open Terminal 1
```bash
cd /home/user/Audit-Automation-Engine && npm run dev
```
Wait for: `App is running at: http://localhost:3000`

### Step 2: Open Terminal 2
```bash
cd /home/user/Audit-Automation-Engine && node scripts/start-engine.js
```
Wait for: `API Gateway ready on http://localhost:4000`

### Step 3: Open Terminal 3
```bash
cd /home/user/Audit-Automation-Engine && node scripts/start-watchdog.js
```
Wait for: `All 3 terminals synchronized and communicating`

### Step 4: Verify All Connected
From any fourth terminal or your browser:
```bash
curl http://localhost:4000/api/system/status | jq .
curl http://localhost:4000/api/integrations/status | jq .
```

### Step 5: Access the System
Open in your browser:
```
http://localhost:3000
```

---

## 📊 VISUAL SYSTEM DIAGRAM

```
┌──────────────────────────────────────────────────┐
│         TERMINAL 1: BRAIN (port 3000)           │
│                                                  │
│  🎨 React Development Server                     │
│  🤖 6 AI Agents Loaded                           │
│  📊 Audit Interface                              │
│  ✅ Auto-recompile on changes                    │
│                                                  │
│  Status: npm run dev                             │
└───────────────────┬────────────────────────────┘
                    │
                    │ HTTP Requests
                    │ WebSocket
                    ▼
┌──────────────────────────────────────────────────┐
│       TERMINAL 2: ENGINE (port 4000)            │
│                                                  │
│  🚪 API Gateway                                  │
│  🔌 Integration Hub                              │
│  📱 Slack Connector                              │
│  🐙 GitHub Connector                             │
│  ✉️  Email Connector                             │
│  🔄 Event Bus                                    │
│                                                  │
│  Status: node scripts/start-engine.js            │
└───────────────────┬────────────────────────────┘
                    │
                    │ Events & Sync
                    │ Real-time Updates
                    ▼
┌──────────────────────────────────────────────────┐
│      TERMINAL 3: WATCHDOG (port 5000)           │
│                                                  │
│  🏥 Health Monitoring (30s cycles)              │
│  🔄 Database Sync Engine (<100ms lag)           │
│  📊 Terminal Connectivity Checker                │
│  📈 Event Processing Metrics                     │
│  ⚡ Real-time Event Stream                       │
│                                                  │
│  Status: node scripts/start-watchdog.js          │
└──────────────────────────────────────────────────┘

✅ All 3 running simultaneously
✅ Synchronized via event bus
✅ Real-time communication
✅ Fully redundant & healthy
```

---

## 📍 YOUR SYSTEM ENDPOINTS

Once all 3 terminals are running:

### Main Application
- **http://localhost:3000** - React audit interface

### API Gateway Endpoints
- **http://localhost:4000/health** - API health check
- **http://localhost:4000/api/system/status** - System status
- **http://localhost:4000/api/integrations/status** - Integrations status
- **http://localhost:4000/api/connected-terminals** - Terminal connectivity

### Watchdog
- **http://localhost:5000/health** - Watchdog health check

---

## 📊 REAL-TIME MONITORING

### Watch all logs live
```bash
tail -f /tmp/terminal-*.log
```

### Monitor Terminal 1 logs
```bash
tail -f /tmp/terminal-1-brain.log
```

### Monitor Terminal 2 logs
```bash
tail -f /tmp/terminal-2-engine.log
```

### Monitor Terminal 3 logs
```bash
tail -f /tmp/terminal-3-watchdog.log
```

### Watch system status every second
```bash
watch -n 1 'curl http://localhost:4000/api/system/status | jq .'
```

### Monitor connectivity every second
```bash
watch -n 1 'curl http://localhost:4000/api/connected-terminals | jq .'
```

---

## 🛑 STOPPING ALL SERVICES

### Stop all at once
```bash
pkill -f "npm run dev" && \
pkill -f "start-engine.js" && \
pkill -f "start-watchdog.js"
```

### Stop individual terminals
```bash
# Stop Terminal 1 (from that terminal: Ctrl+C)
# Stop Terminal 2 (from that terminal: Ctrl+C)
# Stop Terminal 3 (from that terminal: Ctrl+C)
```

### Verify all stopped
```bash
ps aux | grep -E "npm run dev|start-engine.js|start-watchdog.js" | grep -v grep
# Should show: (no results)
```

---

## 🔄 RESTART ALL SERVICES

From a clean state:

```bash
# Kill all existing processes
pkill -f "npm run dev" || true
pkill -f "start-engine.js" || true
pkill -f "start-watchdog.js" || true

# Wait 2 seconds
sleep 2

# Restart from Terminal 1, 2, 3 (same commands as above)
```

---

## ✅ TROUBLESHOOTING

### Port Already in Use?
```bash
# Find what's using the port
lsof -i :3000    # Terminal 1
lsof -i :4000    # Terminal 2
lsof -i :5000    # Terminal 3

# Kill the process
kill -9 <PID>
```

### Dependencies Not Installed?
```bash
npm install --legacy-peer-deps
```

### Terminal 1 stuck or slow?
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
# Then run: npm run dev
```

### Terminal 2 or 3 not responding?
```bash
# Just restart that terminal with the same command
```

### Check if terminals can reach each other
```bash
# From any terminal, test connectivity to all 3
curl http://localhost:3000           # Terminal 1
curl http://localhost:4000/health    # Terminal 2
curl http://localhost:5000/health    # Terminal 3
```

---

## 🎯 SUCCESS CHECKLIST

Once all running, verify:

- [ ] Terminal 1 shows "App is running at: http://localhost:3000"
- [ ] Terminal 2 shows "API Gateway ready on http://localhost:4000"
- [ ] Terminal 3 shows "All 3 terminals synchronized and communicating"
- [ ] `curl http://localhost:3000` returns HTML
- [ ] `curl http://localhost:4000/health | jq .` returns healthy
- [ ] `curl http://localhost:5000/health | jq .` returns healthy
- [ ] Browser at http://localhost:3000 loads the audit interface
- [ ] Logs show no errors (check `/tmp/terminal-*.log`)

---

## 🎉 YOU'RE READY!

Your **3-Terminal Audit Automation Engine** is:
- ✅ **Configured** with all required services
- ✅ **Synced** with real-time communication
- ✅ **Monitored** with health checks and metrics
- ✅ **Connected** with API gateway routing
- ✅ **Ready** for audit operations

**Start the 3 terminals following the commands above and you're live!**

---

## 📋 QUICK REFERENCE: Copy These Exact Commands

```bash
# TERMINAL 1
cd /home/user/Audit-Automation-Engine && npm run dev

# TERMINAL 2
cd /home/user/Audit-Automation-Engine && node scripts/start-engine.js

# TERMINAL 3
cd /home/user/Audit-Automation-Engine && node scripts/start-watchdog.js

# VERIFY (from any terminal)
curl http://localhost:4000/api/system/status | jq .
```

---

**Let's launch! 🚀**
