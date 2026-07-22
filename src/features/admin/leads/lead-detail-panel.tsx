"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LEAD_STATUS_VARIANT } from "@/features/admin/status-badges";
import { formatRelativeTime } from "@/lib/format";
import {
  addLeadNoteAction,
  assignLeadAction,
  deleteLeadNoteAction,
  updateLeadStatusAction,
} from "@/services/admin-leads-actions";

import type {
  AdminLeadDetail,
  AdminLeadNote,
  StaffOption,
} from "@/services/admin-leads";
import type { Enums } from "@/types/supabase";

const STATUS_OPTIONS: Enums<"lead_status">[] = ["new", "contacted", "lost"];

export function LeadDetailPanel({
  lead,
  notes,
  staff,
}: {
  lead: AdminLeadDetail;
  notes: AdminLeadNote[];
  staff: StaffOption[];
}) {
  const [, startTransition] = useTransition();
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  function handleStatusChange(status: string) {
    startTransition(async () => {
      const result = await updateLeadStatusAction(
        lead.id,
        status as Enums<"lead_status">,
      );
      if (result.success) toast.success(`Status updated to ${status}`);
      else toast.error("Something went wrong", { description: result.error });
    });
  }

  function handleAssign(value: string) {
    startTransition(async () => {
      const userId = value === "unassigned" ? null : value;
      const result = await assignLeadAction(lead.id, userId);
      if (result.success) toast.success("Assignment updated");
      else toast.error("Something went wrong", { description: result.error });
    });
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    const result = await addLeadNoteAction(lead.id, noteText);
    setSubmittingNote(false);
    if (result.success) {
      setNoteText("");
      toast.success("Note added");
    } else {
      toast.error("Something went wrong", { description: result.error });
    }
  }

  async function handleDeleteNote(noteId: string) {
    const result = await deleteLeadNoteAction(lead.id, noteId);
    if (result.success) toast.success("Note deleted");
    else toast.error("Something went wrong", { description: result.error });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="border-border bg-card rounded-2xl border p-6">
          <h2 className="font-display text-lg">Inquiry</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs">Name</dt>
              <dd className="mt-0.5">{lead.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Email</dt>
              <dd className="mt-0.5">{lead.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Phone</dt>
              <dd className="mt-0.5">{lead.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Source</dt>
              <dd className="mt-0.5 capitalize">
                {lead.source.replace(/_/g, " ")}
              </dd>
            </div>
            {lead.carTitle && (
              <div>
                <dt className="text-muted-foreground text-xs">Vehicle</dt>
                <dd className="mt-0.5">{lead.carTitle}</dd>
              </div>
            )}
            {lead.serviceTitle && (
              <div>
                <dt className="text-muted-foreground text-xs">Service</dt>
                <dd className="mt-0.5">{lead.serviceTitle}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground text-xs">Submitted</dt>
              <dd className="mt-0.5">{formatRelativeTime(lead.createdAt)}</dd>
            </div>
          </dl>
          {lead.message && (
            <div className="mt-4">
              <dt className="text-muted-foreground text-xs">Message</dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap">
                {lead.message}
              </dd>
            </div>
          )}
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <h2 className="font-display text-lg">Notes</h2>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this lead…"
              rows={2}
              className="flex-1"
            />
            <Button
              type="button"
              disabled={submittingNote || !noteText.trim()}
              onClick={handleAddNote}
              className="sm:self-end"
            >
              {submittingNote ? "Adding…" : "Add Note"}
            </Button>
          </div>

          {notes.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">No notes yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="border-border flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatRelativeTime(note.createdAt)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete note"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-border bg-card rounded-2xl border p-6">
          <h2 className="font-display text-lg">Status</h2>
          <div className="mt-3">
            <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
              {lead.status}
            </Badge>
          </div>
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="mt-3 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <h2 className="font-display text-lg">Assignment</h2>
          <Select
            value={lead.assignedTo ?? "unassigned"}
            onValueChange={handleAssign}
          >
            <SelectTrigger className="mt-3 w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
