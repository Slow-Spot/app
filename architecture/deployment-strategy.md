# Deployment Strategy & CI/CD Pipeline

**Project:** Meditation App (Slow Spot / Airea)
**Version:** 1.0
**Date:** 2025-11-08

---

## 1. Deployment Architecture Overview

```mermaid
graph TB
    subgraph "Development"
        Dev[Developer]
        LocalEnv[Local Environment]
    end

    subgraph "Source Control"
        GitHub[GitHub Repository]
        MainBranch[main branch]
        DevBranch[develop branch]
        FeatureBranch[feature/* branches]
    end

    subgraph "CI/CD Pipeline"
        GHA[GitHub Actions]
        Tests[Automated Tests]
        Build[Build Process]
        Security[Security Scan]
    end

    subgraph "Staging Environment"
        StagingAPI[Railway Staging]
        StagingDB[(Staging DB)]
        TestFlight[TestFlight Beta]
    end

    subgraph "Production Environment"
        ProdAPI[Railway Production]
        ProdDB[(Production DB)]
        VercelProd[Vercel Production]
        AppStore[App Store]
        PlayStore[Google Play]
        CDN[Cloudflare CDN]
    end

    Dev --> LocalEnv
    LocalEnv --> FeatureBranch
    FeatureBranch --> DevBranch
    DevBranch --> MainBranch

    MainBranch --> GHA
    GHA --> Tests
    Tests --> Security
    Security --> Build

    Build --> StagingAPI
    Build --> TestFlight
    StagingAPI --> StagingDB

    MainBranch -->|Tag v*| ProdAPI
    MainBranch -->|Tag v*| VercelProd
    MainBranch -->|Tag v*| AppStore
    MainBranch -->|Tag v*| PlayStore

    ProdAPI --> ProdDB
    ProdAPI --> CDN
```

---

## 2. Environment Strategy

### 2.1 Environment Configuration

```yaml
Environments:
  development:
    Purpose: Local development
    Backend: http://localhost:5000
    Database: Local PostgreSQL (Docker)
    CDN: Local files
    Analytics: Disabled

  staging:
    Purpose: Pre-production testing
    Backend: https://api-staging.yourapp.com
    Database: Railway Staging DB (shared)
    CDN: Cloudflare (staging bucket)
    Analytics: PostHog staging project

  production:
    Purpose: Live users
    Backend: https://api.yourapp.com
    Database: Railway Production DB (isolated)
    CDN: Cloudflare R2 (production bucket)
    Analytics: PostHog production project
```

### 2.2 Environment Variables

```bash
# Backend API (.env)
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
CDN_BASE_URL=https://cdn.yourapp.com
SENTRY_DSN=https://...@sentry.io/...
ALLOWED_ORIGINS=https://yourapp.com,exp://192.168.1.100:19000
QUOTE_CACHE_TTL_MINUTES=60
SESSION_CACHE_TTL_MINUTES=1440
RATE_LIMIT_REQUESTS_PER_MINUTE=100

# Mobile App (.env)
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_CDN_URL=https://cdn.yourapp.com
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://posthog.yourapp.com
EXPO_PUBLIC_ENVIRONMENT=production

# Web App (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
```

---

## 3. CI/CD Pipeline Details

### 3.1 Mobile App Pipeline (.github/workflows/mobile.yml)

```yaml
name: Mobile App CI/CD

on:
  push:
    branches: [main, develop]
    tags: ['v*']
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Run linter
        working-directory: mobile
        run: npm run lint

      - name: Run type check
        working-directory: mobile
        run: npm run type-check

      - name: Run unit tests
        working-directory: mobile
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./mobile/coverage/coverage-final.json
          flags: mobile

  build-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Create preview build
        working-directory: mobile
        run: eas build --platform all --profile preview --non-interactive

  build-production:
    runs-on: ubuntu-latest
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - uses: actions/checkout@v4

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Build iOS
        working-directory: mobile
        run: eas build --platform ios --profile production --non-interactive

      - name: Build Android
        working-directory: mobile
        run: eas build --platform android --profile production --non-interactive

      - name: Submit to App Store
        working-directory: mobile
        run: eas submit --platform ios --latest
        env:
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.EXPO_APPLE_APP_SPECIFIC_PASSWORD }}

      - name: Submit to Google Play
        working-directory: mobile
        run: eas submit --platform android --latest
        env:
          EXPO_ANDROID_SERVICE_ACCOUNT_KEY_PATH: ${{ secrets.EXPO_ANDROID_SERVICE_ACCOUNT_KEY_PATH }}

  e2e-tests:
    runs-on: macos-latest
    needs: build-preview
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Install Detox CLI
        run: npm install -g detox-cli

      - name: Build app for testing
        working-directory: mobile
        run: detox build --configuration ios.sim.release

      - name: Run E2E tests
        working-directory: mobile
        run: detox test --configuration ios.sim.release --record-logs all

      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: detox-artifacts
          path: mobile/artifacts
```

