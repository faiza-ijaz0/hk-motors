"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAlbumAction } from "@/services/admin-gallery-actions";

export function DeleteAlbumDialog({
  open,
  onOpenChange,
  albumId,
  albumTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  albumTitle: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    const result = await deleteAlbumAction(albumId, albumTitle);
    setSubmitting(false);

    if (result.success) {
      toast.success("Album deleted", {
        description: `${albumTitle} has been removed.`,
      });
      onOpenChange(false);
    } else {
      toast.error("Something went wrong", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {albumTitle}?</DialogTitle>
          <DialogDescription>
            This permanently deletes the album and all its photos. This
            can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
