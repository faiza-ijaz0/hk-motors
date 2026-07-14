import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { formatPrice } from "@/lib/format";
import { mockCars, type MockCarStatus } from "@/lib/mock/admin";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars | HK Motors Super Admin",
};

const STATUS_VARIANT: Record<
  MockCarStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  pending_review: "secondary",
  published: "default",
  reserved: "secondary",
  sold: "outline",
  archived: "outline",
};

const STATUS_LABEL: Record<MockCarStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  published: "Published",
  reserved: "Reserved",
  sold: "Sold",
  archived: "Archived",
};

export default function AdminCarsPage() {
  return (
    <>
      <AdminPageHeader title="Cars" description="Manage inventory listings.">
        <Button size="sm">
          <Plus />
          Add Vehicle
        </Button>
      </AdminPageHeader>

      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="pl-6 font-medium">
                    {car.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {car.year}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPrice(car.price, "PKR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[car.status]}>
                      {STATUS_LABEL[car.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {car.createdAt}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <Eye />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
