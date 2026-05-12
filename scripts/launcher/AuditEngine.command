#!/usr/bin/env bash
# Double-click entry point for AuditEngine local launcher.
# macOS treats *.command files as Terminal-launchable scripts.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/launch.sh" "$@"
