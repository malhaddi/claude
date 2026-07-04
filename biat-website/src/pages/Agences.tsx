import { useMemo, useState } from 'react'
import { Clock3, MapPin, Phone, Search } from 'lucide-react'
import { Container, PageHero, Reveal } from '../components/ui'
import { branches, regions } from '../data/branches'
import { cn } from '../lib/format'

export function Agences() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<string>('Toutes')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return branches.filter(
      (b) =>
        (region === 'Toutes' || b.region === region) &&
        (!q || `${b.name} ${b.city} ${b.address}`.toLowerCase().includes(q)),
    )
  }, [query, region])

  return (
    <>
      <PageHero
        eyebrow="Réseau"
        title="205 agences. Toujours une près de chez vous."
        lede="Le premier réseau bancaire du pays, présent dans les 24 gouvernorats — avec des espaces libre-service ouverts 24 h/24."
      />

      <section className="py-16 sm:py-20">
        <Container>
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-950/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une ville, une agence…"
                className="w-full rounded-full bg-sand-50 py-3.5 pl-12 pr-5 text-sm outline-none ring-1 ring-navy-950/10 placeholder:text-navy-950/40 focus:ring-2 focus:ring-navy-500"
                aria-label="Rechercher une agence"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Toutes', ...regions].map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    r === region ? 'bg-navy-900 text-white shadow-card' : 'bg-navy-50 text-navy-800 hover:bg-navy-100',
                  )}
                  aria-pressed={r === region}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-navy-950/50">
            {filtered.length} agence{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </p>

          {/* Results */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b, i) => (
              <Reveal key={b.name} delay={Math.min(i, 6) * 0.04}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-base font-bold leading-snug text-navy-950">{b.name}</h2>
                    <span className="shrink-0 rounded-full bg-navy-100 px-2.5 py-1 text-[0.65rem] font-bold text-navy-800">{b.region}</span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm text-navy-950/65">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" /> {b.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-navy-950/65">
                    <Phone className="h-4 w-4 shrink-0 text-navy-500" /> {b.phone}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-navy-950/65">
                    <Clock3 className="h-4 w-4 shrink-0 text-navy-500" /> Lun–Ven · 8h00–16h30
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-navy-950/6 pt-4">
                    {b.services.map((s) => (
                      <span key={s} className="rounded-full bg-sand-100 px-2.5 py-1 text-[0.65rem] font-semibold text-navy-950/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-3xl bg-sand-50 p-12 text-center text-navy-950/55">
              Aucune agence ne correspond à votre recherche. Essayez une autre ville ou élargissez la région.
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