### 3.2 Backend API Pipeline (.github/workflows/backend.yml)

```yaml
name: Backend API CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: meditation_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore dependencies
        working-directory: backend
        run: dotnet restore

      - name: Build
        working-directory: backend
        run: dotnet build --no-restore --configuration Release

      - name: Run unit tests
        working-directory: backend
        run: dotnet test --no-build --configuration Release --verbosity normal --collect:"XPlat Code Coverage"
        env:
          ConnectionStrings__DefaultConnection: "Host=localhost;Database=meditation_test;Username=postgres;Password=postgres"
          ConnectionStrings__Redis: "localhost:6379"

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/tests/**/coverage.cobertura.xml
          flags: backend

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: './backend'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'meditation-api'
          path: './backend'
          format: 'HTML'

      - name: Upload dependency check results
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: ./dependency-check-report.html

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway (Staging)
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: meditation-api-staging

      - name: Run database migrations
        run: |
          # Wait for deployment
          sleep 30
          # Trigger migration endpoint
          curl -X POST https://api-staging.yourapp.com/admin/migrate \
            -H "Authorization: Bearer ${{ secrets.MIGRATION_TOKEN }}"

      - name: Run smoke tests
        run: |
          curl -f https://api-staging.yourapp.com/health || exit 1
          curl -f https://api-staging.yourapp.com/api/v1/quotes/random?language=en || exit 1

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://api.yourapp.com
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway (Production)
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: meditation-api-production

      - name: Run database migrations
        run: |
          sleep 30
          curl -X POST https://api.yourapp.com/admin/migrate \
            -H "Authorization: Bearer ${{ secrets.MIGRATION_TOKEN }}"

      - name: Run smoke tests
        run: |
          curl -f https://api.yourapp.com/health || exit 1
          curl -f https://api.yourapp.com/api/v1/quotes/random?language=en || exit 1

      - name: Notify Sentry of deployment
        run: |
          curl https://sentry.io/api/0/organizations/yourorg/releases/ \
            -X POST \
            -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
            -H 'Content-Type: application/json' \
            -d '{
              "version": "'$GITHUB_SHA'",
              "refs": [{"repository":"yourorg/meditation-app","commit":"'$GITHUB_SHA'"}],
              "projects": ["meditation-api"]
            }'

      - name: Health check monitoring
        run: |
          # Trigger BetterUptime to resume monitoring
          curl -X POST https://betteruptime.com/api/v2/monitors/${{ secrets.MONITOR_ID }}/resume \
            -H "Authorization: Bearer ${{ secrets.BETTERUPTIME_TOKEN }}"
```

### 3.3 Web App Pipeline (.github/workflows/web.yml)

```yaml
name: Web App CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        working-directory: web
        run: npm ci

      - name: Run linter
        working-directory: web
        run: npm run lint

      - name: Run type check
        working-directory: web
        run: npm run type-check

      - name: Run unit tests
        working-directory: web
        run: npm run test -- --coverage

      - name: Build
        working-directory: web
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: https://api.yourapp.com

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
          budgetPath: ./web/lighthouserc.json
          uploadArtifacts: true

  e2e-tests:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: web
        run: npm ci

      - name: Install Playwright
        working-directory: web
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        working-directory: web
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: web/playwright-report

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e-tests]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
          working-directory: web
```

---

## 4. Deployment Checklist

### 4.1 Pre-Deployment (Development)

```markdown
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage > 80%
- [ ] No critical security vulnerabilities (Trivy, OWASP)
- [ ] TypeScript strict mode enabled, no errors
- [ ] ESLint warnings resolved
- [ ] Database migrations tested locally
- [ ] Environment variables documented
- [ ] API documentation updated (if API changes)
- [ ] CHANGELOG.md updated
- [ ] Version bumped (semantic versioning)
```

### 4.2 Staging Deployment

