import { createClient } from "@/lib/supabase/server";

import type { Enums } from "@/types/supabase";

export const CARS_PAGE_SIZE = 12;

export type CarSort =
  "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";

export type CarFilters = {
  q?: string;
  category?: string; // car_categories.id
  brand?: string; // car_makes.id
  model?: string; // car_models.id
  year?: string;
  priceMin?: string;
  priceMax?: string;
  condition?: string;
  sort?: CarSort;
  page?: string;
};

export type CarListItem = {
  id: string;
  title: string;
  slug: string;
  year: number;
  price: number;
  currencyCode: string;
  mileage: number | null;
  condition: Enums<"car_condition">;
  makeName: string | null;
  modelName: string | null;
  images: { url: string }[];
  hasVideo: boolean;
};

type CarListRow = {
  id: string;
  title: string;
  slug: string;
  year: number;
  price: number;
  currency_code: string;
  mileage: number | null;
  condition: Enums<"car_condition">;
  car_makes: { name: string } | null;
  car_models: { name: string } | null;
  car_images: {
    storage_path: string | null;
    external_url: string | null;
    is_primary: boolean;
    position: number;
    media_type: Enums<"gallery_media_type">;
  }[];
};

const CAR_LIST_SELECT =
  `id, title, slug, year, price, currency_code, mileage, condition,
   car_makes ( name ), car_models ( name ),
   car_images ( storage_path, external_url, is_primary, position, media_type )` as const;

// `published_at` isn't guaranteed to be set (no trigger stamps it on
// publish yet), so "newest" sorts by `created_at`, which always is.
const SORT_MAP: Record<CarSort, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  price_asc: { column: "price", ascending: true },
  price_desc: { column: "price", ascending: false },
  year_desc: { column: "year", ascending: false },
  mileage_asc: { column: "mileage", ascending: true },
};

function mapCarListRow(
  row: CarListRow,
  supabase: ReturnType<typeof createClient>,
): CarListItem {
  const media = Array.isArray(row.car_images) ? row.car_images : [];
  const images = media
    .filter((m) => m.media_type === "image")
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.position - b.position;
    })
    .map((img) => ({
      url:
        img.external_url ??
        supabase.storage.from("cars").getPublicUrl(img.storage_path ?? "").data
          .publicUrl,
    }));
  const hasVideo = media.some((m) => m.media_type === "video");

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    year: row.year,
    price: row.price,
    currencyCode: row.currency_code,
    mileage: row.mileage,
    condition: row.condition,
    makeName: row.car_makes?.name ?? null,
    modelName: row.car_models?.name ?? null,
    images,
    hasVideo,
  };
}

const EMPTY_CARS_RESULT = (page: number) => ({
  cars: [] as CarListItem[],
  total: 0,
  page,
  pageSize: CARS_PAGE_SIZE,
});

export async function getCars(filters: CarFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient();
  } catch (err) {
    // Misconfigured/unavailable Supabase shouldn't crash the whole page —
    // render the existing "no results" empty state instead.
    console.error("getCars: Supabase client unavailable", err);
    return EMPTY_CARS_RESULT(page);
  }

  const from = (page - 1) * CARS_PAGE_SIZE;
  const to = from + CARS_PAGE_SIZE - 1;
  const sort = SORT_MAP[filters.sort ?? "newest"] ?? SORT_MAP.newest;

  function applyFilters<
    T extends {
      ilike: (col: string, val: string) => T;
      eq: (col: string, val: string | number) => T;
      gte: (col: string, val: number) => T;
      lte: (col: string, val: number) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.q) query = query.ilike("title", `%${filters.q}%`);
    if (filters.category) query = query.eq("category_id", filters.category);
    if (filters.brand) query = query.eq("make_id", filters.brand);
    if (filters.model) query = query.eq("model_id", filters.model);
    if (filters.year) query = query.eq("year", Number(filters.year));
    if (filters.priceMin) query = query.gte("price", Number(filters.priceMin));
    if (filters.priceMax) query = query.lte("price", Number(filters.priceMax));
    if (filters.condition) {
      query = query.eq("condition", filters.condition);
    }
    return query;
  }

  try {
    let query = applyFilters(
      supabase
        .from("cars")
        .select(CAR_LIST_SELECT, { count: "exact" })
        .eq("status", "published"),
    );

    query = query
      .order(sort.column, { ascending: sort.ascending })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      // A page beyond the last available row (e.g. filters just narrowed
      // the result set) isn't a real failure — PostgREST reports it as a
      // range error instead of an empty page. Get the real count
      // separately so the UI renders "no results" instead of erroring.
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase
            .from("cars")
            .select("id", { count: "exact", head: true })
            .eq("status", "published"),
        );
        return { ...EMPTY_CARS_RESULT(page), total: total ?? 0 };
      }

      console.error("getCars failed", error);
      return EMPTY_CARS_RESULT(page);
    }

    const cars = (data ?? []).map((row) => mapCarListRow(row, supabase));

    return { cars, total: count ?? 0, page, pageSize: CARS_PAGE_SIZE };
  } catch (err) {
    console.error("getCars: unexpected failure", err);
    return EMPTY_CARS_RESULT(page);
  }
}

