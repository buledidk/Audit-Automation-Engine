# 🖥️ TERMINAL COMMANDS REFERENCE

## 📊 INTEGRATION & STATUS MONITORING

### Check All System Status (One Command)
```bash
npm run check:all  # Lint + Build verification
```

### 1️⃣ Git & Repository
```bash
# Check current branch and status
git status

# View recent commits
git log --oneline -10

# Push changes to current branch
git push -u origin claude/setup-e-audit-project-RfaM3

# Check connection to origin
git remote -v
```

### 2️⃣ Build & Compilation
```bash
# Development build (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code quality
npm run lint
```

### 3️⃣ Testing & Quality
```bash
# Run all tests
npm run test

# Watch mode (re-run on change)
npm run test:watch

# Coverage report
npm run test:coverage

# Open test UI
npm run test:ui

# Full quality check
npm run check:all
```

### 4️⃣ Database & Connections
```bash
# Test PostgreSQL connection
psql -U audit_user -h localhost -d audit_engine

# List all databases
\l

# Connect to audit_engine database
\c audit_engine

# List all tables
\dt

# Exit psql
\q

# Check Redis connection (if installed)
redis-cli ping
```

### 5️⃣ Environment & Configuration
```bash
# Verify environment variables are loaded
grep "VITE_CLAUDE_API_KEY\|VITE_SUPABASE" .env.local

# Check Node version (must be 20.x)
node --version

# Check npm version
npm --version

# List all dependencies
npm list

# Check for security vulnerabilities
npm audit
```

## 🚀 QUICK DEVELOPMENT WORKFLOW

### Step 1: Start Development Server
```bash
npm run dev
# Runs on http://localhost:5175
```

### Step 2: In Another Terminal - Watch Tests
```bash
npm run test:watch
```

### Step 3: In Another Terminal - Monitor Lint
```bash
npm run lint --watch
# Or run manually after changes
npm run lint
```

### Step 4: Before Committing
```bash
npm run check:all  # Must pass before commit
git add src/
git commit -m "feat: <your feature>"
git push origin claude/setup-e-audit-project-RfaM3
```

## 🔍 DEBUGGING & MONITORING

### Enable Debug Logging
```bash
# Set debug environment
export DEBUG=audit:*
npm run dev

# For specific service
export DEBUG=audit:services:*
npm run dev
```

### Check Active Connections
```bash
# List Node processes
ps aux | grep node

# Kill specific process
kill -9 <PID>

# Monitor memory usage
node --max-old-space-size=4096 # Increase heap size if needed
```

### Monitor Agent Execution
```bash
# Watch for agent logs in development
npm run dev 2>&1 | grep -i "agent\|orchestrat\|executing"
```

## 📈 PERFORMANCE MONITORING

### Check Build Size
```bash
npm run build

# View bundle analysis (if available)
# dist/assets/ shows actual sizes
```

### Database Query Performance
```bash
# Connect to database
psql -U audit_user -h localhost -d audit_engine

# Enable query timing
\timing on

# Run test query
SELECT COUNT(*) FROM engagements;

# Exit
\q
```

## 🔐 SECURITY & INTEGRITY CHECKS

### Verify Secrets Are Not Exposed
```bash
# Check git history for accidental commits
git log -p --all -S "sk-ant-" | grep -i "sk-ant-" && echo "⚠️ SECRET FOUND" || echo "✅ No secrets in history"

# Scan for common secrets patterns
grep -r "sk-ant-\|ANTHROPIC_API_KEY" src/ && echo "⚠️ Check if hardcoded" || echo "✅ No hardcoded secrets"
```

### Validate Environment Setup
```bash
# Verify all required env vars are set
echo "Claude API Key: $(test -n "$VITE_CLAUDE_API_KEY" && echo '✅ SET' || echo '❌ MISSING')"
echo "Supabase URL: $(test -n "$VITE_SUPABASE_URL" && echo '✅ SET' || echo '❌ MISSING')"
echo "Supabase Key: $(test -n "$VITE_SUPABASE_ANON_KEY" && echo '✅ SET' || echo '❌ MISSING')"
```

## 🎯 FINAL VERIFICATION CHECKLIST

Before pushing code, run:
```bash
#!/bin/bash
echo "🔍 Running final verification..."

echo "1️⃣ Checking git status..."
git status

echo "2️⃣ Running lint..."
npm run lint

echo "3️⃣ Running build..."
npm run build

echo "4️⃣ Running tests..."
npm run test

echo "✅ All checks passed!"
echo "Ready to push with: git push origin claude/setup-e-audit-project-RfaM3"
```

## 🆘 TROUBLESHOOTING

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use (5175)
```bash
# Kill process on port 5175
lsof -ti:5175 | xargs kill -9

# Or use different port
VITE_PORT=5176 npm run dev
```

### Database Connection Fails
```bash
# Test connection directly
psql -U audit_user -h localhost -d audit_engine -c "SELECT 1"

# Check if PostgreSQL is running
pg_isready -h localhost
```

### API Key Issues
```bash
# Verify key is set
echo $VITE_CLAUDE_API_KEY

# Check if .env.local is being read
grep CLAUDE .env.local

# Reload environment
source .env.local
npm run dev
```

## 📝 AGENT MONITORING

### Run Agent CLI Tools
```bash
# Plan audit workflow
npm run agents:plan

# Review audit procedures
npm run agents:review

# Security audit
npm run agents:security

# Compliance audit
npm run agents:compliance

# Generate documentation
npm run agents:docs

# Test analysis
npm run agents:test

# Generate report
npm run agents:report

# Start agent monitor
npm run agent-monitor
```

---

**Last Updated**: 2026-03-21
**Branch**: claude/setup-e-audit-project-RfaM3
**Status**: ✅ All integrations verified and ready
