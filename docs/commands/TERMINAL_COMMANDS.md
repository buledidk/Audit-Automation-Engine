# 🖥️ TERMINAL COMMANDS - COPY & PASTE REFERENCE

## Quick Setup (Copy & Paste These Commands)

### 1️⃣ BUILD THE SYSTEM
```bash
cd /home/user/Audit-Automation-Engine
bash BUILD_AND_DEPLOY.sh
```

**Expected Output:**
```
✅ BUILD COMPLETE
================================================
✅ All 19 engine files present
✅ Total code: 4,500+ lines
```

---

### 2️⃣ START DEVELOPMENT SERVER
```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  API:     http://localhost:3000/
```

---

### 3️⃣ VERIFY API IS WORKING
```bash
curl http://localhost:3000/api/accuracy/status
```

**Expected Output:**
```json
{
  "success": true,
  "status": "OPERATIONAL",
  "engine": "AuditAccuracyEnhancementEngine v1.0",
  "enhancements": 15,
  "timestamp": "2026-03-22T..."
}
```

---

## 🧪 Testing Commands

### TEST 1: Data Quality Validation
```bash
curl -X POST http://localhost:3000/api/accuracy/data-quality \
  -H "Content-Type: application/json" \
  -d '{
    "auditData": {
      "accounts": [
        {"code": "1000", "balance": 50000},
        {"code": "2000", "balance": 25000}
      ]
    }
  }'
```

### TEST 2: Detect Anomalies
```bash
curl -X POST http://localhost:3000/api/accuracy/anomalies \
  -H "Content-Type: application/json" \
  -d '{
    "auditData": {
      "transactions": [
        {"id": "T1", "amount": 5000},
        {"id": "T2", "amount": -3000},
        {"id": "T3", "amount": 500000}
      ]
    }
  }'
```

### TEST 3: Full Enhancement Analysis
```bash
curl -X POST http://localhost:3000/api/accuracy/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "auditData": {
      "accounts": [
        {"code": "1000", "balance": 50000, "type": "ASSET"},
        {"code": "2000", "balance": 25000, "type": "LIABILITY"}
      ],
      "transactions": [
        {"id": "T1", "amount": 5000, "date": "2026-03-15"},
        {"id": "T2", "amount": -3000, "date": "2026-03-16"}
      ]
    }
  }' | jq '.'
```

**Note:** Pipe to `jq '.'` to pretty-print JSON (install: `npm install -g jq`)

### TEST 4: Check Metrics
```bash
curl http://localhost:3000/api/accuracy/metrics | jq '.'
```

---

## 📁 File & Directory Commands

### View Engine File Structure
```bash
tree src/services/accuracy-enhancements/ -I 'node_modules'
```

### Count Lines of Code
```bash
find src/services/accuracy-enhancements src/api -name "*.js" -exec wc -l {} + | tail -1
```

### List All Enhancement Modules
```bash
ls -la src/services/accuracy-enhancements/ | grep Engine
```

### View Documentation
```bash
cat ACCURACY_ENHANCEMENT_QUICKSTART.md
cat docs/ACCURACY_ENHANCEMENT_ENGINE_GUIDE.md
cat docs/ACCURACY_ENGINE_DEPLOYMENT.md
```

---

## 🔧 Configuration Commands

### Check Environment
```bash
cat .env.local | grep ACCURACY
```

### Update Configuration
```bash
cat >> .env.local << 'EOF'
CONSENSUS_THRESHOLD=0.85
ANOMALY_STD_DEV=3.0
EOF
```

### Set Debug Logging
```bash
export DEBUG=accuracy:*
npm run dev
```

---

## 📊 Monitoring Commands

### Watch Logs
```bash
tail -f logs/accuracy.log
```

### Monitor Performance
```bash
npm run dev -- --profile
```

### Check Port Usage
```bash
lsof -i :3000  # API port
lsof -i :5173  # Frontend port
```

