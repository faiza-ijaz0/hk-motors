import { featuredBrands } from "@/config/brands";

export function BrandShowcaseSection() {
  const brands = [...featuredBrands, ...featuredBrands];

  return (
    <section className="border-border bg-card/40 border-b py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground tracking-luxury text-center text-xs font-medium uppercase">
          Brands in Our Inventory
        </p>
      </div>

      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-12 sm:gap-16">
          {brands.map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="font-display text-secondary/60 hover:text-secondary shrink-0 text-xl tracking-wide whitespace-nowrap transition-colors sm:text-2xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
