import { CarFront, Inbox, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import {
  LEAD_STATUS_VARIANT,
  LEAD_TYPE_LABEL,
} from "@/features/admin/status-badges";
import { getAdminAnalytics } from "@/services/admin-analytics";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | HK Motors Super Admin",
};

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics();
  const maxMonthly = Math.max(1, ...data.leadsByMonth.map((m) => m.count));

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Lead and inventory performance, sourced from your live data."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={Inbox}
          label="Total Leads"
          value={data.totalLeads}
        />
        <AdminStatCard
          icon={Users}
          label="New Leads (7 days)"
          value={data.newLeadsThisWeek}
        />
        <AdminStatCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={data.conversionRate}
          suffix="%"
        />
        <AdminStatCard
          icon={CarFront}
          label="Total Vehicle Views"
          value={data.totalVehicleViews}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Leads by Month</h2>
            {data.leadsByMonth.every((m) => m.count === 0) ? (
              <p className="text-muted-foreground mt-6 text-sm">
                No leads in the last 6 months.
              </p>
            ) : (
              <div className="mt-6 flex h-48 items-end gap-3">
                {data.leadsByMonth.map((item) => (
                  <div
                    key={item.month}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="bg-muted flex h-40 w-full items-end overflow-hidden rounded-md">
                      <div
                        className="bg-primary w-full rounded-t-md transition-all"
                        style={{
                          height: `${(item.count / maxMonthly) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {item.month}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Leads by Status</h2>
            {data.totalLeads === 0 ? (
              <p className="text-muted-foreground mt-6 text-sm">
                No leads yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {data.leadsByStatus.map((item) => {
                  const percentage =
                    data.totalLeads > 0
                      ? Math.round((item.count / data.totalLeads) * 100)
                      : 0;
                  return (
                    <div key={item.status}>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant={LEAD_STATUS_VARIANT[item.status]}>
                          {item.status}
                        </Badge>
                        <span className="text-muted-foreground">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="bg-muted mt-1.5 h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Leads by Type</h2>
            {data.totalLeads === 0 ? (
              <p className="text-muted-foreground mt-6 text-sm">
                No leads yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {data.leadsByType.map((item) => {
                  const percentage =
                    data.totalLeads > 0
                      ? Math.round((item.count / data.totalLeads) * 100)
                      : 0;
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{LEAD_TYPE_LABEL[item.type]}</span>
                        <span className="text-muted-foreground">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="bg-muted mt-1.5 h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Top Viewed Vehicles</h2>
            {data.topViewedCars.length === 0 ? (
              <p className="text-muted-foreground mt-6 text-sm">
                No vehicle views yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-3">
                {data.topViewedCars.map((car) => (
                  <li
                    key={car.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate">{car.title}</span>
                    <span className="text-muted-foreground shrink-0">
                      {car.viewCount.toLocaleString()} views
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
