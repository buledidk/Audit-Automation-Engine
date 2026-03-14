#!/bin/bash

################################################################################
# AUDIT PLATFORM CLI - COMPLETE TERMINAL INTERFACE
#
# Multi-Jurisdictional Audit Software Platform
# UK/Europe First - Production Ready
#
# COPY & PASTE READY - Complete deployment in terminal
#
# Usage: ./audit-platform.sh [command] [options]
################################################################################

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="audit-platform"
DOCKER_REGISTRY="your-registry.azurecr.io"
ENVIRONMENT=${ENVIRONMENT:-"development"}
VERBOSE=${VERBOSE:-false}

################################################################################
# UTILITY FUNCTIONS
################################################################################

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ ERROR: $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

spinner() {
    local pid=$1
    local msg=$2
    local i=0
    while kill -0 $pid 2>/dev/null; do
        i=$(( (i+1) %4 ))
        printf "\r${BLUE}${spinner:$i:1}${NC} $msg"
        sleep .1
    done
    printf "\r"
}

################################################################################
# SETUP & INITIALIZATION
################################################################################

init() {
    log "Initializing Audit Platform..."

    if [ ! -f .env ]; then
        log "Creating .env file..."
        cp .env.example .env
        warning "Please update .env with your configuration"
    fi

    log "Installing dependencies..."
    npm install --quiet &
    local npm_pid=$!
    spinner $npm_pid "Installing npm packages"
    wait $npm_pid

    if [ -d "server" ]; then
        log "Installing server dependencies..."
        cd server
        npm install --quiet &
        local server_pid=$!
        spinner $server_pid "Installing server packages"
        wait $server_pid
        cd ..
    fi

    success "Initialization complete!"
}

################################################################################
# DATABASE COMMANDS
################################################################################

db_create() {
    log "Creating database..."

    if ! command -v psql &> /dev/null; then
        error "PostgreSQL client not found. Install PostgreSQL and try again."
        return 1
    fi

    psql -U ${DB_USER:-postgres} -h ${DB_HOST:-localhost} -d postgres << EOF
CREATE DATABASE ${PROJECT_NAME}_dev OWNER ${DB_USER:-postgres};
CREATE DATABASE ${PROJECT_NAME}_test OWNER ${DB_USER:-postgres};
EOF

    success "Databases created!"
}

db_migrate() {
    log "Running database migrations..."

    if [ ! -f database/schema.sql ]; then
        error "schema.sql not found"
        return 1
    fi

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME}_dev \
         -f database/schema.sql

    success "Database migrated!"
}

db_seed() {
    log "Seeding database..."

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME}_dev << EOF
-- Seed jurisdictions
INSERT INTO jurisdiction_config (
    jurisdiction_code, jurisdiction_name, region,
    primary_framework, audit_exemption_threshold
) VALUES
    ('UK', 'United Kingdom', 'Europe', 'FRS102', 500000),
    ('DE', 'Germany', 'EU', 'IFRS', 600000),
    ('FR', 'France', 'EU', 'IFRS', 500000),
    ('IT', 'Italy', 'EU', 'IFRS', 400000),
    ('ES', 'Spain', 'EU', 'IFRS', 300000),
    ('NL', 'Netherlands', 'EU', 'IFRS', 350000),
    ('BE', 'Belgium', 'EU', 'IFRS', 250000),
    ('AT', 'Austria', 'EU', 'IFRS', 280000),
    ('SE', 'Sweden', 'EU', 'IFRS', 350000),
    ('DK', 'Denmark', 'EU', 'IFRS', 340000);

-- Seed frameworks
INSERT INTO framework_config (
    framework_code, framework_name, applicable_jurisdictions
) VALUES
    ('FRS102', 'FRS 102 (UK)', '["UK"]'),
    ('IFRS', 'IFRS (International)', '["DE","FR","IT","ES","NL","BE","AT","SE","DK"]');

success "Database seeded!"
EOF
}

db_reset() {
    log "Resetting database (THIS WILL DELETE ALL DATA)..."
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log "Reset cancelled"
        return 0
    fi

    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d postgres << EOF
DROP DATABASE IF EXISTS ${PROJECT_NAME}_dev;
DROP DATABASE IF EXISTS ${PROJECT_NAME}_test;
EOF

    db_create
    db_migrate
    db_seed
    success "Database reset complete!"
}

db_backup() {
    log "Backing up database..."
    local backup_file="backups/audit-platform_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p backups

    pg_dump -U ${DB_USER:-postgres} \
            -h ${DB_HOST:-localhost} \
            -d ${PROJECT_NAME}_dev \
            > "$backup_file"

    success "Backup saved to $backup_file"
}

db_status() {
    log "Database Status:"
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME}_dev << EOF
\dt+
\l
EOF
}

