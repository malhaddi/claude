import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowLeftRight, Banknote, Briefcase, Building2, CalendarClock, CreditCard,
  GraduationCap, HeartHandshake, Home as HomeIcon, LineChart, MapPin, PiggyBank, Plane,
  ShieldCheck, Smartphone, Sparkles, Star, Wallet, Zap,
} from 'lucide-react'
import { Button, Chip, Container, Eyebrow, Reveal, SectionTitle } from '../components/ui'
import { BankCard } from '../components/BankCard'
import { PhoneMock } from '../components/PhoneMock'
import { stats, news } from '../data/news'
import { tndShort, monthlyPayment } from '../lib/format'

const fxRates = [
  { pair: 'EUR / TND', rate: '3,4210', delta: '+0,12 %' },
  { pair: 'USD / TND', rate: '2,9485', delta: '−0,05 %' },
  { pair: 'GBP / TND', rate: '3,9860', delta: '+0,08 %' },
]

const quickActions = [
  { icon: Sparkles, label: 'Ouvrir un compte', to: '/devenir-client' },
  { icon: LineChart, label: 'Simuler un crédit', to: '/credits#simulateur' },
  { icon: CreditCard, label: 'Choisir une carte', to: '/cartes' },
  { icon: MapPin, label: 'Trouver une agence', to: '/agences' },
  { icon: Smartphone, label: 'Découvrir MyBIAT', to: '/mybiat' },
  { icon: CalendarClock, label: 'Prendre RDV', to: '/contact' },
]

const bento = [
  {
    icon: Wallet,
    title: 'Comptes & packs',
    desc: 'Du Pack Étudiant gratuit au Pack Excellence : un quotidien bancaire sans friction, pensé pour chaque étape de votre vie.',
    to: '/particuliers',
    cta: 'Comparer les packs',
    big: true,
  },
  { icon: CreditCard, title: 'Cartes', desc: 'De la Carte Jeune à la Visa Infinite, pilotées en temps réel depuis MyBIAT.', to: '/cartes', cta: 'Voir les cartes' },
  { icon: Banknote, title: 'Crédits', desc: 'Immobilier, auto, conso — réponse de principe en 24 h.', to: '/credits', cta: 'Simuler' },
  { icon: PiggyBank, title: 'Épargne', desc: 'Jusqu’à 8,5 % sur vos dépôts à terme. Votre argent travaille.', to: '/particuliers#epargne', cta: 'Faire fructifier' },
]

const segments = [
  { icon: GraduationCap, title: 'Jeunes & Étudiants', desc: 'Compte et carte gratuits jusqu’à 25 ans, app incluse.', to: '/particuliers' },
  { icon: Briefcase, title: 'Professionnels', desc: 'TPE, artisans, professions libérales : un pack pro complet.', to: '/entreprises' },
  { icon: Building2, title: 'Entreprises', desc: 'Financement, trade et cash management à votre échelle.', to: '/entreprises' },
  { icon: Plane, title: 'Tunisiens à l’étranger', desc: 'Gérez vos comptes en Tunisie depuis n’importe où.', to: '/particuliers' },
]

