import { type APIRequestContext, type Page, expect, test } from "@playwright/test";
import { projects } from "@/content/projects";

test.describe("public routes (NFAC-REL-001)", () => {
  const publicRoutes = ["/", "/backend", "/infrastructure", "/projects"];

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
  const routes = [
    "/",
    "/backend",
    "/infrastructure",
    "/projects",
    "/projects/personal-developer-portfolio",
  ];

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
  const routes = ["/", "/backend", "/infrastructure", "/projects", "/this-route-does-not-exist"];

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

/**
 * V3 P9: the mode routes are discoverable, and every public route previews as
 * itself (V3 plan 3.9). The Projects index and the case studies were added
 * after V3 shipped without their cards.
 */
test.describe("the sitemap and link previews (V3 plan 3.9)", () => {
  const registeredRoutes = projects.map((project) => `/projects/${project.slug}`);

  /** The fixed public routes, then every registered case study that is public. */
  async function previewedRoutes(request: APIRequestContext): Promise<string[]> {
    const routes = ["/", "/backend", "/infrastructure", "/projects"];

    for (const route of registeredRoutes) {
      if ((await request.get(route)).status() === 200) routes.push(route);
    }

    return routes;
  }

  function metaContent(page: Page, selector: string): Promise<string | null> {
    return page.locator(selector).first().getAttribute("content");
  }

  test("the sitemap lists both mode routes", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();

    for (const route of ["/backend", "/infrastructure"]) {
      expect(sitemap, route).toMatch(new RegExp(`<loc>[^<]*${route}</loc>`));
    }
  });

  test("each public route has its own social card, and it is served", async ({ page, request }) => {
    const routes = await previewedRoutes(request);

    // Hiding every case study would otherwise empty half of this loop silently.
    expect(routes.some((route) => route.startsWith("/projects/"))).toBe(true);

    for (const route of routes) {
      await page.goto(route);
      const image = await metaContent(page, 'meta[property="og:image"]');
      expect(image, `${route} declares no og:image`).toBeTruthy();
      const { pathname, search } = new URL(image!);

      // Its own card, not an ancestor's: the home card sits at the root and
      // every other route's under its own path. Mode cards add a hash suffix.
      expect(pathname, route).toMatch(
        new RegExp(`^${route === "/" ? "" : route}/opengraph-image(-\\w+)?$`),
      );
      expect(await metaContent(page, 'meta[name="twitter:image"]'), route).toBe(image);

      const response = await request.get(`${pathname}${search}`);
      expect(response.status(), route).toBe(200);
      expect(response.headers()["content-type"], route).toContain("image/png");

      // The size it is served at, read from the PNG rather than from the
      // og:image:width tag that claims it: the IHDR chunk holds width and height
      // as big-endian integers at bytes 16 and 20.
      const png = await response.body();
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], route).toEqual([1200, 630]);
    }
  });

  /**
   * /projects once set no `twitter` fields, so it previewed on X with the home
   * page's title and description under its own Open Graph ones.
   */
  test("each route's preview on X says what its Open Graph preview says", async ({
    page,
    request,
  }) => {
    for (const route of await previewedRoutes(request)) {
      await page.goto(route);

      expect(await metaContent(page, 'meta[name="twitter:title"]'), route).toBe(
        await metaContent(page, 'meta[property="og:title"]'),
      );
      expect(await metaContent(page, 'meta[name="twitter:description"]'), route).toBe(
        await metaContent(page, 'meta[property="og:description"]'),
      );
    }
  });

  /**
   * The card route keeps the page's privacy guarantee (DEC-047, FAC-NAV-006): a
   * hidden case study's card is byte-identical to an unknown slug's. The card
   * path comes from a public case study's og:image, so the check runs against
   * the route actually served and cannot pass on a 404 for a path that was
   * never a card.
   */
  test("a hidden case study's card cannot be told apart from an unknown slug's", async ({
    page,
    request,
  }) => {
    const publicRoute = (await previewedRoutes(request)).find((route) =>
      route.startsWith("/projects/"),
    );
    expect(publicRoute, "no public case study to take the card path from").toBeDefined();

    await page.goto(publicRoute!);
    const image = await metaContent(page, 'meta[property="og:image"]');
    const cardOf = (route: string) => new URL(image!).pathname.replace(publicRoute!, route);

    expect((await request.get(cardOf(publicRoute!))).status()).toBe(200);

    const unknown = await request.get(cardOf("/projects/definitely-not-a-real-project"));
    expect(unknown.status()).toBe(404);
    const unknownBody = await unknown.text();

    for (const route of registeredRoutes) {
      if ((await request.get(route)).status() === 200) continue;

      const response = await request.get(cardOf(route));
      expect(response.status(), route).toBe(404);
      expect(await response.text(), route).toBe(unknownBody);
    }
  });
});
