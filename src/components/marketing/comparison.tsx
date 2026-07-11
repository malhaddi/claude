import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { comparisonApproaches, comparisonRows } from "@/lib/content";
import { cx } from "@/lib/utils";

export function Comparison() {
  return (
    <section
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
      aria-label="Comparaison des approches"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Comparaison"
            title="Quatre façons de préparer une page de campagne"
            description="Une comparaison par catégories de workflow — sans viser d'outil en particulier."
          />
        </Reveal>

        <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparaison des approches pour créer une page de pré-vente selon
              huit critères de workflow.
            </caption>
            <thead>
              <tr className="border-b border-slate-200">
                <th
                  scope="col"
                  className="p-4 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                >
                  Critère
                </th>
                {comparisonApproaches.map((approach) => (
                  <th
                    key={approach.id}
                    scope="col"
                    className={cx(
                      "p-4 text-sm font-semibold",
                      approach.highlight
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700",
                    )}
                  >
                    {approach.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.dimension}
                  className="border-b border-slate-100 last:border-0"
                >
                  <th
                    scope="row"
                    className="p-4 font-medium text-slate-700"
                  >
                    {row.dimension}
                  </th>
                  {comparisonApproaches.map((approach) => (
                    <td
                      key={approach.id}
                      className={cx(
                        "p-4",
                        approach.highlight
                          ? "bg-indigo-50/60 font-medium text-indigo-900"
                          : "text-slate-600",
                      )}
                    >
                      {row.values[approach.id] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-4 text-center text-xs text-slate-400">
          Comparaison indicative des approches, sans tarif ni nom de produit
          tiers.
        </p>
      </div>
    </section>
  );
}
