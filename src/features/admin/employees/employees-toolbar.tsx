"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeesDateRangeFilter } from "@/features/admin/employees/employees-date-range-filter";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";

import type { EmployeeFilterOptions } from "@/services/admin-employees";

export function EmployeesToolbar({
  options,
}: {
  options: EmployeeFilterOptions;
}) {
  const { searchParams, setParams } = useAdminTableParams();
  const status = searchParams.get("status") ?? "";
  const department = searchParams.get("department") ?? "";
  const designation = searchParams.get("designation") ?? "";

  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (q === current) return;
    const timeout = setTimeout(() => setParams({ q: q || null }), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="pl-9"
          aria-label="Search employees"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:shrink-0">
        <Select
          value={status || "all"}
          onValueChange={(value) =>
            setParams({ status: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full lg:w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={department || "all"}
          onValueChange={(value) =>
            setParams({ department: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {options.departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={designation || "all"}
          onValueChange={(value) =>
            setParams({ designation: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="All Designations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {options.designations.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EmployeesDateRangeFilter />
    </div>
  );
}
