import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export type GalleryCategory = Enums<"gallery_category">;
export type GalleryMediaType = Enums<"gallery_media_type">;

/** `cover_image_path` holds either a storage-relative path or, for pasted
 * URLs, the full external URL itself — distinguished by an http(s) prefix. */
function resolveCoverUrl(
  supabase: ReturnType<typeof createAdminClient>,
  coverImagePath: string | null,
): string | null {
  if (!coverImagePath) return null;
  if (coverImagePath.startsWith("http")) return coverImagePath;
  return supabase.storage.from("gallery").getPublicUrl(coverImagePath).data
    .publicUrl;
}

export type AdminAlbumListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  coverIsExternal: boolean;
  isPublished: boolean;
  imageCount: number;
  createdAt: string;
};

export async function getAdminAlbums(): Promise<AdminAlbumListItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select(
        "id, title, slug, description, cover_image_path, is_published, created_at, gallery_images ( count )",
      )
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("getAdminAlbums failed", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      coverUrl: resolveCoverUrl(supabase, row.cover_image_path),
      coverIsExternal: row.cover_image_path?.startsWith("http") ?? false,
      isPublished: row.is_published,
      imageCount: row.gallery_images?.[0]?.count ?? 0,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("getAdminAlbums: unexpected failure", err);
    return [];
  }
}

export type AdminAlbumDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImagePath: string | null;
  isPublished: boolean;
};

export type AdminAlbumImage = {
  id: string;
  url: string;
  storagePath: string | null;
  externalUrl: string | null;
  caption: string | null;
  category: GalleryCategory;
  mediaType: GalleryMediaType;
  position: number;
};

export async function getAdminAlbumById(id: string): Promise<{
  album: AdminAlbumDetail;
  images: AdminAlbumImage[];
} | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .select(
        "id, title, slug, description, cover_image_path, is_published, gallery_images ( id, storage_path, external_url, caption, category, media_type, position )",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getAdminAlbumById failed", error);
      return null;
    }

    const images: AdminAlbumImage[] = (data.gallery_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        id: img.id,
        url:
          img.external_url ??
          supabase.storage.from("gallery").getPublicUrl(img.storage_path ?? "")
            .data.publicUrl,
        storagePath: img.storage_path,
        externalUrl: img.external_url,
        caption: img.caption,
        category: img.category,
        mediaType: img.media_type,
        position: img.position,
      }));

    return {
      album: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImagePath: data.cover_image_path,
        isPublished: data.is_published,
      },
      images,
    };
  } catch (err) {
    console.error("getAdminAlbumById: unexpected failure", err);
    return null;
  }
}
