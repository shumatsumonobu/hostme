# Contributing to hostme

Thanks for your interest. The most common contributions are updating service pricing/specs, adding new platforms, and fixing translations -- all of which live in simple data files. No complex setup needed.

## Prerequisites

- Node.js 20.9+
- npm

## Development Setup

Works on Windows, Mac, and Linux. No WSL required for local development.

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # vitest (all tests)
npm run test:watch   # vitest watch mode
npm run lint         # ESLint
```

Run a single test file:

```bash
npx vitest run src/lib/calc.test.ts
```

## How to Submit a PR

1. Fork the repo and create a branch
2. Make your changes
3. Run `npm run test` and `npm run lint`
4. Open a PR with a short description of what changed and why

No strict branch naming rules. Just keep it descriptive.

## Project Structure

```
src/
├── app/                  # Pages (App Router)
│   ├── page.tsx          #   Top (language/region selection)
│   ├── diagnose/         #   Diagnosis (7 questions)
│   ├── result/           #   Results (top 3)
│   ├── about/            #   How it works (scoring transparency)
│   ├── ogp/route.tsx     #   OGP image generation (Edge Runtime)
│   └── globals.css       #   Theme CSS variables
├── components/           # Shared UI components
├── data/                 # Data definitions (most contributions go here)
│   ├── services.ts       #   10 services (pricing, specs)
│   ├── scoring.ts        #   Score matrix, reason templates
│   ├── questions.ts      #   7 question definitions
│   └── i18n.ts           #   UI text (ja/en)
├── lib/                  # Logic
│   ├── calc.ts           #   Score calculation
│   ├── validate.ts       #   URL parameter validation
│   └── share.ts          #   Share URL generation
└── types/
    └── index.ts          # Type definitions (ServiceId, Lang, Region, etc.)
```

## Data Maintenance Guide

Most contributions touch `src/data/`. Here's what to edit for each type of change.

### Updating service pricing/specs

Edit the target service in `src/data/services.ts`:

| Field | Description | Example |
|---|---|---|
| `url` | Official site URL | `"https://workers.cloudflare.com/"` |
| `annualCost` | Annual cost | `"~$12 (domain only)"` |
| `freeTier` | Free tier description | `"Free (commercial OK)"` |
| `freeRequests` | Free request quota | `"100,000/day"` |
| `pros` / `cons` | Advantages/disadvantages | `["Unlimited bandwidth", ...]` |
| `migrationDifficulty` | Migration difficulty | `"Easy"` |
| `scaleCost` | Cost at scale | `"Paid $5/mo~"` |

Each field has `text: { ja: {...}, en: {...} }` -- update both languages. Also update the `lastVerified` date.

### Changing scoring rules

Edit `src/data/scoring.ts`:

- **`scoreMatrix`** -- Q x option x service score (0-3). Example: `q1.yes["cloudflare-workers"]` = 3
- **`reasonTemplates`** -- recommendation reason text when score is 3
- **`regionScoreMatrix`** -- region-based bonus/penalty

Score meanings: 3 = best fit, 2 = good, 1 = average, 0 = not recommended

### Adding/removing a service

Edit 4 files:

1. **`src/types/index.ts`** -- add to `ServiceId` union type
2. **`src/data/services.ts`** -- add entry to `services` + `serviceIds` array
3. **`src/data/scoring.ts`** -- add entries to all of:
   - `scoreMatrix` (all 7 questions x all options)
   - `regionScoreMatrix` (4 regions)
   - `reasonTemplates`
   - `defaultReasons`
4. Run `npm run test` to verify no type errors or test failures

### Adding/changing questions

1. **`src/data/questions.ts`** -- edit the `questions` array
2. **`src/data/scoring.ts`** -- add score rows for the new question in `scoreMatrix`
3. **`src/types/index.ts`** -- update types if needed

### Updating UI text (i18n)

Edit `src/data/i18n.ts` -- modify the `ja` / `en` objects. Button labels, loading messages, region names, etc. are all centralized here.

## Themes

4 themes available: green (default) / cyber / purple / amber

- CSS variables: `src/app/globals.css` in `:root` (default) and `[data-theme="..."]`
- Tailwind v4 `@theme` uses `var()` references only (no hex literals -- runtime theme switching requires this)

## Deployment

```bash
npm run cf:deploy    # One-command deploy (Windows: auto-routes through WSL)
npm run cf:preview   # Local preview (same)
```

On Windows, this internally runs: WSL -> clean install -> build -> deploy -> restore Windows node_modules. Stop the dev server before deploying.

On Mac/Linux, you can deploy directly:

```bash
npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

## Development Notes

- **Local dev works on any OS** -- WSL is only needed for Cloudflare deployment on Windows
- **next.config.js must be CJS** -- ESM (.ts) causes Turbopack to panic
- **vitest uses `pool: "forks"`** -- `threads` is flaky on MSYS/Windows
- **OGP images** -- `src/app/ogp/route.tsx` (Edge Runtime, loads Google Fonts)
