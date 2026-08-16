import { expect, test } from "@playwright/test";

/**
 * Responsive and zoom hardening (PRD 64, PRD 65).
 *
 * PRD 64 lists six review widths and PRD 65 lists 200% zoom, both as *manual*
 * QA. Manual QA happens once, at the end, by whoever remembers — which is the
 * shape of check this project has repeatedly found to be indistinguishable from
 * no check at all. These are the automatable parts of that list, so they run on
 * every pull request instead.
 *
 * The existing suite already covers 320px on two routes. This widens that to
 * every listed width across every route, including the two the redesign changed
 * most.
 *
 * What is deliberately NOT automated here: whether the layouts *look* right at
 * each width. That is a judgement, it stays manual, and pretending otherwise
 * would be the more dangerous kind of green.
 */

/** PRD 64's six widths, plus 320 — the narrowest the project supports. */
const WIDTHS = [320, 375, 390, 768, 1024, 1280, 1440] as const;

const ROUTES = [
  { name: "Home", path: "/" },
  { name: "Projects Index", path: "/projects" },
  { name: "Project Detail", path: "/projects/jury-process-management-integration" },
  { name: "Not Found", path: "/this-route-does-not-exist" },
] as const;

for (const route of ROUTES) {
  test(`${route.name} has no horizontal overflow at any supported width`, async ({ page }) => {
    const offenders: string[] = [];

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        const by = root.scrollWidth - root.clientWidth;

        if (by <= 1) return null;

        // Name the widest offenders. A bare "it overflows by 40px" sends the
        // next person hunting through every element on the page.
        const culprits = [...document.querySelectorAll("body *")]
          .filter((element) => element.getBoundingClientRect().right > root.clientWidth + 1)
          .slice(0, 3)
          .map((element) => {
            const classes = String(element.className).split(" ")[0] ?? "";
            return `${element.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`;
          });

        return { by, culprits };
      });

      if (overflow) {
        offenders.push(
          `${width}px overflows by ${overflow.by}px — ${overflow.culprits.join(", ")}`,
        );
      }
    }

    expect(offenders, `\n${offenders.join("\n")}\n`).toEqual([]);
  });
}

/**
 * 200% zoom (WCAG 1.4.4).
 *
 * The reason the type scale forbids a pure-vw clamp: a preferred value with no
 * rem term does not respond to zoom, so text stays put while its container
 * grows. tests/design/typography.test.ts enforces the rule on the tokens; this
 * checks the result in a browser, where the two could still disagree.
 */
for (const route of ROUTES.slice(0, 3)) {
  test(`${route.name} survives 200% browser zoom`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => {
      document.body.style.zoom = "200%";
    });
    await page.waitForTimeout(200);

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });

    expect(
      overflow,
      `content overflows horizontally by ${overflow}px at 200% zoom`,
    ).toBeLessThanOrEqual(1);
  });
}
