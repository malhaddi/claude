import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectForm } from "@/components/dashboard/project-form";
import { requireUser } from "@/lib/auth/dal";
import { createProject } from "@/lib/projects/actions";
import { projectsContent } from "@/lib/projects/content";

export const metadata: Metadata = {
  title: projectsContent.form.newTitle,
  robots: { index: false },
};

export default async function NewProjectPage() {
  const user = await requireUser();
  const c = projectsContent.form;

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {c.newTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{c.newSubtitle}</p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ProjectForm action={createProject} project={null} mode="create" />
        </div>
      </main>
    </div>
  );
}
