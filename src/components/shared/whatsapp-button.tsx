import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder number — replace with a `website_settings.whatsapp_number`
// fetch once that part of the data layer is wired up.
const WHATSAPP_NUMBER = "923001234567";

export function WhatsAppButton({
  message,
  className,
  size = "lg",
}: {
  message: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const encoded = encodeURIComponent(message);

  return (
    <Button
      asChild
      size={size}
      className={cn("bg-[#25D366] text-white hover:bg-[#25D366]/85", className)}
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle />
        Chat on WhatsApp
      </a>
    </Button>
  );
}
