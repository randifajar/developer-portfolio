import { expect, test } from "@playwright/test";

test.describe("public routes (NFAC-REL-001)", () => {
  const publicRoutes = ["/", "/projects"];

  for (const route of publicRoutes) {
    test(`${route} returns a valid public result`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
    });
  }

  test("sitemap and robots are served", async ({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect((await request.get("/robots.txt")).status()).toBe(200);
  });
});

test.describe("invalid routes (FAC-NAV-005)", () => {
  test("an unknown route shows Not Found with both recovery actions", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /page not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /browse projects/i })).toBeVisible();
  });

  test("Return home navigates to the homepage", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await page.getByRole("link", { name: /return home/i }).click();

    await expect(page).toHaveURL("/");
  });
});

/**
 * The privacy guarantee, verified end to end (DEC-047, FAC-NAV-006).
 *
 * An unknown slug and a Draft slug must be indistinguishable to a visitor.
 * Asserting equal bodies rather than merely equal status codes is what makes
 * this meaningful — two 404s with different copy would still leak.
 */
test.describe("unpublished projects are indistinguishable from unknown ones", () => {
  const unknownSlug = "/projects/definitely-not-a-real-project";
  const draftSlug = "/projects/personal-developer-portfolio";

  test("both return 404", async ({ request }) => {
    expect((await request.get(unknownSlug)).status()).toBe(404);
    expect((await request.get(draftSlug)).status()).toBe(404);
  });

  test("both return identical response bodies", async ({ request }) => {
    const unknownBody = await (await request.get(unknownSlug)).text();
    const draftBody = await (await request.get(draftSlug)).text();

    expect(draftBody).toBe(unknownBody);
  });

  test("the Not Found page never hints that hidden content exists", async ({ page }) => {
    await page.goto(draftSlug);
    const body = (await page.textContent("body")) ?? "";

    for (const phrase of [/not yet published/i, /draft/i, /private/i, /restricted/i]) {
      expect(body).not.toMatch(phrase);
    }
  });

  test("no unpublished slug appears in the sitemap (NFAC-SEO-002)", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();

    expect(sitemap).not.toContain("personal-developer-portfolio");
    expect(sitemap).not.toContain("jury-process-management-integration");
  });
});

test.describe("security headers (NFAC-SEC-005)", () => {
  test("are present on a page response", async ({ request }) => {
    const headers = (await request.get("/")).headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });
});

/**
 * Heading structure and indexing posture.
 *
 * Both regressions this guards against reached production: two routes shipped
 * with no h1, and the site was crawlable while it was an empty shell.
 */
test.describe("every public page has exactly one h1 (NFAC-A11Y-003)", () => {
  const routes = ["/", "/projects", "/this-route-does-not-exist"];

  for (const route of routes) {
    test(`${route} has exactly one h1`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
});

test.describe("pre-launch indexing posture", () => {
  test("robots.txt disallows crawling while content is Draft", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toMatch(/Disallow:\s*\/\s*$/m);
  });

  test("pages carry noindex, because robots.txt alone does not prevent indexing", async ({
    page,
  }) => {
    await page.goto("/");

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");

    expect(robots).toContain("noindex");
  });
});
