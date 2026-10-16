// In-memory read model over the demo dataset in `src/data/demo/*`.
//
// Only used when DEMO_DATA_FALLBACK=true AND a Supabase read fails (project
// paused, network down, env missing). It mirrors the filtering, sorting and
// pagination of `src/services/cars.ts` / `gallery.ts` so the public site
// behaves identically either way. With the flag unset (the default), a
// failed read keeps showing the normal empty states — real visitors are
// never shown sample stock by accident.
import { demoAlbums, demoGalleryImages } from "@/data/demo/gallery";
import {
  demoCars,
  demoCategories,
  demoFeatures,
  demoMakes,
  demoModels,
  type DemoCar,
} from "@/data/demo/inventory";

import type {
  CarDetail,
  CarFilterOptions,
  CarFilters,
  CarListItem,
  CarSort,
} from "@/services/cars";
import type { GalleryFilters, GalleryImage } from "@/services/gallery";

export function isDemoFallbackEnabled() {
  // Tolerate stray whitespace/casing from dashboard-entered values
  // ("true ", "TRUE") — anything else, including unset, means disabled.
  return process.env.DEMO_DATA_FALLBACK?.trim().toLowerCase() === "true";
}

/**
 * Logs a failed public read with its actual message and code. Supabase
 * errors are plain objects (or Error instances whose fields aren't
 * enumerable), which some log viewers render as a bare `{}`. Only the
 * message and codes are logged — never request details, URLs or keys.
 */
export function logReadFailure(context: string, err: unknown) {
  const e = (err ?? {}) as {
    message?: unknown;
    code?: unknown;
    details?: unknown;
    cause?: { code?: unknown };
  };
  const message =
    typeof e.message === "string" && e.message
      ? e.message
      : typeof err === "string"
        ? err
        : "unknown error (no message)";
  const code = typeof e.code === "string" && e.code ? e.code : undefined;
  // Network failures carry the underlying errno (ENOTFOUND, ECONNREFUSED…)
  // in `cause` (thrown) or only inside `details` (returned by postgrest-js).
  const causeCode =
    (typeof e.cause?.code === "string" ? e.cause.code : undefined) ??
    (typeof e.details === "string"
      ? e.details.match(/\((E[A-Z_]+)\)/)?.[1]
      : undefined);

  const parts = [
    message,
    code && `code=${code}`,
    causeCode && `cause=${causeCode}`,
  ]
    .filter(Boolean)
    .join(" ");

  if (isDemoFallbackEnabled()) {
    console.warn(`${context}: ${parts} — serving demo data`);
  } else {
    console.error(`${context}: ${parts}`);
  }
}

// supabase-js retries failed reads with backoff (~7s per query when the
// project is unreachable). In fallback mode, remember a failure for a few
// minutes and go straight to the demo catalogue instead of paying that
// delay on every query of every request. Per server instance, in memory.
const SUPABASE_RETRY_AFTER_MS = 5 * 60 * 1000;
let supabaseDownUntil = 0;

/** True when fallback is on and Supabase failed recently — skip the query. */
export function shouldSkipSupabase() {
  return isDemoFallbackEnabled() && Date.now() < supabaseDownUntil;
}

/**
 * Call from a failed-read branch: returns the demo result (and starts the
 * skip window) when fallback is enabled, otherwise the normal empty value.
 */
export function demoFallback<T>(demo: () => T, empty: T): T {
  if (!isDemoFallbackEnabled()) return empty;
  supabaseDownUntil = Date.now() + SUPABASE_RETRY_AFTER_MS;
  return demo();
}

const DAY_MS = 24 * 60 * 60 * 1000;

function createdAt(car: DemoCar) {
  return Date.now() - car.listedDaysAgo * DAY_MS;
}

function toListItem(car: DemoCar): CarListItem {
  return {
    id: car.id,
    title: car.title,
    slug: car.slug,
    year: car.year,
    price: car.price,
    currencyCode: car.currencyCode,
    mileage: car.mileage,
    condition: car.condition,
    makeName: demoMakes.find((m) => m.id === car.makeId)?.name ?? null,
    modelName: demoModels.find((m) => m.id === car.modelId)?.name ?? null,
    images: car.images.map((img) => ({ url: img.url })),
    hasVideo: false,
  };
}

