"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalariesDateRangeFilter } from "@/features/admin/salaries/salaries-date-range-filter";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";

import type { EmployeeOption } from "@/services/admin-employees";

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

export function SalariesToolbar({
  employees,
  years,
}: {
  employees: EmployeeOption[];
  years: number[];
}) {
  const { searchParams, setParams } = useAdminTableParams();
  const employeeId = searchParams.get("employeeId") ?? "";
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";
  const status = searchParams.get("status") ?? "";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap">
      <Select
        value={employeeId || "all"}
        onValueChange={(value) =>
          setParams({ employeeId: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full lg:w-52">
          <SelectValue placeholder="All Employees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {employees.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.fullName} ({e.employeeCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month || "all"}
        onValueChange={(value) =>
          setParams({ month: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full lg:w-36">
          <SelectValue placeholder="All Months" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year || "all"}
        onValueChange={(value) =>
          setParams({ year: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full lg:w-32">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status || "all"}
        onValueChange={(value) =>
          setParams({ status: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full lg:w-32">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>

      <SalariesDateRangeFilter />
    </div>
  );
}
