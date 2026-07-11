import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { authContent } from "@/lib/auth/content";
import { getUser } from "@/lib/auth/dal";
import { LoginFooter, LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default async function ConnexionPage() {
  // Defense in depth: the proxy already redirects, but re-check server-side.
  if (await getUser()) redirect("/dashboard");

  return (
    <AuthShell
      title={authContent.login.title}
      subtitle={authContent.login.subtitle}
      footer={<LoginFooter />}
    >
      <LoginForm />
    </AuthShell>
  );
}
