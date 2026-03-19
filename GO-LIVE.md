# 🚀 AUDIT AUTOMATION ENGINE - GO LIVE PRODUCTION GUIDE

## ✅ PRODUCTION-READY COMPLETION STATUS

### PHASE 1: AI MODELS ✅
- [x] Multi-model AI strategy (Claude + OpenAI + Ollama)
- [x] Model selection service with health checks
- [x] Automatic fallback chain
- [x] Agent-to-model mapping for all 9 agents
- [x] Metrics and execution tracking
- [x] `.env.template` with all 17 configuration sections

### PHASE 2: EXTERNAL CONNECTORS ✅
- [x] Slack connector (alerts, findings, reports)
- [x] GitHub connector (PRs, issues, releases)
- [x] Email connector (SMTP + SendGrid)
- [x] AWS connector (S3 + CloudWatch)
- [x] Connector manager (unified management)
- [x] Health monitoring and recovery

### PHASE 3: PRODUCTION CONFIGURATION ✅
- [x] Health check endpoints (/health, /health/full, /ready)
- [x] Environment variable validation
- [x] Database configuration ready
- [x] Redis cache configuration ready

### PHASE 4: WEBSOCKET & REAL-TIME ✅
- [x] WebSocket server setup (socket.io)
- [x] Agent progress streaming
- [x] Audit event broadcasts
- [x] Connector status updates
- [x] System alerts broadcasting

### PHASE 5: PLUGINS & PDF ✅
- [x] PDF report generation service
- [x] Working papers PDF export
- [x] Compliance report generation
- [x] Report listing and cleanup

### PHASE 6: DEPLOYMENT ✅
- [x] Docker containerization (Dockerfile)
- [x] Docker Compose (full stack: app, postgres, redis, ollama)
- [x] Health checks for all services
- [x] Volume management
- [x] Network configuration

### PHASE 7: VERIFICATION ✅
- [x] Production verification script
- [x] Environment check
- [x] AI model health tests
- [x] Connector tests
- [x] API endpoint tests
- [x] PDF generation tests
- [x] Comprehensive reporting

---

## 🎯 QUICK START: 3 OPTIONS

### Option 1: Docker (Recommended for Production)

```bash
# 1. Copy environment file
cp .env.template .env

# 2. Fill in your API keys and credentials
nano .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be healthy
docker-compose ps

# 5. Verify installation
docker-compose exec audit-engine npm run verify:prod

# 6. Access the system
# App: http://localhost:5173
# API: http://localhost:3001
```

### Option 2: Local Development (3-Terminal Setup)

```bash
# Terminal 1: Database & Cache
docker run --name audit-postgres -e POSTGRES_PASSWORD=password -d postgres:15-alpine
docker run --name audit-redis -d redis:7-alpine

# Terminal 2: Backend Server
npm install
npm run start:api

# Terminal 3: Frontend Dev
npm run dev
```

### Option 3: Manual Full Stack

```bash
# 1. Start services manually
npm install --legacy-peer-deps

# 2. Terminal 1: Development
npm run dev

# 3. Terminal 2: API Engine
node scripts/start-engine.js

# 4. Terminal 3: Watchdog
node scripts/start-watchdog.js
```

---

## 📋 CONFIGURATION CHECKLIST

### Environment Variables (.env)
Before launching, ensure these are configured:

