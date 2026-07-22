import {
  BarChart3,
  CarFront,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Users", href: "/super-admin/users", icon: Users },
      { label: "Inquiry Leads", href: "/super-admin/leads", icon: Inbox },
      {
        label: "Contact Leads",
        href: "/super-admin/contact-leads",
        icon: MessageSquare,
      },
      { label: "Cars", href: "/super-admin/cars", icon: CarFront },
      { label: "Gallery", href: "/super-admin/gallery", icon: Images },
    ],
  },
  {
    label: "Human Resources",
    items: [
      { label: "Employees", href: "/super-admin/employees", icon: UserCog },
      {
        label: "Employee Salaries",
        href: "/super-admin/salaries",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/super-admin/settings", icon: Settings },
    ],
  },
];
