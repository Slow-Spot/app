#!/usr/bin/env node

/**
 * Generate Fastlane metadata structure for Google Play from store/metadata.json
 *
 * This script creates the complete fastlane/metadata/android directory structure
 * required by `fastlane supply` to upload metadata to Google Play Console.
 *
 * Directory structure:
 * fastlane/metadata/android/
 *   en-US/
 *     title.txt              - App name (max 30 chars)
 *     short_description.txt  - Short description (max 80 chars)
 *     full_description.txt   - Full description (max 4000 chars)
 *     video.txt              - YouTube video URL (optional)
 *     changelogs/
 *       default.txt          - Release notes
 *     images/
 *       icon.png                  - App icon (512x512)
 *       featureGraphic.png        - Feature graphic (1024x500)
 *       phoneScreenshots/         - Phone screenshots
 *       sevenInchScreenshots/     - 7" tablet screenshots
 *       tenInchScreenshots/       - 10" tablet screenshots
 *       tvBanner.png              - TV banner (optional)
 *       wearScreenshots/          - Wear OS screenshots (optional)
 *   pl-PL/
 *     ...
 *
 * Usage:
 *   node scripts/generate-android-metadata.js
 *
 * @see https://docs.fastlane.tools/actions/supply/
 */

const fs = require('fs');
const path = require('path');

// Locale mapping from our format to Google Play format
const LOCALE_MAPPING = {
  'en-US': 'en-US',
  pl: 'pl-PL',
  'de-DE': 'de-DE',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'zh-Hans': 'zh-CN',
  hi: 'hi-IN',
};

// Load metadata
const metadataPath = path.join(__dirname, '..', 'store', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Output directory
const outputDir = path.join(__dirname, '..', 'fastlane', 'metadata', 'android');

// Screenshots source directory
const screenshotsDir = path.join(__dirname, '..', 'store', 'screenshots', 'android');

// Graphics source directory
const graphicsDir = path.join(__dirname, '..', 'store', 'graphics', 'android');

// Clean and create output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Generating Android metadata for Fastlane...\n');

// Copy file if exists
function copyFileIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

// Copy directory contents if exists
function copyDirContents(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
  files.forEach((file) => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  });
  return files.length;
}

for (const [sourceLocale, data] of Object.entries(metadata.locales)) {
  const targetLocale = LOCALE_MAPPING[sourceLocale] || sourceLocale;
  const localeDir = path.join(outputDir, targetLocale);
  const changelogDir = path.join(localeDir, 'changelogs');
  const imagesDir = path.join(localeDir, 'images');

  // Create directories
  fs.mkdirSync(localeDir, { recursive: true });
  fs.mkdirSync(changelogDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  // Write title (max 30 chars for Google Play)
  const title = data.name.substring(0, 30);
  fs.writeFileSync(path.join(localeDir, 'title.txt'), title);

  // Write short description (max 80 chars)
  // Use shortDescription if available, otherwise use subtitle
  const shortDesc = (data.shortDescription || data.subtitle).substring(0, 80);
  fs.writeFileSync(path.join(localeDir, 'short_description.txt'), shortDesc);

  // Write full description (max 4000 chars)
  const fullDesc = data.description.substring(0, 4000);
  fs.writeFileSync(path.join(localeDir, 'full_description.txt'), fullDesc);

  // Write changelog (for release notes)
  const changelog = data.whatsNew || '• Bug fixes and improvements';
  fs.writeFileSync(path.join(changelogDir, 'default.txt'), changelog);

  // Copy screenshots from store/screenshots/android/{locale}/
  const srcScreenshotsDir = path.join(screenshotsDir, sourceLocale);

  // Phone screenshots
  const phoneCount = copyDirContents(
    path.join(srcScreenshotsDir, 'phoneScreenshots'),
    path.join(imagesDir, 'phoneScreenshots')
  );

  // 7" tablet screenshots
  const sevenInchCount = copyDirContents(
    path.join(srcScreenshotsDir, 'sevenInchScreenshots'),
    path.join(imagesDir, 'sevenInchScreenshots')
  );

  // 10" tablet screenshots
  const tenInchCount = copyDirContents(
    path.join(srcScreenshotsDir, 'tenInchScreenshots'),
    path.join(imagesDir, 'tenInchScreenshots')
  );

  // Copy feature graphic if exists
  let hasFeatureGraphic = false;
  if (copyFileIfExists(path.join(graphicsDir, `featureGraphic_${sourceLocale}.png`), path.join(imagesDir, 'featureGraphic.png'))) {
    hasFeatureGraphic = true;
  } else if (copyFileIfExists(path.join(graphicsDir, 'featureGraphic.png'), path.join(imagesDir, 'featureGraphic.png'))) {
    hasFeatureGraphic = true;
  }

  // Copy icon if exists (same for all locales)
  let hasIcon = false;
  if (copyFileIfExists(path.join(graphicsDir, 'icon.png'), path.join(imagesDir, 'icon.png'))) {
    hasIcon = true;
  }

  console.log(`✓ Generated metadata for ${targetLocale}`);
  console.log(`  - Title: ${title}`);
  console.log(`  - Short description: ${shortDesc.substring(0, 40)}...`);
  if (phoneCount > 0) console.log(`  - Phone screenshots: ${phoneCount}`);
  if (sevenInchCount > 0) console.log(`  - 7" tablet screenshots: ${sevenInchCount}`);
  if (tenInchCount > 0) console.log(`  - 10" tablet screenshots: ${tenInchCount}`);
  if (hasFeatureGraphic) console.log(`  - Feature graphic: ✓`);
  if (hasIcon) console.log(`  - Icon: ✓`);
  console.log('');
}

console.log('✅ Android metadata generated successfully!');
console.log(`   Output: ${outputDir}`);
console.log('');
console.log('To upload to Google Play:');
console.log('   cd mobile && bundle exec fastlane supply');
console.log('');
console.log('Required assets (add to store/):');
console.log('   store/graphics/android/');
console.log('      icon.png              (512x512)');
console.log('      featureGraphic.png    (1024x500)');
console.log('   store/screenshots/android/{locale}/');
console.log('      phoneScreenshots/     (min 2, max 8)');
console.log('      sevenInchScreenshots/ (optional)');
console.log('      tenInchScreenshots/   (optional)');
