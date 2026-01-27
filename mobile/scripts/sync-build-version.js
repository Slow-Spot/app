#!/usr/bin/env node
/**
 * Sync Build Version Script
 *
 * Automatycznie synchronizuje buildNumber w app.json.
 * Uruchom przed lokalnym buildem:
 *
 *   node scripts/sync-build-version.js [buildNumber]
 *
 * Przyklady:
 *   node scripts/sync-build-version.js 30
 *   npm run sync-version -- 30
 *
 * Bez argumentu - inkrementuje obecna wartosc o 1.
 */

const fs = require('fs');
const path = require('path');

const APP_JSON_PATH = path.join(__dirname, '..', 'app.json');

function main() {
  const appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf-8'));

  const currentBuildNumber = parseInt(appJson.expo.ios.buildNumber || '1', 10);
  const argBuildNumber = process.argv[2];

  let newBuildNumber;
  if (argBuildNumber) {
    newBuildNumber = parseInt(argBuildNumber, 10);
    console.log(`[sync-build-version] Using provided buildNumber: ${newBuildNumber}`);
  } else {
    newBuildNumber = currentBuildNumber + 1;
    console.log(`[sync-build-version] Incrementing buildNumber: ${currentBuildNumber} -> ${newBuildNumber}`);
  }

  appJson.expo.ios.buildNumber = String(newBuildNumber);
  appJson.expo.android.versionCode = newBuildNumber;

  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2) + '\n');

  console.log(`[sync-build-version] Updated app.json:`);
  console.log(`  - ios.buildNumber: ${newBuildNumber}`);
  console.log(`  - android.versionCode: ${newBuildNumber}`);
}

main();
