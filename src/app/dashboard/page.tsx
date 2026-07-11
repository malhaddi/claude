import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

import { signOut } from "@/lib/auth/actions";
import { authContent } from "@/lib/auth/content";
import { requireUser } from "@/lib/auth/dal";
import { siteName } from "@/lib/content";

export const metadata: Metadata = {
  title: authContent.dashboard.title,
  robots: { index: false },
};

/**
 * Protected dashboard. `requireUser()` verifies the session with the Supabase
 * Auth server and redirects to /connexion BEFORE any authenticated markup is
 * produced — no protected HTML is rendered for an anonymous visitor.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const c = authContent.dashboard;

  return (
    <div className="min-h-svh bg-slate-50">
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
            <span className="hidden text-sm text-slate-500 sm:inline">
              {c.signedInAs}{" "}
              <span className="font-medium text-slate-700">{user.email}</span>
            </span>
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

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LayoutDashboard className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            {c.emptyTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:hidden">
            {c.signedInAs}{" "}
            <span className="font-medium text-slate-700">{user.email}</span>
          </p>
          <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600">
            {c.emptyBody}
          </p>
          <p className="mx-auto mt-4 max-w-md rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            {c.nextMilestone}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {c.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
