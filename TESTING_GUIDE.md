# Slow Spot - Testing Guide 🧘‍♀️

## For Testers: How to Test the App

### Prerequisites
- Install **Expo Go** app from:
  - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Method 1: Direct Link (Easiest)
1. Open this link on your phone: [https://expo.dev/@leszekszpunar/slow-spot](https://expo.dev/@leszekszpunar/slow-spot)
2. It will open in Expo Go automatically
3. ✅ Done!

### Method 2: Manual Entry
1. Open **Expo Go** app
2. Tap **"Enter URL manually"** (+ button in top right)
3. Paste: `exp://u.expo.dev/2b3ebb2e-60e7-4355-922a-db729c41792d?channel-name=preview`
4. Tap **"Connect"**

### Method 3: QR Code
After workflow completes, QR code will be available in:
- GitHub Actions output
- Or generate one at: https://expo.dev/accounts/leszekszpunar/projects/slow-spot

---

## Updates
The app updates automatically (OTA - Over The Air)!
- No need to re-download
- Just reopen the app to get latest version
- Updates happen in ~2-3 minutes after developer pushes changes

---

## What to Test

### 1. Meditation Sessions
- Browse available sessions
- Start a meditation
- Test audio playback (voice + ambient sound)
- Test timer functionality
- Test breathing circle animation

### 2. Custom Sessions
- Create custom meditation session
- Configure:
  - Duration (5-60 min)
  - Ambient sound (nature, silence, 432hz, 528hz, ocean, forest)
  - Interval bells
  - Wake-up chime
- Save and load custom sessions

### 3. UI/UX
- Navigation between screens
- Visual design and colors
- Text readability
- Button responsiveness
- Animations smoothness

### 4. Localization
- Switch between Polish (PL) and English (EN)
- Check translations
- Verify text doesn't overflow

---

## Reporting Issues

Please report any bugs or suggestions:
1. **GitHub Issues**: [https://github.com/Slow-Spot/app/issues](https://github.com/Slow-Spot/app/issues)
2. **Email**: leszekszpunar@gmail.com

Include:
- Device model and OS version
- Steps to reproduce
- Screenshots/videos if possible
- What you expected vs what happened

---

## Technical Details

**Project**: @leszekszpunar/slow-spot
**Platform**: React Native + Expo
**Update Channel**: preview (automatic updates)
**Build Type**: Expo Go (no native build needed)

---

## FAQ

**Q: Do I need an Expo account?**
A: No! Just install Expo Go and open the link.

**Q: Will I get updates automatically?**
A: Yes! OTA updates are automatic. Just reopen the app.

**Q: Can I test on both iOS and Android?**
A: Yes! Same link works for both platforms.

**Q: Is this the final app?**
A: No, this is a preview/testing version. Production version will be on App Store/Google Play.

**Q: Do I need Apple Developer account or Google Play developer account?**
A: No! Expo Go handles everything for testing.

---

**Happy Testing! 🚀**
