import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";

/**
 * A case study's diagram (DEC-076, backlog item 11), in real engines.
 *
 * The component suite holds the words and their order. What only a browser can
 * show is which of the two layouts is displayed at a width, that the diagram
 * reads as one image with its own name, and that nothing in it runs off the
 * page. Expectations come from the records, so a new diagram is covered as
 * soon as it is published.
 */

const withDiagrams = projects.filter(
  (project) => project.publicationStatus === "published" && project.diagram,
);

test("every published case study's diagram is covered here", () => {
  expect(withDiagrams.length).toBeGreaterThan(0);
});

for (const project of withDiagrams) {
  const diagram = project.diagram!;

  test.describe(`${project.title} — diagram`, () => {
    test("sits under Architecture and Workflow, named by its caption and described in words", async ({
      page,
    }) => {
      await page.goto(`/projects/${project.slug}`);

      const figure = page.getByRole("figure", { name: diagram.title });
      await expect(figure).toBeVisible();
      await expect(figure.getByRole("img")).toHaveAccessibleName(diagram.description);

      const heading = page.getByRole("heading", { name: "Architecture and Workflow", level: 2 });
      const [headingBox, figureBox] = await Promise.all([
        heading.boundingBox(),
        figure.boundingBox(),
      ]);
      expect(figureBox!.y).toBeGreaterThan(headingBox!.y);
    });

    for (const { width, shown, hidden } of [
      { width: 390, shown: "narrow", hidden: "wide" },
      { width: 1023, shown: "narrow", hidden: "wide" },
      { width: 1024, shown: "wide", hidden: "narrow" },
      { width: 1440, shown: "wide", hidden: "narrow" },
    ] as const) {
      test(`shows its ${shown} layout at ${width} px, without overflowing`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/projects/${project.slug}`);

        const figure = page.getByRole("figure", { name: diagram.title });
        await expect(figure.locator(`[data-layout="${shown}"]`)).toBeVisible();
        await expect(figure.locator(`[data-layout="${hidden}"]`)).toBeHidden();

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);

        // No label is wider than the box it is drawn in.
        const clipped = await figure.locator(`[data-layout="${shown}"]`).evaluate((root) =>
          [...root.querySelectorAll("*")]
            .filter((element) => element.children.length === 0)
            .filter((element) => element.scrollWidth > element.clientWidth + 1)
            .map((element) => element.textContent),
        );
        expect(clipped).toEqual([]);
      });
    }
  });
}
