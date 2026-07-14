import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";

// Placeholder hrefs — replace with a `website_settings.social_links` fetch
// once that part of the data layer is wired up.
export const socialLinks = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
] as const;
