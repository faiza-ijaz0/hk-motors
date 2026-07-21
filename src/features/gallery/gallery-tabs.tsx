import Link from "next/link";

import { cn } from "@/lib/utils";

import type { GalleryCategory } from "@/services/gallery";

const TABS: { label: string; value: GalleryCategory | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Cars", value: "cars" },
  { label: "Showroom", value: "showroom" },
  { label: "Deliveries", value: "deliveries" },
  { label: "Events", value: "events" },
];

function buildHref(category?: GalleryCategory) {
  return category ? `/gallery?category=${category}` : "/gallery";
}

export function GalleryTabs({ active }: { active?: GalleryCategory }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.label}
            href={buildHref(tab.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-luxury"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
