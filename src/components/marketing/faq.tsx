import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { faqItems } from "@/lib/content";

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
      aria-label="Questions fréquentes"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions fréquentes"
          description="Tout ce qu'il faut savoir avant de créer votre premier advertorial."
        />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
