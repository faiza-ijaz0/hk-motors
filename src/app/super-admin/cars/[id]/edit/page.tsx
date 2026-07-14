import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { CarForm } from "@/features/admin/cars/car-form";
import { CarImagesManager } from "@/features/admin/cars/car-images-manager";
import { getAdminCarById, getCarFormOptions } from "@/services/admin-cars";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getAdminCarById(id);
  return {
    title: `${result?.car.title ?? "Edit Vehicle"} | HK Motors Super Admin`,
  };
}

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, options] = await Promise.all([
    getAdminCarById(id),
    getCarFormOptions(),
  ]);

  if (!result) notFound();

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
        title={result.car.title}
        description="Edit this vehicle's details and manage its photos."
      />

      <div className="space-y-8">
        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <CarImagesManager carId={result.car.id} images={result.images} />
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <CarForm car={result.car} options={options} />
        </div>
      </div>
    </>
  );
}
