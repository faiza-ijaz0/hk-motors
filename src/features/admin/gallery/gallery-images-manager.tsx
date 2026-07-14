"use client";

import {
  ChevronDown,
  ChevronUp,
  Images,
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
import {
  deleteGalleryImageAction,
  reorderGalleryImageAction,
  setAlbumCoverAction,
  uploadGalleryImageAction,
} from "@/services/admin-gallery-actions";

import type {
  AdminAlbumImage,
  GalleryCategory,
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
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("cars");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("caption", caption);
    formData.set("category", category);
    const result = await uploadGalleryImageAction(albumId, formData);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCaption("");

    if (result.success) {
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed", { description: result.error });
    }
  }

  async function handleDelete(imageId: string, storagePath: string) {
    const result = await deleteGalleryImageAction(
      albumId,
      imageId,
      storagePath,
    );
    if (result.success) toast.success("Image deleted");
    else toast.error("Couldn't delete image", { description: result.error });
  }

  async function handleSetCover(storagePath: string) {
    const result = await setAlbumCoverAction(albumId, storagePath);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-lg">Photos</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <Label htmlFor="caption" className="text-xs">
              Caption (optional)
            </Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption…"
              className="sm:w-48"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as GalleryCategory)}
            >
              <SelectTrigger className="sm:w-40">
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
            {uploading ? "Uploading…" : "Upload Photo"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-10">
          <Images className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            No photos yet — upload the first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="border-border bg-muted group relative aspect-4/3 overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={image.caption ?? "Gallery photo"}
                fill
                sizes="200px"
                className="object-cover"
              />
              {image.storagePath === coverImagePath && (
                <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                  Cover
                </span>
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white capitalize">
                {image.category}
              </span>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                  disabled={index === images.length - 1}
                  onClick={() => handleReorder(image.id, "down")}
                >
                  <ChevronDown />
                </Button>
                {image.storagePath !== coverImagePath && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label="Set as cover"
                    onClick={() => handleSetCover(image.storagePath)}
                  >
                    <Star />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Delete image"
                  onClick={() => handleDelete(image.id, image.storagePath)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
