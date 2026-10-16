// Seeds (or removes) HK Motors demo content in Supabase.
//
//   npm run seed:demo              insert/update demo cars + gallery
//   npm run seed:demo -- --remove  delete every demo record again
//
// Safe to re-run: every demo row has a fixed id starting with `de30`
// (src/data/demo/ids.ts), so runs upsert the same rows instead of
// duplicating them. Real client data is never updated or deleted:
//   - existing makes/models/categories/features are matched by slug and
//     reused, never overwritten;
//   - a car or album whose slug is already taken by a non-demo record is
//     skipped;
//   - --remove only deletes rows whose id carries the demo prefix, and
//     leaves shared taxonomy in place if real cars reference it.
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (read from
// .env.local by the npm script). Requires Node 22.18+ / 23.6+ for built-in
// TypeScript type stripping of the shared data files.

import { createClient } from "@supabase/supabase-js";

import { demoAlbums, demoGalleryImages } from "../src/data/demo/gallery.ts";
import { isDemoId } from "../src/data/demo/ids.ts";
import {
  demoCars,
  demoCategories,
  demoFeatures,
  demoMakes,
  demoModels,
} from "../src/data/demo/inventory.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Add them to .env.local (see .env.example).",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const log = (msg) => process.stdout.write(`${msg}\n`);

function check(error, context) {
  if (error) throw new Error(`${context}: ${error.message}`);
}

/**
 * Inserts taxonomy rows that don't exist yet (matched by slug, plus parent
 * column for models) and returns demoId -> actualId, so cars point at the
 * client's existing "Toyota" row instead of creating a second one.
 */
async function ensureTaxonomy(table, rows, matchColumns = ["slug"]) {
  const idMap = new Map();
  for (const row of rows) {
    let query = supabase.from(table).select("id");
    for (const col of matchColumns) query = query.eq(col, row[col]);
    const { data: existing, error } = await query.maybeSingle();
    check(error, `${table} lookup (${row.slug})`);

    if (existing) {
      idMap.set(row.id, existing.id);
      continue;
    }
    const { error: insertError } = await supabase.from(table).insert(row);
    check(insertError, `${table} insert (${row.slug})`);
    idMap.set(row.id, row.id);
  }
  return idMap;
}

async function seed() {
  const makeIds = await ensureTaxonomy(
    "car_makes",
    demoMakes.map((m) => ({ id: m.id, name: m.name, slug: m.slug })),
  );
  const modelIds = await ensureTaxonomy(
    "car_models",
    demoModels.map((m) => ({
      id: m.id,
      make_id: makeIds.get(m.makeId),
      name: m.name,
      slug: m.slug,
    })),
    ["make_id", "slug"],
  );
  const categoryIds = await ensureTaxonomy(
    "car_categories",
    demoCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  );
  const featureIds = await ensureTaxonomy(
    "car_features",
    demoFeatures.map((f) => ({ id: f.id, name: f.name, slug: f.slug })),
  );
  log(
    `Taxonomy ready: ${makeIds.size} makes, ${modelIds.size} models, ` +
      `${categoryIds.size} categories, ${featureIds.size} features`,
  );

  // Cars ------------------------------------------------------------------
  const seededCarIds = [];
  for (const car of demoCars) {
    const { data: clash, error } = await supabase
      .from("cars")
      .select("id")
      .eq("slug", car.slug)
      .maybeSingle();
    check(error, `cars lookup (${car.slug})`);
    if (clash && !isDemoId(clash.id)) {
      log(`  skip ${car.slug} — slug belongs to a real listing`);
      continue;
    }

    const listedAt = new Date(
      Date.now() - car.listedDaysAgo * 86_400_000,
    ).toISOString();
    const { error: upsertError } = await supabase.from("cars").upsert({
      id: car.id,
      slug: car.slug,
      title: car.title,
      make_id: makeIds.get(car.makeId),
      model_id: modelIds.get(car.modelId),
      category_id: categoryIds.get(car.categoryId),
      year: car.year,
      price: car.price,
      currency_code: car.currencyCode,
      mileage: car.mileage,
      condition: car.condition,
      status: "published",
      transmission: car.transmission,
      fuel_type: car.fuelType,
      drivetrain: car.drivetrain,
      engine: car.engine,
      horsepower: car.horsepower,
      exterior_color: car.exteriorColor,
      interior_color: car.interiorColor,
      seats: car.seats,
      doors: car.doors,
      description: car.description,
      is_featured: car.isFeatured,
      view_count: car.viewCount,
      created_at: listedAt,
      published_at: listedAt,
    });
    check(upsertError, `cars upsert (${car.slug})`);

    // Images and features belong solely to this demo car, so replacing
    // them wholesale keeps re-runs in sync with the data file.
    check(
      (await supabase.from("car_images").delete().eq("car_id", car.id)).error,
      `car_images reset (${car.slug})`,
    );
    check(
      (
        await supabase.from("car_images").insert(
          car.images.map((img, position) => ({
            id: img.id,
            car_id: car.id,
            external_url: img.url,
            storage_path: null,
            alt_text: img.alt,
            position,
            is_primary: position === 0,
            media_type: "image",
          })),
        )
      ).error,
      `car_images insert (${car.slug})`,
    );

    check(
      (await supabase.from("car_feature_map").delete().eq("car_id", car.id))
        .error,
      `car_feature_map reset (${car.slug})`,
    );
    check(
      (
        await supabase.from("car_feature_map").insert(
          car.featureIds.map((featureId) => ({
            car_id: car.id,
            feature_id: featureIds.get(featureId),
          })),
        )
      ).error,
      `car_feature_map insert (${car.slug})`,
    );

    seededCarIds.push(car.id);
  }
  log(`Cars upserted: ${seededCarIds.length}/${demoCars.length}`);

  // Gallery ---------------------------------------------------------------
  let albumCount = 0;
  let imageCount = 0;
  for (const album of demoAlbums) {
    const { data: clash, error } = await supabase
      .from("gallery_albums")
      .select("id")
      .eq("slug", album.slug)
      .maybeSingle();
    check(error, `gallery_albums lookup (${album.slug})`);
    if (clash && !isDemoId(clash.id)) {
      log(`  skip album ${album.slug} — slug belongs to a real album`);
      continue;
    }

    const images = demoGalleryImages.filter((img) => img.albumId === album.id);
    check(
      (
        await supabase.from("gallery_albums").upsert({
          id: album.id,
          slug: album.slug,
          title: album.title,
          description: album.description,
          position: album.position,
          is_published: true,
          cover_image_path: images[0]?.url ?? null,
        })
      ).error,
      `gallery_albums upsert (${album.slug})`,
    );
    check(
      (
        await supabase.from("gallery_images").upsert(
          images.map((img) => ({
            id: img.id,
            album_id: album.id,
            external_url: img.url,
            storage_path: null,
            caption: img.caption,
            category: img.category,
            media_type: "image",
            position: img.position,
          })),
        )
      ).error,
      `gallery_images upsert (${album.slug})`,
    );
    albumCount += 1;
    imageCount += images.length;
  }
  log(`Gallery upserted: ${albumCount} albums, ${imageCount} images`);
}

async function remove() {
  const carIds = demoCars.map((c) => c.id);
  const albumIds = demoAlbums.map((a) => a.id);

  check(
    (await supabase.from("car_feature_map").delete().in("car_id", carIds))
      .error,
    "car_feature_map delete",
  );
  check(
    (await supabase.from("car_images").delete().in("car_id", carIds)).error,
    "car_images delete",
  );
  check(
    (await supabase.from("cars").delete().in("id", carIds)).error,
    "cars delete",
  );
  check(
    (await supabase.from("gallery_images").delete().in("album_id", albumIds))
      .error,
    "gallery_images delete",
  );
  check(
    (await supabase.from("gallery_albums").delete().in("id", albumIds)).error,
    "gallery_albums delete",
  );

  // Taxonomy may now be referenced by real cars — delete one row at a time
  // and keep any the database refuses to drop (foreign-key protected).
  const taxonomy = [
    ["car_features", demoFeatures],
    ["car_models", demoModels],
    ["car_categories", demoCategories],
    ["car_makes", demoMakes],
  ];
  for (const [table, rows] of taxonomy) {
    let kept = 0;
    for (const row of rows) {
      const { error } = await supabase.from(table).delete().eq("id", row.id);
      if (error) kept += 1;
    }
    if (kept) log(`  kept ${kept} ${table} rows still used by real data`);
  }
  log("Demo records removed.");
}

const run = process.argv.includes("--remove") ? remove : seed;
run().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
