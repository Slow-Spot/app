#!/usr/bin/env node

/**
 * Script to update version numbers across all packages
 * Used by semantic-release during the release process
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Version argument is required');
  process.exit(1);
}

console.log(`Updating versions to ${version}...`);

// Update root package.json
const rootPackagePath = path.join(__dirname, '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
rootPackage.version = version;
fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
console.log(`✓ Updated ${rootPackagePath}`);

// Update web/package.json
const webPackagePath = path.join(__dirname, '..', 'web', 'package.json');
const webPackage = JSON.parse(fs.readFileSync(webPackagePath, 'utf8'));
webPackage.version = version;
fs.writeFileSync(webPackagePath, JSON.stringify(webPackage, null, 2) + '\n');
console.log(`✓ Updated ${webPackagePath}`);

// Update mobile/package.json
const mobilePackagePath = path.join(__dirname, '..', 'mobile', 'package.json');
const mobilePackage = JSON.parse(fs.readFileSync(mobilePackagePath, 'utf8'));
mobilePackage.version = version;
fs.writeFileSync(mobilePackagePath, JSON.stringify(mobilePackage, null, 2) + '\n');
console.log(`✓ Updated ${mobilePackagePath}`);

// Update mobile/app.json (Expo config)
const appJsonPath = path.join(__dirname, '..', 'mobile', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
appJson.expo.version = version;

// Also update buildNumber/versionCode based on semantic version
// Use a formula: major*10000 + minor*100 + patch
const [major, minor, patch] = version.split('-')[0].split('.').map(Number);
const buildNumber = major * 10000 + minor * 100 + patch;

appJson.expo.ios = appJson.expo.ios || {};
appJson.expo.ios.buildNumber = String(buildNumber);

appJson.expo.android = appJson.expo.android || {};
appJson.expo.android.versionCode = buildNumber;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
console.log(`✓ Updated ${appJsonPath}`);
console.log(`  - version: ${version}`);
console.log(`  - iOS buildNumber: ${buildNumber}`);
console.log(`  - Android versionCode: ${buildNumber}`);

// Update web i18n locale files
const locales = ['en', 'pl'];
locales.forEach(locale => {
  const localePath = path.join(__dirname, '..', 'web', 'app', 'i18n', 'locales', `${locale}.json`);
  if (fs.existsSync(localePath)) {
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    if (localeData.supportPage && localeData.supportPage.appInfo) {
      localeData.supportPage.appInfo.versionNumber = version;
      fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
      console.log(`[OK] Updated ${localePath}`);
    }
  }
});

console.log('\nAll versions updated successfully!');
