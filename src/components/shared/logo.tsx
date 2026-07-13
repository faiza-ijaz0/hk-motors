import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Source logo is a 720x570 photo, not a transparent icon — the container
 * is locked to that aspect ratio so `object-contain` shows the complete
 * mark with zero letterboxing at any size, and never crops it.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HK Motors — Home"
      className={cn(
        "border-border/60 bg-background relative block aspect-[720/570] h-11 w-auto shrink-0 overflow-hidden rounded-md border sm:h-12 lg:h-13",
        className,
      )}
    >
      <Image
        src="/hkmotors.jpeg"
        alt="HK Motors"
        fill
        priority
        quality={100}
        sizes="(max-width: 640px) 56px, (max-width: 1024px) 61px, 66px"
        className="object-contain"
      />
    </Link>
  );
}
