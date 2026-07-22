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
import { deleteEmployeeAction } from "@/services/admin-employees-actions";

export function DeleteEmployeeDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    const result = await deleteEmployeeAction(employeeId, employeeName);
    setSubmitting(false);

    if (result.success) {
      toast.success("Employee deleted", {
        description: `${employeeName} and their salary history have been removed.`,
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
          <DialogTitle>Delete {employeeName}?</DialogTitle>
          <DialogDescription>
            This permanently deletes their profile and their entire salary
            history. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
