"use client";

import { useRef } from "react";

export type CardVariant = "classic" | "gold" | "platinum" | "elite" | "jeune";

const VARIANTS: Record<
  CardVariant,
  { bg: string; label: string; network: "visa" | "mastercard"; text: string; chipTone: string }
> = {
  classic: {
    bg: "linear-gradient(135deg, #1450e1 0%, #1742b6 45%, #142657 100%)",
    label: "CLASSIC",
    network: "visa",
    text: "#ffffff",
    chipTone: "#e8c877",
  },
  gold: {
    bg: "linear-gradient(135deg, #f3d98b 0%, #d4a941 40%, #9a7220 100%)",
    label: "GOLD",
    network: "mastercard",
    text: "#2b2103",
    chipTone: "#fdf3d7",
  },
  platinum: {
    bg: "linear-gradient(135deg, #e8ecf3 0%, #b8c2d4 45%, #7d8aa3 100%)",
    label: "PLATINUM",
    network: "visa",
    text: "#1c2536",
    chipTone: "#f5f7fb",
  },
  elite: {
    bg: "linear-gradient(140deg, #20242e 0%, #0c0e14 55%, #23283a 100%)",
    label: "WORLD ELITE",
    network: "mastercard",
    text: "#ffffff",
    chipTone: "#d4a941",
  },
  jeune: {
    bg: "linear-gradient(135deg, #3388ff 0%, #1a66f5 45%, #f39200 135%)",
    label: "CHABEB",
    network: "visa",
    text: "#ffffff",
    chipTone: "#e8c877",
  },
};

function NetworkMark({ network, tone }: { network: "visa" | "mastercard"; tone: string }) {
  if (network === "mastercard") {
    return (
      <svg viewBox="0 0 48 30" className="h-[7.5cqw] w-auto" aria-hidden>
        <circle cx="18" cy="15" r="13" fill="#EB001B" opacity="0.92" />
        <circle cx="30" cy="15" r="13" fill="#F79E1B" opacity="0.92" />
        <path d="M24 4.6a13 13 0 010 20.8 13 13 0 010-20.8z" fill="#FF5F00" />
      </svg>
    );
  }
  return (
    <span className="text-[5.2cqw] font-extrabold italic tracking-tight" style={{ color: tone }}>
      VISA
    </span>
  );
}

/**
 * Pure CSS/SVG render of a BIAT bank card with pointer-tracking 3D tilt.
 * All type/spacing uses container-query units (cqw) so the card scales
 * crisply from a 200px picker tile to a full hero render — no images.
 */
export default function BankCard({
  variant = "classic",
  holder = "AHMED BEN SALAH",
  tilt = true,
  className = "",
}: {
  variant?: CardVariant;
  holder?: string;
  tilt?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const v = VARIANTS[variant];

  const onMove = (e: React.PointerEvent) => {
    if (!tilt || !ref.current || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  // The outer div declares the size container: cqw units on the inner card
  // resolve against it. (cqw on the container's own padding/radius would
  // fall back to the viewport — see CSS containment spec.)
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`card-3d relative w-full max-w-sm select-none ${className}`}
      style={{ containerType: "inline-size" }}
      role="img"
      aria-label={`Carte BIAT ${v.label}`}
    >
      <div
        className="card-shine relative aspect-[1.586] w-full rounded-[4.5cqw] p-[5.2cqw] shadow-2xl"
        style={{ background: v.bg, color: v.text }}
      >
      {/* top row: logo + contactless */}
      <div className="flex items-start justify-between">
        <div className="leading-none">
          <span className="text-[5.6cqw] font-extrabold tracking-[0.08em]">BIAT</span>
          <span className="mt-[1cqw] block text-[2.3cqw] font-semibold uppercase tracking-[0.18em] opacity-80">
            {v.label}
          </span>
        </div>
        <svg viewBox="0 0 24 24" className="h-[6.3cqw] w-[6.3cqw] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M6.5 8.5a8 8 0 010 7" />
          <path d="M9.8 6.8a12 12 0 010 10.4" />
          <path d="M13.1 5.1a16 16 0 010 13.8" />
        </svg>
      </div>

      {/* chip */}
      <div
        className="mt-[5cqw] h-[8.3cqw] w-[11.5cqw] rounded-[1.6cqw] border border-black/20"
        style={{
          background: `linear-gradient(135deg, ${v.chipTone}, ${v.chipTone}cc)`,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 -6px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div className="mx-auto mt-[2.4cqw] h-px w-[7.3cqw] bg-black/25" />
        <div className="mx-auto mt-[1.3cqw] h-px w-[7.3cqw] bg-black/25" />
      </div>

      {/* number */}
      <p className="tnum mt-[4cqw] text-[4.7cqw] font-semibold tracking-[0.18em] drop-shadow-sm">
        5412&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;7526
      </p>

      {/* bottom row */}
      <div className="absolute inset-x-[5.2cqw] bottom-[5.2cqw] flex items-end justify-between">
        <div>
          <p className="text-[2.3cqw] uppercase tracking-widest opacity-70">Titulaire</p>
          <p className="mt-[0.6cqw] text-[3.1cqw] font-bold tracking-widest">{holder}</p>
        </div>
        <NetworkMark network={v.network} tone={v.text} />
      </div>
      </div>
    </div>
  );
}
