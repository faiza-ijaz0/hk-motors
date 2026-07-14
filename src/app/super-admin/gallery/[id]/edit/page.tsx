import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AlbumForm } from "@/features/admin/gallery/album-form";
import { GalleryImagesManager } from "@/features/admin/gallery/gallery-images-manager";
import { getAdminAlbumById } from "@/services/admin-gallery";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getAdminAlbumById(id);
  return {
    title: `${result?.album.title ?? "Edit Album"} | HK Motors Super Admin`,
  };
}

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminAlbumById(id);

  if (!result) notFound();

  return (
    <>
      <Link
        href="/super-admin/gallery"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Gallery
      </Link>

      <AdminPageHeader
        title={result.album.title}
        description="Edit this album's details and manage its photos."
      />

      <div className="space-y-8">
        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <GalleryImagesManager
            albumId={result.album.id}
            images={result.images}
            coverImagePath={result.album.coverImagePath}
          />
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <AlbumForm album={result.album} />
        </div>
      </div>
    </>
  );
}
