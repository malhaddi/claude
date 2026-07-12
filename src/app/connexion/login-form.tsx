"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { signIn, type AuthActionState } from "@/lib/auth/actions";
import { authContent } from "@/lib/auth/content";
import { validateLogin, type FieldErrors } from "@/lib/auth/validation";

const c = authContent;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    AuthActionState,
    FormData
  >(signIn, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const errors = validateLogin({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
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
        autoComplete="current-password"
        error={errorFor("password")}
      />

      <SubmitButton
        pending={isPending}
        idleLabel={c.login.submit}
        pendingLabel={c.login.submitting}
        className="w-full"
      />
    </form>
  );
}

export function LoginFooter() {
  return (
    <>
      {c.login.noAccount}{" "}
      <Link
        href="/inscription"
        className="font-semibold text-indigo-600 hover:text-indigo-500"
      >
        {c.login.noAccountCta}
      </Link>
    </>
  );
}
