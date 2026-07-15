"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";
import { getYearOptions } from "@/lib/years";

import type { CarFormOptions } from "@/services/admin-cars";

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "published", label: "Published" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "archived", label: "Archived" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified_pre_owned", label: "Certified Pre-Owned" },
];

const YEARS = getYearOptions();

export function CarsToolbar({ options }: { options: CarFormOptions }) {
  const { searchParams, setParams } = useAdminTableParams();
  const status = searchParams.get("status") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const category = searchParams.get("category") ?? "";
  const make = searchParams.get("make") ?? "";
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";

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

  const modelsForMake = useMemo(
    () => options.models.filter((m) => !make || m.make_id === make),
    [options.models, make],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title…"
          className="pl-9"
          aria-label="Search vehicles"
        />
      </div>

      <div className="flex flex-wrap gap-3">
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

        <Select
          value={condition || "all"}
          onValueChange={(value) =>
            setParams({ condition: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category || "all"}
          onValueChange={(value) =>
            setParams({ category: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {options.categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={make || "all"}
          onValueChange={(value) =>
            setParams({
              make: value === "all" ? null : value,
              model: null,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {options.makes.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={model || "all"}
          onValueChange={(value) =>
            setParams({ model: value === "all" ? null : value })
          }
          disabled={modelsForMake.length === 0}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {modelsForMake.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year || "all"}
          onValueChange={(value) =>
            setParams({ year: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Any Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Year</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
