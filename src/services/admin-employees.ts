import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_EMPLOYEES_PAGE_SIZE = 15;

export type AdminEmployeeListItem = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string | null;
  designation: string;
  department: string;
  salary: number;
  joiningDate: string;
  workStartTime: string;
  workEndTime: string;
  status: Enums<"employee_status">;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminEmployeeFilters = {
  q?: string;
  /** "active" | "inactive" */
  status?: string;
  department?: string;
  designation?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

const SELECT_COLUMNS =
  "id, employee_code, full_name, email, phone, cnic, designation, department, salary, joining_date, work_start_time, work_end_time, status, address, notes, created_at, updated_at";

function toListItem(row: {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  cnic: string | null;
  designation: string;
  department: string;
  salary: number;
  joining_date: string;
  work_start_time: string;
  work_end_time: string;
  status: Enums<"employee_status">;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}): AdminEmployeeListItem {
  return {
    id: row.id,
    employeeCode: row.employee_code,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    cnic: row.cnic,
    designation: row.designation,
    department: row.department,
    salary: row.salary,
    joiningDate: row.joining_date,
    workStartTime: row.work_start_time,
    workEndTime: row.work_end_time,
    status: row.status,
    address: row.address,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const EMPTY_RESULT = (page: number) => ({
  employees: [] as AdminEmployeeListItem[],
  total: 0,
  page,
  pageSize: ADMIN_EMPLOYEES_PAGE_SIZE,
});

export async function getAdminEmployees(filters: AdminEmployeeFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getAdminEmployees: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * ADMIN_EMPLOYEES_PAGE_SIZE;
  const to = from + ADMIN_EMPLOYEES_PAGE_SIZE - 1;

  function applyFilters<
    T extends {
      or: (filters: string) => T;
      eq: (col: string, val: string) => T;
      gte: (col: string, val: string) => T;
      lte: (col: string, val: string) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.q) {
      const term = filters.q.replace(/[%,]/g, "");
      query = query.or(
        `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
      );
    }
    if (filters.status === "active" || filters.status === "inactive") {
      query = query.eq("status", filters.status);
    }
    if (filters.department) query = query.eq("department", filters.department);
    if (filters.designation) {
      query = query.eq("designation", filters.designation);
    }
    if (filters.dateFrom) query = query.gte("joining_date", filters.dateFrom);
    if (filters.dateTo) query = query.lte("joining_date", filters.dateTo);

    return query;
  }

  try {
    const { data, error, count } = await applyFilters(
      supabase.from("employees").select(SELECT_COLUMNS, { count: "exact" }),
    )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase
            .from("employees")
            .select("id", { count: "exact", head: true }),
        );
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }
      console.error("getAdminEmployees failed", error);
      return EMPTY_RESULT(page);
    }

    const employees = (data ?? []).map(toListItem);

    return {
      employees,
      total: count ?? 0,
      page,
      pageSize: ADMIN_EMPLOYEES_PAGE_SIZE,
    };
  } catch (err) {
    console.error("getAdminEmployees: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export type EmployeeStats = {
  total: number;
  active: number;
  inactive: number;
  departments: number;
};

export async function getEmployeeStats(): Promise<EmployeeStats> {
  try {
    const supabase = createAdminClient();
    const [total, active, inactive, departmentRows] = await Promise.all([
      supabase.from("employees").select("id", { count: "exact", head: true }),
      supabase
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("status", "inactive"),
      supabase.from("employees").select("department"),
    ]);

    const departments = new Set(
      (departmentRows.data ?? []).map((r) => r.department),
    );

    return {
      total: total.count ?? 0,
      active: active.count ?? 0,
      inactive: inactive.count ?? 0,
      departments: departments.size,
    };
  } catch (err) {
    console.error("getEmployeeStats failed", err);
    return { total: 0, active: 0, inactive: 0, departments: 0 };
  }
}

export type EmployeeFilterOptions = {
  departments: string[];
  designations: string[];
};

export async function getEmployeeFilterOptions(): Promise<EmployeeFilterOptions> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employees")
      .select("department, designation");

    if (error || !data) return { departments: [], designations: [] };

    return {
      departments: Array.from(new Set(data.map((r) => r.department))).sort(),
      designations: Array.from(new Set(data.map((r) => r.designation))).sort(),
    };
  } catch (err) {
    console.error("getEmployeeFilterOptions failed", err);
    return { departments: [], designations: [] };
  }
}

export type EmployeeOption = {
  id: string;
  fullName: string;
  employeeCode: string;
};

export async function getEmployeeOptions(): Promise<EmployeeOption[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("employees")
      .select("id, full_name, employee_code")
      .eq("status", "active")
      .order("full_name");

    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      employeeCode: r.employee_code,
    }));
  } catch (err) {
    console.error("getEmployeeOptions failed", err);
    return [];
  }
}
