#!/bin/bash

################################################################################
# START ALL SERVICES - AUDIT AUTOMATION ENGINE
#
# Starts infrastructure (PostgreSQL + Redis), backend API, and frontend dev server.
# Uses Docker Compose when available, falls back to brew services on macOS.
#
# Usage: ./scripts/start-all.sh
################################################################################

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

# Resolve project root (script lives in scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Ports
POSTGRES_PORT=5432
REDIS_PORT=6379
BACKEND_PORT=3001
FRONTEND_PORT=5175

# PID & log files (matches master-control.sh conventions)
BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"
LOG_DIR="logs"

# Track child PIDs for cleanup
CHILD_PIDS=()

# ============================================================================
# UTILITIES
# ============================================================================

log()     { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error()   { echo -e "${RED}✗ ERROR:${NC} $1" >&2; }
warn()    { echo -e "${YELLOW}⚠${NC} $1"; }
info()    { echo -e "${CYAN}ℹ${NC} $1"; }

divider() {
    echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
}

wait_for_port() {
    local port=$1
    local name=$2
    local max_wait=${3:-30}
    local elapsed=0

    while ! nc -z localhost "$port" 2>/dev/null; do
        if [ $elapsed -ge $max_wait ]; then
            error "$name did not become available on port $port within ${max_wait}s"
            return 1
        fi
        sleep 1
        elapsed=$((elapsed + 1))
    done
    return 0
}

# ============================================================================
# CLEANUP / SIGNAL TRAP
# ============================================================================

cleanup() {
    echo ""
    log "Shutting down services..."

    # Stop frontend
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid
        pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            success "Frontend stopped (PID $pid)"
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi

    # Stop backend
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid
        pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            success "Backend stopped (PID $pid)"
        fi
        rm -f "$BACKEND_PID_FILE"
    fi

    # Kill any remaining child processes
    for pid in "${CHILD_PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done

    success "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

# ============================================================================
# PREREQUISITE CHECKS
# ============================================================================

check_prerequisites() {
    log "Checking prerequisites..."
    local missing=0

    if ! command -v node &>/dev/null; then
        error "Node.js is not installed"
        missing=1
    else
        success "Node.js $(node --version)"
    fi

    if ! command -v npm &>/dev/null; then
        error "npm is not installed"
        missing=1
    else
        success "npm $(npm --version)"
    fi

    if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
        success "Docker is available"
    else
        warn "Docker not available — will try brew services for infrastructure"
    fi

    if [ $missing -eq 1 ]; then
        error "Missing required prerequisites. Install them and try again."
        exit 1
    fi
}

# ============================================================================
# DEPENDENCY INSTALLATION
# ============================================================================

install_dependencies() {
    log "Installing dependencies..."

    # Frontend (root package.json)
    if [ ! -d "node_modules" ]; then
        info "Installing frontend dependencies..."
        npm install
        success "Frontend dependencies installed"
    else
        success "Frontend dependencies already installed"
    fi

    # Backend (server/package.json)
    if [ ! -d "server/node_modules" ]; then
        info "Installing backend dependencies..."
        (cd server && npm install)
        success "Backend dependencies installed"
    else
        success "Backend dependencies already installed"
    fi
}

# ============================================================================
# INFRASTRUCTURE
# ============================================================================

start_infrastructure() {
    log "Starting infrastructure..."

    # Prefer Docker Compose if available and docker-compose.yml exists
    if [ -f "docker-compose.yml" ] && command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
        start_infra_docker
    elif [[ "$OSTYPE" == darwin* ]] && command -v brew &>/dev/null; then
        start_infra_brew
    else
        warn "No Docker or brew available. Ensure PostgreSQL and Redis are running manually."
        return 0
    fi

    # Wait for ports
    info "Waiting for PostgreSQL on port $POSTGRES_PORT..."
    if wait_for_port $POSTGRES_PORT "PostgreSQL" 30; then
        success "PostgreSQL is ready"
    else
        warn "PostgreSQL may not be ready — backend might fail to connect"
    fi

    info "Waiting for Redis on port $REDIS_PORT..."
    if wait_for_port $REDIS_PORT "Redis" 15; then
        success "Redis is ready"
    else
        warn "Redis may not be ready — some features may be limited"
    fi
}

start_infra_docker() {
    info "Starting PostgreSQL and Redis via Docker Compose..."

    # Check if containers are already running
    if docker compose ps --status running 2>/dev/null | grep -q "audit_postgres"; then
        success "PostgreSQL container already running"
    else
        docker compose up -d postgres 2>&1 | tail -1
        success "PostgreSQL container started"
    fi

    if docker compose ps --status running 2>/dev/null | grep -q "audit_redis"; then
        success "Redis container already running"
    else
        docker compose up -d redis 2>&1 | tail -1
        success "Redis container started"
    fi
}

start_infra_brew() {
    info "Starting infrastructure via brew services..."

    brew services start postgresql@15 2>/dev/null && success "PostgreSQL started via brew" \
        || warn "PostgreSQL may already be running (or try: brew install postgresql@15)"

    brew services start redis 2>/dev/null && success "Redis started via brew" \
        || warn "Redis may already be running (or try: brew install redis)"
}

# ============================================================================
# BACKEND
# ============================================================================

start_backend() {
    log "Starting backend API server..."

    # Check if already running
    if [ -f "$BACKEND_PID_FILE" ]; then
        local old_pid
        old_pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$old_pid" 2>/dev/null; then
            warn "Backend already running (PID: $old_pid)"
            return 0
        fi
        rm -f "$BACKEND_PID_FILE"
    fi

    mkdir -p "$LOG_DIR"

    # Set environment defaults for the backend
    export PORT=${PORT:-$BACKEND_PORT}
    export NODE_ENV=${NODE_ENV:-development}
    export JWT_SECRET=${JWT_SECRET:-dev-secret-change-in-production}
    export CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:$FRONTEND_PORT}

    # Start backend in background
    node server/index.js > "$LOG_DIR/backend.log" 2>&1 &
    local backend_pid=$!
    echo "$backend_pid" > "$BACKEND_PID_FILE"
    CHILD_PIDS+=("$backend_pid")

    # Wait for backend to be ready
    info "Waiting for backend on port $BACKEND_PORT..."
    if wait_for_port $BACKEND_PORT "Backend" 15; then
        success "Backend API running (PID: $backend_pid)"
    else
        error "Backend failed to start. Check $LOG_DIR/backend.log"
        tail -10 "$LOG_DIR/backend.log" 2>/dev/null | sed 's/^/  /'
        return 1
    fi
}

# ============================================================================
# FRONTEND
# ============================================================================

start_frontend() {
    log "Starting frontend dev server..."

    # Check if already running
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local old_pid
        old_pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$old_pid" 2>/dev/null; then
            warn "Frontend already running (PID: $old_pid)"
            return 0
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi

    mkdir -p "$LOG_DIR"

    # Start frontend (npm run dev → vite) in background
    npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    local frontend_pid=$!
    echo "$frontend_pid" > "$FRONTEND_PID_FILE"
    CHILD_PIDS+=("$frontend_pid")

    # Wait for frontend to be ready
    info "Waiting for frontend on port $FRONTEND_PORT..."
    if wait_for_port $FRONTEND_PORT "Frontend" 20; then
        success "Frontend dev server running (PID: $frontend_pid)"
    else
        error "Frontend failed to start. Check $LOG_DIR/frontend.log"
        tail -10 "$LOG_DIR/frontend.log" 2>/dev/null | sed 's/^/  /'
        return 1
    fi
}

# ============================================================================
# HEALTH CHECK
# ============================================================================

run_health_check() {
    echo ""
    divider
    echo -e "${CYAN}   HEALTH CHECK${NC}"
    divider
    echo ""

    local all_ok=0

    printf "  PostgreSQL (port %s):  " "$POSTGRES_PORT"
    if nc -z localhost $POSTGRES_PORT 2>/dev/null; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        all_ok=1
    fi

    printf "  Redis (port %s):       " "$REDIS_PORT"
    if nc -z localhost $REDIS_PORT 2>/dev/null; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        all_ok=1
    fi

    printf "  Backend API (port %s): " "$BACKEND_PORT"
    if curl -sf http://localhost:$BACKEND_PORT/health >/dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        all_ok=1
    fi

    printf "  Frontend (port %s):    " "$FRONTEND_PORT"
    if curl -sf http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        all_ok=1
    fi

    echo ""
    return $all_ok
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    echo ""
    divider
    echo -e "${CYAN}   AUDIT AUTOMATION ENGINE — START ALL SERVICES${NC}"
    divider
    echo ""

    check_prerequisites
    echo ""

    install_dependencies
    echo ""

    start_infrastructure
    echo ""

    start_backend
    echo ""

    start_frontend
    echo ""

    run_health_check
    local health_status=$?

    divider
    if [ $health_status -eq 0 ]; then
        echo -e "${GREEN}   All services are running!${NC}"
    else
        echo -e "${YELLOW}   Some services may need attention — check logs in $LOG_DIR/${NC}"
    fi
    divider
    echo ""
    echo -e "  ${CYAN}Frontend:${NC}    http://localhost:$FRONTEND_PORT"
    echo -e "  ${CYAN}Backend API:${NC} http://localhost:$BACKEND_PORT"
    echo -e "  ${CYAN}Health:${NC}      http://localhost:$BACKEND_PORT/health"
    echo ""
    echo -e "  ${CYAN}Backend PID:${NC}  $(cat "$BACKEND_PID_FILE" 2>/dev/null || echo 'N/A')"
    echo -e "  ${CYAN}Frontend PID:${NC} $(cat "$FRONTEND_PID_FILE" 2>/dev/null || echo 'N/A')"
    echo ""
    echo -e "  Logs: ${CYAN}$LOG_DIR/backend.log${NC} | ${CYAN}$LOG_DIR/frontend.log${NC}"
    echo -e "  Stop: ${YELLOW}Ctrl+C${NC} or ${YELLOW}kill \$(cat .backend.pid) \$(cat .frontend.pid)${NC}"
    echo ""

    # Keep script alive so Ctrl+C triggers cleanup
    info "Services are running. Press Ctrl+C to stop all."
    wait
}

main "$@"
