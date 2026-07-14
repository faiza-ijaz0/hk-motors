"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { ActionResult } from "@/services/admin-settings-actions";

export function ImageUploader({
  label,
  imageUrl,
  onUpload,
  onRemove,
}: {
  label: string;
  imageUrl: string | null;
  onUpload: (formData: FormData) => Promise<ActionResult>;
  onRemove?: () => Promise<ActionResult>;
}) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await onUpload(formData);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (result.success) toast.success(`${label} updated`);
    else toast.error("Upload failed", { description: result.error });
  }

  async function handleRemove() {
    if (!onRemove) return;
    setRemoving(true);
    const result = await onRemove();
    setRemoving(false);
    if (result.success) toast.success(`${label} removed`);
    else toast.error("Something went wrong", { description: result.error });
  }

  return (
    <div className="flex items-center gap-4">
      <div className="border-border bg-muted relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
        {imageUrl ? (
          <Image src={imageUrl} alt={label} fill className="object-contain" />
        ) : (
          <ImageIcon className="text-muted-foreground size-6" />
        )}
      </div>
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload />
            {uploading ? "Uploading…" : imageUrl ? "Replace" : "Upload"}
          </Button>
          {imageUrl && onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={removing}
              onClick={handleRemove}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
