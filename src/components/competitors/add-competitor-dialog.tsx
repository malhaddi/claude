"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import {
  addCompetitor,
  platformMeta,
  platformOrder,
  type Platform,
} from "@/lib/competitors";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCompetitorDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [platform, setPlatform] = React.useState<Platform>("instagram");

  function handleOpenChange(next: boolean) {
    if (next) {
      setName("");
      setHandle("");
      setPlatform("instagram");
    }
    setOpen(next);
  }

  const canSubmit = name.trim().length > 0 && handle.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    addCompetitor({
      name: name.trim(),
      handle: handle.trim(),
      platform,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add competitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Track a competitor</DialogTitle>
            <DialogDescription>
              Add an account or channel to monitor across its social network.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rival Brand"
                autoFocus
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="handle">Handle</Label>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={platform}
                  onValueChange={(v) => setPlatform(v as Platform)}
                >
                  <SelectTrigger id="platform" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOrder.map((key) => (
                      <SelectItem key={key} value={key}>
                        {platformMeta[key].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              Start tracking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
