#!/bin/bash

# Health Check Script - Verify all systems are running
# Usage: ./scripts/health-check.sh

echo "🔍 AUDIT AUTOMATION ENGINE - HEALTH CHECK"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Helper function to check if port is open
check_port() {
  local port=$1
  local name=$2

  if nc -z localhost $port > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $name is running on port $port"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $name is NOT running on port $port"
    ((FAILED++))
  fi
}

# Helper function to check command exists
check_command() {
  local cmd=$1
  local name=$2

  if command -v $cmd &> /dev/null; then
    echo -e "${GREEN}✓${NC} $name is installed"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $name is NOT installed"
    ((FAILED++))
  fi
}

# Helper function to check file exists
check_file() {
  local file=$1
  local name=$2

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $name exists"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $name does NOT exist"
    ((FAILED++))
  fi
}

echo "📦 DEPENDENCIES"
echo "==============="
check_command "node" "Node.js"
check_command "npm" "npm"
check_command "psql" "PostgreSQL"
check_command "redis-cli" "Redis"
echo ""

echo "🔌 PORTS"
echo "========"
check_port 5175 "Frontend (Vite)"
check_port 3001 "Backend (Express)"
check_port 5432 "Database (PostgreSQL)"
check_port 6379 "Cache (Redis)"
echo ""

echo "📁 FILES & DIRECTORIES"
echo "====================="
check_file "package.json" "package.json"
check_file "vite.config.js" "vite.config.js"
check_file "src/App.jsx" "Frontend app"
check_file "server/app.js" "Backend app"
check_file "server/database/schema.sql" "Database schema"
echo ""

echo "🚀 SERVICES"
echo "==========="
ps aux | grep -i "vite" | grep -v grep > /dev/null && {
  echo -e "${GREEN}✓${NC} Frontend dev server is running"
  ((PASSED++))
} || {
  echo -e "${RED}✗${NC} Frontend dev server is NOT running"
  ((FAILED++))
}

ps aux | grep -i "node.*server" | grep -v grep > /dev/null && {
  echo -e "${GREEN}✓${NC} Backend server is running"
  ((PASSED++))
} || {
  echo -e "${RED}✗${NC} Backend server is NOT running"
  ((FAILED++))
}

ps aux | grep -i "postgres" | grep -v grep > /dev/null && {
  echo -e "${GREEN}✓${NC} PostgreSQL is running"
  ((PASSED++))
} || {
  echo -e "${RED}✗${NC} PostgreSQL is NOT running"
  ((FAILED++))
}

ps aux | grep -i "redis-server" | grep -v grep > /dev/null && {
  echo -e "${GREEN}✓${NC} Redis is running"
  ((PASSED++))
} || {
  echo -e "${RED}✗${NC} Redis is NOT running"
  ((FAILED++))
}
echo ""

echo "🤖 AGENTS"
echo "========="
if [ -f "src/services/aiAgentOrchestrator.js" ]; then
  echo -e "${GREEN}✓${NC} AI Agent Orchestrator exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} AI Agent Orchestrator not yet created"
  ((FAILED++))
fi

if [ -f "src/middleware/auditLogger.js" ]; then
  echo -e "${GREEN}✓${NC} Audit Logger exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Audit Logger not yet created"
  ((FAILED++))
fi

if [ -f "src/workers/queue.js" ]; then
  echo -e "${GREEN}✓${NC} Worker Queue exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Worker Queue not yet created"
  ((FAILED++))
fi
echo ""

echo "📊 SUMMARY"
echo "=========="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All systems healthy!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some systems need attention${NC}"
  exit 1
fi
