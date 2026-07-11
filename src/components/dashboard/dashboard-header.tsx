import { LogOut, Sparkles } from "lucide-react";

import { signOut } from "@/lib/auth/actions";
import { siteName } from "@/lib/content";
import { projectsContent } from "@/lib/projects/content";

/** Top bar shared by the dashboard and project pages: brand, email, logout. */
export function DashboardHeader({ email }: { email?: string | null }) {
  const c = projectsContent.dashboard;
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">
            Adverto<span className="text-indigo-600">AI</span>
            <span className="sr-only">{siteName}</span>
          </span>
        </span>

        <div className="flex items-center gap-3">
          {email ? (
            <span className="hidden text-sm text-slate-500 sm:inline">
              {c.signedInAs}{" "}
              <span className="font-medium text-slate-700">{email}</span>
            </span>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {c.signOut}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
