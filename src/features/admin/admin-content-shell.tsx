"use client";

import { useSidebarState } from "@/features/admin/sidebar-context";
import { cn } from "@/lib/utils";

export function AdminContentShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarState();

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
        collapsed ? "lg:pl-20" : "lg:pl-64",
      )}
    >
      {children}
    </div>
  );
}
