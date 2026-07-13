# HK Motors — Platform Architecture

Status: Draft v1 · Scope: Vehicle Inventory & Listings platform (public site + role-based admin console)
Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Supabase

---

## 1. Executive Summary

HK Motors is a production-grade automotive platform centered on **vehicle inventory management and public listings**. It has two faces:

- **Public site** — a fast, SEO-friendly showcase where visitors browse, filter, and view vehicle listings, and submit inquiries.
- **Admin console** — a role-gated dashboard where staff manage inventory, media, and platform content, with permissions scoped by role.

The brand identity — **Matte Black, Metallic Silver, Performance Red** — is already encoded as the design token source of truth in `src/styles/tokens.css` and mirrored in `src/lib/design-tokens.ts`. This document does not change that; it defines the system those tokens live inside.

### 1.1 Goals

- A single Next.js codebase serving both the public marketing/listings site and the internal admin console, sharing the design system.
- Vehicle inventory as the core domain object: makes/models, specs, pricing, media, availability status.
- Three-tier staff permission model (Super Admin, Admin, Employee) enforced at the database level (RLS), not just in the UI.
- Supabase as the single backend: Postgres, Auth, Storage, Realtime.
- A schema and route structure that can grow into CRM, service/workshop, and sales modules later without a rewrite.

### 1.2 Non-Goals (v1)

Explicitly deferred — see [§14 Phased Roadmap](#14-phased-roadmap):

- Sales order / invoicing / financing workflows.
- Service & workshop job-card scheduling.
- Full CRM (lead pipelines, follow-up automation).
- Multi-tenant / multi-dealership white-labeling.

These are anticipated, and the schema/role model is designed not to conflict with them, but none are built in v1.

---

## 2. Tech Stack

| Layer         | Choice                                       | Notes                                                                                                                                                |
| ------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router)                      | Server Components by default; this Next.js version has local breaking-change docs in `node_modules/next/dist/docs/` — consult before implementation. |
| Language      | TypeScript                                   | Strict mode, already configured.                                                                                                                     |
| Styling       | Tailwind CSS v4                              | Token-driven via `@theme inline` in `tokens.css`, already scaffolded.                                                                                |
| UI Primitives | shadcn/ui                                    | Generated into `src/components/ui`, treated as low-level building blocks per `src/README.md`.                                                        |
| Motion        | Framer Motion                                | Page/section transitions, gallery interactions, admin panel micro-interactions.                                                                      |
| Backend       | Supabase (Postgres, Auth, Storage, Realtime) | Project `hkmotors` (`rkedknimzyqeliswuiqz`, region `ap-southeast-1`) already provisioned, currently empty.                                           |
| Hosting       | Vercel (assumed)                             | Aligns with Next.js App Router; confirm with client if different.                                                                                    |

---

## 3. System Architecture Overview

```
                    ┌─────────────────────────────┐
                    │        Visitors (Web)        │
                    └───────────────┬──────────────┘
                                    │ HTTPS
                    ┌───────────────▼──────────────┐
                    │   Next.js 15 App (Vercel)     │
                    │                               │
                    │  Route groups:                │
                    │   (public)  → listings site   │
                    │   (admin)   → staff console    │
                    │   api/      → route handlers  │
                    │   (auth)    → login/session    │
                    └───────────────┬──────────────┘
                                    │ Supabase JS client
                                    │ (anon key public, service role server-only)
                    ┌───────────────▼──────────────┐
                    │           Supabase            │
                    │  ┌─────────┐ ┌──────────────┐ │
                    │  │ Postgres│ │ Auth (JWT)    │ │
                    │  │  + RLS  │ │ + custom claim│ │
                    │  └─────────┘ │  for role     │ │
                    │  ┌─────────┐ └──────────────┘ │
                    │  │ Storage │ ┌──────────────┐ │
                    │  │ (images)│ │ Realtime      │ │
                    │  └─────────┘ │ (inventory)   │ │
                    │               └──────────────┘ │
                    └───────────────────────────────┘
```

**Key principle:** the browser never trusts itself. Role checks happen in Postgres via Row-Level Security first; Next.js middleware and server-side checks are a UX layer on top, not the security boundary.

---

## 4. Roles & Permissions Model

Three roles, flat hierarchy (no per-branch or per-region scoping in v1):

| Role            | Description                                                                                            | Typical User                   |
| --------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| **Super Admin** | Full platform control, including staff/role management and destructive actions.                        | Owner / platform operator.     |
| **Admin**       | Operational control over inventory and content; cannot manage other admins or platform-level settings. | Dealership manager.            |
| **Employee**    | Day-to-day inventory data entry; scoped, non-destructive actions.                                      | Sales floor / inventory staff. |

