import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { CarForm } from "@/features/admin/cars/car-form";
import { getCarFormOptions } from "@/services/admin-cars";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Vehicle | HK Motors Super Admin",
};

export default async function NewCarPage() {
  const options = await getCarFormOptions();

  return (
    <>
      <Link
        href="/super-admin/cars"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Cars
      </Link>

      <AdminPageHeader
        title="Add Vehicle"
        description="Create a new inventory listing."
      />

      <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
        <CarForm options={options} />
      </div>
    </>
  );
}
