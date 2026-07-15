"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/services/admin-cars-actions";

export type CategoryOption = { id: string; name: string };

export function CategoryManagerDialog({
  open,
  onOpenChange,
  categories,
  onCategoriesChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryOption[];
  onCategoriesChange: (categories: CategoryOption[]) => void;
}) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    const result = await createCategoryAction(newName.trim());
    setAdding(false);
    if (result.success) {
      onCategoriesChange([
        ...categories,
        { id: result.id, name: newName.trim() },
      ]);
      setNewName("");
      toast.success(`Added category "${newName.trim()}"`);
    } else {
      toast.error("Couldn't add category", { description: result.error });
    }
  }

  function startEdit(category: CategoryOption) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function handleSaveEdit(id: string) {
    if (!editingName.trim()) return;
    setSavingEdit(true);
    const result = await updateCategoryAction(id, editingName.trim());
    setSavingEdit(false);
    if (result.success) {
      onCategoriesChange(
        categories.map((c) =>
          c.id === id ? { ...c, name: editingName.trim() } : c,
        ),
      );
      setEditingId(null);
      toast.success("Category updated");
    } else {
      toast.error("Couldn't update category", { description: result.error });
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteCategoryAction(id);
    setDeletingId(null);
    if (result.success) {
      onCategoriesChange(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } else {
      toast.error("Couldn't delete category", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, rename, or remove vehicle categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="New category…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              disabled={adding || !newName.trim()}
              onClick={handleAdd}
            >
              <Plus />
              Add
            </Button>
          </div>

          {categories.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No categories yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="border-border flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  {editingId === category.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveEdit(category.id);
                          }
                        }}
                        className="h-8"
                        autoFocus
                      />
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          size="sm"
                          disabled={savingEdit}
                          onClick={() => handleSaveEdit(category.id)}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Cancel"
                          onClick={() => setEditingId(null)}
                        >
                          <X />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">{category.name}</span>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit category"
                          onClick={() => startEdit(category)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete category"
                          disabled={deletingId === category.id}
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