### 4.1 Permission Matrix

| Capability                                            | Super Admin |     Admin      |                     Employee                     |
| ----------------------------------------------------- | :---------: | :------------: | :----------------------------------------------: |
| View admin console                                    |     ✅      |       ✅       |                        ✅                        |
| Create vehicle listing                                |     ✅      |       ✅       |                        ✅                        |
| Edit own-created listing                              |     ✅      |       ✅       |                        ✅                        |
| Edit any listing                                      |     ✅      |       ✅       |                        ❌                        |
| Publish / unpublish listing                           |     ✅      |       ✅       |             ❌ (submits for review)              |
| Delete listing                                        |     ✅      |       ✅       |                        ❌                        |
| Upload / delete vehicle media                         |     ✅      |       ✅       |           ✅ (upload only, no delete)            |
| Manage taxonomy (makes, models, categories, features) |     ✅      |       ✅       |                        ❌                        |
| View inquiries/leads                                  |     ✅      |       ✅       | ✅ (assigned only, if assignment is added later) |
| Respond to inquiries                                  |     ✅      |       ✅       |                        ✅                        |
| Invite / manage Employee accounts                     |     ✅      |       ✅       |                        ❌                        |
| Invite / manage Admin accounts                        |     ✅      |       ❌       |                        ❌                        |
| Manage Super Admin accounts                           |     ✅      |       ❌       |                        ❌                        |
| View audit log                                        |     ✅      | ✅ (own scope) |                        ❌                        |
| Site-wide settings (branding, SEO, contact info)      |     ✅      |       ❌       |                        ❌                        |
| Access billing / Supabase project settings            |     ✅      |       ❌       |                        ❌                        |

This matrix is the source of truth for both RLS policies (§6.3) and UI gating (§9.4) — the two must never diverge.

### 4.2 Role Storage

- Role is stored in a `profiles` table (one row per authenticated user, keyed to `auth.users.id`), **not** solely in Supabase Auth metadata, so it can be joined, audited, and queried like any other data.
- A Postgres trigger mirrors the role into a JWT custom claim on token issuance/refresh, so RLS policies can read `auth.jwt() ->> 'role'` without a subquery on every check — cheaper and avoids recursive-RLS pitfalls when policies on `profiles` would otherwise need to query `profiles` itself.

---

## 5. Domain Model

### 5.1 Entity Overview

```
profiles (staff accounts)
   │
   │ created_by / updated_by
   ▼
vehicles ──────< vehicle_images
   │        \
   │         >── vehicle_features (join table → features)
   │
   ├──> makes ──< models
   ├──> categories        (e.g. Sedan, SUV, Coupe)
   └──< inquiries          (public → vehicle)

audit_log (references any of the above by table + row id)
site_settings (singleton row, Super Admin only)
```

### 5.2 Core Tables (conceptual)

**`profiles`**

| Column                  | Type                               | Notes                                          |
| ----------------------- | ---------------------------------- | ---------------------------------------------- |
| id                      | uuid (PK, = auth.users.id)         |                                                |
| full_name               | text                               |                                                |
| email                   | text                               | mirrored from auth.users for convenience/joins |
| role                    | enum: super_admin, admin, employee |                                                |
| status                  | enum: active, suspended            | Super Admin can suspend without deleting       |
| created_at / updated_at | timestamptz                        |                                                |

**`makes`** — vehicle manufacturers (e.g. Toyota, BMW). `id`, `name`, `slug`, `logo_url`.

**`models`** — belongs to a make. `id`, `make_id`, `name`, `slug`.

**`categories`** — body style / segment (Sedan, SUV, Truck…). `id`, `name`, `slug`.

**`vehicles`** — the core entity.

