import type { Metadata } from "next";
import { Dumbbell, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Inscription",
};

/**
 * Inscription — matérialise les DEUX types de profils du brief. Le rôle
 * choisi ici deviendra profiles.role ('client' | 'coach') à la création du
 * compte Supabase ; un coach enchaînera sur la création de sa fiche
 * (table coaches) puis l'onboarding Stripe Connect (lib/stripe.ts).
 */
export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Créer un compte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Deux profils, deux parcours — choisissez le vôtre.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <UserRound className="text-muted-foreground size-8" aria-hidden />
            <CardTitle>Je cherche un coach</CardTitle>
            <CardDescription>
              Filtrez les profils, envoyez des demandes de coaching et
              échangez en privé avec les coachs qui vous intéressent.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button disabled className="w-full">
              S&apos;inscrire comme utilisateur — bientôt
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Dumbbell className="text-muted-foreground size-8" aria-hidden />
            <CardTitle>Je suis coach</CardTitle>
            <CardDescription>
              Créez votre fiche (spécialités, tarifs, créneaux), recevez des
              demandes qualifiées et encaissez via Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button disabled className="w-full">
              S&apos;inscrire comme coach — bientôt
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
