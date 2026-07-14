"use client";

import { CarFront, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteCarDialog } from "@/features/admin/cars/delete-car-dialog";
import {
  CAR_STATUS_LABEL,
  CAR_STATUS_VARIANT,
} from "@/features/admin/status-badges";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  toggleCarFeaturedAction,
  updateCarStatusAction,
} from "@/services/admin-cars-actions";

import type { AdminCarListItem } from "@/services/admin-cars";
import type { Enums } from "@/types/supabase";

const STATUS_OPTIONS: Enums<"car_status">[] = [
  "draft",
  "pending_review",
  "published",
  "reserved",
  "sold",
  "archived",
];

export function CarsTable({
  cars,
  hasFilters,
}: {
  cars: AdminCarListItem[];
  hasFilters: boolean;
}) {
  const [deleteTarget, setDeleteTarget] = useState<AdminCarListItem | null>(
    null,
  );
  const [, startTransition] = useTransition();

  function handleToggleFeatured(car: AdminCarListItem) {
    startTransition(async () => {
      const result = await toggleCarFeaturedAction(car.id, !car.isFeatured);
      if (!result.success) {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  function handleStatusChange(car: AdminCarListItem, status: string) {
    startTransition(async () => {
      const result = await updateCarStatusAction(
        car.id,
        status as Enums<"car_status">,
      );
      if (result.success) {
        toast.success(`Status updated to ${status.replace(/_/g, " ")}`);
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={CarFront}
        title={
          hasFilters ? "No vehicles match your filters" : "No vehicles yet"
        }
        description={
          hasFilters
            ? "Try adjusting or clearing your search and filters."
            : "Add your first vehicle to get started."
        }
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Vehicle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell className="pl-6">
                <p className="font-medium">{car.title}</p>
                <p className="text-muted-foreground text-xs">
                  {[car.makeName, car.modelName, car.year]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatPrice(car.price, car.currencyCode)}
              </TableCell>
              <TableCell>
                <Select
                  value={car.status}
                  onValueChange={(value) => handleStatusChange(car, value)}
                >
                  <SelectTrigger size="sm" className="w-40">
                    <SelectValue>
                      <Badge variant={CAR_STATUS_VARIANT[car.status]}>
                        {CAR_STATUS_LABEL[car.status]}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    car.isFeatured ? "Remove from featured" : "Mark as featured"
                  }
                  onClick={() => handleToggleFeatured(car)}
                >
                  <Star
                    className={cn(
                      car.isFeatured && "fill-primary text-primary",
                    )}
                  />
                </Button>
              </TableCell>
              <TableCell className="pr-6">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit vehicle"
                    asChild
                  >
                    <Link href={`/super-admin/cars/${car.id}/edit`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete vehicle"
                    onClick={() => setDeleteTarget(car)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {deleteTarget && (
        <DeleteCarDialog
          open
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          carId={deleteTarget.id}
          carTitle={deleteTarget.title}
        />
      )}
    </>
  );
}
