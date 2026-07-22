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

/** Keeps the Subject/Message columns compact and prevents them from forcing
 * horizontal table overflow — full text stays available in View Details. */
function truncateWords(text: string, wordCount: number) {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return `${words.slice(0, wordCount).join(" ")}...`;
}

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
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[14%] pl-6">Full Name</TableHead>
            <TableHead className="w-[18%]">Email</TableHead>
            <TableHead className="w-[11%]">Phone</TableHead>
            <TableHead className="w-[13%]">Subject</TableHead>
            <TableHead className="w-[17%]">Message Preview</TableHead>
            <TableHead className="w-[10%]">Submitted</TableHead>
            <TableHead className="w-[8%]">Status</TableHead>
            <TableHead className="w-[9%] pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow
              key={message.id}
              className={!message.isRead ? "bg-primary/[0.03]" : undefined}
            >
              <TableCell className="pl-6 font-medium">
                <span className="block truncate">{message.fullName}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{message.email}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{message.phone ?? "—"}</span>
              </TableCell>
              <TableCell title={message.subject ?? undefined}>
                <span className="block truncate">
                  {message.subject ? truncateWords(message.subject, 2) : "—"}
                </span>
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={message.message}
              >
                <span className="block truncate">
                  {truncateWords(message.message, 3)}
                </span>
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={formatDate(message.createdAt)}
              >
                <span className="block truncate">
                  {formatRelativeTime(message.createdAt)}
                </span>
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
