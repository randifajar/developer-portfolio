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
    // V3: the header holds only the modes and the Résumé menu (UX3 6.1), so
    // the name is the page heading here and in the footer on every page
    // (FAC-NAV-004), no longer a header link.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Randi Fajar Wicaksono");
    await expect(page.getByRole("contentinfo")).toContainText("Randi Fajar Wicaksono");
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

/**
 * The Résumé menu (UX3 6.3) replaced the v2 mobile menu: the V3 header has no
 * menu button, only the mode switch and this. It is a native popover, so the
 * browser owns opening, Escape, outside click, and returning focus.
 */
test.describe("Résumé menu (UX3 6.3)", () => {
  test("opens, offers the published résumé, and closes with Escape back on its button", async ({
    page,
  }) => {
    const button = page.getByRole("banner").getByRole("button", { name: /résumé/i });
    const menu = page.locator("#resume-menu");

    await expect(menu).toBeHidden();
    await button.click();
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /backend résumé/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
    await expect(menu.getByText("PDF available after approval")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("closes on a click outside it", async ({ page }) => {
    await page
      .getByRole("banner")
      .getByRole("button", { name: /résumé/i })
      .click();
    await expect(page.locator("#resume-menu")).toBeVisible();

    await page.mouse.click(5, 400);
    await expect(page.locator("#resume-menu")).toBeHidden();
  });
});

test.describe("Résumé menu without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still opens and offers the résumé, because the popover is native", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("button", { name: /résumé/i })
      .click();

    await expect(page.locator("#resume-menu")).toBeVisible();
    await expect(
      page.locator("#resume-menu").getByRole("link", { name: /backend résumé/i }),
    ).toBeVisible();
  });
});

test.describe("mode switch (UX3 6.2, V3-NAV-001, 002, 007)", () => {
  test("moves between the three modes by real URL, marking the current one", async ({ page }) => {
    const modes = page.getByRole("navigation", { name: "Modes" });

    await expect(modes.getByRole("link", { name: "Overall" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await modes.getByRole("link", { name: "Backend" }).click();
    await expect(page).toHaveURL(/\/backend$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Behind the");
    await expect(modes.getByRole("link", { name: "Backend" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await modes.getByRole("link", { name: "Infrastructure" }).click();
    await expect(page).toHaveURL(/\/infrastructure$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Beyond");

    await page.goBack();
    await expect(page).toHaveURL(/\/backend$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Behind the");
  });

  test("stays reachable on a phone, never behind a menu (V3-NAV-010)", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });

    for (const name of ["Overall", "Backend", "Infrastructure"]) {
      await expect(
        page.getByRole("navigation", { name: "Modes" }).getByRole("link", { name }),
      ).toBeVisible();
    }
  });
});

/**
 * The Overall page (UX3 7.1). Its structure and content are asserted in the
 * component suite; these are the behaviours only a browser has.
 */
test.describe("Overall page (UX3 7.1)", () => {
  test("the hero action takes the visitor to the profile", async ({ page }) => {
    await page.getByRole("link", { name: /explore the journey/i }).click();

    await expect(page).toHaveURL(/#profile$/);
    await expect(page.getByRole("region", { name: "Profile" })).toBeInViewport();
  });

  test("Résumés in Explore further opens the header's menu, and Escape returns to it", async ({
    page,
  }) => {
    const explore = page.getByRole("region", { name: "Explore further" });
    const resumes = explore.getByRole("button", { name: "Résumés" });
    const menu = page.locator("#resume-menu");

    await resumes.click();
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /backend résumé/i })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(resumes).toBeFocused();
  });

  test("the case study row leads to its case study", async ({ page }) => {
    await page
      .getByRole("link", { name: "Read the case study: Jury Process Management Integration" })
      .click();

    await expect(page).toHaveURL(/\/projects\/jury-process-management-integration$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Jury Process Management Integration",
    );
  });
});
