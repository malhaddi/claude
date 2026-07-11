import { BookOpen, ListOrdered, Star, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { templates } from "@/lib/content";

const templateStyles: Record<string, { icon: LucideIcon; badge: string }> = {
  story: { icon: BookOpen, badge: "bg-indigo-50 text-indigo-700" },
  listicle: { icon: ListOrdered, badge: "bg-emerald-50 text-emerald-700" },
  review: { icon: Star, badge: "bg-amber-50 text-amber-700" },
};

export function TemplateExamples() {
  return (
    <section
      id="modeles"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
      aria-label="Modèles d'advertoriaux"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Modèles"
          title="3 cadres d'advertoriaux qui ont fait leurs preuves"
          description="Chaque cadre structure votre page différemment selon votre produit et votre audience. L'IA rédige, vous choisissez l'angle."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {templates.map((template) => {
            const style = templateStyles[template.id] ?? {
              icon: BookOpen,
              badge: "bg-slate-100 text-slate-700",
            };
            const Icon = style.icon;
            return (
              <article
                key={template.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${style.badge}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    {template.tagline}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {template.name}
                </h3>
                <blockquote className="mt-3 rounded-lg border-l-2 border-indigo-500 bg-slate-50 p-3 text-sm text-slate-700 italic">
                  {template.hookExample}
                </blockquote>
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                  {template.description}
                </p>
                <p className="mt-4 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">
                    Idéal pour :
                  </span>{" "}
                  {template.bestFor}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
