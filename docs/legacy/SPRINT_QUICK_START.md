# 🚀 7-DAY SPRINT QUICK START GUIDE

**Goal**: Complete portal + database integration for beta launch

**Timeline**: 7 calendar days

**Outcome**: Production-ready system for 5-10 beta customers

---

## ⚡ QUICK START (5 MINUTES)

### 1️⃣ Bootstrap Environment
```bash
# Initialize entire environment (dependencies, DB, scripts)
make bootstrap

# Or manually:
bash scripts/bootstrap-sprint.sh
```

**What it does**:
- ✅ Installs Node.js, PostgreSQL, Docker
- ✅ Creates PostgreSQL user and database
- ✅ Creates all build scripts
- ✅ Sets up environment files
- ✅ Generates database schema

**Time**: ~5 minutes

---

### 2️⃣ Run Full Sprint (7 Days Compressed)
```bash
# Run entire 7-day sprint start to finish
make run-all

# This will:
# - Day 1-2: Build foundation (3/8 portal components + DB)
# - Day 3-4: Build remaining components (5 more) + API integration
# - Day 5-6: Run tests + optimize
# - Day 7: Deploy to staging

# Total time: ~2-3 hours
```

**What happens**:
- Builds 8 portal components
- Initializes PostgreSQL database
- Integrates with 40+ API endpoints
- Runs comprehensive tests
- Deploys to Docker/staging
- Ready for beta launch

---

## 📅 DAY-BY-DAY EXECUTION

### DAY 1-2: Foundation (Portal + Database)

```bash
# Run just Day 1-2
make sprint-day1-2

# Or in detail:

# 1. Setup database
make setup-db

# 2. Initialize database schema
psql -U audit_user -d audit_engine -f scripts/sql/001-init-schema.sql

# 3. Generate first 3 portal components (parallel)
bash scripts/build-components-parallel.sh

# 4. Create database connection module
npm run build:db

# ✅ Complete: Foundation ready
```

**Deliverables**:
- ✅ PostgreSQL database (20+ tables)
- ✅ ClientOnboarding component
- ✅ AuditWorkflow component
- ✅ WorkflowTracker component
- ✅ Database connection module

**Time**: 30-45 minutes

---

### DAY 3-4: Components & Integration

```bash
# Run just Day 3-4
make sprint-day3-4

# Or in detail:

# 1. Generate remaining 5 components (parallel)
npm run build:components

# 2. Build API integration layer
npm run build:api

# 3. Migrate data to PostgreSQL
npm run migrate:postgres

# ✅ Complete: All components + API ready
```

**Deliverables**:
- ✅ ReportGenerator component
- ✅ ComplianceDashboard component
- ✅ EvidenceGallery component
- ✅ SettingsPanel component
- ✅ MetricsViewer component
- ✅ API layer (40+ endpoints)
- ✅ Data persistence in PostgreSQL

**Time**: 30-45 minutes

---

### DAY 5-6: Testing & Optimization

```bash
# Run just Day 5-6
make sprint-day5-6

# Or in detail:

# 1. Run all tests
npm run test -- --coverage

# 2. Run integration tests
npm run test:integration

# 3. Lint and format
npm run lint
npm run format

# 4. Optimize database queries
npm run optimize:db

# 5. Build production bundle
npm run build

# ✅ Complete: Ready for deployment
```

**Deliverables**:
- ✅ Unit tests (80%+ coverage)
- ✅ Integration tests (API flows)
- ✅ Code linting (clean)
- ✅ Database optimization (indexes)
- ✅ Production bundle (<5MB)

**Time**: 45-60 minutes

---

### DAY 7: Deployment & Launch

```bash
# Run just Day 7
make sprint-day7

# Or in detail:

# 1. Build Docker image
make docker-build

# 2. Deploy to staging
make deploy-staging

# 3. Verify health checks
npm run health:check

# 4. Run smoke tests
npm run test:smoke

# ✅ Complete: Beta launch ready
```

**Deliverables**:
- ✅ Docker image (audit-engine:latest)
- ✅ Staging deployment (docker-compose)
- ✅ All services healthy
- ✅ Smoke tests passed
- ✅ Ready for 5-10 beta customers

**Time**: 30 minutes

---

## 🔧 DEVELOPMENT COMMANDS

### Start Development Server
```bash
# Hot-reload development server
make dev

# Runs on: http://localhost:3000
# Watches for changes automatically
```

### Run Tests
```bash
# Run all tests once
make test

# Run tests in watch mode (re-runs on file changes)
make test-watch

# Run only integration tests
make test-integration

# View coverage report
npm run test -- --coverage
```

### Code Quality
```bash
# Lint code
make lint

# Format code
make format

# Fix linting issues
npm run lint -- --fix
```

---

## 🗄️ DATABASE COMMANDS

### Setup & Initialization
```bash
# Initialize PostgreSQL
make db-init

# Run migrations
make db-migrate

# Seed sample data
make db-seed

# Reset database completely
make db-reset
```

### Backup & Restore
```bash
# Backup database
make db-backup
# Creates: backup_YYYYMMDD_HHMMSS.sql

# Restore from backup
psql -U audit_user -d audit_engine < backup_YYYYMMDD_HHMMSS.sql
```

