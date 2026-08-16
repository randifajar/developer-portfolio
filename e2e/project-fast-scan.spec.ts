import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";

/**
 * Layer A — the fast scan (PRD 34, PRD 61, UX2 8.2).
 *
 * The promise is positional, not merely presentational: a reader learns what
 * the project was, whether it was professional, when, what Randi did and what
 * it was built with **before** reaching the deep sections. A test that only
 * checked those facts appear somewhere on the page would pass with the stack
 * back at position thirteen, which is where it was.
 *
 * So this asserts vertical position in a real browser. jsdom has no layout, so
 * this cannot live in the component suite — the same reason the touch-target
 * assertion belongs here rather than as a class-name substring.
 */

const published = projects.filter((project) => project.publicationStatus === "published");

for (const project of published) {
  test.describe(`${project.title} — fast scan`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/projects/${project.slug}`);
      await page.waitForLoadState("networkidle");
    });

    test("states role, status and stack above the deep sections", async ({ page }) => {
      const heading = page.locator("h1");
      const role = page.getByText("My role:", { exact: false }).first();
      const status = page.locator("[data-status]").first();

      // "Context" is the first of the fifteen deep sections. Everything the
      // scan layer promises must sit above it.
      const firstDeepSection = page.getByRole("heading", { name: "Context", level: 2 });

      const [headingBox, roleBox, statusBox, deepBox] = await Promise.all([
        heading.boundingBox(),
        role.boundingBox(),
        status.boundingBox(),
        firstDeepSection.boundingBox(),
      ]);

      expect(headingBox, "no h1").not.toBeNull();
      expect(deepBox, "no Context section — the deep layer is missing").not.toBeNull();

      expect(roleBox!.y, "role is not in the scan layer").toBeLessThan(deepBox!.y);
      expect(statusBox!.y, "status is not in the scan layer").toBeLessThan(deepBox!.y);
      expect(headingBox!.y, "title is not in the scan layer").toBeLessThan(deepBox!.y);
    });

    test("puts the technology stack in the scan layer, not at position thirteen", async ({
      page,
    }) => {
      // The specific regression this guards: the stack used to be the
      // thirteenth of fifteen sections, so the most scannable fact on the page
      // was also the least reachable. It now sits in the header and appears
      // once, not twice.
      test.skip(project.technologyIds.length === 0, "project declares no technologies");

      const deepBox = await page.getByRole("heading", { name: "Context", level: 2 }).boundingBox();
      const stackBox = await page.locator("header ul li").first().boundingBox();

      expect(stackBox, "no technology list in the header").not.toBeNull();
      expect(stackBox!.y).toBeLessThan(deepBox!.y);
    });

    test("says 'My role', matching the card and the module (SUP-006)", async ({ page }) => {
      // The page previously said "Role:" while the card and module said
      // "My role:", so a reader moving between them met two words for one
      // thing. The possessive is the part that scopes the claim.
      await expect(page.getByText("My role:", { exact: false }).first()).toBeVisible();
      expect(await page.getByText(/(^|[^y] )Role:/).count()).toBe(0);
    });

    test("keeps responsibility separated and the deep sections intact", async ({ page }) => {
      // FAC-PROJECT-003 survives the redesign, and Layer B keeps its substance.
      await expect(page.getByRole("heading", { name: "My responsibility" })).toBeVisible();

      for (const heading of ["Context", "Problem", "Technical Approach", "Outcome"]) {
        await expect(
          page.getByRole("heading", { name: heading, level: 2 }),
          `deep section "${heading}" is missing`,
        ).toBeVisible();
      }
    });

    test("keeps exactly one h1", async ({ page }) => {
      await expect(page.locator("h1")).toHaveCount(1);
    });
  });
}
