import { Newspaper } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";
import { BlogCategoryTabs } from "@/features/blog/blog-category-tabs";
import { BlogPostCard } from "@/features/blog/blog-post-card";
import { getBlogCategories, getBlogPosts } from "@/services/blog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "News, guides, and stories from HK Motors — insights on performance vehicles, ownership, and more.",
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "News, guides, and stories from HK Motors — insights on performance vehicles, ownership, and more.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getBlogPosts(rawCategory),
  ]);

  const activeCategory = categories.some((c) => c.slug === rawCategory)
    ? rawCategory
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="News & Insights"
        description="Guides, stories, and updates from the HK Motors team."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <BlogCategoryTabs categories={categories} active={activeCategory} />

        <div className="mt-8">
          {posts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Newspaper}
              title="No posts yet"
              description="We're working on our first stories. Check back soon for news and guides from the HK Motors team."
            />
          )}
        </div>
      </section>
    </>
  );
}
