import { Newspaper } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "News, guides, and stories from HK Motors — insights on performance vehicles, ownership, and more.",
};

// Posts are managed from the dashboard (`blog_posts` table) — this page
// will render live content once the Supabase data layer is wired up.
export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="News & Insights"
        description="Guides, stories, and updates from the HK Motors team."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="We're working on our first stories. Check back soon for news and guides from the HK Motors team."
        />
      </section>
    </>
  );
}
