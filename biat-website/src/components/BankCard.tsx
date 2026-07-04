import { motion } from 'framer-motion'
import { cn } from '../lib/format'

const palettes = {
  navy: {
    bg: 'linear-gradient(135deg, #0a428c 0%, #04295c 55%, #041832 100%)',
    text: 'text-white',
    sub: 'text-navy-200',
  },
  platinum: {
    bg: 'linear-gradient(135deg, #e8eaee 0%, #c3c9d4 45%, #9aa3b5 100%)',
    text: 'text-navy-950',
    sub: 'text-navy-800/70',
  },
  black: {
    bg: 'linear-gradient(135deg, #2a2d34 0%, #131519 60%, #000 100%)',
    text: 'text-white',
    sub: 'text-white/50',
  },
  coral: {
    bg: 'linear-gradient(135deg, #f4425a 0%, #e8112d 55%, #9c0a1e 100%)',
    text: 'text-white',
    sub: 'text-white/70',
  },
} as const

export function BankCard({
  color,
  name,
  network,
  holder = 'AHMED BEN SALAH',
  number = '5412 •••• •••• 7890',
  className,
  tilt = true,
}: {
  color: keyof typeof palettes
  name: string
  network: string
  holder?: string
  number?: string
  className?: string
  tilt?: boolean
}) {
  const p = palettes[color]
  return (
    <motion.div
      whileHover={tilt ? { rotateX: -6, rotateY: 8, y: -6, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800, background: p.bg }}
      className={cn(
        'relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-2xl p-5 shadow-lift select-none',
        p.text,
        className,
      )}
    >
      {/* sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_-10%,rgba(255,255,255,0.25),transparent_45%)]" />
      {/* contactless waves */}
      <svg className="absolute right-5 top-5 h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M6 8.5a9 9 0 0 1 0 7" /><path d="M9.5 6.5a13 13 0 0 1 0 11" /><path d="M13 4.5a17 17 0 0 1 0 15" />
      </svg>

      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-lg font-bold tracking-tight">BIAT</div>
            <div className={cn('text-[0.6rem] font-medium uppercase tracking-[0.16em]', p.sub)}>{name}</div>
          </div>
        </div>

        <div>
          {/* chip */}
          <div className="mb-3 h-7 w-9 rounded-md bg-gradient-to-br from-gold-300 to-gold-500 shadow-inner">
            <div className="mx-auto mt-[9px] h-[1px] w-6 bg-black/20" />
            <div className="mx-auto mt-[4px] h-[1px] w-6 bg-black/20" />
          </div>
          <div className="tnum text-base font-medium tracking-[0.12em]">{number}</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className={cn('text-[0.55rem] uppercase tracking-widest', p.sub)}>Titulaire</div>
              <div className="text-xs font-semibold tracking-wide">{holder}</div>
            </div>
            <div className="text-right">
              <div className={cn('text-[0.6rem] font-semibold uppercase tracking-wider', p.sub)}>{network}</div>
              <div className="flex -space-x-2 justify-end mt-0.5" aria-hidden>
                <span className="h-5 w-5 rounded-full bg-flame-500/90" />
                <span className="h-5 w-5 rounded-full bg-gold-500/90 mix-blend-screen" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
