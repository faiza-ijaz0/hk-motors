import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export type DashboardStats = {
  totalCars: number;
  totalUsers: number;
  totalLeads: number;
  totalAppointments: number;
  totalGalleryImages: number;
};

export type RecentActivityItem = {
  id: number;
  action: string;
  entityTable: string;
  createdAt: string;
};

export type RecentLeadItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: Enums<"lead_status">;
  createdAt: string;
};

export type RecentCarItem = {
  id: string;
  title: string;
  slug: string;
  status: Enums<"car_status">;
  price: number;
  currencyCode: string;
  createdAt: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = createAdminClient();

    const [cars, users, leads, appointments, galleryImages] = await Promise.all(
      [
        supabase.from("cars").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("gallery_images")
          .select("id", { count: "exact", head: true }),
      ],
    );

    return {
      totalCars: cars.count ?? 0,
      totalUsers: users.count ?? 0,
      totalLeads: leads.count ?? 0,
      totalAppointments: appointments.count ?? 0,
      totalGalleryImages: galleryImages.count ?? 0,
    };
  } catch (err) {
    console.error("getDashboardStats failed", err);
    return {
      totalCars: 0,
      totalUsers: 0,
      totalLeads: 0,
      totalAppointments: 0,
      totalGalleryImages: 0,
    };
  }
}

export async function getRecentActivity(
  limit = 8,
): Promise<RecentActivityItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("activity_logs")
      .select("id, action, entity_table, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      action: row.action,
      entityTable: row.entity_table,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("getRecentActivity failed", err);
    return [];
  }
}

export async function getRecentLeads(limit = 5): Promise<RecentLeadItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select("id, full_name, email, phone, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      status: row.status,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("getRecentLeads failed", err);
    return [];
  }
}

export async function getRecentCars(limit = 5): Promise<RecentCarItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cars")
      .select("id, title, slug, status, price, currency_code, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      price: row.price,
      currencyCode: row.currency_code,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("getRecentCars failed", err);
    return [];
  }
}
