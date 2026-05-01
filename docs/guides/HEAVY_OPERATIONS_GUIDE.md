# 🔥 HEAVY OPERATIONS GUIDE
## Intensive Terminal Commands for Audit Platform

**Complete reference for all heavy processing commands**

---

## 📋 **COMMAND CATEGORIES**

### **1. ANALYSIS & REPORTING**
Deep data analysis and report generation

### **2. OPTIMIZATION**
Database and application performance tuning

### **3. LOAD TESTING**
Stress testing and performance benchmarks

### **4. BATCH OPERATIONS**
Bulk data processing and migrations

### **5. BUILD & DEPLOYMENT**
Compilation and containerization

### **6. TESTING**
Full test suite execution

### **7. SYSTEM ANALYSIS**
System resources and diagnostics

---

## 🚀 **QUICK START**

```bash
# Make script executable
chmod +x cli/heavy-operations.sh

# View all commands
./cli/heavy-operations.sh help

# Run a command
./cli/heavy-operations.sh [command] [options]
```

---

## 📊 **ANALYSIS COMMANDS**

### **1. Analyze Engagements**
```bash
./cli/heavy-operations.sh analyze:engagements
```

**What it does**:
- Count total engagements by status
- Show average hours per engagement
- Display materiality ranges
- Breakdown by jurisdiction
- Breakdown by framework

**Output**:
```
Total Engagements: 245
├─ Planning: 45
├─ Fieldwork: 120
├─ Review: 65
└─ Completed: 15

By Jurisdiction:
├─ UK: 150 (avg 185 hours)
├─ DE: 60 (avg 210 hours)
└─ FR: 35 (avg 195 hours)
```

**Use when**: Monthly/quarterly reporting, trend analysis

---

### **2. Analyze Procedures**
```bash
./cli/heavy-operations.sh analyze:procedures
```

**What it does**:
- Total procedure count
- Completion rates by FSLI
- Average hours analysis
- Status breakdown

**Output**:
```
Total Procedures: 2,450
├─ Completed: 1,840 (75%)
├─ In Progress: 480 (19%)
└─ Not Started: 130 (6%)

By FSLI:
├─ Revenue: 380 procedures (95% completed)
├─ Receivables: 290 procedures (88% completed)
└─ Inventory: 245 procedures (71% completed)
```

**Use when**: Audit progress tracking, bottleneck identification

---

### **3. Analyze Findings**
```bash
./cli/heavy-operations.sh analyze:findings
```

**What it does**:
- Finding counts by severity
- Total impact amount
- Open vs closed findings
- Breakdown by FSLI

**Output**:
```
Total Findings: 85
├─ Critical: 5
├─ High: 18
├─ Medium: 35
└─ Low: 27

Open Findings: 28
Total Impact: £2,450,000
```

**Use when**: Risk dashboard, findings tracking, impact analysis

---

### **4. Generate Audit Report**
```bash
./cli/heavy-operations.sh report
```

**What it does**:
- Generates comprehensive audit summary
- Statistics from all tables
- Timeline analysis
- Exports to `reports/` folder

**Output file**: `reports/audit_report_20240115_143025.txt`

**Use when**: Executive reporting, audit file preparation

---

## ⚙️ **OPTIMIZATION COMMANDS**

### **1. Optimize Database**
```bash
./cli/heavy-operations.sh optimize:db
```

**What it does**:
- Runs VACUUM (reclaims space)
- Runs ANALYZE (updates statistics)
- Optimizes indexes
- Duration: 2-5 minutes

**Use when**: Regular maintenance (monthly), database performance degradation

---

### **2. Warm Cache**
```bash
./cli/heavy-operations.sh cache:warm
```

**What it does**:
- Preloads jurisdictions
- Preloads frameworks
- Preloads recent engagements
- Primes Redis cache

**Use when**: After restart, before heavy usage

---

### **3. Reindex Database**
```bash
./cli/heavy-operations.sh reindex:db
```

**What it does**:
- Rebuilds all indexes
- Optimizes query performance
- Duration: 1-3 minutes

