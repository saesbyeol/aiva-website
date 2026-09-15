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
});
