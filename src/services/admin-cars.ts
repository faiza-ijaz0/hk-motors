import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_CARS_PAGE_SIZE = 10;

export type AdminCarFilters = {
  q?: string;
  status?: string;
  condition?: string;
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
    "id, title, slug, year, price, currency_code, status, condition, is_featured, created_at, car_makes ( name ), car_models ( name )";

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

    const cars: AdminCarListItem[] = (data ?? []).map((row) => ({
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
      createdAt: row.created_at,
    }));

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
};

export type AdminCarImage = {
  id: string;
  url: string;
  storagePath: string;
  altText: string | null;
  position: number;
  isPrimary: boolean;
};

export async function getAdminCarById(id: string): Promise<{
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
         seats, doors, description, is_featured,
         car_images ( id, storage_path, alt_text, position, is_primary )`,
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
        url: supabase.storage.from("cars").getPublicUrl(img.storage_path).data
          .publicUrl,
        storagePath: img.storage_path,
        altText: img.alt_text,
        position: img.position,
        isPrimary: img.is_primary,
      }));

    return {
      car: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        makeId: data.make_id,
        modelId: data.model_id,
        categoryId: data.category_id,
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
      },
      images,
    };
  } catch (err) {
    console.error("getAdminCarById: unexpected failure", err);
    return null;
  }
}
