import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CarCardMedia } from "@/features/inventory/car-card-media";
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
      <Card variant="elevated" className="group h-full overflow-hidden py-0">
        <div className="bg-muted relative aspect-4/3 w-full">
          <CarCardMedia
            images={car.images}
            hasVideo={car.hasVideo}
            title={car.title}
          />
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