| Column                           | Type                                                   | Notes                                        |
| -------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| id                               | uuid (PK)                                              |                                              |
| make_id / model_id / category_id | uuid (FK)                                              |                                              |
| year                             | int                                                    |                                              |
| vin                              | text, unique, nullable                                 |                                              |
| title                            | text                                                   | display title, may differ from make+model    |
| slug                             | text, unique                                           | public URL                                   |
| price                            | numeric                                                |                                              |
| currency                         | text                                                   | default project currency                     |
| mileage                          | int                                                    |                                              |
| condition                        | enum: new, used, certified_pre_owned                   |                                              |
| transmission                     | enum: automatic, manual, cvt                           |                                              |
| fuel_type                        | enum: petrol, diesel, hybrid, electric                 |                                              |
| exterior_color / interior_color  | text                                                   |                                              |
| description                      | text                                                   | rich text or markdown                        |
| status                           | enum: draft, pending_review, published, sold, archived | drives the Employee-publish-workflow in §4.1 |
| featured                         | boolean                                                | homepage/hero placement                      |
| view_count                       | int                                                    | denormalized counter                         |
| created_by / updated_by          | uuid (FK → profiles)                                   | for audit + "own listing" RLS checks         |
| created_at / updated_at          | timestamptz                                            |                                              |

**`vehicle_images`** — `id`, `vehicle_id`, `storage_path`, `position` (ordering), `alt_text`, `is_primary`.

**`features`** / **`vehicle_features`** — normalized feature tags (e.g. "Sunroof", "Leather Seats") with a join table, so filtering by feature is indexable and typo-free.

**`inquiries`** — public lead capture on a listing.

| Column               | Type                           | Notes                               |
| -------------------- | ------------------------------ | ----------------------------------- |
| id                   | uuid                           |                                     |
| vehicle_id           | uuid (FK, nullable)            | nullable to allow general inquiries |
| name / email / phone | text                           |                                     |
| message              | text                           |                                     |
| status               | enum: new, contacted, closed   |                                     |
| handled_by           | uuid (FK → profiles, nullable) |                                     |
| created_at           | timestamptz                    |                                     |

**`audit_log`** — append-only.

| Column                   | Type                 | Notes                                         |
| ------------------------ | -------------------- | --------------------------------------------- |
| id                       | bigint               |                                               |
| actor_id                 | uuid (FK → profiles) |                                               |
| action                   | text                 | e.g. `vehicle.publish`, `profile.role_change` |
| entity_table / entity_id | text / uuid          |                                               |
| diff                     | jsonb                | before/after snapshot for sensitive fields    |
| created_at               | timestamptz          |                                               |

**`site_settings`** — singleton row for branding text, contact details, SEO defaults. Super Admin write access only.

### 5.3 Design Notes

- **Soft status over hard delete** for `vehicles`: `archived` status instead of row deletion, so historical inquiries and audit entries retain referential integrity. Hard delete is reserved for Super Admin/Admin per the permission matrix, and even then should archive-then-delete after a grace period (implementation detail for later).
- **`slug` fields** are generated server-side from title + year + id-suffix to guarantee uniqueness without user-visible collision errors.
- **Denormalized `view_count`** avoids a hot-path write-heavy analytics table for v1; revisit if real analytics (e.g. PostHog) are introduced.

---

## 6. Supabase Architecture

### 6.1 Auth

- Supabase Auth (email/password to start; magic link or OAuth can be added later) issues staff accounts. **Public visitors are not authenticated users** — inquiries are inserted via an RLS policy that allows anonymous `insert` only, never `select`.
- Staff accounts are provisioned by invitation (Super Admin invites Admins; Super Admin or Admin invites Employees) — there is no public staff sign-up route.
- Session handled via Supabase's SSR helpers so Server Components can read the authenticated user without a client round-trip.

### 6.2 Row-Level Security (non-negotiable)

Every table with staff or public write access has RLS **enabled**, with no table left on default-deny-bypass. General pattern:

- `profiles`: users can read their own row; Super Admin can read/write all; Admin can read all, write Employee rows only; Employee can read own row only.
- `vehicles`: public (anon) can `select` where `status = 'published'`. Staff `insert` allowed for all three roles. `update`/`delete` gated by the matrix in §4.1, using the JWT role claim plus a `created_by = auth.uid()` check for Employee's "own listing" edit rights.
- `vehicle_images`, `vehicle_features`: mirror the parent `vehicles` row's permission via a policy that joins back to `vehicles`.
- `inquiries`: anon `insert` only; `select`/`update` restricted to Admin/Super Admin (and Employee if/when assignment ships).
- `audit_log`: insert via trigger/function only (no direct client insert); `select` restricted to Admin/Super Admin.
- `site_settings`: public `select` (site needs to render contact info etc.); `update` restricted to Super Admin.

### 6.3 Storage

- Bucket `vehicle-media` (public-read, authenticated-write) for listing photos. Path convention: `vehicle-media/{vehicle_id}/{image_id}.{ext}` so cleanup on vehicle deletion is a prefix operation.
- Upload restricted to authenticated staff via Storage RLS mirroring the `vehicle_images` table policy; delete restricted per §4.1 (Employee: upload only).
- Image variants (thumbnail/hero/full) handled via Next.js `<Image>` + a remote loader against the Storage public URL rather than pre-generating multiple files, unless CDN transform costs later justify it.

