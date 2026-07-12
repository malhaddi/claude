import { describe, expect, it } from "vitest";

import { authContent } from "@/lib/auth/content";
import { isEmailEnumerationError, mapAuthError } from "@/lib/auth/errors";

const e = authContent.errors;

describe("mapAuthError", () => {
  it("maps invalid credentials", () => {
    expect(mapAuthError({ code: "invalid_credentials" })).toBe(
      e.invalidCredentials,
    );
  });

  it("maps unconfirmed email", () => {
    expect(mapAuthError({ code: "email_not_confirmed" })).toBe(
      e.emailNotConfirmed,
    );
  });

  it("does NOT reveal an already-registered email — maps to generic", () => {
    // Enumeration-safety: mapAuthError must not surface a distinct message.
    expect(mapAuthError({ code: "user_already_exists" })).toBe(e.generic);
    expect(mapAuthError({ message: "User already registered" })).toBe(
      e.generic,
    );
  });

  it("flags enumeration-class errors so the sign-up flow can neutralize them", () => {
    expect(isEmailEnumerationError({ code: "user_already_exists" })).toBe(true);
    expect(isEmailEnumerationError({ code: "email_exists" })).toBe(true);
    expect(
      isEmailEnumerationError({ message: "User already registered" }),
    ).toBe(true);
    expect(isEmailEnumerationError({ code: "invalid_credentials" })).toBe(false);
    expect(isEmailEnumerationError(null)).toBe(false);
  });

  it("maps a weak password", () => {
    expect(mapAuthError({ code: "weak_password" })).toBe(e.weakPassword);
  });

  it("maps rate limiting by status and by code", () => {
    expect(mapAuthError({ status: 429 })).toBe(e.rateLimited);
    expect(mapAuthError({ code: "over_request_rate_limit" })).toBe(
      e.rateLimited,
    );
  });

  it("falls back to a generic message for unknown errors", () => {
    expect(mapAuthError({ code: "some_unknown_code" })).toBe(e.generic);
    expect(mapAuthError(null)).toBe(e.generic);
    expect(mapAuthError(undefined)).toBe(e.generic);
  });

  it("never leaks a raw Supabase message to the user", () => {
    const raw = "PostgREST: relation auth.users does not exist (secret detail)";
    const mapped = mapAuthError({ code: "weird", message: raw });
    expect(mapped).not.toContain("PostgREST");
    expect(mapped).not.toBe(raw);
    // The returned string is always one of our curated French messages.
    expect(Object.values(e)).toContain(mapped);
  });
});
