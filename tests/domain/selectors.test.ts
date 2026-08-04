import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Selectors read the real content modules, which are entirely Draft today. To
 * exercise filtering and ordering properly the modules are mocked, so these
 * tests describe selector behaviour rather than the current content.
 *
 * A separate block at the end asserts against the real, unmocked content to
 * confirm nothing is publicly eligible yet.
 */

const baseProject = {
  id: "project-a",
  slug: "project-a",
  title: "Alpha",
  summary: "Summary.",
  projectType: "personal",
  role: "Developer",
  deliveryStatus: "completed",
  context: "Context.",
  problem: "Problem.",
  personalResponsibilities: ["Did the work."],
  technicalApproach: "Approach.",
  challenges: [{ title: "C", description: "D" }],
  decisionsAndTradeoffs: [{ decision: "X", rationale: "Y" }],
  implementationSummary: "Impl.",
  testingAndVerification: "Verify.",
  outcome: "Outcome.",
  lessonsLearned: "Lessons.",
  technologyIds: ["skill-a"],
  confidentialityClass: "public",
  featured: true,
  featuredPriority: 1,
  publicationStatus: "published",
  updatedAt: "2026-01-01",
} as const;

function makeProject(overrides: Record<string, unknown>) {
  return { ...baseProject, ...overrides };
}

/** Every publication/confidentiality combination that must be excluded. */
const ineligible = [
  makeProject({ id: "p-draft", slug: "draft-project", publicationStatus: "draft" }),
  makeProject({ id: "p-archived", slug: "archived-project", publicationStatus: "archived" }),
  makeProject({ id: "p-private", slug: "private-project", confidentialityClass: "private" }),
  makeProject({
    id: "p-restricted",
    slug: "restricted-project",
    confidentialityClass: "restricted",
  }),
];

vi.mock("@/content/projects", () => ({
  projects: [
    makeProject({ id: "p-second", slug: "second", title: "Bravo", featuredPriority: 2 }),
    makeProject({ id: "p-first", slug: "first", title: "Alpha", featuredPriority: 1 }),
    makeProject({
      id: "p-unfeatured",
      slug: "unfeatured",
      title: "Charlie",
      featured: false,
      featuredPriority: undefined,
    }),
    ...ineligible,
  ],
}));

vi.mock("@/content/profile", () => ({
  profile: { id: "profile-a", publicationStatus: "published" },
}));

vi.mock("@/content/experience", () => ({
  experience: [
    {
      id: "e-old",
      startDate: "2020-01-01",
      isCurrent: false,
      sortOrder: 2,
      confidentialityClass: "sanitized",
      publicationStatus: "published",
    },
    {
      id: "e-current",
      startDate: "2024-01-01",
      isCurrent: true,
      sortOrder: 1,
      confidentialityClass: "sanitized",
      publicationStatus: "published",
    },
    {
      id: "e-draft",
      startDate: "2022-01-01",
      isCurrent: false,
      sortOrder: 3,
      confidentialityClass: "sanitized",
      publicationStatus: "draft",
    },
  ],
}));

vi.mock("@/content/skills", () => ({
  skills: [
    { id: "s-ts", group: "languages", sortOrder: 2, publicationStatus: "published" },
    { id: "s-go", group: "languages", sortOrder: 1, publicationStatus: "published" },
    { id: "s-draft", group: "backend", sortOrder: 1, publicationStatus: "draft" },
  ],
}));

vi.mock("@/content/ai-practices", () => ({
  aiPractices: [
    {
      id: "ai-2",
      sortOrder: 2,
      confidentialityClass: "public",
      publicationStatus: "published",
    },
    {
      id: "ai-1",
      sortOrder: 1,
      confidentialityClass: "public",
      publicationStatus: "published",
    },
    {
      id: "ai-draft",
      sortOrder: 3,
      confidentialityClass: "public",
      publicationStatus: "draft",
    },
  ],
}));

vi.mock("@/content/resume", () => ({
  resume: { id: "resume-a", isActive: true, publicationStatus: "published" },
}));

vi.mock("@/content/contact", () => ({
  contactChannels: [
    { id: "c-email", publicationStatus: "published" },
    { id: "c-draft", publicationStatus: "draft" },
  ],
  externalProfiles: [
    { id: "x-github", platform: "github", publicationStatus: "published" },
    { id: "x-draft", platform: "linkedin", publicationStatus: "draft" },
  ],
}));

vi.mock("@/content/media", () => ({
  mediaAssets: [
    { id: "m-public", confidentialityClass: "public", publicationStatus: "published" },
    { id: "m-restricted", confidentialityClass: "restricted", publicationStatus: "published" },
    { id: "m-draft", confidentialityClass: "public", publicationStatus: "draft" },
  ],
}));

