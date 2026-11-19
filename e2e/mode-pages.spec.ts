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

  await page
    .getByRole("region", { name: "Backend roles at Zettabyte Pte Ltd." })
    .getByRole("link", { name: "Infrastructure" })
    .click();

  await expect(page).toHaveURL(/\/infrastructure$/);
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText(/Beyond Deployment\./i);
  await expect(heading).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
