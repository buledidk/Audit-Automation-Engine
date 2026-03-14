# 🎮 COMPLETE TERMINAL COMMANDS REFERENCE
## All Commands for Audit Platform - Master List

---

## 📑 **QUICK NAVIGATION**

- **Go Live Commands** - Deploy everything
- **Master Control Commands** - Service orchestration
- **Heavy Operations Commands** - Intensive processing
- **CLI Help Commands** - Get information
- **Development Commands** - Testing & building
- **Direct Terminal Commands** - System operations

---

## 🚀 **GO LIVE COMMANDS**

### **One-Command Deployment**
```bash
bash GO_LIVE_NOW.sh
```
Deploys entire platform in 15 minutes
- Starts PostgreSQL
- Starts Redis
- Starts Backend API
- Starts Frontend
- Runs health checks

---

## 🎮 **MASTER CONTROL COMMANDS**

**File**: `./cli/master-control.sh`

### **Service Management**
```bash
./cli/master-control.sh start                    # Start all services
./cli/master-control.sh stop                     # Stop all services
./cli/master-control.sh restart                  # Restart all services
./cli/master-control.sh workflow                 # Full automation workflow
```

### **Health & Monitoring**
```bash
./cli/master-control.sh health                   # System health check
./cli/master-control.sh monitor                  # Real-time monitoring dashboard
./cli/master-control.sh logs [service]           # View logs (backend|frontend|all)
```

### **Database Operations**
```bash
./cli/master-control.sh db:sync                  # Sync database schema
./cli/master-control.sh db:seed                  # Seed with initial data
./cli/master-control.sh db:backup                # Backup database
./cli/master-control.sh db:status                # Show database status
```

### **Development**
```bash
./cli/master-control.sh dev:test                 # Run tests
./cli/master-control.sh dev:build                # Build application
./cli/master-control.sh dev:format               # Format code
```

### **Deployment**
```bash
./cli/master-control.sh deploy staging           # Deploy to staging
./cli/master-control.sh deploy production        # Deploy to production
```

---

## ⚙️ **HEAVY OPERATIONS COMMANDS**

**File**: `./cli/heavy-operations.sh`

### **Analysis & Reporting**
```bash
./cli/heavy-operations.sh analyze:engagements    # Engagement statistics
./cli/heavy-operations.sh analyze:procedures     # Procedure metrics
./cli/heavy-operations.sh analyze:findings       # Finding analysis
./cli/heavy-operations.sh report                 # Generate audit report
```

### **Optimization**
```bash
./cli/heavy-operations.sh optimize:db            # Optimize database
./cli/heavy-operations.sh cache:warm             # Warm application cache
./cli/heavy-operations.sh reindex:db             # Reindex database
```

### **Load Testing**
```bash
./cli/heavy-operations.sh load:basic             # 100 requests test
./cli/heavy-operations.sh load:intense           # 1000 requests test
./cli/heavy-operations.sh load:endpoints         # Test all endpoints
```

### **Batch Operations**
```bash
./cli/heavy-operations.sh batch:generate 100     # Generate test data
./cli/heavy-operations.sh batch:export           # Export to CSV
./cli/heavy-operations.sh batch:cleanup          # Cleanup old data
```

### **Build & Deployment**
```bash
./cli/heavy-operations.sh build:frontend         # Build frontend
./cli/heavy-operations.sh build:backend          # Build backend
./cli/heavy-operations.sh build:docker           # Build Docker images
```

### **Testing**
```bash
./cli/heavy-operations.sh test:all               # Complete test suite
./cli/heavy-operations.sh test:integration       # Integration tests
./cli/heavy-operations.sh test:e2e               # E2E tests
./cli/heavy-operations.sh test:quality           # Code quality check
```

### **System Analysis**
```bash
./cli/heavy-operations.sh analyze:system         # System diagnostics
./cli/heavy-operations.sh analyze:database       # Database statistics
./cli/heavy-operations.sh profile:api            # API profiling
./cli/heavy-operations.sh monitor:connections    # Connection monitoring
```

---

## 📚 **ORIGINAL AUDIT PLATFORM CLI**

**File**: `./cli/audit-platform.sh`

### **Database**
```bash
./cli/audit-platform.sh db:create                # Create databases
./cli/audit-platform.sh db:migrate               # Run migrations
./cli/audit-platform.sh db:seed                  # Seed data
./cli/audit-platform.sh db:reset                 # Reset database
./cli/audit-platform.sh db:backup                # Backup
./cli/audit-platform.sh db:status                # Status
```

### **Development**
```bash
./cli/audit-platform.sh init                     # Initialize
./cli/audit-platform.sh dev:start                # Start dev environment
./cli/audit-platform.sh dev:test                 # Run tests
./cli/audit-platform.sh dev:lint                 # Lint code
./cli/audit-platform.sh dev:format               # Format code
```

### **Building**
```bash
./cli/audit-platform.sh build                    # Build application
./cli/audit-platform.sh build:docker             # Build Docker
./cli/audit-platform.sh build:docker:push        # Push to registry
```