function MiniSimulator() {
  const [amount, setAmount] = useState(150000)
  const [years, setYears] = useState(15)
  const monthly = monthlyPayment(amount, 8.2, years * 12)
  return (
    <div className="rounded-3xl bg-white p-7 shadow-lift ring-1 ring-navy-950/5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-navy-950">Crédit immobilier</h3>
        <Chip tone="mint">8,2 % fixe</Chip>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy-950/60">Montant</span>
            <span className="tnum font-bold text-navy-950">{tndShort(amount)}</span>
          </div>
          <input
            type="range"
            min={20000}
            max={800000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full accent-flame-500"
            aria-label="Montant du crédit"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy-950/60">Durée</span>
            <span className="tnum font-bold text-navy-950">{years} ans</span>
          </div>
          <input
            type="range"
            min={5}
            max={25}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full accent-flame-500"
            aria-label="Durée du crédit"
          />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between rounded-2xl bg-navy-50 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-950/50">Mensualité estimée</p>
          <p className="tnum font-display text-3xl font-bold text-navy-900">{tndShort(monthly)}<span className="text-base font-semibold text-navy-950/50"> /mois</span></p>
        </div>
        <Button to="/credits#simulateur" size="sm" arrow>Affiner</Button>
      </div>
    </div>
  )
}

export function Home() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-navy-700/40 blur-3xl" />
          <div className="absolute -bottom-52 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-navy-600/25 blur-3xl" />
          <div className="absolute right-1/3 top-10 h-40 w-40 rounded-full bg-flame-500/20 blur-3xl" />
        </div>

        <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Eyebrow light>Banque Internationale Arabe de Tunisie</Eyebrow>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                La première banque de Tunisie,
                <span className="text-navy-300"> dans votre poche.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-navy-200">
                Ouvrez votre compte en 8 minutes, pilotez vos cartes en temps réel et faites fructifier
                votre épargne — avec la solidité de la banque qui accompagne les Tunisiens depuis 1976.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button to="/devenir-client" variant="flame" size="lg" arrow>Ouvrir mon compte</Button>
                <Button to="/mybiat" variant="white" size="lg">
                  <Smartphone className="h-5 w-5" /> Essayer MyBIAT
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-300">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold-500 text-gold-500" /> 4,8 sur les stores
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-mint-500" /> Agréée Banque Centrale de Tunisie
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative">
              <BankCard color="black" name="Infinite" network="Visa Infinite" className="absolute -top-6 left-8 rotate-6 opacity-90" tilt={false} />
              <BankCard color="navy" name="Essentielle" network="Visa" className="relative z-10" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-8 -left-2 z-20 rounded-2xl bg-white px-5 py-3.5 text-navy-950 shadow-lift sm:-left-10"
            >
              <p className="text-xs font-semibold text-navy-950/50">Virement instantané reçu</p>
              <p className="tnum font-display text-xl font-bold text-mint-600">+850,000 DT</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="absolute -right-2 top-1/2 z-20 rounded-2xl bg-white px-5 py-3.5 text-navy-950 shadow-lift sm:-right-8"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-navy-950/50">
                <Zap className="h-3.5 w-3.5 text-flame-500" /> Carte verrouillée
              </p>
              <p className="text-sm font-bold">en un geste, depuis l’app</p>
            </motion.div>
          </motion.div>
        </Container>

        {/* Trust bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <Container className="grid grid-cols-2 gap-6 py-7 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-navy-300">{s.label}</p>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* ─── Quick actions + FX ───────────────────────────── */}
      <section className="border-b border-navy-950/6 bg-sand-50">
        <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickActions.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.05}>
                <Link
                  to={a.to}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="rounded-xl bg-navy-100 p-2.5 text-navy-800 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-navy-950/80">{a.label}</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-navy-950">
                  <ArrowLeftRight className="h-4 w-4 text-flame-500" /> Taux de change
                </p>
                <span className="text-[0.65rem] text-navy-950/40">Indicatif — 3 juil. 2026, 8h30</span>
              </div>
              <div className="space-y-2">
                {fxRates.map((r) => (
                  <div key={r.pair} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-950/70">{r.pair}</span>
                    <span className="tnum font-bold text-navy-950">{r.rate}</span>
                    <span className={`tnum text-xs font-semibold ${r.delta.startsWith('+') ? 'text-mint-600' : 'text-flame-600'}`}>{r.delta}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── Bento products ───────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Nos solutions"
            title="Tout ce qu’une grande banque doit vous offrir. En mieux."
            lede="Des produits clairs, des tarifs transparents et une expérience digitale au niveau des meilleures banques du monde."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {bento.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08} className={b.big ? 'md:row-span-2' : ''}>
                <Link
                  to={b.to}
                  className={`group flex h-full flex-col justify-between rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-lift ${
                    b.big
                      ? 'bg-navy-900 text-white shadow-lift'
                      : 'bg-sand-50 text-navy-950 shadow-card ring-1 ring-navy-950/5'
                  }`}
                >
                  <div>
                    <span className={`inline-flex rounded-2xl p-3 ${b.big ? 'bg-white/10 text-white' : 'bg-navy-100 text-navy-800'}`}>
                      <b.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-bold">{b.title}</h3>
                    <p className={`mt-2.5 leading-relaxed ${b.big ? 'text-navy-200' : 'text-navy-950/60'} text-sm`}>{b.desc}</p>
                  </div>
                  <span className={`mt-7 inline-flex items-center gap-2 text-sm font-bold ${b.big ? 'text-white' : 'text-navy-700'} transition-all group-hover:gap-3`}>
                    {b.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                  {b.big && (
                    <div className="mt-8 hidden md:block">
                      <BankCard color="platinum" name="Premium" network="Visa Platinum" tilt={false} className="max-w-[260px]" />
                    </div>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── App showcase (dark) ──────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-navy-700/30 blur-3xl" />
        </div>
        <Container className="relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <PhoneMock />
          </Reveal>
          <div>
            <SectionTitle
              light
              eyebrow="MyBIAT"
              title="Votre banque entière, dans une app que vous allez adorer."
              lede="Virements instantanés, cartes pilotées en temps réel, budget intelligent : MyBIAT met toute la puissance de la BIAT dans votre téléphone."
            />
            <div className="mt-9 space-y-5">
              {[
                { icon: Zap, title: 'Virements instantanés', desc: 'Envoyez de l’argent en quelques secondes, 24/7, vers toutes les banques tunisiennes.' },
                { icon: CreditCard, title: 'Cartes sous contrôle', desc: 'Verrouillez, ajustez les plafonds, activez le e-commerce — sans passer en agence.' },
                { icon: LineChart, title: 'Budget intelligent', desc: 'Vos dépenses classées automatiquement, des alertes avant les dépassements.' },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="flex gap-4">
                    <span className="h-fit rounded-xl bg-white/10 p-2.5 text-flame-400">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-navy-300">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to="/mybiat" variant="white" size="lg" arrow>Lancer la démo interactive</Button>
              <span className="text-sm text-navy-300">Disponible sur iOS & Android</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Simulator ────────────────────────────────────── */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Quel est votre projet ?"
              title="Un logement, une voiture, des études — simulez en 30 secondes."
              lede="Pas de formulaire interminable. Deux curseurs, une mensualité claire, et une réponse de principe en 24 h si vous déposez votre demande."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: HomeIcon, label: 'Immobilier · 8,2 %' },
                { icon: Banknote, label: 'Auto · 9,1 %' },
                { icon: Wallet, label: 'Conso · 10,5 %' },
              ].map((c) => (
                <span key={c.label} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-card">
                  <c.icon className="h-4 w-4 text-flame-500" /> {c.label}
                </span>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <MiniSimulator />
          </Reveal>
        </Container>
      </section>

      {/* ─── Segments ─────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Pour chacun"
            title="Une banque qui parle votre langue, à chaque étape."
            center
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <Link
                  to={s.to}
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="w-fit rounded-2xl bg-navy-100 p-3 text-navy-800 transition-colors group-hover:bg-flame-500 group-hover:text-white">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-950/60">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-700 transition-all group-hover:gap-3">
                    Découvrir <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── News + Fondation ─────────────────────────────── */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow="Actualités" title="Ce qui bouge à la BIAT" />
            <Button to="/banque" variant="outline" size="sm" arrow>Toutes les actualités</Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {news.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.08}>
                <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/5">
                  <div className="flex items-center justify-between">
                    <Chip tone={n.tag === 'Innovation' ? 'navy' : n.tag === 'Engagement' ? 'flame' : 'mint'}>{n.tag}</Chip>
                    <span className="text-xs text-navy-950/40">{n.date}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-navy-950">{n.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-950/60">{n.excerpt}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-navy-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div className="flex items-start gap-5">
                <span className="rounded-2xl bg-white/10 p-3 text-flame-400">
                  <HeartHandshake className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">La Fondation BIAT agit pour la jeunesse tunisienne</h3>
                  <p className="mt-1.5 max-w-xl text-sm text-navy-200">
                    Éducation, culture, entrepreneuriat régional : découvrez les programmes qui font grandir le pays.
                  </p>
                </div>
              </div>
              <Button to="/banque#fondation" variant="white" size="md" arrow>Découvrir</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── Final CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-center text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-56 w-56 rounded-full bg-flame-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-navy-600/30 blur-3xl" />
        </div>
        <Container className="relative">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              Rejoignez le million de Tunisiens qui ont déjà choisi la BIAT.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-navy-200">
              Compte ouvert en 8 minutes. Carte gratuite la première année pour les nouveaux clients.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button to="/devenir-client" variant="flame" size="lg" arrow>Ouvrir mon compte</Button>
              <Button to="/agences" variant="white" size="lg">
                <MapPin className="h-5 w-5" /> Passer en agence
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
