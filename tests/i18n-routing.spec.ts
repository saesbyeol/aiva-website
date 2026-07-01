import { test, expect } from "@playwright/test";

test("Croatian home renders without a locale prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "hr");
});

test("English home is served under /en", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Croatian services slug works", async ({ page }) => {
  const res = await page.goto("/usluge");
  expect(res?.status()).toBeLessThan(400);
});

test("English services uses the translated slug", async ({ page }) => {
  const res = await page.goto("/en/services");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Studio stays outside locale routing", async ({ page }) => {
  const res = await page.goto("/studio");
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/studio/);
});

test("English footer terms link points to localized privacy route with anchor", async ({
  page,
}) => {
  await page.goto("/en");
  // Visible copy for this link is still Croatian ("Uvjeti korištenja") since
  // EN translations haven't been authored yet, so we match by href instead
  // of link text. This guards the Task 5+6 fix that resolves the terms link
  // through the localized pathnames map rather than hardcoding /privatnost.
  const termsLink = page.locator("footer a[href$='#terms']");
  await expect(termsLink).toHaveAttribute("href", /\/en\/privacy#terms$/);
  await expect(termsLink).not.toHaveAttribute("href", /\/en\/privatnost#terms$/);
});
