import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/constants/navigation";
import { socialLinks } from "@/constants/social-links";

// Placeholder values — replace with a `website_settings` fetch once that
// part of the data layer is wired up.
const contactDetails = [
  { label: "+92 300 1234567", href: "tel:+923001234567", icon: Phone },
  { label: "info@hkmotors.com", href: "mailto:info@hkmotors.com", icon: Mail },
  {
    label: "Message on WhatsApp",
    href: "https://wa.me/923001234567",
    icon: MessageCircle,
  },
  {
    label: "Dubai, United Arab Emirates",
    href: undefined,
    icon: MapPin,
  },
];

export function Footer() {
  return (
    <footer className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
              {siteConfig.description}
            </p>
            <p className="text-muted-foreground text-xs">
              Founder-led, with the same standards since day one.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:border-primary hover:text-foreground border-border flex size-9 items-center justify-center rounded-full border transition-colors"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-wide uppercase">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-wide uppercase">
              Get In Touch
            </h3>
            <ul className="space-y-2.5">
              {contactDetails.map((detail) => (
                <li key={detail.label}>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2.5 text-sm transition-colors"
                    >
                      <detail.icon className="size-4 shrink-0" />
                      {detail.label}
                    </a>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-2.5 text-sm">
                      <detail.icon className="size-4 shrink-0" />
                      {detail.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border mt-10 border-t pt-6">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