```markdown
- [ ] Deploy to Railway staging
- [ ] Run database migrations
- [ ] Smoke tests passing
- [ ] Manual QA testing
- [ ] Performance testing (Lighthouse, load tests)
- [ ] Cross-browser testing (Safari, Chrome, Firefox)
- [ ] Mobile testing (iOS, Android)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Stakeholder approval
```

### 4.3 Production Deployment

```markdown
- [ ] Schedule deployment (avoid peak hours)
- [ ] Notify team in Slack/Discord
- [ ] Database backup confirmed (< 1 hour old)
- [ ] Feature flags configured (if applicable)
- [ ] Deploy backend API first
- [ ] Run database migrations
- [ ] Verify API health endpoint
- [ ] Deploy web app (Vercel auto-deploys)
- [ ] Submit mobile app builds (if new version)
- [ ] Monitor error rates (Sentry)
- [ ] Monitor performance (Vercel Analytics, Railway metrics)
- [ ] Verify critical user flows (smoke tests)
- [ ] Update status page (if applicable)
- [ ] Announce release (social media, email)
```

### 4.4 Post-Deployment

```markdown
- [ ] Monitor error rates for 2 hours
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Update documentation
- [ ] Create Git tag (if not automated)
- [ ] Close related GitHub issues
- [ ] Update project board
- [ ] Retrospective (what went well, what to improve)
```

---

## 5. Rollback Strategy

### 5.1 Backend API Rollback

```bash
# Railway supports instant rollbacks via CLI or dashboard

# Option 1: Via Railway Dashboard
1. Go to Railway dashboard
2. Select "meditation-api-production" service
3. Go to "Deployments" tab
4. Click "Rollback" on previous stable deployment

# Option 2: Via Railway CLI
railway rollback

# Option 3: Redeploy previous Git commit
git revert HEAD
git push origin main
# Railway auto-deploys from main branch

# Database migration rollback (if needed)
# Run down migration via EF Core
dotnet ef database update PreviousMigrationName --connection "$DATABASE_URL"
```

### 5.2 Mobile App Rollback

```bash
# Expo EAS Update allows instant OTA rollbacks
# (for JS code changes only, not native builds)

# Rollback to previous update
eas update:rollback --branch production --group-id <previous-group-id>

# For native build issues:
# Cannot rollback - users must update manually
# Publish hotfix version ASAP
```

### 5.3 Web App Rollback (Vercel)

```bash
# Vercel Dashboard:
1. Go to project deployments
2. Find previous stable deployment
3. Click "Promote to Production"

# Instant rollback (< 30 seconds)

# Via Vercel CLI:
vercel rollback
```

---

## 6. Monitoring & Alerts

### 6.1 Key Metrics to Monitor

```yaml
Backend API:
  - Response time (p50, p95, p99)
  - Error rate (5xx errors)
  - Request throughput (req/min)
  - Database connection pool usage
  - Redis cache hit rate
  - Memory usage
  - CPU usage

Mobile App:
  - Crash-free rate (target: > 99.5%)
  - App launch time (target: < 3s)
  - Audio playback errors
  - Network request failures
  - ANR rate (Android)
  - Battery usage

Web App:
  - Core Web Vitals (LCP, FID, CLS)
  - Time to First Byte (TTFB)
  - JavaScript errors
  - User engagement metrics

Infrastructure:
  - Railway service uptime
  - Vercel deployment success rate
  - Cloudflare CDN cache hit ratio
  - Database storage usage
  - Bandwidth consumption
```

### 6.2 Alert Configuration

```yaml
Critical Alerts (PagerDuty / Slack):
  - API error rate > 5% (5xx errors)
  - API response time p95 > 1s
  - Database CPU > 90% for 5 minutes
  - Railway service down
  - Mobile app crash rate > 2%

Warning Alerts (Slack only):
  - API error rate > 1%
  - API response time p95 > 500ms
  - Database storage > 80% used
  - Cache hit rate < 70%
  - Mobile app crash rate > 0.5%

Info Alerts (Email):
  - Deployment completed successfully
  - New user milestone reached (1k, 10k, 100k)
  - Weekly performance report
  - Monthly cost report
```

---

## 7. Database Migration Strategy

### 7.1 Migration Process

