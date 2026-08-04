import type { ProjectCaseStudy } from "@/domain/content/schemas";

export interface AdjacentProjects {
  readonly previous: ProjectCaseStudy | null;
  readonly next: ProjectCaseStudy | null;
}

/**
 * Previous and next neighbours within an already-filtered, already-ordered
 * list of publicly eligible projects.
 *
 * The input must already be public — this function does no filtering of its
 * own, so passing raw content would leak unpublished neighbours into the
 * navigation at the bottom of a case study (FAC-PROJECT-008).
 *
 * Returns nulls at the ends rather than wrapping around. Wrapping would imply
 * a circular ordering the design does not have.
 */
export function getAdjacentProjects(
  orderedPublicProjects: readonly ProjectCaseStudy[],
  slug: string,
): AdjacentProjects {
  const index = orderedPublicProjects.findIndex((project) => project.slug === slug);

  // An unknown slug, or a slug that was filtered out for being unpublished,
  // has no neighbours to offer.
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: orderedPublicProjects[index - 1] ?? null,
    next: orderedPublicProjects[index + 1] ?? null,
  };
}
