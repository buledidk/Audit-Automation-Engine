#!/usr/bin/env bash
# AuditEngine launcher — one-time Keychain seeding wizard.
# Run on first launch, or via: ./dev --reset-keychain
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./keychain.sh
source "$SCRIPT_DIR/keychain.sh"

C_BLU=$'\033[1;34m'; C_CYN=$'\033[1;36m'; C_GRN=$'\033[1;32m'; C_YEL=$'\033[1;33m'; C_DIM=$'\033[2m'; C_RST=$'\033[0m'

banner() {
  printf "\n${C_BLU}══════════════════════════════════════════════════════════════${C_RST}\n"
  printf "${C_BLU}  AuditEngine — Keychain setup${C_RST}\n"
  printf "${C_BLU}══════════════════════════════════════════════════════════════${C_RST}\n"
  printf "  Secrets stored via macOS Keychain (service prefix: %s).\n" "${KEYCHAIN_PREFIX}"
  printf "  ${C_DIM}You will be prompted once; the launcher reads them silently afterwards.${C_RST}\n\n"
}

ask_secret() {
  local key="$1" label="$2" pattern="${3:-}" required="${4:-yes}"
  local existing value
  existing="$(keychain_get "$key" || true)"
  if [ -n "$existing" ]; then
    printf "  ${C_CYN}[?]${C_RST} %s — keep existing value? [Y/n] " "$label"
    read -r ans
    if [[ "$ans" =~ ^[Nn]$ ]]; then
      :
    else
      printf "      ${C_DIM}kept existing${C_RST}\n"
      return 0
    fi
  fi
  while true; do
    if [ "$required" = "yes" ]; then
      printf "  ${C_CYN}[?]${C_RST} %s: " "$label"
    else
      printf "  ${C_CYN}[?]${C_RST} %s ${C_DIM}(optional, Enter to skip)${C_RST}: " "$label"
    fi
    read -rs value
    printf "\n"
    if [ -z "$value" ]; then
      if [ "$required" = "yes" ]; then
        printf "      ${C_YEL}[!]${C_RST} required — try again\n"
        continue
      fi
      return 0
    fi
    if [ -n "$pattern" ] && ! [[ "$value" =~ $pattern ]]; then
      printf "      ${C_YEL}[!]${C_RST} format check failed; expected pattern: %s\n" "$pattern"
      continue
    fi
    keychain_set "$key" "$value" >/dev/null
    printf "      ${C_GRN}[+]${C_RST} saved\n"
    return 0
  done
}

main() {
  banner

  printf "${C_CYN}Required secrets${C_RST}\n"
  ask_secret VITE_SUPABASE_URL      "Supabase project URL"   '^https://[a-z0-9-]+\.supabase\.co/?$' yes
  ask_secret VITE_SUPABASE_ANON_KEY "Supabase anon (public) key (JWT)" '^eyJ[A-Za-z0-9_=-]+\.eyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_.+/=-]+$' yes
  ask_secret ANTHROPIC_API_KEY      "Anthropic API key (sk-ant-...)"   '^sk-ant-' yes

  # JWT_SECRET — auto-generate if not present and user does not provide one
  if ! keychain_has JWT_SECRET; then
    local generated
    generated="$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64)"
    keychain_set JWT_SECRET "$generated" >/dev/null
    printf "  ${C_GRN}[+]${C_RST} JWT_SECRET auto-generated (64 chars)\n"
  else
    printf "  ${C_DIM}[.]${C_RST} JWT_SECRET already set — kept\n"
  fi

  printf "\n${C_CYN}Optional integrations${C_RST} ${C_DIM}(press Enter to skip any)${C_RST}\n"
  ask_secret VITE_CLAUDE_API_KEY     "Anthropic key for frontend (usually same as above)" '^sk-ant-' no
  ask_secret SUPABASE_SERVICE_KEY    "Supabase service-role key (server-side, RLS bypass)" '^eyJ' no
  ask_secret GITHUB_TOKEN            "GitHub PAT (ghp_... or github_pat_...)"             '^(ghp_|github_pat_)' no
  ask_secret SENDGRID_API_KEY        "SendGrid API key (SG.*)"                            '^SG\.' no
  ask_secret SLACK_BOT_TOKEN         "Slack bot token (xoxb-...)"                         '^xoxb-' no
  ask_secret COMPANIES_HOUSE_API_KEY "Companies House API key"                            '' no

  printf "\n${C_GRN}[+]${C_RST} Keychain setup complete.\n"
  printf "    Stored under service prefix: ${C_CYN}%s.*${C_RST}\n" "$KEYCHAIN_PREFIX"
  printf "    Inspect via:  ${C_DIM}security find-generic-password -s %s.VITE_SUPABASE_URL${C_RST}\n" "$KEYCHAIN_PREFIX"
  printf "    Reset later:  ${C_DIM}./dev --reset-keychain${C_RST}\n\n"
}

main "$@"