### Kill Process on Port
```bash
kill -9 $(lsof -t -i:3000)  # Kill API
kill -9 $(lsof -t -i:5173)  # Kill frontend
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

### Check Vercel Status
```bash
vercel list
```

---

## 📝 Git Commands

### Initialize Git (if needed)
```bash
git init
git add .
git commit -m "Initial: Audit Accuracy Enhancement Engine v1.0"
```

### Push to Branch (as specified)
```bash
git push -u origin claude/setup-e-audit-project-RfaM3
```

### Check Status
```bash
git status
git log --oneline -5
```

---

## 🧹 Cleanup Commands

### Remove Logs
```bash
rm -rf logs/*
```

### Clear Node Modules (if needed)
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clean Build
```bash
npm run clean
npm run build
```

---

## 🔍 Search Commands

### Find Enhancement References
```bash
grep -r "AuditAccuracyEnhancementEngine" src/
```

### Find API Routes
```bash
grep -r "router.post\|router.get" src/api/
```

### Count Total Functions
```bash
grep -r "async function\|export class" src/services/accuracy-enhancements/ | wc -l
```

### Find TODOs
```bash
grep -r "TODO\|FIXME" src/
```

---

## 📊 Performance Commands

### Measure Execution Time
```bash
time curl -X POST http://localhost:3000/api/accuracy/enhance \
  -H "Content-Type: application/json" \
  -d '{"auditData": {"accounts": [], "transactions": []}}'
```

### Load Testing
```bash
# Install: npm install -g ab
ab -n 100 -c 10 http://localhost:3000/api/accuracy/status
```

### Memory Usage
```bash
ps aux | grep node
```

---

## 🧪 Testing Commands

### Run Unit Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Tests
```bash
npm run test:watch
```

### Lint Code
```bash
npm run lint
```

---

## 📚 Documentation Commands

### Generate Docs
```bash
npm run docs
```

### View in Browser
```bash
open docs/index.html  # macOS
xdg-open docs/index.html  # Linux
start docs/index.html  # Windows
```

---

## 🆘 Help Commands

### View npm Scripts
```bash
npm run
```

### View Node Modules
```bash
npm list
```

### Update Dependencies
```bash
npm update
npm audit fix
```

---

## ⚡ One-Liners for Common Tasks

```bash
# Start dev and watch logs
npm run dev & tail -f logs/accuracy.log

# Test all endpoints
for endpoint in status metrics anomalies fraud-detection; do
  echo "Testing: $endpoint"
  curl -s http://localhost:3000/api/accuracy/$endpoint | jq '.success'
done

# Count total functions
find src -name "*.js" -exec grep -c "function\|class" {} \; | awk '{s+=$1} END {print "Total functions: " s}'

# Verify all files exist
for file in $(cat BUILD_AND_DEPLOY.sh | grep "src/.*\.js" | cut -d'"' -f2); do
  [ -f "$file" ] && echo "✅ $file" || echo "❌ $file"
done
```

---

## 📋 Complete Deployment Checklist

```bash
# Copy and run each line:
echo "1. Building..."
bash BUILD_AND_DEPLOY.sh

echo "2. Testing..."
npm run test

echo "3. Linting..."
npm run lint

echo "4. Building production..."
npm run build

echo "5. Deploying..."
npm run deploy

echo "✅ Complete!"
```

---

## 💡 Pro Tips

### Pretty Print JSON Responses
```bash
alias api-json='jq "." < /dev/stdin'
curl http://localhost:3000/api/accuracy/status | api-json
```

### Save Response to File
```bash
curl -X POST http://localhost:3000/api/accuracy/enhance \
  -d '...' > response.json
```

### Compare Responses
```bash
curl http://localhost:3000/api/accuracy/metrics > before.json
# ... make changes ...
curl http://localhost:3000/api/accuracy/metrics > after.json
diff before.json after.json
```

### Monitor in Real-Time
```bash
watch -n 1 'curl -s http://localhost:3000/api/accuracy/metrics | jq .metrics.accuracy'
```

---

**📍 Remember:** All commands are relative to `/home/user/Audit-Automation-Engine`

**✨ Copy & paste any command above to execute!**
