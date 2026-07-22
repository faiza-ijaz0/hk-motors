"use client";

import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

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
import { DeleteEmployeeDialog } from "@/features/admin/employees/delete-employee-dialog";
import { EmployeeFormDialog } from "@/features/admin/employees/employee-form-dialog";
import { EmployeeViewSheet } from "@/features/admin/employees/employee-view-sheet";
import { formatDate, formatSalary } from "@/lib/format";

import type { AdminEmployeeListItem } from "@/services/admin-employees";

type DialogState =
  | { type: "create" }
  | { type: "view"; employee: AdminEmployeeListItem }
  | { type: "edit"; employee: AdminEmployeeListItem }
  | { type: "delete"; employee: AdminEmployeeListItem }
  | null;

export function EmployeesTable({
  employees,
  hasFilters,
}: {
  employees: AdminEmployeeListItem[];
  hasFilters: boolean;
}) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <>
      <div className="mb-4 flex justify-end px-6 pt-2">
        <Button size="sm" onClick={() => setDialog({ type: "create" })}>
          <Plus />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            hasFilters ? "No employees match your filters" : "No employees yet"
          }
          description={
            hasFilters
              ? "Try adjusting or clearing your search and filters."
              : "Add your first employee to start building the company directory."
          }
        />
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[9%] pl-6">Employee ID</TableHead>
              <TableHead className="w-[14%]">Name</TableHead>
              <TableHead className="w-[19%]">Email</TableHead>
              <TableHead className="w-[11%]">Phone</TableHead>
              <TableHead className="w-[12%]">Designation</TableHead>
              <TableHead className="w-[9%]">Salary</TableHead>
              <TableHead className="w-[9%]">Joining Date</TableHead>
              <TableHead className="w-[7%]">Status</TableHead>
              <TableHead className="w-[10%] pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="text-muted-foreground pl-6">
                  <span className="block truncate">
                    {employee.employeeCode}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <span className="block truncate">{employee.fullName}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">{employee.email}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">{employee.phone}</span>
                </TableCell>
                <TableCell>
                  <span className="block truncate">{employee.designation}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="block truncate">
                    {formatSalary(employee.salary)}
                  </span>
                </TableCell>
                <TableCell
                  className="text-muted-foreground"
                  title={formatDate(employee.joiningDate)}
                >
                  <span className="block truncate">
                    {formatDate(employee.joiningDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === "active" ? "default" : "outline"
                    }
                    className="capitalize"
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View employee"
                      onClick={() => setDialog({ type: "view", employee })}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit employee"
                      onClick={() => setDialog({ type: "edit", employee })}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete employee"
                      onClick={() => setDialog({ type: "delete", employee })}
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

      <EmployeeFormDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && setDialog(null)}
      />

      {dialog?.type === "view" && (
        <EmployeeViewSheet
          open
          onOpenChange={(open) => !open && setDialog(null)}
          employee={dialog.employee}
        />
      )}

      {dialog?.type === "edit" && (
        <EmployeeFormDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          employee={dialog.employee}
        />
      )}

      {dialog?.type === "delete" && (
        <DeleteEmployeeDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          employeeId={dialog.employee.id}
          employeeName={dialog.employee.fullName}
        />
      )}
    </>
  );
}
