import type { Enums } from "@/types/supabase";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const CAR_STATUS_VARIANT: Record<Enums<"car_status">, BadgeVariant> = {
  draft: "outline",
  pending_review: "secondary",
  published: "default",
  reserved: "secondary",
  sold: "outline",
  archived: "outline",
};

export const CAR_STATUS_LABEL: Record<Enums<"car_status">, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  published: "Published",
  reserved: "Reserved",
  sold: "Sold",
  archived: "Archived",
};

export const LEAD_STATUS_VARIANT: Record<Enums<"lead_status">, BadgeVariant> = {
  new: "default",
  contacted: "secondary",
  qualified: "secondary",
  converted: "default",
  lost: "destructive",
};

export const LEAD_TYPE_LABEL: Record<Enums<"lead_type">, string> = {
  car_inquiry: "Car Inquiry",
  service_inquiry: "Service Inquiry",
  trade_in: "Trade-In",
  financing: "Financing",
  general: "General",
};

export const USER_ROLE_VARIANT: Record<Enums<"user_role">, BadgeVariant> = {
  super_admin: "default",
  admin: "secondary",
  employee: "outline",
};

export const USER_ROLE_LABEL: Record<Enums<"user_role">, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  employee: "Employee",
};

export const USER_STATUS_VARIANT: Record<Enums<"user_status">, BadgeVariant> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
};
