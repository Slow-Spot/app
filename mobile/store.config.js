/**
 * EAS Metadata configuration for App Store Connect
 *
 * This file is used by `eas metadata:push` to automatically update
 * App Store Connect metadata from the store/metadata.json file.
 *
 * Usage:
 *   eas metadata:push --platform ios
 *
 * Supported features:
 *   - App information (name, subtitle, description, keywords)
 *   - Screenshots (all device sizes)
 *   - App previews (video)
 *   - What's New (release notes)
 *   - Promotional text
 *   - App Review information
 *
 * @see https://docs.expo.dev/eas-metadata/introduction/
 */

const fs = require('fs');
const path = require('path');

// Load metadata from JSON file
const metadataPath = path.join(__dirname, 'store', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Map locale codes to App Store Connect locale codes
const localeMapping = {
  'en-US': 'en-US',
  pl: 'pl',
  'de-DE': 'de-DE',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'zh-Hans': 'zh-Hans',
  hi: 'hi',
};

// iOS screenshot device display types
const iosDevices = {
  'iPhone 6.7': 'APP_IPHONE_67',
  'iPhone 6.5': 'APP_IPHONE_65',
  'iPhone 5.5': 'APP_IPHONE_55',
  'iPad Pro 12.9': 'APP_IPAD_PRO_129',
  'iPad Pro 11': 'APP_IPAD_PRO_3GEN_11',
};

// Build localized info for each language
const localizedInfo = {};

for (const [localeKey, data] of Object.entries(metadata.locales)) {
  const appStoreLocale = localeMapping[localeKey] || localeKey;

  // Build screenshot paths for this locale
  const screenshots = {};
  for (const [deviceName, displayType] of Object.entries(iosDevices)) {
    const screenshotDir = path.join(
      __dirname,
      'store',
      'screenshots',
      'ios',
      localeKey,
      deviceName
    );
    if (fs.existsSync(screenshotDir)) {
      const files = fs
        .readdirSync(screenshotDir)
        .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
        .sort()
        .map((f) => path.join(screenshotDir, f));
      if (files.length > 0) {
        screenshots[displayType] = files;
      }
    }
  }

  localizedInfo[appStoreLocale] = {
    title: data.name,
    subtitle: data.subtitle,
    description: data.description,
    keywords: data.keywords.split(',').map((k) => k.trim()),
    promotionalText: data.promotionalText,
    whatsNew: data.whatsNew,
    ...(Object.keys(screenshots).length > 0 && { screenshots }),
  };
}

/** @type {import('@expo/eas-metadata').StoreConfig} */
module.exports = {
  configVersion: 0,

  // App information
  app: {
    copyright: metadata.app.copyright,
    primaryCategory: metadata.app.primaryCategory || 'HEALTH_AND_FITNESS',
    secondaryCategory: metadata.app.secondaryCategory || 'LIFESTYLE',

    // Age rating
    contentRating: {
      ageRating: metadata.app.contentRating || '4+',
    },

    // URLs
    ...(metadata.app.supportUrl && { supportUrl: metadata.app.supportUrl }),
    ...(metadata.app.marketingUrl && {
      marketingUrl: metadata.app.marketingUrl,
    }),
    ...(metadata.app.privacyPolicyUrl && {
      privacyPolicyUrl: metadata.app.privacyPolicyUrl,
    }),

    // Privacy information (required for App Store)
    privacyManifest: {
      // App doesn't collect any data
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [],
      NSPrivacyAccessedAPITypes: [
        {
          // File timestamp APIs for AsyncStorage
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
        {
          // User defaults for app preferences
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },

  // Version-specific info
  version: {
    // Localized app info
    localizedInfo,

    // App Review information
    appReviewInfo: {
      contactEmail: metadata.contact.email,
      contactFirstName: metadata.contact.firstName,
      contactLastName: metadata.contact.lastName,
      contactPhone: metadata.contact.phone,
      demoAccountName: metadata.review.demoAccountName,
      demoAccountPassword: metadata.review.demoAccountPassword,
      demoAccountRequired: metadata.review.demoAccountRequired,
      notes: metadata.review.notes,
    },
  },
};
