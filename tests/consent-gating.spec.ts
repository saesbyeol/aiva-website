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
});
