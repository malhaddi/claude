import { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { Button, Container, PageHero, Reveal, SectionTitle } from '../components/ui'
import { BankCard } from '../components/BankCard'
import { cards } from '../data/products'
import { cn } from '../lib/format'

const comparison: Array<{ feature: string; values: Array<string | boolean> }> = [
  { feature: 'Cotisation mensuelle', values: ['0 DT', '3 DT', '12 DT', 'Sur invitation'] },
  { feature: 'Plafond hebdomadaire', values: ['500 DT', '2 000 DT', '8 000 DT', 'Sur mesure'] },
  { feature: 'Paiement à l’étranger', values: [false, true, true, true] },
  { feature: 'Assurance voyage', values: [false, false, true, true] },
  { feature: 'Cashback partenaires', values: [false, false, '5 %', '7 %'] },
  { feature: 'Salons d’aéroport', values: [false, false, false, true] },
  { feature: 'Conciergerie 24/7', values: [false, false, false, true] },
  { feature: 'Pilotage MyBIAT (verrouillage, plafonds)', values: [true, true, true, true] },
]

export function Cartes() {
  const [selected, setSelected] = useState(1)
  const card = cards[selected]

  return (
    <>
      <PageHero
        eyebrow="Cartes bancaires"
        title="Une carte pour chaque vie. Toutes sous votre contrôle."
        lede="Verrouillage instantané, plafonds ajustables, e-commerce sécurisé : chaque carte BIAT se pilote depuis MyBIAT, en temps réel."
      />

      {/* Interactive showcase */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap gap-2.5">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(i)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                    i === selected ? 'bg-navy-900 text-white shadow-card' : 'bg-navy-50 text-navy-800 hover:bg-navy-100',
                  )}
                  aria-pressed={i === selected}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <h2 className="mt-8 font-display text-3xl font-bold text-navy-950">{card.name}</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-navy-950/45">{card.network} · {card.monthlyFee}</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-navy-950/65">{card.tagline}</p>
            <ul className="mt-7 space-y-3">
              {card.perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-navy-950/80">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-mint-600" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/devenir-client" variant="flame" arrow>Commander cette carte</Button>
              <Button to="/mybiat" variant="outline">Voir le pilotage dans MyBIAT</Button>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <BankCard
              key={card.id}
              color={card.color}
              name={card.name}
              network={card.network}
              className="w-[min(24rem,90vw)]"
            />
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Comparatif"
            title="Tout est sur la table."
            lede="Pas de frais cachés, pas d’astérisques microscopiques. Comparez et choisissez en connaissance de cause."
            center
          />
          <Reveal className="mt-12">
            <div className="overflow-x-auto rounded-3xl bg-white shadow-card ring-1 ring-navy-950/5 scroll-slim">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-navy-950/8">
                    <th className="p-5 text-left font-semibold text-navy-950/50">Caractéristiques</th>
                    {cards.map((c) => (
                      <th key={c.id} className="p-5 text-center">
                        <span className="font-display text-base font-bold text-navy-950">{c.name}</span>
                        <span className="block text-xs font-medium text-navy-950/45">{c.network}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, ri) => (
                    <tr key={row.feature} className={ri % 2 ? 'bg-sand-50/60' : ''}>
                      <td className="p-5 font-medium text-navy-950/75">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="p-5 text-center">
                          {v === true ? (
                            <Check className="mx-auto h-5 w-5 text-mint-600" aria-label="Inclus" />
                          ) : v === false ? (
                            <Minus className="mx-auto h-5 w-5 text-navy-950/25" aria-label="Non inclus" />
                          ) : (
                            <span className="tnum font-bold text-navy-950">{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-5" />
                    {cards.map((c) => (
                      <td key={c.id} className="p-5 text-center">
                        <Button to="/devenir-client" size="sm" variant={c.id === 'essentielle' ? 'flame' : 'outline'}>
                          Choisir
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
