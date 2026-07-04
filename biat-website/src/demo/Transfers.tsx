import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { useDemo, type Beneficiary } from './store'
import { tnd } from '../lib/format'
import { cn } from '../lib/format'

export function Transfers() {
  const { accounts, beneficiaries, transfer, txs } = useDemo()
  const [accountId, setAccountId] = useState('cc')
  const [benef, setBenef] = useState<Beneficiary | null>(beneficiaries[0])
  const [amount, setAmount] = useState('')
  const [motif, setMotif] = useState('')
  const [done, setDone] = useState<{ amount: number; name: string } | null>(null)

  const account = accounts.find((a) => a.id === accountId)!
  const value = parseFloat(amount.replace(',', '.'))
  const valid = benef && !Number.isNaN(value) && value > 0 && value <= account.balance

  const outgoing = txs.filter((t) => t.category === 'Virements').slice(0, 5)

  function submit() {
    if (!valid || !benef) return
    transfer(accountId, benef, value, motif.trim())
    setDone({ amount: value, name: benef.name })
    setAmount('')
    setMotif('')
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">Virements</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-950/55">
        <Zap className="h-4 w-4 text-flame-500" /> Instantanés, 24/7, vers toutes les banques tunisiennes.
      </p>

      <div className="mt-7 grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6 sm:p-7">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-mint-500" />
                <h2 className="mt-4 font-display text-xl font-bold text-navy-950">Virement exécuté ✓</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-navy-950/60">
                  <span className="tnum font-bold text-navy-950">{tnd(done.amount)}</span> envoyés instantanément
                  à <span className="font-bold text-navy-950">{done.name}</span>. Le solde et l’historique sont déjà à jour.
                </p>
                <button
                  onClick={() => setDone(null)}
                  className="mt-6 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
                >
                  Faire un autre virement
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-base font-bold text-navy-950">Nouveau virement</h2>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Compte à débiter</span>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {tnd(a.balance)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-4">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Bénéficiaire</span>
                  <div className="space-y-2">
                    {beneficiaries.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBenef(b)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl p-3.5 text-left ring-2 transition-all',
                          benef?.id === b.id ? 'bg-navy-50 ring-navy-700' : 'ring-navy-950/8 hover:ring-navy-300',
                        )}
                        aria-pressed={benef?.id === b.id}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-xs font-bold text-white">
                            {b.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-navy-950">{b.name}</span>
                            <span className="block text-xs text-navy-950/45">{b.bank} · {b.iban.slice(0, 14)}…</span>
                          </span>
                        </span>
                        {benef?.id === b.id && <CheckCircle2 className="h-5 w-5 text-navy-700" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Montant (DT)</span>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="decimal"
                      placeholder="250,000"
                      className="tnum w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">Motif (optionnel)</span>
                    <input
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      placeholder="Loyer, remboursement…"
                      className="w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 focus:ring-2 focus:ring-navy-500"
                    />
                  </label>
                </div>

                {!Number.isNaN(value) && value > account.balance && (
                  <p className="mt-3 text-sm font-semibold text-flame-600">
                    Montant supérieur au solde disponible ({tnd(account.balance)}).
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={!valid}
                  className={cn(
                    'mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all',
                    valid ? 'bg-flame-500 text-white hover:bg-flame-600 shadow-card' : 'bg-navy-100 text-navy-950/35',
                  )}
                >
                  Envoyer maintenant <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History */}
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6">
          <h2 className="font-display text-base font-bold text-navy-950">Derniers virements</h2>
          <div className="mt-3 divide-y divide-navy-950/5">
            {outgoing.length === 0 && <p className="py-6 text-sm text-navy-950/50">Aucun virement récent.</p>}
            {outgoing.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-950">{t.label.replace('Virement — ', '')}</p>
                  <p className="text-xs text-navy-950/45">{t.date}</p>
                </div>
                <p className="tnum shrink-0 text-sm font-bold text-navy-950">{tnd(t.amount, { signed: true })}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-950/60">
            💡 Dans la vraie app, chaque virement est confirmé par empreinte digitale ou Face ID,
            et un reçu PDF est généré automatiquement.
          </div>
        </div>
      </div>
    </div>
  )
}