**Use when**: Slow queries, after large data import

---

## 🔨 **LOAD TESTING COMMANDS**

### **1. Basic Load Test (100 requests)**
```bash
./cli/heavy-operations.sh load:basic
```

**What it does**:
- 100 concurrent requests
- 10 concurrent connections
- Measures response times
- Shows success/failure rates

**Output**:
```
Requests per second: 45.2
Average response time: 22ms
Failed requests: 0
Max response time: 85ms
```

**Use when**: Sanity check before deployment

**Requirements**: Apache Bench (`brew install httpd`)

---

### **2. Intense Load Test (1000 requests)**
```bash
./cli/heavy-operations.sh load:intense
```

**What it does**:
- 1000 requests
- 50 concurrent connections
- Stress tests backend
- Measures throughput under load

**Output**:
```
Requests per second: 38.5
Average response time: 130ms
Failed requests: 2
```

**Use when**: Capacity planning, performance validation

**Duration**: 30-60 seconds

---

### **3. Endpoint Load Testing**
```bash
./cli/heavy-operations.sh load:endpoints
```

**What it does**:
- Tests multiple API endpoints
- 100 requests per endpoint
- Identifies bottleneck endpoints

**Endpoints tested**:
- `/health`
- `/api/jurisdictions`
- `/api/engagements`

**Use when**: Endpoint-specific performance issues

---

## 📦 **BATCH OPERATIONS**

### **1. Generate Test Data**
```bash
# Generate 100 test engagements
./cli/heavy-operations.sh batch:generate 100

# Generate 1000 test engagements
./cli/heavy-operations.sh batch:generate 1000

# Generate 10000 test engagements
./cli/heavy-operations.sh batch:generate 10000
```

**What it does**:
- Creates test entities
- Creates test engagements
- Populates with realistic data
- Duration: proportional to count

**Use when**:
- Load testing preparation
- Performance benchmarking
- UAT data setup

**Example output**:
```
Generated 1000 test engagements
├─ 500 UK entities (FRS102)
└─ 500 DE entities (IFRS)
```

---

### **2. Export All Data**
```bash
./cli/heavy-operations.sh batch:export
```

**What it does**:
- Exports to CSV format
- Creates `exports/` folder
- Exports:
  - engagements_20240115.csv
  - procedures_20240115.csv
  - findings_20240115.csv
  - evidence_20240115.csv

**Use when**: Backup, external analysis, data migration

**File sizes**: Depends on data volume

---

### **3. Cleanup Old Data**
```bash
./cli/heavy-operations.sh batch:cleanup
```

**What it does**:
- Deletes closed findings > 90 days old
- Deletes accepted evidence > 90 days old
- Reclaims database space
- Requires confirmation

**Use when**: Regular maintenance, storage management

---

## 🔨 **BUILD COMMANDS**

### **1. Optimized Frontend Build**
```bash
./cli/heavy-operations.sh build:frontend
```

**What it does**:
- Removes source maps (production)
- Minifies code
- Optimizes bundles
- Duration: 1-2 minutes
- Output size: typically 500KB-1MB

**Use when**: Production deployment, code review

---

### **2. Optimized Backend Build**
```bash
./cli/heavy-operations.sh build:backend
```

**What it does**:
- Compiles TypeScript
- Minifies code
- Creates production bundle
- Duration: 30-60 seconds

**Use when**: Production deployment

---

### **3. Docker Image Build**
```bash
./cli/heavy-operations.sh build:docker
```

**What it does**:
- Builds frontend Docker image
- Builds backend Docker image
- Optimized for production
- Duration: 3-5 minutes

**Creates**:
- `audit-platform:frontend`
- `audit-platform:backend`

**Use when**: Container deployment, cloud deployment

---

## 🧪 **TESTING COMMANDS**

### **1. Complete Test Suite**
```bash
./cli/heavy-operations.sh test:all
```

**What it does**:
- Runs all unit tests
- Generates coverage report
- Duration: 2-5 minutes

