import { Section } from "@/components/layout/section";
import { ProjectRows } from "@/components/shared/project-rows";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import { getFeaturedProjects, getPublishedProjectOverviews } from "@/domain/content/selectors";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * Selected work — backend and infrastructure, side by side (UX3 7.1).
 *
 * Featured case studies come first, then the first three published project
 * overviews in their own order: the approved mockup's four rows. Two rules
 * from the mockup decide what appears:
 *
 * - A case study needs a discipline. The personal portfolio has none, so it is
 *   listed on the projects page and not here (UX3 7.4).
 * - Only a case study links. An overview has no page of its own, so it is
 *   never a link (DEC-060).
 *
 * With five overviews Published since 2026-11-26 (OPEN-011), the rows are the
 * case study and the first three overviews. Fewer published items would mean
 * fewer rows, never invented ones (FAC-HOME-004).
 *
 * The rows are the same component the Backend and Infrastructure pages use.
 */
const HEADING_ID = "work-heading";
const OVERVIEW_LIMIT = 3;

export function SelectedWorkSection() {
  const caseStudies = getFeaturedProjects().filter(
    (project) => (project.disciplines?.length ?? 0) > 0,
  );
  const overviews = getPublishedProjectOverviews().slice(0, OVERVIEW_LIMIT);

  if (caseStudies.length + overviews.length === 0) {
    return null;
  }

  return (
    <Section surface="light" id={SECTION_IDS.work} labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <Eyebrow>Selected work</Eyebrow>
            <SectionTitle
              id={HEADING_ID}
              lead="Backend and infrastructure, "
              accent="side by side."
            />
          </div>
          <ArrowLink href={ROUTES.projects}>All projects</ArrowLink>
        </div>

        <ProjectRows caseStudies={caseStudies} overviews={overviews} />
      </div>
    </Section>
  );
}
