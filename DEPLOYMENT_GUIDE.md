# 🚀 Deployment Guide - Slow Spot App

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All TypeScript errors reviewed (48 minor Tamagui typing issues - non-blocking)
- [x] No security vulnerabilities (0 found)
- [x] All core features implemented
- [x] Progress tracking working
- [x] Quote deduplication working
- [x] Dark mode functional
- [x] 6 languages supported

### ✅ Testing
- [ ] Manual testing on iOS simulator
- [ ] Manual testing on Android emulator
- [ ] Offline mode verified
- [ ] Multi-language switching tested
- [ ] Progress tracking tested
- [ ] Audio playback tested (when audio files added)

---

## 🏗️ Infrastructure Setup

### 1. Backend (.NET 8 API)

**Option A: Railway (Recommended - $5/month)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend/SlowSpot.Api
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

**Option B: Azure App Service**
- More expensive but better .NET integration
- ~$13/month for B1 tier

**Environment Variables:**
```
DATABASE_URL=<railway-postgres-url>
ASPNETCORE_ENVIRONMENT=Production
```

---

### 2. Mobile App (Expo)

**Setup EAS Build:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd mobile
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

**App Store Requirements:**
- [ ] App Store Connect account ($99/year)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] App screenshots (6.7", 6.5", 5.5")
- [ ] App icon (1024x1024px)
- [ ] App description (all 6 languages)

**Google Play Requirements:**
- [ ] Google Play Console account ($25 one-time)
- [ ] Privacy Policy URL
- [ ] App screenshots
- [ ] Feature graphic (1024x500px)
- [ ] App description (all 6 languages)

---

### 3. Web Landing (Next.js) - FUTURE

**Vercel Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel --prod
```

**Cost:** Free tier (hobby plan)

---

## 🔧 CI/CD Setup

### GitHub Actions (Already Configured)

**Files created:**
- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/deploy.yml` - Deployment pipeline

**What CI does:**
1. ✅ Backend build & test (.NET 8)
2. ✅ Mobile TypeScript check
3. ✅ Security vulnerability scan
4. ✅ Lint checks

**What Deploy does:**
1. Deploy backend to Railway (main branch)
2. Build mobile apps (on version tags)
3. Deploy web to Vercel (main branch)

**Required Secrets:**
Add to GitHub Settings → Secrets:
- `RAILWAY_TOKEN` - Railway API token
- `EXPO_TOKEN` - Expo access token
- `VERCEL_TOKEN` - Vercel deployment token

---

## 📦 Pre-Production Steps

### 1. Add Real Content

**Quotes (minimum 100 per language):**
```sql
-- Add to backend/SlowSpot.Api/Data/AppDbContext.cs
INSERT INTO Quotes (Text, Author, LanguageCode, CultureTag) VALUES
  ('Your quote here', 'Author', 'en', 'mindfulness'),
  -- ... repeat 100 times per language
```

**Meditation Sessions (minimum 20):**
```sql
INSERT INTO MeditationSessions (Title, DurationSeconds, Level, LanguageCode) VALUES
  ('Beginner Breath Work', 300, 1, 'en'),
  -- ... add more sessions
```

### 2. Add Audio Files

**Upload to CDN (Cloudflare R2 recommended):**
1. Create R2 bucket
2. Upload audio files:
   - `voice_{session_id}_{lang}.mp3` - Voice guidance
   - `ambient_{type}.mp3` - Background sounds
   - `chime_{type}.mp3` - Bells/chimes
3. Update database URLs

**Audio Quality Standards:**
- Format: MP3, 128kbps
- Sample rate: 44.1kHz
- Max file size: 10MB per file

### 3. Configure Analytics

**PostHog (Recommended):**
```bash
npm install posthog-react-native
```

**Add to App.tsx:**
```typescript
import PostHog from 'posthog-react-native';

PostHog.setup('YOUR_API_KEY', {
  host: 'https://app.posthog.com',
});
```

**Track Events:**
- Session started
- Session completed
- Quote viewed
- Language changed
- Dark mode toggled

### 4. Add Monitoring

**Sentry:**
```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative
```

**Environment:**
- DSN: `https://...@sentry.io/...`
- Environment: production
- Release: version from app.json

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Core Functionality:**
- [ ] App opens without login
- [ ] Daily quote displays (unique each time)
- [ ] Progress stats show after completing session
- [ ] Can select meditation session
- [ ] Timer counts down correctly
- [ ] Audio plays (when files available)
- [ ] Session saves to progress
- [ ] Quotes don't repeat
- [ ] Language switching works
- [ ] Dark mode works
- [ ] Offline mode works

**Multi-Language:**
- [ ] Test all 6 languages (EN, PL, ES, DE, FR, HI)
- [ ] UI translates correctly
- [ ] Quotes show in selected language
- [ ] Sessions show in selected language

**Offline Mode:**
- [ ] Open app online
- [ ] Load quotes and sessions
- [ ] Turn off internet
- [ ] App still works
- [ ] Can complete sessions
- [ ] Progress tracked offline

---

## 🎯 Production Deployment

### Release Process

**1. Version Bump:**
```bash
cd mobile
# Update version in app.json
# version: "1.0.0" → "1.0.1"
```

**2. Create Release Tag:**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**3. Deploy Backend:**
```bash
cd backend/SlowSpot.Api
railway up
# Or auto-deploy via GitHub Actions
```

**4. Build Mobile:**
```bash
cd mobile
eas build --platform all
```

**5. Submit Apps:**
```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

**6. Monitor:**
- Check Sentry for errors
- Check PostHog for usage
- Check Railway logs for backend issues

---

## 💰 Cost Breakdown (Production)

| Service | Purpose | Cost/Month |
|---------|---------|------------|
| Railway | Backend API + PostgreSQL | $5 |
| Cloudflare R2 | Audio CDN | $0-1 |
| Expo EAS | Build service | $0 (free tier) |
| PostHog | Analytics | $0 (free tier) |
| Sentry | Error monitoring | $0 (free tier) |
| **TOTAL** | **MVP** | **$5-6** |

**Scaling (10K users):**
| Service | Cost/Month |
|---------|------------|
| Railway (scaled) | $20 |
| Cloudflare R2 | $10 |
| PostHog | $0-20 |
| Sentry | $0-26 |
| **TOTAL** | **$30-76** |

**Scaling (100K users):**
| Service | Cost/Month |
|---------|------------|
| Railway Pro | $50 |
| Cloudflare R2 | $50 |
| PostHog | $50 |
| Sentry | $50 |
| **TOTAL** | **$200** |

---

## 🔐 Security Checklist

- [x] No API keys in code (use environment variables)
- [x] HTTPS everywhere (TLS 1.3)
- [x] Rate limiting enabled
- [x] CORS configured correctly
- [x] No sensitive data logged
- [x] Device IDs hashed (SHA256)
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance verified
- [ ] Data deletion process defined

---

## 📝 Post-Launch Checklist

**Day 1:**
- [ ] Monitor Sentry for crash reports
- [ ] Check backend logs on Railway
- [ ] Verify analytics events in PostHog
- [ ] Test on real devices (iOS + Android)
- [ ] Check app store reviews

**Week 1:**
- [ ] Analyze user retention (PostHog)
- [ ] Review most popular features
- [ ] Check progress tracking accuracy
- [ ] Verify quote distribution (no repeats)
- [ ] Monitor backend performance

**Month 1:**
- [ ] Plan next features based on usage
- [ ] Add more meditation sessions
- [ ] Add more quotes
- [ ] Optimize performance based on metrics
- [ ] Consider premium features

---

## 🚨 Rollback Plan

**If something goes wrong:**

**Backend:**
```bash
# Rollback to previous deployment
railway rollback

# Or redeploy specific version
git checkout v1.0.0
railway up
```

**Mobile:**
- Can't rollback app stores immediately
- Push hotfix and expedite review
- Use Expo OTA updates for JS fixes:
  ```bash
  eas update --branch production
  ```

---

## 📞 Support

**Documentation:**
- Architecture: `./architecture/README.md`
- Testing: `./TESTING_GUIDE.md`
- Verification: `./RAPORT_WERYFIKACJI_KONCOWY.md`

**Issues:**
- GitHub Issues: Create detailed bug reports
- Email: tech@slowspot.app

---

**Last Updated:** 2025-11-10
**Version:** 1.0.0 (MVP)
