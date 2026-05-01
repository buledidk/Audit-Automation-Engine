#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# AuditEngine — One-Shot Secrets Setup
# Run this once to pull all missing secrets from Supabase
# Usage: bash scripts/setup-secrets.sh
# ═══════════════════════════════════════════════════════════════

set -e
PROJECT_REF="mbvjtondgunckgzrmyhq"
ENV_FILE=".env.local"

echo "╔══════════════════════════════════════════════════╗"
echo "║  AuditEngine — Secrets Setup                    ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Step 1: Supabase login
echo "→ Step 1: Authenticating with Supabase..."
npx supabase login

# Step 2: Pull API keys via Management API
echo ""
echo "→ Step 2: Fetching API keys for project $PROJECT_REF..."
KEYS_JSON=$(npx supabase projects api-keys --project-ref "$PROJECT_REF" --output json 2>/dev/null || echo "FAIL")

if [ "$KEYS_JSON" = "FAIL" ]; then
  echo "  ✗ Could not fetch API keys. Trying alternative method..."
  # Fallback: use the REST API directly
  TOKEN=$(cat ~/.supabase/access-token 2>/dev/null || cat ~/.config/supabase/access-token 2>/dev/null || echo "")
  if [ -n "$TOKEN" ]; then
    KEYS_JSON=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.supabase.com/v1/projects/$PROJECT_REF/api-keys")
  fi
fi

SERVICE_ROLE_KEY=$(echo "$KEYS_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  const sr = Array.isArray(d) ? d.find(k => k.name === 'service_role') : null;
  console.log(sr ? sr.api_key : '');
" 2>/dev/null || echo "")

ANON_KEY=$(echo "$KEYS_JSON" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  const a = Array.isArray(d) ? d.find(k => k.name === 'anon') : null;
  console.log(a ? a.api_key : '');
" 2>/dev/null || echo "")

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "  ✗ Could not extract service_role key automatically."
  echo "  → Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
  echo "  → Copy the 'service_role' key and paste it here:"
  read -r SERVICE_ROLE_KEY
fi

# Step 3: Get JWT secret
echo ""
echo "→ Step 3: Fetching JWT secret..."
TOKEN=$(cat ~/.supabase/access-token 2>/dev/null || cat ~/.config/supabase/access-token 2>/dev/null || echo "")
if [ -n "$TOKEN" ]; then
  JWT_SECRET=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.supabase.com/v1/projects/$PROJECT_REF/config/jwt" | node -e "
    const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    console.log(d.jwt_secret || '');
  " 2>/dev/null || echo "")
fi

if [ -z "$JWT_SECRET" ]; then
  echo "  → Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
  echo "  → Copy the 'JWT Secret' and paste it here:"
  read -r JWT_SECRET
fi

# Step 4: Get Postgres password
echo ""
echo "→ Step 4: Database password..."
echo "  → Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
echo "  → Copy the database password and paste it here:"
read -r DB_PASSWORD

# Step 5: Claude API key
echo ""
echo "→ Step 5: Claude API key..."
CURRENT_CLAUDE=$(grep "^VITE_CLAUDE_API_KEY=" "$ENV_FILE" | cut -d= -f2-)
if [ ${#CURRENT_CLAUDE} -gt 40 ]; then
  echo "  ✓ Claude API key already set (${#CURRENT_CLAUDE} chars)"
else
  echo "  → Go to: https://console.anthropic.com/settings/keys"
  echo "  → Copy your API key (starts with sk-ant-) and paste it here:"
  read -r CLAUDE_KEY
  if [ -n "$CLAUDE_KEY" ]; then
    sed -i '' "s|^VITE_CLAUDE_API_KEY=.*|VITE_CLAUDE_API_KEY=$CLAUDE_KEY|" "$ENV_FILE"
    echo "  ✓ Claude API key saved"
  fi
fi

# Step 6: Write all secrets to .env.local
echo ""
echo "→ Step 6: Writing secrets to $ENV_FILE..."

if [ -n "$SERVICE_ROLE_KEY" ]; then
  sed -i '' "s|^SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" "$ENV_FILE"
  echo "  ✓ SUPABASE_SERVICE_ROLE_KEY set (${#SERVICE_ROLE_KEY} chars)"
fi

if [ -n "$JWT_SECRET" ]; then
  sed -i '' "s|^SUPABASE_JWT_SECRET=.*|SUPABASE_JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
  sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
  echo "  ✓ SUPABASE_JWT_SECRET set (${#JWT_SECRET} chars)"
fi

if [ -n "$DB_PASSWORD" ]; then
  sed -i '' "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$DB_PASSWORD|" "$ENV_FILE"
  # Rebuild DATABASE_URL
  DB_HOST=$(grep "^POSTGRES_HOST=" "$ENV_FILE" | cut -d= -f2-)
  DB_NAME=$(grep "^POSTGRES_DATABASE=" "$ENV_FILE" | cut -d= -f2-)
  DB_USER=$(grep "^POSTGRES_USER=" "$ENV_FILE" | cut -d= -f2-)
  DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}"
  sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$DB_URL|" "$ENV_FILE"
  echo "  ✓ DATABASE_URL set"
fi

# Step 7: Verify
echo ""
echo "→ Step 7: Verifying Supabase connection..."
node -e "
  const fs = require('fs');
  const env = fs.readFileSync('$ENV_FILE', 'utf8');
  const get = k => { const l = env.split('\n').find(l => l.startsWith(k+'=')); return l ? l.split('=').slice(1).join('=').trim() : ''; };
  const url = get('VITE_SUPABASE_URL');
  const key = get('VITE_SUPABASE_ANON_KEY');
  fetch(url + '/rest/v1/engagements?select=id&limit=1', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  }).then(r => {
    if (r.status === 200) console.log('  ✓ Supabase anon connection: OK');
    else console.log('  ✗ Supabase anon connection: HTTP ' + r.status);
  }).catch(e => console.log('  ✗ Connection error:', e.message));
"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  Setup complete! Run: npm run dev               ║"
echo "╚══════════════════════════════════════════════════╝"
