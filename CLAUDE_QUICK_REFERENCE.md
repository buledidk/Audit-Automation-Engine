# ⚡ CLAUDE QUICK REFERENCE: COMMAND PALETTE
## Copy-Paste Exact Commands & Prompts for Maximum Efficiency

**Version**: 1.0 | **Status**: READY TO USE | **Updated**: March 14, 2026

---

## 🎯 YOUR MOST-USED COMMANDS (Top 10)

### 1️⃣ START NEW PHASE SESSION
**Use this when starting work on a new phase:**

```bash
# Clear context but keep branch
/clear

# Initialize
pwd && git status && git branch

# Load context
cat PHASE_2_CHECKLIST.md
echo "📋 Current phase loaded"
echo "📁 Branch: $(git branch --show-current)"
echo "⏱️ Starting $(date)"
```

### 2️⃣ IMPLEMENT A FEATURE (Standard Pattern)
**Use this for any enhancement implementation:**

```bash
# Create feature branch
FEATURE="database-sharding"
git checkout -b enhancement/$FEATURE

# Document what you're doing
cat >> IMPLEMENTATION_LOG.md << 'EOF'
## Feature: [FEATURE_NAME]
Started: $(date)
Branch: enhancement/$FEATURE
Tasks:
- [ ] Implement core logic
- [ ] Write tests (80%+ coverage)
- [ ] Documentation
- [ ] Code review
EOF

# Start implementing (Claude: "Implement enhancement E1...")

# After implementing:
npm run test:coverage
npm run lint

# Commit
git commit -m "feat: implement $FEATURE"
git push -u origin enhancement/$FEATURE
```

### 3️⃣ RUN TEST SUITE & VALIDATION
**Use after any code changes:**

```bash
# Full test suite
npm run test

# Coverage check
npm run test:coverage

# Linting
npm run lint

# Security audit
npm run audit

# Performance benchmark
npm run benchmark

# All checks
npm run check:all
```

### 4️⃣ MERGE FEATURE TO MAIN BRANCH
**Use when feature is complete and tested:**

```bash
# Ensure tests pass
npm run test

# Switch to main branch
git checkout claude/setup-e-audit-project-RfaM3

# Merge feature
git merge --no-ff enhancement/$FEATURE -m "merge: add $FEATURE"

# Delete feature branch
git branch -d enhancement/$FEATURE

# Push
git push origin claude/setup-e-audit-project-RfaM3

# Tag if milestone reached
git tag -a v1.1 -m "Feature complete: $FEATURE"
git push --tags
```

### 5️⃣ REQUEST CODE REVIEW (In Claude)
**Use this exact prompt:**

```
Please review this enhancement implementation:

ENHANCEMENT: E[NUMBER] - [TITLE]
FILE: [PATH]
BRANCH: enhancement/[NAME]

Review for:
1. Performance (should be <100ms)
2. Security (no OWASP vulnerabilities)
3. ISA compliance (standard: ISA [NUMBER])
4. Test coverage (should be >80%)
5. Audit trail correctness
6. Professional standards adherence

Provide:
- Score /10
- 2-3 critical issues (if any)
- 3-5 minor improvements
- Estimated effort to fix
- Approval status (yes/no/conditional)
```

### 6️⃣ VERIFY FORMULA IMPLEMENTATION
**Use this prompt for formula verification:**

```
Verify this audit formula implementation:

FORMULA: [NAME]
ISA STANDARD: [ISA NUMBER]
FILE: [PATH]
LINES: [START]-[END]

Test cases:
1. Input: [VALUES] → Expected: [RESULT]
2. Input: [VALUES] → Expected: [RESULT]
3. Input: [VALUES] → Expected: [RESULT]

Verify:
✓ Mathematical correctness
✓ Edge cases handled
✓ ISA compliance
✓ Professional audit appropriateness
✓ Test coverage

Score: _/10
Critical issues: [LIST]
Approval: [YES/NO]
```

### 7️⃣ ORCHESTRATE PARALLEL TASKS
**Use this when you want parallel execution:**

