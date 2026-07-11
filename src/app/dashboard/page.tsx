import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectList } from "@/components/dashboard/project-list";
import { authContent } from "@/lib/auth/content";
import { requireUser } from "@/lib/auth/dal";
import { getProjects } from "@/lib/projects/dal";
import { projectsContent } from "@/lib/projects/content";

export const metadata: Metadata = {
  title: authContent.dashboard.title,
  robots: { index: false },
};

/**
 * Protected dashboard. `requireUser()` verifies the session and redirects to
 * /connexion BEFORE any authenticated markup is produced. Projects are read
 * through the RLS-scoped DAL, so only the current user's rows are ever loaded.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const projects = await getProjects();
  const c = projectsContent.dashboard;

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {c.welcome}
              {user.email ? `, ${user.email}` : ""}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {c.projectsTitle}
            </h1>
          </div>
          <Link
            href="/dashboard/projets/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="size-4" aria-hidden="true" />
            {c.newProject}
          </Link>
        </div>

        <div className="mt-8">
          <ProjectList projects={projects} />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          {c.nextMilestone}
        </p>
      </main>
    </div>
  );
}
