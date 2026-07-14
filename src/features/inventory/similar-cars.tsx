import { CarCard } from "@/features/inventory/car-card";
import { getSimilarCars } from "@/services/cars";

import type { CarDetail } from "@/services/cars";

export async function SimilarCars({ car }: { car: CarDetail }) {
  const similar = await getSimilarCars(car);

  if (similar.length === 0) return null;

  return (
    <section className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-primary tracking-luxury text-xs font-medium uppercase">
          You Might Also Like
        </p>
        <h2 className="font-display mt-2 text-2xl sm:text-3xl">
          Similar Vehicles
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
