import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Connexion",
};

/**
 * Connexion — gabarit statique pour l'itération 1. Le branchement Supabase
 * Auth (supabase.auth.signInWithPassword + éventuel OAuth) se fera dans une
 * Server Action ; le bouton reste désactivé d'ici là pour ne rien promettre
 * que l'app ne tient pas.
 */
export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>
            Accédez à vos demandes et à votre messagerie.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">E-mail</Label>
            <Input id="login-email" type="email" placeholder="vous@exemple.fr" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Mot de passe</Label>
            <Input id="login-password" type="password" />
          </div>
          <Button disabled className="w-full">
            Se connecter — bientôt disponible
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="underline underline-offset-2">
              Créer un profil
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
