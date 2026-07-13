import { CarFront } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Inventory | ${siteConfig.name}`,
  description:
    "Browse the current HK Motors inventory of performance and luxury vehicles.",
};

// Listings are managed from the dashboard (`cars` table) — this page will
// render live inventory once the Supabase data layer is wired up.
export default function InventoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Inventory"
        title="Find your next vehicle"
        description="Every vehicle in our inventory is inspected, certified, and ready to drive."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={CarFront}
          title="Inventory coming soon"
          description="Our current lineup is being finalized. Check back shortly, or reach out and our team will help you find the right vehicle."
        />
      </section>
    </>
  );
}
