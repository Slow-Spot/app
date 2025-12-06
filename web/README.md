# Slow Spot Web

Next.js landing page and marketing website.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (7 languages)
- **Hosting:** Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

## Project Structure

```
web/
├── app/
│   ├── [locale]/        # Localized pages
│   │   ├── page.tsx     # Landing page
│   │   ├── privacy/     # Privacy Policy
│   │   ├── terms/       # Terms of Service
│   │   └── support/     # Support page
│   ├── config/          # App configuration
│   └── globals.css      # Global styles
├── messages/            # Translation files (7 languages)
├── public/              # Static assets
└── next.config.ts       # Next.js configuration
```

## Features

| Feature | Description |
|---------|-------------|
| Static Export | Pre-rendered HTML for fast loading |
| 7 Languages | Full i18n support |
| Dark/Light Mode | System preference detection |
| SEO Optimized | Meta tags, sitemap, robots.txt |
| Legal Pages | Privacy Policy, Terms of Service |

## Supported Languages

- English (`en`)
- Polish (`pl`)
- German (`de`)
- Spanish (`es`)
- French (`fr`)
- Hindi (`hi`)
- Chinese (`zh`)

## Deployment

The site is automatically deployed to Vercel on push to `main` branch.

**Live URL:** [slowspot.me](https://slowspot.me)

---

See main [README](../README.md) for full project documentation.
