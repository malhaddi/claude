"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

import { cx } from "@/lib/utils";

/**
 * Reveals its children with a gentle fade + rise when scrolled into view.
 *
 * Accessibility / robustness:
 * - The hidden state lives entirely in CSS behind
 *   `@media (prefers-reduced-motion: no-preference)`, so reduced-motion users
 *   always see content immediately.
 * - A <noscript> override (in the root layout) forces visibility without JS.
 * - Uses opacity/transform only — no layout shift.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the user prefers reduced motion, the CSS already keeps content
    // visible (the hidden state is scoped to `no-preference`), so we just
    // reveal on the next frame without any observer. Same for the (now
    // vanishingly rare) browsers without IntersectionObserver.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cx("reveal", className)}
      data-visible={visible ? "true" : "false"}
      style={delayMs ? { ["--reveal-delay" as string]: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
