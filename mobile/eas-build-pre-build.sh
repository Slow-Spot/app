#!/bin/bash
# EAS Build Hook - runs AFTER prebuild but BEFORE native build
# Fixes LiveActivity entitlements with correct App Group

echo "[eas-build-pre-build] Fixing Live Activity entitlements..."

if [ -f "scripts/fix-live-activity-entitlements.js" ]; then
  node scripts/fix-live-activity-entitlements.js
else
  echo "[eas-build-pre-build] Script not found, skipping..."
fi
