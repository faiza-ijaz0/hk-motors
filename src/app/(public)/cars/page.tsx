import { CarFront } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { siteConfig } from "@/config/site";
import { CarCard } from "@/features/inventory/car-card";
import { InventoryFilters } from "@/features/inventory/inventory-filters";
import { InventoryFiltersSheet } from "@/features/inventory/inventory-filters-sheet";
import { InventoryPagination } from "@/features/inventory/inventory-pagination";
import { InventoryToolbar } from "@/features/inventory/inventory-toolbar";
import {
  CARS_PAGE_SIZE,
  getCarFilterOptions,
  getCars,
  type CarSort,
} from "@/services/cars";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cars | ${siteConfig.name}`,
  description:
    "Browse the current HK Motors inventory of performance and luxury vehicles.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    q: toSingle(params.q),
    category: toSingle(params.category),
    brand: toSingle(params.brand),
    model: toSingle(params.model),
    year: toSingle(params.year),
    priceMin: toSingle(params.priceMin),
    priceMax: toSingle(params.priceMax),
    condition: toSingle(params.condition),
    sort: toSingle(params.sort) as CarSort | undefined,
    page: toSingle(params.page),
  };

  const [{ cars, total, page }, options] = await Promise.all([
    getCars(filters),
    getCarFilterOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / CARS_PAGE_SIZE));
  const hasFilters = Boolean(
    filters.q ||
    filters.category ||
    filters.brand ||
    filters.model ||
    filters.year ||
    filters.priceMin ||
    filters.priceMax ||
    filters.condition,
  );

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    category: filters.category,
    brand: filters.brand,
    model: filters.model,
    year: filters.year,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    condition: filters.condition,
    sort: filters.sort,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:px-8">
      <FadeIn>
        <h1 className="font-display text-center text-3xl sm:text-4xl">
          Discover Your Perfect Vehicle at HK Motors
        </h1>
      </FadeIn>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <InventoryFilters options={options} />
        </aside>

        <div>
          <div className="border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <InventoryToolbar />
            </div>
            <InventoryFiltersSheet options={options} />
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            {total} {total === 1 ? "vehicle" : "vehicles"} found
          </p>

          {cars.length > 0 ? (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {cars.map((car, index) => (
                  <FadeIn key={car.id} delay={(index % 6) * 0.05}>
                    <CarCard car={car} />
                  </FadeIn>
                ))}
              </div>
              <InventoryPagination
                page={page}
                totalPages={totalPages}
                searchParams={flatSearchParams}
              />
            </>
          ) : (
            <div className="mt-6">
              <EmptyState
                icon={CarFront}
                title={
                  hasFilters
                    ? "No vehicles match your filters"
                    : "Cars coming soon"
                }
                description={
                  hasFilters
                    ? "Try adjusting or clearing your filters to see more results."
                    : "Our current lineup is being finalized. Check back shortly, or reach out and our team will help you find the right vehicle."
                }
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
