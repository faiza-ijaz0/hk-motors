import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminPagination({
  basePath,
  page,
  totalPages,
  searchParams,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    else params.delete("page");
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-1"
    >
      <Button
        asChild
        variant="outline"
        size="icon-sm"
        disabled={page <= 1}
        aria-disabled={page <= 1}
      >
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-label="Previous page"
          className={cn(page <= 1 && "pointer-events-none opacity-50")}
        >
          <ChevronLeft />
        </Link>
      </Button>

      {pages.map((p, index) => {
        const prev = pages[index - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;

        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="text-muted-foreground px-1 text-sm">…</span>
            )}
            <Button
              asChild
              variant={p === page ? "default" : "outline"}
              size="icon-sm"
            >
              <Link href={hrefFor(p)} aria-current={p === page}>
                {p}
              </Link>
            </Button>
          </span>
        );
      })}

      <Button
        asChild
        variant="outline"
        size="icon-sm"
        disabled={page >= totalPages}
        aria-disabled={page >= totalPages}
      >
        <Link
          href={hrefFor(Math.min(totalPages, page + 1))}
          aria-label="Next page"
          className={cn(page >= totalPages && "pointer-events-none opacity-50")}
        >
          <ChevronRight />
        </Link>
      </Button>
    </nav>
  );
}
