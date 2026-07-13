import { Button } from "@/components/ui/button";

const swatches = [
  { name: "Background", varName: "--background", className: "bg-background" },
  { name: "Card", varName: "--card", className: "bg-card" },
  { name: "Primary", varName: "--primary", className: "bg-primary" },
  { name: "Secondary", varName: "--secondary", className: "bg-secondary" },
  { name: "Muted", varName: "--muted", className: "bg-muted" },
  {
    name: "Destructive",
    varName: "--destructive",
    className: "bg-destructive",
  },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <header className="space-y-2">
        <p className="text-secondary tracking-luxury text-sm uppercase">
          HK Motors
        </p>
        <h1 className="font-display text-5xl">Luxury Theme</h1>
        <p className="text-muted-foreground">
          Design system reference — colors, typography and core components.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-2">
              <div
                className={`border-border h-16 rounded-lg border ${s.className}`}
              />
              <p className="text-sm">{s.name}</p>
              <p className="text-muted-foreground text-xs">{s.varName}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Typography</h2>
        <p className="font-display text-4xl">Display / Playfair</p>
        <p className="font-sans text-base">Body / Geist Sans</p>
        <p className="font-mono text-sm">Mono / Geist Mono</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>
    </main>
  );
}
