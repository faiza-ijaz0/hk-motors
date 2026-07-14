import { Images } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";
import { GalleryMasonry } from "@/features/gallery/gallery-masonry";
import { GalleryTabs } from "@/features/gallery/gallery-tabs";
import { getGalleryImages, type GalleryCategory } from "@/services/gallery";

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

  const images = await getGalleryImages(category);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside HK Motors"
        description="A look at our showroom, events, deliveries, and the vehicles that have passed through our doors."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <GalleryTabs active={category} />

        <div className="mt-8">
          {images.length > 0 ? (
            <GalleryMasonry images={images} />
          ) : (
            <EmptyState
              icon={Images}
              title="No photos yet in this category"
              description="We're curating photos for this section. Check back shortly, or browse another category above."
            />
          )}
        </div>
      </section>
    </>
  );
}
