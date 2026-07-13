import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HK Motors — Home"
      className={cn(
        "border-border/60 relative block h-10 w-28 shrink-0 overflow-hidden rounded-md border sm:h-11 sm:w-32",
        className,
      )}
    >
      <Image
        src="/hkmotors.jpeg"
        alt="HK Motors"
        fill
        priority
        sizes="128px"
        className="object-cover object-center"
      />
    </Link>
  );
}
