# 🤖 MODEL & COMMAND FLOW GUIDE

**Interactive Guide for Development Workflow**
**With Real-Time Progress Tracking**

---

## 🎯 OVERVIEW

This guide shows you how to use AI models and CLI commands together to maximize productivity. Each workflow includes progress dials showing completion status.

---

## 📋 WORKFLOW TYPES

### Type A: Research & Understanding
```
📚 RESEARCH WORKFLOW

Step 1: Ask Claude
├─ Prompt: "Explain [topic]"
├─ Model: Claude (Research mode)
└─ Progress: ⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░ 25%

Step 2: Read Code
├─ Command: Read related files
├─ Tool: Read tool
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░ 40%

Step 3: Ask Follow-ups
├─ Prompt: "How does [X] work?"
├─ Model: Claude (Deep dive)
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░ 60%

Step 4: Summarize Learning
├─ Command: Document findings
├─ Tool: Write tool
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 100%
```

### Type B: Code Implementation
```
🔨 IMPLEMENTATION WORKFLOW

Step 1: Plan
├─ Prompt: "Plan implementation for [feature]"
├─ Model: Claude (Planning mode)
├─ Output: Detailed steps
└─ Progress: ⬜⬜⬜░░░░░░░░░░░░░░░░░░░░░ 15%

Step 2: Review Existing Code
├─ Command: Find related files
├─ Tool: Glob/Read tools
├─ Output: Current implementation
└─ Progress: ⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░░ 30%

Step 3: Implement
├─ Prompt: "Implement [feature] with [requirements]"
├─ Model: Claude (Code generation)
├─ Output: Code files
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░ 65%

Step 4: Test
├─ Command: npm test
├─ Tool: Bash tool
├─ Output: Test results
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░ 85%

Step 5: Commit & Push
├─ Command: git commit && git push
├─ Tool: Bash tool
├─ Output: Confirmation
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 100%
```

### Type C: Debugging & Fixing
```
🐛 DEBUGGING WORKFLOW

Step 1: Understand Problem
├─ Prompt: "Why is [X] failing?"
├─ Model: Claude (Debug mode)
└─ Progress: ⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░░░░ 25%

Step 2: Reproduce Issue
├─ Command: npm test -- [test-name]
├─ Tool: Bash tool
├─ Output: Error details
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░░░ 40%

Step 3: Analyze Root Cause
├─ Prompt: "This error [X] means..."
├─ Model: Claude (Analysis)
├─ Output: Root cause analysis
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░ 60%

Step 4: Implement Fix
├─ Prompt: "Fix this code: [error details]"
├─ Model: Claude (Code fix)
├─ Output: Fixed code
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░ 85%

Step 5: Verify Fix
├─ Command: npm test
├─ Tool: Bash tool
├─ Output: Tests passing
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 100%
```

### Type D: Documentation
```
📖 DOCUMENTATION WORKFLOW

Step 1: Identify Topics
├─ Prompt: "What needs documenting for [module]?"
├─ Model: Claude (Analysis)
└─ Progress: ⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░░░░░ 20%

Step 2: Review Code
├─ Command: Read source files
├─ Tool: Read tool
├─ Output: Code understanding
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░░░░░░░░░ 35%

Step 3: Generate Documentation
├─ Prompt: "Write comprehensive docs for [X]"
├─ Model: Claude (Documentation)
├─ Output: Well-structured docs
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░░░░░░░░░ 70%

Step 4: Validate & Polish
├─ Command: Review docs for completeness
├─ Tool: Read tool
├─ Output: Final docs
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜░░░░ 95%

Step 5: Commit
├─ Command: git commit
├─ Tool: Bash tool
├─ Output: Confirmation
└─ Progress: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 100%
```

---

## 🚀 SPECIFIC WORKFLOWS FOR THIS PROJECT

### Workflow 1: Add a New Feature

**Timeline: 4-6 hours | Progress tracked throughout**

