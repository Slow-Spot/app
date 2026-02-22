/**
 * App Configuration - Single Source of Truth
 *
 * This file centralizes all app-wide configuration data that needs to be
 * consistent across the website. Import this file instead of hardcoding values.
 *
 * NOTE: Version is synchronized with package.json via semantic-release.
 * Update package.json version - this file reads from it automatically.
 */

import packageJson from '../../../package.json';

// ============================================
// APP METADATA
// ============================================
export const appConfig = {
  // Core identity
  name: 'Slow Spot',
  tagline: 'Find your inner peace, one breath at a time.',
  domain: 'slowspot.me',

  // Version - automatically synced from package.json
  version: packageJson.version,

  // Contact information
  contact: {
    email: 'contact@slowspot.me',
    website: 'https://slowspot.me',
  },

  // Legal dates
  legal: {
    privacyPolicyLastUpdated: 'December 6, 2025',
    termsLastUpdated: 'December 6, 2025',
  },

  // App availability
  platforms: {
    ios: true,
    android: true,
    web: false, // Landing page only, not a web app
  },

  // Store links
  storeLinks: {
    appStore: 'https://apps.apple.com/app/slow-spot-calm-meditate/id6757082765',
    playStore: 'https://play.google.com/store/apps/details?id=com.slowspot.app',
  },

  // Supported languages (ISO 639-1 codes)
  supportedLanguages: ['en', 'pl', 'de', 'es', 'fr', 'hi', 'zh'] as const,
  defaultLanguage: 'en',

  // Feature flags
  features: {
    offlineMode: true,
    noAccountRequired: true,
    freeWithAllFeatures: true,
    privacyFirst: true,
    languageCount: 7,
    meditationLevels: 5,
    ambientSounds: 8,
  },
} as const;

// ============================================
// SEO & SOCIAL METADATA
// ============================================
export const seoConfig = {
  title: `${appConfig.name} - Meditation Made Simple`,
  description: 'A meditation app designed with privacy in mind. No accounts, no tracking, no barriers. Just you and your peace.',
  keywords: [
    'meditation',
    'mindfulness',
    'relaxation',
    'mental health',
    'wellness',
    'breathing exercises',
    'stress relief',
    'privacy-first',
    'offline meditation',
    'free meditation app',
  ],
  openGraph: {
    type: 'website',
    siteName: appConfig.name,
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
} as const;

// ============================================
// LEGAL JURISDICTIONS
// ============================================
export const legalConfig = {
  // Primary governing law
  governingLaw: 'Polish law',
  governingCountry: 'Poland',

  // Data protection compliance
  compliance: [
    'GDPR (European Union)',
    'CCPA (California, USA)',
    'LGPD (Brazil)',
    'POPIA (South Africa)',
    'APP (Australia)',
    'PIPEDA (Canada)',
  ],

  // Since the app is 100% offline and collects no data,
  // it naturally complies with all data protection laws
  dataCollection: 'none',
  dataStorage: 'device-only',
  thirdPartySharing: false,
  analytics: false,
  advertising: false,
} as const;

// ============================================
// DESIGN TOKENS (synced with mobile theme)
// ============================================
export const designConfig = {
  // Brand colors
  colors: {
    brand: {
      indigo: '#6366F1',
      violet: '#8B5CF6',
      purple: '#A855F7',
      gold: '#FCD34D',
    },
    // These match the mobile app's colors.ts
    meditation: {
      breatheIn: '#60A5FA', // Blue-400
      hold: '#A78BFA', // Violet-400
      breatheOut: '#34D399', // Emerald-400
    },
  },

  // Breathing animation timing (in seconds)
  breathing: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    totalCycle: 12,
  },
} as const;

// Export types for TypeScript
export type AppConfig = typeof appConfig;
export type SeoConfig = typeof seoConfig;
export type LegalConfig = typeof legalConfig;
export type DesignConfig = typeof designConfig;
