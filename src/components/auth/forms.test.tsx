import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The forms only need a reference to the server actions to render; stub them.
vi.mock("@/lib/auth/actions", () => ({
  signIn: (state: unknown) => state,
  signUp: (state: unknown) => state,
}));

// Render next/link as a plain anchor so we can assert destinations.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

import {
  LoginFooter,
  LoginForm,
} from "@/app/connexion/login-form";
import {
  RegisterFooter,
  RegisterForm,
} from "@/app/inscription/register-form";
import { authContent } from "@/lib/auth/content";

describe("LoginForm rendering", () => {
  const html = renderToStaticMarkup(<LoginForm />);

  it("renders email and password fields", () => {
    expect(html).toContain(authContent.shared.emailLabel);
    expect(html).toContain(authContent.shared.passwordLabel);
    expect(html).toContain('name="email"');
    expect(html).toContain('name="password"');
  });

  it("renders the submit button and password visibility toggle", () => {
    expect(html).toContain(authContent.login.submit);
    expect(html).toContain(authContent.shared.showPassword);
  });

  it("starts with the password hidden (type=password)", () => {
    expect(html).toContain('type="password"');
  });

  it("links to registration in the footer", () => {
    expect(renderToStaticMarkup(<LoginFooter />)).toContain('href="/inscription"');
  });
});

describe("RegisterForm rendering", () => {
  const html = renderToStaticMarkup(<RegisterForm />);

  it("renders email, password and confirmation fields", () => {
    expect(html).toContain(authContent.shared.emailLabel);
    expect(html).toContain(authContent.shared.passwordLabel);
    expect(html).toContain(authContent.register.confirmLabel);
    expect(html).toContain('name="confirmPassword"');
  });

  it("shows the password rules hint", () => {
    expect(html).toContain(authContent.register.passwordHint);
  });

  it("renders the submit button", () => {
    expect(html).toContain(authContent.register.submit);
  });

  it("links to login in the footer", () => {
    expect(renderToStaticMarkup(<RegisterFooter />)).toContain('href="/connexion"');
  });
});
