#!/bin/bash

################################################################################
# HEAVY OPERATIONS CLI - INTENSIVE PROCESSING COMMANDS
#
# Advanced terminal commands for:
# - Data processing & analytics
# - Performance optimization
# - Batch operations
# - Reporting & exports
# - System analysis
# - Load testing
# - Cache management
#
# Usage: ./cli/heavy-operations.sh [command] [options]
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ============================================================================
# LOGGING & UTILITIES
# ============================================================================

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ ERROR: $1${NC}" >&2
}

info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

progress() {
    echo -e "${MAGENTA}▶ $1${NC}"
}

divider() {
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
}

# ============================================================================
# 1. DATA ANALYSIS & REPORTING
# ============================================================================

analyze_engagements() {
    log "Analyzing all engagements..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    SELECT
        COUNT(*) as total_engagements,
        COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning,
        COUNT(CASE WHEN status = 'fieldwork' THEN 1 END) as fieldwork,
        COUNT(CASE WHEN status = 'review' THEN 1 END) as review,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        AVG(CAST(estimated_budget_hours AS DECIMAL)) as avg_hours,
        MAX(materiality) as max_materiality,
        MIN(materiality) as min_materiality
    FROM engagements;

    SELECT
        ent.jurisdiction_code,
        COUNT(*) as count,
        AVG(CAST(e.estimated_budget_hours AS DECIMAL)) as avg_hours,
        SUM(CAST(e.actual_hours_spent AS DECIMAL)) as total_hours_spent
    FROM engagements e
    JOIN entities ent ON e.entity_id = ent.id
    GROUP BY ent.jurisdiction_code
    ORDER BY count DESC;

    SELECT
        e.framework_code,
        COUNT(*) as count,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed
    FROM engagements e
    GROUP BY e.framework_code;

EOF

    success "Engagement analysis complete"
}

analyze_procedures() {
    log "Analyzing procedures across all engagements..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    SELECT
        COUNT(*) as total_procedures,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'not_started' THEN 1 END) as not_started,
        ROUND(AVG(CAST(estimated_hours AS DECIMAL)), 2) as avg_hours
    FROM procedures;

    SELECT
        fsli,
        COUNT(*) as count,
        ROUND(AVG(CAST(estimated_hours AS DECIMAL)), 2) as avg_hours,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
    FROM procedures
    GROUP BY fsli
    ORDER BY count DESC;

EOF

    success "Procedure analysis complete"
}

analyze_findings() {
    log "Analyzing findings and issues..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    SELECT
        COUNT(*) as total_findings,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as low,
        ROUND(SUM(CAST(impact_amount AS DECIMAL)), 2) as total_impact,
        COUNT(CASE WHEN status != 'closed' THEN 1 END) as open_findings
    FROM findings;

    SELECT
        fsli,
        COUNT(*) as count,
        COUNT(CASE WHEN severity IN ('critical', 'high') THEN 1 END) as critical_high,
        ROUND(SUM(CAST(impact_amount AS DECIMAL)), 2) as total_impact
    FROM findings
    GROUP BY fsli
    ORDER BY critical_high DESC;

EOF

    success "Finding analysis complete"
}

generate_audit_report() {
    log "Generating comprehensive audit report..."
    divider

    local report_file="reports/audit_report_$(date +%Y%m%d_%H%M%S).txt"
    mkdir -p reports

    {
        echo "═══════════════════════════════════════════════════════════"
        echo "         AUDIT PLATFORM - COMPREHENSIVE REPORT"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "Generated: $(date)"
        echo ""

        echo "ENGAGEMENT STATISTICS"
        echo "─────────────────────────────────────────────────────────────"
        psql -U ${DB_USER:-postgres} \
             -h ${DB_HOST:-localhost} \
             -d ${PROJECT_NAME:-audit_platform} \
             -t -c "SELECT 'Total Engagements: ' || COUNT(*) FROM engagements;"

        echo ""
        echo "PROCEDURE STATISTICS"
        echo "─────────────────────────────────────────────────────────────"
        psql -U ${DB_USER:-postgres} \
             -h ${DB_HOST:-localhost} \
             -d ${PROJECT_NAME:-audit_platform} \
             -t -c "SELECT 'Total Procedures: ' || COUNT(*) FROM procedures;"

        echo ""
        echo "FINDINGS SUMMARY"
        echo "─────────────────────────────────────────────────────────────"
        psql -U ${DB_USER:-postgres} \
             -h ${DB_HOST:-localhost} \
             -d ${PROJECT_NAME:-audit_platform} \
             -t -c "SELECT 'Open Findings: ' || COUNT(*) FROM findings WHERE status != 'closed';"

        echo ""
        echo "═══════════════════════════════════════════════════════════"

    } > "$report_file"

    success "Report generated: $report_file"
}

