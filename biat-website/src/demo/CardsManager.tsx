import { Globe, Lock, LockOpen, Snowflake } from 'lucide-react'
import { useDemo } from './store'
import { BankCard } from '../components/BankCard'
import { tndShort } from '../lib/format'
import { cn } from '../lib/format'

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors',
        on ? 'bg-mint-500' : 'bg-navy-950/15',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-card transition-all',
          on ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

export function CardsManager() {
  const { cards, toggleFrozen, toggleEcommerce, setLimit } = useDemo()

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">Vos cartes</h1>
      <p className="mt-1 text-sm text-navy-950/55">
        Verrouillage, plafonds, e-commerce : tout se règle ici, effet immédiat.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {cards.map((c) => (
          <div key={c.id} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6">
            <div className="relative">
              <BankCard
                color={c.color}
                name={c.name.replace('Carte ', '')}
                network={c.network}
                number={`5412 •••• •••• ${c.last4}`}
                tilt={false}
                className={cn('mx-auto transition-all', c.frozen && 'opacity-60 grayscale')}
              />
              {c.frozen && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center gap-2 rounded-full bg-navy-950/85 px-5 py-2.5 text-sm font-bold text-white backdrop-blur">
                    <Snowflake className="h-4 w-4" /> Carte verrouillée
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-xl p-2.5', c.frozen ? 'bg-flame-100 text-flame-600' : 'bg-navy-100 text-navy-800')}>
                    {c.frozen ? <Lock className="h-5 w-5" /> : <LockOpen className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-950">Verrouillage</p>
                    <p className="text-xs text-navy-950/50">
                      {c.frozen ? 'Tous les paiements sont bloqués' : 'Carte active — paiements autorisés'}
                    </p>
                  </div>
                </div>
                <Toggle on={c.frozen} onChange={() => toggleFrozen(c.id)} label={`Verrouiller ${c.name}`} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-navy-100 p-2.5 text-navy-800">
                    <Globe className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-950">Paiements en ligne</p>
                    <p className="text-xs text-navy-950/50">{c.ecommerce ? 'Activés (3-D Secure)' : 'Désactivés'}</p>
                  </div>
                </div>
                <Toggle on={c.ecommerce} onChange={() => toggleEcommerce(c.id)} label={`E-commerce ${c.name}`} />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-bold text-navy-950">Plafond hebdomadaire</span>
                  <span className="tnum font-bold text-navy-900">{tndShort(c.weeklyLimit)}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={c.maxLimit}
                  step={100}
                  value={c.weeklyLimit}
                  onChange={(e) => setLimit(c.id, +e.target.value)}
                  className="w-full accent-flame-500"
                  aria-label={`Plafond hebdomadaire ${c.name}`}
                />
                <div className="mt-1 flex justify-between text-xs text-navy-950/40">
                  <span>200 DT</span>
                  <span>{tndShort(c.maxLimit)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
