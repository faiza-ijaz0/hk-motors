"use client";

import { Images, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteAlbumDialog } from "@/features/admin/gallery/delete-album-dialog";
import { toggleAlbumPublishedAction } from "@/services/admin-gallery-actions";

import type { AdminAlbumListItem } from "@/services/admin-gallery";

export function AlbumsGrid({ albums }: { albums: AdminAlbumListItem[] }) {
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
        title="No albums yet"
        description="Create your first album to start organizing photos."
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
              <p className="text-muted-foreground text-xs">
                {album.imageCount} {album.imageCount === 1 ? "photo" : "photos"}
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
