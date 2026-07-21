import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { BlogPostListItem } from "@/services/blog";

function NavCard({
  post,
  direction,
}: {
  post: BlogPostListItem;
  direction: "previous" | "next";
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border-border bg-card hover:border-primary/40 group flex h-full flex-col gap-2 rounded-2xl border p-5 transition-colors"
    >
      <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors">
        {direction === "previous" ? (
          <>
            <ArrowLeft className="size-3.5" />
            Previous Article
          </>
        ) : (
          <>
            Next Article
            <ArrowRight className="size-3.5" />
          </>
        )}
      </span>
      <span
        className={`font-display line-clamp-2 text-base ${direction === "next" ? "text-right" : ""}`}
      >
        {post.title}
      </span>
    </Link>
  );
}

export function BlogPostNav({
  previous,
  next,
}: {
  previous: BlogPostListItem | null;
  next: BlogPostListItem | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {previous ? <NavCard post={previous} direction="previous" /> : <div />}
      {next && <NavCard post={next} direction="next" />}
    </div>
  );
}
