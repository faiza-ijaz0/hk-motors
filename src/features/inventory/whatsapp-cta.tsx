import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

// Placeholder number — replace with a `website_settings.whatsapp_number`
// fetch once the data layer covers it (matches footer/contact pattern).
const WHATSAPP_NUMBER = "923001234567";

export function WhatsappCta({ carTitle }: { carTitle: string }) {
  const message = encodeURIComponent(
    `Hi, I'm interested in the ${carTitle} listed on your website. Is it still available?`,
  );

  return (
    <Button
      asChild
      size="lg"
      className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/85"
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle />
        Chat on WhatsApp
      </a>
    </Button>
  );
}
