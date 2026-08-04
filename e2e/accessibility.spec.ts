import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility scanning (TD 15.4, NFAC-A11Y-001).
 *
 * Critical and serious findings fail the run. Minor and moderate findings are
 * reported but not blocking, matching the Technical Design's threshold.
 *
 * Automated scanning catches roughly a third of WCAG issues. It is a floor,
 * not a ceiling — the manual keyboard pass in the release checklist covers
 * what axe cannot see.
 */
const PAGE_TYPES = [
  { name: "Home", path: "/" },
  { name: "Projects Index", path: "/projects" },
  { name: "Not Found", path: "/this-route-does-not-exist" },
];

for (const pageType of PAGE_TYPES) {
  test(`${pageType.name} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(pageType.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    // Name the failing rules and the elements, so a failure is actionable
    // rather than just a count.
    const summary = blocking.map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help} — ` +
        violation.nodes.map((node) => node.target.join(" ")).join(", "),
    );

    expect(summary).toEqual([]);
  });
}

test("Home passes an accessibility scan at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
});

test("the open mobile menu passes an accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
});
