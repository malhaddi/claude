import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BIAT — Banque Internationale Arabe de Tunisie",
    template: "%s | BIAT",
  },
  description:
    "BIAT, première banque de Tunisie. Comptes, cartes, crédits, épargne et banque digitale MyBIAT — une expérience bancaire moderne, simple et sécurisée.",
  keywords: [
    "BIAT",
    "banque Tunisie",
    "compte bancaire",
    "carte bancaire",
    "crédit",
    "épargne",
    "MyBIAT",
  ],
  openGraph: {
    title: "BIAT — Banque Internationale Arabe de Tunisie",
    description:
      "La première banque de Tunisie. Ouvrez votre compte en ligne en 10 minutes.",
    locale: "fr_TN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#071230",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans bg-white text-slate-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
