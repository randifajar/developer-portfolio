import { expect, test, type Page } from "@playwright/test";

/**
 * The pinned career sequence (UX3 8.4), in real engines.
 *
 * Pinned only on wide screens with motion allowed; stacked everywhere else.
 * Native scrolling chooses the chapter, so these scroll the page itself and
 * read which chapter is active, rather than timing any animation.
 */

const track = (page: Page) => page.locator("[data-career-journey]");
const chapter = (page: Page, index: number) => page.locator(`[data-chapter="${index}"]`);

/** Scrolls to a point a given fraction of the way through the pinned track. */
async function scrollThrough(page: Page, fraction: number) {
  await page.evaluate((share) => {
    const element = document.querySelector<HTMLElement>("[data-career-journey]")!;
    const header = document.querySelector("body > header")!.getBoundingClientRect().height;
    const top = element.getBoundingClientRect().top + window.scrollY - header;
    const travel = element.offsetHeight - (window.innerHeight - header);
    window.scrollTo({ top: top + share * travel, behavior: "instant" });
  }, fraction);
}

test.describe("on a wide screen with motion allowed", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("pins, and the scroll position chooses the chapter, both ways", async ({ page }) => {
    await expect(track(page)).toHaveAttribute("data-pinned", "");

    await scrollThrough(page, 0.05);
    await expect(chapter(page, 0)).toHaveAttribute("data-active", "");

    await scrollThrough(page, 0.5);
    await expect(chapter(page, 1)).toHaveAttribute("data-active", "");
    await expect(chapter(page, 0)).not.toHaveAttribute("data-active", "");

    await scrollThrough(page, 0.95);
    await expect(chapter(page, 2)).toHaveAttribute("data-active", "");

    // Scrolling back reverses the sequence (V3-MOT-003).
    await scrollThrough(page, 0.5);
    await expect(chapter(page, 1)).toHaveAttribute("data-active", "");
  });

  test("the arrows step between chapters", async ({ page }) => {
    await scrollThrough(page, 0.05);
    await expect(chapter(page, 0)).toHaveAttribute("data-active", "");

    await page.getByRole("button", { name: "Next chapter" }).click();
    await expect(chapter(page, 1)).toHaveAttribute("data-active", "");

    await page.getByRole("button", { name: "Previous chapter" }).click();
    await expect(chapter(page, 0)).toHaveAttribute("data-active", "");
  });

  test("focus reaching a hidden chapter brings it into view", async ({ page }) => {
    await scrollThrough(page, 0.05);
    await expect(chapter(page, 2)).not.toHaveAttribute("data-active", "");

    await chapter(page, 2).getByRole("link").first().focus();

    await expect(chapter(page, 2)).toHaveAttribute("data-active", "");
  });

  test("keeps every chapter in the document while pinned", async ({ page }) => {
    await scrollThrough(page, 0.05);

    for (const headline of [
      "Learning backend from the inside.",
      "Services, data, and the failures between them.",
      "Beyond the application.",
    ]) {
      await expect(
        page.getByRole("heading", { level: 3, name: new RegExp(headline) }),
      ).toBeAttached();
    }
  });
});

test.describe("stays stacked where pinning does not belong", () => {
  test("below 900 px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(track(page)).not.toHaveAttribute("data-pinned", "");
    await expect(chapter(page, 1)).toBeVisible();
  });

  test.describe("under reduced motion", () => {
    test.use({
      contextOptions: { reducedMotion: "reduce" },
      viewport: { width: 1280, height: 800 },
    });

    test("on a wide screen too", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(track(page)).not.toHaveAttribute("data-pinned", "");
    });
  });
});
