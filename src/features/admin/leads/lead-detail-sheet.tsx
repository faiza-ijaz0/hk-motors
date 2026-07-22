"use client";

import { Mail, MailOpen, MessageSquare, Phone, Tag, User } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LEAD_TYPE_LABEL } from "@/features/admin/status-badges";
import { formatDateTime } from "@/lib/format";
import { setLeadReadStatusAction } from "@/services/admin-leads-actions";

import type { AdminLeadListItem } from "@/services/admin-leads";

export function LeadDetailSheet({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: AdminLeadListItem;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleRead() {
    startTransition(async () => {
      const result = await setLeadReadStatusAction(lead.id, !lead.isRead);
      if (result.success) {
        toast.success(lead.isRead ? "Marked as unread" : "Marked as read");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-border bg-card border-b p-6">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full">
                <User className="text-primary size-5" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="font-display truncate text-xl">
                  {lead.fullName}
                </SheetTitle>
                <SheetDescription className="mt-0.5">
                  {formatDateTime(lead.createdAt)}
                </SheetDescription>
              </div>
            </div>
            <Badge
              variant={lead.isRead ? "outline" : "default"}
              className="mt-1 shrink-0"
            >
              {lead.isRead ? "Read" : "Unread"}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Mail className="size-3.5" />
                Email
              </dt>
              <dd className="mt-1.5 text-sm font-medium break-all">
                {lead.email ?? "—"}
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Phone className="size-3.5" />
                Phone
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {lead.phone ?? "—"}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <Tag className="size-3.5" />
              Inquiry Type
            </dt>
            <dd className="font-display mt-1.5 text-lg leading-snug">
              {LEAD_TYPE_LABEL[lead.leadType]}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <MessageSquare className="size-3.5" />
              Message
            </dt>
            <dd className="border-border bg-muted/30 mt-2 rounded-xl border p-5 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
              {lead.message ?? "No message provided."}
            </dd>
          </div>
        </div>

        <SheetFooter className="border-border bg-card border-t p-4">
          <Button
            onClick={handleToggleRead}
            disabled={isPending}
            variant={lead.isRead ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            {lead.isRead ? <Mail /> : <MailOpen />}
            {lead.isRead ? "Mark as Unread" : "Mark as Read"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
