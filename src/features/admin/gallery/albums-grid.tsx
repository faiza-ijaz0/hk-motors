"use client";

import { Eye, Images, Pencil, Trash2, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteAlbumDialog } from "@/features/admin/gallery/delete-album-dialog";
import { formatRelativeTime } from "@/lib/format";
import { toggleAlbumPublishedAction } from "@/services/admin-gallery-actions";

import type { AdminAlbumListItem } from "@/services/admin-gallery";

export function AlbumsGrid({
  albums,
  hasFilters,
}: {
  albums: AdminAlbumListItem[];
  hasFilters: boolean;
}) {
  const [deleteTarget, setDeleteTarget] = useState<AdminAlbumListItem | null>(
    null,
  );
  const [, startTransition] = useTransition();

  function handleTogglePublished(album: AdminAlbumListItem) {
    startTransition(async () => {
      const result = await toggleAlbumPublishedAction(
        album.id,
        !album.isPublished,
      );
      if (result.success) {
        toast.success(
          album.isPublished ? "Album unpublished" : "Album published",
        );
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  if (albums.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title={hasFilters ? "No albums match your filters" : "No albums yet"}
        description={
          hasFilters
            ? "Try a different album or category filter."
            : "Create your first album to start organizing photos and videos."
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="border-border bg-card group relative overflow-hidden rounded-xl border"
          >
            <div className="bg-muted relative flex aspect-4/3 items-center justify-center">
              {album.coverUrl ? (
                <Image
                  src={album.coverUrl}
                  alt={album.title}
                  fill
                  sizes="300px"
                  unoptimized={album.coverIsExternal}
                  className="object-cover"
                />
              ) : (
                <Images className="text-muted-foreground size-8" />
              )}
            </div>
            <div className="space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{album.title}</p>
                <Badge variant={album.isPublished ? "default" : "outline"}>
                  {album.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              {album.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {album.categories.map((c) => (
                    <Badge key={c} variant="outline" className="capitalize">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Images className="size-3.5" />
                  {album.imageCount}
                </span>
                <span className="flex items-center gap-1">
                  <Video className="size-3.5" />
                  {album.videoCount}
                </span>
                <span>
                  {album.mediaCount} {album.mediaCount === 1 ? "item" : "items"}{" "}
                  total
                </span>
              </div>

              <p className="text-muted-foreground text-xs">
                Created {formatRelativeTime(album.createdAt)}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={album.isPublished}
                    onCheckedChange={() => handleTogglePublished(album)}
                    aria-label={
                      album.isPublished ? "Unpublish album" : "Publish album"
                    }
                  />
                  <span className="text-muted-foreground text-xs">
                    Published
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="View album"
                    asChild
                  >
                    <Link href={`/super-admin/gallery/${album.id}`}>
                      <Eye />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit album"
                    asChild
                  >
                    <Link href={`/super-admin/gallery/${album.id}/edit`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete album"
                    onClick={() => setDeleteTarget(album)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <DeleteAlbumDialog
          open
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          albumId={deleteTarget.id}
          albumTitle={deleteTarget.title}
        />
      )}
    </>
  );
}
