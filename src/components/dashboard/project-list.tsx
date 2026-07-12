import Link from "next/link";
import { ArrowRight, FolderPlus } from "lucide-react";

import { DeleteProjectButton } from "@/components/dashboard/delete-project-button";
import { projectsContent } from "@/lib/projects/content";
import { formatDateFr } from "@/lib/format";
import type { Project } from "@/lib/projects/types";

const c = projectsContent.dashboard;

function statusLabel(status: string): string {
  if (status === "draft") return projectsContent.status.draft;
  return projectsContent.status.unknown;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <FolderPlus className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {c.emptyTitle}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {c.emptyBody}
      </p>
      <Link
        href="/dashboard/projets/nouveau"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {c.emptyCta}
      </Link>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {project.name}
          </h3>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
            {statusLabel(project.status)}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {c.createdOn} {formatDateFr(project.created_at)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DeleteProjectButton id={project.id} projectName={project.name} />
        <Link
          href={`/dashboard/projets/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {c.open}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />;
  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
