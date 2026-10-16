// Deterministic UUIDs for demo records. Every demo row's id starts with
// `de30` so it can be told apart from real client data at a glance (and
// removed in one pass by `npm run seed:demo -- --remove`).
//
// Kept dependency-free (no path aliases) so `scripts/seed-demo.mjs` can
// import it directly with Node's built-in TypeScript type stripping.

export const DEMO_ID_PREFIX = "de30";

export const DEMO_TABLE = {
  makes: 1,
  models: 2,
  categories: 3,
  features: 4,
  cars: 5,
  carImages: 6,
  albums: 7,
  galleryImages: 8,
} as const;

export function demoId(table: number, n: number): string {
  const t = String(table).padStart(2, "0");
  const seq = String(n).padStart(12, "0");
  return `${DEMO_ID_PREFIX}${t}00-0000-4000-8000-${seq}`;
}

export function isDemoId(id: string): boolean {
  return id.startsWith(DEMO_ID_PREFIX);
}

/** Unsplash CDN URL (free Unsplash License) at a sensible display width. */
export function unsplash(photoId: string, width = 1600): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}
