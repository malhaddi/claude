import { GraduationCap, HeartHandshake, Palette, Rocket } from 'lucide-react'
import { Button, Container, Eyebrow, PageHero, Reveal, SectionTitle } from '../components/ui'
import { stats } from '../data/news'

const timeline = [
  { year: '1976', title: 'Naissance d’une ambition', desc: 'La BIAT est fondée à Tunis par un groupe d’entrepreneurs tunisiens visionnaires.' },
  { year: '1990', title: 'Le réseau s’étend', desc: 'La banque couvre les 24 gouvernorats et devient un acteur incontournable du financement des PME.' },
  { year: '2000', title: 'Leadership confirmé', desc: 'La BIAT devient la première banque privée du pays par le total du bilan.' },
  { year: '2014', title: 'La Fondation BIAT', desc: 'Création de la Fondation pour la jeunesse, l’éducation et le développement régional.' },
  { year: '2020', title: 'Accélération digitale', desc: 'Lancement de MyBIAT : la banque au quotidien passe dans la poche des Tunisiens.' },
  { year: '2026', title: 'La banque réinventée', desc: 'Nouvelle plateforme digitale, paiement mobile généralisé et engagement durable renforcé.' },
]

const fondation = [
  { icon: GraduationCap, title: 'Éducation', desc: '120 bourses d’excellence par an pour les bacheliers des régions de l’intérieur.' },
  { icon: Rocket, title: 'Entrepreneuriat', desc: 'Incubation et financement d’amorçage pour les startups tunisiennes.' },
  { icon: Palette, title: 'Culture', desc: 'Soutien aux festivals, aux artistes émergents et au patrimoine tunisien.' },
]

export function Banque() {
  return (
    <>
      <PageHero
        eyebrow="La Banque"
        title="48 ans au service de la Tunisie. Et ce n’est que le début."
        lede="Première banque du pays par le bilan, le réseau et — surtout — la confiance de plus d’un million de clients. Voici notre histoire, et la façon dont nous la mettons au service de la vôtre."
      />

      {/* Stats */}
      <section className="py-16">
        <Container className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="rounded-3xl bg-sand-50 p-7 text-center shadow-card ring-1 ring-navy-950/5">
                <p className="font-display text-4xl font-bold text-navy-900">{s.value}</p>
                <p className="mt-2 text-sm leading-snug text-navy-950/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <SectionTitle eyebrow="Notre histoire" title="De 1976 à aujourd’hui" />
          <div className="relative mt-12">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-navy-200 sm:left-1/2" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.05}>
                  <div className={`relative flex gap-6 sm:w-1/2 ${i % 2 ? 'sm:ml-auto sm:pl-10' : 'sm:pr-10 sm:text-right sm:flex-row-reverse'}`}>
                    <span className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-flame-500 bg-white sm:left-auto ${i % 2 ? 'sm:-left-[7.5px]' : 'sm:-right-[7.5px]'}`} />
                    <div className="pl-8 sm:pl-0">
                      <p className="font-display text-xl font-bold text-flame-500">{t.year}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-navy-950">{t.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy-950/60">{t.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Fondation */}
      <section id="fondation" className="scroll-mt-28 py-20 sm:py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow>Fondation BIAT</Eyebrow>
              <h2 className="font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
                Une banque n’est grande que si elle fait grandir son pays.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-navy-950/65">
                Depuis 2014, la Fondation BIAT investit dans la jeunesse tunisienne : éducation,
                entrepreneuriat et culture, avec une priorité assumée pour les régions de l’intérieur.
              </p>
              <Button to="/contact" variant="outline" className="mt-7" arrow>Proposer un partenariat</Button>
            </div>
            <div className="space-y-4">
              {fondation.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.07}>
                  <div className="flex gap-5 rounded-3xl bg-navy-900 p-6 text-white">
                    <span className="h-fit rounded-2xl bg-white/10 p-3 text-flame-400">
                      <f.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{f.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy-200">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-sand-50 p-8 ring-1 ring-navy-950/5 sm:flex-row sm:items-center sm:p-10">
              <div className="flex items-start gap-5">
                <span className="rounded-2xl bg-flame-100 p-3 text-flame-600">
                  <HeartHandshake className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy-950">Envie de construire avec nous ?</h3>
                  <p className="mt-1 text-sm text-navy-950/60">Rejoignez les équipes de la première banque du pays.</p>
                </div>
              </div>
              <Button to="/contact" variant="primary" arrow>Nous rejoindre</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
