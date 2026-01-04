# Slow Spot - Professional Branching Strategy & CI/CD

## Overview

This document describes the professional Git branching strategy and CI/CD pipeline for Slow Spot app development. The strategy is designed to:

1. **Never block development** - Development continues independently of release cycles
2. **Safe production releases** - Multiple testing stages before store submission
3. **Support hotfixes** - Emergency fixes can bypass the normal flow
4. **Automated versioning** - Semantic versioning based on conventional commits

---

## Branch Structure

```
main (production)
  │
  │ ◄── Stable production releases
  │     Version: 1.14.0, 1.15.0, etc.
  │     Triggers: Production build + Store submission
  │
  ├── release/* (release candidates)
  │     │
  │     │ ◄── Pre-production testing (QA)
  │     │     Version: 1.14.0-rc.1, 1.14.0-rc.2, etc.
  │     │     Triggers: Preview build + Preview OTA
  │     │
  │     └── Created from: develop
  │         Merged to: main (after QA approval)
  │
  ├── develop (integration)
  │     │
  │     │ ◄── Active development integration
  │     │     Version: 1.15.0-beta.1, 1.15.0-beta.2, etc.
  │     │     Triggers: Development OTA + Optional preview build
  │     │
  │     ├── feature/* (new features)
  │     │     └── Created from: develop
  │     │         Merged to: develop (via PR)
  │     │
  │     └── fix/* (bug fixes)
  │           └── Created from: develop
  │               Merged to: develop (via PR)
  │
  └── hotfix/* (emergency fixes)
        │
        └── Created from: main
            Merged to: main AND develop
```

---

## Environment Mapping

| Branch | Environment | EAS Profile | Update Channel | Store Submission |
|--------|-------------|-------------|----------------|------------------|
| `main` | Production | production | production | Auto (optional) |
| `release/*` | Staging/RC | preview | preview | Never |
| `develop` | Development | development | development | Never |
| `feature/*` | Development | development | - | Never |
| `hotfix/*` | Production | production | production | Manual |

---

## Workflow Scenarios

### 1. Regular Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-meditation-timer

# 2. Develop and commit using conventional commits
git commit -m "feat(timer): add countdown visualization"
git commit -m "fix(timer): correct interval calculation"

# 3. Push and create PR to develop
git push origin feature/new-meditation-timer
# Create PR: feature/new-meditation-timer → develop

# 4. After PR approval and merge:
#    - CI runs tests
#    - Beta version is created (e.g., 1.15.0-beta.3)
#    - OTA update pushed to development channel
```

### 2. Creating a Release

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.14.0

# 2. Push release branch
git push origin release/1.14.0

# 3. CI automatically:
#    - Creates RC version (1.14.0-rc.1)
#    - Builds preview APK/IPA
#    - Pushes OTA to preview channel

# 4. QA tests the release candidate
#    - Fix any issues with commits to release branch
#    - Each fix creates new RC (1.14.0-rc.2, etc.)

# 5. When QA approves, merge to main
git checkout main
git merge release/1.14.0
git push origin main

# 6. CI automatically:
#    - Creates production version (1.14.0)
#    - Builds production app
#    - Submits to App Store and Google Play
```

### 3. Hotfix (Emergency Production Fix)

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-crash-fix

# 2. Apply fix
git commit -m "fix(app): resolve critical startup crash"

# 3. Merge to main (fast-track)
git checkout main
git merge hotfix/critical-crash-fix
git push origin main

# 4. Also merge to develop (keep in sync)
git checkout develop
git merge hotfix/critical-crash-fix
git push origin develop
```

---

## Version Numbering

### Semantic Versioning: MAJOR.MINOR.PATCH

| Type | When | Example |
|------|------|---------|
| **MAJOR** | Breaking changes | 2.0.0 |
| **MINOR** | New features | 1.14.0 |
| **PATCH** | Bug fixes | 1.13.1 |

### Pre-release Versions

| Branch | Pre-release ID | Example |
|--------|---------------|---------|
| `develop` | beta | 1.15.0-beta.1 |
| `release/*` | rc | 1.14.0-rc.1 |
| `main` | (none) | 1.14.0 |

---

## CI/CD Pipeline Summary

### On Push to `develop`

1. ✅ Run tests (lint, type-check, unit tests)
2. 📦 Create beta pre-release version
3. 📱 EAS Update to `development` channel
4. 📋 Update CHANGELOG with beta notes

### On Push to `release/*`

1. ✅ Run tests
2. 📦 Create RC pre-release version
3. 🔨 EAS Build (preview profile)
4. 📱 EAS Update to `preview` channel
5. 📋 Generate release notes for QA

### On Push to `main`

1. ✅ Run tests
2. 📦 Create production version + Git tag
3. 🔨 EAS Build (production profile)
4. 📱 EAS Update to `production` channel
5. 🚀 Submit to App Store & Google Play
6. 📋 Create GitHub Release with CHANGELOG

### On Tag `v*.*.*`

1. 🔨 EAS Production Build (if not already building)
2. 🚀 Store submission

---

## Store Submission Strategy

### Apple App Store

- **Auto-submit**: Only from `main` branch
- **When app is in review**: Disable auto-submit, use manual workflow
- **Phased rollout**: Enabled for production releases

### Google Play Store

- **Auto-submit**: To internal track first
- **Promotion**: Manual promotion to production
- **Staged rollout**: 10% → 50% → 100%

---

## Implementation Checklist

- [ ] Update `.releaserc` for multi-branch support
- [ ] Create/update GitHub Actions workflows
- [ ] Configure EAS environments for each branch
- [ ] Set up branch protection rules
- [ ] Create develop branch from current main
- [ ] Test the complete workflow

---

## Quick Reference Commands

```bash
# Start new feature
git checkout develop && git pull && git checkout -b feature/NAME

# Start release
git checkout develop && git pull && git checkout -b release/X.Y.Z

# Hotfix
git checkout main && git pull && git checkout -b hotfix/DESCRIPTION

# Check current branch
git branch --show-current

# See all branches
git branch -a
```
