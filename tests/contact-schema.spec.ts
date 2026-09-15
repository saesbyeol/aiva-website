import { test, expect } from "@playwright/test";

/**
 * Escaping the HTML body (see tests/escape-html.spec.ts) does not protect
 * the notification email's `subject` line, because a mail header is not an
 * HTML context. Zod bounds `name` and `company` by length only, and a JSON
 * request body can legally carry a decoded CRLF straight through that
 * validation and into the header — the classic SMTP header-injection shape.
 * These are rejected at the schema boundary instead of relying on the mail
 * provider to sanitize them.
 *
 * Each test uses a distinct X-Forwarded-For value so these requests don't
 * share an in-memory rate-limit bucket with each other or with any other
 * spec hitting this route in the same test run.
 */
test.describe("Contact schema — line-break rejection", () => {
  test("rejects a name containing CRLF", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.10" },
      data: {
        name: "Ivan\r\nBcc: victim@example.com",
        email: "probe@example.com",
        message: "Ovo je dovoljno duga poruka za validaciju formulara na stranici.",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects a company containing a line break", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.11" },
      data: {
        name: "Ivan Horvat",
        email: "probe@example.com",
        company: "Acme\nBcc: victim@example.com",
        message: "Ovo je dovoljno duga poruka za validaciju formulara na stranici.",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("accepts a normal name and company", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.12" },
      data: {
        name: "Ivan Horvat",
        email: "probe@example.com",
        company: "Acme d.o.o.",
        message: "Ovo je dovoljno duga poruka za validaciju formulara na stranici.",
      },
    });
    expect(res.status()).toBe(200);
  });

  // This is the guard-rail assertion: message legitimately contains
  // newlines (rendered with white-space: pre-wrap, and HTML-escaped), so
  // the line-break restriction must never be extended to it.
  test("still accepts a message that contains newlines", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.13" },
      data: {
        name: "Ivan Horvat",
        email: "probe@example.com",
        message:
          "Prvi redak poruke.\nDrugi redak poruke, i dalje dovoljno dugačke za validaciju.",
      },
    });
    expect(res.status()).toBe(200);
  });
});
