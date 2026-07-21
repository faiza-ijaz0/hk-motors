import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { CarFeatures } from "@/features/inventory/car-features";
import { CarGallery } from "@/features/inventory/car-gallery";
import { CarSpecifications } from "@/features/inventory/car-specifications";
import { InquiryForm } from "@/features/inventory/inquiry-form";
import { SimilarCars } from "@/features/inventory/similar-cars";
import { WhatsappCta } from "@/features/inventory/whatsapp-cta";
import { formatMileage, formatPrice } from "@/lib/format";
import { getCarBySlug } from "@/services/cars";

import type { Metadata } from "next";

const CONDITION_LABEL: Record<string, string> = {
  new: "New",
  used: "Used",
  certified_pre_owned: "Certified Pre-Owned",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) return { title: "Vehicle Not Found" };

  const title = `${car.title} | HK Motors`;
  const description =
    car.description ??
    `${car.year} ${car.makeName ?? ""} ${car.modelName ?? ""} — available now at HK Motors.`;
  const url = `${siteConfig.url}/cars/${car.slug}`;
  const primaryImage = car.media.find((m) => m.mediaType === "image")?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: primaryImage ? [{ url: primaryImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) notFound();

  return (
    <>
      <div className="border-border border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/cars"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to Cars
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{CONDITION_LABEL[car.condition] ?? car.condition}</Badge>
                {car.mileage != null && (
                  <span className="text-muted-foreground text-sm">
                    {formatMileage(car.mileage)}
                  </span>
                )}
              </div>
              <h1 className="font-display mt-3 text-3xl sm:text-4xl">
                {car.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {[car.makeName, car.modelName, car.year]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {/* Gallery */}
            <CarGallery media={car.media} title={car.title} />

            {car.description && (
              <div>
                <h2 className="font-display text-xl">Description</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  {car.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h2 className="font-display text-xl">Specifications</h2>
              <div className="mt-4">
                <CarSpecifications car={car} />
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div>
                <h2 className="font-display text-xl">Features</h2>
                <div className="mt-4">
                  <CarFeatures features={car.features} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: price, WhatsApp CTA, Inquiry Form */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="border-border bg-card space-y-4 rounded-2xl border p-6">
              <p className="font-display text-primary text-3xl">
                {formatPrice(car.price, car.currencyCode)}
              </p>
              <WhatsappCta carTitle={car.title} />
            </div>

            <div className="border-border bg-card rounded-2xl border p-6">
              <h2 className="font-display text-lg">Inquire About This Car</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Send a message and our team will get back to you shortly.
              </p>
              <div className="mt-4">
                <InquiryForm carId={car.id} carTitle={car.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Similar Cars */}
      <SimilarCars car={car} />
    </>
  );
}
