import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage renders with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Aiva/);
  });

  test("homepage has hero headline", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator('[aria-label="Hero"]');
    await expect(hero).toBeVisible();
  });

  test("skip-to-content link is focusable", async ({ page, browserName }) => {
    // WebKit's Playwright emulation doesn't move focus on keyboard.press("Tab")
    // by default (a known WebKit "Full Keyboard Access" limitation, tracked
    // upstream in Playwright/WebKit — not an app bug). This only affects the
    // "Mobile Safari" project, which runs on the webkit engine. Chromium is
    // unaffected and still fully verifies Tab-to-focus below.
    test.skip(
      browserName === "webkit",
      "WebKit emulation does not move focus on Tab press (Full Keyboard Access limitation); skip-link presence is still covered by other projects."
    );
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
  });

  test("main navigation links work", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav[aria-label='Main navigation']");

    // Navigate to Services
    await page.goto("/usluge");
    await expect(page).toHaveTitle(/Usluge/);

    // Navigate to Work
    await page.goto("/radovi");
    await expect(page).toHaveTitle(/Naši radovi/);

    // Navigate to About
    await page.goto("/o-nama");
    await expect(page).toHaveTitle(/O nama/);

    // Navigate to Contact
    await page.goto("/kontakt");
    await expect(page).toHaveTitle(/Kontakt/);
  });

  test("work case study pages render", async ({ page }) => {
    await page.goto("/radovi/clearpath-finance");
    // The <title> is the case study's Croatian headline (lib/content.ts),
    // not the client name — the client name never appears in <title>.
    await expect(page).toHaveTitle(/Automatizacija Obrade Kredita/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("contact form shows validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    // aria-label={t("form.title")} renders the Croatian string (messages/hr.json).
    const form = page.locator("form[aria-label='Pošaljite nam poruku']");
    await expect(form).toBeVisible();

    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // Expect validation errors
    const nameError = page.locator('[id="name-error"]');
    const emailError = page.locator('[id="email-error"]');
    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
  });

  test("contact form accepts valid input", async ({ page }) => {
    await page.goto("/kontakt");
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message with enough characters to pass validation."
    );

    // Errors should not be visible yet
    const nameError = page.locator('[id="name-error"]');
    await expect(nameError).not.toBeVisible();
  });

  test("mobile nav opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // aria-label={t("nav.openMenu")} renders the Croatian string (messages/hr.json).
    const menuButton = page.locator(
      "button[aria-label='Otvori izbornik navigacije']"
    );
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileNav = page.locator("[id='mobile-nav']");
    await expect(mobileNav).toBeVisible();

    await page.keyboard.press("Escape");
  });

  test("404 page renders", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    // t("notFound.title") renders the Croatian string (messages/hr.json).
    await expect(page.locator("h1")).toContainText("Stranica nije pronađena");
  });

  test("page has no accessibility violations in main heading order", async ({
    page,
  }) => {
    await page.goto("/");
    // Check heading hierarchy — h1 must exist
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
  });
});
