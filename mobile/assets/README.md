# Assets Directory

This directory contains all app icons, splash screens, and store graphics for Slow Spot.

## Generated Assets

### App Icons (✅ Ready for Production)

| File | Size | Purpose | Status |
|------|------|---------|--------|
| `icon.png` | 1024x1024 | iOS/Android app icon | ✅ |
| `adaptive-icon.png` | 1024x1024 | Android adaptive icon | ✅ |
| `splash-icon.png` | 1024x1024 | Splash screen | ✅ |
| `favicon.png` | 48x48 | Web favicon | ✅ |

### Store Graphics (✅ Ready for Upload)

| File | Size | Purpose | Status |
|------|------|---------|--------|
| `feature-graphic.png` | 1024x500 | Google Play feature graphic | ✅ |

## Design Theme

All icons feature:
- **Colors**: Purple (#667eea) to Teal (#9654f2) gradient
- **Elements**: Lotus flower (mindfulness), Zen circle/Enso (enlightenment)
- **Style**: Clean, calming, modern

## Generation Scripts

### `generate_icons.py`
Generates all base app icons:
```bash
python3 generate_icons.py
```

Creates:
- Main app icon (1024x1024)
- Adaptive icon for Android (1024x1024)
- Splash screen icon (1024x1024)
- Web favicon (48x48)

### `generate_feature_graphic.py`
Generates Google Play store banner:
```bash
python3 generate_feature_graphic.py
```

Creates:
- Feature graphic (1024x500) for Google Play Store listing

## How EAS Build Uses These Assets

### Automatic Icon Generation

From these base icons, **EAS Build automatically generates**:

**iOS** (16 sizes):
- All required app icon sizes (20pt-1024pt)
- @2x and @3x variants
- iPhone and iPad specific sizes
- App Store marketing icon

**Android** (5 densities):
- mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- Adaptive icon layers (foreground/background)
- Legacy icons for older Android versions

**Splash Screens**:
- All screen sizes and densities
- Portrait and landscape orientations
- iOS storyboard and Android 9-patch

### Configuration

Icons are configured in `app.json`:
```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png",
    "backgroundColor": "#667eea"
  },
  "ios": {
    "icon": "./assets/icon.png"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## App Store Requirements

### iOS App Store ✅
- App icon (1024x1024): **icon.png** ✅
- Screenshots: ⏳ Capture before submission

### Google Play Store ✅
- App icon (512x512): Auto-generated from icon.png ✅
- Feature graphic (1024x500): **feature-graphic.png** ✅
- Screenshots: ⏳ Capture before submission

## Sound Assets

The `sounds/` directory contains:
- Meditation bells (session start/end)
- Ambient sounds (rain, ocean, forest, etc.)
- Achievement unlock sounds

## Regenerating Assets

If you need to update the design:

1. **Modify design parameters** in `generate_icons.py`:
   - Colors (gradient)
   - Element sizes
   - Styles

2. **Regenerate all icons**:
   ```bash
   cd assets
   python3 generate_icons.py
   python3 generate_feature_graphic.py
   ```

3. **Test in app**:
   ```bash
   npm start
   # or
   eas build --profile development --platform all
   ```

4. **Verify on devices** before production build

## References

- Full documentation: `../ICON_ASSETS_GUIDE.md`
- Expo icon docs: https://docs.expo.dev/develop/user-interface/app-icons/
- iOS guidelines: https://developer.apple.com/design/human-interface-guidelines/app-icons
- Android guidelines: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive

---

**Last Updated**: November 2024
**Design**: Purple/Teal gradient with lotus and zen circle
**Status**: ✅ All production assets ready
