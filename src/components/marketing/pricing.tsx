"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  pricingBillingPreviewNote,
  pricingNote,
  pricingPlans,
} from "@/lib/content";
import { formatEur } from "@/lib/format";
import { cx } from "@/lib/utils";

type Period = "monthly" | "yearly";

export function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section
      id="tarifs"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Tarifs"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tarifs"
          title="Un point d'entrée gratuit, une montée en gamme claire"
          description="Commencez sans carte bancaire, passez au plan Lanceur quand vous publiez pour de vrai."
        />

        {/* Billing period preview toggle — clearly labelled, no billing yet. */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div
            role="group"
            aria-label="Aperçu de la période de facturation"
            className="inline-flex rounded-full bg-slate-100 p-1"
          >
            {(
              [
                { id: "monthly", label: "Mensuel" },
                { id: "yearly", label: "Annuel" },
              ] as const
            ).map((option) => {
              const selected = period === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPeriod(option.id)}
                  className={cx(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    selected
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="max-w-md text-center text-xs text-slate-400">
            {pricingBillingPreviewNote}
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const isFree = plan.priceMonthlyEur === 0;
            const amount =
              period === "yearly"
                ? plan.priceMonthlyEur * 12
                : plan.priceMonthlyEur;
            const suffix = period === "yearly" ? "/an" : "/mois";

            return (
              <div
                key={plan.id}
                className={cx(
                  "flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 sm:p-8",
                  "hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0",
                  plan.recommended
                    ? "border-indigo-600 ring-2 ring-indigo-600"
                    : "border-slate-200",
                  !plan.available && "opacity-95",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {plan.name}
                  </h3>
                  {plan.badge ? (
                    <span
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        plan.recommended
                          ? "bg-highlight text-ink" // Lime accent for the recommended plan
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 flex items-baseline gap-2">
                  {isFree ? (
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      Gratuit
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-slate-900">
                        {formatEur(amount)}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {suffix}
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {plan.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm text-slate-700"
                    >
                      <Check
                        className={cx(
                          "size-5 shrink-0",
                          plan.available ? "text-indigo-600" : "text-slate-400",
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={plan.cta.href}
                  variant={plan.recommended ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  disabledLabel={!plan.available ? "Bientôt disponible" : undefined}
                >
                  {plan.cta.label}
                </ButtonLink>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">{pricingNote}</p>
      </div>
    </section>
  );
}
