import { CarFront, Images, Inbox, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import {
  mockLeads,
  mockLeadsByMonth,
  mockRecentActivity,
  mockStats,
} from "@/lib/mock/admin";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | HK Motors Super Admin",
};

const LEAD_STATUS_VARIANT = {
  new: "default",
  contacted: "secondary",
  qualified: "secondary",
  converted: "default",
  lost: "destructive",
} as const;

export default function AdminDashboardPage() {
  const maxMonthly = Math.max(...mockLeadsByMonth.map((m) => m.count));

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening at HK Motors."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={CarFront}
          label="Published Vehicles"
          value={mockStats.publishedCars}
        />
        <AdminStatCard
          icon={Inbox}
          label="New Leads This Week"
          value={mockStats.newLeadsThisWeek}
        />
        <AdminStatCard
          icon={Users}
          label="Team Members"
          value={mockStats.totalUsers}
        />
        <AdminStatCard
          icon={Images}
          label="Gallery Images"
          value={mockStats.galleryImages}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Leads by Month</h2>
              <TrendingUp className="text-primary size-5" />
            </div>
            <div className="mt-6 flex h-40 items-end gap-3">
              {mockLeadsByMonth.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="bg-muted flex h-32 w-full items-end overflow-hidden rounded-md">
                    <div
                      className="bg-primary w-full rounded-t-md transition-all"
                      style={{
                        height: `${(item.count / maxMonthly) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">{item.month}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Recent Activity</h2>
            <ul className="mt-4 space-y-4">
              {mockRecentActivity.map((activity) => (
                <li key={activity.id} className="flex gap-3 text-sm">
                  <div className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
                  <div>
                    <p>
                      <span className="font-medium">{activity.actor}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent>
          <h2 className="font-display text-lg">Recent Leads</h2>
          <div className="divide-border mt-4 divide-y">
            {mockLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{lead.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {lead.contact}
                  </p>
                </div>
                <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
