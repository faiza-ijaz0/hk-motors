import {
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate, formatSalary, formatTime } from "@/lib/format";

import type { AdminEmployeeListItem } from "@/services/admin-employees";

export function EmployeeViewSheet({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: AdminEmployeeListItem;
}) {
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
                  {employee.fullName}
                </SheetTitle>
                <SheetDescription className="mt-0.5">
                  {employee.employeeCode} · {employee.designation}
                </SheetDescription>
              </div>
            </div>
            <Badge
              variant={employee.status === "active" ? "default" : "outline"}
              className="mt-1 shrink-0 capitalize"
            >
              {employee.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Mail className="size-3.5" />
                Email
              </dt>
              <dd className="mt-1.5 text-sm font-medium break-all">
                {employee.email}
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Phone className="size-3.5" />
                Phone
              </dt>
              <dd className="mt-1.5 text-sm font-medium">{employee.phone}</dd>
            </div>
            {employee.cnic && (
              <div className="border-border bg-muted/30 rounded-xl border p-4">
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  CNIC
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{employee.cnic}</dd>
              </div>
            )}
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Building2 className="size-3.5" />
                Department
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {employee.department}
              </dd>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Briefcase className="size-3.5" />
                Designation
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {employee.designation}
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <CalendarDays className="size-3.5" />
                Joining Date
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {formatDate(employee.joiningDate)}
              </dd>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-primary/20 bg-primary/5 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Wallet className="size-3.5" />
                Salary
              </dt>
              <dd className="font-display mt-1.5 text-xl">
                {formatSalary(employee.salary)}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  / month
                </span>
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Clock className="size-3.5" />
                Working Hours
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {formatTime(employee.workStartTime)} –{" "}
                {formatTime(employee.workEndTime)}
              </dd>
            </div>
          </div>

          {employee.address && (
            <div>
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <MapPin className="size-3.5" />
                Address
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
                {employee.address}
              </dd>
            </div>
          )}

          {employee.notes && (
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Notes
              </dt>
              <dd className="border-border bg-muted/30 mt-2 rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {employee.notes}
              </dd>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
