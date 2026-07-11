import { describe, expect, it } from "vitest";

import { authContent } from "@/lib/auth/content";
import { validateLogin, validateRegister } from "@/lib/auth/validation";

const v = authContent.validation;

describe("email validation", () => {
  it("requires an email", () => {
    expect(validateLogin({ email: "", password: "x" })?.email).toBe(
      v.emailRequired,
    );
  });

  it("rejects a malformed email", () => {
    expect(validateLogin({ email: "not-an-email", password: "x" })?.email).toBe(
      v.emailInvalid,
    );
    expect(validateLogin({ email: "a@b", password: "x" })?.email).toBe(
      v.emailInvalid,
    );
  });

  it("accepts a well-formed email", () => {
    expect(validateLogin({ email: "user@example.fr", password: "x" })?.email).toBeUndefined();
  });
});

describe("password validation (registration rules)", () => {
  const base = { email: "user@example.fr", confirmPassword: "" };

  const cases: Array<[string, string]> = [
    ["short1A", v.passwordMin], // 7 chars
    ["alllowercase1", v.passwordUppercase],
    ["ALLUPPERCASE1", v.passwordLowercase],
    ["NoDigitsHere", v.passwordNumber],
  ];

  it.each(cases)("rejects %s with the right message", (password, message) => {
    const errors = validateRegister({
      ...base,
      password,
      confirmPassword: password,
    });
    expect(errors?.password).toBe(message);
  });

  it("accepts a password meeting all rules", () => {
    const errors = validateRegister({
      email: "user@example.fr",
      password: "ValidPass1",
      confirmPassword: "ValidPass1",
    });
    expect(errors).toBeNull();
  });
});

describe("password confirmation", () => {
  it("flags a mismatch on the confirm field", () => {
    const errors = validateRegister({
      email: "user@example.fr",
      password: "ValidPass1",
      confirmPassword: "Different1",
    });
    expect(errors?.confirmPassword).toBe(v.confirmMismatch);
  });

  it("requires the confirmation field", () => {
    const errors = validateRegister({
      email: "user@example.fr",
      password: "ValidPass1",
      confirmPassword: "",
    });
    expect(errors?.confirmPassword).toBe(v.confirmRequired);
  });
});

describe("login validation", () => {
  it("does not enforce password composition on login (only presence)", () => {
    // Login must accept any existing password, even a weak legacy one.
    expect(validateLogin({ email: "user@example.fr", password: "abc" })).toBeNull();
  });

  it("requires a password", () => {
    expect(
      validateLogin({ email: "user@example.fr", password: "" })?.password,
    ).toBe(v.passwordRequired);
  });
});
