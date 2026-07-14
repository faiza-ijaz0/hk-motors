import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AlbumForm } from "@/features/admin/gallery/album-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Album | HK Motors Super Admin",
};

export default function NewAlbumPage() {
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
        title="New Album"
        description="Create a new photo album."
      />

      <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
        <AlbumForm />
      </div>
    </>
  );
}
