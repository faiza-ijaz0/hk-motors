"use client";

import { MenuIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNavLinks } from "@/features/admin/admin-nav-links";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <MenuIcon />
          <span className="sr-only">Open admin menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-sidebar text-sidebar-foreground w-full max-w-xs p-0"
      >
        <SheetHeader className="border-sidebar-border border-b">
          <Logo />
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNavLinks onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-sidebar-border flex items-center gap-3 border-t p-4">
          <div className="bg-sidebar-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full">
            <ShieldCheck className="text-sidebar-primary size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Ayesha Khan</p>
            <p className="text-sidebar-foreground/60 truncate text-xs">
              Super Admin
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
