"use client";

import { Images, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockGalleryImages } from "@/lib/mock/admin";
import { cn } from "@/lib/utils";

import type { MockGalleryImage } from "@/lib/mock/admin";

const CATEGORIES: {
  label: string;
  value: MockGalleryImage["category"] | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Cars", value: "cars" },
  { label: "Showroom", value: "showroom" },
  { label: "Deliveries", value: "deliveries" },
  { label: "Events", value: "events" },
];

export function AdminGalleryGrid() {
  const [active, setActive] = useState<MockGalleryImage["category"] | "all">(
    "all",
  );

  const images =
    active === "all"
      ? mockGalleryImages
      : mockGalleryImages.filter((image) => image.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => setActive(category.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === category.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="border-border bg-card group relative overflow-hidden rounded-xl border"
          >
            <div className="bg-muted flex aspect-4/3 items-center justify-center">
              <Images className="text-muted-foreground size-8" />
            </div>
            <div className="space-y-2 p-3">
              <Badge variant="outline" className="capitalize">
                {image.category}
              </Badge>
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {image.caption}
              </p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Edit photo"
              >
                <Pencil />
              </Button>
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Delete photo"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
