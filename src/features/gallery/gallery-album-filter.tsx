"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { GalleryAlbumOption } from "@/services/gallery";

export function GalleryAlbumFilter({
  albums,
  active,
}: {
  albums: GalleryAlbumOption[];
  active?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (albums.length === 0) return null;

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("album");
    else params.set("album", value);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <Select value={active ?? "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="All Albums" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Albums</SelectItem>
        {albums.map((album) => (
          <SelectItem key={album.slug} value={album.slug}>
            {album.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
