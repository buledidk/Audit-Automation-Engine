#!/usr/bin/env bash
# AuditEngine launcher — graceful shutdown.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

C_CYN=$'\033[1;36m'; C_GRN=$'\033[1;32m'; C_YEL=$'\033[1;33m'; C_RST=$'\033[0m'

kill_pidfile() {
  local file="$1" label="$2"
  [ -f "$file" ] || return 0
  local pid
  pid="$(cat "$file" 2>/dev/null || true)"
  [ -n "$pid" ] || { rm -f "$file"; return 0; }
  if kill -0 "$pid" 2>/dev/null; then
    printf "  ${C_CYN}[>]${C_RST} stopping %s (pid %s)\n" "$label" "$pid"
    kill -TERM "$pid" 2>/dev/null || true
    for _ in 1 2 3 4 5 6; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.5
    done
    if kill -0 "$pid" 2>/dev/null; then
      printf "  ${C_YEL}[!]${C_RST} %s did not exit — SIGKILL\n" "$label"
      kill -KILL "$pid" 2>/dev/null || true
    fi
  fi
  rm -f "$file"
}

kill_pidfile "$REPO_ROOT/.auditengine/api.pid" "API"
kill_pidfile "$REPO_ROOT/.auditengine/web.pid" "Web"

# Free any stragglers still bound to the ports
for port in 3001 5173; do
  pids="$(lsof -ti ":$port" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    printf "  ${C_CYN}[>]${C_RST} freeing port %s (pids: %s)\n" "$port" "$pids"
    echo "$pids" | xargs kill -TERM 2>/dev/null || true
  fi
done

# Docker compose down — no-op if it wasn't running
if [ -f docker-compose.yml ] && command -v docker >/dev/null 2>&1; then
  if docker compose ps --services --filter "status=running" 2>/dev/null | grep -q .; then
    printf "  ${C_CYN}[>]${C_RST} docker compose down\n"
    docker compose down >/dev/null 2>&1 || true
  fi
fi

printf "  ${C_GRN}[+]${C_RST} AuditEngine local dev stopped.\n"
