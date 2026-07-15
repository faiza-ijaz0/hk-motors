"use client";

import { CarFront, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteCarDialog } from "@/features/admin/cars/delete-car-dialog";
import {
  CAR_STATUS_LABEL,
  CAR_STATUS_VARIANT,
} from "@/features/admin/status-badges";
import { formatPrice } from "@/lib/format";

import type { AdminCarListItem } from "@/services/admin-cars";

export function CarsGrid({
  cars,
  hasFilters,
}: {
  cars: AdminCarListItem[];
  hasFilters: boolean;
}) {
  const [deleteTarget, setDeleteTarget] = useState<AdminCarListItem | null>(
    null,
  );

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={CarFront}
        title={
          hasFilters ? "No vehicles match your filters" : "No vehicles yet"
        }
        description={
          hasFilters
            ? "Try adjusting or clearing your search and filters."
            : "Add your first vehicle to get started."
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <Card
            key={car.id}
            variant="elevated"
            className="overflow-hidden py-0"
          >
            <div className="bg-muted relative aspect-4/3 w-full">
              {car.imageUrl ? (
                <Image
                  src={car.imageUrl}
                  alt={car.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={car.imageIsExternal}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <CarFront className="text-muted-foreground size-10" />
                </div>
              )}
              <Badge
                variant={CAR_STATUS_VARIANT[car.status]}
                className="absolute top-3 left-3"
              >
                {CAR_STATUS_LABEL[car.status]}
              </Badge>
            </div>

            <CardContent className="space-y-1 py-4">
              <p className="truncate font-medium">{car.title}</p>
              <p className="text-muted-foreground truncate text-sm">
                {[car.makeName, car.modelName, car.year, car.categoryName]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-primary font-display text-lg">
                {formatPrice(car.price, car.currencyCode)}
              </p>

              <div className="flex items-center justify-end gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="View vehicle"
                  asChild
                >
                  <Link href={`/super-admin/cars/${car.id}`}>
                    <Eye />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit vehicle"
                  asChild
                >
                  <Link href={`/super-admin/cars/${car.id}/edit`}>
                    <Pencil />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete vehicle"
                  onClick={() => setDeleteTarget(car)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {deleteTarget && (
        <DeleteCarDialog
          open
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          carId={deleteTarget.id}
          carTitle={deleteTarget.title}
        />
      )}
    </>
  );
}
