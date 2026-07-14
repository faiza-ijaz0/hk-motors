import { Eye, Inbox, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminStatCard } from "@/features/admin/admin-stat-card";
import { mockLeadsByMonth, mockLeadsByStatus } from "@/lib/mock/admin";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | HK Motors Admin",
};

export default function AdminAnalyticsPage() {
  const maxMonthly = Math.max(...mockLeadsByMonth.map((m) => m.count));
  const totalByStatus = mockLeadsByStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Traffic and lead performance at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard icon={Eye} label="Monthly Visitors" value={9450} />
        <AdminStatCard icon={Inbox} label="Total Leads" value={132} />
        <AdminStatCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={26}
          suffix="%"
        />
        <AdminStatCard
          icon={Users}
          label="Returning Visitors"
          value={41}
          suffix="%"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Leads by Month</h2>
            <div className="mt-6 flex h-48 items-end gap-3">
              {mockLeadsByMonth.map((item) => (
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
                  <p className="text-muted-foreground text-xs">{item.month}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-display text-lg">Leads by Status</h2>
            <div className="mt-6 space-y-4">
              {mockLeadsByStatus.map((item) => {
                const percentage = Math.round(
                  (item.count / totalByStatus) * 100,
                );
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.label}</span>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