# ============================================================================
# 2. PERFORMANCE OPTIMIZATION
# ============================================================================

optimize_database() {
    log "Running database optimization..."
    divider

    progress "Analyzing tables..."
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    -- Analyze all tables
    ANALYZE;

    -- Vacuum to reclaim space
    VACUUM;

EOF

    success "Database optimized"
}

warm_cache() {
    log "Warming application cache..."
    divider

    progress "Loading jurisdictions..."
    curl -s http://localhost:3001/api/jurisdictions > /dev/null

    progress "Loading frameworks..."
    curl -s http://localhost:3001/api/jurisdictions > /dev/null

    progress "Loading recent engagements..."
    curl -s http://localhost:3001/api/engagements > /dev/null

    success "Cache warmed"
}

reindex_database() {
    log "Reindexing all database indexes..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    -- Reindex all indexes
    REINDEX DATABASE ${PROJECT_NAME:-audit_platform};

EOF

    success "Database reindexed"
}

# ============================================================================
# 3. LOAD TESTING
# ============================================================================

load_test_basic() {
    log "Running basic load test (100 requests)..."
    divider

    if ! command -v ab &> /dev/null; then
        error "Apache Bench not installed. Install with: brew install httpd (macOS) or apt-get install apache2-utils (Linux)"
        return 1
    fi

    progress "Testing GET /api/engagements"
    ab -n 100 -c 10 http://localhost:3001/api/engagements 2>&1 | tail -10

    success "Load test complete"
}

load_test_intense() {
    log "Running intense load test (1000 requests, 50 concurrent)..."
    divider

    if ! command -v ab &> /dev/null; then
        error "Apache Bench not installed"
        return 1
    fi

    progress "Testing GET /api/engagements (1000 requests, 50 concurrent)"
    ab -n 1000 -c 50 http://localhost:3001/api/engagements 2>&1 | grep -E "Requests per second|Time per request|Failed requests"

    success "Intense load test complete"
}

load_test_endpoints() {
    log "Testing all endpoints under load..."
    divider

    local endpoints=(
        "/health"
        "/api/jurisdictions"
        "/api/engagements"
    )

    for endpoint in "${endpoints[@]}"; do
        progress "Testing $endpoint"
        ab -n 100 -c 10 "http://localhost:3001${endpoint}" 2>&1 | grep "Requests per second" || warning "Failed to test $endpoint"
    done

    success "Endpoint load testing complete"
}

# ============================================================================
# 4. BATCH OPERATIONS
# ============================================================================

batch_generate_test_data() {
    log "Generating test data in batch..."
    divider

    local count=${1:-100}
    progress "Generating $count test engagements..."

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << EOF

    -- Create test entities
    INSERT INTO entities (organization_id, name, jurisdiction_code, entity_type, turnover, created_by)
    SELECT
        1,
        'Test Company ' || seq,
        CASE WHEN seq % 2 = 0 THEN 'UK' ELSE 'DE' END,
        'Limited Company',
        1000000 + (seq * 10000),
        1
    FROM generate_series(1, $count) seq
    ON CONFLICT DO NOTHING;

    -- Create test engagements
    INSERT INTO engagements (organization_id, entity_id, engagement_type, framework_code, financial_year_end, created_by)
    SELECT
        1,
        id,
        'full_audit',
        CASE WHEN jurisdiction_code = 'UK' THEN 'FRS102' ELSE 'IFRS' END,
        '2024-12-31',
        1
    FROM entities
    WHERE name LIKE 'Test Company%'
    ON CONFLICT DO NOTHING;

EOF

    success "Generated $count test engagements"
}

