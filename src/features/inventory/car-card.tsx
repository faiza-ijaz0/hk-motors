import { CarFront } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMileage, formatPrice } from "@/lib/format";

import type { CarListItem } from "@/services/cars";

const CONDITION_LABEL: Record<string, string> = {
  new: "New",
  used: "Used",
  certified_pre_owned: "Certified Pre-Owned",
};

export function CarCard({ car }: { car: CarListItem }) {
  return (
    <Link href={`/inventory/${car.slug}`}>
      <Card variant="elevated" className="h-full overflow-hidden py-0">
        <div className="bg-muted relative aspect-4/3 w-full">
          {car.imageUrl ? (
            <Image
              src={car.imageUrl}
              alt={car.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CarFront className="text-muted-foreground size-10" />
            </div>
          )}
          <Badge className="absolute top-3 left-3">
            {CONDITION_LABEL[car.condition] ?? car.condition}
          </Badge>
        </div>
        <CardContent className="space-y-1 py-4">
          <p className="font-medium">{car.title}</p>
          <p className="text-muted-foreground text-sm">
            {[car.makeName, car.modelName].filter(Boolean).join(" ")} ·{" "}
            {car.year}
            {car.mileage != null ? ` · ${formatMileage(car.mileage)}` : ""}
          </p>
          <p className="text-primary font-display text-lg">
            {formatPrice(car.price, car.currencyCode)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
