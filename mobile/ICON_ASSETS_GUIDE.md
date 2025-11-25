# App Icons & Store Assets Guide

Complete guide for generating and managing all required icons, splash screens, and store assets for Slow Spot.

## Table of Contents

- [Current Assets Status](#current-assets-status)
- [Base Icons (Generated)](#base-icons-generated)
- [Icon Generation](#icon-generation)
- [How Expo Handles Icons](#how-expo-handles-icons)
- [App Store Requirements](#app-store-requirements)
- [Google Play Store Requirements](#google-play-store-requirements)
- [Screenshot Guidelines](#screenshot-guidelines)
- [Generating Store Graphics](#generating-store-graphics)
- [Testing Icons](#testing-icons)
- [Troubleshooting](#troubleshooting)

## Current Assets Status

### ✅ Base Icons (Completed)

All base icons have been generated and are ready for production:

| Asset | Size | Purpose | Status |
|-------|------|---------|--------|
| `icon.png` | 1024x1024 | iOS/Android app icon | ✅ Ready |
| `adaptive-icon.png` | 1024x1024 | Android adaptive icon | ✅ Ready |
| `splash-icon.png` | 1024x1024 | Splash screen | ✅ Ready |
| `favicon.png` | 48x48 | Web favicon | ✅ Ready |

### 🔄 Store Assets (To Be Created)

Additional assets required for app store submissions:

| Asset | Size | Purpose | Status |
|-------|------|---------|--------|
| Feature Graphic (Android) | 1024x500 | Play Store banner | ⏳ Needed |
| iOS Screenshots | Various | App Store listing | ⏳ Needed |
| Android Screenshots | Various | Play Store listing | ⏳ Needed |

## Base Icons (Generated)

### Design Elements

All icons feature:
- **Gradient Background**: Teal (#5E72E4) to purple (#8E54E9)
- **Lotus Flower**: Stylized white lotus in center (purity, mindfulness)
- **Zen Circle (Enso)**: Incomplete circle symbolizing enlightenment
- **Color Psychology**: Calming blues and purples for meditation/relaxation

### Icon Specifications

#### Main App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency (RGBA)
- **Purpose**: Universal app icon for both iOS and Android
- **Design**: Full lotus with zen circle, gradient background
- **Usage**: EAS Build automatically generates all required sizes from this master

#### Android Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency (RGBA)
- **Purpose**: Android adaptive icon (API 26+)
- **Design**: Identical to main icon (safe zone design)
- **Safe Zone**: Central 66% of icon (684x684) guaranteed visible
- **Usage**: System applies various shapes (circle, square, rounded square)

#### Splash Screen Icon (`splash-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency (RGBA)
- **Purpose**: Displayed during app launch
- **Design**: Simpler design - zen circle with smaller lotus
- **Background**: Defined in app.json (`backgroundColor: "#667eea"`)
- **Resize Mode**: `contain` (maintains aspect ratio)

#### Favicon (`favicon.png`)
- **Size**: 48x48 pixels
- **Format**: PNG with transparency (RGBA)
- **Purpose**: Web version of app (Expo web)
- **Design**: Simplified lotus for small size visibility

## Icon Generation

### Automatic Generation (Current Method)

A Python script (`generate_icons.py`) handles icon generation:

#### Prerequisites

```bash
# Install Pillow (Python Imaging Library)
pip install Pillow
```

#### Generate All Icons

```bash
cd assets
python3 generate_icons.py
```

This creates:
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `splash-icon.png` (1024x1024) - Splash screen
- `favicon.png` (48x48) - Web favicon

#### Script Features

- ✅ Radial gradient backgrounds
- ✅ Procedurally drawn lotus flower
- ✅ Enso (zen circle) with intentional gap
- ✅ Smooth anti-aliasing
- ✅ Optimized PNG compression
- ✅ Consistent color scheme

### Manual Icon Design (Alternative)

If you prefer designing icons manually:

#### Recommended Tools

1. **Figma** (Free, web-based)
   - Template: 1024x1024 artboard
   - Export as PNG @1x (no compression)

2. **Adobe Illustrator / Photoshop**
   - Canvas: 1024x1024px
   - Color Mode: RGB
   - Export: PNG-24 with transparency

3. **Sketch** (Mac only)
   - Artboard: 1024x1024
   - Export @1x PNG

#### Design Guidelines

- **Minimum size**: 1024x1024px for app icon
- **Format**: PNG with alpha channel (RGBA)
- **Color depth**: 24-bit color + 8-bit alpha
- **Safe zone**: Keep important elements in central 80% (Android cropping)
- **Test at small sizes**: Icon should be recognizable at 60x60px
- **Avoid text**: Small text becomes unreadable at icon sizes
- **High contrast**: Ensure icon stands out on various backgrounds

## How Expo Handles Icons

### iOS Icon Generation

From the 1024x1024 master icon (`icon.png`), Expo automatically generates:

| Size | Usage | Devices |
|------|-------|---------|
| 20x20 | Notification (2x) | iPhone, iPad |
| 29x29 | Settings (2x) | iPhone, iPad |
| 40x40 | Spotlight (2x) | iPhone, iPad |
| 60x60 | App Icon (2x) | iPhone |
| 76x76 | App Icon | iPad |
| 83.5x83.5 | App Icon | iPad Pro |
| 1024x1024 | App Store | Marketing |

Expo generates @2x and @3x variants automatically.

### Android Icon Generation

From the 1024x1024 adaptive icon (`adaptive-icon.png`), Expo generates:

| Density | Size | Usage |
|---------|------|-------|
| mdpi | 48x48 | Low density |
| hdpi | 72x72 | Medium density |
| xhdpi | 96x96 | High density |
| xxhdpi | 144x144 | Extra-high density |
| xxxhdpi | 192x192 | Extra-extra-high density |

Additional formats:
- **Foreground**: Adaptive icon foreground layer
- **Background**: Uses `backgroundColor` from app.json
- **Legacy**: Standard icon for Android <8.0 (API 26)

### Splash Screen Generation

Expo generates splash screens for all device sizes and orientations from:
- `splash-icon.png` (image)
- `backgroundColor` from app.json
- `resizeMode` setting

Generated variants:
- Various screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Various screen sizes (small, normal, large, xlarge)
- Portrait and landscape orientations
- iOS launch screens (storyboard)
- Android splash screens (9-patch)

## App Store Requirements

### iOS App Store (App Store Connect)

#### App Icon
- ✅ **Size**: 1024x1024 pixels (**Already have: `icon.png`**)
- ✅ **Format**: PNG or JPEG (no transparency)
- ✅ **Color Space**: RGB (no alpha channel for store listing)
- ❌ **Restrictions**: No rounded corners (Apple adds them)

**Action Required**: None - `icon.png` meets all requirements

#### Screenshots (Required for Submission)

Must provide screenshots for **at least 1 device size**, recommended to provide all:

##### Required Sizes

| Device | Size (pixels) | Orientation |
|--------|---------------|-------------|
| 6.9" Display | 1320x2868 | Portrait |
| 6.7" Display | 1290x2796 | Portrait |
| 6.5" Display | 1284x2778 | Portrait |
| 5.5" Display | 1242x2208 | Portrait |

##### Optional but Recommended

| Device | Size (pixels) | Orientation |
|--------|---------------|-------------|
| 12.9" iPad Pro | 2048x2732 | Portrait |
| 13" iPad Pro | 2064x2752 | Portrait |

##### Screenshot Requirements

- **Format**: PNG or JPEG (no transparency)
- **Count**: 1-10 screenshots per device size
- **Recommended**: 4-5 screenshots highlighting key features
- **Order**: Most important screens first
- **Text**: Can include text overlays describing features

##### How to Capture Screenshots

**Option 1: iOS Simulator (Recommended)**

```bash
# Start simulator with specific device
npx expo start --ios

# In simulator:
# 1. Navigate to desired screen
# 2. Press Cmd+S to save screenshot
# 3. Screenshots saved to Desktop

# Recommended devices:
# - iPhone 16 Pro Max (6.9" - 1320x2868)
# - iPhone 15 Pro Max (6.7" - 1290x2796)
# - iPhone 14 Pro Max (6.5" - 1284x2778)
```

**Option 2: Physical Device**

```bash
# On iOS device:
# 1. Press Side Button + Volume Up
# 2. AirDrop to Mac or access via Photos app
# 3. Verify dimensions match requirements
```

**Option 3: Fastlane Snapshot (Automated)**

```bash
# Install fastlane
gem install fastlane

# Generate screenshots for all device sizes
fastlane snapshot
```

### App Preview Video (Optional)

- **Duration**: 15-30 seconds
- **Format**: MP4, MOV, or M4V
- **Resolution**: Same as screenshot sizes
- **File Size**: Max 500 MB
- **Content**: Must show actual app functionality

## Google Play Store Requirements

### Android App Icon

- ✅ **Size**: 512x512 pixels (EAS generates from 1024x1024)
- ✅ **Format**: PNG with transparency
- ✅ **Shape**: Full square (system applies mask)
- **Status**: ✅ Ready (EAS automatically generates)

### Feature Graphic (Required)

- ⏳ **Size**: 1024x500 pixels
- **Format**: PNG or JPEG
- **Purpose**: Banner image at top of store listing
- **Content**: App branding, key features, no screenshots
- **Status**: ⏳ **NEEDS TO BE CREATED**

### Screenshots (Required for Submission)

#### Phone Screenshots (Required)

| Type | Size Range | Count |
|------|------------|-------|
| Phone | 320px - 3840px (width or height) | 2-8 required |

**Recommended**: 1080x1920 pixels (Full HD portrait)

#### Tablet Screenshots (Optional)

| Type | Size Range | Count |
|------|------------|-------|
| 7" Tablet | 1200x1920 | 0-8 optional |
| 10" Tablet | 1600x2560 | 0-8 optional |

##### Screenshot Requirements

- **Format**: PNG or JPEG (no transparency)
- **Count**: Minimum 2, maximum 8 per type
- **Aspect Ratio**: 16:9 or 9:16 recommended
- **Recommended**: 4-5 screenshots showing main features

##### How to Capture Screenshots

**Option 1: Android Emulator (Recommended)**

```bash
# Start emulator with specific device
npx expo start --android

# In emulator:
# 1. Click camera icon in emulator toolbar
# 2. Or press Cmd+S (Mac) / Ctrl+S (Windows)
# 3. Screenshots saved to Desktop

# Recommended devices:
# - Pixel 7 Pro (1080x2400)
# - Pixel 6 (1080x2400)
```

**Option 2: Physical Android Device**

```bash
# On Android device:
# 1. Press Power Button + Volume Down
# 2. Access screenshots via Gallery app
# 3. Transfer to computer via USB or cloud
```

**Option 3: Automated with Fastlane Screengrab**

```bash
# Install fastlane
gem install fastlane

# Generate screenshots
fastlane screengrab
```

## Screenshot Guidelines

### Content Strategy

Showcase the 5 most important app features:

1. **Home Screen & Daily Quote**
   - Show today's inspirational quote
   - Display meditation statistics
   - Highlight "Quick Start" button

2. **Meditation Session**
   - Active meditation timer
   - Show duration and session type
   - Display ambient sound selection

3. **Progress & Statistics**
   - Weekly meditation chart
   - Total sessions and minutes
   - Streak information

4. **Achievements**
   - Display unlocked achievements
   - Show level progression
   - Highlight gamification elements

5. **Custom Session Builder**
   - Session customization interface
   - Duration selection
   - Ambient sound options
   - Instruction preferences

### Design Best Practices

#### Text Overlays (Recommended)

Add text to screenshots to explain features:

```
Example:
┌─────────────────────────┐
│                         │
│   [Screenshot]          │
│                         │
│   "Track Your Progress" │
│   Detailed statistics   │
│   and achievements      │
└─────────────────────────┘
```

**Tools for adding text**:
- Figma (free)
- Canva (free)
- Adobe Photoshop
- Sketch

#### Consistent Styling

- Use brand colors (purple/teal gradient)
- Consistent font (Poppins, same as app)
- Same text size across all screenshots
- Matching background style

#### Show Localized Content

- Create screenshots in each supported language:
  - English (required)
  - Polish, Spanish, German, French, Hindi (optional)
- Upload language-specific screenshots to respective store listings

## Generating Store Graphics

### Feature Graphic for Google Play (1024x500)

#### Manual Creation

Use Figma/Photoshop to create a banner:

**Design Elements**:
- App icon on left
- App name: "Slow Spot"
- Tagline: "Meditation & Mindfulness"
- Key features (icons): Guided sessions, Progress tracking, Achievements
- Gradient background matching app theme

**Template Structure**:
```
┌────────────────────────────────────────────┐
│                                            │
│  [Icon]  Slow Spot                        │
│          Meditation & Mindfulness         │
│                                            │
│  🧘 Guided    📊 Progress    🏆 Achieve   │
└────────────────────────────────────────────┘
     1024 x 500 pixels
```

#### Automated Generation (Python Script)

Create `assets/generate_store_graphics.py`:

```python
#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

def create_feature_graphic():
    """Create 1024x500 feature graphic for Google Play"""
    # Create image with gradient
    img = Image.new('RGB', (1024, 500), '#667eea')
    draw = ImageDraw.Draw(img)

    # Add app name and tagline (requires font)
    # font = ImageFont.truetype('Poppins-Bold.ttf', 60)
    # draw.text((200, 150), "Slow Spot", fill='white', font=font)

    # Load and paste app icon
    icon = Image.open('icon.png').resize((300, 300))
    img.paste(icon, (50, 100), icon)

    img.save('feature-graphic.png', 'PNG')
    print("Created feature-graphic.png")

if __name__ == '__main__':
    create_feature_graphic()
```

### Promo Graphics (Optional)

#### Google Play Promo Video Thumbnail (1024x500)
- Same size as feature graphic
- Eye-catching thumbnail for promo video
- Should represent video content

#### Apple Marketing Materials (Optional)
- Various sizes for Apple marketing programs
- Created after app is live

## Testing Icons

### Visual Testing

#### Test on Multiple Backgrounds

Icons should look good on:
- Light backgrounds (white, light gray)
- Dark backgrounds (black, dark gray)
- Colored backgrounds (home screen wallpapers)
- Blurred backgrounds (iOS widgets)

#### Test at Multiple Sizes

Verify icon clarity at:
- Full size (1024x1024)
- Large size (180x180) - Device home screen
- Medium size (80x80) - Settings
- Small size (40x40) - Notifications

### Device Testing

#### iOS Testing

```bash
# Build for simulator
eas build --profile development --platform ios

# Install on simulator
# Icon appears on home screen
```

**Check**:
- [ ] Icon renders clearly on home screen
- [ ] Icon has proper rounded corners (iOS applies)
- [ ] Icon visible in Settings app
- [ ] Icon appears in notifications
- [ ] Icon scales correctly for iPad

#### Android Testing

```bash
# Build for emulator/device
eas build --profile preview --platform android

# Install APK
# Icon appears in launcher
```

**Check**:
- [ ] Adaptive icon renders with system shape
- [ ] Icon looks good on different launchers (Pixel, Samsung, etc.)
- [ ] Icon visible in settings
- [ ] Icon appears in notifications
- [ ] Foreground/background layers separate correctly

### Automated Testing

#### Icon Validation Tool

```bash
# Install app-icon-checker
npm install -g app-icon-checker

# Validate icon requirements
app-icon-checker assets/icon.png
```

## Troubleshooting

### Common Issues

#### Icon Appears Blurry

**Cause**: Icon too small or compressed
**Solution**:
- Ensure base icon is 1024x1024
- Use PNG format (not JPEG)
- Disable compression

#### Adaptive Icon Gets Cropped (Android)

**Cause**: Important elements outside safe zone
**Solution**:
- Keep critical elements in central 66% (684x684)
- Test with different device shapes
- Use Android Studio's Adaptive Icon preview

#### Splash Screen Looks Wrong

**Cause**: Incorrect resize mode or background color
**Solution**:
- Check `app.json` splash configuration
- Test `resizeMode`: "contain" vs "cover"
- Adjust `backgroundColor` to match icon

#### Icon Not Updating After Changes

**Cause**: Build cache or device cache
**Solution**:
```bash
# Clear EAS build cache
eas build --profile preview --platform all --clear-cache

# iOS: Uninstall app and reinstall
# Android: Clear app data or reinstall
```

#### Wrong Icon Shows in App Store

**Cause**: Incorrect icon uploaded to store
**Solution**:
- Re-upload correct 1024x1024 icon to App Store Connect
- Wait 24-48 hours for CDN refresh
- Check icon in different regions

### Validation Tools

#### iOS Icon Validation

```bash
# Check iOS icon requirements
# Use Apple's Asset Catalog Validator in Xcode
```

#### Android Icon Validation

```bash
# Check adaptive icon safe zones
# Use Android Studio's Image Asset Studio
```

## Quick Reference

### Icon Sizes Summary

| Platform | Asset | Size | Status |
|----------|-------|------|--------|
| iOS/Android | App Icon | 1024x1024 | ✅ Ready |
| Android | Adaptive Icon | 1024x1024 | ✅ Ready |
| Both | Splash Icon | 1024x1024 | ✅ Ready |
| Web | Favicon | 48x48 | ✅ Ready |
| Android | Feature Graphic | 1024x500 | ⏳ Needed |
| iOS | Screenshots | Various | ⏳ Needed |
| Android | Screenshots | 1080x1920 | ⏳ Needed |

### Commands Reference

```bash
# Generate all base icons
cd assets && python3 generate_icons.py

# Test icons in iOS simulator
npx expo start --ios

# Test icons in Android emulator
npx expo start --android

# Build with icons
eas build --profile preview --platform all

# Clear build cache
eas build --clear-cache
```

### Important Links

- **iOS Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Android Adaptive Icon Guide**: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- **Expo Icon Configuration**: https://docs.expo.dev/develop/user-interface/app-icons/
- **App Store Screenshot Sizes**: https://help.apple.com/app-store-connect/#/devd274dd925
- **Play Store Graphic Assets**: https://support.google.com/googleplay/android-developer/answer/9866151

---

## Next Steps

1. ✅ **Base Icons**: Already generated and ready
2. ⏳ **Feature Graphic**: Create 1024x500 banner for Google Play
3. ⏳ **Screenshots**: Capture 4-5 screenshots for each platform
4. ⏳ **Localization**: Create screenshots in all supported languages (optional)
5. ✅ **Testing**: Test icons on physical devices before submission

**Priority**: Screenshots are **required** for app store submission. Create these before attempting to publish.

---

**Project**: Slow Spot
**Design Theme**: Meditation & Mindfulness (Purple/Teal gradient, Lotus, Zen circle)
**Base Icons**: ✅ Ready for production
**Store Assets**: ⏳ Screenshots required before submission
