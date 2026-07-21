import { Quote, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { Testimonial } from "@/config/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card variant="elevated" className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <Quote className="text-primary size-6" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < testimonial.rating
                    ? "fill-primary text-primary size-3.5"
                    : "text-muted-foreground/40 size-3.5 fill-transparent"
                }
              />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="border-border border-t pt-4">
          <p className="text-sm font-medium">{testimonial.name}</p>
          {testimonial.vehicle && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              {testimonial.vehicle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
