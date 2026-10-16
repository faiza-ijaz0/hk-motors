# HK Motors

A premium automotive dealership website with a built-in staff console, built
with Next.js (App Router), TypeScript, Tailwind CSS and Supabase.

The public site showcases vehicle inventory, a media gallery, an automotive
blog and company information, and turns visitor interest into inquiries. The
`/super-admin` console lets staff manage inventory, gallery albums, inquiry
leads, contact messages, users, employees, salaries and site settings.

> **Status:** client-demo ready, not yet production-ready. See
> [Current limitations](#current-limitations) before deploying publicly.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Demo content and the fallback mode](#demo-content-and-the-fallback-mode)
- [Available scripts](#available-scripts)
- [Quality checks](#quality-checks)
- [Deployment](#deployment)
- [Performance and images](#performance-and-images)
- [Security](#security)
- [Current limitations](#current-limitations)
- [Replacing demo content with client content](#replacing-demo-content-with-client-content)

---

## Features

**Public website** (`src/app/(public)`)

- **Home** — video hero with quick search, brand strip, featured-vehicle
  carousel, video showcase, latest inventory, statistics, CEO preview,
  testimonials and call-to-action.
- **Cars** (`/cars`) — inventory with keyword search; filters for category,
  brand, model, year, price range and condition; sorting (newest, price, year,
  mileage); and pagination (12 per page). All state lives in the URL, so
  results are shareable.
- **Car detail** (`/cars/[slug]`) — photo/video gallery with lightbox,
  specifications, feature list, similar vehicles, inquiry form and WhatsApp
  call-to-action, with per-vehicle SEO and Open Graph metadata.
- **Gallery** (`/gallery`) — published albums filterable by category (cars,
  showroom, deliveries, events), supporting images and videos.
- **Blog** (`/blog`, `/blog/[slug]`) — category tabs, related posts,
  previous/next navigation and Article structured data (JSON-LD). Content is
  local static data in `src/data/blogs.ts`.
- **About, Services, Meet Our CEO, Contact** — company pages; the contact page
  has a message form and a city-level map.
- **SEO** — per-page titles and descriptions, canonical URLs on detail pages,
  Open Graph/Twitter cards, `sitemap.xml` (static pages, published cars and
  blog posts) and `robots.txt` (disallows `/super-admin`).
- **Light/dark theme** toggle and responsive layouts from phone to desktop.

**Staff console** (`src/app/super-admin`)

- Dashboard and analytics overview.
- Cars: create, edit, delete and publish listings; upload images/videos; manage
  categories.
- Gallery: albums, image/video uploads, cover selection and ordering.
- Inquiry leads (from car inquiry forms) with notes and status tracking.
- Contact leads (from the contact form) with realtime updates and date-range
  filtering.
- Users, employees, employee salaries and website settings.

## Tech stack

| Area          | Technology                                                         |
| ------------- | ------------------------------------------------------------------ |
| Framework     | Next.js 15 (App Router, React Server Components), React 19         |
| Language      | TypeScript (strict)                                                |
| Styling       | Tailwind CSS v4, design tokens in `src/styles/tokens.css`          |
| UI primitives | shadcn/ui on Radix UI, lucide-react icons, sonner toasts           |
| Motion        | Framer Motion (scroll reveals) and CSS animations (hero content)   |
| Backend       | Supabase — Postgres, Storage (`cars`, `gallery` buckets), Realtime |
| Tooling       | ESLint 9, Prettier, Husky + lint-staged pre-commit hook            |

There is no automated test suite yet.

## Project structure

```text
.
├── docs/ARCHITECTURE.md      Platform architecture and roadmap
├── public/                   Static images, hero video (public/videos)
├── scripts/seed-demo.mjs     Seeds/removes demo cars + gallery in Supabase
├── supabase/migrations/      SQL migrations (employees, employee_salaries)
└── src/
    ├── app/
    │   ├── (public)/         Public routes: home, cars, gallery, blog, ...
    │   ├── super-admin/      Staff console routes
    │   ├── sitemap.ts        Generated sitemap
    │   └── robots.ts         Generated robots.txt
    ├── components/           ui/ (shadcn), layout/ (header, footer), shared/
    ├── config/               Site metadata, brands, media, testimonials
    ├── constants/            Navigation, stats, social links
    ├── data/
    │   ├── blogs.ts          Blog posts (static content)
    │   └── demo/             Demo inventory + gallery (see below)
    ├── features/             Feature modules (home, inventory, gallery, admin, ...)
    ├── lib/                  Supabase clients, formatting, image helpers
    ├── services/             Data access (public reads, admin server actions)
    ├── styles/tokens.css     Theme tokens (source of truth for colours)
    └── types/supabase.ts     Generated database types
```

Data flows one way: **pages → `src/services/*` → Supabase**. Public pages
read through the anon/publishable key (governed by Row-Level Security).
Admin writes use Server Actions with the service-role client
(`src/lib/supabase/admin.ts`, server-only).

## Getting started

### Prerequisites

- **Node.js 22.18+ or 23.6+** (developed on Node 24). The demo seed script
  relies on Node's built-in TypeScript type stripping.
- **npm** (the repository uses `package-lock.json`).
- A **Supabase project** with the HK Motors schema, for real data.

### Install and run

```bash
git clone https://github.com/faiza-ijaz0/hk-motors.git
cd hk-motors
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open <http://localhost:3000>. The staff console is at
<http://localhost:3000/super-admin>.

To run the production build locally:

```bash
npm run build
npm run start
```

## Environment variables

Copy `.env.example` to `.env.local`. `.env*` files are git-ignored (except the
example), so local values are never committed.

| Variable                               | Exposure    | Purpose                                                                                                                 |
| -------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public      | Supabase project URL. Also whitelists its Storage host for image optimization.                                          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public      | Publishable (anon) key for RLS-governed public reads.                                                                   |
| `SUPABASE_SERVICE_ROLE_KEY`            | **Secret**  | Bypasses RLS. Server-only, used by the staff console and the seed script. Never prefix with `NEXT_PUBLIC_`.             |
| `DEMO_DATA_FALLBACK`                   | Server-only | Set to `true` to serve bundled demo cars/gallery when Supabase is unreachable. Leave unset in production.               |
| `NEXT_PUBLIC_SITE_URL`                 | Public      | Optional. Canonical site URL for sitemap/Open Graph; defaults to `https://hk-motors.vercel.app` (`src/config/site.ts`). |

## Demo content and the fallback mode

The repository ships realistic **sample** content so the site can be
presented before the client supplies real material:

| Content          | Location                     | Amount                                                             |
| ---------------- | ---------------------------- | ------------------------------------------------------------------ |
| Vehicle listings | `src/data/demo/inventory.ts` | 25 cars (39 photos), 7 makes, 18 models, 5 categories, 28 features |
| Gallery          | `src/data/demo/gallery.ts`   | 5 albums, 28 photos                                                |
| Blog             | `src/data/blogs.ts`          | 36 posts                                                           |
| Testimonials     | `src/config/testimonials.ts` | 20 sample reviews, labelled as samples on the homepage             |

Demo cars and gallery reach the site in one of two ways:

1. **Seeded into Supabase (normal path).** `npm run seed:demo` upserts them
   through the same tables the admin console uses. It is idempotent: every
   demo row has a fixed id starting with `de30`, existing makes/models/
   categories are reused by slug, and records whose slug belongs to real data
   are skipped. `npm run seed:demo -- --remove` deletes only `de30…` rows.
2. **Fallback mode.** With `DEMO_DATA_FALLBACK=true`, if a Supabase read
   fails, `src/services/demo-catalog.ts` serves the same data in memory with
   identical search, filter, sort and pagination behaviour. After a failure it
   skips Supabase for 5 minutes, because supabase-js retries each failed read
   (about 7 seconds when the project is unreachable).

Fallback limitations:

- It covers **public reads of cars and gallery only**. Contact and inquiry
  forms, and the entire staff console, still need a working Supabase project.
- It only activates on a **failed** read. A reachable but empty database shows
  the normal empty states — seed it instead.
- The first request after a server (re)start still waits for one failed read.
- Statically prerendered pages (the homepage, the sitemap) capture whatever
  data was available at build time.

## Available scripts

From `package.json`:

| Script                 | Command                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | `next dev` — development server                                         |
| `npm run build`        | `next build` — production build                                         |
| `npm run start`        | `next start` — serve the production build                               |
| `npm run lint`         | `eslint .`                                                              |
| `npm run lint:fix`     | `eslint . --fix`                                                        |
| `npm run format`       | `prettier --write .`                                                    |
| `npm run format:check` | `prettier --check .`                                                    |
| `npm run typecheck`    | `tsc --noEmit`                                                          |
| `npm run seed:demo`    | Seed demo cars and gallery into Supabase (`-- --remove` to delete them) |
| `npm run prepare`      | `husky` — installs the git hooks (runs on `npm install`)                |

## Quality checks

Run before every push:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

The pre-commit hook runs `lint-staged`, which applies `eslint --fix` and
`prettier --write` to staged files.

## Deployment

The app is configured for **Vercel** (the default `siteConfig.url` is a
`vercel.app` domain), though any host that runs `next build` / `next start`
on Node 22.18+ works.

1. Import the GitHub repository into Vercel.
2. Add the environment variables above in the project settings. Keep
   `SUPABASE_SERVICE_ROLE_KEY` server-side only, and leave
   `DEMO_DATA_FALLBACK` unset in production.
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain so canonical URLs and the
   sitemap are correct.
4. Re-deploy after inventory changes if you want the statically rendered
   homepage to reflect them immediately.

## Performance and images

- **Images** use `next/image`. Supabase Storage and `images.unsplash.com` are
  whitelisted in `next.config.ts`, so photos are resized and served as modern
  formats at the size each layout needs (`src/lib/images.ts` decides which
  URLs can be optimized). Hero images use `priority`; gallery images
  lazy-load.
- **Hero content** fades in with a CSS animation
  (`components/shared/hero-fade-in.tsx`), so headings paint before JavaScript
  hydrates. Scroll reveals elsewhere use Framer Motion.
- **Reduced motion** is respected: the CSS animations switch off under
  `prefers-reduced-motion`, and Framer Motion runs with
  `reducedMotion="user"`.
- **Video**: the hero video is local (`public/videos/hero.mp4`, ~2.5 MB);
  showcase videos load only when scrolled into view.
- Car detail data is fetched once per request via React `cache()`, shared by
  metadata generation and the page body.

## Security

- **Never commit secrets.** `.env.local` and other `.env*` files are
  git-ignored. Only `.env.example` (placeholders) is tracked.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row-Level Security. It is only read in
  server code (`src/lib/supabase/admin.ts` imports `server-only`) and the
  seed script.
- **The `/super-admin` console has no authentication yet.** It is hidden from
  search engines via `robots.txt`, but anyone with the URL can use it, with
  service-role privileges. Add Supabase Auth (or equivalent) with role checks
  before any public deployment that is not a controlled demo. See
  `docs/ARCHITECTURE.md` for the intended role model.
- If a key is ever exposed, rotate it in the Supabase dashboard immediately.

## Current limitations

- **Supabase was unreachable while this release was prepared** (the project
  host did not resolve; most likely paused). Pages were verified in demo
  fallback mode. Database-backed features — admin CRUD, uploads, contact and
  inquiry submissions, realtime leads — were not re-verified against a live
  database for this release.
- The staff console has no authentication (see [Security](#security)).
- Public contact details are placeholders: the phone/WhatsApp number in
  `src/components/layout/footer.tsx` and `src/app/(public)/contact/page.tsx`
  is a sample Pakistani number, and the location is shown at city level
  ("Dubai, United Arab Emirates") with a city-level map until a verified
  address is provided.
- Demo prices are in PKR and some blog posts cover the Pakistani market; review
  both against the Dubai positioning.
- There is no automated test suite.

## Replacing demo content with client content

1. **Vehicles and gallery** — add real listings and albums in `/super-admin`,
   then run `npm run seed:demo -- --remove` to delete only the demo records.
2. **Testimonials** — replace the entries in `src/config/testimonials.ts`
   with real, consented reviews, then set `testimonialsAreSamples` to `false`
   to remove the "sample reviews" note.
3. **Blog** — edit or replace posts in `src/data/blogs.ts`.
4. **Contact details and location** — update the phone, email, WhatsApp link
   and address in the footer and contact page, and `MAP_QUERY` in
   `src/features/contact/google-map.tsx`, once verified.
5. **Company figures** — `src/constants/company-stats.ts` (homepage) and
   `src/constants/about-achievements.ts` (About page) hold placeholder numbers.
6. **CEO portrait and name** — the CEO page uses a placeholder portrait and
   no personal name; add them only with the client's approval.
7. Remove `DEMO_DATA_FALLBACK` from every environment.

---

Built for HK Motors. For architecture decisions and the roadmap, see
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
