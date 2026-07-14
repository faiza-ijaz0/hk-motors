"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";

import type { AlbumOption, GalleryCategory } from "@/services/admin-gallery";

const CATEGORIES: GalleryCategory[] = [
  "cars",
  "showroom",
  "deliveries",
  "events",
];

export function GalleryFilters({ albums }: { albums: AlbumOption[] }) {
  const { searchParams, setParams } = useAdminTableParams();
  const album = searchParams.get("album") ?? "";
  const category = searchParams.get("category") ?? "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={album || "all"}
        onValueChange={(value) =>
          setParams({ album: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue placeholder="All Albums" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Albums</SelectItem>
          {albums.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={category || "all"}
        onValueChange={(value) =>
          setParams({ category: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c} className="capitalize">
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
