import { Newspaper } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { siteConfig } from "@/config/site";
import { BlogCategoryTabs } from "@/features/blog/blog-category-tabs";
import { BlogHero } from "@/features/blog/blog-hero";
import { BlogPostCard } from "@/features/blog/blog-post-card";
import { getBlogCategories, getBlogPosts } from "@/services/blog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "HK Motors Insights & Automotive Journal — expert automotive insights, luxury vehicle reviews, buying guides, and maintenance tips.",
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "HK Motors Insights & Automotive Journal — expert automotive insights, luxury vehicle reviews, buying guides, and maintenance tips.",
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

  const categories = getBlogCategories();
  const activeCategory = categories.some((c) => c.slug === rawCategory)
    ? rawCategory
    : undefined;
  const posts = getBlogPosts(activeCategory);

  return (
    <>
      <BlogHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <BlogCategoryTabs categories={categories} active={activeCategory} />

        <div className="mt-8">
          {posts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <FadeIn key={post.id} delay={(index % 6) * 0.05}>
                  <BlogPostCard post={post} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Newspaper}
              title="No posts in this category yet"
              description="Check back soon, or browse all articles instead."
            />
          )}
        </div>
      </section>
    </>
  );
}
