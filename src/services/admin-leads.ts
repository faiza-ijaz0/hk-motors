import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_LEADS_PAGE_SIZE = 10;

export type AdminLeadFilters = {
  q?: string;
  status?: string;
  type?: string;
  page?: string;
};

export type AdminLeadListItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  leadType: Enums<"lead_type">;
  status: Enums<"lead_status">;
  assignedToName: string | null;
  createdAt: string;
};

const EMPTY_RESULT = (page: number) => ({
  leads: [] as AdminLeadListItem[],
  total: 0,
  page,
  pageSize: ADMIN_LEADS_PAGE_SIZE,
});

export async function getAdminLeads(filters: AdminLeadFilters) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getAdminLeads: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * ADMIN_LEADS_PAGE_SIZE;
  const to = from + ADMIN_LEADS_PAGE_SIZE - 1;
  const select =
    "id, full_name, email, phone, lead_type, status, created_at, users ( full_name )";

  function applyFilters<
    T extends {
      or: (filters: string) => T;
      eq: (col: string, val: string) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.q) {
      const term = filters.q.replace(/[%,]/g, "");
      query = query.or(
        `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
      );
    }
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.type) query = query.eq("lead_type", filters.type);
    return query;
  }

  try {
    const { data, error, count } = await applyFilters(
      supabase.from("leads").select(select, { count: "exact" }),
    )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase.from("leads").select("id", { count: "exact", head: true }),
        );
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }
      console.error("getAdminLeads failed", error);
      return EMPTY_RESULT(page);
    }

    const leads: AdminLeadListItem[] = (data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      leadType: row.lead_type,
      status: row.status,
      assignedToName: row.users?.full_name ?? null,
      createdAt: row.created_at,
    }));

    return { leads, total: count ?? 0, page, pageSize: ADMIN_LEADS_PAGE_SIZE };
  } catch (err) {
    console.error("getAdminLeads: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export type StaffOption = { id: string; fullName: string };

export async function getAssignableStaff(): Promise<StaffOption[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name")
      .in("role", ["admin", "employee", "super_admin"])
      .eq("status", "active")
      .order("full_name");

    if (error || !data) {
      if (error) console.error("getAssignableStaff failed", error);
      return [];
    }
    return data.map((row) => ({ id: row.id, fullName: row.full_name }));
  } catch (err) {
    console.error("getAssignableStaff: unexpected failure", err);
    return [];
  }
}

export type AdminLeadDetail = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  leadType: Enums<"lead_type">;
  source: Enums<"lead_source">;
  status: Enums<"lead_status">;
  assignedTo: string | null;
  assignedToName: string | null;
  carId: string | null;
  carTitle: string | null;
  serviceId: string | null;
  serviceTitle: string | null;
  createdAt: string;
};

export type AdminLeadNote = {
  id: string;
  note: string;
  createdAt: string;
};

export async function getAdminLeadById(id: string): Promise<{
  lead: AdminLeadDetail;
  notes: AdminLeadNote[];
} | null> {
  try {
    const supabase = createAdminClient();
    const [{ data, error }, { data: notes, error: notesError }] =
      await Promise.all([
        supabase
          .from("leads")
          .select(
            `id, full_name, email, phone, message, lead_type, source, status,
             assigned_to, created_at,
             users ( full_name ),
             cars ( id, title ),
             services ( id, title )`,
          )
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("lead_notes")
          .select("id, note, created_at")
          .eq("lead_id", id)
          .order("created_at", { ascending: false }),
      ]);

    if (error || !data) {
      if (error) console.error("getAdminLeadById failed", error);
      return null;
    }
    if (notesError) console.error("getAdminLeadById notes failed", notesError);

    return {
      lead: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        leadType: data.lead_type,
        source: data.source,
        status: data.status,
        assignedTo: data.assigned_to,
        assignedToName: data.users?.full_name ?? null,
        carId: data.cars?.id ?? null,
        carTitle: data.cars?.title ?? null,
        serviceId: data.services?.id ?? null,
        serviceTitle: data.services?.title ?? null,
        createdAt: data.created_at,
      },
      notes: (notes ?? []).map((n) => ({
        id: n.id,
        note: n.note,
        createdAt: n.created_at,
      })),
    };
  } catch (err) {
    console.error("getAdminLeadById: unexpected failure", err);
    return null;
  }
}
