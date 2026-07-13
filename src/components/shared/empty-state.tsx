import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-border flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center sm:py-24">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <h3 className="font-display mt-4 text-xl">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