################################################################################
# DEVELOPMENT COMMANDS
################################################################################

dev_start() {
    log "Starting development environment..."

    # Start PostgreSQL (if using Docker)
    if command -v docker &> /dev/null; then
        log "Starting Docker containers..."
        docker-compose up -d postgres redis
    fi

    sleep 2

    log "Starting backend server..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..

    log "Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!

    success "Development environment started!"
    info "Backend: http://localhost:3001"
    info "Frontend: http://localhost:3000"
    info "Press Ctrl+C to stop"

    wait
}

dev_test() {
    log "Running tests..."

    npm test -- --coverage

    if [ $? -eq 0 ]; then
        success "All tests passed!"
    else
        error "Tests failed!"
        return 1
    fi
}

dev_lint() {
    log "Running linter..."
    npm run lint

    success "Linting complete!"
}

dev_format() {
    log "Formatting code..."
    npm run format

    success "Code formatted!"
}

################################################################################
# BUILD COMMANDS
################################################################################

build() {
    log "Building application..."

    log "Building frontend..."
    npm run build

    if [ $? -ne 0 ]; then
        error "Frontend build failed!"
        return 1
    fi

    log "Building backend..."
    cd server && npm run build && cd ..

    if [ $? -ne 0 ]; then
        error "Backend build failed!"
        return 1
    fi

    success "Build complete!"
}

build_docker() {
    log "Building Docker images..."

    log "Building frontend image..."
    docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}:frontend . \
        -f Dockerfile \
        --target frontend

    log "Building backend image..."
    docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}:backend ./server \
        -f server/Dockerfile

    success "Docker images built!"
}

build_docker_push() {
    log "Pushing Docker images to registry..."

    docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:frontend
    docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:backend

    success "Docker images pushed!"
}

################################################################################
# DEPLOYMENT COMMANDS
################################################################################

deploy_staging() {
    log "Deploying to staging environment..."

    build
    build_docker

    log "Updating staging deployment..."
    kubectl set image deployment/audit-platform-frontend \
        frontend=${DOCKER_REGISTRY}/${PROJECT_NAME}:frontend \
        -n audit-staging

    kubectl set image deployment/audit-platform-backend \
        backend=${DOCKER_REGISTRY}/${PROJECT_NAME}:backend \
        -n audit-staging

    success "Deployed to staging!"
    info "Staging URL: https://staging.auditplatform.com"
}

deploy_production() {
    log "Deploying to production environment..."
    warning "This will deploy to PRODUCTION!"
    read -p "Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log "Deployment cancelled"
        return 0
    fi

    build
    build_docker

    log "Updating production deployment..."
    kubectl set image deployment/audit-platform-frontend \
        frontend=${DOCKER_REGISTRY}/${PROJECT_NAME}:frontend \
        -n audit-production

    kubectl set image deployment/audit-platform-backend \
        backend=${DOCKER_REGISTRY}/${PROJECT_NAME}:backend \
        -n audit-production

    log "Waiting for rollout..."
    kubectl rollout status deployment/audit-platform-frontend -n audit-production
    kubectl rollout status deployment/audit-platform-backend -n audit-production

    success "Deployed to production!"
    info "Production URL: https://auditplatform.com"
}

################################################################################
# MONITORING COMMANDS
################################################################################

monitor() {
    log "Starting performance monitoring..."

    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════"
    echo "   AUDIT PLATFORM PERFORMANCE MONITOR"
    echo "═══════════════════════════════════════════════"
    echo -e "${NC}"

    while true; do
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
        echo -e "${BLUE}$(date +'%Y-%m-%d %H:%M:%S')${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════${NC}"

        # CPU & Memory
        echo -e "\n${YELLOW}System Resources:${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            top -l 1 | head -11
        else
            free -h
            echo ""
            top -bn1 | head -3
        fi

        # Database
        echo -e "\n${YELLOW}Database Status:${NC}"
        psql -U ${DB_USER:-postgres} \
             -h ${DB_HOST:-localhost} \
             -d ${PROJECT_NAME}_dev \
             -t -c "SELECT datname, usename, state, count(*) as connections FROM pg_stat_activity GROUP BY datname, usename, state;" 2>/dev/null || echo "Database unavailable"

        # Redis
        echo -e "\n${YELLOW}Redis Status:${NC}"
        redis-cli INFO stats 2>/dev/null | grep -E "total_commands|total_connections" || echo "Redis unavailable"

        # Docker
        echo -e "\n${YELLOW}Docker Containers:${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker unavailable"

        # API Health
        echo -e "\n${YELLOW}API Health:${NC}"
        curl -s http://localhost:3001/health | jq '.' 2>/dev/null || echo "API unavailable"

        echo -e "\n${CYAN}═══════════════════════════════════════════════${NC}"
        echo "Press Ctrl+C to exit | Refreshing in 5 seconds..."
        sleep 5
    done
}

