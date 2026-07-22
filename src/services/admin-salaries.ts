import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_SALARIES_PAGE_SIZE = 15;

export type AdminSalaryListItem = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  salaryMonth: number;
  salaryYear: number;
  salaryAmount: number;
  paymentDate: string | null;
  paymentStatus: Enums<"salary_payment_status">;
  notes: string | null;
  createdAt: string;
};

export type AdminSalaryFilters = {
  employeeId?: string;
  month?: string;
  year?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

const SELECT_COLUMNS =
  "id, employee_id, salary_month, salary_year, salary_amount, payment_date, payment_status, notes, created_at, employees ( full_name, employee_code )";

function toListItem(row: {
  id: string;
  employee_id: string;
  salary_month: number;
  salary_year: number;
  salary_amount: number;
  payment_date: string | null;
  payment_status: Enums<"salary_payment_status">;
  notes: string | null;
  created_at: string;
  employees: { full_name: string; employee_code: string } | null;
}): AdminSalaryListItem {
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employees?.full_name ?? "Unknown employee",
    employeeCode: row.employees?.employee_code ?? "—",
    salaryMonth: row.salary_month,
    salaryYear: row.salary_year,
    salaryAmount: row.salary_amount,
    paymentDate: row.payment_date,
    paymentStatus: row.payment_status,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

const EMPTY_RESULT = (page: number) => ({
  salaries: [] as AdminSalaryListItem[],
  total: 0,
  page,
  pageSize: ADMIN_SALARIES_PAGE_SIZE,
});

export async function getAdminSalaries(filters: AdminSalaryFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getAdminSalaries: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * ADMIN_SALARIES_PAGE_SIZE;
  const to = from + ADMIN_SALARIES_PAGE_SIZE - 1;

  function applyFilters<
    T extends {
      eq: (col: string, val: string | number) => T;
      gte: (col: string, val: string) => T;
      lte: (col: string, val: string) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.employeeId) query = query.eq("employee_id", filters.employeeId);
    if (filters.month) query = query.eq("salary_month", Number(filters.month));
    if (filters.year) query = query.eq("salary_year", Number(filters.year));
    if (filters.status === "paid" || filters.status === "unpaid") {
      query = query.eq("payment_status", filters.status);
    }
    if (filters.dateFrom) query = query.gte("payment_date", filters.dateFrom);
    if (filters.dateTo) query = query.lte("payment_date", filters.dateTo);

    return query;
  }

  try {
    const { data, error, count } = await applyFilters(
      supabase
        .from("employee_salaries")
        .select(SELECT_COLUMNS, { count: "exact" }),
    )
      .order("salary_year", { ascending: false })
      .order("salary_month", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase
            .from("employee_salaries")
            .select("id", { count: "exact", head: true }),
        );
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }
      console.error("getAdminSalaries failed", error);
      return EMPTY_RESULT(page);
    }

    const salaries = (data ?? []).map(toListItem);

    return {
      salaries,
      total: count ?? 0,
      page,
      pageSize: ADMIN_SALARIES_PAGE_SIZE,
    };
  } catch (err) {
    console.error("getAdminSalaries: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export type SalaryStats = {
  totalEmployees: number;
  paid: number;
  unpaid: number;
  currentMonthPayroll: number;
  currentYearPayroll: number;
};

export async function getSalaryStats(): Promise<SalaryStats> {
  try {
    const supabase = createAdminClient();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [totalEmployees, paid, unpaid, monthRows, yearRows] =
      await Promise.all([
        supabase
          .from("employees")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("employee_salaries")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "paid"),
        supabase
          .from("employee_salaries")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "unpaid"),
        supabase
          .from("employee_salaries")
          .select("salary_amount")
          .eq("salary_month", month)
          .eq("salary_year", year),
        supabase
          .from("employee_salaries")
          .select("salary_amount")
          .eq("salary_year", year),
      ]);

    const sum = (rows: { salary_amount: number }[] | null) =>
      (rows ?? []).reduce((total, row) => total + row.salary_amount, 0);

    return {
      totalEmployees: totalEmployees.count ?? 0,
      paid: paid.count ?? 0,
      unpaid: unpaid.count ?? 0,
      currentMonthPayroll: sum(monthRows.data),
      currentYearPayroll: sum(yearRows.data),
    };
  } catch (err) {
    console.error("getSalaryStats failed", err);
    return {
      totalEmployees: 0,
      paid: 0,
      unpaid: 0,
      currentMonthPayroll: 0,
      currentYearPayroll: 0,
    };
  }
}

export type SalaryYearOption = number;

export async function getSalaryYearOptions(): Promise<SalaryYearOption[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employee_salaries")
      .select("salary_year");

    if (error || !data) return [new Date().getFullYear()];
    const years = Array.from(new Set(data.map((r) => r.salary_year))).sort(
      (a, b) => b - a,
    );
    return years.length > 0 ? years : [new Date().getFullYear()];
  } catch (err) {
    console.error("getSalaryYearOptions failed", err);
    return [new Date().getFullYear()];
  }
}

export async function getEmployeeSalaryHistory(
  employeeId: string,
  excludeId?: string,
): Promise<AdminSalaryListItem[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("employee_salaries")
      .select(SELECT_COLUMNS)
      .eq("employee_id", employeeId)
      .order("salary_year", { ascending: false })
      .order("salary_month", { ascending: false })
      .limit(6);

    if (excludeId) query = query.neq("id", excludeId);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(toListItem);
  } catch (err) {
    console.error("getEmployeeSalaryHistory failed", err);
    return [];
  }
}
