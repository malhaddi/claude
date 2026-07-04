import { useState } from 'react'
import { categorySpending, monthlySpending } from './store'
import { tnd, tndShort } from '../lib/format'

/**
 * Colonnes des dépenses mensuelles — série unique.
 * Marques : ≤24px, extrémité arrondie 4px côté données, base carrée.
 * Mois courant en #0e54ae (7,3:1), mois passés en #4a93e6 (3,2:1) ; tooltip au survol.
 */
export function MonthlySpendingChart() {
  const [hover, setHover] = useState<number | null>(null)
  const W = 460
  const H = 220
  const padL = 44
  const padB = 26
  const padT = 14
  const max = 3000
  const ticks = [0, 1000, 2000, 3000]
  const plotW = W - padL - 8
  const plotH = H - padT - padB
  const band = plotW / monthlySpending.length
  const barW = 22

  const y = (v: number) => padT + plotH - (v / max) * plotH
  const current = monthlySpending.length - 1

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Dépenses mensuelles de janvier à juin 2026">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 8} y1={y(t)} y2={y(t)} stroke="#eceff3" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#6b7688">
              {t === 0 ? '0' : `${t / 1000} k`}
            </text>
          </g>
        ))}
        {monthlySpending.map((m, i) => {
          const cx = padL + band * i + band / 2
          const barY = y(m.value)
          return (
            <g key={m.month}>
              {/* hit target larger than the mark */}
              <rect
                x={padL + band * i}
                y={padT}
                width={band}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <path
                d={`M ${cx - barW / 2} ${padT + plotH}
                    L ${cx - barW / 2} ${barY + 4}
                    Q ${cx - barW / 2} ${barY} ${cx - barW / 2 + 4} ${barY}
                    L ${cx + barW / 2 - 4} ${barY}
                    Q ${cx + barW / 2} ${barY} ${cx + barW / 2} ${barY + 4}
                    L ${cx + barW / 2} ${padT + plotH} Z`}
                fill={i === current ? '#0e54ae' : '#4a93e6'}
                opacity={hover === null || hover === i ? 1 : 0.55}
                style={{ pointerEvents: 'none', transition: 'opacity 120ms' }}
              />
              {i === current && (
                <text x={cx} y={barY - 7} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c2733">
                  {tndShort(m.value)}
                </text>
              )}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#6b7688">
                {m.month}
              </text>
            </g>
          )
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-navy-950 px-3 py-2 text-xs text-white shadow-lift"
          style={{
            left: `${((padL + band * hover + band / 2) / W) * 100}%`,
            top: 0,
          }}
        >
          <p className="font-semibold">{monthlySpending[hover].month} 2026</p>
          <p className="tnum text-navy-200">{tnd(monthlySpending[hover].value)}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Répartition par catégorie — barres nominales, une seule teinte (#0e54ae),
 * l’identité est portée par le libellé, la valeur au bout de la barre.
 */
export function CategoryBreakdown() {
  const max = Math.max(...categorySpending.map((c) => c.value))
  return (
    <div className="space-y-3.5">
      {categorySpending.map((c) => (
        <div key={c.category}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy-950/75">{c.category}</span>
            <span className="tnum text-xs font-semibold text-navy-950/60">{tnd(c.value, { decimals: 0 })}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-navy-50">
            <div
              className="h-3 rounded-full bg-[#0e54ae]"
              style={{ width: `${Math.max(3, (c.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
