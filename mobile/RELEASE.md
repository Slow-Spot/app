# Release Workflow

## Quick Commands

### iOS Release (App Store)
```bash
npm run release:ios              # Build + auto-submit to App Store Connect
npm run store:ios:screenshots    # Upload screenshots
npm run store:ios:review         # Submit for Apple review
```

### Android Release (Google Play)
```bash
npm run release:android          # Build + auto-submit to Google Play
npm run store:android:metadata   # Upload metadata & screenshots
```

### Both Platforms
```bash
npm run release:all              # Build both + auto-submit
```

---

## Full Release Flow

### 1. Bump Version
```bash
npm run version:patch   # 1.12.2 → 1.12.3
npm run version:minor   # 1.12.2 → 1.13.0
npm run version:major   # 1.12.2 → 2.0.0
```

### 2. Build & Submit
```bash
# iOS only
npm run release:ios

# Android only
npm run release:android

# Both platforms
npm run release:all
```

### 3. Upload Store Assets (if needed)
```bash
# iOS
npm run store:ios:screenshots
npm run store:ios:metadata

# Android
npm run store:android:metadata
npm run store:android:screenshots
```

### 4. Submit for Review
```bash
# iOS - manual review submission
npm run store:ios:review

# Android - auto-submitted with release:android
```

---

## All Available Scripts

| Script | Description |
|--------|-------------|
| `build:ios` | Build iOS without submit |
| `build:android` | Build Android without submit |
| `build:all` | Build both platforms |
| `release:ios` | Build iOS + auto-submit to App Store Connect |
| `release:android` | Build Android + auto-submit to Google Play |
| `release:all` | Build & submit both platforms |
| `submit:ios` | Submit latest iOS build |
| `submit:android` | Submit latest Android build |
| `store:ios:screenshots` | Upload iOS screenshots |
| `store:ios:metadata` | Upload iOS metadata |
| `store:ios:review` | Submit iOS for Apple review |
| `store:android:metadata` | Upload Android metadata |
| `store:android:screenshots` | Upload Android screenshots |
| `version:patch` | Bump patch version |
| `version:minor` | Bump minor version |
| `version:major` | Bump major version |

---

## Required Files (not in git)

| File | Location | Purpose |
|------|----------|---------|
| `AuthKey_W3TGVKY5Z6.p8` | `mobile/` | App Store Connect API key |
| `android-service-account.json` | `mobile/` | Google Play API key |

### Setup Keys
```bash
# iOS - copy from secure location
cp ~/.appstoreconnect/private_keys/AuthKey_W3TGVKY5Z6.p8 ./

# Android - copy from configurations
cp ../configurations/iteon-pl-*.json ./android-service-account.json
```

---

## EAS Configuration

- **iOS**: Auto-increment build number
- **Android**: Auto-increment version code
- **Both**: Production channel, store distribution

See `eas.json` for full configuration.
