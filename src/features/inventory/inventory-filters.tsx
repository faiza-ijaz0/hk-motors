"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventoryParams } from "@/features/inventory/use-inventory-params";
import { getYearOptions } from "@/lib/years";

import type { CarFilterOptions } from "@/services/cars";

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified_pre_owned", label: "Certified Pre-Owned" },
];

const YEARS = getYearOptions();

export function InventoryFilters({ options }: { options: CarFilterOptions }) {
  const { searchParams, setParams } = useInventoryParams();

  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";
  const condition = searchParams.get("condition") ?? "";

  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");

  useEffect(() => {
    setPriceMin(searchParams.get("priceMin") ?? "");
    setPriceMax(searchParams.get("priceMax") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const currentMin = searchParams.get("priceMin") ?? "";
    const currentMax = searchParams.get("priceMax") ?? "";
    if (priceMin === currentMin && priceMax === currentMax) return;

    const timeout = setTimeout(() => {
      setParams({ priceMin: priceMin || null, priceMax: priceMax || null });
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  const modelsForBrand = useMemo(
    () => options.models.filter((m) => !brand || m.make_id === brand),
    [options.models, brand],
  );

  const hasActiveFilters = Boolean(
    category || brand || model || year || condition || priceMin || priceMax,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPriceMin("");
              setPriceMax("");
              setParams({
                category: null,
                brand: null,
                model: null,
                year: null,
                condition: null,
                priceMin: null,
                priceMax: null,
              });
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={category || "all"}
          onValueChange={(value) =>
            setParams({ category: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full">
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
      </div>

      <div className="space-y-2">
        <Label>Brand</Label>
        <Select
          value={brand || "all"}
          onValueChange={(value) =>
            setParams({ brand: value === "all" ? null : value, model: null })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {options.makes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <Select
          value={model || "all"}
          onValueChange={(value) =>
            setParams({ model: value === "all" ? null : value })
          }
          disabled={modelsForBrand.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {modelsForBrand.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Year</Label>
        <Select
          value={year || "all"}
          onValueChange={(value) =>
            setParams({ year: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select
          value={condition || "all"}
          onValueChange={(value) =>
            setParams({ condition: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
