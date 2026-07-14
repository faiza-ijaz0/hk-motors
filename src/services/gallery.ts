import { createClient } from "@/lib/supabase/server";

import type { Enums } from "@/types/supabase";

export type GalleryCategory = Enums<"gallery_category">;
export type GalleryMediaType = Enums<"gallery_media_type">;

export type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  category: GalleryCategory;
  mediaType: GalleryMediaType;
};

export type GalleryFilters = {
  category?: GalleryCategory;
  albumSlug?: string;
};

export async function getGalleryImages(
  filters: GalleryFilters = {},
): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();

    // `!inner` is required here — without it, PostgREST silently ignores a
    // filter on an embedded resource (gallery_albums.is_published), and
    // draft albums would leak onto the public site.
    let query = supabase
      .from("gallery_images")
      .select(
        "id, storage_path, external_url, caption, category, media_type, gallery_albums!inner ( slug, is_published )",
      )
      .eq("gallery_albums.is_published", true)
      .order("position", { ascending: true });

    if (filters.category) query = query.eq("category", filters.category);
    if (filters.albumSlug) {
      query = query.eq("gallery_albums.slug", filters.albumSlug);
    }

    const { data, error } = await query;

    if (error || !data) {
      if (error) console.error("getGalleryImages failed", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      url:
        row.external_url ??
        supabase.storage.from("gallery").getPublicUrl(row.storage_path ?? "")
          .data.publicUrl,
      caption: row.caption,
      category: row.category,
      mediaType: row.media_type,
    }));
  } catch (err) {
    console.error("getGalleryImages: unexpected failure", err);
    return [];
  }
}

export type GalleryAlbumOption = { slug: string; title: string };

export async function getPublishedAlbumOptions(): Promise<
  GalleryAlbumOption[]
> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("slug, title")
      .eq("is_published", true)
      .order("position", { ascending: true })
      .order("title", { ascending: true });

    if (error || !data) {
      if (error) console.error("getPublishedAlbumOptions failed", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("getPublishedAlbumOptions: unexpected failure", err);
    return [];
  }
}
