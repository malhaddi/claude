import { Link } from 'react-router-dom'
import { Smartphone, ShieldCheck, Landmark } from 'lucide-react'
import { Logo } from './Logo'
import { Container } from './ui'

const social = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/BanqueInternationaleArabedeTunisie/',
    path: 'M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5H16.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H8v3h2.5v7h3z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zM16.9 8.3a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0zM12 5.5c-1.8 0-2 0-2.7.1-.7 0-1.2.1-1.6.3-.4.2-.8.4-1.1.7-.4.4-.6.7-.8 1.1-.1.4-.3.9-.3 1.6V12c0 1.8 0 2 .1 2.7 0 .7.1 1.2.3 1.6.2.4.4.8.7 1.1.4.4.7.6 1.1.8.4.1.9.3 1.6.3H12c1.8 0 2 0 2.7-.1.7 0 1.2-.1 1.6-.3.4-.2.8-.4 1.1-.7.4-.4.6-.7.8-1.1.1-.4.3-.9.3-1.6.1-.7.1-.9.1-2.7s0-2-.1-2.7c0-.7-.1-1.2-.3-1.6a3 3 0 0 0-.7-1.1 3 3 0 0 0-1.1-.8c-.4-.1-.9-.3-1.6-.3-.7-.1-.9-.1-2.8-.1zm0 1.2h2.6c.6 0 1 .1 1.2.2.3.1.5.3.7.5.2.2.4.4.5.7.1.2.2.6.2 1.2.1.7.1.9.1 2.6s0 1.9-.1 2.6c0 .6-.1 1-.2 1.2-.1.3-.3.5-.5.7a2 2 0 0 1-.7.5c-.2.1-.6.2-1.2.2-.7.1-.9.1-2.6.1s-1.9 0-2.6-.1c-.6 0-1-.1-1.2-.2a2 2 0 0 1-.7-.5 2 2 0 0 1-.5-.7c-.1-.2-.2-.6-.2-1.2-.1-.7-.1-.9-.1-2.6s0-1.9.1-2.6c0-.6.1-1 .2-1.2.1-.3.3-.5.5-.7.2-.2.4-.4.7-.5.2-.1.6-.2 1.2-.2.7-.1.9-.1 2.6-.1z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M6.5 8.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM5.2 18.4h2.7v-8.3H5.2v8.3zM13 10c-1.3 0-2 .7-2.3 1.2h-.1l-.1-1h-2.4c0 .7.1 1.6.1 2.6v5.6h2.7v-4.7c0-.2 0-.5.1-.6.2-.5.6-1 1.3-1 .9 0 1.3.7 1.3 1.7v4.6H16v-4.9c0-2.5-1.3-3.5-3-3.5z',
  },
  {
    label: 'YouTube',
    href: '#',
    path: 'M19.6 8.2a2 2 0 0 0-1.4-1.4C16.9 6.4 12 6.4 12 6.4s-4.9 0-6.2.4A2 2 0 0 0 4.4 8.2C4 9.5 4 12 4 12s0 2.5.4 3.8c.2.7.7 1.2 1.4 1.4 1.3.4 6.2.4 6.2.4s4.9 0 6.2-.4a2 2 0 0 0 1.4-1.4c.4-1.3.4-3.8.4-3.8s0-2.5-.4-3.8zM10.4 14.4V9.6l4.2 2.4-4.2 2.4z',
  },
]

const columns = [
  {
    title: 'Particuliers',
    links: [
      { label: 'Comptes & packs', to: '/particuliers' },
      { label: 'Cartes bancaires', to: '/cartes' },
      { label: 'Crédits & simulateurs', to: '/credits' },
      { label: 'Épargne & placements', to: '/particuliers#epargne' },
      { label: 'Devenir client', to: '/devenir-client' },
    ],
  },
  {
    title: 'Entreprises',
    links: [
      { label: 'PME & Professionnels', to: '/entreprises' },
      { label: 'Financement', to: '/entreprises#financement' },
      { label: 'Commerce international', to: '/entreprises#international' },
      { label: 'Cash management', to: '/entreprises#cash' },
    ],
  },
  {
    title: 'La Banque',
    links: [
      { label: 'Qui sommes-nous', to: '/banque' },
      { label: 'Fondation BIAT', to: '/banque#fondation' },
      { label: 'Nos agences', to: '/agences' },
      { label: 'Aide & contact', to: '/contact' },
      { label: 'Démo MyBIAT', to: '/mybiat' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-300">
              La première banque de Tunisie depuis 1976. 205 agences, une application saluée par plus
              d’un million de clients, et des équipes engagées dans les 24 gouvernorats.
            </p>
            <div className="mt-6 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 p-2.5 transition-colors hover:border-white/40 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white">{c.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-navy-300">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mint-500" /> Connexions chiffrées & 3-D Secure
            </span>
            <span className="inline-flex items-center gap-2">
              <Landmark className="h-4 w-4 text-navy-400" /> Établissement agréé par la Banque Centrale de Tunisie
            </span>
            <span className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-navy-400" /> MyBIAT sur iOS & Android
            </span>
          </div>
          <p className="text-xs text-navy-400">
            © 2026 BIAT — Concept de refonte non officiel, à but de démonstration. Données fictives.
          </p>
        </div>
      </Container>
    </footer>
  )
}
