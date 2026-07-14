import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const USERS_PAGE_SIZE = 10;

export type UserFilters = {
  q?: string;
  role?: string;
  status?: string;
  page?: string;
};

export type AdminUserListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Enums<"user_role">;
  status: Enums<"user_status">;
  createdAt: string;
};

const EMPTY_RESULT = (page: number) => ({
  users: [] as AdminUserListItem[],
  total: 0,
  page,
  pageSize: USERS_PAGE_SIZE,
});

export async function getUsers(filters: UserFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getUsers: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * USERS_PAGE_SIZE;
  const to = from + USERS_PAGE_SIZE - 1;

  try {
    let query = supabase
      .from("users")
      .select("id, full_name, email, phone, role, status, created_at", {
        count: "exact",
      });

    if (filters.q) {
      const term = filters.q.replace(/[%,]/g, "");
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }
    if (filters.role) {
      query = query.eq("role", filters.role as Enums<"user_role">);
    }
    if (filters.status) {
      query = query.eq("status", filters.status as Enums<"user_status">);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      if (error.code === "PGRST103") {
        let countQuery = supabase
          .from("users")
          .select("id", { count: "exact", head: true });
        if (filters.q) {
          const term = filters.q.replace(/[%,]/g, "");
          countQuery = countQuery.or(
            `full_name.ilike.%${term}%,email.ilike.%${term}%`,
          );
        }
        if (filters.role) {
          countQuery = countQuery.eq(
            "role",
            filters.role as Enums<"user_role">,
          );
        }
        if (filters.status) {
          countQuery = countQuery.eq(
            "status",
            filters.status as Enums<"user_status">,
          );
        }
        const { count: total } = await countQuery;
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }

      console.error("getUsers failed", error);
      return EMPTY_RESULT(page);
    }

    const users: AdminUserListItem[] = (data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
    }));

    return { users, total: count ?? 0, page, pageSize: USERS_PAGE_SIZE };
  } catch (err) {
    console.error("getUsers: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}
