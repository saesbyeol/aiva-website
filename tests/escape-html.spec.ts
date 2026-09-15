import { test, expect } from "@playwright/test";
import { escapeHtml } from "../lib/escape-html";

/**
 * escapeHtml() is what stands between a stranger's contact-form input and
 * the HTML email body it lands in. Zod bounds the fields' length, never
 * their content, so this test asserts exact output rather than a status
 * code — a route-level test asserting `expect([200,400,429])` can't fail
 * no matter what the escaping does, so it proves nothing about escaping.
 */
test.describe("escapeHtml", () => {
  test("escapes ampersand", () => {
    expect(escapeHtml("&")).toBe("&amp;");
  });

  test("escapes less-than", () => {
    expect(escapeHtml("<")).toBe("&lt;");
  });

  test("escapes greater-than", () => {
    expect(escapeHtml(">")).toBe("&gt;");
  });

  test("escapes double quote", () => {
    expect(escapeHtml('"')).toBe("&quot;");
  });

  test("escapes single quote", () => {
    expect(escapeHtml("'")).toBe("&#39;");
  });

  test("neutralises a realistic anchor-tag injection payload", () => {
    const payload = '<a href="https://evil.example">Klikni</a>';
    const expected = "&lt;a href=&quot;https://evil.example&quot;&gt;Klikni&lt;/a&gt;";
    expect(escapeHtml(payload)).toBe(expected);
    // The escaped output must not contain any live markup characters.
    expect(escapeHtml(payload)).not.toContain("<a");
    expect(escapeHtml(payload)).not.toContain('"');
  });

  test("double-escaping is correct, not idempotent — & becomes &amp;, not re-collapsed", () => {
    const once = escapeHtml("&");
    expect(once).toBe("&amp;");
    const twice = escapeHtml(once);
    // Escaping the already-escaped string escapes its own ampersand again;
    // this is expected behaviour, not a bug, since escapeHtml has no way
    // to know "&amp;" was already-safe markup rather than literal text.
    expect(twice).toBe("&amp;amp;");
    expect(twice).not.toBe(once);
  });

  test("passes a benign string through unchanged", () => {
    const benign = "Pozdrav, zovem se Ana i zanima me suradnja.";
    expect(escapeHtml(benign)).toBe(benign);
  });
});
