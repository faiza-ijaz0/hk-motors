"use client";

import { Eye, Inbox, Mail, MailOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadDetailSheet } from "@/features/admin/leads/lead-detail-sheet";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { setLeadReadStatusAction } from "@/services/admin-leads-actions";

import type { AdminLeadListItem } from "@/services/admin-leads";

export function LeadsTable({
  leads,
  hasFilters,
}: {
  leads: AdminLeadListItem[];
  hasFilters: boolean;
}) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const viewing = leads.find((l) => l.id === viewingId) ?? null;
  const [, startTransition] = useTransition();

  function handleToggleRead(lead: AdminLeadListItem) {
    startTransition(async () => {
      const nextIsRead = !lead.isRead;
      const result = await setLeadReadStatusAction(lead.id, nextIsRead);
      if (result.success) {
        toast.success(nextIsRead ? "Marked as read" : "Marked as unread");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={
          hasFilters
            ? "No inquiry leads match your filters"
            : "No inquiry leads yet"
        }
        description={
          hasFilters
            ? "Try adjusting or clearing your search and filters."
            : "Inquiries submitted across the website will show up here."
        }
      />
    );
  }

  return (
    <>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%] pl-6">Name</TableHead>
            <TableHead className="w-[26%]">Email</TableHead>
            <TableHead className="w-[16%]">Phone</TableHead>
            <TableHead className="w-[12%]">Status</TableHead>
            <TableHead className="w-[14%]">Created Date</TableHead>
            <TableHead className="w-[12%] pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className={!lead.isRead ? "bg-primary/[0.03]" : undefined}
            >
              <TableCell className="pl-6 font-medium">
                <span className="block truncate">{lead.fullName}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{lead.email ?? "—"}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{lead.phone ?? "—"}</span>
              </TableCell>
              <TableCell>
                <Badge variant={lead.isRead ? "outline" : "default"}>
                  {lead.isRead ? "Read" : "Unread"}
                </Badge>
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={formatDate(lead.createdAt)}
              >
                <span className="block truncate">
                  {formatRelativeTime(lead.createdAt)}
                </span>
              </TableCell>
              <TableCell className="pr-6">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={lead.isRead ? "Mark as unread" : "Mark as read"}
                    title={lead.isRead ? "Mark as unread" : "Mark as read"}
                    onClick={() => handleToggleRead(lead)}
                  >
                    {lead.isRead ? <Mail /> : <MailOpen />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="View lead"
                    onClick={() => setViewingId(lead.id)}
                  >
                    <Eye />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {viewing && (
        <LeadDetailSheet
          open
          onOpenChange={(open) => !open && setViewingId(null)}
          lead={viewing}
        />
      )}
    </>
  );
}
