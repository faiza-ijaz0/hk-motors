"use client";

import { Mail, MailOpen, MessageSquare, Phone, User } from "lucide-react";
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
import { formatDateTime } from "@/lib/format";
import { setContactMessageReadStatusAction } from "@/services/admin-contact-messages-actions";

import type { AdminContactMessageListItem } from "@/services/admin-contact-messages";

export function ContactLeadDetailSheet({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: AdminContactMessageListItem;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleRead() {
    startTransition(async () => {
      const result = await setContactMessageReadStatusAction(
        message.id,
        !message.isRead,
      );
      if (result.success) {
        toast.success(message.isRead ? "Marked as unread" : "Marked as read");
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
                  {message.fullName}
                </SheetTitle>
                <SheetDescription className="mt-0.5">
                  {formatDateTime(message.createdAt)}
                </SheetDescription>
              </div>
            </div>
            <Badge
              variant={message.isRead ? "outline" : "default"}
              className="mt-1 shrink-0"
            >
              {message.isRead ? "Read" : "Unread"}
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
                {message.email}
              </dd>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-4">
              <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Phone className="size-3.5" />
                Phone
              </dt>
              <dd className="mt-1.5 text-sm font-medium">
                {message.phone ?? "—"}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Subject
            </dt>
            <dd className="font-display mt-1.5 text-lg leading-snug">
              {message.subject ?? "—"}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <MessageSquare className="size-3.5" />
              Message
            </dt>
            <dd className="border-border bg-muted/30 mt-2 rounded-xl border p-5 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
              {message.message}
            </dd>
          </div>
        </div>

        <SheetFooter className="border-border bg-card border-t p-4">
          <Button
            onClick={handleToggleRead}
            disabled={isPending}
            variant={message.isRead ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            {message.isRead ? <Mail /> : <MailOpen />}
            {message.isRead ? "Mark as Unread" : "Mark as Read"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
