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

  it("accepts a valid URL", () => {
    expect(
      parseEnv({ NEXT_PUBLIC_SITE_URL: "https://advertoai.fr" })
        .NEXT_PUBLIC_SITE_URL,
    ).toBe("https://advertoai.fr");
  });

  it("rejects a malformed URL", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "not-a-url" })).toThrow();
  });
});
