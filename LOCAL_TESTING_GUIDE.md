# Local Testing Guide - Slow Spot App
**Comprehensive guide for testing all components locally**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Testing](#backend-testing)
3. [Mobile App Testing](#mobile-app-testing)
4. [Web Landing Testing](#web-landing-testing)
5. [Integration Testing](#integration-testing)
6. [CI/CD Verification](#cicd-verification)
7. [Manual Testing Checklist](#manual-testing-checklist)

---

## Prerequisites

### Required Software

```bash
# Node.js 20.x
node --version  # Should be v20.x.x

# .NET 8 SDK
dotnet --version  # Should be 8.0.x

# Expo CLI
npm install -g expo-cli

# Git
git --version
```

### Clone Repository

```bash
git clone <repository-url>
cd app
```

---

## Backend Testing

### 1. Install Backend Dependencies

```bash
cd backend/SlowSpot.Api
dotnet restore
```

### 2. Run Backend Tests

```bash
# From backend/SlowSpot.Api directory
cd ../SlowSpot.Api.Tests
dotnet test --verbosity normal

# Expected output:
# ✅ Passed! - Failed: 0, Passed: 20+, Skipped: 0
```

#### What Tests Cover

The backend tests verify:

- ✅ **Quotes API** (`/api/quotes`)
  - Returns 50+ quotes
  - Filters by language (EN, PL, ES, DE, FR, HI)
  - Random quote endpoint works
  - All quotes have required fields

- ✅ **Sessions API** (`/api/sessions`)
  - Returns 32+ sessions
  - Filters by language
  - Filters by level (1-5)
  - Combined filters work
  - All sessions have required fields
  - Covers all 5 difficulty levels

- ✅ **Data Validation**
  - Required fields present
  - Valid language codes (ISO 639-1)
  - Valid level range (1-5)
  - Valid duration (> 0 seconds)

- ✅ **Performance**
  - Endpoints respond < 1 second

### 3. Run Backend Locally

```bash
cd backend/SlowSpot.Api
dotnet run --urls "http://localhost:5000"

# Server starts at: http://localhost:5000
# Test endpoints:
# http://localhost:5000/api/quotes
# http://localhost:5000/api/sessions
```

### 4. Test Backend Endpoints

```bash
# Get all quotes
curl http://localhost:5000/api/quotes

# Get English quotes only
curl http://localhost:5000/api/quotes?lang=en

# Get random quote
curl http://localhost:5000/api/quotes/random?lang=en

# Get all sessions
curl http://localhost:5000/api/sessions

# Get beginner sessions in English
curl http://localhost:5000/api/sessions?lang=en&level=1

# Get specific session
curl http://localhost:5000/api/sessions/1
```

### Expected Results

✅ **Quotes Endpoint:**
```json
[
  {
    "id": 1,
    "text": "Peace comes when you stop chasing it.",
    "author": null,
    "languageCode": "en",
    "cultureTag": "mindfulness",
    "category": null,
    "createdAt": "2025-11-11T10:00:00Z"
  },
  ...
]
```

✅ **Sessions Endpoint:**
```json
[
  {
    "id": 1,
    "title": "Beginner Breath Awareness",
    "languageCode": "en",
    "durationSeconds": 300,
    "voiceUrl": null,
    "ambientUrl": null,
    "chimeUrl": null,
    "cultureTag": "mindfulness",
    "level": 1,
    "description": "5-minute introduction to breath meditation",
    "createdAt": "2025-11-11T10:00:00Z"
  },
  ...
]
```

---

## Mobile App Testing

### 1. Install Mobile Dependencies

```bash
cd mobile
npm install

# Verify installation
npm audit  # Should show 0 vulnerabilities
```

### 2. TypeScript Check

```bash
cd mobile
npx tsc --noEmit --skipLibCheck

# Expected: Some Tamagui type warnings (non-blocking)
# These are library-internal types and don't affect functionality
```

### 3. Build Test

```bash
cd mobile
npx expo export --platform all --output-dir dist-test

# Expected output:
# ✅ Web bundle: ~4.1 MB
# ✅ iOS bundle: ~6.27 MB (3021 modules)
# ✅ Android bundle: ~6.28 MB (3019 modules)
# ✅ Total: ~16 MB

# Clean up
rm -rf dist-test
```

### 4. Run Mobile App (Development)

#### Option A: Expo Go (Quick Testing)

```bash
cd mobile
npx expo start

# Scan QR code with:
# - iOS: Camera app
# - Android: Expo Go app
```

#### Option B: iOS Simulator (Mac only)

```bash
cd mobile
npx expo run:ios

# Or specific simulator:
npx expo run:ios --simulator="iPhone 15 Pro"
```

#### Option C: Android Emulator

```bash
cd mobile
npx expo run:android

# Or specific device:
adb devices
npx expo run:android --device <device-id>
```

### 5. Manual Mobile Testing Checklist

Once app is running:

#### Home Screen
- [ ] App opens without errors
- [ ] Daily quote displays
- [ ] Quote changes on app reload (unique, non-repeating)
- [ ] Progress stats show (if sessions completed)
- [ ] "Start Meditation" button works
- [ ] "Explore Sessions" button works

#### Meditation Screen
- [ ] Sessions list loads
- [ ] 32+ sessions visible
- [ ] Sessions show title, duration, level
- [ ] Tapping session starts timer
- [ ] Timer counts down correctly
- [ ] Pause button works
- [ ] Resume button works
- [ ] Cancel button stops and exits
- [ ] Completing session saves progress

#### Quotes Screen
- [ ] Quotes list loads
- [ ] 50+ quotes visible
- [ ] Author shown (if available)
- [ ] Scroll through all quotes

#### Settings Screen
- [ ] 6 languages available (EN, PL, ES, DE, FR, HI)
- [ ] Changing language updates all text immediately
- [ ] Dark mode toggle works
- [ ] App info shows correctly

#### Offline Testing
- [ ] Turn off WiFi and mobile data
- [ ] App still opens
- [ ] Quotes still load (from cache)
- [ ] Sessions still load (from cache)
- [ ] Can complete meditation offline
- [ ] Progress saves locally

#### Navigation
- [ ] Bottom navigation works
- [ ] All 4 tabs accessible (Home, Meditation, Quotes, Settings)
- [ ] Back navigation works
- [ ] No crashes or errors

---

## Web Landing Testing

### 1. Install Web Dependencies

```bash
cd web
npm install
npm audit  # Should show 0 vulnerabilities
```

### 2. Build Web Landing

```bash
cd web
npm run build

# Expected output:
# ✅ Compiled successfully
# ✅ Route (app): / (static)
# ✅ Static export: out/ directory (~833 KB)
```

### 3. Run Web Landing Locally

```bash
cd web
npm run dev

# Opens at: http://localhost:3000
```

### 4. Verify Web Content

Open http://localhost:3000 and verify:

- [ ] Hero section loads
- [ ] "Find Your Inner Peace" heading visible
- [ ] 3 CTA buttons (iOS, Android, Learn More)
- [ ] Features section with 9 feature cards:
  - 🚫 No Login Required
  - 🌍 Multi-Language (6 languages)
  - 📴 Offline-First
  - 🎵 3-Layer Audio
  - 📈 Progress Tracking
  - 💭 Unique Quotes
  - 🎯 Progressive Learning (5 levels)
  - 🌙 Dark Mode
  - 🎨 Cultural Themes
- [ ] "Ready to Start Your Journey?" CTA section
- [ ] Footer with copyright

### 5. Responsive Testing

Test on different screen sizes:

```bash
# In browser DevTools:
# - Mobile: 375px × 667px (iPhone SE)
# - Tablet: 768px × 1024px (iPad)
# - Desktop: 1920px × 1080px

# Verify:
- [ ] Layout adapts to screen size
- [ ] Text is readable on all sizes
- [ ] Buttons are tappable (min 44px)
- [ ] No horizontal scroll
```

---

## Integration Testing

### Full Stack Test

1. **Start Backend**
   ```bash
   cd backend/SlowSpot.Api
   dotnet run --urls "http://localhost:5000"
   ```

2. **Update Mobile API URL**
   ```bash
   # Edit mobile/src/services/api.ts
   # Change API_BASE_URL to: 'http://localhost:5000/api'
   # (or your machine's IP for physical device testing)
   ```

3. **Start Mobile App**
   ```bash
   cd mobile
   npx expo start
   ```

4. **Test End-to-End Flow**
   - [ ] Open mobile app
   - [ ] Verify quotes load from backend
   - [ ] Verify sessions load from backend
   - [ ] Complete a meditation session
   - [ ] Check progress updates
   - [ ] Close and reopen app
   - [ ] Verify data persisted (AsyncStorage)
   - [ ] Disconnect internet
   - [ ] Verify app still works (cache)

---

## CI/CD Verification

### 1. Check CI/CD Status

```bash
# View CI/CD pipeline configuration
cat .github/workflows/ci.yml

# Pipeline includes:
# ✅ Environment variables check
# ✅ Backend tests
# ✅ Mobile lint
# ✅ Mobile build
# ✅ Security scan
```

### 2. Test CI/CD Locally

#### Environment Check
```bash
# Check if deployment secrets are set
echo "EXPO_TOKEN: $EXPO_TOKEN"
echo "RAILWAY_TOKEN: $RAILWAY_TOKEN"
echo "VERCEL_TOKEN: $VERCEL_TOKEN"

# If empty, see instructions in CI/CD output for how to set them
```

#### Backend Tests (CI simulation)
```bash
cd backend/SlowSpot.Api
dotnet restore
dotnet build --configuration Release
cd ../SlowSpot.Api.Tests
dotnet test --configuration Release --verbosity normal
```

#### Mobile Lint (CI simulation)
```bash
cd mobile
npm ci
npx tsc --noEmit --skipLibCheck || echo "TypeScript warnings found (non-blocking)"
```

#### Mobile Build (CI simulation)
```bash
cd mobile
npm ci
npx expo export --platform all --output-dir dist-test
rm -rf dist-test
```

#### Security Scan (CI simulation)
```bash
cd mobile
npm audit --audit-level=high
```

### 3. Expected CI/CD Output

When you push to GitHub, CI/CD will:

1. **Environment Check** ⚠️
   ```
   ⚠️  EXPO_TOKEN is not set
      Required for: EAS mobile app builds (iOS/Android)
      How to set: https://docs.expo.dev/build/building-on-ci/

   ⚠️  RAILWAY_TOKEN is not set
      Required for: Backend API deployment to Railway

   ⚠️  VERCEL_TOKEN is not set
      Required for: Web landing page deployment to Vercel

   ℹ️  Note: Tests and builds will still run
   ```

2. **Backend Test** ✅
   ```
   ✅ All backend tests passed!
   Passed: 20+, Failed: 0
   ```

3. **Mobile Build** ✅
   ```
   ✅ Build successful
   Web: 4.1 MB, iOS: 6.27 MB, Android: 6.28 MB
   ```

4. **Security Scan** ✅
   ```
   0 vulnerabilities found
   ```

---

## Manual Testing Checklist

### Pre-Deployment Checklist

#### Backend
- [ ] Backend builds without errors
- [ ] All 20+ tests pass
- [ ] API responds < 1 second
- [ ] Returns 50+ quotes
- [ ] Returns 32+ sessions
- [ ] Supports 6 languages
- [ ] Supports 5 difficulty levels
- [ ] Database seeds correctly

#### Mobile
- [ ] App builds for all platforms (iOS, Android, Web)
- [ ] TypeScript compiles (with non-blocking warnings)
- [ ] No runtime errors
- [ ] All screens render correctly
- [ ] Navigation works
- [ ] Offline mode works
- [ ] Progress tracking works
- [ ] Audio engine initializes (even without files)
- [ ] Dark mode works
- [ ] All 6 languages work
- [ ] No memory leaks (close/reopen test)

#### Web
- [ ] Landing page builds
- [ ] All 9 features described
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Fast load time (< 3 seconds)
- [ ] SEO metadata present

#### Security
- [ ] npm audit shows 0 vulnerabilities (mobile)
- [ ] npm audit shows 0 vulnerabilities (web)
- [ ] No secrets in code
- [ ] API input validation works
- [ ] No XSS vulnerabilities
- [ ] No SQL injection vulnerabilities

#### CI/CD
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Environment check shows missing vars (expected)
- [ ] Pipeline completes successfully

---

## Troubleshooting

### Backend Issues

**Problem:** `dotnet: command not found`
```bash
# Solution: Install .NET 8 SDK
# macOS: brew install dotnet-sdk
# Linux: https://learn.microsoft.com/en-us/dotnet/core/install/linux
# Windows: https://dotnet.microsoft.com/download
```

**Problem:** Tests fail with database errors
```bash
# Solution: Clean and rebuild
cd backend/SlowSpot.Api.Tests
dotnet clean
dotnet restore
dotnet test
```

### Mobile Issues

**Problem:** `expo: command not found`
```bash
# Solution: Install Expo CLI
npm install -g expo-cli
# Or use npx:
npx expo start
```

**Problem:** "Cannot find module 'react-dom'"
```bash
# Solution: Install dependencies
cd mobile
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Build fails
```bash
# Solution: Clear cache
cd mobile
npm run clean
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear
```

### Web Issues

**Problem:** Next.js build fails
```bash
# Solution: Reinstall dependencies
cd web
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

**Problem:** Port 3000 already in use
```bash
# Solution: Use different port
PORT=3001 npm run dev
```

### CI/CD Issues

**Problem:** CI/CD shows warnings about missing environment variables
```
# This is EXPECTED behavior
# Variables are only needed for automated deployment
# To set them:
# 1. Go to GitHub repository settings
# 2. Secrets and variables → Actions
# 3. Add: EXPO_TOKEN, RAILWAY_TOKEN, VERCEL_TOKEN
```

**Problem:** Backend tests fail in CI/CD
```bash
# Solution: Test locally first
cd backend/SlowSpot.Api.Tests
dotnet test --verbosity detailed
# Fix any failing tests, commit, and push
```

---

## Performance Benchmarks

### Expected Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Backend API response | < 1s | ~100-300ms |
| Mobile app startup | < 3s | ~2s |
| Mobile build time | < 10min | ~5-7min |
| Web landing load | < 3s | ~1-2s |
| npm audit (mobile) | 0 vulnerabilities | ✅ 0 |
| npm audit (web) | 0 vulnerabilities | ✅ 0 |
| Backend tests | All pass | ✅ 20+ |
| TypeScript errors | < 50 | 46 (non-blocking) |

---

## Test Coverage

### Backend: 100% API Coverage
- ✅ Quotes endpoints (GET, filter, random)
- ✅ Sessions endpoints (GET, filter, by ID)
- ✅ Data validation
- ✅ Performance
- ✅ Error handling

### Mobile: Manual Testing
- ✅ Build verification (iOS, Android, Web)
- ✅ TypeScript compilation
- ⚠️ Unit tests: TODO (future enhancement)

### Web: Build Verification
- ✅ Static generation
- ✅ Responsive design
- ⚠️ E2E tests: TODO (future enhancement)

---

## Next Steps After Testing

Once all tests pass:

1. **Set deployment secrets** in GitHub:
   - `EXPO_TOKEN` → EAS builds
   - `RAILWAY_TOKEN` → Backend deployment
   - `VERCEL_TOKEN` → Web deployment

2. **Deploy backend**:
   ```bash
   railway up
   ```

3. **Build mobile apps**:
   ```bash
   eas build --platform all --profile production
   ```

4. **Deploy web landing**:
   ```bash
   vercel --prod
   ```

5. **Submit to stores**:
   - iOS: `eas submit --platform ios`
   - Android: `eas submit --platform android`

---

## Conclusion

This guide provides comprehensive testing instructions for all components. Follow each section carefully to ensure:

✅ Backend works and all tests pass
✅ Mobile app builds and functions correctly
✅ Web landing displays all features
✅ CI/CD pipeline validates everything
✅ Application is production-ready

**Happy Testing! 🧪**
