import { FadeIn } from "@/components/shared/fade-in";
import { BlogPostCard } from "@/features/blog/blog-post-card";

import type { BlogPostListItem } from "@/services/blog";

export function RelatedPosts({ posts }: { posts: BlogPostListItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-primary tracking-luxury text-xs font-medium uppercase">
            Keep Reading
          </p>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl">
            Related Articles
          </h2>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 0.05}>
              <BlogPostCard post={post} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
