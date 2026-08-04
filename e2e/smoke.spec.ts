import { expect, test } from "@playwright/test";

/**
 * Proves the Playwright harness works against a real production build on every
 * configured engine. Replaced by the real specs in P25.
 */
test("homepage responds", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
});

test("security headers are served", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});
