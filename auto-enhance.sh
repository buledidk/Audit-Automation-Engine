#!/bin/bash
# Enhanced AuditEngine Workflow Automation Script
# Run this script in your project root to automate, monitor, and keep everything running

LOGFILE="auditengine_monitor.log"
EXPORT_DIR="exports"
GITHUB_REPO="https://github.com/buledidk/Audit-Automation-Engine.git"

mkdir -p "$EXPORT_DIR"

while true; do
  echo "$(date): Checking AuditEngine status..." >> "$LOGFILE"

  # Check if server is running
  if ! curl -s http://localhost:5173 > /dev/null; then
    echo "$(date): Server down, attempting restart..." >> "$LOGFILE"
    npm install
    npm run dev &
    sleep 10
  else
    echo "$(date): Server healthy." >> "$LOGFILE"
  fi

  # Check Docker services
  if ! docker ps | grep -q audit_redis; then
    echo "$(date): Docker services down, restarting..." >> "$LOGFILE"
    docker-compose up -d
  fi

  # Export data (simulate with touch for now)
  echo "Export at $(date)" > "$EXPORT_DIR/audit_export_$(date +%Y%m%d_%H%M%S).txt"

  # Sync with GitHub
  git pull "$GITHUB_REPO" main
  git add .
  git commit -m "Automated update $(date)" || true
  git push "$GITHUB_REPO" main

  # Wait 1 hour before next check
  sleep 3600
done
