import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, IdCard, PackageCheck, PartyPopper, UserRound } from 'lucide-react'
import { Button, Container } from '../components/ui'
import { packs } from '../data/products'
import { cn } from '../lib/format'

const steps = [
  { icon: UserRound, label: 'Identité' },
  { icon: IdCard, label: 'Coordonnées' },
  { icon: PackageCheck, label: 'Votre pack' },
  { icon: PartyPopper, label: 'Confirmation' },
]

interface FormState {
  firstName: string
  lastName: string
  cin: string
  birthDate: string
  phone: string
  email: string
  city: string
  pack: string
}

const initial: FormState = {
  firstName: '',
  lastName: '',
  cin: '',
  birthDate: '',
  phone: '',
  email: '',
  city: '',
  pack: 'Pack Sérénité',
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-950/70">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl bg-sand-50 px-4 py-3 text-sm outline-none ring-1 ring-navy-950/10 placeholder:text-navy-950/35 focus:ring-2 focus:ring-navy-500'

export function DevenirClient() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initial)
  const [done, setDone] = useState(false)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const canNext =
    step === 0
      ? form.firstName.trim() && form.lastName.trim() && form.cin.trim().length >= 8 && form.birthDate
      : step === 1
        ? form.phone.trim().length >= 8 && /\S+@\S+\.\S+/.test(form.email) && form.city.trim()
        : true

  return (
    <section className="bg-sand-50 py-14 sm:py-20 min-h-[70vh]">
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-600">Devenir client</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Votre compte BIAT en 8 minutes.
          </h1>
          <p className="mt-3 text-navy-950/60">
            Munissez-vous simplement de votre CIN. La signature finale se fait en agence ou en visio.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    i < step || done
                      ? 'bg-mint-500 text-white'
                      : i === step
                        ? 'bg-navy-900 text-white shadow-card'
                        : 'bg-white text-navy-950/40 ring-1 ring-navy-950/10',
                  )}
                >
                  {i < step || done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </span>
                <span className={cn('text-[0.65rem] font-semibold', i === step && !done ? 'text-navy-900' : 'text-navy-950/45')}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <span className={cn('mb-5 h-px w-6 sm:w-14', i < step ? 'bg-mint-500' : 'bg-navy-950/15')} />}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-lift ring-1 ring-navy-950/6 sm:p-9">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-100 text-mint-600">
                  <PartyPopper className="h-8 w-8" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-navy-950">
                  Bienvenue à la BIAT, {form.firstName} !
                </h2>
                <p className="mx-auto mt-3 max-w-md text-navy-950/65">
                  Votre demande <span className="font-bold text-navy-900">n° BIAT-2026-18452</span> est enregistrée
                  avec le {form.pack}. Un conseiller de l’agence de {form.city || 'votre ville'} vous appellera
                  sous 24 h pour finaliser la signature.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-4">
                  <Button to="/mybiat" variant="flame" arrow>Découvrir MyBIAT en attendant</Button>
                  <Button to="/" variant="outline">Retour à l’accueil</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Prénom">
                      <input className={inputCls} placeholder="Ahmed" value={form.firstName} onChange={set('firstName')} />
                    </Field>
                    <Field label="Nom">
                      <input className={inputCls} placeholder="Ben Salah" value={form.lastName} onChange={set('lastName')} />
                    </Field>
                    <Field label="N° CIN (8 chiffres)">
                      <input className={inputCls} placeholder="01234567" maxLength={8} value={form.cin} onChange={set('cin')} />
                    </Field>
                    <Field label="Date de naissance">
                      <input type="date" className={inputCls} value={form.birthDate} onChange={set('birthDate')} />
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Téléphone mobile">
                      <input className={inputCls} placeholder="98 123 456" value={form.phone} onChange={set('phone')} />
                    </Field>
                    <Field label="Email">
                      <input type="email" className={inputCls} placeholder="vous@exemple.tn" value={form.email} onChange={set('email')} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Ville de résidence">
                        <input className={inputCls} placeholder="Tunis, Sfax, Sousse…" value={form.city} onChange={set('city')} />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {packs.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setForm((f) => ({ ...f, pack: p.name }))}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left ring-2 transition-all',
                          form.pack === p.name
                            ? 'bg-navy-50 ring-navy-700'
                            : 'bg-white ring-navy-950/8 hover:ring-navy-300',
                        )}
                        aria-pressed={form.pack === p.name}
                      >
                        <div>
                          <p className="font-display font-bold text-navy-950">{p.name}</p>
                          <p className="mt-0.5 text-sm text-navy-950/55">{p.audience}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="tnum font-bold text-navy-900">{p.price}</span>
                          <span
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                              form.pack === p.name ? 'bg-navy-900 text-white' : 'ring-1 ring-navy-950/20',
                            )}
                          >
                            {form.pack === p.name && <Check className="h-4 w-4" />}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy-950">Vérifiez vos informations</h2>
                    <dl className="mt-5 space-y-3 rounded-2xl bg-sand-50 p-6 text-sm">
                      {[
                        ['Nom complet', `${form.firstName} ${form.lastName}`],
                        ['CIN', form.cin],
                        ['Naissance', form.birthDate],
                        ['Téléphone', form.phone],
                        ['Email', form.email],
                        ['Ville', form.city],
                        ['Pack choisi', form.pack],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-6">
                          <dt className="text-navy-950/50">{k}</dt>
                          <dd className="font-semibold text-navy-950 text-right">{v || '—'}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-xs leading-relaxed text-navy-950/45">
                      En confirmant, vous acceptez que la BIAT traite ces données pour l’étude de votre demande,
                      conformément à la loi n° 2004-63 sur la protection des données personnelles.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} className={step === 0 ? 'invisible' : ''}>
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </Button>
                  {step < 3 ? (
                    <Button
                      variant="primary"
                      onClick={() => canNext && setStep((s) => s + 1)}
                      className={!canNext ? 'opacity-40 pointer-events-none' : ''}
                    >
                      Continuer <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="flame" onClick={() => setDone(true)}>
                      Confirmer ma demande <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
