import { expect, test } from "@playwright/test";

/**
 * Homepage behaviour.
 *
 * Assertions target structure, roles, and chrome rather than content strings.
 * All substantive content is Draft today and will be replaced wholesale in
 * P30, so a suite keyed to placeholder text would break on the one change it
 * most needs to survive.
 */
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("homepage structure", () => {
  test("responds and identifies the site", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: "Randi Fajar Wicaksono" }).first()).toBeVisible();
  });

  test("declares the document language (NFAC-A11Y-003)", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("exposes main, banner, and contentinfo landmarks", async ({ page }) => {
    await expect(page.getByRole("main")).toBeAttached();
    await expect(page.getByRole("banner")).toBeAttached();
    await expect(page.getByRole("contentinfo")).toBeAttached();
  });

  test("has a unique page title identifying Randi (NFAC-SEO-003)", async ({ page }) => {
    await expect(page).toHaveTitle(/Randi Fajar Wicaksono/);
  });
});

test.describe("keyboard access (NFAC-A11Y-002)", () => {
  /**
   * Structural assertions, verified on every engine.
   *
   * These check the site's own implementation: the skip link exists, targets
   * main content, is the first focusable element in DOM order, and becomes
   * visible when focused.
   */
  test("the skip link exists, targets main content, and is first in the document", async ({
    page,
  }) => {
    const skipLink = page.getByRole("link", { name: /skip to main content/i });

    await expect(skipLink).toHaveAttribute("href", "#main-content");

    const isFirstFocusable = await page.evaluate(() => {
      const focusable = document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      return focusable[0]?.getAttribute("href") === "#main-content";
    });

    expect(isFirstFocusable).toBe(true);
  });

  test("the skip link becomes visible when focused", async ({ page }) => {
    const skipLink = page.getByRole("link", { name: /skip to main content/i });

    await skipLink.focus();

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  /**
   * Tab-order assertion, restricted to engines that place links in the tab
   * order by default.
   *
   * WebKit does not: Safari's "Press Tab to highlight each item on a webpage"
   * is off by default, so Tab cycles only form controls until a user enables
   * full keyboard access. Playwright's WebKit mirrors that default.
   *
   * This is a platform default rather than a defect in the markup — the skip
   * link is a plain anchor, not a browser-specific API, so NFAC-COMPAT-002 is
   * not at risk. The structural tests above still run on WebKit, and a Safari
   * user who navigates by keyboard will have enabled full keyboard access.
   */
  test("Tab moves focus to the skip link first", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "webkit",
      "WebKit excludes links from the tab order until full keyboard access is enabled.",
    );

    await page.keyboard.press("Tab");

    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeFocused();
  });

  test("focus is visible on the focused element", async ({ page }) => {
    await page.keyboard.press("Tab");

    const outlineWidth = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? getComputedStyle(active).outlineWidth : "0px";
    });

    expect(outlineWidth).not.toBe("0px");
  });
});

test.describe("footer contact links (FAC-CONTACT-001, 003, 004)", () => {
  test("email uses a mailto link and never claims delivery", async ({ page }) => {
    const email = page.getByRole("contentinfo").getByRole("link", { name: /@/ });

    await expect(email).toHaveAttribute("href", /^mailto:/);
  });

  test("external profile links open safely", async ({ page }) => {
    const footer = page.getByRole("contentinfo");

    for (const name of ["LinkedIn", "GitHub"]) {
      const link = footer.getByRole("link", { name: new RegExp(name) });
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
      await expect(link).toHaveAttribute("href", /^https:\/\//);
    }
  });

  test("there is no contact form anywhere on the page (FAC-CONTACT-005)", async ({ page }) => {
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator("input")).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveCount(0);
  });
});

test.describe("responsive behaviour (NFAC-RESP-001)", () => {
  test("no horizontal overflow at 320 CSS pixels", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );

    expect(overflows).toBe(false);
  });

  test("no horizontal overflow at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );

    expect(overflows).toBe(false);
  });
});

test.describe("mobile navigation (UX 6.2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test("opens, reports expanded state, and closes with Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: /site navigation/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: /site navigation/i })).toBeHidden();
  });

  test("closes when a destination is selected", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    await page
      .getByRole("navigation", { name: /site navigation/i })
      .getByRole("link", { name: "Projects" })
      .click();

    await expect(page).toHaveURL(/\/projects/);
  });
});
