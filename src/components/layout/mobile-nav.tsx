"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-xs">
        <SheetHeader className="border-border border-b">
          <SheetTitle className="font-display tracking-luxury text-base uppercase">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {mainNav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="border-border border-t p-4">
          <SheetClose asChild>
            <Button asChild className="w-full">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
