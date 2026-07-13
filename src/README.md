# Source structure

- `app/` — Next.js App Router routes and layouts. `app/api/` holds route handlers.
- `components/ui/` — shadcn/ui primitives (generated, treat as low-level building blocks).
- `components/layout/` — app shell pieces (headers, footers, navigation).
- `components/shared/` — reusable components shared across features.
- `features/` — feature-scoped modules (components, hooks, logic colocated per domain).
- `hooks/` — cross-feature React hooks.
- `lib/` — framework-agnostic utilities (`utils.ts`, `design-tokens.ts`).
- `services/` — data-fetching / external API clients.
- `store/` — global client state.
- `styles/` — design tokens and global CSS (`tokens.css` is the theme source of truth).
- `types/` — shared TypeScript types.
- `constants/` — shared constant values.
- `config/` — app-level configuration (site metadata, env-driven config).
- `test/` — test setup/utilities.
