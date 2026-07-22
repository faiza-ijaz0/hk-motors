import { Building2, UserCheck, UserX, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import { EmployeesTable } from "@/features/admin/employees/employees-table";
import { EmployeesToolbar } from "@/features/admin/employees/employees-toolbar";
import {
  ADMIN_EMPLOYEES_PAGE_SIZE,
  getAdminEmployees,
  getEmployeeFilterOptions,
  getEmployeeStats,
} from "@/services/admin-employees";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminEmployeesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    q: toSingle(params.q),
    status: toSingle(params.status),
    department: toSingle(params.department),
    designation: toSingle(params.designation),
    dateFrom: toSingle(params.dateFrom),
    dateTo: toSingle(params.dateTo),
    page: toSingle(params.page),
  };

  const [{ employees, total, page }, stats, options] = await Promise.all([
    getAdminEmployees(filters),
    getEmployeeStats(),
    getEmployeeFilterOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_EMPLOYEES_PAGE_SIZE));
  const hasFilters = Boolean(
    filters.q ||
    filters.status ||
    filters.department ||
    filters.designation ||
    filters.dateFrom ||
    filters.dateTo,
  );

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    department: filters.department,
    designation: filters.designation,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  return (
    <>
      <AdminPageHeader
        title="Employees"
        description="Manage the HK Motors staff directory."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          icon={Users}
          label="Total Employees"
          value={stats.total}
        />
        <AdminStatCard
          icon={UserCheck}
          label="Active Employees"
          value={stats.active}
        />
        <AdminStatCard
          icon={UserX}
          label="Inactive Employees"
          value={stats.inactive}
        />
        <AdminStatCard
          icon={Building2}
          label="Departments"
          value={stats.departments}
        />
      </div>

      <div className="mt-6 mb-4">
        <EmployeesToolbar options={options} />
      </div>

      <Card>
        <CardContent className="px-0">
          <EmployeesTable employees={employees} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      {total > 0 && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Page {page} of {totalPages} · {total}{" "}
          {total === 1 ? "employee" : "employees"} total
        </p>
      )}

      <AdminPagination
        basePath="/super-admin/employees"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
