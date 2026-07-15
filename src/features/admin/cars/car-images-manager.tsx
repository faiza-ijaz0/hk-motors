"use client";

import { Link2, PlayCircle, Star, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  addCarMediaUrlAction,
  deleteCarImageAction,
  setPrimaryCarImageAction,
  uploadCarImageAction,
} from "@/services/admin-cars-actions";

import type { AdminCarImage } from "@/services/admin-cars";
import type { Enums } from "@/types/supabase";

type StagedFile = { file: File; previewUrl: string };

export function CarImagesManager({
  carId,
  images,
}: {
  carId: string;
  images: AdminCarImage[];
}) {
  const [mediaType, setMediaType] =
    useState<Enums<"gallery_media_type">>("image");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [urlValue, setUrlValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setStaged((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeStaged(index: number) {
    setStaged((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleConfirmUpload() {
    if (staged.length === 0) return;
    setUploading(true);
    let successCount = 0;
    let firstError: string | undefined;

    // Uploaded sequentially — each upload reads the current media count to
    // assign position/primary status, so concurrent uploads would race.
    for (const { file } of staged) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadCarImageAction(carId, formData);
      if (result.success) successCount++;
      else firstError ??= result.error;
    }

    setUploading(false);
    for (const { previewUrl } of staged) URL.revokeObjectURL(previewUrl);
    const total = staged.length;
    setStaged([]);

    const label = mediaType === "video" ? "video" : "photo";
    if (successCount === total) {
      toast.success(
        total === 1
          ? `${label[0]!.toUpperCase()}${label.slice(1)} uploaded`
          : `${successCount} ${label}s uploaded`,
      );
    } else if (successCount > 0) {
      toast.warning(`${successCount} of ${total} ${label}s uploaded`, {
        description: firstError,
      });
    } else {
      toast.error("Upload failed", { description: firstError });
    }
  }

  async function handleAddUrl() {
    if (!urlValue.trim()) return;
    setAddingUrl(true);
    const result = await addCarMediaUrlAction(carId, {
      url: urlValue,
      mediaType,
    });
    setAddingUrl(false);

    if (result.success) {
      setUrlValue("");
      toast.success(mediaType === "video" ? "Video added" : "Photo added");
    } else {
      toast.error("Couldn't add URL", { description: result.error });
    }
  }

  async function handleDelete(image: AdminCarImage) {
    const result = await deleteCarImageAction(
      carId,
      image.id,
      image.storagePath,
      image.externalUrl,
      image.isPrimary,
    );
    if (result.success) toast.success("Deleted");
    else toast.error("Couldn't delete", { description: result.error });
  }

  async function handleSetPrimary(imageId: string) {
    const result = await setPrimaryCarImageAction(carId, imageId);
    if (result.success) toast.success("Primary image updated");
    else toast.error("Something went wrong", { description: result.error });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg">Photos &amp; Videos</h2>

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

        {mode === "upload" ? (
          <div className="space-y-3">
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
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload />
              Select {mediaType === "video" ? "Videos" : "Photos"}
            </Button>

            {staged.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {staged.map((item, index) => (
                    <div
                      key={item.previewUrl}
                      className="bg-muted relative aspect-square overflow-hidden rounded-lg border"
                    >
                      {mediaType === "video" ? (
                        <video
                          src={item.previewUrl}
                          muted
                          className="size-full object-cover"
                        />
                      ) : (
                        <Image
                          src={item.previewUrl}
                          alt="Pending upload preview"
                          fill
                          sizes="120px"
                          unoptimized
                          className="object-cover"
                        />
                      )}
                      <button
                        type="button"
                        aria-label="Remove from queue"
                        onClick={() => removeStaged(index)}
                        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={uploading}
                  onClick={handleConfirmUpload}
                >
                  {uploading
                    ? "Uploading…"
                    : `Upload ${staged.length} ${staged.length === 1 ? "file" : "files"}`}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
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
            </div>

            {urlValue.trim() && (
              <div className="bg-muted relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
                {mediaType === "video" ? (
                  <video
                    src={urlValue.trim()}
                    muted
                    controls
                    className="size-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary pasted URL, unknown host, plain preview only
                  <img
                    src={urlValue.trim()}
                    alt="URL preview"
                    className="size-full object-contain"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-10">
          <PlayCircle className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            No photos or videos yet — add the first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
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
                  alt={image.altText ?? "Vehicle photo"}
                  fill
                  sizes="200px"
                  unoptimized={image.externalUrl !== null}
                  className="object-cover"
                />
              )}
              {image.isPrimary && (
                <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                  Primary
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.isPrimary && image.mediaType === "image" && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label="Set as primary"
                    onClick={() => handleSetPrimary(image.id)}
                  >
                    <Star />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  aria-label="Delete media"
                  onClick={() => handleDelete(image)}
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
