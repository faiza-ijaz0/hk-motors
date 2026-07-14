"use client";

import { Inbox, Eye } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LEAD_STATUS_VARIANT,
  LEAD_TYPE_LABEL,
} from "@/features/admin/status-badges";
import { formatRelativeTime } from "@/lib/format";
import { updateLeadStatusAction } from "@/services/admin-leads-actions";

import type { AdminLeadListItem } from "@/services/admin-leads";
import type { Enums } from "@/types/supabase";

const STATUS_OPTIONS: Enums<"lead_status">[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
];

export function LeadsTable({
  leads,
  hasFilters,
}: {
  leads: AdminLeadListItem[];
  hasFilters: boolean;
}) {
  const [, startTransition] = useTransition();

  function handleStatusChange(lead: AdminLeadListItem, status: string) {
    startTransition(async () => {
      const result = await updateLeadStatusAction(
        lead.id,
        status as Enums<"lead_status">,
      );
      if (result.success) {
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={hasFilters ? "No leads match your filters" : "No leads yet"}
        description={
          hasFilters
            ? "Try adjusting or clearing your search and filters."
            : "Inquiries submitted across the website will show up here."
        }
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="pr-6 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="pl-6 font-medium">{lead.fullName}</TableCell>
            <TableCell className="text-muted-foreground">
              {lead.email ?? lead.phone ?? "—"}
            </TableCell>
            <TableCell>{LEAD_TYPE_LABEL[lead.leadType]}</TableCell>
            <TableCell>
              <Select
                value={lead.status}
                onValueChange={(value) => handleStatusChange(lead, value)}
              >
                <SelectTrigger size="sm" className="w-36">
                  <SelectValue>
                    <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
                      {lead.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {lead.assignedToName ?? "Unassigned"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatRelativeTime(lead.createdAt)}
            </TableCell>
            <TableCell className="pr-6">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="View lead"
                  asChild
                >
                  <Link href={`/super-admin/leads/${lead.id}`}>
                    <Eye />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
