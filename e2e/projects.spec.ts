import { expect, test } from "@playwright/test";

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
   * No project is Published today, so the truthful empty state is what should
   * appear. This is a valid page state but not a launch-ready product state —
   * release validation is what refuses the launch.
   */
  test("shows the truthful empty state while nothing is Published", async ({ page }) => {
    await expect(page.getByText(/case studies are being prepared/i)).toBeVisible();
  });

  test("offers recovery actions from the empty state", async ({ page }) => {
    await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
  });

  test("shows no Draft project card", async ({ page }) => {
    await expect(page.getByRole("article")).toHaveCount(0);
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

test.describe("Resume (FAC-RESUME-003)", () => {
  test("no Resume action is offered while no Resume is active", async ({ page }) => {
    await page.goto("/");

    // The Resume is Draft, so the site must not advertise an action it cannot
    // fulfil. It must never claim a download succeeded either.
    await expect(page.getByRole("link", { name: /view resume/i })).toHaveCount(0);
  });
});
