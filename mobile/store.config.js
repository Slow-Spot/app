/**
 * EAS Metadata configuration for App Store Connect
 *
 * This file is used by `eas metadata:push` to automatically update
 * App Store Connect metadata from the store/metadata.json file.
 *
 * Usage:
 *   eas metadata:push --platform ios
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
    // URLs are required per locale
    supportUrl: metadata.app.supportUrl,
    marketingUrl: metadata.app.marketingUrl,
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

    // Privacy Policy URL (required)
    privacyPolicyUrl: metadata.app.privacyPolicyUrl,

    // Content rights - declare that we have rights to all content
    contentRights: {
      containsThirdPartyContent: false,
      hasRights: true,
    },

    // Age rating questionnaire - meditation app with no objectionable content
    ageRating: {
      alcoholTobaccoOrDrugUseOrReferences: 'NONE',
      contests: 'NONE',
      gamblingSimulated: 'NONE',
      horrorOrFearThemes: 'NONE',
      matureOrSuggestiveThemes: 'NONE',
      medicalOrTreatmentInformation: 'NONE',
      profanityOrCrudeHumor: 'NONE',
      sexualContentGraphicAndNudity: 'NONE',
      sexualContentOrNudity: 'NONE',
      violenceCartoonOrFantasy: 'NONE',
      violenceRealistic: 'NONE',
      violenceRealisticProlongedGraphicOrSadistic: 'NONE',
      gambling: false,
      unrestrictedWebAccess: false,
      kidsAgeBand: null,
      seventeenPlus: false,
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

    // Release type
    releaseType: 'MANUAL',
  },
};
