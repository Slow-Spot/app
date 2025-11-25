# Pre-Launch Checklist

Comprehensive checklist for launching Slow Spot to iOS App Store and Google Play Store.

## Overview

This checklist ensures all requirements are met before submitting Slow Spot for app store approval. Complete all items marked with checkboxes before proceeding to submission.

**Target Launch Date**: TBD
**App Version**: 1.0.0
**Bundle ID (iOS)**: com.slowspot.app
**Package Name (Android)**: com.slowspot.app

---

## 📱 App Functionality

### Core Features Testing

- [ ] **Home Screen**
  - [ ] Daily quote displays correctly
  - [ ] Quote teaser visible
  - [ ] Quick Start button functional
  - [ ] Navigation to all sections works
  - [ ] Statistics display correctly

- [ ] **Meditation Sessions**
  - [ ] All preset sessions load and display
  - [ ] Custom sessions appear in list
  - [ ] Session details show correctly
  - [ ] Timer starts/pauses/resumes properly
  - [ ] Background audio continues when app backgrounded
  - [ ] Completion celebration displays
  - [ ] Progress saved correctly

- [ ] **Custom Session Builder**
  - [ ] All configuration options work
  - [ ] Duration selection functional
  - [ ] Ambient sound selection works
  - [ ] Interval bells configurable
  - [ ] Pre-session instructions work
  - [ ] Sessions save successfully
  - [ ] Can edit existing custom sessions
  - [ ] Can delete custom sessions

- [ ] **Progress Tracking**
  - [ ] Weekly meditation chart displays
  - [ ] Total sessions count accurate
  - [ ] Total minutes calculated correctly
  - [ ] Current streak displayed
  - [ ] Longest streak displayed
  - [ ] Data persists across app restarts

- [ ] **Achievements System**
  - [ ] Achievements unlock correctly
  - [ ] XP calculated accurately
  - [ ] Level progression works
  - [ ] Achievement badges display
  - [ ] Locked achievements show "???"
  - [ ] Achievement notifications appear

- [ ] **Quotes Screen**
  - [ ] All 114 quotes accessible
  - [ ] Non-repeating random quote selection
  - [ ] Quote details display (author, tradition)
  - [ ] Translations work in all languages
  - [ ] Share functionality works (if implemented)

- [ ] **Settings**
  - [ ] Language selection works (6 languages)
  - [ ] All UI updates when language changes
  - [ ] App restarts maintain selected language
  - [ ] Theme switching functional (if implemented)
  - [ ] Privacy policy accessible
  - [ ] About section displays correctly

- [ ] **Profile Screen**
  - [ ] User statistics accurate
  - [ ] Level and XP displayed
  - [ ] Achievements listed
  - [ ] Custom sessions accessible
  - [ ] Navigation works correctly

### Offline Functionality

- [ ] App works without internet connection
- [ ] All features accessible offline
- [ ] Data persists when offline
- [ ] No API errors or failed network requests
- [ ] AsyncStorage working correctly

### Performance

- [ ] App starts in < 3 seconds
- [ ] Smooth 60 FPS animations
- [ ] No memory leaks detected
- [ ] Audio playback smooth and clear
- [ ] No crashes or freezes
- [ ] Responsive UI on all screen sizes

---

## 🌍 Localization

### Translations Complete

- [ ] **English (en)** - Complete
- [ ] **Polish (pl)** - Complete
- [ ] **Spanish (es)** - Complete
- [ ] **German (de)** - Complete
- [ ] **French (fr)** - Complete
- [ ] **Hindi (hi)** - Complete

### Translation Quality

- [ ] All UI elements translated
- [ ] Achievement names/descriptions translated
- [ ] Quotes translated (all 114)
- [ ] Error messages translated
- [ ] Success messages translated
- [ ] No missing translation keys (no "undefined" or keys showing)
- [ ] Native speaker review completed (if possible)
- [ ] Cultural appropriateness verified

### Language Testing

- [ ] Tested app in all 6 languages
- [ ] Text fits in UI components (no overflow)
- [ ] Right-to-left languages handled (if applicable)
- [ ] Date/time formats localized
- [ ] Number formats localized

---

## 🎨 Design & Assets

### App Icons

- [ ] **iOS Icon** (1024x1024) - `icon.png` ✅
- [ ] **Android Icon** (1024x1024) - `adaptive-icon.png` ✅
- [ ] **Android Adaptive Icon** safe zone verified ✅
- [ ] **Favicon** (48x48) - `favicon.png` ✅
- [ ] Icons look clear at all sizes (40px - 1024px)
- [ ] Icon represents app purpose (meditation/mindfulness)
- [ ] No text in icon (remains legible when small)