```
┌─────────────────────────────────────────────────────┐
│ FEATURE IMPLEMENTATION WORKFLOW                      │
└─────────────────────────────────────────────────────┘

📌 PHASE 1: PLANNING (20 min)
├─ Progress: ░░░░░░░░░░░░░░░░░░ 0%
├─
├─ USER: "I want to add [feature name]"
├─ MODEL: Claude (Planning mode)
│   Prompt: "Design a [feature] that [requirements]"
│   Response: Architecture, components, tests needed
│
├─ USER: Review design
├─ Progress: ████░░░░░░░░░░░░░░ 20%
└─

📌 PHASE 2: CODE EXPLORATION (30 min)
├─ Progress: ████░░░░░░░░░░░░░░ 20%
├─
├─ USER: "Find existing [related] code"
├─ COMMAND: Read & Glob tools
│   $ glob 'src/**/*.jsx'
│   $ read relevant files
│
├─ USER: "What patterns does this code use?"
├─ MODEL: Claude (Code analysis)
│   Prompt: "Analyze this code pattern"
│   Response: Pattern explanation, recommendations
│
├─ Progress: ████████░░░░░░░░░░ 40%
└─

📌 PHASE 3: IMPLEMENTATION (150 min)
├─ Progress: ████████░░░░░░░░░░ 40%
├─
├─ USER: "Implement [feature] following [pattern]"
├─ MODEL: Claude (Code generation)
│   Prompt: "Write [component] that does [X]"
│   Response: Complete, tested code
│
├─ USER: "Edit and fix any issues"
├─ TOOL: Edit tool
│   $ edit file.jsx (make refinements)
│
├─ Progress: ████████████████░░ 80%
└─

📌 PHASE 4: TESTING (30 min)
├─ Progress: ████████████████░░ 80%
├─
├─ USER: "Test the new feature"
├─ COMMAND: npm test
│   $ npm test -- feature.test.js
│   ✅ All tests passing
│
├─ USER: "Check coverage"
├─ COMMAND: npm run test:coverage
│   ✅ Coverage: 85%+
│
├─ Progress: ███████████████████ 95%
└─

📌 PHASE 5: COMMIT (5 min)
├─ Progress: ███████████████████ 95%
├─
├─ COMMAND: git add && git commit
│   $ git add -A
│   $ git commit -m "feat: add [feature]"
│
├─ COMMAND: git push
│   $ git push -u origin branch
│
├─ Progress: ████████████████████ 100% ✅
└─ COMPLETE
```

### Workflow 2: Fix a Bug

**Timeline: 1-2 hours | Progress tracked**

```
┌─────────────────────────────────────────────────────┐
│ BUG FIX WORKFLOW                                     │
└─────────────────────────────────────────────────────┘

🐛 PHASE 1: UNDERSTAND BUG (15 min)
├─ Progress: ██░░░░░░░░░░░░░░░░ 10%
├─
├─ USER: "The [feature] is broken because [symptom]"
├─ MODEL: Claude (Debug mode)
│   Prompt: "Why would [symptom] happen?"
│   Response: Possible causes, investigation steps
│
├─ Progress: ████░░░░░░░░░░░░░░ 20%
└─

🐛 PHASE 2: REPRODUCE BUG (15 min)
├─ Progress: ████░░░░░░░░░░░░░░ 20%
├─
├─ COMMAND: Find and run failing test
│   $ npm test -- [test-file]
│   ❌ Test fails with error: [X]
│
├─ USER: "Show me the error details"
├─ COMMAND: npm test -- --reporter=verbose
│   ✅ Error context visible
│
├─ Progress: ██████░░░░░░░░░░░░ 30%
└─

🐛 PHASE 3: ANALYZE ROOT CAUSE (20 min)
├─ Progress: ██████░░░░░░░░░░░░ 30%
├─
├─ USER: "This error means [X], what's causing it?"
├─ MODEL: Claude (Code analysis)
│   Prompt: "Analyze this error and suggest fixes"
│   Response: Root cause, solution options
│
├─ USER: "Read the code that's failing"
├─ COMMAND: Read relevant files
│   $ read src/component.jsx
│
├─ Progress: ████████░░░░░░░░░░ 40%
└─

🐛 PHASE 4: IMPLEMENT FIX (30 min)
├─ Progress: ████████░░░░░░░░░░ 40%
├─
├─ USER: "Fix this code to solve [error]"
├─ MODEL: Claude (Fix generation)
│   Prompt: "Fix this code: [error context]"
│   Response: Corrected code
│
├─ TOOL: Edit file
│   $ edit src/component.jsx
│
├─ Progress: ███████████░░░░░░░ 55%
└─

🐛 PHASE 5: TEST FIX (15 min)
├─ Progress: ███████████░░░░░░░ 55%
├─
├─ COMMAND: Run failing test again
│   $ npm test -- [test-file]
│   ✅ Test passing now!
│
├─ COMMAND: Run full test suite
│   $ npm test
│   ✅ All tests still passing
│
├─ Progress: █████████████░░░░░ 65%
└─

🐛 PHASE 6: COMMIT (5 min)
├─ Progress: █████████████░░░░░ 65%
├─
├─ COMMAND: Commit fix
│   $ git add -A
│   $ git commit -m "fix: [bug description]"
│   $ git push
│
├─ Progress: ████████████████████ 100% ✅
└─ COMPLETE
```

