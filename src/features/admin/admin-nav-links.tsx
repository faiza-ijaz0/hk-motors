"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavGroups } from "@/features/admin/admin-nav-items";
import { cn } from "@/lib/utils";

export function AdminNavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4">
      {adminNavGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {!collapsed && (
            <p className="text-sidebar-foreground/50 px-3 pb-1 text-xs font-semibold tracking-wider uppercase">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const isActive =
              item.href === "/super-admin"
                ? pathname === "/super-admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
