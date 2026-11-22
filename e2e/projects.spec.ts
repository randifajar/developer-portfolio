import { expect, test } from "@playwright/test";
import { projects } from "@/content/projects";

test.describe("Projects Index (FAC-PROJECTS-001, 004)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("responds with its own title", async ({ page }) => {
    await expect(page).toHaveTitle(/Projects/);
  });

  test("renders the sanitization note so sanitized work reads as deliberate", async ({ page }) => {
    await expect(
      page.getByText(/sanitized names, diagrams, and workflow descriptions/i),
    ).toBeVisible();
  });

  /**
   * Driven by what the server actually serves rather than by a hardcoded count,
   * so publishing the second case study does not require editing these.
   *
   * The empty state these replaced is no longer reachable now that a project is
   * Published. It remains covered by release validation, which is what refuses
   * a launch with too few case studies (FAC-PROJECTS-004).
   */
  /*
   * Rewritten for V3 P7: v2 rendered one card (an article) per project; V3
   * lists rows (UX3 7.4). The guarantee is the same — every reachable case
   * study is listed and linked, and nothing else is a case study.
   */
  test("lists and links every publicly reachable case study", async ({ page, request }) => {
    const reachable: string[] = [];

    for (const project of projects) {
      if ((await request.get(`/projects/${project.slug}`)).status() === 200) {
        reachable.push(project.title);
      }
    }

    const caseStudyLinks = page
      .getByRole("region", { name: "Project list" })
      .getByRole("link", { name: /^Read the case study: / });

    await expect(caseStudyLinks).toHaveCount(reachable.length);

    for (const title of reachable) {
      await expect(page.getByRole("link", { name: `Read the case study: ${title}` })).toBeVisible();
    }
  });

  test("names no hidden project anywhere on the page", async ({ page, request }) => {
    const body = (await page.textContent("body")) ?? "";

    for (const project of projects) {
      if ((await request.get(`/projects/${project.slug}`)).status() === 200) continue;

      expect(body, project.slug).not.toContain(project.title);
    }
  });

  test("invents no placeholder or Coming Soon card (FAC-HOME-004)", async ({ page }) => {
    const body = (await page.textContent("body")) ?? "";

    expect(body).not.toMatch(/coming soon/i);
    expect(body).not.toMatch(/lorem ipsum/i);
  });

  test("no horizontal overflow at 320 CSS pixels", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );

    expect(overflows).toBe(false);
  });
});

test.describe("Resume (FAC-RESUME-002)", () => {
  test("the Resume action resolves to a real PDF", async ({ page, request }) => {
    await page.goto("/");

    // The footer's link, on every page (UX3 7.7). The header's menu offers
    // the same file and is covered in home.spec.ts.
    const action = page.getByRole("contentinfo").getByRole("link", { name: /résumé/i });

    await expect(action).toBeVisible();

    const href = await action.getAttribute("href");
    const response = await request.get(href ?? "");

    // FAC-RESUME-003 and NFAC-REL-002: the site must never advertise a Resume
    // it cannot deliver. Asserting the link exists proves nothing on its own —
    // a 404 behind it would still be a broken promise to a recruiter.
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("opens in a new tab without handing the opener away", async ({ page }) => {
    await page.goto("/");

    // The footer's link, on every page (UX3 7.7). The header's menu offers
    // the same file and is covered in home.spec.ts.
    const action = page.getByRole("contentinfo").getByRole("link", { name: /résumé/i });
    const rel = (await action.getAttribute("rel")) ?? "";

    expect(await action.getAttribute("target")).toBe("_blank");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });
});

/**
 * The filter (UX3 7.4). Its state is the address, so it is checked where only
 * a browser can: across a reload, Back from a case study, the case study's own
 * back link, and with JavaScript off.
 */
test.describe("Projects filter (UX3 7.4, 7.5)", () => {
  const list = (page: import("@playwright/test").Page) =>
    page.getByRole("region", { name: "Project list" });

  test("keeps the chosen discipline across a reload", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /^Backend/ }).click();
    await expect(page).toHaveURL(/\?discipline=backend$/);
    await expect(list(page).getByRole("heading", { level: 3 })).toHaveText([
      "Jury Process Management Integration",
    ]);

    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /^Backend/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(list(page).getByRole("heading", { level: 3 })).toHaveCount(1);
  });

  test("survives a visit to a case study, by Back and by the back link", async ({ page }) => {
    await page.goto("/projects?discipline=backend");
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("link", { name: "Read the case study: Jury Process Management Integration" })
      .click();
    await expect(page).toHaveURL(/\/projects\/jury-process-management-integration$/);

    await page.goBack();
    await expect(page).toHaveURL(/\?discipline=backend$/);
    await expect(list(page).getByRole("heading", { level: 3 })).toHaveCount(1);

    await page.goForward();
    // The case study's own back link, in the page — not the footer's Projects.
    await page.getByRole("main").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\?discipline=backend$/);
  });

  test("the index's way back lands on the selected work, not the top", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    // The page's own "← Overall", not the header's mode switch.
    await page.getByRole("main").getByRole("link", { name: "Overall", exact: true }).click();

    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });
});

test.describe("Projects filter without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows every project, whatever the address says", async ({ page }) => {
    await page.goto("/projects?discipline=infrastructure");

    await expect(
      page.getByRole("region", { name: "Project list" }).getByRole("heading", { level: 3 }),
    ).toHaveCount(2);
  });
});
