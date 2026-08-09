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

/**
 * No public page may log a browser error or 404 a subresource.
 *
 * Prompted by the P29 release audit, which found /favicon.ico returning 404 on
 * every route — one missing asset that logged a console error on every page and
 * cost four points of Lighthouse Best Practices.
 *
 * Read the division of labour here carefully, because it is not what it looks
 * like. The console assertions do NOT catch that defect, and this was checked
 * rather than assumed: removing icon.tsx and re-running leaves all three of
 * them green. Headless Chromium under automation never requests /favicon.ico at
 * all, so there is no error for them to observe. A real browser does, which is
 * why Lighthouse saw it and Playwright cannot.
 *
 * The tab icon test below is therefore the actual regression test for the
 * favicon, and it does fail when icon.tsx is removed.
 *
 * The console assertions still earn their place, but for a different class:
 * uncaught exceptions, and subresources the page genuinely requests and gets a
 * 4xx or 5xx for. A 404 is a successful HTTP exchange, so it fires neither
 * requestfailed nor a console error under automation — hence the explicit
 * response listener.
 */
test.describe("public pages log no browser errors", () => {
  const routes = ["/", "/projects", "/projects/personal-developer-portfolio"];

  for (const route of routes) {
    test(`${route} logs nothing to the console`, async ({ page }) => {
      const errors: string[] = [];

      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("requestfailed", (request) => {
        errors.push(`request failed: ${request.url()}`);
      });
      // A 404 is a successful HTTP exchange, so it fires neither requestfailed
      // nor, under automation, a console error. Without this listener a page
      // could quietly 404 on a subresource and still pass.
      page.on("response", (response) => {
        if (response.status() >= 400) {
          errors.push(`HTTP ${response.status()} ${response.url()}`);
        }
      });

      await page.goto(route, { waitUntil: "networkidle" });

      expect(errors, `${route} logged: ${errors.join(" | ")}`).toEqual([]);
    });
  }

  test("the tab icon is declared and served", async ({ page, request }) => {
    await page.goto("/");

    // A declared icon is what stops the browser requesting /favicon.ico, so
    // asserting the link element is asserting the actual fix.
    const href = await page.locator('link[rel="icon"]').first().getAttribute("href");

    expect(href).toBeTruthy();

    const response = await request.get(href ?? "");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/");
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

/**
 * Indexing posture after launch.
 *
 * These asserted the opposite for the whole of development: robots.txt
 * disallowed everything and every page carried noindex, because a half-built
 * portfolio being indexed and cached is worse for the product goal than not
 * being found at all.
 *
 * The switch is derived from content — a Published profile and at least two
 * Published projects (DEC-030) — so it flipped on its own when the second case
 * study was published. Nobody had to remember to enable indexing, and nobody
 * could enable it early by hand. These now assert the other side of that
 * switch, end to end against a production build.
 */
test.describe("post-launch indexing posture", () => {
  test("robots.txt allows crawling", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toMatch(/Allow:\s*\/\s*$/m);
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
  });

  test("robots.txt advertises the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i);
  });

  test("pages no longer carry noindex", async ({ page }) => {
    await page.goto("/");

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");

    // Absent is fine — the default is indexable. Present but saying noindex is
    // not, and would silently undo the launch.
    expect(robots ?? "").not.toContain("noindex");
  });

  test("no public page carries noindex", async ({ page }) => {
    for (const route of ["/", "/projects", "/projects/personal-developer-portfolio"]) {
      await page.goto(route);

      const robots = await page.locator('meta[name="robots"]').getAttribute("content");

      // robots.txt asks a crawler not to fetch; the meta directive is what
      // keeps a page out of the index. One route still carrying it would drop
      // that page from results while the rest of the site was discoverable.
      expect(robots ?? "", route).not.toContain("noindex");
    }
  });

  test("a canonical url is declared for the homepage (NFAC-SEO-003)", async ({ page }) => {
    await page.goto("/");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");

    expect(canonical).toMatch(/^https?:\/\//);
  });
});
