import { Mail, MapPin, Phone } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/constants/social-links";
import { ContactForm } from "@/features/contact/contact-form";
import { ContactHero } from "@/features/contact/contact-hero";
import { GoogleMap } from "@/features/contact/google-map";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description:
    "Get in touch with HK Motors in Dubai, United Arab Emirates — call, message us on WhatsApp, or send a message and our team will respond shortly.",
};

// Placeholder values — replace with a `website_settings` fetch once that
// part of the data layer is wired up (matches the footer).
const contactDetails = [
  { label: "+92 300 1234567", href: "tel:+923001234567", icon: Phone },
  { label: "info@hkmotors.com", href: "mailto:info@hkmotors.com", icon: Mail },
  {
    label: "Dubai, United Arab Emirates",
    href: undefined,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <FadeIn>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.1} className="space-y-6">
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

              <WhatsAppButton
                className="w-full"
                message="Hi, I have a question about HK Motors."
              />
            </div>

            <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
              <h2 className="font-display text-xl">Follow Us</h2>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-muted-foreground hover:border-primary hover:text-foreground border-border flex size-10 items-center justify-center rounded-full border transition-colors"
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="mt-10">
          <h2 className="font-display text-xl">Our Location</h2>
          <div className="mt-4">
            <GoogleMap />
          </div>
        </FadeIn>
      </section>
    </>
  );
}
