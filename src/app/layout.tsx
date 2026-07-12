import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import { siteDescription, siteName, siteTagline } from "@/lib/content";
import { env } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteName} — Pages de prévente françaises pour trafic payant`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteTagline,
    url: "/",
    siteName,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} antialiased`}>
      <head>
        {/* Without JS, scroll-reveal elements can never receive their
            data-visible flag — force them fully visible so no content is
            hidden. Motion-safe hiding lives in globals.css. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="bg-white font-sans text-slate-900">{children}</body>
    </html>
  );
}