```
Orchestrate these parallel tasks:

CONTEXT: Phase 2 Week 1
TIMELINE: Week 1-2
PARALLELIZATION: YES

Task 1 - Database Sharding (Dev 1)
├─ Duration: 60 hours
├─ Dependency: None
└─ Deliverable: Sharding logic + tests

Task 2 - Test Infrastructure (Dev 2)
├─ Duration: 50 hours
├─ Dependency: None
└─ Deliverable: 80% coverage framework

Task 3 - Backup System (Dev 3)
├─ Duration: 40 hours
├─ Dependency: Database Sharding
└─ Deliverable: Backup + restore verified

What should they do in parallel vs sequentially?
Provide day-by-day timeline for optimal flow.
```

### 8️⃣ GENERATE DOCUMENTATION
**Use this prompt:**

```
Generate documentation for:

TOPIC: [FEATURE NAME]
AUDIENCE: [Auditors / Developers / DevOps]
FORMAT: Markdown
DEPTH: [SUMMARY / DETAILED / EXPERT]

Include:
1. Overview (1-2 paragraphs, non-technical)
2. Key concepts (3-5 bulleted, with examples)
3. Code examples (2-3, copy-paste ready)
4. Common gotchas (3-5 items, how to avoid)
5. Troubleshooting (Q&A format)
6. Quick reference (cheat sheet)
7. Links to full documentation
8. ISA mapping (if applicable)

Write in professional audit terminology.
Make it accessible to juniors.
Include worked examples.
```

### 9️⃣ DEPLOY TO PRODUCTION
**Use this command sequence (Week 7 ONLY):**

```bash
# SAFETY CHECK 1: Verify all tests pass
npm run test:coverage || exit 1

# SAFETY CHECK 2: Verify no security issues
npm run audit || exit 1

# SAFETY CHECK 3: Verify deployment config
npm run verify:deployment || exit 1

# SAFETY CHECK 4: Backup current production
npm run backup:production || exit 1

# PRODUCTION DEPLOYMENT (Blue-Green)
echo "🚀 Starting production deployment..."
npm run deploy:production

# SAFETY CHECK 5: Smoke tests
npm run test:smoke || { npm run rollback:production; exit 1; }

# SUCCESS
echo "✅ PRODUCTION DEPLOYMENT SUCCESSFUL"
echo "🎉 Phase 2 is LIVE"

# Tag release
git tag -a phase-2-production -m "Phase 2 Production Release $(date)"
git push --tags
```

### 🔟 MONITOR PRODUCTION (Post-Deployment)
**Run continuously for 24 hours after go-live:**

```bash
# Real-time monitoring (continuous)
watch -n 1 'curl -s http://api.internal/health | jq .'

# Check error rates
watch -n 5 'tail -100 /var/log/app/error.log | grep "ERROR" | wc -l'

# Check database sync status
while true; do
  echo "Database status: $(npm run check:db-sync 2>/dev/null)"
  sleep 30
done

# If anything goes wrong:
# 1. Check runbooks: cat RUNBOOKS/[ISSUE].md
# 2. Check logs: tail -f /var/log/app/[service].log
# 3. If critical: npm run rollback:production
```

---

## 📝 YOUR MOST-USED PROMPTS (Top 10)

### Prompt 1: Feature Implementation Request
```
Implement enhancement E[NUMBER]: [TITLE]

Current state: [BRIEF DESCRIPTION]
Requirements:
- Requirement 1 (from ENHANCEMENT_RECOMMENDATIONS.md)
- Requirement 2
- Requirement 3

Implementation approach:
- [APPROACH FROM SPEC]

Tests needed:
- Unit: [TEST CASES]
- Integration: [TEST CASES]
- E2E: [TEST CASES]

ISA compliance: ISA [NUMBER]
Success definition:
✓ All tests passing (80%+ coverage)
✓ Code review approved
✓ Zero security issues
✓ Performance <100ms

Deliverables:
1. Code changes (ready to merge)
2. Tests (all passing)
3. Documentation (updated)
4. Commit message (ready to push)
```

