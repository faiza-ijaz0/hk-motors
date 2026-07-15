import { ChevronLeft, Images, Pencil, Video } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { CarMediaGrid } from "@/features/admin/cars/car-media-grid";
import {
  CAR_STATUS_LABEL,
  CAR_STATUS_VARIANT,
} from "@/features/admin/status-badges";
import { formatMileage, formatPrice, formatRelativeTime } from "@/lib/format";
import { getAdminCarById } from "@/services/admin-cars";

import type { Metadata } from "next";

const CONDITION_LABEL: Record<string, string> = {
  new: "New",
  used: "Used",
  certified_pre_owned: "Certified Pre-Owned",
};

const TRANSMISSION_LABEL: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
  cvt: "CVT",
  dual_clutch: "Dual Clutch",
};

const FUEL_TYPE_LABEL: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
  lpg: "LPG",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getAdminCarById(id);
  return {
    title: `${result?.car.title ?? "Vehicle"} | HK Motors Super Admin`,
  };
}

function SpecRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

export default async function ViewCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminCarById(id);
  if (!result) notFound();

  const { car, images } = result;
  const imageCount = images.filter((i) => i.mediaType === "image").length;
  const videoCount = images.filter((i) => i.mediaType === "video").length;

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
        title={car.title}
        description={[car.makeName, car.modelName, car.year]
          .filter(Boolean)
          .join(" · ")}
      >
        <Button size="sm" variant="outline" asChild>
          <Link href={`/super-admin/cars/${car.id}/edit`}>
            <Pencil />
            Edit Vehicle
          </Link>
        </Button>
      </AdminPageHeader>

      <div className="space-y-8">
        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Badge variant={CAR_STATUS_VARIANT[car.status]}>
              {CAR_STATUS_LABEL[car.status]}
            </Badge>
            <span className="text-primary font-display text-2xl">
              {formatPrice(car.price, car.currencyCode)}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Images className="size-4" />
              {imageCount} {imageCount === 1 ? "photo" : "photos"}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Video className="size-4" />
              {videoCount} {videoCount === 1 ? "video" : "videos"}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SpecRow label="Make" value={car.makeName} />
            <SpecRow label="Model" value={car.modelName} />
            <SpecRow label="Category" value={car.categoryName ?? "None"} />
            <SpecRow label="Year" value={String(car.year)} />
            <SpecRow
              label="Mileage"
              value={car.mileage != null ? formatMileage(car.mileage) : null}
            />
            <SpecRow
              label="Fuel Type"
              value={
                car.fuelType
                  ? (FUEL_TYPE_LABEL[car.fuelType] ?? car.fuelType)
                  : null
              }
            />
            <SpecRow
              label="Transmission"
              value={
                car.transmission
                  ? (TRANSMISSION_LABEL[car.transmission] ?? car.transmission)
                  : null
              }
            />
            <SpecRow
              label="Condition"
              value={CONDITION_LABEL[car.condition] ?? car.condition}
            />
            <SpecRow label="VIN" value={car.vin} />
            <SpecRow label="Engine" value={car.engine} />
            <SpecRow
              label="Horsepower"
              value={car.horsepower != null ? `${car.horsepower} hp` : null}
            />
            <SpecRow
              label="Drivetrain"
              value={car.drivetrain?.toUpperCase() ?? null}
            />
            <SpecRow label="Exterior Color" value={car.exteriorColor} />
            <SpecRow label="Interior Color" value={car.interiorColor} />
            <SpecRow
              label="Seats"
              value={car.seats != null ? String(car.seats) : null}
            />
            <SpecRow
              label="Doors"
              value={car.doors != null ? String(car.doors) : null}
            />
            <SpecRow
              label="Created"
              value={formatRelativeTime(car.createdAt)}
            />
            <SpecRow
              label="Updated"
              value={formatRelativeTime(car.updatedAt)}
            />
          </dl>

          {car.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg">Description</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-display text-lg">Features</h2>
            {car.features.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm">
                No features listed.
              </p>
            )}
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="font-display mb-4 text-lg">Photos &amp; Videos</h2>
          <CarMediaGrid images={images} />
        </div>
      </div>
    </>
  );
}
