import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectTabs } from "@/components/dashboard/project-tabs";
import { ResearchForm } from "@/components/dashboard/research-form";
import { requireUser } from "@/lib/auth/dal";
import { getProject } from "@/lib/projects/dal";
import { saveResearch } from "@/lib/projects/research-actions";
import { researchContent } from "@/lib/projects/research-content";
import { getResearch } from "@/lib/projects/research-dal";
import { computeResearchProgress } from "@/lib/projects/research-progress";

export const metadata: Metadata = {
  title: researchContent.page.title,
  robots: { index: false },
};

export default async function ProjectResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  // Ownership verified via the RLS-scoped DAL: a foreign/non-existent id → 404.
  const project = await getProject(id);
  if (!project) notFound();

  const research = await getResearch(project.id);
  // Unlock the generation tab from the saved research (same 12-field gate). A
  // successful save revalidates this route, so the tab re-renders unlocked.
  const generationReady = computeResearchProgress(research ?? undefined).ready;

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {project.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {researchContent.page.subtitle}
        </p>

        <div className="mt-6">
          <ProjectTabs
            projectId={project.id}
            active="research"
            generationReady={generationReady}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ResearchForm
            action={saveResearch.bind(null, project.id)}
            research={research}
          />
        </div>
      </main>
    </div>
  );
}
