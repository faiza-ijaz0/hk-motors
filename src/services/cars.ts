import { createClient } from "@/lib/supabase/server";

import type { Enums } from "@/types/supabase";

export const CARS_PAGE_SIZE = 12;

export type CarSort =
  "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";

export type CarFilters = {
  q?: string;
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
  imageUrl: string | null;
};

// `published_at` isn't guaranteed to be set (no trigger stamps it on
// publish yet), so "newest" sorts by `created_at`, which always is.
const SORT_MAP: Record<CarSort, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  price_asc: { column: "price", ascending: true },
  price_desc: { column: "price", ascending: false },
  year_desc: { column: "year", ascending: false },
  mileage_asc: { column: "mileage", ascending: true },
};

export async function getCars(filters: CarFilters) {
  const supabase = createClient();
  const page = Math.max(1, Number(filters.page) || 1);
  const from = (page - 1) * CARS_PAGE_SIZE;
  const to = from + CARS_PAGE_SIZE - 1;
  const sort = SORT_MAP[filters.sort ?? "newest"] ?? SORT_MAP.newest;

  let query = supabase
    .from("cars")
    .select(
      `id, title, slug, year, price, currency_code, mileage, condition,
       car_makes ( name ), car_models ( name ),
       car_images ( storage_path, is_primary, position )`,
      { count: "exact" },
    )
    .eq("status", "published");

  if (filters.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters.brand) query = query.eq("make_id", filters.brand);
  if (filters.model) query = query.eq("model_id", filters.model);
  if (filters.year) query = query.eq("year", Number(filters.year));
  if (filters.priceMin) query = query.gte("price", Number(filters.priceMin));
  if (filters.priceMax) query = query.lte("price", Number(filters.priceMax));
  if (filters.condition) {
    query = query.eq("condition", filters.condition as Enums<"car_condition">);
  }

  query = query
    .order(sort.column, { ascending: sort.ascending })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    // A page beyond the last available row (e.g. filters just narrowed the
    // result set) isn't a real failure — PostgREST reports it as a range
    // error instead of an empty page. Get the real count separately so the
    // UI can render its normal "no results" state instead of erroring.
    if (error.code === "PGRST103") {
      let countQuery = supabase
        .from("cars")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");

      if (filters.q) countQuery = countQuery.ilike("title", `%${filters.q}%`);
      if (filters.brand) countQuery = countQuery.eq("make_id", filters.brand);
      if (filters.model) countQuery = countQuery.eq("model_id", filters.model);
      if (filters.year)
        countQuery = countQuery.eq("year", Number(filters.year));
      if (filters.priceMin) {
        countQuery = countQuery.gte("price", Number(filters.priceMin));
      }
      if (filters.priceMax) {
        countQuery = countQuery.lte("price", Number(filters.priceMax));
      }
      if (filters.condition) {
        countQuery = countQuery.eq(
          "condition",
          filters.condition as Enums<"car_condition">,
        );
      }

      const { count: total } = await countQuery;
      return {
        cars: [] as CarListItem[],
        total: total ?? 0,
        page,
        pageSize: CARS_PAGE_SIZE,
      };
    }

    console.error("getCars failed", error);
    return {
      cars: [] as CarListItem[],
      total: 0,
      page,
      pageSize: CARS_PAGE_SIZE,
    };
  }

  const cars: CarListItem[] = (data ?? []).map((row) => {
    const images = Array.isArray(row.car_images) ? row.car_images : [];
    const primary =
      images.find((img) => img.is_primary) ??
      [...images].sort((a, b) => a.position - b.position)[0];
    const imageUrl = primary
      ? supabase.storage.from("cars").getPublicUrl(primary.storage_path).data
          .publicUrl
      : null;

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
      imageUrl,
    };
  });

  return { cars, total: count ?? 0, page, pageSize: CARS_PAGE_SIZE };
}

export type CarFilterOptions = {
  makes: { id: string; name: string }[];
  models: { id: string; name: string; make_id: string }[];
};

export async function getCarFilterOptions(): Promise<CarFilterOptions> {
  const supabase = createClient();

  const [{ data: makes }, { data: models }] = await Promise.all([
    supabase.from("car_makes").select("id, name").order("name"),
    supabase.from("car_models").select("id, name, make_id").order("name"),
  ]);

  return { makes: makes ?? [], models: models ?? [] };
}