**Output**:
```
✓ Service tests (45 tests)
✓ Component tests (32 tests)
✓ Integration tests (28 tests)

Coverage: 84%
```

**Use when**: Before every commit, before deployment

---

### **2. Integration Tests**
```bash
./cli/heavy-operations.sh test:integration
```

**What it does**:
- Tests API endpoints
- Tests database operations
- Tests service interactions
- Duration: 1-2 minutes

**Use when**: API changes, database changes

---

### **3. E2E Tests (Playwright)**
```bash
./cli/heavy-operations.sh test:e2e
```

**What it does**:
- Full user workflow testing
- Browser automation
- Cross-browser testing
- Duration: 3-5 minutes

**Test scenarios**:
- User login
- Create engagement
- Upload evidence
- Track procedures

**Use when**: UI changes, major releases

---

### **4. Code Quality Check**
```bash
./cli/heavy-operations.sh test:quality
```

**What it does**:
- ESLint analysis
- Type checking
- Code style validation
- Duration: 1-2 minutes

**Use when**: Pre-commit hook, code review

---

## 📈 **SYSTEM ANALYSIS COMMANDS**

### **1. System Analysis**
```bash
./cli/heavy-operations.sh analyze:system
```

**What it does**:
- CPU & memory info
- Disk usage breakdown
- Database size
- Running processes

**Output**:
```
CPU: 16-core Intel
Memory: 16GB
Disk Usage: Project 2.3GB
Database: 450MB
Node Processes: 2 running
```

**Use when**: Performance diagnostics, capacity planning

---

### **2. Database Statistics**
```bash
./cli/heavy-operations.sh analyze:database
```

**What it does**:
- Table size analysis
- Row counts
- Index performance
- Growth trends

**Output**:
```
engagements: 125MB (245 rows)
procedures: 85MB (2,450 rows)
evidence: 340MB (12,800 rows)
findings: 15MB (85 rows)
```

**Use when**: Storage analysis, query optimization

---

### **3. API Profiling**
```bash
./cli/heavy-operations.sh profile:api
```

**What it does**:
- Measures 10 API requests
- Shows response time variation
- Identifies inconsistencies

**Output**:
```
Request 1: 45ms
Request 2: 52ms
Request 3: 48ms
...
Average: 49ms
```

**Use when**: Performance optimization, SLA validation

---

### **4. Monitor DB Connections**
```bash
./cli/heavy-operations.sh monitor:connections
```

**What it does**:
- Shows active connections
- Connection per user
- Identifies connection leaks

**Output**:
```
audit_platform:
├─ audit_user: 5 connections
└─ postgres: 2 connections (maintenance)
```

**Use when**: Troubleshooting slow queries, connection pool issues

---

## 🔄 **WORKFLOW EXAMPLES**

### **Example 1: Pre-Deployment Checklist**
```bash
# 1. Build optimized code
./cli/heavy-operations.sh build:frontend
./cli/heavy-operations.sh build:backend

# 2. Run all tests
./cli/heavy-operations.sh test:all

# 3. Code quality check
./cli/heavy-operations.sh test:quality

# 4. Load test
./cli/heavy-operations.sh load:basic

# 5. Final report
./cli/heavy-operations.sh report

# 6. Deploy if all pass
```

---

### **Example 2: Performance Optimization**
```bash
# 1. Analyze current state
./cli/heavy-operations.sh analyze:database
./cli/heavy-operations.sh analyze:system

# 2. Profile API
./cli/heavy-operations.sh profile:api

# 3. Optimize
./cli/heavy-operations.sh optimize:db
./cli/heavy-operations.sh reindex:db

# 4. Retest
./cli/heavy-operations.sh profile:api
```

---

### **Example 3: Load Testing & Capacity Planning**
```bash
# 1. Generate test data
./cli/heavy-operations.sh batch:generate 1000

# 2. Warm cache
./cli/heavy-operations.sh cache:warm

# 3. Run load tests
./cli/heavy-operations.sh load:basic
./cli/heavy-operations.sh load:intense

# 4. Analyze results
./cli/heavy-operations.sh analyze:system
```

