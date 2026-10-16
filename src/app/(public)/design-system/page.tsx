import { MoreHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const inventoryRows = [
  {
    id: "HK-1042",
    vehicle: "GT-R Performance Coupe",
    status: "Available" as const,
    price: "$118,500",
  },
  {
    id: "HK-1039",
    vehicle: "Silverline Sedan",
    status: "Reserved" as const,
    price: "$74,200",
  },
  {
    id: "HK-1027",
    vehicle: "Onyx Roadster",
    status: "Sold" as const,
    price: "$96,900",
  },
];

const statusVariant = {
  Available: "default",
  Reserved: "secondary",
  Sold: "outline",
} as const;

import type { Metadata } from "next";

// Internal component reference for developers — keep it out of search
// results (it isn't linked from the site or listed in the sitemap).
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

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

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Available</Badge>
          <Badge variant="secondary">Reserved</Badge>
          <Badge variant="outline">Sold</Badge>
          <Badge variant="destructive">Withdrawn</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Inputs</h2>
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Search inventory…" />
          <Input placeholder="Disabled" disabled />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>Flat surface, resting state.</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Default variant — used for dense lists and secondary content.
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Featured Listing</CardTitle>
              <CardDescription>Hover to see the luxury lift.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Elevated variant — reserved for hero/featured vehicle cards.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">View Details</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Table</h2>
        <Table>
          <TableCaption>Recent inventory activity.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">
                  {row.id}
                </TableCell>
                <TableCell>{row.vehicle}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[row.status]}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Request a Test Drive</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Test Drive</DialogTitle>
              <DialogDescription>
                Leave your details and a specialist will confirm a time.
              </DialogDescription>
            </DialogHeader>
            <Input placeholder="Full name" />
            <Input placeholder="Phone number" />
            <DialogFooter>
              <Button>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Skeleton</h2>
        <div className="grid max-w-sm gap-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>
    </main>
  );
}
