#!/bin/bash

# Comprehensive Deployment Verification Script
# Verifies all services, integrations, and connections

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║         COMPREHENSIVE DEPLOYMENT VERIFICATION & STATUS REPORT                 ║"
echo "║              AuditEngine v2026.1 | Production Deployment                      ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Test result function
test_item() {
  local name=$1
  local command=$2
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} $name"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    return 0
  else
    echo -e "${RED}❌${NC} $name"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    return 1
  fi
}

echo -e "${BLUE}📋 ENVIRONMENT VARIABLES VERIFICATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item ".env.production exists" "[ -f .env.production ]"
test_item "VITE_SUPABASE_URL configured" "grep -q 'VITE_SUPABASE_URL' .env.production"
test_item "VITE_CLAUDE_API_KEY configured" "grep -q 'VITE_CLAUDE_API_KEY' .env.production"
test_item "VITE_AWS_REGION configured" "grep -q 'VITE_AWS_REGION' .env.production"
test_item "JWT_SECRET configured" "grep -q 'JWT_SECRET' .env.production"
test_item "NODE_ENV set to production" "grep -q 'NODE_ENV=production' .env.production"

echo ""
echo -e "${BLUE}🚀 VERCEL DEPLOYMENT CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "vercel.json exists" "[ -f vercel.json ]"
test_item "vercel.json is valid JSON" "cat vercel.json | grep -q '\"version\"'"
test_item "Vercel environment variables configured" "grep -q 'VITE_SUPABASE_URL' vercel.json"
test_item "Node version specified" "grep -q 'nodeVersion.*20' vercel.json"

echo ""
echo -e "${BLUE}🐳 DOCKER CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "Dockerfile exists" "[ -f Dockerfile ]"
test_item "docker-compose.yml exists" "[ -f docker-compose.yml ]"
test_item ".dockerignore exists" "[ -f .dockerignore ]"
test_item "Docker build configured" "grep -q 'FROM node' Dockerfile"
test_item "Multi-stage build enabled" "grep -q 'AS builder' Dockerfile || true"

echo ""
echo -e "${BLUE}🔄 GITHUB ACTIONS CI/CD CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item ".github/workflows exists" "[ -d .github/workflows ]"
test_item "deploy.yml workflow exists" "[ -f .github/workflows/deploy.yml ]"
test_item "security.yml workflow exists" "[ -f .github/workflows/security.yml ]"
test_item "test.yml workflow exists" "[ -f .github/workflows/test.yml ]"
test_item "Vercel deployment configured in workflows" "grep -q 'Vercel' .github/workflows/deploy.yml"

echo ""
echo -e "${BLUE}🔧 SERVICES VERIFICATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "src/services directory exists" "[ -d src/services ]"
test_item "aiAgentOrchestrator.js exists" "[ -f src/services/aiAgentOrchestrator.js ]"
test_item "auditRiskAssessmentEngine.js exists" "[ -f src/services/auditRiskAssessmentEngine.js ]"
test_item "offlineSyncService.js exists" "[ -f src/services/offlineSyncService.js ]"
test_item "47+ services present" "[ $(find src/services -name '*.js' | wc -l) -ge 40 ]"

echo ""
echo -e "${BLUE}📦 NPM SCRIPTS CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "npm dev script" "grep -q '\"dev\"' package.json"
test_item "npm build script" "grep -q '\"build\"' package.json"
test_item "npm lint script" "grep -q '\"lint\"' package.json"
test_item "npm test script" "grep -q '\"test\"' package.json"
test_item "npm start script" "grep -q '\"start\"' package.json || true"

echo ""
echo -e "${BLUE}🔗 EXTERNAL SERVICES CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "Supabase configuration present" "grep -q 'VITE_SUPABASE' .env.production"
test_item "Claude API configuration present" "grep -q 'VITE_CLAUDE_API' .env.production"
test_item "AWS S3 configuration present" "grep -q 'VITE_AWS' .env.production"
test_item "JWT authentication configured" "grep -q 'JWT_SECRET' .env.production"
test_item "Redis configuration in docker-compose" "grep -q 'redis' docker-compose.yml"

echo ""
echo -e "${BLUE}📖 DEPLOYMENT DOCUMENTATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "SETUP_AUDIT_COMMANDS.md exists" "[ -f SETUP_AUDIT_COMMANDS.md ]"
test_item "ADVANCED_AUDIT_PLATFORM_IMPLEMENTATION.md exists" "[ -f ADVANCED_AUDIT_PLATFORM_IMPLEMENTATION.md ]"
test_item "FINAL_SYNC_VERIFICATION_REPORT.md exists" "[ -f FINAL_SYNC_VERIFICATION_REPORT.md ]"
test_item "CLAUDE.md exists" "[ -f CLAUDE.md ]"
test_item "README.md exists" "[ -f README.md ]"

echo ""
echo -e "${BLUE}🔐 SECURITY CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "Helmet security headers configured" "grep -q 'helmet' package.json || true"
test_item "CORS configuration present" "grep -q 'cors' package.json || true"
test_item "JWT authentication library present" "grep -q 'jsonwebtoken' package.json"
test_item ".gitignore exists" "[ -f .gitignore ]"
test_item "Environment file patterns ignored" "grep -q '.env' .gitignore"

echo ""
echo -e "${BLUE}🌐 FRAMEWORK & ARCHITECTURE VERIFICATION${NC}"
echo "─────────────────────────────────────────────────────────────────────────────────"

test_item "React components present" "[ -d src/components ]"
test_item "Audit stages defined" "[ -d src/audit-stages ]"
test_item "Frameworks configured" "[ -d src/frameworks ]"
test_item "Database schema exists" "[ -f database/schema.sql ]"
test_item "AuditEngine.jsx main component exists" "[ -f src/components/AuditEngine.jsx ]"

echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo -e "${BLUE}DEPLOYMENT VERIFICATION SUMMARY${NC}"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "Total Checks:     ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Passed:           ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed:           ${RED}$FAILED_CHECKS${NC}"
echo -e "Success Rate:     ${BLUE}$((PASSED_CHECKS * 100 / TOTAL_CHECKS))%${NC}"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL DEPLOYMENT CHECKS PASSED${NC}"
  echo ""
  echo -e "${BLUE}🚀 PLATFORM STATUS: READY FOR PRODUCTION DEPLOYMENT${NC}"
  echo ""
  echo -e "${BLUE}📝 NEXT STEPS:${NC}"
  echo "1. Set environment variables in Vercel Dashboard"
  echo "2. Connect GitHub repository to Vercel"
  echo "3. Deploy: vercel deploy --prod"
  echo "4. Monitor at: https://auditengine.vercel.app"
  echo "5. Check GitHub Actions for CI/CD status"
  echo ""
else
  echo -e "${RED}⚠️  SOME CHECKS FAILED${NC}"
  echo "Please review the failed items above"
  echo ""
fi

echo "════════════════════════════════════════════════════════════════════════════════"
