import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DraftPreview } from "@/components/dashboard/draft-preview";
import { requireUser } from "@/lib/auth/dal";
import { generationContent } from "@/lib/generation/content";
import { getDraft } from "@/lib/generation/dal";
import { getProject } from "@/lib/projects/dal";

export const metadata: Metadata = {
  title: generationContent.result.title,
  robots: { index: false },
};

export default async function DraftDetailPage({
  params,
}: {
  params: Promise<{ id: string; draftId: string }>;
}) {
  const user = await requireUser();
  const { id, draftId } = await params;

  // Both reads are RLS-scoped. We additionally require the draft to belong to
  // THIS project so a valid id from another project cannot be viewed here.
  const project = await getProject(id);
  if (!project) notFound();

  const draft = await getDraft(draftId);
  if (!draft || draft.project_id !== project.id) notFound();

  return (
    <div className="min-h-svh bg-slate-50">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href={`/dashboard/projets/${project.id}/generation`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {generationContent.detail.back}
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {project.name}
        </h1>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <DraftPreview draft={draft} />
        </div>
      </main>
    </div>
  );
}
