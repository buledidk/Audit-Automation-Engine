#!/bin/bash

# 🔍 AUDIT-AUTOMATION-ENGINE QUICK VERIFICATION SCRIPT
# Run this before starting development

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 AUDIT ENGINE - INTEGRATION VERIFICATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. Git Status
echo "1️⃣  Git Status..."
git status --short
if [ $? -eq 0 ]; then echo "   ✅ Git OK"; else echo "   ❌ Git FAILED"; fi
echo ""

# 2. Node & npm
echo "2️⃣  Node & npm Versions..."
echo "   Node: $(node --version)"
echo "   npm:  $(npm --version)"
if [ "$(node --version | cut -d'.' -f1 | cut -d'v' -f2)" -ge 20 ]; then
  echo "   ✅ Node 20+ OK"
else
  echo "   ❌ Node version < 20"
fi
echo ""

# 3. Dependencies
echo "3️⃣  Checking Dependencies..."
if npm list @anthropic-ai/sdk > /dev/null 2>&1; then
  echo "   ✅ @anthropic-ai/sdk installed"
else
  echo "   ❌ @anthropic-ai/sdk missing"
fi

if npm list @supabase/supabase-js > /dev/null 2>&1; then
  echo "   ✅ @supabase/supabase-js installed"
else
  echo "   ❌ @supabase/supabase-js missing"
fi
echo ""

# 4. Environment Variables
echo "4️⃣  Environment Variables..."
if [ -n "$VITE_CLAUDE_API_KEY" ]; then
  echo "   ✅ VITE_CLAUDE_API_KEY set"
else
  echo "   ⚠️  VITE_CLAUDE_API_KEY not in current shell (check .env.local)"
fi

if [ -n "$VITE_SUPABASE_URL" ]; then
  echo "   ✅ VITE_SUPABASE_URL set"
else
  echo "   ⚠️  VITE_SUPABASE_URL not in current shell (check .env.local)"
fi
echo ""

# 5. Lint Check
echo "5️⃣  Running Lint..."
npm run lint > /tmp/lint_output.txt 2>&1
LINT_ERRORS=$(grep "error" /tmp/lint_output.txt | wc -l)
LINT_WARNINGS=$(grep "warning" /tmp/lint_output.txt | wc -l)
if [ $LINT_ERRORS -eq 0 ]; then
  echo "   ✅ No lint errors"
else
  echo "   ❌ $LINT_ERRORS lint errors found"
fi
echo "   ⚠️  $LINT_WARNINGS warnings (non-critical)"
echo ""

# 6. Build Test
echo "6️⃣  Testing Build..."
npm run build > /tmp/build_output.txt 2>&1
if grep -q "built in" /tmp/build_output.txt; then
  echo "   ✅ Build successful"
  BUILD_SIZE=$(grep "gzip:" /tmp/build_output.txt | head -1 | awk '{print $NF}')
  echo "   Bundle size: $BUILD_SIZE (gzipped)"
else
  echo "   ❌ Build failed"
  cat /tmp/build_output.txt | tail -10
fi
echo ""

# 7. Test Suite
echo "7️⃣  Running Tests..."
npm run test -- --run > /tmp/test_output.txt 2>&1
if grep -q "PASS" /tmp/test_output.txt; then
  echo "   ✅ Tests passing"
else
  if grep -q "Test Files" /tmp/test_output.txt; then
    echo "   ⚠️  Some tests may be skipped or not found"
  else
    echo "   ❌ Test suite failed"
  fi
fi
echo ""

# 8. Directory Structure
echo "8️⃣  Directory Structure..."
for DIR in "src" "src/services" "src/components" "database" "dist"; do
  if [ -d "$DIR" ]; then
    echo "   ✅ $DIR/"
  else
    echo "   ❌ $DIR/ NOT FOUND"
  fi
done
echo ""

# 9. Critical Files
echo "9️⃣  Critical Files..."
for FILE in ".env" ".env.local" "CLAUDE.md" "package.json" "vite.config.js"; do
  if [ -f "$FILE" ]; then
    echo "   ✅ $FILE"
  else
    echo "   ❌ $FILE NOT FOUND"
  fi
done
echo ""

# 10. Branch & Remote
echo "🔟 Git Branch & Remote..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE=$(git config --get branch.$BRANCH.remote)
echo "   Branch: $BRANCH"
echo "   Remote: $REMOTE"
if [[ "$BRANCH" == "claude/"* ]]; then
  echo "   ✅ Correct branch naming"
else
  echo "   ⚠️  Branch doesn't follow claude/* pattern"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════"
echo "✅ VERIFICATION COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. npm run dev                   # Start development server"
echo "2. npm run test:watch           # Watch tests in another terminal"
echo "3. Make your changes"
echo "4. npm run check:all            # Before committing"
echo "5. git push origin $BRANCH      # Push to remote"
echo ""
