"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/services/activity";

import type { SocialLinks } from "@/services/admin-settings";

export type ActionResult =
  { success: true } | { success: false; error: string };

export type SettingsFormInput = {
  companyName: string;
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  address: string;
  socialLinks: SocialLinks;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
};

export async function updateWebsiteSettingsAction(
  input: SettingsFormInput,
): Promise<ActionResult> {
  if (!input.companyName.trim()) {
    return { success: false, error: "Company name is required." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("website_settings")
      .update({
        company_name: input.companyName.trim(),
        contact_phone: input.contactPhone.trim() || null,
        whatsapp_number: input.whatsappNumber.trim() || null,
        contact_email: input.contactEmail.trim() || null,
        address: input.address.trim() || null,
        social_links: {
          facebook: input.socialLinks.facebook.trim(),
          instagram: input.socialLinks.instagram.trim(),
          twitter: input.socialLinks.twitter.trim(),
          youtube: input.socialLinks.youtube.trim(),
        },
        seo_default_title: input.seoDefaultTitle.trim() || null,
        seo_default_description: input.seoDefaultDescription.trim() || null,
      })
      .eq("id", 1);

    if (error) return { success: false, error: error.message };

    await logActivity({
      action: "Updated website settings",
      entityTable: "website_settings",
      entityId: "1",
    });
    revalidatePath("/super-admin/settings");
    return { success: true };
  } catch (err) {
    console.error("updateWebsiteSettingsAction failed", err);
    return {
      success: false,
      error: "Something went wrong saving settings.",
    };
  }
}

export async function uploadLogoAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file selected." };
    }

    const supabase = createAdminClient();

    const { data: current } = await supabase
      .from("website_settings")
      .select("logo_path")
      .eq("id", 1)
      .maybeSingle();
    const previousPath = current?.logo_path ?? null;

    const ext = file.name.split(".").pop() ?? "png";
    const path = `logo/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message };

    const { error: updateError } = await supabase
      .from("website_settings")
      .update({ logo_path: path })
      .eq("id", 1);
    if (updateError) return { success: false, error: updateError.message };

    if (previousPath) {
      await supabase.storage.from("site-assets").remove([previousPath]);
    }

    revalidatePath("/super-admin/settings");
    return { success: true };
  } catch (err) {
    console.error("uploadLogoAction failed", err);
    return { success: false, error: "Something went wrong uploading." };
  }
}

export async function uploadSeoImageAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file selected." };
    }

    const supabase = createAdminClient();

    const { data: current } = await supabase
      .from("website_settings")
      .select("seo_default_image_path")
      .eq("id", 1)
      .maybeSingle();
    const previousPath = current?.seo_default_image_path ?? null;

    const ext = file.name.split(".").pop() ?? "png";
    const path = `seo/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message };

    const { error: updateError } = await supabase
      .from("website_settings")
      .update({ seo_default_image_path: path })
      .eq("id", 1);
    if (updateError) return { success: false, error: updateError.message };

    if (previousPath) {
      await supabase.storage.from("site-assets").remove([previousPath]);
    }

    revalidatePath("/super-admin/settings");
    return { success: true };
  } catch (err) {
    console.error("uploadSeoImageAction failed", err);
    return { success: false, error: "Something went wrong uploading." };
  }
}

export async function removeLogoAction(): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { data: current } = await supabase
      .from("website_settings")
      .select("logo_path")
      .eq("id", 1)
      .maybeSingle();

    const { error } = await supabase
      .from("website_settings")
      .update({ logo_path: null })
      .eq("id", 1);
    if (error) return { success: false, error: error.message };

    if (current?.logo_path) {
      await supabase.storage.from("site-assets").remove([current.logo_path]);
    }

    revalidatePath("/super-admin/settings");
    return { success: true };
  } catch (err) {
    console.error("removeLogoAction failed", err);
    return { success: false, error: "Something went wrong." };
  }
}
