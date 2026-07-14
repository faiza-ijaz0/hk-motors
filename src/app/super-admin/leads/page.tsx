import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { LeadsTable } from "@/features/admin/leads/leads-table";
import { LeadsToolbar } from "@/features/admin/leads/leads-toolbar";
import { ADMIN_LEADS_PAGE_SIZE, getAdminLeads } from "@/services/admin-leads";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | HK Motors Super Admin",
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
    type: toSingle(params.type),
    page: toSingle(params.page),
  };

  const { leads, total, page } = await getAdminLeads(filters);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_LEADS_PAGE_SIZE));
  const hasFilters = Boolean(filters.q || filters.status || filters.type);

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    type: filters.type,
  };

  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Inquiries submitted across the website."
      />

      <div className="mb-4">
        <LeadsToolbar />
      </div>

      <Card>
        <CardContent className={leads.length > 0 ? "px-0" : undefined}>
          <LeadsTable leads={leads} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      <AdminPagination
        basePath="/super-admin/leads"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
