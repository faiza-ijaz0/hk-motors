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
  createSalaryAction,
  updateSalaryAction,
} from "@/services/admin-salaries-actions";

import type { EmployeeOption } from "@/services/admin-employees";
import type { AdminSalaryListItem } from "@/services/admin-salaries";
import type { Enums } from "@/types/supabase";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function SalaryFormDialog({
  open,
  onOpenChange,
  employees,
  salary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: EmployeeOption[];
  salary?: AdminSalaryListItem;
}) {
  const isEdit = Boolean(salary);
  const [submitting, setSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState(salary?.employeeId ?? "");
  const [month, setMonth] = useState(
    String(salary?.salaryMonth ?? new Date().getMonth() + 1),
  );
  const [status, setStatus] = useState<Enums<"salary_payment_status">>(
    salary?.paymentStatus ?? "unpaid",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const input = {
      employeeId,
      salaryMonth: month,
      salaryYear: String(form.get("salary_year") ?? ""),
      salaryAmount: String(form.get("salary_amount") ?? ""),
      paymentDate: String(form.get("payment_date") ?? ""),
      paymentStatus: status,
      notes: String(form.get("notes") ?? ""),
    };

    const result = isEdit
      ? await updateSalaryAction(salary!.id, input)
      : await createSalaryAction(input);

    setSubmitting(false);

    if (result.success) {
      toast.success(isEdit ? "Salary record updated" : "Salary record added");
      onOpenChange(false);
    } else {
      toast.error("Something went wrong", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Salary Record" : "Add Salary Record"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this payroll entry."
                : "Creates a permanent payroll entry for the selected month."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.fullName} ({e.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Salary Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_year">Salary Year</Label>
                <Input
                  id="salary_year"
                  name="salary_year"
                  type="number"
                  min={2000}
                  max={2100}
                  required
                  defaultValue={salary?.salaryYear ?? new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary_amount">Salary Amount (PKR)</Label>
                <Input
                  id="salary_amount"
                  name="salary_amount"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  defaultValue={salary?.salaryAmount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_date">Payment Date</Label>
                <Input
                  id="payment_date"
                  name="payment_date"
                  type="date"
                  defaultValue={salary?.paymentDate ?? ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as Enums<"salary_payment_status">)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={2}
                defaultValue={salary?.notes ?? ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting || !employeeId}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Add Salary Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