### View Database
```bash
# Connect to PostgreSQL
psql -U audit_user -d audit_engine

# Common queries:
SELECT COUNT(*) FROM audit_trail;  -- View audit trail count
SELECT COUNT(*) FROM evidence;     -- View evidence count
SELECT COUNT(*) FROM clients;      -- View client count

# List all tables:
\dt

# Exit:
\q
```

---

## 🐳 DOCKER COMMANDS

### Build & Run
```bash
# Build Docker image
make docker-build

# Run Docker container
make docker-run

# Stop Docker container
make docker-stop

# View logs
make deploy-logs
```

### Docker Compose
```bash
# Start services
docker-compose -f scripts/docker/docker-compose.staging.yml up -d

# Stop services
docker-compose -f scripts/docker/docker-compose.staging.yml down

# View services status
docker-compose -f scripts/docker/docker-compose.staging.yml ps

# View logs
docker-compose -f scripts/docker/docker-compose.staging.yml logs -f
```

---

## 📦 BUILD & DEPLOYMENT

### Production Build
```bash
# Build optimized bundle
make build

# Check bundle size
npm run build:analyze
```

### Deploy to Staging
```bash
# Full deployment
make deploy-staging

# Just rebuild Docker
make docker-build

# Check deployment status
make status
```

### Deploy to Production (Future)
```bash
# Tag release
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Build and push to registry
docker build -t audit-engine:1.0.0 .
docker push audit-engine:1.0.0

# Deploy with Kubernetes (optional)
kubectl apply -f k8s/deployment.yaml
```

---

## 🔍 MONITORING & STATUS

### Check System Status
```bash
# Overall system status
make status

# Shows:
# - Node.js version
# - PostgreSQL status
# - Docker status
# - Running services
```

### View Logs
```bash
# View recent build logs
make logs-view

# Docker container logs
make deploy-logs

# Application logs
docker-compose -f scripts/docker/docker-compose.staging.yml logs -f app
```

---

## 🚨 TROUBLESHOOTING

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql

# Check connection
psql -U audit_user -d audit_engine -c "SELECT 1;"

# Reset PostgreSQL
sudo systemctl restart postgresql
```

### Docker Issues
```bash
# Check Docker status
docker ps

# Clean up Docker
docker system prune -a

# Rebuild from scratch
make clean
make docker-build
```

### Port Conflicts
```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 5432 (PostgreSQL)
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Database Issues
```bash
# Reset everything
make db-reset

# Verify schema
psql -U audit_user -d audit_engine -c "\dt"

# Check table sizes
psql -U audit_user -d audit_engine -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## 📊 PERFORMANCE MONITORING

### Database Performance
```bash
# Analyze slow queries
npm run optimize:db

# Check indexes
psql -U audit_user -d audit_engine -c "SELECT * FROM pg_indexes;"

# Analyze table
ANALYZE audit_trail;
```

### API Performance
```bash
# Health check
npm run health:check

# Load test (optional)
npm run test:load
```

---

## 🎯 BETA LAUNCH CHECKLIST

Before launching to first 5-10 customers:

```bash
# 1. Run full test suite
make test

# 2. Verify all tests pass
make test-integration

# 3. Deploy to staging
make deploy-staging

# 4. Run smoke tests
npm run test:smoke

# 5. Check logs for errors
make deploy-logs

# 6. Verify all components render
npm run build

# 7. Check API endpoints
curl http://localhost:3000/api/health

# 8. Backup database before launch
make db-backup
```

✅ **Ready to launch!**

---

## 📞 SUPPORT

### Getting Help
```bash
# View available commands
make help

# View status
make status

# View configuration
cat .env.local

# View logs
ls -lth logs/ | head -10
```

### Common Tasks
```bash
# Clean everything and start fresh
make clean && make bootstrap

# Restart all services
make docker-stop && make docker-run

# Full rebuild and deploy
make clean && make bootstrap && make run-all
```

---

## 🚀 NEXT STEPS

After sprint completion:

1. **Beta Launch** (Day 8-14):
   - Onboard 5-10 beta customers
   - Gather feedback
   - Monitor production logs

2. **Iteration** (Week 3):
   - Fix bugs reported by beta users
   - Optimize based on feedback
   - Prepare for Series A

3. **Public Launch** (Week 4):
   - Marketing campaign
   - Expand to 50+ customers
   - Scale infrastructure

---

## 💡 QUICK REFERENCE

| Command | Purpose | Time |
|---------|---------|------|
| `make bootstrap` | Initialize everything | 5m |
| `make run-all` | Full 7-day sprint | 2-3h |
| `make sprint-day1-2` | Day 1-2 only | 30-45m |
| `make sprint-day3-4` | Day 3-4 only | 30-45m |
| `make sprint-day5-6` | Day 5-6 only | 45-60m |
| `make sprint-day7` | Day 7 only | 30m |
| `make dev` | Development server | ∞ |
| `make test` | Run tests | 2-5m |
| `make deploy-staging` | Deploy to staging | 5-10m |

---

## ✅ SUCCESS CRITERIA

- ✅ 8 portal components functional
- ✅ PostgreSQL database persistent
- ✅ 40+ API endpoints operational
- ✅ 95%+ test coverage
- ✅ <500ms response times
- ✅ Docker deployment working
- ✅ All health checks passing
- ✅ Beta-ready documentation

**Congratulations! Your audit automation engine is production-ready!** 🎉
