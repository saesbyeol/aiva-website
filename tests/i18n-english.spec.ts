import { test, expect } from "@playwright/test";

test("EN homepage shows English navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("header")).toContainText("Services");
  await expect(page.locator("header")).toContainText("Contact");
});

test("EN services page shows English service content, no Croatian leak", async ({ page }) => {
  await page.goto("/en/services");
  const body = page.locator("body");
  await expect(body).toContainText(/automation/i);
  await expect(body).not.toContainText("Automatizacija");
});

test("HR services page stays Croatian", async ({ page }) => {
  await page.goto("/usluge");
  await expect(page.locator("body")).toContainText("Automatizacija");
});

// app/not-found.tsx lives outside app/[locale]/, so it has no request-scoped
// locale to read and always renders with routing.defaultLocale (hr) — see
// the comment in that file. An unmatched /en/* path therefore still shows
// the Croatian 404 heading, not an English one. This is verified against
// the actual build output rather than assumed.
test("EN 404 (unmatched /en path) renders the default-locale (Croatian) heading", async ({
  page,
}) => {
  const res = await page.goto("/en/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Stranica nije pronađena");
});
