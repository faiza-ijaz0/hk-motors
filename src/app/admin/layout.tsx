import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { AdminTopbar } from "@/features/admin/admin-topbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <AdminSidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
