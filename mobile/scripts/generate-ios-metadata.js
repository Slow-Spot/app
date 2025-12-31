#!/usr/bin/env node
/**
 * Generate iOS Fastlane metadata structure from store/metadata.json
 *
 * This script creates the Fastlane deliver metadata structure:
 * fastlane/metadata/
 *   ├── copyright.txt
 *   ├── primary_category.txt
 *   ├── {locale}/
 *   │   ├── name.txt
 *   │   ├── subtitle.txt
 *   │   ├── description.txt
 *   │   ├── keywords.txt
 *   │   ├── promotional_text.txt
 *   │   ├── release_notes.txt
 *   │   ├── support_url.txt
 *   │   ├── marketing_url.txt
 *   │   └── privacy_url.txt
 *   └── review_information/
 *       ├── first_name.txt
 *       ├── last_name.txt
 *       ├── email_address.txt
 *       ├── phone_number.txt
 *       └── notes.txt
 *
 * Usage: node scripts/generate-ios-metadata.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const METADATA_JSON = path.join(ROOT_DIR, 'store', 'metadata.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'fastlane', 'metadata');
const SCREENSHOTS_SRC = path.join(ROOT_DIR, 'store', 'screenshots', 'ios');
const SCREENSHOTS_DST = path.join(ROOT_DIR, 'fastlane', 'screenshots');

// iOS locale mapping (our locales -> App Store Connect locales)
const LOCALE_MAPPING = {
  'en-US': 'en-US',
  'pl': 'pl',
  'de-DE': 'de-DE',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'zh-Hans': 'zh-Hans',
  'hi': 'hi'
};

// Screenshot device type mapping for Fastlane
// Format: folder name -> Fastlane device name
// NOTE: iPad Pro 13" (2064x2752) maps to APP_IPAD_PRO_3GEN_129
const SCREENSHOT_DEVICES = {
  'iPhone 6.5': 'iPhone 6.5"',
  'iPhone 6.7': 'iPhone 6.7"',
  'iPhone 5.5': 'iPhone 5.5"',
  'iPad Pro (12.9-inch) (3rd generation)': 'iPad Pro (12.9-inch) (3rd generation)',  // 2064x2752 -> APP_IPAD_PRO_3GEN_129
  'iPad Pro 12.9': 'iPad Pro (12.9-inch)',
  'iPad Pro 11': 'iPad Pro (11-inch)'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${path.relative(ROOT_DIR, filePath)}`);
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

function main() {
  console.log('📱 Generating iOS Fastlane metadata...\n');

  // Load metadata
  if (!fs.existsSync(METADATA_JSON)) {
    console.error('❌ Error: store/metadata.json not found');
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(METADATA_JSON, 'utf8'));
  console.log('📖 Loaded store/metadata.json\n');

  // Create root-level metadata files
  console.log('📁 Creating root metadata files...');
  writeFile(path.join(OUTPUT_DIR, 'copyright.txt'), metadata.app.copyright || '');
  writeFile(path.join(OUTPUT_DIR, 'primary_category.txt'), metadata.app.primaryCategory || 'HEALTH_AND_FITNESS');
  writeFile(path.join(OUTPUT_DIR, 'secondary_category.txt'), metadata.app.secondaryCategory || 'LIFESTYLE');

  // Create review_information directory
  console.log('\n📁 Creating review information...');
  const reviewDir = path.join(OUTPUT_DIR, 'review_information');
  writeFile(path.join(reviewDir, 'first_name.txt'), metadata.contact.firstName || '');
  writeFile(path.join(reviewDir, 'last_name.txt'), metadata.contact.lastName || '');
  writeFile(path.join(reviewDir, 'email_address.txt'), metadata.contact.email || '');
  writeFile(path.join(reviewDir, 'phone_number.txt'), metadata.contact.phone || '');
  writeFile(path.join(reviewDir, 'notes.txt'), metadata.review.notes || '');

  // Demo account (optional - only if required)
  if (metadata.review.demoAccountRequired) {
    writeFile(path.join(reviewDir, 'demo_user.txt'), metadata.review.demoAccountName || '');
    writeFile(path.join(reviewDir, 'demo_password.txt'), metadata.review.demoAccountPassword || '');
  }

  // Create localized metadata for each language
  console.log('\n📁 Creating localized metadata...');
  for (const [srcLocale, appStoreLocale] of Object.entries(LOCALE_MAPPING)) {
    const localeData = metadata.locales[srcLocale];
    if (!localeData) {
      console.log(`  ⚠ Skipping ${srcLocale} (not found in metadata.json)`);
      continue;
    }

    console.log(`\n  🌍 ${appStoreLocale}:`);
    const localeDir = path.join(OUTPUT_DIR, appStoreLocale);

    // Text metadata
    writeFile(path.join(localeDir, 'name.txt'), localeData.name || 'Slow Spot');
    writeFile(path.join(localeDir, 'subtitle.txt'), truncate(localeData.subtitle, 30));
    writeFile(path.join(localeDir, 'description.txt'), localeData.description || '');
    writeFile(path.join(localeDir, 'keywords.txt'), localeData.keywords || '');
    writeFile(path.join(localeDir, 'promotional_text.txt'), truncate(localeData.promotionalText, 170));
    writeFile(path.join(localeDir, 'release_notes.txt'), localeData.whatsNew || '');

    // URLs (use locale-specific if available, otherwise fall back to global)
    writeFile(path.join(localeDir, 'support_url.txt'), localeData.supportUrl || metadata.app.supportUrl || '');
    writeFile(path.join(localeDir, 'marketing_url.txt'), localeData.marketingUrl || metadata.app.marketingUrl || '');
    writeFile(path.join(localeDir, 'privacy_url.txt'), localeData.privacyPolicyUrl || metadata.app.privacyPolicyUrl || '');
  }

  // Copy screenshots
  console.log('\n📸 Copying screenshots...');
  if (fs.existsSync(SCREENSHOTS_SRC)) {
    for (const [srcLocale, appStoreLocale] of Object.entries(LOCALE_MAPPING)) {
      const srcLocaleDir = path.join(SCREENSHOTS_SRC, srcLocale);
      if (!fs.existsSync(srcLocaleDir)) continue;

      console.log(`\n  🌍 ${appStoreLocale}:`);
      const dstLocaleDir = path.join(SCREENSHOTS_DST, appStoreLocale);
      ensureDir(dstLocaleDir);

      // Process each device type
      for (const [deviceFolder, fastlaneDevice] of Object.entries(SCREENSHOT_DEVICES)) {
        const deviceSrcDir = path.join(srcLocaleDir, deviceFolder);
        if (!fs.existsSync(deviceSrcDir)) continue;

        const files = fs.readdirSync(deviceSrcDir)
          .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
          .sort();

        files.forEach((file, index) => {
          const srcPath = path.join(deviceSrcDir, file);
          const dstPath = path.join(dstLocaleDir, `${fastlaneDevice} - ${index + 1}.png`);
          fs.copyFileSync(srcPath, dstPath);
          console.log(`    ✓ ${path.basename(dstPath)}`);
        });
      }
    }
  } else {
    console.log('  ⚠ No screenshots found at store/screenshots/ios/');
  }

  console.log('\n✅ iOS metadata generation complete!');
  console.log('\nGenerated structure:');
  console.log('  fastlane/metadata/     - Text metadata');
  console.log('  fastlane/screenshots/  - Screenshots');
  console.log('\nNext step: Run "cd fastlane && bundle exec fastlane ios upload_metadata"');
}

main();
