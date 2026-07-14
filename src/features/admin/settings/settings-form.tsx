"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/features/admin/settings/image-uploader";
import {
  removeLogoAction,
  updateWebsiteSettingsAction,
  uploadLogoAction,
  uploadSeoImageAction,
  type SettingsFormInput,
} from "@/services/admin-settings-actions";

import type { WebsiteSettings } from "@/services/admin-settings";

export function SettingsForm({ settings }: { settings: WebsiteSettings }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const input: SettingsFormInput = {
      companyName: String(form.get("company_name") ?? ""),
      contactPhone: String(form.get("contact_phone") ?? ""),
      whatsappNumber: String(form.get("whatsapp_number") ?? ""),
      contactEmail: String(form.get("contact_email") ?? ""),
      address: String(form.get("address") ?? ""),
      socialLinks: {
        facebook: String(form.get("facebook") ?? ""),
        instagram: String(form.get("instagram") ?? ""),
        twitter: String(form.get("twitter") ?? ""),
        youtube: String(form.get("youtube") ?? ""),
      },
      seoDefaultTitle: String(form.get("seo_title") ?? ""),
      seoDefaultDescription: String(form.get("seo_description") ?? ""),
    };

    const result = await updateWebsiteSettingsAction(input);
    setSubmitting(false);

    if (result.success) toast.success("Settings saved");
    else toast.error("Something went wrong", { description: result.error });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-lg">General</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                required
                defaultValue={settings.companyName}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUploader
                label="Logo"
                imageUrl={settings.logoUrl}
                onUpload={uploadLogoAction}
                onRemove={removeLogoAction}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-lg">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                defaultValue={settings.contactPhone ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                defaultValue={settings.whatsappNumber ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={settings.contactEmail ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={settings.address ?? ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-lg">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="facebook"
                placeholder="https://facebook.com/…"
                defaultValue={settings.socialLinks.facebook}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/…"
                defaultValue={settings.socialLinks.instagram}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                placeholder="https://twitter.com/…"
                defaultValue={settings.socialLinks.twitter}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                name="youtube"
                placeholder="https://youtube.com/…"
                defaultValue={settings.socialLinks.youtube}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-lg">SEO Defaults</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">Default Meta Title</Label>
              <Input
                id="seo_title"
                name="seo_title"
                defaultValue={settings.seoDefaultTitle ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">Default Meta Description</Label>
              <Textarea
                id="seo_description"
                name="seo_description"
                rows={3}
                defaultValue={settings.seoDefaultDescription ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Default Social Share Image</Label>
              <ImageUploader
                label="SEO image"
                imageUrl={settings.seoDefaultImageUrl}
                onUpload={uploadSeoImageAction}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
