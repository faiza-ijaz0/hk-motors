import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Circle,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import { SalariesTable } from "@/features/admin/salaries/salaries-table";
import { SalariesToolbar } from "@/features/admin/salaries/salaries-toolbar";
import { formatSalary } from "@/lib/format";
import { getEmployeeOptions } from "@/services/admin-employees";
import {
  ADMIN_SALARIES_PAGE_SIZE,
  getAdminSalaries,
  getSalaryStats,
  getSalaryYearOptions,
} from "@/services/admin-salaries";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Salaries | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSalariesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    employeeId: toSingle(params.employeeId),
    month: toSingle(params.month),
    year: toSingle(params.year),
    status: toSingle(params.status),
    dateFrom: toSingle(params.dateFrom),
    dateTo: toSingle(params.dateTo),
    page: toSingle(params.page),
  };

  const [{ salaries, total, page }, stats, employees, years] =
    await Promise.all([
      getAdminSalaries(filters),
      getSalaryStats(),
      getEmployeeOptions(),
      getSalaryYearOptions(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_SALARIES_PAGE_SIZE));
  const hasFilters = Boolean(
    filters.employeeId ||
    filters.month ||
    filters.year ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo,
  );

  const flatSearchParams: Record<string, string | undefined> = {
    employeeId: filters.employeeId,
    month: filters.month,
    year: filters.year,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  return (
    <>
      <AdminPageHeader
        title="Employee Salaries"
        description="Monthly payroll and salary history for every employee."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <AdminStatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalEmployees}
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Paid Salaries"
          value={stats.paid}
        />
        <AdminStatCard
          icon={Circle}
          label="Unpaid Salaries"
          value={stats.unpaid}
        />
        <Card>
          <CardContent className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Current Month Payroll
              </p>
              <p className="font-display mt-1 text-2xl sm:text-3xl">
                {formatSalary(stats.currentMonthPayroll)}
              </p>
            </div>
            <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
              <CalendarDays className="text-primary size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Current Year Payroll
              </p>
              <p className="font-display mt-1 text-2xl sm:text-3xl">
                {formatSalary(stats.currentYearPayroll)}
              </p>
            </div>
            <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
              <CalendarRange className="text-primary size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 mb-4">
        <SalariesToolbar employees={employees} years={years} />
      </div>

      <Card>
        <CardContent className="px-0">
          <SalariesTable
            salaries={salaries}
            employees={employees}
            hasFilters={hasFilters}
          />
        </CardContent>
      </Card>

      {total > 0 && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Page {page} of {totalPages} · {total}{" "}
          {total === 1 ? "record" : "records"} total
        </p>
      )}

      <AdminPagination
        basePath="/super-admin/salaries"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
