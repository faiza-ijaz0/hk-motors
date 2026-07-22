"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactLeadsDateRangeFilter } from "@/features/admin/contact-leads/contact-leads-date-range-filter";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";

const STATUSES = [
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export function ContactLeadsToolbar() {
  const { searchParams, setParams } = useAdminTableParams();
  const status = searchParams.get("status") ?? "";

  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (q === current) return;
    const timeout = setTimeout(() => setParams({ q: q || null }), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, phone, or subject…"
          className="pl-9"
          aria-label="Search contact leads"
        />
      </div>

      <Select
        value={status || "all"}
        onValueChange={(value) =>
          setParams({ status: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ContactLeadsDateRangeFilter />
    </div>
  );
}
