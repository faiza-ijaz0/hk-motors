import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AlbumsGrid } from "@/features/admin/gallery/albums-grid";
import { GalleryFilters } from "@/features/admin/gallery/gallery-filters";
import {
  getAdminAlbums,
  getAlbumOptions,
  type GalleryCategory,
} from "@/services/admin-gallery";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    albumId: toSingle(params.album),
    category: toSingle(params.category) as GalleryCategory | undefined,
  };

  const [albums, albumOptions] = await Promise.all([
    getAdminAlbums(filters),
    getAlbumOptions(),
  ]);
  const hasFilters = Boolean(filters.albumId || filters.category);

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Manage photo and video albums across Cars, Showroom, Deliveries, and Events."
      >
        <Button size="sm" asChild>
          <Link href="/super-admin/gallery/new">
            <Plus />
            New Album
          </Link>
        </Button>
      </AdminPageHeader>

      <div className="mb-4">
        <GalleryFilters albums={albumOptions} />
      </div>

      <AlbumsGrid albums={albums} hasFilters={hasFilters} />
    </>
  );
}
