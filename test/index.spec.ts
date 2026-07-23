import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("portfolio-router", () => {
  it("redirects .com to .ca (308), preserving path and query", async () => {
    const res = await SELF.fetch("https://masonletoile.com/foo?bar=1", { redirect: "manual" });
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://masonletoile.ca/foo?bar=1");
  });

  it("redirects www.com to .ca (308)", async () => {
    const res = await SELF.fetch("https://www.masonletoile.com/", { redirect: "manual" });
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://masonletoile.ca/");
  });

  it("redirects www.ca to bare .ca (308)", async () => {
    const res = await SELF.fetch("https://www.masonletoile.ca/", { redirect: "manual" });
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://masonletoile.ca/");
  });

  it("redirects a bare prefix to its trailing-slash form (308)", async () => {
    const res = await SELF.fetch("https://masonletoile.ca/pixel-parker", { redirect: "manual" });
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://masonletoile.ca/pixel-parker/");
  });

  it("does not match a prefix that is only a string prefix, not a path segment", async () => {
    const res = await SELF.fetch("https://masonletoile.ca/pixel-parker-notes", { redirect: "manual" });
    expect(res.status).not.toBe(308);
  });
});
