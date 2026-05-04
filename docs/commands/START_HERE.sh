#!/bin/bash
# =====================================================
# 🚀 AUDIT ENGINE - ONE-COMMAND START
# Everything automated, just copy & paste once
# =====================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     AUDIT AUTOMATION ENGINE - 7-DAY SPRINT (ONE COMMAND)     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# =====================================================
# STEP 1: PRE-FLIGHT CHECKS
# =====================================================
echo -e "${BLUE}📋 STEP 1: Pre-Flight Checks${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not installed${NC}"
  echo "   Install from: https://nodejs.org/"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm not installed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Optional: Docker
if ! command -v docker &> /dev/null; then
  echo -e "${YELLOW}⚠ Docker not found (needed for Day 7 deployment)${NC}"
  echo "   Install from: https://www.docker.com/products/docker-desktop"
  echo "   Continuing without Docker for now..."
else
  echo -e "${GREEN}✓ Docker $(docker --version)${NC}"
fi

echo ""

# =====================================================
# STEP 2: INSTALL DEPENDENCIES
# =====================================================
echo -e "${BLUE}📦 STEP 2: Installing Dependencies (npm install)${NC}"
echo ""

if [ ! -d "node_modules" ]; then
  npm install --legacy-peer-deps 2>&1 | tail -20
  echo ""
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# =====================================================
# STEP 3: ENVIRONMENT SETUP
# =====================================================
echo -e "${BLUE}⚙️  STEP 3: Environment Setup${NC}"
echo ""

if [ ! -f ".env.local" ]; then
  cat > .env.local <<'EOF'
# Database (PostgreSQL - optional for dev)
POSTGRES_USER=audit_user
POSTGRES_PASSWORD=AuditEngine2026!
POSTGRES_DB=audit_engine
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# API
API_PORT=3000
API_URL=http://localhost:3000

# Claude AI (get from https://console.anthropic.com/)
VITE_CLAUDE_API_KEY=your-api-key-here
VITE_CLAUDE_MODEL=claude-haiku-4-5-20251001

# Environment
NODE_ENV=development
DEBUG=audit:*

# Stripe (optional, for subscriptions)
VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
EOF
  echo -e "${GREEN}✓ Created .env.local${NC}"
  echo "   ⚠️  Update VITE_CLAUDE_API_KEY in .env.local with your key"
else
  echo -e "${GREEN}✓ .env.local already exists${NC}"
fi
echo ""

# =====================================================
# STEP 4: CREATE DIRECTORIES
# =====================================================
echo -e "${BLUE}📁 STEP 4: Creating Directories${NC}"
echo ""

mkdir -p src/components src/db src/services src/hooks scripts/sql scripts/docker
echo -e "${GREEN}✓ All directories created${NC}"
echo ""

# =====================================================
# STEP 5: AVAILABLE NEXT COMMANDS
# =====================================================
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✅ SETUP COMPLETE!                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}🎯 QUICK COMMANDS TO RUN NEXT:${NC}"
echo ""
echo "1. Start development server (with auto-reload):"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Run tests (watch for changes):"
echo -e "   ${BLUE}npm run test:watch${NC}"
echo ""
echo "3. Build for production:"
echo -e "   ${BLUE}npm run build${NC}"
echo ""
echo "4. Run linter:"
echo -e "   ${BLUE}npm run lint${NC}"
echo ""

echo -e "${YELLOW}📚 ADDITIONAL COMMANDS (via Makefile):${NC}"
echo ""
echo "  make bootstrap          # Full bootstrap (all setup)"
echo "  make dev                # Development server"
echo "  make test               # Run tests with coverage"
echo "  make build              # Production build"
echo "  make docker-build       # Build Docker image"
echo "  make docker-run         # Run Docker container"
echo ""

echo -e "${YELLOW}📖 REFERENCE:${NC}"
echo ""
echo "  👉 For ALL commands: cat COMMAND_REFERENCE.md"
echo "  👉 For best practices: cat BEST_PRACTICES.md"
echo "  👉 For quick cheat sheet: cat QUICK_START.txt"
echo ""

echo -e "${GREEN}🚀 You're ready to start building!${NC}"
echo ""