### Prompt 2: Architecture Review Request
```
Review the architecture for:

AREA: [DATABASE / UI / DEPLOYMENT / TESTING]
CURRENT STATE: [BRIEF DESCRIPTION]
CONCERN: [PERFORMANCE / SECURITY / SCALABILITY]

Questions:
1. Can this handle 100+ concurrent users?
2. Are there security vulnerabilities?
3. What's the bottleneck?
4. How would you optimize?
5. Any ISA standards affected?

Provide:
- Score /10 for [CONCERN]
- Top 3 risks
- Top 3 optimizations
- Estimated effort for each
- Recommendation (proceed / redesign / investigate)
```

### Prompt 3: Formula Correctness Verification
```
Verify this formula against ISA standards:

FORMULA NAME: [NAME]
LOCATION: [FILE:LINE-LINE]
ISA STANDARD: ISA [NUMBER]

Current implementation:
[PASTE CODE]

Expected behavior:
- Input: [VALUES]
- Output: [EXPECTED VALUE]
- Edge cases: [LIST]

Checks:
☐ Mathematically correct
☐ ISA compliant
☐ Edge cases handled
☐ Professional audit appropriate
☐ Test coverage sufficient

Provide:
- Correctness score /10
- Any issues found
- Recommended fixes
- Approval status
```

### Prompt 4: Code Quality Assessment
```
Assess code quality for:

FILE: [PATH]
FOCUS AREA: [PERFORMANCE / SECURITY / MAINTAINABILITY / TESTING]

Evaluate:
1. Performance: Any bottlenecks?
2. Security: Any OWASP vulnerabilities?
3. Maintainability: Is it clear and modular?
4. Testing: Is coverage sufficient?
5. Standards: ISA compliance issues?
6. Professionalism: Audit-grade quality?

Provide:
- Overall score /10
- Critical issues (must fix)
- Important improvements (should fix)
- Minor suggestions (nice to have)
- Estimated effort to fix
```

### Prompt 5: Test Coverage Analysis
```
Analyze test coverage for:

FILE: [PATH]
TARGET COVERAGE: 80%+
FOCUS: [UNIT / INTEGRATION / E2E]

Current state:
- Total lines: [COUNT]
- Tested lines: [COUNT]
- Coverage: [PERCENTAGE]%

Questions:
1. What's not covered? (list key gaps)
2. What tests are missing? (provide examples)
3. How to reach 80% coverage?
4. Estimated effort?
5. Any risky untested paths?

Deliverable:
- Gap analysis (3-5 key gaps)
- Test examples (2-3 new tests)
- Implementation plan (effort breakdown)
```

### Prompt 6: Documentation Quality Check
```
Review documentation for:

FILE: [PATH or TOPIC]
AUDIENCE: [AUDITORS / DEVELOPERS / DEVOPS / PARTNERS]
COMPLETENESS: [SUMMARY / DETAILED / EXPERT]

Evaluate:
1. Is it complete for the audience?
2. Are examples clear?
3. Is professional terminology used?
4. Are there missing sections?
5. Is it ISA-appropriate?

Provide:
- Completeness score /10
- Missing sections (list)
- Suggested improvements (examples)
- Rewrite any unclear sections
```

### Prompt 7: Deployment Plan Verification
```
Verify this deployment plan:

PHASE: Phase 2
WEEK: Week 1-2
TEAM: 3 developers

Tasks:
1. Database Sharding (60h)
2. Test Infrastructure (50h)
3. Backup System (40h)

Verify:
1. Can 3 people do this in 2 weeks? (60+50+40 = 150h)
2. Are dependencies correct?
3. Is timeline realistic?
4. What could go wrong?
5. How to mitigate risks?

Provide:
- Feasibility assessment (% confidence)
- Risk mitigation strategies
- Suggested timeline adjustments
- Resource recommendations
```

