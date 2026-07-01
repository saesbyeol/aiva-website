import { test, expect, type Page } from "@playwright/test";

// The LocaleToggle component is rendered in two places: the header
// (`hidden md:flex`, shown on desktop widths) and the mobile nav panel
// (only mounted once the hamburger menu is opened). An unscoped
// getByRole("button", { name: /^en$/i }) can match both when the mobile nav
// is open, tripping Playwright's strict mode, and on narrow viewports
// (e.g. the "Mobile Safari" project) the header's copy is `display: none`
// and un-clickable. This helper picks whichever instance is actually
// visible for the current viewport, opening the mobile nav first if needed.
async function clickEnToggle(page: Page) {
  const headerToggle = page
    .locator("header")
    .getByRole("button", { name: /^en$/i });

  if (await headerToggle.isVisible()) {
    await headerToggle.click();
    return;
  }

  // Narrow viewport: header toggle is hidden via `md:flex`, use the mobile
  // nav's copy instead.
  await page.locator("button[aria-label='Open navigation menu']").click();
  const mobileToggle = page
    .locator("#mobile-nav")
    .getByRole("button", { name: /^en$/i });
  await expect(mobileToggle).toBeVisible();
  await mobileToggle.click();
}

test("toggle switches HR home to EN", async ({ page }) => {
  await page.goto("/");
  await clickEnToggle(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\/en/);
});

test("toggle preserves the current page when switching", async ({ page }) => {
  await page.goto("/usluge");
  await clickEnToggle(page);
  await expect(page).toHaveURL(/\/en\/services/);
});
