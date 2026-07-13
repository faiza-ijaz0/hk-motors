import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/contact-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description:
    "Get in touch with HK Motors — visit our showroom, call, or send a message and our team will respond shortly.",
};

// Placeholder values — replace with a `website_settings` fetch once the
// Supabase data layer is wired up (matches the footer, see src/components/layout/footer.tsx).
const contactDetails = [
  { label: "+92 300 1234567", href: "tel:+923001234567", icon: Phone },
  { label: "info@hkmotors.com", href: "mailto:info@hkmotors.com", icon: Mail },
  {
    label: "Message on WhatsApp",
    href: "https://wa.me/923001234567",
    icon: MessageCircle,
  },
  { label: "Lahore, Pakistan", href: undefined, icon: MapPin },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Have a question about a vehicle or one of our services? Send us a message and our team will respond shortly."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <FadeIn>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="border-border bg-card space-y-6 rounded-2xl border p-6 sm:p-8">
              <h2 className="font-display text-xl">Contact Details</h2>
              <ul className="space-y-4">
                {contactDetails.map((detail) => (
                  <li key={detail.label}>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-3 text-sm transition-colors"
                      >
                        <detail.icon className="text-primary size-4 shrink-0" />
                        {detail.label}
                      </a>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-3 text-sm">
                        <detail.icon className="text-primary size-4 shrink-0" />
                        {detail.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
