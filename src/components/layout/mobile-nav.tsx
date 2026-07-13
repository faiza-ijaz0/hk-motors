"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          <Logo />
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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

        <div className="border-border flex items-center gap-3 border-t p-4">
          <SheetClose asChild>
            <Button asChild className="flex-1">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </SheetClose>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
