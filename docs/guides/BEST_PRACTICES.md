# 🎯 BEST PRACTICES - HOW TO WORK WITH THIS AUTOMATION

**TL;DR:** Copy commands from `COMMAND_REFERENCE.md`. Start with `bash START_HERE.sh`. Don't read docs—just paste commands.

---

## 🚀 THE SIMPLEST WAY TO GET STARTED (Pick ONE)

### Option A: "I Just Want It to Work" ⚡
```bash
bash START_HERE.sh
npm run dev
```
Then open http://localhost:3000 in your browser. Done.

### Option B: "I Want to See Tests Pass" 🧪
```bash
bash START_HERE.sh
npm run test:watch
```
Watch tests as you code. Tests re-run automatically when you save files.

### Option C: "I Want to Build Production" 🏗️
```bash
bash START_HERE.sh
npm run build
npm run preview
```
See the production build in action at http://localhost:5000

---

## 📖 WHAT EACH COMMAND DOES (In Plain English)

| Command | What It Does | When To Use |
|---------|-------------|-----------|
| `npm run dev` | Starts the local server with auto-reload | Every day during development |
| `npm run test:watch` | Runs tests, re-runs when you save | When writing code & tests |
| `npm run build` | Creates production version (minified, optimized) | Before deploying |
| `npm run lint` | Checks for code quality issues | Before committing |
| `npm run check:all` | Runs lint + tests + type-check | Final quality check |
| `make docker-build` | Packages everything into a Docker container | Before deploying to server |
| `bash START_HERE.sh` | One-time setup script | First time only |

---

## 🔄 YOUR TYPICAL DAILY WORKFLOW

```bash
# Morning: Start development
npm run dev                    # Terminal 1: Server runs

# In another terminal (Terminal 2)
npm run test:watch            # Tests auto-run on file save

# Make changes, commit, push
git add .
git commit -m "your message"
git push origin claude/setup-e-audit-project-RfaM3

# Before done for the day
npm run check:all             # Make sure everything passes
npm run build                 # Test production build
```

---

## 💻 TWO-TERMINAL SETUP (Recommended)

**Terminal 1 - Development Server:**
```bash
npm run dev
# Output: "VITE v5.1.0 ready in XXX ms"
# Keep this running while you code
# Ctrl+C to stop
```

**Terminal 2 - Tests & Commands:**
```bash
npm run test:watch
# Runs tests automatically when you save files
# Type 'q' to quit
```

**Terminal 3 (Optional) - Git Operations:**
```bash
git status
git add .
git commit -m "message"
git push origin claude/setup-e-audit-project-RfaM3
```

---

## 🎨 HOW TO ADD NEW COMPONENTS

```bash
# 1. Create component file
cat > src/components/MyComponent.jsx << 'EOF'
export const MyComponent = () => {
  return <div>Hello World</div>;
};
export default MyComponent;
EOF

# 2. Create test file
cat > src/components/MyComponent.test.jsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
EOF

# 3. Tests should auto-run, check terminal 2
# 4. Use component in App.jsx or other files
```

---

## 🧪 WRITING TESTS (Simple Guide)

```javascript
// Test file: src/components/ClientOnboarding.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientOnboarding from './ClientOnboarding';

describe('ClientOnboarding', () => {
  it('renders form fields', () => {
    render(<ClientOnboarding />);
    expect(screen.getByText('Client Onboarding')).toBeInTheDocument();
  });

  it('submits form data', async () => {
    render(<ClientOnboarding />);
    const submitBtn = screen.getByText('Submit');
    fireEvent.click(submitBtn);
    // Add assertions
  });
});
```

Then in Terminal 2, tests auto-run. If they fail, fix the code and save—tests re-run automatically.

---

## 🐛 DEBUGGING TIPS

### If Tests Fail
```bash
# 1. Read the error message carefully
# 2. Check which line in the code is wrong
# 3. Fix the code and save—tests re-run automatically
npm run test:watch    # Look at error output
```

