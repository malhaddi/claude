"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * En-tête global. Client Component uniquement parce que l'état « lien actif »
 * dépend de usePathname() — même compromis que la sidebar du Content Hub.
 */
const navLinks = [
  { href: "/coachs", label: "Trouver un coach" },
  { href: "/messages", label: "Messages" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/coachs" className="flex items-center gap-2 font-semibold">
          <Dumbbell className="size-5" aria-hidden />
          CoachMatch
        </Link>

        <nav className="flex flex-1 items-center gap-1 text-sm">
          {navLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/connexion">Connexion</Link>
          </Button>
          {/* CTA côté offre : recruter des coachs est aussi vital que des clients. */}
          <Button size="sm" asChild>
            <Link href="/inscription">Devenir coach</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
