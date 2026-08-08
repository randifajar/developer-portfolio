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
  test("renders a card for every publicly reachable project", async ({ page, request }) => {
    const reachable: string[] = [];

    for (const project of projects) {
      if ((await request.get(`/projects/${project.slug}`)).status() === 200) {
        reachable.push(project.title);
      }
    }

    await expect(page.getByRole("article")).toHaveCount(reachable.length);

    for (const title of reachable) {
      await expect(page.getByRole("link", { name: title })).toBeVisible();
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

    const action = page.getByRole("link", { name: /view resume/i }).first();

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

    const action = page.getByRole("link", { name: /view resume/i }).first();
    const rel = (await action.getAttribute("rel")) ?? "";

    expect(await action.getAttribute("target")).toBe("_blank");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });
});
