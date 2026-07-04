import { NavLink, Route, Routes, Link } from 'react-router-dom'
import { ArrowLeftRight, CreditCard, Info, LayoutDashboard, LogOut } from 'lucide-react'
import { Logo } from '../components/Logo'
import { DemoProvider } from './store'
import { Overview } from './Overview'
import { Transfers } from './Transfers'
import { CardsManager } from './CardsManager'
import { cn } from '../lib/format'

const nav = [
  { to: '/mybiat', end: true, icon: LayoutDashboard, label: 'Aperçu' },
  { to: '/mybiat/virements', end: false, icon: ArrowLeftRight, label: 'Virements' },
  { to: '/mybiat/cartes', end: false, icon: CreditCard, label: 'Cartes' },
]

export function DemoApp() {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-sand-50 lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col border-r border-navy-950/8 bg-white px-5 py-6">
          <Link to="/" aria-label="Retour au site BIAT">
            <Logo />
          </Link>
          <nav className="mt-10 space-y-1.5" aria-label="Navigation MyBIAT">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                    isActive ? 'bg-navy-900 text-white shadow-card' : 'text-navy-950/65 hover:bg-navy-50',
                  )
                }
              >
                <n.icon className="h-5 w-5" /> {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            <div className="rounded-2xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-950/60">
              <p className="mb-1 flex items-center gap-1.5 font-bold text-navy-900">
                <Info className="h-3.5 w-3.5" /> Mode démo
              </p>
              Données fictives — aucune connexion à un vrai compte. Vos actions (virements, verrouillage)
              modifient la démo en direct.
            </div>
            <div className="flex items-center gap-3 border-t border-navy-950/8 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-white">
                AB
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-950">Ahmed Ben Salah</p>
                <p className="text-xs text-navy-950/50">Client depuis 2018</p>
              </div>
              <Link to="/" aria-label="Quitter la démo" className="rounded-lg p-2 text-navy-950/50 hover:bg-navy-50 hover:text-navy-900">
                <LogOut className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen flex-col">
          {/* Demo banner */}
          <div className="bg-flame-500 px-4 py-2 text-center text-xs font-semibold text-white">
            Démo interactive MyBIAT — données fictives.{' '}
            <Link to="/" className="underline underline-offset-2">Retour au site</Link>
          </div>

          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-navy-950/8 bg-white px-5 py-3 lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-xs font-bold text-white">
              AB
            </span>
          </div>

          <main className="flex-1 px-5 py-7 sm:px-8 lg:px-10">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="virements" element={<Transfers />} />
              <Route path="cartes" element={<CardsManager />} />
            </Routes>
          </main>

          {/* Mobile bottom nav */}
          <nav className="sticky bottom-0 grid grid-cols-3 border-t border-navy-950/8 bg-white lg:hidden" aria-label="Navigation MyBIAT mobile">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 py-3 text-[0.65rem] font-semibold',
                    isActive ? 'text-navy-900' : 'text-navy-950/45',
                  )
                }
              >
                <n.icon className="h-5 w-5" /> {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </DemoProvider>
  )
}
