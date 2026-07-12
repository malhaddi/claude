import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { StatusBanner } from "@/components/auth/status-banner";
import { authContent } from "@/lib/auth/content";
import { getConfirmedUser } from "@/lib/auth/dal";
import { LoginFooter, LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Only a confirmed user is "logged in"; unconfirmed users see the form.
  if (await getConfirmedUser()) redirect("/dashboard");

  const { status } = await searchParams;
  const notice =
    status === "email_non_confirme"
      ? { text: authContent.notices.emailNotConfirmed, variant: "info" as const }
      : status === "confirmation_invalide"
        ? {
            text: authContent.notices.confirmationInvalid,
            variant: "error" as const,
          }
        : null;

  return (
    <AuthShell
      title={authContent.login.title}
      subtitle={authContent.login.subtitle}
      footer={<LoginFooter />}
    >
      {notice ? (
        <StatusBanner text={notice.text} variant={notice.variant} />
      ) : null}
      <LoginForm />
    </AuthShell>
  );
}