### Prompt 8: ISA Compliance Verification
```
Verify ISA compliance for:

FEATURE: [NAME]
ISA STANDARDS INVOLVED: ISA [LIST]
IMPLEMENTATION FILE: [PATH]

Check:
1. ISA [FIRST] - [Requirement 1, 2, 3]
2. ISA [SECOND] - [Requirement 1, 2, 3]
3. ISA [THIRD] - [Requirement 1, 2, 3]

For each standard:
✓ Is requirement met?
✓ Is it documented?
✓ Is it auditable?
✓ Are there gaps?

Provide:
- Compliance score for each ISA standard /10
- Any gaps found
- How to fix gaps (if any)
- Approval status (compliant / conditional / non-compliant)
```

### Prompt 9: Performance Optimization Request
```
Optimize performance for:

AREA: [FEATURE/COMPONENT]
CURRENT STATE: Response time [XXms] / Database queries: [N]
TARGET: <100ms / <2 queries
CONCERN: [USER EXPERIENCE / INFRASTRUCTURE COST / SCALABILITY]

Current bottlenecks (if known):
- [ISSUE 1]
- [ISSUE 2]
- [ISSUE 3]

Provide:
1. Performance profile (identify top 3 slowest operations)
2. Root cause analysis
3. 3-5 optimization suggestions (with code examples)
4. Expected improvement for each
5. Implementation effort for each
6. Risk assessment (could any break existing functionality?)
7. Recommendation (which to implement first?)
```

### Prompt 10: Security Audit Request
```
Security audit for:

FILE: [PATH]
FOCUS: [AUTHENTICATION / DATA / INPUT VALIDATION / INJECTION / API]
STANDARD: [OWASP TOP 10]

Scan for:
1. SQL injection vulnerabilities
2. XSS vulnerabilities
3. Authentication/authorization issues
4. Data exposure risks
5. Input validation gaps
6. API security issues
7. Sensitive data in logs
8. Secure defaults

Provide:
- Security score /10
- Critical vulnerabilities (must fix immediately)
- High-severity issues (fix before production)
- Medium-severity issues (fix in next sprint)
- Minor issues (recommendations)
- Estimated effort per issue
- Patch examples for critical issues
```

---

## 🔄 SESSION WORKFLOW PATTERNS

### Pattern A: Implement → Test → Commit → Merge
```
Session workflow (repeat for each feature):

1. REQUEST FEATURE IMPLEMENTATION (Prompt 1)
   Claude: ✅ Implements feature with tests

2. RUN TESTS (Command 3)
   You: npm run test:coverage
   Result: ✓ 85% coverage

3. REQUEST CODE REVIEW (Prompt 2)
   Claude: ✅ Reviews code, approves

4. MERGE TO MAIN (Command 4)
   You: git merge --no-ff enhancement/[feature]
   Result: ✓ Merged and pushed

5. NEXT FEATURE
   Repeat for next enhancement
```

### Pattern B: Multi-Task Parallel Orchestration
```
Session workflow (parallel execution):

1. REQUEST ORCHESTRATION (Prompt 4)
   Claude: ✅ Creates parallel task plan

2. YOU IMPLEMENT TASK A
   Clone repo, work on database layer

3. MEANWHILE: LAUNCH AGENT (Background)
   Agent working on Task B (search patterns)
   Agent working on Task C (design review)

4. YOU MONITOR
   Check progress: tail logs/phase2.log

5. AGENTS COMPLETE
   Results come in automatically

6. SYNTHESIS
   Claude integrates all 3 results

7. FINAL COMMIT
   Single unified commit with all work
```

### Pattern C: Production Deployment Ceremony
```
Session workflow (Week 7):

1. PRE-DEPLOYMENT CHECK (Command 3)
   npm run check:all
   Result: ✓ All checks pass

2. BACKUP (Command 9, step 1)
   npm run backup:production
   Result: ✓ Backup created

3. DEPLOYMENT (Command 9, step 5)
   npm run deploy:production
   Result: ✓ Blue-green active

4. SMOKE TESTS (Command 9, step 6)
   npm run test:smoke
   Result: ✓ All paths working

5. MONITORING (Command 10)
   watch -n 1 'health check'
   For 2 hours: Team watches metrics

6. SUCCESS CELEBRATION 🎉
   Phase 2 is LIVE!

7. HANDOFF
   Operations team takes over monitoring
```

