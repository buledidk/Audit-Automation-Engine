# 🤖 Agent Framework - Quick Start Guide

Your Audit Automation Engine now has **6 AI agents working with you** for faster, smarter, and more accurate development with full transparency and compliance!

## ⚡ 30-Second Setup

```bash
# 1. Set your API key (if not already set)
export ANTHROPIC_API_KEY=your_key_here

# 2. Try your first agent command
npm run agents:report

# Done! Your agents are ready to help
```

## 🎯 Quick Commands

```bash
# Planning - Break down complex work
npm run agents:plan "Build real-time notifications system"

# Code Review - Analyze code quality & security
npm run agents:review src/services/AuthService.js security performance

# Security - Run comprehensive security audit
npm run agents:security "API Layer" vulnerabilities encryption

# Compliance - Verify GDPR and regulatory compliance
npm run agents:compliance "Your System" GDPR "ISO 27001"

# Documentation - Auto-generate docs
npm run agents:docs "How to Set Up Authentication" guide

# Testing - Analyze test coverage
npm run agents:test 85

# Report - See what agents did
npm run agents:report

# Full Help - All available commands
npm run agents help
```

## 🚀 Real-World Examples

### Example 1: Prepare for Code Review
```bash
npm run agents:review src/components/AuditDashboard.jsx security
```

**Output**:
- Security issues found
- Performance recommendations
- Maintainability suggestions
- Line-by-line feedback

### Example 2: Pre-Release Security Check
```bash
npm run agents:security "Complete Application" vulnerabilities encryption access-control
```

**Output**:
- All vulnerabilities listed with CVSS scores
- Risk levels (Low/Medium/High/Critical)
- Remediation steps for each issue

### Example 3: GDPR Compliance Verification
```bash
npm run agents:compliance "Audit Engine" GDPR "UK FCA"
```

**Output**:
- GDPR compliance status
- Missing requirements
- Data protection verification
- Audit trail confirmation

### Example 4: Plan a Feature
```bash
npm run agents:plan "Add multi-language support with 15 languages including RTL"
```

**Output**:
- Breakdown into subtasks
- Which agents should be involved
- Estimated effort
- Compliance considerations

## 📊 Agent Capabilities at a Glance

| Agent | What It Does | Best For |
|-------|-------------|----------|
| **Supervisor** | Breaks down complex work | Planning sprints, large features |
| **Code Analyst** | Reviews code | PRs, security checks, optimization |
| **Security** | Security audits | Pre-release, vulnerability scans |
| **Compliance** | GDPR/regulatory checks | Release readiness, audits |
| **Documentation** | Generates docs | API docs, guides, release notes |
| **Testing** | Test analysis | Coverage gaps, test strategy |

## 🔄 Integration with Claude Code Terminal

### Working Together with Claude and Your Agents

You can now use Claude Code with agents for a powerful development experience:

**Workflow 1: Code + Agent Review Cycle**
```bash
# You write code in Claude Code
# Then agents verify it automatically
npm run agents:review your-file.js security

# Claude Code can see the results and improve
# Agents continuously verify improvements
```

**Workflow 2: Plan → Code → Verify**
```bash
# 1. Ask agents to plan
npm run agents:plan "Build feature X"

# 2. Code it in Claude Code
# (Claude builds the code)

# 3. Agents verify
npm run agents:security "Feature X" vulnerabilities
npm run agents:compliance "Feature X" GDPR
npm run agents:test 85

# 4. Ready to deploy!
```

**Workflow 3: Continuous Compliance**
```bash
# Before each commit
npm run agents:report  # See if anything is out of compliance

# This becomes your pre-commit check!
```

## 📈 Transparency & Compliance Features

Every agent action is:
- ✅ **Logged**: Complete audit trail with timestamps
- ✅ **Transparent**: You see the reasoning behind suggestions
- ✅ **Compliant**: GDPR-verified, data minimization enforced
- ✅ **Measurable**: Performance metrics automatically tracked

### View Your Audit Trail
```bash
npm run agents:report
# Shows:
# - All agent actions with timestamps
# - Success rates
# - Token usage
# - Compliance status
# - Performance metrics
```

### Export for Compliance Records
```bash
npm run agents export compliance-report-march-2026.json

# Creates a JSON file with:
# - Complete audit trail
# - All agent recommendations
# - Compliance verification
# - Performance data
# - Timestamps on everything
```

## 🎓 Common Scenarios

### Scenario 1: "I'm about to push to main, is everything safe?"
```bash
npm run agents:security "Application" vulnerabilities access-control
npm run agents:compliance "Application" GDPR "ISO 27001"
npm run agents:test 90
npm run agents:report
```

### Scenario 2: "What should I work on next?"
```bash
npm run agents:plan "List priority improvements for audit engine"
```

### Scenario 3: "New teammate joining, need to onboard them"
```bash
npm run agents:docs "Architecture Overview" guide
npm run agents:docs "Authentication System" guide
npm run agents:docs "Database Schema" reference
```

### Scenario 4: "Fixing a security issue"
```bash
npm run agents:review src/security-fix.js security
npm run agents:security "Security Implementation" encryption access-control
```

### Scenario 5: "Before a release"
```bash
# Run the full pre-release checklist
npm run agents:security "Release v7.1" vulnerabilities
npm run agents:compliance "Release v7.1" GDPR "UK FCA" "ISO 27001"
npm run agents:test 95
npm run agents:docs "Release Notes for v7.1" release-notes
npm run agents:report
npm run agents export pre-release-v7.1.json
```

## 🔧 Advanced Usage

### Run Multiple Agents in Sequence
```bash
# Create a script that runs agents for complete analysis
npm run agents:review src/app.js && \
npm run agents:security "Application" && \
npm run agents:compliance "Application" GDPR && \
npm run agents:report
```

### Custom Configuration
Edit `src/agents/agents.config.js` to:
- Change the AI model
- Adjust token limits
- Enable/disable features
- Set compliance frameworks
- Configure logging level

## 💡 Pro Tips

1. **Use agents early**: Run security/compliance checks before they're urgent
2. **Check metrics regularly**: `npm run agents:report` shows how agents are performing
3. **Export audits**: Keep JSON exports for compliance records
4. **Read recommendations carefully**: Agents suggest, you decide
5. **Combine agents**: Multiple agents catch different issues

## 🆘 Troubleshooting

**Error: "API key not found"**
```bash
export ANTHROPIC_API_KEY=your_key_here
```

**Agents slow to respond?**
- Check network connection
- Review metrics: `npm run agents:report`
- Reduce code size for review

**Want to see what's happening?**
```bash
DEBUG=true npm run agents:review your-file.js
```

**Need detailed logs?**
```bash
npm run agents:report
# Shows complete audit trail and metrics
```

## 📚 Full Documentation

See `src/agents/README.md` for:
- Complete API reference
- All available agents
- Detailed configuration options
- Workflow examples
- Integration guides
- Best practices

## 🎉 You're All Set!

Your agents are:
- ✅ Ready to help plan work
- ✅ Ready to review code
- ✅ Ready to audit security
- ✅ Ready to verify compliance
- ✅ Ready to generate docs
- ✅ Ready to analyze tests

Start with: `npm run agents help`

Then try: `npm run agents:report`

Happy developing! 🚀
