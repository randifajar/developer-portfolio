import { expect, test } from "@playwright/test";
import { SECTION_IDS } from "../src/lib/constants";

/**
 * Reduced motion.
 *
 * PRD 62 lists reduced-motion tests among the things to *maintain*. There were
 * none, so this file is the thing being maintained from now on.
 *
 * What it guards is not "does the animation stop" — that is easy and mostly
 * self-evident. It guards the failure that actually loses information: an
 * entrance effect whose resting state is invisible. With motion disabled such
 * an element never animates, never becomes visible, and the content is simply
 * absent for the user who asked for less motion.
 *
 * Playwright emulates the media query at the browser level, so this exercises
 * the real cascade rather than a stubbed matchMedia.
 */

/*
 * Set on the browser context rather than per page, so the preference is in
 * effect for the very first paint. Emulating it after navigation would test a
 * page that had already rendered with motion enabled.
 */
test.use({ contextOptions: { reducedMotion: "reduce" } });

const HOMEPAGE_SECTIONS = [
  SECTION_IDS.about,
  SECTION_IDS.experience,
  SECTION_IDS.projects,
  SECTION_IDS.skills,
  SECTION_IDS.aiWorkflow,
  SECTION_IDS.contact,
] as const;

test("every homepage section is visible with motion disabled", async ({ page }) => {
  await page.goto("/");

  // The h1 is in the hero, which carries no id of its own.
  await expect(page.locator("h1")).toBeVisible();

  for (const id of HOMEPAGE_SECTIONS) {
    await expect(
      page.locator(`#${id}`),
      `#${id} is not visible under reduced motion`,
    ).toBeVisible();
  }
});

test("no element is left transparent or displaced by a disabled animation", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  /*
   * Scans every element that carries text, not just the ones known to animate.
   * A future reveal added to any component is caught without this file needing
   * to know about it.
   *
   * Zero-area elements are skipped: `sr-only` content is legitimately collapsed,
   * and an empty wrapper is not a failure.
   */
  const hidden = await page.evaluate(() => {
    const offenders: string[] = [];

    for (const element of document.querySelectorAll<HTMLElement>("main *")) {
      const text = element.textContent?.trim() ?? "";
      if (text.length === 0) continue;

      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;

      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") continue;

      if (Number.parseFloat(style.opacity) < 0.99) {
        offenders.push(
          `${element.tagName.toLowerCase()} opacity ${style.opacity}: ${text.slice(0, 40)}`,
        );
      }
    }

    return offenders;
  });

  expect(hidden, `\nInvisible under reduced motion:\n${hidden.join("\n")}\n`).toEqual([]);
});

test("the reduced-motion rule disables scroll-driven timelines too", async ({ page }) => {
  await page.goto("/");

  /*
   * The specific gap this closes: `animation-duration: 0.01ms` does nothing to
   * `animation-timeline: view()`, which advances on scroll position rather than
   * time. Without `animation-timeline: none` a scroll-driven reveal would run
   * at full effect for a user who asked for less motion.
   *
   * Probes the cascade with a real element rather than reading the stylesheet,
   * so it stays true regardless of how the rule is expressed.
   *
   * Engine support is checked first, and measured rather than assumed:
   *
   *   chromium  supports=true   computed "none"
   *   webkit    supports=true   computed "none"
   *   firefox   supports=false  computed undefined
   *
   * Where the feature does not exist a scroll-driven animation cannot run at
   * all, so the preference cannot be ignored and there is nothing to assert.
   * Skipping is honest; asserting "none" there would fail for a browser that is
   * not at risk, and weakening the assertion to accommodate it would stop
   * guarding the two engines that are.
   */
  const support = await page.evaluate(() => ({
    supported: CSS.supports("animation-timeline", "view()"),
    resolved: getComputedStyle(document.body).animationTimeline ?? null,
  }));

  test.skip(
    !support.supported,
    "This engine does not implement animation-timeline, so no scroll-driven animation can run.",
  );

  const timeline = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.animationTimeline = "view()";
    probe.textContent = "probe";
    document.body.append(probe);

    const resolved = getComputedStyle(probe).animationTimeline;
    probe.remove();
    return resolved;
  });

  expect(timeline).toBe("none");
});
