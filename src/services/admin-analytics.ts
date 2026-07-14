import { createAdminClient } from "@/lib/supabase/admin";

import type { Enums } from "@/types/supabase";

export type MonthlyLeadCount = { month: string; count: number };
export type StatusCount = { status: Enums<"lead_status">; count: number };
export type TypeCount = { type: Enums<"lead_type">; count: number };
export type TopViewedCar = { id: string; title: string; viewCount: number };

export type AdminAnalytics = {
  totalLeads: number;
  newLeadsThisWeek: number;
  conversionRate: number;
  totalVehicleViews: number;
  leadsByMonth: MonthlyLeadCount[];
  leadsByStatus: StatusCount[];
  leadsByType: TypeCount[];
  topViewedCars: TopViewedCar[];
};

const EMPTY: AdminAnalytics = {
  totalLeads: 0,
  newLeadsThisWeek: 0,
  conversionRate: 0,
  totalVehicleViews: 0,
  leadsByMonth: [],
  leadsByStatus: [],
  leadsByType: [],
  topViewedCars: [],
};

const STATUS_ORDER: Enums<"lead_status">[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
];

const TYPE_ORDER: Enums<"lead_type">[] = [
  "car_inquiry",
  "service_inquiry",
  "trade_in",
  "financing",
  "general",
];

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const supabase = createAdminClient();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      { data: leads, error: leadsError },
      { count: newLeadsThisWeek },
      { data: cars, error: carsError },
    ] = await Promise.all([
      supabase
        .from("leads")
        .select("status, lead_type, created_at")
        .gte("created_at", sixMonthsAgo.toISOString()),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),
      supabase
        .from("cars")
        .select("id, title, view_count")
        .order("view_count", { ascending: false })
        .limit(5),
    ]);

    if (leadsError) console.error("getAdminAnalytics leads failed", leadsError);
    if (carsError) console.error("getAdminAnalytics cars failed", carsError);

    const { count: totalLeads } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true });

    const { count: convertedLeads } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "converted");

    const { data: allViewCounts } = await supabase
      .from("cars")
      .select("view_count");

    const totalVehicleViews = (allViewCounts ?? []).reduce(
      (sum, row) => sum + row.view_count,
      0,
    );

    // leads by month: last 6 calendar months, oldest first
    const months: { key: string; label: string; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: monthLabel(d),
        date: d,
      });
    }
    const monthCounts = new Map(months.map((m) => [m.key, 0]));
    for (const lead of leads ?? []) {
      const d = new Date(lead.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthCounts.has(key)) {
        monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
      }
    }
    const leadsByMonth: MonthlyLeadCount[] = months.map((m) => ({
      month: m.label,
      count: monthCounts.get(m.key) ?? 0,
    }));

    const statusCounts = new Map<Enums<"lead_status">, number>();
    const typeCounts = new Map<Enums<"lead_type">, number>();
    for (const lead of leads ?? []) {
      statusCounts.set(lead.status, (statusCounts.get(lead.status) ?? 0) + 1);
      typeCounts.set(lead.lead_type, (typeCounts.get(lead.lead_type) ?? 0) + 1);
    }
    const leadsByStatus: StatusCount[] = STATUS_ORDER.map((status) => ({
      status,
      count: statusCounts.get(status) ?? 0,
    }));
    const leadsByType: TypeCount[] = TYPE_ORDER.map((type) => ({
      type,
      count: typeCounts.get(type) ?? 0,
    }));

    const total = totalLeads ?? 0;
    const converted = convertedLeads ?? 0;
    const conversionRate =
      total > 0 ? Math.round((converted / total) * 100) : 0;

    const topViewedCars: TopViewedCar[] = (cars ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      viewCount: c.view_count,
    }));

    return {
      totalLeads: total,
      newLeadsThisWeek: newLeadsThisWeek ?? 0,
      conversionRate,
      totalVehicleViews,
      leadsByMonth,
      leadsByStatus,
      leadsByType,
      topViewedCars,
    };
  } catch (err) {
    console.error("getAdminAnalytics: unexpected failure", err);
    return EMPTY;
  }
}
