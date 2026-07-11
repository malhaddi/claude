import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectForm } from "@/components/dashboard/project-form";
import { requireUser } from "@/lib/auth/dal";
import { updateProject } from "@/lib/projects/actions";
import { getProject } from "@/lib/projects/dal";
import { projectsContent } from "@/lib/projects/content";

export const metadata: Metadata = {
  title: projectsContent.form.editTitle,
  robots: { index: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  // getProject is RLS-scoped: a foreign or non-existent id returns null, so an
  // inaccessible project id yields a 404 — no cross-user data disclosure.
  const project = await getProject(id);
  if (!project) notFound();

  const c = projectsContent.form;

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {c.editTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{c.editSubtitle}</p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ProjectForm
            action={updateProject.bind(null, project.id)}
            project={project}
            mode="edit"
          />
        </div>
      </main>
    </div>
  );
}
