#!/usr/bin/env node
/**
 * Post-prebuild script - Fix Live Activity Entitlements
 *
 * Ten skrypt dodaje App Group do entitlements dla LiveActivity widget.
 * Uruchamiany automatycznie po prebuild przez npm script.
 */

const plist = require('@expo/plist').default;
const fs = require('fs');
const path = require('path');

const APP_GROUP_IDENTIFIER = 'group.expoLiveActivity.sharedData';

const projectRoot = path.resolve(__dirname, '..');
const iosRoot = path.join(projectRoot, 'ios');

// Sciezki do plikow entitlements
const mainAppEntitlements = path.join(iosRoot, 'SlowSpot', 'SlowSpot.entitlements');
const widgetEntitlements = path.join(iosRoot, 'LiveActivity', 'LiveActivity.entitlements');

function fixEntitlements(filePath, name) {
  if (!fs.existsSync(filePath)) {
    console.log(`[fix-entitlements] ${name} not found: ${filePath}`);
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let entitlements = {};

    try {
      entitlements = plist.parse(content);
    } catch (e) {
      // Jesli parsowanie sie nie powiedzie, zacznij od pustego obiektu
      entitlements = {};
    }

    // Dodaj App Group jesli nie istnieje
    if (!entitlements['com.apple.security.application-groups'] ||
        !entitlements['com.apple.security.application-groups'].includes(APP_GROUP_IDENTIFIER)) {

      entitlements['com.apple.security.application-groups'] = [APP_GROUP_IDENTIFIER];

      fs.writeFileSync(filePath, plist.build(entitlements));
      console.log(`[fix-entitlements] Added App Group to ${name}: ${APP_GROUP_IDENTIFIER}`);
    } else {
      console.log(`[fix-entitlements] ${name} already has App Group configured`);
    }
  } catch (error) {
    console.error(`[fix-entitlements] Error processing ${name}:`, error);
  }
}

// Uruchom poprawki
console.log('[fix-entitlements] Fixing Live Activity entitlements...');
fixEntitlements(mainAppEntitlements, 'Main App');
fixEntitlements(widgetEntitlements, 'LiveActivity Widget');
console.log('[fix-entitlements] Done!');
