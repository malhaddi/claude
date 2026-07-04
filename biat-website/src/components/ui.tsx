import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../lib/format'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>{children}</div>
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        'mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]',
        light ? 'text-navy-300' : 'text-navy-600',
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
      {children}
    </p>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  lede,
  light = false,
  center = false,
}: {
  eyebrow?: string
  title: string
  lede?: string
  light?: boolean
  center?: boolean
}) {
  return (
    <Reveal className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl',
          light ? 'text-white' : 'text-navy-950',
        )}
      >
        {title}
      </h2>
      {lede && (
        <p className={cn('mt-4 text-lg leading-relaxed', light ? 'text-navy-200' : 'text-navy-950/65')}>{lede}</p>
      )}
    </Reveal>
  )
}

type ButtonProps = {
  to?: string
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'flame' | 'outline' | 'ghost' | 'white'
  size?: 'md' | 'lg' | 'sm'
  className?: string
  arrow?: boolean
  type?: 'button' | 'submit'
}

export function Button({ to, href, onClick, children, variant = 'primary', size = 'md', className, arrow, type = 'button' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 active:scale-[0.98]'
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-700 shadow-card hover:shadow-lift',
    flame: 'bg-flame-500 text-white hover:bg-flame-600 shadow-card hover:shadow-lift',
    outline: 'border border-navy-900/20 text-navy-900 hover:border-navy-900 hover:bg-navy-50',
    ghost: 'text-navy-700 hover:bg-navy-50',
    white: 'bg-white text-navy-900 hover:bg-navy-100 shadow-card hover:shadow-lift',
  }
  const cls = cn(base, sizes[size], variants[variant], className)
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </>
  )
  if (to) return <Link to={to} className={cn(cls, 'group')}>{content}</Link>
  if (href) return <a href={href} className={cn(cls, 'group')}>{content}</a>
  return (
    <button type={type} onClick={onClick} className={cn(cls, 'group')}>
      {content}
    </button>
  )
}

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-navy-700/40 blur-3xl" />
        <div className="absolute -bottom-40 right-[-8rem] h-96 w-96 rounded-full bg-navy-600/25 blur-3xl" />
      </div>
      <Container className="relative py-16 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200">{lede}</p>}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </Container>
    </section>
  )
}

export function Chip({ children, tone = 'navy' }: { children: ReactNode; tone?: 'navy' | 'flame' | 'mint' | 'gold' }) {
  const tones = {
    navy: 'bg-navy-100 text-navy-800',
    flame: 'bg-flame-100 text-flame-600',
    mint: 'bg-mint-100 text-mint-600',
    gold: 'bg-gold-300/30 text-[#8a6516]',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  )
}
