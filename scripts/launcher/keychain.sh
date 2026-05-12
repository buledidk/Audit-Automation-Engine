#!/usr/bin/env bash
# AuditEngine launcher — macOS Keychain helpers.
# Sourced by launch.sh and setup-keychain.sh. Do not execute directly.

KEYCHAIN_PREFIX="AuditEngine"

keychain_get() {
  local key="$1"
  security find-generic-password -a "$USER" -s "${KEYCHAIN_PREFIX}.${key}" -w 2>/dev/null
}

keychain_set() {
  local key="$1" value="$2"
  security add-generic-password -a "$USER" -s "${KEYCHAIN_PREFIX}.${key}" -w "$value" -U
}

keychain_has() {
  local key="$1"
  security find-generic-password -a "$USER" -s "${KEYCHAIN_PREFIX}.${key}" >/dev/null 2>&1
}

keychain_clear() {
  local key="$1"
  security delete-generic-password -a "$USER" -s "${KEYCHAIN_PREFIX}.${key}" >/dev/null 2>&1 || true
}

keychain_list_managed() {
  cat <<KEYS
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
VITE_CLAUDE_API_KEY
JWT_SECRET
GITHUB_TOKEN
SENDGRID_API_KEY
SLACK_BOT_TOKEN
COMPANIES_HOUSE_API_KEY
SUPABASE_SERVICE_KEY
KEYS
}
