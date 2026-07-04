import { useMemo, useState } from 'react'
import { Car, Clock3, FileCheck2, Home, ShieldCheck, Sprout, Wallet } from 'lucide-react'
import { Button, Chip, Container, PageHero, Reveal } from '../components/ui'
import { credits, type CreditProduct } from '../data/products'
import { cn, monthlyPayment, tndShort } from '../lib/format'

const icons = { home: Home, car: Car, wallet: Wallet, sprout: Sprout }

function Simulator() {
  const [productId, setProductId] = useState<string>('immobilier')
  const product = credits.find((c) => c.id === productId) as CreditProduct
  const [amount, setAmount] = useState(product.defaultAmount)
  const [months, setMonths] = useState(Math.min(180, product.maxMonths))

  function switchProduct(p: CreditProduct) {
    setProductId(p.id)
    setAmount(p.defaultAmount)
    setMonths(Math.min(p.id === 'immobilier' ? 180 : p.maxMonths, p.maxMonths))
  }

  const monthly = useMemo(() => monthlyPayment(amount, product.rate, months), [amount, product.rate, months])
  const totalCost = monthly * months - amount

  return (
    <div id="simulateur" className="scroll-mt-28 rounded-3xl bg-white p-7 shadow-lift ring-1 ring-navy-950/5 sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-2xl font-bold text-navy-950">Simulateur de crédit</h3>
        <Chip tone="mint">{product.rateLabel}</Chip>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {credits.map((c) => {
          const Icon = icons[c.icon]
          return (
            <button
              key={c.id}
              onClick={() => switchProduct(c)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                c.id === productId ? 'bg-navy-900 text-white shadow-card' : 'bg-navy-50 text-navy-800 hover:bg-navy-100',
              )}
              aria-pressed={c.id === productId}
            >
              <Icon className="h-4 w-4" /> {c.name.replace('Crédit ', '')}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-navy-950/60">Montant du crédit</span>
              <span className="tnum font-display text-xl font-bold text-navy-950">{tndShort(amount)}</span>
            </div>
            <input
              type="range"
              min={product.minAmount}
              max={product.maxAmount}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="w-full accent-flame-500"
              aria-label="Montant du crédit"
            />
            <div className="mt-1 flex justify-between text-xs text-navy-950/40">
              <span>{tndShort(product.minAmount)}</span>
              <span>{tndShort(product.maxAmount)}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-navy-950/60">Durée de remboursement</span>
              <span className="tnum font-display text-xl font-bold text-navy-950">
                {months >= 24 ? `${Math.round(months / 12)} ans` : `${months} mois`}
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={product.maxMonths}
              step={12}
              value={months}
              onChange={(e) => setMonths(+e.target.value)}
              className="w-full accent-flame-500"
              aria-label="Durée de remboursement"
            />
            <div className="mt-1 flex justify-between text-xs text-navy-950/40">
              <span>1 an</span>
              <span>{Math.round(product.maxMonths / 12)} ans</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-navy-950/45">
            Simulation indicative au taux de {product.rate.toLocaleString('fr-TN')} % hors assurance et frais de dossier.
            L’octroi reste soumis à l’étude du dossier.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-navy-900 p-6 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-300">Votre mensualité estimée</p>
            <p className="tnum mt-2 font-display text-4xl font-bold">
              {tndShort(monthly)}
              <span className="text-lg font-semibold text-navy-300"> /mois</span>
            </p>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-navy-300">Capital emprunté</span>
                <span className="tnum font-semibold">{tndShort(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">Coût total du crédit</span>
                <span className="tnum font-semibold">{tndShort(totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">Taux annuel</span>
                <span className="tnum font-semibold">{product.rate.toLocaleString('fr-TN')} %</span>
              </div>
            </div>
          </div>
          <Button to="/devenir-client" variant="flame" className="mt-6 w-full">
            Déposer ma demande
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Credits() {
  return (
    <>
      <PageHero
        eyebrow="Crédits"
        title="Vos projets n’attendent pas. Nos réponses non plus."
        lede="Réponse de principe en 24 h pour la conso, 48 h pour l’auto, et un accompagnement dédié pour l’immobilier. Simulez d’abord, décidez ensuite."
      >
        <Button href="#simulateur" variant="flame" size="lg" arrow>Lancer le simulateur</Button>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {credits.map((c, i) => {
              const Icon = icons[c.icon]
              return (
                <Reveal key={c.id} delay={i * 0.08}>
                  <div id={c.id} className="scroll-mt-28 flex h-full flex-col rounded-3xl bg-sand-50 p-7 shadow-card ring-1 ring-navy-950/5">
                    <span className="w-fit rounded-2xl bg-navy-100 p-3 text-navy-800">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-bold text-navy-950">{c.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-950/60">{c.description}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-navy-950/8 pt-4">
                      <span className="text-sm font-bold text-mint-600">{c.rateLabel}</span>
                      <span className="text-xs text-navy-950/45">jusqu’à {Math.round(c.maxMonths / 12)} ans</span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="mt-14">
            <Simulator />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Clock3, title: 'Réponse en 24–48 h', desc: 'Une réponse de principe rapide, en agence ou en ligne.' },
              { icon: FileCheck2, title: 'Dossier 100 % accompagné', desc: 'Un conseiller dédié vous guide pièce par pièce.' },
              { icon: ShieldCheck, title: 'Taux transparents', desc: 'Le taux annoncé est le taux appliqué. Point.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-950/5">
                  <span className="h-fit rounded-xl bg-flame-100 p-2.5 text-flame-600">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-950">{f.title}</h3>
                    <p className="mt-1 text-sm text-navy-950/60">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
