import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export function WhatsappCta({ carTitle }: { carTitle: string }) {
  return (
    <WhatsAppButton
      className="w-full"
      message={`Hi, I'm interested in the ${carTitle} listed on your website. Is it still available?`}
    />
  );
}
