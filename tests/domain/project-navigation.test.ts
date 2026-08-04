import { describe, expect, it } from "vitest";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { getAdjacentProjects } from "@/domain/projects/project-navigation";

/** Minimal stand-ins; only slug matters to this function. */
function project(slug: string): ProjectCaseStudy {
  return { slug } as ProjectCaseStudy;
}

const ordered = [project("first"), project("middle"), project("last")];

describe("adjacent project navigation (FAC-PROJECT-008)", () => {
  it("offers no previous at the start", () => {
    const { previous, next } = getAdjacentProjects(ordered, "first");

    expect(previous).toBeNull();
    expect(next?.slug).toBe("middle");
  });

  it("offers both neighbours in the middle", () => {
    const { previous, next } = getAdjacentProjects(ordered, "middle");

    expect(previous?.slug).toBe("first");
    expect(next?.slug).toBe("last");
  });

  it("offers no next at the end", () => {
    const { previous, next } = getAdjacentProjects(ordered, "last");

    expect(previous?.slug).toBe("middle");
    expect(next).toBeNull();
  });

  it("does not wrap around, which would imply a circular ordering", () => {
    expect(getAdjacentProjects(ordered, "first").previous).toBeNull();
    expect(getAdjacentProjects(ordered, "last").next).toBeNull();
  });

  it("returns nulls for an unknown slug", () => {
    const { previous, next } = getAdjacentProjects(ordered, "does-not-exist");

    expect(previous).toBeNull();
    expect(next).toBeNull();
  });

  it("returns nulls for a single-project list", () => {
    const { previous, next } = getAdjacentProjects([project("only")], "only");

    expect(previous).toBeNull();
    expect(next).toBeNull();
  });

  it("returns nulls for an empty list", () => {
    const { previous, next } = getAdjacentProjects([], "anything");

    expect(previous).toBeNull();
    expect(next).toBeNull();
  });

  it("never surfaces a project absent from the supplied public list", () => {
    // The caller filters before calling. A project excluded for being Draft is
    // simply not in the array, so it can never appear as a neighbour.
    const publicOnly = [project("first"), project("last")];
    const { next } = getAdjacentProjects(publicOnly, "first");

    expect(next?.slug).toBe("last");
    expect(publicOnly.map((p) => p.slug)).not.toContain("middle");
  });
});
