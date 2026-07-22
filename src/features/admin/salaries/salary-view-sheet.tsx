"use client";

import { Calendar, CalendarDays, History, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate, formatSalary } from "@/lib/format";
import { getEmployeeSalaryHistoryAction } from "@/services/admin-salaries-actions";

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

export function SalaryViewSheet({
  open,
  onOpenChange,
  salary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary: AdminSalaryListItem;
}) {
  const [history, setHistory] = useState<AdminSalaryListItem[] | null>(null);

  useEffect(() => {
    if (!open) return;
    setHistory(null);
    getEmployeeSalaryHistoryAction(salary.employeeId, salary.id).then(
      setHistory,
    );
  }, [open, salary.employeeId, salary.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-border bg-card border-b p-6">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full">
                <User className="text-primary size-5" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="font-display truncate text-xl">
                  {salary.employeeName}
                </SheetTitle>
                <SheetDescription className="mt-0.5">
                  {salary.employeeCode} · {MONTH_NAMES[salary.salaryMonth - 1]}{" "}
                  {salary.salaryYear}
                </SheetDescription>
              </div>
            </div>
            <Badge
              variant={salary.paymentStatus === "paid" ? "default" : "outline"}
              className="mt-1 shrink-0 capitalize"
            >
              {salary.paymentStatus}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-primary/20 bg-primary/5 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Wallet className="size-3.5" />
                Salary Amount
              </dt>
              <dd className="font-display mt-1.5 text-xl">
                {formatSalary(salary.salaryAmount)}
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <CalendarDays className="size-3.5" />
                Payment Date
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {salary.paymentDate ? formatDate(salary.paymentDate) : "—"}
              </dd>
            </div>
          </div>

          <div className="border-border bg-muted/30 rounded-xl border p-4">
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <Calendar className="size-3.5" />
              Salary Period
            </dt>
            <dd className="mt-1.5 text-sm font-medium">
              {MONTH_NAMES[salary.salaryMonth - 1]} {salary.salaryYear}
            </dd>
          </div>

          {salary.notes && (
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Notes
              </dt>
              <dd className="border-border bg-muted/30 mt-2 rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {salary.notes}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <History className="size-3.5" />
              Recent Payment History
            </dt>
            {history === null ? (
              <p className="text-muted-foreground mt-2 text-sm">Loading…</p>
            ) : history.length === 0 ? (
              <p className="text-muted-foreground mt-2 text-sm">
                No other salary records for this employee yet.
              </p>
            ) : (
              <ul className="border-border divide-border mt-2 divide-y rounded-xl border">
                {history.map((record) => (
                  <li
                    key={record.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <span>
                      {MONTH_NAMES[record.salaryMonth - 1]} {record.salaryYear}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {formatSalary(record.salaryAmount)}
                      </span>
                      <Badge
                        variant={
                          record.paymentStatus === "paid"
                            ? "default"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {record.paymentStatus}
                      </Badge>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
