import { createAdminClient } from "@/lib/supabase/admin";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
};

export type WebsiteSettings = {
  companyName: string;
  logoPath: string | null;
  logoUrl: string | null;
  contactPhone: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  address: string | null;
  socialLinks: SocialLinks;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  seoDefaultImagePath: string | null;
  seoDefaultImageUrl: string | null;
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
};

const EMPTY_SETTINGS: WebsiteSettings = {
  companyName: "HK Motors",
  logoPath: null,
  logoUrl: null,
  contactPhone: null,
  whatsappNumber: null,
  contactEmail: null,
  address: null,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  seoDefaultTitle: null,
  seoDefaultDescription: null,
  seoDefaultImagePath: null,
  seoDefaultImageUrl: null,
};

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getWebsiteSettings failed", error);
      return EMPTY_SETTINGS;
    }

    const rawSocial =
      data.social_links && typeof data.social_links === "object"
        ? (data.social_links as Record<string, unknown>)
        : {};

    return {
      companyName: data.company_name,
      logoPath: data.logo_path,
      logoUrl: data.logo_path
        ? supabase.storage.from("site-assets").getPublicUrl(data.logo_path).data
            .publicUrl
        : null,
      contactPhone: data.contact_phone,
      whatsappNumber: data.whatsapp_number,
      contactEmail: data.contact_email,
      address: data.address,
      socialLinks: {
        facebook: String(rawSocial.facebook ?? ""),
        instagram: String(rawSocial.instagram ?? ""),
        twitter: String(rawSocial.twitter ?? ""),
        youtube: String(rawSocial.youtube ?? ""),
      },
      seoDefaultTitle: data.seo_default_title,
      seoDefaultDescription: data.seo_default_description,
      seoDefaultImagePath: data.seo_default_image_path,
      seoDefaultImageUrl: data.seo_default_image_path
        ? supabase.storage
            .from("site-assets")
            .getPublicUrl(data.seo_default_image_path).data.publicUrl
        : null,
    };
  } catch (err) {
    console.error("getWebsiteSettings: unexpected failure", err);
    return EMPTY_SETTINGS;
  }
}
