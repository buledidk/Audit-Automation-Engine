# 🚀 COMPLETE SYSTEM LAUNCH GUIDE

## Option 1: LAUNCH EVERYTHING WITH ONE COMMAND (Recommended)

```bash
cd /home/user/Audit-Automation-Engine
./scripts/start-all.sh
```

This will automatically:
- Install dependencies
- Launch all 6 services in background
- Show real-time status monitoring
- Output log files to `/tmp/terminal*.log`

---

## Option 2: MANUAL LAUNCH - RUN IN SEPARATE TERMINALS

Open **6 separate terminals** and run these commands (in parallel):

### Terminal 1: Development Server (Main App - port 3000)
```bash
cd /home/user/Audit-Automation-Engine
npm run dev
```
Expected: Application compiles and runs at http://localhost:3000

### Terminal 2: Integration Hub
```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-hub.js
```
Expected: All connectors come online (Slack, GitHub, Email)

### Terminal 3: API Gateway (port 4000)
```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-api.js
```
Expected: API server listens on http://localhost:4000

### Terminal 4: Monitoring Service
```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-monitoring.js
```
Expected: Health checks every 30 seconds

### Terminal 5: Database Sync Engine
```bash
cd /home/user/Audit-Automation-Engine
node scripts/start-sync.js
```
Expected: Real-time database synchronization

### Terminal 6: Status Monitor (Live Dashboard)
```bash
cd /home/user/Audit-Automation-Engine
bash scripts/monitor-all.sh
```
Expected: Live dashboard showing all systems

---

## VERIFY EVERYTHING IS WORKING

### Check API Gateway Health
```bash
curl http://localhost:4000/health
```
Expected: `{"status":"healthy"}`

### Check System Status
```bash
curl http://localhost:4000/api/system/status | jq .
```
Expected: Shows all services online

### Check Integration Status
```bash
curl http://localhost:4000/api/integrations/status | jq .
```
Expected: Shows all connectors connected

### Count Running Services
```bash
ps aux | grep -E "npm run dev|node scripts/start-" | grep -v grep | wc -l
```
Expected: `5` or `6` (depending on if terminal 6 is running)

---

## VIEW LOGS (if running with start-all.sh)

```bash
# Terminal 1 Development Server logs
tail -f /tmp/terminal1.log

# Terminal 2 Integration Hub logs
tail -f /tmp/terminal2.log

# Terminal 3 API Gateway logs
tail -f /tmp/terminal3.log

# Terminal 4 Monitoring logs
tail -f /tmp/terminal4.log

# Terminal 5 Sync Engine logs
tail -f /tmp/terminal5.log

# Terminal 6 Status Monitor logs
tail -f /tmp/terminal6.log
```

---

## STOP ALL SERVICES

```bash
# Kill all node processes
pkill -f "npm run dev" || true
pkill -f "node scripts/" || true
pkill -f "monitor-all.sh" || true

# Verify all stopped
ps aux | grep -E "npm run dev|node scripts/|monitor-all" | grep -v grep
# Should show: (no results)
```

---

## RESTART EVERYTHING

```bash
# Kill all services
pkill -f "npm run dev" || true
pkill -f "node scripts/" || true
pkill -f "monitor-all.sh" || true

# Wait 3 seconds
sleep 3

# Start fresh
./scripts/start-all.sh
```

---

## TROUBLESHOOTING

### Port Already in Use?
```bash
# Find what's using port 3000
lsof -i :3000
# Find what's using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Dependencies Not Installed?
```bash
npm install --legacy-peer-deps
```

### Node modules corrupted?
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Services not syncing?
```bash
# Restart the integration hub
pkill -f "start-hub.js"
node scripts/start-hub.js
```

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAIN APPLICATION (3000)                      │
│                  React UI - Audit Interface                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (4000)                           │
│          Unified REST API - Routes to all services              │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ INTEGRATION  │ │ MONITORING   │ │ SYNC ENGINE  │
│ HUB          │ │ SERVICE      │ │              │
│              │ │              │ │              │
│ • Slack      │ │ • Health     │ │ • Primary DB │
│ • GitHub     │ │   checks     │ │ • Backup DB  │
│ • Email      │ │ • Alerts     │ │ • AWS DB     │
│ • Event Bus  │ │ • Metrics    │ │ • <100ms lag │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   STATUS MONITOR       │
            │   Live Dashboard       │
            └────────────────────────┘
```

---

## KEY ENDPOINTS

- **Main App**: http://localhost:3000
- **API Health**: http://localhost:4000/health
- **System Status**: http://localhost:4000/api/system/status
- **Integration Status**: http://localhost:4000/api/integrations/status

---

## USEFUL COMMANDS

```bash
# View all startup scripts
ls -la scripts/start-*.js scripts/*.sh

# View the plan
cat /root/.claude/plans/agile-twirling-wigderson.md

# Check current branch
git status

# View logs from all terminals
tail -f /tmp/terminal*.log

# Monitor in real-time
watch -n 1 'curl http://localhost:4000/api/system/status | jq .'
```

---

## QUICK REFERENCE

| Service | Port | Command | Script |
|---------|------|---------|--------|
| Dev Server | 3000 | `npm run dev` | N/A |
| Integration Hub | - | `node scripts/start-hub.js` | start-hub.js |
| API Gateway | 4000 | `node scripts/start-api.js` | start-api.js |
| Monitoring | - | `node scripts/start-monitoring.js` | start-monitoring.js |
| Sync Engine | - | `node scripts/start-sync.js` | start-sync.js |
| Status Monitor | - | `bash scripts/monitor-all.sh` | monitor-all.sh |

---

✅ **Everything is ready to launch!**
