import { Eye } from "lucide-react";

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
import {
  mockLeads,
  type MockLeadStatus,
  type MockLeadType,
} from "@/lib/mock/admin";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | HK Motors Admin",
};

const TYPE_LABEL: Record<MockLeadType, string> = {
  car_inquiry: "Car Inquiry",
  service_inquiry: "Service Inquiry",
  trade_in: "Trade-In",
  financing: "Financing",
  general: "General",
};

const STATUS_VARIANT: Record<
  MockLeadStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  new: "default",
  contacted: "secondary",
  qualified: "secondary",
  converted: "default",
  lost: "destructive",
};

export default function AdminLeadsPage() {
  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Inquiries submitted across the website."
      />

      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="pl-6 font-medium">
                    {lead.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.contact}
                  </TableCell>
                  <TableCell>{TYPE_LABEL[lead.type]}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[lead.status]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.assignedTo ?? "Unassigned"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.createdAt}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon-sm">
                        <Eye />
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
