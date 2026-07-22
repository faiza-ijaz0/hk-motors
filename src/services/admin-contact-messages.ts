import { createAdminClient } from "@/lib/supabase/admin";

export const ADMIN_CONTACT_MESSAGES_PAGE_SIZE = 10;

export type AdminContactMessageFilters = {
  q?: string;
  status?: string;
  date?: string;
  page?: string;
};

export type AdminContactMessageListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type ContactMessageStats = {
  total: number;
  unread: number;
  today: number;
  thisMonth: number;
};

const SELECT_COLUMNS =
  "id, full_name, email, phone, subject, message, is_read, created_at";

/** Start-of-range ISO boundary for the "Today / This Week / This Month"
 * filters and stat cards — computed against the server's local clock, which
 * is acceptable here since this is an internal admin view, not a
 * timezone-sensitive customer-facing feature. */
function rangeStart(range?: string): string | null {
  const now = new Date();

  if (range === "today") {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();
  }
  if (range === "week") {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6,
    ).toISOString();
  }
  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  return null;
}

function toListItem(row: {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}): AdminContactMessageListItem {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

const EMPTY_RESULT = (page: number) => ({
  messages: [] as AdminContactMessageListItem[],
  total: 0,
  page,
  pageSize: ADMIN_CONTACT_MESSAGES_PAGE_SIZE,
});

export async function getAdminContactMessages(
  filters: AdminContactMessageFilters,
) {
  const page = Math.max(1, Number(filters.page) || 1);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error("getAdminContactMessages: admin client unavailable", err);
    return EMPTY_RESULT(page);
  }

  const from = (page - 1) * ADMIN_CONTACT_MESSAGES_PAGE_SIZE;
  const to = from + ADMIN_CONTACT_MESSAGES_PAGE_SIZE - 1;

  function applyFilters<
    T extends {
      or: (filters: string) => T;
      eq: (col: string, val: boolean) => T;
      gte: (col: string, val: string) => T;
    },
  >(q: T): T {
    let query = q;
    if (filters.q) {
      const term = filters.q.replace(/[%,]/g, "");
      query = query.or(
        `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,subject.ilike.%${term}%`,
      );
    }
    if (filters.status === "read") query = query.eq("is_read", true);
    if (filters.status === "unread") query = query.eq("is_read", false);

    const start = rangeStart(filters.date);
    if (start) query = query.gte("created_at", start);

    return query;
  }

  try {
    const { data, error, count } = await applyFilters(
      supabase
        .from("contact_messages")
        .select(SELECT_COLUMNS, { count: "exact" }),
    )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        const { count: total } = await applyFilters(
          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true }),
        );
        return { ...EMPTY_RESULT(page), total: total ?? 0 };
      }
      console.error("getAdminContactMessages failed", error);
      return EMPTY_RESULT(page);
    }

    const messages = (data ?? []).map(toListItem);

    return {
      messages,
      total: count ?? 0,
      page,
      pageSize: ADMIN_CONTACT_MESSAGES_PAGE_SIZE,
    };
  } catch (err) {
    console.error("getAdminContactMessages: unexpected failure", err);
    return EMPTY_RESULT(page);
  }
}

export async function getContactMessageStats(): Promise<ContactMessageStats> {
  try {
    const supabase = createAdminClient();
    const todayStart = rangeStart("today")!;
    const monthStart = rangeStart("month")!;

    const [total, unread, today, thisMonth] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart),
    ]);

    return {
      total: total.count ?? 0,
      unread: unread.count ?? 0,
      today: today.count ?? 0,
      thisMonth: thisMonth.count ?? 0,
    };
  } catch (err) {
    console.error("getContactMessageStats failed", err);
    return { total: 0, unread: 0, today: 0, thisMonth: 0 };
  }
}
