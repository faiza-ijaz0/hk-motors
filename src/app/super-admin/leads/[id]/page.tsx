import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { LeadDetailPanel } from "@/features/admin/leads/lead-detail-panel";
import { getAdminLeadById, getAssignableStaff } from "@/services/admin-leads";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getAdminLeadById(id);
  return {
    title: `${result?.lead.fullName ?? "Lead"} | HK Motors Super Admin`,
  };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, staff] = await Promise.all([
    getAdminLeadById(id),
    getAssignableStaff(),
  ]);

  if (!result) notFound();

  return (
    <>
      <Link
        href="/super-admin/leads"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Inquiry Leads
      </Link>

      <AdminPageHeader
        title={result.lead.fullName}
        description="Review this inquiry, update its status, and add notes."
      />

      <LeadDetailPanel lead={result.lead} notes={result.notes} staff={staff} />
    </>
  );
}
