import { createClient } from "@/lib/supabase/server";

import type { Enums } from "@/types/supabase";

export type GalleryCategory = Enums<"gallery_category">;

export type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  category: GalleryCategory;
};

export async function getGalleryImages(
  category?: GalleryCategory,
): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();

    let query = supabase
      .from("gallery_images")
      .select("id, storage_path, caption, category")
      .order("position", { ascending: true });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error || !data) {
      if (error) console.error("getGalleryImages failed", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      url: supabase.storage.from("gallery").getPublicUrl(row.storage_path).data
        .publicUrl,
      caption: row.caption,
      category: row.category,
    }));
  } catch (err) {
    console.error("getGalleryImages: unexpected failure", err);
    return [];
  }
}
