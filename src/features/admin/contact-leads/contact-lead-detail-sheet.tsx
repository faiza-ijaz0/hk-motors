"use client";

import { Mail, MailOpen } from "lucide-react";
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
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2 pr-8">
            <SheetTitle className="text-lg">{message.fullName}</SheetTitle>
            <Badge variant={message.isRead ? "outline" : "default"}>
              {message.isRead ? "Read" : "Unread"}
            </Badge>
          </div>
          <SheetDescription>
            Submitted {formatDateTime(message.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <dl className="flex-1 space-y-5 px-4 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Email
            </dt>
            <dd className="mt-1 break-all">{message.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Phone
            </dt>
            <dd className="mt-1">{message.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Subject
            </dt>
            <dd className="mt-1">{message.subject ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Message
            </dt>
            <dd className="bg-muted/50 mt-2 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </dd>
          </div>
        </dl>

        <SheetFooter>
          <Button
            onClick={handleToggleRead}
            disabled={isPending}
            variant={message.isRead ? "outline" : "default"}
          >
            {message.isRead ? <Mail /> : <MailOpen />}
            {message.isRead ? "Mark as Unread" : "Mark as Read"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
