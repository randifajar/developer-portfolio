import { expect, test, type Page } from "@playwright/test";

/**
 * The header at narrow widths (UX3 5, 6.1, 6.2; V3 P10).
 *
 * UX3 5: one row at 390 px, two rows from 360 px down. Anchored scrolling has
 * to clear the header either way, and the mode pill moves to the new mode.
 */

const headerHeight = (page: Page) =>
  page.evaluate(() => document.querySelector("body > header")!.getBoundingClientRect().height);

/*
 * Exactly the two widths UX3 5 specifies. Between them the row break depends
 * on text metrics, which differ by platform: at 375 px the header was one row
 * in Chromium on Windows and two in Chromium on Linux (CI), so this asserts
 * nothing there.
 */
test("the header is one row at 390 px and wraps at 360 px (UX3 5)", async ({ page }) => {
  for (const [width, rows] of [
    [390, 1],
    [360, 2],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const height = await headerHeight(page);

    if (rows === 1) expect(height, `${width} px`).toBeLessThan(80);
    else expect(height, `${width} px`).toBeGreaterThan(100);
  }
});

test("an anchor clears the header when it wraps to two rows", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: /explore the journey/i }).click();
  await expect(page).toHaveURL(/#profile$/);

  await expect
    .poll(async () => {
      const header = await headerHeight(page);
      const top = await page.evaluate(
        () => document.getElementById("profile")!.getBoundingClientRect().top,
      );
      return top >= header - 1;
    })
    .toBe(true);
});

test("the mode pill moves to the new mode (V3-NAV-003)", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const modes = page.getByRole("navigation", { name: "Modes" });

  await modes.getByRole("link", { name: "Backend" }).click();
  await expect(page).toHaveURL(/\/backend$/);

  await expect
    .poll(() =>
      modes.evaluate((nav) => {
        const pill = nav.querySelector<HTMLElement>("ul > span[aria-hidden]");
        const backend = nav.querySelector<HTMLElement>('a[href="/backend"]');
        if (!pill || !backend) return null;
        const pillBox = pill.getBoundingClientRect();
        const linkBox = backend.getBoundingClientRect();
        return (
          Math.abs(pillBox.left - linkBox.left) < 2 && Math.abs(pillBox.width - linkBox.width) < 2
        );
      }),
    )
    .toBe(true);
});
