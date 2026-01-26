#!/usr/bin/env node
/**
 * Post-prebuild script - Fix Live Activity Entitlements & App Group
 *
 * Ten skrypt:
 * 1. Dodaje App Group do entitlements dla LiveActivity widget
 * 2. Aktualizuje App Group identifier w kodzie Swift
 *
 * Uruchamiany automatycznie po prebuild przez npm script.
 */

const plist = require('@expo/plist').default;
const fs = require('fs');
const path = require('path');

// WAZNE: Ten identyfikator musi byc taki sam jak w Apple Developer Portal
const APP_GROUP_IDENTIFIER = 'group.com.slowspot.app.shared';

// Stary identyfikator z expo-live-activity (do zamiany)
const OLD_APP_GROUP_IDENTIFIER = 'group.expoLiveActivity.sharedData';

const projectRoot = path.resolve(__dirname, '..');
const iosRoot = path.join(projectRoot, 'ios');
const pbxprojPath = path.join(iosRoot, 'SlowSpot.xcodeproj', 'project.pbxproj');

// Sciezki do plikow
const mainAppEntitlements = path.join(iosRoot, 'SlowSpot', 'SlowSpot.entitlements');
const widgetEntitlements = path.join(iosRoot, 'LiveActivity', 'LiveActivity.entitlements');
const swiftImageFile = path.join(iosRoot, 'LiveActivity', 'Image+dynamic.swift');

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
      entitlements = {};
    }

    // Dodaj App Group jesli nie istnieje lub ma stary identyfikator
    const currentGroups = entitlements['com.apple.security.application-groups'] || [];
    const hasCorrectGroup = currentGroups.includes(APP_GROUP_IDENTIFIER);

    if (!hasCorrectGroup) {
      // Usun stary identyfikator jesli istnieje
      const filteredGroups = currentGroups.filter(g => g !== OLD_APP_GROUP_IDENTIFIER);
      entitlements['com.apple.security.application-groups'] = [...filteredGroups, APP_GROUP_IDENTIFIER];

      fs.writeFileSync(filePath, plist.build(entitlements));
      console.log(`[fix-entitlements] Added App Group to ${name}: ${APP_GROUP_IDENTIFIER}`);
    } else {
      console.log(`[fix-entitlements] ${name} already has correct App Group`);
    }
  } catch (error) {
    console.error(`[fix-entitlements] Error processing ${name}:`, error);
  }
}

function fixSwiftAppGroup(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[fix-swift] Image+dynamic.swift not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(OLD_APP_GROUP_IDENTIFIER)) {
      content = content.replace(
        new RegExp(OLD_APP_GROUP_IDENTIFIER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        APP_GROUP_IDENTIFIER
      );
      fs.writeFileSync(filePath, content);
      console.log(`[fix-swift] Updated App Group in Image+dynamic.swift: ${APP_GROUP_IDENTIFIER}`);
    } else if (content.includes(APP_GROUP_IDENTIFIER)) {
      console.log(`[fix-swift] Image+dynamic.swift already has correct App Group`);
    } else {
      console.log(`[fix-swift] No App Group identifier found in Image+dynamic.swift`);
    }
  } catch (error) {
    console.error(`[fix-swift] Error processing Image+dynamic.swift:`, error);
  }
}

function syncBuildVersions() {
  if (!fs.existsSync(pbxprojPath)) {
    console.log('[fix-versions] project.pbxproj not found');
    return;
  }

  try {
    let content = fs.readFileSync(pbxprojPath, 'utf8');

    // Pobierz buildNumber z EAS lub z zmiennej srodowiskowej
    let targetBuildNumber = process.env.EAS_BUILD_IOS_BUILD_NUMBER;

    if (!targetBuildNumber) {
      // Znajdz buildNumber z glownej aplikacji SlowSpot (szukamy w sekcji SlowSpot)
      // Szukamy pierwszej wersji ktora NIE jest 11400 (wersja z @bacons/apple-targets)
      const allVersions = content.match(/CURRENT_PROJECT_VERSION = (\d+);/g) || [];
      const versionNumbers = allVersions.map(v => parseInt(v.match(/\d+/)[0]));

      // Znajdz wersje rozne od 11400 (to sa prawdopodobnie wersje z glownej app)
      const nonAppleTargetsVersions = versionNumbers.filter(v => v !== 11400);

      if (nonAppleTargetsVersions.length > 0) {
        // Uzyj pierwszej znalezionej wersji (powinna byc z glownej app)
        targetBuildNumber = String(Math.max(...nonAppleTargetsVersions));
      } else {
        // Fallback - uzyj 1
        targetBuildNumber = '1';
      }
    }

    console.log(`[fix-versions] Target buildNumber: ${targetBuildNumber}`);

    // Sprawdz czy sa wersje 11400 do zamiany
    if (content.includes('CURRENT_PROJECT_VERSION = 11400;')) {
      content = content.replace(/CURRENT_PROJECT_VERSION = 11400;/g, `CURRENT_PROJECT_VERSION = ${targetBuildNumber};`);
      fs.writeFileSync(pbxprojPath, content);
      console.log(`[fix-versions] Replaced 11400 with ${targetBuildNumber} in all targets`);
    } else {
      console.log('[fix-versions] No 11400 versions found, checking for mismatches...');

      const allVersions = content.match(/CURRENT_PROJECT_VERSION = (\d+);/g) || [];
      const versionNumbers = [...new Set(allVersions.map(v => parseInt(v.match(/\d+/)[0])))];

      if (versionNumbers.length > 1) {
        console.log(`[fix-versions] Found multiple versions: ${versionNumbers.join(', ')}`);
        content = content.replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${targetBuildNumber};`);
        fs.writeFileSync(pbxprojPath, content);
        console.log(`[fix-versions] Synchronized all to ${targetBuildNumber}`);
      } else {
        console.log(`[fix-versions] All targets have same version: ${versionNumbers[0]}`);
      }
    }
  } catch (error) {
    console.error('[fix-versions] Error syncing versions:', error);
  }
}

// Uruchom poprawki
console.log('[fix-live-activity] Fixing Live Activity configuration...');
console.log(`[fix-live-activity] App Group: ${APP_GROUP_IDENTIFIER}`);
console.log('');

fixEntitlements(mainAppEntitlements, 'Main App');
fixEntitlements(widgetEntitlements, 'LiveActivity Widget');
fixSwiftAppGroup(swiftImageFile);
syncBuildVersions();

console.log('');
console.log('[fix-live-activity] Done!');
