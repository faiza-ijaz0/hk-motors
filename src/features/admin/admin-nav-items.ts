import {
  BarChart3,
  CarFront,
  Images,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Cars", href: "/admin/cars", icon: CarFront },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
