import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-border bg-card border-b">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-primary tracking-luxury text-xs font-medium uppercase sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-base sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