const {
  getActiveResume,
  getAdjacentPublishedProjects,
  getFeaturedProjects,
  getPublishedAIPractices,
  getPublishedContactChannels,
  getPublishedExperience,
  getPublishedExternalProfiles,
  getPublishedMediaAsset,
  getPublishedProfile,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedSkillGroups,
} = await import("@/domain/content/selectors");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("publication and confidentiality filtering", () => {
  it("excludes Draft, Archived, Private, and Restricted projects", () => {
    const slugs = getPublishedProjects().map((project) => project.slug);

    expect(slugs).not.toContain("draft-project");
    expect(slugs).not.toContain("archived-project");
    expect(slugs).not.toContain("private-project");
    expect(slugs).not.toContain("restricted-project");
  });

  it("returns only the eligible projects", () => {
    expect(getPublishedProjects()).toHaveLength(3);
  });

  it("excludes Draft experience records", () => {
    expect(getPublishedExperience().map((role) => role.id)).not.toContain("e-draft");
  });

  it("excludes Draft skills", () => {
    const ids = getPublishedSkillGroups().flatMap((view) => view.skills.map((s) => s.id));

    expect(ids).not.toContain("s-draft");
  });

  it("excludes Draft AI practices", () => {
    expect(getPublishedAIPractices().map((p) => p.id)).not.toContain("ai-draft");
  });

  it("excludes Draft contact channels and external profiles", () => {
    expect(getPublishedContactChannels().map((c) => c.id)).toEqual(["c-email"]);
    expect(getPublishedExternalProfiles().map((x) => x.id)).toEqual(["x-github"]);
  });

  it("never returns a Restricted media asset (FAC-PUBLISH-003)", () => {
    expect(getPublishedMediaAsset("m-restricted")).toBeNull();
    expect(getPublishedMediaAsset("m-draft")).toBeNull();
    expect(getPublishedMediaAsset("m-public")?.id).toBe("m-public");
  });

  it("returns null for an undefined media id", () => {
    expect(getPublishedMediaAsset(undefined)).toBeNull();
  });
});

describe("project ordering (FAC-PROJECTS-003)", () => {
  it("orders by featured priority first", () => {
    expect(getPublishedProjects().map((p) => p.slug)).toEqual(["first", "second", "unfeatured"]);
  });

  it("places unfeatured projects after featured ones", () => {
    const slugs = getPublishedProjects().map((p) => p.slug);

    expect(slugs.indexOf("unfeatured")).toBe(slugs.length - 1);
  });

  it("is stable across calls, since it drives static route generation", () => {
    expect(getPublishedProjects().map((p) => p.slug)).toEqual(
      getPublishedProjects().map((p) => p.slug),
    );
  });
});

describe("featured projects (FAC-HOME-003, FAC-HOME-004)", () => {
  it("returns only featured projects", () => {
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(["first", "second"]);
  });

  it("honours a limit", () => {
    expect(getFeaturedProjects(1).map((p) => p.slug)).toEqual(["first"]);
  });

  it("never pads the result, so no empty or Coming Soon card can appear", () => {
    // Asking for more than exist returns what exists, not placeholders.
    expect(getFeaturedProjects(5)).toHaveLength(2);
  });
});

describe("slug resolution (FAC-NAV-006)", () => {
  it("resolves an eligible project", () => {
    expect(getPublishedProjectBySlug("first")?.slug).toBe("first");
  });

  it("returns null for an unknown slug", () => {
    expect(getPublishedProjectBySlug("no-such-project")).toBeNull();
  });

  it("returns null for a Draft slug", () => {
    expect(getPublishedProjectBySlug("draft-project")).toBeNull();
  });

  it("returns exactly the same result for unknown and Draft slugs", () => {
    // This identity is the whole privacy guarantee: the route calls notFound()
    // either way, so the response cannot reveal that a Draft project exists.
    expect(getPublishedProjectBySlug("draft-project")).toBe(
      getPublishedProjectBySlug("no-such-project"),
    );
  });

  it("returns null for Archived, Private, and Restricted slugs too", () => {
    expect(getPublishedProjectBySlug("archived-project")).toBeNull();
    expect(getPublishedProjectBySlug("private-project")).toBeNull();
    expect(getPublishedProjectBySlug("restricted-project")).toBeNull();
  });
});

describe("adjacent navigation through the selector", () => {
  it("walks only eligible projects", () => {
    const { previous, next } = getAdjacentPublishedProjects("second");

    expect(previous?.slug).toBe("first");
    expect(next?.slug).toBe("unfeatured");
  });

  it("returns nulls at both ends", () => {
    expect(getAdjacentPublishedProjects("first").previous).toBeNull();
    expect(getAdjacentPublishedProjects("unfeatured").next).toBeNull();
  });

  it("returns nulls for an ineligible slug", () => {
    const { previous, next } = getAdjacentPublishedProjects("draft-project");

    expect(previous).toBeNull();
    expect(next).toBeNull();
  });
});

describe("experience ordering (UX 7.6)", () => {
  it("places the current role first, then most recent", () => {
    expect(getPublishedExperience().map((role) => role.id)).toEqual(["e-current", "e-old"]);
  });
});

describe("skill grouping (FAC-HOME-005)", () => {
  it("omits groups with no published skills rather than rendering empty headings", () => {
    const groups = getPublishedSkillGroups().map((view) => view.group);

    expect(groups).toEqual(["languages"]);
    expect(groups).not.toContain("backend");
  });

  it("orders skills within a group by sortOrder", () => {
    expect(getPublishedSkillGroups()[0]?.skills.map((s) => s.id)).toEqual(["s-go", "s-ts"]);
  });
});

describe("AI practices", () => {
  it("orders by workflow sequence", () => {
    expect(getPublishedAIPractices().map((p) => p.id)).toEqual(["ai-1", "ai-2"]);
  });
});

describe("profile and resume", () => {
  it("returns the published profile", () => {
    expect(getPublishedProfile()?.id).toBe("profile-a");
  });

  it("returns the active published resume", () => {
    expect(getActiveResume()?.id).toBe("resume-a");
  });
});
