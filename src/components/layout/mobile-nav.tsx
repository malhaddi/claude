"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/navigation";

/**
 * Horizontally scrollable nav shown on small screens where the fixed
 * sidebar is hidden.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border flex gap-1 overflow-x-auto border-b px-3 py-2 md:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="size-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
