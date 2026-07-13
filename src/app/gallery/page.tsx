import { Images } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Gallery | ${siteConfig.name}`,
  description:
    "A look inside HK Motors — our showroom, events, and the vehicles that pass through it.",
};

// Albums/images are managed from the dashboard (`gallery_albums` /
// `gallery_images`) — this page will render live content once the
// Supabase data layer is wired up.
export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside HK Motors"
        description="A look at our showroom, events, and the vehicles that have passed through our doors."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={Images}
          title="Gallery coming soon"
          description="We're curating photos from our showroom and events. Check back shortly."
        />
      </section>
    </>
  );
}
