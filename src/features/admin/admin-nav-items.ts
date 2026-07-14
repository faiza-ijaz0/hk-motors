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
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { label: "Users", href: "/super-admin/users", icon: Users },
  { label: "Cars", href: "/super-admin/cars", icon: CarFront },
  { label: "Gallery", href: "/super-admin/gallery", icon: Images },
  { label: "Leads", href: "/super-admin/leads", icon: Inbox },
  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];
