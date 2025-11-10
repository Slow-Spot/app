# Quick Reference Guide - Architecture Decisions

**One-page summary of critical architecture decisions**

---

## Stack Decision

```
✓ Mobile:    Expo SDK 50 + React Native + TypeScript
✓ Web:       Next.js 14 + TypeScript
✓ Backend:   .NET Core 8 (Minimal APIs)
✓ Database:  PostgreSQL 15 + Redis 7
✓ CDN:       Cloudflare R2 + Workers
✓ Hosting:   Railway (backend) + Vercel (web)
```

**Why:** Best cost/performance ratio, proven to 100k users, great DX

---

## Cost Projections

| Users | Monthly Cost | Per-User Cost |
|-------|--------------|---------------|
| **1k** | $17 | $0.017 |
| **10k** | $103 | $0.010 |
| **100k** | $763 | $0.008 |

**vs Azure:** 47-92% cheaper at all scales

---

## Performance Targets

```
App Launch:        < 3s
API Response:      < 200ms (p95)
Audio Start:       < 1s
Offline Mode:      100% functional
Uptime:            99.9%
```

---

## Security Checklist

```
✓ No authentication (privacy-first)
✓ GDPR compliant (no PII)
✓ OWASP Top 10 mitigated
✓ Rate limiting enabled
✓ HTTPS everywhere
✓ Device IDs hashed (SHA256)
```

---

## Key Files

```
/mobile/          Expo React Native app
/web/             Next.js landing page
/backend/         .NET Core API
/architecture/    This documentation

README.md                    Start here
ADR-001-system-architecture  Full technical design
deployment-strategy          CI/CD pipelines
security-plan                OWASP compliance
cost-analysis                Budget projections
technology-stack             Dependencies
```

---

## Critical Commands

```bash
# Mobile
cd mobile && npm start

# Web
cd web && npm run dev

# Backend
cd backend && dotnet run

# Deploy
git push origin main  # Auto-deploys via CI/CD

# Build mobile
cd mobile && eas build --platform all
```

---

## Infrastructure Access

```
Railway:      https://railway.app/project/[id]
Vercel:       https://vercel.com/[team]/[project]
Cloudflare:   https://dash.cloudflare.com/[id]
Sentry:       https://sentry.io/organizations/[org]
GitHub:       https://github.com/[org]/meditation-app
```

---

## Contact

```
Tech Lead:     tech@yourapp.com
DevOps:        devops@yourapp.com
Security:      security@yourapp.com
Slack:         #meditation-app-dev
```

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-11-08 | Use Railway instead of Azure | 92% cost savings for MVP |
| 2025-11-08 | Use .NET Core for backend | Performance + type safety |
| 2025-11-08 | Use Expo instead of pure RN | Faster iteration, OTA updates |
| 2025-11-08 | Use Cloudflare R2 for CDN | Free egress bandwidth |
| 2025-11-08 | No authentication (MVP) | Privacy-first, simpler UX |

---

## Next Milestone: MVP Launch (Week 6)

```
Week 1-2: Infrastructure setup
Week 3-4: Core features
Week 5:   Integration & polish
Week 6:   Testing & soft launch

Goal: 50 quotes, 5 sessions, en+pl, < $10/mo cost
```

---

**Version:** 1.0
**Last Updated:** 2025-11-08
**Full Docs:** [README.md](./README.md)
