import { Calendar, CarFront, Images, Inbox, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import {
  CAR_STATUS_LABEL,
  CAR_STATUS_VARIANT,
  LEAD_STATUS_VARIANT,
} from "@/features/admin/status-badges";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentCars,
  getRecentLeads,
} from "@/services/admin-dashboard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | HK Motors Super Admin",
};

export default async function AdminDashboardPage() {
  const [stats, activity, recentLeads, recentCars] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getRecentLeads(),
    getRecentCars(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening at HK Motors."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          icon={CarFront}
          label="Total Cars"
          value={stats.totalCars}
        />
        <AdminStatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
        />
        <AdminStatCard
          icon={Inbox}
          label="Total Leads"
          value={stats.totalLeads}
        />
        <AdminStatCard
          icon={Calendar}
          label="Total Appointments"
          value={stats.totalAppointments}
        />
        <AdminStatCard
          icon={Images}
          label="Gallery Images"
          value={stats.totalGalleryImages}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Recent Activity</h2>
            {activity.length === 0 ? (
              <p className="text-muted-foreground mt-4 text-sm">
                No activity recorded yet — actions taken in this dashboard will
                show up here.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <div className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
                    <div>
                      <p>{item.action}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {item.entityTable} ·{" "}
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Recent Leads</h2>
            {recentLeads.length === 0 ? (
              <p className="text-muted-foreground mt-4 text-sm">
                No leads yet — inquiries submitted on the website will show up
                here.
              </p>
            ) : (
              <div className="divide-border mt-4 divide-y">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{lead.fullName}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {lead.email ?? lead.phone}
                      </p>
                    </div>
                    <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent>
          <h2 className="font-display text-lg">Recent Cars</h2>
          {recentCars.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
              No vehicles yet — cars added from the Cars module will show up
              here.
            </p>
          ) : (
            <div className="divide-border mt-4 divide-y">
              {recentCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <p className="min-w-0 truncate font-medium">{car.title}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-muted-foreground">
                      {formatPrice(car.price, car.currencyCode)}
                    </span>
                    <Badge variant={CAR_STATUS_VARIANT[car.status]}>
                      {CAR_STATUS_LABEL[car.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