monitor_logs() {
    log "Streaming application logs..."

    if [ -d "logs" ]; then
        tail -f logs/*.log
    else
        warning "No logs directory found"
    fi
}

monitor_performance() {
    log "Running performance analysis..."

    echo -e "${CYAN}API Performance:${NC}"
    curl -s http://localhost:3001/metrics | grep -E "http_request|duration"

    echo -e "\n${CYAN}Database Queries:${NC}"
    psql -U ${DB_USER:-postgres} \
         -h ${DB_HOST:-localhost} \
         -d ${PROJECT_NAME}_dev \
         -c "SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

    echo -e "\n${CYAN}Cache Hit Rate:${NC}"
    redis-cli INFO stats | grep hit_ratio
}

################################################################################
# UTILITY COMMANDS
################################################################################

health_check() {
    log "Running health checks..."

    local all_ok=true

    # Check Node.js
    if command -v node &> /dev/null; then
        success "Node.js: $(node --version)"
    else
        error "Node.js not found"
        all_ok=false
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        success "npm: $(npm --version)"
    else
        error "npm not found"
        all_ok=false
    fi

    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        success "PostgreSQL: available"
    else
        error "PostgreSQL not found"
        all_ok=false
    fi

    # Check Docker
    if command -v docker &> /dev/null; then
        success "Docker: $(docker --version)"
    else
        warning "Docker not found (optional)"
    fi

    # Check API
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        success "Backend API: running"
    else
        warning "Backend API: not running"
    fi

    # Check React
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        success "Frontend: running"
    else
        warning "Frontend: not running"
    fi

    echo ""
    if [ "$all_ok" = true ]; then
        success "All health checks passed!"
    else
        warning "Some health checks failed. See above for details."
    fi
}

version() {
    echo "Audit Platform CLI v1.0.0"
    echo "Database: PostgreSQL"
    echo "Cache: Redis"
    echo "Frontend: React"
    echo "Backend: Node.js/Express"
}

help() {
    cat << EOF
${CYAN}Audit Platform CLI - Complete Terminal Interface${NC}

${YELLOW}USAGE:${NC}
    ./audit-platform.sh [command] [options]

${YELLOW}COMMANDS:${NC}

  ${GREEN}INITIALIZATION${NC}
    init                    Initialize the project

  ${GREEN}DATABASE${NC}
    db:create              Create databases
    db:migrate             Run migrations
    db:seed                Seed initial data
    db:reset               Reset database (DELETE ALL DATA)
    db:backup              Backup database
    db:status              Show database status

  ${GREEN}DEVELOPMENT${NC}
    dev:start              Start development environment
    dev:test               Run tests
    dev:lint               Run linter
    dev:format             Format code

  ${GREEN}BUILD${NC}
    build                  Build application
    build:docker           Build Docker images
    build:docker:push      Push Docker images

  ${GREEN}DEPLOYMENT${NC}
    deploy:staging         Deploy to staging
    deploy:production      Deploy to production

  ${GREEN}MONITORING${NC}
    monitor                Start performance monitor
    monitor:logs           Stream application logs
    monitor:perf           Show performance metrics
    health                 Run health checks

  ${GREEN}UTILITIES${NC}
    version                Show version
    help                   Show this help

${YELLOW}EXAMPLES:${NC}
    ./audit-platform.sh init
    ./audit-platform.sh dev:start
    ./audit-platform.sh db:migrate
    ./audit-platform.sh deploy:production
    ./audit-platform.sh monitor

EOF
}

################################################################################
# MAIN ENTRY POINT
################################################################################

main() {
    local command=${1:-help}

    case "$command" in
        init)                init ;;
        db:create)          db_create ;;
        db:migrate)         db_migrate ;;
        db:seed)            db_seed ;;
        db:reset)           db_reset ;;
        db:backup)          db_backup ;;
        db:status)          db_status ;;
        dev:start)          dev_start ;;
        dev:test)           dev_test ;;
        dev:lint)           dev_lint ;;
        dev:format)         dev_format ;;
        build)              build ;;
        build:docker)       build_docker ;;
        build:docker:push)  build_docker_push ;;
        deploy:staging)     deploy_staging ;;
        deploy:production)  deploy_production ;;
        monitor)            monitor ;;
        monitor:logs)       monitor_logs ;;
        monitor:perf)       monitor_performance ;;
        health)             health_check ;;
        version)            version ;;
        help|--help|-h)     help ;;
        *)                  error "Unknown command: $command"; help; exit 1 ;;
    esac
}

# Run main function
main "$@"
