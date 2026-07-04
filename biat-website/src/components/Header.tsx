import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown, CreditCard, Landmark, PiggyBank, Building2, HeartHandshake,
  MapPin, Phone, Menu, X, Lock, Sparkles, Wallet, Home, Car, LineChart, Users,
} from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './ui'
import { cn } from '../lib/format'

interface MenuLink {
  to: string
  label: string
  desc: string
  icon: typeof CreditCard
}

interface MenuSection {
  label: string
  links: MenuLink[]
  featured: { title: string; desc: string; to: string; cta: string }
}

const menus: MenuSection[] = [
  {
    label: 'Comptes & Cartes',
    links: [
      { to: '/particuliers', label: 'Comptes & packs', desc: 'Le quotidien, du premier compte au pack Excellence', icon: Wallet },
      { to: '/cartes', label: 'Cartes bancaires', desc: 'De la Carte Jeune à la Visa Infinite', icon: CreditCard },
      { to: '/particuliers#epargne', label: 'Épargne', desc: 'Comptes épargne, plans projet et dépôts à terme', icon: PiggyBank },
      { to: '/devenir-client', label: 'Devenir client', desc: 'Ouvrez votre compte en ligne en 8 minutes', icon: Sparkles },
    ],
    featured: {
      title: 'MyBIAT, votre banque dans la poche',
      desc: 'Comptes, cartes, virements et budget — découvrez la démo interactive.',
      to: '/mybiat',
      cta: 'Essayer la démo',
    },
  },
  {
    label: 'Crédits',
    links: [
      { to: '/credits#immobilier', label: 'Crédit immobilier', desc: 'Jusqu’à 25 ans pour votre logement', icon: Home },
      { to: '/credits#auto', label: 'Crédit auto', desc: 'Neuve ou occasion, réponse en 48 h', icon: Car },
      { to: '/credits#conso', label: 'Crédit consommation', desc: 'Projets et imprévus, réponse en 24 h', icon: Wallet },
      { to: '/credits#simulateur', label: 'Simulateurs', desc: 'Calculez vos mensualités en direct', icon: LineChart },
    ],
    featured: {
      title: 'Simulez votre crédit en 30 secondes',
      desc: 'Montant, durée, mensualité : tout se calcule sous vos yeux, sans engagement.',
      to: '/credits#simulateur',
      cta: 'Lancer le simulateur',
    },
  },
  {
    label: 'Entreprises',
    links: [
      { to: '/entreprises', label: 'PME & Professionnels', desc: 'Comptes pro, TPE, monétique et financement', icon: Building2 },
      { to: '/entreprises#financement', label: 'Financement', desc: 'Investissement, cycle d’exploitation, leasing', icon: Landmark },
      { to: '/entreprises#international', label: 'Commerce international', desc: 'Import-export, change et trade finance', icon: LineChart },
      { to: '/entreprises#cash', label: 'Cash management', desc: 'BIATNET Corporate et flux centralisés', icon: Users },
    ],
    featured: {
      title: '500 M DT pour la transition énergétique',
      desc: 'Une enveloppe dédiée aux PME qui investissent dans le durable.',
      to: '/entreprises#financement',
      cta: 'En savoir plus',
    },
  },
  {
    label: 'La Banque',
    links: [
      { to: '/banque', label: 'Qui sommes-nous', desc: '48 ans d’histoire, 1re banque de Tunisie', icon: Landmark },
      { to: '/banque#fondation', label: 'Fondation BIAT', desc: 'Jeunesse, culture et développement régional', icon: HeartHandshake },
      { to: '/agences', label: 'Nos agences', desc: '205 agences dans les 24 gouvernorats', icon: MapPin },
      { to: '/contact', label: 'Aide & contact', desc: 'FAQ, réclamations et conseillers', icon: Phone },
    ],
    featured: {
      title: 'La Fondation BIAT agit pour la jeunesse',
      desc: '120 bourses d’excellence lancées pour les étudiants des régions.',
      to: '/banque#fondation',
      cta: 'Découvrir la Fondation',
    },
  },
]

export function Header() {
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [location])

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => setOpen(null)}>
      {/* Utility bar */}
      <div className="bg-navy-950 text-navy-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-1.5 text-xs">
          <p className="hidden sm:block font-medium tracking-wide">
            La première banque de Tunisie — <span className="text-white">depuis 1976</span>
          </p>
          <div className="flex items-center gap-5">
            <Link to="/agences" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="h-3.5 w-3.5" /> Agences
            </Link>
            <a href="tel:+21671340733" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" /> 71 340 733
            </a>
            <Link to="/contact" className="hover:text-white transition-colors">Aide & contact</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          'border-b border-navy-950/8 bg-white/90 backdrop-blur-xl transition-shadow',
          scrolled && 'shadow-[0_4px_24px_-12px_rgb(4_24_50/0.25)]',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 py-3">
          <Link to="/" aria-label="BIAT — Accueil">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {menus.map((m) => (
              <button
                key={m.label}
                onMouseEnter={() => setOpen(m.label)}
                onClick={() => setOpen(open === m.label ? null : m.label)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  open === m.label ? 'bg-navy-50 text-navy-900' : 'text-navy-950/75 hover:text-navy-900',
                )}
                aria-expanded={open === m.label}
              >
                {m.label}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open === m.label && 'rotate-180')} />
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            <Button to="/mybiat" variant="outline" size="sm">
              <Lock className="h-3.5 w-3.5" /> MyBIAT
            </Button>
            <Button to="/devenir-client" variant="flame" size="sm">
              Devenir client
            </Button>
          </div>

          <button
            className="lg:hidden rounded-lg p-2 text-navy-900 hover:bg-navy-50"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="border-b border-navy-950/8 bg-white shadow-lift">
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_320px] gap-8 px-8 py-8">
                  <div className="grid grid-cols-2 gap-2">
                    {menus
                      .find((m) => m.label === open)!
                      .links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className="group flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-navy-50"
                        >
                          <span className="mt-0.5 rounded-xl bg-navy-100 p-2.5 text-navy-700 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                            <l.icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block font-semibold text-navy-950">{l.label}</span>
                            <span className="mt-0.5 block text-sm text-navy-950/60">{l.desc}</span>
                          </span>
                        </Link>
                      ))}
                  </div>
                  {(() => {
                    const f = menus.find((m) => m.label === open)!.featured
                    return (
                      <Link
                        to={f.to}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-navy-900 p-6 text-white"
                      >
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-navy-600/40 blur-2xl" />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-400">À la une</span>
                          <h3 className="mt-2 font-display text-lg font-bold leading-snug">{f.title}</h3>
                          <p className="mt-2 text-sm text-navy-200">{f.desc}</p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                          {f.cta} →
                        </span>
                      </Link>
                    )
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(24rem,90vw)] flex-col bg-white shadow-lift lg:hidden"
              aria-label="Menu mobile"
            >
              <div className="flex items-center justify-between border-b border-navy-950/8 p-5">
                <Logo />
                <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu" className="rounded-lg p-2 hover:bg-navy-50">
                  <X className="h-6 w-6 text-navy-900" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 scroll-slim">
                {menus.map((m) => (
                  <div key={m.label} className="mb-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-navy-950/50">{m.label}</p>
                    {m.links.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-navy-950 hover:bg-navy-50"
                      >
                        <l.icon className="h-4.5 w-4.5 text-navy-600" />
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-navy-950/8 p-5">
                <Button to="/mybiat" variant="outline" size="sm">MyBIAT</Button>
                <Button to="/devenir-client" variant="flame" size="sm">Devenir client</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
