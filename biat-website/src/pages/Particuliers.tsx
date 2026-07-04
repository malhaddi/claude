import { useState } from 'react'
import { Check, PiggyBank, TrendingUp } from 'lucide-react'
import { Button, Chip, Container, PageHero, Reveal, SectionTitle } from '../components/ui'
import { packs, savingsProducts } from '../data/products'
import { savingsFutureValue, tndShort, cn } from '../lib/format'

function SavingsSimulator() {
  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(8)
  const rate = 7.8
  const total = savingsFutureValue(1000, monthly, rate, years * 12)
  const invested = 1000 + monthly * years * 12
  const gains = total - invested
  return (
    <div className="rounded-3xl bg-white p-7 shadow-lift ring-1 ring-navy-950/5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-navy-950">Plan Épargne Projet</h3>
        <Chip tone="mint">{rate.toLocaleString('fr-TN')} % / an</Chip>
      </div>
      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy-950/60">Versement mensuel</span>
            <span className="tnum font-bold text-navy-950">{tndShort(monthly)}</span>
          </div>
          <input type="range" min={50} max={2000} step={50} value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full accent-flame-500" aria-label="Versement mensuel" />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy-950/60">Horizon</span>
            <span className="tnum font-bold text-navy-950">{years} ans</span>
          </div>
          <input type="range" min={2} max={15} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-flame-500" aria-label="Horizon d’épargne" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-navy-50 px-4 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-950/50">Capital constitué</p>
          <p className="tnum font-display text-2xl font-bold text-navy-900">{tndShort(total)}</p>
        </div>
        <div className="rounded-2xl bg-mint-100 px-4 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-600/80">Dont intérêts</p>
          <p className="tnum font-display text-2xl font-bold text-mint-600">+{tndShort(gains)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-navy-950/45">
        Simulation indicative avec un versement initial de 1 000 DT, hors fiscalité. Taux susceptible d’évolution.
      </p>
    </div>
  )
}

export function Particuliers() {
  return (
    <>
      <PageHero
        eyebrow="Particuliers"
        title="Le quotidien bancaire, enfin simple."
        lede="Un compte qui s’ouvre en 8 minutes, des packs sans mauvaise surprise et une épargne qui rapporte vraiment. Voilà ce que la première banque du pays vous doit."
      >
        <Button to="/devenir-client" variant="flame" size="lg" arrow>Ouvrir mon compte</Button>
      </PageHero>

      {/* Packs */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Comptes & packs"
            title="Trois packs. Zéro jargon. Tout est écrit."
            lede="Comparez en un coup d’œil et changez de pack quand vous voulez, gratuitement, depuis MyBIAT."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {packs.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-3xl p-8 ring-1 transition-all hover:-translate-y-1',
                    p.highlight
                      ? 'bg-navy-900 text-white shadow-lift ring-navy-900'
                      : 'bg-white text-navy-950 shadow-card ring-navy-950/8 hover:shadow-lift',
                  )}
                >
                  {p.highlight && (
                    <span className="absolute -top-3.5 left-8 rounded-full bg-flame-500 px-4 py-1 text-xs font-bold text-white">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <p className={cn('mt-1 text-sm', p.highlight ? 'text-navy-200' : 'text-navy-950/55')}>{p.audience}</p>
                  <p className="tnum mt-5 font-display text-4xl font-bold">
                    {p.price.split('/')[0]}
                    <span className={cn('text-base font-semibold', p.highlight ? 'text-navy-300' : 'text-navy-950/45')}>/mois</span>
                  </p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.highlight ? 'text-mint-500' : 'text-mint-600')} />
                        <span className={p.highlight ? 'text-navy-100' : 'text-navy-950/75'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    to="/devenir-client"
                    variant={p.highlight ? 'flame' : 'outline'}
                    className="mt-8 w-full"
                  >
                    Choisir {p.name}
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Épargne */}
      <section id="epargne" className="scroll-mt-28 bg-sand-50 py-20 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Épargne & placements"
              title="Votre argent mérite mieux qu’un compte qui dort."
              lede="Trois solutions d’épargne, du disponible au bloqué, avec des taux parmi les meilleurs du marché tunisien."
            />
            <div className="mt-9 space-y-4">
              {savingsProducts.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.07}>
                  <div className="flex items-start justify-between gap-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-950/5">
                    <div className="flex gap-4">
                      <span className="h-fit rounded-xl bg-navy-100 p-2.5 text-navy-800">
                        {i === 2 ? <TrendingUp className="h-5 w-5" /> : <PiggyBank className="h-5 w-5" />}
                      </span>
                      <div>
                        <h3 className="font-bold text-navy-950">{s.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-navy-950/60">{s.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tnum font-display text-2xl font-bold text-mint-600">{s.rate.toLocaleString('fr-TN')} %</p>
                      <p className="text-[0.65rem] uppercase tracking-wider text-navy-950/40">par an</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.12}>
            <SavingsSimulator />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
