import { expect, test } from "@playwright/test";

/**
 * The Backend and Infrastructure pages (UX3 7.2, 7.3; V3 P6). Their structure
 * and content are asserted in the component suite; these are what only a
 * browser shows: the hero actions scroll to their sections, and the links
 * between the two pages behave as mode changes.
 */

for (const mode of [
  { path: "/backend", action: /explore backend work/i, target: "backend-work" },
  {
    path: "/infrastructure",
    action: /explore infrastructure work/i,
    target: "infrastructure-work",
  },
]) {
  test(`${mode.path}: the hero action takes the visitor to the first section`, async ({ page }) => {
    await page.goto(mode.path);
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: mode.action }).click();

    await expect(page).toHaveURL(new RegExp(`#${mode.target}$`));
    await expect(page.locator(`#${mode.target}`)).toBeInViewport();
  });
}

test("the Backend experience leads to Infrastructure as a mode change", async ({ page }) => {
  await page.goto("/backend");
  await page.waitForLoadState("networkidle");

  const link = page
    .getByRole("region", { name: "Backend roles at Zettabyte Pte Ltd." })
    .getByRole("link", { name: "Infrastructure" });

  // The section rises 22 px as it is scrolled to (UX3 8.5). A click scrolls to
  // its target and measures it at once, before the rise is drawn, so the press
  // lands 22 px below where this 44 px link settles: on its bottom edge, where
  // Chromium often missed it and Playwright still reported the click as done.
  // Scrolling first leaves the click nothing to scroll, so its wait for the
  // link to hold still is the wait for the rise.
  await link.scrollIntoViewIfNeeded();
  await link.click();

  await expect(page).toHaveURL(/\/infrastructure$/);
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText(/Beyond Deployment\./i);
  await expect(heading).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
