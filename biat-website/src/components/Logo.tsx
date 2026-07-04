import { cn } from '../lib/format'

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 select-none', className)}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="14" fill={light ? '#ffffff' : '#04295c'} />
        <path
          d="M18 14h14.5c7 0 11.5 3.4 11.5 9.2 0 4-2.2 6.7-5.6 8 4.4 1.2 7.1 4.3 7.1 8.9C45.5 46.7 40.5 50 33 50H18V14zm13.6 14.6c3.4 0 5.4-1.7 5.4-4.6s-2-4.5-5.4-4.5H25v9.1h6.6zm1 15.9c3.7 0 5.9-1.8 5.9-5s-2.2-4.9-5.9-4.9H25v9.9h7.6z"
          fill={light ? '#04295c' : '#ffffff'}
        />
        <circle cx="49" cy="17" r="6" fill="#e8112d" />
      </svg>
      <span className={cn('font-display text-xl font-bold tracking-tight leading-none', light ? 'text-white' : 'text-navy-900')}>
        BIAT
        <span className={cn('block text-[0.55rem] font-sans font-medium tracking-[0.14em] uppercase', light ? 'text-navy-200' : 'text-navy-500')}>
          Banque Internationale Arabe de Tunisie
        </span>
      </span>
    </span>
  )
}
