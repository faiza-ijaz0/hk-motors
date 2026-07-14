import Link from "next/link";

import { cn } from "@/lib/utils";

import type { BlogCategory } from "@/services/blog";

export function BlogCategoryTabs({
  categories,
  active,
}: {
  categories: BlogCategory[];
  active?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
        )}
      >
        All
      </Link>
      {categories.map((category) => {
        const isActive = category.slug === active;
        return (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
