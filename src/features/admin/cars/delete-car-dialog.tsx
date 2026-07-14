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
import { deleteCarAction } from "@/services/admin-cars-actions";

export function DeleteCarDialog({
  open,
  onOpenChange,
  carId,
  carTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId: string;
  carTitle: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    const result = await deleteCarAction(carId, carTitle);
    setSubmitting(false);

    if (result.success) {
      toast.success("Vehicle deleted", {
        description: `${carTitle} has been removed.`,
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
          <DialogTitle>Delete {carTitle}?</DialogTitle>
          <DialogDescription>
            This permanently deletes the listing and its images. This can&apos;t
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
