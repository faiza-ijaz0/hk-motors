import { Bell } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminMobileNav } from "@/features/admin/admin-mobile-nav";

export function AdminTopbar() {
  return (
    <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <AdminMobileNav />

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
