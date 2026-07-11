"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { signUp, type AuthActionState } from "@/lib/auth/actions";
import { authContent } from "@/lib/auth/content";
import { validateRegister, type FieldErrors } from "@/lib/auth/validation";

const c = authContent;

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<
    AuthActionState,
    FormData
  >(signUp, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const errors = validateRegister({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    });
    if (errors) {
      event.preventDefault();
      setClientErrors(errors);
      return;
    }
    setClientErrors({});
  }

  const errorFor = (field: string) =>
    clientErrors[field] ?? state.fieldErrors?.[field];

  // Confirmation email sent: replace the form with an inbox message.
  if (state.needsConfirmation) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
      >
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <MailCheck className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-base font-semibold text-slate-900">
          {c.register.checkInboxTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{c.register.checkInboxBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
      {state.formError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.formError}
        </div>
      ) : null}

      <AuthField
        id="email"
        name="email"
        label={c.shared.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={c.shared.emailPlaceholder}
        error={errorFor("email")}
      />

      <PasswordInput
        id="password"
        name="password"
        label={c.shared.passwordLabel}
        autoComplete="new-password"
        hint={c.register.passwordHint}
        error={errorFor("password")}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label={c.register.confirmLabel}
        autoComplete="new-password"
        error={errorFor("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? c.register.submitting : c.register.submit}
      </button>
    </form>
  );
}

export function RegisterFooter() {
  return (
    <>
      {c.register.hasAccount}{" "}
      <Link
        href="/connexion"
        className="font-semibold text-indigo-600 hover:text-indigo-500"
      >
        {c.register.hasAccountCta}
      </Link>
    </>
  );
}
