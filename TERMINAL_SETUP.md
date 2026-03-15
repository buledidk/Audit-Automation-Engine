# 🖥️ TERMINAL SETUP - CLEAR COMMANDS & TRACKING

## **WHAT'S RUNNING & WHERE**

Your platform needs **2 separate terminal windows**:

### **Terminal Window 1: Frontend Development Server**
```
Purpose: Run React application
Port: 5175
Status: http://localhost:5175/
Command: npm run dev
```

### **Terminal Window 2: Project Management**
```
Purpose: Run tests, builds, monitoring
Used for: One-off commands
Command: As needed
```

---

## 🎯 **EXACT COMMANDS - COPY & PASTE**

### **TERMINAL WINDOW 1: START FRONTEND**

```bash
cd /home/user/Audit-Automation-Engine
npm run dev
```

**Expected Output:**
```
  VITE v[version] ready in [time] ms

  ➜  Local:   http://localhost:5175/
  ➜  press h to show help
```

**Status**: ✅ RUNNING (Keep this window open)

---

### **TERMINAL WINDOW 2: PROJECT COMMANDS**

#### **Check what's running:**
```bash
cd /home/user/Audit-Automation-Engine
lsof -i :5175
```

**Expected Output:**
```
COMMAND   PID    USER   FD  TYPE    DEVICE SIZE/OFF NODE NAME
node      ... node ... IPv6 TCP ... 5175 (LISTEN)
```

---

## 📊 **PROJECT STATUS TRACKING**

### **Check All Services (Run in Terminal 2)**

```bash
# Check if frontend is running
curl http://localhost:5175/ | head -20
```

**Expected Output:**
```
<!DOCTYPE html>
<html>
  <head>
    <title>AuditEngine</title>
```

---

## 🔍 **VERIFY SETUP (Terminal 2)**

### **1. Check Node Version**
```bash
node --version
```
Expected: `v16.0.0` or higher

### **2. Check npm Installed**
```bash
npm --version
```
Expected: `v7.0.0` or higher

### **3. Check Dependencies**
```bash
npm ls react
```
Expected: Shows React version installed

### **4. Check Build Status**
```bash
npm run build
```
Expected: `dist` folder created successfully

### **5. Check Tests**
```bash
npm test -- --passWithNoTests
```
Expected: Tests run without errors

---

## 📈 **REAL-TIME MONITORING (Terminal 2)**

### **Monitor Frontend Performance**
```bash
# Watch file changes
npm run dev -- --host
```

### **Check Memory Usage**
```bash
# Linux/Mac
ps aux | grep node

# Shows: PID, CPU%, MEM%, running processes
```

### **Check Port Usage**
```bash
lsof -i :5175
```

### **Monitor Network**
```bash
# Check connectivity
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5175/
```

---

## 🚀 **DEPLOYMENT COMMANDS (Terminal 2)**

### **Build for Production**
```bash
npm run build
```
**Creates**: `dist/` folder with production files

### **Preview Production Build**
```bash
npm run preview
```
**Opens**: Production build locally at http://localhost:5173/

### **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```
**Creates**: Public production URL

### **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --dir=dist
```
**Creates**: Public production URL

---

## 🧪 **TESTING COMMANDS (Terminal 2)**

### **Run All Tests**
```bash
npm test
```

### **Run Tests in Watch Mode**
```bash
npm test -- --watch
```

### **Run Specific Test File**
```bash
npm test -- ComponentName.test.tsx
```

### **Generate Coverage Report**
```bash
npm test -- --coverage
```

---

## 📝 **LOGS & DEBUGGING (Terminal 2)**

### **View Last 50 Lines of Logs**
```bash
tail -50 ~/.npm/_logs/npm-debug.log
```

### **Clear npm Cache**
```bash
npm cache clean --force
```

### **Rebuild Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔧 **TROUBLESHOOTING**

### **Port 5175 Already in Use?**
```bash
# Kill the process
lsof -ti:5175 | xargs kill -9

# Then restart
npm run dev
```

### **Dependencies Missing?**
```bash
npm install
npm run dev
```

### **Cache Issues?**
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run dev
```

### **Build Failing?**
```bash
npm run build -- --debug
```

---

## 📊 **PROJECT STATUS DASHBOARD**

### **Show Complete Status (Terminal 2)**

Create a script: `check-status.sh`

