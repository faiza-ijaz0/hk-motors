import { Check } from "lucide-react";

export function CarFeatures({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-2 text-sm">
          <Check className="text-primary size-4 shrink-0" />
          {feature}
        </div>
      ))}
    </div>
  );
}
