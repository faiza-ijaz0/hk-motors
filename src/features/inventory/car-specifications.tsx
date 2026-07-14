import { formatMileage } from "@/lib/format";

import type { CarDetail } from "@/services/cars";

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

const FUEL_LABEL: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
  lpg: "LPG",
};

const DRIVETRAIN_LABEL: Record<string, string> = {
  fwd: "Front-Wheel Drive",
  rwd: "Rear-Wheel Drive",
  awd: "All-Wheel Drive",
  "4wd": "4-Wheel Drive",
};

export function CarSpecifications({ car }: { car: CarDetail }) {
  const specs: { label: string; value: string }[] = [
    { label: "Make", value: car.makeName },
    { label: "Model", value: car.modelName },
    { label: "Year", value: String(car.year) },
    {
      label: "Mileage",
      value: car.mileage != null ? formatMileage(car.mileage) : null,
    },
    { label: "Condition", value: CONDITION_LABEL[car.condition] },
    {
      label: "Transmission",
      value: car.transmission ? TRANSMISSION_LABEL[car.transmission] : null,
    },
    {
      label: "Fuel Type",
      value: car.fuelType ? FUEL_LABEL[car.fuelType] : null,
    },
    {
      label: "Drivetrain",
      value: car.drivetrain ? DRIVETRAIN_LABEL[car.drivetrain] : null,
    },
    { label: "Engine", value: car.engine },
    {
      label: "Horsepower",
      value: car.horsepower != null ? `${car.horsepower} hp` : null,
    },
    { label: "Exterior Color", value: car.exteriorColor },
    { label: "Interior Color", value: car.interiorColor },
    { label: "Seats", value: car.seats != null ? String(car.seats) : null },
    { label: "Doors", value: car.doors != null ? String(car.doors) : null },
  ].filter((spec): spec is { label: string; value: string } =>
    Boolean(spec.value),
  );

  if (specs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="border-border flex items-center justify-between border-b py-2 text-sm"
        >
          <span className="text-muted-foreground">{spec.label}</span>
          <span className="font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}
