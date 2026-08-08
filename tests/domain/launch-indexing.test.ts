import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * What actually happens when the site becomes launch-ready.
 *
 * isPubliclyLaunchReady() is already tested in both directions. Its
 * *consequences* were not: every existing check runs against real content,
 * which is not launch-ready, so only the pre-launch branch of the indexing
 * logic had ever executed. The branch that lets search engines in — the one
 * that matters on launch day and never before it — was unreached code.
 *
 * That is the same shape as the defects the release audit found: a path that
 * exists, looks correct, and has never once been run. These tests run it.
 */

const originalSiteUrl = process.env.SITE_URL;

beforeEach(() => {
  process.env.SITE_URL = "https://example.com";
});

afterEach(() => {
  vi.resetModules();

  if (originalSiteUrl === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = originalSiteUrl;
  }
});

const baseProject = {
  publicationStatus: "published",
  confidentialityClass: "public",
  featured: true,
  updatedAt: "2026-01-01",
  title: "Project",
  summary: "Summary.",
  technologyIds: [],
};

/** Mock content into a launch-ready or not-launch-ready state (DEC-030). */
function mockContent({ launchReady }: { launchReady: boolean }): void {
  vi.resetModules();
  vi.doMock("@/content/profile", () => ({
    profile: {
      id: "profile-a",
      publicationStatus: launchReady ? "published" : "draft",
    },
  }));
  vi.doMock("@/content/projects", () => ({
    projects: Array.from({ length: launchReady ? 2 : 1 }, (_, index) => ({
      ...baseProject,
      id: `p-${index}`,
      slug: `slug-${index}`,
      featuredPriority: index + 1,
    })),
  }));
}

describe("robots.txt reverses itself at launch", () => {
  it("refuses all crawling before launch", async () => {
    mockContent({ launchReady: false });

    const { default: robots } = await import("@/app/robots");

    expect(robots().rules).toMatchObject({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling once launch-ready", async () => {
    mockContent({ launchReady: true });

    const { default: robots } = await import("@/app/robots");

    expect(robots().rules).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("advertises the sitemap only once there is something to crawl", async () => {
    mockContent({ launchReady: false });
    const { default: preLaunch } = await import("@/app/robots");

    expect(preLaunch().sitemap).toBeUndefined();

    mockContent({ launchReady: true });
    const { default: launched } = await import("@/app/robots");

    expect(launched().sitemap).toBe("https://example.com/sitemap.xml");
  });

  /**
   * DEC-047. A disallow entry publishes the existence of the very path it is
   * meant to hide, so unpublished slugs must never appear here — before or
   * after launch. Their routes are never generated; there is nothing to hide.
   */
  it("names no unpublished path in either state", async () => {
    for (const launchReady of [false, true]) {
      mockContent({ launchReady });

      const { default: robots } = await import("@/app/robots");
      const serialized = JSON.stringify(robots());

      expect(serialized, `launchReady=${launchReady}`).not.toMatch(
        /jury|draft|private|restricted/i,
      );
    }
  });
});

describe("page metadata reverses itself at launch", () => {
  it("carries noindex before launch, because robots.txt alone does not prevent indexing", async () => {
    mockContent({ launchReady: false });

    const { buildRootMetadata } = await import("@/domain/metadata/build-metadata");

    expect(buildRootMetadata().robots).toMatchObject({
      index: false,
      follow: false,
      nocache: true,
    });
  });

  /**
   * The branch that had never run. If this were wrong, nothing would reveal it
   * until the day the site was meant to become discoverable.
   */
  it("becomes indexable once launch-ready", async () => {
    mockContent({ launchReady: true });

    const { buildRootMetadata } = await import("@/domain/metadata/build-metadata");

    expect(buildRootMetadata().robots).toMatchObject({ index: true, follow: true });
  });

  it("does not leave nocache set once indexable", async () => {
    mockContent({ launchReady: true });

    const { buildRootMetadata } = await import("@/domain/metadata/build-metadata");
    const robots = buildRootMetadata().robots;

    // nocache tells crawlers not to store a copy. Leaving it on after launch
    // would suppress the cached preview a recruiter may see in results.
    expect(robots).not.toHaveProperty("nocache", true);
  });
});
