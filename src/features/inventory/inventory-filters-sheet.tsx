"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InventoryFilters } from "@/features/inventory/inventory-filters";

import type { CarFilterOptions } from "@/services/cars";

export function InventoryFiltersSheet({
  options,
}: {
  options: CarFilterOptions;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <InventoryFilters options={options} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