---

## 🛠️ QUICK FIXES (When Something Goes Wrong)

### Tests Failing?
```bash
# See what's failing
npm run test -- --verbose

# Run just failing test
npm run test -- path/to/test.js

# Debug with inspector
node --inspect-brk node_modules/.bin/jest

# Ask Claude:
"Why might this test be failing? [PASTE ERROR]"
```

### Performance Issue?
```bash
# Profile the app
npm run benchmark

# Check database performance
npm run check:db-performance

# Memory leak?
npm run check:memory

# Ask Claude:
"Performance is [XXms]. What's the bottleneck? [PASTE PROFILING DATA]"
```

### Security Issue Found?
```bash
# Check what's vulnerable
npm run audit

# Fix automatically (if possible)
npm audit fix

# Manual fix required
git grep "[PATTERN]" | xargs sed -i 's/old/new/'

# Ask Claude:
"Found [SECURITY ISSUE]. How do I fix it? [PASTE DETAILS]"
```

### Merge Conflict?
```bash
# See conflicts
git status

# Resolve: Edit files manually
vim [CONFLICTED_FILE]

# Mark as resolved
git add [CONFLICTED_FILE]

# Complete merge
git commit

# Ask Claude:
"Help me resolve this merge conflict [PASTE CONFLICT]"
```

---

## 📊 METRIC TRACKING

### Quick Metrics Check (Daily)
```bash
# Code quality
npm run test:coverage | grep "Coverage"

# Security issues
npm run audit | grep "vulnerabilities"

# Performance
npm run benchmark | grep "response"

# Timeline progress
git log --oneline | head -10 | wc -l

# To dashboard
date >> METRICS.log
echo "$(npm run test:coverage | grep Coverage)" >> METRICS.log
```

### Weekly Metrics Report
```bash
# Generate report
echo "=== WEEK $(date +%V) METRICS ===" >> WEEKLY_REPORT.md
echo "Commits: $(git log --since='1 week ago' --oneline | wc -l)" >> WEEKLY_REPORT.md
echo "Tests passing: $(npm run test 2>&1 | grep passed | tail -1)" >> WEEKLY_REPORT.md
echo "Coverage: $(npm run test:coverage 2>&1 | grep Coverage)" >> WEEKLY_REPORT.md
echo "Security issues: $(npm run audit 2>&1 | grep vulnerabilities)" >> WEEKLY_REPORT.md

# Show report
cat WEEKLY_REPORT.md
```

---

## 🚀 START HERE: YOUR FIRST COMMAND

**Run this RIGHT NOW in Claude to initialize Phase 2:**

```bash
#!/bin/bash
# Initialize Phase 2 Execution

echo "🚀 PHASE 2 INITIALIZATION"
echo "=========================="
echo ""

# Check current state
echo "Current state:"
git branch --show-current
git log --oneline -1
echo ""

# Load phase 2 context
echo "📋 Phase 2 Checklist:"
cat PHASE_2_CHECKLIST.md | head -15
echo ""

# Ready message
echo "✅ You're ready to start Phase 2!"
echo ""
echo "Next steps:"
echo "1. Read CLAUDE_WORKFLOW_OPTIMIZATION.md (10 min)"
echo "2. Form development team (3-8 people)"
echo "3. Run: npm run test  (verify baseline)"
echo "4. Start with prompt: 'Implement enhancement E1: Database Sharding'"
echo ""
echo "⏱️ Started: $(date)"
echo "📁 Branch: $(git branch --show-current)"
echo "🎯 Target: Phase 2 production go-live in Week 7"
```

---

**🎯 YOU NOW HAVE YOUR COMMAND PALETTE**

Use these:
- ✅ 10 most-used commands (copy-paste)
- ✅ 10 most-used prompts (copy-paste)
- ✅ 3 workflow patterns (follow exactly)
- ✅ Quick fixes (when blocked)
- ✅ Metric tracking (to measure progress)

**Everything is ready. Start executing Phase 2 today.** 🚀
