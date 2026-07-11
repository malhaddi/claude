import { ArrowRight, CreditCard, PlayCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Controlled background gradient + subtle grid, decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl">
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700">
            {hero.badge}
          </p>
          <h1
            className="hero-rise mt-5 text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl"
            style={{ ["--rise-delay" as string]: "80ms" }}
          >
            {hero.headline}
          </h1>
          <p
            className="hero-rise mt-5 text-lg leading-8 text-pretty text-slate-600"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            {hero.promise}
          </p>
          <div
            className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ ["--rise-delay" as string]: "240ms" }}
          >
            <ButtonLink
              href={hero.primaryCta.href}
              className="px-6 py-3 text-base"
            >
              {hero.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              className="px-6 py-3 text-base"
            >
              <PlayCircle className="size-4" aria-hidden="true" />
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <p
            className="hero-rise mt-4 flex items-center gap-2 text-sm text-slate-500"
            style={{ ["--rise-delay" as string]: "320ms" }}
          >
            <CreditCard className="size-4" aria-hidden="true" />
            {hero.noCardNote}
          </p>
        </div>

        <div
          className="hero-rise relative"
          style={{ ["--rise-delay" as string]: "200ms" }}
        >
          <HeroPreview />
          <p className="mt-3 text-center text-xs text-slate-400">
            {hero.previewLabel} — interface illustrée
          </p>
        </div>
      </div>
    </section>
  );
}