---

### **Example 4: Monthly Maintenance**
```bash
# 1. Backup data
./cli/heavy-operations.sh batch:export

# 2. Cleanup old data
./cli/heavy-operations.sh batch:cleanup

# 3. Optimize
./cli/heavy-operations.sh optimize:db

# 4. Analyze health
./cli/heavy-operations.sh analyze:database
./cli/heavy-operations.sh analyze:system
```

---

## 📊 **COMMAND REFERENCE TABLE**

| Command | Type | Duration | Use Case |
|---------|------|----------|----------|
| `analyze:engagements` | Analysis | 10s | Reporting |
| `analyze:procedures` | Analysis | 15s | Progress tracking |
| `analyze:findings` | Analysis | 10s | Risk dashboard |
| `report` | Analysis | 20s | Executive summary |
| `optimize:db` | Optimization | 2-5m | Maintenance |
| `cache:warm` | Optimization | 5s | Pre-usage |
| `reindex:db` | Optimization | 1-3m | Query performance |
| `load:basic` | Testing | 30s | Sanity check |
| `load:intense` | Testing | 60s | Capacity test |
| `load:endpoints` | Testing | 45s | Endpoint analysis |
| `batch:generate` | Batch | Variable | Test data |
| `batch:export` | Batch | 30s | Backup |
| `batch:cleanup` | Batch | 1-2m | Maintenance |
| `build:frontend` | Build | 1-2m | Deployment |
| `build:backend` | Build | 30s | Deployment |
| `build:docker` | Build | 3-5m | Container |
| `test:all` | Testing | 2-5m | Quality gate |
| `test:integration` | Testing | 1-2m | API changes |
| `test:e2e` | Testing | 3-5m | UI changes |
| `test:quality` | Testing | 1-2m | Pre-commit |
| `analyze:system` | Analysis | 10s | Diagnostics |
| `analyze:database` | Analysis | 15s | Storage |
| `profile:api` | Analysis | 1m | Performance |
| `monitor:connections` | Analysis | 5s | Troubleshooting |

---

## ⚡ **PERFORMANCE TIPS**

### **For Load Testing**
- Run during off-peak hours
- Warm cache first: `./cli/heavy-operations.sh cache:warm`
- Start with basic, then intense
- Monitor system during test

### **For Data Operations**
- Backup before cleanup: `./cli/heavy-operations.sh batch:export`
- Test on staging first
- Schedule during maintenance window
- Monitor disk space

### **For Optimization**
- Run after data changes
- Off-peak hours preferred
- Monitor query performance
- Regular schedule (monthly)

---

## 🔧 **TROUBLESHOOTING**

### **Load test fails: "Apache Bench not installed"**
```bash
# macOS
brew install httpd

# Linux
sudo apt-get install apache2-utils

# Then retry
./cli/heavy-operations.sh load:basic
```

### **Build fails: "npm not found"**
```bash
# Check npm
npm --version

# Reinstall if needed
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### **Database commands fail: "Connection refused"**
```bash
# Check PostgreSQL
psql -U postgres -h localhost -c "SELECT 1"

# Restart if needed
./cli/master-control.sh start
```

---

## 📝 **LOGGING**

All commands log to console. For persistent logs:

```bash
# Capture to file
./cli/heavy-operations.sh analyze:engagements > analysis_$(date +%Y%m%d).log

# Append to log file
./cli/heavy-operations.sh test:all >> test_results.log 2>&1
```

---

## ✅ **SUMMARY**

You now have **24+ heavy processing commands** for:
- ✅ Analysis & reporting
- ✅ Optimization & tuning
- ✅ Load testing
- ✅ Batch operations
- ✅ Build & deployment
- ✅ Testing & QA
- ✅ System diagnostics

**All production-grade and ready to use!**

---

**Status**: ✅ HEAVY OPERATIONS CLI READY

Start exploring: `./cli/heavy-operations.sh help`
