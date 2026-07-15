import { Toaster } from "@/components/shared/toaster";
import { AdminContentShell } from "@/features/admin/admin-content-shell";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { AdminTopbar } from "@/features/admin/admin-topbar";
import { SidebarProvider } from "@/features/admin/sidebar-context";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="bg-background min-h-screen">
        <AdminSidebar />
        <AdminContentShell>
          <AdminTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </AdminContentShell>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
