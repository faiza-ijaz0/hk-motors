"use client";

import {
  ChevronDown,
  ChevronUp,
  Images,
  Link2,
  PlayCircle,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  addGalleryUrlAction,
  deleteGalleryImageAction,
  reorderGalleryImageAction,
  setAlbumCoverAction,
  uploadGalleryImageAction,
} from "@/services/admin-gallery-actions";

import type {
  AdminAlbumImage,
  GalleryCategory,
  GalleryMediaType,
} from "@/services/admin-gallery";

const CATEGORIES: GalleryCategory[] = [
  "cars",
  "showroom",
  "deliveries",
  "events",
];

export function GalleryImagesManager({
  albumId,
  images,
  coverImagePath,
}: {
  albumId: string;
  images: AdminAlbumImage[];
  coverImagePath: string | null;
}) {
  const [mediaType, setMediaType] = useState<GalleryMediaType>("image");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("cars");
  const [urlValue, setUrlValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const [viewFilter, setViewFilter] = useState<"all" | GalleryMediaType>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageCount = images.filter((i) => i.mediaType === "image").length;
  const videoCount = images.filter((i) => i.mediaType === "video").length;
  const visibleImages =
    viewFilter === "all"
      ? images
      : images.filter((i) => i.mediaType === viewFilter);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let firstError: string | undefined;

    // Uploaded sequentially, not in parallel — each upload reads the
    // current image count to assign the new item's position, so
    // concurrent uploads would race and could assign duplicate positions.
    for (const file of files) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("caption", caption);
      formData.set("category", category);
      const result = await uploadGalleryImageAction(albumId, formData);
      if (result.success) successCount++;
      else firstError ??= result.error;
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCaption("");

    const label = mediaType === "video" ? "video" : "photo";
    if (successCount === files.length) {
      toast.success(
        files.length === 1
          ? `${label[0]!.toUpperCase()}${label.slice(1)} uploaded`
          : `${successCount} ${label}s uploaded`,
      );
    } else if (successCount > 0) {
      toast.warning(`${successCount} of ${files.length} ${label}s uploaded`, {
        description: firstError,
      });
    } else {
      toast.error("Upload failed", { description: firstError });
    }
  }

  async function handleAddUrl() {
    if (!urlValue.trim()) return;
    setAddingUrl(true);
    const result = await addGalleryUrlAction(albumId, {
      url: urlValue,
      caption,
      category,
      mediaType,
    });
    setAddingUrl(false);

    if (result.success) {
      setUrlValue("");
      setCaption("");
      toast.success(mediaType === "video" ? "Video added" : "Photo added");
    } else {
      toast.error("Couldn't add URL", { description: result.error });
    }
  }

  async function handleDelete(image: AdminAlbumImage) {
    const result = await deleteGalleryImageAction(
      albumId,
      image.id,
      image.storagePath,
      image.externalUrl,
    );
    if (result.success) toast.success("Deleted");
    else toast.error("Couldn't delete", { description: result.error });
  }

  async function handleSetCover(image: AdminAlbumImage) {
    const coverValue = image.storagePath ?? image.externalUrl;
    if (!coverValue) return;
    const result = await setAlbumCoverAction(albumId, coverValue);
    if (result.success) toast.success("Cover photo updated");
    else toast.error("Something went wrong", { description: result.error });
  }

  async function handleReorder(imageId: string, direction: "up" | "down") {
    const result = await reorderGalleryImageAction(albumId, imageId, direction);
    if (!result.success) {
      toast.error("Couldn't reorder", { description: result.error });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Photos &amp; Videos</h2>
      </div>

      <div className="border-border bg-muted/30 space-y-3 rounded-xl border p-4">
        <div className="flex flex-wrap gap-2">
          <div className="border-border inline-flex rounded-lg border p-0.5">
            {(["image", "video"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mediaType === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {type === "image" ? "Photo" : "Video"}
              </button>
            ))}
          </div>

          <div className="border-border inline-flex rounded-lg border p-0.5">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Upload className="size-3.5" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === "url"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Link2 className="size-3.5" />
              Paste URL
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="space-y-1 sm:w-48">
            <Label htmlFor="caption" className="text-xs">
              Caption (optional)
            </Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption…"
            />
          </div>
          <div className="space-y-1 sm:w-40">
            <Label className="text-xs">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as GalleryCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "upload" ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={mediaType === "video" ? "video/*" : "image/*"}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
                {uploading
                  ? "Uploading…"
                  : mediaType === "video"
                    ? "Upload Videos"
                    : "Upload Photos"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 space-y-1">
                <Label htmlFor="media_url" className="text-xs">
                  {mediaType === "video" ? "Video URL" : "Image URL"}
                </Label>
                <Input
                  id="media_url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder={
                    mediaType === "video"
                      ? "https://youtube.com/watch?v=… or a direct .mp4 link"
                      : "https://…"
                  }
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={addingUrl || !urlValue.trim()}
                onClick={handleAddUrl}
              >
                <Link2 />
                {addingUrl ? "Adding…" : "Add"}
              </Button>
            </>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="border-border inline-flex rounded-lg border p-0.5">
          {(
            [
              { key: "all", label: `All (${images.length})` },
              { key: "image", label: `Images (${imageCount})` },
              { key: "video", label: `Videos (${videoCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setViewFilter(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewFilter === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {visibleImages.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-10">
          <Images className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            {images.length === 0
              ? "No photos or videos yet — add the first one above."
              : "Nothing in this filter yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleImages.map((image, index) => {
            const isCover =
              coverImagePath !== null &&
              coverImagePath === (image.storagePath ?? image.externalUrl);

            return (
              <div
                key={image.id}
                className="border-border bg-muted group relative aspect-4/3 overflow-hidden rounded-lg border"
              >
                {image.mediaType === "video" ? (
                  <div className="flex size-full flex-col items-center justify-center gap-1 bg-black/80">
                    <PlayCircle className="size-8 text-white/80" />
                    <span className="text-xs font-medium text-white/70">
                      Video
                    </span>
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt={image.caption ?? "Gallery photo"}
                    fill
                    sizes="200px"
                    unoptimized={image.externalUrl !== null}
                    className="object-cover"
                  />
                )}
                {isCover && (
                  <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                    Cover
                  </span>
                )}
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white capitalize">
                  {image.category}
                </span>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {viewFilter === "all" && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() => handleReorder(image.id, "up")}
                      >
                        <ChevronUp />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        aria-label="Move down"
                        disabled={index === visibleImages.length - 1}
                        onClick={() => handleReorder(image.id, "down")}
                      >
                        <ChevronDown />
                      </Button>
                    </>
                  )}
                  {!isCover && image.mediaType === "image" && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      aria-label="Set as cover"
                      onClick={() => handleSetCover(image)}
                    >
                      <Star />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label="Delete"
                    onClick={() => handleDelete(image)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
