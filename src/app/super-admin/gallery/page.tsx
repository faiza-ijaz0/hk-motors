import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AlbumsGrid } from "@/features/admin/gallery/albums-grid";
import { getAdminAlbums } from "@/services/admin-gallery";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | HK Motors Super Admin",
};

export default async function AdminGalleryPage() {
  const albums = await getAdminAlbums();

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Manage photo albums across Cars, Showroom, Deliveries, and Events."
      >
        <Button size="sm" asChild>
          <Link href="/super-admin/gallery/new">
            <Plus />
            New Album
          </Link>
        </Button>
      </AdminPageHeader>

      <AlbumsGrid albums={albums} />
    </>
  );
}
