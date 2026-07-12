import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import { GET } from "./route";

const mockedCreateClient = vi.mocked(createClient);

function mockAuth(methods: Record<string, unknown>) {
  mockedCreateClient.mockResolvedValue({
    auth: methods,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

function req(url: string) {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

beforeEach(() => vi.clearAllMocks());

describe("GET /auth/confirm", () => {
  it("establishes a session and redirects to /dashboard on a valid code", async () => {
    mockAuth({ exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }) });
    const res = await GET(req("/auth/confirm?code=good"));
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("fails safely on an invalid/expired code", async () => {
    mockAuth({
      exchangeCodeForSession: vi
        .fn()
        .mockResolvedValue({ error: { message: "invalid" } }),
    });
    const res = await GET(req("/auth/confirm?code=bad"));
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/connexion?status=confirmation_invalide",
    );
  });

  it("fails safely on an invalid token_hash", async () => {
    mockAuth({ verifyOtp: vi.fn().mockResolvedValue({ error: { message: "x" } }) });
    const res = await GET(req("/auth/confirm?token_hash=bad&type=email"));
    expect(res.headers.get("location")).toContain("confirmation_invalide");
  });

  it("fails safely when no token is provided", async () => {
    mockAuth({});
    const res = await GET(req("/auth/confirm"));
    expect(res.headers.get("location")).toContain("/connexion");
  });

  it("never honors an external redirect parameter (no open redirect)", async () => {
    mockAuth({ exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }) });
    const res = await GET(
      req("/auth/confirm?code=good&next=https://evil.example.com"),
    );
    const location = res.headers.get("location") ?? "";
    expect(location).toBe("http://localhost:3000/dashboard");
    expect(location).not.toContain("evil.example.com");
  });
});