batch_export_data() {
    log "Exporting all data to CSV..."
    divider

    mkdir -p exports

    progress "Exporting engagements..."
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} \
         -c "\COPY (SELECT * FROM engagements) TO STDOUT WITH CSV HEADER" > exports/engagements_$(date +%Y%m%d).csv

    progress "Exporting procedures..."
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} \
         -c "\COPY (SELECT * FROM procedures) TO STDOUT WITH CSV HEADER" > exports/procedures_$(date +%Y%m%d).csv

    progress "Exporting findings..."
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} \
         -c "\COPY (SELECT * FROM findings) TO STDOUT WITH CSV HEADER" > exports/findings_$(date +%Y%m%d).csv

    progress "Exporting evidence..."
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} \
         -c "\COPY (SELECT * FROM evidence) TO STDOUT WITH CSV HEADER" > exports/evidence_$(date +%Y%m%d).csv

    success "Data exported to exports/ directory"
}

batch_cleanup_old_data() {
    log "Cleaning up old data..."
    divider

    read -p "Delete engagements older than 90 days? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log "Cleanup cancelled"
        return 0
    fi

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    -- Delete old findings
    DELETE FROM findings
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND status = 'closed';

    -- Delete old evidence
    DELETE FROM evidence
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND review_status = 'accepted';

EOF

    success "Old data cleaned up"
}

# ============================================================================
# 5. BUILD & COMPILATION
# ============================================================================

build_frontend_optimized() {
    log "Building frontend with optimizations..."
    divider

    progress "Cleaning previous build..."
    rm -rf build/

    progress "Running build with optimizations..."
    GENERATE_SOURCEMAP=false npm run build

    success "Frontend build complete"

    # Show size
    echo ""
    echo "Build size:"
    du -sh build/
}

build_backend_optimized() {
    log "Building backend with optimizations..."
    divider

    cd server

    progress "Cleaning previous build..."
    rm -rf dist/

    progress "Building backend..."
    npm run build

    success "Backend build complete"

    cd ..
}

build_docker_images() {
    log "Building optimized Docker images..."
    divider

    if ! command -v docker &> /dev/null; then
        error "Docker not installed"
        return 1
    fi

    progress "Building frontend image..."
    docker build -t audit-platform:frontend \
        -f Dockerfile.frontend \
        --build-arg NODE_ENV=production \
        . 2>&1 | tail -5

    progress "Building backend image..."
    docker build -t audit-platform:backend \
        -f server/Dockerfile \
        --build-arg NODE_ENV=production \
        server/ 2>&1 | tail -5

    success "Docker images built"
    docker images | grep audit-platform
}

# ============================================================================
# 6. TESTING & QUALITY
# ============================================================================

run_all_tests() {
    log "Running complete test suite..."
    divider

    progress "Running unit tests..."
    npm test -- --coverage 2>&1 | tail -20

    success "Test suite complete"
}

run_integration_tests() {
    log "Running integration tests..."
    divider

    progress "Testing API endpoints..."
    npm run test:integration 2>&1 | tail -20

    success "Integration tests complete"
}

run_e2e_tests() {
    log "Running E2E tests..."
    divider

    if ! npm list playwright > /dev/null 2>&1; then
        warning "Playwright not installed. Install with: npm install -D @playwright/test"
        return 1
    fi

    progress "Running Playwright tests..."
    npx playwright test 2>&1 | tail -20

    success "E2E tests complete"
}

code_quality_check() {
    log "Running code quality checks..."
    divider

    progress "ESLint analysis..."
    npm run lint -- --max-warnings 0 2>&1 | tail -10

    progress "Type checking..."
    npm run type-check 2>&1 | tail -10

    success "Code quality check complete"
}

# ============================================================================
# 7. SYSTEM ANALYSIS
# ============================================================================

