"use client";

import { Eye, Mail, MailOpen, MessageSquare } from "lucide-react";
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
import { ContactLeadDetailSheet } from "@/features/admin/contact-leads/contact-lead-detail-sheet";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { setContactMessageReadStatusAction } from "@/services/admin-contact-messages-actions";

import type { AdminContactMessageListItem } from "@/services/admin-contact-messages";

export function ContactLeadsTable({
  messages,
  hasFilters,
}: {
  messages: AdminContactMessageListItem[];
  hasFilters: boolean;
}) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const viewing = messages.find((m) => m.id === viewingId) ?? null;
  const [, startTransition] = useTransition();

  function handleToggleRead(message: AdminContactMessageListItem) {
    startTransition(async () => {
      const nextIsRead = !message.isRead;
      const result = await setContactMessageReadStatusAction(
        message.id,
        nextIsRead,
      );
      if (result.success) {
        toast.success(nextIsRead ? "Marked as read" : "Marked as unread");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title={
          hasFilters
            ? "No contact leads match your filters"
            : "No contact leads yet"
        }
        description={
          hasFilters
            ? "Try adjusting or clearing your search and filters."
            : "Submissions from the Contact Us page will show up here."
        }
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message Preview</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow
              key={message.id}
              className={!message.isRead ? "bg-primary/[0.03]" : undefined}
            >
              <TableCell className="pl-6 font-medium">
                {message.fullName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {message.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {message.phone ?? "—"}
              </TableCell>
              <TableCell className="max-w-[160px]">
                <span className="block truncate">{message.subject ?? "—"}</span>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[240px]">
                <span className="block truncate">{message.message}</span>
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={formatDate(message.createdAt)}
              >
                {formatRelativeTime(message.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={message.isRead ? "outline" : "default"}>
                  {message.isRead ? "Read" : "Unread"}
                </Badge>
              </TableCell>
              <TableCell className="pr-6">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      message.isRead ? "Mark as unread" : "Mark as read"
                    }
                    title={message.isRead ? "Mark as unread" : "Mark as read"}
                    onClick={() => handleToggleRead(message)}
                  >
                    {message.isRead ? <Mail /> : <MailOpen />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="View message"
                    onClick={() => setViewingId(message.id)}
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
        <ContactLeadDetailSheet
          open
          onOpenChange={(open) => !open && setViewingId(null)}
          message={viewing}
        />
      )}
    </>
  );
}
