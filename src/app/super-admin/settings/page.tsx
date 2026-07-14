import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { getWebsiteSettings } from "@/services/admin-settings";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | HK Motors Super Admin",
};

export default async function AdminSettingsPage() {
  const settings = await getWebsiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Site-wide branding, contact information, and SEO defaults."
      />

      <SettingsForm settings={settings} />
    </>
  );
}
