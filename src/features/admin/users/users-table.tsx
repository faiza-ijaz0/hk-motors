"use client";

import { Eye, Pencil, Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  USER_ROLE_LABEL,
  USER_ROLE_VARIANT,
  USER_STATUS_VARIANT,
} from "@/features/admin/status-badges";
import { DeleteUserDialog } from "@/features/admin/users/delete-user-dialog";
import { UserFormDialog } from "@/features/admin/users/user-form-dialog";
import { UserViewDialog } from "@/features/admin/users/user-view-dialog";
import { formatDate } from "@/lib/format";

import type { AdminUserListItem } from "@/services/users";

type DialogState =
  | { type: "create" }
  | { type: "view"; user: AdminUserListItem }
  | { type: "edit"; user: AdminUserListItem }
  | { type: "delete"; user: AdminUserListItem }
  | null;

export function UsersTable({
  users,
  hasFilters,
}: {
  users: AdminUserListItem[];
  hasFilters: boolean;
}) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <>
      <div className="mb-4 flex justify-end px-6 pt-2">
        <Button size="sm" onClick={() => setDialog({ type: "create" })}>
          <Plus />
          Invite User
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={hasFilters ? "No users match your filters" : "No users yet"}
          description={
            hasFilters
              ? "Try adjusting or clearing your search and filters."
              : "Invite your first staff member to get started."
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="pl-6 font-medium">
                  {user.fullName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={USER_ROLE_VARIANT[user.role]}>
                    {USER_ROLE_LABEL[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={USER_STATUS_VARIANT[user.status]}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View user"
                      onClick={() => setDialog({ type: "view", user })}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit user"
                      onClick={() => setDialog({ type: "edit", user })}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete user"
                      onClick={() => setDialog({ type: "delete", user })}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UserFormDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && setDialog(null)}
      />

      {dialog?.type === "edit" && (
        <UserFormDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          user={dialog.user}
        />
      )}

      {dialog?.type === "view" && (
        <UserViewDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          user={dialog.user}
        />
      )}

      {dialog?.type === "delete" && (
        <DeleteUserDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          userId={dialog.user.id}
          userName={dialog.user.fullName}
        />
      )}
    </>
  );
}