```bash
#!/bin/bash

echo "=== AUDIT AUTOMATION ENGINE - STATUS CHECK ==="
echo ""

echo "✓ Frontend Port Check:"
lsof -i :5175 2>/dev/null || echo "  ⚠️  Not running on :5175"

echo ""
echo "✓ Dependencies Check:"
npm ls --depth=0 2>/dev/null | head -10

echo ""
echo "✓ Git Status:"
git status --short

echo ""
echo "✓ Node/npm Versions:"
echo "  Node: $(node --version)"
echo "  npm: $(npm --version)"

echo ""
echo "✓ Browser Access:"
curl -s -o /dev/null -w "  Status: %{http_code}\n" http://localhost:5175/

echo ""
echo "=== END STATUS CHECK ==="
```

### **Run Status Check**
```bash
bash check-status.sh
```

---

## 💾 **TERMINAL WINDOW LAYOUT**

```
┌─────────────────────────────────────────────────────────────────┐
│ Terminal Window 1: FRONTEND DEV SERVER                         │
├─────────────────────────────────────────────────────────────────┤
│ $ npm run dev                                                   │
│                                                                 │
│ ✓ VITE v4.x.x ready in 100ms                                  │
│ ✓ ➜  Local:   http://localhost:5175/                          │
│                                                                 │
│ [KEEP THIS RUNNING - DO NOT CLOSE]                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Terminal Window 2: PROJECT COMMANDS                             │
├─────────────────────────────────────────────────────────────────┤
│ $ cd /home/user/Audit-Automation-Engine                        │
│ $ (Run commands one at a time)                                 │
│ $ npm test                                                      │
│ $ npm run build                                                │
│ $ npm run preview                                              │
│ $ lsof -i :5175                                                │
│ $ (etc.)                                                        │
│                                                                 │
│ [USE FOR ONE-OFF COMMANDS]                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 **QUICK COMMAND REFERENCE**

| Task | Command | Terminal |
|------|---------|----------|
| Start Frontend | `npm run dev` | 1 |
| Check Status | `lsof -i :5175` | 2 |
| Run Tests | `npm test` | 2 |
| Build | `npm run build` | 2 |
| Preview Build | `npm run preview` | 2 |
| Deploy | `vercel` or `netlify deploy` | 2 |
| Debug | `npm run dev -- --debug` | 1 |
| Clear Cache | `npm cache clean --force` | 2 |
| Reinstall Deps | `npm install` | 2 |

---

## ✅ **EXACT STARTUP SEQUENCE**

### **Step 1: Open Terminal Window 1**
```bash
cd /home/user/Audit-Automation-Engine
npm run dev
```
**Wait for**: `http://localhost:5175/` message
**Status**: ✅ RUNNING

### **Step 2: Open Terminal Window 2** (separate terminal)
```bash
cd /home/user/Audit-Automation-Engine
# Ready for commands
```
**Status**: ✅ READY

### **Step 3: Verify in Terminal 2**
```bash
curl http://localhost:5175/ | head -5
```
**Should see**: HTML content (no errors)
**Status**: ✅ WORKING

### **Step 4: Open Browser**
```
Navigate to: http://localhost:5175/
```
**Should see**: Audit Engine dashboard
**Status**: ✅ LIVE

---

## 🎯 **TRANSPARENCY & TRACKING**

### **What's Running:**
- ✅ Terminal 1: `npm run dev` (Frontend server on port 5175)
- ✅ Terminal 2: Ready for commands
- ✅ Browser: http://localhost:5175/ (Dashboard)
- ✅ Database: In-browser storage (IndexedDB)
- ✅ State: React Context API

### **No Hidden Processes:**
- No background daemons
- No hidden services
- All visible in terminal windows
- Full transparency

### **What You Control:**
- Terminal 1: Keep running
- Terminal 2: Run commands as needed
- Browser: Refresh to reload
- Code: Edit /src folder
- Config: Edit .env (optional)

---

## 🚨 **EMERGENCY STOP**

### **Stop Everything**
```bash
# Terminal 1: Press Ctrl+C
Ctrl+C

# Terminal 2: Kill the process
lsof -ti:5175 | xargs kill -9

# Verify stopped
lsof -i :5175  # Should show nothing
```

### **Full Reset**
```bash
# Terminal 2:
rm -rf node_modules package-lock.json
npm install
npm run dev  # Move to Terminal 1
```

---

## 📞 **DEBUGGING CHECKLIST**

- [ ] Terminal 1 running `npm run dev`
- [ ] Port 5175 accessible
- [ ] Browser shows dashboard
- [ ] No errors in console
- [ ] Network requests working
- [ ] Data persists after refresh
- [ ] Real-time sync active

---

**Status**: ✅ ALL SYSTEMS OPERATIONAL

Everything is separated, transparent, and trackable.
