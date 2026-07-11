import { describe, expect, it } from "vitest";

import { parseEnv } from "@/lib/env";

describe("parseEnv", () => {
  it("falls back to localhost when the site URL is unset", () => {
    expect(parseEnv({}).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("treats an empty string as unset", () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: "" }).NEXT_PUBLIC_SITE_URL).toBe(
      "http://localhost:3000",
    );
  });

  it("accepts a valid site URL", () => {
    expect(
      parseEnv({ NEXT_PUBLIC_SITE_URL: "https://advertoai.fr" })
        .NEXT_PUBLIC_SITE_URL,
    ).toBe("https://advertoai.fr");
  });

  it("rejects a malformed site URL", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "not-a-url" })).toThrow();
  });

  it("defaults the Supabase vars to placeholders when unset", () => {
    const env = parseEnv({});
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://placeholder.supabase.co");
    expect(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe(
      "placeholder-publishable-key",
    );
  });

  it("accepts a real Supabase URL and publishable key", () => {
    const env = parseEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_key",
    });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://abc.supabase.co");
    expect(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe("sb_publishable_key");
  });

  it("rejects a malformed Supabase URL", () => {
    expect(() =>
      parseEnv({ NEXT_PUBLIC_SUPABASE_URL: "http//broken" }),
    ).toThrow();
  });

  it("does not read any service-role key", () => {
    // The schema must not surface a service-role/secret key at all.
    const env = parseEnv({
      SUPABASE_SERVICE_ROLE_KEY: "super-secret",
    } as Record<string, string>);
    expect(
      (env as Record<string, unknown>).SUPABASE_SERVICE_ROLE_KEY,
    ).toBeUndefined();
  });
});
