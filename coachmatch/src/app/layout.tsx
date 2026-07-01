import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CoachMatch — Trouvez le coach sportif qu'il vous faut",
    template: "%s · CoachMatch",
  },
  description:
    "Annuaire intelligent de coachs sportifs : force, hybride, bodybuilding — en ligne ou en salle. Comparez les profils, les tarifs et contactez directement.",
};

/**
 * Layout racine (Server Component) : chrome global uniquement — en-tête de
 * navigation + <main> + pied de page. Tout l'état interactif vit plus bas,
 * dans les composants "use client" qui en ont réellement besoin.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="text-muted-foreground border-t px-4 py-6 text-center text-xs">
          CoachMatch — MVP itération 1 · données de démonstration
        </footer>
      </body>
    </html>
  );
}
