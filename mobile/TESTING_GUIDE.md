# 🧪 Slow Spot - Comprehensive Testing Guide

**Version:** 1.0
**Date:** November 24, 2025
**Status:** Pre-Launch Testing

---

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Pre-Test Setup](#pre-test-setup)
3. [Feature Testing](#feature-testing)
4. [Build Testing](#build-testing)
5. [Integration Testing](#integration-testing)
6. [UI/UX Testing](#uiux-testing)
7. [Performance Testing](#performance-testing)
8. [Device Compatibility](#device-compatibility)
9. [Regression Testing](#regression-testing)
10. [Bug Reporting](#bug-reporting)

---

## Testing Overview

### Test Objectives
- ✅ Verify all features work as expected
- ✅ Ensure smooth user experience
- ✅ Validate offline-first architecture
- ✅ Test on multiple devices and OS versions
- ✅ Identify and fix critical bugs before launch

### Test Priorities
- **P0 (Critical):** App crashes, data loss, cannot complete meditation
- **P1 (High):** Feature broken, poor UX, visible bugs
- **P2 (Medium):** Minor UI issues, non-critical bugs
- **P3 (Low):** Cosmetic issues, nice-to-have improvements

---

## Pre-Test Setup

### Development Environment
```bash
# Ensure dependencies are installed
npm install

# Start development server
npm start

# Clear cache if needed
npm start -- --clear
```

### Test Devices Required
- **iOS:** iPhone (iOS 14+), iPad (optional)
- **Android:** Phone (Android 10+), Tablet (optional)
- **Simulator/Emulator:** iOS Simulator, Android Emulator

### Test Accounts
- **No accounts needed** - App is fully offline

### Test Data Preparation
- Clear AsyncStorage before each test cycle
- Prepare test custom sessions
- Have meditation bell audio ready

---

## Feature Testing

### 1. Home Screen ✅

#### Test Cases

**TC-HOME-001: Initial Load**
- [ ] App starts without crashes
- [ ] Splash screen displays correctly
- [ ] Home screen loads with all elements visible
- [ ] Daily quote displays correctly
- [ ] Quick Start button visible

**TC-HOME-002: Progress Display**
- [ ] Current streak shows "0 days" for new user
- [ ] Total minutes shows "0 min" for new user
- [ ] Sessions count shows "0 sessions" for new user
- [ ] After completing session, stats update correctly

**TC-HOME-003: Navigation**
- [ ] Quick Start button navigates to meditation
- [ ] Session Catalog button navigates to sessions list
- [ ] Custom Sessions button navigates to custom builder
- [ ] Bottom navigation works (Home, Meditate, Quotes, Settings)

**TC-HOME-004: Daily Quote**
- [ ] Quote displays with proper formatting
- [ ] Author displays correctly
- [ ] Quote changes when navigating to Quotes screen and back
- [ ] Translations work (test in Polish)

---

### 2. Meditation Sessions 🧘

#### Test Cases

**TC-MED-001: Session Selection**
- [ ] Sessions list loads all 40+ preset sessions
- [ ] Sessions display: title, description, duration, level
- [ ] Filters work (Beginner, Intermediate, Advanced, etc.)
- [ ] Sessions by occasion display correctly
- [ ] Cultural tradition tags display correctly

**TC-MED-002: Pre-Session Instructions**
- [ ] Instructions screen displays before meditation
- [ ] Time-of-day greeting is correct
- [ ] Physical setup checklist works
- [ ] Breathing exercise timer works
- [ ] "Skip" button works
- [ ] "Begin Meditation" starts timer

**TC-MED-003: Meditation Timer**
- [ ] Timer starts at correct duration
- [ ] Timer counts down correctly
- [ ] Pause button works
- [ ] Resume button works
- [ ] Audio plays (meditation bell)
- [ ] Ambient sounds play if selected
- [ ] Background mode works (timer continues when app backgrounded)

**TC-MED-004: Session Completion**
- [ ] Celebration screen displays
- [ ] Completion animation plays
- [ ] Stats update (total time, session count, streak)
- [ ] Session saved to history
- [ ] "How do you feel?" mood tracking works
- [ ] Can add notes to session

**TC-MED-005: Session Interruption**
- [ ] Can exit mid-session
- [ ] Partial session not counted in stats
- [ ] Can resume interrupted session
- [ ] App handles phone calls gracefully

---

### 3. Custom Sessions Builder 🎨

#### Test Cases

**TC-CUSTOM-001: Builder Interface**
- [ ] Builder screen loads correctly
- [ ] All input fields visible
- [ ] Duration selector works (5-60 minutes)
- [ ] Ambient sound dropdown works
- [ ] Interval bell toggle works
- [ ] Wake-up chime toggle works
- [ ] Session name input works

**TC-CUSTOM-002: Creating Session**
- [ ] Can create session with all options
- [ ] Session saves to AsyncStorage
- [ ] Session appears in custom sessions list
- [ ] Can start custom session immediately
- [ ] Haptic feedback on save

**TC-CUSTOM-003: Managing Custom Sessions**
- [ ] Custom sessions list displays all saved sessions
- [ ] Can view session details
- [ ] Can edit existing session
- [ ] Can delete session (with confirmation)
- [ ] Delete confirmation dialog works
- [ ] Deleted session removed from list

**TC-CUSTOM-004: Custom Session Playback**
- [ ] Custom session starts with selected duration
- [ ] Ambient sound plays if selected
- [ ] Interval bell rings at correct intervals
- [ ] Wake-up chime plays at end
- [ ] Session completes and saves to history

---

### 4. Progress Tracking 📊

#### Test Cases

**TC-PROG-001: Statistics Display**
- [ ] Profile screen displays all stats
- [ ] Total sessions count accurate
- [ ] Total minutes accurate
- [ ] Current streak accurate
- [ ] Longest streak accurate

**TC-PROG-002: Streak Calculation**
- [ ] Meditating today increases streak
- [ ] Missing a day resets current streak
- [ ] Longest streak persists
- [ ] Streak badge displays correctly

**TC-PROG-003: Recent Sessions**
- [ ] Recent sessions list displays
- [ ] Shows last 20 sessions
- [ ] Grouped by date (Today, Yesterday, This Week, Earlier)
- [ ] Each session shows: title, duration, date
- [ ] Custom vs preset sessions distinguished

**TC-PROG-004: Data Persistence**
- [ ] Stats persist after app restart
- [ ] Stats persist after app update
- [ ] Can clear data from settings
- [ ] Export/backup functionality (if implemented)

---

### 5. Achievements System 🏆

#### Test Cases

**TC-ACH-001: Achievement Display**
- [ ] Achievements section visible in Profile
- [ ] Level badge displays current level
- [ ] XP progress bar shows correctly
- [ ] "X XP to next level" text accurate

**TC-ACH-002: Unlocked Achievements**
- [ ] Unlocked achievements display in horizontal scroll
- [ ] Achievement badges show: icon, title
- [ ] Compact badge design (64x64)
- [ ] Up to 10 achievements shown
- [ ] Rarity colors display correctly

**TC-ACH-003: Almost Unlocked**
- [ ] "Almost There" section shows achievements >50% progress
- [ ] Progress badge displays percentage
- [ ] Progress bar accurate
- [ ] Progress updates after completing sessions

**TC-ACH-004: Achievement Unlocking**
- [ ] First session unlocks "First Steps" achievement
- [ ] 3-day streak unlocks "Getting Started"
- [ ] 10 sessions unlocks "Dedicated Practitioner"
- [ ] XP increases when achievement unlocked
- [ ] Level increases at correct XP thresholds

**TC-ACH-005: Achievement Translations**
- [ ] All achievements display in selected language
- [ ] English translations display correctly
- [ ] Polish translations display correctly
- [ ] Test all 6 languages for proper formatting

---

### 6. Quotes Screen 💭

#### Test Cases

**TC-QUOTE-001: Quote Display**
- [ ] Quotes screen loads
- [ ] Quote card displays with gradient background
- [ ] Quote text displays correctly
- [ ] Author displays correctly
- [ ] Transliteration displays (if available)
- [ ] Original text displays (if available)

**TC-QUOTE-002: Navigation**
- [ ] "Next" button shows next quote
- [ ] "Previous" button shows previous quote
- [ ] "Random Quote" button shows random quote
- [ ] Navigation wraps around at end of list
- [ ] Quotes don't repeat until all seen

**TC-QUOTE-003: Quote Content**
- [ ] All 114 quotes load
- [ ] No duplicate IDs
- [ ] All translations present (en, pl, de, es, fr, hi)
- [ ] Special characters display correctly (Sanskrit, Greek, Arabic, Chinese)
- [ ] Cultural tags correct (buddhist, zen, sufi, etc.)

**TC-QUOTE-004: Quote History**
- [ ] Quote history tracks shown quotes
- [ ] Random quotes don't repeat
- [ ] History resets after all quotes shown
- [ ] History persists across app restarts

---

### 7. Settings & Preferences ⚙️

#### Test Cases

**TC-SET-001: Language Selection**
- [ ] Language selector displays all 6 languages
- [ ] Changing language updates entire UI
- [ ] Language persists after restart
- [ ] Test each language: English, Polish, Spanish, German, French, Hindi
- [ ] Quotes translate correctly
- [ ] Achievement names translate correctly

**TC-SET-002: Theme Selection**
- [ ] Theme selector shows: Light, Dark, System
- [ ] Light theme applies correctly
- [ ] Dark theme applies correctly
- [ ] System theme follows device settings
- [ ] Theme persists after restart

**TC-SET-003: Calendar Integration**
- [ ] Can schedule daily meditation reminder
- [ ] Time picker works
- [ ] Reminder saves to device calendar
- [ ] Can cancel reminder
- [ ] Permission denied handled gracefully

**TC-SET-004: About & Profile**
- [ ] "View Profile" button navigates to ProfileScreen
- [ ] App version displays correctly
- [ ] Privacy policy link works (when hosted)

---

### 8. Wellbeing Questionnaire 🤔

#### Test Cases

**TC-WELL-001: Pre-Session Questions**
- [ ] Pre-session questions display (if enabled)
- [ ] Mood scale works (1-10)
- [ ] Energy level question works
- [ ] Can skip questions
- [ ] Responses save to session data

**TC-WELL-002: Post-Session Questions**
- [ ] Post-session questions display
- [ ] "How do you feel?" question works
- [ ] Mood improvement calculated
- [ ] Can add session notes
- [ ] Responses save to session history

**TC-WELL-003: Mood Tracking**
- [ ] Mood before/after tracked
- [ ] Mood improvement achievement unlocks (20 times)
- [ ] Mood data persists
- [ ] Can view mood history (if implemented)

---

## Build Testing

### Development Build

```bash
# iOS Development
npm run ios

# Android Development
npm run android
```

**Checklist:**
- [ ] App builds without errors
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Hot reload works
- [ ] Fast refresh works

### Production Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

**Checklist:**
- [ ] Production build succeeds
- [ ] No build errors
- [ ] App size reasonable (<50MB)
- [ ] All assets bundled correctly
- [ ] Ambient sounds included
- [ ] Meditation bell included

---

## Integration Testing

### AsyncStorage Integration

**Test Cases:**
- [ ] Custom sessions persist
- [ ] Progress data persists
- [ ] Settings persist
- [ ] Quote history persists
- [ ] Achievement data persists
- [ ] Data survives app restart
- [ ] Data cleared on uninstall

### Audio Integration

**Test Cases:**
- [ ] Meditation bell loads and plays
- [ ] Ambient sounds load and play
- [ ] Audio continues in background
- [ ] Audio stops when paused
- [ ] Audio volume respects device settings
- [ ] Multiple audio files can play (ambient + bell)

### Calendar Integration

**Test Cases:**
- [ ] Calendar permission request works
- [ ] Can create calendar event
- [ ] Can edit calendar event
- [ ] Can delete calendar event
- [ ] Handles permission denial gracefully

### Localization Integration

**Test Cases:**
- [ ] All UI text translates
- [ ] Date/time formats locale-aware
- [ ] RTL languages work (if supported)
- [ ] Number formats correct
- [ ] Pluralization works

---

## UI/UX Testing

### Visual Consistency

**Checklist:**
- [ ] Consistent spacing throughout app
- [ ] Consistent colors (theme colors used)
- [ ] Consistent typography
- [ ] Consistent button styles
- [ ] Consistent card styles
- [ ] Gradient backgrounds render correctly

### Responsiveness

**Checklist:**
- [ ] Works on small phones (iPhone SE)
- [ ] Works on large phones (iPhone 14 Pro Max)
- [ ] Works on tablets (iPad)
- [ ] Text doesn't overflow
- [ ] Buttons accessible
- [ ] Scrollable content scrolls

### Accessibility

**Checklist:**
- [ ] Text readable (sufficient contrast)
- [ ] Font sizes appropriate
- [ ] Touch targets large enough (44x44 minimum)
- [ ] VoiceOver support (iOS)
- [ ] TalkBack support (Android)
- [ ] Color-blind friendly

### Animations

**Checklist:**
- [ ] Page transitions smooth
- [ ] Loading states display
- [ ] Success animations play
- [ ] No janky animations
- [ ] Haptic feedback works appropriately

---

## Performance Testing

### App Performance

**Metrics to Check:**
- [ ] App starts in <3 seconds
- [ ] Screens load in <1 second
- [ ] No frame drops during scrolling
- [ ] No memory leaks (test long sessions)
- [ ] Background timer accurate

### Storage Performance

**Checklist:**
- [ ] AsyncStorage reads fast (<100ms)
- [ ] AsyncStorage writes succeed
- [ ] Large quote list loads quickly
- [ ] Custom sessions list loads quickly
- [ ] No storage quota exceeded

### Audio Performance

**Checklist:**
- [ ] Audio loads in <1 second
- [ ] No audio glitches
- [ ] Audio sync accurate
- [ ] No audio lag
- [ ] Handles multiple audio sources

---

## Device Compatibility

### iOS Testing

**Required Devices:**
- [ ] iPhone (iOS 14.0+)
- [ ] iPhone (iOS 15.0+)
- [ ] iPhone (iOS 16.0+)
- [ ] iPhone (iOS 17.0+)
- [ ] iPad (iPadOS 14.0+) - optional

**iOS-Specific Tests:**
- [ ] Dark mode works
- [ ] Safe area insets respected
- [ ] Notch handled correctly
- [ ] Dynamic Island works (iOS 16.1+)
- [ ] VoiceOver works

### Android Testing

**Required Devices:**
- [ ] Android 10 (Q)
- [ ] Android 11 (R)
- [ ] Android 12 (S)
- [ ] Android 13 (T)
- [ ] Android 14 (U)

**Android-Specific Tests:**
- [ ] Dark theme works
- [ ] Status bar color correct
- [ ] Navigation bar color correct
- [ ] Back button works everywhere
- [ ] TalkBack works

---

## Regression Testing

### After Bug Fixes

**Process:**
1. Retest the bug scenario
2. Test related features
3. Test core user flows
4. Check for side effects

### After Feature Additions

**Process:**
1. Test new feature thoroughly
2. Test integration with existing features
3. Run full feature test suite
4. Check performance impact

### Before Each Release

**Full Regression Checklist:**
- [ ] Complete one full meditation session
- [ ] Create and play custom session
- [ ] View achievements
- [ ] Browse quotes
- [ ] Change language
- [ ] Change theme
- [ ] View profile and stats
- [ ] Check all navigation paths

---

## Bug Reporting

### Bug Report Template

```markdown
## Bug Report

**Title:** [Short description]

**Priority:** P0 / P1 / P2 / P3

**Device:** iPhone 14 Pro / Samsung Galaxy S22 / etc.
**OS Version:** iOS 17.1 / Android 13 / etc.
**App Version:** 1.0.0

**Steps to Reproduce:**
1. Open app
2. Navigate to [screen]
3. Tap [button]
4. Observe [issue]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Video:**
[Attach if applicable]

**Logs:**
[Paste relevant console logs]

**Workaround:**
[If any workaround exists]
```

### Bug Severity Guidelines

**P0 - Critical (Fix Immediately):**
- App crashes on launch
- Cannot complete meditation
- Data loss
- Privacy/security issue

**P1 - High (Fix Before Release):**
- Feature completely broken
- Major UX issue
- Visible crash
- Performance degradation

**P2 - Medium (Fix Soon):**
- Minor feature issue
- UI glitch
- Non-critical bug
- Edge case issue

**P3 - Low (Fix When Possible):**
- Cosmetic issue
- Very rare bug
- Nice-to-have improvement
- Documentation issue

---

## Test Execution Tracking

### Test Cycle 1 - Core Features
**Date:** ___________
**Tester:** ___________
**Build:** ___________

- [ ] Home Screen (TC-HOME-001 to TC-HOME-004)
- [ ] Meditation Sessions (TC-MED-001 to TC-MED-005)
- [ ] Custom Sessions (TC-CUSTOM-001 to TC-CUSTOM-004)
- [ ] Progress Tracking (TC-PROG-001 to TC-PROG-004)

**Pass Rate:** ___ / ___ (__%)
**Critical Bugs:** ___
**Notes:** ___________

---

### Test Cycle 2 - Achievements & Content
**Date:** ___________
**Tester:** ___________
**Build:** ___________

- [ ] Achievements System (TC-ACH-001 to TC-ACH-005)
- [ ] Quotes Screen (TC-QUOTE-001 to TC-QUOTE-004)
- [ ] Settings (TC-SET-001 to TC-SET-004)
- [ ] Wellbeing Questions (TC-WELL-001 to TC-WELL-003)

**Pass Rate:** ___ / ___ (__%)
**Critical Bugs:** ___
**Notes:** ___________

---

### Test Cycle 3 - Integration & Performance
**Date:** ___________
**Tester:** ___________
**Build:** ___________

- [ ] AsyncStorage Integration
- [ ] Audio Integration
- [ ] Calendar Integration
- [ ] Performance Testing
- [ ] Device Compatibility

**Pass Rate:** ___ / ___ (__%)
**Critical Bugs:** ___
**Notes:** ___________

---

## Pre-Launch Checklist

**Code Quality:**
- [ ] No TypeScript errors
- [ ] No console.error in production
- [ ] No TODO comments for critical features
- [ ] Code reviewed
- [ ] Security audit passed

**Features:**
- [ ] All core features working
- [ ] All achievements working
- [ ] All quotes display correctly
- [ ] All translations complete

**Content:**
- [ ] Privacy Policy hosted
- [ ] App Store description ready
- [ ] Screenshots prepared
- [ ] App icons generated

**Testing:**
- [ ] All test cases passed
- [ ] No P0 or P1 bugs
- [ ] Tested on iOS and Android
- [ ] Tested on multiple devices
- [ ] Performance acceptable

**Build:**
- [ ] Production build succeeds
- [ ] App size acceptable
- [ ] All assets included
- [ ] Signing configured

**Store Submission:**
- [ ] App Store Connect configured
- [ ] Google Play Console configured
- [ ] Privacy Policy URL added
- [ ] All metadata complete

---

## Conclusion

This comprehensive testing guide ensures that **Slow Spot** delivers a high-quality, bug-free experience to users. Follow this guide systematically before each release to maintain quality standards.

**Questions or Issues?**
Contact: [Your contact information]

**Document Version:** 1.0
**Last Updated:** November 24, 2025
