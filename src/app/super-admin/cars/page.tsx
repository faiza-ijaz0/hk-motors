import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { CarsTable } from "@/features/admin/cars/cars-table";
import { CarsToolbar } from "@/features/admin/cars/cars-toolbar";
import { ADMIN_CARS_PAGE_SIZE, getAdminCars } from "@/services/admin-cars";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    q: toSingle(params.q),
    status: toSingle(params.status),
    condition: toSingle(params.condition),
    page: toSingle(params.page),
  };

  const { cars, total, page } = await getAdminCars(filters);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_CARS_PAGE_SIZE));
  const hasFilters = Boolean(filters.q || filters.status || filters.condition);

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    condition: filters.condition,
  };

  return (
    <>
      <AdminPageHeader title="Cars" description="Manage inventory listings.">
        <Button size="sm" asChild>
          <Link href="/super-admin/cars/new">
            <Plus />
            Add Vehicle
          </Link>
        </Button>
      </AdminPageHeader>

      <div className="mb-4">
        <CarsToolbar />
      </div>

      <Card>
        <CardContent className={cars.length > 0 ? "px-0" : undefined}>
          <CarsTable cars={cars} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      <AdminPagination
        basePath="/super-admin/cars"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