const SORTERS: Record<CarSort, (a: DemoCar, b: DemoCar) => number> = {
  newest: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  year_desc: (a, b) => b.year - a.year,
  mileage_asc: (a, b) => a.mileage - b.mileage,
};

export function demoGetCars(filters: CarFilters, pageSize: number) {
  const page = Math.max(1, Number(filters.page) || 1);
  const q = filters.q?.toLowerCase();

  const matches = demoCars
    .filter((car) => {
      if (q && !car.title.toLowerCase().includes(q)) return false;
      if (filters.category && car.categoryId !== filters.category) {
        return false;
      }
      if (filters.brand && car.makeId !== filters.brand) return false;
      if (filters.model && car.modelId !== filters.model) return false;
      if (filters.year && car.year !== Number(filters.year)) return false;
      if (filters.priceMin && car.price < Number(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && car.price > Number(filters.priceMax)) {
        return false;
      }
      if (filters.condition && car.condition !== filters.condition) {
        return false;
      }
      return true;
    })
    .sort(SORTERS[filters.sort ?? "newest"] ?? SORTERS.newest);

  const from = (page - 1) * pageSize;
  return {
    cars: matches.slice(from, from + pageSize).map(toListItem),
    total: matches.length,
    page,
    pageSize,
  };
}

export function demoFeaturedCars(limit: number): CarListItem[] {
  return demoCars
    .filter((car) => car.isFeatured)
    .sort(SORTERS.newest)
    .slice(0, limit)
    .map(toListItem);
}

export function demoFilterOptions(): CarFilterOptions {
  const byName = <T extends { name: string }>(a: T, b: T) =>
    a.name.localeCompare(b.name);
  return {
    categories: demoCategories
      .map(({ id, name }) => ({ id, name }))
      .sort(byName),
    makes: demoMakes.map(({ id, name }) => ({ id, name })).sort(byName),
    models: demoModels
      .map(({ id, name, makeId }) => ({ id, name, make_id: makeId }))
      .sort(byName),
  };
}

export function demoCarBySlug(slug: string): CarDetail | null {
  const car = demoCars.find((c) => c.slug === slug);
  if (!car) return null;

  return {
    id: car.id,
    title: car.title,
    slug: car.slug,
    year: car.year,
    price: car.price,
    currencyCode: car.currencyCode,
    mileage: car.mileage,
    condition: car.condition,
    transmission: car.transmission,
    fuelType: car.fuelType,
    drivetrain: car.drivetrain,
    exteriorColor: car.exteriorColor,
    interiorColor: car.interiorColor,
    engine: car.engine,
    horsepower: car.horsepower,
    seats: car.seats,
    doors: car.doors,
    description: car.description,
    makeId: car.makeId,
    makeName: demoMakes.find((m) => m.id === car.makeId)?.name ?? null,
    modelName: demoModels.find((m) => m.id === car.modelId)?.name ?? null,
    categoryId: car.categoryId,
    media: car.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      mediaType: "image" as const,
    })),
    features: car.featureIds
      .map((id) => demoFeatures.find((f) => f.id === id)?.name)
      .filter((name): name is string => Boolean(name)),
  };
}

export function demoSimilarCars(
  car: Pick<CarDetail, "id" | "makeId" | "categoryId">,
  limit: number,
): CarListItem[] {
  return demoCars
    .filter(
      (c) =>
        c.id !== car.id &&
        (c.makeId === car.makeId || c.categoryId === car.categoryId),
    )
    .slice(0, limit)
    .map(toListItem);
}

export function demoCarSlugs(): { slug: string; updatedAt: string }[] {
  return demoCars.map((car) => ({
    slug: car.slug,
    updatedAt: new Date(createdAt(car)).toISOString(),
  }));
}

export function demoGallery(filters: GalleryFilters): GalleryImage[] {
  const album = filters.albumSlug
    ? demoAlbums.find((a) => a.slug === filters.albumSlug)
    : undefined;
  if (filters.albumSlug && !album) return [];

  return demoGalleryImages
    .filter((img) => !filters.category || img.category === filters.category)
    .filter((img) => !album || img.albumId === album.id)
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      id: img.id,
      url: img.url,
      caption: img.caption,
      category: img.category,
      mediaType: "image" as const,
    }));
}

export function demoAlbumOptions(): { slug: string; title: string }[] {
  return demoAlbums.map(({ slug, title }) => ({ slug, title }));
}
