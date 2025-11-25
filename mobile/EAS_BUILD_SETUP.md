# EAS Build Configuration Guide

Complete guide for building and deploying Slow Spot using Expo Application Services (EAS).

## Table of Contents

- [Prerequisites](#prerequisites)
- [EAS CLI Installation](#eas-cli-installation)
- [Build Profiles Overview](#build-profiles-overview)
- [iOS Configuration](#ios-configuration)
- [Android Configuration](#android-configuration)
- [Running Builds](#running-builds)
- [Submitting to App Stores](#submitting-to-app-stores)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### Required Accounts

1. **Expo Account**
   - Already configured: `leszekszpunar`
   - Project ID: `2b3ebb2e-60e7-4355-922a-db729c41792d`

2. **Apple Developer Account** (for iOS)
   - Apple ID with Developer Program membership ($99/year)
   - App Store Connect access
   - Certificates and provisioning profiles (handled by EAS)

3. **Google Play Console Account** (for Android)
   - One-time $25 registration fee
   - Service account with API access

### Required Software

- Node.js 18+ (recommended: 20+)
- EAS CLI (installed globally)
- Git (for version control)
- macOS (only required for iOS simulator testing)

## EAS CLI Installation

### Install EAS CLI Globally

```bash
npm install -g eas-cli
```

### Login to Expo Account

```bash
eas login
# Enter credentials for: leszekszpunar
```

### Verify Configuration

```bash
eas whoami
# Should output: leszekszpunar

eas project:info
# Should show: Slow Spot (slow-spot)
```

## Build Profiles Overview

### 1. Development Profile

**Purpose:** Local development with Expo Dev Client

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

**Features:**
- Development client enabled
- iOS simulator build (fast, no signing required)
- Android APK debug build
- Channel: `development`
- Environment: `APP_ENV=development`

**Use Cases:**
- Testing on local simulator/emulator
- Development with hot reload
- Debugging native modules

### 2. Preview Profile

**Purpose:** Internal testing and QA validation

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

**Features:**
- Internal distribution (no App Store/Play Store)
- iOS: Ad-hoc build for registered devices
- Android: Release APK
- Auto-increments build/version numbers
- Channel: `preview`
- Environment: `APP_ENV=preview`

**Use Cases:**
- QA testing on real devices
- Stakeholder demos
- Beta testing with TestFlight (iOS) or Firebase App Distribution (Android)

### 3. Production Profile

**Purpose:** App Store and Google Play Store releases

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

**Features:**
- Production-ready builds
- iOS: App Store build with distribution certificate
- Android: App Bundle (.aab) for Play Store
- Auto-increments build/version numbers
- Build caching enabled for faster builds
- Channel: `production`
- Environment: `APP_ENV=production`

**Use Cases:**
- Final production release
- App Store/Play Store submission

### 4. Production Simulator Profile

**Purpose:** Test production builds locally without device

```bash
eas build --profile production-simulator --platform ios
```

**Features:**
- Extends production profile
- iOS simulator build with Release configuration
- Tests production code paths without device

**Use Cases:**
- Final validation before submission
- Production build testing without physical device

## iOS Configuration

### Step 1: Apple Developer Account Setup

1. **Enroll in Apple Developer Program**
   - Visit: https://developer.apple.com/programs/
   - Cost: $99/year
   - Processing time: 24-48 hours

2. **Create App in App Store Connect**
   - Visit: https://appstoreconnect.apple.com/
   - Click "My Apps" → "+" → "New App"
   - Platform: iOS
   - Name: **Slow Spot**
   - Primary Language: English
   - Bundle ID: `com.slowspot.app` (already configured in app.json)
   - SKU: `slow-spot-app`
   - Note the **App Store Connect App ID** (10-digit number)

3. **Get Apple Team ID**
   - Visit: https://developer.apple.com/account/
   - Navigate to "Membership"
   - Copy your **Team ID** (10-character alphanumeric)

### Step 2: Update eas.json with iOS Credentials

Replace placeholders in `eas.json`:

```json
"ios": {
  "appleId": "your-actual-apple-id@example.com",
  "ascAppId": "1234567890",  // Your App Store Connect App ID
  "appleTeamId": "ABCD123456",  // Your Apple Team ID
  "sku": "slow-spot-app"
}
```

### Step 3: Configure Certificates (Automatic)

EAS handles certificate creation automatically:

```bash
# First build will prompt for credentials
eas build --profile preview --platform ios

# EAS will:
# 1. Create distribution certificate
# 2. Create provisioning profile
# 3. Store credentials securely
# 4. Reuse for future builds
```

### Step 4: Register Test Devices (for Preview Builds)

```bash
# Register device by UDID
eas device:create

# View registered devices
eas device:list

# Build will include registered devices in provisioning profile
```

## Android Configuration

### Step 1: Google Play Console Setup

1. **Create Google Play Developer Account**
   - Visit: https://play.google.com/console/
   - One-time fee: $25
   - Complete registration and verify identity

2. **Create App in Play Console**
   - Click "Create app"
   - App name: **Slow Spot**
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Package name: `com.slowspot.app` (already configured in app.json)

3. **Create Service Account for API Access**
   - Navigate to: Setup → API access
   - Click "Create new service account"
   - Follow link to Google Cloud Console
   - Create service account: `slow-spot-uploader`
   - Grant role: **Service Account User**
   - Create JSON key and download
   - Return to Play Console and grant permissions:
     - ✅ View app information and download bulk reports
     - ✅ Create and edit draft releases
     - ✅ Release to production, exclude devices, and use Play App Signing

4. **Save Service Account Key**
   - Rename downloaded JSON to: `android-service-account.json`
   - Place in project root (same directory as eas.json)
   - **IMPORTANT:** Add to `.gitignore` (never commit this file!)

### Step 2: Update .gitignore

Add to `.gitignore`:

```gitignore
# EAS credentials
android-service-account.json
ios-distribution-cert.p12
```

### Step 3: Configure Keystore (Automatic)

EAS handles keystore creation automatically:

```bash
# First build will create keystore
eas build --profile preview --platform android

# EAS will:
# 1. Generate Android keystore
# 2. Store securely in EAS servers
# 3. Reuse for all future builds
# 4. Ensure consistent signing
```

### Step 4: Enable Play App Signing

1. Navigate to: Release → Setup → App signing
2. Click "Continue" to enroll in Play App Signing
3. Google will manage your app signing key
4. Upload your upload certificate (EAS handles this automatically)

## Running Builds

### Build All Platforms

```bash
# Build both iOS and Android simultaneously
eas build --profile production --platform all
```

### Build Single Platform

```bash
# iOS only
eas build --profile production --platform ios

# Android only
eas build --profile production --platform android
```

### Build with Specific Options

```bash
# Non-interactive mode (for CI/CD)
eas build --profile production --platform all --non-interactive

# Clear cache and rebuild
eas build --profile production --platform all --clear-cache

# Auto-submit after successful build
eas build --profile production --platform all --auto-submit
```

### Monitor Build Progress

```bash
# View build status
eas build:list

# View detailed build info
eas build:view [BUILD_ID]

# Cancel running build
eas build:cancel [BUILD_ID]
```

### Build Artifacts

After successful build:

1. **iOS (.ipa file)**
   - Download link in terminal output
   - Also available at: https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
   - Valid for 30 days

2. **Android (.aab or .apk file)**
   - Download link in terminal output
   - .aab for Play Store submission
   - .apk for direct installation

## Submitting to App Stores

### iOS Submission to App Store

#### Automatic Submission

```bash
eas submit --platform ios --profile production
```

EAS will:
1. Find latest production iOS build
2. Upload to App Store Connect
3. Submit for review (if configured)

#### Manual Submission

1. Download .ipa from build artifacts
2. Open App Store Connect: https://appstoreconnect.apple.com/
3. Navigate to your app → TestFlight or App Store
4. Upload build using Transporter app or Xcode
5. Complete app information:
   - Screenshots (required sizes)
   - App description
   - Keywords
   - Support URL
   - Privacy policy URL
   - Age rating
6. Submit for review

#### App Store Requirements

- **Screenshots Required:**
  - 6.5" display: 1290x2796 pixels (iPhone 14 Pro Max)
  - 5.5" display: 1242x2208 pixels (iPhone 8 Plus)
- **App Preview Video** (optional but recommended)
- **App Icon:** 1024x1024 pixels (PNG)
- **Privacy Policy:** Required (already configured in app)
- **Age Rating:** Complete questionnaire

### Android Submission to Google Play

#### Automatic Submission

```bash
eas submit --platform android --profile production
```

EAS will:
1. Find latest production Android build (.aab)
2. Upload to Google Play Console
3. Create release in configured track (production)
4. Submit for review

#### Manual Submission

1. Download .aab from build artifacts
2. Open Google Play Console: https://play.google.com/console/
3. Navigate to: Production → Create new release
4. Upload .aab file
5. Add release notes:
   ```
   Initial release of Slow Spot
   - Guided meditation sessions
   - Progress tracking and statistics
   - Achievements and gamification
   - Multi-language support (6 languages)
   - Custom meditation builder
   - Daily inspirational quotes
   ```
6. Review and rollout to 100%

#### Google Play Requirements

- **Screenshots Required:**
  - Phone: 1080x1920 pixels (minimum 2 screenshots)
  - 7" tablet: 1200x1920 pixels (optional)
  - 10" tablet: 1600x2560 pixels (optional)
- **Feature Graphic:** 1024x500 pixels (required)
- **App Icon:** 512x512 pixels (PNG)
- **Privacy Policy:** Required (URL configured in app)
- **Content Rating:** Complete questionnaire
- **Target SDK:** Android 14+ (API level 34)

## Environment Variables

### Available Environments

The app reads `APP_ENV` environment variable set by build profiles:

```typescript
// Access in code
import Constants from 'expo-constants';
const appEnv = Constants.expoConfig?.extra?.APP_ENV || 'development';
```

### Environment Values

1. **development** (Development Profile)
   - Local development
   - Dev server connections
   - Debug logging enabled

2. **preview** (Preview Profile)
   - Internal testing
   - Analytics enabled
   - Crash reporting enabled

3. **production** (Production Profile)
   - Public release
   - Analytics enabled
   - Performance monitoring
   - Error tracking

### Adding Custom Environment Variables

Update `eas.json` build profiles:

```json
"production": {
  "env": {
    "APP_ENV": "production",
    "API_URL": "https://api.slowspot.app",
    "ANALYTICS_ENABLED": "true"
  }
}
```

Access in app.json via `extra`:

```json
"extra": {
  "apiUrl": process.env.API_URL,
  "analyticsEnabled": process.env.ANALYTICS_ENABLED === "true"
}
```

## Troubleshooting

### Common Issues

#### Build Fails: "No valid code signing identity"

**Solution:**
```bash
# Clear credentials and regenerate
eas credentials --platform ios
# Select: "Remove all credentials"
# Run build again - EAS will generate new certificates
```

#### Build Fails: "Gradle build failed"

**Solution:**
```bash
# Clear cache and rebuild
eas build --profile production --platform android --clear-cache

# Check Android build logs
eas build:view [BUILD_ID]
```

#### Submission Fails: "Invalid bundle"

**Solution:**
1. Ensure app.json version matches build
2. Check bundleIdentifier (iOS) or package (Android) is registered
3. Verify all required metadata is complete

#### Build Takes Too Long

**Solution:**
```bash
# Use cached builds (production profile already configured)
eas build --profile production --platform all

# Check build queue
eas build:list --status in-progress
```

#### Device Not Receiving Preview Build (iOS)

**Solution:**
```bash
# Register device UDID
eas device:create

# Rebuild with new provisioning profile
eas build --profile preview --platform ios
```

### Getting Help

1. **EAS Build Logs**
   ```bash
   eas build:view [BUILD_ID]
   ```

2. **Expo Documentation**
   - https://docs.expo.dev/build/introduction/
   - https://docs.expo.dev/submit/introduction/

3. **Expo Forums**
   - https://forums.expo.dev/

4. **Expo Discord**
   - https://chat.expo.dev/

## Best Practices

### Version Management

1. **Semantic Versioning**
   - Update `version` in app.json for user-facing releases
   - Format: MAJOR.MINOR.PATCH (e.g., 1.0.0, 1.1.0, 1.1.1)
   - EAS auto-increments build numbers internally

2. **Version Strategy**
   - `1.0.0` - Initial release
   - `1.0.1` - Bug fixes
   - `1.1.0` - New features
   - `2.0.0` - Major changes/redesign

### Build Workflow

1. **Feature Development**
   ```bash
   # Develop locally
   npm start

   # Test on simulator
   eas build --profile development --platform ios
   ```

2. **QA Testing**
   ```bash
   # Build preview for testers
   eas build --profile preview --platform all

   # Distribute via TestFlight or Firebase
   eas submit --platform ios --profile preview
   ```

3. **Production Release**
   ```bash
   # Update version in app.json
   # Update CHANGELOG.md

   # Build production
   eas build --profile production --platform all

   # Submit to stores
   eas submit --platform all --profile production
   ```

### Security Best Practices

1. **Never commit credentials**
   - Add `android-service-account.json` to `.gitignore`
   - Never commit API keys or secrets
   - Use EAS Secrets for sensitive values

2. **Use EAS Secrets for sensitive data**
   ```bash
   eas secret:create --scope project --name API_KEY --value "secret-value"
   ```

3. **Rotate credentials periodically**
   - Update service account keys annually
   - Regenerate certificates before expiration

### Testing Before Submission

1. **Test Production Builds Locally**
   ```bash
   # Test production code on simulator
   eas build --profile production-simulator --platform ios
   ```

2. **Run Full Test Suite**
   - Follow TESTING_GUIDE.md before each release
   - Test on minimum OS versions (iOS 14, Android 10)
   - Verify all features work offline

3. **Check Compliance**
   - Privacy policy up to date
   - Terms of service current
   - Age rating accurate
   - Content guidelines met

### Release Checklist

Before submitting to app stores:

- [ ] Update version in `app.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run full test suite (TESTING_GUIDE.md)
- [ ] Test production build on physical devices
- [ ] Verify all translations are complete
- [ ] Check privacy policy is accessible
- [ ] Prepare store screenshots (iOS: 2 sizes, Android: phone + tablets)
- [ ] Write release notes (both stores)
- [ ] Verify app icon displays correctly
- [ ] Test app permissions (Calendar access)
- [ ] Check audio playback in background
- [ ] Verify analytics/crash reporting works
- [ ] Review App Store/Play Store guidelines compliance

---

## Quick Reference

### Essential Commands

```bash
# Login to EAS
eas login

# Check project status
eas project:info

# Build for development
eas build --profile development --platform all

# Build for QA/preview
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Submit to app stores
eas submit --platform all --profile production

# View build history
eas build:list

# View build details
eas build:view [BUILD_ID]

# Manage credentials
eas credentials

# View registered devices (iOS)
eas device:list

# Add test device (iOS)
eas device:create
```

### Important URLs

- **Expo Dashboard:** https://expo.dev/accounts/leszekszpunar/projects/slow-spot
- **App Store Connect:** https://appstoreconnect.apple.com/
- **Google Play Console:** https://play.google.com/console/
- **Apple Developer:** https://developer.apple.com/account/
- **EAS Documentation:** https://docs.expo.dev/build/introduction/

---

**Project:** Slow Spot
**Bundle ID (iOS):** com.slowspot.app
**Package Name (Android):** com.slowspot.app
**EAS Project ID:** 2b3ebb2e-60e7-4355-922a-db729c41792d
**Owner:** leszekszpunar
