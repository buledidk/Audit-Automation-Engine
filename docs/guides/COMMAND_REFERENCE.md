# 📋 AUDIT ENGINE - COMMAND REFERENCE

**Copy and paste any command below directly into your terminal.**

---

## 🚀 QUICK START (Copy & Paste)

```bash
# Run everything (one command)
bash START_HERE.sh

# Then pick one:
npm run dev           # Start server
npm run test:watch    # Watch tests
npm run build         # Build for production
```

---

## 📦 INSTALLATION & SETUP

```bash
# Install all dependencies
npm install --legacy-peer-deps

# Install specific packages for portal development
npm install axios react-icons react-table recharts react-query

# Install test dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

---

## 🔧 DEVELOPMENT

```bash
# Start development server (hot reload)
npm run dev

# Start with file watcher
npm run dev -- --watch

# Preview production build locally
npm run preview
```

---

## 🧪 TESTING

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-runs on file change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI dashboard
npm run test:ui

# Run specific test file
npm run test -- src/components/ClientOnboarding.test.jsx
```

---

## 📝 CODE QUALITY

```bash
# Run linter (find issues)
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Type check (TypeScript)
npm run type-check

# All checks (lint + type-check + test)
npm run check:all
```

---

## 🏗️ BUILD & DEPLOYMENT

```bash
# Build for production
npm run build

# Build then preview
npm run build && npm run preview

# Build and show bundle size
npm run build -- --debug

# View build output
ls -lh dist/
```

---

## 🐳 DOCKER (For Production)

```bash
# Build Docker image
make docker-build

# Run Docker container
make docker-run

# Stop Docker container
make docker-stop

# View Docker logs
make deploy-logs

# Deploy to staging
make deploy-staging
```

---

## 🗄️ DATABASE (PostgreSQL)

```bash
# Initialize database (requires PostgreSQL installed)
make setup-db

# Initialize and seed
make db-reset

# Run migrations
make db-migrate

# Seed database with sample data
make db-seed

# Backup database
make db-backup

# View database backups
ls -lh backup_*.sql
```

---

## 📅 7-DAY SPRINT COMMANDS

```bash
# Day 1-2: Foundation (Portal + Database)
make sprint-day1-2

# Day 3-4: Components & Integration
make sprint-day3-4

# Day 5-6: Testing & Optimization
make sprint-day5-6

# Day 7: Deployment & Launch
make sprint-day7

# Run entire 7-day sprint at once
make run-all
```

---

## 🔍 UTILITY COMMANDS

```bash
# Check system status
make status

# View version info
make version

# Check recent logs
make logs-view

# Clean up (removes dist, node_modules)
make clean

# Install dependencies
make install

# Update dependencies
make update

# Show all available Make commands
make help
```

---

## 🚨 TROUBLESHOOTING

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies from scratch
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for errors
npm run lint
npm run type-check

# View detailed error in test
npm run test -- --reporter=verbose

# Debug a single test
npm run test -- src/components/AuditAssistant.test.jsx --reporter=verbose
```

---

## 📊 MONITORING & LOGS

```bash
# View application logs
tail -f logs/*.log

# View Docker logs
docker logs audit-engine

# View database logs
tail -f /var/log/postgresql/postgresql.log

# Monitor CPU/memory usage
top -p $(pgrep -f "node")
```

---

## 🔄 GIT & VERSION CONTROL

```bash
# Check git status
git status

# View current branch
git branch

# Commit changes
git commit -m "message"

# Push to current branch
git push origin claude/setup-e-audit-project-RfaM3

# View git log
git log --oneline -10

# See what changed
git diff
```

---

## ⚙️ ENVIRONMENT VARIABLES

```bash
# Create/edit environment file
nano .env.local

# View current environment
cat .env.local

# Set variable for current session
export VITE_CLAUDE_API_KEY="your-key-here"

# Test if variable is set
echo $VITE_CLAUDE_API_KEY
```

---

## 💾 FILE OPERATIONS

```bash
# Create new component directory
mkdir -p src/components/NewComponent

# List all components
ls -la src/components/

# View file contents
cat src/components/AuditEngine.jsx | head -50

# Find all .jsx files
find src -name "*.jsx"

# Search for text in files
grep -r "function" src/components/
```

---

## 🎯 ONE-LINERS (Quick Tasks)

```bash
# Install + build + test in one command
npm install && npm run build && npm run test

# Dev + watch + test at same time
npm run dev & npm run test:watch

# Full setup from scratch
bash START_HERE.sh && npm run dev

# Check everything is working
npm run check:all

# Build production and show output
npm run build && du -sh dist/

# View all available npm scripts
npm run
```

---

## 📱 DEVELOPMENT WORKFLOW

**Recommended sequence when starting:**

```bash
# 1. Initial setup (once)
bash START_HERE.sh

# 2. Every day, start with
npm run dev

# 3. In another terminal, watch tests
npm run test:watch

# 4. Before committing, run quality checks
npm run check:all

# 5. Build and test production
npm run build && npm run preview
```

---

## 🎓 LEARNING TIPS

```bash
# See what npm scripts are available
npm run

# See Makefile targets
make help

# View Makefile commands
cat Makefile | grep "^[a-z]" | head -30

# List all scripts directory
ls -la scripts/

# View available test files
find src -name "*.test.jsx"
```

---

## 🆘 GETTING HELP

```bash
# Show this reference
cat COMMAND_REFERENCE.md

# Show quick start guide
cat QUICK_START.txt

# Show best practices
cat BEST_PRACTICES.md

# Show execution plan
cat SPRINT_PLAN.md

# Ask for help
npm --help
make --help
```

---

**💡 Pro Tip:** Copy any command above directly to your terminal. Don't type—paste!
