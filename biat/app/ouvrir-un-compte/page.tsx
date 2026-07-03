import type { Metadata } from "next";
import OpenAccountFlow from "@/components/OpenAccountFlow";

export const metadata: Metadata = {
  title: "Ouvrir un compte en ligne",
  description:
    "Ouvrez votre compte BIAT 100 % en ligne en 10 minutes : choisissez votre offre, saisissez vos informations, recevez votre RIB immédiatement.",
};

export default function OuvrirUnComptePage() {
  return <OpenAccountFlow />;
}
