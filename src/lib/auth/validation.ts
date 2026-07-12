import { z } from "zod";

import { authContent } from "@/lib/auth/content";

/**
 * Email/password validation shared by the client forms (for immediate
 * feedback) and the server actions (source of truth). French messages come
 * from the centralized auth content.
 *
 * Password rules — enforced consistently, not claimed to be universally
 * "secure": min 8 chars, at least one uppercase, one lowercase, one digit.
 */

const v = authContent.validation;

export const emailSchema = z
  .string()
  .trim()
  .min(1, v.emailRequired)
  // Simple, pragmatic email shape; Supabase performs authoritative checks.
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, v.emailInvalid);

export const passwordSchema = z
  .string()
  .min(1, v.passwordRequired)
  .min(8, v.passwordMin)
  .regex(/[A-Z]/, v.passwordUppercase)
  .regex(/[a-z]/, v.passwordLowercase)
  .regex(/[0-9]/, v.passwordNumber);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, v.passwordRequired),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, v.confirmRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: v.confirmMismatch,
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Field-keyed error messages, or null when valid. */
export type FieldErrors = Record<string, string>;

function firstErrors(
  issues: z.core.$ZodIssue[],
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateLogin(input: {
  email: string;
  password: string;
}): FieldErrors | null {
  const result = loginSchema.safeParse(input);
  return result.success ? null : firstErrors(result.error.issues);
}

export function validateRegister(input: {
  email: string;
  password: string;
  confirmPassword: string;
}): FieldErrors | null {
  const result = registerSchema.safeParse(input);
  return result.success ? null : firstErrors(result.error.issues);
}