**AI Models:**
- [ ] `ANTHROPIC_API_KEY` - Claude API key
- [ ] `OPENAI_API_KEY` - OpenAI/GPT-4 API key
- [ ] `OLLAMA_URL` - Local model endpoint (default: http://localhost:11434)

**Connectors:**
- [ ] `SLACK_BOT_TOKEN` - Slack bot token
- [ ] `SLACK_SIGNING_SECRET` - Slack webhook secret
- [ ] `GITHUB_TOKEN` - GitHub personal access token
- [ ] `SENDGRID_API_KEY` - SendGrid API key (or SMTP credentials)
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key
- [ ] `AWS_REGION` - AWS region (default: us-east-1)

**Database:**
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `REDIS_URL` - Redis connection string

**Security:**
- [ ] `JWT_SECRET` - Minimum 32 characters
- [ ] `SESSION_SECRET` - Minimum 32 characters
- [ ] `CORS_ORIGIN` - Frontend origin(s)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Pre-Deployment Verification

```bash
# Run complete verification
npm run verify:prod

# Expected output: All checks should PASS
# If any FAIL, address them before deployment
```

### Step 2: Database Setup

```bash
# If not using Docker:
psql -U postgres -d audit_engine -f db/migrations/001_init.sql

# Or with Docker:
docker-compose exec postgres psql -U postgres -d audit_engine -f /docker-entrypoint-initdb.d/001_init.sql
```

### Step 3: Start Services

```bash
# Docker (recommended):
docker-compose up -d

# Or manual:
npm run start:production
```

### Step 4: Verify Health

```bash
# Check API health
curl http://localhost:3001/health

# Full system health
curl http://localhost:3001/health/full

# Readiness
curl http://localhost:3001/ready
```

### Step 5: Monitor Logs

```bash
# Docker logs
docker-compose logs -f audit-engine

# Or local logs
tail -f logs/audit-engine.log
```

---

## 🔌 CONNECTOR SETUP

### Slack

1. Create Slack app at https://api.slack.com/apps
2. Add bot token scopes: `chat:write`, `files:write`
3. Generate bot token (xoxb-...)
4. Get signing secret
5. Configure webhook: `YOUR_DOMAIN/connectors/slack/webhook`
6. Set `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`

### GitHub

1. Generate personal access token at https://github.com/settings/tokens
2. Scopes: `repo`, `workflow`, `write:packages`
3. Configure webhook: `YOUR_DOMAIN/connectors/github/webhook`
4. Secret for signing
5. Set `GITHUB_TOKEN` and `GITHUB_WEBHOOK_SECRET`

### Email (SendGrid)

1. Get API key from https://app.sendgrid.com/settings/api_keys
2. Set `SENDGRID_API_KEY`
3. Configure from email: `SENDGRID_FROM_EMAIL`

### AWS

1. Create IAM user with S3 and CloudWatch permissions
2. Generate access key and secret
3. Create S3 bucket for audit files
4. Set all AWS_* environment variables

---

## 📊 MONITORING & HEALTH

### Health Check Endpoints

- **GET /health** - Basic health check
- **GET /health/full** - Comprehensive system status
- **GET /ready** - Kubernetes-style readiness probe
- **GET /live** - Kubernetes-style liveness probe

### Metrics

All execution metrics are sent to:
- **CloudWatch** (if AWS configured)
- **Prometheus** (if using docker-compose)

### Logs

- **API Logs:** `logs/audit-engine.log`
- **Agent Logs:** `logs/agents.log`
- **Connector Logs:** `logs/connectors.log`
- **Docker Logs:** `docker-compose logs -f`

---

## 🧪 TESTING

### Run Verification

```bash
npm run verify:prod
```

### Test Individual Components

```bash
# Test models
npm run test:models

# Test connectors
npm run test:connectors

# Test API
npm run test:api

# Test agents
npm run test:agents
```

### Sample Audit

```bash
# Start a sample audit to test end-to-end
curl -X POST http://localhost:3001/api/audits/create \
  -H "Content-Type: application/json" \
  -d '{
    "auditName": "Sample Audit",
    "entityName": "Test Entity",
    "fiscalYearEnd": "2023-12-31"
  }'
```

---

## 🔒 SECURITY CHECKLIST

- [ ] All API keys in `.env` (never in code)
- [ ] JWT_SECRET is 32+ characters
- [ ] SESSION_SECRET is 32+ characters
- [ ] CORS_ORIGIN is configured correctly
- [ ] Database password is strong
- [ ] SSL/TLS enabled (in production)
- [ ] Rate limiting enabled
- [ ] GDPR compliance verified
- [ ] Audit trail recording is enabled
- [ ] Data encryption at rest configured

---

## 📈 SCALING CONSIDERATIONS

### Horizontal Scaling

- **Load Balancer:** Route requests across multiple instances
- **Database:** Use read replicas for scaling
- **Cache:** Redis cluster for distributed caching
- **Storage:** S3 for distributed file storage

### Performance Optimization

- Agent response caching (5 minute TTL)
- Connection pooling for database
- WebSocket for real-time updates
- Compression for API responses

---

## 🆘 TROUBLESHOOTING

### Port Already in Use

```bash
# Find process using port
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Model Not Available

```bash
# Check Claude API key
echo $ANTHROPIC_API_KEY | head -c 10...

# Test API
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/messages/...
```

### Connector Not Working

```bash
# Check connector status
curl http://localhost:3001/api/connectors/status

# Check logs
docker-compose logs audit-engine | grep connector
```

---

## 📞 SUPPORT

- Documentation: See `3-TERMINAL-SETUP.md` and `FINAL-LAUNCH-GUIDE.md`
- Issues: Create issue on GitHub repository
- Logs: Check application logs in `logs/` directory
- Verification: Run `npm run verify:prod` for system status

---

## 🎉 PRODUCTION SUCCESS CRITERIA

After GO LIVE, verify:

- ✅ All 9 agents operational and coordinated
- ✅ 3 AI models available (at least 1)
- ✅ 4 external connectors authenticated
- ✅ WebSocket real-time updates working
- ✅ PDF reports generating correctly
- ✅ Health checks all green
- ✅ Database connected and migrated
- ✅ Audit trail recording events
- ✅ System can run complete audit start-to-finish
- ✅ All endpoints responding

---

## 📝 VERSION INFORMATION

- **Audit Engine:** v1.0.0
- **Node:** 18+
- **PostgreSQL:** 15
- **Redis:** 7
- **Docker:** 20+

---

**System is production-ready and fully verified! 🚀**

Last Updated: 2026-03-19
