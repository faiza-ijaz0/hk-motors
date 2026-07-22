import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export const ADMIN_LEADS_PAGE_SIZE = 15;

/** `leads.status` has no dedicated read/unread column — a fresh inquiry
 * starts as "new", so that's treated as Unread; anything staff has since
 * moved off "new" (contacted, lost) counts as Read. "Mark as Read" moves a
 * lead to "contacted"; "Mark as Unread" resets it to "new". */
const UNREAD_STATUS: Enums<"lead_status"> = "new";

export type AdminLeadFilters = {
  q?: string;
  /** "read" | "unread" */
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

export type AdminLeadListItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  leadType: Enums<"lead_type">;
  message: string | null;
  status: Enums<"lead_status">;
  isRead: boolean;
  assignedToName: string | null;
  createdAt: string;
};

const EMPTY_RESULT = (page: number) => ({
  leads: [] as AdminLeadListItem[],
  total: 0,
  page,
  pageSize: ADMIN_LEADS_PAGE_SIZE,
});

function toListItem(row: {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  lead_type: Enums<"lead_type">;
  message: string | null;
  status: Enums<"lead_status">;
  created_at: string;
  users: { full_name: string } | null;
}): AdminLeadListItem {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    leadType: row.lead_type,
    message: row.message,
    status: row.status,
    isRead: row.status !== UNREAD_STATUS,
    assignedToName: row.users?.full_name ?? null,
    createdAt: row.created_at,
  };
}

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
    "id, full_name, email, phone, lead_type, message, status, created_at, users ( full_name )";

  function applyFilters<
    T extends {
      or: (filters: string) => T;
      eq: (col: string, val: string) => T;
      neq: (col: string, val: string) => T;
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
    if (filters.status === "read") query = query.neq("status", UNREAD_STATUS);
    if (filters.status === "unread") query = query.eq("status", UNREAD_STATUS);

    if (filters.dateFrom) {
      query = query.gte(
        "created_at",
        new Date(`${filters.dateFrom}T00:00:00`).toISOString(),
      );
    }
    if (filters.dateTo) {
      query = query.lte(
        "created_at",
        new Date(`${filters.dateTo}T23:59:59.999`).toISOString(),
      );
    }

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

    const leads = (data ?? []).map(toListItem);

    return { leads, total: count ?? 0, page, pageSize: ADMIN_LEADS_PAGE_SIZE };
  } catch (err) {
    console.error("getAdminLeads: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export type LeadStats = {
  total: number;
  new: number;
  read: number;
  unread: number;
  today: number;
  thisMonth: number;
};

function rangeStart(range: "today" | "month"): string {
  const now = new Date();
  if (range === "today") {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();
  }
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function getLeadStats(): Promise<LeadStats> {
  try {
    const supabase = createAdminClient();
    const todayStart = rangeStart("today");
    const monthStart = rangeStart("month");

    const [total, unread, read, today, thisMonth] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", UNREAD_STATUS),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .neq("status", UNREAD_STATUS),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart),
    ]);

    return {
      total: total.count ?? 0,
      new: unread.count ?? 0,
      unread: unread.count ?? 0,
      read: read.count ?? 0,
      today: today.count ?? 0,
      thisMonth: thisMonth.count ?? 0,
    };
  } catch (err) {
    console.error("getLeadStats failed", err);
    return { total: 0, new: 0, read: 0, unread: 0, today: 0, thisMonth: 0 };
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
