"use client";

import { PanelLeftClose, PanelLeftOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { AdminNavLinks } from "@/features/admin/admin-nav-links";
import { useSidebarState } from "@/features/admin/sidebar-context";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const { collapsed, toggle } = useSidebarState();

  return (
    <aside
      className={cn(
        "bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-30 hidden flex-col border-r transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "border-sidebar-border flex h-16 items-center border-b",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && <Logo />}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNavLinks collapsed={collapsed} />
      </div>

      <div className="border-sidebar-border space-y-3 border-t p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
        >
          <div className="bg-sidebar-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full">
            <ShieldCheck className="text-sidebar-primary size-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sidebar-foreground truncate text-sm font-medium">
                Ayesha Khan
              </p>
              <p className="text-sidebar-foreground/60 truncate text-xs">
                Super Admin
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground text-xs transition-colors"
            >
              ← Back to website
            </Link>
            <ThemeToggle />
          </div>
        )}
      </div>
    </aside>
  );
}
