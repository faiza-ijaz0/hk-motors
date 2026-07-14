import { Bell, Search } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Input } from "@/components/ui/input";
import { AdminMobileNav } from "@/features/admin/admin-mobile-nav";

export function AdminTopbar() {
  return (
    <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <AdminMobileNav />

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search…"
          className="pl-9"
          aria-label="Search admin dashboard"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="hover:bg-muted relative flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <Bell className="size-4" />
          <span className="bg-primary absolute top-2 right-2 size-2 rounded-full" />
        </button>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
