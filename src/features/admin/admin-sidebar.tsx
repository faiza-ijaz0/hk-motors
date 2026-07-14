import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { AdminNavLinks } from "@/features/admin/admin-nav-links";

export function AdminSidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex">
      <div className="border-sidebar-border flex h-16 items-center border-b px-4">
        <Logo />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNavLinks />
      </div>

      <div className="border-sidebar-border space-y-3 border-t p-4">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full">
            <ShieldCheck className="text-sidebar-primary size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground truncate text-sm font-medium">
              Ayesha Khan
            </p>
            <p className="text-sidebar-foreground/60 truncate text-xs">
              Super Admin
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-xs transition-colors"
          >
            ← Back to website
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