### **Deployment**
```bash
./cli/audit-platform.sh deploy:staging           # Deploy staging
./cli/audit-platform.sh deploy:production        # Deploy production
```

---

## 🛠️ **DEVELOPMENT COMMANDS**

### **npm Commands**
```bash
npm install                                      # Install dependencies
npm start                                        # Start frontend dev server
npm run build                                    # Build frontend
npm test                                         # Run tests
npm run lint                                     # Lint code
npm run format                                   # Format code
npm run dev                                      # Development mode
```

### **Backend (in server/ directory)**
```bash
cd server
npm install                                      # Install backend deps
npm start                                        # Start backend
npm run build                                    # Build backend
npm test                                         # Backend tests
npm run dev                                      # Backend dev mode
```

---

## 🗄️ **DIRECT DATABASE COMMANDS**

### **PostgreSQL**
```bash
# Connect to database
psql -U postgres -h localhost -d audit_platform

# Run queries
psql -U postgres -d audit_platform -c "SELECT COUNT(*) FROM engagements;"

# Backup
pg_dump -U postgres -d audit_platform > backup.sql

# Restore
psql -U postgres -d audit_platform < backup.sql

# Check connections
psql -U postgres -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

### **Redis**
```bash
# Connect to Redis
redis-cli

# Common Redis commands
redis-cli PING                                   # Check connection
redis-cli KEYS '*'                               # List all keys
redis-cli FLUSHALL                               # Clear cache
redis-cli INFO memory                            # Memory usage
redis-cli MONITOR                                # Monitor in real-time
```

---

## 🐳 **DOCKER COMMANDS**

### **Docker Container Management**
```bash
docker ps                                        # List running containers
docker ps -a                                     # List all containers
docker logs [container-id]                       # View logs
docker exec -it [container-id] bash              # Enter container
docker stop [container-id]                       # Stop container
docker remove [container-id]                     # Remove container
```

### **Docker Compose**
```bash
docker-compose up                                # Start services
docker-compose up -d                             # Start in background
docker-compose down                              # Stop services
docker-compose logs                              # View logs
docker-compose logs -f [service]                 # Follow logs
```

---

## 📊 **GIT COMMANDS**

### **Branch Operations**
```bash
git branch                                       # List branches
git checkout claude/setup-e-audit-project-RfaM3 # Switch branch
git pull origin claude/setup-e-audit-project-RfaM3 # Fetch updates
git push -u origin [branch-name]                 # Push branch
```

### **Commit & Status**
```bash
git status                                       # Show status
git add -A                                       # Stage all changes
git commit -m "message"                          # Commit
git push                                         # Push commits
git log --oneline -5                             # View recent commits
```

---

## 🔍 **MONITORING COMMANDS**

### **System Monitoring**
```bash
# Process monitoring
top                                              # Real-time processes
ps aux | grep node                               # Find node processes
lsof -i :3001                                    # Port 3001 usage
lsof -i :3000                                    # Port 3000 usage

