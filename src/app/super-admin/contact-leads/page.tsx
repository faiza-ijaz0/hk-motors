import { CalendarDays, CalendarRange, Mail, MailWarning } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import { ContactLeadsRealtime } from "@/features/admin/contact-leads/contact-leads-realtime";
import { ContactLeadsTable } from "@/features/admin/contact-leads/contact-leads-table";
import { ContactLeadsToolbar } from "@/features/admin/contact-leads/contact-leads-toolbar";
import {
  ADMIN_CONTACT_MESSAGES_PAGE_SIZE,
  getAdminContactMessages,
  getContactMessageStats,
} from "@/services/admin-contact-messages";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Leads | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminContactLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    q: toSingle(params.q),
    status: toSingle(params.status),
    date: toSingle(params.date),
    page: toSingle(params.page),
  };

  const [{ messages, total, page }, stats] = await Promise.all([
    getAdminContactMessages(filters),
    getContactMessageStats(),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ADMIN_CONTACT_MESSAGES_PAGE_SIZE),
  );
  const hasFilters = Boolean(filters.q || filters.status || filters.date);

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    date: filters.date,
  };

  return (
    <>
      <ContactLeadsRealtime />

      <AdminPageHeader
        title="Contact Leads"
        description="Submissions received from the website's Contact Us page."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={Mail}
          label="Total Contact Leads"
          value={stats.total}
        />
        <AdminStatCard
          icon={MailWarning}
          label="Unread Messages"
          value={stats.unread}
        />
        <AdminStatCard
          icon={CalendarDays}
          label="Today's Messages"
          value={stats.today}
        />
        <AdminStatCard
          icon={CalendarRange}
          label="This Month's Messages"
          value={stats.thisMonth}
        />
      </div>

      <div className="mt-6 mb-4">
        <ContactLeadsToolbar />
      </div>

      <Card>
        <CardContent className={messages.length > 0 ? "px-0" : undefined}>
          <ContactLeadsTable messages={messages} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      <AdminPagination
        basePath="/super-admin/contact-leads"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