```bash
# 1. Create migration locally
cd backend
dotnet ef migrations add AddQuoteCultureIndex

# 2. Review generated migration SQL
dotnet ef migrations script --output migrations/001_add_culture_index.sql

# 3. Test migration on staging
dotnet ef database update --connection "$STAGING_DATABASE_URL"

# 4. Verify staging data integrity
dotnet run --project tests/MigrationTests

# 5. Deploy to production (via CI/CD)
git push origin main
# GitHub Actions runs migration automatically

# 6. Verify production migration
curl -f https://api.yourapp.com/health
```

### 7.2 Zero-Downtime Migrations

For breaking schema changes:

```sql
-- Bad: Breaks existing API immediately
ALTER TABLE quotes DROP COLUMN old_field;

-- Good: Multi-phase migration
-- Phase 1: Add new field (nullable)
ALTER TABLE quotes ADD COLUMN new_field TEXT;

-- Phase 2: Backfill data (background job)
UPDATE quotes SET new_field = old_field WHERE new_field IS NULL;

-- Phase 3: Deploy API code using new_field

-- Phase 4: Make new_field NOT NULL
ALTER TABLE quotes ALTER COLUMN new_field SET NOT NULL;

-- Phase 5: Drop old_field
ALTER TABLE quotes DROP COLUMN old_field;
```

---

## 8. Disaster Recovery Drills

### 8.1 Quarterly DR Test

```markdown
Scenario: Railway database corruption

1. Stop production API
2. Restore database from latest backup
3. Verify data integrity
4. Run migrations to current schema
5. Start production API
6. Run smoke tests
7. Measure recovery time (target: < 30 minutes)

Log results in INCIDENT_LOG.md
```

### 8.2 Annual DR Test

```markdown
Scenario: Complete infrastructure failure

1. Setup new Railway project
2. Restore database from backup
3. Deploy API from Git
4. Update DNS records
5. Deploy web app to Vercel
6. Verify all services operational
7. Measure recovery time (target: < 2 hours)

Document lessons learned
```

---

## 9. Release Process

### 9.1 Semantic Versioning

```
Version format: MAJOR.MINOR.PATCH

Examples:
  1.0.0 - Initial MVP release
  1.1.0 - New feature (e.g., Hindi language support)
  1.1.1 - Bug fix (e.g., audio sync issue)
  2.0.0 - Breaking change (e.g., new API version)

Mobile app version must match backend API compatibility
```

### 9.2 Release Schedule

```yaml
Weekly Releases (Fridays, 10 AM UTC):
  - Bug fixes
  - Minor improvements
  - Content updates

Monthly Releases (First Friday):
  - New features
  - Major improvements
  - Performance optimizations

Hotfix Releases (As needed):
  - Critical bugs
  - Security vulnerabilities
  - Production incidents
```

---

## 10. Security Best Practices

### 10.1 Secret Management

```bash
# NEVER commit secrets to Git
# Use environment variables for all secrets

# Railway secrets (via dashboard or CLI)
railway variables set DATABASE_URL="postgresql://..."
railway variables set SENTRY_DSN="https://..."

# Expo secrets (for EAS builds)
eas secret:create --name SENTRY_DSN --value "https://..." --type string

# Vercel secrets (via CLI)
vercel secrets add sentry-dsn "https://..."
```

### 10.2 Access Control

```yaml
GitHub Repository:
  - Main branch: Protected, requires PR reviews (2 approvers)
  - Develop branch: Protected, requires PR reviews (1 approver)
  - Feature branches: No restrictions

Railway:
  - Production project: Admin access only (2 people)
  - Staging project: Developer access (5 people)

Vercel:
  - Production deployment: Team admin only
  - Preview deployments: All developers

Expo:
  - App Store credentials: Owner only
  - EAS builds: Developer access

Sentry:
  - Production project: Developer access (read-only)
  - Admin access: 2 people
```

---

## Conclusion

This deployment strategy ensures:

1. **Automation**: 90% of deployment steps automated via GitHub Actions
2. **Safety**: Multi-stage testing, security scans, rollback capabilities
3. **Speed**: < 5 minutes from merge to production (web), < 30 minutes (backend)
4. **Reliability**: 99.9% uptime target, comprehensive monitoring
5. **Security**: Secrets management, access control, regular audits

**Next Steps:**
1. Setup GitHub Actions workflows
2. Configure Railway projects (staging + production)
3. Setup Vercel project
4. Configure Expo EAS
5. Test full CI/CD pipeline with dummy deployment

---

**Document Version:** 1.0
**Last Updated:** 2025-11-08
**Review Date:** 2025-12-08