### Splash Screen

- [ ] **Splash Icon** (1024x1024) - `splash-icon.png` ✅
- [ ] Background color matches gradient (#667eea) ✅
- [ ] Displays correctly on all device sizes
- [ ] Loads quickly (< 2 seconds)

### Store Graphics

- [ ] **Google Play Feature Graphic** (1024x500) ✅
- [ ] Feature graphic uploaded to Play Console
- [ ] Feature graphic meets quality standards

### Screenshots (Required for Submission)

#### iOS Screenshots Needed

- [ ] **6.9" Display** (1320x2868) - iPhone 16 Pro Max
  - [ ] Home screen with daily quote
  - [ ] Meditation session in progress
  - [ ] Progress tracking screen
  - [ ] Achievements screen
  - [ ] Custom session builder

- [ ] **6.7" Display** (1290x2796) - iPhone 15 Pro Max (optional but recommended)
  - [ ] Same 4-5 key screens

- [ ] **6.5" Display** (1284x2778) - iPhone 14 Pro Max (optional)

#### Android Screenshots Needed

- [ ] **Phone Screenshots** (1080x1920 or similar)
  - [ ] Minimum 2 screenshots required
  - [ ] Recommended 4-5 screenshots showing:
    - [ ] Home screen
    - [ ] Meditation session
    - [ ] Progress tracking
    - [ ] Achievements
    - [ ] Custom sessions

- [ ] **Tablet Screenshots** (optional but recommended)
  - [ ] 7" Tablet (1200x1920)
  - [ ] 10" Tablet (1600x2560)

### Screenshot Quality

- [ ] High resolution (no pixelation)
- [ ] Show real app content (not mockups)
- [ ] Demonstrate key features
- [ ] No placeholder text visible
- [ ] Clean UI with no debug overlays
- [ ] Consistent branding across screenshots
- [ ] Optional: Add text overlays explaining features

---

## 🏗️ Build Configuration

### EAS Build Setup

- [ ] `eas.json` configured correctly ✅
- [ ] Development profile works
- [ ] Preview profile works
- [ ] Production profile configured
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into Expo account (`eas login`)
- [ ] Project ID verified in `app.json` ✅

### iOS Build

- [ ] Apple Developer account active ($99/year)
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.slowspot.app` ✅
- [ ] App Store Connect App ID obtained
- [ ] Apple Team ID obtained
- [ ] `eas.json` updated with Apple credentials
- [ ] iOS certificates generated (EAS handles automatically)
- [ ] TestFlight ready for beta testing
- [ ] Production build successful
- [ ] .ipa file downloadable and installable

### Android Build

- [ ] Google Play Developer account active ($25 one-time)
- [ ] App created in Google Play Console
- [ ] Package name matches: `com.slowspot.app` ✅
- [ ] Service account created for API access
- [ ] Service account JSON key downloaded
- [ ] `android-service-account.json` in project root
- [ ] `android-service-account.json` added to `.gitignore` ✅
- [ ] Android keystore generated (EAS handles automatically)
- [ ] Play App Signing enabled
- [ ] Production build successful (.aab)
- [ ] .aab file uploadable to Play Console

### Build Testing

- [ ] Test development build on simulator/emulator
- [ ] Test preview build on physical device (iOS)
- [ ] Test preview build on physical device (Android)
- [ ] Test production build (production-simulator profile)
- [ ] Verify app signing certificates valid
- [ ] Verify over-the-air updates work (Expo Updates)

---

## 📝 App Store Listings

### iOS App Store Connect

#### App Information

- [ ] **App Name**: Slow Spot
- [ ] **Subtitle**: Meditation & Mindfulness (max 30 characters)
- [ ] **Primary Category**: Health & Fitness
- [ ] **Secondary Category**: Lifestyle (optional)
- [ ] **Content Rights**: App does not use third-party content
- [ ] **Age Rating**: Completed questionnaire (likely 4+)
- [ ] **Copyright**: © 2024 [Your Name/Company]

#### Description & Keywords

- [ ] **Description** written (max 4000 characters):
  ```
  Slow Spot is your personal meditation companion, designed to help you
  cultivate mindfulness, reduce stress, and improve overall well-being.
  Whether you're a beginner or experienced meditator, Slow Spot offers
  guided sessions, progress tracking, and personalized insights to support
  your meditation journey.

  KEY FEATURES:
  • Guided Meditation Sessions - Multiple meditation techniques
  • Custom Session Builder - Create personalized meditation experiences
  • Progress Tracking - Visualize your meditation journey
  • Achievements & Gamification - Stay motivated with unlockable badges
  • 114 Inspirational Quotes - Daily wisdom from 9 meditation traditions
  • 6 Languages - English, Polish, Spanish, German, French, Hindi
  • 100% Offline - No internet required, complete privacy
  • Beautiful Design - Calming interface with soothing gradients

  [Continue with more details...]
  ```

- [ ] **Keywords** selected (max 100 characters):
  ```
  meditation, mindfulness, stress relief, calm, zen, wellness, breathing,
  relaxation, mental health, focus
  ```

- [ ] **Promotional Text** (max 170 characters, optional):
  ```
  Start your mindfulness journey today. Guided meditations, progress
  tracking, and achievements. 100% offline and private.
  ```

- [ ] **Support URL**: https://yourwebsite.com/support (or GitHub)
- [ ] **Marketing URL**: https://yourwebsite.com (optional)
- [ ] **Privacy Policy URL**: ✅ Already configured in app.json

#### Pricing & Availability

- [ ] **Price**: Free
- [ ] **Availability**: All countries
- [ ] **Pre-orders**: No (for initial launch)

#### Version Information

- [ ] **Version Number**: 1.0.0
- [ ] **Build Number**: Auto-incremented by EAS
- [ ] **What's New in This Version**:
  ```
  Initial release of Slow Spot!

  • Multiple guided meditation sessions
  • Custom meditation builder
  • Progress tracking with statistics
  • Achievements and gamification
  • 114 inspirational quotes from 9 traditions
  • Support for 6 languages
  • 100% offline functionality
  • Beautiful, calming design
  ```

### Google Play Console

#### Store Listing

- [ ] **App Name**: Slow Spot
- [ ] **Short Description** (max 80 characters):
  ```
  Meditation & mindfulness app with guided sessions, tracking, and achievements
  ```

- [ ] **Full Description** (max 4000 characters):
  ```
  [Similar to iOS description, adapted for Android audience]
  ```

- [ ] **App Category**: Health & Fitness
- [ ] **Tags**: meditation, mindfulness, wellness, mental health, relaxation

#### Graphics

- [ ] App icon (512x512) ✅ Auto-generated by EAS
- [ ] Feature graphic (1024x500) ✅
- [ ] Phone screenshots (2-8 images) ⏳
- [ ] 7" tablet screenshots (optional)
- [ ] 10" tablet screenshots (optional)
- [ ] Promo video (optional)

#### Pricing & Distribution

- [ ] **Price**: Free
- [ ] **Countries**: All available countries
- [ ] **Content Rating**: Apply for rating (likely Everyone)
- [ ] **Target Audience**: Teens and Adults

#### Privacy & Security

- [ ] Data safety form completed
- [ ] **Data Collection**: None (fully offline)
- [ ] **Data Sharing**: None
- [ ] **Security Practices**: Data encrypted in transit and at rest
- [ ] Privacy policy URL provided

---

## 📜 Legal & Compliance

### Privacy & Data

- [ ] Privacy policy created ✅
- [ ] Privacy policy hosted ✅
- [ ] Privacy policy URL accessible: ✅
- [ ] GDPR compliant (if applicable)
- [ ] CCPA compliant (if applicable)
- [ ] Data collection disclosed (none - fully offline)
- [ ] No personal data collected without consent
- [ ] AsyncStorage data only stored locally

### Terms & Conditions

- [ ] Terms of Service created (optional for free app)
- [ ] Terms of Service accessible in app (if created)
- [ ] EULA included if required

### Permissions

#### iOS Permissions (Info.plist)

- [ ] **Calendar Access**: `NSCalendarsUsageDescription` ✅
  - "We need access to your calendar to schedule meditation sessions."
- [ ] **Reminders Access**: `NSRemindersUsageDescription` ✅
  - "We need access to your reminders to set meditation reminders."
- [ ] **Background Audio**: `UIBackgroundModes` audio ✅
  - For meditation session audio playback

#### Android Permissions (AndroidManifest.xml)

- [ ] **Calendar Permissions** ✅
  - `READ_CALENDAR`
  - `WRITE_CALENDAR`
- [ ] **Internet Permission**: Not required (fully offline)
- [ ] **Storage Permission**: Not required (uses AsyncStorage)

### Content Guidelines

- [ ] No inappropriate content (violence, adult content, hate speech)
- [ ] All quotes and content culturally appropriate
- [ ] No copyright violations (all content original or properly licensed)
- [ ] No third-party trademarks used without permission
- [ ] Meditation guidance medically responsible (no health claims)

### Age Ratings

- [ ] **iOS Age Rating**: 4+ (likely - meditation app)
- [ ] **Android Content Rating**: Everyone or Teen
- [ ] Age rating questionnaire completed for both stores

---

## 🔒 Security & Quality

### Code Quality

- [ ] No console.log statements in production code
- [ ] No debug flags enabled in production
- [ ] No hardcoded API keys or secrets
- [ ] No test/placeholder data in production
- [ ] Error handling implemented throughout
- [ ] Logger used instead of console.log ✅

### Security

- [ ] `android-service-account.json` not committed ✅
- [ ] `.env` files not committed ✅
- [ ] No sensitive data in source control
- [ ] AsyncStorage data encrypted (default on iOS, opt-in on Android)
- [ ] App signing certificates secure
- [ ] HTTPS only (no HTTP connections) ✅
- [ ] No SQL injection vulnerabilities (N/A - no database)
- [ ] No XSS vulnerabilities (N/A - native app)

### Accessibility

- [ ] VoiceOver support tested (iOS)
- [ ] TalkBack support tested (Android)
- [ ] Sufficient color contrast ratios
- [ ] Touch targets minimum 44x44 points (iOS) / 48x48 dp (Android)
- [ ] Text scalable for accessibility
- [ ] Accessibility labels on interactive elements

### Performance

- [ ] App size < 100MB (ideally < 50MB)
- [ ] Cold start < 3 seconds
- [ ] Memory usage < 200MB
- [ ] Battery drain acceptable
- [ ] No ANR errors (Android)
- [ ] No crashes in 99.9% of sessions

---

## 🧪 Testing

### Device Testing

- [ ] **iOS Testing**:
  - [ ] iPhone SE (small screen)
  - [ ] iPhone 14 Pro (standard)
  - [ ] iPhone 16 Pro Max (large screen)
  - [ ] iPad (tablet)

- [ ] **Android Testing**:
  - [ ] Pixel 5 (standard)
  - [ ] Samsung Galaxy S22 (manufacturer skin)
  - [ ] OnePlus device (different manufacturer)
  - [ ] Tablet device

### OS Version Testing

- [ ] **iOS**: Tested on iOS 14, 15, 16, 17, 18 (minimum iOS 14)
- [ ] **Android**: Tested on Android 10, 11, 12, 13, 14 (minimum Android 10)

### Functional Testing

- [ ] All items in TESTING_GUIDE.md completed ✅
- [ ] Feature testing (TC-HOME-001 through TC-WELL-003) ✅
- [ ] Integration testing complete ✅
- [ ] UI/UX testing complete ✅
- [ ] Performance testing complete ✅

### Regression Testing

- [ ] All previously fixed bugs still fixed
- [ ] No new bugs introduced
- [ ] All critical paths tested

### Beta Testing

- [ ] Internal testing complete (team members)
- [ ] TestFlight beta testing (iOS) - 5-10 testers
- [ ] Google Play internal testing (Android) - 5-10 testers
- [ ] Feedback collected and addressed
- [ ] No P0 (critical) bugs remaining
- [ ] No more than 2 P1 (high) bugs remaining

---

## 📢 Marketing & Launch Prep

### Landing Page (Optional)

- [ ] Website created for app
- [ ] App features highlighted
- [ ] Screenshots included
- [ ] Download links ready (will add after approval)
- [ ] Privacy policy linked
- [ ] Support/contact information provided

### Social Media (Optional)

- [ ] Social media accounts created
- [ ] Launch announcement prepared
- [ ] App screenshots shared
- [ ] Hashtags planned (#meditation #mindfulness #slowspot)

### Press Kit (Optional)

- [ ] App description
- [ ] High-res screenshots
- [ ] App icon (various sizes)
- [ ] Company/developer information
- [ ] Contact information

### Support Channel

- [ ] Support email set up (support@...)
- [ ] FAQ page created (optional)
- [ ] Bug reporting process defined
- [ ] User feedback mechanism in place

---

## 📤 Submission Process

### iOS App Store Submission

#### Pre-Submission

- [ ] All above checklist items completed
- [ ] Production build created via EAS
- [ ] Build uploaded to App Store Connect
- [ ] Build appears in TestFlight
- [ ] TestFlight testing complete

#### Submission Steps

- [ ] Open App Store Connect
- [ ] Navigate to app → App Store tab
- [ ] Click "+" to add new version (1.0.0)
- [ ] Fill in "What's New" text
- [ ] Select uploaded build
- [ ] Add screenshots (all required sizes)
- [ ] Verify app description and keywords
- [ ] Verify pricing and availability
- [ ] Add app icon (1024x1024)
- [ ] Complete age rating questionnaire
- [ ] Accept export compliance (if required)
- [ ] Submit for review

#### Post-Submission

- [ ] Monitor submission status (typically 24-48 hours)
- [ ] Respond to App Review questions if any
- [ ] Address any rejection reasons
- [ ] Celebrate when approved! 🎉

### Google Play Store Submission

#### Pre-Submission

- [ ] All above checklist items completed
- [ ] Production build created via EAS (.aab)
- [ ] Internal testing track completed
- [ ] Content rating obtained

#### Submission Steps

- [ ] Open Google Play Console
- [ ] Navigate to app → Production → Create new release
- [ ] Upload .aab file (or use EAS submit)
- [ ] Add release notes
- [ ] Review release
- [ ] Rollout to production (start with 20%, increase gradually)

#### Post-Submission

- [ ] Monitor for crashes in Play Console
- [ ] Check user reviews and ratings
- [ ] Respond to user feedback
- [ ] Gradually increase rollout (20% → 50% → 100%)
- [ ] Celebrate full rollout! 🎉

---

## 🚀 Post-Launch

### Monitoring (First 48 Hours)

- [ ] Monitor crash reports (Firebase Crashlytics, if enabled)
- [ ] Check app store reviews
- [ ] Monitor support emails
- [ ] Track download numbers
- [ ] Watch for critical bugs

### User Feedback

- [ ] Set up system for collecting feedback
- [ ] Respond to app store reviews
- [ ] Address critical bugs immediately
- [ ] Plan updates based on feedback

### Updates

- [ ] Plan version 1.1.0 features
- [ ] Create changelog for future updates
- [ ] Monitor OS updates (iOS 19, Android 15)
- [ ] Keep dependencies up to date

### Analytics (Optional)

- [ ] Set up analytics (LogRocket, Vexo)
- [ ] Track user engagement
- [ ] Monitor feature usage
- [ ] Identify areas for improvement

---

## ✅ Final Verification

### Before Clicking "Submit"

- [ ] All checkboxes in this document completed
- [ ] App tested on physical devices (both platforms)
- [ ] All screenshots uploaded
- [ ] All store listing information entered
- [ ] Privacy policy accessible
- [ ] Production builds successful
- [ ] No critical bugs remaining
- [ ] Team approval obtained (if applicable)
- [ ] Ready to support users post-launch
- [ ] Celebration planned for approval 🎊

---

## 📊 Launch Metrics

Track these metrics post-launch:

- **Downloads**:
  - [ ] First 100 downloads
  - [ ] First 1,000 downloads
  - [ ] First 10,000 downloads

- **Ratings**:
  - [ ] Target: 4.0+ rating
  - [ ] Target: 4.5+ rating
  - [ ] Target: 50+ reviews

- **Engagement**:
  - [ ] Daily active users
  - [ ] Average session duration
  - [ ] Retention rate (7-day, 30-day)

---

## 🆘 Emergency Contacts

**If something goes wrong post-launch:**

- **Critical Bug**: Pull app from stores if necessary
- **Security Issue**: Patch immediately and submit update
- **Negative Reviews**: Respond professionally and address concerns
- **Store Rejection**: Address all issues and resubmit

---

## 📚 Resources

- **EAS Build Docs**: EAS_BUILD_SETUP.md
- **Testing Guide**: TESTING_GUIDE.md
- **Icon Assets Guide**: ICON_ASSETS_GUIDE.md
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Guidelines**: https://support.google.com/googleplay/android-developer/topic/9858052

---

**Checklist Last Updated**: November 24, 2024
**App Version**: 1.0.0
**Launch Status**: Pre-Launch ⏳

**Progress**: 0 / [total items] completed

---

## Notes

Use this space to track issues, blockers, or important decisions:

```
[Add notes here as you complete the checklist]
```

---

**Good luck with your launch! 🚀**
