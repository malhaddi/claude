"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

import { deleteProject } from "@/lib/projects/actions";
import { projectsContent } from "@/lib/projects/content";

const c = projectsContent.delete;

function ConfirmSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-60"
    >
      {pending ? c.deleting : c.confirm}
    </button>
  );
}

/** Inline delete with a two-step confirmation (no window.confirm dependency). */
export function DeleteProjectButton({
  id,
  projectName,
}: {
  id: string;
  projectName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        aria-label={`${c.action} — ${projectName}`}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        {c.action}
      </button>
    );
  }

  return (
    <form
      action={deleteProject.bind(null, id)}
      className="flex items-center gap-2"
    >
      <span className="text-xs text-slate-600">{c.confirmQuestion}</span>
      <ConfirmSubmit />
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {c.cancel}
      </button>
    </form>
  );
}
