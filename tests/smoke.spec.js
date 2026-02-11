import { expect, test } from "@playwright/test";

const setSlider = async (page, value) => {
  await page.locator("#slider").evaluate((el, next) => {
    el.value = String(next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
};

test.describe("smoke", () => {
  test("loads key UI and supports terminal focus", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("Sem Gebresilassie");
    await expect(page.locator("#resume")).toBeVisible();
    await expect(page.locator("#slider")).toBeVisible();
    await expect(page.locator('[data-hud="signal"]')).toHaveText("0%");

    await page.locator("#terminal").click();
    await expect(page.locator("#terminal-input")).toBeFocused();
  });

  test("slider updates mode and desktop max state", async ({ page }) => {
    await page.goto("/");

    await setSlider(page, 50);
    await expect(page.locator('[data-hud="mode"]')).toHaveText("FIRM");

    await setSlider(page, 100);
    await expect(page.locator("#resume .call-text")).toHaveText("CALL NOW!");
    await expect(page.locator("#resume .call-fire")).toBeVisible();
  });
});

test.describe("smoke-mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("max slider does not render call-now state on small screens", async ({
    page,
  }) => {
    await page.goto("/");
    await setSlider(page, 100);

    await expect(page.locator("#resume .call-text")).toHaveCount(0);
    await expect(page.locator("#resume .call-fire")).toHaveCount(0);
    await expect(page.locator("#resume")).not.toContainText("CALL NOW!");
  });
});
