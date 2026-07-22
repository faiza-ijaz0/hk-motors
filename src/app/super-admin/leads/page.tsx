import {
  CalendarDays,
  CalendarRange,
  Inbox,
  MailCheck,
  MailWarning,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import { LeadsTable } from "@/features/admin/leads/leads-table";
import { LeadsToolbar } from "@/features/admin/leads/leads-toolbar";
import {
  ADMIN_LEADS_PAGE_SIZE,
  getAdminLeads,
  getLeadStats,
} from "@/services/admin-leads";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiry Leads | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    q: toSingle(params.q),
    status: toSingle(params.status),
    dateFrom: toSingle(params.dateFrom),
    dateTo: toSingle(params.dateTo),
    page: toSingle(params.page),
  };

  const [{ leads, total, page }, stats] = await Promise.all([
    getAdminLeads(filters),
    getLeadStats(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_LEADS_PAGE_SIZE));
  const hasFilters = Boolean(
    filters.q || filters.status || filters.dateFrom || filters.dateTo,
  );

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  return (
    <>
      <AdminPageHeader
        title="Inquiry Leads"
        description="Inquiries submitted across the website."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          icon={Inbox}
          label="Total Inquiry Leads"
          value={stats.total}
        />
        <AdminStatCard icon={Sparkles} label="New Leads" value={stats.new} />
        <AdminStatCard icon={MailCheck} label="Read Leads" value={stats.read} />
        <AdminStatCard
          icon={MailWarning}
          label="Unread Leads"
          value={stats.unread}
        />
        <AdminStatCard
          icon={CalendarDays}
          label="Today's Leads"
          value={stats.today}
        />
        <AdminStatCard
          icon={CalendarRange}
          label="This Month's Leads"
          value={stats.thisMonth}
        />
      </div>

      <div className="mt-6 mb-4">
        <LeadsToolbar />
      </div>

      <Card>
        <CardContent className={leads.length > 0 ? "px-0" : undefined}>
          <LeadsTable leads={leads} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      {total > 0 && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Page {page} of {totalPages} · {total} {total === 1 ? "lead" : "leads"}{" "}
          total
        </p>
      )}

      <AdminPagination
        basePath="/super-admin/leads"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
