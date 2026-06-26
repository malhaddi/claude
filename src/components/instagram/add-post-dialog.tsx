"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import {
  statusMeta,
  statusOrder,
  typeMeta,
  typeOrder,
  type Post,
  type PostStatus,
  type PostType,
} from "@/lib/instagram";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddPostDialogProps = {
  onCreate: (post: Omit<Post, "id">) => void;
  /** Pre-select a status when opened from a specific column. */
  defaultStatus?: PostStatus;
  trigger?: React.ReactNode;
};

export function AddPostDialog({
  onCreate,
  defaultStatus = "backlog",
  trigger,
}: AddPostDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [type, setType] = React.useState<PostType>("image");
  const [status, setStatus] = React.useState<PostStatus>(defaultStatus);
  const [scheduledDate, setScheduledDate] = React.useState("");

  // Reset the form whenever the dialog is opened (event handler, not effect).
  function handleOpenChange(next: boolean) {
    if (next) {
      setCaption("");
      setType("image");
      setStatus(defaultStatus);
      setScheduledDate("");
    }
    setOpen(next);
  }

  const canSubmit = caption.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    onCreate({
      caption: caption.trim(),
      type,
      status,
      scheduledDate: scheduledDate || null,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            New post idea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New post idea</DialogTitle>
            <DialogDescription>
              Capture a caption, pick a format and decide where it lands on the
              board.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's the post about?"
                autoFocus
                className="min-h-24"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="type">Post type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as PostType)}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOrder.map((key) => {
                      const meta = typeMeta[key];
                      const Icon = meta.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <Icon className="size-4" />
                          {meta.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as PostStatus)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOrder.map((key) => {
                      const meta = statusMeta[key];
                      const Icon = meta.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <Icon className="size-4" />
                          {meta.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduledDate">Scheduled date (optional)</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              Add to board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
