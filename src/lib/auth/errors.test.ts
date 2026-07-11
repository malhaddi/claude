import { describe, expect, it } from "vitest";

import { authContent } from "@/lib/auth/content";
import { mapAuthError } from "@/lib/auth/errors";

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

  it("maps an already-registered email (by code and by message)", () => {
    expect(mapAuthError({ code: "user_already_exists" })).toBe(
      e.emailAlreadyRegistered,
    );
    expect(
      mapAuthError({ message: "User already registered" }),
    ).toBe(e.emailAlreadyRegistered);
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
