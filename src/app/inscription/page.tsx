import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { authContent } from "@/lib/auth/content";
import { getConfirmedUser } from "@/lib/auth/dal";
import { RegisterFooter, RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false },
};

export default async function InscriptionPage() {
  if (await getConfirmedUser()) redirect("/dashboard");

  return (
    <AuthShell
      title={authContent.register.title}
      subtitle={authContent.register.subtitle}
      footer={<RegisterFooter />}
    >
      <RegisterForm />
    </AuthShell>
  );
}
