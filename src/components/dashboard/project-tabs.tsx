import Link from "next/link";
import { FileText, Sparkles, Users } from "lucide-react";

import { researchContent } from "@/lib/projects/research-content";
import { cx } from "@/lib/utils";

/** Workflow navigation for a project: product info, research, generation (soon). */
export function ProjectTabs({
  projectId,
  active,
}: {
  projectId: string;
  active: "product" | "research";
}) {
  const t = researchContent.tabs;
  const tabs = [
    {
      key: "product" as const,
      label: t.product,
      href: `/dashboard/projets/${projectId}`,
      Icon: FileText,
    },
    {
      key: "research" as const,
      label: t.research,
      href: `/dashboard/projets/${projectId}/recherche`,
      Icon: Users,
    },
  ];

  return (
    <nav aria-label="Étapes du projet" className="border-b border-slate-200">
      <ul className="-mb-px flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  isActive
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                )}
              >
                <tab.Icon className="size-4" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li>
          <span
            aria-disabled="true"
            title={t.soon}
            className="inline-flex cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-300"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {t.generation}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              {t.soon}
            </span>
          </span>
        </li>
      </ul>
    </nav>
  );
}
