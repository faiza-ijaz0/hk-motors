"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { GalleryCategory } from "@/services/admin-gallery";

export type ActionResult =
  { success: true } | { success: false; error: string };

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    randomUUID().slice(0, 6)
  );
}

export type AlbumFormInput = {
  title: string;
  description: string;
  isPublished: boolean;
};

function validateAlbumInput(input: AlbumFormInput): string | null {
  if (!input.title.trim()) return "Title is required.";
  return null;
}

export async function createAlbumAction(
  input: AlbumFormInput,
): Promise<ActionResult> {
  const validationError = validateAlbumInput(input);
  if (validationError) return { success: false, error: validationError };

  let newAlbumId: string | undefined;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gallery_albums")
      .insert({
        title: input.title.trim(),
        slug: slugify(input.title),
        description: input.description.trim() || null,
        is_published: input.isPublished,
      })
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to create the album.",
      };
    }
    newAlbumId = data.id;

    await logActivity({
      action: `Created gallery album "${input.title.trim()}"`,
      entityTable: "gallery_albums",
      entityId: data.id,
    });
    revalidatePath("/super-admin/gallery");
  } catch (err) {
    console.error("createAlbumAction failed", err);
    return {
      success: false,
      error: "Something went wrong creating the album.",
    };
  }

  redirect(`/super-admin/gallery/${newAlbumId}/edit`);
}

export async function updateAlbumAction(
  id: string,
  input: AlbumFormInput,
): Promise<ActionResult> {
  const validationError = validateAlbumInput(input);
  if (validationError) return { success: false, error: validationError };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("gallery_albums")
      .update({
        title: input.title.trim(),
        description: input.description.trim() || null,
        is_published: input.isPublished,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Updated gallery album "${input.title.trim()}"`,
      entityTable: "gallery_albums",
      entityId: id,
    });
    revalidatePath("/super-admin/gallery");
    revalidatePath(`/super-admin/gallery/${id}/edit`);
    return { success: true };
  } catch (err) {
    console.error("updateAlbumAction failed", err);
    return {
      success: false,
      error: "Something went wrong updating the album.",
    };
  }
}

export async function toggleAlbumPublishedAction(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("gallery_albums")
      .update({ is_published: isPublished })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/super-admin/gallery");
    return { success: true };
  } catch (err) {
    console.error("toggleAlbumPublishedAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function deleteAlbumAction(
  id: string,
  title: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    const { data: images } = await supabase
      .from("gallery_images")
      .select("storage_path")
      .eq("album_id", id);

    if (images && images.length > 0) {
      await supabase.storage
        .from("gallery")
        .remove(images.map((img) => img.storage_path));
    }

    const { error } = await supabase
      .from("gallery_albums")
      .delete()
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await logActivity({
      action: `Deleted gallery album "${title}"`,
      entityTable: "gallery_albums",
      entityId: id,
    });
    revalidatePath("/super-admin/gallery");
    return { success: true };
  } catch (err) {
    console.error("deleteAlbumAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the album.",
    };
  }
}

export async function uploadGalleryImageAction(
  albumId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const file = formData.get("file") as File | null;
    const caption = String(formData.get("caption") ?? "").trim();
    const category = String(
      formData.get("category") ?? "cars",
    ) as GalleryCategory;

    if (!file || file.size === 0) {
      return { success: false, error: "No file selected." };
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${albumId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message };

    const { count } = await supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true })
      .eq("album_id", albumId);

    const { error: insertError } = await supabase
      .from("gallery_images")
      .insert({
        album_id: albumId,
        storage_path: path,
        caption: caption || null,
        category,
        position: count ?? 0,
      });
    if (insertError) return { success: false, error: insertError.message };

    if ((count ?? 0) === 0) {
      await supabase
        .from("gallery_albums")
        .update({ cover_image_path: path })
        .eq("id", albumId);
    }

    revalidatePath(`/super-admin/gallery/${albumId}/edit`);
    revalidatePath("/super-admin/gallery");
    return { success: true };
  } catch (err) {
    console.error("uploadGalleryImageAction failed", err);
    return {
      success: false,
      error: "Something went wrong uploading the image.",
    };
  }
}

export async function deleteGalleryImageAction(
  albumId: string,
  imageId: string,
  storagePath: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    await supabase.storage.from("gallery").remove([storagePath]);
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId);
    if (error) return { success: false, error: error.message };

    const { data: album } = await supabase
      .from("gallery_albums")
      .select("cover_image_path")
      .eq("id", albumId)
      .maybeSingle();

    if (album?.cover_image_path === storagePath) {
      const { data: next } = await supabase
        .from("gallery_images")
        .select("storage_path")
        .eq("album_id", albumId)
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

      await supabase
        .from("gallery_albums")
        .update({ cover_image_path: next?.storage_path ?? null })
        .eq("id", albumId);
    }

    revalidatePath(`/super-admin/gallery/${albumId}/edit`);
    revalidatePath("/super-admin/gallery");
    return { success: true };
  } catch (err) {
    console.error("deleteGalleryImageAction failed", err);
    return {
      success: false,
      error: "Something went wrong deleting the image.",
    };
  }
}

export async function setAlbumCoverAction(
  albumId: string,
  storagePath: string,
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("gallery_albums")
      .update({ cover_image_path: storagePath })
      .eq("id", albumId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/super-admin/gallery/${albumId}/edit`);
    revalidatePath("/super-admin/gallery");
    return { success: true };
  } catch (err) {
    console.error("setAlbumCoverAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}

export async function reorderGalleryImageAction(
  albumId: string,
  imageId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { data: images, error } = await supabase
      .from("gallery_images")
      .select("id, position")
      .eq("album_id", albumId)
      .order("position", { ascending: true });

    if (error || !images) {
      return { success: false, error: error?.message ?? "Reorder failed." };
    }

    const index = images.findIndex((img) => img.id === imageId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= images.length) {
      return { success: true };
    }

    const current = images[index]!;
    const swap = images[swapIndex]!;

    const [{ error: err1 }, { error: err2 }] = await Promise.all([
      supabase
        .from("gallery_images")
        .update({ position: swap.position })
        .eq("id", current.id),
      supabase
        .from("gallery_images")
        .update({ position: current.position })
        .eq("id", swap.id),
    ]);
    if (err1 || err2) {
      return {
        success: false,
        error: err1?.message ?? err2?.message ?? "Reorder failed.",
      };
    }

    revalidatePath(`/super-admin/gallery/${albumId}/edit`);
    return { success: true };
  } catch (err) {
    console.error("reorderGalleryImageAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}
