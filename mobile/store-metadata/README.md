# Store Metadata for Slow Spot

This directory contains metadata and assets for Apple App Store and Google Play Store submissions.

## Directory Structure

```
store-metadata/
├── ios/
│   ├── screenshots/          # iPhone and iPad screenshots
│   │   ├── iphone-6.5/       # iPhone 14 Pro Max, 15 Pro Max (6.5")
│   │   ├── iphone-5.5/       # iPhone 8 Plus (5.5")
│   │   └── ipad-12.9/        # iPad Pro 12.9"
│   └── marketing/            # App icon, promotional images
├── android/
│   ├── screenshots/          # Phone and tablet screenshots
│   └── marketing/            # Feature graphics, promo video
├── descriptions/             # App descriptions in all languages
└── README.md
```

## Required Screenshots

### iOS (App Store Connect)
- **iPhone 6.5"** (1290 x 2796 px): 3-10 screenshots
- **iPhone 5.5"** (1242 x 2208 px): 3-10 screenshots (optional but recommended)
- **iPad Pro 12.9"** (2048 x 2732 px): 3-10 screenshots (if supporting iPad)

### Android (Google Play Console)
- **Phone**: 2-8 screenshots (16:9 or 9:16, min 320px, max 3840px)
- **7" Tablet**: Optional
- **10" Tablet**: Optional

## Marketing Assets

### iOS
- App Icon: 1024 x 1024 px (no alpha)
- App Preview Video: Optional (15-30 seconds)

### Android
- Feature Graphic: 1024 x 500 px (required)
- Promo Video: YouTube URL (optional)
- TV Banner: 1280 x 720 px (if supporting TV)

## App Store Descriptions

Located in `descriptions/` folder with files for each language:

| File | Language | Status |
|------|----------|--------|
| `en.json` | English | Required |
| `pl.json` | Polish | Required |
| `de.json` | German | Required |
| `es.json` | Spanish | Required |
| `fr.json` | French | Required |
| `hi.json` | Hindi | Required |
| `zh.json` | Chinese (Simplified) | Required |

## Content Guidelines

### App Name
- iOS: Max 30 characters
- Android: Max 30 characters

### Subtitle (iOS) / Short Description (Android)
- iOS: Max 30 characters
- Android: Max 80 characters

### Description
- iOS: Max 4000 characters
- Android: Max 4000 characters

### Keywords (iOS only)
- Max 100 characters total
- Comma-separated

### What's New (Release Notes)
- iOS: Max 4000 characters
- Android: Max 500 characters

## Age Rating

### iOS
- 4+ (No objectionable content)
- Configure in App Store Connect

### Android
- Content Rating: Everyone
- Complete IARC questionnaire in Play Console

## Privacy & Data Safety

### iOS (App Privacy)
- Data Not Collected ✓
- No tracking ✓

### Android (Data Safety)
- No data shared with third parties ✓
- No data collected ✓
- Data encrypted in transit: N/A (no data transmitted)
- Users can request data deletion: Uninstall app

## Support Information

- **Support URL**: https://slowspot.me/support
- **Privacy Policy**: https://slowspot.me/privacy
- **Terms of Service**: https://slowspot.me/terms
- **Marketing URL**: https://slowspot.me
- **Support Email**: contact@slowspot.app

## Checklist Before Submission

### iOS
- [ ] Screenshots for all required device sizes
- [ ] App Preview video (optional)
- [ ] App description in all languages
- [ ] Keywords for all languages
- [ ] Age rating questionnaire completed
- [ ] App Privacy completed
- [ ] Contact information updated

### Android
- [ ] Screenshots for phone (required)
- [ ] Feature graphic (required)
- [ ] App description in all languages
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Contact email verified
