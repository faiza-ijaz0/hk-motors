import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card, CardContent } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="font-display mt-1 text-2xl sm:text-3xl">
            <AnimatedCounter to={value} suffix={suffix} duration={1.2} />
          </p>
        </div>
        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
          <Icon className="text-primary size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