### 6.4 Realtime

- `vehicles` table subscribed on the admin inventory list so concurrent staff editing the same list see status changes (e.g. "sold") live — prevents duplicate outreach on a vehicle another employee just marked sold.
- Not used on the public site in v1 (no need for live-updating listings for anonymous visitors; ISR/revalidation is sufficient — see §12).

### 6.5 Edge Functions

- None required for v1. Candidate future use: transactional email on new inquiry, image processing webhook. Documented here so the boundary is intentional, not an oversight.

---

## 7. Application Structure (Next.js)

Route groups keep the public site and admin console visually and logically separate while sharing the same design tokens and component library.

```
src/app/
  (public)/                  # public site — SSR/ISR, SEO-optimized
    page.tsx                 # homepage
    inventory/
      page.tsx               # listing grid + filters
      [slug]/page.tsx         # vehicle detail
    about/, contact/
  (auth)/
    login/page.tsx           # staff login only — no public signup
  (admin)/
    layout.tsx               # role-gated shell (sidebar, topbar)
    dashboard/page.tsx
    inventory/
      page.tsx                # table view, RLS + UI both scope by role
      new/page.tsx
      [id]/edit/page.tsx
    inquiries/page.tsx
    staff/                    # Admin/Super Admin only (route + RLS enforced)
      page.tsx
    settings/page.tsx         # Super Admin only
  api/
    revalidate/route.ts       # on-demand ISR trigger after publish
    inquiries/route.ts        # optional: server-side validation before insert
```

This maps onto the existing scaffolded structure in `src/README.md` — `features/` gets one subfolder per domain concern (`features/inventory`, `features/inquiries`, `features/staff`), each colocating its components, hooks, and Supabase queries, consumed by the thin route files above.

### 7.1 Data Access Pattern

- **Server Components** read directly via a server-side Supabase client for initial page data — no client-side fetch waterfall for first paint.
- **Server Actions** handle mutations (create/update/delete vehicle, respond to inquiry) so the RLS-authenticated Supabase call happens server-side, and forms degrade gracefully without client JS.
- **`services/`** (per existing scaffold) holds typed query/mutation functions per entity (`services/vehicles.ts`, `services/inquiries.ts`) — both Server Components and Server Actions call into these rather than embedding raw Supabase calls inline, keeping RLS-dependent query shapes in one place per table.
- Client-side Supabase (anon key) is used only where interactivity requires it (e.g. Realtime subscription on the admin inventory list, live filter UI) — never for anything RLS wouldn't already allow anonymously.
- **`store/`** (Zustand, per existing scaffold) is reserved for ephemeral client UI state (filter panel open/close, multi-step form drafts) — never for data that Postgres/RLS should be the source of truth for.

### 7.2 Middleware

Next.js middleware performs a **cheap, UX-level** check: is there a valid session, and does the JWT role claim satisfy the route's minimum role (e.g. `(admin)/staff` requires admin+)? On failure, redirect to `/login`. This is a UX shortcut, not the security boundary — RLS in §6.2 is what actually prevents unauthorized data access even if middleware were misconfigured or bypassed.

---

## 8. Design System Integration

The brand system is already implemented and should be treated as the constraint, not a starting point:

- `src/styles/tokens.css` — Matte Black background (`#050505`), Performance Red primary (`#c00000`), Metallic Silver secondary (`#d9d9d9`), plus semantic roles (success/warning/destructive), chart palette, and an enterprise sidebar palette already tuned for the admin console.
- `src/lib/design-tokens.ts` — TS mirror for non-CSS contexts (`<meta theme-color>`, canvas/chart rendering).
- shadcn/ui components in `src/components/ui` consume these tokens via the `@theme inline` mapping — new components should extend, not override, this mapping.
- Framer Motion usage should be deliberate and brand-appropriate: subtle elevation/hover transitions on vehicle cards, gallery crossfades, and admin panel state transitions (not decorative animation on every element) — consistent with a "performance/luxury" brand rather than a playful one.

---

## 9. Security Architecture

