"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAlbumAction,
  updateAlbumAction,
  type AlbumFormInput,
} from "@/services/admin-gallery-actions";

import type { AdminAlbumDetail } from "@/services/admin-gallery";

export function AlbumForm({ album }: { album?: AdminAlbumDetail }) {
  const isEdit = Boolean(album);
  const [submitting, setSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(album?.isPublished ?? false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const input: AlbumFormInput = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      isPublished,
    };

    const result = isEdit
      ? await updateAlbumAction(album!.id, input)
      : await createAlbumAction(input);

    // createAlbumAction redirects on success and never returns a value in
    // that case — only the edit-success and validation/failure paths reach
    // here.
    if (result) {
      setSubmitting(false);
      if (result.success) {
        toast.success("Album saved");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={album?.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={album?.description ?? ""}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setIsPublished(checked === true)}
        />
        <Label htmlFor="is_published" className="font-normal">
          Published (visible on the public gallery)
        </Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Album"}
        </Button>
      </div>
    </form>
  );
}