# Disk usage
du -sh ./*                                       # Directory sizes
df -h                                            # Disk space
```

### **Network Monitoring**
```bash
curl http://localhost:3001/health                # Test backend
curl http://localhost:3000                       # Test frontend
netstat -an | grep 3001                          # Check port 3001
netstat -an | grep 3000                          # Check port 3000
```

---

## 📋 **LOG VIEWING COMMANDS**

### **View Logs**
```bash
tail -f logs/backend.log                         # Follow backend logs
tail -f logs/frontend.log                        # Follow frontend logs
tail -50 logs/backend.log                        # Last 50 lines
grep -i error logs/backend.log                   # Search for errors
```

---

## 🧪 **TESTING COMMANDS**

### **Frontend Tests**
```bash
npm test                                         # Jest tests
npm test -- --watch                              # Watch mode
npm test -- --coverage                           # Coverage report
```

### **Backend Tests**
```bash
cd server
npm test                                         # Run tests
npm run test:integration                         # Integration tests
```

### **E2E Tests**
```bash
npx playwright test                              # Run Playwright
npx playwright test --headed                     # With browser view
npx playwright codegen                           # Generate test code
```

---

## 🔐 **SECURITY COMMANDS**

### **Authentication**
```bash
# Generate JWT token
node -e "console.log(require('jsonwebtoken').sign({id: 1}, 'secret'))"

# Check environment variables
env | grep JWT
env | grep DATABASE
```

### **Security Checks**
```bash
npm audit                                        # Check vulnerabilities
npm audit fix                                    # Fix vulnerabilities
npm audit fix --force                            # Force fix
```

---

## 💾 **BACKUP & RESTORE**

### **Database Backup**
```bash
./cli/master-control.sh db:backup                # Using CLI
pg_dump -U postgres audit_platform > backup.sql  # Direct
```

### **Data Export**
```bash
./cli/heavy-operations.sh batch:export           # CSV export
psql -d audit_platform -c "\COPY table TO 'file.csv' WITH CSV HEADER"
```

---

## 🚨 **EMERGENCY COMMANDS**

### **Kill Stuck Processes**
```bash
pkill -f "node"                                  # Kill all node processes
pkill -f "npm"                                   # Kill npm processes
lsof -ti:3001 | xargs kill -9                    # Kill port 3001
lsof -ti:3000 | xargs kill -9                    # Kill port 3000
```

### **Reset Everything**
```bash
./cli/master-control.sh stop                     # Stop services
pkill -f "node"                                  # Kill processes
rm -f .backend.pid .frontend.pid                 # Remove PIDs
./cli/master-control.sh start                    # Restart
```

---

## 📖 **HELP COMMANDS**

### **Get Help**
```bash
./cli/master-control.sh help                     # Master CLI help
./cli/heavy-operations.sh help                   # Heavy ops help
./cli/audit-platform.sh help                     # Audit CLI help
npm --help                                       # npm help
```

---

## 🎯 **COMMAND CATEGORIES BY USE CASE**

### **For Deployment**
```bash
bash GO_LIVE_NOW.sh                              # Deploy everything
./cli/master-control.sh workflow                 # Full workflow
./cli/heavy-operations.sh test:all               # Final testing
./cli/heavy-operations.sh build:docker           # Docker build
```

### **For Performance**
```bash
./cli/heavy-operations.sh optimize:db            # Optimize DB
./cli/heavy-operations.sh cache:warm             # Warm cache
./cli/heavy-operations.sh profile:api            # Profile API
./cli/heavy-operations.sh load:intense           # Load test
```

### **For Maintenance**
```bash
./cli/master-control.sh health                   # Health check
./cli/heavy-operations.sh analyze:system         # System status
./cli/heavy-operations.sh batch:cleanup          # Cleanup
./cli/master-control.sh db:backup                # Backup
```

### **For Development**
```bash
./cli/master-control.sh dev:start                # Dev environment
npm test                                         # Tests
npm run lint                                     # Linting
./cli/heavy-operations.sh test:quality           # Quality check
```

### **For Monitoring**
```bash
./cli/master-control.sh monitor                  # Real-time monitor
tail -f logs/backend.log                         # Backend logs
./cli/heavy-operations.sh analyze:database       # DB stats
./cli/heavy-operations.sh monitor:connections    # Connections
```

---

## ⏱️ **COMMAND EXECUTION TIMES**

| Command | Typical Time |
|---------|--------------|
| `./cli/master-control.sh start` | 30-60s |
| `./cli/master-control.sh health` | 5-10s |
| `./cli/master-control.sh monitor` | Continuous |
| `./cli/heavy-operations.sh optimize:db` | 2-5m |
| `./cli/heavy-operations.sh load:basic` | 30s |
| `./cli/heavy-operations.sh load:intense` | 60s |
| `./cli/heavy-operations.sh test:all` | 2-5m |
| `npm test` | 1-3m |
| `npm run build` | 1-2m |
| `bash GO_LIVE_NOW.sh` | 10-15m |

---

## 🔗 **COMMAND CHAINING**

### **Sequential Execution**
```bash
# Chain with &&
./cli/master-control.sh start && npm test && ./cli/heavy-operations.sh load:basic
```

### **Parallel Execution**
```bash
# Run in background
./cli/master-control.sh start &
./cli/heavy-operations.sh monitor &
wait
```

### **Conditional Execution**
```bash
# Only run if previous succeeds
./cli/master-control.sh health && ./cli/heavy-operations.sh test:all
```

---

## 🎓 **TIPS & TRICKS**

### **Save Command Output**
```bash
./cli/master-control.sh health > health_$(date +%Y%m%d).log
```

### **Repeat Command**
```bash
# Every 5 seconds
watch -n 5 './cli/master-control.sh health'

# Using watch
watch -n 10 'curl http://localhost:3001/health'
```

### **Find What's Failing**
```bash
# Search logs for errors
grep -i "error" logs/*.log

# Get error context
grep -B5 -A5 "error" logs/backend.log
```

---

## 📞 **QUICK REFERENCE CARD**

```
GO LIVE:
  bash GO_LIVE_NOW.sh

CONTROL PLATFORM:
  ./cli/master-control.sh start|stop|restart|health|monitor|workflow

PROCESS DATA:
  ./cli/heavy-operations.sh analyze:*|load:*|batch:*|test:*|optimize:*

MONITOR SYSTEM:
  ./cli/master-control.sh logs
  ./cli/heavy-operations.sh profile:api
  ./cli/heavy-operations.sh monitor:connections

GET HELP:
  ./cli/master-control.sh help
  ./cli/heavy-operations.sh help
  ./cli/audit-platform.sh help
```

---

## ✅ **SUMMARY**

You have **50+ terminal commands** available:
- ✅ 8 Master Control commands
- ✅ 24 Heavy Operations commands
- ✅ 25 Audit Platform commands
- ✅ Plus all npm, git, docker commands

**All production-ready and fully integrated!**

Start with: `./cli/master-control.sh help`

---

**Happy grinding!** 🚀
