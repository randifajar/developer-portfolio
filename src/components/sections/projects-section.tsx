import { Section } from "@/components/layout/section";
import { ProjectModule } from "@/components/project/project-module";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProjects, getTechnologyNames } from "@/domain/content/selectors";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * Selected Work (UX2 9.2).
 *
 * Editorial modules rather than a card grid. The homepage is a feature, not a
 * catalogue: PRD 20 asks for fewer cards and warns against presenting every
 * project identically, so the composition alternates and each project gets the
 * full width rather than a slot.
 *
 * Nothing is padded. FAC-HOME-004 is explicit that two ready projects show as
 * two — never an empty third, never a fake "Coming Soon". That was previously
 * handled by adapting the grid column count; with full-width modules there is
 * no grid to leave a hole in, which is a stronger form of the same guarantee.
 */
export function ProjectsSection() {
  const projects = getFeaturedProjects();

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section surface="light" id={SECTION_IDS.projects}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Selected work"
            heading="Projects"
            description="Case studies covering the problem, my responsibility, the technical approach, and how the result was verified."
          />
          <ButtonLink href={ROUTES.projects} variant="secondary">
            View All Projects
          </ButtonLink>
        </div>

        <ul className="flex flex-col gap-12">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectModule
                project={project}
                technologyNames={getTechnologyNames(project.technologyIds)}
                // Alternating the image side is what stops two modules reading
                // as one repeated template (PRD 20).
                reversed={index % 2 === 1}
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
