import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useDemo, monthlySpending } from './store'
import { MonthlySpendingChart, CategoryBreakdown } from './charts'
import { tnd } from '../lib/format'
import { cn } from '../lib/format'

export function Overview() {
  const { accounts, txs } = useDemo()
  const [hidden, setHidden] = useState(false)

  const mask = (v: string) => (hidden ? '••••• DT' : v)
  const june = monthlySpending[monthlySpending.length - 1].value
  const may = monthlySpending[monthlySpending.length - 2].value
  const deltaPct = ((june - may) / may) * 100
  const juneIncome = 3300

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-navy-950/55">Bonjour Ahmed 👋</p>
          <h1 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">Vos finances, en un coup d’œil.</h1>
        </div>
        <button
          onClick={() => setHidden((h) => !h)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-card hover:bg-navy-50"
        >
          {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {hidden ? 'Afficher' : 'Masquer'} les soldes
        </button>
      </div>

      {/* Accounts */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <div
            key={a.id}
            className={cn(
              'rounded-3xl p-6 shadow-card',
              a.kind === 'courant' ? 'bg-navy-900 text-white' : 'bg-white ring-1 ring-navy-950/6',
            )}
          >
            <div className="flex items-center justify-between">
              <p className={cn('text-sm font-semibold', a.kind === 'courant' ? 'text-navy-200' : 'text-navy-950/55')}>
                {a.name}
              </p>
              <span className={cn('rounded-xl p-2', a.kind === 'courant' ? 'bg-white/10 text-white' : 'bg-navy-100 text-navy-800')}>
                {a.kind === 'courant' ? <Wallet className="h-4 w-4" /> : <PiggyBank className="h-4 w-4" />}
              </span>
            </div>
            <p className={cn('mt-3 font-display text-3xl font-bold', a.kind === 'courant' ? 'text-white' : 'text-navy-950')}>
              {mask(tnd(a.balance))}
            </p>
            <p className={cn('mt-2 text-xs tracking-wide', a.kind === 'courant' ? 'text-navy-300' : 'text-navy-950/40')}>
              {a.iban}
            </p>
          </div>
        ))}
      </div>

      {/* Stat tiles */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-950/6">
          <p className="text-sm text-navy-950/55">Dépenses de juin</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-950">{mask(tnd(june, { decimals: 0 }))}</p>
          <p className={cn('mt-1.5 inline-flex items-center gap-1 text-xs font-semibold', deltaPct <= 0 ? 'text-mint-600' : 'text-flame-600')}>
            {deltaPct <= 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1).replace('.', ',')} % vs mai
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-950/6">
          <p className="text-sm text-navy-950/55">Revenus de juin</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-950">{mask(tnd(juneIncome, { decimals: 0 }))}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-mint-600">
            <TrendingUp className="h-3.5 w-3.5" /> +4,2 % vs mai
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-950/6">
          <p className="text-sm text-navy-950/55">Capacité d’épargne</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-950">{mask(tnd(juneIncome - june, { decimals: 0 }))}</p>
          <p className="mt-1.5 text-xs font-semibold text-navy-950/45">ce mois-ci</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6">
          <h2 className="font-display text-base font-bold text-navy-950">Dépenses mensuelles</h2>
          <p className="text-xs text-navy-950/45">Janvier → juin 2026, tous comptes</p>
          <div className="mt-4">
            <MonthlySpendingChart />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6">
          <h2 className="font-display text-base font-bold text-navy-950">Où part votre argent</h2>
          <p className="text-xs text-navy-950/45">Répartition des dépenses de juin</p>
          <div className="mt-5">
            <CategoryBreakdown />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/6">
        <h2 className="font-display text-base font-bold text-navy-950">Dernières opérations</h2>
        <div className="mt-4 divide-y divide-navy-950/5">
          {txs.slice(0, 8).map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className={cn(
                    'rounded-full p-2',
                    t.amount > 0 ? 'bg-mint-100 text-mint-600' : 'bg-navy-50 text-navy-700',
                  )}
                >
                  {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-950">{t.label}</p>
                  <p className="text-xs text-navy-950/45">
                    {t.date} · {t.category}
                  </p>
                </div>
              </div>
              <p className={cn('tnum shrink-0 text-sm font-bold', t.amount > 0 ? 'text-mint-600' : 'text-navy-950')}>
                {hidden ? '•••' : tnd(t.amount, { signed: true })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
