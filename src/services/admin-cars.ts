import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_CARS_PAGE_SIZE = 10;

export type AdminCarFilters = {
  q?: string;
  status?: string;
  condition?: string;
  categoryId?: string;
  makeId?: string;
  modelId?: string;
  year?: string;
  page?: string;
};

export type AdminCarListItem = {
  id: string;
  title: string;
  slug: string;
  year: number;
  price: number;
  currencyCode: string;
  status: Enums<"car_status">;
  condition: Enums<"car_condition">;
  isFeatured: boolean;
  makeName: string | null;
  modelName: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  imageIsExternal: boolean;
  createdAt: string;
};

const EMPTY_RESULT = (page: number) => ({
  cars: [] as AdminCarListItem[],
  total: 0,
  page,
  pageSize: ADMIN_CARS_PAGE_SIZE,
});

export async function getAdminCars(filters: AdminCarFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getAdminCars: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * ADMIN_CARS_PAGE_SIZE;
  const to = from + ADMIN_CARS_PAGE_SIZE - 1;
  const select =
    "id, title, slug, year, price, currency_code, status, condition, is_featured, created_at, car_makes ( name ), car_models ( name ), car_categories ( name ), car_images ( storage_path, external_url, is_primary, position, media_type )";

  function applyFilters<
    T extends {
      ilike: (col: string, val: string) => T;
      eq: (col: string, val: string) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.q) query = query.ilike("title", `%${filters.q}%`);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.condition) query = query.eq("condition", filters.condition);
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.makeId) query = query.eq("make_id", filters.makeId);
    if (filters.modelId) query = query.eq("model_id", filters.modelId);
    if (filters.year) query = query.eq("year", filters.year);
    return query;
  }

  try {
    const { data, error, count } = await applyFilters(
      supabase.from("cars").select(select, { count: "exact" }),
    )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase.from("cars").select("id", { count: "exact", head: true }),
        );
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }
      console.error("getAdminCars failed", error);
      return EMPTY_RESULT(page);
    }

    const cars: AdminCarListItem[] = (data ?? []).map((row) => {
      const media = row.car_images ?? [];
      const primaryImage =
        media
          .filter((m) => m.media_type === "image")
          .slice()
          .sort((a, b) => {
            if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
            return a.position - b.position;
          })[0] ?? null;
      const imageUrl = primaryImage
        ? (primaryImage.external_url ??
          supabase.storage
            .from("cars")
            .getPublicUrl(primaryImage.storage_path ?? "").data.publicUrl)
        : null;

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        year: row.year,
        price: row.price,
        currencyCode: row.currency_code,
        status: row.status,
        condition: row.condition,
        isFeatured: row.is_featured,
        makeName: row.car_makes?.name ?? null,
        modelName: row.car_models?.name ?? null,
        categoryName: row.car_categories?.name ?? null,
        imageUrl,
        imageIsExternal: primaryImage?.external_url != null,
        createdAt: row.created_at,
      };
    });

    return { cars, total: count ?? 0, page, pageSize: ADMIN_CARS_PAGE_SIZE };
  } catch (err) {
    console.error("getAdminCars: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export type CarFormOptions = {
  makes: { id: string; name: string }[];
  models: { id: string; name: string; make_id: string }[];
  categories: { id: string; name: string }[];
};

export async function getCarFormOptions(): Promise<CarFormOptions> {
  try {
    const supabase = createAdminClient();
    const [{ data: makes }, { data: models }, { data: categories }] =
      await Promise.all([
        supabase.from("car_makes").select("id, name").order("name"),
        supabase.from("car_models").select("id, name, make_id").order("name"),
        supabase.from("car_categories").select("id, name").order("name"),
      ]);

    return {
      makes: makes ?? [],
      models: models ?? [],
      categories: categories ?? [],
    };
  } catch (err) {
    console.error("getCarFormOptions failed", err);
    return { makes: [], models: [], categories: [] };
  }
}

export type AdminCarDetail = {
  id: string;
  title: string;
  slug: string;
  makeId: string;
  modelId: string;
  categoryId: string | null;
  makeName: string | null;
  modelName: string | null;
  categoryName: string | null;
  year: number;
  vin: string | null;
  price: number;
  currencyCode: string;
  mileage: number | null;
  condition: Enums<"car_condition">;
  status: Enums<"car_status">;
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
  isFeatured: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCarImage = {
  id: string;
  url: string;
  storagePath: string | null;
  externalUrl: string | null;
  altText: string | null;
  position: number;
  isPrimary: boolean;
  mediaType: Enums<"gallery_media_type">;
  createdAt: string;
};

// Wrapped in React's cache() — generateMetadata and the page body both
// call this for the same id within one request.
export const getAdminCarById = cache(async function getAdminCarById(
  id: string,
): Promise<{
  car: AdminCarDetail;
  images: AdminCarImage[];
} | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cars")
      .select(
        `id, title, slug, make_id, model_id, category_id, year, vin, price,
         currency_code, mileage, condition, status, transmission, fuel_type,
         drivetrain, exterior_color, interior_color, engine, horsepower,
         seats, doors, description, is_featured, created_at, updated_at,
         car_makes ( name ), car_models ( name ), car_categories ( name ),
         car_images ( id, storage_path, external_url, alt_text, position, is_primary, media_type, created_at ),
         car_feature_map ( car_features ( name ) )`,
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getAdminCarById failed", error);
      return null;
    }

    const images: AdminCarImage[] = (data.car_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        id: img.id,
        url:
          img.external_url ??
          supabase.storage.from("cars").getPublicUrl(img.storage_path ?? "")
            .data.publicUrl,
        storagePath: img.storage_path,
        externalUrl: img.external_url,
        altText: img.alt_text,
        position: img.position,
        isPrimary: img.is_primary,
        mediaType: img.media_type,
        createdAt: img.created_at,
      }));

    const features = (data.car_feature_map ?? [])
      .map((f) => f.car_features?.name)
      .filter((name): name is string => Boolean(name));

    return {
      car: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        makeId: data.make_id,
        modelId: data.model_id,
        categoryId: data.category_id,
        makeName: data.car_makes?.name ?? null,
        modelName: data.car_models?.name ?? null,
        categoryName: data.car_categories?.name ?? null,
        year: data.year,
        vin: data.vin,
        price: data.price,
        currencyCode: data.currency_code,
        mileage: data.mileage,
        condition: data.condition,
        status: data.status,
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
        isFeatured: data.is_featured,
        features,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
      images,
    };
  } catch (err) {
    console.error("getAdminCarById: unexpected failure", err);
    return null;
  }
});
