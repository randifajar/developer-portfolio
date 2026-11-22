import { expect, test, type Page } from "@playwright/test";

/**
 * Scroll and focus on a mode change (UX3 6.5, V3 plan 3.3 and 8).
 *
 * The hero persists across the three mode routes, so the router's own scroll
 * handling cannot be left to decide where a mode change lands: it scrolls the
 * page below the hero into view, which on a phone is past the hero, and it
 * leaves focus on the link that was pressed. ModeHero resets the scroll and
 * moves focus to the new heading. These check each way into a mode route in
 * a real browser, in all three engines, against the production build.
 */

const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

/**
 * Load a page and wait until it is idle, so it has hydrated before the test
 * interacts with it.
 *
 * Observed: in a full parallel run, WebKit at phone width once missed the
 * five-second URL assertion after a click, though the same test passed 28
 * times out of 28 on its own. Inferred, not proven: the click raced
 * hydration. `goto` resolves at the load event, React 19 hydrates in time
 * slices that can outlast it, and a link is not handled as a client
 * navigation until it has hydrated. Waiting for the page to settle removes
 * that race whatever its exact timing; a visitor does not click at automation
 * speed the moment a page loads.
 */
async function gotoHydrated(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => scrollY(page)).toBeGreaterThan(200);
}

const modes = (page: Page) => page.getByRole("navigation", { name: "Modes" });

for (const viewport of [
  { name: "desktop", width: 1280, height: 800 },
  { name: "phone", width: 375, height: 667 },
]) {
  test.describe(`on a ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("a mode change from mid-page lands at the top, focus on the new heading", async ({
      page,
    }) => {
      await gotoHydrated(page, "/");
      await scrollToBottom(page);

      await modes(page).getByRole("link", { name: "Backend" }).click();

      await expect(page).toHaveURL(/\/backend$/);
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toHaveText(/Behind the Application\./i);
      await expect(heading).toBeFocused();
      await expect.poll(() => scrollY(page)).toBe(0);
    });

    test("arriving from the projects pages does the same", async ({ page }) => {
      await gotoHydrated(page, "/projects");
      await scrollToBottom(page);

      await page
        .getByRole("contentinfo")
        .getByRole("navigation", { name: "Pages" })
        .getByRole("link", { name: "Overall" })
        .click();

      await expect(page).toHaveURL(/\/$/);
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toHaveText(/Randi Fajar Wicaksono/);
      await expect(heading).toBeFocused();
      await expect.poll(() => scrollY(page)).toBe(0);
    });
  });
}

test("a page load moves neither focus nor scroll", async ({ page }) => {
  await gotoHydrated(page, "/backend");

  await expect(page.getByRole("heading", { level: 1 })).not.toBeFocused();
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
});

test("five rapid mode changes settle on the last, consistently", async ({ page }) => {
  await gotoHydrated(page, "/");

  for (const name of ["Backend", "Infrastructure", "Overall", "Backend", "Infrastructure"]) {
    await modes(page).getByRole("link", { name }).click();
  }

  await expect(page).toHaveURL(/\/infrastructure$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Beyond Deployment\./i);
  await expect(modes(page).getByRole("link", { name: "Infrastructure" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.locator("h1")).toHaveCount(1);
});

test("Back and Forward move between modes by URL", async ({ page }) => {
  await gotoHydrated(page, "/");
  await modes(page).getByRole("link", { name: "Backend" }).click();
  await expect(page).toHaveURL(/\/backend$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Randi Fajar Wicaksono/);

  await page.goForward();
  await expect(page).toHaveURL(/\/backend$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Behind the Application\./i);
});
