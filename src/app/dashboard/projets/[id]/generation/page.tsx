import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DraftHistory } from "@/components/dashboard/draft-history";
import { GenerationForm } from "@/components/dashboard/generation-form";
import { ProjectTabs } from "@/components/dashboard/project-tabs";
import { requireUser } from "@/lib/auth/dal";
import { generateAdvertorial } from "@/lib/generation/actions";
import { generationContent } from "@/lib/generation/content";
import { getDrafts, getLatestDraft } from "@/lib/generation/dal";
import { getProject } from "@/lib/projects/dal";
import { getResearch } from "@/lib/projects/research-dal";
import {
  computeResearchProgress,
  type ResearchProgress,
} from "@/lib/projects/research-progress";

export const metadata: Metadata = {
  title: generationContent.page.title,
  robots: { index: false },
};

function GatingBlock({
  projectId,
  progress,
}: {
  projectId: string;
  progress: ResearchProgress;
}) {
  const g = generationContent.gating;
  const progressText = g.progress
    .replace("{done}", String(progress.completed))
    .replace("{total}", String(progress.total));

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Lock className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{g.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {g.body}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-500">{progressText}</p>
      <Link
        href={`/dashboard/projets/${projectId}/recherche`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {g.cta}
      </Link>
    </div>
  );
}

export default async function ProjectGenerationPage({
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
  const progress = computeResearchProgress(research ?? undefined);

  // Only fetch drafts once generation is actually unlocked.
  const [drafts, latestDraft] = progress.ready
    ? await Promise.all([getDrafts(project.id), getLatestDraft(project.id)])
    : [[], null];

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {project.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {generationContent.page.subtitle}
        </p>

        <div className="mt-6">
          <ProjectTabs
            projectId={project.id}
            active="generation"
            generationReady={progress.ready}
          />
        </div>

        {progress.ready ? (
          <>
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <GenerationForm
                action={generateAdvertorial.bind(null, project.id)}
                latestDraft={latestDraft}
              />
            </div>
            <div className="mt-10">
              <DraftHistory projectId={project.id} drafts={drafts} />
            </div>
          </>
        ) : (
          <GatingBlock projectId={project.id} progress={progress} />
        )}
      </main>
    </div>
  );
}
