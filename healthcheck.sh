#!/bin/bash
# Health check script for LocalBot in cloud environments

set -e

# Default values
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://localhost:3000/health}"
TIMEOUT="${HEALTH_CHECK_TIMEOUT:-10}"

# Perform health check
if curl --fail --silent --max-time "$TIMEOUT" "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
    echo "LocalBot health check: OK"
    exit 0
else
    echo "LocalBot health check: FAILED"
    exit 1
fi