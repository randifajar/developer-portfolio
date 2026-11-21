import { afterEach, describe, expect, it, vi } from "vitest";
import { contentSet } from "@/content/content-set";
import { projectOverviews } from "@/content/project-overviews";
import { projects } from "@/content/projects";
import { projectOverviewSchema } from "@/domain/content/schemas";
import { getPublishedResumeFor } from "@/domain/content/selectors";
import { validateContentSet } from "@/domain/content/validation";

/**
 * Project overviews (DEC-060) and résumé variants (DEC-059).
 *
 * Several guards here are allowlists, not denylists. Three of the résumé's
 * project titles carry internal application names, and a test that searched
 * for those names would have to spell them out, publishing them in a public
 * repository. Holding titles and technologies to an approved list catches them
 * without naming them, and catches anything else unapproved as well.
 */

afterEach(() => {
  vi.resetModules();
});

const [firstOverview] = projectOverviews;

describe("the project overview schema", () => {
  it("has no slug, so an overview cannot become a route", () => {
    expect("slug" in projectOverviewSchema.shape).toBe(false);
  });

  it("rejects an overview tagged with no discipline", () => {
    expect(() => projectOverviewSchema.parse({ ...firstOverview, disciplines: [] })).toThrow();
  });

  it("accepts an overview without technologies", () => {
    const { technologies: _technologies, ...withoutTechnologies } = firstOverview!;

    expect(() => projectOverviewSchema.parse(withoutTechnologies)).not.toThrow();
  });
});

describe("the real overviews", () => {
  /**
   * OPEN-011. Randi, 2026-11-19: "all in here is draft, we can revise it
   * later". Publishing them is a decision for him, so this fails the moment
   * one is Published without the list below being updated on purpose.
   */
  it("stay Draft while their titles are working titles", () => {
    for (const overview of projectOverviews) {
      expect(overview.publicationStatus, overview.id).toBe("draft");
    }
  });

  it("use only the six approved working titles (DEC-060)", () => {
    const approved = new Set([
      "Jenkins CI/CD Migration and Agent Modernization",
      "Notification Hub and AWS Email Events",
      "Configurable Data Tables and Export Workflows",
      "Notification and Document Service Integrations",
      "Evaluation and Certification Platform",
      "AI-Assisted Development Across Three Applications",
    ]);

    expect(projectOverviews.map((overview) => overview.title).sort()).toEqual([...approved].sort());
  });

  /**
   * DEC-064 and the no-invented-claims rule together: a technology appears only
   * where the project's résumé line names it, and only at the detail level
   * Randi chose. Adding one means adding it here, deliberately.
   */
  it("list only approved technologies", () => {
    const approved = new Set(["Jenkins", "AWS EC2", "Docker Buildx", "AWS", "GraphQL", "MongoDB"]);

    for (const overview of projectOverviews) {
      for (const technology of overview.technologies ?? []) {
        expect(approved.has(technology), `${overview.id}: "${technology}"`).toBe(true);
      }
    }
  });

  it("tag every overview with at least one discipline", () => {
    for (const overview of projectOverviews) {
      expect(overview.disciplines.length, overview.id).toBeGreaterThan(0);
    }
  });
});

describe("overview selection", () => {
  it("returns nothing while every overview is Draft", async () => {
    const { getPublishedProjectOverviews } = await import("@/domain/content/selectors");

    expect(getPublishedProjectOverviews()).toEqual([]);
  });

  it("filters Published overviews by discipline, in order", async () => {
    vi.doMock("@/content/project-overviews", () => ({
      projectOverviews: projectOverviews.map((overview) => ({
        ...overview,
        publicationStatus: "published",
      })),
    }));
    const { getPublishedProjectOverviews } = await import("@/domain/content/selectors");

    const infrastructure = getPublishedProjectOverviews("infrastructure");

    expect(infrastructure.map((overview) => overview.sortOrder)).toEqual([1, 2, 5, 6]);
    expect(getPublishedProjectOverviews()).toHaveLength(6);
  });

  it("rejects a Published restricted overview (FAC-PUBLISH-002)", () => {
    const overviews = projectOverviews.map((overview, index) =>
      index === 0
        ? {
            ...overview,
            publicationStatus: "published" as const,
            confidentialityClass: "restricted" as const,
          }
        : overview,
    );
    const rules = validateContentSet({ ...contentSet, projectOverviews: overviews }).map(
      (issue) => issue.rule,
    );

    expect(rules).toContain("no-published-private-or-restricted");
  });
});

describe("case-study disciplines (UX3 7.4)", () => {
  it("tags the jury integration Backend and leaves the portfolio untagged", () => {
    const bySlug = new Map(projects.map((project) => [project.slug, project]));

    expect(bySlug.get("jury-process-management-integration")?.disciplines).toEqual(["backend"]);
    expect(bySlug.get("personal-developer-portfolio")?.disciplines).toBeUndefined();
  });
});

describe("résumé variants (DEC-059)", () => {
  it("offers the backend résumé and no infrastructure résumé (D6)", () => {
    expect(getPublishedResumeFor("backend")?.variant).toBe("backend");
    expect(getPublishedResumeFor("infrastructure")).toBeNull();
  });
});
