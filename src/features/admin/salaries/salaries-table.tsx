"use client";

import {
  CheckCircle2,
  Circle,
  Eye,
  Pencil,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteSalaryDialog } from "@/features/admin/salaries/delete-salary-dialog";
import { SalaryFormDialog } from "@/features/admin/salaries/salary-form-dialog";
import { SalaryViewSheet } from "@/features/admin/salaries/salary-view-sheet";
import { formatDate, formatSalary } from "@/lib/format";
import { setSalaryPaymentStatusAction } from "@/services/admin-salaries-actions";

import type { EmployeeOption } from "@/services/admin-employees";
import type { AdminSalaryListItem } from "@/services/admin-salaries";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type DialogState =
  | { type: "create" }
  | { type: "view"; salary: AdminSalaryListItem }
  | { type: "edit"; salary: AdminSalaryListItem }
  | { type: "delete"; salary: AdminSalaryListItem }
  | null;

export function SalariesTable({
  salaries,
  employees,
  hasFilters,
}: {
  salaries: AdminSalaryListItem[];
  employees: EmployeeOption[];
  hasFilters: boolean;
}) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const [, startTransition] = useTransition();

  function handleToggleStatus(salary: AdminSalaryListItem) {
    startTransition(async () => {
      const next = salary.paymentStatus === "paid" ? "unpaid" : "paid";
      const result = await setSalaryPaymentStatusAction(salary.id, next);
      if (result.success) {
        toast.success(next === "paid" ? "Marked as paid" : "Marked as unpaid");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end px-6 pt-2">
        <Button
          size="sm"
          onClick={() => setDialog({ type: "create" })}
          disabled={employees.length === 0}
        >
          <Plus />
          Add Salary Record
        </Button>
      </div>

      {salaries.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={
            hasFilters
              ? "No salary records match your filters"
              : "No salary records yet"
          }
          description={
            hasFilters
              ? "Try adjusting or clearing your search and filters."
              : "Add a monthly salary record to start building payroll history."
          }
        />
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[24%] pl-6">Employee Name</TableHead>
              <TableHead className="w-[16%]">Month</TableHead>
              <TableHead className="w-[10%]">Year</TableHead>
              <TableHead className="w-[15%]">Salary Amount</TableHead>
              <TableHead className="w-[13%]">Payment Date</TableHead>
              <TableHead className="w-[9%]">Status</TableHead>
              <TableHead className="w-[13%] pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.map((salary) => (
              <TableRow
                key={salary.id}
                className={
                  salary.paymentStatus === "unpaid"
                    ? "bg-destructive/[0.03]"
                    : undefined
                }
              >
                <TableCell className="pl-6 font-medium">
                  <span className="block truncate">{salary.employeeName}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">
                    {MONTH_NAMES[salary.salaryMonth - 1]}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {salary.salaryYear}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">
                    {formatSalary(salary.salaryAmount)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">
                    {salary.paymentDate ? formatDate(salary.paymentDate) : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      salary.paymentStatus === "paid" ? "default" : "outline"
                    }
                    className="capitalize"
                  >
                    {salary.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={
                        salary.paymentStatus === "paid"
                          ? "Mark as unpaid"
                          : "Mark as paid"
                      }
                      title={
                        salary.paymentStatus === "paid"
                          ? "Mark as unpaid"
                          : "Mark as paid"
                      }
                      onClick={() => handleToggleStatus(salary)}
                    >
                      {salary.paymentStatus === "paid" ? (
                        <Circle />
                      ) : (
                        <CheckCircle2 />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View salary record"
                      onClick={() => setDialog({ type: "view", salary })}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit salary record"
                      onClick={() => setDialog({ type: "edit", salary })}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete salary record"
                      onClick={() => setDialog({ type: "delete", salary })}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SalaryFormDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && setDialog(null)}
        employees={employees}
      />

      {dialog?.type === "view" && (
        <SalaryViewSheet
          open
          onOpenChange={(open) => !open && setDialog(null)}
          salary={dialog.salary}
        />
      )}

      {dialog?.type === "edit" && (
        <SalaryFormDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          employees={employees}
          salary={dialog.salary}
        />
      )}

      {dialog?.type === "delete" && (
        <DeleteSalaryDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          salaryId={dialog.salary.id}
          label={`${dialog.salary.employeeName} — ${MONTH_NAMES[dialog.salary.salaryMonth - 1]} ${dialog.salary.salaryYear}`}
        />
      )}
    </>
  );
}
