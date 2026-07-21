import { Images } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { siteConfig } from "@/config/site";
import { GalleryGrid } from "@/features/gallery/gallery-grid";
import { GalleryHero } from "@/features/gallery/gallery-hero";
import { GalleryTabs } from "@/features/gallery/gallery-tabs";
import { getGalleryImages, type GalleryCategory } from "@/services/gallery";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Gallery | ${siteConfig.name}`,
  description:
    "The HK Motors showroom experience — a curated look at our showroom, events, deliveries, and the luxury vehicles that pass through our doors.",
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

  const images = await getGalleryImages({ category });

  return (
    <>
      <GalleryHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Explore
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Browse the Collection
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-6">
          <GalleryTabs active={category} />
        </FadeIn>

        <div className="mt-8">
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <EmptyState
              icon={Images}
              title="No photos or videos yet in this selection"
              description="We're curating media for this section. Check back shortly, or browse another category above."
            />
          )}
        </div>
      </section>
    </>
  );
}
