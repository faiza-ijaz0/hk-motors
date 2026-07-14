import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/admin-page-header";
import { AdminPagination } from "@/features/admin/admin-pagination";
import { UsersTable } from "@/features/admin/users/users-table";
import { UsersToolbar } from "@/features/admin/users/users-toolbar";
import { USERS_PAGE_SIZE, getUsers } from "@/services/users";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | HK Motors Super Admin",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    q: toSingle(params.q),
    role: toSingle(params.role),
    status: toSingle(params.status),
    page: toSingle(params.page),
  };

  const { users, total, page } = await getUsers(filters);
  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const hasFilters = Boolean(filters.q || filters.role || filters.status);

  const flatSearchParams: Record<string, string | undefined> = {
    q: filters.q,
    role: filters.role,
    status: filters.status,
  };

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Manage staff accounts and permissions."
      />

      <div className="mb-4">
        <UsersToolbar />
      </div>

      <Card>
        <CardContent className="px-0">
          <UsersTable users={users} hasFilters={hasFilters} />
        </CardContent>
      </Card>

      <AdminPagination
        basePath="/super-admin/users"
        page={page}
        totalPages={totalPages}
        searchParams={flatSearchParams}
      />
    </>
  );
}
