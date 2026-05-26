# Changelog

## v1.0.0 — 2026-03-29

Initial release.

### Features
- Score 10 hosting services from 7 questions, recommend the top 3
- Terminal-style UI with typing animation and keyboard navigation
- Score matrix (Q x option x service → 0–3) with region-based adjustments
- Result explanations via reason templates
- Tied 3rd-place handling (may show 4+ results)
- Japanese / English language toggle
- Dynamic OGP image generation (unique image per diagnosis result)
- Social sharing (X)
- Marketing landing page with scroll animations
- Green theme with CSS custom properties

### Tech
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (runtime theme variables)
- Deployed on Cloudflare Workers (`@opennextjs/cloudflare`)
- Dynamic OGP: `next/og` ImageResponse (Google Fonts CDN + fallback)
- WSL-based deploy script (`scripts/deploy.sh`)
- Automatic SWC binary recovery check (`scripts/dev.sh`)
- SEO: sitemap.ts, robots.txt, JSON-LD structured data, Google Search Console
