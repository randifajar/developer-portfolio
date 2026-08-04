import { describe, expect, it, vi } from "vitest";

/**
 * Launch readiness drives whether search engines are allowed in. Getting it
 * wrong in either direction is costly: too permissive and an incomplete
 * portfolio is indexed and cached against the product goal; too strict and a
 * finished portfolio stays invisible.
 */

const publishedProject = {
  id: "p-1",
  slug: "one",
  publicationStatus: "published",
  confidentialityClass: "public",
  featured: true,
  featuredPriority: 1,
  updatedAt: "2026-01-01",
  title: "One",
};

function projectSet(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    ...publishedProject,
    id: `p-${index}`,
    slug: `slug-${index}`,
    featuredPriority: index + 1,
  }));
}

describe("isPubliclyLaunchReady", () => {
  it("is false while the profile is Draft, even with enough projects", async () => {
    vi.resetModules();
    vi.doMock("@/content/profile", () => ({
      profile: { id: "profile-a", publicationStatus: "draft" },
    }));
    vi.doMock("@/content/projects", () => ({ projects: projectSet(2) }));

    const { isPubliclyLaunchReady } = await import("@/domain/content/selectors");

    expect(isPubliclyLaunchReady()).toBe(false);
  });

  it("is false with a published profile but fewer than two projects (DEC-030)", async () => {
    vi.resetModules();
    vi.doMock("@/content/profile", () => ({
      profile: { id: "profile-a", publicationStatus: "published" },
    }));
    vi.doMock("@/content/projects", () => ({ projects: projectSet(1) }));

    const { isPubliclyLaunchReady } = await import("@/domain/content/selectors");

    expect(isPubliclyLaunchReady()).toBe(false);
  });

  it("is true with a published profile and two published projects", async () => {
    vi.resetModules();
    vi.doMock("@/content/profile", () => ({
      profile: { id: "profile-a", publicationStatus: "published" },
    }));
    vi.doMock("@/content/projects", () => ({ projects: projectSet(2) }));

    const { isPubliclyLaunchReady } = await import("@/domain/content/selectors");

    expect(isPubliclyLaunchReady()).toBe(true);
  });

  it("is false for the real content set today", async () => {
    // doMock registrations survive resetModules, so the mocks from the tests
    // above must be explicitly removed or this reads mocked content and
    // silently passes for the wrong reason.
    vi.doUnmock("@/content/profile");
    vi.doUnmock("@/content/projects");
    vi.resetModules();

    const { isPubliclyLaunchReady } = await import("@/domain/content/selectors");

    // Everything is Draft, so the site must not be indexable. This flips on its
    // own at P30 — deliberately, so nobody has to remember to enable indexing.
    expect(isPubliclyLaunchReady()).toBe(false);
  });
});