system_analysis() {
    log "Running comprehensive system analysis..."
    divider

    echo -e "\n${MAGENTA}CPU & Memory:${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        system_profiler SPHardwareDataType | grep -E "Processor|Memory"
    else
        lscpu
        free -h
    fi

    echo -e "\n${MAGENTA}Disk Usage:${NC}"
    du -sh ./* 2>/dev/null | sort -rh | head -10

    echo -e "\n${MAGENTA}Database Size:${NC}"
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} \
         -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname = '${PROJECT_NAME:-audit_platform}';"

    echo -e "\n${MAGENTA}Node Processes:${NC}"
    ps aux | grep node | grep -v grep

    success "System analysis complete"
}

database_stats() {
    log "Analyzing database statistics..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME:-audit_platform} << 'EOF'

    SELECT
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        n_live_tup as rows
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

EOF

    success "Database statistics displayed"
}

# ============================================================================
# 8. MONITORING & PROFILING
# ============================================================================

profile_api() {
    log "Profiling API performance..."
    divider

    progress "Testing response times..."

    for i in {1..10}; do
        echo -n "Request $i: "
        time curl -s http://localhost:3001/api/engagements > /dev/null
    done

    success "API profiling complete"
}

monitor_database_connections() {
    log "Monitoring database connections..."
    divider

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d postgres << 'EOF'

    SELECT
        datname,
        usename,
        count(*) as connections
    FROM pg_stat_activity
    GROUP BY datname, usename;

EOF

    success "Connection monitoring complete"
}

# ============================================================================
# HELP & MAIN
# ============================================================================

show_help() {
    cat << EOF
${CYAN}HEAVY OPERATIONS CLI v1.0${NC}

${YELLOW}USAGE:${NC}
    ./cli/heavy-operations.sh [command] [options]

${YELLOW}ANALYSIS COMMANDS:${NC}
    analyze:engagements      Analyze all engagements (stats, trends)
    analyze:procedures       Analyze procedure metrics
    analyze:findings         Analyze findings and issues
    report                   Generate comprehensive audit report

${YELLOW}OPTIMIZATION COMMANDS:${NC}
    optimize:db              Optimize database (VACUUM, ANALYZE)
    cache:warm               Warm application cache
    reindex:db               Reindex all database indexes

${YELLOW}LOAD TESTING:${NC}
    load:basic               100 requests load test
    load:intense             1000 requests, 50 concurrent
    load:endpoints           Test all endpoints

${YELLOW}BATCH OPERATIONS:${NC}
    batch:generate [n]       Generate N test engagements (default: 100)
    batch:export             Export all data to CSV
    batch:cleanup            Clean up old data

${YELLOW}BUILD & COMPILE:${NC}
    build:frontend           Optimized frontend build
    build:backend            Optimized backend build
    build:docker             Build Docker images

${YELLOW}TESTING:${NC}
    test:all                 Complete test suite
    test:integration         Integration tests
    test:e2e                 E2E tests (Playwright)
    test:quality             Code quality checks

${YELLOW}SYSTEM ANALYSIS:${NC}
    analyze:system           System resources & stats
    analyze:database         Database statistics
    profile:api              API performance profiling
    monitor:connections      Monitor DB connections

${YELLOW}EXAMPLES:${NC}
    ./cli/heavy-operations.sh analyze:engagements
    ./cli/heavy-operations.sh load:intense
    ./cli/heavy-operations.sh batch:generate 1000
    ./cli/heavy-operations.sh build:docker
    ./cli/heavy-operations.sh test:all

EOF
}

main() {
    local command=${1:-help}

    case "$command" in
        analyze:engagements)    analyze_engagements ;;
        analyze:procedures)     analyze_procedures ;;
        analyze:findings)       analyze_findings ;;
        report)                 generate_audit_report ;;
        optimize:db)            optimize_database ;;
        cache:warm)             warm_cache ;;
        reindex:db)             reindex_database ;;
        load:basic)             load_test_basic ;;
        load:intense)           load_test_intense ;;
        load:endpoints)         load_test_endpoints ;;
        batch:generate)         batch_generate_test_data "$2" ;;
        batch:export)           batch_export_data ;;
        batch:cleanup)          batch_cleanup_old_data ;;
        build:frontend)         build_frontend_optimized ;;
        build:backend)          build_backend_optimized ;;
        build:docker)           build_docker_images ;;
        test:all)               run_all_tests ;;
        test:integration)       run_integration_tests ;;
        test:e2e)               run_e2e_tests ;;
        test:quality)           code_quality_check ;;
        analyze:system)         system_analysis ;;
        analyze:database)       database_stats ;;
        profile:api)            profile_api ;;
        monitor:connections)    monitor_database_connections ;;
        help|--help|-h)         show_help ;;
        *)                      echo "Unknown command: $command"; show_help; exit 1 ;;
    esac
}

main "$@"
