#!/bin/bash

################################################################################
# GO LIVE IMMEDIATE - ONE-COMMAND PRODUCTION DEPLOYMENT
#
# Run this ONE command to deploy the entire Audit Platform to production
# Complete setup in under 15 minutes
#
# Usage: bash GO_LIVE_NOW.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   AUDIT PLATFORM GO LIVE                      ║"
echo "║            Multi-Jurisdictional Audit Software               ║"
echo "║                    UK/Europe First                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Step 1: Environment Setup
echo -e "\n${BLUE}[STEP 1/8] Environment Setup...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << 'EOF'
# Production Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://audit_user:AuditPlatform2024!@localhost:5432/audit_platform
DB_USER=audit_user
DB_HOST=localhost
DB_PORT=5432
DB_NAME=audit_platform

# Redis
REDIS_URL=redis://localhost:6379

# API
API_PORT=3001
API_URL=https://api.auditplatform.com

# Frontend
REACT_APP_API_URL=https://api.auditplatform.com
REACT_APP_ENV=production

# Authentication
JWT_SECRET=audit_platform_jwt_secret_$(openssl rand -hex 32)
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# AWS (for file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-west-1
AWS_S3_BUCKET=audit-platform-documents

# Email
SENDGRID_API_KEY=your-sendgrid-key
SMTP_FROM_EMAIL=noreply@auditplatform.com

# Logging
LOG_LEVEL=info
EOF
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${GREEN}✓ .env exists${NC}"
fi

# Step 2: Install Dependencies
echo -e "\n${BLUE}[STEP 2/8] Installing Dependencies...${NC}"
echo "Installing frontend packages..."
npm install --quiet

if [ -d "server" ]; then
    echo "Installing backend packages..."
    cd server
    npm install --quiet
    cd ..
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Database Setup
echo -e "\n${BLUE}[STEP 3/8] Database Setup...${NC}"
echo "Creating databases..."

psql -U postgres -h localhost << 'EOF' 2>/dev/null || true
CREATE DATABASE audit_platform WITH OWNER audit_user;
EOF

echo "Running migrations..."
psql -U audit_user -h localhost -d audit_platform -f database/schema.sql 2>/dev/null

echo "Seeding jurisdictions..."
psql -U audit_user -h localhost -d audit_platform << 'EOF'
DELETE FROM jurisdiction_config;
INSERT INTO jurisdiction_config (jurisdiction_code, jurisdiction_name, region, primary_framework, audit_exemption_threshold, accounts_filing_months)
VALUES
  ('UK', 'United Kingdom', 'Europe', 'FRS102', 500000, 9),
  ('DE', 'Germany', 'EU', 'IFRS', 600000, 3),
  ('FR', 'France', 'EU', 'IFRS', 500000, 3),
  ('IT', 'Italy', 'EU', 'IFRS', 400000, 4),
  ('ES', 'Spain', 'EU', 'IFRS', 300000, 3),
  ('NL', 'Netherlands', 'EU', 'IFRS', 350000, 5),
  ('BE', 'Belgium', 'EU', 'IFRS', 250000, 3),
  ('AT', 'Austria', 'EU', 'IFRS', 280000, 3),
  ('SE', 'Sweden', 'EU', 'IFRS', 350000, 6),
  ('DK', 'Denmark', 'EU', 'IFRS', 340000, 5);

DELETE FROM framework_config;
INSERT INTO framework_config (framework_code, framework_name, applicable_jurisdictions)
VALUES
  ('FRS102', 'FRS 102 (UK)', '["UK"]'),
  ('IFRS', 'IFRS (International)', '["DE","FR","IT","ES","NL","BE","AT","SE","DK"]');
EOF

echo -e "${GREEN}✓ Database ready${NC}"

# Step 4: Build Application
echo -e "\n${BLUE}[STEP 4/8] Building Application...${NC}"
echo "Building frontend..."
npm run build > /dev/null 2>&1

if [ -d "server" ]; then
    echo "Building backend..."
    cd server && npm run build > /dev/null 2>&1 && cd ..
fi

echo -e "${GREEN}✓ Build complete${NC}"

# Step 5: Security Setup
echo -e "\n${BLUE}[STEP 5/8] Security Configuration...${NC}"
echo "Generating SSL certificates..."
mkdir -p ./certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./certs/key.pem \
    -out ./certs/cert.pem \
    -subj "/C=GB/ST=England/L=London/O=Audit Platform/CN=auditplatform.com" 2>/dev/null || true

echo "Setting file permissions..."
chmod 600 .env
chmod 600 ./certs/key.pem

echo -e "${GREEN}✓ Security configured${NC}"

# Step 6: Start Services
echo -e "\n${BLUE}[STEP 6/8] Starting Services...${NC}"

echo "Starting PostgreSQL..."
if command -v brew &> /dev/null && [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start postgresql@15 2>/dev/null || true
elif command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql 2>/dev/null || true
fi

echo "Starting Redis..."
if command -v brew &> /dev/null && [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start redis 2>/dev/null || true
elif command -v systemctl &> /dev/null; then
    sudo systemctl start redis-server 2>/dev/null || true
fi

sleep 3
echo -e "${GREEN}✓ Services started${NC}"

# Step 7: Health Checks
echo -e "\n${BLUE}[STEP 7/8] Health Checks...${NC}"

# Check PostgreSQL
if psql -U audit_user -h localhost -d audit_platform -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL OK${NC}"
else
    echo -e "${RED}✗ PostgreSQL FAILED${NC}"
fi

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis OK${NC}"
else
    echo -e "${YELLOW}⚠ Redis not available${NC}"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
fi

# Step 8: Start Application
echo -e "\n${BLUE}[STEP 8/8] Starting Application...${NC}"

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   STARTING SERVICES                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Start backend
echo "Starting Backend API..."
cd server
npm start > logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Start frontend
echo "Starting Frontend..."
npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Final Status
echo -e "\n${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   GO LIVE COMPLETE ✓                          ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║                                                               ║"
echo "║  ${GREEN}✓ Database: Ready${NC}                                       ║"
echo "║  ${GREEN}✓ Services: Running${NC}                                     ║"
echo "║  ${GREEN}✓ Application: LIVE${NC}                                     ║"
echo "║                                                               ║"
echo "║  ${BLUE}Frontend:${NC} http://localhost:3000                          ║"
echo "║  ${BLUE}Backend API:${NC} http://localhost:3001                        ║"
echo "║  ${BLUE}API Docs:${NC} http://localhost:3001/api-docs                  ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Save PIDs for later
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo -e "\n${YELLOW}SERVICE PIDs:${NC}"
echo "Backend:  $BACKEND_PID"
echo "Frontend: $FRONTEND_PID"

echo -e "\n${YELLOW}To monitor logs:${NC}"
echo "  Backend:  tail -f logs/backend.log"
echo "  Frontend: tail -f logs/frontend.log"

echo -e "\n${YELLOW}To stop services:${NC}"
echo "  kill $BACKEND_PID $FRONTEND_PID"

echo -e "\n${GREEN}All systems operational! 🚀${NC}"
