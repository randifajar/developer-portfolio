import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Ordering tie-breakers, and the guard on technology lookup.
 *
 * These branches were unreached. Real content has one Published project and no
 * Published experience, so no comparison ever got past the first tie-break —
 * the fallbacks that make ordering deterministic had never run.
 *
 * Determinism is not cosmetic here. Project order drives static route
 * generation and sitemap order, so an unstable comparator would produce a
 * build whose output depends on registration order rather than on the approved
 * rules (FAC-PROJECTS-003).
 */

afterEach(() => {
  vi.resetModules();
});

const baseProject = {
  publicationStatus: "published",
  confidentialityClass: "public",
  featured: false,
  summary: "Summary.",
  technologyIds: [],
};

async function loadWithProjects(projects: readonly unknown[]) {
  vi.resetModules();
  vi.doMock("@/content/projects", () => ({ projects }));

  return import("@/domain/content/selectors");
}

describe("project ordering falls through to a stable tie-break", () => {
  it("orders by featured priority first, unfeatured last", async () => {
    const { getPublishedProjects } = await loadWithProjects([
      { ...baseProject, id: "c", slug: "c", title: "C", updatedAt: "2026-01-01" },
      {
        ...baseProject,
        id: "a",
        slug: "a",
        title: "A",
        updatedAt: "2026-01-01",
        featured: true,
        featuredPriority: 1,
      },
      {
        ...baseProject,
        id: "b",
        slug: "b",
        title: "B",
        updatedAt: "2026-01-01",
        featured: true,
        featuredPriority: 2,
      },
    ]);

    expect(getPublishedProjects().map((project) => project.slug)).toEqual(["a", "b", "c"]);
  });

  it("falls back to recency when priority ties", async () => {
    const { getPublishedProjects } = await loadWithProjects([
      { ...baseProject, id: "old", slug: "old", title: "A", updatedAt: "2025-01-01" },
      { ...baseProject, id: "new", slug: "new", title: "Z", updatedAt: "2026-06-01" },
    ]);

    // Most recently updated first, and deliberately against alphabetical order
    // so a comparator that skipped to the title would fail here.
    expect(getPublishedProjects().map((project) => project.slug)).toEqual(["new", "old"]);
  });

  it("falls back to title when priority and recency both tie", async () => {
    const { getPublishedProjects } = await loadWithProjects([
      { ...baseProject, id: "z", slug: "zebra", title: "Zebra", updatedAt: "2026-01-01" },
      { ...baseProject, id: "a", slug: "alpha", title: "Alpha", updatedAt: "2026-01-01" },
    ]);

    expect(getPublishedProjects().map((project) => project.slug)).toEqual(["alpha", "zebra"]);
  });

  it("treats a featured project with no priority as unfeatured for ordering", async () => {
    const { getPublishedProjects } = await loadWithProjects([
      {
        ...baseProject,
        id: "n",
        slug: "no-priority",
        title: "A",
        updatedAt: "2026-01-01",
        featured: true,
      },
      {
        ...baseProject,
        id: "p",
        slug: "with-priority",
        title: "Z",
        updatedAt: "2026-01-01",
        featured: true,
        featuredPriority: 3,
      },
    ]);

    expect(getPublishedProjects().map((project) => project.slug)).toEqual([
      "with-priority",
      "no-priority",
    ]);
  });

  it("is stable — the same input always produces the same order", async () => {
    const build = (order: readonly string[]) =>
      order.map((title) => ({
        ...baseProject,
        id: title,
        slug: title.toLowerCase(),
        title,
        updatedAt: "2026-01-01",
      }));

    const forwards = await loadWithProjects(build(["A", "B", "C"]));
    const first = forwards.getPublishedProjects().map((project) => project.slug);

    const backwards = await loadWithProjects(build(["C", "B", "A"]));
    const second = backwards.getPublishedProjects().map((project) => project.slug);

    // Registration order must not leak into the output.
    expect(second).toEqual(first);
  });
});

const baseExperience = {
  publicationStatus: "published",
  confidentialityClass: "sanitized",
  companyName: "Company",
  position: "Role",
  summary: "Summary.",
  responsibilities: ["Did work."],
  isCurrent: false,
  sortOrder: 1,
};

async function loadWithExperience(records: readonly unknown[]) {
  vi.resetModules();
  vi.doMock("@/content/experience", () => ({ experience: records }));

  return import("@/domain/content/selectors");
}

describe("experience ordering", () => {
  it("puts a current role first regardless of dates", async () => {
    const { getPublishedExperience } = await loadWithExperience([
      { ...baseExperience, id: "past", startDate: "2030-01-01", endDate: "2031-01-01" },
      { ...baseExperience, id: "now", startDate: "2020-01-01", isCurrent: true },
    ]);

    expect(getPublishedExperience().map((record) => record.id)).toEqual(["now", "past"]);
  });

  it("orders non-current roles most recent first", async () => {
    const { getPublishedExperience } = await loadWithExperience([
      { ...baseExperience, id: "older", startDate: "2019-01-01", endDate: "2020-01-01" },
      { ...baseExperience, id: "newer", startDate: "2022-01-01", endDate: "2023-01-01" },
    ]);

    expect(getPublishedExperience().map((record) => record.id)).toEqual(["newer", "older"]);
  });

  it("falls back to sortOrder when start dates tie", async () => {
    const { getPublishedExperience } = await loadWithExperience([
      {
        ...baseExperience,
        id: "second",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        sortOrder: 2,
      },
      {
        ...baseExperience,
        id: "first",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        sortOrder: 1,
      },
    ]);

    expect(getPublishedExperience().map((record) => record.id)).toEqual(["first", "second"]);
  });
});

describe("getTechnologyNames", () => {
  async function loadWithSkills(skills: readonly unknown[]) {
    vi.resetModules();
    vi.doMock("@/content/skills", () => ({ skills }));

    return import("@/domain/content/selectors");
  }

  const publishedSkill = {
    id: "skill-a",
    name: "Alpha",
    group: "languages",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 1,
  };

  it("returns nothing for undefined or empty ids", async () => {
    const { getTechnologyNames } = await loadWithSkills([publishedSkill]);

    expect(getTechnologyNames(undefined)).toEqual([]);
    expect(getTechnologyNames([])).toEqual([]);
  });

  it("resolves ids to readable names", async () => {
    const { getTechnologyNames } = await loadWithSkills([publishedSkill]);

    expect(getTechnologyNames(["skill-a"])).toEqual(["Alpha"]);
  });

  /**
   * The confidentiality-relevant case. A tag must never fall back to rendering
   * a raw id, and must never surface a skill that is not published — either
   * would leak content the selector layer exists to withhold.
   */
  it("omits unknown ids rather than rendering them", async () => {
    const { getTechnologyNames } = await loadWithSkills([publishedSkill]);

    expect(getTechnologyNames(["skill-a", "skill-does-not-exist"])).toEqual(["Alpha"]);
  });

  it("omits Draft skills", async () => {
    const { getTechnologyNames } = await loadWithSkills([
      publishedSkill,
      { ...publishedSkill, id: "skill-draft", name: "Hidden", publicationStatus: "draft" },
    ]);

    expect(getTechnologyNames(["skill-a", "skill-draft"])).toEqual(["Alpha"]);
  });
});
