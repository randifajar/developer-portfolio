import { expect, test } from "@playwright/test";
import { projects } from "@/content/projects";

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
 * Every registered project is either publicly reachable or byte-identical to a
 * slug that was never registered at all. The absence of any third state is the
 * guarantee — two 404s with different copy would still leak.
 *
 * This block used to hardcode personal-developer-portfolio as "the Draft slug".
 * Publishing that project pointed the whole block at a public page. It failed
 * loudly rather than passing silently, but a single content change should not
 * be able to retire the guarantee, so the slugs now come from the registry.
 *
 * The raw registry is deliberately the source rather than a selector. Asking
 * the selector which projects are hidden and then asserting those are hidden
 * would be circular: a selector that wrongly exposed a private project would
 * also report it as public, and this test would still pass. The registry states
 * what exists; the running server is checked independently.
 */
test.describe("registered projects are either public or indistinguishable from unknown", () => {
  const unknownRoute = "/projects/definitely-not-a-real-project";
  const registeredRoutes = projects.map((project) => `/projects/${project.slug}`);

  test("an unregistered slug returns 404", async ({ request }) => {
    expect((await request.get(unknownRoute)).status()).toBe(404);
  });

  test("a hidden project returns a body identical to an unregistered one", async ({ request }) => {
    const unknownBody = await (await request.get(unknownRoute)).text();

    for (const route of registeredRoutes) {
      const response = await request.get(route);

      // 200 means Published and publicly eligible, which is a valid state.
      // Anything else must be indistinguishable from a slug that never existed.
      if (response.status() === 200) continue;

      expect(response.status(), route).toBe(404);
      expect(await response.text(), route).toBe(unknownBody);
    }
  });

  test("the Not Found page never hints that hidden content exists", async ({ page, request }) => {
    for (const route of registeredRoutes) {
      if ((await request.get(route)).status() === 200) continue;

      await page.goto(route);
      const body = (await page.textContent("body")) ?? "";

      for (const phrase of [/not yet published/i, /draft/i, /private/i, /restricted/i]) {
        expect(body, route).not.toMatch(phrase);
      }
    }
  });

  test("the sitemap lists exactly the reachable projects (NFAC-SEO-002)", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();

    for (const route of registeredRoutes) {
      const isReachable = (await request.get(route)).status() === 200;

      expect(sitemap.includes(route), route).toBe(isReachable);
    }
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