---

## 🔄 MODEL INVOCATION PATTERNS

### Pattern 1: Sequential Models
```
User Input
    ↓
Claude (Planning)
    ↓
Claude (Implementation)
    ↓
Claude (Testing)
    ↓
Result

Progress: ░░░░░░░░░░░░░░░░░░ → ████░░░░░░░░░░░░░░ → ... → ████████████████████
```

### Pattern 2: Parallel Exploration
```
User Question
    ├─→ Claude (Design analysis)
    │       ↓
    │   Result A
    │
    ├─→ Claude (Implementation approach)
    │       ↓
    │   Result B
    │
    └─→ Claude (Testing strategy)
            ↓
        Result C

Progress: All three models run in parallel
```

### Pattern 3: Iterative Refinement
```
Claude (v1) → User Review → Claude (v2) → User Review → Claude (v3) ✅

Progress increases with each iteration:
░░░░░░░░░░░░░░░░░░ (v1: 30%)
████░░░░░░░░░░░░░░ (v2: 50%)
████████░░░░░░░░░░ (v3: 70%)
████████████░░░░░░ (Final: 100%)
```

---

## ⚡ QUICK REFERENCE: COMMON WORKFLOWS

### Add Tests
```
Prompt: "Write tests for [function] covering [scenarios]"
Model: Claude
Output: Test file
Command: npm test -- [test-file]
Progress: 0% → 25% → 60% → 85% → 100%
```

### Create Documentation
```
Prompt: "Document [module] for developers"
Model: Claude
Command: read source files
Command: git commit docs
Progress: 0% → 30% → 70% → 90% → 100%
```

### Fix Type Errors
```
Prompt: "Fix TypeScript error: [error]"
Model: Claude
Tool: Edit file
Command: npm run type-check
Progress: 0% → 25% → 50% → 75% → 100%
```

### Optimize Performance
```
Prompt: "Optimize [function] for performance"
Model: Claude
Tool: Edit file
Command: npm run build
Progress: 0% → 40% → 70% → 90% → 100%
```

---

## 📊 PROGRESS DIAL MEANINGS

```
░░░░░░░░░░░░░░░░░░ (0%) Not started
█░░░░░░░░░░░░░░░░░ (5%) Just beginning
██░░░░░░░░░░░░░░░░ (10%) Initial research
████░░░░░░░░░░░░░░ (20%) Planning complete
██████░░░░░░░░░░░░ (30%) Code review done
████████░░░░░░░░░░ (40%) Implementation started
██████████░░░░░░░░ (50%) Halfway through
███████████░░░░░░░ (55%) Core work done
██████████████░░░░ (70%) Testing in progress
████████████████░░ (80%) Ready for commit
███████████████░░░ (85%) Committing
████████████████░░ (90%) Pushing to repo
██████████████████ (95%) Final cleanup
████████████████████ (100%) Complete ✅
```

---

## 🎮 INTERACTIVE PROGRESS TRACKING

### View Live Progress:
```bash
node scripts/workflow-tracker.js
```

### In Workflow:
```
User runs command:
$ npm test

System displays:
⚙️  Testing in Progress
████████░░░░░░░░░░ 40% | 24/60 tests passed
⏱️  2m 15s

[Test results output...]

✅ All Tests Complete
████████████████████ 100%
⏱️  3m 45s
```

---

## 💡 BEST PRACTICES

1. **Always start with planning**
   - Model → Plan before coding
   - Reduces rework and bugs

2. **Review existing patterns**
   - Read → Understand → Implement
   - Maintains code consistency

3. **Test frequently**
   - After each logical step
   - Quick feedback loop

4. **Commit often**
   - After completing each feature/fix
   - Easier to revert if needed

5. **Track progress**
   - Check dials regularly
   - Know where you stand

6. **Document as you go**
   - Don't leave documentation for later
   - Knowledge is fresh

---

## 🔗 WORKFLOW SHORTCUTS

```bash
# Start new feature
/clear && npm test && npm run build

# Daily standup
npm run check:all

# Before commit
npm test && npm run lint && npm run type-check

# After commit
git push -u origin [branch]

# View progress
node scripts/workflow-tracker.js
```

---

**Remember**: Always show progress dials and keep the user informed! 🎯

Next task? I'll show you the progress dial and what's coming next!
