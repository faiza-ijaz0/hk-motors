"use client";

import { CarFront, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  deleteCarImageAction,
  setPrimaryCarImageAction,
  uploadCarImageAction,
} from "@/services/admin-cars-actions";

import type { AdminCarImage } from "@/services/admin-cars";

export function CarImagesManager({
  carId,
  images,
}: {
  carId: string;
  images: AdminCarImage[];
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadCarImageAction(carId, formData);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (result.success) {
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed", { description: result.error });
    }
  }

  async function handleDelete(imageId: string, storagePath: string) {
    const result = await deleteCarImageAction(carId, imageId, storagePath);
    if (result.success) toast.success("Image deleted");
    else toast.error("Couldn't delete image", { description: result.error });
  }

  async function handleSetPrimary(imageId: string) {
    const result = await setPrimaryCarImageAction(carId, imageId);
    if (result.success) toast.success("Primary image updated");
    else toast.error("Something went wrong", { description: result.error });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Images</h2>
        <div>
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
            {uploading ? "Uploading…" : "Upload Image"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-10">
          <CarFront className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            No images yet — upload the first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border-border bg-muted group relative aspect-4/3 overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={image.altText ?? "Vehicle photo"}
                fill
                sizes="200px"
                className="object-cover"
              />
              {image.isPrimary && (
                <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                  Primary
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.isPrimary && (
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