export async function getFeaturedCars(limit = 12): Promise<CarListItem[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("cars")
      .select(CAR_LIST_SELECT)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getFeaturedCars failed", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((row) => mapCarListRow(row, supabase));
    }

    // No cars marked featured yet — fall back to the latest published
    // vehicles so the homepage section isn't empty.
    const { data: latest, error: latestError } = await supabase
      .from("cars")
      .select(CAR_LIST_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (latestError || !latest) {
      if (latestError)
        console.error("getFeaturedCars fallback failed", latestError);
      return [];
    }

    return latest.map((row) => mapCarListRow(row, supabase));
  } catch (err) {
    console.error("getFeaturedCars: unexpected failure", err);
    return [];
  }
}

export type CarFilterOptions = {
  categories: { id: string; name: string }[];
  makes: { id: string; name: string }[];
  models: { id: string; name: string; make_id: string }[];
};

export async function getCarFilterOptions(): Promise<CarFilterOptions> {
  try {
    const supabase = createClient();
    const [{ data: categories }, { data: makes }, { data: models }] =
      await Promise.all([
        supabase.from("car_categories").select("id, name").order("name"),
        supabase.from("car_makes").select("id, name").order("name"),
        supabase.from("car_models").select("id, name, make_id").order("name"),
      ]);

    return {
      categories: categories ?? [],
      makes: makes ?? [],
      models: models ?? [],
    };
  } catch (err) {
    console.error("getCarFilterOptions failed", err);
    return { categories: [], makes: [], models: [] };
  }
}

export type CarDetail = {
  id: string;
  title: string;
  slug: string;
  year: number;
  price: number;
  currencyCode: string;
  mileage: number | null;
  condition: Enums<"car_condition">;
  transmission: Enums<"transmission_type"> | null;
  fuelType: Enums<"fuel_type"> | null;
  drivetrain: Enums<"drivetrain_type"> | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  engine: string | null;
  horsepower: number | null;
  seats: number | null;
  doors: number | null;
  description: string | null;
  makeId: string;
  makeName: string | null;
  modelName: string | null;
  categoryId: string | null;
  media: {
    url: string;
    alt: string | null;
    mediaType: Enums<"gallery_media_type">;
  }[];
  features: string[];
};

export async function getCarBySlug(slug: string): Promise<CarDetail | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("cars")
      .select(
        `id, title, slug, year, price, currency_code, mileage, condition,
         transmission, fuel_type, drivetrain, exterior_color, interior_color,
         engine, horsepower, seats, doors, description, make_id, category_id,
         car_makes ( name ), car_models ( name ),
         car_images ( storage_path, external_url, alt_text, position, is_primary, media_type ),
         car_feature_map ( car_features ( name ) )`,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getCarBySlug failed", error);
      return null;
    }

    const media = (data.car_images ?? [])
      .slice()
      .sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return a.position - b.position;
      })
      .map((img) => ({
        url:
          img.external_url ??
          supabase.storage.from("cars").getPublicUrl(img.storage_path ?? "")
            .data.publicUrl,
        alt: img.alt_text,
        mediaType: img.media_type,
      }));

    const features = (data.car_feature_map ?? [])
      .map((f) => f.car_features?.name)
      .filter((name): name is string => Boolean(name));

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      year: data.year,
      price: data.price,
      currencyCode: data.currency_code,
      mileage: data.mileage,
      condition: data.condition,
      transmission: data.transmission,
      fuelType: data.fuel_type,
      drivetrain: data.drivetrain,
      exteriorColor: data.exterior_color,
      interiorColor: data.interior_color,
      engine: data.engine,
      horsepower: data.horsepower,
      seats: data.seats,
      doors: data.doors,
      description: data.description,
      makeId: data.make_id,
      makeName: data.car_makes?.name ?? null,
      modelName: data.car_models?.name ?? null,
      categoryId: data.category_id,
      media,
      features,
    };
  } catch (err) {
    console.error("getCarBySlug: unexpected failure", err);
    return null;
  }
}

export async function getSimilarCars(
  car: Pick<CarDetail, "id" | "makeId" | "categoryId">,
  limit = 3,
): Promise<CarListItem[]> {
  try {
    const supabase = createClient();

    let query = supabase
      .from("cars")
      .select(CAR_LIST_SELECT)
      .eq("status", "published")
      .neq("id", car.id)
      .limit(limit);

    query = car.categoryId
      ? query.or(`category_id.eq.${car.categoryId},make_id.eq.${car.makeId}`)
      : query.eq("make_id", car.makeId);

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => mapCarListRow(row, supabase));
  } catch (err) {
    console.error("getSimilarCars: unexpected failure", err);
    return [];
  }
}

// Lightweight — for the sitemap only, no joins/images.
export async function getAllPublishedCarSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cars")
      .select("slug, updated_at")
      .eq("status", "published");

    if (error || !data) return [];
    return data.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
  } catch (err) {
    console.error("getAllPublishedCarSlugs: unexpected failure", err);
    return [];
  }
}
