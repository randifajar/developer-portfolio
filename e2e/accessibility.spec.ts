import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility scanning (TD 15.4, NFAC-A11Y-001).
 *
 * Critical and serious findings fail the run. Minor and moderate findings are
 * reported but not blocking, matching the Technical Design's threshold.
 *
 * Automated scanning catches roughly a third of WCAG issues. It is a floor,
 * not a ceiling — the manual keyboard pass in docs/release-checklist.md covers
 * what axe cannot see.
 */

/**
 * Wait until the page is visually settled before scanning.
 *
 * Colour-contrast results depend on computed styles, and computed styles
 * depend on the stylesheet and web fonts having applied. Scanning too early
 * measures a partially-styled page and produces contrast violations that do
 * not exist in the finished render — which is exactly what happened when the
 * three engines ran in parallel and Firefox lost the race.
 *
 * Waiting on `document.fonts.ready` rather than adding a retry fixes the cause
 * instead of hiding it.
 */
async function waitUntilRendered(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}

async function blockingViolations(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  return results.violations
    .filter((violation) => violation.impact === "critical" || violation.impact === "serious")
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help} — ` +
        violation.nodes.map((node) => node.target.join(" ")).join(", "),
    );
}

const PAGE_TYPES = [
  { name: "Home", path: "/" },
  { name: "Projects Index", path: "/projects" },
  { name: "Not Found", path: "/this-route-does-not-exist" },
];

for (const pageType of PAGE_TYPES) {
  test(`${pageType.name} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(pageType.path);
    await waitUntilRendered(page);

    // Failures name the rule and the offending elements, so they are
    // actionable rather than just a count.
    expect(await blockingViolations(page)).toEqual([]);
  });
}

test("Home passes an accessibility scan at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await waitUntilRendered(page);

  expect(await blockingViolations(page)).toEqual([]);
});

test("the open mobile menu passes an accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await waitUntilRendered(page);

  // The only interactive state in the application. Scanning only the closed
  // page would leave the drawer, its focus handling, and its contrast
  // unverified.
  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("navigation", { name: /site navigation/i })).toBeVisible();

  expect(await blockingViolations(page)).toEqual([]);
});
