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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmployeeAction,
  updateEmployeeAction,
} from "@/services/admin-employees-actions";

import type { AdminEmployeeListItem } from "@/services/admin-employees";
import type { Enums } from "@/types/supabase";

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: AdminEmployeeListItem;
}) {
  const isEdit = Boolean(employee);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Enums<"employee_status">>(
    employee?.status ?? "active",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const input = {
      fullName: String(form.get("full_name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      cnic: String(form.get("cnic") ?? ""),
      designation: String(form.get("designation") ?? ""),
      department: String(form.get("department") ?? ""),
      salary: String(form.get("salary") ?? ""),
      joiningDate: String(form.get("joining_date") ?? ""),
      workStartTime: String(form.get("work_start_time") ?? ""),
      workEndTime: String(form.get("work_end_time") ?? ""),
      status,
      address: String(form.get("address") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };

    const result = isEdit
      ? await updateEmployeeAction(employee!.id, input)
      : await createEmployeeAction(input);

    setSubmitting(false);

    if (result.success) {
      toast.success(isEdit ? "Employee updated" : "Employee added", {
        description: isEdit
          ? `${input.fullName} has been updated.`
          : `${input.fullName} has been added to the directory.`,
      });
      onOpenChange(false);
    } else {
      toast.error("Something went wrong", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this employee's profile, role, and pay details."
                : "Creates a permanent employee record in the company directory."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={employee?.fullName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={employee?.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  defaultValue={employee?.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC (optional)</Label>
                <Input
                  id="cnic"
                  name="cnic"
                  placeholder="42101-1234567-1"
                  defaultValue={employee?.cnic ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  required
                  placeholder="Sales Manager"
                  defaultValue={employee?.designation}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  required
                  placeholder="Sales"
                  defaultValue={employee?.department}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (PKR)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  defaultValue={employee?.salary}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  name="joining_date"
                  type="date"
                  required
                  defaultValue={employee?.joiningDate}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="work_start_time">Work Start Time</Label>
                <Input
                  id="work_start_time"
                  name="work_start_time"
                  type="time"
                  required
                  defaultValue={employee?.workStartTime?.slice(0, 5) ?? "09:00"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_end_time">Work End Time</Label>
                <Input
                  id="work_end_time"
                  name="work_end_time"
                  type="time"
                  required
                  defaultValue={employee?.workEndTime?.slice(0, 5) ?? "18:00"}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as Enums<"employee_status">)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={employee?.address ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={2}
                defaultValue={employee?.notes ?? ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
