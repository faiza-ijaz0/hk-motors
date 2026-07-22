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
import { deleteSalaryAction } from "@/services/admin-salaries-actions";

export function DeleteSalaryDialog({
  open,
  onOpenChange,
  salaryId,
  label,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salaryId: string;
  label: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    const result = await deleteSalaryAction(salaryId);
    setSubmitting(false);

    if (result.success) {
      toast.success("Salary record deleted", {
        description: `${label} has been removed.`,
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
          <DialogTitle>Delete this salary record?</DialogTitle>
          <DialogDescription>
            {label} will be permanently removed from the payroll history. This
            can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
