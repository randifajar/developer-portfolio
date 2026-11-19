import { expect, test, type Page } from "@playwright/test";

/**
 * Motion (UX3 8; V3 P8), in real engines.
 *
 * These count what the hero animates rather than timing frames, which would
 * make them flaky: the mode change must animate when motion is allowed and
 * must not when it is reduced, and in both cases must settle on the new copy.
 */

/** Counts the hero's own Web Animations as they start. */
async function countHeroAnimations(page: Page) {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    (window as unknown as { heroAnimations: number }).heroAnimations = 0;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      // The id is set right after creation, so count on the next microtask.
      queueMicrotask(() => {
        if (animation.id === "mode-hero") {
          (window as unknown as { heroAnimations: number }).heroAnimations += 1;
        }
      });
      return animation;
    };
  });
}

const heroAnimations = (page: Page) =>
  page.evaluate(() => (window as unknown as { heroAnimations: number }).heroAnimations);

const halo = (page: Page) => page.locator("section[data-surface] > div[aria-hidden]").first();

test.describe("with motion allowed", () => {
  test("a mode change animates the hero copy and settles on the new heading", async ({ page }) => {
    await countHeroAnimations(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("navigation", { name: "Modes" })
      .getByRole("link", { name: "Backend" })
      .click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Behind the Application\./i);
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    expect(await heroAnimations(page)).toBeGreaterThan(0);
  });

  test("the pointer light follows a mouse over the hero", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Hover emulation is checked in one engine.");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hero = page.getByRole("region", { name: "Randi Fajar Wicaksono" });
    const box = (await hero.boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.move(box.x + 260, box.y + 240);

    await expect.poll(() => halo(page).evaluate((element) => element.style.opacity)).toBe("1");
  });
});

test.describe("with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("a mode change swaps the copy without animating it (UX3 8.6)", async ({ page }) => {
    await countHeroAnimations(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("navigation", { name: "Modes" })
      .getByRole("link", { name: "Backend" })
      .click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Behind the Application\./i);
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    expect(await heroAnimations(page)).toBe(0);
  });

  test("there is no pointer light", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hero = page.getByRole("region", { name: "Randi Fajar Wicaksono" });
    const box = (await hero.boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.move(box.x + 260, box.y + 240);

    expect(await halo(page).evaluate((element) => element.style.opacity)).not.toBe("1");
  });
});