### If Build Fails
```bash
# 1. Check npm run lint for syntax errors
npm run lint

# 2. Check type errors
npm run type-check

# 3. Run full check
npm run check:all

# 4. Fix any issues shown
```

### If Development Server Won't Start
```bash
# 1. Check if port 3000 is in use
lsof -i :3000

# 2. Kill the process using port 3000
kill -9 <PID>

# 3. Start server again
npm run dev
```

---

## 📝 COMMITTING CODE (Git Workflow)

```bash
# 1. Check what changed
git status

# 2. Add your changes
git add .

# 3. Commit with a clear message
git commit -m "feat: Add ClientOnboarding component"

# 4. Push to your branch
git push origin claude/setup-e-audit-project-RfaM3

# 5. Verify it pushed
git log -1
```

**Commit Message Tips:**
- `feat:` for new features
- `fix:` for bug fixes
- `test:` for tests
- `docs:` for documentation
- `refactor:` for code cleanup

---

## 🚀 GOING FROM DEVELOPMENT TO PRODUCTION

**Step 1: Quality Check**
```bash
npm run check:all     # Lint + Type + Tests
```

**Step 2: Build Production Version**
```bash
npm run build         # Creates optimized dist/ folder
```

**Step 3: Test Production Build Locally**
```bash
npm run preview       # Run production build locally
```

**Step 4: Docker (for servers)**
```bash
make docker-build     # Create Docker image
make docker-run       # Run Docker container
```

**Step 5: Deploy**
```bash
make deploy-staging   # Deploy to staging
# After testing: manual deploy to production
```

---

## 🎓 LEARNING THE CODEBASE

```bash
# 1. See what components exist
ls src/components/

# 2. View a component
cat src/components/AuditEngine.jsx | head -50

# 3. See tests for that component
cat src/components/AuditEngine.test.jsx

# 4. Search for specific code
grep -r "function handleSubmit" src/

# 5. See all imports in a file
grep "^import" src/components/AuditEngine.jsx
```

---

## ⚡ TIME-SAVING SHORTCUTS

| Task | Command |
|------|---------|
| Start everything | `npm run dev & npm run test:watch` |
| Quality check | `npm run check:all` |
| Deploy locally | `npm run build && npm run preview` |
| Docker deploy | `make deploy-staging` |
| Fix code style | `npm run lint -- --fix` |
| See recent commits | `git log --oneline -10` |
| Revert last commit | `git reset --soft HEAD~1` |
| View file changes | `git diff src/components/` |

---

## 🔑 KEY FILES TO KNOW

```
Audit-Automation-Engine/
├── src/
│   ├── components/          ← React components here
│   ├── services/            ← Business logic here
│   ├── hooks/               ← Custom React hooks here
│   ├── App.jsx              ← Main app file
│   └── main.jsx             ← Entry point
├── scripts/
│   ├── sql/                 ← Database schemas
│   └── docker/              ← Docker config
├── COMMAND_REFERENCE.md     ← All commands (this is your friend!)
├── BEST_PRACTICES.md        ← You are here
├── Makefile                 ← Make commands
├── START_HERE.sh            ← First-time setup
└── package.json             ← Project config
```

---

## 🎯 THE 3 THINGS YOU NEED TO KNOW

1. **Start Server:** `npm run dev` (keeps running in Terminal 1)
2. **Watch Tests:** `npm run test:watch` (in Terminal 2)
3. **Make Changes:** Edit files in `src/` and save → server and tests auto-reload

That's it. You don't need to memorize anything else.

---

## 📚 WHEN YOU NEED HELP

```bash
# All commands in one place
cat COMMAND_REFERENCE.md

# Quick examples
cat QUICK_START.txt

# See what Make can do
make help

# See npm scripts
npm run

# Official docs
# - Vite: https://vitejs.dev/
# - React: https://react.dev/
# - Vitest: https://vitest.dev/
```

---

**Remember:** You don't need to read everything. Just copy a command from `COMMAND_REFERENCE.md` and paste it. Questions? Grep for the command or check the docs linked above.
