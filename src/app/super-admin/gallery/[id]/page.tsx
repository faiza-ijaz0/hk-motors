import { ChevronLeft, Images, Pencil, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { formatRelativeTime } from "@/lib/format";
import { getVideoEmbedUrl } from "@/lib/video";
import { getAdminAlbumById } from "@/services/admin-gallery";

import type { AdminAlbumImage } from "@/services/admin-gallery";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getAdminAlbumById(id);
  return {
    title: `${result?.album.title ?? "Album"} | HK Motors Super Admin`,
  };
}

function MediaPreview({ image }: { image: AdminAlbumImage }) {
  if (image.mediaType === "video") {
    const embedUrl = getVideoEmbedUrl(image.url);
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={image.caption ?? "Video"}
          allow="encrypted-media; picture-in-picture"
          className="absolute inset-0 size-full border-0"
        />
      );
    }
    return (
      <video
        src={image.url}
        controls
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
      />
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.caption ?? "Gallery photo"}
      fill
      sizes="300px"
      unoptimized={image.externalUrl !== null}
      className="object-cover"
    />
  );
}

export default async function ViewAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminAlbumById(id);
  if (!result) notFound();

  const { album, images } = result;
  const imageCount = images.filter((i) => i.mediaType === "image").length;
  const videoCount = images.filter((i) => i.mediaType === "video").length;
  const categories = [...new Set(images.map((i) => i.category))];

  return (
    <>
      <Link
        href="/super-admin/gallery"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Gallery
      </Link>

      <AdminPageHeader
        title={album.title}
        description={album.description ?? "No description."}
      >
        <Button size="sm" variant="outline" asChild>
          <Link href={`/super-admin/gallery/${album.id}/edit`}>
            <Pencil />
            Edit Album
          </Link>
        </Button>
      </AdminPageHeader>

      <div className="border-border bg-card mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border p-4 text-sm">
        <Badge variant={album.isPublished ? "default" : "outline"}>
          {album.isPublished ? "Published" : "Draft"}
        </Badge>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Images className="size-4" />
          {imageCount} {imageCount === 1 ? "photo" : "photos"}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Video className="size-4" />
          {videoCount} {videoCount === 1 ? "video" : "videos"}
        </span>
        <span className="text-muted-foreground">
          {images.length} {images.length === 1 ? "item" : "items"} total
        </span>
        <span className="text-muted-foreground">
          Created {formatRelativeTime(album.createdAt)}
        </span>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge key={c} variant="outline" className="capitalize">
                {c}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-16">
          <Images className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            This album has no photos or videos yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border-border bg-muted overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-4/3 w-full">
                <MediaPreview image={image} />
                <span className="pointer-events-none absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  {image.mediaType === "video" ? (
                    <Video className="size-3.5" />
                  ) : (
                    <Images className="size-3.5" />
                  )}
                  {image.mediaType === "video" ? "Video" : "Image"}
                </span>
              </div>
              <div className="space-y-1 p-2.5">
                <p className="truncate text-xs font-medium capitalize">
                  {image.category}
                </p>
                {image.caption && (
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {image.caption}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  {formatRelativeTime(image.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
