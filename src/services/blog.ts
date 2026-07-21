// Public blog runs entirely on local static data — no Supabase, no API
// route. See `src/data/blogs.ts` for the actual content.
import { blogCategories, blogPosts } from "@/data/blogs";

import type { BlogCategory, BlogPost } from "@/data/blogs";

export type { BlogCategory };

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  categoryName: string | null;
  categorySlug: string | null;
  author: string;
  date: string;
  readTime: string;
};

export type BlogPostDetail = BlogPostListItem & {
  fullContent: string;
};

function categoryName(slug: string): string | null {
  return blogCategories.find((c) => c.slug === slug)?.name ?? null;
}

function toListItem(post: BlogPost): BlogPostListItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    categoryName: categoryName(post.category),
    categorySlug: post.category,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
  };
}

export function getBlogCategories(): BlogCategory[] {
  return blogCategories;
}

export function getBlogPosts(categorySlug?: string): BlogPostListItem[] {
  const posts = categorySlug
    ? blogPosts.filter((p) => p.category === categorySlug)
    : blogPosts;

  return posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(toListItem);
}

export function getBlogPostBySlug(slug: string): BlogPostDetail | null {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  return { ...toListItem(post), fullContent: post.fullContent };
}

export function getRelatedPosts(
  post: BlogPostDetail,
  limit = 3,
): BlogPostListItem[] {
  return blogPosts
    .filter((p) => p.category === post.categorySlug && p.slug !== post.slug)
    .slice(0, limit)
    .map(toListItem);
}

// Sorted the same way the blog index is, so "previous"/"next" match the
// order a reader would actually encounter posts in on the listing page.
export function getAdjacentPosts(slug: string): {
  previous: BlogPostListItem | null;
  next: BlogPostListItem | null;
} {
  const ordered = blogPosts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const index = ordered.findIndex((p) => p.slug === slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? toListItem(ordered[index - 1]!) : null,
    next: index < ordered.length - 1 ? toListItem(ordered[index + 1]!) : null,
  };
}

// For the sitemap — every post is always "published" since there's no
// draft/status concept for static local data.
export function getAllBlogSlugs(): { slug: string; updatedAt: string }[] {
  return blogPosts.map((post) => ({ slug: post.slug, updatedAt: post.date }));
}
