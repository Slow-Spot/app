# Documentation

Project documentation for Slow Spot.

## Available Documents

| Document | Description |
|----------|-------------|
| [Platform Compliance](./PLATFORM_COMPLIANCE.md) | Google Play & App Store compliance analysis |

## Legal Documents

Legal documents are served directly on the website:

- **Privacy Policy:** [slowspot.me/privacy](https://slowspot.me/privacy)
- **Terms of Service:** [slowspot.me/terms](https://slowspot.me/terms)

All legal documents are available in 7 languages and automatically updated with each deployment.

## Architecture

Slow Spot follows a simple, privacy-first architecture:

```
┌─────────────────────────────────────────────────────┐
│                    User Device                       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────┐ │
│  │   Mobile App    │    │      Web (Landing)      │ │
│  │  (React Native) │    │       (Next.js)         │ │
│  └────────┬────────┘    └───────────┬─────────────┘ │
│           │                         │               │
│           ▼                         ▼               │
│  ┌─────────────────┐    ┌─────────────────────────┐ │
│  │  Local Storage  │    │        Vercel           │ │
│  │    (SQLite)     │    │    (Static Hosting)     │ │
│  └─────────────────┘    └─────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Key Principles:**

1. **No Backend Required** — All data stays on device
2. **No User Accounts** — Privacy by default
3. **No Analytics** — Zero tracking
4. **Offline First** — Works without internet

## Tech Stack Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Mobile | React Native + Expo | iOS & Android app |
| Web | Next.js 15 | Landing page |
| Storage | SQLite | Local meditation data |
| CI/CD | GitHub Actions | Automated builds |
| Hosting | Vercel + EAS | Web & mobile deployment |

---

See main [README](../README.md) for full project information.
