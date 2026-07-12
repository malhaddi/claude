"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Link as LinkIcon,
  PencilRuler,
  Sparkles,
  Target,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { workflowIntro, workflowSteps } from "@/lib/content";
import { cx } from "@/lib/utils";

const stepIcons = [LinkIcon, Target, Sparkles, PencilRuler];
const AUTOPLAY_MS = 3000;

/** Small illustrative visual for each workflow step. Decorative. */
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <LinkIcon className="size-4 shrink-0 text-indigo-600" aria-hidden="true" />
        <span className="truncate font-mono text-xs text-slate-600">
          maboutique.fr/products/mon-produit
        </span>
        <span className="ml-auto rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white">
          Coller
        </span>
      </div>
    );
  }
  if (index === 1) {
    const angles = ["5 raisons de…", "J'ai testé…", "Problème → solution"];
    return (
      <div className="flex flex-wrap gap-2">
        {angles.map((angle, i) => (
          <span
            key={angle}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset",
              i === 1
                ? "bg-indigo-600 text-white ring-indigo-600"
                : "bg-white text-slate-600 ring-slate-200",
            )}
          >
            {i === 1 ? "✓ " : ""}
            {angle}
          </span>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="h-2 w-1/3 rounded-full bg-indigo-200" />
        <div className="h-2 w-full rounded-full bg-slate-100" />
        <div className="h-2 w-11/12 rounded-full bg-slate-100" />
        <div className="h-2 w-4/5 rounded-full bg-slate-100" />
        <p className="pt-1 text-[11px] font-medium text-indigo-600">
          Rédaction en français…
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Check className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-900">Page prête</p>
        <p className="text-[11px] text-slate-500">Hébergée et publiable</p>
      </div>
      <span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
        Publier
      </span>
    </div>
  );
}

export function WorkflowDemo() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inViewRef = useRef(false);
  const baseId = useId();

  // Autoplay only when: motion allowed, section in view, user hasn't taken
  // manual control, and the tab strip isn't focused/hovered.
  useEffect(() => {
    if (!autoplay) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    const timer = window.setInterval(() => {
      if (inViewRef.current) {
        setActive((prev) => (prev + 1) % workflowSteps.length);
      }
    }, AUTOPLAY_MS);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [autoplay]);

  const stopAutoplay = () => setAutoplay(false);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      stopAutoplay();
      setActive((prev) => (prev + 1) % workflowSteps.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      stopAutoplay();
      setActive(
        (prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length,
      );
    }
  };

  return (
    <section
      id="produit"
      ref={sectionRef}
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Le produit en action"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Le produit"
          title="De l'URL produit à la page prête à publier"
          description={workflowIntro}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          {/* Tablist */}
          <div
            role="tablist"
            aria-label="Étapes du parcours produit"
            aria-orientation="vertical"
            className="flex min-w-0 flex-col gap-3"
            onKeyDown={onKeyDown}
            onMouseEnter={stopAutoplay}
          >
            {workflowSteps.map((step, index) => {
              const Icon = stepIcons[index] ?? Sparkles;
              const selected = index === active;
              return (
                <button
                  key={step.id}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    stopAutoplay();
                    setActive(index);
                  }}
                  onFocus={stopAutoplay}
                  className={cx(
                    "flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    selected
                      ? "border-indigo-200 bg-indigo-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cx(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                      selected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
                        {step.label}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-base font-semibold text-slate-900">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      {step.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                {workflowSteps[active].title}
              </p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                {active + 1} / {workflowSteps.length}
              </span>
            </div>

            {/* Progress segments */}
            <div className="mt-4 flex gap-1.5">
              {workflowSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={cx(
                    "h-1 flex-1 rounded-full transition-colors",
                    index <= active ? "bg-indigo-600" : "bg-slate-200",
                  )}
                />
              ))}
            </div>

            {/* Visual — fixed min-height to avoid layout shift between steps */}
            <div className="mt-6 flex min-h-32 items-center">
              <div className="w-full">
                <StepVisual index={active} />
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {workflowSteps[active].description}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Démonstration produit — interface illustrée.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
