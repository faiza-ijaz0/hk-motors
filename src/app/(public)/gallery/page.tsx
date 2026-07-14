import { Images } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";
import { GalleryAlbumFilter } from "@/features/gallery/gallery-album-filter";
import { GalleryGrid } from "@/features/gallery/gallery-grid";
import { GalleryTabs } from "@/features/gallery/gallery-tabs";
import {
  getGalleryImages,
  getPublishedAlbumOptions,
  type GalleryCategory,
} from "@/services/gallery";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Gallery | ${siteConfig.name}`,
  description:
    "A look inside HK Motors — our showroom, events, deliveries, and the vehicles that pass through it.",
};

const VALID_CATEGORIES: GalleryCategory[] = [
  "cars",
  "showroom",
  "deliveries",
  "events",
];

function isGalleryCategory(value: unknown): value is GalleryCategory {
  return (
    typeof value === "string" &&
    VALID_CATEGORIES.includes(value as GalleryCategory)
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const category = isGalleryCategory(rawCategory) ? rawCategory : undefined;

  const rawAlbum = Array.isArray(params.album) ? params.album[0] : params.album;
  const albumSlug = rawAlbum || undefined;

  const [images, albumOptions] = await Promise.all([
    getGalleryImages({ category, albumSlug }),
    getPublishedAlbumOptions(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside HK Motors"
        description="A look at our showroom, events, deliveries, and the vehicles that have passed through our doors."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <GalleryTabs active={category} activeAlbum={albumSlug} />
          <GalleryAlbumFilter albums={albumOptions} active={albumSlug} />
        </div>

        <div className="mt-8">
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <EmptyState
              icon={Images}
              title="No photos or videos yet in this selection"
              description="We're curating media for this section. Check back shortly, or browse another category or album above."
            />
          )}
        </div>
      </section>
    </>
  );
}
