"use client";

import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminTableParams } from "@/features/admin/use-admin-table-params";
import { cn } from "@/lib/utils";

import type { DateRange } from "react-day-picker";

function parseParamDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toParamDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const displayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Payment Date From → To calendar range filter for the Employee Salaries
 * table. Self-contained to this module. */
export function SalariesDateRangeFilter() {
  const { searchParams, setParams } = useAdminTableParams();
  const [open, setOpen] = useState(false);

  const from = parseParamDate(searchParams.get("dateFrom"));
  const to = parseParamDate(searchParams.get("dateTo"));
  const range: DateRange | undefined = from ? { from, to } : undefined;

  function handleSelect(next: DateRange | undefined) {
    setParams({
      dateFrom: next?.from ? toParamDate(next.from) : null,
      dateTo: next?.to ? toParamDate(next.to) : null,
    });
    if (next?.from && next?.to) setOpen(false);
  }

  function handleClear() {
    setParams({ dateFrom: null, dateTo: null });
    setOpen(false);
  }

  const label =
    from && to
      ? `${displayFormatter.format(from)} → ${displayFormatter.format(to)}`
      : from
        ? `${displayFormatter.format(from)} → …`
        : "Payment date";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 font-normal sm:w-60",
            !from && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <Calendar
          mode="range"
          defaultMonth={from}
          selected={range}
          onSelect={handleSelect}
        />
        {from && (
          <div className="border-border flex justify-end border-t p-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X />
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
