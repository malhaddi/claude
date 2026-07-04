import { ArrowDownLeft, ArrowUpRight, Eye, Plus, Send, Wallet } from 'lucide-react'
import { cn } from '../lib/format'

const txs = [
  { label: 'Salaire — STEG', amount: '+2 450,000 DT', up: false, date: 'Aujourd’hui' },
  { label: 'Carrefour La Marsa', amount: '−86,400 DT', up: true, date: 'Hier' },
  { label: 'Virement — Yasmine B.', amount: '−300,000 DT', up: true, date: '30 juin' },
  { label: 'Café Journal', amount: '−7,500 DT', up: true, date: '29 juin' },
]

export function PhoneMock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-[280px] rounded-[2.6rem] border-[10px] border-navy-950 bg-navy-950 shadow-lift',
        className,
      )}
      aria-hidden
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy-950" />
      <div className="overflow-hidden rounded-[2rem] bg-sand-50">
        {/* App header */}
        <div className="bg-navy-900 px-5 pb-12 pt-9 text-white">
          <div className="flex items-center justify-between text-[0.65rem] text-navy-300">
            <span>Bonjour, Ahmed</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> Masquer</span>
          </div>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.16em] text-navy-300">Compte courant</p>
          <p className="tnum font-display text-[1.7rem] font-bold leading-tight">12 845,300 DT</p>
        </div>

        {/* Quick actions */}
        <div className="-mt-8 mx-4 grid grid-cols-4 gap-2 rounded-2xl bg-white p-3 shadow-card">
          {[
            { icon: Send, label: 'Virement' },
            { icon: Wallet, label: 'Cartes' },
            { icon: ArrowDownLeft, label: 'Recevoir' },
            { icon: Plus, label: 'Plus' },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-1.5">
              <span className="rounded-xl bg-navy-100 p-2 text-navy-800">
                <a.icon className="h-4 w-4" />
              </span>
              <span className="text-[0.55rem] font-semibold text-navy-950/70">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="px-4 pb-6 pt-4">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-navy-950/50">Dernières opérations</p>
          <div className="space-y-1.5">
            {txs.map((t) => (
              <div key={t.label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-card">
                <div className="flex items-center gap-2.5">
                  <span className={cn('rounded-full p-1.5', t.up ? 'bg-navy-100 text-navy-700' : 'bg-mint-100 text-mint-600')}>
                    {t.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-navy-950">{t.label}</p>
                    <p className="text-[0.55rem] text-navy-950/50">{t.date}</p>
                  </div>
                </div>
                <p className={cn('tnum text-[0.65rem] font-bold', t.up ? 'text-navy-950' : 'text-mint-600')}>{t.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