1. **RLS is the source of truth** for every access decision (§6.2). UI/middleware checks exist only to avoid showing staff controls they can't use — never to gate what the database itself would allow.
2. **Service role key** (Supabase) is never exposed to the client; used only in trusted server contexts (Server Actions, route handlers) for the rare operation RLS can't express cleanly (e.g. audit log writes via a `SECURITY DEFINER` function).
3. **Input validation** at the Server Action boundary (schema validation before any Supabase call) for both staff forms and the public inquiry form — treat the public inquiry endpoint as the platform's primary untrusted-input surface.
4. **Audit trail** (§5.2 `audit_log`) covers role changes, publish/unpublish, and deletions at minimum — Super Admin and Admin actions are attributable.
5. **Rate limiting** on the public inquiry submission and login routes to deter spam/brute-force (Vercel/edge-level or a lightweight Postgres-backed counter — decide at implementation time).
6. **Least privilege for Employees** is enforced doubly: RLS restricts `update`/`delete` scope, and the `pending_review` status (§5.2) means an Employee's new listing doesn't go public without Admin/Super Admin sign-off.

---

## 10. Performance & SEO

- Public inventory pages use **ISR** (revalidate on publish via `api/revalidate`, plus a time-based fallback) rather than full SSR-per-request, since listings change on staff action, not per-visitor.
- Vehicle detail pages emit `schema.org/Vehicle` structured data for search engine rich results.
- Images served through Next.js `<Image>` against Supabase Storage public URLs, with explicit width/height to avoid layout shift — critical for a media-heavy listings grid.
- Sitemap generated from published vehicles (`app/sitemap.ts`) so new listings are discoverable without manual submission.

---

## 11. Environments & Deployment

| Environment | Next.js                    | Supabase                                                                                                                   |
| ----------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Local dev   | `next dev`                 | Supabase local stack (CLI) or a dedicated dev branch, per Supabase MCP guidance to prefer local dev before touching remote |
| Staging     | Vercel preview deployments | Supabase branch (via `create_branch`) per PR/feature, merged via `merge_branch`                                            |
| Production  | Vercel production          | `hkmotors` project (`rkedknimzyqeliswuiqz`)                                                                                |

Schema changes ship as versioned Supabase migrations (`list_migrations`/`apply_migration`), never hand-edited directly against production — this keeps `staging` and `production` schemas provably identical before a merge.

---

## 12. Observability

- **Supabase**: `get_advisors` run after every schema migration (security + performance linting is free and catches missing RLS/indexes before launch). `get_logs` as first stop for backend incident triage.
- **Application errors**: an error-tracking provider (e.g. Sentry) is recommended for the admin console specifically — staff-facing errors need attribution (which user, which action) more than public-site errors do.
- **Audit log** (§5.2) doubles as a lightweight activity feed for Super Admin, independent of any external tool.

---

## 13. Testing Strategy

- **RLS policies**: tested directly against Postgres (as each role) rather than only through the UI — a policy bug is a security bug, not just a UI bug.
- **Server Actions / services**: unit-testable in isolation since they're plain functions wrapping typed Supabase queries (`src/test/` per existing scaffold).
- **Public inventory flows** (browse → filter → detail → inquiry submit) and **admin flows** (create → publish → edit → archive a listing, role-gated access) covered by integration/e2e tests before launch, given both are revenue-critical paths.

---

## 14. Phased Roadmap

| Phase  | Scope                                                                                       | Status        |
| ------ | ------------------------------------------------------------------------------------------- | ------------- |
| **v1** | Vehicle inventory & public listings, three-role admin console, inquiries capture            | This document |
| v2     | Lead/CRM workflows on top of `inquiries` (assignment, pipeline status, follow-up reminders) | Not started   |
| v3     | Service & workshop module (appointments, job cards, service history)                        | Not started   |
| v4     | Sales & invoicing (quotations, orders, payments)                                            | Not started   |

The v1 schema deliberately keeps `inquiries.handled_by` and `profiles.role` generic enough that v2's CRM layer extends rather than migrates them.

---

## 15. Open Decisions

These require client/product input before implementation begins:

- **Hosting confirmation**: Vercel assumed — confirm, since it affects the ISR/revalidate and Edge Function story in §6.5/§10.
- **Multi-currency / multi-region**: single currency assumed for v1 (§5.2 `vehicles.currency` field is present but unused as a selector) — confirm if HK Motors operates in more than one market.
- **Email delivery** for inquiry notifications and staff invitations — provider not yet chosen (Supabase Auth handles invitation emails out of the box; inquiry notifications need a separate transactional email provider).
- **Employee "assigned inquiries"** row in §4.1 is marked conditional — confirm whether inquiry routing/assignment is needed in v1 or deferred to v2's CRM phase.
