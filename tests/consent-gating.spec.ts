import { test, expect } from "@playwright/test";

test.describe("Consent gating", () => {
  test("no third-party tracker loads before consent is given", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (r) => {
      const url = r.url();
      if (/chatbase\.co|unpkg\.com|elevenlabs\.io/.test(url)) thirdParty.push(url);
    });

    await page.goto("/ai-recepcija");
    await page.waitForLoadState("networkidle");

    expect(
      thirdParty,
      `These third parties loaded with no consent:\n${thirdParty.join("\n")}`
    ).toEqual([]);
  });

  test("voice demo loads ElevenLabs only after explicit activation", async ({ page }) => {
    const elevenlabs: string[] = [];
    page.on("request", (r) => {
      if (/unpkg\.com|elevenlabs\.io/.test(r.url())) elevenlabs.push(r.url());
    });

    await page.goto("/ai-recepcija");
    await page.waitForLoadState("networkidle");
    expect(elevenlabs, "ElevenLabs loaded before activation").toEqual([]);

    await page.getByRole("button", { name: /Pokreni demo/i }).click();
    await page.waitForRequest(/unpkg\.com|elevenlabs\.io/, { timeout: 15_000 });

    expect(elevenlabs.length).toBeGreaterThan(0);
  });

  test("activating the demo after a long read of the consent notice still works", async ({
    page,
  }) => {
    // The give-up timer that declares the widget "unavailable" must not start
    // until the visitor has actually activated the demo. Regression test for
    // useWidgetState() arming GIVE_UP_AFTER_MS on mount (page load) instead of
    // on activation, which silently expired the timer while the visitor was
    // still reading the consent notice.
    await page.goto("/ai-recepcija");

    // Wait longer than GIVE_UP_AFTER_MS (10s) before activating, simulating a
    // visitor who actually reads the two-sentence consent notice first.
    await page.waitForTimeout(12_000);

    await page.getByRole("button", { name: /Pokreni demo/i }).click();

    await expect(page.getByText("Razgovor uživo nije se učitao")).not.toBeVisible();

    const talkButton = page.getByRole("button", { name: /poziv|razgovor|call/i });
    await expect(talkButton).toBeEnabled({ timeout: 15_000 });
  });

  test("Chatbase loads once Cookiebot reports marketing consent granted", async ({
    page,
  }) => {
    // Mirror of "no third-party tracker loads before consent is given": every
    // other test in this file exercises only the denied path, which would
    // pass identically if useConsent() returned denied unconditionally. This
    // proves the provider actually opens the gate when consent is granted.
    await page.addInitScript(() => {
      (window as unknown as { Cookiebot: unknown }).Cookiebot = {
        consent: {
          necessary: true,
          preferences: true,
          statistics: true,
          marketing: true,
        },
        hasResponse: true,
      };
    });

    const chatbaseRequest = page.waitForRequest(/chatbase\.co/, { timeout: 15_000 });

    await page.goto("/");

    await expect(chatbaseRequest).resolves.toBeTruthy();
  });
});
