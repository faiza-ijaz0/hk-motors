import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminGalleryGrid } from "@/features/admin/admin-gallery-grid";
import { AdminPageHeader } from "@/features/admin/admin-page-header";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | HK Motors Super Admin",
};

export default function AdminGalleryPage() {
  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Manage photos across Cars, Showroom, Deliveries, and Events."
      >
        <Button size="sm">
          <Plus />
          Upload Photos
        </Button>
      </AdminPageHeader>

      <AdminGalleryGrid />
    </>
  );
}
