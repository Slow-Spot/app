# 🚀 Slow Spot CI/CD Pipeline

[![Semantic Release](https://github.com/Slow-Spot/app/actions/workflows/release.yml/badge.svg)](https://github.com/Slow-Spot/app/actions/workflows/release.yml)
[![Production Build](https://github.com/Slow-Spot/app/actions/workflows/eas-production-build.yml/badge.svg)](https://github.com/Slow-Spot/app/actions/workflows/eas-production-build.yml)
[![Preview Build](https://github.com/Slow-Spot/app/actions/workflows/eas-preview-build.yml/badge.svg)](https://github.com/Slow-Spot/app/actions/workflows/eas-preview-build.yml)

## 📋 Overview

Fully automated CI/CD pipeline for Slow Spot mobile app:

- 🔄 **Semantic versioning** & changelog generation
- 📱 **Automated builds** for iOS & Android
- 🚀 **Auto-submit** to App Store & Google Play
- 🧪 **Preview builds** for testing
- 🔄 **OTA updates** via Expo

## 🌊 Git Flow

```
feature/* ──┬──> develop ──────────> main ──> tag v*.*.*
            │       │                  │          │
            │       │                  │          └──> 🚀 Production Build
            │       │                  │                   └──> Auto-submit to stores
            │       │                  │
            │       └──> 🧪 Preview Build (APK for testing)
            │
            └──> 🧪 Preview Build on PR
```

## 📦 Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `release.yml` | Push to `main` | Semantic release, versioning, CHANGELOG |
| `eas-production-build.yml` | Tag `v*.*.*` | Production builds + auto-submit to stores |
| `eas-preview-build.yml` | Push to `develop`/`feature/*` | Preview APK for testing |
| `eas-update.yml` | Manual | OTA updates (instant, no store review) |
| `web-deploy.yml` | Push to `main` | Deploy website |
| `cleanup-old-builds.yml` | Weekly | Clean up old EAS builds |

## 🔐 Secrets Configuration

### GitHub Secrets (Required)

| Secret | Description |
|--------|-------------|
| `EXPO_TOKEN` | EAS Build authentication |
| `GITHUB_TOKEN` | Auto-provided by GitHub |

### Local Credentials (Never commit!)

| File | Purpose |
|------|---------|
| `mobile/AuthKey_*.p8` | Apple App Store Connect API |
| `mobile/android-service-account.json` | Google Play Service Account |

## 🏷️ Commit Convention

```bash
feat(mobile): add new meditation timer    # → Minor release (1.x.0)
fix(mobile): resolve audio playback bug   # → Patch release (1.0.x)
perf(mobile): optimize loading speed      # → Patch release
docs: update README                       # → No release
chore: cleanup code                       # → No release
```

**Valid scopes:** `mobile`, `web`, `shared`, `release`, `deps`

## 🧪 Development Workflow

### 1. Create Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-awesome-feature
```

### 2. Develop & Push
```bash
git add .
git commit -m "feat(mobile): add awesome feature"
git push origin feature/my-awesome-feature
# → Preview build triggered automatically
```

### 3. Create PR to develop
- Preview build runs
- PR gets comment with download links
- Review & merge

### 4. Merge to main (Release)
```bash
git checkout main
git merge develop
git push origin main
# → Semantic release runs
# → Tag created (e.g., v1.4.0)
# → Production build triggered
# → Auto-submit to stores
```

## 📊 Monitoring

- **[EAS Builds](https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds)** - Build status & downloads
- **[GitHub Actions](https://github.com/Slow-Spot/app/actions)** - Workflow runs
- **[App Store Connect](https://appstoreconnect.apple.com)** - iOS submissions
- **[Google Play Console](https://play.google.com/console)** - Android submissions

## 🔧 Manual Triggers

1. Go to **Actions** tab in GitHub
2. Select workflow
3. Click **Run workflow**
4. Choose options (platform, submit, etc.)

## 📱 Store Submission Flow

```
semantic-release
       │
       ├──> Creates tag v1.4.0
       │
       └──> Triggers eas-production-build.yml
                │
                ├──> Build iOS (IPA)
                │        └──> Submit to App Store Connect
                │
                └──> Build Android (AAB)
                         └──> Submit to Google Play
```

---

**Maintained by:** [ITEON.pl](https://iteon.pl)
